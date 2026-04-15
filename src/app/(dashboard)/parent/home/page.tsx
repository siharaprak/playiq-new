import { CheckCircle2, AlertCircle, BarChart3, Image as ImageIcon, UserPlus } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ParentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch linked apprentices securely
  const { data: links } = await supabase
    .from('parent_child_links')
    .select('student_id')
    .eq('parent_id', user.id);

  const studentIds = links?.map(l => l.student_id) || [];
  
  let apprentices: any[] = [];
  if (studentIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', studentIds);
    apprentices = profiles || [];
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div>
             <h1 className="text-3xl font-bold text-white uppercase tracking-wider">Parent Gateway</h1>
             <p className="text-slate-400 text-sm mt-1">&gt; ACTIVE LOG: {user.email}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-900/50 border border-indigo-500 text-indigo-400 rounded flex items-center justify-center font-bold">PT</div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
             
             {/* Recent Artifact Card Placeholder */}
             <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 shadow-sm backdrop-blur-sm">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h2 className="text-xl font-bold text-white uppercase tracking-wider">Latest Proof Packet</h2>
                   <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Submitted 2 hours ago</p>
                 </div>
                 <span className="bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-xs font-bold px-3 py-1 rounded flex items-center gap-2 tracking-widest uppercase">
                   <CheckCircle2 className="w-4 h-4" /> Verified
                 </span>
               </div>
               
               <div className="bg-black/50 rounded-xl h-64 flex flex-col items-center justify-center border border-slate-800 mb-6 border-dashed">
                 <ImageIcon className="w-8 h-8 text-slate-600 mb-2" />
                 <span className="text-slate-500 font-mono text-sm tracking-widest uppercase">Tier 3 Asset Placeholder (Verified Build Photo)</span>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-4 rounded border border-slate-800">
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">&gt; Concept</p>
                    <p className="font-bold text-slate-300">Tensile Strength Mapping</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded border border-slate-800">
                     <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">&gt; Effort Required</p>
                     <p className="font-bold text-slate-300">2 Attempts / 1 Guiding Question</p>
                  </div>
               </div>
             </div>

           </div>

           <div className="space-y-6">
              
              {/* APPRENTICE ROSTER SECTION */}
              <div className="bg-slate-900/50 p-6 rounded-xl border border-indigo-500/30 shadow-sm">
                 <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                   <h3 className="font-bold text-lg text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                     <UserPlus className="w-5 h-5 text-indigo-500" /> Apprentices
                   </h3>
                   <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">{apprentices.length} Linked</span>
                 </div>
                 
                 <div className="space-y-4 mb-6">
                    {apprentices.length === 0 ? (
                       <p className="text-sm text-slate-500 p-4 bg-black/40 rounded border border-slate-800 text-center">No apprentices assigned to this sector.</p>
                    ) : (
                       apprentices.map(app => (
                         <div key={app.id} className="p-3 bg-black/50 border border-slate-700 hover:border-indigo-500/50 rounded transition-colors group">
                           <p className="text-white font-bold text-sm uppercase">{app.full_name}</p>
                           <p className="text-slate-500 text-xs mt-1 truncate">{app.email}</p>
                         </div>
                       ))
                    )}
                 </div>

                 <Link 
                   href="/parent/apprentice-setup"
                   className="flex items-center justify-center w-full bg-transparent border border-[#00f2ff] hover:bg-[#00f2ff]/10 text-[#00f2ff] font-bold py-3 text-sm rounded transition-all uppercase tracking-widest shadow-[0_0_10px_rgba(0,242,255,0.1)]"
                 >
                   + Provision New Apprentice
                 </Link>
              </div>

              {/* COURSE PROGRESS SECTION */}
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="text-slate-400 w-5 h-5" />
                  <h3 className="font-bold text-lg text-slate-300 uppercase tracking-wider">Fleet Progress</h3>
                </div>
                <div className="space-y-6 mt-4">
                   <div>
                     <div className="flex justify-between text-sm mb-2">
                       <span className="text-slate-400 tracking-wider text-xs uppercase">Module 1 (Foundations)</span>
                       <span className="font-bold text-[#39ff14]">100%</span>
                     </div>
                     <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                       <div className="bg-[#39ff14] h-full shadow-[0_0_10px_rgba(57,255,20,0.5)]" style={{ width: '100%' }}></div>
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-sm mb-2">
                       <span className="text-slate-400 tracking-wider text-xs uppercase flex items-center gap-2">
                         <AlertCircle className="w-3 h-3 text-[#ff00ff]" /> Module 2 (Load Bearing)
                       </span>
                       <span className="font-bold text-white">40%</span>
                     </div>
                     <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                       <div className="bg-[#ff00ff] h-full shadow-[0_0_10px_rgba(255,0,255,0.5)]" style={{ width: '40%' }}></div>
                     </div>
                   </div>
                </div>
               </div>
         </div>
      </div>
    </div>
  );
}
