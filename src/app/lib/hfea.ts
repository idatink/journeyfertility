/**
 * HFEA ingestion.
 *
 * The Human Fertilisation and Embryology Authority licenses every UK fertility
 * clinic and publishes both the register and treatment outcomes. This is the
 * highest quality supply available to us anywhere in the world, and it is free:
 *
 *   Register + per-clinic outcomes  https://www.hfea.gov.uk/choose-a-clinic/
 *   Dashboard                       https://www.hfea.gov.uk/about-us/hfea-dashboard/
 *   Annual datasets (Excel)         https://www.hfea.gov.uk/about-us/our-data/
 *
 * Two things make this data different from clinic-supplied figures, and the
 * schema below is shaped to preserve both:
 *
 *  1. It is age banded. A clinic-wide rate mostly reflects who that clinic
 *     chooses to treat, so we never store one.
 *  2. It is denominator explicit. HFEA reports per embryo transferred and per
 *     treatment cycle, and the two are not interchangeable. We keep the
 *     denominator attached to the number rather than flattening it.
 *
 * Licensing: HFEA material is generally published under the Open Government
 * Licence, which permits reuse with attribution. Confirm the terms on the
 * specific dataset before publishing, and keep the attribution in the UI.
 */

import type { AgeBand } from './outcomes';

export const UK_NATIONS = ['England', 'Scotland', 'Wales', 'Northern Ireland'] as const;
export type UkNation = (typeof UK_NATIONS)[number];

/** How a patient is paying, which HFEA records and patients care about most. */
export type FundingRoute = 'nhs' | 'private';

export type UkTreatment =
  | 'ivf'
  | 'icsi'
  | 'iui'
  | 'egg-freezing'
  | 'embryo-freezing'
  | 'egg-donation'
  | 'sperm-donation'
  | 'fertility-testing';

/**
 * HFEA publishes birth rates against more than one denominator. Storing which
 * one a figure used is the difference between a comparison and a misleading
 * one, so it is required rather than optional.
 */
export type Denominator = 'per-embryo-transferred' | 'per-treatment-cycle' | 'per-egg-collection';

export const DENOMINATOR_LABELS: Record<Denominator, string> = {
  'per-embryo-transferred': 'per embryo transferred',
  'per-treatment-cycle': 'per treatment cycle',
  'per-egg-collection': 'per egg collection',
};

export interface UkOutcome {
  ageBand: AgeBand;
  denominator: Denominator;
  /** the publication year of the dataset, not the treatment year */
  year: number;
  births: number;
  cycles: number;
}

export interface UkClinic {
  /** HFEA centre number — the canonical identifier, stable across renames */
  hfeaCentreNumber: string;
  name: string;
  nation: UkNation;
  /** HFEA region grouping, used for the location filter */
  region: string;
  city: string;
  postcode: string;
  fundingRoutes: FundingRoute[];
  treatments: UkTreatment[];
  /** HFEA inspection outcome, where published */
  inspectionRating: string | null;
  outcomes: UkOutcome[];
  /** the HFEA page this record was read from */
  sourceUrl: string;
  /** ISO date of the last successful ingest */
  lastIngested: string | null;
}

/**
 * The register starts empty on purpose.
 *
 * Every entry must come from an actual HFEA ingest. Seeding it with plausible
 * UK clinics would put invented prices and success rates against real, named,
 * regulated businesses — which is exactly the problem we just removed from the
 * sample listings.
 */
export const UK_CLINICS: UkClinic[] = [];

/** The row shape as it arrives from the HFEA dataset, before normalisation. */
export interface HfeaSourceRow {
  centreNumber?: string | number;
  centreName?: string;
  nation?: string;
  region?: string;
  town?: string;
  postcode?: string;
  nhsFunded?: string | boolean;
  privateFunded?: string | boolean;
  treatments?: string;
  inspectionRating?: string;
}

export interface IngestIssue {
  row: number;
  field: string;
  message: string;
}

export interface IngestResult {
  clinics: UkClinic[];
  issues: IngestIssue[];
}

