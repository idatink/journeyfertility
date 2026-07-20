import { useState, Fragment } from 'react';
import { ArrowUpDown, Download, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { ClinicDetailedCostings } from './ClinicDetailedCostings';
import { AtHomeTestKitsComparison } from './AtHomeTestKitsComparison';
import { getBudgetBounds } from '../lib/budget';
import { AGE_BANDS, OUTCOME_BASIS, getOutcome, type AgeBand, type OutcomeRate } from '../lib/outcomes';

interface ClinicCostingsProps {
  serviceType: 'egg-freezing' | 'embryo' | 'ivf' | 'fertility';
  atHomeOnly?: boolean;
  /** city slug from the search form, or 'all' */
  location?: string;
  /** clinic slug from the search form, or 'all' */
  clinic?: string;
  /** budget bracket id from the search form, or 'all' / 'flexible' */
  budgetRange?: string;
}

// Budget bounds come from the shared bracket table so the form options and the
// filter can never drift apart.

interface ClinicCost {
  id: number;
  slug: string;
  citySlug: string;
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
    slug: "reproductive-health",
    citySlug: "new-york",
    clinicName: "Reproductive Health Center",
    location: "New York, NY",
    consultation: 350,
    eggRetrieval: 8500,
    ivfCycle: 12000,
    embryoTransfer: 4500,
    medications: 4500,
    storagePerYear: 800,
    geneticTesting: 3500,
    embryoFreezing: 4200,
    fertilityTestPanel: 650,
    successRate: 68,
    total: 34150
  },
  {
    id: 2,
    slug: "fertility-la",
    citySlug: "los-angeles",
    clinicName: "Fertility Institute of LA",
    location: "Los Angeles, CA",
    consultation: 300,
    eggRetrieval: 9200,
    ivfCycle: 13500,
    embryoTransfer: 5000,
    medications: 5200,
    storagePerYear: 950,
    geneticTesting: 4000,
    embryoFreezing: 4600,
    fertilityTestPanel: 720,
    successRate: 71,
    total: 38150
  },
  {
    id: 3,
    slug: "boston-ivf",
    citySlug: "boston",
    clinicName: "Boston IVF",
    location: "Boston, MA",
    consultation: 400,
    eggRetrieval: 8000,
    ivfCycle: 11500,
    embryoTransfer: 4200,
    medications: 4000,
    storagePerYear: 750,
    geneticTesting: 3200,
    embryoFreezing: 3900,
    fertilityTestPanel: 600,
    successRate: 65,
    total: 32050
  },
  {
    id: 4,
    slug: "chicago-fertility",
    citySlug: "chicago",
    clinicName: "Chicago Fertility Center",
    location: "Chicago, IL",
    consultation: 325,
    eggRetrieval: 7800,
    ivfCycle: 10800,
    embryoTransfer: 3900,
    medications: 3800,
    storagePerYear: 700,
    geneticTesting: 3000,
    embryoFreezing: 3600,
    fertilityTestPanel: 540,
    successRate: 62,
    total: 30325
  },
  {
    id: 5,
    slug: "pacific-fertility",
    citySlug: "san-francisco",
    clinicName: "Pacific Fertility",
    location: "San Francisco, CA",
    consultation: 450,
    eggRetrieval: 10000,
    ivfCycle: 14500,
    embryoTransfer: 5500,
    medications: 5800,
    storagePerYear: 1000,
    geneticTesting: 4500,
    embryoFreezing: 5000,
    fertilityTestPanel: 850,
    successRate: 73,
    total: 41750
  },
  {
    id: 6,
    slug: "texas-fertility",
    citySlug: "austin",
    clinicName: "Texas Fertility Clinic",
    location: "Austin, TX",
    consultation: 275,
    eggRetrieval: 7200,
    ivfCycle: 10000,
    embryoTransfer: 3600,
    medications: 3500,
    storagePerYear: 650,
    geneticTesting: 2800,
    embryoFreezing: 3300,
    fertilityTestPanel: 480,
    successRate: 59,
    total: 28025
  },
  {
    id: 7,
    slug: "memorial-bahcelievler",
    citySlug: "istanbul",
    clinicName: "Memorial Bahçelievler IVF Center",
    location: "Istanbul, Turkey",
    consultation: 150,
    eggRetrieval: 3200,
    ivfCycle: 4500,
    embryoTransfer: 1800,
    medications: 2000,
    storagePerYear: 400,
    geneticTesting: 1500,
    embryoFreezing: 1500,
    fertilityTestPanel: 260,
    successRate: 64,
    total: 13550
  },
  {
    id: 8,
    slug: "acibadem-maslak",
    citySlug: "istanbul",
    clinicName: "Acıbadem Maslak Hospital IVF",
    location: "Istanbul, Turkey",
    consultation: 200,
    eggRetrieval: 3500,
    ivfCycle: 5000,
    embryoTransfer: 2000,
    medications: 2200,
    storagePerYear: 450,
    geneticTesting: 1800,
    embryoFreezing: 1750,
    fertilityTestPanel: 310,
    successRate: 67,
    total: 15150
  },
  {
    id: 9,
    slug: "istanbul-fertility",
    citySlug: "istanbul",
    clinicName: "Istanbul Fertility Center",
    location: "Istanbul, Turkey",
    consultation: 120,
    eggRetrieval: 2800,
    ivfCycle: 4200,
    embryoTransfer: 1600,
    medications: 1800,
    storagePerYear: 350,
    geneticTesting: 1400,
    embryoFreezing: 1300,
    fertilityTestPanel: 210,
    successRate: 61,
    total: 12270
  },
  {
    id: 10,
    slug: "american-hospital-istanbul",
    citySlug: "istanbul",
    clinicName: "American Hospital IVF Clinic",
    location: "Istanbul, Turkey",
    consultation: 250,
    eggRetrieval: 4000,
    ivfCycle: 5500,
    embryoTransfer: 2200,
    medications: 2400,
    storagePerYear: 500,
    geneticTesting: 2000,
    embryoFreezing: 1950,
    fertilityTestPanel: 380,
    successRate: 69,
    total: 16850
  },
  {
    id: 11,
    slug: "jinemed",
    citySlug: "istanbul",
    clinicName: "Jinemed Hospital Women's Health",
    location: "Istanbul, Turkey",
    consultation: 180,
    eggRetrieval: 3400,
    ivfCycle: 4800,
    embryoTransfer: 1900,
    medications: 2100,
    storagePerYear: 420,
    geneticTesting: 1600,
    embryoFreezing: 1600,
    fertilityTestPanel: 290,
    successRate: 66,
    total: 14400
  },
  {
    id: 12,
    slug: "medipol-mega",
    citySlug: "istanbul",
    clinicName: "Medipol Mega Hospital IVF",
    location: "Istanbul, Turkey",
    consultation: 160,
    eggRetrieval: 3100,
    ivfCycle: 4400,
    embryoTransfer: 1700,
    medications: 1900,
    storagePerYear: 380,
    geneticTesting: 1500,
    embryoFreezing: 1450,
    fertilityTestPanel: 240,
    successRate: 63,
    total: 13140
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
}: ClinicCostingsProps) {
  const [ageBand, setAgeBand] = useState<AgeBand>('35-37');
  const [sortField, setSortField] = useState<keyof ClinicCost>('total');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedClinics, setSelectedClinics] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [viewingClinicDetails, setViewingClinicDetails] = useState<{ 
    id: number; 
    name: string;
    data: {
      consultation: number;
      eggRetrieval: number;
      ivfCycle: number;
      embryoTransfer: number;
      medications: number;
      storagePerYear: number;
      geneticTesting: number;
      total: number;
    }
  } | null>(null);

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
  }));

  // Hard filters from the search form. Each is skipped when unset so that an
  // untouched form returns everything.
  const budget = getBudgetBounds(serviceType, budgetRange);
  const filteredData = allPriced.filter((c) => {
    if (location !== 'all' && c.citySlug !== location) return false;
    if (clinicFilter !== 'all' && c.slug !== clinicFilter) return false;
    if (budget) {
      if (c.total === null) return false;
      if (c.total < budget.min || c.total >= budget.max) return false;
    }
    return true;
  });

  const activeFilterCount =
    (location !== 'all' ? 1 : 0) + (clinicFilter !== 'all' ? 1 : 0) + (budget ? 1 : 0);

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

  const toggleClinicSelection = (id: number) => {
    setSelectedClinics(prev => 
      prev.includes(id) ? prev.filter(clinicId => clinicId !== id) : [...prev, id]
    );
  };

  const toggleRowExpansion = (id: number) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleViewDetails = (clinic: ClinicCost) => {
    setViewingClinicDetails({ 
      id: clinic.id, 
      name: clinic.clinicName,
      data: {
        consultation: clinic.consultation,
        eggRetrieval: clinic.eggRetrieval,
        ivfCycle: clinic.ivfCycle,
        embryoTransfer: clinic.embryoTransfer,
        medications: clinic.medications,
        storagePerYear: clinic.storagePerYear,
        geneticTesting: clinic.geneticTesting,
        total: clinic.total
      }
    });
  };

  // If viewing detailed costings for a specific clinic, show that view
  if (viewingClinicDetails) {
    return (
      <ClinicDetailedCostings 
        clinicName={viewingClinicDetails.name}
        clinicData={viewingClinicDetails.data}
        onBack={() => setViewingClinicDetails(null)}
      />
    );
  }

  // If fertility testing and at-home only selected, show at-home test kits
  if (serviceType === 'fertility' && atHomeOnly) {
    return <AtHomeTestKitsComparison />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl mb-2">Clinic Cost Comparison</h2>
          <p className="text-[#5C6478]">
            {sortedData.length} of {allPriced.length} clinics
            {activeFilterCount > 0 && (
              <> · {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied</>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#DEE8FF]/50 p-4 rounded-lg border-l-4 border border-[#A8BEEB]/60 border-l-[#5B6AA5]">
          <div className="text-sm text-[#5B6AA5] mb-1">Lowest Total Cost</div>
          <div className="text-2xl">${Math.min(...mockClinicData.map(c => c.total)).toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Memorial Bahçelievler</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-[#5B6AA5] mb-1">Average Cost</div>
          <div className="text-2xl">${Math.round(mockClinicData.reduce((acc, c) => acc + c.total, 0) / mockClinicData.length).toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Across all clinics</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-[#5B6AA5] mb-1">Highest Success Rate</div>
          <div className="text-2xl">{bestOutcome ? `${bestOutcome.outcome!.rate}%` : '—'}</div>
          <div className="text-sm text-gray-500 mt-1">
            {bestOutcome
              ? `${bestOutcome.clinicName}, age ${AGE_BANDS.find((b) => b.id === ageBand)?.label.toLowerCase()}`
              : 'No published outcomes'}
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-[#5B6AA5] mb-1">Clinics Compared</div>
          <div className="text-2xl">{mockClinicData.length}</div>
          <div className="text-sm text-gray-500 mt-1">In your search</div>
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

      {/* No results */}
      {sortedData.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center">
          <h3 className="text-lg font-semibold text-[#2F3440] mb-2">
            No clinics match these filters
          </h3>
          <p className="text-[#5C6478] max-w-md mx-auto">
            We do not yet list a clinic for this combination of location, provider and budget. Try
            widening the budget or clearing the location to see what else is available.
          </p>
        </div>
      )}

      {/* Table */}
      <div className={`border rounded-lg overflow-hidden bg-white ${sortedData.length === 0 ? 'hidden' : ''}`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedClinics.length === mockClinicData.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedClinics(mockClinicData.map(c => c.id));
                      } else {
                        setSelectedClinics([]);
                      }
                    }}
                  />
                </TableHead>
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
                <TableHead>
                  <button 
                    onClick={() => handleSort('consultation')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Consultation
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('eggRetrieval')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Egg Retrieval
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('ivfCycle')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    IVF Cycle
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('embryoTransfer')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Embryo Transfer
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('medications')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Medications
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
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
                  <TableRow className={selectedClinics.includes(clinic.id) ? 'bg-[#EEF2FE]' : clinic.total === lowestTotal ? 'bg-[#DEE8FF]/40' : ''}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedClinics.includes(clinic.id)}
                        onCheckedChange={() => toggleClinicSelection(clinic.id)}
                      />
                    </TableCell>
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
                          {clinic.total === lowestTotal && (
                            <span className="grain text-[10px] font-semibold uppercase tracking-wide text-[#5B6AA5] bg-[#DEE8FF]/70 px-2 py-0.5 rounded-full whitespace-nowrap">
                              Best value
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{clinic.location}</div>
                      </div>
                    </TableCell>
                    <TableCell>${clinic.consultation.toLocaleString()}</TableCell>
                    <TableCell>${clinic.eggRetrieval.toLocaleString()}</TableCell>
                    <TableCell>${clinic.ivfCycle.toLocaleString()}</TableCell>
                    <TableCell>${clinic.embryoTransfer.toLocaleString()}</TableCell>
                    <TableCell>${clinic.medications.toLocaleString()}</TableCell>
                    <TableCell>
                      {clinic.outcome ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[48px]">
                              <div
                                className="bg-[#A8BEEB] h-2 rounded-full"
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
                        `$${clinic.total.toLocaleString()}`
                      ) : (
                        <span className="text-[#5C6478] text-sm">Not quoted</span>
                      )}
                    </TableCell>
                  </TableRow>
                  
                  {expandedRows.includes(clinic.id) && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={10} className="p-6">
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="mb-3 text-gray-700">Additional Costs</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Storage (per year):</span>
                                  <span>${clinic.storagePerYear.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Genetic Testing:</span>
                                  <span>${clinic.geneticTesting.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="mb-3 text-gray-700">Clinic Details</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Insurance Accepted:</span>
                                  <span className="text-green-600">Yes</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Payment Plans:</span>
                                  <span className="text-green-600">Available</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <div className="flex gap-3 justify-end">
                              <Button variant="outline" size="sm">View Full Details</Button>
                              <Button variant="outline" size="sm">Book Consultation</Button>
                              <Button className="bg-[#2F3440] hover:bg-[#5B6AA5]" size="sm" onClick={() => handleViewDetails(clinic)}>
                                See clinic costings
                              </Button>
                            </div>
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

      {/* Footer Actions */}
      {selectedClinics.length > 0 && (
        <div className="flex items-center justify-between p-4 glass rounded-xl">
          <div className="text-sm">
            <span className="text-[#5B6AA5]">{selectedClinics.length} clinic{selectedClinics.length > 1 ? 's' : ''}</span> selected
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">Compare Selected</Button>
            <Button size="sm">Contact Selected Clinics</Button>
          </div>
        </div>
      )}
    </div>
  );
}