import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eyebrow } from '../components/SiteChrome';
import { SelfAssessmentQuiz } from '../components/SelfAssessmentQuiz';
import { FaqList } from './HomePage';
import { FAQS, SITE, isPlaceholder } from '../lib/site';
import { FROM_LEGACY } from '../lib/search';

function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | JourneyFertility`;
  }, [title]);
}

function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-3xl mb-10">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink mb-5">{title}</h1>
      {children && <div className="text-lg text-muted-ink leading-relaxed">{children}</div>}
    </div>
  );
}

/** Marks text that still needs Ida's review before it can be relied on. */
function ReviewNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5 mb-10 text-sm text-muted-ink leading-relaxed max-w-3xl">
      <span className="font-semibold text-peach-deep">Before publishing:</span> {children}
    </div>
  );
}

export function TermsPage() {
  usePageTitle('Terms of service');
  return (
    <div>
      <PageIntro eyebrow="Legal" title="Terms of service" />
      <ReviewNote>the full terms of service have not been written yet. Only the two statements below are in place.</ReviewNote>
      <div className="max-w-3xl space-y-4 text-muted-ink leading-relaxed">
        <p>
          {SITE.name} is a {SITE.descriptor}, not a clinic. Nothing here is medical advice. Always discuss treatment
          decisions with your GP or a fertility specialist.
        </p>
      </div>
    </div>
  );
}

export function CompanyPage() {
  usePageTitle('Company details');
  const rows: [string, string][] = [
    ['Legal name', SITE.legalEntity],
    ['Non-profit form', SITE.companyForm],
    ['Founder', SITE.founder],
    ['Registered address', SITE.registeredAddress],
    ['Contact email', SITE.contactEmail],
  ];
  return (
    <div>
      <PageIntro eyebrow="Company" title="Company details">
        {SITE.name} is a {SITE.descriptor}, founded by {SITE.founder}.
      </PageIntro>
      <dl className="glass rounded-2xl p-6 md:p-8 max-w-3xl divide-y divide-ink/10">
        {rows.map(([label, value]) => (
          <div key={label} className="py-3 grid sm:grid-cols-3 gap-1">
            <dt className="text-sm font-semibold text-ink">{label}</dt>
            <dd className="sm:col-span-2 text-muted-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ContactPage() {
  usePageTitle('Contact us');
  const emailIsReal = !isPlaceholder(SITE.contactEmail);
  return (
    <div>
      <PageIntro eyebrow="Support" title="Contact us">
        We&rsquo;re a small non-profit, so email is the best way to reach us.
      </PageIntro>
      <div className="glass rounded-2xl p-6 md:p-8 max-w-3xl space-y-3 text-muted-ink leading-relaxed">
        <p>
          Email:{' '}
          {emailIsReal ? (
            <a href={`mailto:${SITE.contactEmail}`} className="font-semibold text-peach-deep underline underline-offset-2">
              {SITE.contactEmail}
            </a>
          ) : (
            <span className="font-semibold text-ink">{SITE.contactEmail}</span>
          )}
        </p>
        <p>
          We can&rsquo;t give medical advice. For questions about your own fertility or treatment, please speak to your
          GP or a fertility specialist.
        </p>
        <p>
          Many questions are answered in our{' '}
          <Link to="/faqs" className="font-semibold text-peach-deep underline underline-offset-2">
            FAQs
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export function FaqsPage() {
  usePageTitle('FAQs and support');
  const [open, setOpen] = useState<Record<number, boolean>>({});
  return (
    <div>
      <PageIntro eyebrow="Support" title="FAQs and support" />
      <FaqList faqs={FAQS} open={open} onToggle={(i) => setOpen((p) => ({ ...p, [i]: !p[i] }))} />
      <p className="mt-8 text-muted-ink">
        Can&rsquo;t find your answer?{' '}
        <Link to="/contact" className="font-semibold text-peach-deep underline underline-offset-2">
          Contact us
        </Link>
        .
      </p>
    </div>
  );
}

/** The private self-assessment as its own page. Answers stay in the browser. */
export function SelfAssessmentPage() {
  usePageTitle('Self-assessment');
  const navigate = useNavigate();
  const close = () => (window.history.length > 1 ? navigate(-1) : navigate('/'));
  return (
    <div className="min-h-[60vh]">
      <PageIntro eyebrow="Self-assessment" title="A few questions to find your starting point">
        Private: your answers stay in your browser and nothing is saved or sent.
      </PageIntro>
      <SelfAssessmentQuiz
        onClose={close}
        onPick={(service) => navigate(`/search?service=${FROM_LEGACY[service]}`)}
        onResources={() => navigate('/resources')}
      />
    </div>
  );
}

export function NotFoundPage() {
  usePageTitle('Page not found');
  return (
    <div className="max-w-2xl">
      <PageIntro eyebrow="Not found" title="We can’t find that page">
        It may have moved. Try the home page or the guides.
      </PageIntro>
      <div className="flex flex-wrap gap-4">
        <Link to="/" className="inline-flex items-center min-h-11 font-semibold text-peach-deep underline underline-offset-2">
          Go to the home page
        </Link>
        <Link to="/resources" className="inline-flex items-center min-h-11 font-semibold text-peach-deep underline underline-offset-2">
          Read the guides
        </Link>
      </div>
    </div>
  );
}
