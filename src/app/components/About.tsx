import { useEffect } from 'react';
import { Link } from 'react-router';
import { Search, Scale, ShieldCheck, HeartHandshake, Megaphone, PenTool, Code2, UserRound } from 'lucide-react';
import { Eyebrow } from './SiteChrome';
import { SITE, isPlaceholder } from '../lib/site';

/**
 * Journey AI is described as a planned paid product. Hidden until Ida confirms it exists;
 * flip this to show the two paragraphs again.
 */
const SHOW_JOURNEY_AI = true;
/** The £3 a month price is not confirmed, so it stays hidden. */
const SHOW_JOURNEY_AI_PRICE = false;

const PRINCIPLES = [
  {
    icon: Scale,
    title: 'Costs shown in full',
    body: "A headline price is not a price. We break quotes into their real line items — medication, storage, extras — so two clinics can actually be compared.",
  },
  {
    icon: ShieldCheck,
    title: 'Verified, not advertised',
    body: 'Clinics appear because they meet our listing standards, not because they paid to be first. Success rates are shown with the context needed to read them properly.',
  },
  {
    icon: Search,
    title: 'One search, every option',
    body: 'Egg freezing, embryo freezing, IVF and fertility testing for UK clinics, in a single place, so you are not rebuilding your research for each clinic.',
  },
  {
    icon: HeartHandshake,
    title: 'No pressure, ever',
    body: 'We are a non-profit comparison service, not a clinic. We do not sell treatment, and nothing here is designed to rush a decision that deserves time.',
  },
];

/**
 * The founding team, described by discipline rather than by name.
 *
 * We deliberately put no invented names and no faces here. An About page that
 * names founders is read as fact by users, press and investors, and attaching a
 * stock face to an invented person misrepresents them (the same reason the
 * testimonials carry no faces; see ATTRIBUTIONS.md). Each entry describes the
 * role, so it stays true whoever fills it — the real team will introduce
 * themselves, by name, when they are ready.
 */
const TEAM: {
  role: string;
  icon: typeof Megaphone;
  bio: string;
}[] = [
  {
    role: 'Marketing',
    icon: Megaphone,
    bio: 'Leads how JourneyFertility talks about fertility — plainly, without the urgency and overclaiming the category is known for. Owns the promise that nothing here is written to rush a decision.',
  },
  {
    role: 'Design',
    icon: PenTool,
    bio: 'Responsible for how the comparison feels to use at a difficult moment: legible pricing, honest empty states, and an interface that never pressures. Owns the design system and the accessibility standard.',
  },
  {
    role: 'Engineering',
    icon: Code2,
    bio: 'Builds the search and the cost model, including the data protection that health data demands. Owns the rule that we never show a price we cannot source.',
  },
];

/** Distinct brand gradients so the three discipline avatars read as a set, not a repeat. */
const AVATAR_GRADIENTS = [
  'from-sky via-accent to-blush',
  'from-blush via-accent to-sky',
  'from-sky via-accent to-sky',
];

