import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function createClient() {
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
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function ensureProfileExists(userId: string, email: string, fullName: string, metadataRole?: string) {
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: profile, error: fetchError } = await adminClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching profile in ensureProfileExists:', fetchError);
  }

  if (!profile) {
    let role = 'parent';
    if (email.endsWith('@student.playiq.dev') || metadataRole === 'student') {
      role = 'student';
    }

    const { data: newProfile, error } = await adminClient
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        full_name: fullName,
        role: role,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to auto-create profile:', error);
      return null;
    }
    return newProfile;
  }

  return profile;
}
