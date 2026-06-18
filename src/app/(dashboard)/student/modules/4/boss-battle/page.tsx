import { submitBossBattleAction } from '../actions';
import Link from 'next/link';
import React from 'react';
import { enforceModuleGating } from '@/lib/gating';

const SCENARIOS = [
  {
    id: 1,
    text: 'You open your laptop to study, but you end up watching random videos for 45 minutes instead.',
  },
  {
    id: 2,
    text: 'You ask AI to break down a hard topic into simple parts and then you explain it back in your own words.',
  },
  {
    id: 3,
    text: 'You copy an AI answer because it sounds smart and you want to be done quickly.',
  },
  {
    id: 4,
    text: 'You see a shocking fact online and repost it without checking whether it\'s true.',
  },
  {
    id: 5,
    text: 'You use AI to build a study plan and finish one focused 15-minute mission.',
  },
  {
    id: 6,
    text: 'You paste a confusing lesson into AI and ask it to find where your confusion starts.',
  },
];

export default async function Module4BossBattlePage() {
  await enforceModuleGating('boss-battle', 4);

  const submitAction = submitBossBattleAction.bind(null, null);

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div
        className="mb-4 text-sm font-semibold uppercase tracking-wider animate-pulse"
        style={{ color: 'var(--neon-purple)' }}
      >
        Module 4 · Final Assessment
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
        <p className="mb-4">This is your final challenge for Module 4. For each of the 6 scenarios, you will:</p>
        <ul className="list-none space-y-2">
          <li><span className="text-[#00c8ff] mr-2">1.</span> Label it: Superpower or Superweapon Against You</li>
          <li><span className="text-[#00c8ff] mr-2">2.</span> Explain why (1–3 sentences)</li>
          <li><span className="text-[#00c8ff] mr-2">3.</span> Choose the highest path next move</li>
        </ul>
      </div>

      <form action={submitAction} className="space-y-8">
        {SCENARIOS.map(scenario => (
          <div
            key={scenario.id}
            className="p-6 rounded-xl border backdrop-blur-md"
            style={{ background: 'rgba(17,24,39,0.8)', borderColor: 'rgba(123,79,206,0.3)' }}
          >
            <p className="text-[#00c8ff] font-bold uppercase tracking-widest text-xs mb-3">
              SCENARIO {scenario.id}
            </p>
            <p className="text-[var(--text-primary)] font-mono text-sm mb-6 leading-relaxed">&gt; {scenario.text}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 font-mono text-xs uppercase tracking-wider mb-2">Step 1 — Label</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input type="radio" name={`s${scenario.id}_label`} value="superpower" required />
                    <span style={{ color: 'var(--neon-green)' }}>⚡ Superpower</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input type="radio" name={`s${scenario.id}_label`} value="superweapon" />
                    <span className="text-red-500">⚠ Superweapon Against Me</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-xs uppercase tracking-wider mb-2">Step 2 — Why</label>
                <textarea
                  name={`s${scenario.id}_why`}
                  required
                  placeholder="Explain in 1–3 sentences..."
                  className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm font-mono h-20 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-xs uppercase tracking-wider mb-2">Step 3 — Highest Path Next Move</label>
                <textarea
                  name={`s${scenario.id}_next`}
                  required
                  placeholder="What would the smartest next action be?"
                  className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#7b4fce] rounded p-3 text-[var(--text-primary)] text-sm font-mono h-20 outline-none"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Boss Battle Reflection */}
        <div
          className="p-8 rounded-xl border backdrop-blur-md"
          style={{ background: 'rgba(17,24,39,0.8)', borderColor: 'rgba(0,200,255,0.3)' }}
        >
          <h3 className="text-[#00c8ff] font-bold uppercase tracking-widest text-xs mb-6 border-b border-slate-700 pb-2">
            BOSS BATTLE REFLECTION
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">&gt; When is technology most dangerous to your growth?</label>
              <textarea
                name="reflection1"
                required
                placeholder="Write 2–4 full sentences..."
                className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm font-mono h-24 outline-none"
              />
            </div>
            <div>
              <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">&gt; What is one way you can keep technology on your highest path?</label>
              <textarea
                name="reflection2"
                required
                placeholder="Write 2–4 full sentences..."
                className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm font-mono h-24 outline-none"
              />
            </div>
            <div>
              <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">&gt; What kind of person do you become when you use powerful tools with discipline?</label>
              <textarea
                name="reflection3"
                required
                placeholder="Write 2–4 full sentences..."
                className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm font-mono h-24 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="w-full md:w-auto px-10 py-4 rounded-lg font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7b4fce, #00c8ff)', color: '#fff' }}
          >
            Submit Boss Battle →
          </button>
        </div>
      </form>
    </div>
  );
}
