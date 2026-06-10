import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { HelpCircle, Check, Loader2, ClipboardCheck, AlertCircle, MessageSquare } from 'lucide-react';
import { resolveSupportIssueAction, resolveSupportIssueFormAction } from './actions';

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/student/home');

  const params = await searchParams;
  const filterStatus = params?.status || 'open'; // 'open' | 'resolved' | 'all'

  // 1. Fetch support issues
  let query = supabaseAdmin
    .from('support_issues')
    .select('id, reporter_id, issue_text, status, created_at')
    .order('created_at', { ascending: false });

  if (filterStatus !== 'all') {
    query = query.eq('status', filterStatus);
  }

  const { data: issuesData, error } = await query;

  // 2. Resolve reporter profiles
  const reporterIds = Array.from(new Set((issuesData || []).map((i: any) => i.reporter_id).filter(Boolean)));
  
  const { data: reporterProfiles } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email')
    .in('id', reporterIds);

  const reporterMap = (reporterProfiles || []).reduce((acc: any, r: any) => {
    acc[r.id] = r;
    return acc;
  }, {} as Record<string, any>);

  const issues = (issuesData || []).map((issue: any) => ({
    ...issue,
    profiles: reporterMap[issue.reporter_id] || null,
  }));

  const openCount = (issuesData || []).filter((i: any) => i.status === 'open').length;

  return (
    <div className="min-h-screen bg-[#020617] star-field text-[var(--text-primary)] font-mono">
      <div className="max-w-screen-xl mx-auto px-6 py-10 relative z-10">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/admin/home" className="text-slate-500 hover:text-[#00c8ff] font-mono text-xs uppercase tracking-widest transition-colors">
                ← Dashboard
              </Link>
              <span className="text-slate-700">/</span>
              <span className="text-[#00c8ff] font-mono text-xs uppercase tracking-widest">Support</span>
            </div>
            <h1 className="text-3xl font-display font-black tracking-widest uppercase flex items-center gap-4 text-slate-100">
              <MessageSquare className="w-7 h-7 text-[#f5c518]" />
              Support Queue
              <span className="bg-[#f5c518] text-[#020617] text-xs px-3 py-1 font-bold shadow-[0_0_10px_#f5c518]">TICKETS</span>
            </h1>
          </div>
        </header>

        {/* Filters & Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-slate-900/40 p-4 border border-slate-800 backdrop-blur-md">
          <div className="flex gap-2">
            <Link
              href="/admin/support?status=open"
              className={`px-4 py-2 rounded text-xs font-bold uppercase transition-all border ${
                filterStatus === 'open'
                  ? 'border-[#f5c518] bg-[#f5c518]/10 text-[#f5c518]'
                  : 'border-slate-800 bg-black/30 text-slate-400 hover:border-slate-750'
              }`}
            >
              Open Issues
            </Link>
            <Link
              href="/admin/support?status=resolved"
              className={`px-4 py-2 rounded text-xs font-bold uppercase transition-all border ${
                filterStatus === 'resolved'
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                  : 'border-slate-800 bg-black/30 text-slate-400 hover:border-slate-750'
              }`}
            >
              Resolved Issues
            </Link>
            <Link
              href="/admin/support?status=all"
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all border ${
                filterStatus === 'all'
                  ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-[#00c8ff]'
                  : 'border-slate-800 bg-black/30 text-slate-400 hover:border-slate-750'
              }`}
            >
              All Records
            </Link>
          </div>

          <div className="text-[10px] text-slate-400 uppercase">
            Active Pending issues: <span className="text-[#f5c518] font-bold">{openCount}</span>
          </div>
        </div>

        {/* Ticket List */}
        {issues.length > 0 ? (
          <div className="space-y-4">
            {issues.map((issue: any) => {
              const studentName = issue.profiles?.full_name || 'Apprentice';
              const studentEmail = issue.profiles?.email || '—';
              const isOpen = issue.status === 'open';

              return (
                <div
                  key={issue.id}
                  className={`glass-card !rounded-none border p-6 flex flex-col md:flex-row justify-between gap-6 transition-all ${
                    isOpen ? 'border-[#f5c518]/30 bg-[#f5c518]/5' : 'border-slate-800 bg-black/30'
                  }`}
                >
                  <div className="space-y-3 flex-1">
                    {/* Reporter Metadata */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                        isOpen ? 'bg-[#f5c518]/15 text-[#f5c518] border-[#f5c518]/25' : 'bg-green-500/15 text-green-400 border-green-500/25'
                      }`}>
                        {issue.status}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Logged on {new Date(issue.created_at).toLocaleString()}
                      </span>
                    </div>

                    {/* Issue text */}
                    <p className="text-xs text-slate-200 leading-relaxed max-w-3xl whitespace-pre-wrap select-text">
                      {issue.issue_text}
                    </p>

                    {/* Apprentice details */}
                    <div className="text-[10px] text-slate-450 border-t border-slate-900/60 pt-2 flex items-center gap-2">
                      <span className="font-bold text-slate-350">Reporter:</span> {studentName} ({studentEmail})
                    </div>
                  </div>

                  {/* Resolve Actions */}
                  {isOpen && (
                    <div className="flex-shrink-0 flex items-center self-end md:self-center">
                      <form action={resolveSupportIssueFormAction}>
                        <input type="hidden" name="issueId" value={issue.id} />
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-slate-950 font-bold uppercase rounded text-xs transition-colors flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,197,94,0.15)] cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> Mark Resolved
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card !rounded-none p-16 text-center text-slate-500 text-xs">
            <ClipboardCheck className="w-10 h-10 mx-auto mb-4 opacity-30 text-[#00c8ff]" />
            <p className="uppercase tracking-widest">No issues logged under status &apos;{filterStatus}&apos;.</p>
          </div>
        )}

      </div>
    </div>
  );
}
