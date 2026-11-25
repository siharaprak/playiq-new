import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Trash2,
  ShieldOff,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Lock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  deleteUser,
  suspendUser,
  restoreUser,
  updateLearningLevel,
  resetStudentProgress,
  resetModule0,
  resetSingleModule,
  adjustStudentModuleProgress,
} from './actions';
import { COURSE_15_MODULES, isNodeKeyForCourseModule } from '@/lib/constants';
import ConfirmButton from '@/components/admin/ConfirmButton';

const MODULE_LIST = COURSE_15_MODULES.filter((m) => m.num >= 1);
const TOTAL_COURSE_NODES = MODULE_LIST.reduce((sum, m) => sum + m.totalNodes, 0);

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
  const { data: students, error: studentsError } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email, role, status, created_at, learning_level')
    .eq('role', 'student')
    .order('created_at', { ascending: false });

  if (studentsError) {
    console.error('❌ Admin Roster Error (profiles):', studentsError);
  }

  // Fetch all node progress across all students (including node_id so M10–M14 are strictly isolated)
  const { data: allProgress, error: progressError } = await supabaseAdmin
    .from('student_node_progress')
    .select('student_id, module_id, node_id, node_mastered');

  if (progressError) {
    console.error('❌ Admin Roster Error (progress):', progressError);
  }

  // Fetch all student assessment profiles for Module 00 status
  const { data: assessmentProfiles, error: assessmentError } = await supabaseAdmin
    .from('student_assessment_profiles')
    .select('student_id, assessment_completed');

  if (assessmentError) {
    console.error('❌ Admin Roster Error (assessments):', assessmentError);
  }

  // Fetch course_release_learning_records completion state for 15-module tracking (M00, M13, M14)
  const learningRecordCompletedMap: Record<string, Record<number, boolean>> = {};
  try {
    const { data: lrRows } = await supabaseAdmin
      .from('course_release_learning_records')
      .select('student_id, module_number, completed');
    for (const row of lrRows || []) {
      if (row.completed) {
        if (!learningRecordCompletedMap[row.student_id]) {
          learningRecordCompletedMap[row.student_id] = {};
        }
        learningRecordCompletedMap[row.student_id][row.module_number] = true;
      }
    }
  } catch {
    // Non-fatal if table is absent in a local environment
  }

  const assessmentMap: Record<string, boolean> = {};
  for (const row of assessmentProfiles || []) {
    if (row.assessment_completed) {
      assessmentMap[row.student_id] = true;
    }
  }

  // Group deduplicated mastered node keys per student so each of Modules 01..14 gets an exact count
  const rawRowsByStudent: Record<string, Array<{ module_id: string; node_id: string }>> = {};
  for (const row of allProgress || []) {
    if (!row.node_mastered) continue;
    if (!rawRowsByStudent[row.student_id]) rawRowsByStudent[row.student_id] = [];
    rawRowsByStudent[row.student_id].push({
      module_id: String(row.module_id),
      node_id: String(row.node_id),
    });
  }

  const progressByStudentModuleNum: Record<string, Record<number, number>> = {};
  for (const student of students || []) {
    const studentRows = rawRowsByStudent[student.id] || [];
    const studentLr = learningRecordCompletedMap[student.id] || {};
    const perMod: Record<number, number> = {};

    for (const mod of MODULE_LIST) {
      const uniqueMasteredKeys = new Set(
        studentRows
          .filter((r) => isNodeKeyForCourseModule(mod.num, r.module_id, r.node_id))
          .map((r) => r.node_id),
      );
      const rawCount = Math.min(mod.totalNodes, uniqueMasteredKeys.size);
      const recordCompleted = mod.num >= 13 && Boolean(studentLr[mod.num]);
      perMod[mod.num] = recordCompleted ? Math.max(rawCount, mod.totalNodes) : rawCount;
    }
    progressByStudentModuleNum[student.id] = perMod;
  }

  const isModule0DoneForStudent = (studentId: string) =>
    Boolean(assessmentMap[studentId] || learningRecordCompletedMap[studentId]?.[0]);

  const totalStudents = students?.length || 0;
  const activeStudents = (students || []).filter((s: any) => {
    const prog = progressByStudentModuleNum[s.id] || {};
    return isModule0DoneForStudent(s.id) || Object.values(prog).some((n: number) => n > 0);
  }).length;
  const suspendedStudents = (students || []).filter((s: any) => s.status === 'suspended').length;

  // Filter students based on search term and active/inactive status
  const filteredStudents = (students || []).filter((student: any) => {
    const matchesSearch = searchTerm
      ? student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const studentProgress = progressByStudentModuleNum[student.id] || {};
    const totalMastered = Object.values(studentProgress).reduce((a: number, b: number) => a + b, 0);
    const isActive = isModule0DoneForStudent(student.id) || totalMastered > 0;

    let matchesFilter = true;
    if (filterType === 'active') matchesFilter = isActive && student.status !== 'suspended';
    if (filterType === 'inactive') matchesFilter = !isActive && student.status !== 'suspended';
    if (filterType === 'suspended') matchesFilter = student.status === 'suspended';

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#020617] star-field text-[var(--text-primary)] px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16">
      <div className="max-w-[1440px] mx-auto relative z-10">

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
            <p className="text-xs font-mono text-slate-400 mt-1">
              Full 15-Module Course Progression (M00 Orientation + Modules M01–M14 Capstone)
            </p>
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
            {filteredStudents.map((student: any) => {
              const studentProgress = progressByStudentModuleNum[student.id] || {};
              const totalMastered = Object.values(studentProgress).reduce((a: number, b: number) => a + b, 0);
              const overallPct = Math.min(100, Math.round((totalMastered / TOTAL_COURSE_NODES) * 100));
              const m0Complete = isModule0DoneForStudent(student.id);

              // Sequential unlock tracking across M01..M14
              let prevDone = m0Complete;
              const unlockedModules = new Set<number>();
              for (const mod of MODULE_LIST) {
                if (prevDone) unlockedModules.add(mod.num);
                prevDone = prevDone && (studentProgress[mod.num] || 0) >= mod.totalNodes;
              }

              return (
                <div key={student.id} className="glass-card !rounded-none border border-slate-800 overflow-hidden">

                  {/* Student Header Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-4 border-b border-slate-800 bg-black/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#020617] border border-[#7b4fce] flex items-center justify-center text-[#7b4fce] font-display font-black text-sm shadow-[0_0_10px_rgba(123,79,206,0.3)] shrink-0">
                        {(student.full_name || student.email || 'ST').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-display font-bold text-[var(--text-primary)] tracking-wide flex flex-wrap items-center gap-2">
                          <span>{student.full_name || '—'}</span>
                          {student.status === 'suspended' && (
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Suspended
                            </span>
                          )}
                          {(['teamsienvi-student@student.playiq.dev', 'teamsienvitest@gmail.com', 'jimboyaquino12@gmail.com', 'futurefaker01@gmail.com', 'blake14-test@student.playiq.dev', 'test_student@student.playiq.dev', 'student.tester@test.com'].includes((student.email || '').toLowerCase()) || (student.full_name || '').toLowerCase().includes('test')) && (
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              TEST ACCOUNT
                            </span>
                          )}
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border ${
                            student.learning_level === 'elementary' ? 'text-[#00c8ff] border-[#00c8ff]/30 bg-[#00c8ff]/10' :
                            student.learning_level === 'middle' ? 'text-[#7b4fce] border-[#7b4fce]/30 bg-[#7b4fce]/10' :
                            student.learning_level === 'adult' ? 'text-[#39ff14] border-[#39ff14]/30 bg-[#39ff14]/10' :
                            'text-amber-400 border-amber-500/30 bg-amber-500/10'
                          }`}>
                            {student.learning_level === 'elementary' ? 'K-5 Elementary' :
                             student.learning_level === 'middle' ? '6-8 Middle' :
                             student.learning_level === 'adult' ? 'Adult Pro' :
                             '9-12 High'}
                          </span>
                        </p>
                        <p className="text-xs font-mono text-slate-400">{student.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Learning Level Form */}
                      <form action={updateLearningLevel} className="flex items-center gap-1.5 bg-black/40 border border-slate-700 px-3 py-2 font-mono">
                        <input type="hidden" name="userId" value={student.id} />
                        <label className="text-[9px] text-slate-500 uppercase tracking-widest">Level:</label>
                        <select
                          name="learningLevel"
                          defaultValue={student.learning_level || 'high'}
                          className="bg-[#020617] text-xs text-slate-300 border border-slate-800 focus:border-[#00c8ff] rounded px-2 py-1 outline-none cursor-pointer"
                        >
                          <option value="elementary">K-5 Elementary</option>
                          <option value="middle">6-8 Middle</option>
                          <option value="high">9-12 High</option>
                          <option value="adult">Adult Pro</option>
                        </select>
                        <button
                          type="submit"
                          className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-800 hover:bg-[#00c8ff] hover:text-black border border-slate-700 hover:border-[#00c8ff] transition-all cursor-pointer font-sans"
                        >
                          SET
                        </button>
                      </form>

                      {/* Per-Module Adjustment Form (M00–M14 Unlock / Complete / Reset) */}
                      <form action={adjustStudentModuleProgress} className="flex items-center gap-1.5 bg-black/40 border border-slate-700 px-3 py-2 font-mono">
                        <input type="hidden" name="userId" value={student.id} />
                        <label className="text-[9px] text-slate-500 uppercase tracking-widest">Mod:</label>
                        <select
                          name="moduleNum"
                          defaultValue="12"
                          className="bg-[#020617] text-xs text-slate-300 border border-slate-800 focus:border-[#00c8ff] rounded px-2 py-1 outline-none cursor-pointer"
                        >
                          {COURSE_15_MODULES.map((m) => (
                            <option key={m.num} value={m.num}>
                              M{String(m.num).padStart(2, '0')} — {m.title.length > 22 ? `${m.title.slice(0, 22)}…` : m.title}
                            </option>
                          ))}
                        </select>
                        <select
                          name="adjustment"
                          defaultValue="unlock_to"
                          className="bg-[#020617] text-xs text-slate-300 border border-slate-800 focus:border-[#7b4fce] rounded px-2 py-1 outline-none cursor-pointer"
                        >
                          <option value="unlock_to">Unlock Up To</option>
                          <option value="complete_module">Mark Complete</option>
                          <option value="reset_module">Reset Module</option>
                        </select>
                        <ConfirmButton
                          type="submit"
                          className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-800 hover:bg-[#7b4fce] hover:text-white border border-slate-700 hover:border-[#7b4fce] transition-all cursor-pointer font-sans"
                          confirmMessage={`Apply selected module adjustment for ${student.email}?`}
                        >
                          APPLY
                        </ConfirmButton>
                      </form>

                      {/* Overall progress pill */}
                      <div className="flex items-center gap-2 bg-black/40 border border-slate-700 px-4 py-2" title={`${totalMastered} / ${TOTAL_COURSE_NODES} nodes mastered across M01–M14`}>
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#7b4fce] to-[#00c8ff] rounded-full transition-all"
                            style={{ width: `${overallPct}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-[#00c8ff] font-bold">{overallPct}%</span>
                        <span className="font-mono text-[10px] text-slate-500 uppercase">Overall</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest hidden xl:block">
                        Joined {new Date(student.created_at).toLocaleDateString()}
                      </span>

                      {/* Actions */}
                      {student.status === 'suspended' ? (
                        <form action={restoreUser}>
                          <input type="hidden" name="userId" value={student.id} />
                          <ConfirmButton
                            type="submit"
                            title="Restore User"
                            className="p-2 border border-[#39ff14]/30 text-[#39ff14] bg-[#39ff14]/20 hover:bg-[#39ff14]/30 transition-colors"
                            confirmMessage="Restore this user to active student status?"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </ConfirmButton>
                        </form>
                      ) : (
                        <form action={suspendUser}>
                          <input type="hidden" name="userId" value={student.id} />
                          <ConfirmButton
                            type="submit"
                            title="Suspend User"
                            className="p-2 border border-amber-500/40 text-amber-400 hover:bg-amber-450/10 transition-colors"
                            confirmMessage={`Suspend ${student.email}? They will lose dashboard access.`}
                          >
                            <ShieldOff className="w-4 h-4" />
                          </ConfirmButton>
                        </form>
                      )}

                      {/* Reset Module 0 Action */}
                      <form action={resetModule0}>
                        <input type="hidden" name="userId" value={student.id} />
                        <ConfirmButton
                          type="submit"
                          title="Reset Module 00 Only"
                          className="p-2 border border-[#7b4fce]/40 text-[#7b4fce] hover:bg-[#7b4fce]/10 transition-colors"
                          confirmMessage={`Reset Module 00 for ${student.email}? This will require them to redo the Orion assessment & AI workshop on next login without touching other module progress.`}
                        >
                          <Sparkles className="w-4 h-4" />
                        </ConfirmButton>
                      </form>

                      {/* Reset Progress Action */}
                      <form action={resetStudentProgress}>
                        <input type="hidden" name="userId" value={student.id} />
                        <ConfirmButton
                          type="submit"
                          title="Reset All Progress (M00–M14)"
                          className="p-2 border border-[#00c8ff]/40 text-[#00c8ff] hover:bg-[#00c8ff]/10 transition-colors"
                          confirmMessage={`Reset all course progress (M00–M14) for ${student.email}? This will wipe their node progress, learning records, quizzes, and assessment profile back to Module 00.`}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </ConfirmButton>
                      </form>

                      <form action={deleteUser}>
                        <input type="hidden" name="userId" value={student.id} />
                        <ConfirmButton
                          type="submit"
                          title="Delete User"
                          className="p-2 border border-red-500/40 text-red-400 hover:bg-red-400/10 transition-colors"
                          confirmMessage={`Open a deletion request for ${student.email}? You will complete the deletion steps on the Privacy page.`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </ConfirmButton>
                      </form>
                    </div>
                  </div>

                  {/* Module Progress Grid (M00..M14) */}
                  <div className="px-6 py-4 overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                      {/* Module 00 Status */}
                      <div
                        title={`Module 00: ${COURSE_15_MODULES[0].title}`}
                        className={`relative group flex flex-col items-center gap-1 w-[64px] p-2 border transition-colors ${
                          m0Complete
                            ? 'border-[#00c8ff]/40 bg-[#00c8ff]/5'
                            : 'border-amber-500/30 bg-amber-500/5'
                        }`}
                      >
                        {m0Complete && (
                          <form action={resetSingleModule} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <input type="hidden" name="userId" value={student.id} />
                            <input type="hidden" name="moduleNum" value={0} />
                            <ConfirmButton
                              type="submit"
                              title="Reset M00"
                              className="p-0.5 text-slate-400 hover:text-[#00c8ff] cursor-pointer"
                              confirmMessage={`Reset Module 00 for ${student.email}?`}
                            >
                              <RotateCcw className="w-2.5 h-2.5" />
                            </ConfirmButton>
                          </form>
                        )}
                        {m0Complete ? (
                          <CheckCircle2 className="w-4 h-4 text-[#00c8ff]" />
                        ) : (
                          <Circle className="w-4 h-4 text-amber-400" />
                        )}
                        <span className={`font-mono text-[9px] font-bold ${m0Complete ? 'text-[#00c8ff]' : 'text-amber-400'}`}>
                          M00
                        </span>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${m0Complete ? 'bg-[#00c8ff]' : 'bg-amber-400'}`}
                            style={{ width: m0Complete ? '100%' : '0%' }}
                          />
                        </div>
                        <span className={`font-mono text-[8px] ${m0Complete ? 'text-[#00c8ff]' : 'text-amber-400'}`}>
                          {m0Complete ? 'Calibrated' : 'Pending'}
                        </span>
                      </div>

                      {MODULE_LIST.map((mod) => {
                        const mastered = studentProgress[mod.num] || 0;
                        const pct = Math.min(100, Math.round((mastered / mod.totalNodes) * 100));
                        const isComplete = mastered >= mod.totalNodes;
                        const isStarted = mastered > 0;
                        const isUnlocked = unlockedModules.has(mod.num);
                        const codeLabel = `M${String(mod.num).padStart(2, '0')}`;

                        return (
                          <div
                            key={mod.num}
                            title={`Module ${String(mod.num).padStart(2, '0')}: ${mod.title} (${mastered}/${mod.totalNodes} nodes)`}
                            className={`relative group flex flex-col items-center gap-1 w-[64px] p-2 border transition-colors ${
                              isComplete
                                ? 'border-[#00c8ff]/40 bg-[#00c8ff]/5'
                                : isStarted
                                  ? 'border-[#7b4fce]/40 bg-[#7b4fce]/5'
                                  : isUnlocked
                                    ? 'border-slate-700 bg-slate-900/40'
                                    : 'border-slate-800 bg-black/20'
                            }`}
                          >
                            {isStarted && (
                              <form action={resetSingleModule} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <input type="hidden" name="userId" value={student.id} />
                                <input type="hidden" name="moduleNum" value={mod.num} />
                                <ConfirmButton
                                  type="submit"
                                  title={`Reset ${codeLabel}`}
                                  className="p-0.5 text-slate-400 hover:text-[#00c8ff] cursor-pointer"
                                  confirmMessage={`Reset Module ${String(mod.num).padStart(2, '0')} (${mod.title}) for ${student.email}?`}
                                >
                                  <RotateCcw className="w-2.5 h-2.5" />
                                </ConfirmButton>
                              </form>
                            )}
                            {isComplete ? (
                              <CheckCircle2 className="w-4 h-4 text-[#00c8ff]" />
                            ) : isStarted ? (
                              <Circle className="w-4 h-4 text-[#7b4fce]" />
                            ) : isUnlocked ? (
                              <Circle className="w-4 h-4 text-slate-500" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-700" />
                            )}
                            <span
                              className={`font-mono text-[9px] font-bold ${
                                isComplete
                                  ? 'text-[#00c8ff]'
                                  : isStarted
                                    ? 'text-[#7b4fce]'
                                    : isUnlocked
                                      ? 'text-slate-300'
                                      : 'text-slate-600'
                              }`}
                            >
                              {codeLabel}
                            </span>
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isComplete ? 'bg-[#00c8ff]' : 'bg-[#7b4fce]'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className={`font-mono text-[8px] ${isComplete ? 'text-[#00c8ff]' : 'text-slate-500'}`}>
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
