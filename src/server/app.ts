import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { getValue, setValue, delValue, getByPrefix } from './store.js';
import {
  validate,
  hasRequiredConsent,
  buildRecord,
  redactPath,
  isValidStatus,
  type EnquiryPayload,
} from './enquiry-core.js';
import {
  RETENTION_MONTHS,
  keysToErase,
  planRetention,
  verifyErased,
  type StoredEnquiry,
} from './retention-core.js';

/**
 * Enquiries carry data concerning health, so this service is written
 * defensively: the client is never trusted, consent is enforced server side,
 * and nothing identifying is written to logs.
 *
 * Ported from a Supabase edge function to a Vercel Function. The validation,
 * consent and retention logic came across unchanged — only the storage layer
 * and the handler signature moved.
 */
export const app = new Hono();
const BASE = '/api';

// ---------------------------------------------------------------- logging
/**
 * The default logger prints the full path. Enquiry paths contain a reference,
 * which is a handle to someone's health enquiry, so paths are redacted before
 * they reach stdout. Never log request bodies here.
 */
app.use('*', logger((message: string, ...rest: unknown[]) => console.log(redactPath(message), ...rest)));

// ------------------------------------------------------------------- CORS
/**
 * There is deliberately no CORS middleware.
 *
 * The site and this API are now the same origin, so the browser's default
 * same-origin policy is the whole answer: a cross-origin request carrying JSON
 * triggers a preflight, finds no permissive headers, and never reaches a route.
 * That is stricter than the allow-list this replaced, and it removes an
 * environment variable that, if misconfigured, silently broke every enquiry in
 * production while working in development.
 *
 * If a browser client is ever served from another origin, add an explicit
 * allow-list here. Never a wildcard: that would let any site post health data
 * from a visitor's browser.
 */

// ----------------------------------------------------------- error handling
/**
 * Any unhandled throw becomes a JSON 500 carrying nothing about what failed.
 *
 * Two reasons. The client parses every response as JSON, and Hono's default
 * plain-text body would surface as a parse error rather than a usable message.
 * And an error from the storage layer can quote a pathname, which contains an
 * enquiry reference — so the message is logged, never returned.
 *
 * Note what this does *not* do: it does not let a request continue. A storage
 * outage means the rate limiter throws before consent is ever checked, so the
 * enquiry is refused rather than accepted and stored unvalidated. Failing
 * closed is the right direction for health data.
 */
app.onError((err, c) => {
  console.error('unhandled error:', redactPath(err.message));
  return c.json({ error: 'Something went wrong. Your enquiry was not sent.' }, 500);
});

// ----------------------------------------------------------- rate limiting
const RATE_LIMIT = 10;
const WINDOW_MS = 10 * 60 * 1000;

/**
 * Approximate by design. Two requests arriving together can read the same count
 * and both write back the same increment, so the ceiling is a little soft. It
 * is here to blunt scripted abuse, not to be an exact quota, and the endpoints
 * it guards are form submissions rather than page loads — the site itself is
 * static and never reaches a Function.
 */
async function overRateLimit(ip: string): Promise<boolean> {
  const window = Math.floor(Date.now() / WINDOW_MS);
  const key = `rl:${ip}:${window}`;
  const count = (await getValue<number>(key)) ?? 0;
  if (count >= RATE_LIMIT) return true;
  await setValue(key, count + 1);
  return false;
}

function clientIp(header: string | undefined): string {
  return header?.split(',')[0]?.trim() ?? 'unknown';
}

// ------------------------------------------------------------------ routes
app.get(`${BASE}/health`, (c) => c.json({ status: 'ok' }));

