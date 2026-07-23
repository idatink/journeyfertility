import { useState, useEffect } from 'react';
import { Search, PoundSterling, Menu, User, ChevronDown, ChevronRight, Building2, Snowflake, Baby, Activity, Sparkles, HeartPulse } from 'lucide-react';
import { Button } from './components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './components/ui/select';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { ClinicCostings } from './components/ClinicCostings';
import { SelfAssessmentQuiz } from './components/SelfAssessmentQuiz';
import { Resources } from './components/Resources';
import { BUDGET_BRACKETS } from './lib/budget';
import { About } from './components/About';
import { PrivacyNotice } from './components/PrivacyNotice';
import heroImage from '../assets/hero.jpg';
import eggFreezingBanner from '../assets/SOMEDAYBANNER.jpg';
import embryoBanner from '../assets/EMBRYOFREEZINGBANNER.jpg';
import ivfBanner from '../assets/IVFBANNER.jpg';
import testingBanner from '../assets/TESTINGBANNER.jpg';
import story1 from '../assets/photos/story-1.jpg';
import story2 from '../assets/photos/story-2.jpg';
import story3 from '../assets/photos/story-3.jpg';
import story4 from '../assets/photos/story-4.jpg';

const CONFIDENCE_WORDS = ['clarity', 'confidence', 'calm', 'control', 'certainty', 'support'];

const SERVICE_TABS = [
  { id: 'egg-freezing', label: 'Egg Freezing' },
  { id: 'embryo', label: 'Embryo Freezing' },
  { id: 'ivf', label: 'IVF Treatment' },
  { id: 'fertility', label: 'Fertility Testing' },
] as const;

/**
 * Per-service wording, so the UI never calls a fertility test a "clinic" or a
 * clinic search a "test". Fertility testing is the odd one out — it's mostly
 * at-home kits and direct-pay providers, not clinic cycles — so it gets its own
 * copy; the three treatment services share the clinic wording.
 */
const CLINIC_META = {
  compareHeading: 'Compare clinics and their all-in costs',
  compareSub:
    'Pick a service, then narrow by clinic and budget. Real UK clinics, each shown with its own published price where the clinic publishes one.',
  cta: 'Search clinics',
  learnLede: 'What would be most useful to understand right now?',
};

const SERVICE_META: Record<
  string,
  { compareHeading: string; compareSub: string; cta: string; learnLede: string }
> = {
  'egg-freezing': CLINIC_META,
  embryo: CLINIC_META,
  ivf: CLINIC_META,
  fertility: {
    compareHeading: 'Compare fertility tests and clinic checks',
    compareSub:
      'Start with an at-home test kit or a clinic check. Real UK providers, each shown with its own published price.',
    cta: 'Compare fertility tests',
    learnLede: 'Understanding your fertility health?',
  },
};

const STAGES = [
  {
    id: 'testing-30',
    age: '30',
    service: 'fertility',
    tag: 'Fertility testing',
    icon: Activity,
    statement: "I'm not sure about kids yet — but I want to check where I stand.",
  },
  {
    id: 'eggs-30',
    age: '30',
    service: 'egg-freezing',
    tag: 'Egg freezing',
    icon: Snowflake,
    statement: "I want kids — just not right now.",
  },
  {
    id: 'ivf-35',
    age: '35',
    service: 'ivf',
    tag: 'IVF treatment',
    icon: Baby,
    statement: "I'd love to have more kids soon.",
  },
  {
    id: 'eggs-25',
    age: '25',
    service: 'fertility',
    tag: 'Start with fertility testing',
    icon: Sparkles,
    statement: "I might freeze my eggs someday.",
  },
  {
    id: 'embryo-40',
    age: '40',
    service: 'embryo',
    tag: 'Embryo freezing + hormone checks',
    icon: HeartPulse,
    statement: "I want more kids and to freeze embryos — and keep an eye on my hormones.",
  },
];

/**
 * A short "what it is / how it works" explainer shown above the search for each
 * service, so someone who arrives from a life-stage prompt understands the
 * treatment before they start comparing clinics. The steps are a real sequence,
 * so they are numbered.
 */
