import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ModerationQueueTable } from './ModerationQueueTable';

export default async function AdminModerationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Enforce Admin Role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (profile?.role !== 'admin') {
    redirect(`/${profile?.role || 'parent'}/home`);
  }

  // Fetch all unresolved reports joining details
  const { data: reports } = await supabaseAdmin
    .from('discussion_reports')
    .select(`
      id,
      reason,
      created_at,
      topic_id,
      reply_id,
      reporter:reporter_id (
        id,
        full_name,
        email
      ),
      topic:topic_id (
        id,
        title,
        body,
        status,
        author:author_id (
          full_name,
          email
        )
      ),
      reply:reply_id (
        id,
        body,
        status,
        author:author_id (
          full_name,
          email
        )
      )
    `)
    .order('created_at', { ascending: false });

  // Format reports for table
  const formattedReports = (reports || []).map((rep: any) => {
    const isTopic = !!rep.topic_id;
    const item = isTopic ? rep.topic : rep.reply;
    
    return {
      id: rep.id,
      reason: rep.reason,
      created_at: rep.created_at,
      item_id: isTopic ? rep.topic_id : rep.reply_id,
      item_type: isTopic ? 'topic' as const : 'reply' as const,
      reporter_name: rep.reporter?.full_name || 'Anonymous Reporter',
      reporter_email: rep.reporter?.email || 'N/A',
      author_name: item?.author?.full_name || 'Anonymous Author',
      author_email: item?.author?.email || 'N/A',
      content_body: item?.body || '',
      content_title: isTopic ? item?.title : undefined,
      status: item?.status || 'active',
    };
  });

  return (
    <div className="min-h-screen bg-[#020617] star-field text-[var(--text-primary)] p-6 md:p-12">
      <div className="max-w-6xl mx-auto relative z-10 font-mono">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div>
            <Link href="/admin/home" className="text-xs font-bold text-[#00c8ff] hover:underline mb-2 block uppercase tracking-widest">
              &larr; Back to Command Center
            </Link>
            <h1 className="text-3xl font-display font-black flex items-center gap-4 tracking-widest uppercase mt-2">
              Community Moderation <span className="bg-red-500 text-black text-xs px-3 py-1 font-bold shadow-[0_0_10px_#ef4444]">QUEUE</span>
            </h1>
            <p className="text-slate-400 text-xs mt-2 tracking-widest uppercase opacity-80">&gt; CURRENT_SESSION_BETA_2.0.4: {user.email}</p>
          </div>
        </header>

        <ModerationQueueTable initialReports={formattedReports} />
      </div>
    </div>
  );
}
