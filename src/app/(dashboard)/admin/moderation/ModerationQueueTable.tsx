'use client';

import React, { useState } from 'react';
import { dismissReportAction, removeContentAction } from './actions';
import { ShieldAlert, Trash2, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface ReportItem {
  id: string;
  reason: string;
  created_at: string;
  item_id: string;
  item_type: 'topic' | 'reply';
  reporter_name: string;
  reporter_email: string;
  author_name: string;
  author_email: string;
  content_body: string;
  content_title?: string;
  status: string;
}

interface ModerationQueueTableProps {
  initialReports: ReportItem[];
}

export function ModerationQueueTable({ initialReports }: ModerationQueueTableProps) {
  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeRemoveId, setActiveRemoveId] = useState<string | null>(null);
  const [removalReason, setRemovalReason] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDismiss = async (reportId: string) => {
    setLoadingId(reportId);
    setErrorMsg(null);
    try {
      const res = await dismissReportAction(reportId);
      if (res.success) {
        setReports((prev) => prev.filter((r) => r.id !== reportId));
      } else {
        setErrorMsg(res.error || 'Failed to dismiss report.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemoveContent = async (report: ReportItem) => {
    if (!removalReason.trim()) {
      setErrorMsg('Please specify a reason for content removal.');
      return;
    }

    setLoadingId(report.id);
    setErrorMsg(null);
    try {
      const res = await removeContentAction(report.item_id, report.item_type, removalReason);
      if (res.success) {
        // Clear all reports corresponding to this specific item from our local list
        setReports((prev) => prev.filter((r) => r.item_id !== report.item_id));
        setActiveRemoveId(null);
        setRemovalReason('');
      } else {
        setErrorMsg(res.error || 'Failed to remove content.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="border border-red-500 bg-red-500/10 p-4 flex items-center gap-3 text-red-400 text-sm font-mono">
          <AlertCircle className="w-5 h-5 flex-shrink-0 animate-bounce" />
          <span>&gt; ERROR: {errorMsg}</span>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="glass-card p-16 text-center text-slate-500 flex flex-col items-center justify-center border border-slate-800">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4 opacity-80 animate-pulse" />
          <p className="uppercase tracking-widest text-sm font-bold text-slate-300">QUEUE_CLEAR: ALL SYSTEMS NORMAL</p>
          <p className="text-xs text-slate-600 mt-2">Zero reported posts or comments require moderator review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-[#00c8ff] uppercase tracking-wider font-mono opacity-80 mb-2">
            &gt; {reports.length} UNRESOLVED_FLAGGED_ELEMENTS_RETRIEVED
          </div>
          
          <div className="grid gap-6">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className={`glass-card p-6 border transition-all ${
                  activeRemoveId === report.id ? 'border-red-500 bg-[rgba(239,68,68,0.02)]' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-800/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest ${
                        report.item_type === 'topic' 
                          ? 'text-[#00c8ff] border border-[#00c8ff]/40 bg-[#00c8ff]/5' 
                          : 'text-[#7b4fce] border border-[#7b4fce]/40 bg-[#7b4fce]/5'
                      }`}>
                        {report.item_type === 'topic' ? 'Post Topic' : 'Comment Reply'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Flagged on: {new Date(report.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs font-mono">
                      <span className="text-slate-500">Author:</span> {report.author_name} 
                      <span className="text-slate-600 text-[10px] ml-1">({report.author_email})</span>
                    </p>
                  </div>

                  <div className="bg-red-500/5 border border-red-500/20 p-3 max-w-md">
                    <p className="text-[10px] uppercase font-bold text-red-400 flex items-center gap-1.5 mb-1 font-mono">
                      <ShieldAlert className="w-3.5 h-3.5" /> Flagged Reason
                    </p>
                    <p className="text-xs text-slate-300 italic font-mono leading-relaxed">
                      &quot;{report.reason}&quot;
                    </p>
                    <p className="text-[9px] text-slate-500 mt-2 font-mono text-right">
                      Reported by: {report.reporter_name}
                    </p>
                  </div>
                </div>

                {/* Content Display */}
                <div className="mb-6 p-4 bg-black/40 border border-slate-900 rounded font-sans">
                  {report.content_title && (
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 font-display uppercase tracking-wide">
                      {report.content_title}
                    </h3>
                  )}
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                    {report.content_body}
                  </p>
                </div>

                {/* Action Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                  {activeRemoveId === report.id ? (
                    <div className="w-full space-y-3 font-mono">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Provide audit removal reason... (e.g. Toxicity, Honor Code violation)"
                          value={removalReason}
                          onChange={(e) => setRemovalReason(e.target.value)}
                          className="flex-grow bg-black border border-red-500/50 text-red-400 px-4 py-2 text-xs focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        />
                        <button
                          disabled={loadingId !== null}
                          onClick={() => handleRemoveContent(report)}
                          className="bg-red-500 hover:bg-red-600 text-black text-xs font-bold uppercase tracking-wider px-4 py-2 hover:shadow-[0_0_15px_#ef4444] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Confirm Removal
                        </button>
                        <button
                          disabled={loadingId !== null}
                          onClick={() => {
                            setActiveRemoveId(null);
                            setRemovalReason('');
                          }}
                          className="border border-slate-600 hover:bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider px-4 py-2 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        disabled={loadingId !== null}
                        onClick={() => handleDismiss(report.id)}
                        className="border border-slate-600 hover:bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider px-4 py-2 transition-all font-mono flex items-center gap-2 disabled:opacity-50"
                      >
                        {loadingId === report.id ? (
                          <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        Dismiss Report
                      </button>
                      
                      <button
                        disabled={loadingId !== null}
                        onClick={() => {
                          setActiveRemoveId(report.id);
                          setErrorMsg(null);
                        }}
                        className="bg-red-500/10 border border-red-500 text-red-400 hover:bg-red-500 hover:text-black text-xs font-bold uppercase tracking-wider px-4 py-2 transition-all font-mono flex items-center gap-2 disabled:opacity-50 hover:shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove Content
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
