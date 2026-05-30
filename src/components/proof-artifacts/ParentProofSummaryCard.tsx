'use client';

import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, Activity } from 'lucide-react';

interface ParentProofSummaryProps {
  summary: {
    studentId: string;
    approvedCount: number;
    pendingReviewCount: number;
    needsRevisionCount: number;
    latestApprovedAt: string | null;
    latestSubmittedAt: string | null;
    parentCanDownloadApproved: boolean;
  };
}

export function ParentProofSummaryCard({ summary }: ParentProofSummaryProps) {
  const total = summary.approvedCount + summary.pendingReviewCount + summary.needsRevisionCount;

  return (
    <div className="glass-card p-6 !rounded-none border border-slate-800">
      <div className="flex items-center gap-3 mb-5">
        <Activity className="text-[#00c8ff] w-5 h-5" />
        <h3 className="font-display font-bold text-[var(--text-primary)] uppercase tracking-wider">Proof Progress</h3>
      </div>

      {total === 0 ? (
        <div className="text-center py-6">
          <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">
            No proof submissions yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-black/40 border border-slate-800 p-3 text-center">
            <ShieldCheck className="w-5 h-5 text-[#39ff14] mx-auto mb-2" />
            <p className="text-xl font-display font-black text-[var(--text-primary)]">{summary.approvedCount}</p>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Approved</p>
          </div>
          
          <div className="bg-black/40 border border-slate-800 p-3 text-center">
            <Clock className="w-5 h-5 text-[#00c8ff] mx-auto mb-2" />
            <p className="text-xl font-display font-black text-[var(--text-primary)]">{summary.pendingReviewCount}</p>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Pending</p>
          </div>
          
          <div className="bg-black/40 border border-slate-800 p-3 text-center">
            <AlertTriangle className="w-5 h-5 text-[#7b4fce] mx-auto mb-2" />
            <p className="text-xl font-display font-black text-[var(--text-primary)]">{summary.needsRevisionCount}</p>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Needs Action</p>
          </div>
        </div>
      )}

      {summary.latestApprovedAt && (
        <div className="bg-[#39ff14]/10 border border-[#39ff14]/30 px-4 py-2 mt-2">
          <p className="text-xs font-mono text-[#39ff14] uppercase tracking-widest">
            Latest Approval: {new Date(summary.latestApprovedAt).toLocaleDateString()}
          </p>
        </div>
      )}
      {!summary.latestApprovedAt && summary.latestSubmittedAt && (
        <div className="bg-[#00c8ff]/10 border border-[#00c8ff]/30 px-4 py-2 mt-2">
          <p className="text-xs font-mono text-[#00c8ff] uppercase tracking-widest">
            Latest Submission: {new Date(summary.latestSubmittedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Beta visibility notice */}
      <div className="mt-4 px-3 py-2 bg-slate-800/50 border border-slate-700">
        <p className="text-[10px] font-mono text-slate-500 leading-relaxed">
          During beta, this card shows proof counts only. Proofs are usually reviewed within 2 business days. File downloads are not available for parents at this time.
        </p>
      </div>
    </div>
  );
}

