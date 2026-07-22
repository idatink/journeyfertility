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
  // Brackets filter on the "from" total of clinics that publish a price.
  // Because published UK prices are still sparse, the ranges are kept broad;
  // widen or refit as more clinics publish.
  'egg-freezing': [
    { id: 'ef-under-3500', label: 'Under £3,500', min: 0, max: 3500 },
    { id: 'ef-3500-4500', label: '£3,500 – £4,500', min: 3500, max: 4500 },
    { id: 'ef-over-4500', label: 'Over £4,500', min: 4500, max: Infinity },
  ],
  embryo: [
    { id: 'em-under-4000', label: 'Under £4,000', min: 0, max: 4000 },
    { id: 'em-4000-6000', label: '£4,000 – £6,000', min: 4000, max: 6000 },
    { id: 'em-over-6000', label: 'Over £6,000', min: 6000, max: Infinity },
  ],
  ivf: [
    { id: 'ivf-under-5000', label: 'Under £5,000', min: 0, max: 5000 },
    { id: 'ivf-5000-7500', label: '£5,000 – £7,500', min: 5000, max: 7500 },
    { id: 'ivf-over-7500', label: 'Over £7,500', min: 7500, max: Infinity },
  ],
  fertility: [
    { id: 'ft-under-200', label: 'Under £200', min: 0, max: 200 },
    { id: 'ft-200-300', label: '£200 – £300', min: 200, max: 300 },
    { id: 'ft-over-300', label: 'Over £300', min: 300, max: Infinity },
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
