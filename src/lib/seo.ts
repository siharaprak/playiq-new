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
