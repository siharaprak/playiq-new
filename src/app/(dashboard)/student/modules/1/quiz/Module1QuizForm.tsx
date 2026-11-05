'use client';

import React, { useActionState } from 'react';
import { submitQuizAction } from '../actions';

export function Module1QuizForm() {
  const [state, formAction, isPending] = useActionState(submitQuizAction, null);

  return (
    <form action={formAction} className="space-y-10">
      {state?.error && (
        <div className="p-6 bg-red-950/60 border-2 border-red-500 rounded-xl text-red-100 text-sm font-mono break-words leading-relaxed shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-start gap-4 animate-pulse-subtle">
          <span className="text-2xl shrink-0 mt-0.5 text-red-500">⚠️</span>
          <div className="flex-1">
            <p className="font-extrabold text-red-400 mb-1.5 uppercase tracking-widest text-xs">
              &gt; QUIZ EVALUATION RESULT
            </p>
            <p className="text-red-200/90 font-sans text-sm">
              {state.error}
            </p>
          </div>
        </div>
      )}

      {/* Part A: Character Guardrails & AI Capabilities */}
      <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 backdrop-blur-md">
        <h3 className="text-[#39ff14] font-bold uppercase tracking-widest text-xs mb-6 border-b border-slate-700 pb-2">
          PART A — CHARACTER GUARDRAILS &amp; AI CAPABILITIES
        </h3>
        <div className="space-y-6">
          <div>
            <p className="text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 1. Why did you build a Character Guardrail Card with 3 Must-Keep Features in the First-Win Tutorial before generating new scenes?
            </p>
            <div className="space-y-2">
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q1" value="a" required /> A. Because AI automatically remembers everything without instructions
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q1" value="b" /> B. Because explicit guardrails and constraints keep the AI from drifting—just like clear rules keep an AI tutor coaching properly
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q1" value="c" /> C. Because browser AI automatically creates local folders on your hard drive
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q1" value="d" /> D. To recreate Orion instead of designing your own character
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <p className="text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 2. Which PlayIQ AI Mode should you command when you walked out of class confused and do not even know where the lesson stopped making sense?
            </p>
            <div className="space-y-2">
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q2" value="a" required /> A. Quiz Mode (ask me 5 test questions immediately)
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q2" value="b" /> B. Answer-Grabber Mode (solve the worksheet for me)
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q2" value="c" /> C. Lesson Rescue Mode (ask 2 quick diagnostic questions to find the exact fracture point and repair only that part)
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q2" value="d" /> D. Ghostwriter Mode (write my paragraph)
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <p className="text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 3. What is &quot;Cognitive Outsourcing&quot; in the AI Capability Balance Sheet?
            </p>
            <div className="space-y-2">
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q3" value="a" required /> A. Asking AI for one hint after showing your first attempt
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q3" value="b" /> B. Handing over the core thinking struggle to AI so the assignment looks finished while your own brain builds zero skill
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q3" value="c" /> C. Testing three explanation openings in the Learn How You Learn Lab
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q3" value="d" /> D. Checking a date against your textbook
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Part B: Question Ladder, Verification Ritual & Blueprint Hypotheses */}
      <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 backdrop-blur-md">
        <h3 className="text-[#39ff14] font-bold uppercase tracking-widest text-xs mb-6 border-b border-slate-700 pb-2">
          PART B — QUESTION LADDER, VERIFICATION RITUAL &amp; BLUEPRINT HYPOTHESES
        </h3>
        <div className="space-y-6">
          <div>
            <p className="text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 4. On the 6-Rung Question Ladder, what makes a Rung 4–6 prompt stronger than a Rung 1–2 prompt?
            </p>
            <div className="space-y-2">
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q4" value="a" required /> A. It names a specific coaching mode, shares what you already tried, and sets a boundary so you do the thinking
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q4" value="b" /> B. It asks the AI to write a longer essay so you don&apos;t have to read
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q4" value="c" /> C. It uses only two words like &quot;Explain cells&quot;
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q4" value="d" /> D. It asks for the final answer key immediately
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <p className="text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 5. Which of these lists all 4 steps of the PlayIQ Verification Ritual?
            </p>
            <div className="space-y-2">
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q5" value="a" required /> A. Copy, Paste, Format, Submit
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q5" value="b" /> B. Sense Check, Self-Explain Check, Source Cross-Check, and Missing-Piece Check
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q5" value="c" /> C. Trust Tone, Check Grammar, Count Words, Share Online
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q5" value="d" /> D. Ask Twice, Pick the Longer Answer, Skip the Textbook
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <p className="text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 6. How does PlayIQ treat your `explanation-start` setting in your Learning Supercharger Blueprint?
            </p>
            <div className="space-y-2">
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q6" value="a" required /> A. As a permanent medical diagnosis that never changes
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q6" value="b" /> B. As an evidence-tested starting hypothesis (e.g., analogy-first, step-by-step, or big-picture-map) that you test and refine across subjects
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q6" value="c" /> C. As a way to skip subjects that use text
              </label>
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="radio" name="q6" value="d" /> D. As a random guess that does not need lab testing
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Part C: Modes & Verification in Your Words */}
      <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 backdrop-blur-md">
        <h3 className="text-[#39ff14] font-bold uppercase tracking-widest text-xs mb-6 border-b border-slate-700 pb-2">
          PART C — AI LEARNING CODE IN YOUR OWN WORDS
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 7. When should you use Hint Mode instead of Explain Mode on a homework problem?
            </label>
            <textarea name="q7" required className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-20" placeholder="Write 1–3 full sentences..." />
          </div>
          <div>
            <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 8. Why is a polished, confident AI tone never proof that a claim is true?
            </label>
            <textarea name="q8" required className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-20" placeholder="Write 1–3 full sentences..." />
          </div>
          <div>
            <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 9. How did asking one question at a time in the 10-question Character Lab help you build a better Character Guardrail Card?
            </label>
            <textarea name="q9" required className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-20" placeholder="Write 1–3 full sentences..." />
          </div>
        </div>
      </div>

      {/* Part D: Applied Learning Lab Reflection */}
      <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 backdrop-blur-md">
        <h3 className="text-[#39ff14] font-bold uppercase tracking-widest text-xs mb-6 border-b border-slate-700 pb-2">
          PART D — APPLIED LEARNING LAB REFLECTION
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 10. Upgrade this weak prompt into a Rung 4–6 prompt: &quot;Give me the answers to my science review sheet.&quot;
            </label>
            <textarea name="q10" required className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-20" placeholder="Write your upgraded coaching prompt..." />
          </div>
          <div>
            <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 11. In your Learn How You Learn Lab, which explanation opening (`analogy-first`, `step-by-step`, or `big-picture-map`) scored highest on Clarity, Focus, and 60-Second Recall, and why?
            </label>
            <textarea name="q11" required className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-20" placeholder="Write 1–3 full sentences..." />
          </div>
          <div>
            <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
              &gt; 12. Write one non-negotiable AI Study Rule you will follow before trusting or using any AI explanation in school.
            </label>
            <textarea name="q12" required className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-20" placeholder="Write 1–3 full sentences..." />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="btn-neon-filled w-full md:w-auto px-10 py-4 rounded-lg font-bold uppercase tracking-widest disabled:opacity-50"
        >
          {isPending ? 'Grading Answers...' : 'Submit Quiz & Verify →'}
        </button>
      </div>
    </form>
  );
}
