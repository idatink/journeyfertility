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
  source: "Illustrative development data",
} as const;

export const CLINIC_OUTCOMES: Record<string, Record<AgeBand, [number, number]>> = {
  "reproductive-health": {
    "under-35": [49, 118],
    "35-37": [33, 101],
    "38-40": [24, 109],
    "41-42": [7, 59],
    "43-plus": [2, 34],
  },
  "fertility-la": {
    "under-35": [63, 143],
    "35-37": [42, 122],
    "38-40": [31, 133],
    "41-42": [9, 71],
    "43-plus": [2, 41],
  },
  "boston-ivf": {
    "under-35": [70, 179],
    "35-37": [47, 154],
    "38-40": [34, 166],
    "41-42": [10, 90],
    "43-plus": [2, 51],
  },
  "chicago-fertility": {
    "under-35": [39, 106],
    "35-37": [26, 91],
    "38-40": [19, 99],
    "41-42": [5, 53],
    "43-plus": [1, 30],
  },
  "pacific-fertility": {
    "under-35": [61, 132],
    "35-37": [40, 113],
    "38-40": [29, 122],
    "41-42": [8, 66],
    "43-plus": [2, 38],
  },
  "texas-fertility": {
    "under-35": [29, 84],
    "35-37": [19, 72],
    "38-40": [14, 78],
    "41-42": [4, 42],
    "43-plus": [1, 24],
  },
  "memorial-bahcelievler": {
    "under-35": [94, 246],
    "35-37": [63, 211],
    "38-40": [46, 229],
    "41-42": [13, 123],
    "43-plus": [3, 70],
  },
  "acibadem-maslak": {
    "under-35": [87, 213],
    "35-37": [58, 182],
    "38-40": [42, 198],
    "41-42": [12, 106],
    "43-plus": [3, 61],
  },
  "istanbul-fertility": {
    "under-35": [54, 151],
    "35-37": [36, 130],
    "38-40": [26, 140],
    "41-42": [7, 76],
    "43-plus": [2, 43],
  },
  "american-hospital-istanbul": {
    "under-35": [74, 174],
    "35-37": [49, 149],
    "38-40": [36, 161],
    "41-42": [10, 87],
    "43-plus": [2, 50],
  },
  "jinemed": {
    "under-35": [78, 196],
    "35-37": [52, 168],
    "38-40": [38, 182],
    "41-42": [11, 98],
    "43-plus": [3, 56],
  },
  "medipol-mega": {
    "under-35": [62, 165],
    "35-37": [41, 142],
    "38-40": [30, 153],
    "41-42": [9, 83],
    "43-plus": [2, 47],
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
