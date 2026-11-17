import { Building2, BookOpenCheck, Landmark, PoundSterling } from 'lucide-react';
import { SITE } from '../lib/site';

/**
 * Trust, where the decision happens. Each point is a promise the product keeps elsewhere in
 * the code (real prices only, NICE and HFEA as sources, NHS routes explained).
 */
const POINTS = [
  { icon: Building2, label: `Non-profit, built by ${SITE.founder}` },
  { icon: BookOpenCheck, label: 'Based on NICE fertility guidelines and HFEA data' },
  { icon: Landmark, label: 'Explains what you can get on the NHS' },
  { icon: PoundSterling, label: 'Real published prices, never a made-up number' },
];

export function TrustStrip() {
  return (
    <ul className="glass rounded-2xl p-4 md:p-5 grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4">
      {POINTS.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-2.5">
          <span className="shrink-0 w-8 h-8 rounded-full bg-sky/60 flex items-center justify-center text-peach-deep">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-ink leading-snug">{label}</span>
        </li>
      ))}
    </ul>
  );
}
