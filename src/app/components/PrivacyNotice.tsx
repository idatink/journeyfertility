import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { RETENTION_MONTHS } from '../lib/enquiry';

interface PrivacyNoticeProps {
  onBack: () => void;
}

/**
 * Written to match what the system actually does. If the processing changes,
 * this changes with it — a notice that describes something other than the real
 * behaviour is worse than none, because consent given against it is not
 * informed.
 */
export function PrivacyNotice({ onBack }: PrivacyNoticeProps) {
  return (
    <div className="max-w-3xl">
      <Button variant="ghost" className="mb-8 -ml-3" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5B6AA5] mb-4">
        Privacy
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#2F3440] mb-5">
        How we handle your information
      </h1>
      <p className="text-lg text-[#5C6478] leading-relaxed mb-4">
        Fertility is private. This page explains exactly what we collect, why, who sees it and how
        to get rid of it — in plain terms, without the usual padding.
      </p>
      <p className="text-sm text-[#5C6478] mb-12">Last updated 20 July 2026</p>

      <div className="glass rounded-2xl p-5 mb-12 text-sm text-[#5C6478] leading-relaxed">
        <span className="font-semibold text-[#B4762F]">Before publishing:</span> the operator must
        complete the entries marked <span className="font-semibold">[to confirm]</span> — registered
        company details, ICO registration and the contact address for privacy requests.
      </div>

      <div className="space-y-10 text-[#5C6478] leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[#2F3440] mb-3">Who we are</h2>
          <p>
            JourneyFertility is a comparison service. We are not a clinic and we do not provide
            medical care. The data controller is{' '}
            <span className="font-semibold text-[#2F3440]">[to confirm: registered company name and number]</span>,
            registered with the Information Commissioner&rsquo;s Office under{' '}
            <span className="font-semibold text-[#2F3440]">[to confirm]</span>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[#2F3440] mb-3">
            Browsing without enquiring
          </h2>
          <p className="mb-3">
            You can search and compare clinics without telling us who you are. We do not ask you to
            sign in, and we do not set advertising or analytics cookies.
          </p>
          <p className="mb-3">
            If you use a quiz, your answers stay in your browser and are never sent to us. Closing
            the tab discards them. If you save a cost breakdown, it is stored on your own device, not
            on our servers.
          </p>
          <p>
            Two things do load from other companies, which means those companies can see your IP
            address: our typeface comes from Google Fonts, and some photographs come from Unsplash.
            Neither receives anything about your search.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[#2F3440] mb-3">
            When you send an enquiry
          </h2>
          <p className="mb-4">
            Asking a clinic to contact you about fertility treatment says something about your
            health. The law treats that as sensitive, and so do we.
          </p>

          <h3 className="text-base font-semibold text-[#2F3440] mb-2">What we collect</h3>
          <ul className="list-disc pl-5 space-y-1 mb-5">
            <li>Your name and email address, and your phone number if you give one</li>
            <li>How you would like to be contacted</li>
            <li>Roughly when you hope to start, and whether you expect NHS or private funding</li>
            <li>Anything you choose to write in the message box</li>
            <li>Which clinic and treatment you enquired about, and when</li>
            <li>A record of the consents you gave, and the time you gave them</li>
          </ul>

          <h3 className="text-base font-semibold text-[#2F3440] mb-2">
            What we deliberately do not collect
          </h3>
          <p>
            We do not ask for your medical history, diagnoses, test results, medication or previous
            treatment — and our systems will not store them. The clinic can take those from you
            safely once you are in their care. Please leave them out of the message box.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[#2F3440] mb-3">
            Why we are allowed to use it
          </h2>
          <p className="mb-3">
            Your explicit consent, and nothing else. That is UK GDPR Article 6(1)(a) and, because it
            concerns health, Article 9(2)(a).
          </p>
          <p>
            Consent means you have to actively agree. Nothing is pre-ticked, and the optional
            marketing box is never a condition of sending your enquiry. You can withdraw consent at
            any time, and we will delete your enquiry when you do.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[#2F3440] mb-3">Who sees it</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-semibold text-[#2F3440]">The clinic you chose</span> — named on
              the consent screen before you send anything. We do not pass your enquiry to any other
              clinic, and we never sell your details.
            </li>
            <li>
              <span className="font-semibold text-[#2F3440]">Our hosting provider</span>, which
              stores the data on our behalf under a contract and cannot use it for anything else.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[#2F3440] mb-3">
            How long we keep it
          </h2>
          <p className="mb-3">
            {RETENTION_MONTHS} months from the day you send it, so we can follow up on the
            clinic&rsquo;s response. After that it is deleted automatically — this runs on a schedule
            rather than relying on someone remembering.
          </p>
          <p>
            When your enquiry is deleted we keep a record with no personal information in it — which
            clinic, which treatment, how far the enquiry got and on what dates — because that is how
            we invoice the clinic. It cannot be traced back to you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[#2F3440] mb-3">Your rights</h2>
          <p className="mb-3">You can ask us to:</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Give you a copy of what we hold about you</li>
            <li>Correct anything that is wrong</li>
            <li>Delete your enquiry, at any time and without giving a reason</li>
            <li>Send you your data in a portable format</li>
            <li>Stop using it, or restrict how we use it</li>
          </ul>
          <p className="mb-3">
            Email <span className="font-semibold text-[#2F3440]">[to confirm: privacy@ address]</span>{' '}
            with your enquiry reference. We reply within one month. There is no charge.
          </p>
          <p>
            Withdrawing consent does not undo what happened before you withdrew it — if the clinic
            has already contacted you, that contact is between you and them, and their own privacy
            notice covers it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[#2F3440] mb-3">
            Where your data is held
          </h2>
          <p>
            We list UK clinics and store data{' '}
            <span className="font-semibold text-[#2F3440]">[to confirm: hosting region]</span>. If we
            ever need to send your information outside the UK, we will tell you and put the required
            safeguards in place first.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[#2F3440] mb-3">Complaints</h2>
          <p>
            Tell us first and we will try to put it right. You also have the right to complain to the
            Information Commissioner&rsquo;s Office at{' '}
            <a
              href="https://ico.org.uk/make-a-complaint/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#5B6AA5] hover:underline"
            >
              ico.org.uk
            </a>
            , or on 0303 123 1113.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[#2F3440] mb-3">Changes</h2>
          <p>
            If we change how we handle your information we will update this page and the date at the
            top. Where the change is significant and we rely on your consent, we will ask again
            rather than assume.
          </p>
        </section>
      </div>
    </div>
  );
}
