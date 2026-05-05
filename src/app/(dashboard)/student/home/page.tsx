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
    <div className="min-h-screen text-white p-6 md:p-12" style={{ backgroundColor: '#0a0f1e' }}>
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12 pb-6" style={{ borderBottom: '1px solid rgba(123,79,206,0.2)' }}>
          <h1 className="text-2xl font-bold font-display">PlayIQ <span style={{ color: '#00c8ff' }}>Guide</span></h1>
          <div className="flex items-center gap-4">
            <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(17,24,39,0.8)', color: '#94a3b8', border: '1px solid rgba(123,79,206,0.2)' }}>Phase 1: Foundations</span>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: '#7b4fce' }} title={name}>{initials}</div>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
           <div className="md:col-span-2 space-y-6">
             <div className="p-8 rounded-2xl" style={{ background: 'rgba(17,24,39,0.85)', border: '1px solid rgba(123,79,206,0.25)' }}>
               <span className="text-sm font-bold uppercase tracking-wider mb-2 block" style={{ color: '#7b4fce' }}>Current Challenge</span>
               <h2 className="text-3xl font-extrabold mb-4 font-display">Module 1: AI Learning Code</h2>
               <p className="mb-8 max-w-lg leading-relaxed" style={{ color: '#94a3b8' }}>
                 Master the foundations of interacting with the AI agent. Learn its strengths, modes, how to ask better questions, and the verification habit.
               </p>
               <div className="flex gap-4 flex-wrap">
                 <Link href="/student/modules/1/overview" className="px-6 py-3 rounded-lg font-bold transition-colors" style={{ background: '#00c8ff', color: '#0a0f1e' }}>
                   {nodesMastered > 0 ? "CONTINUE MODULE 1 →" : "START MODULE 1 →"}
                 </Link>
                 <button className="px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed" style={{ background: 'rgba(123,79,206,0.3)', color: '#9b6fe8' }}>
                   <UploadCloud className="w-5 h-5" />
                   Submit Hardware Artifact
                 </button>
               </div>
             </div>
           </div>

           <div className="space-y-6">
             {/* Engagement Board */}
             <Link href="/discussions" className="block p-6 rounded-2xl transition-all group" style={{ background: 'rgba(17,24,39,0.85)', border: '1px solid rgba(0,200,255,0.2)' }}>
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: 'rgba(0,200,255,0.1)' }}>💬</div>
                 <h3 className="font-bold text-sm font-display group-hover:text-[#00c8ff] transition-colors">Engagement Board</h3>
               </div>
               <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>Ask questions, share your builds, and connect with other learners.</p>
               <span className="inline-block mt-3 text-xs font-bold" style={{ color: '#00c8ff' }}>Open Discussions →</span>
             </Link>

             {/* Need Help */}
             <div className="p-6 rounded-2xl" style={{ background: 'rgba(17,24,39,0.85)', border: '1px solid rgba(123,79,206,0.2)' }}>
               <div className="flex items-center gap-3 mb-4">
                 <HelpCircle style={{ color: '#f5c518' }} className="w-6 h-6" />
                 <h3 className="font-bold text-lg">Need Help?</h3>
               </div>
               <p className="text-sm mb-4" style={{ color: '#64748b' }}>The guide requires you to explain your attempted approach before providing secondary hints.</p>
               <button className="w-full py-3 rounded-lg text-sm font-bold transition-colors" style={{ background: 'rgba(123,79,206,0.15)', border: '1px solid rgba(123,79,206,0.3)', color: '#9b6fe8' }}>
                 Request Feedback
               </button>
             </div>

             {/* Progress */}
             <div className="p-6 rounded-2xl" style={{ background: 'rgba(17,24,39,0.85)', border: '1px solid rgba(123,79,206,0.2)' }}>
               <div className="flex items-center gap-3 mb-4">
                 <Layers style={{ color: '#00c8ff' }} className="w-6 h-6" />
                 <h3 className="font-bold text-lg">Progress</h3>
               </div>
               <div className="w-full rounded-full h-3 mb-2" style={{ background: 'rgba(10,15,30,0.8)' }}>
                 <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%`, background: 'linear-gradient(90deg, #7b4fce, #00c8ff)' }} />
               </div>
               <p className="text-xs text-right" style={{ color: '#64748b' }}>{completionPercentage}% Node Completion</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
