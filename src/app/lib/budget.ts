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
  // Bracket boundaries are fitted to the actual spread of computed totals so
  // every option returns clinics — no bracket the form offers can land on the
  // empty state. Refit these whenever the underlying prices change.
  // Now spanning UK and international sample clinics, so the ranges are wider —
  // an IVF cycle runs from roughly £3k (Türkiye) to £12.5k (UK private).
  'egg-freezing': [
    { id: 'ef-under-2500', label: 'Under £2,500', min: 0, max: 2500 },
    { id: 'ef-2500-3500', label: '£2,500 – £3,500', min: 2500, max: 3500 },
    { id: 'ef-3500-5000', label: '£3,500 – £5,000', min: 3500, max: 5000 },
    { id: 'ef-over-5000', label: 'Over £5,000', min: 5000, max: Infinity },
  ],
  embryo: [
    { id: 'em-under-3000', label: 'Under £3,000', min: 0, max: 3000 },
    { id: 'em-3000-4500', label: '£3,000 – £4,500', min: 3000, max: 4500 },
    { id: 'em-4500-6000', label: '£4,500 – £6,000', min: 4500, max: 6000 },
    { id: 'em-over-6000', label: 'Over £6,000', min: 6000, max: Infinity },
  ],
  ivf: [
    { id: 'ivf-under-4000', label: 'Under £4,000', min: 0, max: 4000 },
    { id: 'ivf-4000-6500', label: '£4,000 – £6,500', min: 4000, max: 6500 },
    { id: 'ivf-6500-10000', label: '£6,500 – £10,000', min: 6500, max: 10000 },
    { id: 'ivf-over-10000', label: 'Over £10,000', min: 10000, max: Infinity },
  ],
  fertility: [
    { id: 'ft-under-250', label: 'Under £250', min: 0, max: 250 },
    { id: 'ft-250-350', label: '£250 – £350', min: 250, max: 350 },
    { id: 'ft-350-450', label: '£350 – £450', min: 350, max: 450 },
    { id: 'ft-over-450', label: 'Over £450', min: 450, max: Infinity },
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
