'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface MfaFormProps {
  accessToken: string;
  refreshToken: string;
}

export default function MfaForm({ accessToken, refreshToken }: MfaFormProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      try {
        // First try to use the tokens passed from the server component
        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          setSessionReady(true);
          return;
        }

        // Fallback: the browser client may already have a session via cookies
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSessionReady(true);
          return;
        }

        // Last resort: try getUser() to see if auth cookies exist
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setSessionReady(true);
          return;
        }

        setError('Auth session missing!');
      } catch (err) {
        console.error('Failed to initialize client session:', err);
        setError('Auth session missing!');
      }
    };
    init();
  }, [accessToken, refreshToken, supabase]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.length !== 6 || isNaN(Number(code))) {
      setError('Please enter a valid 6-digit numeric security code');
      return;
    }

    startTransition(async () => {
      try {
        // 1. Retrieve the list of active factors
        const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError) throw factorsError;

        const activeFactor = factorsData.totp.find((f) => f.status === 'verified');
        if (!activeFactor) {
          setError('No active 2FA factors found. Please contact support.');
          return;
        }

        // 2. Create challenge and verify
        const { data: verifyData, error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
          factorId: activeFactor.id,
          code,
        });

        if (verifyError) throw verifyError;

        // 3. Resolve role and redirect to dashboard
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not found');

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const role = profile?.role || 'parent';

        router.push(`/${role}/home`);
      } catch (err: any) {
        setError(err.message || 'Verification failed. Please check your code and try again.');
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-space-hero star-field relative overflow-hidden pt-28 pb-12 px-6">
      {/* Background elements */}
      <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-[rgba(0,200,255,0.08)] rounded-full blur-[140px] animate-drift pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[rgba(123,79,206,0.06)] rounded-full blur-[120px] animate-drift pointer-events-none" style={{ animationDelay: '5s' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card !border-t-4 !border-t-[#00c8ff] !rounded-none p-8">
          {/* Header */}
          <div className="mb-8 text-center flex flex-col items-center">
            <Link
              href="/login"
              className="inline-flex items-center font-display uppercase tracking-[0.2em] text-[0.65rem] text-slate-500 hover:text-[#00c8ff] mb-6 transition-colors"
            >
              &lt; GO BACK TO LOGIN
            </Link>

            <ShieldCheck className="w-12 h-12 text-[#00c8ff] drop-shadow-[0_0_10px_#00c8ff] mb-4" />
            <h1 className="font-display text-xl font-bold text-white uppercase tracking-wider text-glow-cyan">
              Two-Factor Shield
            </h1>
            <p className="text-slate-400 text-xs mt-2 font-mono">
              &gt; Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <div className="p-3 bg-[rgba(255,0,0,0.1)] border-l-4 border-red-500 text-red-400 font-display text-xs uppercase tracking-wider flex gap-2 items-center">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                ERR: {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-display uppercase tracking-[0.2em] mb-3 text-[#00c8ff] opacity-80 text-center">
                &gt; Security Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                disabled={isPending}
                placeholder="000000"
                className="neon-input !rounded-none !border-b-2 !border-b-slate-700 !bg-black/40 text-center font-mono text-3xl tracking-[0.3em] text-white focus:!border-b-[#00c8ff] w-full block py-3"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending || code.length !== 6 || !sessionReady}
              className="btn-neon-filled w-full !rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Shield Verifying...' : 'Verify Code'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
