import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Star } from 'lucide-react';

export default async function AdminFeedbackPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Enforce Admin Role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  
  if (profile?.role !== 'admin') {
    redirect(`/${profile?.role || 'parent'}/home`);
  }

  // Fetch module feedback
  const { data: feedbackList } = await supabaseAdmin
    .from('module_feedback')
    .select('*, profiles(email, full_name)')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="min-h-screen bg-[#020617] star-field text-[var(--text-primary)] p-6 md:p-12">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 border-b border-slate-800 pb-6 flex items-center justify-between">
          <div>
            <Link href="/admin/home" className="text-[#00c8ff] font-mono text-xs uppercase tracking-widest hover:underline mb-4 inline-block">
              &larr; BACK TO ADMIN HUD
            </Link>
            <h1 className="text-3xl font-display font-black flex items-center gap-4 tracking-widest uppercase">
              <MessageCircle className="w-8 h-8 text-[#00c8ff]" />
              Module Feedback
            </h1>
            <p className="text-slate-400 font-mono text-xs mt-2 tracking-widest uppercase">&gt; REVIEW_STUDENT_FEEDBACK_LOGS</p>
          </div>
        </header>

        <div className="glass-card !p-0 !rounded-none overflow-hidden border border-slate-800">
          {feedbackList && feedbackList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left font-mono">
                <thead className="text-[10px] text-slate-500 uppercase tracking-widest bg-black/40 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Module ID</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4">Detailed Answers (JSON)</th>
                    <th className="px-6 py-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {(feedbackList || []).map((fb: any) => {
                    const studentInfo = fb.profiles || {};
                    return (
                      <tr key={fb.id} className="border-b border-slate-800 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-slate-200">
                          {studentInfo.full_name || 'Unknown Student'}
                          <div className="text-xs text-slate-500">{studentInfo.email}</div>
                        </td>
                        <td className="px-6 py-4 text-[#00c8ff]">Module {fb.module_id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-amber-400">
                            {fb.rating} <Star className="w-3 h-3 ml-1 fill-amber-400" />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          <div className="max-w-md max-h-32 overflow-y-auto whitespace-pre-wrap break-words bg-black/30 p-2 rounded">
                            {fb.feedback_text}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs tracking-wider">
                          {new Date(fb.updated_at || fb.created_at).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center font-mono">
              <MessageCircle className="w-8 h-8 text-slate-600 mb-4 opacity-50" />
              <p className="uppercase tracking-widest text-xs">No Feedback Records Found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
