'use client';

import React, { useState } from 'react';
import { ProofArtifactList } from './ProofArtifactList';
import { ProofArtifactUploader } from './ProofArtifactUploader';

export function ProofArtifactSection({ moduleId }: { moduleId: string }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [resubmitId, setResubmitId] = useState<string | null>(null);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setResubmitId(null);
  };

  const handleResubmit = (id: string) => {
    setResubmitId(id);
    // Scroll to uploader
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="mt-16 pt-16 border-t border-slate-800">
      <h2 className="text-2xl font-bold tracking-tight mb-4 text-[var(--text-primary)] uppercase font-display">
        Additional Proof Uploads (Beta)
      </h2>
      <p className="text-slate-400 font-mono text-sm leading-relaxed mb-8">
        Use this section to upload photos, documents, or media files that support your learning in this module.
      </p>
      
      <ProofArtifactUploader 
        moduleId={moduleId} 
        onUploadSuccess={handleUploadSuccess} 
        resubmitArtifactId={resubmitId}
        onCancelResubmit={() => setResubmitId(null)}
      />
      <ProofArtifactList 
        moduleId={moduleId} 
        refreshTrigger={refreshTrigger} 
        onResubmit={handleResubmit}
      />
    </div>
  );
}
