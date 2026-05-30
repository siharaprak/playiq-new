import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import TutorBuilderContainer from '@/components/tutor/TutorBuilderContainer';

/** All 6 node IDs for Module 9 */
const REQUIRED_NODE_IDS = ['1', '2', '3', '4', '5', '6'];

export default async function TutorBuilderPage() {
  // ── Auth check ──
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // ── Gating check: all 6 nodes must be mastered ──
  const { data: progressData } = await supabase
    .from('student_node_progress')
    .select('node_id, node_mastered')
    .eq('student_id', user.id)
    .eq('module_id', MODULES.MODULE_9_ID);

  const masteredNodeIds = new Set(
    progressData?.filter(p => p.node_mastered).map(p => p.node_id) ?? []
  );

  const allNodesMastered = REQUIRED_NODE_IDS.every(id => masteredNodeIds.has(id));
  if (!allNodesMastered) {
    redirect('/student/modules/9/overview');
  }

  // Fetch fingerprint signals for Course 1 learner profile connection
  const { data: signals } = await supabase
    .from('fingerprint_signals')
    .select('*')
    .eq('student_id', user.id);

  const fingerprintSnapshot = {
    learning_style: signals?.find(s => s.signal_type === 'mode_preference')?.signal_value || 'Balanced',
    strengths: signals?.filter(s => s.signal_type === 'explanation_preference').map(s => s.signal_value) || [],
    struggles: signals?.filter(s => s.signal_type === 'shortcut_tendency').map(s => s.signal_value) || [],
    captured_at: new Date().toISOString(),
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">

      {/* Back link */}
      <Link
        href="/student/modules/9/overview"
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-8 transition-colors group"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Module Overview</span>
      </Link>

      {/* Module breadcrumb */}
      <div className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--neon-cyan)' }}>
        Module 9 • Build Your AI Tutor
      </div>

      {/* Page header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] font-display">
          Tutor Builder
        </h1>
        <p className="text-lg mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Design, configure, and launch your own AI tutor. Combine custom instructions with
          knowledge files to create a personalised learning supercharger.
        </p>
      </header>

      {/* Builder container (client component) */}
      <TutorBuilderContainer studentId={user.id} moduleId={MODULES.MODULE_9_ID} fingerprintSnapshot={fingerprintSnapshot} />
    </div>
  );
}
