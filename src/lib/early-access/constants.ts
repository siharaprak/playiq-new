/**
 * Shared copy, config and types for the PlayIQ Early Access lead popup.
 * Copy follows the "Lead Generation & Recruitment Handoff" (Section 5).
 */

export const EARLY_ACCESS_CONSENT_TEXT =
  "By continuing, you confirm you're a parent or guardian (18+) and agree to receive PlayIQ Early Access emails. Unsubscribe anytime.";

export const EARLY_ACCESS_COPY = {
  eyebrow: 'PlayIQ Early Access',
  headline: "Don’t Just Use AI. Learn to Build With It.",
  body: 'PlayIQ helps teens turn AI into a real-world advantage—building personal tutors, smarter study systems, and practical problem-solving skills for school, projects, and beyond.',
  parentLine: 'Parents receive clear visibility into what their teen is building and learning.',
  valuePoints: [
    'Build a personalized AI tutor',
    'Create smarter study guides and project systems',
    'Learn to verify AI answers and catch mistakes',
    'Develop skills that transfer beyond the classroom',
  ],
  cta: 'Get Early Access',
  trustLine: ['Free during Early Access', 'Ages 13–17', 'Parent or guardian signup'],
  confirmation: {
    headline: 'You’re One Step Closer to PlayIQ Early Access',
    body: 'Check your email to see how PlayIQ helps teens build AI tutors, study systems, and practical problem-solving skills—and what to expect before applying.',
    primaryCta: { label: 'See PlayIQ in Action', href: '/how-it-works' },
    secondaryCta: { label: 'Continue to Early Access', href: '/beta' },
  },
} as const;

/** Display rules — shown once per visit (browser session), shortly after landing. */
export const EARLY_ACCESS_POPUP_RULES = {
  /** Delay after landing on the site before the popup opens. */
  delayMs: 3_000,
  /** Opens earlier if the visitor scrolls this far first. */
  scrollThreshold: 0.45,
  /**
   * Never show on these routes (exact or sub-path match). Login, application,
   * privacy, terms and data-protection per the handoff, plus signed-in app areas.
   */
  excludedPrefixes: [
    '/login',
    '/logout',
    '/signup',
    '/beta',
    '/privacy',
    '/terms',
    '/data-protection',
    '/auth',
    '/admin',
    '/parent',
    '/student',
    '/discussions',
    '/settings',
  ],
} as const;

export const EARLY_ACCESS_STORAGE_KEYS = {
  /** Set permanently after a popup signup or completed application. */
  suppressed: 'playiq-ea-suppressed',
  /** Prevents re-showing within the same visit (cleared when the browser/tab session ends). */
  shownThisSession: 'playiq-ea-shown-session',
} as const;

export type EarlyAccessTrigger = 'timer' | 'scroll' | 'exit_intent';

export type EarlyAccessState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};
