import { SERVICE_EXPLAINERS } from '../lib/serviceContent';

/**
 * The learn-more panel for a service: what it is, the steps, and a "good to
 * know" note. Rendered above the comparison in the results view (and in the
 * home search form) so choosing a path always leads to understanding it before
 * comparing prices.
 */
export function ServiceExplainer({
  serviceType,
  className = '',
}: {
  serviceType: string;
  className?: string;
}) {
  const ex = SERVICE_EXPLAINERS[serviceType];
  if (!ex) return null;

  return (
    <section
      className={`rounded-2xl bg-[#DCE6F0]/35 border border-[#C3D3E2]/25 p-5 md:p-6 ${className}`}
      aria-label={ex.title}
    >
      <h3 className="text-lg md:text-xl font-semibold text-[#2F2C2A] mb-1.5">{ex.title}</h3>
      <p className="text-sm text-[#665F58] leading-relaxed mb-4 max-w-2xl">{ex.lede}</p>
      <ol className="grid gap-3 sm:grid-cols-3 mb-4">
        {ex.steps.map((step, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="grain shrink-0 w-6 h-6 rounded-full bg-[#F4A28C] text-[#2F2C2A] text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <div>
              <div className="text-sm font-semibold text-[#2F2C2A] leading-tight">{step.h}</div>
              <div className="text-xs text-[#665F58] leading-snug mt-0.5">{step.p}</div>
            </div>
          </li>
        ))}
      </ol>
      <p className="text-xs text-[#665F58] leading-relaxed">
        <span className="font-semibold text-[#C2542E]">Good to know:</span> {ex.note}
      </p>
    </section>
  );
}