const TREATMENT_ALIASES: Record<string, UkTreatment> = {
  ivf: 'ivf',
  icsi: 'icsi',
  iui: 'iui',
  'egg freezing': 'egg-freezing',
  'oocyte cryopreservation': 'egg-freezing',
  'embryo freezing': 'embryo-freezing',
  'embryo storage': 'embryo-freezing',
  'egg donation': 'egg-donation',
  'sperm donation': 'sperm-donation',
  'fertility testing': 'fertility-testing',
};

function truthy(value: string | boolean | undefined): boolean {
  if (typeof value === 'boolean') return value;
  if (!value) return false;
  return ['y', 'yes', 'true', '1'].includes(value.trim().toLowerCase());
}

function parseTreatments(raw: string | undefined): UkTreatment[] {
  if (!raw) return [];
  return raw
    .split(/[;,|]/)
    .map((part) => TREATMENT_ALIASES[part.trim().toLowerCase()])
    .filter((t): t is UkTreatment => Boolean(t));
}

/**
 * Normalise HFEA rows into our model.
 *
 * Rows missing a centre number are rejected rather than given a synthetic id:
 * without the licence number we cannot reliably match a clinic across annual
 * releases, and a duplicate listing is worse than a missing one. Everything
 * else that is absent stays absent, so gaps are visible downstream instead of
 * being filled with defaults.
 */
export function ingestHfeaRows(rows: HfeaSourceRow[], sourceUrl: string): IngestResult {
  const clinics: UkClinic[] = [];
  const issues: IngestIssue[] = [];
  const seen = new Set<string>();

  rows.forEach((row, index) => {
    const centreNumber = row.centreNumber != null ? String(row.centreNumber).trim() : '';
    const name = row.centreName?.trim() ?? '';

    if (!centreNumber) {
      issues.push({ row: index, field: 'centreNumber', message: 'missing, row skipped' });
      return;
    }
    if (!name) {
      issues.push({ row: index, field: 'centreName', message: 'missing, row skipped' });
      return;
    }
    if (seen.has(centreNumber)) {
      issues.push({ row: index, field: 'centreNumber', message: `duplicate ${centreNumber}` });
      return;
    }
    seen.add(centreNumber);

    const nation = UK_NATIONS.find((n) => n.toLowerCase() === row.nation?.trim().toLowerCase());
    if (!nation) {
      issues.push({ row: index, field: 'nation', message: `unrecognised "${row.nation ?? ''}"` });
    }

    const fundingRoutes: FundingRoute[] = [];
    if (truthy(row.nhsFunded)) fundingRoutes.push('nhs');
    if (truthy(row.privateFunded)) fundingRoutes.push('private');
    if (!fundingRoutes.length) {
      issues.push({ row: index, field: 'fundingRoutes', message: 'no funding route recorded' });
    }

    clinics.push({
      hfeaCentreNumber: centreNumber,
      name,
      nation: nation ?? 'England',
      region: row.region?.trim() ?? '',
      city: row.town?.trim() ?? '',
      postcode: row.postcode?.trim().toUpperCase() ?? '',
      fundingRoutes,
      treatments: parseTreatments(row.treatments),
      inspectionRating: row.inspectionRating?.trim() || null,
      outcomes: [],
      sourceUrl,
      lastIngested: null,
    });
  });

  return { clinics, issues };
}

export function offersTreatment(clinic: UkClinic, treatment: UkTreatment): boolean {
  return clinic.treatments.includes(treatment);
}

export function isNhsFunded(clinic: UkClinic): boolean {
  return clinic.fundingRoutes.includes('nhs');
}

/**
 * Rate for one age band on one denominator. Returns null rather than falling
 * back to another denominator or a neighbouring band, both of which would
 * silently change what the number means.
 */
export function ukOutcomeRate(
  clinic: UkClinic,
  ageBand: AgeBand,
  denominator: Denominator
): { rate: number; births: number; cycles: number; year: number } | null {
  const match = clinic.outcomes.find(
    (o) => o.ageBand === ageBand && o.denominator === denominator
  );
  if (!match || !match.cycles) return null;
  return {
    rate: Math.round((match.births / match.cycles) * 1000) / 10,
    births: match.births,
    cycles: match.cycles,
    year: match.year,
  };
}

export const HFEA_ATTRIBUTION =
  'Clinic register and treatment outcomes: Human Fertilisation and Embryology Authority (HFEA).';
