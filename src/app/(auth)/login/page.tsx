'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useActionState, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const [loginRole, setLoginRole] = useState<'student' | 'parent'>('student');
  const router = useRouter();

  // When the server action returns mfaRequired, the response includes Set-Cookie headers
  // with the session. Navigate client-side so the browser has the cookies before the MFA page loads.
  useEffect(() => {
    if (state?.mfaRequired) {
      router.push('/login/mfa');
    }
  }, [state, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-space-hero star-field relative overflow-hidden pt-28 pb-12 px-6">
      {/* Background elements */}
      <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-[rgba(0,200,255,0.08)] rounded-full blur-[140px] animate-drift pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[rgba(123,79,206,0.06)] rounded-full blur-[120px] animate-drift pointer-events-none" style={{ animationDelay: '5s' }} />

      {/* HUD Overlays */}
      <div className="absolute top-32 left-[5%] hidden md:block font-display tracking-[0.3em] text-[#00c8ff] text-[0.6rem] uppercase opacity-60">
        LOGIN PORTAL<br/>
        READY
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card !border-t-4 !border-t-[#7b4fce] !rounded-none p-8">
          {/* Header */}
          <div className="mb-8 text-center flex flex-col items-center">
            <Link
              href="/"
              className="inline-flex items-center font-display uppercase tracking-[0.2em] text-[0.65rem] text-slate-500 hover:text-[#00c8ff] mb-6 transition-colors"
            >
              &lt; GO BACK
            </Link>

            <div className="flex justify-center mb-5">
               <h1 className="font-display font-black text-4xl tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-br from-[#00c8ff] to-[#7b4fce] drop-shadow-[0_0_20px_rgba(0,200,255,0.6)]">
                 PLAY<span className="text-white">IQ</span>
               </h1>
            </div>

            <h1 className="font-display text-xl font-bold text-white uppercase tracking-wider text-glow-cyan">
              LOG IN
            </h1>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-black/50 border border-slate-700 p-1 mb-8">
            <button
              type="button"
              onClick={() => setLoginRole('student')}
              className={`flex-1 py-2 text-xs font-display tracking-widest uppercase transition-all ${
                loginRole === 'student'
                  ? 'bg-[#00c8ff] text-black font-bold shadow-[0_0_10px_#00c8ff]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setLoginRole('parent')}
              className={`flex-1 py-2 text-xs font-display tracking-widest uppercase transition-all ${
                loginRole === 'parent'
                  ? 'bg-[#7b4fce] text-white font-bold shadow-[0_0_10px_#7b4fce]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Parent
            </button>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="role" value={loginRole} />
            {state?.error && (
              <div className="p-3 bg-[rgba(255,0,0,0.1)] border-l-4 border-red-500 text-red-400 font-display text-xs uppercase tracking-wider flex gap-2 items-center">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                ERR: {state.error}
              </div>
            )}

            <div>
              <label className={`block text-xs font-display uppercase tracking-[0.2em] mb-2 opacity-80 ${loginRole === 'student' ? 'text-[#00c8ff]' : 'text-[#7b4fce]'}`}>
                &gt; {loginRole === 'student' ? 'LOGIN HANDLE [USERNAME]' : 'ACCOUNT EMAIL'}
              </label>
              <input
                type={loginRole === 'student' ? 'text' : 'email'}
                name="identifier"
                required
                className={`neon-input !rounded-none !border-b-2 !border-b-slate-700 !bg-black/40 ${loginRole === 'student' ? 'focus:!border-b-[#00c8ff]' : 'focus:!border-b-[#7b4fce]'}`}
                placeholder={loginRole === 'student' ? 'e.g. johnny_plays' : 'USER@DOMAIN.COM'}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={`block text-xs font-display uppercase tracking-[0.2em] opacity-80 ${loginRole === 'student' ? 'text-[#00c8ff]' : 'text-[#7b4fce]'}`}>
                  &gt; PASSKEY
                </label>
                <Link
                  href="#"
                  className="text-[0.65rem] font-display uppercase text-[#7b4fce] hover:text-[#00c8ff] hover:underline tracking-[0.1em]"
                >
                  RECOVER_KEY?
                </Link>
              </div>
                <input
                type="password"
                name="password"
                required
                className={`neon-input !rounded-none !border-b-2 !border-b-slate-700 !bg-black/40 font-mono tracking-widest text-white ${loginRole === 'student' ? 'focus:!border-b-[#00c8ff] selection:bg-[#00c8ff]' : 'focus:!border-b-[#7b4fce] selection:bg-[#7b4fce]'}`}
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
              className="text-[#00c8ff] font-bold hover:animate-pulse-glow"
            >
              [APPLY_NOW]
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
