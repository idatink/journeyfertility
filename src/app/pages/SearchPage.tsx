import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { ExternalLink, Info, RotateCcw, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { Eyebrow } from '../components/SiteChrome';
import { ServiceExplainer } from '../components/ServiceExplainer';
import { SuccessByAge } from '../components/SuccessByAge';
import { AllInCostEstimator } from '../components/AllInCostEstimator';
import { HowTrackingWorks } from '../components/HowTrackingWorks';
import { AtHomeTestKitsComparison } from '../components/AtHomeTestKitsComparison';
import { OptionsComparison } from '../components/OptionsComparison';
import { REAL_CLINICS, HFEA } from '../data/clinics';
import {
  BUDGET_OPTIONS,
  FROM_LEGACY,
  REGIONS,
  REGION_LABELS,
  SEARCH_SERVICES,
  SEARCH_SORTS,
  SERVICE_LABELS,
  SERVICE_NAMES,
  SORT_LABELS,
  TO_LEGACY,
  type SearchResponse,
  type SearchResult,
  type SearchService,
  type SearchSort,
} from '../lib/search';

const gbp = (n: number) => `£${n.toLocaleString('en-GB')}`;
const CLINIC_OPTIONS = [...REAL_CLINICS].sort((a, b) => a.clinicName.localeCompare(b.clinicName));

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: SearchResponse };

/** Reads and validates the filters from the URL; anything unknown falls back to a default. */
function useFilters() {
  const [params, setParams] = useSearchParams();
  const rawService = params.get('service') ?? '';
  const service: SearchService = (SEARCH_SERVICES as readonly string[]).includes(rawService)
    ? (rawService as SearchService)
    : 'egg_freezing';
  const region = REGIONS.some((r) => r.slug === params.get('region')) ? params.get('region') : null;
  const clinic = REAL_CLINICS.some((c) => c.slug === params.get('clinic')) ? params.get('clinic') : null;
  const budget = Number(params.get('max_budget'));
  const maxBudget = Number.isInteger(budget) && budget > 0 ? budget : null;
  const rawSort = params.get('sort') ?? 'price_asc';
  const sort: SearchSort = (SEARCH_SORTS as readonly string[]).includes(rawSort)
    ? (rawSort as SearchSort)
    : 'price_asc';

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === '') next.delete(k);
      else next.set(k, v);
    }
    setParams(next, { replace: false });
  };

  return { service, region, clinic, maxBudget, sort, update };
}

