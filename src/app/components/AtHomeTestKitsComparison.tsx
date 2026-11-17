import { useState, useEffect } from 'react';
import {
  ExternalLink,
  Clock,
  Stethoscope,
  Home,
  Building2,
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  Check,
  X,
} from 'lucide-react';
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

const SAMPLE_LABEL: Record<string, string> = {
  'finger-prick': 'Finger-prick',
  'venous-draw': 'Venous draw',
};

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
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);

  const toggleShortlist = (id: string) =>
    setShortlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  useEffect(() => {
    if (!comparing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setComparing(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [comparing]);

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
        <h2 className="text-3xl font-semibold tracking-tight text-ink mb-2">
          Compare fertility tests
        </h2>
        <p className="text-muted-ink">
          {sorted.length} of {FERTILITY_TESTS.length} providers
        </p>
      </div>

      {/* Provenance note. Every price and panel below is read from the
          provider's own product page; a few secondary details are still being
          confirmed and are left blank rather than guessed. */}
      {progress.sourced < progress.total && (
        <div className="glass rounded-2xl p-5 flex gap-3">
          <AlertCircle className="w-5 h-5 text-peach-deep shrink-0 mt-0.5" />
          <div className="text-sm text-muted-ink leading-relaxed">
            <span className="font-semibold text-ink">
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
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-ink mb-2">
              Provider
            </div>
            <div className="flex flex-wrap gap-2">
              {providers.map((p) => (
                <button
                  key={p}
                  onClick={() => setFilters((f) => ({ ...f, provider: p }))}
                  className={`grain text-sm font-medium px-3.5 py-1.5 max-sm:min-h-11 inline-flex items-center rounded-full transition-all ${
                    filters.provider === p
                      ? 'bg-ink text-white'
                      : 'bg-white/60 text-ink hover:bg-white/80'
                  }`}
                >
                  {p === 'all' ? 'All' : p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-ink mb-2">
              Sample
            </div>
            <div className="flex flex-wrap gap-2">
              {COLLECTION_OPTIONS.map((c) => (
                <button
                  key={String(c.id)}
                  onClick={() => setFilters((f) => ({ ...f, collection: c.id }))}
                  className={`grain text-sm font-medium px-3.5 py-1.5 max-sm:min-h-11 inline-flex items-center rounded-full transition-all ${
                    filters.collection === c.id
                      ? 'bg-ink text-white'
                      : 'bg-white/60 text-ink hover:bg-white/80'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-ink mb-2">
              Results back
            </div>
            <div className="flex flex-wrap gap-2">
              {TURNAROUND_OPTIONS.map((t) => (
                <button
                  key={String(t.id)}
                  onClick={() => setFilters((f) => ({ ...f, maxTurnaroundDays: t.id }))}
                  className={`grain text-sm font-medium px-3.5 py-1.5 max-sm:min-h-11 inline-flex items-center rounded-full transition-all ${
                    filters.maxTurnaroundDays === t.id
                      ? 'bg-ink text-white'
                      : 'bg-white/60 text-ink hover:bg-white/80'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-ink mb-2">
            Must test for
          </div>
          <div className="flex flex-wrap gap-2">
            {BIOMARKERS.map((b) => (
              <button
                key={b}
                onClick={() => toggleBiomarker(b)}
                className={`grain text-xs font-medium px-3 py-1.5 max-sm:min-h-11 inline-flex items-center rounded-full transition-all ${
                  filters.biomarkers.includes(b)
                    ? 'bg-blush text-ink'
                    : 'bg-white/60 text-muted-ink hover:bg-white/80'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
          <label className="flex items-center gap-2 min-h-11 text-sm text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={filters.clinicianReviewOnly}
              onChange={(e) =>
                setFilters((f) => ({ ...f, clinicianReviewOnly: e.target.checked }))
              }
              className="accent-blush w-4 h-4"
            />
            Clinician reviews my results
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-ink">Sort by</span>
            <button
              onClick={() => setSort('price')}
              className={`grain text-sm font-medium px-3.5 py-1.5 max-sm:min-h-11 inline-flex items-center rounded-full ${
                sort === 'price' ? 'bg-ink text-white' : 'bg-white/60 text-ink'
              }`}
            >
              Price
            </button>
            <button
              onClick={() => setSort('panel')}
              className={`grain text-sm font-medium px-3.5 py-1.5 max-sm:min-h-11 inline-flex items-center rounded-full ${
                sort === 'panel' ? 'bg-ink text-white' : 'bg-white/60 text-ink'
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
          <h3 className="text-lg font-semibold text-ink mb-2">No tests match these filters</h3>
          <p className="text-muted-ink max-w-md mx-auto">
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
                    <h3 className="text-lg font-semibold text-ink">{test.provider}</h3>
                    <p className="text-sm text-muted-ink">
                      {test.productName ?? (
                        <span className="italic">Product name not yet sourced</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {price ? (
                      <div className="text-2xl font-bold text-ink">{price}</div>
                    ) : (
                      <div className="text-sm text-peach-deep font-medium">Price not sourced</div>
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
                        className="grain text-xs font-semibold text-peach-deep bg-sky/70 px-2.5 py-1 rounded-full"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-xs text-muted-ink mb-5">
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
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => toggleShortlist(test.id)}
                      aria-pressed={shortlist.includes(test.id)}
                      className="inline-flex items-center gap-1 max-sm:min-h-11 text-sm font-medium text-peach-deep rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-deep"
                    >
                      {shortlist.includes(test.id) ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 fill-sky" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          Compare
                        </>
                      )}
                    </button>
                    <a
                      href={test.providerUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="min-h-11 text-sm font-semibold text-peach-deep flex items-center gap-1.5 hover:underline"
                    >
                      {price ? 'Visit provider' : 'Source details'}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  {test.lastSourced && (
                    <span className="text-xs text-muted-ink">
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

      <p className="text-xs text-muted-ink leading-relaxed max-w-3xl">
        Prices and panel contents are published by each provider and change without notice. Always
        confirm on the provider's own site before buying. A test result is not a diagnosis — discuss
        anything unexpected with a qualified clinician.
      </p>

      {/* Sticky compare bar */}
      {shortlist.length > 0 && !comparing && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 pointer-events-none">
          <div className="pointer-events-auto glass rounded-full shadow-[0_12px_40px_rgba(120,140,200,0.3)] border border-sky/40 px-5 py-3 flex items-center gap-4">
            <span className="text-sm font-medium text-ink whitespace-nowrap">
              {shortlist.length} saved{shortlist.length < 2 ? ' · save one more' : ''}
            </span>
            <Button
              size="sm"
              className="bg-ink hover:bg-ink/90 text-white font-semibold"
              onClick={() => setComparing(true)}
              disabled={shortlist.length < 2}
            >
              Compare side by side
            </Button>
            <button
              onClick={() => setShortlist([])}
              className="max-sm:min-h-11 text-sm text-muted-ink hover:text-ink rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-deep"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Side-by-side compare */}
      {comparing && (() => {
        const shortlisted = FERTILITY_TESTS.filter((t) => shortlist.includes(t.id));
        const markerRows = BIOMARKERS.filter((b) => shortlisted.some((t) => t.biomarkers.includes(b)));
        return (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Compare fertility tests side by side"
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={() => setComparing(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-ink">
                  Comparing {shortlisted.length} tests
                </h3>
                <button
                  onClick={() => setComparing(false)}
                  aria-label="Close compare"
                  className="hit-area text-muted-ink hover:text-ink rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-deep"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-white z-10 p-3 text-left align-bottom w-40" />
                      {shortlisted.map((t) => (
                        <th key={t.id} className="p-3 text-left align-bottom min-w-[9rem] border-l">
                          <div className="font-semibold text-ink leading-snug">{t.provider}</div>
                          <button
                            onClick={() => toggleShortlist(t.id)}
                            className="mt-1 inline-flex items-center gap-1 max-sm:min-h-11 text-xs text-muted-ink hover:text-ink"
                          >
                            <X className="w-3 h-3" /> Remove
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t bg-sky/30">
                      <td className="sticky left-0 bg-stone z-10 p-3 font-semibold text-ink">Price</td>
                      {shortlisted.map((t) => (
                        <td key={t.id} className="p-3 border-l font-semibold text-ink whitespace-nowrap">
                          {formatPrice(t) ?? <span className="text-gray-400">—</span>}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <td className="sticky left-0 bg-white z-10 p-3 text-muted-ink font-medium">Sample</td>
                      {shortlisted.map((t) => (
                        <td key={t.id} className="p-3 border-l text-ink">
                          {t.sampleType ? SAMPLE_LABEL[t.sampleType] : <span className="text-gray-400">—</span>}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <td className="sticky left-0 bg-white z-10 p-3 text-muted-ink font-medium">Collection</td>
                      {shortlisted.map((t) => (
                        <td key={t.id} className="p-3 border-l text-ink">
                          {t.collection ? COLLECTION_LABELS[t.collection] : <span className="text-gray-400">—</span>}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <td className="sticky left-0 bg-white z-10 p-3 text-muted-ink font-medium">Clinician review</td>
                      {shortlisted.map((t) => (
                        <td key={t.id} className="p-3 border-l text-ink">
                          {t.clinicianReview === null ? <span className="text-gray-400">—</span> : t.clinicianReview ? 'Yes' : 'No'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <td className="sticky left-0 bg-white z-10 p-3 text-muted-ink font-medium">Results back</td>
                      {shortlisted.map((t) => (
                        <td key={t.id} className="p-3 border-l text-ink">
                          {t.turnaroundDays !== null ? `${t.turnaroundDays} days` : <span className="text-gray-400">—</span>}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-t">
                      <td
                        colSpan={shortlisted.length + 1}
                        className="p-3 pt-4 text-xs font-semibold uppercase tracking-wide text-peach-deep"
                      >
                        Measures
                      </td>
                    </tr>
                    {markerRows.map((b) => (
                      <tr key={b} className="border-t">
                        <td className="sticky left-0 bg-white z-10 p-3 text-muted-ink font-medium">{b}</td>
                        {shortlisted.map((t) => (
                          <td key={t.id} className="p-3 border-l">
                            {t.biomarkers.includes(b) ? (
                              <Check className="w-4 h-4 text-peach-deep" aria-label="included" />
                            ) : (
                              <span className="text-gray-300" aria-label="not included">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}

                    <tr className="border-t">
                      <td className="sticky left-0 bg-white z-10 p-3" />
                      {shortlisted.map((t) => (
                        <td key={t.id} className="p-3 border-l">
                          <a
                            href={t.providerUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-peach-deep hover:underline"
                          >
                            Visit <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
