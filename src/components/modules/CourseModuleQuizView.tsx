'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { COURSE_MODULES_3_TO_12_CONFIG } from '@/data/courseModules3To12Meta';
import ModuleLearningRecordPanel from '@/components/modules/ModuleLearningRecordPanel';

interface CourseModuleQuizViewProps {
  moduleNum: number;
  submitQuizAction: (prevState: unknown, formData: FormData) => Promise<any>;
}

export default function CourseModuleQuizView({
  moduleNum,
  submitQuizAction,
}: CourseModuleQuizViewProps) {
  const config = COURSE_MODULES_3_TO_12_CONFIG[moduleNum];
  const [state, formAction, isPending] = useActionState(submitQuizAction, null);

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

      <div className="mb-4 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider">
        Module {moduleNum} · Gateway Assessment
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-4 text-[var(--text-primary)] font-display uppercase">
        {config.quizTitle}
      </h1>

      <p className="text-slate-400 font-mono text-sm leading-relaxed mb-10">{config.quizSubtitle}</p>

      <form action={formAction} className="space-y-10">
        {state?.error && (
          <div className="p-6 bg-red-950/60 border-2 border-red-500 rounded-xl text-red-100 text-sm font-mono break-words leading-relaxed shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-start gap-4">
            <span className="text-2xl shrink-0 mt-0.5 text-red-500">⚠️</span>
            <div className="flex-1">
              <p className="font-extrabold text-red-400 mb-1.5 uppercase tracking-widest text-xs">
                &gt; QUIZ EVALUATION RESULT
              </p>
              <p className="text-red-200/90 font-sans text-sm">{state.error}</p>
            </div>
          </div>
        )}

        {/* Part A: Core Concept Mastery (Q1 - Q3) */}
        <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 backdrop-blur-md">
          <h3 className="text-[#39ff14] font-bold uppercase tracking-widest text-xs mb-6 border-b border-slate-700 pb-2">
            PART A — CORE CONCEPT CHECK (QUESTIONS 1–3)
          </h3>
          <div className="space-y-6">
            {config.quizQuestions.slice(0, 3).map((q, idx) => (
              <div key={q.name} className={idx > 0 ? 'pt-4 border-t border-slate-700/50' : ''}>
                <p className="text-[var(--text-primary)] font-mono text-sm mb-3">&gt; {q.prompt}</p>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <label key={opt.value} className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name={q.name}
                        value={opt.value}
                        required={optIdx === 0}
                        className="mt-1 accent-[#00c8ff]"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part B: Method & Evidence Check (Q4 - Q6) */}
        <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 backdrop-blur-md">
          <h3 className="text-[#39ff14] font-bold uppercase tracking-widest text-xs mb-6 border-b border-slate-700 pb-2">
            PART B — METHOD &amp; EVIDENCE CHECK (QUESTIONS 4–6)
          </h3>
          <div className="space-y-6">
            {config.quizQuestions.slice(3, 6).map((q, idx) => (
              <div key={q.name} className={idx > 0 ? 'pt-4 border-t border-slate-700/50' : ''}>
                <p className="text-[var(--text-primary)] font-mono text-sm mb-3">&gt; {q.prompt}</p>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <label key={opt.value} className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name={q.name}
                        value={opt.value}
                        required={optIdx === 0}
                        className="mt-1 accent-[#00c8ff]"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part C: Applied Reflection (Q7 - Q8) */}
        <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 backdrop-blur-md">
          <h3 className="text-[#39ff14] font-bold uppercase tracking-widest text-xs mb-6 border-b border-slate-700 pb-2">
            PART C — APPLIED MODULE REFLECTION
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
                &gt; {config.quizAppliedPrompts[0]}
              </label>
              <textarea
                name="q7"
                required
                className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-20"
                placeholder="Write 1–3 full sentences in your own words..."
              />
            </div>
            <div>
              <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">
                &gt; {config.quizAppliedPrompts[1]}
              </label>
              <textarea
                name="q8"
                required
                className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-20"
                placeholder="Write 1–3 full sentences in your own words..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="btn-neon-filled w-full md:w-auto px-10 py-4 rounded-lg font-bold uppercase tracking-widest cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Verifying Quiz...' : 'Submit Quiz & Verify →'}
          </button>
        </div>
      </form>

      <ModuleLearningRecordPanel moduleNumber={moduleNum} showBlockerOnly={true} />
    </div>
  );
}

