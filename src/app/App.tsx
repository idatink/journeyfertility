import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, DollarSign, Users, Heart, Menu, User, ChevronDown, Plus, ChevronLeft, ChevronRight, Snowflake, Baby, Activity, Sparkles, HeartPulse } from 'lucide-react';
import { Button } from './components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './components/ui/select';
import { Checkbox } from './components/ui/checkbox';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { ClinicCostings } from './components/ClinicCostings';
import { FertilityAssistantChat } from './components/FertilityAssistantChat';
import { SelfAssessmentQuiz } from './components/SelfAssessmentQuiz';
import { EmbryoFreezingQuiz } from './components/EmbryoFreezingQuiz';
import { IVFTreatmentQuiz } from './components/IVFTreatmentQuiz';
import { FertilityTestingQuiz } from './components/FertilityTestingQuiz';
import { EggFreezingInfo } from './components/EggFreezingInfo';
import { EmbryoFreezingInfo } from './components/EmbryoFreezingInfo';
import { IVFTreatmentInfo } from './components/IVFTreatmentInfo';
import { FertilityTestingInfo } from './components/FertilityTestingInfo';
import { MarketingAssets } from './components/MarketingAssets';
import { Resources } from './components/Resources';
import { BUDGET_BRACKETS } from './lib/budget';
import { About } from './components/About';
import { PrivacyNotice } from './components/PrivacyNotice';
import eggFreezingImage from 'figma:asset/837faeedfcc3fc383751b333377e75ebb80b8527.png';
import heroImage from '../assets/hero.jpg';
import eggFreezingBanner from '../assets/SOMEDAYBANNER.jpg';
import embryoBanner from '../assets/EMBRYOFREEZINGBANNER.jpg';
import ivfBanner from '../assets/IVFBANNER.jpg';
import testingBanner from '../assets/TESTINGBANNER.jpg';
import img_149389447389110fc1e5dbd22 from '../assets/photos/photo-1493894473891-10fc1e5dbd22.jpg';
import img_15796843851271ef15d508118 from '../assets/photos/photo-1579684385127-1ef15d508118.jpg';
import img_1609220136736443140cffec6 from '../assets/photos/photo-1609220136736-443140cffec6.jpg';
import img_161763843604076505e75940f from '../assets/photos/photo-1617638436040-76505e75940f.jpg';
import img_1633379204542430941769df3 from '../assets/photos/photo-1633379204542-430941769df3.jpg';
import img_17573473982067425300ef990 from '../assets/photos/photo-1757347398206-7425300ef990.jpg';
import img_1758518727888ffa196002e59 from '../assets/photos/photo-1758518727888-ffa196002e59.jpg';
import eggFreezingCard from '../assets/photos/egg-freezing-card.jpg';
import fertilityTestingCard from '../assets/photos/fertility-testing-card.jpg';

const CONFIDENCE_WORDS = ['clarity', 'confidence', 'calm', 'control', 'certainty', 'support'];

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
    service: 'egg-freezing',
    tag: 'Egg freezing',
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

