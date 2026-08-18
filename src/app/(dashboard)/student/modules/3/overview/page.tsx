import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import ModuleIntroVideo from '@/components/modules/ModuleIntroVideo';
import ModuleOpeningHook from '@/components/modules/ModuleOpeningHook';

import { module3Nodes } from '@/data/module3Content';
const MODULE_NODES = Object.values(module3Nodes).map(n => ({ id: n.id, title: n.title }));

export default async function Module3OverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch mastered nodes for this module
  const { data: progressData } = await supabase
    .from('student_node_progress')
    .select('node_id, node_mastered')
    .eq('student_id', user.id)
    .eq('module_id', MODULES.MODULE_3_ID);

  const masteredNodeIds = new Set(
    progressData?.filter(p => p.node_mastered).map(p => p.node_id) ?? []
  );

  // Fetch assessments and check their scores/states, ordered by newest first
  const { data: assessments } = await supabase
    .from('assessment_submissions')
    .select('*')
    .eq('student_id', user.id)
    .eq('module_id', MODULES.MODULE_3_ID)
    .order('created_at', { ascending: false });

  // Check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin';

  const quiz = assessments?.find(a => a.assessment_type === 'module_quiz');
  const bossBattle = assessments?.find(a => a.assessment_type === 'boss_battle');

  const quizUnlocked = isAdmin || masteredNodeIds.size >= MODULE_NODES.length;
  const quizPassed = quiz && quiz.score_numeric >= 80;

  const bossBattleUnlocked = isAdmin || quizPassed;
  const bossBattlePassed = bossBattle && bossBattle.score_numeric >= 4;

  const artifactsUnlocked = isAdmin || bossBattlePassed;

  // Find first unlocked node (first not mastered)
  const firstActiveNodeId = MODULE_NODES.find(n => !masteredNodeIds.has(n.id))?.id ?? '1';

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      
      <Link href="/student/home" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-8 transition-colors group" style={{ color: 'var(--text-secondary)' }}>
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Dashboard</span>
      </Link>
