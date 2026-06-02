'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { verifyMfaAction } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-neon-filled w-full !rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Shield Verifying...' : 'Verify Code'}
    </button>
  );
}

export default function MfaVerifyForm() {
  const [state, formAction] = useActionState(verifyMfaAction, null);
  const [code, setCode] = useState('');

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

          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="p-3 bg-[rgba(255,0,0,0.1)] border-l-4 border-red-500 text-red-400 font-display text-xs uppercase tracking-wider flex gap-2 items-center">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                ERR: {state.error}
              </div>
            )}

            <div>
              <label className="block text-xs font-display uppercase tracking-[0.2em] mb-3 text-[#00c8ff] opacity-80 text-center">
                &gt; Security Code
              </label>
              <input
                type="text"
                name="code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="neon-input !rounded-none !border-b-2 !border-b-slate-700 !bg-black/40 text-center font-mono text-3xl tracking-[0.3em] text-white focus:!border-b-[#00c8ff] w-full block py-3"
                autoFocus
                required
              />
            </div>

            <SubmitButton />
          </form>
        </div>
      </div>
    </main>
  );
}
