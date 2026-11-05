import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import { enforceSequentialModuleUnlock } from '@/lib/gating';
import { Trophy } from 'lucide-react';
import ModuleOpeningHook from '@/components/modules/ModuleOpeningHook';
import ModulePdfDownload from '@/components/modules/ModulePdfDownload';
import ModuleLearningRecordPanel from '@/components/modules/ModuleLearningRecordPanel';
import ModuleFeedbackForm from '@/components/forms/ModuleFeedbackForm';
import Module14CapstoneForm from './Module14CapstoneForm';

export default async function Module14OverviewPage() {
  const { user } = await enforceSequentialModuleUnlock(14);
  const supabase = await createClient();

  const [{ data: existingArtifacts }, { data: existingFeedback }, { data: nodeRow }] = await Promise.all([
    supabase
      .from('proof_artifact_submissions')
      .select('content_payload, status')
      .eq('student_id', user.id)
      .eq('module_id', MODULES.CAPSTONE_ID)
      .order('updated_at', { ascending: false }),
    supabase
      .from('module_feedback')
      .select('rating, feedback_text')
      .eq('student_id', user.id)
      .eq('module_id', MODULES.CAPSTONE_ID)
      .maybeSingle(),
    supabase
      .from('student_node_progress')
      .select('node_mastered')
      .eq('student_id', user.id)
      .eq('module_id', MODULES.CAPSTONE_ID)
      .eq('node_id', 'm14-1')
      .maybeSingle(),
  ]);

  const latestM14Artifact = existingArtifacts?.find(
    (a) => (a.content_payload as Record<string, unknown> | null)?.courseModuleNumber === 14,
  );
  const initialPayload = (latestM14Artifact?.content_payload as Record<string, any> | undefined) || null;
  const isCompleted = Boolean(nodeRow?.node_mastered || latestM14Artifact?.status === 'submitted');

  return (
    <div className="flex flex-col min-h-screen px-6 pt-24 pb-12 max-w-4xl mx-auto space-y-8">
      <Link
        href="/student/home"
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors group"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Dashboard</span>
      </Link>

      <div className="text-sm font-semibold uppercase tracking-wider font-mono" style={{ color: 'var(--neon-cyan)' }}>
        Module 14 • Capstone — The Master Trial
      </div>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] font-display flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[#f5c518]" /> Capstone — The Master Trial
          </h1>
          {isCompleted && (
            <Link
              href="/student/modules/14/completion"
              className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full font-bold"
              style={{
                border: '1px solid var(--neon-green)',
                color: 'var(--neon-green)',
                background: 'rgba(57,255,20,0.08)',
              }}
            >
              ✓ Master Trial Submitted — View Certificate →
            </Link>
          )}
        </div>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Combine your 6-Stage Exam &amp; Performance System, Learning Dashboard, Skills Demonstration Track (A–E),
          and PlayIQ Tutor final review into your complete Course 1 Master Trial.
        </p>
      </header>

      <ModuleOpeningHook moduleNumber={14} title="Capstone — The Master Trial" />

      <ModulePdfDownload
        moduleNumber={14}
        title="Module 14 Capstone Guide: The Master Trial"
      />

      <Module14CapstoneForm initialPayload={initialPayload} />

      <ModuleLearningRecordPanel
        moduleNumber={14}
        showChoices={true}
        showRecordForm={true}
        showBetaFeedback={true}
      />

      <section className="pt-4">
        <ModuleFeedbackForm moduleId={MODULES.CAPSTONE_ID} initialFeedback={existingFeedback} />
      </section>
    </div>
  );
}

