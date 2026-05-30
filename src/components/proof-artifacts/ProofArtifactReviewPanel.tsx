'use client';

import React, { useState } from 'react';
import { ArtifactStatus } from '@/lib/proof-artifacts/state-machine';
import { ProofArtifactPreviewViewer } from './ProofArtifactPreviewViewer';
import { Check, X, RefreshCw } from 'lucide-react';
import { getReviewNoteRequirement, describeProofStatusForReviewer } from '@/lib/proof-artifacts/flow-policy';
import { canTransitionArtifact } from '@/lib/proof-artifacts/state-machine';

interface Artifact {
  id: string;
  student_id: string;
  module_id: string;
  title: string;
  description: string;
  file_name: string;
  media_kind: string;
  mime_type?: string;
  file_size_bytes?: number;
  status: ArtifactStatus;
  submitted_at: string;
  profiles: {
    full_name: string;
  };
}

interface ProofArtifactReviewPanelProps {
  selectedArtifact: Artifact | undefined;
  onReviewSubmitted: (id: string, status: ArtifactStatus) => void;
}

export function ProofArtifactReviewPanel({ selectedArtifact, onReviewSubmitted }: ProofArtifactReviewPanelProps) {
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReview = async (status: ArtifactStatus) => {
    if (!selectedArtifact) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/proof-artifacts/${selectedArtifact.id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewNotes })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        onReviewSubmitted(selectedArtifact.id, status);
        setReviewNotes('');
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch {
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedArtifact) {
    return (
      <div className="bg-black/30 border border-slate-800 p-8 text-center text-slate-500 font-mono text-sm uppercase tracking-widest">
        Select an artifact to review
      </div>
    );
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const hasNotes = reviewNotes.trim().length > 0;
  const isReviseDisabled = submitting || (getReviewNoteRequirement('revise') && !hasNotes) || !canTransitionArtifact(selectedArtifact.status, 'revise', 'reviewer');
  const isRejectDisabled = submitting || (getReviewNoteRequirement('rejected') && !hasNotes) || !canTransitionArtifact(selectedArtifact.status, 'rejected', 'reviewer');
  const isApproveDisabled = submitting || !canTransitionArtifact(selectedArtifact.status, 'approved', 'reviewer');
  const isUnderReviewDisabled = submitting || !canTransitionArtifact(selectedArtifact.status, 'under_review', 'reviewer');

  return (
    <div className="bg-slate-800/60 border border-[#00c8ff]/30 p-5 backdrop-blur-md sticky top-6">
      <div className="mb-4 bg-amber-400/10 border border-amber-400/30 p-3 rounded-sm">
        <p className="text-amber-400 text-xs font-mono">
          <span className="font-bold">Beta safety note:</span> files are type-checked and stored privately, but malware scanning is not active yet. Open only expected files.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-[#00c8ff] font-bold text-sm uppercase tracking-widest mb-1">Artifact Details</h3>
        <p className="text-[var(--text-primary)] text-sm mb-2">{selectedArtifact.title}</p>
        <p className="text-slate-400 text-xs italic mb-2">Status: {describeProofStatusForReviewer(selectedArtifact.status)}</p>
        {selectedArtifact.description && (
          <p className="text-slate-400 text-xs mb-3 italic">&quot;{selectedArtifact.description}&quot;</p>
        )}
        <div className="text-xs font-mono text-slate-400 mt-2 space-y-1">
          <p>Size: {formatFileSize(selectedArtifact.file_size_bytes)}</p>
          <p>Submitted: {new Date(selectedArtifact.submitted_at).toLocaleString()}</p>
        </div>
        
        <ProofArtifactPreviewViewer 
          artifactId={selectedArtifact.id} 
          fileName={selectedArtifact.file_name} 
          mediaKind={selectedArtifact.media_kind}
          mimeType={selectedArtifact.mime_type}
          fileSizeBytes={selectedArtifact.file_size_bytes}
        />
      </div>

      <div className="mb-6">
        <label className="block text-slate-300 font-mono text-xs mb-2 uppercase tracking-wider">
          Review Notes <span className={hasNotes ? "text-slate-500" : "text-[#7b4fce]"}>* Required for revise/reject</span>
        </label>
        <div className="mb-2 bg-slate-800/50 border border-slate-700 p-2 rounded-sm">
          <p className="text-[10px] font-mono text-slate-500 leading-relaxed">
            If the file is broken, corrupted, or unreadable, request revision with a clear note explaining what the student should fix. If the issue cannot be resolved, reject with an explanation.
          </p>
        </div>
        <textarea 
          value={reviewNotes}
          onChange={e => setReviewNotes(e.target.value)}
          placeholder="Feedback for the student..."
          disabled={submitting}
          className="w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none resize-none h-24" 
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <button
          onClick={() => handleReview('approved')}
          disabled={isApproveDisabled}
          className="bg-[#39ff14]/20 hover:bg-[#39ff14]/30 border border-[#39ff14]/50 text-[#39ff14] py-2 px-2 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-4 h-4" /> Approve
        </button>
        <button
          onClick={() => handleReview('revise')}
          disabled={isReviseDisabled}
          className="bg-[#7b4fce]/20 hover:bg-[#7b4fce]/30 border border-[#7b4fce]/50 text-[#7b4fce] py-2 px-2 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className="w-4 h-4" /> Revise
        </button>
      </div>
      <button
        onClick={() => handleReview('rejected')}
        disabled={isRejectDisabled}
        className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 py-2 px-2 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <X className="w-3 h-3" /> Reject (Final)
      </button>
      
      {/* If not currently under review, allow reviewer to claim it */}
      {selectedArtifact.status === 'submitted' && (
        <button
          onClick={() => handleReview('under_review')}
          disabled={isUnderReviewDisabled}
          className="w-full bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-400 py-2 px-2 text-[10px] font-bold uppercase tracking-widest transition-colors mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mark &quot;Under Review&quot;
        </button>
      )}
    </div>
  );
}
