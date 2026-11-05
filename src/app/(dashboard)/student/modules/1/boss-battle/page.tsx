import Link from 'next/link';
import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import { BossBattleForm1 } from './BossBattleForm1';
import ModuleLearningRecordPanel from '@/components/modules/ModuleLearningRecordPanel';

export default async function Module1BossBattlePage() {
  await enforceModuleGating('boss-battle', 1, 4);

  return (
    <div className="flex flex-col min-h-screen px-6 pt-24 pb-12 max-w-4xl mx-auto">
      <Link href="/student/modules/1/overview" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-6 transition-colors group" style={{ color: 'var(--text-secondary)' }}>
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Module</span>
      </Link>
      <div
        className="mb-4 text-sm font-semibold uppercase tracking-wider animate-pulse"
        style={{ color: 'var(--neon-purple)' }}
      >
        Module 1 · Final Assessment
      </div>

      <h1
        className="text-4xl sm:text-5xl font-bold tracking-tight mb-8 font-display uppercase"
        style={{
          background: 'linear-gradient(135deg, #7b4fce, #00c8ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 15px rgba(123,79,206,0.4))',
        }}
      >
        1B Error Hunter &amp; AI Learning Code Boss Battle
      </h1>

      <div className="bg-slate-900 border border-[#7b4fce]/50 p-6 rounded-xl shadow-[0_0_20px_rgba(123,79,206,0.15)] font-mono text-sm text-slate-300 mb-10">
        <p className="uppercase tracking-widest text-[#7b4fce] mb-2 font-bold">&gt; BOSS BATTLE PROTOCOL INITIATED</p>
        <p className="mb-4">This is your final challenge for Module 1. Complete both parts below:</p>
        <ul className="list-none space-y-2">
          <li><span className="text-[#00c8ff] mr-2">Part 1:</span> Evaluate 6 real AI Learning Code scenarios (Coaching Superpower vs. Cognitive Outsourcing Trap, Why, and the Right PlayIQ Mode &amp; Prompt Move).</li>
          <li><span className="text-[#00c8ff] mr-2">Part 2:</span> Complete the <strong>Error Hunter Boss Challenge</strong>—catch all 3 hallucinations in a confident AI history paragraph, apply the 4-Step Verification Ritual, and rewrite it in your own authentic human voice.</li>
        </ul>
      </div>

      <BossBattleForm1 />

      <ModuleLearningRecordPanel moduleNumber={1} showBlockerOnly={true} />
    </div>
  );
}
