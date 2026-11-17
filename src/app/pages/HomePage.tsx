import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Activity,
  Building2,
  ChevronDown,
  ChevronRight,
  HeartPulse,
  PoundSterling,
  Search,
  Snowflake,
  Sparkles,
  Users,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ServiceExplainer } from '../components/ServiceExplainer';
import { TrustStrip } from '../components/TrustStrip';
import { ResearchFindings } from '../components/ResearchFindings';
import { OPTIONS } from '../components/OptionsComparison';
import { Eyebrow } from '../components/SiteChrome';
import { CATEGORY_SLUGS } from '../components/Resources';
import { REAL_CLINICS } from '../data/clinics';
import { BUDGET_OPTIONS, FROM_LEGACY, type LegacyService } from '../lib/search';
import { FAQS, SITE } from '../lib/site';
import heroImage from '../../assets/hero.jpg';
import story1 from '../../assets/photos/story-1.jpg';
import story4 from '../../assets/photos/story-4.jpg';
// Neutral covers for the testing and IVF cards: no babies, children or pregnancy.
import testingCover from '../../assets/photos/resource-fertility-testing.jpg';
import ivfCover from '../../assets/photos/resource-ivf.jpg';

const CONFIDENCE_WORDS = ['clarity', 'confidence', 'calm', 'control', 'certainty', 'support'];

const SERVICE_TABS: { id: LegacyService; label: string }[] = [
  { id: 'egg-freezing', label: 'Egg Freezing' },
  { id: 'embryo', label: 'Embryo Freezing' },
  { id: 'ivf', label: 'IVF Treatment' },
  { id: 'fertility', label: 'Fertility Testing' },
];

const CLINIC_COMPARE = {
  heading: 'Compare clinics and their all-in costs',
  sub: 'Pick a service, then narrow by clinic and budget. Real UK clinics, each shown with its own published price where the clinic publishes one.',
};
const COMPARE_META: Record<LegacyService, { heading: string; sub: string }> = {
  'egg-freezing': CLINIC_COMPARE,
  embryo: CLINIC_COMPARE,
  ivf: CLINIC_COMPARE,
  fertility: {
    heading: 'Compare fertility tests and clinic checks',
    sub: 'Start with an at-home test kit or a clinic check. Real UK providers, each shown with its own published price.',
  },
};

const SERVICE_NAMES: Record<LegacyService, string> = {
  fertility: 'fertility testing',
  'egg-freezing': 'egg freezing',
  embryo: 'embryo freezing',
  ivf: 'IVF',
};

const optionFor = (s: LegacyService) => OPTIONS.find((o) => o.service === s)!;

/** One chooser card per service, plus "Not sure yet", which leads to the self-assessment. */
const STAGES: {
  id: string;
  service: LegacyService | null;
  age: string | null;
  icon: typeof Activity;
  statement: string;
}[] = [
  {
    id: 'testing',
    service: 'fertility',
    age: '30',
    icon: Activity,
    statement: "I'm not sure about kids yet — but I want to check where I stand.",
  },
  { id: 'eggs', service: 'egg-freezing', age: '30', icon: Snowflake, statement: 'I want kids — just not right now.' },
  {
    id: 'embryo',
    service: 'embryo',
    age: '40',
    icon: HeartPulse,
    statement: 'I want more kids and to freeze embryos — and keep an eye on my hormones.',
  },
  { id: 'ivf', service: 'ivf', age: '34', icon: Users, statement: "We've been trying for a baby without success." },
  { id: 'unsure', service: null, age: null, icon: Sparkles, statement: "I'm not sure which option is right for me yet." },
];

/** Guide entry points. The images are illustrative and make no claim about the people in them. */
const GUIDE_TOPICS = [
  { label: 'Thinking about freezing your eggs', category: 'Egg Freezing', image: story1 },
  { label: 'Understanding your fertility', category: 'Fertility Testing', image: testingCover },
  { label: 'Considering IVF', category: 'IVF', image: ivfCover },
  { label: 'Working out what it costs', category: 'Costs & Planning', image: story4 },
] as const;

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduce;
}

/** Decorative: screen readers get the full sentence from a visually hidden span instead. */
function RotatingWord() {
  const reduceMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (reduceMotion) {
      setIndex(0);
      setShow(true);
      return;
    }
    let fade: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setShow(false);
      fade = setTimeout(() => {
        setIndex((prev) => (prev + 1) % CONFIDENCE_WORDS.length);
        setShow(true);
      }, 350);
    }, 2400);
    return () => {
      clearInterval(interval);
      clearTimeout(fade);
    };
  }, [reduceMotion]);

  return (
    <span
      className={`grain inline-flex justify-center min-w-[5.5ch] bg-blush text-ink font-bold px-2 rounded-md motion-safe:transition-all motion-safe:duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
      }`}
    >
      {CONFIDENCE_WORDS[index]}
    </span>
  );
}

