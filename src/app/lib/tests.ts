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
  // Sourced from each provider's own product page on 23 Jul 2026. Prices and
  // panels change — re-read the providerUrl and update lastSourced when they do.
  {
    id: 'medichecks-amh',
    provider: 'Medichecks',
    productName: 'Anti-Müllerian Hormone (AMH) Blood Test',
    providerUrl: 'https://www.medichecks.com/products/anti-mullerian-hormone-amh-blood-test',
    market: 'UK',
    currency: 'GBP',
    price: 79,
    // Single marker: ovarian reserve only. The cheapest way to get a baseline.
    biomarkers: ['AMH'],
    sampleType: 'finger-prick',
    collection: 'both',
    clinicianReview: true,
    turnaroundDays: 2,
    accreditedLab: true,
    lastSourced: '2026-07-23',
    needsSourcing: [],
  },
  {
    id: 'randox-female-hormone-quickdraw',
    provider: 'Randox Health',
    productName: 'Female Hormone QuickDraw',
    providerUrl: 'https://randoxhealth.com/en-GB/product/home/female-hormone-Quickdraw',
    market: 'UK',
    currency: 'GBP',
    price: 46,
    // A hormone panel, not a reserve test — no AMH.
    biomarkers: ['FSH', 'LH', 'Oestradiol', 'Progesterone', 'Prolactin', 'Testosterone', 'SHBG'],
    sampleType: 'venous-draw',
    collection: 'at-home',
    clinicianReview: null,
    turnaroundDays: 3,
    accreditedLab: null,
    lastSourced: '2026-07-23',
    needsSourcing: ['clinicianReview', 'accreditedLab'],
  },
  {
    id: 'forth-female-fertility',
    provider: 'Forth',
    productName: 'Female Fertility Home Blood Test Kit',
    providerUrl: 'https://www.forthwithlife.co.uk/products/female-fertility-home-blood-test-kit/',
    market: 'UK',
    currency: 'GBP',
    price: 144,
    // Full panel incl. AMH and thyroid; the T3 marker it also reports is not in
    // our biomarker list, so it is not shown here.
    biomarkers: ['AMH', 'FSH', 'LH', 'Oestradiol', 'Progesterone', 'Prolactin', 'TSH', 'FT4'],
    sampleType: 'finger-prick',
    collection: 'at-home',
    clinicianReview: true,
    turnaroundDays: 5,
    accreditedLab: true,
    lastSourced: '2026-07-23',
    needsSourcing: [],
  },
  {
    id: 'thriva-fertility-insights',
    provider: 'Thriva',
    productName: 'Fertility Insights Blood Test',
    providerUrl: 'https://thriva.co/shop/womens-health-test-packages/fertility-insights-blood-test',
    market: 'UK',
    currency: 'GBP',
    price: 185,
    // Testosterone and a thyroid profile alongside the reserve markers. Sample
    // method not stated on the page, so it is left unsourced.
    biomarkers: ['AMH', 'FSH', 'LH', 'Oestradiol', 'Prolactin', 'Testosterone', 'TSH'],
    sampleType: null,
    collection: 'at-home',
    clinicianReview: true,
    turnaroundDays: 2,
    accreditedLab: null,
    lastSourced: '2026-07-23',
    needsSourcing: ['sampleType', 'accreditedLab'],
  },
  {
    id: 'hertility-hormone-fertility',
    provider: 'Hertility Health',
    productName: 'Advanced Hormone & Fertility Test',
    providerUrl: 'https://hertilityhealth.com/hormone-and-fertility-testing',
    market: 'UK',
    currency: 'GBP',
    price: 249,
    // Widest panel of the five, and the only one bundling a live expert call.
    biomarkers: ['AMH', 'FSH', 'LH', 'Oestradiol', 'Prolactin', 'Testosterone', 'SHBG', 'DHEA-S', 'TSH', 'FT4'],
    sampleType: 'finger-prick',
    collection: 'at-home',
    clinicianReview: true,
    turnaroundDays: 6,
    accreditedLab: null,
    lastSourced: '2026-07-23',
    needsSourcing: ['accreditedLab'],
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
