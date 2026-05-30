import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';

export default async function ParentModule1View() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch the first linked apprentice
  const { data: link } = await supabase
    .from('parent_child_links')
    .select('student_id')
    .eq('parent_id', user.id)
    .limit(1)
    .single();

  const studentId = link?.student_id;

  // Fetch progress, submissions and artifacts
  let progress: any[] = [];
  let assessments: any[] = [];
  let artifacts: any[] = [];
  let signals: any[] = [];
  
  if (studentId) {
    const [progRes, assmRes, artRes, sigRes] = await Promise.all([
      supabase.from('student_node_progress').select('*').eq('student_id', studentId).eq('module_id', MODULES.MODULE_1_ID),
      supabase.from('assessment_submissions').select('*').eq('student_id', studentId).eq('module_id', MODULES.MODULE_1_ID).order('created_at', { ascending: false }),
      supabase.from('proof_artifact_submissions').select('*').eq('student_id', studentId).eq('module_id', MODULES.MODULE_1_ID).order('created_at', { ascending: false }),
      supabase.from('fingerprint_signals').select('*').eq('student_id', studentId).eq('module_id', MODULES.MODULE_1_ID)
    ]);
    progress = progRes.data || [];
    assessments = assmRes.data || [];
    artifacts = artRes.data || [];
    signals = sigRes.data || [];
  }

  const node1 = progress.find(p => p.node_id === '1');
  const node2 = progress.find(p => p.node_id === '2');
  const node3 = progress.find(p => p.node_id === '3');
  const node4 = progress.find(p => p.node_id === '4');

  const quiz = assessments.find(a => a.assessment_type === 'module_quiz');
  const bossBattle = assessments.find(a => a.assessment_type === 'boss_battle');

  const studyRules = artifacts.find(a => a.artifact_type === 'study_rules');
  const errorReview = artifacts.find(a => a.artifact_type === 'error_review');

  const getSignal = (type: string) => signals.find(s => s.signal_type === type)?.signal_value || 'Pending data collection...';

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-5xl mx-auto">
      <header className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard • Module 1</h1>
        <p className="text-muted-foreground mt-2">Visibility into AI Learning Code mastery.</p>
        {!studentId && <p className="text-red-500 mt-2">No apprentice linked yet.</p>}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress & Scores */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Module Progress</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className={node1?.node_mastered ? "text-green-500" : "text-muted-foreground"}>{node1?.node_mastered ? "✓" : "○"}</span> Node 1: AI Strengths
              </li>
              <li className="flex items-center gap-3">
                <span className={node2?.node_mastered ? "text-green-500" : "text-muted-foreground"}>{node2?.node_mastered ? "✓" : "○"}</span> Node 2: AI Modes
              </li>
              <li className="flex items-center gap-3">
                <span className={node3?.node_mastered ? "text-green-500" : "text-muted-foreground"}>{node3?.node_mastered ? "✓" : "○"}</span> Node 3: Question Laddering
              </li>
              <li className="flex items-center gap-3">
                <span className={node4?.node_mastered ? "text-green-500" : "text-muted-foreground"}>{node4?.node_mastered ? "✓" : "○"}</span> Node 4: Verification Habit
              </li>
            </ul>
          </section>

          <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Module Quiz</h3>
              <p className="text-3xl font-bold text-primary">{quiz ? `${quiz.score_numeric}%` : '--'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Boss Battle</h3>
              <p className="text-3xl font-bold text-amber-500">{bossBattle ? `${bossBattle.score_numeric}/5` : '--'}</p>
            </div>
          </section>
          
          <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Artifact Links</h2>
            <div className="flex flex-col gap-2">
              <span className={studyRules ? "text-blue-500" : "text-muted-foreground"}>📄 My AI Study Rules ({studyRules ? 'Submitted' : 'Pending'})</span>
              <span className={errorReview ? "text-blue-500" : "text-muted-foreground"}>📄 AI Error Review Sheet ({errorReview ? 'Submitted' : 'Pending'})</span>
            </div>
          </section>
        </div>

        {/* Fingerprint Bullet Summaries */}
        <div className="space-y-6">
          <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm h-full">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Fingerprint Insights</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold">Explanation Preference</p>
                <p className="text-sm text-muted-foreground">{getSignal('explanation_preference')}</p>
              </div>
              <div>
                <p className="text-sm font-bold">Mode Preference</p>
                <p className="text-sm text-muted-foreground">{getSignal('mode_preference')}</p>
              </div>
              <div>
                <p className="text-sm font-bold">Shortcut Tendency</p>
                <p className="text-sm text-muted-foreground">{getSignal('shortcut_tendency')}</p>
              </div>
              <div>
                <p className="text-sm font-bold">Integrity Snapshot</p>
                <p className="text-sm text-muted-foreground">{getSignal('integrity_snapshot')}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
