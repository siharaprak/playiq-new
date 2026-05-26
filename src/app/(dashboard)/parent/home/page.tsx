import { CheckCircle2, AlertCircle, BarChart3, UserPlus, Lock, BookOpen } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MODULES } from '@/lib/constants';
import { getSignedDownloadUrl } from '@/lib/artifacts/storage';
import ParentProofInspect from '@/components/parent/ParentProofInspect';
import { getParentProofSummary } from '@/lib/data/proof-artifacts';
import { ParentProofSummaryCard } from '@/components/proof-artifacts/ParentProofSummaryCard';

const MODULE_LIST = [
  { id: MODULES.MODULE_1_ID, num: 1, title: 'AI Learning Code', totalNodes: 4 },
  { id: MODULES.MODULE_2_ID, num: 2, title: 'Digital Smarts & Human Responsibility', totalNodes: 6 },
  { id: MODULES.MODULE_3_ID, num: 3, title: 'Pre-Learn System', totalNodes: 4 },
  { id: MODULES.MODULE_4_ID, num: 4, title: 'Lesson Rescue Mode', totalNodes: 5 },
  { id: MODULES.MODULE_5_ID, num: 5, title: 'Compression Learning', totalNodes: 4 },
  { id: MODULES.MODULE_6_ID, num: 6, title: 'Self-Testing & Mistake Bank', totalNodes: 4 },
  { id: MODULES.MODULE_7_ID, num: 7, title: 'Notes & Study Pack Creation', totalNodes: 4 },
  { id: MODULES.MODULE_8_ID, num: 8, title: 'Writing & Answer Clarity', totalNodes: 4 },
  { id: MODULES.MODULE_9_ID, num: 9, title: 'Build Your AI Tutor', totalNodes: 6 },
  { id: MODULES.MODULE_10_ID, num: 10, title: 'Build Your AI Assistant', totalNodes: 7 },
];

