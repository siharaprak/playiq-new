'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { signupAction } from '@/app/(auth)/actions';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-neon-filled w-full !rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'INITIALIZING...' : 'INITIALIZE ACCOUNT'}
    </button>
  );
}

function SignupContent() {
  const [state, formAction] = useFormState(signupAction, null);
  const searchParams = useSearchParams();
  const isBetaSuccess = searchParams.get('beta') === 'success';

  return (
    <main className="min-h-screen flex items-center justify-center bg-space-hero star-field relative overflow-hidden py-12 px-6">
      <div className="absolute top-[15%] right-[10%] w-[500px] h-[500px] bg-[rgba(0,242,255,0.08)] rounded-full blur-[140px] animate-drift pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-[rgba(255,0,255,0.08)] rounded-full blur-[120px] animate-drift pointer-events-none" style={{ animationDelay: '5s' }} />

      <div className="absolute top-[5%] right-[5%] font-display tracking-[0.3em] text-[#ff00ff] text-[0.6rem] uppercase opacity-60 text-right">
        REGISTRATION PORTAL<br/>
        ONLINE
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card !border-t-4 !border-t-[#00f2ff] !rounded-none p-8">
          
          {isBetaSuccess && (
            <div className="mb-6 p-4 bg-[rgba(57,255,20,0.1)] border border-[#39ff14]/50 text-[#39ff14] font-mono text-xs uppercase tracking-widest flex gap-3">
               <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
               <p>&gt; PAYMENT_SUCCESS: Hardware secured. Please initialize parent account below.</p>
            </div>
          )}

          <div className="mb-8 text-center flex flex-col items-center">
            <Link
              href="/"
              className="inline-flex items-center font-display uppercase tracking-[0.2em] text-[0.65rem] text-slate-500 hover:text-[#ff00ff] mb-6 transition-colors"
            >
              &lt; GO BACK
            </Link>

            <div className="flex justify-center mb-5">
               <h1 className="font-display font-black text-4xl tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-br from-[#00f2ff] to-[#ff00ff] drop-shadow-[0_0_20px_rgba(0,242,255,0.6)]">
                 PLAY<span className="text-white">IQ</span>
               </h1>
            </div>

            <h1 className="font-display text-xl font-bold text-white uppercase tracking-wider text-glow-cyan">
              OPEN ACCESS
            </h1>
            <p className="text-[#00f2ff] mt-2 font-display text-[0.65rem] uppercase tracking-[0.2em]">
              [INITIALIZE NEW NODE_ID]
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
              <label className="block text-xs font-display uppercase tracking-[0.2em] text-[#00f2ff] mb-2 opacity-80">
                &gt; FULL_NAME
              </label>
              <input 
                type="text" 
                name="name" 
                required 
                className="neon-input !rounded-none !border-b-2 !border-b-slate-700 focus:!border-b-[#00f2ff] !bg-black/40 font-mono tracking-widest text-white" 
                placeholder="JDOE" 
              />
            </div>

            <div>
              <label className="block text-xs font-display uppercase tracking-[0.2em] text-[#00f2ff] mb-2 opacity-80">
                &gt; USER_ID [EMAIL]
              </label>
              <input 
                type="email" 
                name="email" 
                required 
                className="neon-input !rounded-none !border-b-2 !border-b-slate-700 focus:!border-b-[#00f2ff] !bg-black/40 font-mono tracking-widest text-white" 
                placeholder="USER@DOMAIN.COM" 
              />
            </div>

            <div>
              <label className="block text-xs font-display uppercase tracking-[0.2em] text-[#00f2ff] mb-2 opacity-80">
                &gt; ASSIGN_PASSKEY
              </label>
              <input 
                type="password" 
                name="password" 
                required 
                className="neon-input !rounded-none !border-b-2 !border-b-slate-700 focus:!border-b-[#00f2ff] !bg-black/40 font-mono tracking-widest text-white selection:bg-[#ff00ff]" 
                placeholder="********" 
              />
            </div>

            <SubmitButton />
          </form>

          <div className="mt-8 text-center font-display text-[0.65rem] tracking-[0.1em] uppercase text-slate-500">
            SYS.NODE_ALREADY_ACTIVE?{' '}
            <Link
              href="/login"
              className="text-[#ff00ff] font-bold hover:animate-pulse-glow"
            >
              [ACCESS_NOW]
            </Link>
          </div>
          
        </div>
      </div>
    </main>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#020617] star-field font-display text-[#00f2ff] tracking-[0.2em] text-sm">&gt; INITIALIZING_UPLINK...</div>}>
      <SignupContent />
    </Suspense>
  );
}
