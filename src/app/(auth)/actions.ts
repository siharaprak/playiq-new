'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function createSupabaseClient() {
  const cookieStore = await cookies();
  
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
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Both email and password are required' };
  }

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

  // Fetch true role resolution from profiles table (auto-generated via trigger)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single();

  const role = profile?.role || 'parent';
  redirect(`/${role}/home`);
}
