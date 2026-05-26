'use client';

import React, { useState } from 'react';
import { approveSubmission, requestRevision } from '@/lib/artifacts/admin-actions';
import { 
  FileText, Check, AlertCircle, Clock, Search, 
  ExternalLink, MessageSquare, ShieldAlert
} from 'lucide-react';

interface Submission {
  id: string;
  student_id: string;
  module_id: string;
  artifact_type: string;
  content_payload: any;
  status: string;
  review_notes: string | null;
  file_path: string | null;
  file_size: number | null;
  mime_type: string | null;
  original_name: string | null;
  created_at: string;
  previewUrl: string | null;
  profiles: {
    full_name: string | null;
    email: string;
  };
}

interface ArtifactReviewConsoleProps {
  initialSubmissions: Submission[];
}

export default function ArtifactReviewConsole({ initialSubmissions }: ArtifactReviewConsoleProps) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSubmissions.length > 0 ? initialSubmissions[0].id : null
  );
  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [revisionNotes, setRevisionNotes] = useState<string>('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const selectedSubmission = submissions.find(s => s.id === selectedId);

  // Filter & Search logic
  const filteredSubmissions = submissions.filter(sub => {
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    const name = sub.profiles?.full_name?.toLowerCase() || '';
    const email = sub.profiles?.email?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    const matchesSearch = name.includes(query) || email.includes(query) || sub.artifact_type.includes(query);
    return matchesStatus && matchesSearch;
  });

  const handleApprove = async (id: string) => {
    setActionError(null);
    setActionSuccess(null);
    setSubmitting(true);

    try {
      await approveSubmission(id);
      
      // Update local state status to 'approved'
      setSubmissions(prev => 
        prev.map(s => s.id === id ? { ...s, status: 'approved' } : s)
      );
      
      setActionSuccess('Artifact approved successfully!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message || 'Failed to approve submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestRevision = async (id: string) => {
    if (!revisionNotes || revisionNotes.trim().length === 0) {
      setActionError('Revision request notes are required.');
      return;
    }

    setActionError(null);
    setActionSuccess(null);
    setSubmitting(true);

    try {
      await requestRevision(id, revisionNotes);
      
      // Update local state to 'revise'
      setSubmissions(prev => 
        prev.map(s => s.id === id ? { ...s, status: 'revise', review_notes: revisionNotes } : s)
      );
      
      setActionSuccess('Revision request submitted to student.');
      setRevisionNotes('');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message || 'Failed to submit revision request.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <span className="bg-cyan-950/40 text-[#00c8ff] border border-[#00c8ff]/30 text-[9px] px-2 py-0.5 font-mono uppercase font-bold tracking-wider">Submitted</span>;
      case 'under_review':
        return <span className="bg-purple-950/40 text-[#7b4fce] border border-[#7b4fce]/30 text-[9px] px-2 py-0.5 font-mono uppercase font-bold tracking-wider">Under Review</span>;
      case 'approved':
        return <span className="bg-green-950/40 text-green-400 border border-green-500/30 text-[9px] px-2 py-0.5 font-mono uppercase font-bold tracking-wider">Approved</span>;
      case 'revise':
        return <span className="bg-red-950/40 text-red-400 border border-red-500/30 text-[9px] px-2 py-0.5 font-mono uppercase font-bold tracking-wider">Revision Req</span>;
      default:
        return <span className="bg-slate-900 text-slate-400 text-[9px] px-2 py-0.5 font-mono uppercase font-bold tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: Filter and List Pane */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Filter Toolbar */}
        <div className="glass-card !rounded-none border border-slate-800 p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by student name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded pl-10 pr-4 py-2.5 font-mono text-xs text-[var(--text-primary)] outline-none"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {['all', 'submitted', 'revise', 'approved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-all ${
                  filterStatus === status 
                    ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-[#00c8ff]'
                    : 'border-slate-800 bg-black/20 text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((sub) => {
              const isSelected = sub.id === selectedId;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedId(sub.id)}
                  className={`glass-card !rounded-none p-4 border transition-all cursor-pointer relative ${
                    isSelected 
                      ? 'border-[#00c8ff] bg-[#00c8ff]/5 shadow-[0_0_10px_rgba(0,200,255,0.05)]'
                      : 'border-slate-800 bg-black/20 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-display font-bold text-sm text-slate-200 truncate max-w-[200px]">
                        {sub.profiles?.full_name || 'Student'}
                      </p>
                      <p className="font-mono text-[10px] text-slate-500 truncate max-w-[200px]">
                        {sub.profiles?.email}
                      </p>
                    </div>
                    {getStatusBadge(sub.status)}
                  </div>

                  <div className="flex items-center justify-between mt-3 font-mono text-[9px] text-slate-400 uppercase tracking-wider">
                    <span>
                      {sub.artifact_type === 'study_rules' ? '💼 Warrior Code' : '🛡 Boundaries Plan'}
                    </span>
                    <span className="text-slate-600">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="glass-card !rounded-none p-12 text-center text-slate-500 font-mono border border-slate-800 bg-black/10">
              <FileText className="w-8 h-8 mx-auto mb-3 opacity-30 text-[#7b4fce]" />
              <p className="uppercase tracking-widest text-[10px]">No submissions found matching criteria.</p>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: Active Inspection Pane */}
      <div className="lg:col-span-7">
        {selectedSubmission ? (
          <div className="glass-card !rounded-none border border-slate-800 bg-[#070b19] p-6 space-y-6">
            
            {/* Header Details */}
            <div className="border-b border-slate-800 pb-4 flex justify-between items-start gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase text-[#00c8ff] tracking-widest mb-1">Active Inspection</p>
                <h3 className="font-display font-black text-xl tracking-wider text-slate-200">
                  {selectedSubmission.profiles?.full_name || 'Student Record'}
                </h3>
                <p className="font-mono text-xs text-slate-400">{selectedSubmission.profiles?.email}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[9px] uppercase text-slate-500 tracking-wider">Artifact Type</p>
                <p className="font-mono text-xs font-bold text-[#7b4fce] uppercase tracking-widest">
                  {selectedSubmission.artifact_type}
                </p>
                <p className="font-mono text-[9px] text-slate-600">
                  Submitted {new Date(selectedSubmission.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Written Synthesis Payload Inspection */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs uppercase tracking-widest text-slate-300 border-b border-slate-800 pb-1.5 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#00c8ff]" />
                Written Synthesis Contents
              </h4>

              {selectedSubmission.artifact_type === 'study_rules' ? (
                <div className="space-y-3.5 bg-black/40 border border-slate-800/80 p-4 font-mono text-xs text-slate-300">
                  <div>
                    <span className="text-[#00c8ff] uppercase text-[9px] block mb-0.5">&gt; TECH EMPOWERMENT GOAL:</span>
                    <p className="pl-3 border-l border-slate-800 text-slate-200">"{selectedSubmission.content_payload?.beMore || '—'}"</p>
                  </div>
                  <div>
                    <span className="text-[#00c8ff] uppercase text-[9px] block mb-0.5">&gt; ATTENTION SHIELD PLAN:</span>
                    <p className="pl-3 border-l border-slate-800 text-slate-200">"{selectedSubmission.content_payload?.protectAttention || '—'}"</p>
                  </div>
                  <div>
                    <span className="text-[#00c8ff] uppercase text-[9px] block mb-0.5">&gt; TRUST VERIFICATION PATH:</span>
                    <p className="pl-3 border-l border-slate-800 text-slate-200">"{selectedSubmission.content_payload?.beforeTrust || '—'}"</p>
                  </div>
                  <div>
                    <span className="text-[#00c8ff] uppercase text-[9px] block mb-0.5">&gt; AI SAFETY ALIGNMENT:</span>
                    <p className="pl-3 border-l border-slate-800 text-slate-200">"{selectedSubmission.content_payload?.stillEnsure || '—'}"</p>
                  </div>
                  <div>
                    <span className="text-[#00c8ff] uppercase text-[9px] block mb-0.5">&gt; HIGHEST PATH INTEGRITY QUESTION:</span>
                    <p className="pl-3 border-l border-slate-800 text-slate-200">"{selectedSubmission.content_payload?.highestPathQ || '—'}"</p>
                  </div>
                  <div>
                    <span className="text-[#00c8ff] uppercase text-[9px] block mb-0.5">&gt; TARGET DIGI-HABIT TO REFINE:</span>
                    <p className="pl-3 border-l border-slate-800 text-slate-200">"{selectedSubmission.content_payload?.habitToImprove || '—'}"</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-black/40 border border-slate-800/80 p-4 font-mono text-xs text-slate-300">
                  {[1, 2, 3].map(n => {
                    const b = selectedSubmission.content_payload?.[`boundary${n}`] || {};
                    return (
                      <div key={n} className="border-b last:border-0 border-slate-800/60 pb-3 last:pb-0">
                        <span className="text-[#7b4fce] uppercase text-[9px] font-bold block mb-1">&gt; BOUNDARY PLAN {n}:</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pl-3 border-l border-slate-800">
                          <div>
                            <span className="text-[8px] text-slate-500 uppercase block">Rule</span>
                            <span className="text-slate-200 font-medium">"{b.boundary || '—'}"</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-500 uppercase block">Rationale</span>
                            <span className="text-slate-200">"{b.whyMatters || '—'}"</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-500 uppercase block">Trigger Context</span>
                            <span className="text-slate-200">"{b.when || '—'}"</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Uploaded File Media Previewer */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs uppercase tracking-widest text-slate-300 border-b border-slate-800 pb-1.5 flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-[#7b4fce]" />
                Secure Media Attachment
              </h4>

              {selectedSubmission.previewUrl ? (
                <div className="space-y-3">
                  {/* Embedded PDF view */}
                  {selectedSubmission.mime_type === 'application/pdf' && (
                    <div className="border border-slate-800 rounded bg-black/50 overflow-hidden shadow-inner h-[320px]">
                      <iframe
                        src={selectedSubmission.previewUrl}
                        className="w-full h-full border-0"
                        title={selectedSubmission.original_name || 'PDF Preview'}
                      />
                    </div>
                  )}

                  {/* Embedded image preview */}
                  {selectedSubmission.mime_type?.startsWith('image/') && (
                    <div className="border border-slate-800 rounded bg-black/50 flex items-center justify-center p-4 max-h-[300px] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedSubmission.previewUrl}
                        alt="Submitted Artifact"
                        className="max-h-[260px] object-contain rounded border border-slate-800 shadow"
                      />
                    </div>
                  )}

                  {/* Embedded Audio */}
                  {selectedSubmission.mime_type?.startsWith('audio/') && (
                    <div className="border border-slate-800 rounded bg-black/50 p-6 flex flex-col items-center justify-center space-y-3">
                      <p className="font-mono text-[10px] text-slate-500 uppercase">🎵 High Fidelity Voice Recording</p>
                      <audio src={selectedSubmission.previewUrl} controls className="w-full max-w-md h-8" />
                    </div>
                  )}

                  {/* Embedded Video */}
                  {selectedSubmission.mime_type?.startsWith('video/') && (
                    <div className="border border-slate-800 rounded bg-black overflow-hidden h-[240px] flex items-center justify-center">
                      <video src={selectedSubmission.previewUrl} controls className="w-full h-full" />
                    </div>
                  )}

                  {/* File Metadata Row */}
                  <div className="flex justify-between items-center bg-black/40 border border-slate-800/80 rounded p-3 font-mono text-[10px] text-slate-400">
                    <span className="truncate pr-4 font-semibold text-slate-300">
                      💾 {selectedSubmission.original_name}
                    </span>
                    <span className="text-slate-500 whitespace-nowrap">
                      {selectedSubmission.mime_type} ({formatSize(selectedSubmission.file_size)})
                    </span>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-slate-800 rounded-lg p-6 text-center text-slate-500 font-mono text-xs">
                  No supplemental media uploaded for this submission.
                </div>
              )}
            </div>

            {/* Action Card Pane */}
            {selectedSubmission.status !== 'approved' ? (
              <div className="border border-slate-800/80 bg-black/40 p-4 rounded space-y-4">
                <h5 className="font-mono text-xs uppercase tracking-widest text-[#00c8ff] flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00c8ff]" />
                  Review Operations Dashboard
                </h5>

                {/* Revision Notes Input */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] uppercase text-slate-400">Revision Notes / Feedback comments (Required only for requesting revisions)</label>
                  <textarea
                    rows={3}
                    placeholder="Enter constructive instructions for correction... (e.g. Please clarify Boundary 2 triggers...)"
                    value={revisionNotes}
                    onChange={(e) => setRevisionNotes(e.target.value)}
                    className="w-full bg-black/60 border border-slate-800 focus:border-[#7b4fce] rounded p-2.5 font-mono text-xs text-slate-200 outline-none resize-none"
                  />
                </div>

                {actionError && (
                  <div className="p-3 border border-red-500/20 rounded bg-red-950/20 text-red-400 font-mono text-xs text-center">
                    ⚠ {actionError}
                  </div>
                )}
                {actionSuccess && (
                  <div className="p-3 border border-green-500/20 rounded bg-green-950/20 text-green-400 font-mono text-xs text-center animate-pulse">
                    ✔ {actionSuccess}
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-3 pt-2 font-mono text-xs">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleRequestRevision(selectedSubmission.id)}
                    className="w-full md:w-auto bg-transparent border border-red-500/50 text-red-400 px-6 py-2.5 rounded font-bold uppercase tracking-wider hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    Request Revision
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleApprove(selectedSubmission.id)}
                    className="w-full md:w-auto bg-[#00c8ff] text-black px-8 py-2.5 rounded font-bold uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_15px_rgba(0,200,255,0.1)] disabled:opacity-50"
                  >
                    Approve Artifact
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-green-500/20 bg-green-950/10 p-4 rounded flex items-center gap-3 text-green-400 font-mono text-xs">
                <Check className="w-4 h-4 animate-bounce" />
                <div>
                  <p className="font-bold uppercase tracking-wider">Evaluation Signed & Finalized</p>
                  <p className="text-slate-400">Approved by admin reviewer. Telemetry synced successfully.</p>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="glass-card !rounded-none p-32 text-center text-slate-500 border border-slate-800 bg-black/10 font-mono">
            <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-30 text-[#7b4fce]" />
            <p className="uppercase tracking-widest text-xs mb-2">No submission selected</p>
            <p className="text-[10px] text-slate-600 uppercase">Select an apprentice submission from the deck to begin inspection operations.</p>
          </div>
        )}
      </div>

    </div>
  );
}
