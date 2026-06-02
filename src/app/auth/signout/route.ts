import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (e) {
    // Even if signOut fails, we still want to redirect to logout page
    console.error('Sign out error:', e);
  }

  // Redirect to logout page
  return NextResponse.redirect(new URL('/logout', requestUrl.origin), {
    status: 303,
  });
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (e) {
    console.error('Sign out error:', e);
  }

  return NextResponse.redirect(new URL('/logout', requestUrl.origin));
}
