import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, Trash2, ShieldOff, ShieldCheck, ChevronRight, CheckCircle2, Circle, Lock } from 'lucide-react';
import { deleteUser, suspendUser, restoreUser } from './actions';
import { MODULES } from '@/lib/constants';

const MODULE_LIST = [
  { id: MODULES.MODULE_1_ID, num: 1, title: 'AI Learning Code', totalNodes: 4 },
  { id: MODULES.MODULE_2_ID, num: 2, title: 'Digital Smarts', totalNodes: 6 },
  { id: MODULES.MODULE_3_ID, num: 3, title: 'Pre-Learn System', totalNodes: 4 },
  { id: MODULES.MODULE_4_ID, num: 4, title: 'Lesson Rescue Mode', totalNodes: 5 },
  { id: MODULES.MODULE_5_ID, num: 5, title: 'Compression Learning', totalNodes: 4 },
  { id: MODULES.MODULE_6_ID, num: 6, title: 'Self-Testing', totalNodes: 4 },
  { id: MODULES.MODULE_7_ID, num: 7, title: 'Notes & Study Packs', totalNodes: 4 },
  { id: MODULES.MODULE_8_ID, num: 8, title: 'Writing Clarity', totalNodes: 4 },
  { id: MODULES.MODULE_9_ID, num: 9, title: 'Build AI Tutor', totalNodes: 6 },
  { id: MODULES.MODULE_10_ID, num: 10, title: 'Build AI Assistant', totalNodes: 7 },
  { id: MODULES.CAPSTONE_ID, num: 11, title: 'Capstone', totalNodes: 1 },
];

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; filter?: string }>;
}) {
  const params = await searchParams;
  const searchTerm = params?.search || '';
  const filterType = params?.filter || 'all';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/student/home');

  // Fetch all student profiles
  const { data: students } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .in('role', ['student', 'suspended'])
    .order('created_at', { ascending: false });

  // Fetch all node progress across all students in one query
  const { data: allProgress } = await supabase
    .from('student_node_progress')
    .select('student_id, module_id, node_mastered');

  // Group progress per student per module
  const progressMap: Record<string, Record<string, number>> = {};
  for (const row of (allProgress || [])) {
    if (!row.node_mastered) continue;
    if (!progressMap[row.student_id]) progressMap[row.student_id] = {};
    progressMap[row.student_id][row.module_id] = (progressMap[row.student_id][row.module_id] || 0) + 1;
  }

  const totalStudents = students?.length || 0;
  const activeStudents = students?.filter(s => {
    const prog = progressMap[s.id];
    return prog && Object.values(prog).some(n => n > 0);
  }).length || 0;
  const suspendedStudents = students?.filter(s => s.role === 'suspended').length || 0;

  // Filter students based on search term and active/inactive status
  const filteredStudents = (students || []).filter(student => {
    const matchesSearch = searchTerm
      ? student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const studentProgress = progressMap[student.id] || {};
    const totalMastered = Object.values(studentProgress).reduce((a, b) => a + b, 0);
    const isActive = totalMastered > 0;

    let matchesFilter = true;
    if (filterType === 'active') matchesFilter = isActive && student.role !== 'suspended';
    if (filterType === 'inactive') matchesFilter = !isActive && student.role !== 'suspended';
    if (filterType === 'suspended') matchesFilter = student.role === 'suspended';

    return matchesSearch && matchesFilter;
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
              <span className="text-[#00c8ff] font-mono text-xs uppercase tracking-widest">Users</span>
            </div>
            <h1 className="text-3xl font-display font-black tracking-widest uppercase flex items-center gap-4">
              <Users className="w-7 h-7 text-[#7b4fce]" />
              Student Roster
              <span className="bg-[#7b4fce] text-[#020617] text-xs px-3 py-1 font-bold shadow-[0_0_10px_#7b4fce]">ADMIN</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="glass-card px-6 py-3 border-l-2 border-[#00c8ff] text-center !rounded-none">
              <p className="text-2xl font-display font-black text-[#00c8ff]">{totalStudents}</p>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Total Students</p>
            </div>
            <div className="glass-card px-6 py-3 border-l-2 border-[#7b4fce] text-center !rounded-none">
              <p className="text-2xl font-display font-black text-[#7b4fce]">{activeStudents}</p>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active</p>
            </div>
            {suspendedStudents > 0 && (
              <div className="glass-card px-6 py-3 border-l-2 border-amber-500 text-center !rounded-none">
                <p className="text-2xl font-display font-black text-amber-400">{suspendedStudents}</p>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Suspended</p>
              </div>
            )}
          </div>
        </header>

        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 bg-slate-900/40 p-4 border border-slate-800 backdrop-blur-md font-mono">
          <form method="GET" className="flex-1 flex gap-2">
            <input
              type="text"
              name="search"
              defaultValue={searchTerm}
              placeholder="Search student name or email..."
              className="flex-1 bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded px-3 py-2 text-xs font-mono text-slate-100 outline-none transition-colors"
            />
            {filterType !== 'all' && <input type="hidden" name="filter" value={filterType} />}
            <button
              type="submit"
              className="px-4 py-2 bg-[#00c8ff] hover:bg-[#00c8ff]/90 text-slate-950 font-bold uppercase rounded text-xs transition-colors"
            >
              Search
            </button>
          </form>
          
          <div className="flex gap-2">
            <Link
              href={`/admin/users?filter=all${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
              className={`px-4 py-2.5 rounded text-xs font-bold uppercase transition-all border ${
                filterType === 'all'
                  ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-[#00c8ff]'
                  : 'border-slate-800 bg-black/30 text-slate-400 hover:border-slate-700'
              }`}
            >
              All
            </Link>
            <Link
              href={`/admin/users?filter=active${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
              className={`px-4 py-2.5 rounded text-xs font-bold uppercase transition-all border ${
                filterType === 'active'
                  ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-[#00c8ff]'
                  : 'border-slate-800 bg-black/30 text-slate-400 hover:border-slate-700'
              }`}
            >
              Active
            </Link>
            <Link
              href={`/admin/users?filter=inactive${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
              className={`px-4 py-2.5 rounded text-xs font-bold uppercase transition-all border ${
                filterType === 'inactive'
                  ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-[#00c8ff]'
                  : 'border-slate-800 bg-black/30 text-slate-400 hover:border-slate-700'
              }`}
            >
              Inactive
            </Link>
            <Link
              href={`/admin/users?filter=suspended${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
              className={`px-4 py-2.5 rounded text-xs font-bold uppercase transition-all border ${
                filterType === 'suspended'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                  : 'border-slate-800 bg-black/30 text-slate-400 hover:border-slate-700'
              }`}
            >
              Suspended
            </Link>
          </div>
        </div>

        {/* Student Cards */}
        {filteredStudents && filteredStudents.length > 0 ? (
          <div className="space-y-6">
            {filteredStudents.map((student) => {
              const studentProgress = progressMap[student.id] || {};
              const totalMastered = Object.values(studentProgress).reduce((a, b) => a + b, 0);
              const totalNodes = MODULE_LIST.reduce((a, m) => a + m.totalNodes, 0);
              const overallPct = Math.round((totalMastered / totalNodes) * 100);
              
              // Find furthest unlocked module
              let lastUnlockedModule = 1;
              let prevDone = true;
              for (const mod of MODULE_LIST) {
                if (prevDone) lastUnlockedModule = mod.num;
                prevDone = (studentProgress[mod.id] || 0) >= mod.totalNodes;
              }

              return (
                <div key={student.id} className="glass-card !rounded-none border border-slate-800 overflow-hidden">
                  
                  {/* Student Header Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-4 border-b border-slate-800 bg-black/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#020617] border border-[#7b4fce] flex items-center justify-center text-[#7b4fce] font-display font-black text-sm shadow-[0_0_10px_rgba(123,79,206,0.3)]">
                        {(student.full_name || student.email || 'ST').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-display font-bold text-[var(--text-primary)] tracking-wide flex items-center gap-2">
                          {student.full_name || '—'}
                          {student.role === 'suspended' && (
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Suspended
                            </span>
                          )}
                        </p>
                        <p className="text-xs font-mono text-slate-400">{student.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Overall progress pill */}
                      <div className="flex items-center gap-2 bg-black/40 border border-slate-700 px-4 py-2">
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#7b4fce] to-[#00c8ff] rounded-full transition-all"
                            style={{ width: `${overallPct}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-[#00c8ff] font-bold">{overallPct}%</span>
                        <span className="font-mono text-[10px] text-slate-500 uppercase">Overall</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest hidden md:block">
                        Joined {new Date(student.created_at).toLocaleDateString()}
                      </span>

                      {/* Actions */}
                      {student.role === 'suspended' ? (
                        <form action={restoreUser}>
                          <input type="hidden" name="userId" value={student.id} />
                          <button
                            type="submit"
                            title="Restore User"
                            className="p-2 border border-[#39ff14]/30 text-[#39ff14] bg-[#39ff14]/20 hover:bg-[#39ff14]/30 transition-colors"
                            onClick={(e) => {
                              if (!confirm('Restore this user to active student status?')) e.preventDefault();
                            }}
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        </form>
                      ) : (
                        <form action={suspendUser}>
                          <input type="hidden" name="userId" value={student.id} />
                          <button
                            type="submit"
                            title="Suspend User"
                            className="p-2 border border-amber-500/40 text-amber-400 hover:bg-amber-400/10 transition-colors"
                            onClick={(e) => {
                              if (!confirm(`Suspend ${student.email}? They will lose dashboard access.`)) e.preventDefault();
                            }}
                          >
                            <ShieldOff className="w-4 h-4" />
                          </button>
                        </form>
                      )}
                      <form action={deleteUser}>
                        <input type="hidden" name="userId" value={student.id} />
                        <button
                          type="submit"
                          title="Delete User"
                          className="p-2 border border-red-500/40 text-red-400 hover:bg-red-400/10 transition-colors"
                          onClick={(e) => {
                            if (!confirm(`Permanently delete ${student.email}? This cannot be undone.`)) e.preventDefault();
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Module Progress Grid */}
                  <div className="px-6 py-4 overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                      {MODULE_LIST.map((mod) => {
                        const mastered = studentProgress[mod.id] || 0;
                        const pct = Math.round((mastered / mod.totalNodes) * 100);
                        const isComplete = mastered >= mod.totalNodes;
                        const isStarted = mastered > 0;

                        return (
                          <div key={mod.id} className={`flex flex-col items-center gap-1 w-[68px] p-2 border transition-colors
                            ${isComplete ? 'border-[#00c8ff]/40 bg-[#00c8ff]/5' : isStarted ? 'border-[#7b4fce]/30 bg-[#7b4fce]/5' : 'border-slate-800 bg-black/20'}`}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="w-4 h-4 text-[#00c8ff]" />
                            ) : isStarted ? (
                              <Circle className="w-4 h-4 text-[#7b4fce]" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-700" />
                            )}
                            <span className={`font-mono text-[9px] font-bold ${isComplete ? 'text-[#00c8ff]' : isStarted ? 'text-[#7b4fce]' : 'text-slate-600'}`}>
                              M{mod.num}
                            </span>
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${isComplete ? 'bg-[#00c8ff]' : 'bg-[#7b4fce]'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className={`font-mono text-[8px] ${isComplete ? 'text-[#00c8ff]' : 'text-slate-600'}`}>
                              {mastered}/{mod.totalNodes}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card !rounded-none p-20 text-center text-slate-500 font-mono">
            <Users className="w-10 h-10 mx-auto mb-4 opacity-30 text-[#7b4fce]" />
            <p className="uppercase tracking-widest text-xs">No students enrolled yet.</p>
          </div>
        )}

      </div>
    </div>
  );
}
