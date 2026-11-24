import { PLAYIQ_SOCIAL_LINKS } from '@/lib/constants/socials';

export const SITE_URL = 'https://weplayiq.com';
export const SITE_NAME = 'PlayIQ';

/**
 * Public, indexable pages. Used by app/sitemap.ts.
 * Add new marketing pages here so Google can discover them.
 */
export const PUBLIC_PAGES: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/apprentice', priority: 0.9 },
  { path: '/how-it-works', priority: 0.9 },
  { path: '/beta', priority: 0.9 },
  { path: '/parents', priority: 0.8 },
  { path: '/approach', priority: 0.8 },
  { path: '/proof', priority: 0.8 },
  { path: '/stem-learning', priority: 0.8 },
  { path: '/future-skills', priority: 0.7 },
  { path: '/homeschool-enrichment', priority: 0.7 },
  { path: '/project-based-engineering', priority: 0.7 },
  { path: '/safe-screen-time', priority: 0.7 },
  { path: '/contact', priority: 0.6 },
  { path: '/privacy', priority: 0.3 },
  { path: '/terms', priority: 0.3 },
  { path: '/data-protection', priority: 0.3 },
];

/**
 * Brand structured data. alternateName tells Google that "We Play IQ" / "weplayiq"
 * searches mean this brand, and helps separate PlayIQ from similarly named companies.
 */
export const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: ['We Play IQ', 'WePlayIQ', 'PlayIQ Learning'],
      url: SITE_URL,
      logo: `${SITE_URL}/images/playiq-logo-cropped.png`,
      email: 'support@weplayiq.com',
      description:
        'PlayIQ is an AI-guided STEM learning system for teens ages 13–17, with effort-gated hints, active-recall worksheets and verified progress reports for parents.',
      sameAs: Object.values(PLAYIQ_SOCIAL_LINKS),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: 'We Play IQ',
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export const APPRENTICE_COURSE_JSON_LD = {
  '@type': 'Course',
  '@id': `${SITE_URL}/apprentice#course`,
  name: 'Course 1: The Apprentice — AI-Guided STEM & Study Mastery for Teens',
  url: `${SITE_URL}/apprentice`,
  description:
    'A 12-week, 15-module AI-guided STEM and cognitive learning course for teens ages 13–17 featuring Orion (an effort-gated Socratic AI study coach), active-recall worksheets, custom AI tutor building, and a verified Parent Proof Packet.',
  provider: { '@id': `${SITE_URL}/#organization` },
  educationalLevel: 'Middle School and High School (Ages 13–17)',
  inLanguage: 'en-US',
  timeRequired: 'P12W',
  numberOfCredits: 15,
  teaches: [
    'Module 1: AI Learning Code (6 Coaching Modes & Verification Rituals)',
    'Module 2: Digital Smarts & Responsibility (Power Tool Principle & Attention Auditing)',
    'Module 3: Pre-Learn System (Topic Mapping & Active Recall Loops)',
    'Module 4: Lesson Rescue Mode (Diagnostic Confusion Repair)',
    'Module 5: Compression Learning (Note Synthesis & Mental Models)',
    'Module 6: Mistake Banking (Error Pattern Analysis)',
    'Module 7: Study Pack Creation (Pre-Exam Review Systems)',
    'Module 8: Writing & Answer Clarity (Logical Argument Structuring)',
    'Module 9: Build Your AI Tutor (Socratic Prompt Engineering)',
    'Module 10: Build Your AI Assistant (Custom Personas & Guardrails)',
    'Module 11: Capstone Master Trial (End-to-End System Mastery)',
  ],
};

export type PublicMarketingPath =
  | '/'
  | '/apprentice'
  | '/how-it-works'
  | '/beta'
  | '/parents'
  | '/approach'
  | '/proof'
  | '/stem-learning'
  | '/future-skills'
  | '/homeschool-enrichment'
  | '/project-based-engineering'
  | '/safe-screen-time';

