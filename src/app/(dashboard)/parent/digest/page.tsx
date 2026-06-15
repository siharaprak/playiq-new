export const dynamic = 'force-dynamic';

import { createClient } from '@/utils/supabase/server';
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

const TOTAL_NODES = 52;

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

function DigestCard({ child }: { child: ParentChildSummary }) {
  const progressPct = TOTAL_NODES > 0
    ? Math.round(((child.modules_completed * 5) / TOTAL_NODES) * 100) // rough estimate from module count
    : 0;

  return (
    <div className="glass-card !rounded-none border border-slate-800 p-6 space-y-6">

      {/* ── Apprentice header ───────────────────────────────── */}
      <div className="flex justify-between items-start border-b border-slate-800 pb-4">
        <div>
          <p className="font-display font-bold text-lg text-[var(--text-primary)] tracking-wider">
            {child.display_name}
          </p>
          {child.current_module_title ? (
            <p className="font-mono text-[10px] text-[#00c8ff] uppercase tracking-widest mt-1">
              &gt; Current Module: {child.current_module_title}
            </p>
          ) : (
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-1">
              &gt; All modules completed or not yet started
            </p>
          )}
        </div>
        {child.flags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
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

      {/* ── Stats grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* Progress */}
        <div className="border border-slate-800 bg-black/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#00c8ff]" />
            <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
              Progress
            </p>
          </div>
          <p className="font-display font-black text-2xl text-[#00c8ff]">
            {child.modules_completed}
            <span className="text-xs text-slate-500 font-mono"> / 10</span>
          </p>
          <p className="font-mono text-[9px] text-slate-600 uppercase tracking-wider mt-1">
            Modules Completed
          </p>
        </div>

        {/* Proofs */}
        <div className="border border-slate-800 bg-black/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-[#7b4fce]" />
            <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
              Proof Submissions
            </p>
          </div>
          <p className="font-display font-black text-2xl text-[#7b4fce]">
            {child.proof_approved_total}
            <span className="text-xs text-slate-500 font-mono">
              {' '}/ {child.proof_submissions_total}
            </span>
          </p>
          <p className="font-mono text-[9px] text-slate-600 uppercase tracking-wider mt-1">
            Approved / Submitted
          </p>
        </div>

        {/* Discussion */}
        <div className="border border-slate-800 bg-black/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-[#39ff14]" />
            <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
              Discussion
            </p>
          </div>
          <p className="font-display font-black text-2xl text-[#39ff14]">
            {child.discussion_activity_count}
          </p>
          <p className="font-mono text-[9px] text-slate-600 uppercase tracking-wider mt-1">
            Total Posts
          </p>
        </div>

        {/* Latest Activity */}
        <div className="border border-slate-800 bg-black/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#f5c518]" />
            <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
              Last Active
            </p>
          </div>
          <p className="font-mono text-xs text-[#f5c518] font-bold leading-tight">
            {formatTimestamp(child.latest_activity_at)}
          </p>
        </div>
      </div>

      {/* ── AI Build Status ─────────────────────────────────── */}
      <div className="border-t border-slate-800 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-[#00c8ff]" />
          <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
            AI Build Status
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
            {children.map((child) => (
              <DigestCard key={child.student_id} child={child} />
            ))}
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
