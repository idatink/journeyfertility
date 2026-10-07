import { ExternalLink } from 'lucide-react';

/**
 * The single most-asked-for piece of information (per the abroad research):
 * how success changes with age. We do not reproduce clinic-specific rates —
 * those live on the HFEA register and we link to them. What we show is the
 * national picture from HFEA's own published figures, which is safe to state
 * and makes the age effect concrete.
 *
 * Figures: HFEA "Fertility treatment 2023", birth rate per embryo transferred
 * using the patient's own eggs. Age at egg collection / freezing is the driver.
 */
const HFEA_REGISTER = 'https://www.hfea.gov.uk/choose-a-clinic/clinic-search/';

// Two honest anchors from HFEA 2023; the middle declines steadily and we say so
// rather than inventing band-by-band numbers.
const ANCHORS = [
  { label: 'Age 18–34', pct: 35 },
  { label: 'Age 43–44', pct: 5 },
];

export function SuccessByAge() {
  return (
    <section
      className="rounded-2xl bg-[#F4A28C]/10 border border-[#C3D3E2]/25 p-5 md:p-6"
      aria-labelledby="success-age-heading"
    >
      <h3 id="success-age-heading" className="text-lg md:text-xl font-semibold text-[#2F2C2A] mb-1.5">
        Success drops sharply with age
      </h3>
      <p className="text-sm text-[#665F58] leading-relaxed mb-4 max-w-2xl">
        Age at egg collection is the biggest single factor in whether treatment works — far more
        than the clinic you choose. Nationally, the IVF birth rate per embryo transferred falls from
        about a third in your early thirties to the low single figures by your mid-forties. Freezing
        eggs earlier (ideally under 35) gives the best odds; it is never a guarantee.
      </p>

      <div className="space-y-2.5 mb-4 max-w-md">
        {ANCHORS.map((a) => (
          <div key={a.label} className="flex items-center gap-3">
            <div className="w-24 text-sm text-[#2F2C2A] shrink-0">{a.label}</div>
            <div className="flex-1 h-6 rounded-md bg-white/60 overflow-hidden">
              <div
                className="h-full rounded-md bg-gradient-to-r from-[#C2542E] to-[#E89B7E] flex items-center justify-end pr-2"
                style={{ width: `${Math.max(a.pct * 2.4, 12)}%` }}
              >
                <span className="text-[11px] font-bold text-white">{a.pct}%</span>
              </div>
            </div>
          </div>
        ))}
        <p className="text-xs text-[#665F58]">
          National average across all ages: ~30%. HFEA, Fertility treatment 2023 — birth rate per
          embryo transferred, own eggs.
        </p>
      </div>

      <p className="text-sm text-[#2F2C2A] leading-relaxed mb-4 max-w-2xl font-medium">
        The steepest drop is through your late thirties — so if you&rsquo;re near or past 35,
        deciding sooner rather than later makes a real difference to your chances.
      </p>

      <a
        href={HFEA_REGISTER}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C2542E] hover:underline"
      >
        See verified, clinic-by-clinic rates on the HFEA register
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </section>
  );
}
