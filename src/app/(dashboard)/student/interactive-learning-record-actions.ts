'use server';

import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import {
  RELEASE_ID,
  isModuleNumber,
  sanitizeAssessmentProfile,
  validateModuleAnswers,
  validLearnerText,
  type CourseModuleRecord,
} from '@/lib/course-release/learning-record';
import { parseLessonChoices, validateLessonChoices, type LessonChoices } from '@/lib/course-release/activities';
import type { CourseBlockerInput, CourseBlockerResult } from './course-blocker-actions';

export type LegacyAssessmentContext = Record<string, string>;
export type InteractiveModuleLearningRecord = CourseModuleRecord & {
  assessmentContext?: LegacyAssessmentContext | null;
};

const RECORD_TABLE = 'course_release_learning_records';
const FEEDBACK_TABLE = 'course_release_beta_feedback';
const BLOCKER_TABLE = 'course_release_blockers';
const SHELL = 'beta' as const;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function getAuthenticatedStudentClient() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Not authenticated');

  const { data: enrollment } = await supabase
    .from('course_release_enrollments')
    .select('enabled')
    .eq('student_id', user.id)
    .eq('release_id', RELEASE_ID)
    .eq('shell', SHELL)
    .eq('enabled', true)
    .maybeSingle();

  if (!enrollment?.enabled && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role === 'student' || profile?.role === 'admin') {
      const admin = createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } },
      );
      await admin.from('course_release_enrollments').upsert(
        { student_id: user.id, release_id: RELEASE_ID, shell: SHELL, enabled: true },
        { onConflict: 'student_id,release_id,shell' },
      );
    }
  }

  return { supabase, user };
}

function toRecord(row: Record<string, unknown>): InteractiveModuleLearningRecord {
  const moduleNumber = Number(row.module_number);
  const rawAnswers = row.answers && typeof row.answers === 'object' && !Array.isArray(row.answers)
    ? row.answers as Record<string, unknown>
    : {};
  const validated = isModuleNumber(moduleNumber) ? validateModuleAnswers(moduleNumber, rawAnswers) : null;
  const answers = validated && validated.ok ? validated.answers : {};
  if (typeof rawAnswers.lessonChoices === 'string' && isModuleNumber(moduleNumber) && validateLessonChoices(rawAnswers.lessonChoices, moduleNumber)) {
    answers.lessonChoices = rawAnswers.lessonChoices;
  }
  const includeInTutor = Boolean(row.include_in_tutor);
  return {
    moduleNumber,
    answers,
    includeInTutor,
    completed: Boolean(row.completed),
    updatedAt: typeof row.updated_at === 'string' ? row.updated_at : new Date().toISOString(),
    assessmentContext: moduleNumber === 0 && includeInTutor
      ? sanitizeAssessmentProfile(row.assessment_context)
      : null,
  };
}

