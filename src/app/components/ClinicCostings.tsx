import { useState, useEffect, Fragment } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, ExternalLink, Bookmark, BookmarkCheck, X } from 'lucide-react';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { AtHomeTestKitsComparison } from './AtHomeTestKitsComparison';
import { HowTrackingWorks } from './HowTrackingWorks';
import { ServiceExplainer } from './ServiceExplainer';
import { AllInCostEstimator } from './AllInCostEstimator';
import { SuccessByAge } from './SuccessByAge';
import { FERTILITY_TESTS } from '../lib/tests';
import { getBudgetBounds } from '../lib/budget';
import { EnquiryFlow } from './EnquiryFlow';

interface ClinicCostingsProps {
  serviceType: 'egg-freezing' | 'embryo' | 'ivf' | 'fertility';
  /** kept for the search form; geography is not filtered in the UK-only MVP */
  location?: string;
  /** clinic slug from the search form, or 'all' */
  clinic?: string;
  /** budget bracket id from the search form, or 'all' */
  budgetRange?: string;
  onShowPrivacy?: () => void;
  /** switch the comparison to another service without leaving the results */
  onServiceChange?: (service: 'egg-freezing' | 'embryo' | 'ivf' | 'fertility') => void;
}

type ServiceType = ClinicCostingsProps['serviceType'];

// Fertility first — it's the usual entry — then the treatments.
const RESULTS_SERVICE_TABS: { id: ServiceType; label: string }[] = [
  { id: 'fertility', label: 'Fertility Testing' },
  { id: 'egg-freezing', label: 'Egg Freezing' },
  { id: 'ivf', label: 'IVF Treatment' },
  { id: 'embryo', label: 'Embryo Freezing' },
];

/**
 * Real, HFEA-licensed UK clinics.
 *
 * Prices are how clinics actually publish them: a single bundled "from" cycle
 * price, with medications quoted separately, and storage where relevant. We do
 * not invent an itemised breakdown a clinic has not published, and we do not
 * invent a price at all — a clinic that does not publish one shows "Request a
 * quote", never a made-up number.
 *
 * Where a figure is shown it comes from the clinic's own published price list
 * on the date noted (`priceCheckedLabel`). Success rates are not republished
 * here: each clinic links to its verified results on the HFEA register, which
 * is the authoritative source.
 */
interface Clinic {
  id: number;
  slug: string;
  clinicName: string;
  city: string;
  /** the clinic's verified results on the HFEA register */
  hfeaUrl: string;
  fundingRoutes: ('nhs' | 'private')[];
  /** bundled "from" prices per service, in GBP; null = clinic does not publish */
  ivfCycle: number | null;
  eggFreezingCycle: number | null;
  embryoCycle: number | null;
  testingFee: number | null;
  consultation: number | null;
  storagePerYear: number | null;
  /** almost always false — cycle prices exclude drugs */
  medsIncluded: boolean;
  /** where a published price came from, shown against the total */
  priceSourceUrl?: string;
  priceCheckedLabel?: string;
}

// The HFEA "Choose a Fertility Clinic" tool, where each clinic's regulated
// success rates can be checked at source.
const HFEA = 'https://www.hfea.gov.uk/choose-a-clinic/clinic-search/';

