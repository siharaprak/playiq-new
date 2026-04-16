import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

import { BossBattleForm } from '@/components/forms/BossBattleForm';

export default async function BossBattlePage() {
  const { user } = await enforceModuleGating('boss-battle');
  
  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-4 text-sm text-[#ff00ff] font-semibold uppercase tracking-wider animate-pulse">
        Module 1 • Final Assessment
      </div>
      
      <h1 className="text-5xl font-bold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00f2ff] font-display uppercase drop-shadow-[0_0_15px_rgba(255,0,255,0.5)]">
        1B Error Hunter Challenge
      </h1>
      
      <div className="prose dark:prose-invert max-w-none mb-12">
        <div className="bg-slate-900 border border-[#ff00ff]/50 p-6 rounded-xl shadow-[0_0_20px_rgba(255,0,255,0.15)] font-mono text-sm text-slate-300">
           <p className="uppercase tracking-widest text-[#ff00ff] mb-2 font-bold">&gt; BOSS BATTLE PROTOCOL INITIATED</p>
           <p>This is your final Challenge for Module 1. You are going to act like a real AI learner.</p>
           <ul className="mt-4 list-none space-y-2">
             <li><span className="text-[#00f2ff] mr-2">1.</span> Label the AI response (Useful, Risky, Wrong)</li>
             <li><span className="text-[#00f2ff] mr-2">2.</span> Choose the best next mode</li>
             <li><span className="text-[#00f2ff] mr-2">3.</span> Write a better next question or action</li>
             <li><span className="text-[#00f2ff] mr-2">4.</span> Explain how you would verify it</li>
           </ul>
        </div>

        <BossBattleForm />
      </div>
    </div>
  );
}
