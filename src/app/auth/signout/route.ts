import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
  const origin = host ? `${proto}://${host}` : new URL(request.url).origin;
  
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (e) {
    // Even if signOut fails, we still want to redirect to logout page
    console.error('Sign out error:', e);
  }

  // Redirect to logout page
  return NextResponse.redirect(new URL('/logout', origin), {
    status: 303,
  });
}

export async function GET(request: Request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
  const origin = host ? `${proto}://${host}` : new URL(request.url).origin;
  
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (e) {
    console.error('Sign out error:', e);
  }

  return NextResponse.redirect(new URL('/logout', origin));
}
