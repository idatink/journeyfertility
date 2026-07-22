export const AGE_BANDS = [
  { id: "under-35", label: "Under 35" },
  { id: "35-37", label: "35 to 37" },
  { id: "38-40", label: "38 to 40" },
  { id: "41-42", label: "41 to 42" },
  { id: "43-plus", label: "43 and over" },
] as const;

export type AgeBand = (typeof AGE_BANDS)[number]["id"];

/**
 * Treatment outcomes, held as raw counts rather than a single percentage.
 *
 * A bare success rate is not comparable between clinics: it depends on the age
 * of the patients treated, on what the rate is a percentage OF, and on whether
 * it counts pregnancies or births. Storing [numerator, denominator] per age
 * band lets us always show the rate alongside the sample it came from, and
 * makes a small sample visible instead of hiding it behind a confident number.
 *
 * Every figure here is: LIVE BIRTHS per CYCLE STARTED.
 *
 * NOTE: this is illustrative data for development. Production figures must be
 * ingested from the national registry for each clinic (HFEA in the UK,
 * SART/CDC in the US) and never self-reported by the clinic.
 */
export const OUTCOME_BASIS = {
  outcomeType: "Live birth",
  denominatorType: "per cycle started",
  year: 2025,
  source: "Illustrative — to be replaced by each country's registry (HFEA in the UK)",
} as const;

export const CLINIC_OUTCOMES: Record<string, Record<AgeBand, [number, number]>> = {
  "thames-fertility": {
    "under-35": [62, 146],
    "35-37": [41, 125],
    "38-40": [30, 135],
    "41-42": [9, 73],
    "43-plus": [2, 42],
  },
  "southbank-reproductive": {
    "under-35": [77, 171],
    "35-37": [51, 146],
    "38-40": [37, 159],
    "41-42": [10, 85],
    "43-plus": [2, 49],
  },
  "camden-ivf": {
    "under-35": [55, 134],
    "35-37": [36, 115],
    "38-40": [27, 125],
    "41-42": [8, 67],
    "43-plus": [2, 38],
  },
  "mersey-fertility": {
    "under-35": [42, 109],
    "35-37": [28, 94],
    "38-40": [20, 101],
    "41-42": [6, 55],
    "43-plus": [1, 31],
  },
  "pennine-reproductive": {
    "under-35": [49, 123],
    "35-37": [33, 106],
    "38-40": [24, 114],
    "41-42": [7, 62],
    "43-plus": [2, 35],
  },
  "northern-lights-fertility": {
    "under-35": [48, 115],
    "35-37": [32, 98],
    "38-40": [23, 107],
    "41-42": [7, 57],
    "43-plus": [2, 33],
  },
  "clyde-reproductive": {
    "under-35": [37, 101],
    "35-37": [25, 86],
    "38-40": [18, 94],
    "41-42": [5, 50],
    "43-plus": [1, 29],
  },
  "severn-fertility": {
    "under-35": [57, 132],
    "35-37": [38, 113],
    "38-40": [28, 122],
    "41-42": [8, 66],
    "43-plus": [2, 38],
  },
  "midlands-fertility": {
    "under-35": [46, 118],
    "35-37": [31, 101],
    "38-40": [22, 109],
    "41-42": [6, 59],
    "43-plus": [1, 34],
  },
  "wharfedale-reproductive": {
    "under-35": [40, 106],
    "35-37": [27, 91],
    "38-40": [20, 99],
    "41-42": [5, 53],
    "43-plus": [1, 30],
  },
  "cardiff-bay-fertility": {
    "under-35": [39, 98],
    "35-37": [26, 84],
    "38-40": [19, 91],
    "41-42": [5, 49],
    "43-plus": [1, 28],
  },
  "lagan-fertility": {
    "under-35": [30, 84],
    "35-37": [20, 72],
    "38-40": [15, 78],
    "41-42": [4, 42],
    "43-plus": [1, 24],
  },
"costa-brava-fertility": {
    "under-35": [70, 150],
    "35-37": [47, 128],
    "38-40": [34, 138],
    "41-42": [10, 74],
    "43-plus": [2, 40],
  },
  "meridian-reproductive-madrid": {
    "under-35": [58, 140],
    "35-37": [39, 120],
    "38-40": [29, 130],
    "41-42": [8, 70],
    "43-plus": [2, 38],
  },
  "vltava-fertility-prague": {
    "under-35": [64, 152],
    "35-37": [43, 126],
    "38-40": [31, 134],
    "41-42": [9, 72],
    "43-plus": [2, 39],
  },
  "charles-bridge-ivf": {
    "under-35": [55, 138],
    "35-37": [37, 116],
    "38-40": [27, 126],
    "41-42": [8, 68],
    "43-plus": [2, 36],
  },
  "aegean-fertility-athens": {
    "under-35": [60, 145],
    "35-37": [40, 122],
    "38-40": [30, 132],
    "41-42": [9, 71],
    "43-plus": [2, 39],
  },
  "minoan-reproductive-crete": {
    "under-35": [52, 132],
    "35-37": [35, 112],
    "38-40": [26, 120],
    "41-42": [7, 64],
    "43-plus": [1, 34],
  },
  "bosphorus-fertility-istanbul": {
    "under-35": [66, 150],
    "35-37": [44, 124],
    "38-40": [32, 132],
    "41-42": [9, 70],
    "43-plus": [2, 38],
  },
  "anatolia-ivf-ankara": {
    "under-35": [49, 128],
    "35-37": [33, 108],
    "38-40": [24, 116],
    "41-42": [7, 62],
    "43-plus": [1, 33],
  },
};

export interface OutcomeRate {
  band: AgeBand;
  /** percentage, rounded to one decimal */
  rate: number;
  liveBirths: number;
  cyclesStarted: number;
  /** true when the sample is too small to read much into */
  lowSample: boolean;
}

export const LOW_SAMPLE_THRESHOLD = 50;

export function getOutcome(clinicSlug: string, band: AgeBand): OutcomeRate | null {
  const entry = CLINIC_OUTCOMES[clinicSlug]?.[band];
  if (!entry) return null;
  const [liveBirths, cyclesStarted] = entry;
  if (!cyclesStarted) return null;
  return {
    band,
    rate: Math.round((liveBirths / cyclesStarted) * 1000) / 10,
    liveBirths,
    cyclesStarted,
    lowSample: cyclesStarted < LOW_SAMPLE_THRESHOLD,
  };
}
