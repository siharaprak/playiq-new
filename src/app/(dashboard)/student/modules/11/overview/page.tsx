import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import { Lock, ChevronRight, Award, Trophy } from 'lucide-react';
import CapstoneForm from './CapstoneForm';
import ModuleOpeningHook from '@/components/modules/ModuleOpeningHook';
import ModuleFeedbackForm from '@/components/forms/ModuleFeedbackForm';

interface ModuleConfig {
  id: string;
  num: number;
  title: string;
  totalNodes: number;
}

const PRIOR_MODULES: ModuleConfig[] = [
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

export default async function Module11OverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 1. Fetch mastered nodes across all modules for student
  const { data: progress } = await supabase
    .from('student_node_progress')
    .select('module_id, node_id, node_mastered')
    .eq('student_id', user.id)
    .eq('node_mastered', true);

  const progressMap = (progress || []).reduce((acc, row) => {
    acc[row.module_id] = (acc[row.module_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Check if each module is fully completed
  const modulesStatus = PRIOR_MODULES.map((mod) => {
    const mastered = progressMap[mod.id] || 0;
    const completed = mastered >= mod.totalNodes;
    return { ...mod, mastered, completed };
  });

  const allPriorCompleted = modulesStatus.every((m) => m.completed);

  // 2. If locked, render premium gate screen
  if (!allPriorCompleted) {
    return (
      <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto space-y-8 font-mono">
        <Link href="/student/home" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4 transition-colors group text-slate-500 hover:text-[#00c8ff]">
          <span>←</span> Back to Dashboard
        </Link>

        <header className="mb-4">
          <div className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 animate-pulse">
            <Lock className="w-4 h-4" /> Gateway Locked: Pre-requisites Missing
          </div>
          <h1 className="text-3xl font-display font-black text-slate-200 uppercase tracking-wider">
            Capstone: Master Trial
          </h1>
          <p className="text-xs text-slate-450 mt-1 uppercase leading-relaxed max-w-xl">
            You must master all prior skill nodes across Modules 1 to 10 to unlock the Showcase protocol. Review outstanding segments below.
          </p>
        </header>

        <div className="glass-card border border-slate-800 p-6 space-y-4 bg-slate-950/20">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
            <span>🛡</span> Modules Status Ledger
          </h3>
          <div className="grid md:grid-cols-2 gap-3 text-xs">
            {modulesStatus.map((mod) => (
              <div 
                key={mod.id} 
                className={`p-3 border flex justify-between items-center ${mod.completed ? 'border-green-500/20 bg-green-950/5 text-green-400' : 'border-slate-850 bg-black/10 text-slate-400'}`}
              >
                <span className="truncate max-w-[220px]">M{mod.num}: {mod.title}</span>
                <span className="font-bold whitespace-nowrap">
                  {mod.completed ? 'COMPLETE' : `${mod.mastered}/${mod.totalNodes} NODES`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Complete: Fetch AI Builders status
  const [{ data: tutorProfile }, { data: assistantProfile }] = await Promise.all([
    supabase.from('tutor_profiles').select('id, status').eq('student_id', user.id).maybeSingle(),
    supabase.from('assistant_profiles').select('id, status').eq('student_id', user.id).maybeSingle(),
  ]);

  const tutorStatus = tutorProfile?.status || 'none';
  const assistantStatus = assistantProfile?.status || 'none';

  const tutorComplete = tutorStatus === 'active' || tutorStatus === 'published';
  const assistantComplete = assistantStatus === 'active' || assistantStatus === 'published';

  // 4. Fetch current Capstone submissions
  const { data: capstoneSubmissions } = await supabase
    .from('proof_artifact_submissions')
    .select('*')
    .eq('student_id', user.id)
    .eq('module_id', MODULES.CAPSTONE_ID);

  const initialStatus = capstoneSubmissions && capstoneSubmissions.length > 0 ? capstoneSubmissions[0].status : 'draft';

  const { data: existingFeedback } = await supabase
    .from('module_feedback')
    .select('rating, feedback_text')
    .eq('student_id', user.id)
    .eq('module_id', MODULES.CAPSTONE_ID)
    .maybeSingle();

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto space-y-8">
      
      {/* Header Back Button */}
      <Link 
        href="/student/home" 
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4 transition-colors group text-slate-500 hover:text-[#00c8ff]"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span>Back to Dashboard</span>
      </Link>

      {/* breadcrumb */}
      <div className="mb-2 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider font-mono">
        Module 11 · Genius Showcase
      </div>

      <header className="mb-4">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] font-display uppercase flex items-center gap-3">
          <Trophy className="w-8 h-8 text-[#f5c518] animate-bounce" /> Capstone: Master Trial
        </h1>
        <p className="text-slate-400 font-mono text-xs mt-2 leading-relaxed max-w-2xl">
          Demonstrate independent learning, tutor-building, and assistant-building across the full system. Combine your Pre-Learn details, Study Guide, Teach-Back, and Assessment scores to complete your Course 1 credentials.
        </p>
      </header>

      <ModuleOpeningHook moduleNumber={11} title="the Capstone Master Trial" />

      {/* Multi-step Form */}
      <CapstoneForm
        studentId={user.id}
        moduleId={MODULES.CAPSTONE_ID}
        tutorComplete={tutorComplete}
        assistantComplete={assistantComplete}
        tutorStatus={tutorStatus}
        assistantStatus={assistantStatus}
        initialStatus={initialStatus}
        initialSubmissions={capstoneSubmissions || []}
      />

      {/* Beta tester feedback belongs at the end of the module, after the final submission. */}
      <section className="mt-4">
        <ModuleFeedbackForm moduleId={MODULES.CAPSTONE_ID} initialFeedback={existingFeedback} />
      </section>
    </div>
  );
}
