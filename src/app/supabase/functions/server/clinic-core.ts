/**
 * The clinic-facing view of an enquiry.
 *
 * A clinic must receive exactly what Schedule A of the data sharing terms says
 * it receives, and nothing else. The stored record contains internal fields —
 * the idempotency key, the surface the enquiry came from — that are ours, not
 * theirs.
 *
 * So the view is built field by field rather than by spreading the record and
 * deleting what we do not want. Spreading fails open: a field added to storage
 * later would silently start appearing in a third party's payload. This fails
 * closed, and a new field has to be added here deliberately.
 */

export interface StoredEnquiry {
  reference: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  contact?: {
    fullName?: string;
    email?: string;
    phone?: string | null;
    preferredContact?: string;
  };
  enquiry?: {
    timing?: string;
    fundingRoute?: string;
    message?: string | null;
  };
  attribution?: {
    clinicSlug?: string;
    clinicName?: string | null;
    serviceType?: string | null;
    surface?: string | null;
    idempotencyKey?: string;
  };
  consent?: {
    processEnquiry?: boolean;
    shareWithClinic?: boolean;
    marketing?: boolean;
    givenAt?: string;
  };
}

export interface ClinicEnquiryView {
  reference: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  contact: {
    fullName: string;
    email: string;
    phone: string | null;
    preferredContact: string;
  };
  enquiry: {
    timing: string | null;
    fundingRoute: string | null;
    message: string | null;
    serviceType: string | null;
  };
  consent: {
    /** if false the clinic must not market to this person */
    marketing: boolean;
    givenAt: string | null;
  };
}

export function toClinicView(record: StoredEnquiry): ClinicEnquiryView {
  return {
    reference: record.reference,
    status: record.status,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt ?? null,
    contact: {
      fullName: record.contact?.fullName ?? '',
      email: record.contact?.email ?? '',
      phone: record.contact?.phone ?? null,
      preferredContact: record.contact?.preferredContact ?? 'email',
    },
    enquiry: {
      timing: record.enquiry?.timing ?? null,
      fundingRoute: record.enquiry?.fundingRoute ?? null,
      message: record.enquiry?.message ?? null,
      serviceType: record.attribution?.serviceType ?? null,
    },
    consent: {
      marketing: record.consent?.marketing === true,
      givenAt: record.consent?.givenAt ?? null,
    },
  };
}

/**
 * Statuses a clinic still has to act on. Enquiries that reached an outcome, or
 * were withdrawn, are not returned by default — a withdrawn enquiry in
 * particular should stop appearing in a clinic's working list.
 */
export const OPEN_STATUSES = ['submitted', 'acknowledged', 'responded'];

export const DEFAULT_LIMIT = 50;
export const MAX_LIMIT = 200;

export interface ListOptions {
  status?: string | null;
  since?: string | null;
  limit?: number | null;
}

export interface ListResult {
  enquiries: ClinicEnquiryView[];
  total: number;
  truncated: boolean;
}

/**
 * Select a clinic's enquiries.
 *
 * Ownership is enforced here rather than left to the caller, so there is one
 * place where "a clinic sees only its own" is decided.
 */
export function listForClinic(
  records: StoredEnquiry[],
  clinicSlug: string,
  options: ListOptions = {}
): ListResult {
  const limit = Math.min(Math.max(options.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
  const sinceTime = options.since ? new Date(options.since).getTime() : null;
  const validSince = sinceTime !== null && !Number.isNaN(sinceTime) ? sinceTime : null;

  const matching = records
    .filter((r) => r.attribution?.clinicSlug === clinicSlug)
    .filter((r) => {
      if (options.status) return r.status === options.status;
      return OPEN_STATUSES.includes(r.status);
    })
    .filter((r) => {
      if (validSince === null) return true;
      const created = new Date(r.createdAt).getTime();
      return !Number.isNaN(created) && created > validSince;
    })
    // Oldest first: a clinic works through a queue, and the oldest enquiry is
    // the one closest to breaching the acknowledgement window.
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return {
    enquiries: matching.slice(0, limit).map(toClinicView),
    total: matching.length,
    truncated: matching.length > limit,
  };
}
