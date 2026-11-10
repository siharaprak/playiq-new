import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://weplayiq.com';

const CORE_ROUTES = [
  '/',
  '/blog',
  '/privacy',
  '/terms',
  '/sitemap.xml',
  '/robots.txt',
];

export async function GET(request: NextRequest) {
  return handleDailySeo(request);
}

export async function POST(request: NextRequest) {
  return handleDailySeo(request);
}

async function handleDailySeo(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronTrigger = request.headers.get('x-cron-trigger');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}` && cronTrigger !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Revalidate SEO-critical paths and blog index
    for (const route of ['/blog', '/sitemap.xml', '/']) {
      try {
        revalidatePath(route);
      } catch {
        // Non-fatal in standalone/edge runtime contexts
      }
    }

    // Verify availability and response status of core routes & sitemap
    const checks = await Promise.all(
      CORE_ROUTES.map(async (route) => {
        const targetUrl = `${SITE_URL}${route}`;
        const start = Date.now();
        try {
          const res = await fetch(targetUrl, {
            method: 'GET',
            headers: { 'User-Agent': 'PlayIQ-Daily-SEO-Cron/1.0' },
            cache: 'no-store',
          });
          return {
            route,
            status: res.status,
            ok: res.ok,
            latencyMs: Date.now() - start,
          };
        } catch (err: any) {
          return {
            route,
            status: 0,
            ok: false,
            latencyMs: Date.now() - start,
            error: err?.message || 'Fetch error',
          };
        }
      })
    );

    // Ping IndexNow / Bing / Yandex with sitemap and blog URLs if INDEXNOW_KEY is configured
    let indexNowStatus = 'skipped';
    const indexNowKey = process.env.INDEXNOW_KEY;
    if (indexNowKey) {
      try {
        const host = new URL(SITE_URL).hostname;
        const pingRes = await fetch('https://api.indexnow.org/indexnow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({
            host,
            key: indexNowKey,
            urlList: [`${SITE_URL}/`, `${SITE_URL}/blog`, `${SITE_URL}/sitemap.xml`],
          }),
        });
        indexNowStatus = `http_${pingRes.status}`;
      } catch (err: any) {
        indexNowStatus = `error: ${err?.message || 'unknown'}`;
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      siteUrl: SITE_URL,
      indexNowStatus,
      checks,
    });
  } catch (error: any) {
    console.error('[PlayIQ Daily SEO Cron] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

