/**
 * A short "what it is / how it works" explainer for each service. Shown as the
 * learn-more step above the comparison, so someone who lands from a life-stage
 * prompt understands the option before they start comparing. The steps are a
 * real sequence, so they are numbered.
 *
 * Fertility testing has its own richer explainer component (HowTrackingWorks),
 * so the entry here is used for the search form; the results view leads with
 * HowTrackingWorks instead.
 */
export interface ServiceExplainerContent {
  title: string;
  lede: string;
  steps: { h: string; p: string }[];
  note: string;
}

export const SERVICE_EXPLAINERS: Record<string, ServiceExplainerContent> = {
  fertility: {
    title: 'What a fertility check tells you',
    lede:
      "A fertility check is a snapshot of your reproductive health — usually a simple blood test, often with an ultrasound scan. It won't tell you whether you can have children, but it tells you where you stand now, so you can plan with facts instead of guesswork.",
    steps: [
      {
        h: 'A blood test',
        p: 'Measures key hormones — including AMH, a marker of how many eggs you have left, plus FSH and others that show how your ovaries are working.',
      },
      {
        h: 'An ultrasound scan',
        p: 'Counts your antral follicles — the small resting follicles that give a second read on your egg reserve.',
      },
      {
        h: 'Your results, explained',
        p: 'Together these estimate your ovarian reserve. A clinic — or an at-home kit — walks you through what the numbers mean for your own timeline.',
      },
    ],
    note: 'Testing is the usual first step before deciding on egg freezing or IVF. You can start with an at-home kit or book directly with a clinic.',
  },
  'egg-freezing': {
    title: 'How egg freezing works',
    lede:
      'Egg freezing preserves unfertilised eggs so you can try to use them later. It keeps your options open — it is not a guarantee, and how well it works depends a lot on your age when you freeze.',
    steps: [
      {
        h: 'Stimulation (about 2 weeks)',
        p: 'Daily hormone injections encourage your ovaries to mature several eggs in one cycle, with a few short monitoring scans along the way.',
      },
      {
        h: 'Egg collection',
        p: 'A short procedure under sedation collects the mature eggs — usually around 15–20 minutes.',
      },
      {
        h: 'Freezing & storage',
        p: 'The eggs are frozen (vitrified) and stored. You pay an annual storage fee, and thaw them if and when you are ready.',
      },
    ],
    note: 'A fertility check first tells you how many eggs you are likely to collect, which shapes whether freezing is worth it for you now.',
  },
  ivf: {
    title: 'How IVF works',
    lede:
      'IVF fertilises eggs with sperm in a lab, then places an embryo back in the womb. It is the most established fertility treatment, and success rates vary sharply with age.',
    steps: [
      {
        h: 'Stimulation & collection',
        p: 'Hormones mature several eggs over about two weeks; a short procedure then collects them.',
      },
      {
        h: 'Fertilisation in the lab',
        p: 'Eggs and sperm are combined (or a single sperm injected — ICSI), and the resulting embryos are grown for a few days.',
      },
      {
        h: 'Embryo transfer',
        p: 'One embryo is transferred to the womb; any others can be frozen for later.',
      },
    ],
    note: 'Clinics publish success rates by age with the HFEA — we link you to each clinic’s verified results.',
  },
  embryo: {
    title: 'How embryo freezing works',
    lede:
      'Embryo freezing follows the same path as IVF, but instead of transferring an embryo now, the embryos are frozen and stored for the future — often chosen by couples preserving together.',
    steps: [
      { h: 'Stimulation & collection', p: 'Hormones mature eggs; a short procedure collects them.' },
      { h: 'Fertilisation', p: 'The eggs are fertilised with sperm in the lab and grown into embryos.' },
      {
        h: 'Freezing & storage',
        p: 'The embryos are frozen and stored, ready to transfer when the time is right.',
      },
    ],
    note: 'Keeping an eye on your hormones over time helps you choose the right moment.',
  },
};
