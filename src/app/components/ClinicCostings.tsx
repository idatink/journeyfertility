import { useState, useEffect, Fragment } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
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
import { getBudgetBounds } from '../lib/budget';
import { EnquiryFlow } from './EnquiryFlow';
import { AGE_BANDS, OUTCOME_BASIS, getOutcome, type AgeBand } from '../lib/outcomes';
import { PRICE_SOURCES, getProvenance } from '../lib/provenance';

interface ClinicCostingsProps {
  serviceType: 'egg-freezing' | 'embryo' | 'ivf' | 'fertility';
  atHomeOnly?: boolean;
  /** city slug from the search form, or 'all' */
  location?: string;
  /** clinic slug from the search form, or 'all' */
  clinic?: string;
  /** budget bracket id from the search form, or 'all' / 'flexible' */
  budgetRange?: string;
  onShowPrivacy?: () => void;
}

// Budget bounds come from the shared bracket table so the form options and the
// filter can never drift apart.

interface ClinicCost {
  id: number;
  slug: string;
  regionSlug: string;
  fundingRoutes: ("nhs" | "private")[];
  /** how much of its price list the clinic publishes */
  pricingCompleteness: "full" | "partial" | "none";
  clinicName: string;
  location: string;
  consultation: number;
  eggRetrieval: number;
  ivfCycle: number;
  embryoTransfer: number;
  medications: number;
  storagePerYear: number;
  geneticTesting: number;
  embryoFreezing: number;
  fertilityTestPanel: number;
  successRate: number;
  total: number;
}

interface AtHomeTestKit {
  id: number;
  name: string;
  provider: string;
  price: number;
  testsIncluded: string[];
  turnaroundTime: string;
  hsaEligible: boolean;
  nurseConsult: boolean;
  rating: number;
  reviews: number;
  badge?: string;
}

