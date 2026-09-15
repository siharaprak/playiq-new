import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import ModuleIntroVideo from '@/components/modules/ModuleIntroVideo';
import ModuleOpeningHook from '@/components/modules/ModuleOpeningHook';
import ModulePdfDownload from '@/components/modules/ModulePdfDownload';
import ModuleFeedbackForm from '@/components/forms/ModuleFeedbackForm';

import { module4Nodes } from '@/data/module4Content';
const MODULE_NODES = Object.values(module4Nodes).map(n => ({ id: n.id, title: n.title }));

export default async function Module4OverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch mastered nodes for this module
  const { data: progressData } = await supabase
    .from('student_node_progress')
    .select('node_id, node_mastered')
    .eq('student_id', user.id)
    .eq('module_id', MODULES.MODULE_4_ID);

  const masteredNodeIds = new Set(
    progressData?.filter(p => p.node_mastered).map(p => p.node_id) ?? []
  );

  // Fetch assessments and check their scores/states, ordered by newest first
  const { data: assessments } = await supabase
    .from('assessment_submissions')
    .select('*')
    .eq('student_id', user.id)
    .eq('module_id', MODULES.MODULE_4_ID)
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

  const { data: existingFeedback } = await supabase
    .from('module_feedback')
    .select('rating, feedback_text')
    .eq('student_id', user.id)
    .eq('module_id', MODULES.MODULE_4_ID)
    .maybeSingle();

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      
      <Link href="/student/home" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-8 transition-colors group" style={{ color: 'var(--text-secondary)' }}>
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Dashboard</span>
      </Link>
      <div className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--neon-cyan)' }}>
        Module 4 • Skill Tree: Highest Path
      </div>

      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] font-display">
          Lesson Rescue Mode
        </h1>
        <p className="text-lg mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Diagnose confusion and fix the missing piece instead of asking AI to explain everything.
        </p>
      </header>

      <ModuleOpeningHook moduleNumber={4} title="Lesson Rescue Mode" />

      {/* Verified Student Guide PDF Download */}
      <ModulePdfDownload moduleNumber={4} title="Module 4 Student Guide: Lesson Rescue Mode" className="mb-8" />

      {/* Intro Video */}
      <ModuleIntroVideo src="/videos/module_4_intro.mp4" title="Lesson Rescue Mode" />

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
                <Link key={node.id} href={`/student/modules/4/nodes/${node.id}/lesson`} className="p-4 rounded-lg flex items-center gap-3 transition-all group hover:bg-[rgba(57,255,20,0.05)]" style={{ background: 'transparent', border: '1px solid var(--neon-green)' }}>
                  <span style={{ color: 'var(--neon-green)' }}>✓</span>
                  <span className="text-sm font-mono" style={{ color: 'var(--neon-green)' }}>Node {node.id}: {node.title}</span>
                  <span className="ml-auto text-xs px-2 py-1 rounded" style={{ background: 'transparent', border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}>MASTERED</span>
                </Link>
              );
            }

            if (isNext || !locked) {
              return (
                <Link key={node.id} href={`/student/modules/4/nodes/${node.id}/lesson`}
                  className="p-4 rounded-lg flex items-center gap-3 transition-all group"
                  style={{ background: 'transparent', border: '1px solid var(--neon-cyan)' }}>
                  <span style={{ color: 'var(--neon-cyan)' }}>○</span>
                  <span className="text-sm font-mono" style={{ color: 'var(--neon-cyan)' }}>Node {node.id}: {node.title}</span>
                  <span className="ml-auto text-xs px-2 py-1 rounded group-hover:bg-[rgba(0,200,255,0.1)] transition-colors" style={{ border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)' }}>START</span>
                </Link>
              );
            }

            return (
              <div key={node.id} className="p-4 rounded-lg flex items-center gap-3 opacity-40 cursor-not-allowed" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>🔒</span>
                <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>Node {node.id}: {node.title}</span>
                <span className="ml-auto text-xs px-2 py-1 rounded" style={{ border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>LOCKED</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Module Assessments */}
      <section className="p-6 rounded-xl border mb-8" style={{ background: 'var(--space-card)', borderColor: 'var(--glass-border)' }}>
        <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--neon-yellow)' }}>
          Module Assessments
        </h2>
        <div className="flex flex-col gap-4">
          {/* Module Quiz */}
          <div className="p-4 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: quizPassed ? 'var(--neon-green)' : quizUnlocked ? 'var(--neon-yellow)' : 'var(--glass-border)' }}>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold uppercase tracking-wider" style={{ color: quizPassed ? 'var(--neon-green)' : quizUnlocked ? 'var(--neon-yellow)' : 'var(--text-secondary)' }}>
                  Module Quiz {quizPassed && '✓ PASSED'}
                </span>
                {quiz && (
                  <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: 'rgba(255,255,255,0.05)', color: quizPassed ? 'var(--neon-green)' : 'var(--neon-yellow)' }}>
                    Score: {quiz.score_numeric}%
                  </span>
                )}
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Test your knowledge of all nodes in this module. 80% required to unlock Boss Battle.
              </p>
            </div>
            {quizUnlocked ? (
              <Link href="/student/modules/4/quiz" className="px-4 py-2 rounded text-xs font-bold uppercase tracking-wider text-center transition-all" style={{ background: 'var(--neon-yellow)', color: '#000' }}>
                {quiz ? 'Retake Quiz' : 'Take Quiz'}
              </Link>
            ) : (
              <span className="text-xs px-3 py-1.5 rounded text-center opacity-50" style={{ border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                Locked (Master All Nodes)
              </span>
            )}
          </div>

          {/* Boss Battle */}
          <div className="p-4 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: bossBattlePassed ? 'var(--neon-green)' : bossBattleUnlocked ? 'var(--neon-red)' : 'var(--glass-border)' }}>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold uppercase tracking-wider" style={{ color: bossBattlePassed ? 'var(--neon-green)' : bossBattleUnlocked ? 'var(--neon-red)' : 'var(--text-secondary)' }}>
                  Boss Battle {bossBattlePassed && '✓ PASSED'}
                </span>
                {bossBattle && (
                  <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: 'rgba(255,255,255,0.05)', color: bossBattlePassed ? 'var(--neon-green)' : 'var(--neon-red)' }}>
                    Score: {bossBattle.score_numeric}/5
                  </span>
                )}
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Face the ultimate challenge for this module. Requires passing the Module Quiz.
              </p>
            </div>
            {bossBattleUnlocked ? (
              <Link href="/student/modules/4/boss-battle" className="px-4 py-2 rounded text-xs font-bold uppercase tracking-wider text-center transition-all" style={{ background: 'var(--neon-red)', color: '#fff' }}>
                {bossBattle ? 'Replay Battle' : 'Enter Battle'}
              </Link>
            ) : (
              <span className="text-xs px-3 py-1.5 rounded text-center opacity-50" style={{ border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                Locked (Pass Quiz First)
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Proof Artifacts */}
      <section className="p-6 rounded-xl border mb-8" style={{ background: 'var(--space-card)', borderColor: artifactsUnlocked ? 'var(--neon-cyan)' : 'var(--glass-border)' }}>
        <h2 className="text-xl font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--neon-cyan)' }}>
          Proof Artifacts
        </h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Submit your work from this module to earn your badge.
        </p>
        {artifactsUnlocked ? (
          <Link href="/student/modules/4/proof-artifacts" className="inline-block px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all" style={{ background: 'var(--neon-cyan)', color: '#000' }}>
            View &amp; Submit Artifacts →
          </Link>
        ) : (
          <span className="text-xs px-3 py-1.5 rounded opacity-50 inline-block" style={{ border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
            Locked (Complete Boss Battle)
          </span>
        )}
      </section>

      {/* Module Feedback Form */}
      <section className="mt-4">
        <ModuleFeedbackForm moduleId={MODULES.MODULE_4_ID} initialFeedback={existingFeedback} />
      </section>
    </div>
  );
}
