import { Layers, HelpCircle, UploadCloud } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import Link from 'next/link';

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('full_name, email').eq('id', user.id).single();
  const name = profile?.full_name || profile?.email || 'Student';
  const initials = name.substring(0, 2).toUpperCase();

  // Calculate live progress for Module 1
  const { data: progressData } = await supabase
    .from('student_node_progress')
    .select('node_id')
    .eq('student_id', user.id)
    .eq('module_id', MODULES.MODULE_1_ID)
    .eq('node_mastered', true);

  const nodesMastered = progressData?.length || 0;
  // Module 1 has 4 nodes
  const completionPercentage = Math.round((nodesMastered / 4) * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <h1 className="text-2xl font-bold">PlayIQ <span className="text-indigo-400">Guide</span></h1>
          <div className="flex items-center gap-4">
            <span className="text-sm bg-slate-800 px-3 py-1 rounded-full text-slate-300">Phase 1: Foundations</span>
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold" title={name}>{initials}</div>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
           <div className="md:col-span-2 space-y-6">
             <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
               <span className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-2 block">Current Challenge</span>
               <h2 className="text-3xl font-extrabold mb-4">Module 1: AI Learning Code</h2>
               <p className="text-slate-300 mb-8 max-w-lg leading-relaxed">
                 Master the foundations of interacting with the AI agent. Learn its strengths, modes, how to ask better questions, and the verification habit.
               </p>
               <div className="flex gap-4">
                 <Link href="/student/modules/1/overview" className="bg-[#00f2ff] text-black hover:bg-[#00f2ff]/80 px-6 py-3 rounded-lg font-bold transition-colors shadow-[0_0_15px_rgba(0,242,255,0.4)]">
                   {nodesMastered > 0 ? "CONTINUE MODULE 1 →" : "START MODULE 1 →"}
                 </Link>
                 <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed">
                   <UploadCloud className="w-5 h-5" />
                   Submit Hardware Artifact
                 </button>
               </div>
             </div>
           </div>

           <div className="space-y-6">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle className="text-amber-400 w-6 h-6" />
                  <h3 className="font-bold text-lg">Need Help?</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">The guide requires you to explain your attempted approach before providing secondary hints.</p>
                <button className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-lg text-sm font-bold transition-colors">
                  Request Feedback
                </button>
              </div>

              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <Layers className="text-emerald-400 w-6 h-6" />
                  <h3 className="font-bold text-lg">Progress</h3>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3 mb-2">
                  <div className="bg-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
                </div>
                <p className="text-xs text-slate-400 text-right">{completionPercentage}% Node Completion</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