const mockClinicData: ClinicCost[] = [
  {
    id: 1,
    slug: "thames-fertility",
    regionSlug: "london",
    pricingCompleteness: "full",
    fundingRoutes: ["nhs", "private"],
    clinicName: "Thames Fertility Centre",
    location: "London",
    consultation: 200,
    eggRetrieval: 3200,
    ivfCycle: 4500,
    embryoTransfer: 1400,
    medications: 1500,
    storagePerYear: 350,
    geneticTesting: 2800,
    embryoFreezing: 1100,
    fertilityTestPanel: 250,
    successRate: 0,
    total: 0
  },
  {
    id: 2,
    slug: "southbank-reproductive",
    regionSlug: "london",
    pricingCompleteness: "full",
    fundingRoutes: ["private"],
    clinicName: "Southbank Reproductive Health",
    location: "London",
    consultation: 250,
    eggRetrieval: 3600,
    ivfCycle: 5200,
    embryoTransfer: 1600,
    medications: 1800,
    storagePerYear: 420,
    geneticTesting: 3200,
    embryoFreezing: 1300,
    fertilityTestPanel: 320,
    successRate: 0,
    total: 0
  },
  {
    id: 3,
    slug: "camden-ivf",
    regionSlug: "london",
    pricingCompleteness: "partial",
    fundingRoutes: ["nhs", "private"],
    clinicName: "Camden IVF Clinic",
    location: "London",
    consultation: 220,
    eggRetrieval: 3400,
    ivfCycle: 4800,
    embryoTransfer: 1500,
    medications: 1650,
    storagePerYear: 380,
    geneticTesting: 3000,
    embryoFreezing: 1200,
    fertilityTestPanel: 280,
    successRate: 0,
    total: 0
  },
  {
    id: 4,
    slug: "mersey-fertility",
    regionSlug: "north-west",
    pricingCompleteness: "full",
    fundingRoutes: ["nhs", "private"],
    clinicName: "Mersey Fertility Institute",
    location: "Liverpool",
    consultation: 150,
    eggRetrieval: 2700,
    ivfCycle: 3800,
    embryoTransfer: 1150,
    medications: 1250,
    storagePerYear: 270,
    geneticTesting: 2300,
    embryoFreezing: 900,
    fertilityTestPanel: 190,
    successRate: 0,
    total: 0
  },
  {
    id: 5,
    slug: "pennine-reproductive",
    regionSlug: "north-west",
    pricingCompleteness: "full",
    fundingRoutes: ["nhs", "private"],
    clinicName: "Pennine Reproductive Centre",
    location: "Manchester",
    consultation: 165,
    eggRetrieval: 2900,
    ivfCycle: 4100,
    embryoTransfer: 1250,
    medications: 1350,
    storagePerYear: 290,
    geneticTesting: 2500,
    embryoFreezing: 980,
    fertilityTestPanel: 210,
    successRate: 0,
    total: 0
  },
  {
    id: 6,
    slug: "northern-lights-fertility",
    regionSlug: "scotland",
    pricingCompleteness: "full",
    fundingRoutes: ["nhs", "private"],
    clinicName: "Northern Lights Fertility",
    location: "Edinburgh",
    consultation: 160,
    eggRetrieval: 2800,
    ivfCycle: 4000,
    embryoTransfer: 1200,
    medications: 1300,
    storagePerYear: 280,
    geneticTesting: 2400,
    embryoFreezing: 950,
    fertilityTestPanel: 200,
    successRate: 0,
    total: 0
  },
  {
    id: 7,
    slug: "clyde-reproductive",
    regionSlug: "scotland",
    pricingCompleteness: "partial",
    fundingRoutes: ["nhs"],
    clinicName: "Clyde Reproductive Health",
    location: "Glasgow",
    consultation: 145,
    eggRetrieval: 2650,
    ivfCycle: 3700,
    embryoTransfer: 1100,
    medications: 1200,
    storagePerYear: 260,
    geneticTesting: 2250,
    embryoFreezing: 880,
    fertilityTestPanel: 180,
    successRate: 0,
    total: 0
  },
  {
    id: 8,
    slug: "severn-fertility",
    regionSlug: "south-west",
    pricingCompleteness: "none",
    fundingRoutes: ["private"],
    clinicName: "Severn Fertility Clinic",
    location: "Bristol",
    consultation: 190,
    eggRetrieval: 3100,
    ivfCycle: 4400,
    embryoTransfer: 1350,
    medications: 1450,
    storagePerYear: 330,
    geneticTesting: 2700,
    embryoFreezing: 1050,
    fertilityTestPanel: 240,
    successRate: 0,
    total: 0
  },
  {
    id: 9,
    slug: "midlands-fertility",
    regionSlug: "west-midlands",
    pricingCompleteness: "full",
    fundingRoutes: ["nhs", "private"],
    clinicName: "Midlands Fertility Institute",
    location: "Birmingham",
    consultation: 170,
    eggRetrieval: 2950,
    ivfCycle: 4200,
    embryoTransfer: 1280,
    medications: 1380,
    storagePerYear: 300,
    geneticTesting: 2550,
    embryoFreezing: 1000,
    fertilityTestPanel: 215,
    successRate: 0,
    total: 0
  },
  {
    id: 10,
    slug: "wharfedale-reproductive",
    regionSlug: "yorkshire",
    pricingCompleteness: "partial",
    fundingRoutes: ["nhs", "private"],
    clinicName: "Wharfedale Reproductive Centre",
    location: "Leeds",
    consultation: 155,
    eggRetrieval: 2750,
    ivfCycle: 3900,
    embryoTransfer: 1180,
    medications: 1280,
    storagePerYear: 275,
    geneticTesting: 2350,
    embryoFreezing: 920,
    fertilityTestPanel: 195,
    successRate: 0,
    total: 0
  },
  {
    id: 11,
    slug: "cardiff-bay-fertility",
    regionSlug: "wales",
    pricingCompleteness: "full",
    fundingRoutes: ["nhs", "private"],
    clinicName: "Cardiff Bay Fertility",
    location: "Cardiff",
    consultation: 150,
    eggRetrieval: 2700,
    ivfCycle: 3850,
    embryoTransfer: 1150,
    medications: 1240,
    storagePerYear: 265,
    geneticTesting: 2300,
    embryoFreezing: 900,
    fertilityTestPanel: 185,
    successRate: 0,
    total: 0
  },
  {
    id: 12,
    slug: "lagan-fertility",
    regionSlug: "northern-ireland",
    pricingCompleteness: "none",
    fundingRoutes: ["private"],
    clinicName: "Lagan Fertility Centre",
    location: "Belfast",
    consultation: 175,
    eggRetrieval: 3000,
    ivfCycle: 4250,
    embryoTransfer: 1300,
    medications: 1400,
    storagePerYear: 310,
    geneticTesting: 2600,
    embryoFreezing: 1020,
    fertilityTestPanel: 225,
    successRate: 0,
    total: 0
  }
];

