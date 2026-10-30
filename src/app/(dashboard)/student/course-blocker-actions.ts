'use server';

import { requireCourseReleaseAccess } from '@/lib/course-release/server-access';
import { RELEASE_ID, isModuleNumber, validLearnerText } from '@/lib/course-release/learning-record';

export type CourseBlockerInput = {
  reportId: string;
  moduleNumber: number;
  message: string;
  browser: string;
  device: string;
  pagePath: string;
  severity: 'blocked' | 'problem';
};
export type CourseBlockerResult = { ok: true; ticketId: string; status: 'confirmed' } | { ok: false; error: string; reason?: 'validation' };
const TABLE = 'course_release_blockers';
const COLUMNS = 'id,module_number,message,browser,device,page_path,severity';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validInput(input: CourseBlockerInput): boolean {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return false;
  const keys = ['reportId', 'moduleNumber', 'message', 'browser', 'device', 'pagePath', 'severity'];
  if (Object.keys(input).some(key => !keys.includes(key))) return false;
  if (!isModuleNumber(input.moduleNumber) || typeof input.reportId !== 'string' || !UUID.test(input.reportId)
    || !validLearnerText(input.message, 4000) || input.message.trim().length < 10
    || !validLearnerText(input.browser, 120) || !input.browser.trim()
    || !validLearnerText(input.device, 120) || !input.device.trim()
    || (input.severity !== 'blocked' && input.severity !== 'problem')) return false;
  // No hosts, account URLs, arbitrary query strings, fragments or unrelated routes.
  // The only allowed query is a module selector matching the reported module.
  return typeof input.pagePath === 'string'
    && (input.pagePath === '/student/course-beta' || input.pagePath === `/student/course-beta?module=${input.moduleNumber}`);
}

function storageFailure(code?: string): CourseBlockerResult {
  return { ok: false, error: ['42P01', '42703', 'PGRST204', 'PGRST205'].includes(code ?? '')
    ? 'Report not confirmed: beta reporting storage is not ready. Ask the team to check course-release migrations 20261030090000 and 20261030091000. Keep this report reference and retry after they check.'
    : 'Report not confirmed. Keep your text and report reference. Retry with the same reference so the team does not receive duplicate tickets.' };
}

/** Separate from surveys: a student may report a blocker before finishing ANY lesson. */
export async function submitCourseBlocker(input: CourseBlockerInput): Promise<CourseBlockerResult> {
  if (!validInput(input)) return { ok: false, reason: 'validation', error: 'Use a beta course page, module 00–14, a problem description of 10–4000 characters, and the displayed browser/device details. No private links or hidden control characters.' };
  try {
    // Checks exact beta flag, verified cookie auth and trusted release enrollment.
    // Never uses legacy support helpers, writable profile roles, or an admin client.
    const { supabase, user } = await requireCourseReleaseAccess('beta');
    const id = input.reportId.toLowerCase();
    const payload = { id, student_id: user.id, release_id: RELEASE_ID, module_number: input.moduleNumber,
      message: input.message, browser: input.browser, device: input.device, page_path: input.pagePath, severity: input.severity };
    const readOwnTicket = () => supabase.from(TABLE).select(COLUMNS)
      .eq('id', id).eq('student_id', user.id).eq('release_id', RELEASE_ID).maybeSingle();
    const confirm = (row: Record<string, unknown> | null): CourseBlockerResult => {
      if (!row) return storageFailure();
      for (const key of ['id', 'module_number', 'message', 'browser', 'device', 'page_path', 'severity'] as const) {
        if (row[key] !== payload[key]) return { ok: false, error: 'This report reference already belongs to a different saved report. Keep the reference and ask the beta team to check it; do not change or overwrite that ticket.' };
      }
      return { ok: true, ticketId: id, status: 'confirmed' };
    };
    const existing = await readOwnTicket();
    if (existing.error) return storageFailure(existing.error.code);
    if (existing.data) return confirm(existing.data);
    const inserted = await supabase.from(TABLE).insert(payload).select('id').single();
    if (inserted.error && inserted.error.code !== '23505') return storageFailure(inserted.error.code);
    // Includes reconciliation of a same-id concurrent retry. A successful insert alone
    // is not the UI's confirmation; read the owner-scoped row back and compare payload.
    const readback = await readOwnTicket();
    if (readback.error) return storageFailure(readback.error.code);
    return confirm(readback.data);
  } catch {
    // Shared helper errors can carry auth/config details. Return only a safe summary.
    return { ok: false, error: 'Report not confirmed. Check that you are signed in to your enrolled beta account and that the beta course is enabled. Keep your report reference; if access or connection is unavailable, ask the team to check and retry with the same reference.' };
  }
}
