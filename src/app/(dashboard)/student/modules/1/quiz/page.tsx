import Link from 'next/link';
import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import { Module1QuizForm } from './Module1QuizForm';
import ModuleLearningRecordPanel from '@/components/modules/ModuleLearningRecordPanel';

export default async function Module1QuizPage() {
  await enforceModuleGating('quiz', 1, 4);

  return (
    <div className="flex flex-col min-h-screen px-6 pt-24 pb-12 max-w-4xl mx-auto">
      <Link href="/student/modules/1/overview" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-6 transition-colors group" style={{ color: 'var(--text-secondary)' }}>
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Module</span>
      </Link>
      <div className="mb-4 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider">
        Module 1 · Gateway Assessment
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-8 text-[var(--text-primary)] font-display uppercase">
        1Q AI Learning Code Quiz
      </h1>

      <p className="text-slate-400 font-mono text-sm leading-relaxed mb-10">
        This quiz evaluates your mastery of your Character Guardrail Card workflow, the 6 PlayIQ AI Modes, the 6-Rung Question Ladder, the 4-Step Verification Ritual, and your Learn How You Learn Lab. Achieve 80%+ to unlock the Boss Battle.
      </p>

      <Module1QuizForm />

      <ModuleLearningRecordPanel moduleNumber={1} showBlockerOnly={true} />
    </div>
  );
}