export async function loadInteractiveModuleRecordState(moduleNumber: number): Promise<{
  ok: true;
  record: InteractiveModuleLearningRecord | null;
  allRecords: InteractiveModuleLearningRecord[];
  betaFeedback: { rating: number; feedback: string; updatedAt?: string } | null;
  legacyAssessment: LegacyAssessmentContext | null;
} | { ok: false; error: string }> {
  if (!isModuleNumber(moduleNumber)) {
    return { ok: false, error: 'Invalid module number.' };
  }
  try {
    const { supabase, user } = await getAuthenticatedStudentClient();
    const [recordsRes, feedbackRes, legacyRes] = await Promise.all([
      supabase
        .from(RECORD_TABLE)
        .select('module_number,answers,include_in_tutor,completed,updated_at,assessment_context')
        .eq('student_id', user.id)
        .eq('release_id', RELEASE_ID)
        .eq('shell', SHELL)
        .order('module_number', { ascending: true }),
      supabase
        .from(FEEDBACK_TABLE)
        .select('rating,feedback,updated_at')
        .eq('student_id', user.id)
        .eq('release_id', RELEASE_ID)
        .eq('shell', SHELL)
        .eq('module_number', moduleNumber)
        .maybeSingle(),
      supabase
        .from('student_assessment_profiles')
        .select('grade_level,explanation_style,pacing_preference,challenge_response,ai_literacy_level,motivation_driver,baseline_task1_answer,baseline_task2_response,baseline_task3_response,rescue_target_subject,advance_target_subject,personal_goal')
        .eq('student_id', user.id)
        .maybeSingle(),
    ]);

    if (recordsRes.error) {
      return { ok: false, error: 'Could not load saved learning records from PlayIQ storage.' };
    }

    const allRecords = (recordsRes.data ?? []).map(row => toRecord(row as Record<string, unknown>));
    const record = allRecords.find(r => r.moduleNumber === moduleNumber) ?? null;
    const betaFeedback = feedbackRes.data
      ? {
          rating: Number(feedbackRes.data.rating),
          feedback: String(feedbackRes.data.feedback ?? ''),
          updatedAt: typeof feedbackRes.data.updated_at === 'string' ? feedbackRes.data.updated_at : undefined,
        }
      : null;

    return {
      ok: true,
      record,
      allRecords,
      betaFeedback,
      legacyAssessment: sanitizeAssessmentProfile(legacyRes.data ?? null),
    };
  } catch {
    return { ok: false, error: 'Could not verify your session to load learning records.' };
  }
}

export async function saveInteractiveModuleRecord(
  moduleNumber: number,
  rawAnswers: Record<string, unknown>,
  includeInTutor: boolean,
  completed: boolean,
): Promise<{ ok: true; record: InteractiveModuleLearningRecord } | { ok: false; error: string }> {
  if (!isModuleNumber(moduleNumber) || typeof includeInTutor !== 'boolean' || typeof completed !== 'boolean') {
    return { ok: false, error: 'Invalid module record request.' };
  }
  const validated = validateModuleAnswers(moduleNumber, rawAnswers);
  if (!validated.ok) {
    return { ok: false, error: validated.error };
  }
  const answers = validated.answers;
  if (rawAnswers.lessonChoices !== undefined) {
    if (moduleNumber === 13 || !validateLessonChoices(rawAnswers.lessonChoices, moduleNumber)) {
      return { ok: false, error: 'Digital lesson choices were invalid. Please re-select and save again.' };
    }
    answers.lessonChoices = rawAnswers.lessonChoices as string;
  }

  try {
    const { supabase, user } = await getAuthenticatedStudentClient();
    let assessmentContext: LegacyAssessmentContext | null = null;
    if (moduleNumber === 0 && includeInTutor) {
      const legacy = await supabase
        .from('student_assessment_profiles')
        .select('grade_level,explanation_style,pacing_preference,challenge_response,ai_literacy_level,motivation_driver,baseline_task1_answer,baseline_task2_response,baseline_task3_response,rescue_target_subject,advance_target_subject,personal_goal')
        .eq('student_id', user.id)
        .maybeSingle();
      if (!legacy.error) {
        assessmentContext = sanitizeAssessmentProfile(legacy.data ?? null);
      }
    }

    const saved = await supabase
      .from(RECORD_TABLE)
      .upsert(
        {
          student_id: user.id,
          release_id: RELEASE_ID,
          shell: SHELL,
          module_number: moduleNumber,
          answers,
          include_in_tutor: includeInTutor,
          completed,
          assessment_context: assessmentContext,
        },
        { onConflict: 'student_id,release_id,shell,module_number' },
      )
      .select('module_number,answers,include_in_tutor,completed,updated_at,assessment_context')
      .single();

    if (saved.error || !saved.data) {
      return { ok: false, error: 'Your learning answers were not confirmed saved. Keep your text and retry.' };
    }

    return { ok: true, record: toRecord(saved.data as Record<string, unknown>) };
  } catch {
    return { ok: false, error: 'Your learning answers were not confirmed saved. Check your connection and retry.' };
  }
}