export function SearchPage() {
  const { service, region, clinic, maxBudget, sort, update } = useFilters();
  const location = useLocation();
  const navigate = useNavigate();
  const userAge = (location.state as { age?: number } | null)?.age ?? null;
  const [state, setState] = useState<State>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  const query = new URLSearchParams({ service });
  if (clinic) query.set('clinic', clinic);
  if (region) query.set('region', region);
  if (maxBudget) query.set('max_budget', String(maxBudget));
  query.set('sort', sort);
  const queryString = query.toString();

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    fetch(`/api/search?${queryString}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        setState({ status: 'ready', data: (await res.json()) as SearchResponse });
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.error(err);
          setState({ status: 'error' });
        }
      });
    return () => controller.abort();
  }, [queryString, attempt]);

  useEffect(() => {
    document.title = `Compare ${SERVICE_NAMES[service]} clinics | JourneyFertility`;
  }, [service]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  const legacy = TO_LEGACY[service];

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <Eyebrow>Clinic search</Eyebrow>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-ink mb-3">Compare {SERVICE_NAMES[service]}</h1>
        <p className="text-muted-ink text-lg leading-relaxed">
          Real UK clinics, each shown with its own published price where the clinic publishes one.
        </p>
      </div>

      {/* Service */}
      <div role="group" aria-label="Choose a service" className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-white/50">
        {SEARCH_SERVICES.map((s) => {
          const active = s === service;
          return (
            <button
              key={s}
              type="button"
              aria-pressed={active}
              onClick={() => update({ service: s, clinic: null, max_budget: null })}
              className={`flex-1 min-w-[8rem] min-h-11 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${
                active ? 'bg-ink text-white shadow-sm' : 'text-ink hover:bg-white/70'
              }`}
            >
              {SERVICE_LABELS[s]}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FilterSelect
          id="f-region"
          label="Region"
          value={region ?? 'all'}
          onChange={(v) => update({ region: v === 'all' ? null : v })}
          options={[{ value: 'all', label: 'Any region' }, ...REGIONS.map((r) => ({ value: r.slug, label: r.label }))]}
        />
        <FilterSelect
          id="f-clinic"
          label="Clinic"
          value={clinic ?? 'all'}
          onChange={(v) => update({ clinic: v === 'all' ? null : v })}
          options={[{ value: 'all', label: 'All clinics' }, ...CLINIC_OPTIONS.map((c) => ({ value: c.slug, label: c.clinicName }))]}
        />
        <FilterSelect
          id="f-budget"
          label="Budget"
          value={maxBudget ? String(maxBudget) : 'all'}
          onChange={(v) => update({ max_budget: v === 'all' ? null : v })}
          options={[
            { value: 'all', label: 'Any budget' },
            ...BUDGET_OPTIONS[service].map((b) => ({ value: String(b), label: `Up to ${gbp(b)}` })),
            ...(maxBudget && !BUDGET_OPTIONS[service].includes(maxBudget)
              ? [{ value: String(maxBudget), label: `Up to ${gbp(maxBudget)}` }]
              : []),
          ]}
        />
        <FilterSelect
          id="f-sort"
          label="Sort by"
          value={sort}
          onChange={(v) => update({ sort: v })}
          options={SEARCH_SORTS.map((s) => ({ value: s, label: SORT_LABELS[s] }))}
        />
      </div>

      <div className="glass rounded-2xl p-4 text-sm text-muted-ink leading-relaxed">
        <span className="font-semibold text-ink">Real UK clinics, in GBP.</span> Prices come from each
        clinic&rsquo;s own published price list on the date shown; where a clinic does not publish a price, the
        card reads <span className="font-semibold">&ldquo;Price not published&rdquo;</span> rather than a made-up
        figure. <span className="font-semibold">Medications are quoted separately</span> by the clinic and are only
        in the all-in estimate where the clinic publishes a figure.
      </div>

      {/* Results */}
      <section aria-labelledby="results-heading" aria-busy={state.status === 'loading'}>
        <h2 id="results-heading" className="visually-hidden">
          Results
        </h2>
        {state.status === 'loading' && <ResultsSkeleton />}
        {state.status === 'error' && (
          <div role="alert" className="glass rounded-2xl p-8 text-center">
            <h3 className="text-lg font-semibold text-ink mb-2">We couldn&rsquo;t load the clinics</h3>
            <p className="text-muted-ink max-w-md mx-auto mb-5">
              Something went wrong on our side or with your connection. Your filters are still set, so you can try
              again.
            </p>
            <Button onClick={retry} className="bg-blush hover:bg-peach text-ink font-semibold h-11 px-6">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try again
            </Button>
          </div>
        )}
        {state.status === 'ready' && state.data.count === 0 && (
          <div className="glass rounded-2xl p-8 text-center">
            <h3 className="text-lg font-semibold text-ink mb-2">No clinics match. Try a higher budget or any region.</h3>
            <Link
              to={`/search?service=${service}`}
              className="inline-flex items-center min-h-11 font-semibold text-peach-deep underline underline-offset-2"
            >
              Reset filters
            </Link>
          </div>
        )}
        {state.status === 'ready' && state.data.count > 0 && (
          <>
            <p className="text-muted-ink mb-4" aria-live="polite">
              {state.data.count} {state.data.count === 1 ? 'clinic' : 'clinics'}
              {region && <> in {REGION_LABELS[region as keyof typeof REGION_LABELS]}</>}
              {maxBudget && state.data.results.some((r) => r.published_price_gbp === null) && (
                <>
                  . Clinics that don&rsquo;t publish a price are included, because we can&rsquo;t rule them out on
                  budget.
                </>
              )}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {state.data.results.map((r) => (
                <li key={r.slug}>
                  <ResultCard result={r} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <button
        type="button"
        onClick={() => setShowOptions(true)}
        className="inline-flex items-center min-h-11 text-sm font-semibold text-peach-deep hover:underline rounded-md"
      >
        Not sure which is right for you? Compare the options
      </button>

      {/* How it works and supporting tools for this service */}
      <div className="space-y-8 pt-4 border-t border-ink/10">
        {service === 'fertility_testing' ? (
          <>
            <HowTrackingWorks />
            <AtHomeTestKitsComparison />
          </>
        ) : (
          <>
            <ServiceExplainer serviceType={legacy} />
            <SuccessByAge userAge={userAge} />
            {service === 'egg_freezing' && <AllInCostEstimator />}
          </>
        )}
      </div>

      {showOptions && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Compare your options"
          className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setShowOptions(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowOptions(false)}
        >
          <div className="bg-stone rounded-2xl max-w-5xl w-full my-8 p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end -mt-2 -mr-2 mb-1">
              <button
                autoFocus
                onClick={() => setShowOptions(false)}
                aria-label="Close"
                className="inline-flex items-center justify-center w-11 h-11 text-muted-ink hover:text-ink rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <OptionsComparison
              onPick={(s) => {
                setShowOptions(false);
                navigate(`/search?service=${FROM_LEGACY[s]}`);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-muted-ink mb-1.5">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="min-h-12 bg-white text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" aria-label="Loading clinics">
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className="glass rounded-2xl p-5 space-y-3">
          <Skeleton className="h-5 w-3/4 bg-ink/10" />
          <Skeleton className="h-4 w-1/3 bg-ink/10" />
          <Skeleton className="h-8 w-1/2 bg-ink/10" />
          <Skeleton className="h-4 w-2/3 bg-ink/10" />
          <Skeleton className="h-4 w-1/2 bg-ink/10" />
        </li>
      ))}
    </ul>
  );
}

function AllInBreakdown({ r }: { r: SearchResult }) {
  return (
    <div className="space-y-2 text-sm text-muted-ink">
      <p className="font-semibold text-ink">What&rsquo;s in the all-in estimate</p>
      <ul className="space-y-1">
        <li>Published price: {gbp(r.published_price_gbp!)}</li>
        <li>
          Medication:{' '}
          {r.medication_estimate_gbp !== null ? gbp(r.medication_estimate_gbp) : 'not published by the clinic, so not included'}
        </li>
        {r.first_year_storage_included ? (
          <li>One year of storage: already in the published price</li>
        ) : r.annual_storage_gbp !== null ? (
          <li>One year of storage: {gbp(r.annual_storage_gbp)}</li>
        ) : null}
      </ul>
      {r.price_includes && <p>The price includes: {r.price_includes}.</p>}
      {r.price_excludes && <p>Not included: {r.price_excludes}.</p>}
      <p>It is an estimate from published figures, not a quote. Ask the clinic for a personal quote.</p>
    </div>
  );
}

function ResultCard({ result: r }: { result: SearchResult }) {
  const hasPrice = r.published_price_gbp !== null;
  return (
    <article className="glass rounded-2xl p-5 h-full flex flex-col gap-3">
      <div>
        <h3 className="text-lg font-semibold text-ink leading-snug">{r.name}</h3>
        <p className="text-sm text-muted-ink">{r.city}</p>
      </div>

      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-ink">Published price</div>
        <div className="text-2xl font-bold text-ink">{hasPrice ? `from ${gbp(r.published_price_gbp!)}` : 'Price not published'}</div>
        {r.price_checked_label && hasPrice && <p className="text-xs text-muted-ink">Checked: {r.price_checked_label}</p>}
      </div>

      {r.all_in_estimate_gbp !== null && (
        <div className="flex items-center gap-1 text-sm text-ink">
          <span>
            All-in estimate: <span className="font-semibold">{gbp(r.all_in_estimate_gbp)}</span>
          </span>
          <Popover>
            <PopoverTrigger
              aria-label={`What's included in the all-in estimate for ${r.name}`}
              className="inline-flex items-center justify-center w-11 h-11 -my-3 rounded-full text-peach-deep"
            >
              <Info className="w-4 h-4" />
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <AllInBreakdown r={r} />
            </PopoverContent>
          </Popover>
        </div>
      )}

      <div className="text-sm">
        <span className="text-muted-ink">HFEA success rate: </span>
        {r.success_rate ? (
          <span className="text-ink font-semibold">
            {r.success_rate.rate_percent}% ({r.success_rate.age_band}, {r.success_rate.period})
          </span>
        ) : (
          <span className="text-ink">not yet imported.</span>
        )}{' '}
        <a
          href={HFEA}
          target="_blank"
          rel="noopener noreferrer"
          className="hit-area font-semibold text-peach-deep underline underline-offset-2"
        >
          Check the HFEA register
        </a>
      </div>

      {r.price_source_url && (
        <a
          href={r.price_source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 min-h-11 text-sm font-semibold text-peach-deep hover:underline"
        >
          See the clinic&rsquo;s price list
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
          <span className="visually-hidden">(opens in a new tab)</span>
        </a>
      )}
    </article>
  );
}