type ServiceType = 'egg-freezing' | 'embryo' | 'ivf' | 'fertility';

// Priced line items are always named explicitly. A total is the sum of real,
// individually quoted components — never a multiplier applied to an unrelated
// price. If a clinic has not quoted one of these, its total is unavailable
// rather than estimated.
const PRICED_COMPONENTS: Record<ServiceType, (keyof ClinicCost)[]> = {
  'egg-freezing': ['consultation', 'eggRetrieval', 'medications', 'storagePerYear'],
  embryo: ['consultation', 'eggRetrieval', 'medications', 'embryoFreezing', 'storagePerYear'],
  ivf: ['consultation', 'eggRetrieval', 'ivfCycle', 'embryoTransfer', 'medications'],
  fertility: ['consultation', 'fertilityTestPanel'],
};

export const COMPONENT_LABELS: Partial<Record<keyof ClinicCost, string>> = {
  consultation: 'Consultation',
  eggRetrieval: 'Egg retrieval',
  ivfCycle: 'IVF cycle',
  embryoTransfer: 'Embryo transfer',
  medications: 'Medications',
  storagePerYear: 'Storage (first year)',
  embryoFreezing: 'Fertilisation & freezing',
  fertilityTestPanel: 'Test panel',
};

export interface PricedClinic extends ClinicCost {
  /** null when the clinic has not quoted every component of this service */
  total: number | null;
  components: { key: keyof ClinicCost; label: string; amount: number }[];
}

function getServiceData(serviceType: ServiceType): PricedClinic[] {
  const keys = PRICED_COMPONENTS[serviceType];

  return mockClinicData.map((clinic) => {
    const components = keys.map((key) => ({
      key,
      label: COMPONENT_LABELS[key] ?? String(key),
      amount: clinic[key] as number,
    }));

    const incomplete = components.some(
      (c) => typeof c.amount !== 'number' || Number.isNaN(c.amount)
    );

    return {
      ...clinic,
      components,
      total: incomplete ? null : components.reduce((sum, c) => sum + c.amount, 0),
    };
  });
}

