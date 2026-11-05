import Link from 'next/link';
import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import { Module2QuizForm } from './Module2QuizForm';
import ModuleLearningRecordPanel from '@/components/modules/ModuleLearningRecordPanel';

export default async function Module2QuizPage() {
  await enforceModuleGating('quiz', 2);

  return (
    <div className="flex flex-col min-h-screen px-6 pt-24 pb-12 max-w-4xl mx-auto">
      <Link href="/student/modules/2/overview" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-6 transition-colors group" style={{ color: 'var(--text-secondary)' }}>
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Module</span>
      </Link>
      <div className="mb-4 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider">
        Module 2 · Gateway Assessment
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-8 text-[var(--text-primary)] font-display uppercase">
        2Q Digital Smarts &amp; Human Responsibility Quiz
      </h1>

      <p className="text-slate-400 font-mono text-sm leading-relaxed mb-10">
        This quiz evaluates your mastery of the Power Tool Principle (Coach vs. Crutch), the 5-Point Policy Check, the 10-Question Tutor Discovery pattern, Voice Protection, the 5-Step Truth Filter, and your Focus Sprint Lab. Achieve 80%+ to unlock the Boss Battle.
      </p>

      <Module2QuizForm />

      <ModuleLearningRecordPanel moduleNumber={2} showBlockerOnly={true} />
    </div>
  );
}
