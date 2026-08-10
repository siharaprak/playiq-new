import {
  FileText,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  UserPlus,
  Lock,
  BookOpen,
  Bot,
  Cpu,
  Activity,
  MessageSquare,
  FileCheck2,
  Flag,
  Clock,
  Shield,
  Settings,
} from 'lucide-react';
import { createClient, ensureProfileExists } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MODULES } from '@/lib/constants';
import { getParentChildrenRollups, type ParentChildSummary } from '@/lib/data/progress-rollups';
import ParentIntegrityPanel from '@/components/parent/ParentIntegrityPanel';
import { getParentProofSummary } from '@/lib/data/proof-artifacts';
import { ParentProofSummaryCard } from '@/components/proof-artifacts/ParentProofSummaryCard';
import ParentOrientationGuide from '@/components/dashboard/ParentOrientationGuide';
import ParentDashboardTour from '@/components/dashboard/ParentDashboardTour';
import { 
  AnimatedRadialProgress, 
  AnimatedModuleTelemetryChart, 
  AnimatedProgressBar,
  AnimatedAnalyticsDashboard 
} from '@/components/parent/AnimatedVisualizations';

export const dynamic = 'force-dynamic';

const MODULE_LIST = [
  { id: MODULES.MODULE_1_ID, num: 1, title: 'AI Learning Code', totalNodes: 4 },
  { id: MODULES.MODULE_2_ID, num: 2, title: 'Digital Smarts & Human Responsibility', totalNodes: 6 },
  { id: MODULES.MODULE_3_ID, num: 3, title: 'Pre-Learn System', totalNodes: 4 },
  { id: MODULES.MODULE_4_ID, num: 4, title: 'Lesson Rescue Mode', totalNodes: 5 },
  { id: MODULES.MODULE_5_ID, num: 5, title: 'Compression Learning', totalNodes: 4 },
  { id: MODULES.MODULE_6_ID, num: 6, title: 'Self-Testing & Mistake Bank', totalNodes: 4 },
  { id: MODULES.MODULE_7_ID, num: 7, title: 'Notes & Study Pack Creation', totalNodes: 4 },
  { id: MODULES.MODULE_8_ID, num: 8, title: 'Writing & Answer Clarity', totalNodes: 4 },
  { id: MODULES.MODULE_9_ID, num: 9, title: 'Build Your AI Tutor', totalNodes: 6 },
  { id: MODULES.MODULE_10_ID, num: 10, title: 'Build Your AI Assistant', totalNodes: 7 },
];

const TOTAL_NODES = 52;

// ---------------------------------------------------------------------------
// Helper: format relative time
// ---------------------------------------------------------------------------
function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

