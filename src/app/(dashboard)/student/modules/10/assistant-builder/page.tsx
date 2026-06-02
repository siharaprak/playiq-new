import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import AssistantBuilderContainer from '@/components/assistant/AssistantBuilderContainer';

/** All 7 node IDs for Module 10 */
const REQUIRED_NODE_IDS = ['1', '2', '3', '4', '5', '6', '7'];

export default async function AssistantBuilderPage() {
  // ── Auth check ──
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // ── Gating check: all 7 nodes must be mastered ──
  const { data: progressData } = await supabase
    .from('student_node_progress')
    .select('node_id, node_mastered')
    .eq('student_id', user.id)
    .eq('module_id', MODULES.MODULE_10_ID);

  const masteredNodeIds = new Set(
    progressData?.filter(p => p.node_mastered).map(p => p.node_id) ?? []
  );

  const allNodesMastered = REQUIRED_NODE_IDS.every(id => masteredNodeIds.has(id));
  if (!allNodesMastered) {
    redirect('/student/modules/10/overview');
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">

      {/* Back link */}
      <Link
        href="/student/modules/10/overview"
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-8 transition-colors group"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Module Overview</span>
      </Link>

      {/* Module breadcrumb */}
      <div className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--neon-cyan)' }}>
        Module 10 • Build Your AI Assistant
      </div>

      {/* Page header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] font-display">
          Assistant Builder
        </h1>
        <p className="text-lg mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Design, configure, and launch your own custom AI Assistant. Define its purpose, 
          specify the target user, configure boundaries, write instructions, and index knowledge files.
        </p>
      </header>

      {/* Builder container (client component) */}
      <AssistantBuilderContainer studentId={user.id} moduleId={MODULES.MODULE_10_ID} />
    </div>
  );
}
