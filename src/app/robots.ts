import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Logged-in areas and APIs. "/parent$" and "/parent/" leave the public /parents page crawlable.
      disallow: [
        '/api/',
        '/admin',
        '/student',
        '/parent$',
        '/parent/',
        '/settings',
        '/discussions',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