// ---------------------------------------------------------------------------
// Helper: AI build status badge
// ---------------------------------------------------------------------------
function BuildStatusBadge({
  status,
  label,
  icon: Icon,
}: {
  status: 'none' | 'started' | 'has_version';
  label: string;
  icon: typeof Bot;
}) {
  const config = {
    none: {
      text: 'NOT STARTED',
      color: 'text-slate-500',
      border: 'border-slate-700',
      bg: 'bg-slate-900/40',
      glow: '',
    },
    started: {
      text: 'IN PROGRESS',
      color: 'text-[#f5c518]',
      border: 'border-[#f5c518]/30',
      bg: 'bg-[#f5c518]/5',
      glow: 'shadow-[0_0_6px_rgba(245,197,24,0.15)]',
    },
    has_version: {
      text: 'DEPLOYED',
      color: 'text-[#39ff14]',
      border: 'border-[#39ff14]/30',
      bg: 'bg-[#39ff14]/5',
      glow: 'shadow-[0_0_8px_rgba(57,255,20,0.2)]',
    },
  }[status];

  return (
    <div className={`flex items-center gap-2 px-3 py-2 border ${config.border} ${config.bg} ${config.glow}`}>
      <Icon className={`w-4 h-4 ${config.color}`} />
      <div>
        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{label}</p>
        <p className={`text-[10px] font-mono font-bold uppercase tracking-wider ${config.color}`}>
          {config.text}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------
export default async function ParentDashboard({
  searchParams,
}: {
  searchParams: Promise<{ provisioned?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  let { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  
  if (!profile) {
    const healed = await ensureProfileExists(
      user.id,
      user.email || '',
      user.user_metadata?.full_name || 'Parent User',
      'parent'
    );
    if (healed) {
      profile = { role: healed.role };
    }
  }

  if (!profile || profile.role !== 'parent') {
    if (profile?.role) {
      redirect(`/${profile.role}/home`);
    } else {
      redirect('/login');
    }
  }

  const params = await searchParams;

  // ---- Rollup data layer ----
  const rollups: ParentChildSummary[] = await getParentChildrenRollups(user.id);

  // ---- Raw queries for proof inspector + fleet progress (not covered by rollup) ----
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const studentIds = rollups.map((r) => r.student_id);

  // Fetch apprentice profiles (with email) for proof inspector
  let apprentices: { id: string; full_name: string; email: string }[] = [];
  if (studentIds.length > 0) {
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email')
      .in('id', studentIds);
    apprentices = profiles || [];
  }

  // Fetch real progress for ALL linked students
  const progressByStudent: Record<string, Record<string, number>> = {};

  if (studentIds.length > 0) {
    const { data: allProgress } = await supabaseAdmin
      .from('student_node_progress')
      .select('student_id, module_id, node_mastered')
      .in('student_id', studentIds);

    for (const row of (allProgress || [])) {
      if (!row.node_mastered) continue;
      if (!progressByStudent[row.student_id]) progressByStudent[row.student_id] = {};
      progressByStudent[row.student_id][row.module_id] =
        (progressByStudent[row.student_id][row.module_id] || 0) + 1;
    }
  }

  // Fetch open support issues for these apprentices
  let openTicketCount = 0;
  if (studentIds.length > 0) {
    const { count } = await supabaseAdmin
      .from('support_issues')
      .select('*', { count: 'exact', head: true })
      .in('reporter_id', studentIds)
      .eq('status', 'open');
    openTicketCount = count || 0;
  }

  // Use primary student for Fleet Progress sidebar
  const primaryStudentId = studentIds[0];
  const primaryProgress = primaryStudentId ? (progressByStudent[primaryStudentId] || {}) : {};
  const totalMastered = Object.values(primaryProgress).reduce((a, b) => a + b, 0);
  const primaryPDI = rollups.length > 0 ? rollups[0].pdi_score : 0;

  let proofSummary = null;
  if (primaryStudentId) {
    try {
      proofSummary = await getParentProofSummary(user.id, primaryStudentId);
    } catch (err) {
      console.warn("Failed to fetch proof summary:", err);
    }
  }

  // Fetch assessment profiles for linked students
  type AssessmentSummary = {
    student_id: string;
    assessment_completed: boolean;
    assessment_completed_at: string | null;
    explanation_style: string | null;
    motivation_driver: string | null;
    rescue_target_subject: string | null;
    advance_target_subject: string | null;
    personal_goal: string | null;
  };
  let assessmentSummaries: AssessmentSummary[] = [];
  if (studentIds.length > 0) {
    const { data: assessmentData } = await supabaseAdmin
      .from('student_assessment_profiles')
      .select('student_id, assessment_completed, assessment_completed_at, explanation_style, motivation_driver, rescue_target_subject, advance_target_subject, personal_goal')
      .in('student_id', studentIds);
    assessmentSummaries = (assessmentData || []) as AssessmentSummary[];
  }

  return (
    <div className="min-h-screen bg-[#020617] text-[var(--text-primary)] p-6 md:p-12 star-field">
      <div className="max-w-6xl mx-auto relative z-10">

        {/* ================================================================ */}
        {/* HEADER                                                           */}
        {/* ================================================================ */}
        <header id="parent-header" className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div>
            <p className="font-mono text-[#00c8ff] text-[0.6rem] uppercase tracking-[0.3em] mb-1">&gt; PARENT GATEWAY</p>
            <h1 className="text-3xl font-display font-black text-[var(--text-primary)] uppercase tracking-widest">
              Mission Control
            </h1>
            <div className="text-slate-400 text-xs mt-1 font-mono flex items-center gap-2 flex-wrap">
              &gt; ACTIVE LOG: {user.email}
              <Link href="/settings" className="text-[#00c8ff] hover:text-white transition-colors flex items-center gap-1 ml-2 border border-[#00c8ff]/30 px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest bg-[#00c8ff]/10">
                <Settings className="w-3.5 h-3.5" /> 2FA Shield
              </Link>
              <button 
                id="replay-parent-tour-button"
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 ml-2 border border-[#7b4fce]/30 px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest bg-[#7b4fce]/10 cursor-pointer"
              >
                🗺️ Tour Dashboard
              </button>
              <form action="/auth/signout" method="post" className="inline">
                <button type="submit" className="text-red-400 hover:text-white transition-colors flex items-center gap-1 ml-2 border border-red-500/30 px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest bg-red-500/10 cursor-pointer">
                  Logout
                </button>
              </form>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {rollups.length > 0 && (
              <div className="glass-card px-4 py-2 border-l-2 border-[#f5c518] text-center !rounded-none">
                <p className="text-xl font-display font-black text-[#f5c518]">{primaryPDI}</p>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Fleet PDI Score</p>
              </div>
            )}
          </div>
        </header>

        {/* ================================================================ */}
        {/* SUCCESS BANNER                                                   */}
        {/* ================================================================ */}
        {params?.provisioned === '1' && (
          <div className="mb-8 p-4 bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#39ff14] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-display font-bold text-[#39ff14] uppercase tracking-widest text-sm">Apprentice Provisioned Successfully</p>
              <p className="font-mono text-xs text-slate-400 mt-1">Their profile is active. They can now log in at weplayiq.com/login.</p>
            </div>
          </div>
        )}

        {/* Parent Onboarding Orientation Guide */}
        <ParentOrientationGuide
          parentId={user.id}
          hasApprentice={rollups.length > 0}
          hasProgress={totalMastered > 0}
          approvedProofs={rollups.reduce((sum, child) => sum + (child.proof_approved_total || 0), 0)}
        />

        {/* Animated Analytics Dashboard */}
        {rollups.length > 0 && (
          <div className="mb-10">
            <AnimatedAnalyticsDashboard rollups={rollups} progressByStudent={progressByStudent} />
          </div>
        )}

        {/* ================================================================ */}
        {/* APPRENTICE SUMMARY CARDS (rollup-powered)                        */}
        {/* ================================================================ */}
        {rollups.length > 0 && (
          <section id="apprentice-intel-section" className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-[#7b4fce]" />
              <h2 className="text-lg font-display font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Apprentice Intel
              </h2>
              <span className="text-[10px] bg-[#7b4fce]/10 border border-[#7b4fce]/30 px-2 py-0.5 text-[#7b4fce] font-mono font-bold uppercase tracking-wider">
                {rollups.length} Active
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {rollups.map((child) => {
                const nodesMastered = totalMastered; // we'll compute per-student below
                const studentProgress = progressByStudent[child.student_id] || {};
                const studentMastered = Object.values(studentProgress).reduce((a, b) => a + b, 0);
                const studentPct = Math.round((studentMastered / TOTAL_NODES) * 100);
                const childEmail = apprentices.find((a) => a.id === child.student_id)?.email;

                return (
                  <div
                    key={child.student_id}
                    className="glass-card !rounded-none border border-slate-800 hover:border-[#7b4fce]/40 transition-colors p-6 space-y-6"
                  >
                    {/* Header: Name + Current Module + Flags */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-base font-display font-bold text-[var(--text-primary)] tracking-wider">
                          {child.display_name}
                        </h3>
                        {childEmail && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="font-mono text-[8px] text-[#00c8ff] uppercase tracking-widest">Login Email:</span>
                            <span className="font-mono text-[9px] text-slate-300 font-bold bg-[#00c8ff]/10 border border-[#00c8ff]/20 px-1.5 py-0.5 select-all">{childEmail}</span>
                          </div>
                        )}
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1.5">
                          {child.current_module_title
                            ? `Currently on: ${child.current_module_title}`
                            : 'All modules completed'}
                        </p>
                      </div>
                      {child.flags.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-end">
                          {child.flags.map((flag) => (
                            <span
                              key={flag}
                              className="flex items-center gap-1 text-[8px] font-mono font-bold uppercase tracking-widest text-red-400 bg-red-950/20 border border-red-500/20 px-2 py-0.5"
                            >
                              <Flag className="w-2.5 h-2.5" /> {flag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Visual Gauges Row: Overall (large) + 3 Mini Rings */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center justify-items-center bg-black/40 border border-slate-900 p-4">
                      <div className="sm:border-r sm:border-slate-800/80 w-full flex flex-col items-center justify-center py-1">
                        <AnimatedRadialProgress
                          pct={child.pdi_score}
                          size={76}
                          strokeWidth={6}
                          colorClass={child.pdi_score >= 80 ? 'text-[#f5c518]' : 'text-[#00c8ff]'}
                          centerText={child.pdi_score.toString()}
                          label="PDI Score"
                        />
                      </div>

                      <AnimatedRadialProgress
                        pct={Math.round((studentMastered / TOTAL_NODES) * 100)}
                        size={64}
                        strokeWidth={5}
                        colorClass="text-[#7b4fce]"
                        centerText={`${studentMastered}/${TOTAL_NODES}`}
                        label="Nodes Mastered"
                      />

                      <AnimatedRadialProgress
                        pct={child.modules_completed * 10}
                        size={64}
                        strokeWidth={5}
                        colorClass="text-[#39ff14]"
                        centerText={`${child.modules_completed}/10`}
                        label="Modules Done"
                      />

                      <AnimatedRadialProgress
                        pct={
                          child.proof_submissions_total > 0
                            ? Math.round((child.proof_approved_total / child.proof_submissions_total) * 100)
                            : 0
                        }
                        size={64}
                        strokeWidth={5}
                        colorClass="text-[#f5c518]"
                        centerText={`${child.proof_approved_total}/${child.proof_submissions_total}`}
                        label="Proofs Approved"
                      />
                    </div>

                    {/* Module Telemetry SVG Column Chart */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-[#00c8ff]" /> Module Telemetry Status
                      </p>
                      <div className="bg-black/40 border border-slate-950 p-4">
                        <AnimatedModuleTelemetryChart studentProgress={studentProgress} />
                      </div>
                    </div>

                    {/* Activity logs & support posts */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 bg-black/40 border border-slate-900 p-3">
                        <Clock className="w-4 h-4 text-[#f5c518] flex-shrink-0" />
                        <div>
                          <p className="text-xs font-mono font-bold text-[#f5c518]">
                            {formatRelativeTime(child.latest_activity_at)}
                          </p>
                          <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Last Active</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-black/40 border border-slate-900 p-3">
                        <MessageSquare className="w-4 h-4 text-[#7b4fce] flex-shrink-0" />
                        <div>
                          <p className="text-xs font-mono font-bold text-[var(--text-primary)]">
                            {child.discussion_activity_count}
                          </p>
                          <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Discussion Posts</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Builds section */}
                    <div className="border-t border-slate-800/80 pt-4">
                      <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-[#00c8ff]" /> AI Companion Deployment Status
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <BuildStatusBadge
                          status={child.tutor_build_status}
                          label="AI Tutor"
                          icon={Bot}
                        />
                        <BuildStatusBadge
                          status={child.assistant_build_status}
                          label="AI Assistant"
                          icon={Cpu}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* MAIN GRID: Proof Inspector + Sidebar                             */}
        {/* ================================================================ */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Latest Proof Packets */}
            <div id="proof-packets-card" className="glass-card p-8 !rounded-none border border-slate-800">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-display font-bold text-[var(--text-primary)] uppercase tracking-wider">Latest Proof Packets</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-mono">
                    Secure operational inspect panels for link credentials
                  </p>
                </div>
              </div>

              {apprentices.length === 0 ? (
                <div className="bg-black/40 border border-dashed border-slate-700 rounded-none p-12 text-center">
                  <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">No apprentice linked to this account.</p>
                  <p className="text-slate-600 font-mono text-xs mt-2">Use the panel on the right to provision an apprentice account.</p>
                </div>
              ) : (
                <div className="bg-black/40 border border-dashed border-slate-700 rounded-none p-12 text-center">
                  <Lock className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">Student Active</p>
                  <p className="text-slate-600 font-mono text-xs mt-2">See summary panel for artifact status. Detailed review is restricted during beta.</p>
                </div>
              )}
            </div>

            {/* Integrity & Support Panel */}
            <ParentIntegrityPanel openTicketCount={openTicketCount} />

            {/* Weekly Digest Preview CTA */}
            <Link
              href="/parent/digest"
              className="group flex items-center gap-4 glass-card !rounded-none border border-[#7b4fce]/30 hover:border-[#7b4fce]/60 p-5 transition-all"
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#7b4fce]/10 border border-[#7b4fce]/30 group-hover:bg-[#7b4fce]/20 transition-colors">
                <FileText className="w-5 h-5 text-[#7b4fce]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider group-hover:text-[#7b4fce] transition-colors">
                  Weekly Digest Preview
                </p>
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                  Preview the learner summary format. Automated email delivery is coming later.
                </p>
              </div>
              <span className="font-mono text-[10px] text-[#7b4fce] font-bold uppercase tracking-widest flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                View →
              </span>
            </Link>

          </div>

          {/* ============================================================== */}
          {/* SIDEBAR                                                        */}
          {/* ============================================================== */}
          <div className="space-y-6">

            {proofSummary && <ParentProofSummaryCard summary={proofSummary} />}

            {/* Assessment Summary Cards */}
            {assessmentSummaries.filter(a => a.assessment_completed).map((assessment) => {
              const childName = apprentices.find(a => a.id === assessment.student_id)?.full_name || 'Apprentice';
              const styleLabel = assessment.explanation_style === 'visual' ? 'Visual / Big-Picture' : assessment.explanation_style === 'analytical' ? 'Analytical / Step-by-Step' : 'Verbal / Story-Based';
              const motivLabel = assessment.motivation_driver === 'mastery' ? 'Improvement' : assessment.motivation_driver === 'competitive' ? 'Competition' : assessment.motivation_driver === 'purpose' ? 'Real-world skills' : 'Recognition';
              return (
                <div key={`assess-${assessment.student_id}`} className="glass-card p-6 !rounded-none border border-[#7b4fce]/30">
                  <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
                    <div className="w-8 h-8 flex items-center justify-center text-lg font-bold" style={{ background: '#7b4fce20', border: '1px solid #7b4fce50', color: '#7b4fce' }}>Ω</div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider">Assessment Complete</h3>
                      <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{childName} • {assessment.assessment_completed_at ? new Date(assessment.assessment_completed_at).toLocaleDateString() : 'Completed'}</p>
                    </div>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between"><span className="font-mono text-slate-500 uppercase">Learning Style</span><span className="font-bold text-[#00c8ff]">{styleLabel}</span></div>
                    <div className="flex justify-between"><span className="font-mono text-slate-500 uppercase">Motivation</span><span className="font-bold text-[#00c8ff]">{motivLabel}</span></div>
                    <div className="flex justify-between"><span className="font-mono text-slate-500 uppercase">Rescue Target</span><span className="font-bold text-[#f5c518]">{assessment.rescue_target_subject || '—'}</span></div>
                    <div className="flex justify-between"><span className="font-mono text-slate-500 uppercase">Advance Target</span><span className="font-bold text-[#39ff14]">{assessment.advance_target_subject || '—'}</span></div>
                    <div className="flex justify-between"><span className="font-mono text-slate-500 uppercase">Baseline PDI</span><span className="font-mono text-slate-400">Recorded — visible after Module 3</span></div>
                  </div>
                  <div className="mt-4 p-3 bg-[#7b4fce]/5 border border-[#7b4fce]/20">
                    <p className="text-[10px] font-mono text-[#7b4fce] uppercase tracking-widest mb-1">✅ Orion is calibrated</p>
                    <p className="text-[10px] font-mono text-slate-400">Suggested prompt: &ldquo;Ask your apprentice: what did Orion say about how they learn best?&rdquo;</p>
                  </div>
                </div>
              );
            })}

            {/* Apprentice Roster */}
            <div id="provision-card" className="glass-card p-6 !rounded-none border border-[#7b4fce]/30">
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <h3 className="font-display font-bold text-lg text-[#7b4fce] uppercase tracking-wider flex items-center gap-2">
                  <UserPlus className="w-5 h-5" /> Apprentices
                </h3>
                <span className="text-xs bg-slate-800 px-2 py-1 text-slate-400 font-mono">{apprentices.length} Linked</span>
              </div>

              <div className="space-y-3 mb-6">
                {apprentices.length === 0 ? (
                  <p className="text-sm text-slate-500 p-4 bg-black/40 border border-slate-800 text-center font-mono">
                    No apprentices assigned to this sector.
                  </p>
                ) : (
                  apprentices.map(app => (
                    <div key={app.id} className="p-3 bg-black/50 border border-slate-700 hover:border-[#7b4fce]/50 transition-colors">
                      <p className="text-[var(--text-primary)] font-bold text-sm font-display">{app.full_name}</p>
                      <p className="text-slate-500 text-xs mt-1 truncate font-mono">{app.email}</p>
                    </div>
                  ))
                )}
              </div>

              <Link
                href="/parent/apprentice-setup"
                className="flex items-center justify-center w-full bg-transparent border border-[#00c8ff] hover:bg-[#00c8ff]/10 text-[#00c8ff] font-display font-bold py-3 text-sm transition-all uppercase tracking-widest shadow-[0_0_10px_rgba(0,200,255,0.1)]"
              >
                + Provision New Apprentice
              </Link>
            </div>

            {/* Fleet Progress (real data) */}
            <div id="fleet-progress-card" className="glass-card p-6 !rounded-none border border-slate-800">
              <div className="flex items-center gap-3 mb-5">
                <BarChart3 className="text-[#00c8ff] w-5 h-5" />
                <h3 className="font-display font-bold text-[var(--text-primary)] uppercase tracking-wider">Fleet Progress</h3>
              </div>

              {apprentices.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">
                    No apprentice linked.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {MODULE_LIST.map((mod) => {
                    const mastered = primaryProgress[mod.id] || 0;
                    const pct = Math.round((mastered / mod.totalNodes) * 100);
                    const complete = mastered >= mod.totalNodes;
                    const started = mastered > 0;

                    return (
                      <div key={mod.id} className={started ? 'opacity-100' : 'opacity-45'}>
                        <div className="flex justify-between text-[11px] mb-1 font-mono">
                          <span className={`uppercase tracking-wider flex items-center gap-1.5 ${complete ? 'text-[#39ff14]' : started ? 'text-[#00c8ff]' : 'text-slate-500'}`}>
                            {complete
                              ? <CheckCircle2 className="w-3 h-3 text-[#39ff14]" />
                              : <AlertCircle className="w-3 h-3 text-[#7b4fce]" />}
                            Module {mod.num}
                          </span>
                          <span className={`font-mono text-[10px] ${complete ? 'text-[#39ff14]' : started ? 'text-[#00c8ff]' : 'text-slate-500'}`}>
                            {complete ? 'COMPLETE' : started ? `${pct}%` : 'NOT STARTED'}
                          </span>
                        </div>
                        <AnimatedProgressBar pct={pct} complete={complete} started={started} />
                        <p className="text-[9px] font-sans text-slate-500 tracking-wide leading-tight mb-1">
                          {mod.title}
                        </p>
                        {complete && (
                          <Link href={`/parent/modules/${mod.num}`} className="block text-center w-full bg-[#00c8ff]/10 hover:bg-[#00c8ff]/20 text-[#00c8ff] border border-[#00c8ff]/30 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors font-mono mt-1 mb-2">
                            VIEW MODULE REPORT →
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <ParentDashboardTour parentId={user.id} hasProgress={totalMastered > 0} />
    </div>
  );
}
