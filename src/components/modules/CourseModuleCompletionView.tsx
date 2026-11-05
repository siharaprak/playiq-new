import React from 'react';
import Link from 'next/link';
import { enforceModuleGating } from '@/lib/gating';
import { createClient } from '@/utils/supabase/server';
import { getDbModuleIdForCourseModule } from '@/lib/constants';
import { COURSE_MODULES_3_TO_12_CONFIG } from '@/data/courseModules3To12Meta';
import ModuleFeedbackForm from '@/components/forms/ModuleFeedbackForm';
import ModuleLearningRecordPanel from '@/components/modules/ModuleLearningRecordPanel';

interface CourseModuleCompletionViewProps {
  moduleNum: number;
  totalNodes: number;
}

export default async function CourseModuleCompletionView({
  moduleNum,
  totalNodes,
}: CourseModuleCompletionViewProps) {
  const { user } = await enforceModuleGating('completion', moduleNum, totalNodes);
  const dbModuleId = getDbModuleIdForCourseModule(moduleNum);
  const config = COURSE_MODULES_3_TO_12_CONFIG[moduleNum];

  const supabase = await createClient();
  const { data: existingFeedback } = await supabase
    .from('module_feedback')
    .select('rating, feedback_text')
    .eq('student_id', user.id)
    .eq('module_id', dbModuleId)
    .maybeSingle();

  const nextModuleHref = `/student/modules/${moduleNum + 1}/overview`;

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center px-6 pt-24 pb-12 text-center"
      style={{ background: 'linear-gradient(to bottom, #0a0f1e, rgba(123,79,206,0.08))' }}
    >
      <div
        className="w-32 h-32 rounded-full flex items-center justify-center mb-8 text-6xl shadow-xl"
        style={{ background: 'rgba(123,79,206,0.15)', border: '2px solid rgba(123,79,206,0.4)' }}
      >
        🏆
      </div>

      <h1
        className="text-5xl font-extrabold tracking-tight mb-4 font-display"
        style={{
          background: 'linear-gradient(135deg, #7b4fce, #00c8ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Module {moduleNum} Complete!
      </h1>

      <p className="text-2xl pb-4 mb-6 font-medium" style={{ color: 'var(--text-secondary)' }}>
        New Tier Unlocked:{' '}
        <span className="font-bold" style={{ color: 'var(--neon-cyan)' }}>
          {config.tierUnlocked}
        </span>
      </p>

      <p className="text-lg mb-8 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {config.completionSummary}
      </p>

      {/* What You Unlocked */}
      <div
        className="mb-10 p-6 rounded-xl text-left max-w-xl w-full"
        style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(0,200,255,0.2)' }}
      >
        <p className="text-[#00c8ff] font-bold uppercase tracking-widest text-xs mb-4">
          What You Unlocked in Module {moduleNum}
        </p>
        <ul className="space-y-2">
          {config.unlockBullets.map(item => (
            <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#cbd5e1' }}>
              <span style={{ color: 'var(--neon-green)' }}>✓</span> {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Next Module CTA */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href={nextModuleHref}
          className="px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #00c8ff, #7b4fce)', color: '#fff' }}
        >
          Continue to Module {moduleNum + 1} →
        </Link>
        <Link
          href="/student/home"
          className="px-6 py-4 rounded-xl font-bold uppercase tracking-wider text-sm border border-slate-700 text-slate-300 hover:border-[#00c8ff] hover:text-[#00c8ff] transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Module Learning Record & Beta Reflection */}
      <div className="w-full max-w-3xl text-left mb-10">
        <ModuleLearningRecordPanel
          moduleNumber={moduleNum}
          showChoices={false}
          showRecordForm={true}
          showBetaFeedback={true}
        />
      </div>

      {/* Feedback Form */}
      <div className="w-full max-w-xl">
        <ModuleFeedbackForm moduleId={dbModuleId} initialFeedback={existingFeedback} />
      </div>
    </div>
  );
}

