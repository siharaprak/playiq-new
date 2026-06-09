'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ensureProfileExists } from '@/utils/supabase/server';

async function createSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll() 
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Can be ignored if handled by middleware
          }
        },
      },
    }
  );
}

export async function loginAction(prevState: any, formData: FormData) {
  const identifier = formData.get('identifier') as string;
  const password = formData.get('password') as string;
  const loginRole = formData.get('role') as string;

  if (!identifier || !password) {
    return { error: 'Both login handle and password are required' };
  }

  // Resolve username to the fake student email if they selected student role and didn't provide an @
  const email = (loginRole === 'student' && !identifier.includes('@')) 
    ? `${identifier}@student.playiq.dev` 
    : identifier;

  const supabase = await createSupabaseClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !authData.user) {
    return { error: error?.message || 'Authentication failed' };
  }

  // Fetch true role resolution from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single();

  const role = profile?.role || 'parent'; // fail-safe fallback, but logs indicate missing profile

  // Check if MFA is required
  const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (mfaData && mfaData.nextLevel === 'aal2' && mfaData.currentLevel === 'aal1') {
    // DON'T redirect here — redirect() throws before Set-Cookie headers reach the browser,
    // which means the MFA page won't have the session. Return a flag instead and let the
    // client-side handle navigation after cookies are properly received.
    return { mfaRequired: true };
  }

  redirect(`/${role}/home`);
}

export async function signupAction(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Both email and password are required' };
  }

  const supabase = await createSupabaseClient();
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name || 'Parent User'
      }
    }
  });

  if (error || !authData.user) {
    return { error: error?.message || 'Signup failed' };
  }

  // Explicitly ensure the profile exists in public.profiles.
  // This serves as an automated fallback if the DB trigger failed to run.
  const profile = await ensureProfileExists(
    authData.user.id,
    authData.user.email || email,
    name || 'Parent User',
    'parent'
  );

  const role = profile?.role || 'parent';

  redirect(`/${role}/home`);
}
