import type { SearchService } from './search';

/**
 * How to use the NHS for each service. Every statement comes from the sources listed with it;
 * re-check them when NICE or HFEA guidance changes, and update NHS_REVIEWED.
 */

export interface Source {
  label: string;
  url: string;
}

export const NHS_SOURCES = {
  niceIvf: {
    label: 'NICE NG257: access criteria for IVF (March 2026)',
    url: 'https://www.nice.org.uk/guidance/ng257/chapter/Access-criteria-for-in-vitro-fertilisation-IVF',
  },
  niceAssessment: {
    label: 'NICE NG257: defining infertility and initial assessment (March 2026)',
    url: 'https://www.nice.org.uk/guidance/ng257/chapter/Defining-infertility-and-initial-assessment',
  },
  nicePreservation: {
    label: 'NICE NG257: fertility preservation for medical reasons (March 2026)',
    url: 'https://www.nice.org.uk/guidance/ng257/chapter/Fertility-preservation-for-medical-indications',
  },
  hfeaFunding: {
    label: 'HFEA: costs and funding',
    url: 'https://www.hfea.gov.uk/treatments/explore-all-treatments/costs-and-funding/',
  },
  hfeaEggFreezing: {
    label: 'HFEA: egg freezing factsheet (reviewed June 2026)',
    url: 'https://www.hfea.gov.uk/about-us/media-centre/egg-freezing-a-factsheet/',
  },
  nhsIvf: {
    label: 'NHS: IVF',
    url: 'https://www.nhs.uk/tests-and-treatments/ivf/',
  },
} satisfies Record<string, Source>;

/** When the content below was last checked against its sources. */
export const NHS_REVIEWED = '17 November 2026';

export interface NhsGuide {
  /** One-line answer to "can I get this on the NHS?" */
  summary: string;
  points: string[];
  howToStart: string;
  sources: Source[];
}

export const NHS_GENERAL: NhsGuide = {
  summary: 'What the NHS funds depends on where you live.',
  points: [
    'In England, local Integrated Care Boards (ICBs) decide who can have NHS fertility treatment and how much. Scotland, Wales and Northern Ireland each make their own decisions.',
    'Some areas fund up to three IVF cycles, others one, and some none.',
    'Local boards can add their own conditions, for example an age limit, a healthy weight, not smoking, or not already having children.',
    'If your treatment is NHS funded, you still pay prescription charges for medicines unless you are exempt.',
    'NICE updated its fertility guideline in March 2026. Local policies are set separately and may not match it yet.',
  ],
  howToStart:
    'Start with your GP, who can tell you what is available in your area. In England you can also look up your ICB’s fertility policy online.',
  sources: [NHS_SOURCES.hfeaFunding, NHS_SOURCES.nhsIvf],
};

export const NHS_BY_SERVICE: Record<SearchService, NhsGuide> = {
  fertility_testing: {
    summary: 'Most people can have some fertility testing on the NHS.',
    points: [
      'If you have not got pregnant after 1 year of regular unprotected vaginal sex, NICE says you and your partner should be offered tests and an assessment. If you are using artificial insemination, this applies after 6 cycles.',
      'If you are 36 or over, or either of you has a known or suspected cause of fertility problems, NICE says you should be offered a referral to a specialist straight away.',
      'These NHS criteria are for people trying to get pregnant. If you are not trying yet and want to check, private clinic and at-home tests are compared on this site.',
    ],
    howToStart: 'Book an appointment with your GP and say how long you have been trying.',
    sources: [NHS_SOURCES.niceAssessment, NHS_SOURCES.hfeaFunding],
  },
  egg_freezing: {
    summary: 'The NHS does not fund egg freezing for non-medical reasons.',
    points: [
      'Freezing your eggs to keep your options open is not NHS funded, so it is self-funded at a private clinic.',
      'If you are about to have medical treatment that is likely to affect your fertility, such as cancer treatment, NICE says egg or embryo freezing should be offered, and the usual NHS age and eligibility rules do not apply. Funding can depend on where you live.',
      'NICE says NHS-funded storage should be reviewed at least every 5 years and continued while you remain at significant risk of infertility.',
      'When you later come to use frozen eggs, the usual NHS eligibility rules for fertility treatment apply.',
    ],
    howToStart:
      'If you are facing medical treatment, ask the doctor planning it, or your GP, for a fertility preservation referral. NICE says this referral should be fast-tracked.',
    sources: [NHS_SOURCES.hfeaEggFreezing, NHS_SOURCES.nicePreservation, NHS_SOURCES.niceAssessment],
  },
  embryo_freezing: {
    summary: 'On the NHS, embryo freezing is part of medical fertility preservation or an IVF cycle.',
    points: [
      'If you are about to have medical treatment that is likely to affect your fertility, NICE says egg or embryo freezing should be offered, without the usual NHS age and eligibility rules.',
      'A full NHS IVF cycle includes one round of ovarian stimulation and the transfer of any fresh and frozen embryos from it, so embryos frozen during a funded cycle are part of that cycle.',
      'We have not found an NHS route for freezing embryos for non-medical reasons. Ask your GP or check your local policy.',
    ],
    howToStart:
      'If you are facing medical treatment, ask for a fertility preservation referral. Otherwise, start with your GP about NHS IVF.',
    sources: [NHS_SOURCES.nicePreservation, NHS_SOURCES.niceIvf],
  },
  ivf: {
    summary: 'NICE recommends NHS IVF if you are under 42 and meet its criteria. Your local NHS decides what it funds.',
    points: [
      'NICE recommends IVF if you have not reached your 42nd birthday and either: there is a diagnosed cause and other treatments are not suitable or have not worked; or you have not got pregnant after 2 years of regular unprotected vaginal sex; or you have not got pregnant after 12 cycles of artificial insemination, at least 6 of them IUI.',
      'Under 40: NICE recommends 3 full cycles, with up to 3 more considered after that. Any cycles you paid for yourself count towards the total.',
      'Aged 40 or 41, if you have not had IVF before: NICE recommends 1 full cycle.',
      'A full cycle is one round of ovarian stimulation plus the transfer of any fresh and frozen embryos from it.',
      'Your local NHS decides what it actually funds, and many areas offer fewer cycles or add conditions.',
    ],
    howToStart: 'Speak to your GP, who can refer you and tell you what is funded where you live.',
    sources: [NHS_SOURCES.niceIvf, NHS_SOURCES.hfeaFunding, NHS_SOURCES.nhsIvf],
  },
};