export function About() {
  useEffect(() => {
    document.title = 'About | JourneyFertility, a non-profit fertility guide';
  }, []);
  const linkedInIsReal = !isPlaceholder(SITE.founderLinkedIn);

  return (
    <div>
      {/* Intro */}
      <div className="max-w-3xl mb-16 md:mb-24">
        <Eyebrow>About JourneyFertility</Eyebrow>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-ink mb-6 leading-tight">
          Fertility care is hard enough. Finding it shouldn't be.
        </h1>
        <p className="text-lg md:text-xl text-muted-ink leading-relaxed">
          People researching fertility treatment are usually doing it at a difficult moment, with
          incomplete information and prices that are almost impossible to compare. JourneyFertility
          is a non-profit that exists to make that part simpler — so the energy goes into the decision, not the admin.
        </p>
      </div>

      {/* Why we exist */}
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16 md:mb-24">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-5">
            Why we built this
          </h2>
          <div className="space-y-4 text-muted-ink leading-relaxed">
            <p>
              Fertility pricing is genuinely opaque. Clinics quote different things under the same
              word, medication is billed separately, storage runs for years, and success rates are
              published in formats that resist comparison.
            </p>
            <p>
              An industry has grown up around that confusion. Supplements, trackers, premium
              packages, bold promises — a great deal of it priced to your anxiety rather than to its
              evidence. When something feels this urgent, it is easy to spend a lot of money quickly.
            </p>
            <p>
              The result is that people make one of the most significant decisions of their lives
              with less information than they would have buying a flight.
            </p>
            <p>
              You should not have to break the bank to take your fertility seriously. A great deal
              of what actually matters — baseline bloods, hormone monitoring, understanding your own
              cycle — is available through your national health service. We will show you what you
              can ask for, and how to keep track of it, without paying anyone extra.
            </p>
            <p>
              So this is your space to research and compare, at your own pace, before anybody asks
              you for a decision. Not to be told what to choose — just to see the options clearly,
              in one place, with the costs shown in full.
            </p>
          </div>
        </div>

        <div className="glass rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-ink mb-5">How we're funded</h3>
          <div className="space-y-4 text-muted-ink leading-relaxed text-sm">
            <p>
              JourneyFertility is completely non-profit. We take no fees from clinics. If it helps
              you, you can support it with a{' '}
              <Link to="/donate" className="hit-area font-semibold text-peach-deep underline underline-offset-2">
                donation
              </Link>
              .
            </p>
            <p>
              Clinics cannot pay for a higher position, a better rating, or to have a competitor
              hidden. If that ever changes, it will be stated plainly on this page.
            </p>
            {SHOW_JOURNEY_AI && (
            <>
            <p>
              We are also building <span className="font-semibold text-ink">Journey AI</span>,
              a companion for the practical side of treatment. Wherever you are — freezing, IVF, or
              still working out the question — it keeps track of the things that are easy to lose
              hold of: your prescribed doses and injection timings, what happens next, and what to
              ask at your next appointment.
            </p>
            {SHOW_JOURNEY_AI_PRICE && <p>
              Journey AI will be{' '}
              <span className="font-semibold text-ink">£3 a month</span>. Everything you see
              here — the search, the comparisons, the guides — stays free.
            </p>}
            </>
            )}
            <p>
              We say this openly because a comparison site that will not explain its incentives is
              not much of a comparison site.
            </p>
          </div>
        </div>
      </div>

      {/* Non-profit */}
      <section className="glass rounded-2xl p-8 md:p-10 mb-16 md:mb-24 max-w-3xl" aria-labelledby="nonprofit-heading">
        <Eyebrow>Non-profit</Eyebrow>
        <h2 id="nonprofit-heading" className="text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-4">
          A non-profit, not a business selling treatment
        </h2>
        <p className="text-muted-ink leading-relaxed">
          {SITE.nonprofitForm}. We take no fees from clinics for placement.
        </p>
      </section>

      {/* Principles */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-8">
          What we hold ourselves to
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="glass rounded-2xl p-6">
                <div className="w-11 h-11 rounded-full bg-sky/60 flex items-center justify-center text-peach-deep mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2">{p.title}</h3>
                <p className="text-sm text-muted-ink leading-relaxed">{p.body}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Founder and team */}
      <section className="mb-16 md:mb-24" aria-labelledby="team-heading">
        <h2 id="team-heading" className="text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-8">
          Who&rsquo;s behind this
        </h2>

        <div className="glass rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 mb-10 max-w-3xl">
          {/* Photo placeholder until Ida supplies a photograph. */}
          <div
            className="shrink-0 w-28 h-28 rounded-full bg-sky flex items-center justify-center text-muted-ink"
            role="img"
            aria-label={`Photo of ${SITE.founder} to come`}
          >
            <UserRound className="w-10 h-10" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-ink">{SITE.founder}</h3>
            <p className="text-sm font-semibold text-peach-deep mb-3">Founder</p>
            <p className="text-muted-ink leading-relaxed mb-3">{SITE.founderBio}</p>
            {linkedInIsReal ? (
              <a
                href={SITE.founderLinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-11 text-sm font-semibold text-peach-deep underline underline-offset-2"
              >
                {SITE.founder} on LinkedIn
              </a>
            ) : (
              <p className="text-sm text-muted-ink">LinkedIn: {SITE.founderLinkedIn}</p>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-ink mb-2">The founding team</h3>
        <p className="text-muted-ink leading-relaxed max-w-2xl mb-8">
          A small founding team, building the service we wanted when we were doing this research
          ourselves. The rest of the team describe themselves by what they do here; their names will
          follow when they&rsquo;re ready to put them to it.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEAM.map((t, i) => {
            const Icon = t.icon;
            return (
              <div key={t.role} className="glass rounded-2xl p-6">
                {/* Discipline icon on a brand gradient — no invented name, never a stock face. */}
                <div
                  className={`grain relative w-20 h-20 rounded-full overflow-hidden mb-5 flex items-center justify-center bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]}`}
                  aria-hidden="true"
                >
                  <Icon className="w-8 h-8 text-white/95" strokeWidth={1.75} />
                </div>
                <h4 className="text-lg font-semibold text-ink">{t.role}</h4>
                <p className="text-sm text-muted-ink leading-relaxed mt-3">{t.bio}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Medical position */}
      <div className="glass-tint rounded-2xl p-8 md:p-10 mb-16 md:mb-24 max-w-3xl">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-ink mb-4">
          Where we stop
        </h2>
        <div className="space-y-4 text-muted-ink leading-relaxed">
          <p>
            We are not a clinic and we do not give medical advice. Everything on JourneyFertility —
            including our guides — is general information to help you ask better questions.
          </p>
          <p>
            Decisions about your treatment belong with you and a qualified clinician who knows your
            history. We are here for the part before that: working out who to talk to, and what it
            will cost.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-4">
          Start wherever you are
        </h2>
        <p className="text-muted-ink leading-relaxed mb-7">
          Whether you are comparing clinics seriously or just beginning to wonder about your
          options, there is no wrong entry point.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/search?service=egg_freezing"
            className="inline-flex items-center justify-center rounded-md bg-blush hover:bg-peach text-ink font-semibold px-8 h-12"
          >
            Compare clinics
          </Link>
          <Link
            to="/resources"
            className="inline-flex items-center justify-center rounded-md glass border border-white/70 text-ink hover:bg-white/75 h-12 px-8 font-medium"
          >
            Read the guides
          </Link>
        </div>
      </div>
    </div>
  );
}
