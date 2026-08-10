import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { MODULES } from '@/lib/constants';
import { ArrowLeft, CheckCircle2, XCircle, FileText, Brain, Shield, Clock, Target, Lightbulb } from 'lucide-react';
import { getModuleTelemetry } from '@/lib/data/progress-rollups';

export const dynamic = 'force-dynamic';

const MODULE_ID_MAP: Record<number, string> = {
  1: MODULES.MODULE_1_ID, 2: MODULES.MODULE_2_ID, 3: MODULES.MODULE_3_ID,
  4: MODULES.MODULE_4_ID, 5: MODULES.MODULE_5_ID, 6: MODULES.MODULE_6_ID,
  7: MODULES.MODULE_7_ID, 8: MODULES.MODULE_8_ID, 9: MODULES.MODULE_9_ID,
  10: MODULES.MODULE_10_ID,
};

const MODULE_TITLES: Record<number, string> = {
  1: 'AI Learning Code', 2: 'Digital Smarts & Human Responsibility',
  3: 'Pre-Learn System', 4: 'Lesson Rescue Mode',
  5: 'Compression Learning', 6: 'Self-Testing & Mistake Bank',
  7: 'Notes & Study Pack Creation', 8: 'Writing & Answer Clarity',
  9: 'Build Your AI Tutor', 10: 'Build Your AI Assistant',
};

const MODULE_NODE_COUNTS: Record<number, number> = {
  1: 4, 2: 6, 3: 4, 4: 5, 5: 4, 6: 4, 7: 4, 8: 4, 9: 6, 10: 7,
};

