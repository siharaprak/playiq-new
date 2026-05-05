'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { provisionApprenticeAction } from '../actions';

export default function ApprenticeSetupPage() {
  const [state, formAction] = useActionState(provisionApprenticeAction, null);

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-4 text-sm text-[#7b4fce] font-semibold uppercase tracking-wider">
        Parent Gateway
      </div>
      
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-white uppercase font-display">Provision Apprentice</h1>
      <p className="text-slate-400 font-mono text-sm mb-12">
        Create an isolated, independent PlayIQ account for your child. Their progression and module data will be strictly walled off from your billing and telemetry dashboard.
      </p>

      <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 backdrop-blur-md max-w-lg">
        {state?.error && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded text-red-200 text-sm font-mono break-words">
            &gt; ERR: {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-slate-300 font-mono text-xs uppercase tracking-widest mb-2">&gt; Apprentice Name</label>
            <input 
              required 
              type="text" 
              name="name"
              className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-white text-sm outline-none" 
              placeholder="e.g. John Doe" 
            />
          </div>
          <div>
            <label className="block text-slate-300 font-mono text-xs uppercase tracking-widest mb-2">&gt; Login Handle / Email</label>
            <input 
              required 
              type="text" 
              name="username"
              className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-white text-sm outline-none" 
              placeholder="e.g. johnny_plays or email" 
            />
          </div>
          <div>
            <label className="block text-slate-300 font-mono text-xs uppercase tracking-widest mb-2">&gt; Passcode</label>
            <input 
              required 
              type="password" 
              name="password"
              className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-white text-sm outline-none" 
              placeholder="Minimum 6 characters" 
              minLength={6}
            />
          </div>

          <div className="pt-6 border-t border-slate-700">
            <button 
              type="submit"
              className="btn-neon-filled w-full py-4 rounded-lg font-bold uppercase tracking-widest"
            >
              Generate Profile →
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <Link 
          href="/parent/home"
          className="text-slate-500 hover:text-white transition-colors font-mono text-sm uppercase tracking-widest"
        >
          ← Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
