import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

const DISALLOWED_PRIVATE_ROUTES = [
  '/api/',
  '/admin',
  '/student',
  '/parent$',
  '/parent/',
  '/settings',
  '/discussions',
];

const AI_ANSWER_ENGINE_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'PerplexityBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        // Logged-in areas and APIs. "/parent$" and "/parent/" leave the public /parents page crawlable.
        disallow: DISALLOWED_PRIVATE_ROUTES,
      },
      ...AI_ANSWER_ENGINE_BOTS.map((bot) => ({
        userAgent: bot,
        allow: ['/', '/llms.txt', '/llms-full.txt', '/playiq-curriculum.md'],
        disallow: DISALLOWED_PRIVATE_ROUTES,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