const SERVICE_EXPLAINERS: Record<
  string,
  { title: string; lede: string; steps: { h: string; p: string }[]; note: string }
> = {
  fertility: {
    title: 'What a fertility check tells you',
    lede:
      "A fertility check is a snapshot of your reproductive health — usually a simple blood test, often with an ultrasound scan. It won't tell you whether you can have children, but it tells you where you stand now, so you can plan with facts instead of guesswork.",
    steps: [
      {
        h: 'A blood test',
        p: 'Measures key hormones — including AMH, a marker of how many eggs you have left, plus FSH and others that show how your ovaries are working.',
      },
      {
        h: 'An ultrasound scan',
        p: 'Counts your antral follicles — the small resting follicles that give a second read on your egg reserve.',
      },
      {
        h: 'Your results, explained',
        p: 'Together these estimate your ovarian reserve. A clinic — or an at-home kit — walks you through what the numbers mean for your own timeline.',
      },
    ],
    note: 'Testing is the usual first step before deciding on egg freezing or IVF. You can start with an at-home kit or book directly with a clinic.',
  },
  'egg-freezing': {
    title: 'How egg freezing works',
    lede:
      "Egg freezing preserves unfertilised eggs so you can try to use them later. It keeps your options open — it is not a guarantee, and how well it works depends a lot on your age when you freeze.",
    steps: [
      {
        h: 'Stimulation (about 2 weeks)',
        p: 'Daily hormone injections encourage your ovaries to mature several eggs in one cycle, with a few short monitoring scans along the way.',
      },
      {
        h: 'Egg collection',
        p: 'A short procedure under sedation collects the mature eggs — usually around 15–20 minutes.',
      },
      {
        h: 'Freezing & storage',
        p: 'The eggs are frozen (vitrified) and stored. You pay an annual storage fee, and thaw them if and when you are ready.',
      },
    ],
    note: 'A fertility check first tells you how many eggs you are likely to collect, which shapes whether freezing is worth it for you now.',
  },
  ivf: {
    title: 'How IVF works',
    lede:
      "IVF fertilises eggs with sperm in a lab, then places an embryo back in the womb. It is the most established fertility treatment, and success rates vary sharply with age.",
    steps: [
      {
        h: 'Stimulation & collection',
        p: 'Hormones mature several eggs over about two weeks; a short procedure then collects them.',
      },
      {
        h: 'Fertilisation in the lab',
        p: 'Eggs and sperm are combined (or a single sperm injected — ICSI), and the resulting embryos are grown for a few days.',
      },
      {
        h: 'Embryo transfer',
        p: 'One embryo is transferred to the womb; any others can be frozen for later.',
      },
    ],
    note: 'Clinics publish success rates by age with the HFEA — we link you to each clinic’s verified results.',
  },
  embryo: {
    title: 'How embryo freezing works',
    lede:
      "Embryo freezing follows the same path as IVF, but instead of transferring an embryo now, the embryos are frozen and stored for the future — often chosen by couples preserving together.",
    steps: [
      { h: 'Stimulation & collection', p: 'Hormones mature eggs; a short procedure collects them.' },
      { h: 'Fertilisation', p: 'The eggs are fertilised with sperm in the lab and grown into embryos.' },
      {
        h: 'Freezing & storage',
        p: 'The embryos are frozen and stored, ready to transfer when the time is right.',
      },
    ],
    note: 'Keeping an eye on your hormones over time helps you choose the right moment.',
  },
};

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduce;
}

function RotatingWord() {
  const reduceMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Reduced-motion: hold on the first word, no flipping.
    if (reduceMotion) return;
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % CONFIDENCE_WORDS.length);
        setShow(true);
      }, 350);
    }, 2400);
    return () => clearInterval(interval);
  }, [reduceMotion]);

  // min-width stops the sub-headline reflowing as the word width changes;
  // motion-safe keeps the fade off under reduced-motion.
  return (
    <span
      className={`grain inline-flex justify-center min-w-[5.5ch] bg-[#F8AD7C] text-[#2F3440] font-bold px-2 rounded-md motion-safe:transition-all motion-safe:duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
      }`}
    >
      {CONFIDENCE_WORDS[index]}
    </span>
  );
}

