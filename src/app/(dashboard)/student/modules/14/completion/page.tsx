import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import ModuleLearningRecordPanel from '@/components/modules/ModuleLearningRecordPanel';
import ModuleFeedbackForm from '@/components/forms/ModuleFeedbackForm';

export default async function Module14CompletionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: existingFeedback } = await supabase
    .from('module_feedback')
    .select('rating, feedback_text')
    .eq('student_id', user.id)
    .eq('module_id', MODULES.CAPSTONE_ID)
    .maybeSingle();

  const unlocks = [
    '6-Stage Exam & Performance System verified on a real topic',
    '3-Record Learning Dashboard comparing real before/after evidence',
    'Skills Demonstration Track (A–E) completed with human refinement',
    'Persistent PlayIQ Tutor Project & Personal AI Assistant certified',
  ];

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center px-6 pt-24 pb-12 text-center"
      style={{ background: 'linear-gradient(to bottom, #0a0f1e, rgba(123,79,206,0.08))' }}
    >
      <div
        className="w-32 h-32 rounded-full flex items-center justify-center mb-8 text-6xl shadow-xl"
        style={{ background: 'rgba(245,197,24,0.15)', border: '2px solid rgba(245,197,24,0.5)' }}
      >
        🏆
      </div>

      <h1
        className="text-5xl font-extrabold tracking-tight mb-4 font-display"
        style={{
          background: 'linear-gradient(135deg, #f5c518, #00c8ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Master Trial Complete!
      </h1>

      <p className="text-2xl pb-4 mb-6 font-medium" style={{ color: 'var(--text-secondary)' }}>
        Course 1 Certification Unlocked:{' '}
        <span className="font-bold" style={{ color: 'var(--neon-cyan)' }}>
          PlayIQ Master Architect
        </span>
      </p>

      <p className="text-lg mb-8 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Congratulations! You have completed all 15 modules of PlayIQ Course 1—from your Module 00 AI Workspace
        Orientation through building and testing your AI Tutor, your Personal AI Assistant, and the Module 14 Master
        Trial.
      </p>

      <div
        className="mb-10 p-6 rounded-xl text-left max-w-xl w-full"
        style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(0,200,255,0.2)' }}
      >
        <p className="text-[#00c8ff] font-bold uppercase tracking-widest text-xs mb-4">
          PlayIQ Course 1 Mastery Record
        </p>
        <ul className="space-y-2">
          {unlocks.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#cbd5e1' }}>
              <span style={{ color: 'var(--neon-green)' }}>✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full max-w-3xl text-left mb-10">
        <ModuleLearningRecordPanel
          moduleNumber={14}
          showChoices={false}
          showRecordForm={true}
          showBetaFeedback={true}
        />
      </div>

      <div className="mb-8">
        <Link
          href="/student/home"
          className="btn-neon-filled inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-bold text-sm"
        >
          ← Return to Student Dashboard
        </Link>
      </div>

      <div className="w-full max-w-2xl text-left">
        <ModuleFeedbackForm moduleId={MODULES.CAPSTONE_ID} initialFeedback={existingFeedback} />
      </div>
    </div>
  );
}

