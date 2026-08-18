'use client';

import React, { useActionState } from 'react';
import { submitQuizAction } from '../actions';

export function Module2QuizForm() {
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


        {/* Part A: Power and Truth */}
        <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 backdrop-blur-md">
          <h3 className="text-[#39ff14] font-bold uppercase tracking-widest text-xs mb-6 border-b border-slate-700 pb-2">PART A — POWER AND TRUTH</h3>
          <div className="space-y-6">

            <div>
              <p className="text-[var(--text-primary)] font-mono text-sm mb-3">&gt; 1. What does it mean that AI is a multiplier?</p>
              <div className="space-y-2">
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q1" value="a" required /> A. It always makes people smarter</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q1" value="b" /> B. It makes your habits and choices stronger in whatever direction they already go</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q1" value="c" /> C. It makes the internet faster</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q1" value="d" /> D. It copies people&apos;s thoughts</label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-[var(--text-primary)] font-mono text-sm mb-3">&gt; 2. Which of these is part of the Truth Filter?</p>
              <div className="space-y-2">
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q2" value="a" required /> A. Believe what sounds confident</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q2" value="b" /> B. Share first, check later</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q2" value="c" /> C. Compare it with another trusted source</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q2" value="d" /> D. Trust popular opinions</label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-[var(--text-primary)] font-mono text-sm mb-3">&gt; 3. Why is repetition not proof?</p>
              <div className="space-y-2">
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q3" value="a" required /> A. Because repeated things are always false</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q3" value="b" /> B. Because something can be repeated and still be wrong</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q3" value="c" /> C. Because the internet hides truth</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q3" value="d" /> D. Because teachers do not like repetition</label>
              </div>
            </div>
          </div>
        </div>

        {/* Part B: Attention and Highest Path */}
        <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 backdrop-blur-md">
          <h3 className="text-[#39ff14] font-bold uppercase tracking-widest text-xs mb-6 border-b border-slate-700 pb-2">PART B — ATTENTION AND HIGHEST PATH</h3>
          <div className="space-y-6">

            <div>
              <p className="text-[var(--text-primary)] font-mono text-sm mb-3">&gt; 4. What is the difference between rest and escape?</p>
              <div className="space-y-2">
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q4" value="a" required /> A. Rest builds you; escape avoids what matters</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q4" value="b" /> B. Escape is always good</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q4" value="c" /> C. Rest is only for weekends</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q4" value="d" /> D. They are the same thing</label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-[var(--text-primary)] font-mono text-sm mb-3">&gt; 5. Which question is part of the Highest Path Test?</p>
              <div className="space-y-2">
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q5" value="a" required /> A. Will this make me look smart?</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q5" value="b" /> B. Does this make me stronger or weaker?</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q5" value="c" /> C. Can I avoid effort here?</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q5" value="d" /> D. Will this help me finish faster no matter what?</label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-[var(--text-primary)] font-mono text-sm mb-3">&gt; 6. Which is the highest path choice?</p>
              <div className="space-y-2">
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q6" value="a" required /> A. Copying an AI answer because it sounds good</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q6" value="b" /> B. Asking AI to explain a concept and then writing your own answer</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q6" value="c" /> C. Scrolling when you meant to study</label>
                <label className="flex gap-3 text-sm text-slate-300"><input type="radio" name="q6" value="d" /> D. Believing something because it matches your opinion</label>
              </div>
            </div>
          </div>
        </div>

        {/* Part C: Integrity and Social Impact */}
        <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 backdrop-blur-md">
          <h3 className="text-[#39ff14] font-bold uppercase tracking-widest text-xs mb-6 border-b border-slate-700 pb-2">PART C — INTEGRITY AND SOCIAL IMPACT</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">&gt; 7. What does &quot;AI can coach me, but I earn the skill&quot; mean?</label>
              <textarea name="q7" required className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-20" placeholder="Write 1–3 full sentences..." />
            </div>
            <div>
              <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">&gt; 8. Why is cheating an identity problem?</label>
              <textarea name="q8" required className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-20" placeholder="Write 1–3 full sentences..." />
            </div>
            <div>
              <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">&gt; 9. Why should you pause before sharing something online?</label>
              <textarea name="q9" required className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-20" placeholder="Write 1–3 full sentences..." />
            </div>
          </div>
        </div>

        {/* Part D: Applied Thinking */}
        <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 backdrop-blur-md">
          <h3 className="text-[#39ff14] font-bold uppercase tracking-widest text-xs mb-6 border-b border-slate-700 pb-2">PART D — APPLIED THINKING</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">&gt; 10. A confident AI answer matches what you hoped was true. What should you do next, and why?</label>
              <textarea name="q10" required className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-20" placeholder="Write 1–3 full sentences..." />
            </div>
            <div>
              <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">&gt; 11. What is one attention trap you want to reduce, and what boundary could help?</label>
              <textarea name="q11" required className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-20" placeholder="Write 1–3 full sentences..." />
            </div>
            <div>
              <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">&gt; 12. What is one Highest Path rule you want to use more often?</label>
              <textarea name="q12" required className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-20" placeholder="Write 1–3 full sentences..." />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="btn-neon-filled w-full md:w-auto px-10 py-4 rounded-lg font-bold uppercase tracking-widest"
          >
            Submit Quiz &amp; Verify →
          </button>
        </div>
      
    </form>
  );
}