export const PUBLIC_PAGE_FAQS: Record<
  PublicMarketingPath,
  { question: string; answer: string }[]
> = {
  '/': [
    {
      question: 'What age group is PlayIQ optimized for?',
      answer:
        'PlayIQ (Course 1: The Apprentice) is engineered for teens ages 13–17 to build logical thinking, active-recall study habits, and custom AI study tools.',
    },
    {
      question: 'How does PlayIQ protect my child’s privacy?',
      answer:
        'Child profiles are created and managed by parents. PlayIQ runs zero advertising, never sells student data, restricts analytics to public marketing pages, and lets parents delete their child’s data at any time.',
    },
    {
      question: 'Why is PlayIQ different from standard learning apps or chatbots?',
      answer:
        'Standard chatbots give copy-paste answers and passive apps reward button-clicking. PlayIQ disables direct answers, requiring teens to show what they tried first to earn Socratic hints from Orion and complete active-recall worksheets logged in the Parent Proof Packet.',
    },
  ],
  '/apprentice': [
    {
      question: 'What is included in Course 1: The Apprentice on PlayIQ?',
      answer:
        'Course 1: The Apprentice includes the Module 0 Learning Blueprint Assessment, 15 structured modules (Module 00 through Module 14) from AI Learning Code to Capstone Master Trial, 24/7 Socratic coaching with Orion, active-recall worksheets, and the Parent Proof Packet dashboard.',
    },
    {
      question: 'How long does a teen take to complete Course 1: The Apprentice?',
      answer:
        'Course 1 is designed as a 12-week self-paced or cohort-supported program for teens ages 13–17, requiring only a standard web browser on a laptop, desktop, or tablet.',
    },
  ],
  '/how-it-works': [
    {
      question: 'How does PlayIQ’s 4-step Build > Check > Conquer learning loop work?',
      answer:
        'Teens (1) receive a structured mission, (2) ask Orion for effort-gated hints by showing what they tried first, (3) complete active-recall worksheets and Teach-Back checks, and (4) log verified proof to unlock the next level.',
    },
    {
      question: 'What are the 6 AI Coaching Modes inside PlayIQ?',
      answer:
        'PlayIQ trains teens to use 6 specialized modes: Explain Mode, Hint Mode, Quiz Mode, Coach Mode, Learn Your Way Mode, and Lesson Rescue Mode.',
    },
  ],
  '/beta': [
    {
      question: 'What do families receive in the PlayIQ Founding Cohort Pilot?',
      answer:
        'Founding Cohort families receive instant activation of the PlayIQ digital study and Orion AI coaching platform, 12 weeks of guided access to Course 1: The Apprentice, live Parent Proof Packet telemetry, and direct feedback input into V2 calibration.',
    },
    {
      question: 'How many spots are available in the Founding Cohort Pilot?',
      answer:
        'PlayIQ is opening 50 spots for the inaugural Founding Cohort launch of Course 1: The Apprentice.',
    },
  ],
  '/parents': [
    {
      question: 'How do parents verify that their teen is actually learning on PlayIQ?',
      answer:
        'Parents receive the Parent Proof Packet, which tracks Recall Retention Rate (benchmarked above 85%), Hint Assistance Ratio, completed active-recall worksheets, and the student’s actual written explanations across all 15 modules (Modules 00–14).',
    },
    {
      question: 'Does PlayIQ replace my teen’s school curriculum?',
      answer:
        'No. PlayIQ is a school superpower helper, not a school replacement—teaching teens how to pre-learn topics, rescue confusing lessons, bank mistakes, and build AI study tutors for their real school classes.',
    },
  ],
  '/approach': [
    {
      question: 'What does "A Guide, Never a Crutch" mean in PlayIQ?',
      answer:
        'PlayIQ’s logic engine enforces Effort Before Answers. When a teen asks for help, direct solutions are blocked until the student demonstrates their prior attempt, ensuring AI strengthens rather than replaces their thinking.',
    },
    {
      question: 'What is the Teach-Back requirement in PlayIQ?',
      answer:
        'Before advancing, students must explain how they solved a problem in their own words so the platform and parents can verify genuine conceptual mastery.',
    },
  ],
  '/proof': [
    {
      question: 'What telemetry metrics are tracked inside the Parent Proof Packet?',
      answer:
        'The Parent Proof Packet logs Recall Retention Rate (target >85%), Hint Assistance Ratio, Worksheets Logged, Modules Mastered, and full portfolio artifact submissions.',
    },
    {
      question: 'Can parents read their teen’s actual written submissions?',
      answer:
        'Yes. Every module logs portfolio artifact evidence—such as the student’s Power Tool Principle reflection, mistake bank entries, and custom AI tutor prompts—directly inside the parent portal.',
    },
  ],
  '/stem-learning': [
    {
      question: 'How does PlayIQ teach STEM learning differently for teens 13–17?',
      answer:
        'Instead of rote formula memorization, PlayIQ combines first-principles logical reasoning, concept mapping, active retrieval decks, and applied AI systems engineering.',
    },
    {
      question: 'Do teens need prior coding experience to start PlayIQ?',
      answer:
        'No prior coding experience is required. Students progress from foundational AI literacy and structured logic in Modules 1–8 to building custom AI tutors and assistants in Modules 9–11.',
    },
  ],
  '/future-skills': [
    {
      question: 'What future skills does PlayIQ teach teens for an AI-driven economy?',
      answer:
        'PlayIQ teaches advanced prompt structuring, the 6-Step Question Ladder, generative AI hallucination verification protocols, cognitive mapping, and custom AI agent design.',
    },
    {
      question: 'How does PlayIQ teach teens to verify AI outputs?',
      answer:
        'In Module 1 (Verify Before You Believe), students learn that "confident is not the same as correct" and practice cross-checking AI responses against trusted sources before accepting them.',
    },
  ],
  '/homeschool-enrichment': [
    {
      question: 'How does PlayIQ support homeschool STEM enrichment and state portfolio reviews?',
      answer:
        'PlayIQ provides a self-paced, 12-week, 15-module STEM and AI engineering elective that automatically logs active study time, retention scores, completed worksheets, and written portfolio artifacts.',
    },
    {
      question: 'Can homeschool teens work through PlayIQ independently?',
      answer:
        'Yes. Orion guides students step by step with effort-gated hints while parents monitor verified submissions and mastery checkpoints via the Parent Proof Packet.',
    },
  ],
  '/project-based-engineering': [
    {
      question: 'What real projects do teens build in PlayIQ?',
      answer:
        'Teens build a personal AI Learning Code, subject topic maps, compression cheat sheets, a Mistake Bank, a custom subject AI Tutor in Module 9, a custom AI Assistant in Module 10, and complete the Module 11 Capstone Master Trial.',
    },
    {
      question: 'Why does PlayIQ focus on systems engineering over syntax memorization?',
      answer:
        'By configuring system instructions, safety boundaries, and Socratic prompt ladders, teens learn structural computational thinking and build tools they can immediately use across all their school subjects.',
    },
  ],
  '/safe-screen-time': [
    {
      question: 'How does PlayIQ turn passive screen time into active cognitive training?',
      answer:
        'PlayIQ eliminates infinite scrolling and passive video watching. Progress is gated behind effort-first hints, active-recall worksheets, and Module 2 attention-trap diagnostics where teens audit their own digital habits.',
    },
    {
      question: 'Are there any ads or social feeds inside PlayIQ?',
      answer:
        'No. PlayIQ contains zero advertising, zero algorithmic social feeds, and strict parent-controlled data privacy.',
    },
  ],
};

export function buildPublicPageJsonLd(path: PublicMarketingPath) {
  const canonicalUrl = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  const faqs = PUBLIC_PAGE_FAQS[path] || [];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...APPRENTICE_COURSE_JSON_LD,
        url: canonicalUrl,
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };
}
