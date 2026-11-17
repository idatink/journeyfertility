/**
 * Shared vocabulary for clinic search: the /api/search function validates against these
 * allowlists, the /search page renders its filters from them, and db/seed.ts uses the
 * city-to-region table. One source so the three cannot drift.
 */

export const SEARCH_SERVICES = ['egg_freezing', 'embryo_freezing', 'ivf', 'fertility_testing'] as const;
export type SearchService = (typeof SEARCH_SERVICES)[number];

export const SERVICE_LABELS: Record<SearchService, string> = {
  egg_freezing: 'Egg freezing',
  embryo_freezing: 'Embryo freezing',
  ivf: 'IVF',
  fertility_testing: 'Fertility testing',
};

/** Service names for use mid-sentence, e.g. "Compare IVF". */
export const SERVICE_NAMES: Record<SearchService, string> = {
  egg_freezing: 'egg freezing',
  embryo_freezing: 'embryo freezing',
  ivf: 'IVF',
  fertility_testing: 'fertility testing',
};

/** The site's older service ids, used by the home page tabs and existing components. */
export type LegacyService = 'egg-freezing' | 'embryo' | 'ivf' | 'fertility';

export const FROM_LEGACY: Record<LegacyService, SearchService> = {
  'egg-freezing': 'egg_freezing',
  embryo: 'embryo_freezing',
  ivf: 'ivf',
  fertility: 'fertility_testing',
};

export const TO_LEGACY: Record<SearchService, LegacyService> = {
  egg_freezing: 'egg-freezing',
  embryo_freezing: 'embryo',
  ivf: 'ivf',
  fertility_testing: 'fertility',
};

export const SEARCH_SORTS = ['price_asc', 'price_desc', 'name'] as const;
export type SearchSort = (typeof SEARCH_SORTS)[number];

export const SORT_LABELS: Record<SearchSort, string> = {
  price_asc: 'Price, low to high',
  price_desc: 'Price, high to low',
  name: 'Clinic name',
};

/** UK nations and English regions (ITL1). Slugs are the API values. */
export const REGIONS = [
  { slug: 'london', label: 'London' },
  { slug: 'south-east', label: 'South East' },
  { slug: 'east-of-england', label: 'East of England' },
  { slug: 'east-midlands', label: 'East Midlands' },
  { slug: 'north-west', label: 'North West' },
  { slug: 'north-east', label: 'North East' },
  { slug: 'yorkshire-and-the-humber', label: 'Yorkshire and the Humber' },
  { slug: 'scotland', label: 'Scotland' },
  { slug: 'wales', label: 'Wales' },
] as const;
export type RegionSlug = (typeof REGIONS)[number]['slug'];

export const REGION_LABELS = Object.fromEntries(REGIONS.map((r) => [r.slug, r.label])) as Record<
  RegionSlug,
  string
>;

/**
 * Region for each city as the clinic data names it. "Nationwide" groups are filed under the
 * city the data gives for their main site.
 */
export const CITY_REGION: Record<string, RegionSlug> = {
  London: 'london',
  'London & nationwide': 'london',
  Manchester: 'north-west',
  'Nottingham & nationwide': 'east-midlands',
  Nottingham: 'east-midlands',
  Cambridge: 'east-of-england',
  Cheshunt: 'east-of-england',
  Oxford: 'south-east',
  Kent: 'south-east',
  Maidenhead: 'south-east',
  Southampton: 'south-east',
  Brighton: 'south-east',
  Glasgow: 'scotland',
  Liverpool: 'north-west',
  Leeds: 'yorkshire-and-the-humber',
  Newcastle: 'north-east',
  Cardiff: 'wales',
};

/** "Up to £X" options per service, from the upper bounds of the old budget brackets. */
export const BUDGET_OPTIONS: Record<SearchService, number[]> = {
  egg_freezing: [3500, 4500, 6000, 8000],
  embryo_freezing: [4000, 6000, 8000],
  ivf: [5000, 7500, 10000],
  fertility_testing: [200, 300, 500],
};

export const MAX_BUDGET_LIMIT = 100000;

export interface SearchResult {
  slug: string;
  name: string;
  city: string;
  region: RegionSlug;
  published_price_gbp: number | null;
  price_includes: string | null;
  price_excludes: string | null;
  medication_estimate_gbp: number | null;
  annual_storage_gbp: number | null;
  first_year_storage_included: boolean;
  all_in_estimate_gbp: number | null;
  /** which parts went into all_in_estimate_gbp, for the tooltip */
  all_in_parts: ('published_price' | 'medication' | 'one_year_storage')[];
  price_source_url: string | null;
  price_checked_label: string | null;
  success_rate: { rate_percent: number; age_band: string; period: string } | null;
}

export interface SearchResponse {
  service: SearchService;
  count: number;
  results: SearchResult[];
}
