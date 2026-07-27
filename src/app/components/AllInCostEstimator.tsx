import { useState } from 'react';
import { Plane, MapPin, Info } from 'lucide-react';

/**
 * The all-in cost people actually end up building in a spreadsheet: not the
 * headline cycle fee, but treatment + medication + storage over time, and —
 * for treatment abroad — travel, accommodation and shipping eggs home.
 *
 * HONESTY: these are indicative RANGES, not quotes, and not a clinic listing.
 *  - UK figures are grounded in the real clinic prices sourced elsewhere in
 *    this app (cycle £3,195–£6,100; meds £800–£2,600; storage £200–£425/yr).
 *  - Europe figures are indicative ranges from published Spain / Greece /
 *    Czechia clinic prices seen in research (converted at roughly €1 = £0.86);
 *    they name no clinic and are clearly labelled as estimates. The honest way
 *    to turn them into a real number is to enquire for a quote.
 */

const gbp = (n: number) => `£${Math.round(n).toLocaleString()}`;

type Loc = 'uk' | 'eu';

const MODEL: Record<Loc, { cycle: [number, number]; meds: [number, number]; storage: [number, number]; travel: [number, number] }> = {
  uk: { cycle: [3195, 6100], meds: [800, 2600], storage: [200, 425], travel: [0, 0] },
  eu: { cycle: [1600, 3000], meds: [900, 1800], storage: [200, 300], travel: [600, 1500] },
};
const SHIP_BACK = 3000;

function total(loc: Loc, cycles: number, years: number, shipBack: boolean) {
  const m = MODEL[loc];
  const ship = loc === 'eu' && shipBack ? SHIP_BACK : 0;
  const low = cycles * (m.cycle[0] + m.meds[0] + m.travel[0]) + years * m.storage[0] + ship;
  const high = cycles * (m.cycle[1] + m.meds[1] + m.travel[1]) + years * m.storage[1] + ship;
  return { low, high };
}

const CYCLES = [1, 2, 3];
const YEARS = [1, 3, 5, 10];

export function AllInCostEstimator() {
  const [cycles, setCycles] = useState(1);
  const [years, setYears] = useState(3);
  const [shipBack, setShipBack] = useState(true);

  const uk = total('uk', cycles, years, shipBack);
  const eu = total('eu', cycles, years, shipBack);
  const gapLow = uk.low - eu.high;
  const gapHigh = uk.high - eu.low;

  const Pill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`grain text-sm font-semibold px-4 py-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6AA5] focus-visible:ring-offset-2 ${
        active ? 'bg-[#2F3440] text-white' : 'bg-white/70 text-[#2F3440] hover:bg-white'
      }`}
    >
      {children}
    </button>
  );

  const Column = ({
    loc,
    label,
    icon,
    range,
  }: {
    loc: Loc;
    label: string;
    icon: React.ReactNode;
    range: { low: number; high: number };
  }) => {
    const m = MODEL[loc];
    const ship = loc === 'eu' && shipBack ? SHIP_BACK : 0;
    const rows: [string, string][] = [
      [`Treatment × ${cycles}`, `${gbp(cycles * m.cycle[0])}–${gbp(cycles * m.cycle[1])}`],
      [`Medication × ${cycles}`, `${gbp(cycles * m.meds[0])}–${gbp(cycles * m.meds[1])}`],
      [`Storage × ${years} yr`, `${gbp(years * m.storage[0])}–${gbp(years * m.storage[1])}`],
    ];
    if (loc === 'eu') {
      rows.push([`Travel & stay × ${cycles}`, `${gbp(cycles * m.travel[0])}–${gbp(cycles * m.travel[1])}`]);
      if (ship) rows.push(['Ship eggs to the UK', gbp(SHIP_BACK)]);
    }
    return (
      <div className={`rounded-2xl p-5 ${loc === 'uk' ? 'bg-white/70' : 'bg-[#DEE8FF]/40'} border border-[#A8BEEB]/30`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#5B6AA5]">{icon}</span>
          <h4 className="font-semibold text-[#2F3440]">{label}</h4>
        </div>
        <div className="text-2xl font-bold text-[#2F3440] mb-3 whitespace-nowrap">
          {gbp(range.low)} – {gbp(range.high)}
        </div>
        <dl className="space-y-1.5 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt className="text-[#5C6478]">{k}</dt>
              <dd className="text-[#2F3440] whitespace-nowrap">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  };

  return (
    <section className="glass rounded-2xl p-6 md:p-8 space-y-6" aria-labelledby="allin-heading">
      <div className="max-w-2xl">
        <h3 id="allin-heading" className="text-2xl font-semibold tracking-tight text-[#2F3440] mb-2">
          The true all-in cost — UK vs Europe
        </h3>
        <p className="text-sm text-[#5C6478] leading-relaxed">
          The headline cycle fee is only part of it. This is the realistic total once medication,
          storage over time and — for treatment abroad — travel and shipping your eggs home are
          included. Indicative ranges, not a quote.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-[#5C6478] mb-2">Cycles</div>
          <div className="flex gap-2">
            {CYCLES.map((c) => (
              <Pill key={c} active={cycles === c} onClick={() => setCycles(c)}>{c}</Pill>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-[#5C6478] mb-2">Years of storage</div>
          <div className="flex gap-2">
            {YEARS.map((y) => (
              <Pill key={y} active={years === y} onClick={() => setYears(y)}>{y}</Pill>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-[#5C6478] mb-2">Ship eggs home</div>
          <Pill active={shipBack} onClick={() => setShipBack((s) => !s)}>
            {shipBack ? 'Included' : 'Not included'}
          </Pill>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Column loc="uk" label="In the UK" icon={<MapPin className="w-5 h-5" />} range={uk} />
        <Column loc="eu" label="Europe (Spain / Greece / Czechia)" icon={<Plane className="w-5 h-5" />} range={eu} />
      </div>

      {gapHigh > 0 && (
        <p className="text-sm text-[#2F3440]">
          <span className="font-semibold">The gap:</span> for {cycles} cycle{cycles > 1 ? 's' : ''} and{' '}
          {years} years of storage, the UK works out roughly{' '}
          <span className="font-semibold">
            {gbp(Math.max(0, gapLow))}–{gbp(gapHigh)}
          </span>{' '}
          more — {shipBack ? 'even after shipping eggs home' : 'before shipping eggs home'}.
        </p>
      )}

      <div className="flex gap-3 rounded-xl bg-[#F8AD7C]/10 p-4">
        <Info className="w-5 h-5 text-[#B4762F] shrink-0 mt-0.5" />
        <p className="text-xs text-[#5C6478] leading-relaxed">
          <span className="font-semibold text-[#2F3440]">Indicative estimates, not quotes.</span>{' '}
          UK ranges come from the real clinic prices sourced in this tool; Europe ranges are typical
          published Spain / Greece / Czechia clinic prices (no clinic is named here) converted at
          roughly €1 = £0.86. Medication depends on your AMH and protocol; success rates vary sharply
          with age. Confirm real figures with a clinic — send an enquiry to get a quote.
        </p>
      </div>
    </section>
  );
}
