import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import ModuleIntroVideo from '@/components/modules/ModuleIntroVideo';
import ModuleOpeningHook from '@/components/modules/ModuleOpeningHook';

const MODULE_NODES = [
  { id: '1', title: 'What AI Is Good At vs Bad At' },
  { id: '2', title: 'Choosing the Right AI Mode' },
  { id: '3', title: 'Ask Better Questions' },
  { id: '4', title: 'Verify Before You Believe' },
];

export default async function Module1OverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch mastered nodes for this module
  const { data: progressData } = await supabase
    .from('student_node_progress')
    .select('node_id, node_mastered')
    .eq('student_id', user.id)
    .eq('module_id', MODULES.MODULE_1_ID);

  const masteredNodeIds = new Set(
    progressData?.filter(p => p.node_mastered).map(p => p.node_id) ?? []
  );

  // Fetch assessments and check their scores/states, ordered by newest first
  const { data: assessments } = await supabase
    .from('assessment_submissions')
    .select('*')
    .eq('student_id', user.id)
    .eq('module_id', MODULES.MODULE_1_ID)
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

  const quizUnlocked = isAdmin || masteredNodeIds.size >= 4;
  const quizPassed = quiz && quiz.score_numeric >= 80;

  const bossBattleUnlocked = isAdmin || quizPassed;
  const bossBattlePassed = bossBattle && bossBattle.score_numeric >= 4;

  const artifactsUnlocked = isAdmin || bossBattlePassed;

  // Find first unlocked node (first not mastered)
  const firstActiveNodeId = MODULE_NODES.find(n => !masteredNodeIds.has(n.id))?.id ?? '1';

  return (
    <div className="flex flex-col min-h-screen px-4 sm:px-6 py-6 sm:py-12 max-w-4xl mx-auto">
      
      <Link href="/student/home" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 sm:mb-8 transition-colors group min-h-[36px]" style={{ color: 'var(--text-secondary)' }}>
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Dashboard</span>
      </Link>
      <div className="mb-2 sm:mb-4 text-xs sm:text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--neon-cyan)' }}>
        Module 1 • Skill Tree: Foundation
      </div>

      <header className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight font-display" style={{ color: 'var(--text-primary)' }}>
          AI Learning Code
        </h1>
        <p className="text-sm sm:text-lg mt-2 sm:mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Master the foundation of using AI as a coach, not a shortcut.
        </p>
      </header>

      <ModuleOpeningHook moduleNumber={1} title="AI Learning Code" />

      {/* Intro Video */}
      <ModuleIntroVideo src="/videos/module_1_intro.mp4" title="AI Learning Code" />

      {/* What You'll Learn */}
      <section className="p-6 rounded-xl border mb-8" style={{ background: 'var(--space-card)', borderColor: 'var(--neon-cyan)' }}>
        <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--neon-cyan)' }}>
          What You&apos;ll Learn
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <div>
            <p className="font-bold mb-2" style={{ color: 'var(--neon-green)' }}>AI is excellent at:</p>
            <ul className="space-y-1 list-none">
              {['Explaining ideas in different ways', 'Providing specific examples', 'Breaking down hard topics', 'Quizzing your understanding'].map(item => (
                <li key={item} className="flex items-center gap-2"><span style={{ color: 'var(--neon-cyan)' }}>✓</span> {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold mb-2 text-red-500">AI is terrible at:</p>
            <ul className="space-y-1 list-none">
              {['Always being 100% correct', 'Knowing your teachers exact expectations', 'Knowing what information is missing', 'Replacing your own judgment'].map(item => (
                <li key={item} className="flex items-center gap-2"><span className="text-red-500">✗</span> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Skill Tree Nodes */}
      <section className="p-4 sm:p-6 rounded-xl border mb-6 sm:mb-8" style={{ background: 'var(--space-card)', borderColor: 'var(--glass-border)' }}>
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 uppercase tracking-wider" style={{ color: 'var(--neon-purple)' }}>
          Skill Tree
        </h2>
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {MODULE_NODES.map((node, idx) => {
            const mastered = masteredNodeIds.has(node.id);
            const isNext = node.id === firstActiveNodeId && !mastered;
            const locked = !isAdmin && !mastered && !isNext && idx > 0 && !masteredNodeIds.has(MODULE_NODES[idx - 1]?.id ?? '');

            if (mastered) {
              return (
                <Link key={node.id} href={`/student/modules/1/nodes/${node.id}/lesson`} className="p-3.5 sm:p-4 min-h-[44px] rounded-lg flex items-center gap-3 transition-all group hover:bg-[rgba(57,255,20,0.05)] active:scale-[0.99]" style={{ background: 'transparent', border: '1px solid var(--neon-green)' }}>
                  <span style={{ color: 'var(--neon-green)' }}>✓</span>
                  <span className="text-xs sm:text-sm font-mono" style={{ color: 'var(--text-primary)' }}>Node {node.id}: {node.title}</span>
                  <span className="ml-auto text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded font-mono" style={{ background: 'transparent', border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}>MASTERED</span>
                </Link>
              );
            }

            if (isNext || !locked) {
              return (
                <Link key={node.id} href={`/student/modules/1/nodes/${node.id}/lesson`}
                  className="p-3.5 sm:p-4 min-h-[44px] rounded-lg flex items-center gap-3 transition-all group active:scale-[0.99]"
                  style={{ background: 'transparent', border: '1px solid var(--neon-cyan)' }}>
                  <span style={{ color: 'var(--neon-cyan)' }}>→</span>
                  <span className="text-xs sm:text-sm font-mono transition-colors" style={{ color: 'var(--text-primary)' }}>Node {node.id}: <span className="group-hover:text-[var(--neon-cyan)]">{node.title}</span></span>
                  {isNext && <span className="ml-auto text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded font-mono" style={{ background: 'transparent', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)' }}>START</span>}
                </Link>
              );
            }

            return (
              <div key={node.id} className="p-3.5 sm:p-4 min-h-[44px] rounded-lg flex items-center gap-3 opacity-50 cursor-not-allowed" style={{ border: '1px solid var(--glass-border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>🔒</span>
                <span className="text-xs sm:text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Node {node.id}: {node.title} (Locked)</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Assessments */}
      <section className="p-4 sm:p-6 rounded-xl border" style={{ background: 'var(--space-card)', borderColor: 'var(--neon-purple)' }}>
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 uppercase tracking-wider" style={{ color: 'var(--neon-purple)' }}>
          Module Assessments
        </h2>
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {/* Module Quiz */}
          {quizUnlocked ? (
            <Link href="/student/modules/1/quiz" className="p-3.5 sm:p-4 min-h-[44px] rounded-lg flex items-center justify-between transition-all group hover:bg-[rgba(0,200,255,0.05)] active:scale-[0.99]" style={{ background: 'transparent', border: '1px solid var(--neon-cyan)' }}>
              <span className="text-xs sm:text-sm font-mono text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)] transition-colors pr-2">Module Quiz — 1Q AI Learning Code Quiz</span>
              {quizPassed ? (
                <span className="text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded flex-shrink-0 font-mono" style={{ border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}>PASSED ({quiz.score_numeric}%)</span>
              ) : quiz ? (
                <span className="text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded flex-shrink-0 font-mono" style={{ border: '1px solid #ef4444', color: '#ef4444' }}>FAILED ({quiz.score_numeric}%) - RETRY</span>
              ) : (
                <span className="text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded flex-shrink-0 font-mono" style={{ border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)' }}>START</span>
              )}
            </Link>
          ) : (
            <div className="p-3.5 sm:p-4 min-h-[44px] rounded-lg opacity-50 cursor-not-allowed flex items-center" style={{ border: '1px solid var(--glass-border)' }}>
              <span className="text-xs sm:text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Module Quiz — Requires 4 Nodes Mastered</span>
            </div>
          )}

          {/* Boss Battle */}
          {bossBattleUnlocked ? (
            <Link href="/student/modules/1/boss-battle" className="p-3.5 sm:p-4 min-h-[44px] rounded-lg flex items-center justify-between transition-all group hover:bg-[rgba(123,79,206,0.05)] active:scale-[0.99]" style={{ background: 'transparent', border: '1px solid var(--neon-purple)' }}>
              <span className="text-xs sm:text-sm font-mono text-[var(--text-primary)] group-hover:text-[var(--neon-purple)] transition-colors pr-2">Boss Battle — 1B AI Learning Code Challenge</span>
              {bossBattlePassed ? (
                <span className="text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded flex-shrink-0 font-mono" style={{ border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}>COMPLETED</span>
              ) : (
                <span className="text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded flex-shrink-0 font-mono" style={{ border: '1px solid var(--neon-purple)', color: 'var(--neon-purple)' }}>START</span>
              )}
            </Link>
          ) : (
            <div className="p-3.5 sm:p-4 min-h-[44px] rounded-lg opacity-50 cursor-not-allowed flex items-center" style={{ border: '1px solid var(--glass-border)' }}>
              <span className="text-xs sm:text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Boss Battle — Requires Quiz 80%+</span>
            </div>
          )}

          {/* Proof Artifacts */}
          {artifactsUnlocked ? (
            <Link href="/student/modules/1/proof-artifacts" className="p-3.5 sm:p-4 min-h-[44px] rounded-lg flex items-center justify-between transition-all group hover:bg-[rgba(123,79,206,0.05)] active:scale-[0.99]" style={{ background: 'transparent', border: '1px solid #7b4fce' }}>
              <span className="text-xs sm:text-sm font-mono text-[var(--text-primary)] group-hover:text-[#7b4fce] transition-colors pr-2">Proof Artifacts — Submit Warrior Code</span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded flex-shrink-0 font-mono" style={{ border: '1px solid #7b4fce', color: '#7b4fce' }}>OPEN</span>
            </Link>
          ) : (
            <div className="p-3.5 sm:p-4 min-h-[44px] rounded-lg opacity-50 cursor-not-allowed flex items-center" style={{ border: '1px solid var(--glass-border)' }}>
              <span className="text-xs sm:text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Proof Artifacts — Requires Boss Battle</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