export function ClinicCostings({
  serviceType,
  atHomeOnly,
  location = 'all',
  clinic: clinicFilter = 'all',
  budgetRange = 'all',
  onShowPrivacy = () => {},
}: ClinicCostingsProps) {
  const [ageBand, setAgeBand] = useState<AgeBand>('35-37');
  const [transparencyOnly, setTransparencyOnly] = useState(false);
  const [funding, setFunding] = useState<'all' | 'nhs' | 'private'>('all');
  const [enquiring, setEnquiring] = useState<{ slug: string; name: string } | null>(null);
  const [minSuccess, setMinSuccess] = useState<number | null>(null);
  const [sortField, setSortField] = useState<keyof ClinicCost>('total');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const handleSort = (field: keyof ClinicCost) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const allPriced = getServiceData(serviceType).map((c) => ({
    ...c,
    outcome: getOutcome(c.slug, ageBand),
    provenance: getProvenance(c.slug),
  }));

  // The columns shown are exactly the components summed into the total for this
  // service, so the line items on screen always reconcile with the Total — a
  // testing quote never shows an IVF-cycle column, and the visible figures
  // always add up to the number in the Total column.
  const columns = PRICED_COMPONENTS[serviceType];

  // Hard filters from the search form. Each is skipped when unset so that an
  // untouched form returns everything.
  const budget = getBudgetBounds(serviceType, budgetRange);
  // Everything except the minimum-success filter, so each threshold can be
  // tested against the same set the user is currently looking at.
  const withoutMinSuccess = allPriced.filter((c) => {
    if (location !== 'all' && c.regionSlug !== location) return false;
    if (clinicFilter !== 'all' && c.slug !== clinicFilter) return false;
    if (budget) {
      if (c.total === null) return false;
      if (c.total < budget.min || c.total >= budget.max) return false;
    }
    if (transparencyOnly && c.pricingCompleteness !== 'full') return false;
    if (funding !== 'all' && !c.fundingRoutes.includes(funding)) return false;
    return true;
  });

  // Only exclude on evidence: a clinic with no published figure for this age
  // band is not the same as one that published a low figure.
  const passesMinSuccess = (c: (typeof withoutMinSuccess)[number], threshold: number | null) =>
    threshold === null || !(c.outcome && c.outcome.rate < threshold);

  const filteredData = withoutMinSuccess.filter((c) => passesMinSuccess(c, minSuccess));

  // A threshold that would leave zero clinics (given every other active filter,
  // and the selected age band) is offered as disabled rather than as a dead
  // option that silently empties the table. Recomputes when the age band or any
  // other filter changes.
  const SUCCESS_THRESHOLDS: (number | null)[] = [null, 20, 30, 40];
  const emptyThresholds = new Set(
    SUCCESS_THRESHOLDS.filter(
      (v): v is number => v !== null && !withoutMinSuccess.some((c) => passesMinSuccess(c, v))
    )
  );

  // If the current selection becomes impossible (e.g. after switching to an age
  // band where no clinic reaches it), fall back to "Any" so the user never sits
  // on an empty table caused by a now-invalid filter.
  useEffect(() => {
    if (minSuccess !== null && emptyThresholds.has(minSuccess)) setMinSuccess(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minSuccess, ageBand, location, clinicFilter, budgetRange, transparencyOnly, funding]);

  const activeFilterCount =
    (location !== 'all' ? 1 : 0) +
    (clinicFilter !== 'all' ? 1 : 0) +
    (budget ? 1 : 0) +
    (transparencyOnly ? 1 : 0) +
    (funding !== 'all' ? 1 : 0) +
    (minSuccess !== null ? 1 : 0);

  const sortedData = [...filteredData].sort((a, b) => {
    // Success sorts on the rate for the selected age band, not the legacy
    // clinic-wide scalar, so the column and the ordering always agree.
    const aValue = sortField === 'successRate' ? a.outcome?.rate ?? null : a[sortField];
    const bValue = sortField === 'successRate' ? b.outcome?.rate ?? null : b[sortField];

    // Clinics without a complete quote always sort last, whichever direction.
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  // Best published outcome among the clinics currently matching, for the
  // selected age band — not a clinic-wide figure across all ages.
  const bestOutcome = sortedData
    .filter((c) => c.outcome)
    .sort((a, b) => b.outcome!.rate - a.outcome!.rate)[0];

  const quotedTotals = sortedData
    .map((c) => c.total)
    .filter((t): t is number => t !== null);
  const lowestTotal = quotedTotals.length ? Math.min(...quotedTotals) : null;

  // Summary cards describe the clinics currently matching, using computed
  // service totals — not the raw record, whose total is only a placeholder.
  const cheapest =
    lowestTotal !== null ? sortedData.find((c) => c.total === lowestTotal) ?? null : null;
  const averageTotal = quotedTotals.length
    ? Math.round(quotedTotals.reduce((a, b) => a + b, 0) / quotedTotals.length)
    : null;

  const toggleRowExpansion = (id: number) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  // If fertility testing and at-home only selected, show at-home test kits
  if (serviceType === 'fertility' && atHomeOnly) {
    return <AtHomeTestKitsComparison />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-2">Clinic Cost Comparison</h2>
        <p className="text-[#5C6478]">
          {sortedData.length} of {allPriced.length} clinics
          {activeFilterCount > 0 && (
            <> · {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied</>
          )}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#DEE8FF]/50 p-4 rounded-lg border-l-4 border border-[#A8BEEB]/60 border-l-[#5B6AA5]">
          <div className="text-sm text-[#5B6AA5] mb-1">Lowest Total Cost</div>
          <div className="text-2xl">
            {cheapest ? `£${cheapest.total!.toLocaleString()}` : '—'}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {cheapest ? cheapest.clinicName : 'No quoted prices'}
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-[#5B6AA5] mb-1">Average Cost</div>
          <div className="text-2xl">
            {averageTotal !== null ? `£${averageTotal.toLocaleString()}` : '—'}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {averageTotal !== null ? `Across ${quotedTotals.length} quoted clinics` : 'No quoted prices'}
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-[#5B6AA5] mb-1">Highest Success Rate</div>
          <div className="text-2xl">
            {bestOutcome ? `${bestOutcome.outcome!.rate}%` : '—'}
            {bestOutcome?.outcome!.lowSample && (
              <span className="text-xs font-normal text-[#B4762F]"> · small sample</span>
            )}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {bestOutcome
              ? `${bestOutcome.clinicName} · ${bestOutcome.outcome!.liveBirths}/${bestOutcome.outcome!.cyclesStarted} cycles, age ${AGE_BANDS.find((b) => b.id === ageBand)?.label.toLowerCase()}`
              : 'No published outcomes'}
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-[#5B6AA5] mb-1">Clinics Compared</div>
          <div className="text-2xl">{sortedData.length}</div>
          <div className="text-sm text-gray-500 mt-1">Matching your filters</div>
        </div>
      </div>

      {/* Age band — success rates are meaningless without it */}
      <div className="glass rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        <div className="lg:max-w-xs">
          <div className="text-sm font-semibold text-[#2F3440] mb-1">Success rates for age</div>
          <p className="text-xs text-[#5C6478] leading-relaxed">
            Outcomes vary sharply with age. Pick your band to see comparable figures.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {AGE_BANDS.map((b) => (
            <button
              key={b.id}
              onClick={() => setAgeBand(b.id)}
              className={`grain text-sm font-medium px-4 py-2 rounded-full transition-all ${
                ageBand === b.id
                  ? 'bg-[#2F3440] text-white'
                  : 'bg-white/60 text-[#2F3440] hover:bg-white/80'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#5C6478] -mt-2">
        Showing <strong className="font-semibold text-[#2F3440]">{OUTCOME_BASIS.outcomeType}</strong>{' '}
        {OUTCOME_BASIS.denominatorType}, {OUTCOME_BASIS.year}. Source: {OUTCOME_BASIS.source}.
      </p>

      {/* Sample data notice — remove once real listings are ingested */}
      <div className="glass rounded-2xl p-4 text-xs text-[#5C6478] leading-relaxed">
        <span className="font-semibold text-[#B4762F]">Sample data.</span> These clinics are
        fictional and their prices and outcomes are illustrative, used to build and test the
        comparison. No figure here describes a real clinic.
      </div>

      {/* Refine */}
      <div className="glass rounded-2xl p-5 flex flex-wrap items-end gap-x-8 gap-y-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-[#5C6478] mb-2">
            Minimum success rate
          </div>
          <div className="flex flex-wrap gap-2">
            {SUCCESS_THRESHOLDS.map((v) => {
              const disabled = v !== null && emptyThresholds.has(v);
              return (
                <button
                  key={String(v)}
                  onClick={() => setMinSuccess(v)}
                  disabled={disabled}
                  title={
                    disabled
                      ? `No clinic reaches ${v}% for this age band and the current filters`
                      : undefined
                  }
                  className={`grain text-sm font-medium px-3.5 py-1.5 rounded-full transition-all ${
                    disabled
                      ? 'bg-white/40 text-[#B0B6C4] cursor-not-allowed'
                      : minSuccess === v
                      ? 'bg-[#2F3440] text-white'
                      : 'bg-white/60 text-[#2F3440] hover:bg-white/80'
                  }`}
                >
                  {v === null ? 'Any' : `${v}%+`}
                </button>
              );
            })}
          </div>
          {minSuccess !== null && (
            <p className="text-[11px] text-[#5C6478] mt-2 max-w-xs leading-relaxed">
              Clinics with no published rate for this age band are still shown — a clinic is only
              excluded when it has published a figure below {minSuccess}%.
            </p>
          )}
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-[#5C6478] mb-2">
            Funding route
          </div>
          <div className="flex flex-wrap gap-2">
            {([['all','Any'],['nhs','NHS funded'],['private','Private']] as const).map(([id,label]) => (
              <button
                key={id}
                onClick={() => setFunding(id)}
                className={`grain text-sm font-medium px-3.5 py-1.5 rounded-full transition-all ${
                  funding === id
                    ? 'bg-[#2F3440] text-white'
                    : 'bg-white/60 text-[#2F3440] hover:bg-white/80'
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
            checked={transparencyOnly}
            onChange={(e) => setTransparencyOnly(e.target.checked)}
            className="accent-[#F8AD7C] w-4 h-4"
          />
          Publishes full pricing only
        </label>
      </div>

      {/* Where the prices come from */}
      <div className="glass rounded-2xl p-5">
        <div className="text-sm font-semibold text-[#2F3440] mb-3">Where these prices come from</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {(Object.keys(PRICE_SOURCES) as (keyof typeof PRICE_SOURCES)[]).map((key) => (
            <div key={key} className="flex gap-2.5 text-xs leading-relaxed">
              <span
                className={`font-semibold whitespace-nowrap ${
                  key === 'partner'
                    ? 'text-[#4F7A52]'
                    : key === 'unverified'
                    ? 'text-[#B4762F]'
                    : 'text-[#5C6478]'
                }`}
              >
                {PRICE_SOURCES[key].short}
              </span>
              <span className="text-[#5C6478]">{PRICE_SOURCES[key].description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* No results */}
      {sortedData.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center">
          <h3 className="text-lg font-semibold text-[#2F3440] mb-2">
            No clinics match these filters
          </h3>
          <p className="text-[#5C6478] max-w-md mx-auto">
            No clinic matches this combination of location, provider, budget, funding route and
            minimum success rate. Try widening the budget, lowering the minimum success rate, or
            clearing the location to see what else is available.
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
                    onClick={() => handleSort('clinicName')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Clinic Name
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                {columns.map((key) => (
                  <TableHead key={key}>
                    <button
                      onClick={() => handleSort(key)}
                      className="flex items-center gap-1 hover:text-[#5B6AA5]"
                    >
                      {COMPONENT_LABELS[key] ?? key}
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead>
                ))}
                <TableHead>
                  <button
                    onClick={() => handleSort('successRate')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Success Rate
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('total')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Total Cost
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((clinic) => (
                <Fragment key={clinic.id}>
                  <TableRow className={lowestTotal !== null && clinic.total === lowestTotal ? 'bg-[#DEE8FF]/40' : ''}>
                    <TableCell>
                      <button
                        onClick={() => toggleRowExpansion(clinic.id)}
                        className="hover:text-[#5B6AA5]"
                      >
                        {expandedRows.includes(clinic.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          {clinic.clinicName}
                          {clinic.pricingCompleteness !== 'full' && (
                            <span
                              className="grain text-[10px] font-semibold uppercase tracking-wide text-[#B4762F] bg-[#F8AD7C]/20 px-2 py-0.5 rounded-full whitespace-nowrap"
                              title={
                                clinic.pricingCompleteness === 'none'
                                  ? 'This clinic does not publish its prices. Our figures come from other sources.'
                                  : 'This clinic publishes only part of its price list.'
                              }
                            >
                              {clinic.pricingCompleteness === 'none'
                                ? 'No published prices'
                                : 'Partial pricing'}
                            </span>
                          )}
                          {lowestTotal !== null && clinic.total === lowestTotal && (
                            <span className="grain text-[10px] font-semibold uppercase tracking-wide text-[#5B6AA5] bg-[#DEE8FF]/70 px-2 py-0.5 rounded-full whitespace-nowrap">
                              Best value
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{clinic.location}</div>
                      </div>
                    </TableCell>
                    {clinic.components.map((c) => (
                      <TableCell key={c.key}>£{c.amount.toLocaleString()}</TableCell>
                    ))}
                    <TableCell>
                      {clinic.outcome ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[48px]">
                              <div
                                className="bg-[#5B6AA5] h-2 rounded-full"
                                style={{ width: `${clinic.outcome.rate}%` }}
                              />
                            </div>
                            <span className="text-sm whitespace-nowrap">{clinic.outcome.rate}%</span>
                          </div>
                          <div className="text-[11px] text-[#5C6478] mt-1 whitespace-nowrap">
                            {clinic.outcome.liveBirths}/{clinic.outcome.cyclesStarted} cycles
                            {clinic.outcome.lowSample && (
                              <span className="text-[#B4762F]"> · small sample</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-[#5C6478]">Not published</span>
                      )}
                    </TableCell>
                    <TableCell className="text-[#5B6AA5]">
                      {clinic.total !== null ? (
                        `£${clinic.total.toLocaleString()}`
                      ) : (
                        <span className="text-[#5C6478] text-sm">Not quoted</span>
                      )}
                      {clinic.provenance && (
                        <div
                          className="text-[11px] mt-1 whitespace-nowrap"
                          title={`${clinic.provenance.meta.label} — ${clinic.provenance.meta.description}`}
                        >
                          <span
                            className={
                              clinic.provenance.source === 'partner'
                                ? 'text-[#4F7A52]'
                                : clinic.provenance.source === 'unverified'
                                ? 'text-[#B4762F]'
                                : 'text-[#5C6478]'
                            }
                          >
                            {clinic.provenance.meta.short}
                          </span>
                          <span className="text-[#5C6478]">
                            {' '}· {clinic.provenance.verifiedLabel}
                            {clinic.provenance.isStale && ' · stale'}
                          </span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                  
                  {expandedRows.includes(clinic.id) && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={columns.length + 4} className="p-6">
                        <div className="max-w-md space-y-4">
                          <div>
                            <h4 className="mb-3 text-sm font-semibold text-[#2F3440]">
                              What makes up this total
                            </h4>
                            <div className="space-y-2 text-sm">
                              {clinic.components.map((c) => (
                                <div key={c.key} className="flex justify-between">
                                  <span className="text-[#5C6478]">{c.label}</span>
                                  <span className="text-[#2F3440]">£{c.amount.toLocaleString()}</span>
                                </div>
                              ))}
                              <div className="flex justify-between border-t pt-2 font-semibold">
                                <span className="text-[#2F3440]">Total</span>
                                <span className="text-[#2F3440]">
                                  {clinic.total !== null
                                    ? `£${clinic.total.toLocaleString()}`
                                    : 'Not quoted'}
                                </span>
                              </div>
                            </div>
                            {clinic.provenance && (
                              <p className="text-[11px] text-[#5C6478] mt-3 leading-relaxed">
                                {clinic.provenance.meta.label} · {clinic.provenance.verifiedLabel}
                                {clinic.provenance.isStale && ' · may be out of date'}
                              </p>
                            )}
                          </div>

                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              className="bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold"
                              onClick={() =>
                                setEnquiring({ slug: clinic.slug, name: clinic.clinicName })
                              }
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