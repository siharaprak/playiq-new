'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, File, Image as ImageIcon, Video, FileText, RefreshCw } from 'lucide-react';
import { 
  MediaKind, 
  MAX_PHOTO_SIZE_BYTES, MAX_DOCUMENT_SIZE_BYTES, MAX_AUDIO_SIZE_BYTES, MAX_VIDEO_SIZE_BYTES,
  ALLOWED_PHOTO_MIMES, ALLOWED_DOCUMENT_MIMES, ALLOWED_AUDIO_MIMES, ALLOWED_VIDEO_MIMES
} from '@/lib/proof-artifacts/types';

interface Props {
  moduleId: string;
  onUploadSuccess?: () => void;
  resubmitArtifactId?: string | null;
  onCancelResubmit?: () => void;
}

export function ProofArtifactUploader({ moduleId, onUploadSuccess, resubmitArtifactId, onCancelResubmit }: Props) {
  const [mediaKind, setMediaKind] = useState<MediaKind>('photo');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptString = () => {
    switch(mediaKind) {
      case 'photo': return ALLOWED_PHOTO_MIMES.join(',');
      case 'document': return ALLOWED_DOCUMENT_MIMES.join(',');
      case 'audio': return ALLOWED_AUDIO_MIMES.join(',');
      case 'video': return ALLOWED_VIDEO_MIMES.join(',');
    }
  };

  const getMaxSize = () => {
    switch(mediaKind) {
      case 'photo': return MAX_PHOTO_SIZE_BYTES;
      case 'document': return MAX_DOCUMENT_SIZE_BYTES;
      case 'audio': return MAX_AUDIO_SIZE_BYTES;
      case 'video': return MAX_VIDEO_SIZE_BYTES;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > getMaxSize()) {
      setError(`File is too large. Maximum size for ${mediaKind} is ${getMaxSize() / (1024 * 1024)}MB.`);
      return;
    }

    setFile(selected);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;
    setError('');
    setUploading(true);
    setProgress(10);

    try {
      // 1. Get upload slot
      const slotRes = await fetch('/api/proof-artifacts/upload-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          title,
          description,
          fileName: file.name,
          fileSizeBytes: file.size,
          mimeType: file.type || 'application/octet-stream',
          mediaKind,
          resubmitArtifactId: resubmitArtifactId || undefined,
        })
      });

      const slotData = await slotRes.json();
      if (!slotRes.ok || !slotData.ok) {
        throw new Error(slotData.error || 'Failed to get upload slot');
      }

      setProgress(40);

      // 2. Upload to Supabase Storage directly using signed URL
      const { uploadUrl, token, artifactId } = slotData.data;

      // Because we use a signed URL, we do a PUT to that exact URL. We need to append the token in headers.
      // Wait, Supabase createSignedUploadUrl returns a URL that works natively with the Supabase client,
      // or we can use raw fetch. Let's use raw fetch but we must provide Authorization token if required,
      // actually the signedUrl itself usually has the token as a query param or we put it in Authorization header.
      // Supabase docs: curl -X PUT "signedUrl" -H "Authorization: Bearer <token>" -d @file
      
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload file to storage');
      }

      setProgress(90);

      // 3. Finalize upload
      const finalizeRes = await fetch(`/api/proof-artifacts/${artifactId}/finalize`, {
        method: 'POST',
      });

      const finalizeData = await finalizeRes.json();
      if (!finalizeRes.ok || !finalizeData.ok) {
        throw new Error(finalizeData.error || 'Failed to finalize upload');
      }

      setProgress(100);
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      if (onUploadSuccess) onUploadSuccess();

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className={`bg-slate-800/60 p-8 rounded-xl border backdrop-blur-md transition-colors ${resubmitArtifactId ? 'border-[#7b4fce]/60 shadow-[0_0_15px_rgba(123,79,206,0.1)]' : 'border-slate-700'}`}>
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-2">
        <h3 className={`font-bold uppercase tracking-widest text-sm flex items-center gap-2 ${resubmitArtifactId ? 'text-[#7b4fce]' : 'text-white'}`}>
          {resubmitArtifactId ? (
            <><RefreshCw className="w-4 h-4" /> Resubmitting Revision</>
          ) : (
            <><Upload className="w-4 h-4 text-[#00c8ff]" /> Upload Supplemental Proof (Beta)</>
          )}
        </h3>
        
        {resubmitArtifactId && onCancelResubmit && (
          <button 
            onClick={onCancelResubmit}
            disabled={uploading}
            className="text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1 uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            <X className="w-3 h-3" /> Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label className="block text-slate-300 font-mono text-sm mb-3">Media Type</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'photo', icon: ImageIcon, label: 'Photo' },
              { id: 'document', icon: FileText, label: 'Document' },
              { id: 'audio', icon: File, label: 'Audio' },
              { id: 'video', icon: Video, label: 'Video' }
            ].map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  setMediaKind(type.id as MediaKind);
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className={`flex flex-col items-center justify-center p-3 rounded border font-mono text-xs uppercase tracking-wider transition-all ${
                  mediaKind === type.id 
                    ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-[#00c8ff]' 
                    : 'border-slate-700 bg-black/30 text-slate-400 hover:border-slate-500'
                }`}
              >
                <type.icon className="w-5 h-5 mb-1" />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-mono text-xs mb-2 uppercase tracking-wider">Title *</label>
              <input 
                required 
                value={title}
                onChange={e => setTitle(e.target.value)}
                type="text" 
                placeholder="E.g., My written notes"
                disabled={uploading}
                className="w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-300 font-mono text-xs mb-2 uppercase tracking-wider">Description</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Optional context for the reviewer..."
                disabled={uploading}
                className="w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none resize-none h-24" 
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-mono text-xs mb-2 uppercase tracking-wider">File *</label>
            <div 
              className={`border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center h-[164px] text-center transition-colors ${file ? 'bg-[#00c8ff]/5 border-[#00c8ff]/30' : 'bg-black/30 hover:border-slate-500'}`}
            >
              {file ? (
                <div className="flex flex-col items-center">
                  <File className="w-8 h-8 text-[#00c8ff] mb-2" />
                  <p className="text-sm text-slate-200 font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <button 
                    type="button" 
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    disabled={uploading}
                    className="text-red-400 hover:text-red-300 text-xs font-mono uppercase tracking-widest mt-3 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-500 mb-3" />
                  <p className="text-sm text-slate-400 font-mono">Select a {mediaKind} file</p>
                  <p className="text-xs text-slate-600 font-mono mt-1 mb-4">Max size: {getMaxSize() / (1024 * 1024)}MB</p>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 text-xs font-mono uppercase tracking-widest rounded transition-colors"
                  >
                    Browse Files
                  </button>
                </>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept={getAcceptString()}
                onChange={handleFileChange}
                className="hidden" 
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded font-mono">
            {error}
          </div>
        )}

        {uploading && (
          <div className="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
            <div 
              className="bg-[#00c8ff] h-full transition-all duration-300 shadow-[0_0_8px_#00c8ff]" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!file || !title || uploading}
            className={`w-full md:w-auto text-black px-8 py-3 rounded font-bold uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              resubmitArtifactId 
                ? 'bg-[#7b4fce] hover:bg-[#8b5fde]' 
                : 'bg-[#00c8ff] hover:bg-white'
            }`}
          >
            {uploading ? 'Uploading...' : resubmitArtifactId ? 'Submit Revision' : 'Submit Proof'}
          </button>
        </div>
      </form>
    </div>
  );
}
