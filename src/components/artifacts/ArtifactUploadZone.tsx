'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getSignedDownloadUrl, deleteArtifactFile } from '@/lib/artifacts/storage';

interface FileInfo {
  filePath: string;
  originalName: string;
  fileSize?: number;
  mimeType?: string;
}

interface ArtifactUploadZoneProps {
  studentId: string;
  moduleId: string;
  artifactType: 'study_rules' | 'error_review';
  initialFile: FileInfo | null;
  status: string;
  onUploadComplete: (fileInfo: { filePath: string; fileSize: number; mimeType: string; originalName: string }) => void;
  onFileDelete: () => void;
}

export default function ArtifactUploadZone({
  studentId,
  moduleId,
  artifactType,
  initialFile,
  status,
  onUploadComplete,
  onFileDelete,
}: ArtifactUploadZoneProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusMsg, setUploadStatusMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [currentFile, setCurrentFile] = useState<FileInfo | null>(initialFile);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isLocked = status === 'submitted' || status === 'approved';

  // Load preview URL if file exists
  useEffect(() => {
    let active = true;
    async function loadPreview() {
      if (!currentFile?.filePath) {
        setPreviewUrl(null);
        return;
      }
      try {
        const url = await getSignedDownloadUrl(currentFile.filePath);
        if (active) setPreviewUrl(url);
      } catch (err) {
        console.error('Failed to load file preview:', err);
      }
    }
    loadPreview();
    return () => {
      active = false;
    };
  }, [currentFile]);

  // Cyberpunk progress step simulations
  useEffect(() => {
    if (!isUploading) return;
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) return prev;
        const add = Math.floor(Math.random() * 15) + 5;
        const next = prev + add;
        
        // Update cyber status messages
        if (next < 30) setUploadStatusMsg('Initiating handshakes...');
        else if (next < 60) setUploadStatusMsg('Streaming binary packets...');
        else if (next < 85) setUploadStatusMsg('Securing access control keys...');
        else setUploadStatusMsg('Verifying integrity checksums...');
        
        return next > 95 ? 95 : next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isUploading]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLocked) return;

    const file = e.dataTransfer.files[0];
    if (file) await uploadFile(file);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setError(null);
    
    // 1. Validate File Size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File exceeds 10MB limits. Please choose a smaller file.');
      return;
    }

    // 2. Validate Allowed MIME types
    const allowedMimeTypes = [
      'image/png', 'image/jpeg', 'image/gif',
      'application/pdf',
      'audio/mpeg', 'audio/wav', 'audio/webm',
      'video/mp4'
    ];
    if (!allowedMimeTypes.includes(file.type)) {
      setError('Invalid file format. Supported: PNG, JPEG, GIF, PDF, MP3, WAV, WEBM, MP4.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStatusMsg('Connecting to secure storage...');

    try {
      const fileExt = file.name.split('.').pop();
      const path = `${studentId}/${moduleId}/${artifactType}_${Date.now()}.${fileExt}`;

      // Upload file directly to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('proof-artifacts')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      setUploadProgress(100);
      setUploadStatusMsg('Upload verified successfully!');
      
      const fileDetails = {
        filePath: path,
        fileSize: file.size,
        mimeType: file.type,
        originalName: file.name
      };

      setCurrentFile(fileDetails);
      onUploadComplete(fileDetails);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (isLocked || !currentFile) return;
    setError(null);
    try {
      await deleteArtifactFile(currentFile.filePath);
      setCurrentFile(null);
      setPreviewUrl(null);
      onFileDelete();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err?.message || 'Failed to delete file.');
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const renderPreview = () => {
    if (!previewUrl || !currentFile) return null;

    const mime = currentFile.mimeType || '';
    if (mime.startsWith('image/')) {
      return (
        <div className="relative group rounded-lg overflow-hidden border border-slate-700/60 max-w-sm mx-auto shadow-lg bg-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt={currentFile.originalName} className="object-contain w-full h-48 group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <a href={previewUrl} target="_blank" rel="noreferrer" className="bg-[#00c8ff] text-black font-mono text-xs px-3 py-1.5 rounded font-bold uppercase tracking-wider hover:bg-white transition-colors">
              Open Full Resolution
            </a>
          </div>
        </div>
      );
    }

    if (mime === 'application/pdf') {
      return (
        <div className="flex flex-col items-center justify-center p-6 border border-[#7b4fce]/30 rounded-lg bg-[#7b4fce]/5 max-w-sm mx-auto shadow-md">
          <svg className="w-12 h-12 text-[#7b4fce] mb-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-mono text-sm text-slate-300 mb-4 line-clamp-1">{currentFile.originalName}</span>
          <a href={previewUrl} target="_blank" rel="noreferrer" className="w-full text-center bg-[#7b4fce] text-white font-mono text-xs py-2 rounded font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all">
            View PDF Document
          </a>
        </div>
      );
    }

    if (mime.startsWith('audio/')) {
      return (
        <div className="p-4 border border-cyan-500/20 rounded-lg bg-slate-900/60 max-w-sm mx-auto shadow-md">
          <p className="font-mono text-xs text-slate-400 mb-2 truncate">🔊 {currentFile.originalName}</p>
          <audio src={previewUrl} controls className="w-full h-8" />
        </div>
      );
    }

    if (mime.startsWith('video/')) {
      return (
        <div className="rounded-lg overflow-hidden border border-slate-700 max-w-sm mx-auto bg-black shadow-md">
          <video src={previewUrl} controls className="w-full h-48" />
        </div>
      );
    }

    // Fallback document view
    return (
      <div className="flex flex-col items-center p-4 border border-slate-700 rounded-lg max-w-sm mx-auto">
        <span className="font-mono text-xs text-slate-400 line-clamp-1">{currentFile.originalName}</span>
        <a href={previewUrl} download className="mt-2 text-xs text-[#00c8ff] underline font-mono">Download File</a>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. Droppable Upload Area */}
      {!currentFile && !isUploading && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isLocked && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px] ${
            isLocked
              ? 'border-slate-800 bg-slate-900/20 cursor-not-allowed'
              : isDragging
              ? 'border-[#00c8ff] bg-[#00c8ff]/10 shadow-[0_0_15px_rgba(0,200,255,0.15)] scale-[0.99]'
              : 'border-slate-700/60 bg-black/40 hover:border-slate-500 hover:bg-slate-800/10'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            disabled={isLocked}
            className="hidden"
            accept=".png,.jpg,.jpeg,.gif,.pdf,.mp3,.wav,.webm,.mp4"
          />

          <svg className={`w-10 h-10 mb-3 ${isDragging ? 'text-[#00c8ff]' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>

          <p className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-1.5">
            {isLocked ? 'Form locked for evaluation' : 'Drag & Drop Proof Artifact'}
          </p>
          <p className="font-mono text-[10px] text-slate-600 uppercase">
            Supports Photos, PDFs, and Recordings (&lt; 10MB)
          </p>
        </div>
      )}

      {/* 2. Loading State */}
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

      {/* 3. Render Secure Preview & Meta */}
      {currentFile && !isUploading && (
        <div className="space-y-4">
          {renderPreview()}

          <div className="flex items-center justify-between p-3 border border-slate-800 rounded bg-black/40 max-w-sm mx-auto font-mono text-[11px] text-slate-400">
            <div className="truncate pr-4 flex flex-col">
              <span className="text-slate-300 font-semibold truncate max-w-[200px]">{currentFile.originalName}</span>
              {currentFile.fileSize && <span className="text-[10px] text-slate-500">{formatSize(currentFile.fileSize)}</span>}
            </div>
            {!isLocked && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-red-400 hover:text-red-500 font-bold uppercase tracking-wider text-[10px]"
              >
                Delete File
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Display Error Alerts */}
      {error && (
        <div className="p-3 border border-red-500/30 rounded bg-red-950/20 text-red-400 font-mono text-xs max-w-sm mx-auto flex items-center justify-center">
          ⚠ {error}
        </div>
      )}
    </div>
  );
}
