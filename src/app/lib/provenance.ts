/**
 * Price provenance.
 *
 * Pricing will never arrive from a single clean feed. Clinics do not publish
 * machine-readable rates, so in practice a listing is assembled from sources of
 * very different reliability: a signed partner rate card, a price list read off
 * a clinic's own website, a figure a patient reported from their invoice.
 *
 * Rather than flatten all of that into one confident number, every price
 * carries where it came from and when it was last checked. The comparison is
 * only trustworthy if the user can see which prices we stand behind.
 */

export type PriceSource = 'partner' | 'published' | 'patient_reported' | 'unverified';

export interface PriceSourceMeta {
  label: string;
  /** shown as a chip in the results table */
  short: string;
  description: string;
  /** ordering hint: higher is more reliable */
  confidence: number;
}

export const PRICE_SOURCES: Record<PriceSource, PriceSourceMeta> = {
  partner: {
    label: 'Partner rate card',
    short: 'Verified',
    description:
      'Supplied directly by the clinic under a listing agreement and updated when their prices change.',
    confidence: 3,
  },
  published: {
    label: "Clinic's published price list",
    short: 'Published',
    description:
      "Taken from the clinic's own published prices on the date shown. Accurate as far as the clinic publishes it, but may omit items quoted separately.",
    confidence: 2,
  },
  patient_reported: {
    label: 'Patient reported',
    short: 'Reported',
    description:
      'Reported by patients from their own invoices. Reflects what was actually paid, but is a small sample and may not match current list prices.',
    confidence: 1,
  },
  unverified: {
    label: 'Not verified',
    short: 'Unverified',
    description:
      'We have not been able to confirm this price with the clinic or a published source. Treat it as indicative only.',
    confidence: 0,
  },
};

export interface Provenance {
  source: PriceSource;
  /** ISO date the price was last confirmed */
  lastVerified: string;
}

/**
 * Illustrative mix for development. The spread is deliberate: a real listing
 * set looks like this, not like twelve verified partners.
 */
export const CLINIC_PROVENANCE: Record<string, Provenance> = {
  'thames-fertility': { source: 'partner', lastVerified: '2026-07-02' },
  'southbank-reproductive': { source: 'partner', lastVerified: '2026-06-24' },
  'camden-ivf': { source: 'published', lastVerified: '2026-07-11' },
  'mersey-fertility': { source: 'published', lastVerified: '2026-05-19' },
  'pennine-reproductive': { source: 'partner', lastVerified: '2026-06-08' },
  'northern-lights-fertility': { source: 'published', lastVerified: '2026-04-27' },
  'clyde-reproductive': { source: 'published', lastVerified: '2026-03-15' },
  'severn-fertility': { source: 'unverified', lastVerified: '2025-11-20' },
  'midlands-fertility': { source: 'published', lastVerified: '2026-06-30' },
  'wharfedale-reproductive': { source: 'patient_reported', lastVerified: '2026-05-02' },
  'cardiff-bay-fertility': { source: 'published', lastVerified: '2026-06-12' },
  'lagan-fertility': { source: 'unverified', lastVerified: '2025-10-06' },
'costa-brava-fertility': { source: 'partner', lastVerified: '2026-06-18' },
  'meridian-reproductive-madrid': { source: 'published', lastVerified: '2026-05-30' },
  'turia-ivf-valencia': { source: 'patient_reported', lastVerified: '2026-04-12' },
  'vltava-fertility-prague': { source: 'published', lastVerified: '2026-06-05' },
  'moravia-reproductive-brno': { source: 'patient_reported', lastVerified: '2026-03-28' },
  'charles-bridge-ivf': { source: 'published', lastVerified: '2026-05-14' },
  'aegean-fertility-athens': { source: 'published', lastVerified: '2026-06-20' },
  'thermaic-ivf-thessaloniki': { source: 'unverified', lastVerified: '2025-12-08' },
  'minoan-reproductive-crete': { source: 'published', lastVerified: '2026-04-30' },
  'bosphorus-fertility-istanbul': { source: 'published', lastVerified: '2026-06-15' },
  'kyrenia-reproductive': { source: 'patient_reported', lastVerified: '2026-02-22' },
  'anatolia-ivf-ankara': { source: 'unverified', lastVerified: '2025-11-02' },
};

/** Prices older than this are shown as stale regardless of source. */
export const STALE_AFTER_DAYS = 180;

export interface ProvenanceView extends Provenance {
  meta: PriceSourceMeta;
  ageDays: number;
  isStale: boolean;
  verifiedLabel: string;
}

export function getProvenance(clinicSlug: string, today = new Date()): ProvenanceView | null {
  const entry = CLINIC_PROVENANCE[clinicSlug];
  if (!entry) return null;

  const verified = new Date(entry.lastVerified);
  const ageDays = Math.max(
    0,
    Math.round((today.getTime() - verified.getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    ...entry,
    meta: PRICE_SOURCES[entry.source],
    ageDays,
    isStale: ageDays > STALE_AFTER_DAYS,
    verifiedLabel: verified.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
  };
}
