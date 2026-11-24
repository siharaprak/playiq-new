import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import AssistantBuilderContainer from '@/components/assistant/AssistantBuilderContainer';

export default async function Module12AssistantBuilderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="flex flex-col min-h-screen px-6 pt-24 pb-12 max-w-4xl mx-auto">
      <Link
        href="/student/modules/12/overview"
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-8 transition-colors group"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Module 12 Overview</span>
      </Link>

      <div className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--neon-cyan)' }}>
        Module 12 • Configure, Operate &amp; Verify Your Personal AI Assistant
      </div>

      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] font-display">
          Personal AI Assistant Builder &amp; Verification Studio
        </h1>
        <p className="text-lg mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Install your 7-section <code>assistant_project_instructions.md</code> and reference Knowledge Files in{' '}
          <strong>Tab 2 (Core Instructions &amp; Files)</strong>, publish a Version Snapshot, and run your Module 12
          Normal, Missing-Detail, Boundary, and Reminder Reality-Check tests in{' '}
          <strong>Tab 3 (Testing Protocol)</strong>.
        </p>
      </header>

      <AssistantBuilderContainer studentId={user.id} moduleId={MODULES.MODULE_10_ID} />
    </div>
  );
}
