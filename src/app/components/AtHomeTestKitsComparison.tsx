import { useState } from 'react';
import { ExternalLink, Clock, Stethoscope, Home, Building2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import {
  BIOMARKERS,
  COLLECTION_LABELS,
  DEFAULT_TEST_FILTERS,
  FERTILITY_TESTS,
  applyTestFilters,
  formatPrice,
  sourcingProgress,
  type Biomarker,
  type Collection,
  type TestFilters,
} from '../lib/tests';

const COLLECTION_OPTIONS: { id: Collection | 'all'; label: string }[] = [
  { id: 'all', label: 'Any' },
  { id: 'at-home', label: 'At-home' },
  { id: 'clinic', label: 'Clinic draw' },
];

const TURNAROUND_OPTIONS: { id: number | null; label: string }[] = [
  { id: null, label: 'Any' },
  { id: 3, label: 'Within 3 days' },
  { id: 7, label: 'Within 7 days' },
  { id: 14, label: 'Within 14 days' },
];

export function AtHomeTestKitsComparison() {
  const [filters, setFilters] = useState<TestFilters>(DEFAULT_TEST_FILTERS);
  const [sort, setSort] = useState<'price' | 'panel'>('price');

  const providers = ['all', ...Array.from(new Set(FERTILITY_TESTS.map((t) => t.provider)))];
  const progress = sourcingProgress(FERTILITY_TESTS);

  const filtered = applyTestFilters(FERTILITY_TESTS, filters);

  const sorted = [...filtered].sort((a, b) => {
    // Unsourced entries always sit last so an empty record never outranks a
    // real one on a null value.
    if (sort === 'price') {
      if (a.price === null && b.price === null) return 0;
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return a.price - b.price;
    }
    return b.biomarkers.length - a.biomarkers.length;
  });

  const toggleBiomarker = (b: Biomarker) =>
    setFilters((f) => ({
      ...f,
      biomarkers: f.biomarkers.includes(b)
        ? f.biomarkers.filter((x) => x !== b)
        : [...f.biomarkers, b],
    }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-[#2F3440] mb-2">
          Compare fertility tests
        </h2>
        <p className="text-[#5C6478]">
          {sorted.length} of {FERTILITY_TESTS.length} providers
        </p>
      </div>

      {/* Provenance note. Every price and panel below is read from the
          provider's own product page; a few secondary details are still being
          confirmed and are left blank rather than guessed. */}
      {progress.sourced < progress.total && (
        <div className="glass rounded-2xl p-5 flex gap-3">
          <AlertCircle className="w-5 h-5 text-[#B4762F] shrink-0 mt-0.5" />
          <div className="text-sm text-[#5C6478] leading-relaxed">
            <span className="font-semibold text-[#2F3440]">
              Prices and panels are read from each provider's own product page
              (checked Jul 2026).
            </span>{' '}
            A few secondary details — such as lab accreditation — are still being
            confirmed and are shown blank rather than estimated.
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass rounded-2xl p-5 space-y-5">
        <div className="flex flex-wrap gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-[#5C6478] mb-2">
              Provider
            </div>
            <div className="flex flex-wrap gap-2">
              {providers.map((p) => (
                <button
                  key={p}
                  onClick={() => setFilters((f) => ({ ...f, provider: p }))}
                  className={`grain text-sm font-medium px-3.5 py-1.5 rounded-full transition-all ${
                    filters.provider === p
                      ? 'bg-[#2F3440] text-white'
                      : 'bg-white/60 text-[#2F3440] hover:bg-white/80'
                  }`}
                >
                  {p === 'all' ? 'All' : p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-[#5C6478] mb-2">
              Sample
            </div>
            <div className="flex flex-wrap gap-2">
              {COLLECTION_OPTIONS.map((c) => (
                <button
                  key={String(c.id)}
                  onClick={() => setFilters((f) => ({ ...f, collection: c.id }))}
                  className={`grain text-sm font-medium px-3.5 py-1.5 rounded-full transition-all ${
                    filters.collection === c.id
                      ? 'bg-[#2F3440] text-white'
                      : 'bg-white/60 text-[#2F3440] hover:bg-white/80'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-[#5C6478] mb-2">
              Results back
            </div>
            <div className="flex flex-wrap gap-2">
              {TURNAROUND_OPTIONS.map((t) => (
                <button
                  key={String(t.id)}
                  onClick={() => setFilters((f) => ({ ...f, maxTurnaroundDays: t.id }))}
                  className={`grain text-sm font-medium px-3.5 py-1.5 rounded-full transition-all ${
                    filters.maxTurnaroundDays === t.id
                      ? 'bg-[#2F3440] text-white'
                      : 'bg-white/60 text-[#2F3440] hover:bg-white/80'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-[#5C6478] mb-2">
            Must test for
          </div>
          <div className="flex flex-wrap gap-2">
            {BIOMARKERS.map((b) => (
              <button
                key={b}
                onClick={() => toggleBiomarker(b)}
                className={`grain text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                  filters.biomarkers.includes(b)
                    ? 'bg-[#F8AD7C] text-[#2F3440]'
                    : 'bg-white/60 text-[#5C6478] hover:bg-white/80'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
          <label className="flex items-center gap-2 text-sm text-[#2F3440] cursor-pointer">
            <input
              type="checkbox"
              checked={filters.clinicianReviewOnly}
              onChange={(e) =>
                setFilters((f) => ({ ...f, clinicianReviewOnly: e.target.checked }))
              }
              className="accent-[#F8AD7C] w-4 h-4"
            />
            Clinician reviews my results
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5C6478]">Sort by</span>
            <button
              onClick={() => setSort('price')}
              className={`grain text-sm font-medium px-3.5 py-1.5 rounded-full ${
                sort === 'price' ? 'bg-[#2F3440] text-white' : 'bg-white/60 text-[#2F3440]'
              }`}
            >
              Price
            </button>
            <button
              onClick={() => setSort('panel')}
              className={`grain text-sm font-medium px-3.5 py-1.5 rounded-full ${
                sort === 'panel' ? 'bg-[#2F3440] text-white' : 'bg-white/60 text-[#2F3440]'
              }`}
            >
              Panel size
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {sorted.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <h3 className="text-lg font-semibold text-[#2F3440] mb-2">No tests match these filters</h3>
          <p className="text-[#5C6478] max-w-md mx-auto">
            Try removing a biomarker requirement or widening the turnaround time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sorted.map((test) => {
            const price = formatPrice(test);

            return (
              <div key={test.id} className="glass rounded-2xl p-6 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#2F3440]">{test.provider}</h3>
                    <p className="text-sm text-[#5C6478]">
                      {test.productName ?? (
                        <span className="italic">Product name not yet sourced</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {price ? (
                      <div className="text-2xl font-bold text-[#2F3440]">{price}</div>
                    ) : (
                      <div className="text-sm text-[#B4762F] font-medium">Price not sourced</div>
                    )}
                  </div>
                </div>

                {/* Show every detail we have sourced, whatever else is still
                    outstanding. A gap in a secondary field never hides the
                    panel a provider actually publishes. */}
                {test.biomarkers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {test.biomarkers.map((b) => (
                      <span
                        key={b}
                        className="grain text-[11px] font-semibold text-[#5B6AA5] bg-[#DEE8FF]/70 px-2.5 py-1 rounded-full"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-xs text-[#5C6478] mb-5">
                  {test.turnaroundDays !== null && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {test.turnaroundDays} day results
                    </span>
                  )}
                  {test.collection && (
                    <span className="flex items-center gap-1.5">
                      {test.collection === 'clinic' ? (
                        <Building2 className="w-3.5 h-3.5" />
                      ) : (
                        <Home className="w-3.5 h-3.5" />
                      )}
                      {COLLECTION_LABELS[test.collection]}
                    </span>
                  )}
                  {test.clinicianReview && (
                    <span className="flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5" />
                      Clinician review
                    </span>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3">
                  <a
                    href={test.providerUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-sm font-semibold text-[#5B6AA5] flex items-center gap-1.5 hover:underline"
                  >
                    {price ? 'Visit provider' : 'Source details'}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {test.lastSourced && (
                    <span className="text-[11px] text-[#5C6478]">
                      Checked {new Date(test.lastSourced).toLocaleDateString('en-GB', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-[#5C6478] leading-relaxed max-w-3xl">
        Prices and panel contents are published by each provider and change without notice. Always
        confirm on the provider's own site before buying. A test result is not a diagnosis — discuss
        anything unexpected with a qualified clinician.
      </p>
    </div>
  );
}
