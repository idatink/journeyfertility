import { Link } from 'react-router';
import { Landmark } from 'lucide-react';
import { NHS_BY_SERVICE, NHS_GENERAL, NHS_REVIEWED, type NhsGuide as Guide } from '../lib/nhs';
import { SERVICE_LABELS, SERVICE_NAMES, type SearchService } from '../lib/search';

function GuideBody({ guide }: { guide: Guide }) {
  return (
    <>
      <p className="text-ink font-semibold leading-relaxed mb-3">{guide.summary}</p>
      <ul className="list-disc pl-5 space-y-2 text-muted-ink leading-relaxed mb-4">
        {guide.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <p className="text-ink leading-relaxed mb-4">
        <span className="font-semibold">How to start: </span>
        {guide.howToStart}
      </p>
      <p className="text-sm text-muted-ink">
        Sources:{' '}
        {guide.sources.map((s, i) => (
          <span key={s.url}>
            {i > 0 && '; '}
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hit-area text-peach-deep underline underline-offset-2"
            >
              {s.label}
            </a>
          </span>
        ))}
        .
      </p>
    </>
  );
}

/** The NHS route for one service, shown on the search page. */
export function NhsGuideForService({ service }: { service: SearchService }) {
  return (
    <section className="glass rounded-2xl p-6 md:p-8" aria-labelledby={`nhs-${service}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="shrink-0 w-10 h-10 rounded-full bg-sky/60 flex items-center justify-center text-peach-deep">
          <Landmark className="w-5 h-5" aria-hidden="true" />
        </span>
        <h2 id={`nhs-${service}`} className="text-xl md:text-2xl font-semibold tracking-tight text-ink">
          {SERVICE_LABELS[service]} on the NHS
        </h2>
      </div>
      <GuideBody guide={NHS_BY_SERVICE[service]} />
      <p className="mt-4">
        <Link to="/nhs" className="inline-flex items-center min-h-11 font-semibold text-peach-deep hover:underline">
          How NHS fertility funding works
        </Link>
      </p>
    </section>
  );
}

/** Every service, for the /nhs page. */
export function NhsGuideAll() {
  return (
    <div className="space-y-6">
      <section className="glass rounded-2xl p-6 md:p-8" aria-labelledby="nhs-general">
        <h2 id="nhs-general" className="text-xl md:text-2xl font-semibold tracking-tight text-ink mb-4">
          How NHS fertility funding works
        </h2>
        <GuideBody guide={NHS_GENERAL} />
      </section>
      {(Object.keys(NHS_BY_SERVICE) as SearchService[]).map((service) => (
        <section key={service} className="glass rounded-2xl p-6 md:p-8" aria-labelledby={`nhs-all-${service}`}>
          <h2 id={`nhs-all-${service}`} className="text-xl md:text-2xl font-semibold tracking-tight text-ink mb-4">
            {SERVICE_LABELS[service]}
          </h2>
          <GuideBody guide={NHS_BY_SERVICE[service]} />
          <p className="mt-4">
            <Link
              to={`/search?service=${service}`}
              className="inline-flex items-center min-h-11 font-semibold text-peach-deep hover:underline"
            >
              Compare {SERVICE_NAMES[service]}
            </Link>
          </p>
        </section>
      ))}
      <p className="text-sm text-muted-ink">Checked against these sources on {NHS_REVIEWED}.</p>
    </div>
  );
}
