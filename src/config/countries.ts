/**
 * Countries whose official guidance the site follows. Only add a country once its guidance has
 * actually been reviewed: the footer and every guide page say what is listed here.
 */

export interface GuidelineSource {
  body: string;
  title: string;
  url: string;
}

export interface CountryGuidance {
  code: string;
  name: string;
  live: boolean;
  sources: GuidelineSource[];
  /** When the guidance on the site was last checked against these sources. */
  lastReviewed: string;
}

export const COUNTRIES: CountryGuidance[] = [
  {
    code: 'GB',
    name: 'United Kingdom',
    live: true,
    sources: [
      {
        body: 'NICE',
        title: 'Fertility problems: assessment and treatment (NG257)',
        url: 'https://www.nice.org.uk/guidance/ng257',
      },
      {
        body: 'HFEA',
        title: 'Human Fertilisation and Embryology Authority',
        url: 'https://www.hfea.gov.uk/',
      },
    ],
    lastReviewed: '{{date}}',
  },
];

export const LIVE_COUNTRIES = COUNTRIES.filter((c) => c.live);
export const UK_GUIDANCE = COUNTRIES.find((c) => c.code === 'GB')!;