function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % CONFIDENCE_WORDS.length);
        setShow(true);
      }, 350);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`grain inline-block bg-[#F8AD7C] text-[#2F3440] font-bold px-2 rounded-md transition-all duration-300 ${
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
  const [viewMode, setViewMode] = useState<'home' | 'costings' | 'egg-freezing-info' | 'embryo-info' | 'ivf-info' | 'fertility-info' | 'marketing' | 'resources' | 'about' | 'privacy'>('home');
  const [resourcesCategory, setResourcesCategory] = useState('All');
  const [searchMode, setSearchMode] = useState('clinic-costings');
  const [location, setLocation] = useState('all');
  const [clinic, setClinic] = useState('all');
  const [budgetRange, setBudgetRange] = useState('all');

  // Bracket ids are namespaced per service, so a bracket chosen for one service
  // is meaningless for another. Clear it whenever the service changes rather
  // than leaving a stale id that silently filters everything out.
  useEffect(() => {
    setBudgetRange('all');
  }, [serviceType]);
  const [showChat, setShowChat] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [scrollToClinics, setScrollToClinics] = useState(false);
  const [topicIndex, setTopicIndex] = useState(0);
  const [atHomeOnly, setAtHomeOnly] = useState(false);
  const [travelPackageIndex, setTravelPackageIndex] = useState(0);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  /**
   * Entry points into the guides. Deliberately makes no claim about the people
   * in the photographs: no names, no quotes, no conditions. The images are
   * illustrative and are labelled as such in the UI.
   */
  const journeyTopics = [
    {
      label: 'Thinking about freezing your eggs',
      category: 'Egg Freezing',
      image: img_1633379204542430941769df3,
    },
    {
      label: 'Understanding your fertility',
      category: 'Fertility Testing',
      image: img_1758518727888ffa196002e59,
    },
    {
      label: 'Considering IVF',
      category: 'IVF',
      image: img_17573473982067425300ef990,
    },
    {
      label: 'Working out what it costs',
      category: 'Costs & Planning',
      image: img_161763843604076505e75940f,
    },
  ];

  const toggleFAQ = (index: number) => {
    setShowFAQ(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSearch = () => {
    if (searchMode === 'clinic-costings') {
      setViewMode('costings');
    }
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
            <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
              <User className="w-4 h-4" />
              Sign in
            </button>
          </nav>
          
          <button className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>
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
              <div className="text-2xl font-bold text-[#2F3440] leading-none mb-1">500+</div>
              <div className="text-xs text-[#5C6478]">verified clinics worldwide</div>
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
                    setServiceType(stage.service);
                    setSelectedStage(stage.id);
                    setTimeout(
                      () => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
                      100
                    );
                  }}
                  className={`group text-left rounded-2xl border p-6 transition-all duration-200 ${
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

        {/* Browse by service */}
        <div id="search" className="scroll-mt-6 flex items-center justify-between flex-wrap gap-3 mb-4">
          <span className="text-sm font-medium text-[#5C6478]">Or browse by service</span>
          <div className="flex gap-2 flex-wrap">
            <Button variant={serviceType === 'egg-freezing' ? 'default' : 'outline'} size="sm" onClick={() => setServiceType('egg-freezing')} className={serviceType === 'egg-freezing' ? 'bg-[#2F3440] text-white hover:bg-[#434A5C]' : ''}>Egg Freezing</Button>
            <Button variant={serviceType === 'embryo' ? 'default' : 'outline'} size="sm" onClick={() => setServiceType('embryo')} className={serviceType === 'embryo' ? 'bg-[#2F3440] text-white hover:bg-[#434A5C]' : ''}>Embryo Freezing</Button>
            <Button variant={serviceType === 'ivf' ? 'default' : 'outline'} size="sm" onClick={() => setServiceType('ivf')} className={serviceType === 'ivf' ? 'bg-[#2F3440] text-white hover:bg-[#434A5C]' : ''}>IVF Treatment</Button>
            <Button variant={serviceType === 'fertility' ? 'default' : 'outline'} size="sm" onClick={() => setServiceType('fertility')} className={serviceType === 'fertility' ? 'bg-[#2F3440] text-white hover:bg-[#434A5C]' : ''}>Fertility Testing</Button>
          </div>
        </div>

        {/* Search Form */}
        <div className="glass rounded-2xl p-6 mb-16">
          <div className="flex items-center gap-2 mb-4">
            <Select value={searchMode} onValueChange={setSearchMode}>
              <SelectTrigger className="w-64 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clinic-costings">My clinic costings</SelectItem>
                <SelectItem value="clinic-comparison">Clinic comparison</SelectItem>
                <SelectItem value="combined-solutions">Combining 2 clinics - COSTS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fertility Testing Search Form */}
          {serviceType === 'fertility' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="pl-10 bg-white">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                                      <SelectItem value="all">All UK regions</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                  <SelectItem value="south-east">South East</SelectItem>
                  <SelectItem value="south-west">South West</SelectItem>
                  <SelectItem value="east-of-england">East of England</SelectItem>
                  <SelectItem value="west-midlands">West Midlands</SelectItem>
                  <SelectItem value="east-midlands">East Midlands</SelectItem>
                  <SelectItem value="north-west">North West</SelectItem>
                  <SelectItem value="north-east">North East</SelectItem>
                  <SelectItem value="yorkshire">Yorkshire and the Humber</SelectItem>
                  <SelectItem value="scotland">Scotland</SelectItem>
                  <SelectItem value="wales">Wales</SelectItem>
                  <SelectItem value="northern-ireland">Northern Ireland</SelectItem>
                </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                <Select value={clinic} onValueChange={setClinic}>
                  <SelectTrigger className="pl-10 bg-white">
                    <SelectValue placeholder="Testing Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Providers</SelectItem>
                    
                    {/* At-Home Test Kits */}
                    <SelectItem value="modern-fertility">Modern Fertility</SelectItem>
                    <SelectItem value="everlywell">Everlywell</SelectItem>
                    <SelectItem value="letsgetchecked">LetsGetChecked</SelectItem>
                    <SelectItem value="mylab-box">myLAB Box</SelectItem>
                    
                    {/* Local Testing Centers */}
                    <SelectItem value="hudson-reproductive">Hudson Reproductive Centre - New York</SelectItem>
                    <SelectItem value="charles-river-fertility">Charles River Fertility Testing Center</SelectItem>
                    <SelectItem value="bayfront-reproductive">Bayfront Reproductive Health Lab - San Francisco</SelectItem>
                    <SelectItem value="bosphorus-reproductive">Memorial Hospital Testing - Istanbul</SelectItem>
                    <SelectItem value="barcelona-fertility">Barcelona Fertility Clinic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                <Select value={budgetRange} onValueChange={setBudgetRange}>
                  <SelectTrigger className="pl-10 bg-white">
                    <SelectValue placeholder="Budget Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Budgets</SelectItem>
                    {BUDGET_BRACKETS[serviceType].map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            /* Standard Treatment Search Form */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="pl-10 bg-white">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                                    <SelectItem value="all">All UK regions</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                  <SelectItem value="south-east">South East</SelectItem>
                  <SelectItem value="south-west">South West</SelectItem>
                  <SelectItem value="east-of-england">East of England</SelectItem>
                  <SelectItem value="west-midlands">West Midlands</SelectItem>
                  <SelectItem value="east-midlands">East Midlands</SelectItem>
                  <SelectItem value="north-west">North West</SelectItem>
                  <SelectItem value="north-east">North East</SelectItem>
                  <SelectItem value="yorkshire">Yorkshire and the Humber</SelectItem>
                  <SelectItem value="scotland">Scotland</SelectItem>
                  <SelectItem value="wales">Wales</SelectItem>
                  <SelectItem value="northern-ireland">Northern Ireland</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
              <Select value={clinic} onValueChange={setClinic}>
                <SelectTrigger className="pl-10 bg-white">
                  <SelectValue placeholder="Preferred Clinic" />
                </SelectTrigger>
                <SelectContent>
                                    <SelectItem value="all">All Clinics</SelectItem>
                  <SelectItem value="thames-fertility">Thames Fertility Centre — London</SelectItem>
                  <SelectItem value="southbank-reproductive">Southbank Reproductive Health — London</SelectItem>
                  <SelectItem value="camden-ivf">Camden IVF Clinic — London</SelectItem>
                  <SelectItem value="mersey-fertility">Mersey Fertility Institute — Liverpool</SelectItem>
                  <SelectItem value="pennine-reproductive">Pennine Reproductive Centre — Manchester</SelectItem>
                  <SelectItem value="northern-lights-fertility">Northern Lights Fertility — Edinburgh</SelectItem>
                  <SelectItem value="clyde-reproductive">Clyde Reproductive Health — Glasgow</SelectItem>
                  <SelectItem value="severn-fertility">Severn Fertility Clinic — Bristol</SelectItem>
                  <SelectItem value="midlands-fertility">Midlands Fertility Institute — Birmingham</SelectItem>
                  <SelectItem value="wharfedale-reproductive">Wharfedale Reproductive Centre — Leeds</SelectItem>
                  <SelectItem value="cardiff-bay-fertility">Cardiff Bay Fertility — Cardiff</SelectItem>
                  <SelectItem value="lagan-fertility">Lagan Fertility Centre — Belfast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/*
              Appointment date filter removed: there is no clinic availability
              data behind it, so it could only ever appear to filter. It returns
              when clinics supply real availability.
            */}

            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
              <Select value={budgetRange} onValueChange={setBudgetRange}>
                <SelectTrigger className="pl-10 bg-white">
                  <SelectValue placeholder="Budget Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Budgets</SelectItem>
                  {BUDGET_BRACKETS[serviceType].map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          )}

          {/* Checkbox Filters */}
          {serviceType === 'fertility' ? (
            <div className="flex flex-wrap gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  className="bg-white" 
                  checked={atHomeOnly}
                  onCheckedChange={(checked) => setAtHomeOnly(checked as boolean)}
                />
                <span className="text-sm">At-home test kits only</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox className="bg-white" />
                <span className="text-sm">Same-day results available</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox className="bg-white" />
                <span className="text-sm">HSA/FSA eligible</span>
              </label>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 mb-4">
              
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox className="bg-white" />
                <span className="text-sm">Show options with insurance coverage only </span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox className="bg-white" />
                <span className="text-sm">Options with payment planning only</span>
              </label>
            </div>
          )}

          <Button className="w-full md:w-auto px-8 py-6 bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold" onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
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
              atHomeOnly={atHomeOnly}
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

        {/* Marketing Assets View */}
        {viewMode === 'marketing' && (
          <MarketingAssets onBack={() => setViewMode('home')} />
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
                () => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
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
        <div className="relative rounded-lg overflow-hidden mb-8 h-64 md:h-80 lg:h-96">
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
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/70 to-white/10 flex flex-col justify-end p-8 md:p-12">
            <div className="max-w-3xl">
              <span className="grain inline-block px-3 py-1 bg-[#F8AD7C] text-[#2F3440] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                Clinical Excellence & Transparency
              </span>
              <h2 className="text-[#2F3440] text-3xl md:text-5xl font-semibold tracking-tight mb-4 leading-tight">
                {serviceType === 'egg-freezing' && 'Science-Backed Egg Freezing. Full Lab Transparency.'}
                {serviceType === 'embryo' && 'Advanced Embryology Lab Standards & Storage.'}
                {serviceType === 'ivf' && 'World-Class IVF Labs. Transparent Clinical Data.'}
                {serviceType === 'fertility' && 'Precision Diagnostic Testing. Lab-Direct Results.'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-[#5C6478] text-sm md:text-base mb-6">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Expert Embryologists</span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> ISO Certified Facilities</span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> No Hidden Lab Fees</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold px-8 h-12" onClick={() => setShowQuiz(true)}>
                  Take Self-Assessment Quiz
                </Button>
                <Button variant="outline" className="glass border-white/70 text-[#2F3440] hover:bg-white/75 h-12 px-8">
                  View Lab Standards
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Lab Transparency Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-[#F8AD7C]/50 rounded-full flex items-center justify-center mb-4 text-[#5B6AA5]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h3 className="font-semibold mb-2">Certified Laboratories</h3>
            <p className="text-sm text-gray-600">Every clinic on our platform meets strict ISO 15189 standards for clinical laboratories.</p>
          </div>
          <div className="glass rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-[#F8AD7C]/50 rounded-full flex items-center justify-center mb-4 text-[#5B6AA5]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="font-semibold mb-2">Verified Success Rates</h3>
            <p className="text-sm text-gray-600">Lab-verified outcomes and audit reports available for every clinic listed.</p>
          </div>
          <div className="glass rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-[#F8AD7C]/50 rounded-full flex items-center justify-center mb-4 text-[#5B6AA5]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-semibold mb-2">Real-time Lab Access</h3>
            <p className="text-sm text-gray-600">Direct portal access to your embryology reports and high-res imaging.</p>
          </div>
        </div>

        {/* Category Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Button 
            variant="outline" 
            className="h-16 justify-start bg-white text-[#2F3440] border border-[#A8BEEB]/30 hover:bg-[#DEE8FF]/50 hover:text-[#2F3440]"
            onClick={() => {
              setScrollToClinics(true);
              if (serviceType === 'egg-freezing') setViewMode('egg-freezing-info');
              else if (serviceType === 'embryo') setViewMode('embryo-info');
              else if (serviceType === 'ivf') setViewMode('ivf-info');
              else if (serviceType === 'fertility') setViewMode('fertility-info');
              setTimeout(() => setScrollToClinics(false), 500);
            }}
          >
            <Heart className="w-5 h-5 mr-2" />
            {serviceType === 'egg-freezing' && 'Egg Freezing Clinics'}
            {serviceType === 'embryo' && 'Embryo Storage Clinics'}
            {serviceType === 'ivf' && 'IVF Clinics'}
            {serviceType === 'fertility' && 'Testing Centers'}
          </Button>
          <Button 
            variant="outline" 
            className="h-16 justify-start bg-white text-[#2F3440] border border-[#A8BEEB]/30 hover:bg-[#DEE8FF]/50 hover:text-[#2F3440]"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Find by Location
          </Button>
          <Button 
            variant="outline" 
            className="h-16 justify-start bg-white text-[#2F3440] border border-[#A8BEEB]/30 hover:bg-[#DEE8FF]/50 hover:text-[#2F3440]"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Consultation
          </Button>
          <Button 
            variant="outline" 
            className="h-16 justify-start bg-white text-[#2F3440] border border-[#A8BEEB]/30 hover:bg-[#DEE8FF]/50 hover:text-[#2F3440]"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Compare Costs
          </Button>
        </div>

        {/* Journey Section */}
        <div className="mb-16 bg-[#DEE8FF]/40 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#2F3440] mb-4">
                Get to know each <span className="italic text-[#5B6AA5]">option</span>
              </h2>
              <p className="text-[#5C6478] text-lg mb-6">
                {serviceType === 'egg-freezing' && 'What would be most useful to understand right now?'}
                {serviceType === 'embryo' && 'Ready to preserve your embryos?'}
                {serviceType === 'ivf' && 'Starting your IVF journey?'}
                {serviceType === 'fertility' && 'Understanding your fertility health?'}
              </p>
              <p className="text-gray-600">
                {serviceType === 'egg-freezing' && 'Explore real stories from people who\'ve walked this path. Learn about egg freezing, understand what to expect, and find the support you need.'}
                {serviceType === 'embryo' && 'Connect with clinics that offer secure embryo storage. Learn about the process, costs, and find the right facility for your family planning needs.'}
                {serviceType === 'ivf' && 'Discover clinics with proven IVF success rates. Learn about treatment protocols, costs, and connect with specialists who can help you achieve your dream of parenthood.'}
                {serviceType === 'fertility' && 'Get comprehensive fertility testing to understand your options. Learn about AMH levels, egg reserve, and receive personalized recommendations for your journey.'}
              </p>
            </div>

            {/* Right Content - Service Cards */}
            <div className="space-y-4">
              {/* Egg Freezing Card */}
              <div 
                className="relative rounded-xl overflow-hidden h-32 group cursor-pointer"
                onClick={() => setViewMode('egg-freezing-info')}
              >
                <img
                  src={eggFreezingCard}
                  alt=""
                  className="w-full h-full object-cover object-[50%_42%] transition-transform duration-300 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center justify-between px-6 ${serviceType === 'egg-freezing' ? 'ring-4 ring-[#F8AD7C]' : ''}`}>
                  <div>
                    <h3 className="text-white text-xl mb-1">Egg Freezing</h3>
                    <p className="text-white/90 text-sm">Preserve your fertility for the future</p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5 text-[#2F3440]" />
                  </button>
                </div>
              </div>

              {/* IVF Treatment Card */}
              <div 
                className="relative rounded-xl overflow-hidden h-32 group cursor-pointer"
                onClick={() => setViewMode('ivf-info')}
              >
                <ImageWithFallback
                  src={img_1609220136736443140cffec6}
                  alt="IVF treatment"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center justify-between px-6 ${serviceType === 'ivf' ? 'ring-4 ring-[#F8AD7C]' : ''}`}>
                  <div>
                    <h3 className="text-white text-xl mb-1">IVF Treatment</h3>
                    <p className="text-white/90 text-sm">Building your family through assisted reproduction</p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5 text-[#2F3440]" />
                  </button>
                </div>
              </div>

              {/* Embryo Freezing Card */}
              <div 
                className="relative rounded-xl overflow-hidden h-32 group cursor-pointer"
                onClick={() => setViewMode('embryo-info')}
              >
                <ImageWithFallback
                  src={img_149389447389110fc1e5dbd22}
                  alt="Embryo freezing"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center justify-between px-6 ${serviceType === 'embryo' ? 'ring-4 ring-[#F8AD7C]' : ''}`}>
                  <div>
                    <h3 className="text-white text-xl mb-1">Embryo Freezing</h3>
                    <p className="text-white/90 text-sm">Preserve embryos for future family planning</p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5 text-[#2F3440]" />
                  </button>
                </div>
              </div>

              {/* Fertility Testing Card */}
              <div 
                className="relative rounded-xl overflow-hidden h-32 group cursor-pointer"
                onClick={() => setViewMode('fertility-info')}
              >
                <ImageWithFallback
                  src={fertilityTestingCard}
                  alt=""
                  className="w-full h-full object-cover object-[50%_34%] transition-transform duration-300 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center justify-between px-6 ${serviceType === 'fertility' ? 'ring-4 ring-[#F8AD7C]' : ''}`}>
                  <div>
                    <h3 className="text-white text-xl mb-1">Fertility Testing</h3>
                    <p className="text-white/90 text-sm">Understand your fertility health and options</p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5 text-[#2F3440]" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-8 pt-8 border-t border-[#A8BEEB]/20 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Button className="bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold px-8">
                {serviceType === 'egg-freezing' && 'Explore Egg Freezing Clinics'}
                {serviceType === 'embryo' && 'Explore Embryo Storage Options'}
                {serviceType === 'ivf' && 'Explore IVF Treatment Centers'}
                {serviceType === 'fertility' && 'Find Testing Centers Near You'}
              </Button>
              <Button variant="outline" className="border-[#A8BEEB] text-[#2F3440] hover:bg-[#2F3440] hover:border-[#2F3440] hover:text-white px-8">
                Read Success Stories
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              {serviceType === 'egg-freezing' && 'Join thousands who\'ve taken control of their fertility future'}
              {serviceType === 'embryo' && 'Join families who\'ve successfully preserved their embryos'}
              {serviceType === 'ivf' && 'Join thousands who\'ve found their path to parenthood'}
              {serviceType === 'fertility' && 'Join thousands who\'ve taken the first step with testing'}
            </p>
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
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => setTopicIndex(Math.max(0, topicIndex - 1))}
                disabled={topicIndex === 0}
                className="w-12 h-12 rounded-full bg-[#E2E2E2] hover:bg-[#DADADA] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTopicIndex(Math.min(3, topicIndex + 1))}
                disabled={topicIndex >= 3}
                className="w-12 h-12 rounded-full bg-[#2F3440] hover:bg-[#434A5C] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${topicIndex * 100}%)` }}
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
                  answer: "Use our search filters to compare prices, read reviews, and find clinics that accept insurance. We show you all costs upfront so you can make an informed decision."
                },
                {
                  question: "Do I book my treatment directly with JourneyFertility?",
                  answer: "We connect you directly with fertility clinics. You'll be able to contact them, schedule consultations, and book your treatment through our secure platform."
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                  <button 
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showFAQ[index] ? 'rotate-180' : ''}`} />
                  </button>
                  {showFAQ[index] && (
                    <p className="text-gray-600 mt-4">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>

            <div>
              {[
                {
                  question: "Does JourneyFertility do insurance verification?",
                  answer: "Many of our partner clinics work with insurance providers. Use our insurance filter to find clinics that accept your coverage."
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
                  question: "Can I book fertility treatments abroad using JourneyFertility?",
                  answer: "Yes! We partner with accredited fertility clinics worldwide, helping you find quality care at competitive prices internationally."
                }
              ].map((faq, index) => (
                <div key={index + 3} className="border-b border-gray-200 pb-4 mb-4">
                  <button 
                    onClick={() => toggleFAQ(index + 3)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showFAQ[index + 3] ? 'rotate-180' : ''}`} />
                  </button>
                  {showFAQ[index + 3] && (
                    <p className="text-gray-600 mt-4">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Travel Package Example - London to Istanbul */}
        <div className="mt-12 bg-[#DEE8FF]/40 border border-[#A8BEEB]/20 rounded-2xl p-6 md:p-8">
          <h3 className="text-xl md:text-2xl mb-2">Example Travel Package</h3>
          <p className="text-gray-600 mb-6 text-sm md:text-base">London to Istanbul - Full Egg Freezing Package</p>
          
          {/* Mobile Slider */}
          <div className="md:hidden mb-6">
            <div className="relative overflow-hidden">
              <div
                className="flex gap-4 transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${travelPackageIndex * 100}%)` }}
              >
                {/* Flight Card */}
                <div className="flex-shrink-0 w-full bg-white rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold mb-1">Return Flight</h4>
                      <p className="text-sm text-gray-600">London → Istanbul</p>
                    </div>
                    <svg className="w-8 h-8 text-[#A8BEEB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <div className="text-2xl font-semibold text-[#5B6AA5]">£280</div>
                  <p className="text-xs text-gray-500 mt-1">Economy class, direct</p>
                </div>

                {/* Accommodation Card */}
                <div className="flex-shrink-0 w-full bg-white rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold mb-1">Accommodation</h4>
                      <p className="text-sm text-gray-600">7 nights, 4-star hotel</p>
                    </div>
                    <svg className="w-8 h-8 text-[#A8BEEB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="text-2xl font-semibold text-[#5B6AA5]">£420</div>
                  <p className="text-xs text-gray-500 mt-1">Near clinic, breakfast included</p>
                </div>

                {/* Treatment Card */}
                <div className="flex-shrink-0 w-full bg-white rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold mb-1">Egg Freezing</h4>
                      <p className="text-sm text-gray-600">Full cycle at Bosphorus Reproductive</p>
                    </div>
                    <svg className="w-8 h-8 text-[#A8BEEB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-semibold text-[#5B6AA5]">£2,100</div>
                  <p className="text-xs text-gray-500 mt-1">Including medications</p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setTravelPackageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    travelPackageIndex === idx ? 'bg-[#2F3440]' : 'bg-[#DADADA]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 mb-6">
            {/* Flight */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold mb-1">Return Flight</h4>
                  <p className="text-sm text-gray-600">London → Istanbul</p>
                </div>
                <svg className="w-8 h-8 text-[#A8BEEB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div className="text-2xl font-semibold text-[#5B6AA5]">£280</div>
              <p className="text-xs text-gray-500 mt-1">Economy class, direct</p>
            </div>

            {/* Accommodation */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold mb-1">Accommodation</h4>
                  <p className="text-sm text-gray-600">7 nights, 4-star hotel</p>
                </div>
                <svg className="w-8 h-8 text-[#A8BEEB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="text-2xl font-semibold text-[#5B6AA5]">£420</div>
              <p className="text-xs text-gray-500 mt-1">Near clinic, breakfast included</p>
            </div>

            {/* Treatment */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold mb-1">Egg Freezing</h4>
                  <p className="text-sm text-gray-600">Full cycle at Bosphorus Reproductive</p>
                </div>
                <svg className="w-8 h-8 text-[#A8BEEB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-2xl font-semibold text-[#5B6AA5]">£2,100</div>
              <p className="text-xs text-gray-500 mt-1">Including medications</p>
            </div>
          </div>

          {/* Total */}
          <div className="bg-white rounded-xl p-4 md:p-6 border-2 border-[#5B6AA5]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-lg md:text-xl font-semibold mb-1">Total Package Cost</h4>
                <p className="text-sm text-gray-600 mb-3">All-inclusive egg freezing trip</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#DEE8FF]/60 text-[#2F3440] rounded-full text-xs md:text-sm">✓ Flights</span>
                  <span className="px-3 py-1 bg-[#DEE8FF]/60 text-[#2F3440] rounded-full text-xs md:text-sm">✓ Accommodation</span>
                  <span className="px-3 py-1 bg-[#DEE8FF]/60 text-[#2F3440] rounded-full text-xs md:text-sm">✓ Treatment</span>
                  <span className="px-3 py-1 bg-[#DEE8FF]/60 text-[#2F3440] rounded-full text-xs md:text-sm">✓ Airport transfers</span>
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-3xl md:text-4xl font-bold text-[#5B6AA5]">£2,800</div>
                <p className="text-sm text-gray-500 mt-1">Save ~£8,700 vs UK</p>
              </div>
            </div>
          </div>

          <p className="text-xs md:text-sm text-gray-600 mt-4 text-center">
            💡 Same treatment in London typically costs £11,500+ (excluding accommodation)
          </p>
        </div>
          </>
        )}

        {/* Egg Freezing Info */}
        {viewMode === 'egg-freezing-info' && (
          <EggFreezingInfo 
            onBack={() => setViewMode('home')}
            onSearchClinics={() => {
              setServiceType('egg-freezing');
              setViewMode('home');
            }}
            onTakeQuiz={() => {
              setViewMode('home');
              setShowQuiz(true);
            }}
            scrollToClinics={scrollToClinics}
          />
        )}

        {/* Embryo Freezing Info */}
        {viewMode === 'embryo-info' && (
          <EmbryoFreezingInfo 
            onBack={() => setViewMode('home')}
            onSearchClinics={() => {
              setServiceType('embryo');
              setViewMode('home');
            }}
            onTakeQuiz={() => {
              setViewMode('home');
              setShowQuiz(true);
            }}
            scrollToClinics={scrollToClinics}
          />
        )}

        {/* IVF Treatment Info */}
        {viewMode === 'ivf-info' && (
          <IVFTreatmentInfo 
            onBack={() => setViewMode('home')}
            onSearchClinics={() => {
              setServiceType('ivf');
              setViewMode('home');
            }}
            onTakeQuiz={() => {
              setViewMode('home');
              setShowQuiz(true);
            }}
            scrollToClinics={scrollToClinics}
          />
        )}

        {/* Fertility Testing Info */}
        {viewMode === 'fertility-info' && (
          <FertilityTestingInfo 
            onBack={() => setViewMode('home')}
            onSearchClinics={() => {
              setServiceType('fertility');
              setViewMode('home');
            }}
            onTakeQuiz={() => {
              setViewMode('home');
              setShowQuiz(true);
            }}
            scrollToClinics={scrollToClinics}
          />
        )}
      </div>

      {/* AI Assistant Chat */}
      {showChat && <FertilityAssistantChat onClose={() => setShowChat(false)} />}

      {/* Self Assessment Quiz - Different quiz for each service type */}
      {showQuiz && serviceType === 'egg-freezing' && <SelfAssessmentQuiz onClose={() => setShowQuiz(false)} />}
      {showQuiz && serviceType === 'embryo' && <EmbryoFreezingQuiz onClose={() => setShowQuiz(false)} />}
      {showQuiz && serviceType === 'ivf' && <IVFTreatmentQuiz onClose={() => setShowQuiz(false)} />}
      {showQuiz && serviceType === 'fertility' && <FertilityTestingQuiz onClose={() => setShowQuiz(false)} />}

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
                <li>
                  <button 
                    onClick={() => {
                      setViewMode('marketing');
                      window.scrollTo(0, 0);
                    }} 
                    className="hover:text-white transition-colors text-left"
                  >
                    PR & Marketing Assets
                  </button>
                </li>
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
                <li><a href="#" className="hover:text-white">Treatment abroad</a></li>
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