import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import MfaVerifyForm from './MfaVerifyForm';

export default async function MfaVerificationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Confirm user actually needs MFA
  const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (mfaData && mfaData.currentLevel === 'aal2') {
    // Already verified, go to dashboard
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    redirect(`/${profile?.role || 'parent'}/home`);
  }

  return <MfaVerifyForm />;
}
