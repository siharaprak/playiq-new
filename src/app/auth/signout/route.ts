import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();

  // Sign out from Supabase
  await supabase.auth.signOut();

  // Redirect to logout page
  return NextResponse.redirect(new URL('/logout', requestUrl.origin), {
    status: 303, // 303 See Other is better for redirecting after a POST
  });
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();

  // Sign out from Supabase
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL('/logout', requestUrl.origin));
}
