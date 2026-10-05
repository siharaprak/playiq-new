import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function page(title: string, message: string, status = 200) {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} | PlayIQ</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#020617;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;padding:24px;">
<div style="max-width:480px;text-align:center;background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:32px;">
<p style="margin:0 0 8px;font-size:12px;letter-spacing:3px;color:#00c8ff;text-transform:uppercase;font-weight:700;">PlayIQ</p>
<h1 style="margin:0 0 12px;font-size:22px;color:#fff;">${title}</h1>
<p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#94a3b8;">${message}</p>
<a href="/" style="color:#00c8ff;font-size:14px;">Return to weplayiq.com</a>
</div></body></html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

async function unsubscribe(token: string | null) {
  if (!token || !UUID_RE.test(token)) {
    return page('Link not valid', 'This unsubscribe link is invalid or incomplete.', 400);
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const now = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from('early_access_leads')
    .update({ status: 'unsubscribed', unsubscribed_at: now, updated_at: now })
    .eq('unsubscribe_token', token);

  if (error) {
    console.error('[EarlyAccess] Unsubscribe failed:', error);
    return page('Something went wrong', 'We could not process your request. Please reply to any PlayIQ email and we’ll remove you manually.', 500);
  }
  return page('You’re unsubscribed', 'You won’t receive further PlayIQ Early Access emails.');
}

export async function GET(request: NextRequest) {
  return unsubscribe(request.nextUrl.searchParams.get('token'));
}

// Supports one-click unsubscribe (RFC 8058) from mail clients.
export async function POST(request: NextRequest) {
  return unsubscribe(request.nextUrl.searchParams.get('token'));
}
