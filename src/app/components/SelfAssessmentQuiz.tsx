import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowRight, Lock } from 'lucide-react';
import { Button } from './ui/button';

type ServiceId = 'fertility' | 'egg-freezing' | 'ivf' | 'embryo';

interface SelfAssessmentQuizProps {
  onClose: () => void;
  /** Take the user to the comparison for a service. */
  onPick: (service: ServiceId) => void;
  /** Open the guides. */
  onResources: () => void;
}

/**
 * A short, private signpost — not a diagnosis and not a prediction.
 *
 * It asks a few plain questions and points the user at the right part of the
 * site. It deliberately does NOT estimate egg yield, recommend named clinics,
 * or quote prices — we can't stand behind numbers like that, and inventing them
 * about real clinics or a real person's body would be the opposite of what this
 * tool is for. Answers live in component state only; nothing is saved or sent.
 */

type Goal = 'fertility' | 'egg-freezing' | 'ivf' | 'embryo' | 'exploring';
type Tested = 'recent' | 'old' | 'no';
type Priority = 'cost' | 'nhs' | 'convenient' | 'unsure';

const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: 'fertility', label: 'I want to understand my fertility — where I stand' },
  { value: 'egg-freezing', label: "I'd like to preserve eggs for the future" },
  { value: 'ivf', label: "I'm trying for a baby, or want to soon" },
  { value: 'embryo', label: 'I want to store embryos' },
  { value: 'exploring', label: "I'm just exploring for now" },
];

const TESTED_OPTIONS: { value: Tested; label: string }[] = [
  { value: 'recent', label: 'Yes, in the last year or so' },
  { value: 'old', label: 'Yes, but a while ago' },
  { value: 'no', label: 'No, not yet' },
];

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'cost', label: 'Keeping costs down' },
  { value: 'nhs', label: 'NHS-funded options' },
  { value: 'convenient', label: 'Somewhere convenient' },
  { value: 'unsure', label: "I'm not sure yet" },
];

const SERVICE_LABEL: Record<ServiceId, string> = {
  fertility: 'fertility tests',
  'egg-freezing': 'egg-freezing clinics',
  ivf: 'IVF clinics',
  embryo: 'embryo-freezing clinics',
};

const PRIORITY_TIP: Record<Priority, string> = {
  cost: 'In the results, sort by price and switch on “only clinics that publish a price”.',
  nhs: 'Use the funding filter to see NHS-funded routes alongside private prices.',
  convenient: 'Every result shows the clinic’s location, so you can find one near you.',
  unsure: 'Not sure yet? The guides explain what the costs and numbers actually mean.',
};

interface Recommendation {
  title: string;
  body: string;
  primary: { service: ServiceId; label: string };
  secondary?: { service: ServiceId; label: string };
}

function buildRecommendation(goal: Goal, tested: Tested): Recommendation {
  // Anyone whose goal is a treatment, but who hasn't tested, is pointed at a
  // test first — it's the cheaper, lower-commitment first step and it shapes
  // everything that follows.
  const treatmentGoal = goal === 'egg-freezing' || goal === 'ivf' || goal === 'embryo';

  if (goal === 'fertility' || goal === 'exploring') {
    return {
      title: 'Start with a fertility test',
      body: 'A simple at-home or clinic test reads your ovarian reserve and key hormones — a snapshot of where you stand. It’s the natural first step, and it needn’t be expensive.',
      primary: { service: 'fertility', label: 'Compare fertility tests' },
    };
  }

  if (treatmentGoal && tested === 'no') {
    return {
      title: 'A fertility test is a good first step',
      body: `Before committing to ${SERVICE_LABEL[goal as ServiceId].replace(' clinics', '')}, a fertility test shows your ovarian reserve — it shapes whether and when treatment is worth it, and you don’t need to break the bank to find out.`,
      primary: { service: 'fertility', label: 'Compare fertility tests' },
      secondary: { service: goal as ServiceId, label: `Or compare ${SERVICE_LABEL[goal as ServiceId]}` },
    };
  }

  // Treatment goal, already tested.
  return {
    title: `Compare ${SERVICE_LABEL[goal as ServiceId]}`,
    body:
      tested === 'old'
        ? 'Your reserve can shift over time, so it may be worth a fresh test — but you’re ready to start comparing your options.'
        : 'You’ve done the groundwork. Compare your options side by side, with each clinic’s own published costs.',
    primary: { service: goal as ServiceId, label: `Compare ${SERVICE_LABEL[goal as ServiceId]}` },
    secondary:
      tested === 'old'
        ? { service: 'fertility', label: 'Or re-check with a fertility test' }
        : undefined,
  };
}