export default async function ParentDashboard({ searchParams }: { searchParams: { provisioned?: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch linked apprentices
  const { data: links } = await supabaseAdmin
    .from('parent_child_links')
    .select('student_id')
    .eq('parent_id', user.id);

  const studentIds = links?.map((l: any) => l.student_id) || [];

  let apprentices: { id: string; full_name: string; email: string }[] = [];
  if (studentIds.length > 0) {
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email')
      .in('id', studentIds);
    apprentices = profiles || [];
  }

  // Fetch real progress for ALL linked students
  let progressByStudent: Record<string, Record<string, number>> = {};

  if (studentIds.length > 0) {
    const { data: allProgress } = await supabaseAdmin
      .from('student_node_progress')
      .select('student_id, module_id, node_mastered')
      .in('student_id', studentIds);

    for (const row of (allProgress || [])) {
      if (!row.node_mastered) continue;
      if (!progressByStudent[row.student_id]) progressByStudent[row.student_id] = {};
      progressByStudent[row.student_id][row.module_id] =
        (progressByStudent[row.student_id][row.module_id] || 0) + 1;
    }
  }

  // Fetch real-time proof artifact submissions for linked children
  let submissions: any[] = [];
  if (studentIds.length > 0) {
    const { data } = await supabaseAdmin
      .from('proof_artifact_submissions')
      .select('*')
      .in('student_id', studentIds)
      .order('created_at', { ascending: false });
    submissions = data || [];
  }

  // Pre-generate temporary signed URL credentials safely on the server
  const submissionsWithUrls = [];
  for (const sub of submissions) {
    let previewUrl: string | null = null;
    if (sub.file_path) {
      try {
        previewUrl = await getSignedDownloadUrl(sub.file_path);
      } catch (err) {
        console.error('Parent dashboard URL generation failed for:', sub.file_path, err);
      }
    }
    submissionsWithUrls.push({
      ...sub,
      previewUrl
    });
  }

  // For the main progress display, use the first linked student (or empty if none)
  const primaryStudentId = studentIds[0];
  const primaryProgress = primaryStudentId ? (progressByStudent[primaryStudentId] || {}) : {};

  // Compute overall fleet stats
  const totalNodesPossible = MODULE_LIST.reduce((a, m) => a + m.totalNodes, 0);
  const totalMastered = Object.values(primaryProgress).reduce((a, b) => a + b, 0);
  const overallPct = totalNodesPossible > 0 ? Math.round((totalMastered / totalNodesPossible) * 100) : 0;

  let proofSummary = null;
  if (primaryStudentId) {
    try {
      proofSummary = await getParentProofSummary(user.id, primaryStudentId);
    } catch (err) {
      console.warn("Failed to fetch proof summary:", err);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-[var(--text-primary)] p-6 md:p-12 star-field">
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div>
            <p className="font-mono text-[#00c8ff] text-[0.6rem] uppercase tracking-[0.3em] mb-1">&gt; PARENT GATEWAY</p>
            <h1 className="text-3xl font-display font-black text-[var(--text-primary)] uppercase tracking-widest">
              Mission Control
            </h1>
            <p className="text-slate-400 text-xs mt-1 font-mono">&gt; ACTIVE LOG: {user.email}</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {apprentices.length > 0 && (
              <div className="glass-card px-4 py-2 border-l-2 border-[#00c8ff] text-center !rounded-none">
                <p className="text-xl font-display font-black text-[#00c8ff]">{overallPct}%</p>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Overall Progress</p>
              </div>
            )}
          </div>
        </header>

        {searchParams?.provisioned === '1' && (
          <div className="mb-8 p-4 bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#39ff14] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-display font-bold text-[#39ff14] uppercase tracking-widest text-sm">Apprentice Provisioned Successfully</p>
              <p className="font-mono text-xs text-slate-400 mt-1">Their profile is active. They can now log in at weplayiq.com/login.</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Latest Activity / Proof Packet */}
            <div className="glass-card p-8 !rounded-none border border-slate-800">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-display font-bold text-[var(--text-primary)] uppercase tracking-wider">Latest Proof Packets</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-mono">
                    Secure operational inspect panels for link credentials
                  </p>
                </div>
              </div>

              {apprentices.length === 0 ? (
                <div className="bg-black/40 border border-dashed border-slate-700 rounded-none p-12 text-center">
                  <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">No apprentice linked to this account.</p>
                  <p className="text-slate-600 font-mono text-xs mt-2">Use the panel on the right to provision an apprentice account.</p>
                </div>
              ) : submissionsWithUrls.length === 0 ? (
                <div className="bg-black/40 border border-dashed border-slate-700 rounded-none p-12 text-center">
                  <Lock className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">Student hasn't begun yet.</p>
                  <p className="text-slate-600 font-mono text-xs mt-2">Proof packets will appear here once module uploads are saved or submitted.</p>
                </div>
              ) : (
                <ParentProofInspect
                  apprentices={apprentices}
                  submissions={submissionsWithUrls}
                  modulesList={MODULE_LIST}
                />
              )}
            </div>

          </div>

          <div className="space-y-6">

            {proofSummary && <ParentProofSummaryCard summary={proofSummary} />}

            {/* Apprentice Roster */}
            <div className="glass-card p-6 !rounded-none border border-[#7b4fce]/30">
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <h3 className="font-display font-bold text-lg text-[#7b4fce] uppercase tracking-wider flex items-center gap-2">
                  <UserPlus className="w-5 h-5" /> Apprentices
                </h3>
                <span className="text-xs bg-slate-800 px-2 py-1 text-slate-400 font-mono">{apprentices.length} Linked</span>
              </div>

              <div className="space-y-3 mb-6">
                {apprentices.length === 0 ? (
                  <p className="text-sm text-slate-500 p-4 bg-black/40 border border-slate-800 text-center font-mono">
                    No apprentices assigned to this sector.
                  </p>
                ) : (
                  apprentices.map(app => (
                    <div key={app.id} className="p-3 bg-black/50 border border-slate-700 hover:border-[#7b4fce]/50 transition-colors">
                      <p className="text-[var(--text-primary)] font-bold text-sm uppercase font-display">{app.full_name}</p>
                      <p className="text-slate-500 text-xs mt-1 truncate font-mono">{app.email}</p>
                    </div>
                  ))
                )}
              </div>

              <Link
                href="/parent/apprentice-setup"
                className="flex items-center justify-center w-full bg-transparent border border-[#00c8ff] hover:bg-[#00c8ff]/10 text-[#00c8ff] font-display font-bold py-3 text-sm transition-all uppercase tracking-widest shadow-[0_0_10px_rgba(0,200,255,0.1)]"
              >
                + Provision New Apprentice
              </Link>
            </div>

            {/* Fleet Progress (real data) */}
            <div className="glass-card p-6 !rounded-none border border-slate-800">
              <div className="flex items-center gap-3 mb-5">
                <BarChart3 className="text-[#00c8ff] w-5 h-5" />
                <h3 className="font-display font-bold text-[var(--text-primary)] uppercase tracking-wider">Fleet Progress</h3>
              </div>

              {apprentices.length === 0 || totalMastered === 0 ? (
                <div className="text-center py-6">
                  <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">
                    {apprentices.length === 0 ? 'No apprentice linked.' : 'No progress recorded yet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {MODULE_LIST.map((mod) => {
                    const mastered = primaryProgress[mod.id] || 0;
                    const pct = Math.round((mastered / mod.totalNodes) * 100);
                    const complete = mastered >= mod.totalNodes;
                    const started = mastered > 0;

                    if (!started) return null;

                    return (
                      <div key={mod.id}>
                        <div className="flex justify-between text-xs mb-1.5 font-mono">
                          <span className={`uppercase tracking-wider flex items-center gap-1.5 ${complete ? 'text-[#39ff14]' : 'text-slate-400'}`}>
                            {complete
                              ? <CheckCircle2 className="w-3 h-3" />
                              : <AlertCircle className="w-3 h-3 text-[#7b4fce]" />}
                            Module {mod.num}
                          </span>
                          <span className={`font-bold ${complete ? 'text-[#39ff14]' : 'text-[var(--text-primary)]'}`}>
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 overflow-hidden mb-1">
                          <div
                            className={`h-full transition-all ${complete ? 'bg-[#39ff14] shadow-[0_0_8px_rgba(57,255,20,0.4)]' : 'bg-[#7b4fce] shadow-[0_0_8px_rgba(123,79,206,0.3)]'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        {complete && (
                          <Link href={`/parent/modules/1`} className="block text-center w-full bg-[#00c8ff]/10 hover:bg-[#00c8ff]/20 text-[#00c8ff] border border-[#00c8ff]/30 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors font-mono mt-2">
                            VIEW MODULE REPORT →
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