export async function saveInteractiveLessonChoice(
  moduleNumber: number,
  activityId: string,
  optionId: string,
): Promise<{ ok: true; choices: LessonChoices; updatedAt?: string } | { ok: false; error: string }> {
  if (!isModuleNumber(moduleNumber) || moduleNumber === 13) {
    return { ok: false, error: 'Invalid module for digital lesson choice.' };
  }
  try {
    const { supabase, user } = await getAuthenticatedStudentClient();
    const existingRes = await supabase
      .from(RECORD_TABLE)
      .select('module_number,answers,include_in_tutor,completed,assessment_context')
      .eq('student_id', user.id)
      .eq('release_id', RELEASE_ID)
      .eq('shell', SHELL)
      .eq('module_number', moduleNumber)
      .maybeSingle();

    if (existingRes.error) {
      return { ok: false, error: 'Could not read existing lesson choices before saving.' };
    }

    const existingRecord: InteractiveModuleLearningRecord = existingRes.data
      ? toRecord(existingRes.data as Record<string, unknown>)
      : { moduleNumber, answers: {}, includeInTutor: false, completed: false, updatedAt: new Date().toISOString(), assessmentContext: null };

    const currentChoices = parseLessonChoices(existingRecord.answers.lessonChoices, moduleNumber);
    const nextChoices: LessonChoices = { ...currentChoices, [activityId]: optionId };
    const serializedChoices = JSON.stringify(nextChoices);

    if (!validateLessonChoices(serializedChoices, moduleNumber)) {
      return { ok: false, error: 'That choice option is not valid for this lesson question.' };
    }

    const nextAnswers = { ...existingRecord.answers, lessonChoices: serializedChoices };
    const saved = await supabase
      .from(RECORD_TABLE)
      .upsert(
        {
          student_id: user.id,
          release_id: RELEASE_ID,
          shell: SHELL,
          module_number: moduleNumber,
          answers: nextAnswers,
          include_in_tutor: existingRecord.includeInTutor,
          completed: existingRecord.completed,
          assessment_context: existingRecord.moduleNumber === 0 && existingRecord.includeInTutor
            ? existingRecord.assessmentContext ?? null
            : null,
        },
        { onConflict: 'student_id,release_id,shell,module_number' },
      )
      .select('answers,updated_at')
      .single();

    if (saved.error || !saved.data) {
      return { ok: false, error: 'This choice was not confirmed saved. Stay here and retry.' };
    }

    const savedAnswers = saved.data.answers as Record<string, unknown> | null;
    const confirmedChoices = parseLessonChoices(
      typeof savedAnswers?.lessonChoices === 'string' ? savedAnswers.lessonChoices : undefined,
      moduleNumber,
    );
    if (confirmedChoices[activityId] !== optionId) {
      return { ok: false, error: 'Choice readback did not match. Please retry saving this choice.' };
    }

    return {
      ok: true,
      choices: confirmedChoices,
      updatedAt: typeof saved.data.updated_at === 'string' ? saved.data.updated_at : undefined,
    };
  } catch {
    return { ok: false, error: 'This choice was not confirmed saved. Check your connection and retry.' };
  }
}

export async function saveInteractiveBetaFeedback(
  moduleNumber: number,
  rating: number,
  feedback: string,
): Promise<{ ok: true; updatedAt?: string } | { ok: false; error: string }> {
  if (!isModuleNumber(moduleNumber) || !Number.isInteger(rating) || rating < 1 || rating > 5 || !validLearnerText(feedback, 4000)) {
    return { ok: false, error: 'Choose a 1–5 rating and keep feedback under 4,000 characters.' };
  }
  try {
    const { supabase, user } = await getAuthenticatedStudentClient();
    const existingRecord = await supabase
      .from(RECORD_TABLE)
      .select('completed')
      .eq('student_id', user.id)
      .eq('release_id', RELEASE_ID)
      .eq('shell', SHELL)
      .eq('module_number', moduleNumber)
      .maybeSingle();

    if (!existingRecord.data?.completed) {
      await supabase
        .from(RECORD_TABLE)
        .upsert(
          {
            student_id: user.id,
            release_id: RELEASE_ID,
            shell: SHELL,
            module_number: moduleNumber,
            answers: {},
            include_in_tutor: false,
            completed: true,
          },
          { onConflict: 'student_id,release_id,shell,module_number', ignoreDuplicates: false },
        );
    }

    const saved = await supabase
      .from(FEEDBACK_TABLE)
      .upsert(
        {
          student_id: user.id,
          release_id: RELEASE_ID,
          shell: SHELL,
          module_number: moduleNumber,
          rating,
          feedback,
        },
        { onConflict: 'student_id,release_id,shell,module_number' },
      )
      .select('updated_at')
      .single();

    if (saved.error || !saved.data) {
      return { ok: false, error: 'Beta feedback was not confirmed saved. Save your module learning record first and retry.' };
    }

    return { ok: true, updatedAt: typeof saved.data.updated_at === 'string' ? saved.data.updated_at : undefined };
  } catch {
    return { ok: false, error: 'Beta feedback was not confirmed saved. Check your connection and retry.' };
  }
}

