import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import {
  getCourseModuleNodeKey,
  getDbModuleIdForCourseModule,
} from '@/lib/constants';
import { enforceSequentialModuleUnlock } from '@/lib/gating';
import { COURSE_MODULES_3_TO_12_CONFIG } from '@/data/courseModules3To12Meta';
import type { NodeContent } from '@/data/module1Content';
import ModuleIntroVideo from '@/components/modules/ModuleIntroVideo';
import ModuleOpeningHook from '@/components/modules/ModuleOpeningHook';
import ModulePdfDownload from '@/components/modules/ModulePdfDownload';
import Module9TutorGenerator from '@/components/modules/Module9TutorGenerator';
import ModuleLearningRecordPanel from '@/components/modules/ModuleLearningRecordPanel';
import ModuleFeedbackForm from '@/components/forms/ModuleFeedbackForm';
import { getStudentStagedRules } from '@/lib/tutor/rule-staging';

interface CourseModuleOverviewViewProps {
  moduleNum: number;
  nodesRecord: Record<string, NodeContent>;
}

export default async function CourseModuleOverviewView({
  moduleNum,
  nodesRecord,
}: CourseModuleOverviewViewProps) {
  const config = COURSE_MODULES_3_TO_12_CONFIG[moduleNum];
  const moduleNodes = Object.values(nodesRecord).map(n => ({ id: n.id, title: n.title }));
  const dbModuleId = getDbModuleIdForCourseModule(moduleNum);

  const { user, isAdmin: isRoleAdmin } = await enforceSequentialModuleUnlock(moduleNum);
  const supabase = await createClient();

  // Fetch mastered nodes for this module
  const { data: progressData } = await supabase
    .from('student_node_progress')
    .select('node_id, node_mastered')
    .eq('student_id', user.id)
    .eq('module_id', dbModuleId);

  const masteredDbKeys = new Set(
    progressData?.filter(p => p.node_mastered).map(p => String(p.node_id)) ?? []
  );

  const isNodeMastered = (routeNodeId: string) =>
    masteredDbKeys.has(getCourseModuleNodeKey(moduleNum, routeNodeId));

  const masteredCount = moduleNodes.filter(n => isNodeMastered(n.id)).length;

  // Fetch assessments and check their scores/states, ordered by newest first
  const { data: rawAssessments } = await supabase
    .from('assessment_submissions')
    .select('*')
    .eq('student_id', user.id)
    .eq('module_id', dbModuleId)
    .order('created_at', { ascending: false });

  const assessments = (rawAssessments || []).filter((a: any) => {
    if (moduleNum >= 10) {
      return Number(a.submission_payload?.courseModuleNumber) === moduleNum;
    }
    return (
      a.submission_payload?.courseModuleNumber === undefined ||
      Number(a.submission_payload?.courseModuleNumber) === moduleNum
    );
  });

  // Check profile role & name
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, username, full_name')
    .eq('id', user.id)
    .maybeSingle();

  const studentName = (profile as any)?.username || profile?.full_name || 'Student';
  const isAdmin = isRoleAdmin || profile?.role === 'admin';

  const quiz = assessments.find((a: any) => a.assessment_type === 'module_quiz');
  const bossBattle = assessments.find((a: any) => a.assessment_type === 'boss_battle');

  const quizUnlocked = isAdmin || masteredCount >= moduleNodes.length;
  const quizPassed = Boolean(quiz && quiz.score_numeric >= 80);

  const bossBattleUnlocked = isAdmin || quizPassed;
  const bossBattlePassed = Boolean(bossBattle && bossBattle.score_numeric >= 4);

  const artifactsUnlocked = isAdmin || bossBattlePassed;

  // Find first unlocked node (first not mastered)
  const firstActiveNodeId = moduleNodes.find(n => !isNodeMastered(n.id))?.id ?? '1';

  const stagedRules = moduleNum === 9 ? await getStudentStagedRules(user.id) : null;

  const { data: existingFeedback } =
    moduleNum === 9
      ? await supabase
          .from('module_feedback')
          .select('rating, feedback_text')
          .eq('student_id', user.id)
          .eq('module_id', dbModuleId)
          .maybeSingle()
      : { data: null };

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
        {config.skillTreeSubtitle}
      </div>

      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] font-display">
          {config.title}
        </h1>
        <p className="text-lg mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {config.subtitle}
        </p>
      </header>

      <ModuleOpeningHook moduleNumber={moduleNum} title={config.title} />

      {/* Verified Student Guide PDF Download */}
      <ModulePdfDownload moduleNumber={moduleNum} title={config.pdfTitle} className="mb-8" />

      {/* Intro Video (for Modules 3-9 where video asset exists) */}
      {config.videoSrc && <ModuleIntroVideo src={config.videoSrc} title={config.title} />}

      {/* Module 9 Exclusive: 6-File PlayIQ_Tutor_Kit Generator */}
      {moduleNum === 9 && stagedRules && (
        <section className="mb-8 space-y-4">
          <Module9TutorGenerator stagedRules={stagedRules} studentName={studentName} />
        </section>
      )}

      {/* Interactive Digital Lesson Choices & Learning Record Panel */}
      <ModuleLearningRecordPanel
        moduleNumber={moduleNum}
        showChoices={true}
        showRecordForm={moduleNum >= 9}
        showBetaFeedback={false}
        title={`Module ${moduleNum} • Interactive Lesson Choices & Learning Record`}
      />

      {/* What You'll Learn */}
      <section
        className="p-6 rounded-xl border mb-8"
        style={{ background: 'var(--space-card)', borderColor: 'var(--neon-cyan)' }}
      >
        <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--neon-cyan)' }}>
          What You&apos;ll Master in Module {moduleNum}
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <div>
            <p className="font-bold mb-2" style={{ color: 'var(--neon-green)' }}>
              High-Leverage PlayIQ Moves:
            </p>
            <ul className="space-y-1.5 list-none">
              {config.whatYouWillLearnGood.map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: 'var(--neon-cyan)' }}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold mb-2 text-red-400">Traps &amp; Shortcuts to Avoid:</p>
            <ul className="space-y-1.5 list-none">
              {config.whatYouWillAvoidBad.map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Skill Tree Nodes */}
      <section
        className="p-6 rounded-xl border mb-8"
        style={{ background: 'var(--space-card)', borderColor: 'var(--glass-border)' }}
      >
        <h2 className="text-xl font-bold mb-6 uppercase tracking-wider" style={{ color: 'var(--neon-purple)' }}>
          Skill Tree ({moduleNodes.length} Nodes)
        </h2>
        <div className="flex flex-col gap-3">
          {moduleNodes.map((node) => {
            const mastered = isNodeMastered(node.id);
            const isNext = node.id === firstActiveNodeId && !mastered;
            const locked = !isAdmin && !mastered && !isNext;

            if (mastered) {
              return (
                <Link
                  key={node.id}
                  href={`/student/modules/${moduleNum}/nodes/${node.id}/lesson`}
                  className="p-4 rounded-lg flex items-center gap-3 transition-all group hover:bg-[rgba(57,255,20,0.05)]"
                  style={{ background: 'transparent', border: '1px solid var(--neon-green)' }}
                >
                  <span style={{ color: 'var(--neon-green)' }}>✓</span>
                  <span className="text-sm font-mono" style={{ color: 'var(--neon-green)' }}>
                    Node {node.id}: {node.title}
                  </span>
                  <span
                    className="ml-auto text-xs px-2 py-1 rounded"
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--neon-green)',
                      color: 'var(--neon-green)',
                    }}
                  >
                    MASTERED
                  </span>
                </Link>
              );
            }

            if (isNext || !locked) {
              return (
                <Link
                  key={node.id}
                  href={`/student/modules/${moduleNum}/nodes/${node.id}/lesson`}
                  className="p-4 rounded-lg flex items-center gap-3 transition-all group"
                  style={{ background: 'transparent', border: '1px solid var(--neon-cyan)' }}
                >
                  <span style={{ color: 'var(--neon-cyan)' }}>→</span>
                  <span className="text-sm font-mono text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)] transition-colors">
                    Node {node.id}: {node.title}
                  </span>
                  {isNext && (
                    <span
                      className="ml-auto text-xs px-2 py-1 rounded"
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--neon-cyan)',
                        color: 'var(--neon-cyan)',
                      }}
                    >
                      START
                    </span>
                  )}
                </Link>
              );
            }

            return (
              <div
                key={node.id}
                className="p-4 rounded-lg flex items-center gap-3 opacity-50 cursor-not-allowed"
                style={{ border: '1px solid var(--glass-border)' }}
              >
                <span style={{ color: 'var(--text-muted)' }}>🔒</span>
                <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                  Node {node.id}: {node.title} (Locked)
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Assessments */}
      <section
        className="p-6 rounded-xl border"
        style={{ background: 'var(--space-card)', borderColor: 'var(--neon-purple)' }}
      >
        <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--neon-purple)' }}>
          Module Assessments
        </h2>
        <div className="flex flex-col gap-3">
          {quizUnlocked ? (
            <Link
              href={`/student/modules/${moduleNum}/quiz`}
              className="p-4 rounded-lg flex items-center justify-between transition-all group hover:bg-[rgba(0,200,255,0.05)]"
              style={{ background: 'transparent', border: '1px solid var(--neon-cyan)' }}
            >
              <span className="text-sm font-mono text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)] transition-colors">
                {config.quizTitle}
              </span>
              {quizPassed ? (
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{ border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}
                >
                  PASSED ({quiz.score_numeric}%)
                </span>
              ) : quiz ? (
                <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid #ef4444', color: '#ef4444' }}>
                  FAILED ({quiz.score_numeric}%) - RETRY
                </span>
              ) : (
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{ border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)' }}
                >
                  START
                </span>
              )}
            </Link>
          ) : (
            <div className="p-4 rounded-lg opacity-50 cursor-not-allowed" style={{ border: '1px solid var(--glass-border)' }}>
              <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                Module Quiz — Requires {moduleNodes.length} Nodes Mastered
              </span>
            </div>
          )}

          {bossBattleUnlocked ? (
            <Link
              href={`/student/modules/${moduleNum}/boss-battle`}
              className="p-4 rounded-lg flex items-center justify-between transition-all group hover:bg-[rgba(123,79,206,0.05)]"
              style={{ background: 'transparent', border: '1px solid var(--neon-purple)' }}
            >
              <span className="text-sm font-mono text-[var(--text-primary)] group-hover:text-[var(--neon-purple)] transition-colors">
                Boss Battle — {config.bossBattleTitle}
              </span>
              {bossBattlePassed ? (
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{ border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}
                >
                  COMPLETED
                </span>
              ) : (
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{ border: '1px solid var(--neon-purple)', color: 'var(--neon-purple)' }}
                >
                  START
                </span>
              )}
            </Link>
          ) : (
            <div className="p-4 rounded-lg opacity-50 cursor-not-allowed" style={{ border: '1px solid var(--glass-border)' }}>
              <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                Boss Battle — Requires Quiz 80%+
              </span>
            </div>
          )}

          {artifactsUnlocked ? (
            <Link
              href={`/student/modules/${moduleNum}/proof-artifacts`}
              className="p-4 rounded-lg flex items-center justify-between transition-all group hover:bg-[rgba(123,79,206,0.05)]"
              style={{ background: 'transparent', border: '1px solid #7b4fce' }}
            >
              <span className="text-sm font-mono text-[var(--text-primary)] group-hover:text-[#7b4fce] transition-colors">
                Proof Artifacts — Submit Module {moduleNum} Proof Record
              </span>
              <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid #7b4fce', color: '#7b4fce' }}>
                OPEN
              </span>
            </Link>
          ) : (
            <div className="p-4 rounded-lg opacity-50 cursor-not-allowed" style={{ border: '1px solid var(--glass-border)' }}>
              <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                Proof Artifacts — Requires Boss Battle
              </span>
            </div>
          )}

          {moduleNum === 9 && (
            <Link
              href="/student/modules/9/tutor-builder"
              className="p-4 rounded-lg flex items-center justify-between transition-all group hover:bg-[rgba(0,200,255,0.05)]"
              style={{ background: 'transparent', border: '1px solid var(--neon-cyan)' }}
            >
              <span className="text-sm font-mono text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)] transition-colors">
                Tutor Kit &amp; Profile Workspace — Review PlayIQ Tutor Project Files
              </span>
              <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)' }}>
                OPEN WORKSPACE
              </span>
            </Link>
          )}

          {moduleNum === 11 && (
            <Link
              href="/student/modules/11/assistant-builder"
              className="p-4 rounded-lg flex items-center justify-between transition-all group hover:bg-[rgba(0,200,255,0.05)]"
              style={{ background: 'transparent', border: '1px solid var(--neon-cyan)' }}
            >
              <span className="text-sm font-mono text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)] transition-colors">
                Personal AI Assistant Builder — Configure Your Separate Assistant Project
              </span>
              <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)' }}>
                OPEN BUILDER
              </span>
            </Link>
          )}
        </div>
      </section>

      {moduleNum === 9 && (
        <section className="mt-8">
          <ModuleFeedbackForm moduleId={dbModuleId} initialFeedback={existingFeedback} />
        </section>
      )}
    </div>
  );
}