export default function App() {
  const [serviceType, setServiceType] = useState('egg-freezing');
  const [showFAQ, setShowFAQ] = useState<Record<number, boolean>>({});
  const [viewMode, setViewMode] = useState<'home' | 'costings' | 'resources' | 'about' | 'privacy'>('home');
  const [resourcesCategory, setResourcesCategory] = useState('All');
  const [location, setLocation] = useState('all');
  const [clinic, setClinic] = useState('all');
  const [budgetRange, setBudgetRange] = useState('all');

  // Filter ids are namespaced per service — a budget bracket or clinic chosen
  // for one service is meaningless for another. Clear them whenever the service
  // changes rather than leaving a stale id that silently filters everything out.
  useEffect(() => {
    setBudgetRange('all');
    setClinic('all');
    setLocation('all');
  }, [serviceType]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [topicIndex, setTopicIndex] = useState(0);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  /**
   * Entry points into the guides. Deliberately makes no claim about the people
   * in the photographs: no names, no quotes, no conditions. The images are
   * illustrative and are labelled as such in the UI.
   */
  const journeyTopics = [
    {
      label: 'Thinking about freezing your eggs',
      category: 'Egg Freezing',
      image: story1,
    },
    {
      label: 'Understanding your fertility',
      category: 'Fertility Testing',
      image: story2,
    },
    {
      label: 'Considering IVF',
      category: 'IVF',
      image: story3,
    },
    {
      label: 'Working out what it costs',
      category: 'Costs & Planning',
      image: story4,
    },
  ];

  const toggleFAQ = (index: number) => {
    setShowFAQ(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSearch = () => {
    setViewMode('costings');
  };

  return (
    <div className="min-h-screen text-[#2F3440]">
      {/* Header */}
      <header className="border-b border-[#A8BEEB]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-xl font-bold tracking-tight text-[#2F3440] cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setViewMode('home')}
            >
              JourneyFertility
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => {
                setViewMode('about');
                window.scrollTo(0, 0);
              }}
              className="text-gray-700 hover:text-gray-900"
            >
              About
            </button>
            <button
              onClick={() => {
                setResourcesCategory('All');
                setViewMode('resources');
                window.scrollTo(0, 0);
              }}
              className="text-gray-700 hover:text-gray-900"
            >
              Resources
            </button>
            <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5] focus-visible:ring-offset-2">
              <User className="w-4 h-4" />
              Sign in
            </button>
          </nav>

          <button
            type="button"
            className="md:hidden rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5] focus-visible:ring-offset-2"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen((o) => !o)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav id="mobile-menu" className="md:hidden border-t border-[#A8BEEB]/20 px-6 py-4 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => { setViewMode('about'); setMobileMenuOpen(false); window.scrollTo(0, 0); }}
              className="text-left py-2 text-[#2F3440] hover:text-[#5B6AA5]"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => { setResourcesCategory('All'); setViewMode('resources'); setMobileMenuOpen(false); window.scrollTo(0, 0); }}
              className="text-left py-2 text-[#2F3440] hover:text-[#5B6AA5]"
            >
              Resources
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 text-left py-2 text-[#2F3440] hover:text-[#5B6AA5]"
            >
              <User className="w-4 h-4" />
              Sign in
            </button>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {viewMode === 'home' && (
        <>
        {/* Hero Heading */}
        <div className="mb-16 md:mb-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5B6AA5] mb-4">
            Fertility Clinic &amp; Cost Comparison
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-[#2F3440] mb-5">
            Your fertility options. One simple search.
          </h1>
          <p className="text-lg md:text-2xl text-[#5C6478] max-w-2xl leading-relaxed mb-8">
            Navigate your fertility journey without the anxiety — with{' '}
            <RotatingWord />
          </p>

          {/* How it works */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
            {[
              { n: '1', label: 'Search & compare' },
              { n: '2', label: 'See true all-in costs' },
              { n: '3', label: 'Book with the clinic' },
            ].map((step, idx) => (
              <div key={step.n} className="flex items-center gap-2">
                <div className="flex items-center gap-2 grain glass rounded-full pl-1.5 pr-4 py-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#2F3440] text-white text-xs font-semibold flex items-center justify-center">
                    {step.n}
                  </span>
                  <span className="text-sm font-medium text-[#2F3440] whitespace-nowrap">{step.label}</span>
                </div>
                {idx < 2 && <ChevronRight className="hidden sm:block w-4 h-4 text-[#A8BEEB] shrink-0" />}
              </div>
            ))}
          </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            <ImageWithFallback
              src={heroImage}
              alt="A woman in the golden evening light, calm and hopeful about her fertility options"
              className="w-full h-[360px] md:h-[460px] lg:h-[560px] object-cover object-[50%_22%] rounded-xl"
            />
            <div className="absolute bottom-4 left-4 grain glass-strong rounded-xl px-4 py-3">
              <div className="text-sm font-semibold text-[#2F3440] leading-tight">Real UK clinics</div>
              <div className="text-xs text-[#5C6478]">published costs, side by side</div>
            </div>
          </div>
        </div>

        {/* Stage selector */}
        <div className="mb-16 md:mb-24">
          <div className="max-w-2xl mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#2F3440] mb-3">
              Where are you right now?
            </h2>
            <p className="text-[#5C6478] text-lg leading-relaxed">
              Everyone's journey looks different. Pick the line that sounds most like you and we'll tailor your search.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STAGES.map((stage) => {
              const Icon = stage.icon;
              const active = selectedStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    // Take the user straight to the tailored comparison. A
                    // scroll-to-search left the actual results below the fold
                    // and read as "nothing happened".
                    setServiceType(stage.service);
                    setSelectedStage(stage.id);
                    setViewMode('costings');
                    window.scrollTo(0, 0);
                  }}
                  className={`group text-left rounded-2xl border p-6 transition-all duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5] focus-visible:ring-offset-2 ${
                    active
                      ? 'border-[#F8AD7C] bg-[#FDEEE1] ring-2 ring-[#F8AD7C]'
                      : 'glass hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(120,140,200,0.22)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-full bg-[#DEE8FF]/50 flex items-center justify-center text-[#5B6AA5]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="grain text-[11px] font-semibold uppercase tracking-wide text-[#5B6AA5] bg-[#DEE8FF]/60 px-3 py-1 rounded-full">
                      Age {stage.age}
                    </span>
                  </div>
                  <p className="text-lg text-[#2F3440] leading-snug mb-6 min-h-[3.5rem]">
                    “{stage.statement}”
                  </p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#5B6AA5]">
                    {stage.tag}
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div id="search" className="scroll-mt-6 mb-16">
          <div className="glass rounded-2xl p-6 md:p-8 shadow-[0_18px_60px_rgba(120,140,200,0.18)]">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#2F3440] mb-1.5">
              {SERVICE_META[serviceType].compareHeading}
            </h2>
            <p className="text-[#5C6478] mb-6 max-w-xl">
              {SERVICE_META[serviceType].compareSub}
            </p>

            {/* Service selector, inside the search */}
            <div
              role="tablist"
              aria-label="Choose a service"
              className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-white/50 mb-6"
            >
              {SERVICE_TABS.map((s) => {
                const active = serviceType === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setServiceType(s.id)}
                    className={`grain flex-1 min-w-[8rem] text-sm font-semibold px-4 py-2.5 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5] focus-visible:ring-offset-2 ${
                      active ? 'bg-[#2F3440] text-white shadow-sm' : 'text-[#2F3440] hover:bg-white/70'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* What this service is + how it works, so someone arriving from a
                life-stage prompt understands it before comparing clinics. */}
            {(() => {
              const ex = SERVICE_EXPLAINERS[serviceType];
              if (!ex) return null;
              return (
                <div className="mb-6 rounded-2xl bg-[#DEE8FF]/35 border border-[#A8BEEB]/25 p-5">
                  <h3 className="text-base font-semibold text-[#2F3440] mb-1.5">{ex.title}</h3>
                  <p className="text-sm text-[#5C6478] leading-relaxed mb-4 max-w-2xl">{ex.lede}</p>
                  <ol className="grid gap-3 sm:grid-cols-3 mb-4">
                    {ex.steps.map((step, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span className="grain shrink-0 w-6 h-6 rounded-full bg-[#F8AD7C] text-[#2F3440] text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-[#2F3440] leading-tight">{step.h}</div>
                          <div className="text-xs text-[#5C6478] leading-snug mt-0.5">{step.p}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="text-xs text-[#5C6478] leading-relaxed">
                    <span className="font-semibold text-[#5B6AA5]">Good to know:</span> {ex.note}
                  </p>
                </div>
              );
            })()}

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search-clinic" className="block text-xs font-semibold uppercase tracking-wide text-[#5C6478] mb-1.5">
                  Clinic
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6478] z-10 pointer-events-none" />
                  <Select value={clinic} onValueChange={setClinic}>
                    <SelectTrigger id="search-clinic" className="pl-10 min-h-12 bg-white text-base">
                      <SelectValue placeholder="All clinics" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All clinics</SelectItem>
                      <SelectItem value="crgh">CRGH &mdash; London</SelectItem>
                      <SelectItem value="create-fertility">CREATE Fertility &mdash; London &amp; nationwide</SelectItem>
                      <SelectItem value="manchester-fertility">Manchester Fertility &mdash; Manchester</SelectItem>
                      <SelectItem value="care-fertility">Care Fertility &mdash; nationwide</SelectItem>
                      <SelectItem value="lister-fertility">The Lister Fertility Clinic &mdash; London</SelectItem>
                      <SelectItem value="argc">ARGC &mdash; London</SelectItem>
                      <SelectItem value="bourn-hall">Bourn Hall Clinic &mdash; Cambridge</SelectItem>
                      <SelectItem value="tfp-oxford">TFP Oxford Fertility &mdash; Oxford</SelectItem>
                      <SelectItem value="guys-st-thomas">Guy&rsquo;s &amp; St Thomas&rsquo; &mdash; London</SelectItem>
                      <SelectItem value="newlife-fertility">NewLife Fertility &mdash; Kent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label htmlFor="search-budget" className="block text-xs font-semibold uppercase tracking-wide text-[#5C6478] mb-1.5">
                  Budget
                </label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6478] z-10 pointer-events-none" />
                  <Select value={budgetRange} onValueChange={setBudgetRange}>
                    <SelectTrigger id="search-budget" className="pl-10 min-h-12 bg-white text-base">
                      <SelectValue placeholder="Any budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any budget</SelectItem>
                      {BUDGET_BRACKETS[serviceType].map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button
              className="w-full sm:w-auto mt-6 h-12 px-10 bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold text-base"
              onClick={handleSearch}
            >
              <Search className="w-4 h-4 mr-2" />
              {SERVICE_META[serviceType].cta}
            </Button>
          </div>
        </div>
        </>
        )}

        {/* Clinic Costings View */}
        {viewMode === 'costings' && (
          <div className="mb-8">
            <Button 
              variant="outline" 
              className="mb-6"
              onClick={() => setViewMode('home')}
            >
              ← Back to Search
            </Button>
            <ClinicCostings
              serviceType={serviceType}
              location={location}
              clinic={clinic}
              budgetRange={budgetRange}
              onShowPrivacy={() => {
                setViewMode('privacy');
                window.scrollTo(0, 0);
              }}
            />
          </div>
        )}

        {/* Resources */}
        {viewMode === 'resources' && (
          <Resources onBack={() => setViewMode('home')} initialCategory={resourcesCategory} />
        )}

        {/* Privacy notice */}
        {viewMode === 'privacy' && <PrivacyNotice onBack={() => setViewMode('home')} />}

        {/* About */}
        {viewMode === 'about' && (
          <About
            onBack={() => setViewMode('home')}
            onExplore={() => {
              setViewMode('home');
              setTimeout(
                () => document.getElementById('search')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }),
                100
              );
            }}
            onResources={() => {
              setResourcesCategory('All');
              setViewMode('resources');
              window.scrollTo(0, 0);
            }}
          />
        )}

        {/* Home Content */}
        {viewMode === 'home' && (
          <>
        {/* Featured Destination Card with Lab Visuals */}
        {/*
          The banner is a fixed-height image with a bottom-anchored text overlay
          on desktop. On mobile that fixed height (h-64) is shorter than the
          content, and because the overlay was `absolute inset-0` inside an
          `overflow-hidden` box, the top of the heading got clipped. So on mobile
          we let the content drive the height (overlay is `relative`, image sits
          behind as an absolute background); from md up we restore the original
          fixed-height, bottom-anchored banner exactly as before.
        */}
        <div className="relative rounded-lg overflow-hidden mb-8 md:h-80 lg:h-96">
          <ImageWithFallback
            src={
              serviceType === 'egg-freezing'
                ? eggFreezingBanner
                : serviceType === 'embryo'
                ? embryoBanner
                : serviceType === 'ivf'
                ? ivfBanner
                : testingBanner
            }
            alt={
              serviceType === 'egg-freezing'
                ? "Soft peach forms evoking preserved potential"
                : serviceType === 'embryo'
                ? "Culture dishes in cool tones, embryo storage"
                : serviceType === 'ivf'
                ? "Laboratory culture dishes with a pipette"
                : "A softly lit orb in blue and rose, diagnostic testing"
            }
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative md:absolute md:inset-0 bg-gradient-to-t from-white/95 via-white/70 to-white/10 flex flex-col justify-end p-8 md:p-12">
            <div className="max-w-3xl">
              <span className="grain inline-block px-3 py-1 bg-[#F8AD7C] text-[#2F3440] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                Not sure where to start?
              </span>
              <h2 className="text-[#2F3440] text-3xl md:text-5xl font-semibold tracking-tight mb-4 leading-tight">
                A few questions to help you work out what to look into first.
              </h2>
              <p className="text-[#5C6478] text-sm md:text-base mb-6 max-w-xl leading-relaxed">
                A short, private self-assessment. Your answers stay in your browser — nothing is
                saved or sent. It just points you to the parts of the comparison and the guides that
                are most relevant to where you are.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold px-8 h-12" onClick={() => setShowQuiz(true)}>
                  Take the self-assessment
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-[#2F3440] mb-2">
                Read up before you decide
              </h2>
              <p className="text-[#5C6478] text-sm md:text-base">
                Plain-language guides to each option, what the numbers mean, and what it actually
                costs — so you can ask better questions.
              </p>
            </div>
          </div>

          {/* All four cards fit side by side from md up, so no pagination is
              needed there. The mobile dots (below, hidden on desktop) are the
              only control that changes topicIndex, so on desktop it stays 0 and
              the track sits at translateX(0). The calc accounts for the gap so
              mobile slides land flush. */}
          <div className="relative overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(calc(-${topicIndex} * (100% + 1rem)))` }}
            >
              {journeyTopics.map((topic, idx) => (
                <button
                  key={idx}
                  className="relative flex-shrink-0 w-full md:w-[calc(25%-12px)] rounded-2xl overflow-hidden h-[400px] md:h-[400px] group text-left"
                  onClick={() => {
                    setResourcesCategory(topic.category);
                    setViewMode('resources');
                    window.scrollTo(0, 0);
                  }}
                >
                  <ImageWithFallback
                    src={topic.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white/80 text-xs font-semibold uppercase tracking-wide mb-2">
                      {topic.category}
                    </div>
                    <h3 className="text-white text-xl leading-snug mb-3">{topic.label}</h3>
                    <span className="inline-flex items-center gap-1.5 text-white text-sm font-semibold">
                      Read the guides
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex md:hidden justify-center gap-2 mt-4">
            {journeyTopics.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTopicIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  topicIndex === idx ? 'bg-[#2F3440]' : 'bg-[#DADADA]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-[#2F3440] mb-8">Finding fertility treatment with JourneyFertility</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {[
                {
                  question: "How does JourneyFertility work?",
                  answer: "We break clinic quotes into their real line items — treatment, medication, storage and extras — so you can compare like with like. Search by treatment, location and budget, then see the full cost of each option in one place."
                },
                {
                  question: "How can I find the most affordable fertility clinic using JourneyFertility?",
                  answer: "Filter by treatment, region and budget, and compare the full all-in cost of each clinic — including medication, storage and extras, not just the headline fee. You can also filter by funding route to see NHS-funded and private options."
                },
                {
                  question: "Do I book my treatment directly with JourneyFertility?",
                  answer: "No — we are a comparison service, not a clinic. When you are ready, you send an enquiry through us and the clinic you chose gets in touch to arrange a consultation. The treatment itself is always booked and provided by the clinic."
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={!!showFAQ[index]}
                    aria-controls={`faq-panel-${index}`}
                    className="w-full flex items-center justify-between text-left rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5] focus-visible:ring-offset-2"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 shrink-0 transition-transform motion-reduce:transition-none ${showFAQ[index] ? 'rotate-180' : ''}`} />
                  </button>
                  {showFAQ[index] && (
                    <p id={`faq-panel-${index}`} className="text-gray-600 mt-4">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>

            <div>
              {[
                {
                  question: "Can I use NHS funding for fertility treatment?",
                  answer: "Sometimes. NHS-funded fertility treatment exists but eligibility and how many cycles are covered vary by area. Where a clinic offers an NHS-funded route we flag it with the funding filter, so you can compare that alongside private prices."
                },
                {
                  question: "What should my fees cover?",
                  answer: "We show you a complete breakdown of costs including consultation, procedures, medications, storage fees, and any additional services."
                },
                {
                  question: "What is a Success Rate?",
                  answer: "Success rates show the percentage of successful pregnancies or viable embryos from treatments at each clinic. We provide transparent data to help you make informed choices."
                },
                {
                  question: "Where do the prices and success rates come from?",
                  answer: "Prices come from each clinic's own published price list where they publish one; clinics that don't publish show 'request a quote' rather than a made-up figure, and medications are always quoted separately. For success rates we link to each clinic's verified results on the HFEA register — the UK regulator's own figures — rather than reproduce them ourselves."
                }
              ].map((faq, index) => (
                <div key={index + 3} className="border-b border-gray-200 pb-4 mb-4">
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index + 3)}
                    aria-expanded={!!showFAQ[index + 3]}
                    aria-controls={`faq-panel-${index + 3}`}
                    className="w-full flex items-center justify-between text-left rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5] focus-visible:ring-offset-2"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 shrink-0 transition-transform motion-reduce:transition-none ${showFAQ[index + 3] ? 'rotate-180' : ''}`} />
                  </button>
                  {showFAQ[index + 3] && (
                    <p id={`faq-panel-${index + 3}`} className="text-gray-600 mt-4">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

          </>
        )}

      </div>

      {/* Private self-assessment — one signpost that routes to the right
          comparison or to the guides, whatever service is currently selected. */}
      {showQuiz && (
        <SelfAssessmentQuiz
          onClose={() => setShowQuiz(false)}
          onPick={(service) => {
            setServiceType(service);
            setViewMode('costings');
            setShowQuiz(false);
            window.scrollTo(0, 0);
          }}
          onResources={() => {
            setResourcesCategory('All');
            setViewMode('resources');
            setShowQuiz(false);
            window.scrollTo(0, 0);
          }}
        />
      )}

      {/* Testimonial Modal */}

      {/* Footer */}
      <footer className="bg-[#2F3440] text-[#F7F8FC] mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">FAQs & support</a></li>
                <li><a href="#" className="hover:text-white">Contact us</a></li>
                <li><a href="#" className="hover:text-white">Log in</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button
                    onClick={() => {
                      setViewMode('privacy');
                      window.scrollTo(0, 0);
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    Privacy policy
                  </button>
                </li>
                <li><a href="#" className="hover:text-white">Terms of service</a></li>
                <li><a href="#" className="hover:text-white">Company details</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button
                    onClick={() => {
                      setViewMode('about');
                      window.scrollTo(0, 0);
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    About us
                  </button>
                </li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Partner clinics</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Explore</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button
                    onClick={() => {
                      setResourcesCategory('All');
                      setViewMode('resources');
                      window.scrollTo(0, 0);
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    Resources
                  </button>
                </li>
                <li><a href="#" className="hover:text-white">Partnerships</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>© 2026 JourneyFertility. All rights reserved.</p>
            <p className="mt-2">
              JourneyFertility is a comparison service, not a clinic. Nothing here is medical advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}