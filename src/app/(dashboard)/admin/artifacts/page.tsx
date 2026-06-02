import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FileCheck } from 'lucide-react';
import { getSignedDownloadUrl } from '@/lib/artifacts/storage';
import ArtifactReviewConsole from '@/components/admin/ArtifactReviewConsole';

export default async function AdminArtifactsPage() {
  const supabase = await createClient();
  
  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Authorize as Admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/student/home');
  }

  // 3. Fetch all artifact submissions in DB
  const { data: submissions } = await supabase
    .from('proof_artifact_submissions')
    .select(`
      *,
      profiles (
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false });

  // 4. Pre-generate secure signed URLs on the server to prevent front-end waterfall loading
  const submissionsWithUrls = [];
  for (const sub of (submissions || [])) {
    let previewUrl: string | null = null;
    if (sub.file_path) {
      try {
        previewUrl = await getSignedDownloadUrl(sub.file_path);
      } catch (err) {
        console.error(`Failed to pre-generate signed URL for ${sub.file_path}:`, err);
      }
    }
    submissionsWithUrls.push({
      ...sub,
      previewUrl
    });
  }

  const pendingCount = submissionsWithUrls.filter(s => s.status === 'submitted' || s.status === 'under_review').length;
  const approvedCount = submissionsWithUrls.filter(s => s.status === 'approved').length;

  return (
    <div className="min-h-screen bg-[#020617] star-field text-[var(--text-primary)]">
      <div className="max-w-screen-2xl mx-auto px-6 py-10 relative z-10">

        {/* Operational Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-slate-800 pb-6 font-sans">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/admin/home" className="text-slate-500 hover:text-[#00c8ff] font-mono text-xs uppercase tracking-widest transition-colors">
                ← Dashboard
              </Link>
              <span className="text-slate-700">/</span>
              <span className="text-[#00c8ff] font-mono text-xs uppercase tracking-widest">Artifacts</span>
            </div>
            <h1 className="text-3xl font-display font-black tracking-widest uppercase flex items-center gap-4">
              <FileCheck className="w-7 h-7 text-[#7b4fce]" />
              Artifact Review Operations
              <span className="bg-[#7b4fce] text-[#020617] text-xs px-3 py-1 font-bold shadow-[0_0_10px_#7b4fce]">ADMIN</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="glass-card px-6 py-3 border-l-2 border-[#00c8ff] text-center !rounded-none">
              <p className="text-2xl font-display font-black text-[#00c8ff]">{pendingCount}</p>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Pending Review</p>
            </div>
            <div className="glass-card px-6 py-3 border-l-2 border-green-500 text-center !rounded-none">
              <p className="text-2xl font-display font-black text-green-400">{approvedCount}</p>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Approved</p>
            </div>
          </div>
        </header>

        {/* Master Console Panel */}
        <ArtifactReviewConsole initialSubmissions={submissionsWithUrls} />

      </div>
    </div>
  );
}
