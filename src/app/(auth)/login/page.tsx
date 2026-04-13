'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { loginAction } from '@/app/(auth)/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-neon-filled w-full !rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Signing in...' : 'Sign In'}
    </button>
  );
}

export default function Login() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-space-hero star-field relative overflow-hidden py-12 px-6">
      {/* Background elements */}
      <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-[rgba(0,242,255,0.08)] rounded-full blur-[140px] animate-drift pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[rgba(255,0,255,0.08)] rounded-full blur-[120px] animate-drift pointer-events-none" style={{ animationDelay: '5s' }} />

      {/* HUD Overlays */}
      <div className="absolute top-[5%] left-[5%] font-display tracking-[0.3em] text-[#00f2ff] text-[0.6rem] uppercase opacity-60">
        LOGIN PORTAL<br/>
        READY
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card !border-t-4 !border-t-[#ff00ff] !rounded-none p-8">
          {/* Header */}
          <div className="mb-8 text-center flex flex-col items-center">
            <Link
              href="/"
              className="inline-flex items-center font-display uppercase tracking-[0.2em] text-[0.65rem] text-slate-500 hover:text-[#00f2ff] mb-6 transition-colors"
            >
              &lt; GO BACK
            </Link>

            <div className="flex justify-center mb-5">
               <h1 className="font-display font-black text-4xl tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-br from-[#00f2ff] to-[#ff00ff] drop-shadow-[0_0_20px_rgba(0,242,255,0.6)]">
                 PLAY<span className="text-white">IQ</span>
               </h1>
            </div>

            <h1 className="font-display text-xl font-bold text-white uppercase tracking-wider text-glow-cyan">
              LOG IN
            </h1>
            <p className="text-[#ff00ff] mt-2 font-display text-xs uppercase tracking-[0.2em]">
              [STUDENT & PARENT ACCESS]
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="p-3 bg-[rgba(255,0,0,0.1)] border-l-4 border-red-500 text-red-400 font-display text-xs uppercase tracking-wider flex gap-2 items-center">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                ERR: {state.error}
              </div>
            )}

            <div>
              <label className="block text-xs font-display uppercase tracking-[0.2em] text-[#00f2ff] mb-2 opacity-80">
                &gt; USER_ID [EMAIL]
              </label>
              <input
                type="email"
                name="email"
                required
                className="neon-input !rounded-none !border-b-2 !border-b-slate-700 focus:!border-b-[#00f2ff] !bg-black/40"
                placeholder="USER@DOMAIN.COM"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-display uppercase tracking-[0.2em] text-[#00f2ff] opacity-80">
                  &gt; PASSKEY
                </label>
                <Link
                  href="#"
                  className="text-[0.65rem] font-display uppercase text-[#ff00ff] hover:text-[#00f2ff] hover:underline tracking-[0.1em]"
                >
                  RECOVER_KEY?
                </Link>
              </div>
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

          {/* Footer link */}
          <div className="mt-8 text-center font-display text-[0.65rem] tracking-[0.1em] uppercase text-slate-500">
            NOT_ENROLLED_YET?{' '}
            <Link
              href="/beta"
              className="text-[#00f2ff] font-bold hover:animate-pulse-glow"
            >
              [APPLY_NOW]
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
