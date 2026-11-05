import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import TutorBuilderContainer from '@/components/tutor/TutorBuilderContainer';

export default async function TutorBuilderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: signals } = await supabase
    .from('fingerprint_signals')
    .select('*')
    .eq('student_id', user.id);

  const fingerprintSnapshot = {
    learning_style: signals?.find((s) => s.signal_type === 'mode_preference')?.signal_value || 'Balanced',
    strengths: signals?.filter((s) => s.signal_type === 'explanation_preference').map((s) => s.signal_value) || [],
    struggles: signals?.filter((s) => s.signal_type === 'shortcut_tendency').map((s) => s.signal_value) || [],
    captured_at: new Date().toISOString(),
  };

  return (
    <div className="flex flex-col min-h-screen px-6 pt-24 pb-12 max-w-4xl mx-auto">
      <Link
        href="/student/modules/9/overview"
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-8 transition-colors group"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Module 9 Overview</span>
      </Link>

      <div className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--neon-cyan)' }}>
        Module 9 • Build Your AI Tutor (PlayIQ Tutor Project)
      </div>

      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] font-display">
          Integrate and Review Your PlayIQ Tutor Project
        </h1>
        <p className="text-lg mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Your real AI Tutor lives inside the persistent <strong>PlayIQ Tutor Project</strong> you created in Module 00.
          Use this workspace alongside the Module 9 Overview to organize your 6-file{' '}
          <code>PlayIQ_Tutor_Kit</code> (including File 2: <code>personal_learning_knowledge_file.md</code>) and prepare
          for full testing in Module 10.
        </p>
      </header>

      <TutorBuilderContainer studentId={user.id} moduleId={MODULES.MODULE_9_ID} fingerprintSnapshot={fingerprintSnapshot} />
    </div>
  );
}