const REAL_CLINICS: Clinic[] = [
  {
    id: 1,
    slug: 'crgh',
    clinicName: 'CRGH — Centre for Reproductive & Genetic Health',
    city: 'London',
    hfeaUrl: HFEA,
    fundingRoutes: ['private'],
    ivfCycle: 5790,
    eggFreezingCycle: 3350,
    embryoCycle: null,
    testingFee: 250,
    consultation: 250,
    storagePerYear: 425,
    medsIncluded: false,
    priceSourceUrl: 'https://crgh.co.uk/pricelist/',
    priceCheckedLabel: 'Jul 2026',
  },
  {
    id: 2,
    slug: 'create-fertility',
    clinicName: 'CREATE Fertility',
    city: 'London & nationwide',
    hfeaUrl: HFEA,
    fundingRoutes: ['private'],
    ivfCycle: 3795,
    eggFreezingCycle: 3195,
    embryoCycle: null,
    testingFee: 175,
    consultation: 175,
    storagePerYear: null,
    medsIncluded: false,
    priceSourceUrl: 'https://www.createfertility.co.uk/costs',
    priceCheckedLabel: 'Jul 2026',
  },
  {
    id: 3,
    slug: 'manchester-fertility',
    clinicName: 'Manchester Fertility',
    city: 'Manchester',
    hfeaUrl: HFEA,
    fundingRoutes: ['private'],
    // All from Manchester Fertility's own patient price list PDF. Its egg
    // freezing figure (£4,200) is lower than the £4,995 we had from a later web
    // read, i.e. prices have since risen — so the whole entry is dated to the
    // PDF rather than mixing vintages under a single "checked" label.
    ivfCycle: 4150,
    eggFreezingCycle: 4200,
    // "Elective Embryo Freezing" — includes freezing + first year storage and a
    // first frozen transfer; medications (£985–£2,600) quoted separately.
    embryoCycle: 4675,
    testingFee: null,
    consultation: null,
    storagePerYear: 365,
    medsIncluded: false,
    priceSourceUrl:
      'https://www.manchesterfertility.com/media/filer_public/d3/fb/d3fbf6e4-da3f-48e9-a224-42cf886d0e0b/manchester_fertility_price_list_jan_2024.pdf',
    priceCheckedLabel: 'Jan 2024 list',
  },
  {
    id: 4,
    slug: 'care-fertility',
    clinicName: 'Care Fertility',
    city: 'Nottingham & nationwide',
    hfeaUrl: HFEA,
    fundingRoutes: ['nhs', 'private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 5,
    slug: 'lister-fertility',
    clinicName: 'The Lister Fertility Clinic',
    city: 'London',
    hfeaUrl: HFEA,
    fundingRoutes: ['private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 6,
    slug: 'argc',
    clinicName: 'ARGC — Assisted Reproduction & Gynaecology Centre',
    city: 'London',
    hfeaUrl: HFEA,
    fundingRoutes: ['private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 7,
    slug: 'bourn-hall',
    clinicName: 'Bourn Hall Clinic',
    city: 'Cambridge',
    hfeaUrl: HFEA,
    fundingRoutes: ['nhs', 'private'],
    // Bourn Hall does not sell a standalone "elective embryo freezing" product.
    // The cost to create and freeze embryos is the IVF package (£4,495), which
    // includes the freeze fee, first year of storage and a transfer; medication
    // is separate, and storage after year one is £420/yr. From their patient
    // price list.
    ivfCycle: 4495,
    eggFreezingCycle: null,
    embryoCycle: 4495,
    testingFee: null,
    consultation: 275,
    storagePerYear: 420,
    medsIncluded: false,
    priceSourceUrl: 'https://www.bournhall.co.uk/fees-funding/our-prices/',
    priceCheckedLabel: '2024 list',
  },
  {
    id: 8,
    slug: 'tfp-oxford',
    clinicName: 'TFP Oxford Fertility',
    city: 'Oxford',
    hfeaUrl: HFEA,
    fundingRoutes: ['private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 9,
    slug: 'guys-st-thomas',
    clinicName: "Guy's & St Thomas' Assisted Conception Unit",
    city: 'London',
    hfeaUrl: HFEA,
    fundingRoutes: ['nhs', 'private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 10,
    slug: 'newlife-fertility',
    clinicName: 'NewLife Fertility',
    city: 'Kent',
    hfeaUrl: HFEA,
    fundingRoutes: ['private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 11,
    slug: 'the-evewell',
    clinicName: "The Evewell",
    city: 'London',
    hfeaUrl: HFEA,
    fundingRoutes: ['private'],
    ivfCycle: 4095,
    eggFreezingCycle: 4050,
    embryoCycle: null,
    testingFee: 250,
    consultation: 250,
    storagePerYear: 380,
    medsIncluded: false,
    priceSourceUrl: 'https://www.evewell.com/pricing/',
    priceCheckedLabel: 'Jul 2026',
  },
  {
    id: 12,
    slug: 'london-womens-clinic',
    clinicName: "London Women's Clinic",
    city: 'London & nationwide',
    hfeaUrl: HFEA,
    fundingRoutes: ['private'],
    ivfCycle: null,
    eggFreezingCycle: 6100,
    // Published embryo-freezing cycle "from" price (first cycle; £3,650 second,
    // £3,450 third). Medications separate, as with every cycle price here.
    embryoCycle: 3950,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
    priceSourceUrl: 'https://www.londonwomensclinic.com/about/prices/',
    priceCheckedLabel: 'Jul 2026',
  },
  {
    id: 13,
    slug: 'herts-essex-fertility',
    clinicName: "Herts & Essex Fertility Centre",
    city: 'Cheshunt',
    hfeaUrl: HFEA,
    fundingRoutes: ['private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 14,
    slug: 'gcrm-glasgow',
    clinicName: "Glasgow Centre for Reproductive Medicine (GCRM)",
    city: 'Glasgow',
    hfeaUrl: HFEA,
    fundingRoutes: ['private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 15,
    slug: 'nurture-fertility',
    clinicName: "Nurture Fertility (TFP)",
    city: 'Nottingham',
    hfeaUrl: HFEA,
    fundingRoutes: ['private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 16,
    slug: 'thames-valley-fertility',
    clinicName: "Thames Valley Fertility (TFP)",
    city: 'Maidenhead',
    hfeaUrl: HFEA,
    fundingRoutes: ['private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 17,
    slug: 'hewitt-fertility',
    clinicName: "Hewitt Fertility Centre",
    city: 'Liverpool',
    hfeaUrl: HFEA,
    fundingRoutes: ['nhs', 'private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 18,
    slug: 'leeds-fertility',
    clinicName: "Leeds Fertility",
    city: 'Leeds',
    hfeaUrl: HFEA,
    fundingRoutes: ['nhs', 'private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 19,
    slug: 'newcastle-fertility',
    clinicName: "Newcastle Fertility Centre",
    city: 'Newcastle',
    hfeaUrl: HFEA,
    fundingRoutes: ['nhs', 'private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 20,
    slug: 'wales-fertility-institute',
    clinicName: "Wales Fertility Institute",
    city: 'Cardiff',
    hfeaUrl: HFEA,
    fundingRoutes: ['nhs', 'private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 21,
    slug: 'wessex-fertility',
    clinicName: "Wessex Fertility",
    city: 'Southampton',
    hfeaUrl: HFEA,
    fundingRoutes: ['private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 22,
    slug: 'complete-fertility',
    clinicName: "Complete Fertility Centre",
    city: 'Southampton',
    hfeaUrl: HFEA,
    fundingRoutes: ['nhs', 'private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 23,
    slug: 'kings-fertility',
    clinicName: "Kings Fertility",
    city: 'London',
    hfeaUrl: HFEA,
    fundingRoutes: ['nhs', 'private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 24,
    slug: 'agora-clinic',
    clinicName: "The Agora Clinic",
    city: 'Brighton',
    hfeaUrl: HFEA,
    fundingRoutes: ['private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
  {
    id: 25,
    slug: 'cambridge-ivf',
    clinicName: "Cambridge IVF (Addenbrooke’s)",
    city: 'Cambridge',
    hfeaUrl: HFEA,
    fundingRoutes: ['nhs', 'private'],
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
  },
];

const COMPONENT_LABELS: Record<string, string> = {
  consultation: 'Consultation',
  storagePerYear: 'Storage / year',
};

/**
 * Each service has one bundled "headline" price plus the extra published items
 * shown alongside it. The columns rendered are exactly these, so the figures on
 * screen are the ones summed into the "from" total.
 */
const SERVICE_CONFIG: Record<
  ServiceType,
  { cycleKey: keyof Clinic; cycleLabel: string; extras: (keyof Clinic)[] }
> = {
  'egg-freezing': {
    cycleKey: 'eggFreezingCycle',
    cycleLabel: 'Egg freezing cycle',
    extras: ['consultation', 'storagePerYear'],
  },
  embryo: {
    cycleKey: 'embryoCycle',
    cycleLabel: 'Embryo freeze & store',
    extras: ['consultation', 'storagePerYear'],
  },
  ivf: {
    cycleKey: 'ivfCycle',
    cycleLabel: 'IVF cycle',
    extras: ['consultation'],
  },
  fertility: {
    cycleKey: 'testingFee',
    cycleLabel: 'Assessment & consultation',
    extras: [],
  },
};

interface PricedClinic extends Clinic {
  /** columns for this service: the cycle price and any published extras */
  components: { key: string; label: string; amount: number | null }[];
  /** true when the clinic does not publish a cycle price for this service */
  priceOnRequest: boolean;
  /** sum of the published components, or null when the cycle price is not published */
  fromTotal: number | null;
}

function getServiceData(serviceType: ServiceType): PricedClinic[] {
  const cfg = SERVICE_CONFIG[serviceType];
  const columns: (keyof Clinic)[] = [cfg.cycleKey, ...cfg.extras];

  return REAL_CLINICS.map((clinic) => {
    const components = columns.map((key) => ({
      key: String(key),
      label: key === cfg.cycleKey ? cfg.cycleLabel : COMPONENT_LABELS[String(key)] ?? String(key),
      amount: (clinic[key] as number | null) ?? null,
    }));

    const cyclePrice = clinic[cfg.cycleKey] as number | null;
    const priceOnRequest = cyclePrice == null;
    const fromTotal = priceOnRequest
      ? null
      : components.reduce((sum, c) => sum + (c.amount ?? 0), 0);

    return { ...clinic, components, priceOnRequest, fromTotal };
  });
}

const FUNDING_LABEL: Record<string, string> = { nhs: 'NHS', private: 'Private' };

const priceLabel = (c: PricedClinic) =>
  c.fromTotal !== null ? `from £${c.fromTotal.toLocaleString()}` : 'Request a quote';

/**
 * The expanded detail for one clinic — cost breakdown, price provenance and
 * the enquiry actions. Shared by the desktop table's expand row and the mobile
 * card so the two can never drift apart.
 */
function ClinicDetail({
  clinic,
  onEnquire,
}: {
  clinic: PricedClinic;
  onEnquire: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-3 text-sm font-semibold text-[#2F3440]">
          {clinic.priceOnRequest ? 'Pricing' : 'What makes up this total'}
        </h4>
        {clinic.priceOnRequest ? (
          <p className="text-sm text-[#5C6478] leading-relaxed">
            {clinic.clinicName.split(' — ')[0]} does not publish a price for this service.
            Send an enquiry and they will quote you directly.
          </p>
        ) : (
          <div className="space-y-2 text-sm">
            {clinic.components.map((c) => (
              <div key={c.key} className="flex justify-between">
                <span className="text-[#5C6478]">{c.label}</span>
                <span className="text-[#2F3440]">
                  {c.amount !== null ? `£${c.amount.toLocaleString()}` : 'Not published'}
                </span>
              </div>
            ))}
            <div className="flex justify-between">
              <span className="text-[#5C6478]">Medications</span>
              <span className="text-[#2F3440]">
                {clinic.medsIncluded ? 'Included' : 'Quoted separately'}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span className="text-[#2F3440]">Total</span>
              <span className="text-[#2F3440]">{priceLabel(clinic)}</span>
            </div>
          </div>
        )}
        {clinic.priceSourceUrl && (
          <p className="text-[11px] text-[#5C6478] mt-3 leading-relaxed">
            Published price ·{' '}
            <a
              href={clinic.priceSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5B6AA5] hover:underline"
            >
              clinic price list
            </a>{' '}
            · checked {clinic.priceCheckedLabel}
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <a
          href={clinic.hfeaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5B6AA5] hover:underline self-center"
        >
          View HFEA results
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <Button
          size="sm"
          className="bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold"
          onClick={onEnquire}
        >
          Request consultation
        </Button>
      </div>
    </div>
  );
}

export function ClinicCostings({
  serviceType,
  clinic: clinicFilter = 'all',
  budgetRange = 'all',
  onShowPrivacy = () => {},
  onServiceChange,
}: ClinicCostingsProps) {
  const [funding, setFunding] = useState<'all' | 'nhs' | 'private'>('all');
  const [publishedOnly, setPublishedOnly] = useState(false);
  const [sortField, setSortField] = useState<'clinicName' | 'price'>('price');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [enquiring, setEnquiring] = useState<{ slug: string; name: string }[] | null>(null);
  // Clinics the user has saved to compare side by side.
  const [shortlist, setShortlist] = useState<number[]>([]);
  const [comparing, setComparing] = useState(false);
  // Fertility testing is mostly at-home kits, so show those first — but let
  // people switch to testing at a clinic. The kits are never hidden.
  const [fertilityView, setFertilityView] = useState<'kits' | 'clinics'>('kits');

  const toggleShortlist = (id: number) =>
    setShortlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // Close the compare overlay on Escape, matching the enquiry dialog.
  useEffect(() => {
    if (!comparing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setComparing(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [comparing]);

  // Switch the whole comparison to another service without going back to the
  // search — so "I want to compare IVF instead" is one click, not a detour.
  const serviceSwitcher = onServiceChange ? (
    <div
      role="tablist"
      aria-label="Compare a different service"
      className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-white/50"
    >
      {RESULTS_SERVICE_TABS.map((s) => {
        const active = serviceType === s.id;
        return (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onServiceChange(s.id)}
            className={`grain flex-1 min-w-[8rem] text-sm font-semibold px-4 py-2.5 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5] focus-visible:ring-offset-2 ${
              active ? 'bg-[#2F3440] text-white shadow-sm' : 'text-[#2F3440] hover:bg-white/70'
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  ) : null;

  // Fertility testing leads with how tracking actually works — so nobody feels
  // they must buy an expensive panel every month — then a toggle between
  // at-home kits and testing at a clinic. Both are always reachable; the kits
  // are never hidden behind a checkbox.
  const fertilityTopMatter =
    serviceType === 'fertility' ? (
      <div className="space-y-6">
        <div className="pb-6 border-b border-[#2F3440]/10">
          <HowTrackingWorks />
        </div>
        <div
          role="tablist"
          aria-label="Where to test"
          className="inline-flex rounded-full bg-white/60 p-1 gap-1"
        >
          {([
            ['kits', `At-home test kits · ${FERTILITY_TESTS.length}`],
            ['clinics', 'Test at a clinic'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={fertilityView === id}
              onClick={() => setFertilityView(id)}
              className={`grain text-sm font-semibold px-4 py-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5] focus-visible:ring-offset-2 ${
                fertilityView === id
                  ? 'bg-[#2F3440] text-white'
                  : 'text-[#2F3440] hover:bg-white/80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    ) : null;

  if (serviceType === 'fertility' && fertilityView === 'kits') {
    return (
      <div className="space-y-8">
        {serviceSwitcher}
        {fertilityTopMatter}
        <AtHomeTestKitsComparison />
      </div>
    );
  }

  const cfg = SERVICE_CONFIG[serviceType];
  const allClinics = getServiceData(serviceType);

  const budget = getBudgetBounds(serviceType, budgetRange);
  const filteredData = allClinics.filter((c) => {
    if (clinicFilter !== 'all' && c.slug !== clinicFilter) return false;
    if (funding !== 'all' && !c.fundingRoutes.includes(funding)) return false;
    if (publishedOnly && c.priceOnRequest) return false;
    // Budget only rules out a clinic that publishes a price outside the range.
    // A clinic that quotes on enquiry can't be ruled out — we don't know its
    // price — so it stays, flagged rather than filtered. This is what stops a
    // budget on a quote-only service (e.g. embryo) collapsing to zero results.
    if (budget && c.fromTotal !== null && (c.fromTotal < budget.min || c.fromTotal >= budget.max)) {
      return false;
    }
    return true;
  });

  // When a budget is applied and some results are quote-only, say so — those
  // clinics appear because we can't confirm they are outside the budget.
  const budgetIncludesQuoteOnly = budget !== null && filteredData.some((c) => c.priceOnRequest);

  const activeFilterCount =
    (clinicFilter !== 'all' ? 1 : 0) +
    (budget ? 1 : 0) +
    (funding !== 'all' ? 1 : 0) +
    (publishedOnly ? 1 : 0);

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortField === 'clinicName') {
      return sortDirection === 'asc'
        ? a.clinicName.localeCompare(b.clinicName)
        : b.clinicName.localeCompare(a.clinicName);
    }
    // Clinics without a published price sort last, whichever direction.
    if (a.fromTotal === null && b.fromTotal === null) return 0;
    if (a.fromTotal === null) return 1;
    if (b.fromTotal === null) return -1;
    return sortDirection === 'asc' ? a.fromTotal - b.fromTotal : b.fromTotal - a.fromTotal;
  });

  const toggleSort = (field: 'clinicName' | 'price') => {
    if (sortField === field) setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const publishedTotals = sortedData
    .map((c) => c.fromTotal)
    .filter((t): t is number => t !== null);
  const lowestTotal = publishedTotals.length ? Math.min(...publishedTotals) : null;
  const cheapest =
    lowestTotal !== null ? sortedData.find((c) => c.fromTotal === lowestTotal) ?? null : null;
  const averageTotal = publishedTotals.length
    ? Math.round(publishedTotals.reduce((a, b) => a + b, 0) / publishedTotals.length)
    : null;
  const publishingCount = sortedData.filter((c) => !c.priceOnRequest).length;

  const toggleRowExpansion = (id: number) =>
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));

  return (
    <div className="space-y-6">
      {serviceSwitcher}
      {fertilityTopMatter}

      {/* Learn-more step: every non-fertility path leads with how the treatment
          works before the price table. Fertility leads with HowTrackingWorks
          via fertilityTopMatter instead. */}
      {serviceType !== 'fertility' && (
        <div className="space-y-4 pb-2 border-b border-[#2F3440]/10">
          <ServiceExplainer serviceType={serviceType} />
          <SuccessByAge />
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-3xl mb-2">
          {serviceType === 'fertility' ? 'Fertility testing at a clinic' : 'Clinic Cost Comparison'}
        </h2>
        <p className="text-[#5C6478]">
          {sortedData.length} of {allClinics.length} UK clinics
          {activeFilterCount > 0 && (
            <> · {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied</>
          )}
        </p>
        {budgetIncludesQuoteOnly && (
          <p className="text-sm text-[#5C6478] mt-2 max-w-2xl leading-relaxed">
            <span className="font-medium text-[#2F3440]">Clinics that quote on enquiry are shown too.</span>{' '}
            They don&rsquo;t publish a price, so we can&rsquo;t confirm they fit your budget until you
            ask — send an enquiry to find out. Tick <em>&ldquo;only clinics that publish a price&rdquo;</em>{' '}
            to hide them.
          </p>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#DEE8FF]/50 p-4 rounded-lg border-l-4 border border-[#A8BEEB]/60 border-l-[#5B6AA5]">
          <div className="text-sm text-[#5B6AA5] mb-1">Lowest published price</div>
          <div className="text-2xl">{cheapest ? `from £${cheapest.fromTotal!.toLocaleString()}` : '—'}</div>
          <div className="text-sm text-gray-500 mt-1">
            {cheapest ? cheapest.clinicName.split(' — ')[0] : 'No published prices'}
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-[#5B6AA5] mb-1">Average published price</div>
          <div className="text-2xl">{averageTotal !== null ? `£${averageTotal.toLocaleString()}` : '—'}</div>
          <div className="text-sm text-gray-500 mt-1">
            {averageTotal !== null ? `Across ${publishingCount} clinics` : 'No published prices'}
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-[#5B6AA5] mb-1">Publishing a price</div>
          <div className="text-2xl">
            {publishingCount} of {sortedData.length}
          </div>
          <div className="text-sm text-gray-500 mt-1">The rest quote on enquiry</div>
        </div>
      </div>

      {/* Real-clinic notice */}
      <div className="glass rounded-2xl p-4 text-xs text-[#5C6478] leading-relaxed">
        <span className="font-semibold text-[#2F3440]">Real UK clinics, in GBP.</span> Prices come
        from each clinic&rsquo;s own published price list on the date shown; where a clinic does not
        publish a price, the total reads <span className="font-semibold">&ldquo;Request a quote&rdquo;</span>{' '}
        rather than a made-up figure. <span className="font-semibold">Medications are quoted
        separately</span> by the clinic and are not in these totals. Success rates are not
        reproduced here — each clinic links to its verified results on the HFEA register.
      </div>

      {/* Refine */}
      <div className="glass rounded-2xl p-5 flex flex-wrap items-end gap-x-8 gap-y-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-[#5C6478] mb-2">
            Funding route
          </div>
          <div className="flex flex-wrap gap-2">
            {([['all', 'Any'], ['nhs', 'NHS funded'], ['private', 'Private']] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setFunding(id)}
                className={`grain text-sm font-medium px-3.5 py-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5] focus-visible:ring-offset-2 ${
                  funding === id ? 'bg-[#2F3440] text-white' : 'bg-white/60 text-[#2F3440] hover:bg-white/80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-[#2F3440] cursor-pointer pb-1.5">
          <input
            type="checkbox"
            checked={publishedOnly}
            onChange={(e) => setPublishedOnly(e.target.checked)}
            className="accent-[#F8AD7C] w-4 h-4"
          />
          Only clinics that publish a price
        </label>
      </div>

      {/* No results */}
      {sortedData.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center">
          <h3 className="text-lg font-semibold text-[#2F3440] mb-2">No clinics match these filters</h3>
          <p className="text-[#5C6478] max-w-md mx-auto">
            Try clearing the budget or funding filter, or turning off &ldquo;only clinics that publish
            a price&rdquo; — many clinics quote on enquiry rather than publishing a figure.
          </p>
        </div>
      )}

      {/* Table — desktop only; mobile uses the card list below */}
      <div
        className={`border rounded-lg overflow-hidden bg-white ${
          sortedData.length === 0 ? 'hidden' : 'hidden md:block'
        }`}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12"></TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort('clinicName')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Clinic
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                {cfg && [cfg.cycleLabel, ...cfg.extras.map((k) => COMPONENT_LABELS[String(k)] ?? String(k))].map((label) => (
                  <TableHead key={label}>{label}</TableHead>
                ))}
                <TableHead>Results</TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort('price')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Total
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="w-px"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((clinic) => (
                <Fragment key={clinic.id}>
                  <TableRow className={lowestTotal !== null && clinic.fromTotal === lowestTotal ? 'bg-[#DEE8FF]/40' : ''}>
                    <TableCell>
                      <button onClick={() => toggleRowExpansion(clinic.id)} className="hover:text-[#5B6AA5]">
                        {expandedRows.includes(clinic.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{clinic.clinicName}</span>
                          {clinic.priceOnRequest ? (
                            <span className="grain text-[10px] font-semibold uppercase tracking-wide text-[#B4762F] bg-[#F8AD7C]/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                              Price on request
                            </span>
                          ) : (
                            lowestTotal !== null &&
                            clinic.fromTotal === lowestTotal && (
                              <span className="grain text-[10px] font-semibold uppercase tracking-wide text-[#5B6AA5] bg-[#DEE8FF]/70 px-2 py-0.5 rounded-full whitespace-nowrap">
                                Lowest published
                              </span>
                            )
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {clinic.city} · {clinic.fundingRoutes.map((f) => FUNDING_LABEL[f]).join(' / ')}
                        </div>
                      </div>
                    </TableCell>
                    {clinic.components.map((c) => (
                      <TableCell key={c.key}>
                        {c.amount !== null ? `£${c.amount.toLocaleString()}` : <span className="text-gray-400">—</span>}
                      </TableCell>
                    ))}
                    <TableCell>
                      <a
                        href={clinic.hfeaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-[#5B6AA5] hover:underline"
                      >
                        HFEA results
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </TableCell>
                    <TableCell className="text-[#5B6AA5]">
                      {clinic.fromTotal !== null ? (
                        <>
                          <div className="whitespace-nowrap">{priceLabel(clinic)}</div>
                          {!clinic.medsIncluded && (
                            <div className="text-[11px] text-[#5C6478]">+ medications</div>
                          )}
                        </>
                      ) : (
                        <span className="text-[#5C6478] text-sm">Request a quote</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => toggleShortlist(clinic.id)}
                          aria-pressed={shortlist.includes(clinic.id)}
                          aria-label={
                            shortlist.includes(clinic.id)
                              ? `Remove ${clinic.clinicName} from compare`
                              : `Save ${clinic.clinicName} to compare`
                          }
                          className="text-[#5B6AA5] hover:text-[#2F3440] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5]"
                        >
                          {shortlist.includes(clinic.id) ? (
                            <BookmarkCheck className="w-4 h-4 fill-[#DEE8FF]" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#F8AD7C] text-[#2F3440] hover:bg-[#F8AD7C]/15 font-semibold whitespace-nowrap"
                          onClick={() => setEnquiring([{ slug: clinic.slug, name: clinic.clinicName }])}
                        >
                          Enquire
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {expandedRows.includes(clinic.id) && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={cfg.extras.length + 6} className="p-6">
                        <div className="max-w-md">
                          <ClinicDetail
                            clinic={clinic}
                            onEnquire={() =>
                              setEnquiring([{ slug: clinic.slug, name: clinic.clinicName }])
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Cards — mobile only; the table's columns don't fit a phone */}
      {sortedData.length > 0 && (
        <div className="md:hidden space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#5C6478]">Sort</span>
            {([['price', 'Price'], ['clinicName', 'Name']] as const).map(([field, label]) => (
              <button
                key={field}
                onClick={() => toggleSort(field)}
                className={`grain font-medium px-3 py-1 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5] ${
                  sortField === field
                    ? 'bg-[#2F3440] text-white'
                    : 'bg-white/60 text-[#2F3440]'
                }`}
              >
                {label}
                {sortField === field && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
              </button>
            ))}
          </div>

          {sortedData.map((clinic) => {
            const isLowest = lowestTotal !== null && clinic.fromTotal === lowestTotal;
            const expanded = expandedRows.includes(clinic.id);
            return (
              <div
                key={clinic.id}
                className={`glass rounded-2xl p-4 ${
                  isLowest ? 'ring-1 ring-[#5B6AA5]/40 bg-[#DEE8FF]/30' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-[#2F3440] leading-snug">
                      {clinic.clinicName}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {clinic.city} ·{' '}
                      {clinic.fundingRoutes.map((f) => FUNDING_LABEL[f]).join(' / ')}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {clinic.fromTotal !== null ? (
                      <>
                        <div className="text-[#5B6AA5] font-semibold whitespace-nowrap">
                          {priceLabel(clinic)}
                        </div>
                        {!clinic.medsIncluded && (
                          <div className="text-[11px] text-[#5C6478]">+ medications</div>
                        )}
                      </>
                    ) : (
                      <span className="text-[#5C6478] text-sm">Request a quote</span>
                    )}
                  </div>
                </div>

                {(clinic.priceOnRequest || isLowest) && (
                  <div className="mt-2">
                    {clinic.priceOnRequest ? (
                      <span className="grain text-[10px] font-semibold uppercase tracking-wide text-[#B4762F] bg-[#F8AD7C]/20 px-2 py-0.5 rounded-full">
                        Price on request
                      </span>
                    ) : (
                      <span className="grain text-[10px] font-semibold uppercase tracking-wide text-[#5B6AA5] bg-[#DEE8FF]/70 px-2 py-0.5 rounded-full">
                        Lowest published
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-3">
                  <Button
                    size="sm"
                    className="bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold"
                    onClick={() => setEnquiring([{ slug: clinic.slug, name: clinic.clinicName }])}
                  >
                    Enquire
                  </Button>
                  <button
                    type="button"
                    onClick={() => toggleShortlist(clinic.id)}
                    aria-pressed={shortlist.includes(clinic.id)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#5B6AA5] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5]"
                  >
                    {shortlist.includes(clinic.id) ? (
                      <>
                        <BookmarkCheck className="w-4 h-4 fill-[#DEE8FF]" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </button>
                  <a
                    href={clinic.hfeaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1 text-sm text-[#5B6AA5] hover:underline"
                  >
                    HFEA results
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => toggleRowExpansion(clinic.id)}
                    aria-expanded={expanded}
                    className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-[#5B6AA5]"
                  >
                    {expanded ? 'Hide details' : 'View details'}
                    {expanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {expanded && (
                  <div className="mt-4 pt-4 border-t border-[#2F3440]/10">
                    <ClinicDetail
                      clinic={clinic}
                      onEnquire={() =>
                        setEnquiring([{ slug: clinic.slug, name: clinic.clinicName }])
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-[#5C6478]">
        Success rates are shown on the{' '}
        <a href={HFEA} target="_blank" rel="noopener noreferrer" className="text-[#5B6AA5] hover:underline">
          HFEA &ldquo;Choose a Fertility Clinic&rdquo; register
        </a>
        , the UK regulator&rsquo;s own verified figures.{' '}
        <button onClick={onShowPrivacy} className="text-[#5B6AA5] hover:underline">
          How we handle your information
        </button>
        .
      </p>

      {/* All-in cost model — the spreadsheet people build by hand. Egg freezing
          is where the UK-vs-abroad cost question comes up most. */}
      {serviceType === 'egg-freezing' && <AllInCostEstimator />}

      {/* Sticky compare bar — appears once anything is saved */}
      {shortlist.length > 0 && !comparing && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 pointer-events-none">
          <div className="pointer-events-auto glass rounded-full shadow-[0_12px_40px_rgba(120,140,200,0.3)] border border-[#A8BEEB]/40 px-5 py-3 flex items-center gap-4">
            <span className="text-sm font-medium text-[#2F3440] whitespace-nowrap">
              {shortlist.length} saved
            </span>
            <Button
              size="sm"
              variant="outline"
              className="border-[#2F3440]/20 text-[#2F3440] font-semibold"
              onClick={() => setComparing(true)}
              disabled={shortlist.length < 2}
            >
              Compare
            </Button>
            <Button
              size="sm"
              className="bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold whitespace-nowrap"
              onClick={() =>
                setEnquiring(
                  allClinics
                    .filter((c) => shortlist.includes(c.id))
                    .map((c) => ({ slug: c.slug, name: c.clinicName }))
                )
              }
            >
              Enquire with {shortlist.length === 1 ? 'clinic' : `all ${shortlist.length}`}
            </Button>
            <button
              onClick={() => setShortlist([])}
              className="text-sm text-[#5C6478] hover:text-[#2F3440] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5]"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Side-by-side compare */}
      {comparing && (() => {
        const shortlisted = allClinics.filter((c) => shortlist.includes(c.id));
        const componentLabels = shortlisted[0]?.components.map((c) => c.label) ?? [];
        return (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Compare clinics side by side"
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={() => setComparing(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-5xl w-full max-h-[85vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-[#2F3440]">
                  Comparing {shortlisted.length} clinics
                </h3>
                <button
                  onClick={() => setComparing(false)}
                  aria-label="Close compare"
                  className="text-[#5C6478] hover:text-[#2F3440] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-white z-10 p-3 text-left align-bottom w-40" />
                      {shortlisted.map((c) => (
                        <th key={c.id} className="p-3 text-left align-bottom min-w-[10rem] border-l">
                          <div className="font-semibold text-[#2F3440] leading-snug">
                            {c.clinicName.split(' — ')[0]}
                          </div>
                          <button
                            onClick={() => toggleShortlist(c.id)}
                            className="mt-1 inline-flex items-center gap-1 text-xs text-[#5C6478] hover:text-[#2F3440]"
                          >
                            <X className="w-3 h-3" /> Remove
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="sticky left-0 bg-white z-10 p-3 text-[#5C6478] font-medium">Location</td>
                      {shortlisted.map((c) => (
                        <td key={c.id} className="p-3 border-l text-[#2F3440]">{c.city}</td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <td className="sticky left-0 bg-white z-10 p-3 text-[#5C6478] font-medium">Funding</td>
                      {shortlisted.map((c) => (
                        <td key={c.id} className="p-3 border-l text-[#2F3440]">
                          {c.fundingRoutes.map((f) => FUNDING_LABEL[f]).join(' / ')}
                        </td>
                      ))}
                    </tr>
                    {componentLabels.map((label, i) => (
                      <tr key={label} className="border-t">
                        <td className="sticky left-0 bg-white z-10 p-3 text-[#5C6478] font-medium">{label}</td>
                        {shortlisted.map((c) => (
                          <td key={c.id} className="p-3 border-l text-[#2F3440]">
                            {c.components[i]?.amount != null
                              ? `£${c.components[i]!.amount!.toLocaleString()}`
                              : <span className="text-gray-400">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-t">
                      <td className="sticky left-0 bg-white z-10 p-3 text-[#5C6478] font-medium">Medications</td>
                      {shortlisted.map((c) => (
                        <td key={c.id} className="p-3 border-l text-[#2F3440]">
                          {c.medsIncluded ? 'Included' : 'Quoted separately'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t bg-[#DEE8FF]/30">
                      <td className="sticky left-0 bg-[#F1F5FF] z-10 p-3 font-semibold text-[#2F3440]">Total</td>
                      {shortlisted.map((c) => (
                        <td key={c.id} className="p-3 border-l font-semibold text-[#5B6AA5] whitespace-nowrap">
                          {priceLabel(c)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <td className="sticky left-0 bg-white z-10 p-3 text-[#5C6478] font-medium">Results</td>
                      {shortlisted.map((c) => (
                        <td key={c.id} className="p-3 border-l">
                          <a
                            href={c.hfeaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#5B6AA5] hover:underline"
                          >
                            HFEA <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <td className="sticky left-0 bg-white z-10 p-3" />
                      {shortlisted.map((c) => (
                        <td key={c.id} className="p-3 border-l">
                          <Button
                            size="sm"
                            className="bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold"
                            onClick={() => {
                              setComparing(false);
                              setEnquiring([{ slug: c.slug, name: c.clinicName }]);
                            }}
                          >
                            Enquire
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-t px-6 py-4 flex items-center justify-end gap-3">
                <span className="text-sm text-[#5C6478] mr-auto">
                  Send one enquiry to all {shortlisted.length} and compare their quotes.
                </span>
                <Button
                  className="bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold"
                  onClick={() => {
                    setComparing(false);
                    setEnquiring(shortlisted.map((c) => ({ slug: c.slug, name: c.clinicName })));
                  }}
                >
                  Enquire with all {shortlisted.length}
                </Button>
              </div>
            </div>
          </div>
        );
      })()}

      {enquiring && enquiring.length > 0 && (
        <EnquiryFlow
          clinicSlug={enquiring[0].slug}
          clinicName={enquiring[0].name}
          clinics={enquiring}
          serviceType={serviceType}
          surface="clinic-costings"
          onShowPrivacy={onShowPrivacy}
          onClose={() => setEnquiring(null)}
        />
      )}
    </div>
  );
}
