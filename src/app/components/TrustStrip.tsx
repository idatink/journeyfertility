import { Building2, PoundSterling, ShieldCheck, Heart } from 'lucide-react';

/**
 * Trust, where the decision happens — not buried on the About page. Each point
 * is a promise the product actually keeps elsewhere in the code (real prices
 * only, HFEA-linked success data, no treatment sold here).
 */
const POINTS = [
  { icon: Building2, label: 'A comparison service, not a clinic' },
  { icon: PoundSterling, label: 'Real published prices — never a made-up number' },
  { icon: ShieldCheck, label: 'Success rates from the HFEA register' },
  { icon: Heart, label: 'Free · no account · no pressure' },
];

export function TrustStrip() {
  return (
    <div className="glass rounded-2xl p-4 md:p-5 grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4">
      {POINTS.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2.5">
          <span className="shrink-0 w-8 h-8 rounded-full bg-[#DCE6F0]/60 flex items-center justify-center text-[#C2542E]">
            <Icon className="w-4 h-4" />
          </span>
          <span className="text-sm font-medium text-[#2F2C2A] leading-snug">{label}</span>
        </div>
      ))}
    </div>
  );
}
