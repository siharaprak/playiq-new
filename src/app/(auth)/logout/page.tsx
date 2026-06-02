'use client';

import Link from 'next/link';
import { LogOut, ArrowLeft, LogIn } from 'lucide-react';

export default function LogoutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-space-hero star-field relative overflow-hidden pt-28 pb-12 px-6">
      {/* Background elements */}
      <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-[rgba(0,200,255,0.05)] rounded-full blur-[140px] animate-drift pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[rgba(123,79,206,0.04)] rounded-full blur-[120px] animate-drift pointer-events-none" style={{ animationDelay: '5s' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card !border-t-4 !border-t-[#7b4fce] !rounded-none p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#7b4fce]/50 flex items-center justify-center bg-[#7b4fce]/10 text-[#7b4fce] shadow-[0_0_15px_rgba(123,79,206,0.2)] animate-pulse">
              <LogOut className="w-8 h-8" />
            </div>
          </div>

          {/* Header */}
          <h1 className="font-display text-2xl font-black text-white uppercase tracking-widest text-glow-magenta mb-3">
            System Offline
          </h1>
          <p className="text-slate-400 text-xs font-mono mb-8 uppercase tracking-wider">
            &gt; SECURE_LOGOUT: COMPLETED
          </p>

          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            You have successfully disconnected and signed out of the PlayIQ operational gateway. Your active keys and tokens have been cleared.
          </p>

          {/* Action buttons */}
          <div className="space-y-4">
            <Link
              href="/login"
              className="btn-neon-filled w-full !rounded-lg flex items-center justify-center gap-2 group py-3 text-sm font-bold uppercase tracking-wider"
            >
              <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Sign Back In
            </Link>
            
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full bg-transparent border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white font-display font-bold py-3 text-xs transition-all uppercase tracking-widest"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
