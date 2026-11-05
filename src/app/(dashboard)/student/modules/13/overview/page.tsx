import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import { enforceSequentialModuleUnlock } from '@/lib/gating';
import ModuleOpeningHook from '@/components/modules/ModuleOpeningHook';
import ModulePdfDownload from '@/components/modules/ModulePdfDownload';
import ModuleLearningRecordPanel from '@/components/modules/ModuleLearningRecordPanel';
import { MODULE_13_PREVIEW_CONTENT } from '@/data/module13CharacterPreviewContent';
import { completeModule13PreviewAction } from '../actions';

export default async function Module13OverviewPage() {
  const { user } = await enforceSequentialModuleUnlock(13);
  const supabase = await createClient();

  const [{ data: nodeRow }, { data: recordRow }] = await Promise.all([
    supabase
      .from('student_node_progress')
      .select('node_mastered')
      .eq('student_id', user.id)
      .eq('module_id', MODULES.CAPSTONE_ID)
      .eq('node_id', 'm13-1')
      .maybeSingle(),
    supabase
      .from('course_release_learning_records')
      .select('completed')
      .eq('student_id', user.id)
      .eq('module_number', 13)
      .maybeSingle(),
  ]);

  const isCompleted = Boolean(nodeRow?.node_mastered || recordRow?.completed);

  return (
    <div className="flex flex-col min-h-screen px-6 pt-24 pb-12 max-w-4xl mx-auto">
      <Link
        href="/student/home"
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-8 transition-colors group"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Dashboard</span>
      </Link>

      <div className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--neon-cyan)' }}>
        Module 13 • Preview Module (No Required Assignment)
      </div>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] font-display">
            {MODULE_13_PREVIEW_CONTENT.title}
          </h1>
          {isCompleted && (
            <span
              className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full font-bold"
              style={{
                border: '1px solid var(--neon-green)',
                color: 'var(--neon-green)',
                background: 'rgba(57,255,20,0.08)',
              }}
            >
              ✓ Preview Completed
            </span>
          )}
        </div>
        <p className="text-lg mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {MODULE_13_PREVIEW_CONTENT.subtitle}
        </p>
      </header>

      <ModuleOpeningHook moduleNumber={13} title={MODULE_13_PREVIEW_CONTENT.title} />

      <ModulePdfDownload
        moduleNumber={13}
        title="Module 13 Student Guide: Your Orion Character's Next Adventure"
        className="mb-8"
      />

      {/* Important Guardrail Banner */}
      <section className="p-6 rounded-xl border border-amber-500/40 bg-amber-950/15 mb-8">
        <h2 className="text-sm font-mono uppercase tracking-widest text-amber-300 font-bold mb-2">
          ⚡ Preview Only — No Required Assignment
        </h2>
        <p className="text-sm text-slate-200 leading-relaxed">
          {MODULE_13_PREVIEW_CONTENT.noRequirementBanner}
        </p>
      </section>

      {/* Preview Sections */}
      <div className="space-y-6 mb-8">
        {MODULE_13_PREVIEW_CONTENT.sections.map((sec) => (
          <section
            key={sec.part}
            className="p-6 rounded-xl border border-slate-800 bg-slate-900/70 space-y-3"
          >
            <div className="text-xs font-mono uppercase tracking-widest text-[#00c8ff] font-bold">
              {sec.part}
            </div>
            <h3 className="text-xl font-bold text-slate-100 font-display">{sec.title}</h3>
            {sec.paragraphs.map((para, i) => (
              <p key={i} className="text-sm text-slate-200 leading-relaxed">
                {para}
              </p>
            ))}
            {sec.bullets && sec.bullets.length > 0 && (
              <ul className="space-y-2 pt-2">
                {sec.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className="text-[#39ff14] font-bold mt-0.5">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {/* Optional Beta Reflection & Blocker Panel */}
      <div className="mb-8">
        <ModuleLearningRecordPanel
          moduleNumber={13}
          showChoices={false}
          showRecordForm={true}
          showBetaFeedback={true}
        />
      </div>

      {/* Complete Module 13 Preview Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-xl border border-[#00c8ff]/40 bg-slate-900/80">
        <div>
          <p className="text-sm font-bold text-slate-100">Ready for Module 14: Capstone — The Master Trial?</p>
          <p className="text-xs text-slate-400 mt-1">
            Mark this preview complete to unlock the Module 14 Master Trial on your dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isCompleted && (
            <Link
              href="/student/modules/14/overview"
              className="px-5 py-3 rounded-lg border border-[#39ff14] text-[#39ff14] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#39ff14]/10 transition-colors"
            >
              Go to Module 14 Capstone →
            </Link>
          )}
          <form action={completeModule13PreviewAction}>
            <button
              type="submit"
              className="btn-neon-filled px-6 py-3 rounded-lg font-bold text-sm cursor-pointer"
            >
              {isCompleted
                ? 'Review Module 13 Completion Screen →'
                : 'Mark Module 13 Preview Complete & Unlock Capstone →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
