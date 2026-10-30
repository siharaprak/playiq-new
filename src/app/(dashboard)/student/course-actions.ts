'use server';

import { requireCourseReleaseAccess as ownerContext, assessmentReviewToken } from '@/lib/course-release/server-access';
import {
  ASSESSMENT_FIELDS,
  RELEASE_ID,
  buildPersonalLearningKnowledgeFile,
  isModuleNumber,
  sanitizeAssessmentProfile,
  validLearnerText,
  validateModuleAnswers,
  type CourseModuleRecord,
  type CourseReleaseState,
  type CourseShell,
} from '@/lib/course-release/learning-record';

type Failure = { ok: false; error: string };
type DbError = { code?: string } | null;
const RECORDS = 'course_release_learning_records';
const FEEDBACK = 'course_release_beta_feedback';
const RECORD_COLUMNS = 'module_number,answers,include_in_tutor,completed,updated_at,assessment_context';
const ASSESSMENT_COLUMNS = Object.keys(ASSESSMENT_FIELDS).join(',');

function failure(error: string): Failure { return { ok: false, error }; }
function persistenceFailure(error: DbError, operation: string): Failure {
  const schemaMissing = ['42P01', '42703', 'PGRST204', 'PGRST205'].includes(error?.code ?? '');
  return failure(schemaMissing
    ? 'Course saving/download is unavailable: the course-release database migration is missing or not visible. Nothing was confirmed saved. Ask the course team to apply migration 20261030090000 and refresh the schema cache.'
    : `${operation} could not be confirmed. Your connection or database access may be unavailable. Keep your local answers and retry; do not assume they were saved.`);
}

function publicRecord(row: Record<string, unknown>): CourseModuleRecord | null {
  const checked = validateModuleAnswers(row.module_number, row.answers);
  if (!checked.ok || !isModuleNumber(row.module_number)
    || typeof row.include_in_tutor !== 'boolean' || typeof row.completed !== 'boolean'
    || typeof row.updated_at !== 'string' || !Number.isFinite(Date.parse(row.updated_at))) return null;
  return { moduleNumber: row.module_number, answers: checked.answers, includeInTutor: row.include_in_tutor,
    completed: row.completed, updatedAt: row.updated_at };
}

function safeException(error: unknown): Failure {
  // No database messages, tokens, answer content, or provider details are returned/logged.
  const allowed = ['This course shell is not enabled.', 'Course storage is not configured. Nothing was saved.',
    'Sign in to your enrolled student account and retry. Nothing was saved.',
    'Course enrollment could not be verified. Ask the team to check the release migration; nothing was saved.',
    'This account is not enrolled in this course release. Ask the course team for access.'];
  return failure(error instanceof Error && allowed.includes(error.message) ? error.message
    : 'Course storage could not be reached. Keep your answers and retry; nothing was confirmed saved.');
}

export async function loadCourseReleaseState(shell: CourseShell): Promise<{ ok: true; data: CourseReleaseState } | Failure> {
  try {
    const { supabase, user } = await ownerContext(shell);
    const { data, error } = await supabase.from(RECORDS).select(RECORD_COLUMNS)
      .eq('student_id', user.id).eq('release_id', RELEASE_ID).eq('shell', shell).order('module_number');
    if (error) return persistenceFailure(error, 'Loading your course record');
    const records: CourseModuleRecord[] = [];
    for (const row of data ?? []) {
      const record = publicRecord(row);
      if (!record) return failure('A saved learning record has an invalid format. Ask the course team to check it; no answers were replaced.');
      records.push(record);
    }
    const { data: assessment, error: assessmentError } = await supabase.from('student_assessment_profiles')
      .select(ASSESSMENT_COLUMNS).eq('student_id', user.id).maybeSingle();
    if (assessmentError) return persistenceFailure(assessmentError, 'Loading your assessment context');
    // For student review only; export uses the separately approved persisted snapshot below.
    return { ok: true, data: { records, assessmentProfile: sanitizeAssessmentProfile(assessment), assessmentReviewToken: assessmentReviewToken(assessment) } };
  } catch (error) { return safeException(error); }
}

