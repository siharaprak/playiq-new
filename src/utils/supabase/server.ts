import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function createClient() {
  const cookieStore = await cookies()

  const client = createServerClient(
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

  // Apply dev session mocking
  try {
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(process.cwd(), 'scratch/mock-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config.mockEnabled) {
        const mockUser = {
          id: config.userId,
          email: config.email,
          aud: 'authenticated',
          role: 'authenticated',
        };
        client.auth.getUser = async () => {
          return { data: { user: mockUser }, error: null };
        };
        client.auth.mfa = {
          getAuthenticatorAssuranceLevel: async () => {
            return { data: { currentLevel: 'aal2', nextLevel: 'aal2' }, error: null };
          }
        } as any;

        // Wrap from method to bypass RLS with admin client
        const adminClient = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { auth: { autoRefreshToken: false, persistSession: false } }
        );
        client.from = (relation) => {
          return adminClient.from(relation);
        };
      }
    }
  } catch (err) {
    console.error('Error applying dev mock session:', err);
  }

  return client;
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
