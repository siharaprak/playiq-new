'use client';

import Link from 'next/link';
import { Shield, AlertCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/app/(auth)/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 px-4 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all font-mono border border-amber-500 text-amber-500 hover:bg-amber-500/10 hover:shadow-[0_0_12px_rgba(245,197,24,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Authorizing...' : 'Establish Session'}
    </button>
  );
}

export default function AdminLogin() {
  const [state, formAction] = useActionState(loginAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.mfaRequired) {
      router.push('/login/mfa');
    }
  }, [state, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#020617] star-field relative overflow-hidden px-6">
      {/* Background elements */}
      <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-[rgba(245,197,24,0.03)] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[rgba(123,79,206,0.03)] rounded-full blur-[120px] pointer-events-none" />

      {/* HUD Overlays */}
      <div className="absolute top-12 left-[5%] hidden md:block font-mono tracking-[0.3em] text-[#00c8ff] text-[0.6rem] uppercase opacity-60 text-left">
        SYS.ADMIN ACCESS POINT<br/>
        SECURE_CONNECTION: ACTIVE
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card !border-t-4 !border-t-amber-500 !rounded-none p-8" style={{ background: 'rgba(17,24,39,0.85)' }}>
          {/* Header */}
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-amber-500/30 bg-amber-500/5 text-amber-500 shadow-[0_0_15px_rgba(245,197,24,0.2)]">
              <Shield className="w-8 h-8 animate-pulse" />
            </div>

            <h1 className="font-display font-black text-3xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 uppercase">
              PlayIQ Admin
            </h1>
            <p className="text-xs font-mono mt-2 tracking-widest text-slate-500 uppercase">Authorized Personnel Only</p>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="role" value="admin" />
            {state?.error && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-lg text-red-200 text-xs font-mono flex items-start gap-2 shadow-inner text-left">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}

            <div className="space-y-2 text-left">
              <label className="block text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
                &gt; Admin Email
              </label>
              <input
                type="email"
                name="identifier"
                required
                className="neon-input !rounded-none !border-b-2 !border-b-slate-700 !bg-black/40 text-sm font-mono text-slate-200 focus:!border-b-amber-500"
                placeholder="USER@PLAYIQ.COM"
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
                &gt; Security Passkey
              </label>
              <input
                type="password"
                name="password"
                required
                className="neon-input !rounded-none !border-b-2 !border-b-slate-700 !bg-black/40 text-sm font-mono text-slate-200 focus:!border-b-amber-500 selection:bg-amber-500"
                placeholder="********"
              />
            </div>

            <SubmitButton />
          </form>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="text-[10px] font-mono uppercase text-slate-500 hover:text-[#00c8ff] transition-colors"
            >
              [ RETURN TO USER PORTAL ]
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
