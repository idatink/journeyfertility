export type ServiceType = 'egg-freezing' | 'embryo' | 'ivf' | 'fertility';

export interface BudgetBracket {
  id: string;
  label: string;
  /** inclusive */
  min: number;
  /** exclusive */
  max: number;
}

/**
 * Budget brackets are per service because the services sit on very different
 * scales — a clinic fertility test panel is hundreds, a full IVF cycle is tens
 * of thousands. A single shared set meant most brackets matched nothing.
 *
 * This is the one source of truth: the search form renders its options from
 * here and the results filter reads its bounds from here, so the two cannot
 * drift apart.
 */
export const BUDGET_BRACKETS: Record<ServiceType, BudgetBracket[]> = {
  'egg-freezing': [
    { id: 'ef-under-7500', label: 'Under $7,500', min: 0, max: 7500 },
    { id: 'ef-7500-12500', label: '$7,500 – $12,500', min: 7500, max: 12500 },
    { id: 'ef-12500-15000', label: '$12,500 – $15,000', min: 12500, max: 15000 },
    { id: 'ef-over-15000', label: 'Over $15,000', min: 15000, max: Infinity },
  ],
  embryo: [
    { id: 'em-under-10k', label: 'Under $10,000', min: 0, max: 10000 },
    { id: 'em-10k-15k', label: '$10,000 – $15,000', min: 10000, max: 15000 },
    { id: 'em-15k-20k', label: '$15,000 – $20,000', min: 15000, max: 20000 },
    { id: 'em-over-20k', label: 'Over $20,000', min: 20000, max: Infinity },
  ],
  ivf: [
    { id: 'ivf-under-15k', label: 'Under $15,000', min: 0, max: 15000 },
    { id: 'ivf-15k-25k', label: '$15,000 – $25,000', min: 15000, max: 25000 },
    { id: 'ivf-25k-35k', label: '$25,000 – $35,000', min: 25000, max: 35000 },
    { id: 'ivf-over-35k', label: 'Over $35,000', min: 35000, max: Infinity },
  ],
  // Clinic test panels, not at-home kits — those are a separate comparison
  // reached via the "at-home test kits only" checkbox and are not budget filtered.
  fertility: [
    { id: 'ft-under-500', label: 'Under $500', min: 0, max: 500 },
    { id: 'ft-500-800', label: '$500 – $800', min: 500, max: 800 },
    { id: 'ft-800-1100', label: '$800 – $1,100', min: 800, max: 1100 },
    { id: 'ft-over-1100', label: 'Over $1,100', min: 1100, max: Infinity },
  ],
};

/** Returns the bounds for a bracket id, or null for 'all' / an unknown id. */
export function getBudgetBounds(
  serviceType: ServiceType,
  bracketId: string
): { min: number; max: number } | null {
  if (!bracketId || bracketId === 'all') return null;
  const bracket = BUDGET_BRACKETS[serviceType]?.find((b) => b.id === bracketId);
  return bracket ? { min: bracket.min, max: bracket.max } : null;
}
