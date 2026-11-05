import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import AssistantBuilderContainer from '@/components/assistant/AssistantBuilderContainer';

export default async function AssistantBuilderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="flex flex-col min-h-screen px-6 pt-24 pb-12 max-w-4xl mx-auto">
      <Link
        href="/student/modules/11/overview"
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-8 transition-colors group"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Module 11 Overview</span>
      </Link>

      <div className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--neon-cyan)' }}>
        Module 11 • Build Your Personal AI Assistant
      </div>

      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] font-display">
          Personal AI Assistant Builder
        </h1>
        <p className="text-lg mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Design, configure, and document your separate <strong>PlayIQ Assistant Project</strong> (distinct from your
          Module 00 Tutor Project). Define its one clear job, target user, 6-file{' '}
          <code>PlayIQ_Assistant_Kit</code>, and safety boundaries before testing in Module 12.
        </p>
      </header>

      <AssistantBuilderContainer studentId={user.id} moduleId={MODULES.MODULE_10_ID} />
    </div>
  );
}