app.post(`${BASE}/enquiries`, async (c) => {
  const ip = clientIp(c.req.header('x-forwarded-for'));
  if (await overRateLimit(ip)) {
    return c.json({ error: 'Too many enquiries. Please try again later.' }, 429);
  }

  const idempotencyKey = c.req.header('Idempotency-Key');
  if (!idempotencyKey) {
    return c.json({ error: 'Idempotency-Key header is required' }, 400);
  }

  /**
   * A retry after a dropped response must not open a second enquiry with the
   * clinic, so the original reference is replayed instead.
   */
  const existing = await getValue<string>(`idem:${idempotencyKey}`);
  if (existing) {
    return c.json({ ok: true, reference: existing, replayed: true });
  }

  let body: EnquiryPayload;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }

  /**
   * Consent is the lawful basis for processing this, so it is checked on the
   * server. A client that submits without both consents is rejected outright
   * rather than having the enquiry stored and filtered later.
   */
  if (!hasRequiredConsent(body)) {
    return c.json({ error: 'Both required consents must be given' }, 422);
  }

  const errors = validate(body);
  if (errors.length) {
    // Field names only — never echo the submitted values back into a response.
    return c.json({ error: 'Validation failed', fields: errors }, 422);
  }

  const reference = body.attribution?.reference ?? `JF-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const now = new Date().toISOString();

  /**
   * Stored deliberately narrowly: contact details the clinic needs, the
   * enquiry context, and consent with its timestamp as the record that
   * permission was given. Nothing clinical is accepted or kept.
   */
  const record = buildRecord(body, reference, idempotencyKey, now);

  await setValue(`enquiry:${reference}`, record);
  await setValue(`idem:${idempotencyKey}`, reference);
  // Append-only audit trail — the evidence behind any referral fee claim.
  await setValue(`audit:${reference}`, [{ status: 'submitted', at: now, by: 'patient' }]);

  return c.json({ ok: true, reference }, 201);
});

/**
 * Status lookup requires the reference and the email it was submitted with.
 * A reference alone would let anyone holding a guessed code read someone's
 * fertility enquiry.
 */
app.post(`${BASE}/enquiries/status`, async (c) => {
  const ip = clientIp(c.req.header('x-forwarded-for'));
  if (await overRateLimit(ip)) return c.json({ error: 'Too many requests' }, 429);

  let body: { reference?: string; email?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }

  const record = await getValue<{
    status: string;
    updatedAt: string;
    contact: { email: string };
    attribution: { clinicName: string | null };
  }>(`enquiry:${body.reference ?? ''}`);

  // Same response whether the reference is unknown or the email does not match,
  // so this cannot be used to discover which references exist.
  if (!record || record.contact.email !== body.email?.trim().toLowerCase()) {
    return c.json({ error: 'No enquiry found for that reference and email' }, 404);
  }

  return c.json({
    reference: body.reference,
    status: record.status,
    updatedAt: record.updatedAt,
    clinicName: record.attribution.clinicName,
  });
});

// ------------------------------------------------------------------- admin
/**
 * Operator endpoints.
 *
 * There is no clinic integration in the MVP: an operator reads enquiries here
 * and forwards them to the clinic by hand. That removes per-clinic credentials,
 * onboarding and a delivery contract from the critical path, and it is honest
 * about how the enquiry actually travels.
 */
function isAdmin(c: { req: { header: (name: string) => string | undefined } }): boolean {
  const key = process.env.ADMIN_KEY;
  return Boolean(key) && c.req.header('Authorization')?.replace(/^Bearer\s+/i, '') === key;
}

app.get(`${BASE}/admin/enquiries`, async (c) => {
  if (!isAdmin(c)) return c.json({ error: 'Unauthorized' }, 401);

  const status = c.req.query('status');
  const records = await getByPrefix<StoredEnquiry>('enquiry:');

  const enquiries = records
    .filter((r) => (status ? r.status === status : r.status !== 'closed'))
    // Oldest first: the longest-waiting enquiry is the one to forward next.
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return c.json({ enquiries, count: enquiries.length });
});

app.post(`${BASE}/admin/enquiries/:reference/status`, async (c) => {
  if (!isAdmin(c)) return c.json({ error: 'Unauthorized' }, 401);

  const reference = c.req.param('reference');
  const record = await getValue<StoredEnquiry>(`enquiry:${reference}`);
  if (!record) return c.json({ error: 'Not found' }, 404);

  const { status } = ((await c.req.json().catch(() => ({}))) ?? {}) as { status?: string };
  if (!isValidStatus(status)) return c.json({ error: 'Unknown status' }, 400);

  const now = new Date().toISOString();
  const audit = (await getValue<unknown[]>(`audit:${reference}`)) ?? [];
  await setValue(`enquiry:${reference}`, { ...record, status, updatedAt: now });
  await setValue(`audit:${reference}`, [...audit, { status, at: now, by: 'operator' }]);

  return c.json({ ok: true, reference, status });
});

// ------------------------------------------------------ retention & erasure
/**
 * Erase one enquiry. Returns false if anything survived, so a caller never
 * reports success on a partial deletion.
 */
async function eraseEnquiry(record: StoredEnquiry): Promise<boolean> {
  for (const key of keysToErase(record)) {
    await delValue(key);
  }

  // Trust the read, not the delete call. The read bypasses the blob cache;
  // see the note in store.ts, without which this check would be theatre.
  return verifyErased(await getValue(`enquiry:${record.reference}`));
}

/**
 * The patient's right to erasure, and the "you can ask us to delete it sooner"
 * promise on the consent screen. Requires the reference and the email it was
 * submitted with, and answers identically when either is wrong.
 */
app.post(`${BASE}/enquiries/:reference/erase`, async (c) => {
  const ip = clientIp(c.req.header('x-forwarded-for'));
  if (await overRateLimit(ip)) return c.json({ error: 'Too many requests' }, 429);

  const reference = c.req.param('reference');
  const body = ((await c.req.json().catch(() => ({}))) ?? {}) as { email?: string };
  const record = await getValue<StoredEnquiry>(`enquiry:${reference}`);

  if (!record || record.contact?.email !== body.email?.trim().toLowerCase()) {
    return c.json({ error: 'No enquiry found for that reference and email' }, 404);
  }

  const now = new Date();
  const audit = (await getValue<unknown[]>(`audit:${reference}`)) ?? [];
  await setValue(`audit:${reference}`, [
    ...audit,
    { status: 'withdrawn', at: now.toISOString(), by: 'patient' },
  ]);

  const erased = await eraseEnquiry(record);
  if (!erased) return c.json({ error: 'Erasure incomplete, please contact us' }, 500);

  return c.json({ ok: true, erased: true });
});

/**
 * Scheduled sweep, run daily by the cron in vercel.json.
 *
 * Enquiries past the retention window are erased. A record whose createdAt is
 * unreadable is left alone and reported rather than deleted — losing data to a
 * parsing bug is not recoverable.
 *
 * Vercel signs cron invocations with CRON_SECRET, which is accepted here in
 * addition to an operator key so the sweep can also be triggered by hand.
 */
app.post(`${BASE}/admin/retention/run`, async (c) => {
  const cronSecret = process.env.CRON_SECRET;
  const authorized =
    isAdmin(c) ||
    (Boolean(cronSecret) && c.req.header('Authorization') === `Bearer ${cronSecret}`);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  const now = new Date();
  const records = await getByPrefix<StoredEnquiry>('enquiry:');
  const { erase, keep } = planRetention(records, now);

  let erased = 0;
  const failed: string[] = [];
  for (const record of erase) {
    if (await eraseEnquiry(record)) erased += 1;
    else failed.push(record.reference);
  }

  // References only — no personal data in the response or the logs.
  return c.json({
    ok: failed.length === 0,
    retentionMonths: RETENTION_MONTHS,
    scanned: records.length,
    erased,
    retained: keep.length,
    failed,
  });
});

/**
 * Vercel invokes cron targets with GET, so the sweep is reachable both ways.
 */
app.get(`${BASE}/admin/retention/run`, (c) => app.fetch(new Request(c.req.url, {
  method: 'POST',
  headers: c.req.raw.headers,
})));
