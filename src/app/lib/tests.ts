/**
 * Direct-pay fertility testing.
 *
 * This is the one vertical where the supply problem is already solved: test
 * providers sell direct to consumers, so price, panel contents and turnaround
 * are all published on their own sites. No rate card negotiation required.
 *
 * Every field below that describes a real company is therefore either sourced
 * from that company's site on a recorded date, or left null and listed in
 * needsSourcing. Nothing here is estimated — attributing a price or a panel to
 * a named business without reading it off their site would be inventing facts
 * about a real company.
 */

export const BIOMARKERS = [
  'AMH',
  'FSH',
  'LH',
  'Oestradiol',
  'Progesterone',
  'Prolactin',
  'TSH',
  'FT4',
  'Testosterone',
  'SHBG',
  'DHEA-S',
  'Cortisol',
] as const;

export type Biomarker = (typeof BIOMARKERS)[number];

export type Collection = 'at-home' | 'clinic' | 'both';
export type SampleType = 'finger-prick' | 'venous-draw';

export interface FertilityTest {
  id: string;
  provider: string;
  productName: string | null;
  /** where to read the published details from */
  providerUrl: string;
  market: 'UK' | 'US';
  currency: 'GBP' | 'USD';
  price: number | null;
  biomarkers: Biomarker[];
  sampleType: SampleType | null;
  collection: Collection | null;
  /** whether a clinician reviews the result with you */
  clinicianReview: boolean | null;
  turnaroundDays: number | null;
  /** analysed in an accredited laboratory */
  accreditedLab: boolean | null;
  /** ISO date the details were last read from the provider site */
  lastSourced: string | null;
  /** fields still to fill in from the provider site */
  needsSourcing: (keyof FertilityTest)[];
}

const UNSOURCED: (keyof FertilityTest)[] = [
  'productName',
  'price',
  'biomarkers',
  'sampleType',
  'collection',
  'clinicianReview',
  'turnaroundDays',
  'accreditedLab',
];

/**
 * Providers to launch with. Names and URLs are real; everything else awaits
 * sourcing. Fill these in from each provider's published product page and set
 * lastSourced to the date you read it.
 */
export const FERTILITY_TESTS: FertilityTest[] = [
  {
    id: 'hertility-hormone-fertility',
    provider: 'Hertility Health',
    productName: null,
    providerUrl: 'https://hertilityhealth.com',
    market: 'UK',
    currency: 'GBP',
    price: null,
    biomarkers: [],
    sampleType: null,
    collection: null,
    clinicianReview: null,
    turnaroundDays: null,
    accreditedLab: null,
    lastSourced: null,
    needsSourcing: UNSOURCED,
  },
  {
    id: 'randox-fertility',
    provider: 'Randox Health',
    productName: null,
    providerUrl: 'https://www.randoxhealth.com',
    market: 'UK',
    currency: 'GBP',
    price: null,
    biomarkers: [],
    sampleType: null,
    collection: null,
    clinicianReview: null,
    turnaroundDays: null,
    accreditedLab: null,
    lastSourced: null,
    needsSourcing: UNSOURCED,
  },
  {
    id: 'medichecks-fertility',
    provider: 'Medichecks',
    productName: null,
    providerUrl: 'https://www.medichecks.com',
    market: 'UK',
    currency: 'GBP',
    price: null,
    biomarkers: [],
    sampleType: null,
    collection: null,
    clinicianReview: null,
    turnaroundDays: null,
    accreditedLab: null,
    lastSourced: null,
    needsSourcing: UNSOURCED,
  },
  {
    id: 'thriva-fertility',
    provider: 'Thriva',
    productName: null,
    providerUrl: 'https://thriva.co',
    market: 'UK',
    currency: 'GBP',
    price: null,
    biomarkers: [],
    sampleType: null,
    collection: null,
    clinicianReview: null,
    turnaroundDays: null,
    accreditedLab: null,
    lastSourced: null,
    needsSourcing: UNSOURCED,
  },
  {
    id: 'forth-female-hormones',
    provider: 'Forth',
    productName: null,
    providerUrl: 'https://www.forthwithlife.co.uk',
    market: 'UK',
    currency: 'GBP',
    price: null,
    biomarkers: [],
    sampleType: null,
    collection: null,
    clinicianReview: null,
    turnaroundDays: null,
    accreditedLab: null,
    lastSourced: null,
    needsSourcing: UNSOURCED,
  },
];

export function isSourced(test: FertilityTest): boolean {
  return test.needsSourcing.length === 0;
}

export function sourcingProgress(tests: FertilityTest[]): { sourced: number; total: number } {
  return { sourced: tests.filter(isSourced).length, total: tests.length };
}

export function formatPrice(test: FertilityTest): string | null {
  if (test.price === null) return null;
  const symbol = test.currency === 'GBP' ? '£' : '$';
  return `${symbol}${test.price.toLocaleString()}`;
}

export const COLLECTION_LABELS: Record<Collection, string> = {
  'at-home': 'At-home sample',
  clinic: 'Clinic blood draw',
  both: 'At-home or clinic',
};

export interface TestFilters {
  provider: string;
  biomarkers: Biomarker[];
  collection: Collection | 'all';
  clinicianReviewOnly: boolean;
  maxTurnaroundDays: number | null;
}

export const DEFAULT_TEST_FILTERS: TestFilters = {
  provider: 'all',
  biomarkers: [],
  collection: 'all',
  clinicianReviewOnly: false,
  maxTurnaroundDays: null,
};

/**
 * Filters only ever exclude a test on evidence. A test whose data has not been
 * sourced yet is never silently dropped — it is returned and flagged, so a gap
 * in our data does not look like an absence of options.
 */
export function applyTestFilters(
  tests: FertilityTest[],
  filters: TestFilters
): FertilityTest[] {
  return tests.filter((t) => {
    if (filters.provider !== 'all' && t.provider !== filters.provider) return false;

    if (filters.biomarkers.length && t.biomarkers.length) {
      const covers = filters.biomarkers.every((b) => t.biomarkers.includes(b));
      if (!covers) return false;
    }

    if (filters.collection !== 'all' && t.collection && t.collection !== 'both') {
      if (t.collection !== filters.collection) return false;
    }

    if (filters.clinicianReviewOnly && t.clinicianReview === false) return false;

    if (
      filters.maxTurnaroundDays !== null &&
      t.turnaroundDays !== null &&
      t.turnaroundDays > filters.maxTurnaroundDays
    ) {
      return false;
    }

    return true;
  });
}
