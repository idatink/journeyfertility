/**
 * Who we are, in one place. Every {{placeholder}} below is shown on the site as written until
 * Ida supplies the real value; never fill one with a guess.
 */
export const SITE = {
  name: 'JourneyFertility',
  url: 'https://journeyfertility.com',
  founder: 'Ida Tinker',
  descriptor: 'non-profit fertility guide and clinic comparison',
  researchCount: '{{number}}',
  researchWhen: '{{, conducted in month year}}',
  founderReason: '{{one-line reason}}',
  founderBio: '{{bio}}',
  founderLinkedIn: '{{LinkedIn}}',
  nonprofitForm: '{{legal form and number}}',
  nonprofitStatus: '{{status}}',
  legalEntity: '{{legal entity}}',
  companyForm: '{{CIC / charity / other, with number}}',
  registeredAddress: '{{address}}',
  contactEmail: '{{email}}',
  researchMethod: '{{number of participants, method, dates}}',
  researchFindings: ['{{finding 1}}', '{{finding 2}}', '{{finding 3}}', '{{finding 4}}'],
} as const;

/** True for a value that is still a {{placeholder}}. */
export const isPlaceholder = (value: string) => /\{\{.*\}\}/.test(value);

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: 'How does JourneyFertility work?',
    answer:
      'We break clinic quotes into their real line items — treatment, medication, storage and extras — so you can compare like with like. Search by treatment, location and budget, then see the full cost of each option in one place.',
  },
  {
    question: 'How can I find the most affordable fertility clinic using JourneyFertility?',
    answer:
      'Filter by treatment, region and budget, and compare the full all-in cost of each clinic — including medication, storage and extras, not just the headline fee.',
  },
  {
    question: 'Do I book my treatment directly with JourneyFertility?',
    answer:
      'No — we are a non-profit comparison service, not a clinic. When you are ready, you send an enquiry through us and the clinic you chose gets in touch to arrange a consultation. The treatment itself is always booked and provided by the clinic.',
  },
  {
    question: 'Can I use NHS funding for fertility treatment?',
    answer:
      'Sometimes. NHS-funded fertility treatment exists but eligibility and how many cycles are covered vary by area. Where a clinic offers an NHS-funded route we flag it with the funding filter, so you can compare that alongside private prices.',
  },
  {
    question: 'What should my fees cover?',
    answer:
      'We show you a complete breakdown of costs including consultation, procedures, medications, storage fees, and any additional services.',
  },
  {
    question: 'What is a Success Rate?',
    answer:
      'Success rates show the percentage of successful pregnancies or viable embryos from treatments at each clinic. We provide transparent data to help you make informed choices.',
  },
  {
    question: 'Where do the prices and success rates come from?',
    answer:
      "Prices come from each clinic's own published price list where they publish one; clinics that don't publish show 'request a quote' rather than a made-up figure, and medications are always quoted separately. For success rates we link to each clinic's verified results on the HFEA register — the UK regulator's own figures — rather than reproduce them ourselves.",
  },
];

/**
 * Footer and header links. `live: false` hides a link to a page that does not exist or does not
 * work yet; flip it once the page is real.
 */
export interface NavLink {
  label: string;
  to: string;
  live: boolean;
}

export const FOOTER_NAV: { heading: string; links: NavLink[] }[] = [
  {
    heading: 'Support',
    links: [
      { label: 'FAQs & support', to: '/faqs', live: true },
      { label: 'Contact us', to: '/contact', live: true },
      { label: 'Log in', to: '/sign-in', live: false },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy policy', to: '/privacy', live: true },
      { label: 'Terms of service', to: '/terms', live: true },
      { label: 'Company details', to: '/company', live: true },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About us', to: '/about', live: true },
      { label: 'Careers', to: '/careers', live: false },
      { label: 'Partner clinics', to: '/partner-clinics', live: false },
    ],
  },
  {
    heading: 'Explore',
    links: [
      { label: 'Resources', to: '/resources', live: true },
      { label: 'Partnerships', to: '/partnerships', live: false },
    ],
  },
];

export const HEADER_NAV: NavLink[] = [
  { label: 'About', to: '/about', live: true },
  { label: 'Resources', to: '/resources', live: true },
  { label: 'Sign in', to: '/sign-in', live: false },
];
