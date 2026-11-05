'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { COURSE_MODULES_3_TO_12_CONFIG } from '@/data/courseModules3To12Meta';
import ModuleLearningRecordPanel from '@/components/modules/ModuleLearningRecordPanel';

interface CourseModuleBossBattleViewProps {
  moduleNum: number;
  submitBossBattleAction: (prevState: unknown, formData: FormData) => Promise<any>;
}

export default function CourseModuleBossBattleView({
  moduleNum,
  submitBossBattleAction,
}: CourseModuleBossBattleViewProps) {
  const config = COURSE_MODULES_3_TO_12_CONFIG[moduleNum];
  const [state, formAction, isPending] = useActionState(submitBossBattleAction, null);

  return (
    <div className="flex flex-col min-h-screen px-6 pt-24 pb-12 max-w-4xl mx-auto">
      <Link
        href={`/student/modules/${moduleNum}/overview`}
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-8 transition-colors group"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">
          Back to Module {moduleNum} Overview
        </span>
      </Link>

      <div
        className="mb-4 text-sm font-semibold uppercase tracking-wider animate-pulse"
        style={{ color: 'var(--neon-purple)' }}
      >
        Module {moduleNum} · Boss Battle &amp; Mastery Challenge
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
        {config.bossBattleTitle}
      </h1>

      <div className="bg-slate-900 border border-[#7b4fce]/50 p-6 rounded-xl shadow-[0_0_20px_rgba(123,79,206,0.15)] font-mono text-sm text-slate-300 mb-10">
        <p className="uppercase tracking-widest text-[#7b4fce] mb-2 font-bold">
          &gt; BOSS BATTLE PROTOCOL INITIATED
        </p>
        <p className="mb-4">{config.bossBattleSubtitle}</p>
        <ul className="list-none space-y-2 text-xs sm:text-sm">
          <li>
            <span className="text-[#00c8ff] mr-2">1.</span> Label each scenario:{' '}
            <strong className="text-[#39ff14]">⚡ Superpower (High-Leverage PlayIQ Move)</strong> or{' '}
            <strong className="text-red-400">⚠ Superweapon Against Me (Shortcut / Illusion / Trap)</strong>
          </li>
          <li>
            <span className="text-[#00c8ff] mr-2">2.</span> Explain why in your own words (1–3 sentences)
          </li>
          <li>
            <span className="text-[#00c8ff] mr-2">3.</span> Write the smartest next move
          </li>
        </ul>
      </div>

      <form action={formAction} className="space-y-8">
        {state?.error && (
          <div className="p-6 bg-red-950/60 border-2 border-red-500 rounded-xl text-red-100 text-sm font-mono break-words leading-relaxed shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-start gap-4">
            <span className="text-2xl shrink-0 mt-0.5 text-red-500">⚠️</span>
            <div className="flex-1">
              <p className="font-extrabold text-red-400 mb-1.5 uppercase tracking-widest text-xs">
                &gt; BOSS BATTLE EVALUATION RESULT
              </p>
              <p className="text-red-200/90 font-sans text-sm">{state.error}</p>
            </div>
          </div>
        )}

        {config.bossScenarios.map(scenario => (
          <div
            key={scenario.id}
            className="p-6 rounded-xl border backdrop-blur-md"
            style={{ background: 'rgba(17,24,39,0.8)', borderColor: 'rgba(123,79,206,0.3)' }}
          >
            <p className="text-[#00c8ff] font-bold uppercase tracking-widest text-xs mb-3">
              SCENARIO {scenario.id}
            </p>
            <p className="text-[var(--text-primary)] font-mono text-sm mb-6 leading-relaxed">
              &gt; {scenario.text}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 font-mono text-xs uppercase tracking-wider mb-2">
                  Step 1 — Label
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input type="radio" name={`s${scenario.id}_label`} value="superpower" required />
                    <span style={{ color: 'var(--neon-green)' }}>⚡ Superpower (High-Leverage Move)</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input type="radio" name={`s${scenario.id}_label`} value="superweapon" />
                    <span className="text-red-500">⚠ Superweapon Against Me (Shortcut / Trap)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-xs uppercase tracking-wider mb-2">
                  Step 2 — Why
                </label>
                <textarea
                  name={`s${scenario.id}_why`}
                  required
                  placeholder="Explain in 1–3 sentences..."
                  className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm font-mono h-20 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-xs uppercase tracking-wider mb-2">
                  Step 3 — Smartest PlayIQ Next Move
                </label>
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
            MASTERY CHALLENGE REFLECTION
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
                &gt; {config.bossReflections[0]}
              </label>
              <textarea
                name="reflection1"
                required
                placeholder="Write 2–4 full sentences..."
                className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm font-mono h-24 outline-none"
              />
            </div>
            <div>
              <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
                &gt; {config.bossReflections[1]}
              </label>
              <textarea
                name="reflection2"
                required
                placeholder="Write 2–4 full sentences..."
                className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm font-mono h-24 outline-none"
              />
            </div>
            <div>
              <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
                &gt; {config.bossReflections[2]}
              </label>
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
            className="w-full md:w-auto px-10 py-4 rounded-lg font-bold uppercase tracking-widest transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #7b4fce, #00c8ff)', color: '#fff' }}
          >
            {isPending ? 'Evaluating...' : 'Submit Boss Battle →'}
          </button>
        </div>
      </form>

      <ModuleLearningRecordPanel moduleNumber={moduleNum} showBlockerOnly={true} />
    </div>
  );
}

