import { ArrowRight } from 'lucide-react';

type ServiceId = 'fertility' | 'egg-freezing' | 'ivf' | 'embryo';

/**
 * The piece the journey was missing: a plain-language way to choose *between*
 * the options, not just switch between them. It answers "egg freezing or IVF?"
 * directly, and always offers testing as the low-commitment first step.
 */
const OPTIONS: {
  service: ServiceId;
  title: string;
  tagline: string;
  bestIf: string;
  how: string;
  cta: string;
}[] = [
  {
    service: 'fertility',
    title: 'Fertility testing',
    tagline: 'Understand where you stand',
    bestIf: "You're not sure yet, or want a baseline before deciding anything.",
    how: 'A simple blood test — AMH, egg reserve, key hormones — at home or at a clinic. The usual first step.',
    cta: 'Compare fertility tests',
  },
  {
    service: 'egg-freezing',
    title: 'Egg freezing',
    tagline: 'Preserve eggs for later',
    bestIf: "You're not ready for a baby now but want to keep your options open — best under about 35.",
    how: 'An IVF-style cycle, but your unfertilised eggs are frozen. No sperm needed now — you choose later.',
    cta: 'Compare egg freezing',
  },
  {
    service: 'ivf',
    title: 'IVF',
    tagline: 'Try for a baby now',
    bestIf: "You've been trying without success, or you're ready to start now.",
    how: 'Eggs are collected and fertilised with sperm in the lab; an embryo is transferred. The most established treatment.',
    cta: 'Compare IVF clinics',
  },
  {
    service: 'embryo',
    title: 'Embryo freezing',
    tagline: 'Preserve embryos for the future',
    bestIf: 'You have a partner or donor sperm now and want to preserve together.',
    how: 'Like IVF, but the embryos are frozen instead of transferred now. Embryos survive freezing well.',
    cta: 'Compare embryo freezing',
  },
];

export function OptionsComparison({ onPick }: { onPick: (service: ServiceId) => void }) {
  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#2F2C2A] mb-2">
          Not sure which path is right for you?
        </h2>
        <p className="text-[#665F58] leading-relaxed">
          The quick version: <span className="text-[#2F2C2A] font-semibold">freezing preserves for later; IVF is treatment to conceive now.</span>{' '}
          If you&rsquo;re weighing it all up, a fertility test is the low-cost first step.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {OPTIONS.map((o) => (
          <div key={o.service} className="glass rounded-2xl p-5 flex flex-col">
            <h3 className="text-lg font-semibold text-[#2F2C2A] leading-tight">{o.title}</h3>
            <p className="text-sm font-semibold text-[#C2542E] mb-3">{o.tagline}</p>

            <div className="mb-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-[#665F58] mb-1">Best if</div>
              <p className="text-sm text-[#2F2C2A] leading-snug">{o.bestIf}</p>
            </div>
            <div className="mb-4">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-[#665F58] mb-1">How it works</div>
              <p className="text-sm text-[#665F58] leading-snug">{o.how}</p>
            </div>

            <button
              onClick={() => onPick(o.service)}
              className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[#C2542E] hover:gap-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2542E] focus-visible:ring-offset-2 rounded-md"
            >
              {o.cta}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
