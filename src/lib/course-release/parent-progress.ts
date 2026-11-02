import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { loadCourseLessons } from './content';
import { RELEASE_ID, type CourseShell } from './learning-record';

export type ParentCourseModuleStatus = 'completed' | 'in_progress' | 'not_started';

export interface ParentCourseChildProgress {
  studentId: string;
  completedCount: number;
  totalModules: number;
  percent: number;
  currentModule: { moduleNumber: number; title: string } | null;
  lastActivityAt: string | null;
  modules: { moduleNumber: number; title: string; status: ParentCourseModuleStatus }[];
}

const TOTAL_MODULES = 15; // Module 00 + Modules 1–14

function moduleTitles(shell: CourseShell): Map<number, string> {
  const titles = new Map<number, string>();
  try {
    for (const lesson of loadCourseLessons(shell)) titles.set(lesson.moduleNumber, lesson.title);
  } catch {
    // Course source unavailable in this build: fall back to numbered labels.
  }
  return titles;
}

/**
 * Progress in the new course release for a parent's linked children.
 * Callers MUST pass only student IDs already verified as linked to the signed-in parent
 * (e.g. from getParentChildrenRollups). Returns status only — never answer content,
 * which stays student-owned.
 */
export async function getParentCourseReleaseProgress(
  studentIds: string[],
  shell: CourseShell = 'beta',
): Promise<Record<string, ParentCourseChildProgress>> {
  const result: Record<string, ParentCourseChildProgress> = {};
  if (studentIds.length === 0) return result;

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await admin
    .from('course_release_learning_records')
    .select('student_id, module_number, completed, updated_at')
    .in('student_id', studentIds)
    .eq('release_id', RELEASE_ID)
    .eq('shell', shell);
  if (error) {
    console.warn('Parent course-release progress unavailable:', error.code);
    return result;
  }

  const titles = moduleTitles(shell);
  const titleFor = (n: number) => titles.get(n) ?? (n === 0 ? 'Module 00' : `Module ${n}`);

  for (const studentId of studentIds) {
    const rows = (data ?? []).filter(r => r.student_id === studentId);
    const byModule = new Map(rows.map(r => [Number(r.module_number), r]));
    const modules = Array.from({ length: TOTAL_MODULES }, (_, n) => {
      const row = byModule.get(n);
      const status: ParentCourseModuleStatus = row?.completed ? 'completed' : row ? 'in_progress' : 'not_started';
      return { moduleNumber: n, title: titleFor(n), status };
    });
    const completedCount = modules.filter(m => m.status === 'completed').length;
    const next = modules.find(m => m.status !== 'completed') ?? null;
    const lastActivityAt = rows.reduce<string | null>(
      (latest, r) => (!latest || r.updated_at > latest ? r.updated_at : latest), null);
    result[studentId] = {
      studentId,
      completedCount,
      totalModules: TOTAL_MODULES,
      percent: Math.round((completedCount / TOTAL_MODULES) * 100),
      currentModule: next ? { moduleNumber: next.moduleNumber, title: next.title } : null,
      lastActivityAt,
      modules,
    };
  }
  return result;
}
