import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import MfaForm from './MfaForm';

export default async function MfaVerificationPage() {
  const supabase = await createClient();
  
  // Use getUser() which is more reliable with @supabase/ssr cookie-based auth
  // getSession() can return null when cookies haven't fully propagated after a server action redirect
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Retrieve session tokens for the client-side MFA challenge
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <MfaForm 
      accessToken={session?.access_token ?? ''} 
      refreshToken={session?.refresh_token ?? ''} 
    />
  );
}
