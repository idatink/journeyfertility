import { useState, Fragment } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
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
import { getBudgetBounds } from '../lib/budget';
import { EnquiryFlow } from './EnquiryFlow';

interface ClinicCostingsProps {
  serviceType: 'egg-freezing' | 'embryo' | 'ivf' | 'fertility';
  atHomeOnly?: boolean;
  /** kept for the search form; geography is not filtered in the UK-only MVP */
  location?: string;
  /** clinic slug from the search form, or 'all' */
  clinic?: string;
  /** budget bracket id from the search form, or 'all' */
  budgetRange?: string;
  onShowPrivacy?: () => void;
}

type ServiceType = ClinicCostingsProps['serviceType'];

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
    ivfCycle: null,
    eggFreezingCycle: 4995,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
    priceSourceUrl: 'https://www.manchesterfertility.com/prices/',
    priceCheckedLabel: 'Jul 2026',
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
    ivfCycle: null,
    eggFreezingCycle: null,
    embryoCycle: null,
    testingFee: null,
    consultation: null,
    storagePerYear: null,
    medsIncluded: false,
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
    embryoCycle: null,
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

export function ClinicCostings({
  serviceType,
  atHomeOnly,
  clinic: clinicFilter = 'all',
  budgetRange = 'all',
  onShowPrivacy = () => {},
}: ClinicCostingsProps) {
  const [funding, setFunding] = useState<'all' | 'nhs' | 'private'>('all');
  const [publishedOnly, setPublishedOnly] = useState(false);
  const [sortField, setSortField] = useState<'clinicName' | 'price'>('price');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [enquiring, setEnquiring] = useState<{ slug: string; name: string } | null>(null);

  // Fertility testing leads with how tracking actually works, so nobody feels
  // they must buy an expensive panel every month before comparing anything.
  if (serviceType === 'fertility' && atHomeOnly) {
    return (
      <div className="space-y-10">
        <HowTrackingWorks />
        <div className="pt-2 border-t border-[#2F3440]/10">
          <AtHomeTestKitsComparison />
        </div>
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
    if (budget) {
      if (c.fromTotal === null) return false;
      if (c.fromTotal < budget.min || c.fromTotal >= budget.max) return false;
    }
    return true;
  });

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

  const priceLabel = (c: PricedClinic) =>
    c.fromTotal !== null ? `from £${c.fromTotal.toLocaleString()}` : 'Request a quote';

  return (
    <div className="space-y-6">
      {serviceType === 'fertility' && (
        <div className="pb-6 border-b border-[#2F3440]/10">
          <HowTrackingWorks />
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-3xl mb-2">Clinic Cost Comparison</h2>
        <p className="text-[#5C6478]">
          {sortedData.length} of {allClinics.length} UK clinics
          {activeFilterCount > 0 && (
            <> · {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied</>
          )}
        </p>
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

      {/* Table */}
      <div className={`border rounded-lg overflow-hidden bg-white ${sortedData.length === 0 ? 'hidden' : ''}`}>
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
                  </TableRow>

                  {expandedRows.includes(clinic.id) && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={cfg.extras.length + 5} className="p-6">
                        <div className="max-w-md space-y-4">
                          <div>
                            <h4 className="mb-3 text-sm font-semibold text-[#2F3440]">
                              {clinic.priceOnRequest ? 'Pricing' : 'What makes up this total'}
                            </h4>
                            {clinic.priceOnRequest ? (
                              <p className="text-sm text-[#5C6478] leading-relaxed">
                                {clinic.clinicName.split(' — ')[0]} does not publish a price for this
                                service. Send an enquiry and they will quote you directly.
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
                              onClick={() => setEnquiring({ slug: clinic.slug, name: clinic.clinicName })}
                            >
                              Request consultation
                            </Button>
                          </div>
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

      {enquiring && (
        <EnquiryFlow
          clinicSlug={enquiring.slug}
          clinicName={enquiring.name}
          serviceType={serviceType}
          surface="clinic-costings"
          onShowPrivacy={onShowPrivacy}
          onClose={() => setEnquiring(null)}
        />
      )}
    </div>
  );
}
