import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Cpu, Search, FileText, ChevronRight, User } from 'lucide-react';

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

  // 1. Fetch Tutors and Assistants profiles
  const [{ data: tutorsList }, { data: assistantsList }] = await Promise.all([
    supabase.from('tutor_profiles').select('*'),
    supabase.from('assistant_profiles').select('*'),
  ]);

  // Fetch all unique student IDs to get emails/names
  const tutorStudentIds = (tutorsList || []).map((t) => t.student_id);
  const assistantStudentIds = (assistantsList || []).map((a) => a.student_id);
  const uniqueStudentIds = Array.from(new Set([...tutorStudentIds, ...assistantStudentIds]));

  const { data: studentProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .in('id', uniqueStudentIds);

  const studentMap = (studentProfiles || []).reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {} as Record<string, any>);

  // 2. Fetch versions to extract the prompts/instructions
  const tutorVersionIds = (tutorsList || []).map((t) => t.current_version_id).filter(Boolean);
  const assistantVersionIds = (assistantsList || []).map((a) => a.current_version_id).filter(Boolean);

  const [{ data: tutorVersions }, { data: assistantVersions }] = await Promise.all([
    supabase.from('tutor_versions').select('id, instructions, version_number').in('id', tutorVersionIds),
    supabase.from('assistant_versions').select('id, system_prompt, version_number').in('id', assistantVersionIds),
  ]);

  const tutorVersionMap = (tutorVersions || []).reduce((acc, v) => {
    acc[v.id] = v;
    return acc;
  }, {} as Record<string, any>);

  const assistantVersionMap = (assistantVersions || []).reduce((acc, v) => {
    acc[v.id] = v;
    return acc;
  }, {} as Record<string, any>);

  // 3. Fetch knowledge files
  const [{ data: tutorFiles }, { data: assistantFiles }] = await Promise.all([
    supabase.from('knowledge_files').select('id, file_name, tutor_profile_id').not('tutor_profile_id', 'is', null),
    supabase.from('knowledge_files').select('id, file_name, assistant_profile_id').not('assistant_profile_id', 'is', null),
  ]);

  const tutorFilesMap = (tutorFiles || []).reduce((acc, f) => {
    if (!acc[f.tutor_profile_id]) acc[f.tutor_profile_id] = [];
    acc[f.tutor_profile_id].push(f.file_name);
    return acc;
  }, {} as Record<string, string[]>);

  const assistantFilesMap = (assistantFiles || []).reduce((acc, f) => {
    if (!acc[f.assistant_profile_id]) acc[f.assistant_profile_id] = [];
    acc[f.assistant_profile_id].push(f.file_name);
    return acc;
  }, {} as Record<string, string[]>);

  // 4. Map entities with joined values
  const agents: any[] = [];

  for (const t of (tutorsList || [])) {
    const student = studentMap[t.student_id];
    const version = t.current_version_id ? tutorVersionMap[t.current_version_id] : null;
    const files = tutorFilesMap[t.id] || [];

    agents.push({
      id: t.id,
      student_id: t.student_id,
      type: 'Tutor',
      name: t.name,
      status: t.status,
      studentName: student?.full_name || 'Apprentice',
      studentEmail: student?.email || '—',
      versionNumber: version?.version_number || 1,
      prompt: version?.instructions?.instruction_set || 'No instructions set.',
      files,
      config: {
        'Purpose': t.doctrine_config?.purpose || 'Not specified',
        'Teaching Style': t.doctrine_config?.teaching_style || 'Not specified',
        'Explanation Prefs': t.doctrine_config?.explanation_preferences || 'Not specified',
        'Subject Focus': t.doctrine_config?.subject_focus || 'Not specified',
      },
    });
  }

  for (const a of (assistantsList || [])) {
    const student = studentMap[a.student_id];
    const version = a.current_version_id ? assistantVersionMap[a.current_version_id] : null;
    const files = assistantFilesMap[a.id] || [];

    agents.push({
      id: a.id,
      student_id: a.student_id,
      type: 'Assistant',
      name: a.name,
      status: a.status,
      studentName: student?.full_name || 'Apprentice',
      studentEmail: student?.email || '—',
      versionNumber: version?.version_number || 1,
      prompt: version?.system_prompt || 'No prompt set.',
      files,
      config: {
        'Purpose': a.persona_config?.purpose || 'Not specified',
        'Target User': a.persona_config?.user_target || 'Not specified',
        'Boundaries': a.persona_config?.boundaries || 'Not specified',
      },
    });
  }

  // 5. Apply Search query filter
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
    <div className="min-h-screen bg-[#020617] star-field text-[var(--text-primary)]">
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
        <div className="mb-8 bg-slate-900/40 p-4 border border-slate-800 backdrop-blur-md font-mono">
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
                          {agent.type} v{agent.versionNumber}
                        </span>
                        <span className="font-mono text-[9px] text-slate-500 uppercase">
                          Status: {agent.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-display font-black text-slate-200 uppercase tracking-wide">
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

                  {/* Personality Knobs */}
                  <div className="grid grid-cols-2 gap-4 bg-black/40 border border-slate-850 p-4 font-mono text-[10px]">
                    {Object.entries(agent.config).map(([key, val]) => (
                      <div key={key} className="space-y-1">
                        <span className="text-slate-500 font-bold uppercase tracking-wider">{key}</span>
                        <p className="text-slate-350 line-clamp-2 leading-relaxed">{val as string}</p>
                      </div>
                    ))}
                  </div>

                  {/* Prompt Instructions Block */}
                  <div className="space-y-2">
                    <h4 className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      Active Instructions
                    </h4>
                    <div className="bg-black/60 border border-slate-900/60 rounded p-4 max-h-[140px] overflow-y-auto font-mono text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap select-text">
                      {agent.prompt}
                    </div>
                  </div>

                  {/* Knowledge files links */}
                  {agent.files.length > 0 && (
                    <div className="space-y-1.5 font-mono">
                      <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <FileText size={10} /> Attached Reference Files ({agent.files.length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {agent.files.map((file: string, idx: number) => (
                          <span key={idx} className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[9px] text-slate-400 truncate max-w-[160px]">
                            {file}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

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