<div className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--neon-cyan)' }}>
        Module 3 • Skill Tree: Pre-Learn System
      </div>

      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] font-display">
          Pre-Learn System
        </h1>
        <p className="text-lg mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Get a head start on a school topic before class using AI as a coach.</p>
      </header>

      <ModuleOpeningHook moduleNumber={3} title="Pre-Learn System" />

      {/* Intro Video */}
      <ModuleIntroVideo src="/videos/module_3_intro.mp4" title="Pre-Learn System" />

      {/* What You'll Learn */}
      <section className="p-6 rounded-xl border mb-8" style={{ background: 'var(--space-card)', borderColor: 'var(--neon-cyan)' }}>
        <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--neon-cyan)' }}>
          What You&apos;ll Learn
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <div>
            <p className="font-bold mb-2" style={{ color: 'var(--neon-green)' }}>Used well, technology can help you:</p>
            <ul className="space-y-1 list-none">
              {['Become more focused', 'Learn faster', 'Create better work', 'Make smarter decisions'].map(item => (
                <li key={item} className="flex items-center gap-2"><span style={{ color: 'var(--neon-cyan)' }}>✓</span> {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold mb-2 text-red-500">Used badly, it can:</p>
            <ul className="space-y-1 list-none">
              {['Distract you', 'Weaken your focus', 'Make you believe things too quickly', 'Turn you into a passive consumer'].map(item => (
                <li key={item} className="flex items-center gap-2"><span className="text-red-500">✗</span> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Skill Tree Nodes */}
      <section className="p-6 rounded-xl border mb-8" style={{ background: 'var(--space-card)', borderColor: 'var(--glass-border)' }}>
        <h2 className="text-xl font-bold mb-6 uppercase tracking-wider" style={{ color: 'var(--neon-purple)' }}>
          Skill Tree
        </h2>
        <div className="flex flex-col gap-3">
          {MODULE_NODES.map((node, idx) => {
            const mastered = masteredNodeIds.has(node.id);
            const isNext = node.id === firstActiveNodeId && !mastered;
            const locked = !isAdmin && !mastered && !isNext && idx > 0 && !masteredNodeIds.has(MODULE_NODES[idx - 1]?.id ?? '');

            if (mastered) {
              return (
                <Link key={node.id} href={`/student/modules/3/nodes/${node.id}/lesson`} className="p-4 rounded-lg flex items-center gap-3 transition-all group hover:bg-[rgba(57,255,20,0.05)]" style={{ background: 'transparent', border: '1px solid var(--neon-green)' }}>
                  <span style={{ color: 'var(--neon-green)' }}>✓</span>
                  <span className="text-sm font-mono" style={{ color: 'var(--neon-green)' }}>Node {node.id}: {node.title}</span>
                  <span className="ml-auto text-xs px-2 py-1 rounded" style={{ background: 'transparent', border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}>MASTERED</span>
                </Link>
              );
            }

            if (isNext || !locked) {
              return (
                <Link key={node.id} href={`/student/modules/3/nodes/${node.id}/lesson`}
                  className="p-4 rounded-lg flex items-center gap-3 transition-all group"
                  style={{ background: 'transparent', border: '1px solid var(--neon-cyan)' }}>
                  <span style={{ color: 'var(--neon-cyan)' }}>→</span>
                  <span className="text-sm font-mono text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)] transition-colors">Node {node.id}: {node.title}</span>
                  {isNext && <span className="ml-auto text-xs px-2 py-1 rounded" style={{ background: 'transparent', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)' }}>START</span>}
                </Link>
              );
            }

            return (
              <div key={node.id} className="p-4 rounded-lg flex items-center gap-3 opacity-50 cursor-not-allowed" style={{ border: '1px solid var(--glass-border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>🔒</span>
                <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Node {node.id}: {node.title} (Locked)</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Assessments */}
      <section className="p-6 rounded-xl border" style={{ background: 'var(--space-card)', borderColor: 'var(--neon-purple)' }}>
        <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--neon-purple)' }}>
          Module Assessments
        </h2>
        <div className="flex flex-col gap-3">
          {quizUnlocked ? (
            <Link href="/student/modules/3/quiz" className="p-4 rounded-lg flex items-center justify-between transition-all group hover:bg-[rgba(0,200,255,0.05)]" style={{ background: 'transparent', border: '1px solid var(--neon-cyan)' }}>
              <span className="text-sm font-mono text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)] transition-colors">Module Quiz — Pre-Learn System Quiz</span>
              {quizPassed ? (
                <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}>PASSED ({quiz.score_numeric}%)</span>
              ) : quiz ? (
                <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid #ef4444', color: '#ef4444' }}>FAILED ({quiz.score_numeric}%) - RETRY</span>
              ) : (
                <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)' }}>START</span>
              )}
            </Link>
          ) : (
            <div className="p-4 rounded-lg opacity-50 cursor-not-allowed" style={{ border: '1px solid var(--glass-border)' }}>
              <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Module Quiz — Requires {MODULE_NODES.length} Nodes Mastered</span>
            </div>
          )}

          {bossBattleUnlocked ? (
            <Link href="/student/modules/3/boss-battle" className="p-4 rounded-lg flex items-center justify-between transition-all group hover:bg-[rgba(123,79,206,0.05)]" style={{ background: 'transparent', border: '1px solid var(--neon-purple)' }}>
              <span className="text-sm font-mono text-[var(--text-primary)] group-hover:text-[var(--neon-purple)] transition-colors">Boss Battle — Module 3 Challenge</span>
              {bossBattlePassed ? (
                <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}>COMPLETED</span>
              ) : (
                <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid var(--neon-purple)', color: 'var(--neon-purple)' }}>START</span>
              )}
            </Link>
          ) : (
            <div className="p-4 rounded-lg opacity-50 cursor-not-allowed" style={{ border: '1px solid var(--glass-border)' }}>
              <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Boss Battle — Requires Quiz 80%+</span>
            </div>
          )}

          {artifactsUnlocked ? (
            <Link href="/student/modules/3/proof-artifacts" className="p-4 rounded-lg flex items-center justify-between transition-all group hover:bg-[rgba(123,79,206,0.05)]" style={{ background: 'transparent', border: '1px solid #7b4fce' }}>
              <span className="text-sm font-mono text-[var(--text-primary)] group-hover:text-[#7b4fce] transition-colors">Proof Artifacts — Submit Artifacts</span>
              <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid #7b4fce', color: '#7b4fce' }}>OPEN</span>
            </Link>
          ) : (
            <div className="p-4 rounded-lg opacity-50 cursor-not-allowed" style={{ border: '1px solid var(--glass-border)' }}>
              <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Proof Artifacts — Requires Boss Battle</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
