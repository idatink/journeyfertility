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
  'egg-freezing': [
    { id: 'ef-under-4500', label: 'Under £4,500', min: 0, max: 4500 },
    { id: 'ef-4500-5000', label: '£4,500 – £5,000', min: 4500, max: 5000 },
    { id: 'ef-5000-5500', label: '£5,000 – £5,500', min: 5000, max: 5500 },
    { id: 'ef-over-5500', label: 'Over £5,500', min: 5500, max: Infinity },
  ],
  embryo: [
    { id: 'em-under-5500', label: 'Under £5,500', min: 0, max: 5500 },
    { id: 'em-5500-6000', label: '£5,500 – £6,000', min: 5500, max: 6000 },
    { id: 'em-6000-6500', label: '£6,000 – £6,500', min: 6000, max: 6500 },
    { id: 'em-over-6500', label: 'Over £6,500', min: 6500, max: Infinity },
  ],
  ivf: [
    { id: 'ivf-under-9000', label: 'Under £9,000', min: 0, max: 9000 },
    { id: 'ivf-9000-10500', label: '£9,000 – £10,500', min: 9000, max: 10500 },
    { id: 'ivf-10500-12000', label: '£10,500 – £12,000', min: 10500, max: 12000 },
    { id: 'ivf-over-12000', label: 'Over £12,000', min: 12000, max: Infinity },
  ],
  fertility: [
    { id: 'ft-under-350', label: 'Under £350', min: 0, max: 350 },
    { id: 'ft-350-450', label: '£350 – £450', min: 350, max: 450 },
    { id: 'ft-450-550', label: '£450 – £550', min: 450, max: 550 },
    { id: 'ft-over-550', label: 'Over £550', min: 550, max: Infinity },
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
