import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import MfaForm from './MfaForm';

export default async function MfaVerificationPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <MfaForm 
      accessToken={session.access_token} 
      refreshToken={session.refresh_token} 
    />
  );
}
