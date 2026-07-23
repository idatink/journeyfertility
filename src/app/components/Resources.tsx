import { useState } from 'react';
import { ArrowLeft, Clock, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import eggFreezingCover from '../../assets/photos/resource-egg-freezing.jpg';
import embryoFreezingCover from '../../assets/photos/resource-embryo-freezing.jpg';
import ivfCover from '../../assets/photos/resource-ivf.jpg';
import fertilityTestingCover from '../../assets/photos/resource-fertility-testing.jpg';
import costsPlanningCover from '../../assets/photos/resource-costs-planning.jpg';

/**
 * One soft, abstract cover per category — a shared mood image rather than a
 * literal illustration. Deliberately no people and nothing clinical: on a
 * fertility page a calm gradient sets tone without attributing a condition to
 * anyone or implying a medical claim. Sources are recorded in ATTRIBUTIONS.md.
 */
const CATEGORY_COVERS: Record<string, string> = {
  'Egg Freezing': eggFreezingCover,
  'Embryo Freezing': embryoFreezingCover,
  IVF: ivfCover,
  'Fertility Testing': fertilityTestingCover,
  'Costs & Planning': costsPlanningCover,
};

interface ResourcesProps {
  onBack: () => void;
  initialCategory?: string;
}

export interface Article {
  id: string;
  title: string;
  category: 'Egg Freezing' | 'Embryo Freezing' | 'IVF' | 'Fertility Testing' | 'Costs & Planning';
  readTime: string;
  excerpt: string;
  sections: { heading: string; body: string[] }[];
}

export const ARTICLES: Article[] = [
  // ---------------------------------------------------------------- Egg Freezing
  {
    id: 'egg-freezing-true-cost',
    title: "What egg freezing actually costs — and what quotes leave out",
    category: 'Egg Freezing',
    readTime: '6 min',
    excerpt:
      "The headline price for a cycle is rarely the price you pay. Here's every line item to ask about before you commit, and the ones clinics most often quote separately.",
    sections: [
      {
        heading: 'The headline price is a starting point',
        body: [
          "Most clinics advertise a single figure for an egg freezing cycle. That number usually covers monitoring appointments, the retrieval procedure itself, and the anaesthetic. It rarely covers everything you will actually be billed for.",
          "When you compare two clinics, you are often comparing two different definitions of the word 'cycle'. That is why a clinic quoting less can end up costing more once the extras land.",
        ],
      },
      {
        heading: 'The items most often quoted separately',
        body: [
          "Stimulation medication is the big one. It is dose-dependent, so it varies by your protocol and your response, and it can move the total significantly. Ask for an estimated range rather than a single number.",
          "Then look for: initial consultation, baseline blood work and scans, the freezing (vitrification) step itself, and the first year of storage. Some clinics bundle the first year, others start billing immediately.",
          "Finally, ask what happens if a cycle is cancelled before retrieval — for example, if your response is lower than hoped. Some clinics refund part of the fee, some credit it toward a second attempt, some do neither.",
        ],
      },
      {
        heading: 'Storage is a recurring cost, not a one-off',
        body: [
          "Eggs are stored until you use them, and storage is billed annually. Over ten years this can become a meaningful share of the total, so factor it into the real cost rather than treating it as an afterthought.",
          "Ask whether the annual fee is fixed or index-linked, and what the clinic's policy is if you move country or transfer to another facility.",
        ],
      },
      {
        heading: 'Questions worth asking every clinic',
        body: [
          "What exactly is included in your quoted cycle fee? What is the realistic medication range for someone with my profile? What is the annual storage fee, and when does billing start? What happens financially if the cycle is cancelled? Are there discounts for multiple cycles?",
          "Getting these answers in writing makes two clinics genuinely comparable — which is the whole point of shopping around.",
        ],
      },
    ],
  },
  {
    id: 'how-many-eggs',
    title: 'How many eggs should you freeze? Making sense of the numbers',
    category: 'Egg Freezing',
    readTime: '7 min',
    excerpt:
      'Egg count targets are really probability estimates, and they shift a lot with age. A plain-language guide to what the numbers mean and why one cycle may not be enough.',
    sections: [
      {
        heading: 'Why there is no single right number',
        body: [
          "Not every frozen egg becomes a baby. Some do not survive thawing, some do not fertilise, some fertilise but do not develop into a viable embryo. The attrition at each step is normal and expected.",
          "So 'how many eggs should I freeze' is really 'how many eggs give me a reasonable chance of one live birth later' — and that depends heavily on your age at the time of freezing.",
        ],
      },
      {
        heading: 'Age is the dominant variable',
        body: [
          "Egg quality declines with age, and quality drives how many of those eggs survive the journey to a viable embryo. Someone freezing in their early thirties will generally need fewer eggs for the same chance than someone freezing at forty.",
          "This is why clinics quote different targets for different ages, and why the same number of eggs carries a different meaning depending on when they were frozen.",
        ],
      },
      {
        heading: 'One cycle often is not enough',
        body: [
          "Many people need more than one retrieval to reach their target, particularly if they start later or have a lower ovarian reserve. This matters financially: budget for the possibility of a second cycle rather than being blindsided by it.",
          "When comparing clinics, ask about multi-cycle packages. If there is a realistic chance you will need two, a package can change which clinic is actually cheaper.",
        ],
      },
      {
        heading: 'What to ask your clinic',
        body: [
          "Ask for a target egg number based on your own age and test results, not a generic figure. Ask how many cycles they would expect that to take for someone with your profile. Ask what their thaw survival and fertilisation rates are.",
          "A clinic that gives you a personalised range and explains the assumptions behind it is being more honest than one that quotes a single confident number.",
        ],
      },
    ],
  },
  {
    id: 'egg-freezing-timeline',
    title: 'Your egg freezing timeline: what a cycle actually looks like',
    category: 'Egg Freezing',
    readTime: '5 min',
    excerpt:
      'From first consultation to eggs in storage is usually a matter of weeks, not months. Here is how the time breaks down, and how much of it needs to be near the clinic.',
    sections: [
      {
        heading: 'Before the cycle starts',
        body: [
          "You will typically have a consultation and baseline testing — hormone blood work and an ultrasound to assess ovarian reserve. These results shape your medication protocol.",
          "Depending on where you are in your cycle, there may be a short wait before stimulation can begin.",
        ],
      },
      {
        heading: 'Stimulation and monitoring',
        body: [
          "Stimulation usually runs somewhere in the region of ten to twelve days, with daily injections. During this window you will have several monitoring appointments — scans and blood tests — so the clinic can track follicle development and adjust your dose.",
          "This is the part of the process that ties you to a location. If you are considering treatment abroad, this is the stretch that determines how long you need to be there.",
        ],
      },
      {
        heading: 'Trigger and retrieval',
        body: [
          "When the follicles are ready, you take a trigger injection at a precisely timed moment, with retrieval usually following around a day and a half later.",
          "Retrieval itself is a short procedure done under sedation. Most people take the rest of the day off and feel back to normal within a few days, though this varies.",
        ],
      },
      {
        heading: 'Freezing and storage',
        body: [
          "Mature eggs are frozen by vitrification, a rapid-freezing method, usually on the day of retrieval. The lab will tell you how many mature eggs were successfully frozen — this is the number that matters, not the total retrieved.",
          "From there they stay in storage until you choose to use them.",
        ],
      },
    ],
  },

  // ------------------------------------------------------------- Embryo Freezing
  {
    id: 'embryo-vs-egg',
    title: 'Embryo freezing or egg freezing: how to think about the choice',
    category: 'Embryo Freezing',
    readTime: '6 min',
    excerpt:
      'Embryos generally survive freezing better and give clearer information — but they involve a second party. The trade-offs are practical, legal and personal.',
    sections: [
      {
        heading: 'The core difference',
        body: [
          "Egg freezing preserves unfertilised eggs. Embryo freezing fertilises them with sperm first, then freezes the resulting embryos. That single step changes the outcomes, the information you get, and the legal picture.",
        ],
      },
      {
        heading: 'What embryos give you',
        body: [
          "Because fertilisation has already happened, you know how many eggs actually fertilised and how many developed. That removes a major unknown — with frozen eggs, you do not learn this until you thaw them, potentially years later.",
          "Embryos also tend to tolerate freezing and thawing well, and they can be genetically tested before transfer if that is appropriate for you.",
        ],
      },
      {
        heading: 'What embryos commit you to',
        body: [
          "An embryo involves sperm from a partner or a donor, and that brings consent and legal considerations. In many jurisdictions both parties must consent to future use, and that consent can usually be withdrawn.",
          "If you are freezing with a partner, it is worth understanding — before you start — what happens to the embryos if your circumstances change. Clinics should explain their consent framework, and it is reasonable to ask for it in writing.",
        ],
      },
      {
        heading: 'Who tends to choose which',
        body: [
          "People without a current partner who want to keep options open often choose eggs. Couples who are confident about building a family together, or who are already in an IVF cycle, more often freeze embryos.",
          "Some people do both. There is no universally correct answer — the right choice depends on your circumstances, and it is a conversation worth having with a clinician who knows your situation.",
        ],
      },
    ],
  },
  {
    id: 'after-unsuccessful-transfer',
    title: 'When an embryo transfer does not work: what happens next',
    category: 'Embryo Freezing',
    readTime: '6 min',
    excerpt:
      'An unsuccessful transfer is common and does not mean the next one will fail. What clinics typically review, and the questions worth asking before you try again.',
    sections: [
      {
        heading: 'It is more common than people expect',
        body: [
          "Transfers frequently do not result in a pregnancy, even with a good-quality embryo and everything apparently going right. This is one of the hardest parts of treatment precisely because it often has no clear explanation.",
          "A single unsuccessful transfer is not, on its own, a strong signal about your overall chances.",
        ],
      },
      {
        heading: 'What a clinic usually reviews',
        body: [
          "Most clinics will look again at embryo quality and grading, the condition and thickness of the uterine lining, the timing of the transfer, and your medication protocol.",
          "After more than one unsuccessful transfer they may suggest further investigation — for example, looking at the uterine cavity, immune or clotting factors, or genetic testing of embryos. What is appropriate depends entirely on your history.",
        ],
      },
      {
        heading: 'Questions to ask at your follow-up',
        body: [
          "What do you think most likely contributed this time? Would you change anything about the protocol? Are any additional tests genuinely indicated for me, or are they optional extras? How many remaining embryos do I have and what are their grades?",
          "On cost: ask what a further transfer from existing frozen embryos will cost, as this is usually substantially less than a full fresh cycle.",
        ],
      },
      {
        heading: 'Give yourself room',
        body: [
          "There is often no medical need to rush into the next attempt, and the emotional weight of this is real. Many clinics offer counselling, and asking for it is a normal part of treatment rather than a sign anything is wrong.",
        ],
      },
    ],
  },
  {
    id: 'storage-fees-explained',
    title: 'Storage fees explained: the cost that runs for years',
    category: 'Embryo Freezing',
    readTime: '4 min',
    excerpt:
      'Storage is the one fertility cost that keeps recurring. What you are charged for, how policies differ, and what happens if you move or stop paying.',
    sections: [
      {
        heading: 'What you are actually paying for',
        body: [
          "Storage fees cover keeping your eggs or embryos in cryogenic conditions — liquid nitrogen tanks, monitoring systems, and the regulatory compliance that surrounds them. It is an ongoing operational cost, which is why it is billed annually.",
        ],
      },
      {
        heading: 'How policies differ',
        body: [
          "Some clinics include the first year in the cycle fee; others bill from the moment of freezing. Some offer multi-year prepayment at a discount, which can be worthwhile if you are confident about your timeline.",
          "Check whether the fee is per year or per cycle batch — if you do two retrievals, you may or may not be charged twice.",
        ],
      },
      {
        heading: 'The questions people forget to ask',
        body: [
          "What happens if I move abroad? Can material be transferred to another clinic, and what does that cost? What is the maximum storage period permitted where you are — many jurisdictions set legal limits, and they vary considerably.",
          "And the uncomfortable but important one: what is your policy if a payment is missed? Understand the notice period and the consequences before you are ever in that position.",
        ],
      },
    ],
  },

  // ------------------------------------------------------------------------ IVF
  {
    id: 'reading-success-rates',
    title: 'How to read IVF success rates without being misled',
    category: 'IVF',
    readTime: '8 min',
    excerpt:
      'Two clinics can both advertise honest success rates and still not be comparable. The denominators, the age bands and the patient selection all change the number.',
    sections: [
      {
        heading: 'Success rate of what, exactly?',
        body: [
          "A percentage means nothing until you know what it is a percentage of. Rates can be quoted per cycle started, per egg retrieval, or per embryo transfer — and those give increasingly flattering numbers, because each one excludes people who dropped out earlier.",
          "'Per transfer' is the most generous framing. If a clinic quotes it, ask for the per-cycle-started figure as well.",
        ],
      },
      {
        heading: 'Pregnancy is not the same as a birth',
        body: [
          "Clinical pregnancy rates are higher than live birth rates, because not every pregnancy continues. Live birth rate is the number that reflects what most people actually want to know.",
          "Always check which one you are being shown.",
        ],
      },
      {
        heading: 'Age bands matter enormously',
        body: [
          "An overall clinic-wide figure tells you about that clinic's patient mix as much as its quality. A clinic that treats mostly younger patients will show better headline numbers regardless of how good it is.",
          "Ask for the rate for your own age band. That is the only figure that is meaningfully about you.",
        ],
      },
      {
        heading: 'Patient selection quietly shapes the numbers',
        body: [
          "Clinics that decline complex cases will report better outcomes than clinics that take them on. That does not make the second clinic worse — it may make it better. This is one reason to be sceptical of league tables.",
          "Where a national regulator publishes verified data, that is generally more reliable than self-reported figures on a clinic's own website.",
        ],
      },
      {
        heading: 'What to ask',
        body: [
          "What is your live birth rate per cycle started, for my age group, from the most recent full year of data? How many cycles did that figure come from? Is it independently verified?",
          "A small sample can produce impressive percentages by chance. Ask for the underlying numbers, not just the rate.",
        ],
      },
    ],
  },
  {
    id: 'ivf-cost-breakdown',
    title: 'The real cost of an IVF cycle, line by line',
    category: 'IVF',
    readTime: '7 min',
    excerpt:
      'A structured breakdown of what an IVF cycle is built from, so you can compare quotes properly and spot which extras are genuinely optional.',
    sections: [
      {
        heading: 'The core cycle',
        body: [
          "The base fee typically covers monitoring, egg retrieval, laboratory fertilisation and embryo culture, and one fresh transfer. This is the part clinics tend to advertise.",
        ],
      },
      {
        heading: 'The near-certain additions',
        body: [
          "Medication is the largest variable and is usually billed separately. Initial consultation and diagnostic testing often sit outside the package too.",
          "If embryos are frozen, add vitrification and the first period of storage.",
        ],
      },
      {
        heading: 'The genuinely optional extras',
        body: [
          "ICSI, where a single sperm is injected directly into an egg, is standard for male-factor infertility but is not needed by everyone. Preimplantation genetic testing is valuable in specific situations and unnecessary in others.",
          "Assisted hatching, embryo glue and various 'add-ons' vary widely in evidence base. It is entirely reasonable to ask: what is the evidence that this improves my chance of a live birth, specifically?",
          "A good clinic will tell you when an add-on is not indicated for you. Treat reluctance to answer that question as information.",
        ],
      },
      {
        heading: 'Frozen transfers change the maths',
        body: [
          "If a fresh transfer does not succeed but you have frozen embryos, a subsequent frozen embryo transfer costs far less than starting a new cycle. When comparing clinics, ask for the frozen transfer price too — it may matter more than the headline figure.",
        ],
      },
    ],
  },
  {
    id: 'ivf-abroad-checklist',
    title: 'Considering IVF abroad? What to check before you book',
    category: 'IVF',
    readTime: '8 min',
    excerpt:
      'Treatment abroad can cost substantially less, but the savings are real only if you plan the whole trip properly. A practical checklist.',
    sections: [
      {
        heading: 'Work out the true total, not the treatment price',
        body: [
          "The clinic fee is one part. Add flights for everyone travelling, accommodation for the length of the monitoring window, local transport, and time away from work.",
          "Then add the cost of a possible second trip. Cycles are sometimes cancelled or need repeating, and a plan that only works if everything goes right is not really a plan.",
        ],
      },
      {
        heading: 'Understand the regulatory framework',
        body: [
          "Rules on donor anonymity, the number of embryos that may be transferred, genetic testing, and treatment eligibility differ significantly between countries. Some treatments available in one place are not permitted in another.",
          "Check who regulates fertility clinics in that country and whether your clinic is accredited by them.",
        ],
      },
      {
        heading: 'Plan the monitoring',
        body: [
          "Many people do their early monitoring at home and travel for the final stretch and retrieval. This can cut the trip considerably — but it only works if both clinics agree to coordinate.",
          "Confirm in advance that your local clinic will do the scans and blood work, that the destination clinic will accept them, and who is actually making protocol decisions.",
        ],
      },
      {
        heading: 'Think about follow-up',
        body: [
          "If something needs attention after you return home, who handles it? Ask what aftercare is included and how you reach the clinic afterwards.",
          "Ask about language support too — you should be able to give informed consent in a language you are genuinely comfortable in.",
        ],
      },
      {
        heading: 'Records and transport',
        body: [
          "Make sure you leave with complete records: your protocol, medication doses, embryology reports and grades. If you may want material moved later, ask about cross-border transport and its cost before you start.",
        ],
      },
    ],
  },

  // ------------------------------------------------------------ Fertility Testing
  {
    id: 'understanding-amh-fsh-afc',
    title: 'AMH, FSH and antral follicle count: what your results mean',
    category: 'Fertility Testing',
    readTime: '7 min',
    excerpt:
      'These three measures estimate ovarian reserve — roughly, how many eggs you have left. They say much less about egg quality, and nothing definitive about whether you can conceive.',
    sections: [
      {
        heading: 'What these tests measure',
        body: [
          "AMH is a hormone produced by developing follicles, and it correlates with the size of your remaining egg pool. FSH is the hormone that stimulates follicle development; higher levels can suggest the body is working harder to recruit follicles. Antral follicle count is an ultrasound count of visible small follicles at the start of a cycle.",
          "Together they give a reasonable picture of ovarian reserve — quantity.",
        ],
      },
      {
        heading: 'What they do not measure',
        body: [
          "None of them tells you about egg quality, which is driven mainly by age. Someone can have a low AMH and good-quality eggs, or a reassuring AMH and difficulty conceiving.",
          "They also do not tell you whether you are fertile right now. A low result does not mean you cannot conceive naturally, and a high result is not a guarantee that you can.",
        ],
      },
      {
        heading: 'Where they are genuinely useful',
        body: [
          "Their real strength is predicting how you are likely to respond to ovarian stimulation. That makes them valuable for planning an egg freezing or IVF protocol and for setting realistic expectations about egg numbers.",
          "This is why clinics test them before treatment rather than as a general fertility score.",
        ],
      },
      {
        heading: 'Reading your own results carefully',
        body: [
          "Reference ranges vary between laboratories and assays, so compare against the range on your own report rather than one you found online. AMH is relatively stable across the cycle; FSH and antral follicle count are usually measured early in it.",
          "A single result is a snapshot. If a number concerns you, discuss it with a clinician who can interpret it alongside your age, history and goals rather than in isolation.",
        ],
      },
    ],
  },
  {
    id: 'home-tests-vs-clinic',
    title: 'At-home fertility tests versus clinic testing',
    category: 'Fertility Testing',
    readTime: '5 min',
    excerpt:
      'Home kits are cheaper and more convenient, and they genuinely measure real hormones. What they cannot do is examine your anatomy or interpret results in context.',
    sections: [
      {
        heading: 'What home kits do well',
        body: [
          "A good at-home panel measures real hormones from a finger-prick sample analysed in an accredited lab. For someone who simply wants a first look at ovarian reserve, they are a low-cost, low-friction starting point.",
          "They are also private and quick, which matters to people who are not ready for a clinic conversation.",
        ],
      },
      {
        heading: 'What they cannot tell you',
        body: [
          "They cannot perform an ultrasound. That rules out antral follicle count, and it rules out identifying fibroids, polyps, cysts or structural issues — any of which can matter a great deal.",
          "They also cannot assess fallopian tubes, and they do not assess a partner's fertility unless you buy a separate semen analysis.",
        ],
      },
      {
        heading: 'Interpretation is the real gap',
        body: [
          "A number without context is easy to misread in both directions — frightening yourself over a result that is fine for your age, or being falsely reassured by one that needs following up.",
          "Some providers include a clinician consultation with results. If you are choosing between kits, that is worth more than a few extra biomarkers.",
        ],
      },
      {
        heading: 'A reasonable approach',
        body: [
          "Home testing is a sensible first step if you are broadly well and just want a baseline. Go to a clinic first if you have been trying to conceive for a while without success, have irregular or absent periods, have a diagnosis such as PCOS or endometriosis, or have had pelvic surgery.",
          "And whatever a home test shows, an unexpected result is a reason to see a clinician rather than a conclusion in itself.",
        ],
      },
    ],
  },
  {
    id: 'when-to-get-checked',
    title: 'When to get your fertility checked, and what to ask for',
    category: 'Fertility Testing',
    readTime: '5 min',
    excerpt:
      'There is no universal right moment, but there are clear signals that make testing worthwhile sooner rather than later.',
    sections: [
      {
        heading: 'The usual guidance',
        body: [
          "Broadly, clinicians suggest seeking assessment after about a year of trying to conceive without success if you are under thirty-five, and after around six months if you are older. The shorter window reflects the fact that time matters more as age increases.",
        ],
      },
      {
        heading: 'Reasons not to wait',
        body: [
          "Irregular, very heavy or absent periods; a known diagnosis such as PCOS or endometriosis; previous pelvic surgery, chemotherapy or radiotherapy; a family history of early menopause; or two or more pregnancy losses.",
          "Any of these is a reason to get assessed regardless of how long you have been trying.",
        ],
      },
      {
        heading: 'Testing when you are not trying yet',
        body: [
          "Plenty of people test simply to inform planning — deciding whether to freeze eggs, or how much flexibility they realistically have. That is a legitimate reason, provided you go in understanding what the results can and cannot tell you.",
        ],
      },
      {
        heading: 'What to ask for',
        body: [
          "A reasonable baseline usually includes ovarian reserve markers and a pelvic ultrasound. If you have a male partner, a semen analysis should be part of the first round — male factor is involved in a substantial share of cases, and it is a simpler test than most of the female workup.",
          "Ask for your actual numbers, not just a verbal 'all normal'. You will want them if you seek a second opinion or compare clinics later.",
        ],
      },
    ],
  },

  // -------------------------------------------------------------- Costs & Planning
  {
    id: 'lgbtq-family-building',
    title: 'Routes and costs for LGBTQ+ family building',
    category: 'Costs & Planning',
    readTime: '7 min',
    excerpt:
      'The path to parenthood differs by couple and by country, and so does the cost. An overview of the main routes and the expenses that come with each.',
    sections: [
      {
        heading: 'The main routes',
        body: [
          "For female couples, common routes include intrauterine insemination with donor sperm, IVF with donor sperm, and reciprocal IVF — where one partner provides the eggs and the other carries the pregnancy.",
          "For male couples, family building generally involves an egg donor and a gestational surrogate, which is the most complex and expensive route and the most tightly regulated.",
          "Single parents by choice follow overlapping paths depending on which gametes are needed.",
        ],
      },
      {
        heading: 'Donor costs are a category of their own',
        body: [
          "Donor sperm is charged per vial, and more than one vial is often needed. Donor eggs cost considerably more. Whether donors can be compensated, and by how much, is set by law and varies widely between countries.",
          "Anonymity rules differ too. Some jurisdictions require donors to be identifiable to the child at adulthood; others permit anonymous donation. This is worth deciding on deliberately rather than by default.",
        ],
      },
      {
        heading: 'Reciprocal IVF costs more than it first appears',
        body: [
          "Reciprocal IVF involves two people in the medical process: one goes through stimulation and retrieval, the other through preparation and transfer. That means two sets of monitoring and medication, so budget closer to a full IVF cycle plus a transfer cycle.",
        ],
      },
      {
        heading: 'Legal costs are not optional',
        body: [
          "Parental rights are not automatic in every jurisdiction, particularly with surrogacy or where only one partner is genetically related. Legal advice and parental orders are a real line item, and skipping them creates risk rather than savings.",
          "Get advice specific to where you live and where treatment happens — they may be different places with different rules.",
        ],
      },
      {
        heading: 'Coverage is inconsistent',
        body: [
          "Insurance and public funding eligibility often assume a heterosexual couple with a period of unprotected intercourse, which can exclude LGBTQ+ patients by definition. Some places have reformed this; many have not.",
          "Check the exact wording of any policy or funding criteria rather than assuming, and ask clinics whether they have experience navigating it.",
        ],
      },
    ],
  },
  {
    id: 'fertility-medication-costs',
    title: 'Fertility medication: why costs vary so much',
    category: 'Costs & Planning',
    readTime: '5 min',
    excerpt:
      'Medication is usually the least predictable part of a quote. What drives the variation, and where there is legitimate room to reduce it.',
    sections: [
      {
        heading: 'Why the range is so wide',
        body: [
          "Stimulation drugs are dosed according to your ovarian reserve, age and how you respond. Someone needing a high dose over a longer stimulation can pay several times what someone on a low-dose protocol pays.",
          "This is why any clinic quoting a single precise medication figure before assessing you is guessing.",
        ],
      },
      {
        heading: 'Brand, biosimilar and pharmacy',
        body: [
          "Some drugs have biosimilar or alternative-brand versions at lower cost. Whether one is appropriate is a clinical decision, but it is a fair question to ask.",
          "Clinics sometimes have an in-house pharmacy, which is convenient but not always cheapest. Ask whether you may fill your prescription elsewhere, and compare.",
        ],
      },
      {
        heading: 'Reasonable ways to reduce cost',
        body: [
          "Ask whether your protocol has a lower-cost equivalent with comparable evidence. Ask about leftover medication from a cancelled cycle — sometimes it can be used later. Check whether any part is covered by insurance even when the cycle itself is not.",
          "Be cautious about buying medication through unofficial channels. Storage conditions matter for these drugs, and the saving is not worth the risk to your cycle.",
        ],
      },
      {
        heading: 'Ask for a range in writing',
        body: [
          "Request a low, typical and high estimate for someone with your profile. It makes quotes genuinely comparable and means you can plan for the higher end rather than being caught out by it.",
        ],
      },
    ],
  },
  {
    id: 'employer-fertility-benefits',
    title: 'Does your employer or insurer cover fertility? What to check',
    category: 'Costs & Planning',
    readTime: '6 min',
    excerpt:
      'A growing number of UK employers and insurers help with the cost of fertility testing, egg freezing or IVF — but it is far from universal and the detail varies enormously. How to find out what you are actually entitled to.',
    sections: [
      {
        heading: 'It is worth checking before you pay',
        body: [
          'Fertility benefits at work have grown quickly in the UK, but they are still patchy. Some employers offer a dedicated fertility allowance or fund; some route it through private medical insurance; some offer nothing. Two people at similar-sized companies can have completely different cover.',
          'Because it varies so much, the only reliable answer comes from your own employer and your own policy documents — not from a general rule. It is worth five minutes with HR before you commit to a cost this size.',
        ],
      },
      {
        heading: 'What cover tends to look like, by type',
        body: [
          'Fertility testing is the most commonly covered, because it is the cheapest — sometimes through a health cash plan, an employee health screening benefit, or your GP on the NHS.',
          'Egg freezing is increasingly offered as a standalone benefit, often as a capped allowance or a set number of cycles, sometimes via a specialist fertility-benefits provider rather than standard insurance.',
          'IVF is the most valuable and the least consistently covered. Standard private medical insurance frequently excludes it, or covers only investigation and not treatment, so an employer scheme that explicitly includes cycles is the thing to look for.',
        ],
      },
      {
        heading: 'How to find out what you actually have',
        body: [
          'Ask HR or your benefits platform three direct questions: is there any fertility benefit at all; does it cover testing, egg freezing and IVF or only some of these; and is it delivered through insurance, a flexible-benefits allowance, or a dedicated fertility provider.',
          'Then read the policy wording, not just the summary. Look for caps (a maximum amount or number of cycles), eligibility (waiting periods, whether partners or single people qualify, how a couple is defined), and exclusions (pre-existing conditions, age limits, or treatment abroad).',
          'If cover runs through private medical insurance, check whether it pays for treatment or only for diagnosis — the two are often confused, and the difference is thousands of pounds.',
        ],
      },
      {
        heading: 'Check the NHS route in parallel',
        body: [
          'Before assuming you will pay privately, check NHS-funded eligibility where you live. Criteria and the number of funded cycles are set locally by your Integrated Care Board and vary considerably across the UK.',
          'Employer or insurer cover can sit alongside NHS funding — for example, funding a further private cycle after NHS cycles are used, or covering egg freezing that the NHS would not.',
        ],
      },
      {
        heading: 'Confirm coverage in writing before you book',
        body: [
          'Whatever you are told verbally, get the specifics in writing: what is covered, up to what limit, what pre-authorisation is needed, and which clinics qualify. Some schemes only pay at particular clinics or require approval before you start.',
          'Coverage details change, and every scheme is different — always confirm with your employer or insurer directly rather than relying on a general guide like this one.',
        ],
      },
    ],
  },
];

const CATEGORIES = [
  'All',
  'Egg Freezing',
  'Embryo Freezing',
  'IVF',
  'Fertility Testing',
  'Costs & Planning',
] as const;

export function Resources({ onBack, initialCategory = 'All' }: ResourcesProps) {
  const [category, setCategory] = useState<string>(initialCategory);
  const [openArticle, setOpenArticle] = useState<Article | null>(null);

  const filtered =
    category === 'All' ? ARTICLES : ARTICLES.filter((a) => a.category === category);

  // ------------------------------------------------------------- Article reader
  if (openArticle) {
    return (
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" className="mb-8 -ml-3" onClick={() => setOpenArticle(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          All resources
        </Button>

        <div className="relative rounded-2xl overflow-hidden mb-8 h-40 md:h-52">
          <img
            src={CATEGORY_COVERS[openArticle.category]}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center gap-3 mb-5">
          <span className="grain text-[11px] font-semibold uppercase tracking-wide text-[#5B6AA5] bg-[#DEE8FF]/70 px-3 py-1 rounded-full">
            {openArticle.category}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-[#5C6478]">
            <Clock className="w-3.5 h-3.5" />
            {openArticle.readTime} read
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#2F3440] mb-6 leading-tight">
          {openArticle.title}
        </h1>
        <p className="text-lg md:text-xl text-[#5C6478] leading-relaxed mb-10">
          {openArticle.excerpt}
        </p>

        <article className="space-y-10">
          {openArticle.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2F3440] mb-4">
                {section.heading}
              </h2>
              <div className="space-y-4">
                {section.body.map((p, j) => (
                  <p key={j} className="text-[#5C6478] leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>

        <div className="glass rounded-2xl p-6 mt-12">
          <p className="text-sm text-[#5C6478] leading-relaxed">
            This article is general educational information, not medical advice. Fertility care is
            highly individual — always discuss your own situation with a qualified clinician before
            making decisions about treatment.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------- Index listing
  return (
    <div>
      <Button variant="ghost" className="mb-8 -ml-3" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <div className="max-w-2xl mb-10">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5B6AA5] mb-4">
          Resources
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#2F3440] mb-5">
          Understand your options
        </h1>
        <p className="text-lg text-[#5C6478] leading-relaxed">
          Plain-language guides to treatments, tests and what they really cost — written to help you
          ask better questions and compare clinics properly.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`grain text-sm font-medium px-4 py-2 rounded-full transition-all ${
              category === c
                ? 'bg-[#2F3440] text-white'
                : 'glass text-[#2F3440] hover:bg-white/70'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Article grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((article) => (
          <button
            key={article.id}
            onClick={() => {
              setOpenArticle(article);
              window.scrollTo({ top: 0 });
            }}
            className="group glass rounded-2xl overflow-hidden text-left flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(120,140,200,0.22)]"
          >
            <div className="relative h-28 overflow-hidden">
              <img
                src={CATEGORY_COVERS[article.category]}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
              {/* Keeps the title legible on the lightest gradients where the card body meets the image. */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/70 to-transparent" />
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-5">
                <span className="grain text-[11px] font-semibold uppercase tracking-wide text-[#5B6AA5] bg-[#DEE8FF]/70 px-3 py-1 rounded-full">
                  {article.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[#5C6478]">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-[#2F3440] leading-snug mb-3">
                {article.title}
              </h3>
              <p className="text-sm text-[#5C6478] leading-relaxed mb-5 flex-1">{article.excerpt}</p>

              <span className="flex items-center gap-1.5 text-sm font-semibold text-[#5B6AA5]">
                Read guide
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </button>
        ))}
      </div>

      <p className="text-sm text-[#5C6478] mt-12 max-w-2xl leading-relaxed">
        These guides are general educational information, not medical advice. Always discuss your own
        circumstances with a qualified clinician.
      </p>
    </div>
  );
}
