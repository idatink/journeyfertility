import { TrendingDown, ShieldCheck, Calculator, Hourglass } from 'lucide-react';

/**
 * The community-insight trust lever the journey was missing — honestly handled.
 *
 * These are aggregated THEMES synthesised from public forum discussions, not
 * individual testimonials and not advice. We deliberately do not invent quotes
 * or attribute anything to a named person. Real, consented patient stories are
 * a separate, still-to-come piece; this is research signal, clearly labelled.
 * Source: docs/research/egg-freezing-abroad.md.
 */
const INSIGHTS = [
  {
    icon: TrendingDown,
    theme: 'Cost is the number-one reason people look abroad',
    detail:
      'A UK round runs ~£5,000–£6,000+ before medication; in Europe the same cycle is often £2,000–£3,000. Some do several rounds abroad — travel included — for less than one UK cycle.',
  },
  {
    icon: ShieldCheck,
    theme: 'Trust outweighs price when choosing a clinic',
    detail:
      'People read reviews hard — hunting the buried one-star ones — and want per-age success data, not headline numbers. Safety and responsiveness win over the cheapest quote.',
  },
  {
    icon: Calculator,
    theme: 'The real decision is the all-in total',
    detail:
      'The headline fee is only part of it. People add up medication, storage over years, and — abroad — travel, accommodation and shipping eggs home, then compare.',
  },
  {
    icon: Hourglass,
    theme: 'Egg freezing is understood as options, not a guarantee',
    detail:
      'There is clear awareness that success drops with age and that freezing earlier (ideally under 35) gives the best odds — it buys flexibility, not certainty.',
  },
];

export function CommunityInsights() {
  return (
    <section className="space-y-6" aria-labelledby="community-heading">
      <div className="max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C2542E] mb-3">
          From the community
        </div>
        <h2 id="community-heading" className="text-2xl md:text-3xl font-semibold tracking-tight text-[#2F2C2A] mb-2">
          What people weighing this up actually do
        </h2>
        <p className="text-[#665F58] leading-relaxed">
          Themes drawn from public discussions on Reddit — not individual stories, and not advice.
          They shaped how we built this.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INSIGHTS.map(({ icon: Icon, theme, detail }) => (
          <div key={theme} className="glass rounded-2xl p-5 flex gap-4">
            <span className="shrink-0 w-10 h-10 rounded-full bg-[#DCE6F0]/60 flex items-center justify-center text-[#C2542E]">
              <Icon className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-semibold text-[#2F2C2A] leading-snug mb-1">{theme}</h3>
              <p className="text-sm text-[#665F58] leading-relaxed">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-[#665F58] leading-relaxed max-w-3xl">
        Synthesised from public threads on{' '}
        <a href="https://www.reddit.com/r/eggfreezing/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#C2542E] hover:underline">r/eggfreezing</a>,{' '}
        <a href="https://www.reddit.com/r/AskUK/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#C2542E] hover:underline">r/AskUK</a>{' '}
        and{' '}
        <a href="https://www.reddit.com/r/eggfreezingabroad/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#C2542E] hover:underline">r/eggfreezingabroad</a>.
        Real, consented patient stories are coming separately.
      </p>
    </section>
  );
}