export async function submitInteractiveCourseBlocker(input: CourseBlockerInput): Promise<CourseBlockerResult> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, reason: 'validation', error: 'Invalid technical report input.' };
  }
  if (
    !isModuleNumber(input.moduleNumber) ||
    typeof input.reportId !== 'string' ||
    !UUID_RE.test(input.reportId) ||
    !validLearnerText(input.message, 4000) ||
    input.message.trim().length < 10 ||
    !validLearnerText(input.browser, 120) ||
    !input.browser.trim() ||
    !validLearnerText(input.device, 120) ||
    !input.device.trim() ||
    (input.severity !== 'blocked' && input.severity !== 'problem')
  ) {
    return {
      ok: false,
      reason: 'validation',
      error: 'Use a problem description of 10–4000 characters and the displayed browser/device details. No private links or hidden control characters.',
    };
  }

  const normalizedPagePath = `/student/course-beta?module=${input.moduleNumber}`;
  try {
    const { supabase, user } = await getAuthenticatedStudentClient();
    const id = input.reportId.toLowerCase();
    const payload = {
      id,
      student_id: user.id,
      release_id: RELEASE_ID,
      module_number: input.moduleNumber,
      message: input.message,
      browser: input.browser,
      device: input.device,
      page_path: normalizedPagePath,
      severity: input.severity,
    };

    const readOwnTicket = () =>
      supabase
        .from(BLOCKER_TABLE)
        .select('id,module_number,message,browser,device,page_path,severity')
        .eq('id', id)
        .eq('student_id', user.id)
        .eq('release_id', RELEASE_ID)
        .maybeSingle();

    const confirm = (row: Record<string, unknown> | null): CourseBlockerResult => {
      if (!row) {
        return { ok: false, error: 'Report not confirmed. Keep your text and report reference, then retry.' };
      }
      for (const key of ['id', 'module_number', 'message', 'browser', 'device', 'page_path', 'severity'] as const) {
        if (row[key] !== payload[key]) {
          return {
            ok: false,
            error: 'This report reference already belongs to a different saved report. Keep the reference and ask the beta team to check it.',
          };
        }
      }
      return { ok: true, ticketId: id, status: 'confirmed' };
    };

    const existing = await readOwnTicket();
    if (existing.error) {
      return { ok: false, error: 'Report not confirmed. Keep your report reference and retry.' };
    }
    if (existing.data) return confirm(existing.data as Record<string, unknown>);

    const inserted = await supabase.from(BLOCKER_TABLE).insert(payload).select('id').single();
    if (inserted.error && inserted.error.code !== '23505') {
      return { ok: false, error: 'Report not confirmed. Keep your report reference and retry.' };
    }

    const readback = await readOwnTicket();
    if (readback.error) {
      return { ok: false, error: 'Report not confirmed. Keep your report reference and retry.' };
    }
    return confirm((readback.data ?? null) as Record<string, unknown> | null);
  } catch {
    return {
      ok: false,
      error: 'Report not confirmed. Check that you are signed in to your student account and retry with the same reference.',
    };
  }
}

