import Link from 'next/link';
import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import { BossBattleForm2 } from './BossBattleForm2';

export default async function Module2BossBattlePage() {
  await enforceModuleGating('boss-battle', 2, 6);

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div
        className="mb-4 text-sm font-semibold uppercase tracking-wider animate-pulse"
        style={{ color: 'var(--neon-purple)' }}
      >
        Module 2 · Final Assessment
      </div>

      <h1
        className="text-5xl font-bold tracking-tight mb-8 font-display uppercase"
        style={{
          background: 'linear-gradient(135deg, #7b4fce, #00c8ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 15px rgba(123,79,206,0.4))',
        }}
      >
        2B Superpower vs Superweapon Challenge
      </h1>

      <div className="bg-slate-900 border border-[#7b4fce]/50 p-6 rounded-xl shadow-[0_0_20px_rgba(123,79,206,0.15)] font-mono text-sm text-slate-300 mb-10">
        <p className="uppercase tracking-widest text-[#7b4fce] mb-2 font-bold">&gt; BOSS BATTLE PROTOCOL INITIATED</p>
        <p className="mb-4">This is your final challenge for Module 2. For each of the 6 scenarios, you will:</p>
        <ul className="list-none space-y-2">
          <li><span className="text-[#00c8ff] mr-2">1.</span>Label it: Superpower or Superweapon Against You</li>
          <li><span className="text-[#00c8ff] mr-2">2.</span>Explain why (1–3 sentences)</li>
          <li><span className="text-[#00c8ff] mr-2">3.</span>Choose the highest path next move</li>
        </ul>
      </div>

      <BossBattleForm2 />
    </div>
  );
}
