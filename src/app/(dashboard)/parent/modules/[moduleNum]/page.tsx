import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { MODULES } from '@/lib/constants';
import { ArrowLeft, CheckCircle2, XCircle, FileText, Brain, Shield } from 'lucide-react';

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

            {/* Node Progress */}
            <div className="glass-card p-6 md:p-8 !rounded-none border border-slate-800">
              <h2 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-widest mb-1 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#00c8ff]" />
                Node Progress
              </h2>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-6">
                {totalNodes} nodes in this module
              </p>

              {/* Horizontal Node Path Pipeline */}
              <div className="bg-black/40 border border-slate-900 p-6 mb-6 flex flex-col items-center justify-center">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-5">
                  Node Completion Pipeline
                </p>
                <div className="flex items-center w-full max-w-md justify-between relative px-4">
                  {/* Line under the nodes */}
                  <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-800 transform -translate-y-1/2 z-0" />
                  
                  {Array.from({ length: totalNodes }, (_, i) => {
                    const nodeId = String(i + 1);
                    const nodeProgress = progress.find((p: any) => p.node_id === nodeId);
                    const mastered = nodeProgress?.node_mastered === true;
                    
                    return (
                      <div key={nodeId} className="relative z-10 flex flex-col items-center group">
                        <title>{`Node ${nodeId}: ${mastered ? 'Mastered' : 'Incomplete'}`}</title>
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                            mastered
                              ? 'bg-[#39ff14]/10 text-[#39ff14] border-2 border-[#39ff14] shadow-[0_0_12px_rgba(57,255,20,0.4)]'
                              : 'bg-slate-950 text-slate-600 border-2 border-slate-850'
                          }`}
                        >
                          N{nodeId}
                        </div>
                        <span className={`text-[8px] font-mono mt-1.5 uppercase tracking-wider ${mastered ? 'text-[#39ff14]' : 'text-slate-500'}`}>
                          {mastered ? 'Done' : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Node list */}
              <div className="space-y-3">
                {Array.from({ length: totalNodes }, (_, i) => {
                  const nodeId = String(i + 1);
                  const nodeProgress = progress.find((p: any) => p.node_id === nodeId);
                  const mastered = nodeProgress?.node_mastered === true;

                  return (
                    <div
                      key={nodeId}
                      className="flex items-center gap-3 px-4 py-3 font-mono text-sm"
                      style={{
                        background: mastered ? 'rgba(57,255,20,0.05)' : 'rgba(0,0,0,0.3)',
                        border: `1px solid ${mastered ? 'rgba(57,255,20,0.2)' : 'rgba(51,65,85,0.5)'}`,
                      }}
                    >
                      {mastered ? (
                        <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" style={{ color: '#39ff14' }} />
                      ) : (
                        <XCircle className="w-4.5 h-4.5 flex-shrink-0" style={{ color: '#475569' }} />
                      )}
                      <span
                        className="uppercase tracking-wider text-xs"
                        style={{ color: mastered ? '#39ff14' : '#64748b' }}
                      >
                        Node {nodeId}
                      </span>
                      <span
                        className="ml-auto text-[10px] uppercase tracking-widest font-bold"
                        style={{ color: mastered ? '#39ff14' : '#334155' }}
                      >
                        {mastered ? 'Mastered' : 'Not Mastered'}
                      </span>
                    </div>
                  );
                })}
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
                Proof Artifacts
              </h2>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-6">
                Submitted work and deliverables
              </p>

              {artifacts.length === 0 ? (
                <div
                  className="text-center py-10 font-mono text-xs uppercase tracking-widest"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px dashed rgba(51,65,85,0.6)',
                    color: '#475569',
                  }}
                >
                  No artifacts submitted yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {artifacts.map((art: any) => {
                    const badge = getStatusBadge(art.status);
                    return (
                      <div
                        key={art.id}
                        className="flex items-center justify-between gap-4 px-4 py-3"
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(51,65,85,0.5)',
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-4 h-4 flex-shrink-0" style={{ color: '#7b4fce' }} />
                          <div className="min-w-0">
                            <p className="font-mono text-xs text-[var(--text-primary)] uppercase tracking-wider truncate">
                              {art.artifact_type?.replace(/_/g, ' ') || 'Artifact'}
                            </p>
                            {art.created_at && (
                              <p className="text-[10px] font-mono text-slate-600 mt-0.5">
                                {new Date(art.created_at).toLocaleDateString()}
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