export default async function ParentModuleReportPage({
  params,
}: {
  params: Promise<{ moduleNum: string }>;
}) {
  const { moduleNum: rawModuleNum } = await params;
  const moduleNum = parseInt(rawModuleNum, 10);

  if (isNaN(moduleNum) || moduleNum < 1 || moduleNum > 10) {
    notFound();
  }

  const moduleId = MODULE_ID_MAP[moduleNum];
  const moduleTitle = MODULE_TITLES[moduleNum];
  const totalNodes = MODULE_NODE_COUNTS[moduleNum];

  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Admin client for cross-user queries
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch first linked apprentice
  const { data: link } = await supabaseAdmin
    .from('parent_child_links')
    .select('student_id')
    .eq('parent_id', user.id)
    .limit(1)
    .single();

  const studentId = link?.student_id;

  // Fetch module data
  let progress: any[] = [];
  let assessments: any[] = [];
  let artifacts: any[] = [];
  let signals: any[] = [];
  let telemetry = { time_logged_minutes: 0, hints_utilized: 0, resilience_score: 0 };

  if (studentId) {
    const [progRes, assmRes, artRes, sigRes] = await Promise.all([
      supabaseAdmin.from('student_node_progress').select('*').eq('student_id', studentId).eq('module_id', moduleId),
      supabaseAdmin.from('assessment_submissions').select('*').eq('student_id', studentId).eq('module_id', moduleId),
      supabaseAdmin.from('proof_artifact_submissions').select('*').eq('student_id', studentId).eq('module_id', moduleId),
      supabaseAdmin.from('fingerprint_signals').select('*').eq('student_id', studentId).eq('module_id', moduleId),
    ]);
    progress = progRes.data || [];
    assessments = assmRes.data || [];
    artifacts = artRes.data || [];
    signals = sigRes.data || [];
    telemetry = await getModuleTelemetry(studentId, moduleId);
  }

  const quiz = assessments.find((a: any) => a.assessment_type === 'module_quiz');
  const bossBattle = assessments.find((a: any) => a.assessment_type === 'boss_battle');

  const getSignal = (type: string) =>
    signals.find((s: any) => s.signal_type === type)?.signal_value || null;

  const hasSignals = signals.length > 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return { label: 'SUBMITTED', color: '#00c8ff', bg: 'rgba(0,200,255,0.1)', border: 'rgba(0,200,255,0.3)' };
      case 'approved':
        return { label: 'APPROVED', color: '#39ff14', bg: 'rgba(57,255,20,0.1)', border: 'rgba(57,255,20,0.3)' };
      case 'rejected':
        return { label: 'REJECTED', color: '#ff4444', bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.3)' };
      case 'saved':
        return { label: 'SAVED', color: '#f5c518', bg: 'rgba(245,197,24,0.1)', border: 'rgba(245,197,24,0.3)' };
      default:
        return { label: status?.toUpperCase() || 'PENDING', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)' };
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[var(--text-primary)] p-6 md:p-12 star-field">
      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <header className="mb-10 border-b border-slate-800 pb-6">
          <Link
            href="/parent/home"
            className="inline-flex items-center gap-2 text-[#00c8ff] hover:text-[#00c8ff]/80 font-mono text-xs uppercase tracking-widest mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Mission Control
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <div
              className="w-10 h-10 flex items-center justify-center font-display font-black text-lg"
              style={{
                background: 'rgba(123,79,206,0.15)',
                border: '1px solid rgba(123,79,206,0.4)',
                color: '#7b4fce',
              }}
            >
              {moduleNum}
            </div>
            <div>
              <p className="font-mono text-[#7b4fce] text-[0.6rem] uppercase tracking-[0.3em]">
                &gt; MODULE {moduleNum} REPORT
              </p>
              <h1 className="text-2xl md:text-3xl font-display font-black text-[var(--text-primary)] uppercase tracking-widest">
                {moduleTitle}
              </h1>
            </div>
          </div>
          {!studentId && (
            <div
              className="mt-4 px-4 py-3 flex items-center gap-2 font-mono text-xs"
              style={{
                background: 'rgba(255,68,68,0.08)',
                border: '1px solid rgba(255,68,68,0.3)',
                color: '#ff6b6b',
              }}
            >
              <XCircle className="w-4 h-4" />
              No apprentice linked to this account.
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Progress + Assessments + Artifacts */}
          <div className="lg:col-span-2 space-y-6">

            {/* Improvement Signals (replaces raw node tracking) */}
            <div className="glass-card p-6 md:p-8 !rounded-none border border-slate-800">
              <h2 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-widest mb-1 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#00c8ff]" />
                Improvement Signals
              </h2>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-6">
                High-level telemetry and resilience
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/40 border border-slate-900 p-6 flex flex-col items-center justify-center text-center">
                  <Clock className="w-6 h-6 text-[#00c8ff] mb-3" />
                  <p className="text-2xl font-display font-black text-[#00c8ff]">{telemetry.time_logged_minutes}m</p>
                  <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">Active Time Logged</p>
                </div>
                
                <div className="bg-black/40 border border-slate-900 p-6 flex flex-col items-center justify-center text-center">
                  <Lightbulb className="w-6 h-6 text-[#f5c518] mb-3" />
                  <p className="text-2xl font-display font-black text-[#f5c518]">{telemetry.hints_utilized}</p>
                  <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">Hints Utilized (Resourcefulness)</p>
                </div>

                <div className="bg-black/40 border border-slate-900 p-6 flex flex-col items-center justify-center text-center">
                  <Target className="w-6 h-6 text-[#39ff14] mb-3" />
                  <p className="text-2xl font-display font-black text-[#39ff14]">{telemetry.resilience_score}</p>
                  <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">Attempts (Resilience)</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-slate-900/50 border border-slate-800/80">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-relaxed">
                  <span className="text-[#00c8ff] font-bold">Privacy Note:</span> To encourage risk-taking and a safe space for learning, we do not show raw trial-and-error problem sets. Instead, we highlight these high-level signals of effort and resourcefulness.
                </p>
              </div>
            </div>

            {/* Assessment Scores */}
            <div className="glass-card p-6 md:p-8 !rounded-none border border-slate-800">
              <h2 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-widest mb-6 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#f5c518]" />
                Assessment Scores
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quiz Gauge */}
                <div className="flex flex-col items-center justify-center p-6 bg-black/40 border border-slate-800">
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">
                    Module Quiz
                  </p>
                  {quiz ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="38"
                            stroke="rgba(30, 41, 59, 0.8)"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="38"
                            stroke={quiz.score_numeric >= 80 ? '#39ff14' : '#00c8ff'}
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 38}
                            strokeDashoffset={2 * Math.PI * 38 * (1 - quiz.score_numeric / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-500 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-display font-black text-[var(--text-primary)]">
                            {quiz.score_numeric}%
                          </span>
                        </div>
                      </div>
                      <p className={`font-mono text-[9px] font-bold uppercase tracking-widest mt-4 ${
                        quiz.score_numeric >= 80 ? 'text-[#39ff14]' : 'text-[#00c8ff]'
                      }`}>
                        {quiz.score_numeric >= 80 ? 'PASSING GRADE' : 'INCOMPLETE'}
                      </p>
                    </div>
                  ) : (
                    <div className="py-6 font-mono text-xs text-slate-600 uppercase tracking-widest">
                      No Quiz Attempt
                    </div>
                  )}
                </div>

                {/* Boss Battle block rating */}
                <div className="flex flex-col items-center justify-center p-6 bg-black/40 border border-slate-800">
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">
                    Boss Battle
                  </p>
                  {bossBattle ? (
                    <div className="flex flex-col items-center">
                      <div className="flex gap-2.5 items-end justify-center h-24 pb-2">
                        {Array.from({ length: 5 }).map((_, idx) => {
                          const active = idx < bossBattle.score_numeric;
                          return (
                            <div
                              key={idx}
                              className={`w-3.5 h-12 transition-all duration-300 ${
                                active
                                  ? 'bg-[#f5c518] shadow-[0_0_10px_rgba(245,197,24,0.4)] border border-[#f5c518]'
                                  : 'bg-slate-900/50 border border-slate-800'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <p className="text-xl font-display font-black text-[#f5c518] mt-4">
                        {bossBattle.score_numeric} / 5
                      </p>
                    </div>
                  ) : (
                    <div className="py-6 font-mono text-xs text-slate-600 uppercase tracking-widest">
                      No Boss Battle Attempt
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Proof Artifacts */}
            <div className="glass-card p-6 md:p-8 !rounded-none border border-slate-800">
              <h2 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-widest mb-1 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#7b4fce]" />
                Final Proof Packets
              </h2>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-6">
                Approved work and deliverables
              </p>

              {artifacts.filter(a => a.status === 'approved').length === 0 ? (
                <div
                  className="text-center py-10 font-mono text-xs uppercase tracking-widest"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px dashed rgba(51,65,85,0.6)',
                    color: '#475569',
                  }}
                >
                  No finalized proof packets yet. (Drafts are kept private).
                </div>
              ) : (
                <div className="space-y-6">
                  {artifacts.filter(a => a.status === 'approved').map((art: any) => {
                    const badge = getStatusBadge(art.status);
                    return (
                      <div
                        key={art.id}
                        className="flex flex-col gap-4 px-4 py-4"
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(123,79,206,0.3)',
                        }}
                      >
                        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText className="w-4 h-4 flex-shrink-0" style={{ color: '#7b4fce' }} />
                            <div className="min-w-0">
                              <p className="font-mono text-xs text-[var(--text-primary)] uppercase tracking-wider truncate">
                                {art.artifact_type?.replace(/_/g, ' ') || 'Artifact'}
                              </p>
                              {art.created_at && (
                                <p className="text-[10px] font-mono text-slate-600 mt-0.5">
                                  Finalized {new Date(art.created_at).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <span
                            className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 flex-shrink-0"
                            style={{
                              color: badge.color,
                              background: badge.bg,
                              border: `1px solid ${badge.border}`,
                            }}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <div className="font-sans text-sm text-slate-300 bg-slate-950 p-4 border border-slate-800 rounded-sm">
                          {art.content_payload ? (
                            <pre className="whitespace-pre-wrap font-sans">
                              {JSON.stringify(art.content_payload, null, 2).replace(/[{}"]/g, '')}
                            </pre>
                          ) : (
                            <span className="text-slate-500 italic">Artifact content is empty.</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right column: Fingerprint Insights */}
          <div className="space-y-6">
            <div className="glass-card p-6 !rounded-none border border-slate-800 h-full">
              <h2 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-widest mb-1 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#00c8ff]" />
                Fingerprint Insights
              </h2>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-6">
                Learning pattern signals
              </p>

              {!hasSignals ? (
                <div
                  className="text-center py-10 font-mono text-xs uppercase tracking-widest"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px dashed rgba(51,65,85,0.6)',
                    color: '#475569',
                  }}
                >
                  No fingerprint signals collected yet.
                </div>
              ) : (
                <div className="space-y-5">
                  {[
                    { type: 'explanation_preference', label: 'Explanation Preference', icon: '🧠' },
                    { type: 'mode_preference', label: 'Mode Preference', icon: '⚙️' },
                    { type: 'shortcut_tendency', label: 'Shortcut Tendency', icon: '⚡' },
                    { type: 'integrity_snapshot', label: 'Integrity Snapshot', icon: '🛡️' },
                  ].map(({ type, label, icon }) => {
                    const value = getSignal(type);
                    return (
                      <div
                        key={type}
                        className="px-4 py-3"
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(51,65,85,0.5)',
                        }}
                      >
                        <p className="font-mono text-[10px] uppercase tracking-widest mb-1.5 flex items-center gap-1.5"
                          style={{ color: '#00c8ff' }}
                        >
                          <span>{icon}</span> {label}
                        </p>
                        <p className="font-mono text-xs" style={{ color: value ? '#e2e8f0' : '#475569' }}>
                          {value || 'Pending data collection...'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
