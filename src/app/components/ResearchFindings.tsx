import { MessageCircle } from 'lucide-react';
import { Eyebrow } from './SiteChrome';
import { SITE } from '../lib/site';

/**
 * Findings from JourneyFertility's own research with women going through fertility decisions.
 * Only findings Ida supplies go here; until then each card shows its {{finding n}} placeholder.
 */
export function ResearchFindings() {
  return (
    <section className="space-y-6" aria-labelledby="research-heading">
      <div className="max-w-2xl">
        <Eyebrow>From our research</Eyebrow>
        <h2 id="research-heading" className="text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-2">
          What {SITE.researchCount} women told us
        </h2>
        <p className="text-muted-ink leading-relaxed">
          Insights from our deep research with {SITE.researchCount} women going through fertility decisions
          {SITE.researchWhen}. Thank you to every participant.
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SITE.researchFindings.map((finding) => (
          <li key={finding} className="glass rounded-2xl p-5 flex gap-4">
            <span className="shrink-0 w-10 h-10 rounded-full bg-sky/60 flex items-center justify-center text-peach-deep">
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
            </span>
            <p className="text-ink leading-relaxed self-center">{finding}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