export async function saveCourseModuleRecord(input: {
  shell: CourseShell; moduleNumber: number; answers: Record<string, string>; includeInTutor: boolean; completed: boolean;
  assessmentReviewToken?: string | null;
}): Promise<{ ok: true; record: CourseModuleRecord } | Failure> {
  if (!input || typeof input !== 'object') return failure('No valid learning record was supplied.');
  const checked = validateModuleAnswers(input.moduleNumber, input.answers);
  if (!checked.ok) return failure(checked.error);
  if (typeof input.includeInTutor !== 'boolean' || typeof input.completed !== 'boolean') {
    return failure('Choose completion and Tutor export approval separately. Nothing was saved.');
  }
  try {
    const { supabase, user } = await ownerContext(input.shell);
    let assessmentContext: Record<string, string> | null = null;
    if (input.moduleNumber === 0 && input.includeInTutor) {
      const { data, error } = await supabase.from('student_assessment_profiles').select(ASSESSMENT_COLUMNS)
        .eq('student_id', user.id).maybeSingle();
      if (error) return persistenceFailure(error, 'Reading the assessment answers for approval');
      if ((input.assessmentReviewToken ?? null) !== assessmentReviewToken(data)) {
        return failure('Your assessment answers changed since this page was reviewed. Reload your record, review the updated answers, and approve again. Nothing was saved.');
      }
      assessmentContext = sanitizeAssessmentProfile(data);
    }
    const { data, error } = await supabase.from(RECORDS).upsert({
      student_id: user.id,
      release_id: RELEASE_ID,
      shell: input.shell,
      module_number: input.moduleNumber,
      answers: checked.answers,
      include_in_tutor: input.includeInTutor,
      completed: input.completed,
      assessment_context: assessmentContext,
    }, { onConflict: 'student_id,release_id,shell,module_number' }).select(RECORD_COLUMNS).single();
    if (error) return persistenceFailure(error, 'Saving your learning record');
    const record = data ? publicRecord(data) : null;
    if (!record) return failure('The saved record could not be read back. Keep your answers and retry; save is not confirmed.');
    return { ok: true, record };
  } catch (error) { return safeException(error); }
}

export async function downloadPersonalLearningKnowledgeFile(shell: CourseShell): Promise<
  { ok: true; markdown: string; filename: string; missingModules: number[] } | Failure
> {
  try {
    const { supabase, user } = await ownerContext(shell);
    const { data, error } = await supabase.from(RECORDS).select(RECORD_COLUMNS)
      .eq('student_id', user.id).eq('release_id', RELEASE_ID).eq('shell', shell).lte('module_number', 8).order('module_number');
    if (error) return persistenceFailure(error, 'Preparing your Personal Learning Knowledge File');
    const records: CourseModuleRecord[] = [];
    let approvedContext: Record<string, string> | null = null;
    for (const row of data ?? []) {
      const record = publicRecord(row);
      if (!record) return failure('A saved record needs review before export. No knowledge file was generated.');
      records.push(record);
      if (record.moduleNumber === 0 && record.includeInTutor) approvedContext = sanitizeAssessmentProfile(row.assessment_context);
    }
    return { ok: true, ...buildPersonalLearningKnowledgeFile({ records, assessmentProfile: approvedContext }, shell, new Date().toISOString()) };
  } catch (error) { return safeException(error); }
}

export async function saveCourseBetaFeedback(input: { moduleNumber: number; rating: number; feedback: string }): Promise<{ ok: true } | Failure> {
  if (!input || !isModuleNumber(input.moduleNumber) || !Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5
    || !validLearnerText(input.feedback, 4000)) return failure('Choose a module, a rating from 1–5, and feedback of at most 4000 characters.');
  try {
    const { supabase, user } = await ownerContext('beta');
    const { data: lesson, error: lessonError } = await supabase.from(RECORDS).select('completed')
      .eq('student_id', user.id).eq('release_id', RELEASE_ID).eq('shell', 'beta').eq('module_number', input.moduleNumber).maybeSingle();
    if (lessonError) return persistenceFailure(lessonError, 'Checking beta lesson completion');
    if (!lesson?.completed) return failure('Finish and save this beta lesson before sending its end-of-module feedback.');
    const { data, error } = await supabase.from(FEEDBACK).upsert({
      student_id: user.id, release_id: RELEASE_ID, shell: 'beta', module_number: input.moduleNumber,
      rating: input.rating, feedback: input.feedback,
    }, { onConflict: 'student_id,release_id,shell,module_number' }).select('module_number').single();
    if (error || !data) return persistenceFailure(error, 'Saving beta feedback');
    return { ok: true };
  } catch (error) { return safeException(error); }
}
