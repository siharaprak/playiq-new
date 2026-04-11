import { CheckCircle2, AlertCircle, BarChart3, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ParentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-gray-200 pb-6">
          <div>
             <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
             <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">PT</div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
             
             {/* Recent Artifact Card Placeholder */}
             <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h2 className="text-xl font-bold text-gray-900">Latest Proof Packet</h2>
                   <p className="text-sm text-gray-500">Submitted 2 hours ago</p>
                 </div>
                 <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                   <CheckCircle2 className="w-4 h-4" /> Verified
                 </span>
               </div>
               
               <div className="bg-gray-100 rounded-xl h-64 flex flex-col items-center justify-center border border-gray-200 mb-6 border-dashed">
                 <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                 <span className="text-gray-500 font-medium text-sm">Tier 3 Asset Placeholder (Verified Build Photo)</span>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Concept</p>
                    <p className="font-medium text-gray-900">Tensile Strength Mapping</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                     <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Effort Required</p>
                     <p className="font-medium text-gray-900">2 Attempts / 1 Guiding Question</p>
                  </div>
               </div>
             </div>

           </div>

           <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="text-indigo-600 w-6 h-6" />
                  <h3 className="font-bold text-lg">Course Progress</h3>
                </div>
                <div className="space-y-4">
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-gray-600">Module 1 (Foundations)</span>
                       <span className="font-semibold text-gray-900">100%</span>
                     </div>
                     <div className="w-full bg-gray-100 rounded-full h-2">
                       <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-gray-600 flex items-center gap-1"><AlertCircle className="w-3 h-3 text-amber-500" /> Module 2 (Load Bearing)</span>
                       <span className="font-semibold text-gray-900">40%</span>
                     </div>
                     <div className="w-full bg-gray-100 rounded-full h-2">
                       <div className="bg-amber-400 h-2 rounded-full" style={{ width: '40%' }}></div>
                     </div>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
