'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface ProofArtifactPreviewLinkProps {
  artifactId: string;
  fileName: string;
}

export function ProofArtifactPreviewLink({ artifactId, fileName }: ProofArtifactPreviewLinkProps) {
  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/proof-artifacts/${artifactId}/download-url`);
      const data = await res.json();
      if (res.ok && data.ok && data.data.url) {
        const a = document.createElement('a');
        a.href = data.data.url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert(data.error || 'Failed to get download link');
      }
    } catch {
      alert('Error downloading file');
    }
  };

  return (
    <button 
      onClick={handleDownload}
      className="w-full bg-black/50 border border-slate-600 hover:border-[#00c8ff] text-slate-300 hover:text-[#00c8ff] py-2 px-3 text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mt-4"
    >
      <Download className="w-4 h-4" /> Download File for Review
    </button>
  );
}
