import { useEffect } from 'react';
import { Eyebrow } from './SiteChrome';

/**
 * Written to match what the system actually does. If the processing changes,
 * this changes with it — a notice that describes something other than the real
 * behaviour is worse than none, because consent given against it is not
 * informed.
 */
export function PrivacyNotice() {
  useEffect(() => {
    document.title = 'Privacy policy | JourneyFertility';
  }, []);
  return (
    <div className="max-w-3xl">
      <Eyebrow>Privacy</Eyebrow>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink mb-5">
        How we handle your information
      </h1>
      <p className="text-lg text-muted-ink leading-relaxed mb-4">
        Fertility is private. This page explains exactly what we collect, why, who sees it and how
        to get rid of it — in plain terms, without the usual padding.
      </p>
      <p className="text-sm text-muted-ink mb-12">Last updated 17 November 2026</p>

      <div className="glass rounded-2xl p-5 mb-12 text-sm text-muted-ink leading-relaxed">
        <span className="font-semibold text-peach-deep">Before publishing:</span> the operator must
        complete the entries marked <span className="font-semibold">[to confirm]</span> — registered
        company details, ICO registration and the contact address for privacy requests. Sections
        marked <span className="font-semibold">[draft for review]</span> are new and need checking
        before they are relied on.
      </div>

      <div className="space-y-10 text-muted-ink leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-ink mb-3">Who we are</h2>
          <p>
            JourneyFertility is a non-profit comparison service. We are not a clinic and we do not provide
            medical care. The data controller is{' '}
            <span className="font-semibold text-ink">[to confirm: registered company name and number]</span>,
            registered with the Information Commissioner&rsquo;s Office under{' '}
            <span className="font-semibold text-ink">[to confirm]</span>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-ink mb-3">
            When you browse
          </h2>
          <p className="mb-3">
            You can search and compare clinics without telling us who you are. We do not ask you to
            sign in, and we do not set advertising or analytics cookies.
          </p>
          <p className="mb-3">
            If you use the self-assessment, your answers stay in your browser and are never sent to
            us. Closing the tab discards them.
          </p>
          <p>
            Everything on the page — the typeface, the images, the code — is served from us. No
            third party is contacted when you browse, so nobody else learns that you visited a
            fertility site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-ink mb-3">
            When you search{' '}
            <span className="text-sm font-semibold text-peach-deep align-middle">[draft for review]</span>
          </h2>
          <p className="mb-3">
            When you search, your browser asks our server for the clinics that match the filters you
            chose: the treatment, and any region, clinic or budget. The search is not linked to your
            name or an account, and we do not save it.
          </p>
          <p>
            The clinic list is held in a database run by our hosting provider, Netlify. Like any web
            host, Netlify records standard request logs, which include your IP address and the page or
            search requested, for{' '}
            <span className="font-semibold text-ink">[to confirm: Netlify log retention period]</span>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-ink mb-3">
            If you donate{' '}
            <span className="text-sm font-semibold text-peach-deep align-middle">[draft for review]</span>
          </h2>
          <p>
            Donations are taken by{' '}
            <span className="font-semibold text-ink">[to confirm: donation platform]</span>, not by
            us. When you follow a donate link you leave this site, and the platform handles your
            payment under its own privacy notice. We never see your card details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-ink mb-3">
            Your rights{' '}
            <span className="text-sm font-semibold text-peach-deep align-middle">[draft for review]</span>
          </h2>
          <p className="mb-3">
            We do not ask for your name, email or any health information, and we hold no personal
            information about you beyond the hosting logs described above.
          </p>
          <p>
            If you have a question about your information, email{' '}
            <span className="font-semibold text-ink">[to confirm: privacy@ address]</span>. We reply
            within one month. There is no charge.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-ink mb-3">
            Where your data is held
          </h2>
          <p>
            We list UK clinics only. Our search and the clinic database run in London, in the UK{' '}
            <span className="font-semibold text-ink">[to confirm once the site is deployed]</span>. If
            we ever need to send your information outside the UK, we will tell you and put the
            required safeguards in place first.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-ink mb-3">Complaints</h2>
          <p>
            Tell us first and we will try to put it right. You also have the right to complain to the
            Information Commissioner&rsquo;s Office at{' '}
            <a
              href="https://ico.org.uk/make-a-complaint/"
              target="_blank"
              rel="noopener noreferrer"
              className="hit-area font-semibold text-peach-deep hover:underline"
            >
              ico.org.uk
            </a>
            , or on 0303 123 1113.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-ink mb-3">Changes</h2>
          <p>
            If we change how we handle your information we will update this page and the date at the
            top.
          </p>
        </section>
      </div>
    </div>
  );
}
