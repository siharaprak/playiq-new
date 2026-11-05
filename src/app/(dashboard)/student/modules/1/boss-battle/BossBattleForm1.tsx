'use client';

import React, { useActionState } from 'react';
import { submitBossBattleAction } from '../actions';

const SCENARIOS = [
  {
    id: 1,
    text: 'You paste an entire 15-question math worksheet into AI and type "Solve all of these so I can finish in 2 minutes."',
  },
  {
    id: 2,
    text: 'You use a 10-question one-at-a-time discovery interview to lock 3 Must-Keep Features on a Character Guardrail Card before testing a new scene.',
  },
  {
    id: 3,
    text: 'You get stuck halfway through an equation and prompt: "Use Hint Mode. Here is my attempt so far—give me one hint for the next step only and do not reveal the final answer."',
  },
  {
    id: 4,
    text: 'AI gives you a confident paragraph claiming water always boils at 100°C even on top of Mount Everest, and you copy it straight into your lab report without checking.',
  },
  {
    id: 5,
    text: 'You test Analogy-First, Step-by-Step, and Big-Picture Map openings on the same science topic and score them on Clarity, Focus, and 60-Second Recall.',
  },
  {
    id: 6,
    text: 'You walk out of class confused and prompt: "Use Lesson Rescue Mode. Ask me 2 quick diagnostic questions to find where my understanding broke and repair only that piece."',
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
              <label className="block text-slate-400 font-mono text-xs uppercase tracking-wider mb-2">Step 1 — Classification</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input type="radio" name={`s${scenario.id}_label`} value="superpower" required />
                  <span style={{ color: 'var(--neon-green)' }}>⚡ Coaching Superpower (Builds Skill)</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input type="radio" name={`s${scenario.id}_label`} value="superweapon" />
                  <span className="text-red-500">⚠ Cognitive Outsourcing / Unverified Trap</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-xs uppercase tracking-wider mb-2">Step 2 — Why (Explain the impact on your learning)</label>
              <textarea
                name={`s${scenario.id}_why`}
                required
                placeholder="Explain in 1–3 sentences why this builds mastery or outsources your thinking..."
                className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm font-mono h-20 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-xs uppercase tracking-wider mb-2">Step 3 — Best PlayIQ Mode &amp; Next Prompt Move</label>
              <textarea
                name={`s${scenario.id}_next`}
                required
                placeholder="Name the best PlayIQ Mode (Explain, Hint, Quiz, Coach, Learn-My-Way, or Lesson Rescue) and your next move..."
                className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#7b4fce] rounded p-3 text-[var(--text-primary)] text-sm font-mono h-20 outline-none"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Part 2: Error Hunter Boss Challenge */}
      <div
        className="p-8 rounded-xl border backdrop-blur-md space-y-6"
        style={{ background: 'rgba(17,24,39,0.85)', borderColor: 'rgba(0,200,255,0.4)' }}
      >
        <h3 className="text-[#00c8ff] font-bold uppercase tracking-widest text-xs border-b border-slate-700 pb-2">
          PART 2 — THE ERROR HUNTER CHALLENGE (CATCH ALL 3 AI HALLUCINATIONS)
        </h3>

        <div className="p-4 rounded-lg bg-rose-950/25 border border-rose-500/40 font-mono text-xs sm:text-sm text-slate-200 space-y-2">
          <div className="text-rose-400 font-bold uppercase tracking-wider text-xs">
            ⚠️ Suspect AI Output (Contains 3 Confident Historical Errors):
          </div>
          <p className="italic leading-relaxed text-slate-100">
            &ldquo;The European Renaissance began in 1789 in Paris, France. During this period, Leonardo da Vinci invented the printing press and served as the King of France for twelve years. Because of the printing press, ancient Roman gladiators were able to read daily newspapers inside the Colosseum.&rdquo;
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 1. Spot All 3 Errors: List the three specific historical fabrications hidden inside the AI paragraph above.
            </label>
            <textarea
              name="reflection1"
              required
              placeholder="1. Where/when the Renaissance actually began... 2. Who actually invented the movable-type printing press (and da Vinci's real role)... 3. Why Roman gladiators could not read Renaissance newspapers..."
              className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm font-mono h-28 outline-none"
            />
          </div>
          <div>
            <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 2. Apply the 4-Step Verification Ritual: Which steps of the ritual (Sense Check, Self-Explain Check, Source Cross-Check, Missing-Piece Check) caught these errors, and what trusted source would you check?
            </label>
            <textarea
              name="reflection2"
              required
              placeholder="Explain how Sense Check and Source Cross-Check expose the timeline impossibility and false claims..."
              className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm font-mono h-24 outline-none"
            />
          </div>
          <div>
            <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 3. Authentic Human-Voice Replacement: Rewrite the paragraph into 2–3 accurate sentences in your own authentic human voice.
            </label>
            <textarea
              name="reflection3"
              required
              placeholder="Write 2–3 accurate sentences in your own natural words..."
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