export function SelfAssessmentQuiz({ onClose, onPick, onResources }: SelfAssessmentQuizProps) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [tested, setTested] = useState<Tested | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [showResult, setShowResult] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const totalSteps = 3;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const canAdvance =
    (step === 1 && goal) || (step === 2 && tested) || (step === 3 && priority);

  const next = () => {
    if (step < totalSteps) setStep((s) => s + 1);
    else setShowResult(true);
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const Option = <T extends string>({
    active,
    onSelect,
    children,
  }: {
    active: boolean;
    onSelect: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`w-full p-4 border-2 rounded-xl text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2542E] focus-visible:ring-offset-2 ${
        active ? 'border-[#F4A28C] bg-[#FBEAE4]' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assessment-title"
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="assessment-title" className="text-2xl font-semibold tracking-tight text-[#2F2C2A]">
              {showResult ? 'Where to start' : 'A quick way to find your starting point'}
            </h2>
            <p className="text-sm text-[#665F58] mt-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Private — your answers stay in your browser.
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2542E]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!showResult ? (
          <>
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#665F58]">Question {step} of {totalSteps}</span>
                <span className="text-sm text-[#665F58]">{Math.round((step / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={totalSteps}>
                <div
                  className="h-full bg-[#F4A28C] transition-all duration-300 motion-reduce:transition-none"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-6 space-y-3">
              {step === 1 && (
                <>
                  <h3 className="text-lg font-semibold text-[#2F2C2A] mb-2">What brings you here?</h3>
                  {GOAL_OPTIONS.map((o) => (
                    <Option key={o.value} active={goal === o.value} onSelect={() => setGoal(o.value)}>
                      {o.label}
                    </Option>
                  ))}
                </>
              )}

              {step === 2 && (
                <>
                  <h3 className="text-lg font-semibold text-[#2F2C2A] mb-2">
                    Have you had a fertility check, like an AMH test?
                  </h3>
                  {TESTED_OPTIONS.map((o) => (
                    <Option key={o.value} active={tested === o.value} onSelect={() => setTested(o.value)}>
                      {o.label}
                    </Option>
                  ))}
                </>
              )}

              {step === 3 && (
                <>
                  <h3 className="text-lg font-semibold text-[#2F2C2A] mb-2">
                    What matters most as you compare?
                  </h3>
                  {PRIORITY_OPTIONS.map((o) => (
                    <Option key={o.value} active={priority === o.value} onSelect={() => setPriority(o.value)}>
                      {o.label}
                    </Option>
                  ))}
                </>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-between">
              <Button variant="outline" onClick={back} disabled={step === 1}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={next}
                disabled={!canAdvance}
                className="bg-[#2F2C2A] text-white hover:bg-[#46423F]"
              >
                {step === totalSteps ? 'See where to start' : 'Next'}
                {step !== totalSteps && <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </>
        ) : (
          (() => {
            const rec = buildRecommendation(goal!, tested!);
            return (
              <div className="p-6 space-y-5">
                <div className="rounded-2xl bg-[#DCE6F0]/40 border border-[#C3D3E2]/30 p-5">
                  <h3 className="text-lg font-semibold text-[#2F2C2A] mb-1.5">{rec.title}</h3>
                  <p className="text-sm text-[#665F58] leading-relaxed">{rec.body}</p>
                </div>

                {priority && (
                  <p className="text-sm text-[#665F58] leading-relaxed">
                    <span className="font-semibold text-[#C2542E]">Tip:</span> {PRIORITY_TIP[priority]}
                  </p>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={() => onPick(rec.primary.service)}
                    className="w-full h-12 bg-[#F4A28C] hover:bg-[#E0714A] text-[#2F2C2A] font-semibold"
                  >
                    {rec.primary.label}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  {rec.secondary && (
                    <Button
                      variant="outline"
                      onClick={() => onPick(rec.secondary!.service)}
                      className="w-full h-12"
                    >
                      {rec.secondary.label}
                    </Button>
                  )}
                  <button
                    onClick={onResources}
                    className="w-full text-sm font-medium text-[#C2542E] hover:underline py-1"
                  >
                    Or read the guides first
                  </button>
                </div>

                <p className="text-xs text-[#665F58] leading-relaxed border-t border-gray-100 pt-4">
                  This isn’t medical advice — it just points you to the right part of the site.
                  For anything about your own health, speak to your GP or a fertility specialist.
                </p>

                <button onClick={() => setShowResult(false)} className="text-sm text-[#665F58] hover:text-[#2F2C2A]">
                  ← Change my answers
                </button>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
