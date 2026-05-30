'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, File, Trash2, FileText, Image, AlertCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { createAssistantKnowledgeFileRecord, deleteAssistantKnowledgeFile } from '@/lib/assistant/storage';
import type { KnowledgeFile } from '@/lib/assistant/types';

interface KnowledgeFileUploadProps {
  studentId: string;
  assistantProfileId: string;
  files: KnowledgeFile[];
  onFilesChange: (files: KnowledgeFile[]) => void;
  disabled?: boolean;
}

// ── Constants ─────────────────────────────────────────────────────
const MAX_FILES = 5;
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'text/plain': 'TXT',
  'text/markdown': 'MD',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
};

const ACCEPT_STRING = '.pdf,.txt,.md,.docx,.png,.jpg,.jpeg';

/**
 * KnowledgeFileUpload — Drag-and-drop file upload for assistant knowledge files.
 */
export default function KnowledgeFileUpload({
  studentId,
  assistantProfileId,
  files,
  onFilesChange,
  disabled = false,
}: KnowledgeFileUploadProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusMsg, setUploadStatusMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Simulated upload progress ──
  useEffect(() => {
    if (!isUploading) return;
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) return prev;
        const add = Math.floor(Math.random() * 15) + 5;
        const next = prev + add;

        if (next < 30) setUploadStatusMsg('Initiating secure handshake...');
        else if (next < 60) setUploadStatusMsg('Streaming knowledge data...');
        else if (next < 85) setUploadStatusMsg('Indexing file metadata...');
        else setUploadStatusMsg('Verifying integrity...');

        return next > 95 ? 95 : next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isUploading]);

  // ── Validation ──────────────────────────────────────────────────
  const validateFile = (file: globalThis.File): string | null => {
    if (files.length >= MAX_FILES) {
      return `Maximum ${MAX_FILES} files allowed. Remove a file before uploading.`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File exceeds 10MB limit (${formatSize(file.size)}). Choose a smaller file.`;
    }
    if (!ALLOWED_TYPES[file.type]) {
      return 'Unsupported file type. Allowed: PDF, TXT, MD, DOCX, PNG, JPEG.';
    }
    return null;
  };

  // ── Upload Logic ────────────────────────────────────────────────
  const uploadFile = async (file: globalThis.File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStatusMsg('Connecting to secure storage...');

    try {
      // Build upload path
      const filePath = `${studentId}/${assistantProfileId}/${Date.now()}_${file.name}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('knowledge-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw new Error(uploadError.message);

      setUploadProgress(100);
      setUploadStatusMsg('Upload verified!');

      // Create DB record via server action
      const result = await createAssistantKnowledgeFileRecord(
        assistantProfileId,
        file.name,
        filePath,
        file.size,
        file.type
      );

      if (!result.ok) throw new Error(result.error);
      onFilesChange([...files, result.data]);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload file.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Delete Logic ────────────────────────────────────────────────
  const handleDelete = async (knowledgeFile: KnowledgeFile) => {
    if (disabled) return;
    setError(null);
    setDeletingId(knowledgeFile.id);

    try {
      const result = await deleteAssistantKnowledgeFile(knowledgeFile.id, knowledgeFile.file_url || '');
      if (!result.ok) throw new Error(result.error);
      onFilesChange(files.filter((f) => f.id !== knowledgeFile.id));
    } catch (err: any) {
      setError(err?.message || 'Failed to delete file.');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Drag & Drop Handlers ───────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) await uploadFile(file);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
  };

  // ── Helpers ─────────────────────────────────────────────────────
  const getTypeLabel = (mimeType: string | null): string => {
    if (!mimeType) return 'FILE';
    return ALLOWED_TYPES[mimeType] || 'FILE';
  };

  const getTypeIcon = (mimeType: string | null) => {
    if (!mimeType) return <File size={14} className="text-slate-400" />;
    if (mimeType.startsWith('image/')) return <Image size={14} className="text-purple-400" />;
    return <FileText size={14} className="text-cyan-400" />;
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {!disabled && !isUploading && files.length < MAX_FILES && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] ${
            isDragging
              ? 'border-[#00c8ff] bg-[#00c8ff]/10 shadow-[0_0_15px_rgba(0,200,255,0.15)] scale-[0.99]'
              : 'border-slate-700/60 bg-black/40 hover:border-slate-500 hover:bg-slate-800/10'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept={ACCEPT_STRING}
          />

          <Upload
            size={28}
            className={`mb-3 ${isDragging ? 'text-[#00c8ff]' : 'text-slate-500'}`}
          />

          <p className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-1">
            Drag &amp; Drop Knowledge File
          </p>
          <p className="font-mono text-[10px] text-slate-600 uppercase">
            PDF, TXT, MD, DOCX, PNG, JPEG — Max 10MB ({files.length}/{MAX_FILES} files)
          </p>
        </div>
      )}

      {/* Progress */}
      {isUploading && (
        <div className="border border-slate-700/50 rounded-xl p-6 bg-slate-900/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-2 font-mono text-xs text-[#00c8ff]">
            <span className="uppercase tracking-widest">{uploadStatusMsg}</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-[#00c8ff] to-[#7b4fce] h-full rounded-full transition-all duration-150"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((kf) => (
            <div
              key={kf.id}
              className="flex items-center justify-between p-3 border border-slate-800 rounded-lg bg-black/40 font-mono text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                {getTypeIcon(kf.mime_type)}

                <div className="min-w-0">
                  <p className="text-slate-200 truncate max-w-[220px]">{kf.file_name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {kf.file_size && (
                      <span className="text-[10px] text-slate-500">{formatSize(kf.file_size)}</span>
                    )}
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                      {getTypeLabel(kf.mime_type)}
                    </span>
                  </div>
                </div>
              </div>

              {!disabled && (
                <button
                  type="button"
                  disabled={deletingId === kf.id}
                  onClick={() => handleDelete(kf)}
                  className="flex-shrink-0 p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors disabled:opacity-50"
                  aria-label={`Delete ${kf.file_name}`}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Errors */}
      {error && (
        <div className="flex items-center gap-2 p-3 border border-red-500/20 rounded bg-red-950/20 text-red-400 font-mono text-xs">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// ── Utility ─────────────────────────────────────────────────────────
function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
