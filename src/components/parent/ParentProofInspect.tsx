'use client';

import React, { useState } from 'react';
import { FileText, Eye, CheckCircle2, Clock, AlertCircle, X, Download } from 'lucide-react';

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
}

interface Apprentice {
  id: string;
  full_name: string;
  email: string;
}

interface ParentProofInspectProps {
  apprentices: Apprentice[];
  submissions: Submission[];
  modulesList: { id: string; num: number; title: string }[];
}

export default function ParentProofInspect({
  apprentices,
  submissions,
  modulesList,
}: ParentProofInspectProps) {
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  // Group submissions by apprentice and module
  const groupedSubmissions: Record<string, Record<string, Submission[]>> = {};

  for (const sub of submissions) {
    if (!groupedSubmissions[sub.student_id]) groupedSubmissions[sub.student_id] = {};
    if (!groupedSubmissions[sub.student_id][sub.module_id]) {
      groupedSubmissions[sub.student_id][sub.module_id] = [];
    }
    groupedSubmissions[sub.student_id][sub.module_id].push(sub);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-[#39ff14] border-[#39ff14]/30 bg-[#39ff14]/5';
      case 'submitted':
      case 'under_review':
        return 'text-[#00c8ff] border-[#00c8ff]/30 bg-[#00c8ff]/5';
      case 'revise':
        return 'text-red-400 border-red-500/30 bg-red-950/10';
      default:
        return 'text-yellow-500 border-yellow-500/30 bg-yellow-950/5';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#39ff14]" />;
      case 'submitted':
      case 'under_review':
        return <Clock className="w-3.5 h-3.5 text-[#00c8ff]" />;
      case 'revise':
        return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-yellow-500" />;
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      
      {apprentices.map((apprentice) => {
        const studentModules = groupedSubmissions[apprentice.id] || {};
        const activeModuleIds = Object.keys(studentModules);

        if (activeModuleIds.length === 0) {
          return (
            <div key={apprentice.id} className="bg-black/30 border border-slate-800 p-6 text-center font-mono text-xs text-slate-500">
              📁 Apprentice <span className="text-slate-300 font-bold">{apprentice.full_name}</span> has not generated any draft or proof artifacts yet.
            </div>
          );
        }

        return (
          <div key={apprentice.id} className="space-y-4">
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">&gt; Apprentice: {apprentice.full_name}</p>

            {activeModuleIds.map((moduleId) => {
              const modInfo = modulesList.find((m) => m.id === moduleId);
              const items = studentModules[moduleId] || [];

              return (
                <div key={moduleId} className="bg-black/40 border border-slate-800 p-5 space-y-4">
                  
                  {/* Module Header */}
                  <div className="flex justify-between items-center border-b border-slate-800/80 pb-3 font-mono">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Module {modInfo?.num || '?'}: {modInfo?.title || 'Unknown Module'}
                    </span>
                    <span className="text-[9px] text-slate-500 uppercase">
                      {items.length} file{items.length !== 1 ? 's' : ''} logged
                    </span>
                  </div>

                  {/* Artifact Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((sub) => (
                      <div
                        key={sub.id}
                        className={`border p-4 flex flex-col justify-between space-y-4 ${getStatusColor(sub.status)}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                              {sub.artifact_type === 'study_rules' ? '💼 Warrior Code' : '🛡 Boundaries Plan'}
                            </p>
                            <p className="font-mono text-[9px] text-slate-500 mt-0.5">
                              Type: {sub.artifact_type}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(sub.status)}
                            <span className="font-mono text-[9px] uppercase font-bold tracking-widest">
                              {sub.status === 'revise' ? 'Needs Revision' : sub.status}
                            </span>
                          </div>
                        </div>

                        {sub.status === 'revise' && sub.review_notes && (
                          <div className="bg-red-950/20 border border-red-500/10 p-2.5 rounded font-mono text-[10px] text-slate-300 leading-relaxed">
                            <span className="text-red-400 font-bold block uppercase tracking-widest text-[8px] mb-0.5">Admin comment:</span>
                            "{sub.review_notes}"
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedSub(sub)}
                          className="flex items-center justify-center gap-2 w-full bg-slate-950 hover:bg-white hover:text-black text-slate-300 border border-slate-800 py-2 rounded text-[10px] font-mono font-bold uppercase tracking-widest transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect Apprentice Proof
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        );
      })}

      {/* POP-UP MODAL PREVIEWER */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#070b19] border border-slate-800 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-800">
              <div className="font-mono">
                <span className="text-[9px] text-[#00c8ff] uppercase tracking-widest block">Secure Parent Review</span>
                <span className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  {selectedSub.artifact_type === 'study_rules' ? 'Digital Warrior Code' : 'Highest Path Boundaries Plan'}
                </span>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-1 border border-slate-800 rounded hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              
              {/* Form payload view */}
              <div className="space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1 flex items-center gap-1.5">
                  📁 Apprentice Written Work
                </h4>

                {selectedSub.artifact_type === 'study_rules' ? (
                  <div className="space-y-3 bg-black/40 border border-slate-850 p-4 font-mono text-[11px] text-slate-300">
                    <div>
                      <span className="text-[#00c8ff] uppercase text-[8px] block mb-0.5">&gt; TECH EMPOWERMENT GOAL:</span>
                      <p className="pl-2 border-l border-slate-800 text-slate-200">"{selectedSub.content_payload?.beMore || '—'}"</p>
                    </div>
                    <div>
                      <span className="text-[#00c8ff] uppercase text-[8px] block mb-0.5">&gt; ATTENTION SHIELD PLAN:</span>
                      <p className="pl-2 border-l border-slate-800 text-slate-200">"{selectedSub.content_payload?.protectAttention || '—'}"</p>
                    </div>
                    <div>
                      <span className="text-[#00c8ff] uppercase text-[8px] block mb-0.5">&gt; TRUST VERIFICATION PATH:</span>
                      <p className="pl-2 border-l border-slate-800 text-slate-200">"{selectedSub.content_payload?.beforeTrust || '—'}"</p>
                    </div>
                    <div>
                      <span className="text-[#00c8ff] uppercase text-[8px] block mb-0.5">&gt; AI SAFETY ALIGNMENT:</span>
                      <p className="pl-2 border-l border-slate-800 text-slate-200">"{selectedSub.content_payload?.stillEnsure || '—'}"</p>
                    </div>
                    <div>
                      <span className="text-[#00c8ff] uppercase text-[8px] block mb-0.5">&gt; INTEGRITY CHECKPOINT QUESTION:</span>
                      <p className="pl-2 border-l border-slate-800 text-slate-200">"{selectedSub.content_payload?.highestPathQ || '—'}"</p>
                    </div>
                    <div>
                      <span className="text-[#00c8ff] uppercase text-[8px] block mb-0.5">&gt; TARGET HABIT REFINEMENT:</span>
                      <p className="pl-2 border-l border-slate-800 text-slate-200">"{selectedSub.content_payload?.habitToImprove || '—'}"</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 bg-black/40 border border-slate-850 p-4 font-mono text-[11px] text-slate-300">
                    {[1, 2, 3].map(n => {
                      const b = selectedSub.content_payload?.[`boundary${n}`] || {};
                      return (
                        <div key={n} className="border-b last:border-0 border-slate-800/40 pb-3 last:pb-0">
                          <span className="text-[#7b4fce] uppercase text-[8px] font-bold block mb-1">&gt; BOUNDARY {n}:</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pl-2 border-l border-slate-800">
                            <div>
                              <span className="text-[7px] text-slate-500 uppercase block">Rule</span>
                              <span className="text-slate-200">"{b.boundary || '—'}"</span>
                            </div>
                            <div>
                              <span className="text-[7px] text-slate-500 uppercase block">Rationale</span>
                              <span className="text-slate-200">"{b.whyMatters || '—'}"</span>
                            </div>
                            <div>
                              <span className="text-[7px] text-slate-500 uppercase block">Triggers</span>
                              <span className="text-slate-200">"{b.when || '—'}"</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Secure Media previewer */}
              <div className="space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1 flex items-center gap-1.5">
                  💾 Supplementary Media
                </h4>

                {selectedSub.previewUrl ? (
                  <div className="space-y-3">
                    {/* PDF iframe view */}
                    {selectedSub.mime_type === 'application/pdf' && (
                      <div className="border border-slate-800 rounded overflow-hidden shadow-inner h-[280px]">
                        <iframe
                          src={selectedSub.previewUrl}
                          className="w-full h-full border-0"
                          title="Parent Document Preview"
                        />
                      </div>
                    )}

                    {/* Image display */}
                    {selectedSub.mime_type?.startsWith('image/') && (
                      <div className="border border-slate-800 rounded bg-black/40 flex items-center justify-center p-3 max-h-[260px] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedSub.previewUrl}
                          alt="Student Proof Attachment"
                          className="max-h-[220px] object-contain rounded border border-slate-800 shadow"
                        />
                      </div>
                    )}

                    {/* Audio streaming */}
                    {selectedSub.mime_type?.startsWith('audio/') && (
                      <div className="border border-slate-800 rounded bg-black/40 p-4 flex flex-col items-center justify-center">
                        <audio src={selectedSub.previewUrl} controls className="w-full h-8" />
                      </div>
                    )}

                    {/* Video streaming */}
                    {selectedSub.mime_type?.startsWith('video/') && (
                      <div className="border border-slate-800 rounded bg-black overflow-hidden h-[200px] flex items-center justify-center">
                        <video src={selectedSub.previewUrl} controls className="w-full h-full" />
                      </div>
                    )}

                    {/* File metadata and download */}
                    <div className="flex justify-between items-center bg-black/40 border border-slate-800 rounded p-3 font-mono text-[9px] text-slate-400">
                      <span className="truncate pr-4 font-semibold text-slate-300">
                        💾 {selectedSub.original_name} ({formatSize(selectedSub.file_size)})
                      </span>
                      <a
                        href={selectedSub.previewUrl}
                        download
                        className="flex items-center gap-1 bg-[#7b4fce] text-white px-2.5 py-1.5 rounded hover:bg-white hover:text-black font-bold uppercase transition-colors"
                      >
                        <Download className="w-3 h-3" /> Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-800 rounded p-4 text-center text-slate-500 font-mono text-xs">
                    No files or media attachments uploaded by the student.
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
