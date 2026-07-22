import { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, ArrowRight, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import {
  FORWARDING_SLA_HOURS,
  EMPTY_DRAFT,
  RETENTION_NOTICE,
  TIMING_OPTIONS,
  createAttribution,
  submitEnquiry,
  validateStep,
  type EnquiryDraft,
  type FieldErrors,
  type SubmitResult,
} from '../lib/enquiry';

interface EnquiryFlowProps {
  clinicSlug: string;
  clinicName: string;
  serviceType: string;
  surface?: string;
  onClose: () => void;
  onShowPrivacy: () => void;
}

const STEPS = ['Your details', 'Your enquiry', 'Consent'];

const FUNDING_OPTIONS = [
  { id: 'nhs', label: 'NHS funded' },
  { id: 'private', label: 'Paying privately' },
  { id: 'undecided', label: 'Not sure yet' },
] as const;

export function EnquiryFlow({
  clinicSlug,
  clinicName,
  serviceType,
  surface = 'search-results',
  onClose,
  onShowPrivacy,
}: EnquiryFlowProps) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<EnquiryDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  // Created once per attempt so a double submit collapses server side rather
  // than opening two enquiries with the same clinic.
  const [attribution] = useState(() =>
    createAttribution(clinicSlug, clinicName, serviceType, surface)
  );

  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  /**
   * Modal accessibility. This form carries data concerning health, so keyboard
   * and screen-reader users must not be able to tab out into the page behind
   * it, and Escape must close it. On open we lock background scroll, move focus
   * to the heading, and trap Tab within the panel.
   */
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    headingRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  // On a successful send the heading changes to "Enquiry sent"; move focus to it
  // so a screen reader announces the confirmation rather than leaving focus on
  // the now-removed Send button.
  useEffect(() => {
    if (result?.ok) headingRef.current?.focus();
  }, [result?.ok]);

  const set = <K extends keyof EnquiryDraft>(key: K, value: EnquiryDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const next = () => {
    const found = validateStep(step, draft);
    setErrors(found);
    if (Object.keys(found).length === 0) setStep((s) => s + 1);
  };

  const send = async () => {
    const found = validateStep(2, draft);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    const outcome = await submitEnquiry({ ...draft, attribution, status: 'submitted' });
    setResult(outcome);
    setSubmitting(false);
  };

  const field = 'w-full rounded-lg border border-[#CBD8F5] bg-white/80 px-3.5 py-2.5 text-[#2F3440] outline-none focus:border-[#2F3440] transition-colors';
  const errorText = (msg?: string) =>
    msg ? (
      <p role="alert" className="text-xs font-medium text-[#B42318] mt-1.5">
        {msg}
      </p>
    ) : null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-heading"
        className="glass-strong rounded-2xl max-w-lg w-full my-8 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-white/50">
          <div>
            <h2
              id="enquiry-heading"
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-semibold tracking-tight text-[#2F3440] outline-none"
            >
              {result?.ok ? 'Enquiry sent' : `Enquire with ${clinicName}`}
            </h2>
            {!result?.ok && (
              <p className="text-sm text-[#5C6478] mt-1">
                Step {step + 1} of 3 · {STEPS[step]}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[#5C6478] hover:text-[#2F3440] shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5] focus-visible:ring-offset-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        {!result?.ok && (
          <div
            className="h-1 bg-white/50"
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={3}
            aria-label={`Step ${step + 1} of 3`}
          >
            <div
              className="h-1 bg-[#F8AD7C] transition-all duration-300"
              style={{ width: `${((step + 1) / 3) * 100}%` }}
            />
          </div>
        )}

        <div className="p-6">
          {/* ---------------------------------------------------- Confirmation */}
          {result?.ok ? (
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-full bg-[#DEE8FF] flex items-center justify-center text-[#5B6AA5]">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[#2F3440] mb-2">
                  Your reference is{' '}
                  <span className="font-semibold">{result.reference}</span>
                </p>
                <p className="text-sm text-[#5C6478] leading-relaxed">
                  We will pass this to {clinicName} within {FORWARDING_SLA_HOURS} hours and email
                  you when they reply. This is an enquiry, not a confirmed appointment — any date
                  is arranged with the clinic directly.
                </p>
              </div>
              <p className="text-xs text-[#5C6478] leading-relaxed">{RETENTION_NOTICE}</p>
              <Button
                className="bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold w-full h-11"
                onClick={onClose}
              >
                Done
              </Button>
            </div>
          ) : (
            <>
              {/* ------------------------------------------------ Step 1 */}
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="enq-name" className="text-sm font-medium text-[#2F3440] block mb-1.5">
                      Full name
                    </label>
                    <input
                      id="enq-name"
                      className={field}
                      value={draft.fullName}
                      onChange={(e) => set('fullName', e.target.value)}
                      autoComplete="name"
                      aria-invalid={!!errors.fullName}
                    />
                    {errorText(errors.fullName)}
                  </div>

                  <div>
                    <label htmlFor="enq-email" className="text-sm font-medium text-[#2F3440] block mb-1.5">Email</label>
                    <input
                      id="enq-email"
                      className={field}
                      type="email"
                      value={draft.email}
                      onChange={(e) => set('email', e.target.value)}
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                    />
                    {errorText(errors.email)}
                  </div>

                  <div>
                    <label htmlFor="enq-phone" className="text-sm font-medium text-[#2F3440] block mb-1.5">
                      Phone <span className="text-[#5C6478] font-normal">(optional)</span>
                    </label>
                    <input
                      id="enq-phone"
                      className={field}
                      type="tel"
                      value={draft.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      autoComplete="tel"
                      aria-invalid={!!errors.phone}
                    />
                    {errorText(errors.phone)}
                  </div>

                  <div>
                    <div id="pref-contact-label" className="text-sm font-medium text-[#2F3440] mb-2">
                      How should the clinic contact you?
                    </div>
                    <div className="flex gap-2" role="radiogroup" aria-labelledby="pref-contact-label">
                      {(['email', 'phone'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          role="radio"
                          aria-checked={draft.preferredContact === m}
                          onClick={() => set('preferredContact', m)}
                          className={`grain text-sm font-medium px-4 py-2 rounded-full capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5] focus-visible:ring-offset-2 ${
                            draft.preferredContact === m
                              ? 'bg-[#2F3440] text-white'
                              : 'bg-white/60 text-[#2F3440] hover:bg-white/80'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------ Step 2 */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <div id="timing-label" className="text-sm font-medium text-[#2F3440] mb-2">
                      When are you hoping to start?
                    </div>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="timing-label">
                      {TIMING_OPTIONS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          role="radio"
                          aria-checked={draft.timing === t.id}
                          onClick={() => set('timing', t.id)}
                          className={`grain text-sm font-medium px-4 py-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5] focus-visible:ring-offset-2 ${
                            draft.timing === t.id
                              ? 'bg-[#2F3440] text-white'
                              : 'bg-white/60 text-[#2F3440] hover:bg-white/80'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    {errorText(errors.timing)}
                  </div>

                  <div>
                    <div id="funding-label" className="text-sm font-medium text-[#2F3440] mb-2">
                      How are you planning to pay?
                    </div>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="funding-label">
                      {FUNDING_OPTIONS.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          role="radio"
                          aria-checked={draft.fundingRoute === f.id}
                          onClick={() => set('fundingRoute', f.id)}
                          className={`grain text-sm font-medium px-4 py-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5] focus-visible:ring-offset-2 ${
                            draft.fundingRoute === f.id
                              ? 'bg-[#2F3440] text-white'
                              : 'bg-white/60 text-[#2F3440] hover:bg-white/80'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                    {errorText(errors.fundingRoute)}
                  </div>

                  <div>
                    <label htmlFor="enq-message" className="text-sm font-medium text-[#2F3440] block mb-1.5">
                      Anything you want to ask?{' '}
                      <span className="text-[#5C6478] font-normal">(optional)</span>
                    </label>
                    <textarea
                      id="enq-message"
                      className={`${field} min-h-[90px] resize-y`}
                      value={draft.message}
                      onChange={(e) => set('message', e.target.value)}
                      placeholder="e.g. what is included in your quoted price?"
                    />
                    <p className="text-xs text-[#5C6478] mt-1.5 leading-relaxed">
                      Please leave out medical history and test results. The clinic will take those
                      securely once you are in their care.
                    </p>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------ Step 3 */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="glass rounded-xl p-4 text-sm text-[#5C6478] leading-relaxed">
                    <div className="flex items-center gap-2 text-[#2F3440] font-semibold mb-2">
                      <ShieldCheck className="w-4 h-4" />
                      What you are agreeing to
                    </div>
                    An enquiry about fertility treatment says something about your health, so the law
                    treats it as sensitive. We will not send anything without your explicit consent.
                  </div>

                  <label className="flex gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.consent.processEnquiry}
                      onChange={(e) =>
                        set('consent', { ...draft.consent, processEnquiry: e.target.checked })
                      }
                      className="accent-[#F8AD7C] w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-[#2F3440] leading-relaxed">
                      I consent to JourneyFertility handling this enquiry, which concerns my health.
                    </span>
                  </label>

                  <label className="flex gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.consent.shareWithClinic}
                      onChange={(e) =>
                        set('consent', { ...draft.consent, shareWithClinic: e.target.checked })
                      }
                      className="accent-[#F8AD7C] w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-[#2F3440] leading-relaxed">
                      Send my enquiry to{' '}
                      <span className="font-semibold">{clinicName}</span> so they can contact me.
                    </span>
                  </label>

                  <label className="flex gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.consent.marketing}
                      onChange={(e) =>
                        set('consent', { ...draft.consent, marketing: e.target.checked })
                      }
                      className="accent-[#F8AD7C] w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-[#5C6478] leading-relaxed">
                      Optional: email me guides and updates. Not required, and you can stop any time.
                    </span>
                  </label>

                  {errorText(errors.consent)}
                  <p className="text-xs text-[#5C6478] leading-relaxed">
                    {RETENTION_NOTICE}{' '}
                    <button
                      type="button"
                      onClick={onShowPrivacy}
                      className="font-semibold text-[#5B6AA5] hover:underline"
                    >
                      Read how we handle your information
                    </button>
                    .
                  </p>

                  {result && !result.ok && (
                    <div role="alert" className="glass rounded-xl p-4 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-[#B4762F] shrink-0 mt-0.5" />
                      <div className="text-sm text-[#5C6478] leading-relaxed">
                        <span className="font-semibold text-[#2F3440]">
                          {result.notConfigured ? 'Not connected yet.' : 'Could not send.'}
                        </span>{' '}
                        {result.notConfigured
                          ? 'Enquiry submission has no backend configured, so nothing was sent. Set VITE_ENQUIRY_ENDPOINT to enable it.'
                          : result.error}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3 mt-7">
                <Button
                  variant="ghost"
                  onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
                  className="text-[#5C6478]"
                >
                  {step === 0 ? (
                    'Cancel'
                  ) : (
                    <>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </>
                  )}
                </Button>

                {step < 2 ? (
                  <Button
                    onClick={next}
                    className="bg-[#2F3440] text-white hover:bg-[#434A5C] px-6"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={send}
                    disabled={submitting}
                    className="bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold px-6"
                  >
                    {submitting ? 'Sending…' : 'Send enquiry'}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
