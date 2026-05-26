'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ProofArtifactStatusBadge } from './ProofArtifactStatusBadge';
import { ProofArtifactReviewPanel } from './ProofArtifactReviewPanel';
import { File, ImageIcon, Video, FileText, RefreshCw } from 'lucide-react';
import { ArtifactStatus } from '@/lib/proof-artifacts/state-machine';
import { getProofReviewSlaStatus, getProofReviewSlaLabel, getSlaBadgeColor } from '@/lib/proof-artifacts/review-sla-policy';

interface Artifact {
  id: string;
  student_id: string;
  module_id: string;
  title: string;
  description: string;
  file_name: string;
  file_size_bytes?: number;
  media_kind: string;
  status: ArtifactStatus;
  submitted_at: string;
  profiles: {
    full_name: string;
  };
}

export function ProofArtifactReviewQueue() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [mediaFilter, setMediaFilter] = useState<string>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/proof-artifacts/review-queue');
      const data = await res.json();
      if (res.ok && data.ok) {
        setArtifacts(data.data);
      } else {
        throw new Error(data.error || 'Failed to load queue');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleReviewSubmitted = (id: string) => {
    setArtifacts(prev => prev.filter(a => a.id !== id));
    setSelectedId(null);
  };

  const getMediaIcon = (kind: string) => {
    switch(kind) {
      case 'photo': return <ImageIcon className="w-5 h-5 text-[#00c8ff]" />;
      case 'document': return <FileText className="w-5 h-5 text-[#00c8ff]" />;
      case 'audio': return <File className="w-5 h-5 text-[#00c8ff]" />;
      case 'video': return <Video className="w-5 h-5 text-[#00c8ff]" />;
      default: return <File className="w-5 h-5 text-[#00c8ff]" />;
    }
  };

  const filteredArtifacts = useMemo(() => {
    return artifacts.filter(art => {
      if (statusFilter !== 'all' && art.status !== statusFilter) return false;
      if (mediaFilter !== 'all' && art.media_kind !== mediaFilter) return false;
      if (moduleFilter !== 'all' && art.module_id !== moduleFilter) return false;
      return true;
    });
  }, [artifacts, statusFilter, mediaFilter, moduleFilter]);

  const uniqueModules = useMemo(() => Array.from(new Set(artifacts.map(a => a.module_id))), [artifacts]);

  const selectedArtifact = artifacts.find(a => a.id === selectedId);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Queue List */}
      <div className="flex-1">
        <h2 className="text-xl font-display font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Pending Review ({artifacts.length})</span>
          <button onClick={fetchQueue} className="text-[#00c8ff] hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <select 
            className="bg-black/50 border border-slate-700 text-slate-300 text-xs p-2 uppercase tracking-wider"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="revise">Needs Revision</option>
            <option value="rejected">Rejected</option>
            <option value="approved">Approved</option>
          </select>

          <select 
            className="bg-black/50 border border-slate-700 text-slate-300 text-xs p-2 uppercase tracking-wider"
            value={mediaFilter}
            onChange={(e) => setMediaFilter(e.target.value)}
          >
            <option value="all">All Media</option>
            <option value="photo">Photo</option>
            <option value="document">Document</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>

          <select 
            className="bg-black/50 border border-slate-700 text-slate-300 text-xs p-2 uppercase tracking-wider"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
          >
            <option value="all">All Modules</option>
            {uniqueModules.map(mod => (
              <option key={mod} value={mod}>Module {mod.substring(0,8)}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-slate-500 font-mono text-sm animate-pulse">Loading queue...</div>
        ) : error ? (
          <div className="text-red-400 font-mono text-sm">{error}</div>
        ) : filteredArtifacts.length === 0 ? (
          <div className="bg-black/40 border border-dashed border-slate-700 p-12 text-center text-slate-500 font-mono text-sm uppercase tracking-widest">
            Queue is empty
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredArtifacts.map(art => (
              <div 
                key={art.id} 
                onClick={() => setSelectedId(art.id)}
                className={`bg-black/50 border p-4 cursor-pointer transition-colors ${
                  selectedId === art.id 
                    ? 'border-[#00c8ff] shadow-[0_0_15px_rgba(0,200,255,0.15)]' 
                    : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    {getMediaIcon(art.media_kind)}
                    <div>
                      <h4 className="text-[var(--text-primary)] font-bold text-sm uppercase tracking-wider">{art.profiles?.full_name || 'Unknown Student'}</h4>
                      <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">Module {art.module_id.substring(0, 8)}</p>
                    </div>
                  </div>
                  <ProofArtifactStatusBadge status={art.status} />
                </div>
                {art.submitted_at && (() => {
                  const slaStatus = getProofReviewSlaStatus(art.submitted_at);
                  const slaLabel = getProofReviewSlaLabel(slaStatus);
                  const slaColor = getSlaBadgeColor(slaStatus);
                  return slaStatus !== 'on_track' ? (
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border ${slaColor}`}>
                      {slaLabel}
                    </span>
                  ) : null;
                })()}
                <div className="mt-3 pl-8">
                  <p className="text-slate-300 text-sm font-medium">{art.title}</p>
                  <p className="text-slate-500 font-mono text-xs truncate mt-1">{art.file_name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Panel */}
      <div className="lg:w-96">
        <h2 className="text-xl font-display font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
          Review Action
        </h2>
        <ProofArtifactReviewPanel selectedArtifact={selectedArtifact} onReviewSubmitted={(id) => handleReviewSubmitted(id)} />
      </div>
    </div>
  );
}
