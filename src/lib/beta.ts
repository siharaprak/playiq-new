'use server';

import { createClient } from '@/utils/supabase/server';

/**
 * Checks whether the current authenticated user is a beta tester
 * by looking up their email in the beta_registrations table.
 *
 * Returns false for unauthenticated users.
 */
export async function isBetaTester(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) return false;

  const { data } = await supabase
    .from('beta_registrations')
    .select('id')
    .eq('email', user.email)
    .limit(1)
    .maybeSingle();

  return !!data;
}
