/**
 * Enquiry funnel.
 *
 * Most fertility clinics run legacy practice management systems with no
 * external API, so real-time booking is available from very few of them. The
 * funnel is therefore modelled as "enquiry → clinic responds", not as instant
 * confirmation. Designing for a synchronous booking we cannot deliver would
 * promise the patient something the clinic never agreed to.
 *
 * DATA PROTECTION
 * An enquiry about fertility treatment reveals that the person is seeking
 * fertility care. That is data concerning health, so the whole payload is
 * special category data under UK GDPR Article 9 — not just any clinical detail
 * inside it. Two consequences run through this file:
 *
 *   1. Explicit consent is the lawful basis. It must be a clear affirmative
 *      act, so every consent defaults to false and nothing is pre-ticked.
 *   2. Data minimisation. We collect what a clinic needs to make contact and
 *      nothing more. We deliberately do not ask for medical history, test
 *      results or diagnoses — the clinic can take those safely once the
 *      patient is in their care.
 */

/**
 * For the MVP an operator forwards each enquiry to the clinic by hand, so these
 * are the only states an enquiry moves through. There is no clinic integration,
 * and so no transition machine to police.
 */
export type EnquiryStatus = 'draft' | 'submitted' | 'forwarded' | 'closed' | 'withdrawn';

/**
 * How quickly we aim to pass an enquiry on. This is our own commitment: no
 * clinic has agreed a response time, so we must not imply one.
 */
export const FORWARDING_SLA_HOURS = 24;

export type ContactMethod = 'email' | 'phone';
export type EnquiryTiming = 'asap' | 'within-3-months' | 'within-6-months' | 'just-researching';

export const TIMING_OPTIONS: { id: EnquiryTiming; label: string }[] = [
  { id: 'asap', label: 'As soon as possible' },
  { id: 'within-3-months', label: 'Within 3 months' },
  { id: 'within-6-months', label: 'Within 6 months' },
  { id: 'just-researching', label: 'Still researching' },
];

export interface EnquiryConsent {
  /** Article 9 explicit consent to process an enquiry about fertility care. */
  processEnquiry: boolean;
  /** Consent to pass the enquiry to the named clinic. */
  shareWithClinic: boolean;
  /** Genuinely optional. Never required to submit. */
  marketing: boolean;
}

export interface EnquiryDraft {
  fullName: string;
  email: string;
  phone: string;
  preferredContact: ContactMethod;
  timing: EnquiryTiming | null;
  fundingRoute: 'nhs' | 'private' | 'undecided' | null;
  /** Free text. The form warns against including medical detail. */
  message: string;
  consent: EnquiryConsent;
}

export const EMPTY_DRAFT: EnquiryDraft = {
  fullName: '',
  email: '',
  phone: '',
  preferredContact: 'email',
  timing: null,
  fundingRoute: null,
  message: '',
  consent: { processEnquiry: false, shareWithClinic: false, marketing: false },
};

/** Attribution — how we evidence that a booking came from us. */
export interface EnquiryAttribution {
  /** patient-facing reference, also the clinic's handle for the enquiry */
  reference: string;
  /** stable per attempt, so a double submit cannot create two enquiries */
  idempotencyKey: string;
  clinicSlug: string;
  clinicName: string;
  serviceType: string;
  /** where in the product the enquiry started */
  surface: string;
  createdAt: string;
}

export interface Enquiry extends EnquiryDraft {
  attribution: EnquiryAttribution;
  status: EnquiryStatus;
}

export type FieldErrors = Partial<Record<keyof EnquiryDraft | 'consent', string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validation is per step so the patient is never shown errors for fields they
 * have not reached yet.
 */
export function validateStep(step: number, draft: EnquiryDraft): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 0) {
    if (!draft.fullName.trim()) errors.fullName = 'Please tell us your name';
    if (!draft.email.trim()) errors.email = 'We need an email to send your reference';
    else if (!EMAIL.test(draft.email.trim())) errors.email = 'That email does not look right';
    if (draft.preferredContact === 'phone' && !draft.phone.trim()) {
      errors.phone = 'Add a number, or choose email instead';
    }
  }

  if (step === 1) {
    if (!draft.timing) errors.timing = 'Roughly when are you hoping to start?';
    if (!draft.fundingRoute) errors.fundingRoute = 'Let the clinic know how you plan to pay';
  }

  if (step === 2) {
    if (!draft.consent.processEnquiry || !draft.consent.shareWithClinic) {
      errors.consent = 'We cannot send your enquiry without both consents';
    }
  }

  return errors;
}

export function isStepValid(step: number, draft: EnquiryDraft): boolean {
  return Object.keys(validateStep(step, draft)).length === 0;
}

function randomId(length: number): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (v) => alphabet[v % alphabet.length]).join('');
}

export function createAttribution(
  clinicSlug: string,
  clinicName: string,
  serviceType: string,
  surface: string
): EnquiryAttribution {
  return {
    reference: `JF-${randomId(6)}`,
    idempotencyKey: crypto.randomUUID(),
    clinicSlug,
    clinicName,
    serviceType,
    surface,
    createdAt: new Date().toISOString(),
  };
}

export interface SubmitResult {
  ok: boolean;
  reference?: string;
  /** set when the funnel is not connected to a backend yet */
  notConfigured?: boolean;
  error?: string;
}

const ENDPOINT = import.meta.env?.VITE_ENQUIRY_ENDPOINT as string | undefined;

/**
 * Send the enquiry.
 *
 * With no endpoint configured this reports notConfigured rather than pretending
 * to succeed. A confirmation screen for an enquiry that was silently dropped
 * would be worse than an error: the patient would wait for a clinic that never
 * heard from them.
 */
export async function submitEnquiry(enquiry: Enquiry): Promise<SubmitResult> {
  if (!ENDPOINT) {
    return {
      ok: false,
      notConfigured: true,
      error: 'Enquiry submission is not connected yet.',
    };
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Lets the server collapse retries instead of creating duplicates.
        'Idempotency-Key': enquiry.attribution.idempotencyKey,
      },
      body: JSON.stringify(enquiry),
    });

    if (!response.ok) {
      return { ok: false, error: `Clinic enquiry failed (${response.status})` };
    }
    return { ok: true, reference: enquiry.attribution.reference };
  } catch {
    return { ok: false, error: 'Could not reach the server. Please try again.' };
  }
}

/**
 * Must match RETENTION_MONTHS in
 * src/app/supabase/functions/server/retention-core.ts, which is what the
 * sweep actually enforces. The two live in different runtimes so they cannot
 * share a module; if you change one, change the other.
 */
export const RETENTION_MONTHS = 12;

export const RETENTION_NOTICE =
  `We keep your enquiry for ${RETENTION_MONTHS} months so we can follow up on the clinic’s response, then delete it. You can ask us to delete it sooner at any time.`;
