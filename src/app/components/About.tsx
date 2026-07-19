import { ArrowLeft, Search, Scale, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Button } from './ui/button';

interface AboutProps {
  onBack: () => void;
  onExplore: () => void;
  onResources: () => void;
}

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
    body: 'Egg freezing, embryo freezing, IVF and fertility testing — at home and abroad — in a single place, so you are not rebuilding your research for each clinic.',
  },
  {
    icon: HeartHandshake,
    title: 'No pressure, ever',
    body: 'We are a comparison service, not a clinic. We do not sell treatment, and nothing here is designed to rush a decision that deserves time.',
  },
];

export function About({ onBack, onExplore, onResources }: AboutProps) {
  return (
    <div>
      <Button variant="ghost" className="mb-8 -ml-3" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      {/* Intro */}
      <div className="max-w-3xl mb-16 md:mb-24">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5B6AA5] mb-4">
          About JourneyFertility
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#2F3440] mb-6 leading-tight">
          Fertility care is hard enough. Finding it shouldn't be.
        </h1>
        <p className="text-lg md:text-xl text-[#5C6478] leading-relaxed">
          People researching fertility treatment are usually doing it at a difficult moment, with
          incomplete information and prices that are almost impossible to compare. JourneyFertility
          exists to make that part simpler — so the energy goes into the decision, not the admin.
        </p>
      </div>

      {/* Why we exist */}
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16 md:mb-24">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#2F3440] mb-5">
            Why we built this
          </h2>
          <div className="space-y-4 text-[#5C6478] leading-relaxed">
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
          <h3 className="text-lg font-semibold text-[#2F3440] mb-5">How we make money</h3>
          <div className="space-y-4 text-[#5C6478] leading-relaxed text-sm">
            <p>
              We earn a referral fee when someone books a consultation through the platform. That
              fee is the same across every clinic we work with.
            </p>
            <p>
              Clinics cannot pay for a higher position, a better rating, or to have a competitor
              hidden. If that ever changes, it will be stated plainly on this page.
            </p>
            <p>
              We are also building <span className="font-semibold text-[#2F3440]">Journey AI</span>,
              a companion for the practical side of treatment. Wherever you are — freezing, IVF, or
              still working out the question — it keeps track of the things that are easy to lose
              hold of: your prescribed doses and injection timings, what happens next, and what to
              ask at your next appointment.
            </p>
            <p>
              Journey AI will be{' '}
              <span className="font-semibold text-[#2F3440]">£3 a month</span>. Everything you see
              here — the search, the comparisons, the guides — stays free.
            </p>
            <p>
              We say this openly because a comparison site that will not explain its incentives is
              not much of a comparison site.
            </p>
          </div>
        </div>
      </div>

      {/* Principles */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#2F3440] mb-8">
          What we hold ourselves to
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="glass rounded-2xl p-6">
                <div className="w-11 h-11 rounded-full bg-[#DEE8FF]/60 flex items-center justify-center text-[#5B6AA5] mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#2F3440] mb-2">{p.title}</h3>
                <p className="text-sm text-[#5C6478] leading-relaxed">{p.body}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Medical position */}
      <div className="glass-tint rounded-2xl p-8 md:p-10 mb-16 md:mb-24 max-w-3xl">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2F3440] mb-4">
          Where we stop
        </h2>
        <div className="space-y-4 text-[#5C6478] leading-relaxed">
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
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#2F3440] mb-4">
          Start wherever you are
        </h2>
        <p className="text-[#5C6478] leading-relaxed mb-7">
          Whether you are comparing clinics seriously or just beginning to wonder about your
          options, there is no wrong entry point.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold px-8 h-12"
            onClick={onExplore}
          >
            Compare clinics
          </Button>
          <Button
            variant="outline"
            className="glass border-white/70 text-[#2F3440] hover:bg-white/75 h-12 px-8"
            onClick={onResources}
          >
            Read the guides
          </Button>
        </div>
      </div>
    </div>
  );
}
