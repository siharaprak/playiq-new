export interface CapstoneTrackOption {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  title: string;
  tagline: string;
  whatYouDo: string;
  whatYouShow: string;
}

export const MODULE_14_CAPSTONE_TRACKS: CapstoneTrackOption[] = [
  {
    id: 'A',
    title: 'Track A — Prompt Engineer',
    tagline: 'Upgrade a weak prompt into a high-precision coaching or workflow prompt and test both.',
    whatYouDo:
      'Take a vague one-line prompt on a real topic, redesign it using PlayIQ guardrails (role, context, step-by-step constraint, verification check), and compare the before and after outputs.',
    whatYouShow:
      'Before prompt, upgraded prompt, observed difference, and one thing that still required human verification.',
  },
  {
    id: 'B',
    title: 'Track B — Game Design Engineer',
    tagline: 'Design a playable micro-game or interactive quiz ruleset with clear mechanics and win/loss conditions.',
    whatYouDo:
      'Define the core loop, player choices, difficulty ramp, and guardrail rules yourself, then use AI as a design sparring partner to test one mechanic.',
    whatYouShow:
      'Your game concept brief, the mechanic you tested, one flaw you caught and fixed, and what remains untested.',
  },
  {
    id: 'C',
    title: 'Track C — Physical Object Dream Creator',
    tagline: 'Design a real-world invention, craft, or physical prototype plan with constraints and safety checks.',
    whatYouDo:
      'Specify the problem your object solves, materials, dimensions/steps, and safety checks, using AI to brainstorm 3 design variations while you choose and verify feasibility.',
    whatYouShow:
      'Your object specification, why you chose your design variation, and one real-world constraint you verified.',
  },
  {
    id: 'D',
    title: 'Track D — AI Chef (Safe Recipe / Kitchen Lab Planner)',
    tagline: 'Plan a parent-approved snack or meal workflow from ingredients on hand with a safety & allergy check.',
    whatYouDo:
      'List real ingredients and kitchen rules with a parent/guardian, ask AI for 3 structured options, and verify cooking times, measurements, and kitchen safety with a trusted adult/recipe.',
    whatYouShow:
      'Your ingredient & safety constraints, the option you selected, and what you verified with a parent or cookbook.',
  },
  {
    id: 'E',
    title: 'Track E — Personal Expense / Budget Assistant Concept',
    tagline: 'Design a safe, fictional or allowance-level budget categories tracker (no real bank or card data).',
    whatYouDo:
      'Create a sample category plan (save, spend, project goal) using fictional or simple allowance numbers, and test how your assistant organizes items and flags missing details.',
    whatYouShow:
      'Your category rules, your test with fictional/safe numbers, and your privacy boundary (never entering real financial accounts).',
  },
];

export const MODULE_14_SIX_STAGES = [
  {
    stage: 'Stage 1 — Define',
    desc: 'Choose one safe, real school or skill topic and state what you must be able to explain or do at the end (plus your checked source).',
  },
  {
    stage: 'Stage 2 — Map (Pre-Learn)',
    desc: 'Build a quick Pre-Learn Map (Headline, Landmarks, Key Terms, Anchor Example, Golden Question) using your tested Module 3 entry style.',
  },
  {
    stage: 'Stage 3 — Rescue & Compress',
    desc: 'Scan for the first M or S confusion point, run your Module 4 first rescue move, and compress the core idea into your own words (Module 5).',
  },
  {
    stage: 'Stage 4 — Practise & Learn from Mistakes',
    desc: 'Run a closed-notes self-test (Module 6), classify any slip in your Mistake Bank, and repair it before moving on.',
  },
  {
    stage: 'Stage 5 — Complete a Realistic Performance',
    desc: 'Explain or solve the target challenge in your own voice (Module 8) with AI turned off or in strict check-only mode.',
  },
  {
    stage: 'Stage 6 — Review the Evidence',
    desc: 'Compare your starting hypothesis against what actually worked, update your Learning Dashboard, and choose your next practice step.',
  },
];

export const MODULE_14_QUIZ_QUESTIONS = [
  {
    id: 'm14-quiz-1',
    question: 'What is the main purpose of the 6-Stage Master Trial in Module 14?',
    options: [
      { value: 'a', label: 'To let AI write a final paper for you as fast as possible' },
      {
        value: 'b',
        label:
          'To prove you can run the full PlayIQ learning loop (Define, Map, Rescue/Compress, Self-Test, Perform, Review Evidence) on a real topic in your own brain',
      },
      { value: 'c', label: 'To memorize random facts without testing yourself' },
    ],
    correctValue: 'b',
  },
  {
    id: 'm14-quiz-2',
    question: 'When building your Learning Dashboard across 3 course records, what rule keeps your evidence honest?',
    options: [
      { value: 'a', label: 'Make up a high numerical score if you felt good about the lesson' },
      {
        value: 'b',
        label:
          'Never invent unmeasured scores; separate what felt comfortable from what actually improved your closed-notes recall and clarity',
      },
      { value: 'c', label: 'Delete any record where you made a mistake' },
    ],
    correctValue: 'b',
  },
  {
    id: 'm14-quiz-3',
    question: 'Why must your Module 00 PlayIQ Tutor Project and your Module 11 Personal AI Assistant stay in separate projects?',
    options: [
      { value: 'a', label: 'Because AI platforms only allow one file per project' },
      {
        value: 'b',
        label:
          'Because your Tutor is a step-by-step learning coach built on your learning profile, while your Assistant is a bounded helper for one specific practical workflow',
      },
      { value: 'c', label: 'They do not need to stay separate' },
    ],
    correctValue: 'b',
  },
];

