/**
 * Retention and erasure.
 *
 * The consent screen tells people we keep an enquiry for 12 months and that
 * they can have it deleted sooner. Until that is actually enforced the promise
 * is decorative, and an unkept retention promise is worse than none: it is a
 * statement to the data subject about how their health data is handled.
 *
 * The audit trail is what survives. It holds status changes and timestamps
 * only, no personal data, so erasure destroys the enquiry without destroying
 * the record that it existed and how it ended. That is enough for the MVP;
 * there are no referral fees to evidence yet.
 *
 * Keep RETENTION_MONTHS in step with RETENTION_NOTICE in src/app/lib/enquiry.ts,
 * which is what the patient is actually shown.
 */

export const RETENTION_MONTHS = 12;

export interface StoredEnquiry {
  reference: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  contact?: { fullName?: string; email?: string; phone?: string | null };
  enquiry?: { message?: string | null };
  attribution?: {
    clinicSlug?: string;
    serviceType?: string | null;
    idempotencyKey?: string;
  };
}

export function addMonths(iso: string, months: number): Date {
  const date = new Date(iso);
  const shifted = new Date(date);
  shifted.setMonth(shifted.getMonth() + months);
  return shifted;
}

export function isExpired(createdAt: string, now: Date, months = RETENTION_MONTHS): boolean {
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return false;
  return addMonths(createdAt, months).getTime() <= now.getTime();
}

/**
 * Every key holding personal data for this enquiry.
 *
 * The idempotency mapping goes too. It exists only to collapse retries within
 * minutes of submission, so long after that it is an orphan pointer to a
 * destroyed record with no reason to survive.
 *
 * The audit trail is not listed: it holds status transitions and timestamps
 * only, no personal data, and it is the evidence behind a fee claim.
 */
export function keysToErase(record: StoredEnquiry): string[] {
  const keys = [`enquiry:${record.reference}`];
  if (record.attribution?.idempotencyKey) {
    keys.push(`idem:${record.attribution.idempotencyKey}`);
  }
  return keys;
}

export interface RetentionPlan {
  erase: StoredEnquiry[];
  keep: StoredEnquiry[];
}

export function planRetention(
  records: StoredEnquiry[],
  now: Date,
  months = RETENTION_MONTHS
): RetentionPlan {
  const erase: StoredEnquiry[] = [];
  const keep: StoredEnquiry[] = [];
  for (const record of records) {
    (isExpired(record.createdAt, now, months) ? erase : keep).push(record);
  }
  return { erase, keep };
}

/**
 * Confirms an erasure actually removed the personal data, rather than trusting
 * that the delete calls succeeded. Runs after the deletes; a false result means
 * the sweep must be treated as failed and retried.
 */
export function verifyErased(remaining: unknown): boolean {
  return remaining === null || remaining === undefined;
}
