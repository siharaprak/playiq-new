'use client';

import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { signupAction } from '@/app/(auth)/actions';
import { ArrowLeft, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useActionState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="btn-neon-filled w-full !rounded-none disabled:opacity-50 disabled:cursor-not-allowed mt-6"
    >
      {pending ? "CREATING..." : "CREATE ACCOUNT"}
    </button>
  );
}

function SignupContent() {
  const [state, formAction] = useActionState(signupAction, null);
  const searchParams = useSearchParams();
  const isBetaSuccess = searchParams.get('beta') === 'success';

  return (
    <main className="min-h-screen flex items-center justify-center bg-space-hero star-field relative overflow-hidden pt-28 pb-12 px-6">
      {/* Background elements */}
      <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-[rgba(0,200,255,0.08)] rounded-full blur-[140px] animate-drift pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[rgba(123,79,206,0.06)] rounded-full blur-[120px] animate-drift pointer-events-none" style={{ animationDelay: '5s' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card !border-t-4 !border-t-[#00c8ff] !rounded-none p-8">
          
          {isBetaSuccess && (
            <div className="mb-6 p-4 bg-[rgba(0,200,255,0.1)] border-l-4 border-[#00c8ff] text-[#00c8ff] font-display text-xs tracking-wider flex gap-3 shadow-[0_0_10px_rgba(0,200,255,0.2)] leading-relaxed">
               <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#00c8ff]" />
               <p><strong className="uppercase">Payment Successful!</strong><br/>Your pilot hardware kit is secured. Please create your parent account below to access your Proof Dashboard.</p>
            </div>
          )}

          <div className="mb-8 text-center flex flex-col items-center">
             <Link href="/" className="inline-flex items-center font-display uppercase tracking-[0.2em] text-[0.65rem] text-slate-500 hover:text-[#7b4fce] mb-6 transition-colors">
              &lt; GO BACK
            </Link>
            
            <div className="flex justify-center mb-5">
               <h1 className="font-display font-black text-4xl tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-br from-[#00c8ff] to-[#7b4fce] drop-shadow-[0_0_20px_rgba(0,200,255,0.6)]">
                 PLAY<span className="text-white">IQ</span>
               </h1>
            </div>
            
            <h1 className="font-display text-xl font-bold text-white uppercase tracking-wider text-glow-cyan">
              CREATE_ACCOUNT
            </h1>
            <p className="text-slate-400 mt-3 font-display text-[0.65rem] uppercase tracking-[0.15em] leading-relaxed max-w-xs">
              Please note: Pilot hardware must be purchased prior to creating a platform account.
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            {state?.error && (
               <div className="p-3 bg-[rgba(255,0,0,0.1)] border-l-4 border-red-500 text-red-400 font-display text-xs uppercase tracking-wider flex gap-2 items-center">
                 <AlertCircle className="w-4 h-4 flex-shrink-0" /> ERR: {state.error}
               </div>
            )}
             <div>
              <label className="block text-xs font-display uppercase tracking-[0.2em] text-[#00c8ff] mb-2 opacity-80">
                &gt; FULL_NAME
              </label>
              <input type="text" name="name" required className="neon-input !rounded-none !border-b-2 !border-b-slate-700 focus:!border-b-[#00c8ff] !bg-black/40 font-mono tracking-widest text-white selection:bg-[#7b4fce] uppercase" placeholder="JANE DOE" />
            </div>
            <div>
              <label className="block text-xs font-display uppercase tracking-[0.2em] text-[#00c8ff] mb-2 opacity-80">
                &gt; USER_ID [EMAIL]
              </label>
              <input type="email" name="email" required className="neon-input !rounded-none !border-b-2 !border-b-slate-700 focus:!border-b-[#00c8ff] !bg-black/40 font-mono tracking-widest text-white selection:bg-[#7b4fce] uppercase" placeholder="YOU@DOMAIN.COM" />
            </div>
            <div>
              <label className="block text-xs font-display uppercase tracking-[0.2em] text-[#00c8ff] mb-2 opacity-80">
                &gt; PASSKEY
              </label>
              <input type="password" name="password" required className="neon-input !rounded-none !border-b-2 !border-b-slate-700 focus:!border-b-[#00c8ff] !bg-black/40 font-mono tracking-widest text-white selection:bg-[#7b4fce]" placeholder="••••••••" />
            </div>
            <SubmitButton />
          </form>

          <div className="mt-8 text-center font-display text-[0.65rem] tracking-[0.1em] uppercase text-slate-500 space-y-3">
            <Link href="/beta" className="text-[#7b4fce] font-bold hover:animate-pulse-glow block">
              [ NEED HARDWARE? JOIN THE PILOT ]
            </Link>
            <div className="pt-2 border-t border-[rgba(255,255,255,0.1)]">
              ALREADY_HAVE_AN_ACCOUNT?{' '}
              <Link href="/login" className="text-[#00c8ff] font-bold hover:animate-pulse-glow">
                [ SIGN_IN ]
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-space-hero star-field pt-28 pb-12 px-6"><div className="font-display text-[#00c8ff] tracking-[0.3em] uppercase text-xs">LOADING_INTERFACE...</div></div>}>
      <SignupContent />
    </Suspense>
  );
}
