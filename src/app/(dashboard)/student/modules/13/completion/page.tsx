import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import ModuleFeedbackForm from '@/components/forms/ModuleFeedbackForm';

export default async function Module13CompletionPage() {
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
    'Full 12-module Orion Character progression recap',
    'Preview of future Orion World missions and creative build modes',
    'Module 14 Capstone: The Master Trial unlocked',
  ];

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center px-6 pt-24 pb-12 text-center"
      style={{ background: 'linear-gradient(to bottom, #0a0f1e, rgba(123,79,206,0.08))' }}
    >
      <div
        className="w-32 h-32 rounded-full flex items-center justify-center mb-8 text-6xl shadow-xl"
        style={{ background: 'rgba(0,200,255,0.15)', border: '2px solid rgba(0,200,255,0.4)' }}
      >
        🚀
      </div>

      <h1
        className="text-5xl font-extrabold tracking-tight mb-4 font-display"
        style={{
          background: 'linear-gradient(135deg, #7b4fce, #00c8ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Module 13 Preview Complete!
      </h1>

      <p className="text-2xl pb-4 mb-6 font-medium" style={{ color: 'var(--text-secondary)' }}>
        Next Stop:{' '}
        <span className="font-bold" style={{ color: 'var(--neon-cyan)' }}>
          Module 14 — Capstone: The Master Trial
        </span>
      </p>

      <p className="text-lg mb-8 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Your Orion character is calibrated and ready. In Module 14, you will run the 6-Stage Master Trial on one safe
        topic, compare your evidence across 3 course records, and complete your PlayIQ Mastery Record.
      </p>

      <div
        className="mb-8 p-6 rounded-xl text-left max-w-xl w-full"
        style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(0,200,255,0.2)' }}
      >
        <p className="text-[#00c8ff] font-bold uppercase tracking-widest text-xs mb-4">What You Unlocked</p>
        <ul className="space-y-2">
          {unlocks.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#cbd5e1' }}>
              <span style={{ color: 'var(--neon-green)' }}>✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-10">
        <Link
          href="/student/modules/14/overview"
          className="btn-neon-filled inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-sm"
        >
          Begin Module 14: Capstone — The Master Trial →
        </Link>
      </div>

      <div className="w-full max-w-2xl text-left">
        <ModuleFeedbackForm moduleId={MODULES.CAPSTONE_ID} initialFeedback={existingFeedback} />
      </div>
    </div>
  );
}

