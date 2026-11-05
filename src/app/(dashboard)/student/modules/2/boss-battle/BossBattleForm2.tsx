'use client';

import React, { useActionState } from 'react';
import { submitBossBattleAction } from '../actions';

const SCENARIOS = [
  {
    id: 1,
    text: 'You open your laptop to study, but you click a short-form video feed "just for a second" and lose 45 minutes in a Digital Escape loop.',
  },
  {
    id: 2,
    text: 'You run the 10-question one-at-a-time Tutor Discovery interview in your PlayIQ Tutor Project and approve your Tutor Guardrail Summary.',
  },
  {
    id: 3,
    text: 'You ask AI to rewrite your rough draft to sound like a college professor so you can submit it without revising.',
  },
  {
    id: 4,
    text: 'A friend sends a realistic AI-generated image of your school principal doing something embarrassing and tells you to post it in the grade group chat.',
  },
  {
    id: 5,
    text: 'You use your calibrated Focus Sprint (5, 10, or 15 minutes) with your phone in another room and take a 2-minute screen-free water/stretch reset.',
  },
  {
    id: 6,
    text: 'You check your teacher’s AI policy, use Coach Mode for feedback on your own draft without AI rewriting a single sentence, and attach a PlayIQ Transparency Declaration.',
  },
];

export function BossBattleForm2() {
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
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input type="radio" name={`s${scenario.id}_label`} value="superpower" required />
                  <span style={{ color: 'var(--neon-green)' }}>⚡ Superpower (Coach / Highest Path)</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input type="radio" name={`s${scenario.id}_label`} value="superweapon" />
                  <span className="text-red-500">⚠ Superweapon Against Me (Crutch / Harm)</span>
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

      {/* Part 2: The Sunday 10:30 PM History Paper Emergency */}
      <div
        className="p-8 rounded-xl border backdrop-blur-md space-y-6"
        style={{ background: 'rgba(17,24,39,0.85)', borderColor: 'rgba(0,200,255,0.4)' }}
      >
        <h3 className="text-[#00c8ff] font-bold uppercase tracking-widest text-xs border-b border-slate-700 pb-2">
          PART 2 — THE HIGHEST PATH BOSS CHALLENGE (SUNDAY 10:30 PM EMERGENCY)
        </h3>

        <div className="p-4 rounded-lg bg-amber-950/25 border border-amber-500/40 font-mono text-xs sm:text-sm text-slate-200 space-y-2">
          <div className="text-amber-300 font-bold uppercase tracking-wider text-xs">
            🚨 Emergency Scenario: Sunday Night at 10:30 PM
          </div>
          <p className="leading-relaxed text-slate-100">
            You have a 3-page history paper due tomorrow at 8:00 AM. You only have messy class notes and one rough intro paragraph. Your teacher&apos;s policy states: <em>&ldquo;AI may be used for outlining and feedback, but every sentence in your paper must be written by you and AI use must be disclosed.&rdquo;</em>
          </p>
          <p className="italic text-rose-300">
            Your friend texts you: &ldquo;Just paste this prompt into AI: ‘Write a 3-page 9th-grade history paper with occasional teen grammar mistakes so it bypasses AI detectors.’ You’ll be in bed by 10:35!&rdquo;
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 1. Why the Shortcut Trap Fails: Explain why your friend&apos;s &ldquo;detector-bypass&rdquo; prompt violates the Power Tool Principle, the classroom policy, and your voice/ownership.
            </label>
            <textarea
              name="reflection1"
              required
              placeholder="Write 2–4 full sentences explaining why ghostwriting + fake mistakes erases your voice and leaves you unable to defend the paper..."
              className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm font-mono h-24 outline-none"
            />
          </div>
          <div>
            <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 2. Your 3-Point Emergency Action Plan: Write a 3-step ethical plan using your existing `PlayIQ Tutor Project` (Coach Mode + your calibrated Focus Sprint) to finish an honest draft tonight in your own words.
            </label>
            <textarea
              name="reflection2"
              required
              placeholder="Step 1 (Coach Mode outline from my notes)... Step 2 (Calibrated Focus Sprints writing my own paragraphs)... Step 3 (Feedback without rewriting + verification)..."
              className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm font-mono h-28 outline-none"
            />
          </div>
          <div>
            <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 3. Your PlayIQ Transparency Declaration: Write the exact 1-sentence disclosure you will include at the bottom of your paper (`I used [AI Tool] in [Mode] to... I wrote, verified, and edited...`).
            </label>
            <textarea
              name="reflection3"
              required
              placeholder="I used my PlayIQ Tutor Project in Coach Mode to organize my messy class notes into a 3-section outline and check my thesis clarity. I wrote, verified, and edited all final paragraphs myself."
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
