export const dynamic = 'force-dynamic';

import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  ArrowLeft,
  Clock,
  TrendingUp,
  Bot,
  Cpu,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { getParentChildrenRollups } from '@/lib/data/progress-rollups';
import type { ParentChildSummary } from '@/lib/data/progress-rollups';
import { MODULES } from '@/lib/constants';

const TOTAL_NODES = 52;

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

// ---------------------------------------------------------------------------
// Helper: Radial progress ring (SVG)
// ---------------------------------------------------------------------------
function RadialProgress({
  pct,
  size = 64,
  strokeWidth = 5,
  colorClass = 'text-[#00c8ff]',
  trailColorClass = 'text-slate-800/80',
  centerText,
  label,
}: {
  pct: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  trailColorClass?: string;
  centerText: string;
  label: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(pct, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className={trailColorClass}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={`${colorClass} transition-all duration-500 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-display font-black text-[var(--text-primary)] leading-none">
            {centerText}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-1.5 text-center leading-none">
          {label}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper: Module Telemetry Chart (SVG)
// ---------------------------------------------------------------------------
function ModuleTelemetryChart({
  studentProgress,
}: {
  studentProgress: Record<string, number>;
}) {
  const heights = MODULE_LIST.map((mod) => {
    const mastered = studentProgress[mod.id] || 0;
    const pct = Math.round((mastered / mod.totalNodes) * 100);
    return {
      num: mod.num,
      title: mod.title,
      mastered,
      total: mod.totalNodes,
      pct,
    };
  });

  const chartHeight = 85;
  const chartWidth = 400;
  const paddingLeft = 15;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 20;

  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto overflow-visible"
      >
        <defs>
          <linearGradient id="cyan-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00c8ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0066aa" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="green-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#39ff14" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#11aa05" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={chartWidth - paddingRight}
          y2={paddingTop}
          stroke="rgba(148, 163, 184, 0.08)"
          strokeDasharray="2"
        />
        <line
          x1={paddingLeft}
          y1={paddingTop + graphHeight / 2}
          x2={chartWidth - paddingRight}
          y2={paddingTop + graphHeight / 2}
          stroke="rgba(148, 163, 184, 0.08)"
          strokeDasharray="2"
        />
        <line
          x1={paddingLeft}
          y1={chartHeight - paddingBottom}
          x2={chartWidth - paddingRight}
          y2={chartHeight - paddingBottom}
          stroke="rgba(148, 163, 184, 0.15)"
        />

        {heights.map((item, idx) => {
          const colWidth = 24;
          const totalGap = graphWidth - 10 * colWidth;
          const gap = totalGap / 9;
          const x = paddingLeft + idx * (colWidth + gap);
          
          const barHeight = (item.pct / 100) * graphHeight;
          const y = chartHeight - paddingBottom - barHeight;
          
          let fill = 'url(#cyan-grad)';
          let stroke = 'rgba(0, 200, 255, 0.4)';
          if (item.pct === 100) {
            fill = 'url(#green-grad)';
            stroke = 'rgba(57, 255, 20, 0.4)';
          } else if (item.pct === 0) {
            fill = 'rgba(30, 41, 59, 0.1)';
            stroke = 'rgba(71, 85, 105, 0.1)';
          }

          return (
            <g key={item.num} className="group cursor-pointer">
              <title>{`Module ${item.num}: ${item.pct}% Completed (${item.mastered}/${item.total} Nodes)`}</title>
              
              {/* Background slot */}
              <rect
                x={x}
                y={paddingTop}
                width={colWidth}
                height={graphHeight}
                fill="rgba(30, 41, 59, 0.15)"
                stroke="rgba(71, 85, 105, 0.1)"
                rx="2"
              />

              {/* Glowing active bar */}
              {item.pct > 0 && (
                <rect
                  x={x}
                  y={y}
                  width={colWidth}
                  height={barHeight}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="1"
                  rx="2"
                  className="transition-all duration-500 ease-out"
                />
              )}

              {/* Number Label */}
              <text
                x={x + colWidth / 2}
                y={chartHeight - 4}
                textAnchor="middle"
                className={`font-mono text-[8px] font-bold ${
                  item.pct === 100
                    ? 'fill-[#39ff14]'
                    : item.pct > 0
                    ? 'fill-[#00c8ff]'
                    : 'fill-slate-500'
                }`}
              >
                M{item.num}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function BuildBadge({
  label,
  status,
}: {
  label: string;
  status: 'none' | 'started' | 'has_version';
}) {
  const styles: Record<string, { bg: string; border: string; text: string; label: string }> = {
    none: {
      bg: 'bg-slate-900/50',
      border: 'border-slate-700',
      text: 'text-slate-500',
      label: 'Not Started',
    },
    started: {
      bg: 'bg-[#f5c518]/5',
      border: 'border-[#f5c518]/30',
      text: 'text-[#f5c518]',
      label: 'In Progress',
    },
    has_version: {
      bg: 'bg-[#39ff14]/5',
      border: 'border-[#39ff14]/30',
      text: 'text-[#39ff14]',
      label: 'Version Built',
    },
  };

  const s = styles[status] ?? styles.none;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 border font-mono text-[9px] font-bold uppercase tracking-widest ${s.bg} ${s.border} ${s.text}`}
    >
      {label}: {s.label}
    </span>
  );
}

function formatTimestamp(ts: string | null): string {
  if (!ts) return '—';
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DigestCard({
  child,
  studentProgress,
  childEmail,
}: {
  child: ParentChildSummary;
  studentProgress: Record<string, number>;
  childEmail?: string;
}) {
  const studentMastered = Object.values(studentProgress).reduce((a, b) => a + b, 0);
  const studentPct = TOTAL_NODES > 0 ? Math.round((studentMastered / TOTAL_NODES) * 100) : 0;

  return (
    <div className="glass-card !rounded-none border border-slate-800 p-6 space-y-6">

      {/* ── Apprentice header ───────────────────────────────── */}
      <div className="flex justify-between items-start border-b border-slate-800 pb-4">
        <div>
          <p className="font-display font-bold text-lg text-[var(--text-primary)] tracking-wider">
            {child.display_name}
          </p>
          {childEmail && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="font-mono text-[8px] text-[#00c8ff] uppercase tracking-widest">Login Email:</span>
              <span className="font-mono text-[9px] text-slate-300 font-bold bg-[#00c8ff]/10 border border-[#00c8ff]/20 px-1.5 py-0.5 select-all">{childEmail}</span>
            </div>
          )}
          {child.current_module_title ? (
            <p className="font-mono text-[10px] text-[#00c8ff] uppercase tracking-widest mt-1.5">
              &gt; Current Module: {child.current_module_title}
            </p>
          ) : (
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-1.5">
              &gt; All modules completed or not yet started
            </p>
          )}
        </div>
        {child.flags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {child.flags.map((flag) => (
              <span
                key={flag}
                className="inline-flex items-center gap-1 bg-red-950/20 border border-red-500/20 text-red-400 font-mono text-[8px] font-bold uppercase tracking-widest px-2 py-0.5"
              >
                <AlertCircle className="w-2.5 h-2.5" />
                {flag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Visual Gauges Row: Overall (large) + 3 Mini Rings */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center justify-items-center bg-black/40 border border-slate-900 p-4">
        <div className="sm:border-r sm:border-slate-800/80 w-full flex flex-col items-center justify-center py-1">
          <RadialProgress
            pct={studentPct}
            size={76}
            strokeWidth={6}
            colorClass={studentPct >= 100 ? 'text-[#39ff14]' : 'text-[#00c8ff]'}
            centerText={`${studentPct}%`}
            label="Overall Progress"
          />
        </div>

        <RadialProgress
          pct={Math.round((studentMastered / TOTAL_NODES) * 100)}
          size={64}
          strokeWidth={5}
          colorClass="text-[#7b4fce]"
          centerText={`${studentMastered}/${TOTAL_NODES}`}
          label="Nodes Mastered"
        />

        <RadialProgress
          pct={child.modules_completed * 10}
          size={64}
          strokeWidth={5}
          colorClass="text-[#39ff14]"
          centerText={`${child.modules_completed}/10`}
          label="Modules Completed"
        />

        <RadialProgress
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
          <TrendingUp className="w-3.5 h-3.5 text-[#00c8ff]" /> Module Telemetry Status
        </p>
        <div className="bg-black/40 border border-slate-950 p-4">
          <ModuleTelemetryChart studentProgress={studentProgress} />
        </div>
      </div>

      {/* Activity & Discussions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-black/40 border border-slate-800 p-3">
          <Clock className="w-4 h-4 text-[#f5c518]" />
          <div>
            <p className="font-mono text-xs text-[#f5c518] font-bold leading-tight">
              {formatTimestamp(child.latest_activity_at)}
            </p>
            <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Last Active</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/40 border border-slate-800 p-3">
          <MessageCircle className="w-4 h-4 text-[#7b4fce]" />
          <div>
            <p className="font-mono text-xs text-[var(--text-primary)] font-bold">
              {child.discussion_activity_count}
            </p>
            <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Discussion Posts</p>
          </div>
        </div>
      </div>

      {/* AI Build Status */}
      <div className="border-t border-slate-800/80 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-[#00c8ff]" />
          <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
            AI Companion Deployment Status
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <BuildBadge
            label="Tutor"
            status={child.tutor_build_status}
          />
          <BuildBadge
            label="Assistant"
            status={child.assistant_build_status}
          />
        </div>
      </div>
    </div>
  );
}

export default async function ParentDigestPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const children = await getParentChildrenRollups(user.id);

  // Fetch real progress for ALL linked students
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const studentIds = children.map((r) => r.student_id);
  const progressByStudent: Record<string, Record<string, number>> = {};
  let apprentices: { id: string; full_name: string; email: string }[] = [];

  if (studentIds.length > 0) {
    const [progressRes, profilesRes] = await Promise.all([
      supabaseAdmin.from('student_node_progress').select('student_id, module_id, node_mastered').in('student_id', studentIds),
      supabaseAdmin.from('profiles').select('id, full_name, email').in('id', studentIds),
    ]);

    const allProgress = progressRes.data || [];
    apprentices = profilesRes.data || [];

    for (const row of allProgress) {
      if (!row.node_mastered) continue;
      if (!progressByStudent[row.student_id]) progressByStudent[row.student_id] = {};
      progressByStudent[row.student_id][row.module_id] =
        (progressByStudent[row.student_id][row.module_id] || 0) + 1;
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-[var(--text-primary)] p-6 md:p-12 star-field">
      <div className="max-w-5xl mx-auto relative z-10">

        {/* ── Header ──────────────────────────────────────────── */}
        <header className="mb-10 border-b border-slate-800 pb-6">
          <Link
            href="/parent/home"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#00c8ff] uppercase tracking-widest hover:text-[#39ff14] transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Mission Control
          </Link>

          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#7b4fce]" />
            <div>
              <p className="font-mono text-[#00c8ff] text-[0.6rem] uppercase tracking-[0.3em] mb-0.5">
                &gt; PARENT GATEWAY
              </p>
              <h1 className="text-3xl font-display font-black text-[var(--text-primary)] uppercase tracking-widest">
                Weekly Digest Preview
              </h1>
            </div>
          </div>
        </header>

        {/* ── Digest cards ────────────────────────────────────── */}
        {children.length === 0 ? (
          <div className="glass-card !rounded-none border border-dashed border-slate-700 p-16 text-center">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="font-mono text-sm text-slate-500 uppercase tracking-widest">
              No linked apprentices found.
            </p>
            <p className="font-mono text-xs text-slate-600 mt-2">
              Link an apprentice from Mission Control to see their digest here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {children.map((child) => {
              const childEmail = apprentices.find((a) => a.id === child.student_id)?.email;
              return (
                <DigestCard
                  key={child.student_id}
                  child={child}
                  studentProgress={progressByStudent[child.student_id] || {}}
                  childEmail={childEmail}
                />
              );
            })}
          </div>
        )}

        {/* ── Footer note ─────────────────────────────────────── */}
        <div className="mt-12 border-t border-slate-800 pt-6">
          <div className="flex items-start gap-3 bg-black/40 border border-[#7b4fce]/20 p-4">
            <Clock className="w-4 h-4 text-[#7b4fce] flex-shrink-0 mt-0.5" />
            <p className="font-mono text-[10px] text-slate-400 leading-relaxed">
              This digest shows your apprentice&apos;s current progress snapshot.{' '}
              <span className="text-[#00c8ff] font-bold">
                Automated weekly email delivery coming soon.
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
