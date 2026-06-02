'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function verifyMfaAction(prevState: any, formData: FormData) {
  const code = formData.get('code') as string;

  if (!code || code.length !== 6 || isNaN(Number(code))) {
    return { error: 'Please enter a valid 6-digit numeric security code' };
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored
          }
        },
      },
    }
  );

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Session expired. Please log in again.' };
  }

  // Get active TOTP factor
  const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
  if (factorsError) {
    return { error: factorsError.message };
  }

  const activeFactor = factorsData.totp.find((f) => f.status === 'verified');
  if (!activeFactor) {
    return { error: 'No active 2FA factors found. Please contact support.' };
  }

  // Challenge and verify the TOTP code
  const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
    factorId: activeFactor.id,
    code,
  });

  if (verifyError) {
    return { error: verifyError.message };
  }

  // MFA verified! Resolve role and redirect to dashboard
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role || 'parent';
  redirect(`/${role}/home`);
}
