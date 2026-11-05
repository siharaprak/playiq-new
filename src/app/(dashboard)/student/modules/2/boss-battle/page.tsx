import Link from 'next/link';
import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import { BossBattleForm2 } from './BossBattleForm2';
import ModuleLearningRecordPanel from '@/components/modules/ModuleLearningRecordPanel';

export default async function Module2BossBattlePage() {
  await enforceModuleGating('boss-battle', 2, 6);

  return (
    <div className="flex flex-col min-h-screen px-6 pt-24 pb-12 max-w-4xl mx-auto">
      <Link href="/student/modules/2/overview" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-6 transition-colors group" style={{ color: 'var(--text-secondary)' }}>
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Module</span>
      </Link>
      <div
        className="mb-4 text-sm font-semibold uppercase tracking-wider animate-pulse"
        style={{ color: 'var(--neon-purple)' }}
      >
        Module 2 · Final Assessment
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
        2B Highest Path &amp; Deadline Emergency Boss Battle
      </h1>

      <div className="bg-slate-900 border border-[#7b4fce]/50 p-6 rounded-xl shadow-[0_0_20px_rgba(123,79,206,0.15)] font-mono text-sm text-slate-300 mb-10">
        <p className="uppercase tracking-widest text-[#7b4fce] mb-2 font-bold">&gt; BOSS BATTLE PROTOCOL INITIATED</p>
        <p className="mb-4">This is your final challenge for Module 2. Complete both parts below:</p>
        <ul className="list-none space-y-2">
          <li><span className="text-[#00c8ff] mr-2">Part 1:</span> Evaluate 6 Digital Smarts scenarios (Superpower vs. Superweapon Against You, Why, and your Highest Path Next Move).</li>
          <li><span className="text-[#00c8ff] mr-2">Part 2:</span> Survive the <strong>Sunday 10:30 PM History Paper Emergency</strong>—reject a classmate&apos;s detector-bypass shortcut prompt, build a 3-Point Emergency Action Plan in your <code>PlayIQ Tutor Project</code> using your calibrated Focus Sprint, and write your PlayIQ Transparency Declaration.</li>
        </ul>
      </div>

      <BossBattleForm2 />

      <ModuleLearningRecordPanel moduleNumber={2} showBlockerOnly={true} />
    </div>
  );
}
