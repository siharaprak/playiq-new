'use client';

import React, { useEffect, useState } from 'react';
import { ProofArtifactStatusBadge } from './ProofArtifactStatusBadge';
import { Download, File, ImageIcon, Video, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { ArtifactStatus } from '@/lib/proof-artifacts/state-machine';
import { getStudentStatusMessage, getStudentAllowedActions } from '@/lib/proof-artifacts/flow-policy';

interface Artifact {
  id: string;
  title: string;
  description: string;
  file_name: string;
  media_kind: string;
  status: ArtifactStatus;
  review_notes?: string;
  submitted_at: string;
}

interface Props {
  moduleId: string;
  refreshTrigger?: number; // Used to trigger a re-fetch when a new item is uploaded
  onResubmit?: (id: string) => void;
}

export function ProofArtifactList({ moduleId, refreshTrigger = 0, onResubmit }: Props) {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtifacts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/proof-artifacts/student?moduleId=${moduleId}`);
        const data = await res.json();
        if (res.ok && data.ok) {
          setArtifacts(data.data);
        } else {
          throw new Error(data.error || 'Failed to load artifacts');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchArtifacts();
  }, [moduleId, refreshTrigger]);

  const handleDownload = async (id: string, fileName: string) => {
    try {
      const res = await fetch(`/api/proof-artifacts/${id}/download-url`);
      const data = await res.json();
      if (res.ok && data.ok && data.data.url) {
        // Create an invisible link to trigger the download
        const a = document.createElement('a');
        a.href = data.data.url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert('Failed to get download link');
      }
    } catch {
      alert('Error downloading file');
    }
  };

  const getMediaIcon = (kind: string) => {
    switch(kind) {
      case 'photo': return <ImageIcon className="w-5 h-5 text-slate-400" />;
      case 'document': return <FileText className="w-5 h-5 text-slate-400" />;
      case 'audio': return <File className="w-5 h-5 text-slate-400" />;
      case 'video': return <Video className="w-5 h-5 text-slate-400" />;
      default: return <File className="w-5 h-5 text-slate-400" />;
    }
  };

  if (loading) {
    return <div className="text-slate-500 font-mono text-sm animate-pulse">Loading previous submissions...</div>;
  }

  if (error) {
    return <div className="text-red-400 font-mono text-sm border border-red-500/30 p-4 bg-red-500/10">{error}</div>;
  }

  if (artifacts.length === 0) {
    return null; // Don't show anything if empty, let the uploader be the main focus
  }

  return (
    <div className="space-y-4 mt-12">
      <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4 border-b border-slate-700 pb-2">
        Your Uploaded Proofs
      </h3>
      
      <div className="grid gap-4">
        {artifacts.map((art) => (
          <div key={art.id} className="bg-slate-800/40 border border-slate-700 p-5 rounded-lg flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-4">
              <div className="mt-1 bg-black/30 p-2 rounded border border-slate-700 h-fit">
                {getMediaIcon(art.media_kind)}
              </div>
              <div>
                <h4 className="text-[var(--text-primary)] font-bold text-sm">{art.title}</h4>
                <p className="text-slate-500 font-mono text-xs mb-3">{art.file_name}</p>
                <div className="flex items-center gap-3">
                  <ProofArtifactStatusBadge status={art.status} />
                  <span className="text-slate-400 text-xs italic">{getStudentStatusMessage(art.status)}</span>
                </div>
                
                {(art.status === 'revise' || art.status === 'rejected') && art.review_notes && (
                  <div className="mt-4 bg-[#7b4fce]/10 border border-[#7b4fce]/30 p-3 rounded text-sm text-slate-300">
                    <p className="font-bold text-[#7b4fce] uppercase tracking-widest text-xs mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Reviewer Notes
                    </p>
                    <p>{art.review_notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col justify-start items-end gap-2">
              <button 
                onClick={() => handleDownload(art.id, art.file_name)}
                className="text-slate-400 hover:text-white font-mono text-xs flex items-center gap-1 uppercase tracking-widest transition-colors"
              >
                <Download className="w-3 h-3" /> Download
              </button>
              
              {getStudentAllowedActions(art.status).canResubmit && onResubmit && (
                <button
                  onClick={() => onResubmit(art.id)}
                  className="mt-2 bg-[#7b4fce]/20 hover:bg-[#7b4fce]/30 border border-[#7b4fce]/50 text-[#7b4fce] py-1.5 px-3 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Resubmit Proof
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
