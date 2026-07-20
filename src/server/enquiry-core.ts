/**
 * Pure enquiry logic, kept free of Deno and Hono so it can be exercised
 * directly by tests. index.tsx holds only transport concerns — routing,
 * headers, storage — and delegates every decision to this module.
 */

export type Consent = {
  processEnquiry?: boolean;
  shareWithClinic?: boolean;
  marketing?: boolean;
};

export interface EnquiryPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  preferredContact?: string;
  timing?: string;
  fundingRoute?: string;
  message?: string;
  consent?: Consent;
  attribution?: {
    reference?: string;
    idempotencyKey?: string;
    clinicSlug?: string;
    clinicName?: string;
    serviceType?: string;
    surface?: string;
    createdAt?: string;
  };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIMINGS = ['asap', 'within-3-months', 'within-6-months', 'just-researching'];
const FUNDING = ['nhs', 'private', 'undecided'];
const CONTACT = ['email', 'phone'];

/**
 * Server-authoritative validation. The client's checks are a convenience for
 * the patient; these are the ones that decide whether an enquiry is accepted.
 */
export function validate(body: EnquiryPayload): string[] {
  const errors: string[] = [];
  const name = body.fullName?.trim() ?? '';
  const email = body.email?.trim() ?? '';

  if (name.length < 2 || name.length > 100) errors.push('fullName');
  if (!EMAIL.test(email) || email.length > 254) errors.push('email');
  if ((body.phone?.length ?? 0) > 32) errors.push('phone');
  if (!CONTACT.includes(body.preferredContact ?? '')) errors.push('preferredContact');
  if (!TIMINGS.includes(body.timing ?? '')) errors.push('timing');
  if (!FUNDING.includes(body.fundingRoute ?? '')) errors.push('fundingRoute');
  if ((body.message?.length ?? 0) > 2000) errors.push('message');
  if (!body.attribution?.clinicSlug) errors.push('attribution.clinicSlug');
  if (body.preferredContact === 'phone' && !body.phone?.trim()) errors.push('phone');

  return errors;
}

/** Consent is the lawful basis, so it is decided here rather than in the route. */
export function hasRequiredConsent(body: EnquiryPayload): boolean {
  return body.consent?.processEnquiry === true && body.consent?.shareWithClinic === true;
}

/**
 * Build the stored record. Deliberately narrow: the contact details a clinic
 * needs to make contact, the enquiry context, and consent with the time it was
 * given. Nothing clinical is accepted or retained, and unknown fields on the
 * payload are dropped rather than passed through.
 */
export function buildRecord(
  body: EnquiryPayload,
  reference: string,
  idempotencyKey: string,
  now: string
) {
  return {
    reference,
    status: 'submitted' as const,
    createdAt: now,
    updatedAt: now,
    contact: {
      fullName: body.fullName!.trim(),
      email: body.email!.trim().toLowerCase(),
      phone: body.phone?.trim() || null,
      preferredContact: body.preferredContact,
    },
    enquiry: {
      timing: body.timing,
      fundingRoute: body.fundingRoute,
      message: body.message?.trim() || null,
    },
    attribution: {
      clinicSlug: body.attribution!.clinicSlug,
      clinicName: body.attribution?.clinicName ?? null,
      serviceType: body.attribution?.serviceType ?? null,
      surface: body.attribution?.surface ?? null,
      idempotencyKey,
    },
    consent: {
      processEnquiry: true,
      shareWithClinic: true,
      marketing: body.consent?.marketing === true,
      givenAt: now,
    },
  };
}

/**
 * Operator-driven statuses. For the MVP an enquiry is forwarded to the clinic by
 * hand, so there is no clinic integration and no state machine to police — just
 * the three states an operator actually moves an enquiry through.
 */
export const ENQUIRY_STATUSES = ['submitted', 'forwarded', 'closed'] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export function isValidStatus(value: unknown): value is EnquiryStatus {
  return typeof value === 'string' && (ENQUIRY_STATUSES as readonly string[]).includes(value);
}

/** Strips enquiry references out of log lines before they reach stdout. */
export function redactPath(message: string): string {
  return message.replace(/\/enquiries\/[A-Z0-9-]+/gi, '/enquiries/[redacted]');
}

