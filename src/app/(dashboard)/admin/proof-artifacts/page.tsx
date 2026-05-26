import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ProofArtifactReviewQueue } from '@/components/proof-artifacts/ProofArtifactReviewQueue';

export default async function AdminProofArtifactsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Enforce Admin Role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  
  if (profile?.role !== 'admin' && profile?.role !== 'teacher') {
    redirect(`/${profile?.role || 'parent'}/home`);
  }

  return (
    <div className="min-h-screen bg-[#020617] star-field text-[var(--text-primary)] p-6 md:p-12">
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-col mb-12">
          <p className="font-mono text-[#00c8ff] text-[0.6rem] uppercase tracking-[0.3em] mb-1">&gt; SYS.ADMIN // PROOF_ARTIFACTS</p>
          <h1 className="text-3xl font-display font-black text-[var(--text-primary)] uppercase tracking-widest">
            Artifact Review Queue
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-mono">Approve or reject student submissions</p>
        </header>

        <ProofArtifactReviewQueue />
      </div>
    </div>
  );
}
