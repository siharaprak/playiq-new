'use client';

import React, { useState, useEffect } from 'react';
import { Download, AlertCircle, RefreshCw, EyeOff } from 'lucide-react';

interface PreviewViewerProps {
  artifactId: string;
  fileName: string;
  mediaKind: string;
  mimeType?: string;
  fileSizeBytes?: number;
}

export function ProofArtifactPreviewViewer({ artifactId, mediaKind, mimeType, fileSizeBytes }: PreviewViewerProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUrl = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/proof-artifacts/${artifactId}/download-url`);
      const data = await res.json();
      if (res.ok && data.url) {
        setSignedUrl(data.url);
      } else {
        setError(data.error || 'Failed to get secure link');
      }
    } catch {
      setError('Network error getting secure link');
    } finally {
      setLoading(false);
    }
  }, [artifactId]);

  useEffect(() => {
    // Only auto-fetch if we know how to inline it or if it's explicitly requested.
    // For safety, let's let the user explicitly click to load the preview for large media.
    // However, photo/pdf are usually safe to auto-load.
    if (mediaKind === 'photo' || mimeType === 'application/pdf') {
       fetchUrl();
    } else {
       // Reset state if artifact changes
       setSignedUrl(null);
       setError('');
    }
  }, [artifactId, mediaKind, mimeType, fetchUrl]);

  const handleManualDownload = () => {
    if (signedUrl) {
      window.open(signedUrl, '_blank', 'noopener,noreferrer');
    } else {
      fetchUrl().then(() => {
        // Since setSignedUrl is async, we can't immediately open it reliably without tricky effects.
        // We'll rely on the user clicking again once loaded.
      });
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-32 bg-black/40 border border-slate-800">
          <p className="text-slate-500 font-mono text-xs uppercase animate-pulse flex items-center gap-2">
            <RefreshCw className="w-3 h-3 animate-spin" /> Securing channel...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-32 bg-red-900/10 border border-red-500/30 p-4">
          <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
          <p className="text-red-400 font-mono text-xs text-center mb-3">{error}</p>
          <button 
            onClick={fetchUrl}
            className="text-xs bg-red-500/20 text-red-400 px-3 py-1 hover:bg-red-500/30 transition-colors uppercase font-bold"
          >
            Retry Connection
          </button>
        </div>
      );
    }

    if (!signedUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-32 bg-black/40 border border-slate-800 p-4">
          <EyeOff className="w-6 h-6 text-slate-600 mb-2" />
          <p className="text-slate-500 font-mono text-xs text-center mb-3 uppercase">Inline preview not available for this type</p>
          <button 
            onClick={handleManualDownload}
            className="flex items-center gap-2 text-xs bg-[#00c8ff]/10 text-[#00c8ff] px-3 py-2 border border-[#00c8ff]/30 hover:bg-[#00c8ff]/20 transition-colors uppercase font-bold tracking-widest"
          >
            <Download className="w-4 h-4" /> Secure Download
          </button>
        </div>
      );
    }

    // Render based on mediaKind / mimeType
    if (mediaKind === 'photo') {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={signedUrl} alt="Proof artifact preview" className="max-w-full max-h-[400px] object-contain border border-slate-800" />;
    }

    if (mimeType === 'application/pdf') {
      return (
        <object 
          data={signedUrl} 
          type="application/pdf" 
          className="w-full h-[500px] border border-slate-800 bg-white"
        >
          <div className="p-4 bg-black/40 text-center text-sm font-mono text-slate-400">
            PDF preview not supported by your browser. <br/>
            <button onClick={() => window.open(signedUrl, '_blank', 'noopener,noreferrer')} className="text-[#00c8ff] underline mt-2">Download PDF</button>
          </div>
        </object>
      );
    }

    if (mediaKind === 'audio') {
      return (
        <div className="bg-black/40 p-4 border border-slate-800 flex flex-col items-center">
          <audio controls className="w-full max-w-sm" controlsList="nodownload">
            <source src={signedUrl} type={mimeType || 'audio/mpeg'} />
            Your browser does not support the audio element.
          </audio>
          <button onClick={() => window.open(signedUrl, '_blank', 'noopener,noreferrer')} className="mt-4 flex items-center gap-2 text-xs text-[#00c8ff] hover:text-white transition-colors uppercase">
            <Download className="w-3 h-3" /> Download Audio File
          </button>
        </div>
      );
    }

    if (mediaKind === 'video') {
      return (
        <div className="bg-black/40 border border-slate-800 flex flex-col items-center relative group">
          <video controls className="w-full max-h-[400px] object-contain" controlsList="nodownload">
            <source src={signedUrl} type={mimeType || 'video/mp4'} />
            Your browser does not support the video element.
          </video>
          <button onClick={() => window.open(signedUrl, '_blank', 'noopener,noreferrer')} className="mt-3 mb-3 flex items-center gap-2 text-xs text-[#00c8ff] hover:text-white transition-colors uppercase">
            <Download className="w-3 h-3" /> Download Video File
          </button>
        </div>
      );
    }

    // DOC, DOCX, and anything else unknown
    return (
      <div className="flex flex-col items-center justify-center h-32 bg-black/40 border border-slate-800 p-4">
        <p className="text-slate-500 font-mono text-xs text-center mb-3 uppercase">Safe download ready</p>
        <button 
          onClick={() => window.open(signedUrl, '_blank', 'noopener,noreferrer')}
          className="flex items-center gap-2 text-xs bg-[#00c8ff]/10 text-[#00c8ff] px-4 py-2 border border-[#00c8ff]/30 hover:bg-[#00c8ff]/20 transition-colors uppercase font-bold tracking-widest"
        >
          <Download className="w-4 h-4" /> Download ({formatBytes(fileSizeBytes)})
        </button>
      </div>
    );
  };

  return (
    <div className="w-full mb-4">
      {renderContent()}
    </div>
  );
}

function formatBytes(bytes?: number, decimals = 2) {
  if (!bytes) return 'Unknown size';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
