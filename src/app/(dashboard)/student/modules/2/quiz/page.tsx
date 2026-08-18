import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import { Module2QuizForm } from './Module2QuizForm';

export default async function Module2QuizPage() {
  await enforceModuleGating('quiz', 2);

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-4 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider">
        Module 2 · Gateway Assessment
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-8 text-[var(--text-primary)] font-display uppercase">
        Module 2 Assessment Quiz
      </h1>

      <p className="text-slate-400 font-mono text-sm leading-relaxed mb-10">
        This quiz evaluates your mastery of digital responsibility and highest-path thinking. Achieve 80%+ to unlock the Boss Battle.
      </p>

      <Module2QuizForm />
    </div>
  );
}
