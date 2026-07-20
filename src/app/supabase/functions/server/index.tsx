import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import {
  validate,
  hasRequiredConsent,
  buildRecord,
  redactPath,
  isValidStatus,
  type EnquiryPayload,
} from "./enquiry-core.ts";
import {
  RETENTION_MONTHS,
  keysToErase,
  planRetention,
  verifyErased,
  type StoredEnquiry,
} from "./retention-core.ts";

const app = new Hono();
const BASE = "/make-server-bb5634ef";

/**
 * Enquiries carry data concerning health, so this service is written defensively:
 * the client is never trusted, consent is enforced server side, and nothing
 * identifying is written to logs.
 */

// ---------------------------------------------------------------- logging
/**
 * The default logger prints the full path. Enquiry paths contain a reference,
 * which is a handle to someone's health enquiry, so paths are redacted before
 * they reach stdout. Never log request bodies here.
 */
app.use(
  "*",
  logger((message: string, ...rest: unknown[]) => console.log(redactPath(message), ...rest)),
);

// ------------------------------------------------------------------- CORS
/**
 * A wildcard origin on an endpoint that accepts health data would let any site
 * post enquiries from a signed-in visitor's browser. Origins are allow-listed
 * instead, from ALLOWED_ORIGINS (comma separated), falling back to local dev.
 */
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  "/*",
  cors({
    origin: (origin) => (ALLOWED_ORIGINS.includes(origin) ? origin : null),
    allowHeaders: ["Content-Type", "Authorization", "Idempotency-Key"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    maxAge: 600,
  }),
);

// ----------------------------------------------------------- rate limiting
const RATE_LIMIT = 10;
const WINDOW_MS = 10 * 60 * 1000;

async function overRateLimit(ip: string): Promise<boolean> {
  const window = Math.floor(Date.now() / WINDOW_MS);
  const key = `rl:${ip}:${window}`;
  const count = ((await kv.get(key)) as number | null) ?? 0;
  if (count >= RATE_LIMIT) return true;
  await kv.set(key, count + 1);
  return false;
}

// --------------------------------------------------------------- validation
// ------------------------------------------------------------------ routes
app.get(`${BASE}/health`, (c) => c.json({ status: "ok" }));

