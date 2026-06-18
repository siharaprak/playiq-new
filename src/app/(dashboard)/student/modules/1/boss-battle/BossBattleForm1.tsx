'use client';

import React, { useActionState } from 'react';
import { submitBossBattleAction } from '../actions';

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

export function BossBattleForm1() {
  const [state, formAction, isPending] = useActionState(submitBossBattleAction, null);

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="p-6 bg-red-950/60 border-2 border-red-500 rounded-xl text-red-100 text-sm font-mono break-words leading-relaxed shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-start gap-4 animate-pulse-subtle">
          <span className="text-2xl shrink-0 mt-0.5 text-red-500">⚠️</span>
          <div className="flex-1">
            <p className="font-extrabold text-red-400 mb-1.5 uppercase tracking-widest text-xs">
              &gt; SEMANTIC EVALUATION FAILED
            </p>
            <p className="text-red-200/90 font-sans text-xs">
              {state.error}
            </p>
          </div>
        </div>
      )}

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
          disabled={isPending}
          className={`w-full md:w-auto px-10 py-4 rounded-lg font-bold uppercase tracking-widest transition-opacity ${isPending ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'hover:opacity-90'}`}
          style={isPending ? {} : { background: 'linear-gradient(135deg, #7b4fce, #00c8ff)', color: '#fff' }}
        >
          {isPending ? 'EVALUATING...' : 'Submit Boss Battle →'}
        </button>
      </div>
    </form>
  );
}