function ServiceTabs({ value, onChange, label }: { value: LegacyService; onChange: (s: LegacyService) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 p-1.5 rounded-2xl bg-white/50">
      {SERVICE_TABS.map((s) => {
        const active = value === s.id;
        return (
          <button
            key={s.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(s.id)}
            className={`sm:flex-1 min-h-11 text-sm font-semibold px-3 py-2.5 rounded-xl transition-colors ${
              active ? 'bg-ink text-white shadow-sm' : 'text-ink hover:bg-white/70'
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const reduceMotion = usePrefersReducedMotion();
  const [serviceType, setServiceType] = useState<LegacyService>('egg-freezing');
  const [clinic, setClinic] = useState('all');
  const [budget, setBudget] = useState('all');
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({});
  const [topicIndex, setTopicIndex] = useState(0);
  const stagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'JourneyFertility | Non-profit fertility guide and UK clinic comparison';
  }, []);

  // A budget or clinic chosen for one service means nothing for another.
  useEffect(() => {
    setBudget('all');
    setClinic('all');
  }, [serviceType]);

  const searchUrl = (s: LegacyService, extra: Record<string, string> = {}) =>
    `/search?${new URLSearchParams({ service: FROM_LEGACY[s], ...extra })}`;

  const runCompare = () => {
    const extra: Record<string, string> = {};
    if (clinic !== 'all') extra.clinic = clinic;
    if (budget !== 'all') extra.max_budget = budget;
    navigate(searchUrl(serviceType, extra));
  };

  const scrollStages = (dir: 1 | -1) => {
    const el = stagesRef.current;
    if (!el) return;
    const card = el.querySelector('li');
    el.scrollBy({ left: ((card?.offsetWidth ?? 284) + 16) * dir, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const sentence = 'Navigate your fertility journey without the anxiety, with clarity.';

  return (
    <>
      {/* Hero */}
      <section className="mb-12 md:mb-20 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center" aria-labelledby="hero-heading">
        <div>
          <Eyebrow className="mb-3">Non-profit fertility guide &amp; clinic comparison</Eyebrow>
          <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink mb-4">
            Your fertility options. One simple search.
          </h1>
          <p className="text-lg md:text-2xl text-muted-ink max-w-2xl leading-relaxed mb-3">
            <span className="visually-hidden">{sentence}</span>
            <span aria-hidden="true">
              Navigate your fertility journey without the anxiety — with <RotatingWord />
            </span>
          </p>
          <p className="text-sm md:text-base text-muted-ink max-w-xl leading-relaxed mb-5">
            A non-profit built by {SITE.founder}. Guidance based on your country&rsquo;s official healthcare guidelines
            and research with {SITE.researchCount} women.
          </p>

          <form
            role="search"
            aria-label="Search clinics"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(searchUrl(serviceType));
            }}
          >
            <ServiceTabs value={serviceType} onChange={setServiceType} label="Choose a service" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
              <Button type="submit" className="h-12 px-8 bg-blush hover:bg-peach text-ink font-semibold text-base">
                <Search className="w-4 h-4 mr-2" aria-hidden="true" />
                Search clinics
              </Button>
              <p className="text-sm text-muted-ink">Free, no account, no pressure</p>
            </div>
          </form>

          {/* How it works: informational steps, not controls */}
          <ol className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-x-5 gap-y-2" aria-label="How it works">
            {['Search & compare', 'See true all-in costs', 'Book with the clinic'].map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full bg-ink text-white text-xs font-semibold flex items-center justify-center"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-ink">{label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative">
          <ImageWithFallback
            src={heroImage}
            alt="A woman in the golden evening light, calm and hopeful about her fertility options"
            className="w-full h-[320px] md:h-[460px] lg:h-[560px] object-cover object-[50%_22%] rounded-xl"
            loading="eager"
            decoding="async"
            {...{ fetchpriority: 'high' }}
          />
          <div className="absolute bottom-4 left-4 grain glass-strong rounded-xl px-4 py-3">
            <div className="text-sm font-semibold text-ink leading-tight">Real UK clinics</div>
            <div className="text-xs text-muted-ink">published costs, side by side</div>
          </div>
        </div>
      </section>

      <div className="mb-12">
        <TrustStrip />
      </div>

      {/* The one chooser */}
      <section className="mb-16 md:mb-24" aria-labelledby="stages-heading">
        <div className="flex items-end justify-between gap-6 mb-6">
          <div className="max-w-2xl">
            <Eyebrow>Start here</Eyebrow>
            <h2 id="stages-heading" className="text-3xl md:text-4xl font-semibold tracking-tight text-ink mb-3">
              Where are you right now?
            </h2>
            <p className="text-muted-ink text-lg leading-relaxed">
              Everyone's journey looks different. Pick the line that sounds most like you and we'll tailor your search.
            </p>
          </div>
          <div className="hidden sm:flex gap-2 shrink-0 pb-1">
            <button
              type="button"
              aria-label="Previous situations"
              onClick={() => scrollStages(-1)}
              className="w-11 h-11 rounded-full glass flex items-center justify-center text-ink hover:bg-white/80 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <button
              type="button"
              aria-label="More situations"
              onClick={() => scrollStages(1)}
              className="w-11 h-11 rounded-full glass flex items-center justify-center text-ink hover:bg-white/80 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={stagesRef}
          className="overflow-x-auto snap-x snap-mandatory pb-3 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex gap-4">
            {STAGES.map((stage) => {
              const Icon = stage.icon;
              const option = stage.service ? optionFor(stage.service) : null;
              const to = stage.service ? searchUrl(stage.service) : '/self-assessment';
              const linkLabel = stage.service ? `Compare ${SERVICE_NAMES[stage.service]}` : 'Take the self-assessment';
              return (
                <li key={stage.id} className="snap-start shrink-0 w-[82vw] max-w-[300px] sm:w-[300px]">
                  <Link
                    to={to}
                    state={stage.age ? { age: Number(stage.age) } : undefined}
                    className="group h-full flex flex-col text-left rounded-2xl border p-6 glass transition-all duration-200 motion-reduce:transition-none hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-11 h-11 rounded-full bg-sky/50 flex items-center justify-center text-peach-deep">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      {stage.age && (
                        <span className="text-xs font-semibold uppercase tracking-wide text-ink bg-sky px-3 py-1 rounded-full">
                          Age {stage.age}
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-ink leading-snug mb-4">&ldquo;{stage.statement}&rdquo;</p>
                    <dl className="text-sm leading-snug space-y-2 mb-5 flex-1">
                      {option ? (
                        <>
                          <div>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-ink">Best if</dt>
                            <dd className="text-ink">{option.bestIf}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-ink">How it works</dt>
                            <dd className="text-ink">{option.how}</dd>
                          </div>
                        </>
                      ) : (
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-ink">Best if</dt>
                          <dd className="text-ink">You&rsquo;d like a few private questions to point you to a starting place.</dd>
                        </div>
                      )}
                    </dl>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-peach-deep">
                      {linkLabel}
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <Link
          to="/self-assessment"
          className="inline-flex items-center gap-1.5 min-h-11 mt-2 text-sm font-semibold text-peach-deep hover:underline"
        >
          Not sure? Take a 2-minute self-assessment
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </section>

      {/* Full compare */}
      <section id="search" className="scroll-mt-6 mb-16" aria-labelledby="compare-heading">
        <div className="glass rounded-2xl p-6 md:p-8 shadow-[var(--glass-shadow)]">
          <Eyebrow>If you already know what you want</Eyebrow>
          <h2 id="compare-heading" className="text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-1.5">
            {COMPARE_META[serviceType].heading}
          </h2>
          <p className="text-muted-ink mb-6 max-w-xl">{COMPARE_META[serviceType].sub}</p>

          <ServiceTabs value={serviceType} onChange={setServiceType} label="Choose a service to compare" />
          <ServiceExplainer serviceType={serviceType} className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search-clinic" className="block text-xs font-semibold uppercase tracking-wide text-muted-ink mb-1.5">
                Clinic
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-ink z-10 pointer-events-none" />
                <Select value={clinic} onValueChange={setClinic}>
                  <SelectTrigger id="search-clinic" className="pl-10 min-h-12 bg-white text-base">
                    <SelectValue placeholder="All clinics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All clinics</SelectItem>
                    {[...REAL_CLINICS]
                      .sort((a, b) => a.clinicName.localeCompare(b.clinicName))
                      .map((c) => (
                        <SelectItem key={c.slug} value={c.slug}>
                          {c.clinicName} &middot; {c.city}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label htmlFor="search-budget" className="block text-xs font-semibold uppercase tracking-wide text-muted-ink mb-1.5">
                Budget
              </label>
              <div className="relative">
                <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-ink z-10 pointer-events-none" />
                <Select value={budget} onValueChange={setBudget}>
                  <SelectTrigger id="search-budget" className="pl-10 min-h-12 bg-white text-base">
                    <SelectValue placeholder="Any budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any budget</SelectItem>
                    {BUDGET_OPTIONS[FROM_LEGACY[serviceType]].map((b) => (
                      <SelectItem key={b} value={String(b)}>
                        Up to £{b.toLocaleString('en-GB')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            className="w-full sm:w-auto mt-6 h-12 px-10 bg-blush hover:bg-peach text-ink font-semibold text-base"
            onClick={runCompare}
          >
            <Search className="w-4 h-4 mr-2" aria-hidden="true" />
            Search clinics
          </Button>
        </div>
      </section>

      {/* Guides */}
      <section className="mb-16" aria-labelledby="guides-heading">
        <div className="mb-6">
          <h2 id="guides-heading" className="text-2xl md:text-4xl font-semibold tracking-tight text-ink mb-2">
            Read up before you decide
          </h2>
          <p className="text-muted-ink text-sm md:text-base">
            Plain-language guides to each option, what the numbers mean, and what it actually costs — so you can ask
            better questions.
          </p>
        </div>

        {/* Four cards side by side from md up; on mobile the dots page through them. */}
        <div className="relative overflow-hidden">
          <ul
            className="flex gap-4 transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(calc(-${topicIndex} * (100% + 1rem)))` }}
          >
            {GUIDE_TOPICS.map((topic) => (
              <li key={topic.label} className="relative flex-shrink-0 w-full md:w-[calc(25%-12px)]">
                <Link
                  to={`/guides/${CATEGORY_SLUGS[topic.category]}`}
                  className="relative block rounded-2xl overflow-hidden h-[400px] group text-left"
                >
                  <ImageWithFallback
                    src={topic.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white/90 text-xs font-semibold uppercase tracking-wide mb-2">{topic.category}</div>
                    <h3 className="text-white text-xl leading-snug mb-3">{topic.label}</h3>
                    <span className="inline-flex items-center gap-1.5 text-white text-sm font-semibold">
                      Read the guide
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex md:hidden justify-center mt-2" role="group" aria-label="Choose a guide">
          {GUIDE_TOPICS.map((topic, idx) => (
            <button
              key={topic.label}
              type="button"
              onClick={() => setTopicIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={topicIndex === idx ? 'true' : undefined}
              className="w-11 h-11 flex items-center justify-center rounded-full"
            >
              <span
                className={`block w-2 h-2 rounded-full transition-colors ${topicIndex === idx ? 'bg-ink' : 'bg-muted-ink/40'}`}
              />
            </button>
          ))}
        </div>
      </section>

      <div className="mb-16">
        <ResearchFindings />
      </div>

      {/* Why we built this */}
      <section className="mb-16" aria-labelledby="why-heading">
        <div className="glass rounded-2xl p-8 md:p-10 max-w-3xl">
          <Eyebrow>Why we built this</Eyebrow>
          <h2 id="why-heading" className="text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-3 text-balance">
            Fertility care is hard enough. Finding it shouldn&rsquo;t be.
          </h2>
          <p className="text-muted-ink leading-relaxed mb-5">
            I&rsquo;m {SITE.founder}. I built {SITE.name} as a non-profit because {SITE.founderReason}. Everything here
            follows your country&rsquo;s official healthcare guidelines and what women told us in our research.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 min-h-11 text-sm font-semibold text-peach-deep hover:gap-2.5 transition-all"
          >
            Read the full story
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-semibold tracking-tight text-ink mb-8">
          Finding fertility treatment with JourneyFertility
        </h2>
        <FaqList faqs={FAQS} open={openFaq} onToggle={(i) => setOpenFaq((p) => ({ ...p, [i]: !p[i] }))} />
      </section>
    </>
  );
}

export function FaqList({
  faqs,
  open,
  onToggle,
}: {
  faqs: typeof FAQS;
  open: Record<number, boolean>;
  onToggle: (index: number) => void;
}) {
  const half = Math.floor(faqs.length / 2);
  const columns = [faqs.slice(0, half), faqs.slice(half)];
  return (
    <div className="grid md:grid-cols-2 gap-x-8">
      {columns.map((col, c) => (
        <div key={c}>
          {col.map((faq, j) => {
            const i = c === 0 ? j : half + j;
            return (
              <div key={faq.question} className="border-b border-ink/15 mb-2">
                <h3 className="text-base font-normal">
                  <button
                    type="button"
                    onClick={() => onToggle(i)}
                    aria-expanded={!!open[i]}
                    aria-controls={`faq-panel-${i}`}
                    className="w-full min-h-11 py-2 flex items-center justify-between gap-4 text-left rounded-md"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform motion-reduce:transition-none ${open[i] ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                {open[i] && (
                  <p id={`faq-panel-${i}`} className="text-muted-ink pb-4">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