app.post(`${BASE}/enquiries`, async (c) => {
  const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (await overRateLimit(ip)) {
    return c.json({ error: "Too many enquiries. Please try again later." }, 429);
  }

  const idempotencyKey = c.req.header("Idempotency-Key");
  if (!idempotencyKey) {
    return c.json({ error: "Idempotency-Key header is required" }, 400);
  }

  /**
   * A retry after a dropped response must not open a second enquiry with the
   * clinic, so the original reference is replayed instead.
   */
  const existing = (await kv.get(`idem:${idempotencyKey}`)) as string | null;
  if (existing) {
    return c.json({ ok: true, reference: existing, replayed: true });
  }

  let body: EnquiryPayload;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  /**
   * Consent is the lawful basis for processing this, so it is checked on the
   * server. A client that submits without both consents is rejected outright
   * rather than having the enquiry stored and filtered later.
   */
  if (!hasRequiredConsent(body)) {
    return c.json({ error: "Both required consents must be given" }, 422);
  }

  const errors = validate(body);
  if (errors.length) {
    // Field names only — never echo the submitted values back into a response.
    return c.json({ error: "Validation failed", fields: errors }, 422);
  }

  const reference = body.attribution?.reference ?? `JF-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const now = new Date().toISOString();

  /**
   * Stored deliberately narrowly: contact details the clinic needs, the
   * enquiry context, and consent with its timestamp as the record that
   * permission was given. Nothing clinical is accepted or kept.
   */
  const record = buildRecord(body, reference, idempotencyKey, now);

  await kv.set(`enquiry:${reference}`, record);
  await kv.set(`idem:${idempotencyKey}`, reference);
  // Append-only audit trail — the evidence behind any referral fee claim.
  await kv.set(`audit:${reference}`, [{ status: "submitted", at: now, by: "patient" }]);

  return c.json({ ok: true, reference }, 201);
});

/**
 * Status lookup requires the reference and the email it was submitted with.
 * A reference alone would let anyone holding a guessed code read someone's
 * fertility enquiry.
 */
app.post(`${BASE}/enquiries/status`, async (c) => {
  const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (await overRateLimit(ip)) return c.json({ error: "Too many requests" }, 429);

  let body: { reference?: string; email?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const record = (await kv.get(`enquiry:${body.reference ?? ""}`)) as
    | { status: string; updatedAt: string; contact: { email: string }; attribution: { clinicName: string | null } }
    | null;

  // Same response whether the reference is unknown or the email does not match,
  // so this cannot be used to discover which references exist.
  if (!record || record.contact.email !== body.email?.trim().toLowerCase()) {
    return c.json({ error: "No enquiry found for that reference and email" }, 404);
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
  const key = Deno.env.get("ADMIN_KEY");
  return Boolean(key) && c.req.header("Authorization")?.replace(/^Bearer\s+/i, "") === key;
}

app.get(`${BASE}/admin/enquiries`, async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);

  const status = c.req.query("status");
  const records = ((await kv.getByPrefix("enquiry:")) as StoredEnquiry[] | null) ?? [];

  const enquiries = records
    .filter((r) => (status ? r.status === status : r.status !== "closed"))
    // Oldest first: the longest-waiting enquiry is the one to forward next.
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return c.json({ enquiries, count: enquiries.length });
});

app.post(`${BASE}/admin/enquiries/:reference/status`, async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);

  const reference = c.req.param("reference");
  const record = (await kv.get(`enquiry:${reference}`)) as StoredEnquiry | null;
  if (!record) return c.json({ error: "Not found" }, 404);

  const { status } = (await c.req.json().catch(() => ({}))) as { status?: string };
  if (!isValidStatus(status)) return c.json({ error: "Unknown status" }, 400);

  const now = new Date().toISOString();
  const audit = ((await kv.get(`audit:${reference}`)) as unknown[] | null) ?? [];
  await kv.set(`enquiry:${reference}`, { ...record, status, updatedAt: now });
  await kv.set(`audit:${reference}`, [...audit, { status, at: now, by: "operator" }]);

  return c.json({ ok: true, reference, status });
});

// ------------------------------------------------------ retention & erasure
/**
 * Erase one enquiry. Returns false if anything survived, so a caller never
 * reports success on a partial deletion.
 */
async function eraseEnquiry(record: StoredEnquiry): Promise<boolean> {
  for (const key of keysToErase(record)) {
    await kv.del(key);
  }

  // Trust the read, not the delete call.
  return verifyErased(await kv.get(`enquiry:${record.reference}`));
}

/**
 * The patient's right to erasure, and the "you can ask us to delete it sooner"
 * promise on the consent screen. Requires the reference and the email it was
 * submitted with, and answers identically when either is wrong.
 */
app.post(`${BASE}/enquiries/:reference/erase`, async (c) => {
  const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (await overRateLimit(ip)) return c.json({ error: "Too many requests" }, 429);

  const reference = c.req.param("reference");
  const body = (await c.req.json().catch(() => ({}))) as { email?: string };
  const record = (await kv.get(`enquiry:${reference}`)) as StoredEnquiry | null;

  if (!record || record.contact?.email !== body.email?.trim().toLowerCase()) {
    return c.json({ error: "No enquiry found for that reference and email" }, 404);
  }

  const now = new Date();
  const audit = ((await kv.get(`audit:${reference}`)) as unknown[] | null) ?? [];
  await kv.set(`audit:${reference}`, [
    ...audit,
    { status: "withdrawn", at: now.toISOString(), by: "patient" },
  ]);

  const erased = await eraseEnquiry(record);
  if (!erased) return c.json({ error: "Erasure incomplete, please contact us" }, 500);

  return c.json({ ok: true, erased: true });
});

/**
 * Scheduled sweep. Point a cron at this daily.
 *
 * Enquiries past the retention window are erased. A record whose createdAt is
 * unreadable is left alone and reported rather than deleted — losing data to a
 * parsing bug is not recoverable.
 */
app.post(`${BASE}/admin/retention/run`, async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);

  const now = new Date();
  const records = ((await kv.getByPrefix("enquiry:")) as StoredEnquiry[] | null) ?? [];
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

Deno.serve(app.fetch);
