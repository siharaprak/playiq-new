import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Cpu, Search, FileText, ChevronRight, User, ShieldCheck, HelpCircle } from 'lucide-react';

export default async function AdminAgentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/student/home');

  const params = await searchParams;
  const searchTerm = params?.search || '';

  // 1. Fetch Tutors and Assistants profiles (select safe columns only, no raw prompts/instructions)
  const [{ data: tutorsList }, { data: assistantsList }] = await Promise.all([
    supabaseAdmin.from('tutor_profiles').select('id, student_id, name, status, updated_at, current_version_id, metadata'),
    supabaseAdmin.from('assistant_profiles').select('id, student_id, name, status, updated_at, current_version_id, metadata'),
  ]);

  // Fetch all unique student IDs to get emails/names
  const tutorStudentIds = (tutorsList || []).map((t: any) => t.student_id);
  const assistantStudentIds = (assistantsList || []).map((a: any) => a.student_id);
  const uniqueStudentIds = Array.from(new Set([...tutorStudentIds, ...assistantStudentIds]));
 
  const { data: studentProfiles } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email')
    .in('id', uniqueStudentIds);
 
  const studentMap = (studentProfiles || []).reduce((acc: any, p: any) => {
    acc[p.id] = p;
    return acc;
  }, {} as Record<string, any>);
 
  // 2. Fetch versions count only (no instructions/system_prompts fetched)
  const [{ data: tutorVersions }, { data: assistantVersions }] = await Promise.all([
    supabaseAdmin.from('tutor_versions').select('id, tutor_profile_id'),
    supabaseAdmin.from('assistant_versions').select('id, assistant_profile_id'),
  ]);
 
  const tutorVersionCountMap = (tutorVersions || []).reduce((acc: any, v: any) => {
    acc[v.tutor_profile_id] = (acc[v.tutor_profile_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
 
  const assistantVersionCountMap = (assistantVersions || []).reduce((acc: any, v: any) => {
    acc[v.assistant_profile_id] = (acc[v.assistant_profile_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
 
  // 3. Fetch knowledge files count only (no urls, names, or file_url/storage_path fetched)
  const [{ data: tutorFiles }, { data: assistantFiles }] = await Promise.all([
    supabaseAdmin.from('knowledge_files').select('id, tutor_profile_id').not('tutor_profile_id', 'is', null),
    supabaseAdmin.from('knowledge_files').select('id, assistant_profile_id').not('assistant_profile_id', 'is', null),
  ]);
 
  const tutorFilesCountMap = (tutorFiles || []).reduce((acc: any, f: any) => {
    acc[f.tutor_profile_id!] = (acc[f.tutor_profile_id!] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
 
  const assistantFilesCountMap = (assistantFiles || []).reduce((acc: any, f: any) => {
    acc[f.assistant_profile_id!] = (acc[f.assistant_profile_id!] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
 
  // 4. Fetch test status events counts (no raw prompt/response logged or fetched)
  const { data: testEvents } = await supabaseAdmin
    .from('events_log')
    .select('student_id, event_type, metadata')
    .in('event_type', ['assistant_profile_updated', 'tutor_profile_updated']);
 
  const testEventMap = (testEvents || []).reduce((acc: any, event: any) => {
    const studentId = event.student_id;
    if (!acc[studentId]) {
      acc[studentId] = { attempts: 0, refusals: 0 };
    }
    const action = event.metadata?.action;
    if (action === 'assistant_test_attempt' || action === 'tutor_test_attempt') {
      acc[studentId].attempts++;
    } else if (action === 'assistant_test_refused' || action === 'tutor_test_refused') {
      acc[studentId].refusals++;
    }
    return acc;
  }, {} as Record<string, { attempts: number; refusals: number }>);

  // 5. Map entities with joined values
  const agents: any[] = [];

  for (const t of (tutorsList || [])) {
    const student = studentMap[t.student_id];
    const versionCount = tutorVersionCountMap[t.id] || 0;
    const fileCount = tutorFilesCountMap[t.id] || 0;
    const testStats = testEventMap[t.student_id] || { attempts: 0, refusals: 0 };

    agents.push({
      id: t.id,
      student_id: t.student_id,
      type: 'Tutor',
      name: t.name,
      status: t.status,
      studentName: student?.full_name || 'Apprentice',
      studentEmail: student?.email || '—',
      versionCount,
      hasCurrentVersion: !!t.current_version_id,
      lastUpdated: t.updated_at ? new Date(t.updated_at).toLocaleString() : '—',
      knowledgeFileCount: fileCount,
      betaComplete: !!t.metadata?.beta_complete,
      testStatus: testStats.attempts > 0 
        ? `Tested (${testStats.attempts} attempts, ${testStats.refusals} safety blocks)`
        : 'Not tested in sandbox',
    });
  }

  for (const a of (assistantsList || [])) {
    const student = studentMap[a.student_id];
    const versionCount = assistantVersionCountMap[a.id] || 0;
    const fileCount = assistantFilesCountMap[a.id] || 0;
    const testStats = testEventMap[a.student_id] || { attempts: 0, refusals: 0 };

    agents.push({
      id: a.id,
      student_id: a.student_id,
      type: 'Assistant',
      name: a.name,
      status: a.status,
      studentName: student?.full_name || 'Apprentice',
      studentEmail: student?.email || '—',
      versionCount,
      hasCurrentVersion: !!a.current_version_id,
      lastUpdated: a.updated_at ? new Date(a.updated_at).toLocaleString() : '—',
      knowledgeFileCount: fileCount,
      betaComplete: !!a.metadata?.beta_complete,
      testStatus: testStats.attempts > 0 
        ? `Tested (${testStats.attempts} attempts, ${testStats.refusals} safety blocks)`
        : 'Not tested in sandbox',
    });
  }

  // 6. Apply Search query filter
  const filteredAgents = agents.filter((agent) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      agent.name?.toLowerCase().includes(s) ||
      agent.studentEmail?.toLowerCase().includes(s) ||
      agent.studentName?.toLowerCase().includes(s) ||
      agent.type?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="min-h-screen bg-[#020617] star-field text-[var(--text-primary)] font-mono">
      <div className="max-w-screen-2xl mx-auto px-6 py-10 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/admin/home" className="text-slate-500 hover:text-[#00c8ff] font-mono text-xs uppercase tracking-widest transition-colors">
                ← Dashboard
              </Link>
              <span className="text-slate-700">/</span>
              <span className="text-[#00c8ff] font-mono text-xs uppercase tracking-widest">Custom Agents</span>
            </div>
            <h1 className="text-3xl font-display font-black tracking-widest uppercase flex items-center gap-4">
              <Cpu className="w-7 h-7 text-[#7b4fce]" />
              Apprentice Agent Lookup
              <span className="bg-[#7b4fce] text-[#020617] text-xs px-3 py-1 font-bold shadow-[0_0_10px_#7b4fce]">AUDIT</span>
            </h1>
          </div>
        </header>

        {/* Search */}
        <div className="mb-8 bg-slate-900/40 p-4 border border-slate-800 backdrop-blur-md">
          <form method="GET" className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="search"
                defaultValue={searchTerm}
                placeholder="Search by agent name, student, or agent type (tutor/assistant)..."
                className="w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded pl-10 pr-3 py-2.5 text-xs font-mono text-slate-100 outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#7b4fce] hover:bg-[#7b4fce]/90 text-white font-bold uppercase rounded text-xs transition-colors shadow-[0_0_10px_rgba(123,79,206,0.2)]"
            >
              Query
            </button>
          </form>
        </div>

        {/* Grid cards */}
        {filteredAgents.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredAgents.map((agent) => {
              const isTutor = agent.type === 'Tutor';
              const borderCls = isTutor ? 'border-cyan-500/30' : 'border-purple-500/30';
              const badgeCls = isTutor ? 'bg-[#00c8ff]/10 text-[#00c8ff] border-[#00c8ff]/20' : 'bg-[#7b4fce]/10 text-[#7b4fce] border-[#7b4fce]/20';

              return (
                <div key={agent.id} className={`glass-card !rounded-none border p-6 space-y-6 ${borderCls}`}>
                  
                  {/* Title Row */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider border ${badgeCls}`}>
                          {agent.type}
                        </span>
                        <span className="font-mono text-[9px] text-slate-500 uppercase">
                          Status: {agent.status}
                        </span>
                      </div>
                      <h3 className="text-base font-display font-black text-slate-200 uppercase tracking-wide">
                        {agent.name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 justify-end">
                        <User className="w-3.5 h-3.5" /> {agent.studentName}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">{agent.studentEmail}</p>
                    </div>
                  </div>

                  {/* Safe Summary Metrics */}
                  <div className="bg-black/40 border border-slate-800 p-4 space-y-3 text-xs leading-relaxed text-slate-300">
                    <div className="flex justify-between border-b border-slate-900 pb-1.5">
                      <span className="text-slate-500 uppercase text-[9px] font-bold">Version Count</span>
                      <span className="font-bold text-slate-200">{agent.versionCount} snapshots</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1.5">
                      <span className="text-slate-500 uppercase text-[9px] font-bold">Active Snapshot Presence</span>
                      <span className={`font-bold ${agent.hasCurrentVersion ? 'text-green-400' : 'text-amber-500'}`}>
                        {agent.hasCurrentVersion ? 'PRESENT' : 'MISSING'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1.5">
                      <span className="text-slate-500 uppercase text-[9px] font-bold">Last Updated</span>
                      <span className="text-slate-200">{agent.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1.5">
                      <span className="text-slate-500 uppercase text-[9px] font-bold">Knowledge File Count</span>
                      <span className="font-bold text-slate-200">{agent.knowledgeFileCount} files indexed</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1.5">
                      <span className="text-slate-500 uppercase text-[9px] font-bold">Beta Completion Status</span>
                      <span className={`font-bold flex items-center gap-1 ${agent.betaComplete ? 'text-green-400' : 'text-slate-500'}`}>
                        {agent.betaComplete ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" /> BETA COMPLETE
                          </>
                        ) : (
                          'IN PROGRESS'
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-slate-500 uppercase text-[9px] font-bold">Sandbox Test Status</span>
                      <span className="font-bold text-slate-200 text-right">{agent.testStatus}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card !rounded-none p-20 text-center text-slate-500 font-mono text-xs">
            No customized student agents found.
          </div>
        )}

      </div>
    </div>
  );
}
