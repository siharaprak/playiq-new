'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  COURSE_15_MODULES,
  getCourseModuleNodeKey,
  getDbModuleIdForCourseModule,
} from '@/lib/constants';
import { RELEASE_ID } from '@/lib/course-release/learning-record';

async function enforceAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error('Not authorized');
  return user;
}

async function resetCourseModuleInternal(userId: string, moduleNum: number) {
  if (moduleNum === 0) {
    await supabaseAdmin
      .from('student_assessment_profiles')
      .delete()
      .eq('student_id', userId);

    try {
      await supabaseAdmin
        .from('course_release_learning_records')
        .delete()
        .eq('student_id', userId)
        .eq('module_number', 0);
    } catch {
      // Non-fatal if table is absent in an older test DB
    }
    return;
  }

  if (moduleNum < 1 || moduleNum > 14) return;
  const dbModuleId = getDbModuleIdForCourseModule(moduleNum);

  // 1. Delete isolated node progress rows for this exact course module
  if (moduleNum >= 10) {
    await supabaseAdmin
      .from('student_node_progress')
      .delete()
      .eq('student_id', userId)
      .eq('module_id', dbModuleId)
      .like('node_id', `m${moduleNum}-%`);
  } else {
    await supabaseAdmin
      .from('student_node_progress')
      .delete()
      .eq('student_id', userId)
      .eq('module_id', dbModuleId);
  }

  // 2. Delete learning record for this exact module_number
  try {
    await supabaseAdmin
      .from('course_release_learning_records')
      .delete()
      .eq('student_id', userId)
      .eq('module_number', moduleNum);
  } catch {
    // Non-fatal if table is absent
  }

  // 3. Delete quizzes / boss battles belonging only to this courseModuleNumber
  const { data: rawAssessments } = await supabaseAdmin
    .from('assessment_submissions')
    .select('id, submission_payload')
    .eq('student_id', userId)
    .eq('module_id', dbModuleId);

  const assessmentIdsToDelete = (rawAssessments || [])
    .filter((row: any) => {
      const payloadNum = row.submission_payload?.courseModuleNumber;
      if (moduleNum >= 10) return Number(payloadNum) === moduleNum;
      return payloadNum === undefined || Number(payloadNum) === moduleNum;
    })
    .map((row: any) => row.id);

  if (assessmentIdsToDelete.length > 0) {
    await supabaseAdmin
      .from('assessment_submissions')
      .delete()
      .in('id', assessmentIdsToDelete);
  }

  // 4. Delete proof artifact submissions belonging only to this courseModuleNumber
  const { data: rawArtifacts } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('id, content_payload')
    .eq('student_id', userId)
    .eq('module_id', dbModuleId);

  const artifactIdsToDelete = (rawArtifacts || [])
    .filter((row: any) => {
      const payloadNum = row.content_payload?.courseModuleNumber;
      if (moduleNum >= 10) return Number(payloadNum) === moduleNum;
      return payloadNum === undefined || Number(payloadNum) === moduleNum;
    })
    .map((row: any) => row.id);

  if (artifactIdsToDelete.length > 0) {
    await supabaseAdmin
      .from('proof_artifact_submissions')
      .delete()
      .in('id', artifactIdsToDelete);
  }
}

async function markCourseModuleCompleteInternal(userId: string, moduleNum: number) {
  const now = new Date().toISOString();

  if (moduleNum === 0) {
    await supabaseAdmin
      .from('student_assessment_profiles')
      .upsert(
        {
          student_id: userId,
          assessment_completed: true,
          assessment_completed_at: now,
        },
        { onConflict: 'student_id' },
      );
    return;
  }

  const modMeta = COURSE_15_MODULES.find((m) => m.num === moduleNum);
  if (!modMeta) return;

  const rows = Array.from({ length: modMeta.totalNodes }, (_, idx) => ({
    student_id: userId,
    module_id: modMeta.dbModuleId,
    node_id: getCourseModuleNodeKey(moduleNum, String(idx + 1)),
    lesson_completed: true,
    activity_completed: true,
    mini_check_passed: true,
    teach_back_status: 'pass',
    node_mastered: true,
    completed_at: now,
  }));

  await supabaseAdmin
    .from('student_node_progress')
    .upsert(rows, { onConflict: 'student_id,module_id,node_id' });

  if (moduleNum >= 13) {
    try {
      const { data: existingRecord } = await supabaseAdmin
        .from('course_release_learning_records')
        .select('answers, include_in_tutor')
        .eq('student_id', userId)
        .eq('release_id', RELEASE_ID)
        .eq('shell', 'beta')
        .eq('module_number', moduleNum)
        .maybeSingle();

      await supabaseAdmin.from('course_release_learning_records').upsert(
        {
          student_id: userId,
          release_id: RELEASE_ID,
          shell: 'beta',
          module_number: moduleNum,
          answers: existingRecord?.answers ?? {},
          include_in_tutor: Boolean(existingRecord?.include_in_tutor),
          completed: true,
          updated_at: now,
        },
        { onConflict: 'student_id,release_id,shell,module_number' },
      );
    } catch {
      // Non-fatal if table is absent
    }
  }
}

export async function deleteUser(formData: FormData) {
  const admin = await enforceAdmin();

  const userId = formData.get('userId') as string;
  if (!userId) return;

  // Privacy remediation (Phase 2): deletions must go through the tracked workflow,
  // which deletes uploaded files and all records, not just the profile.
  const { openDeletionRequest } = await import('@/lib/privacy/deletion');
  let requestId: string;
  try {
    requestId = await openDeletionRequest({
      subject: userId,
      requesterEmail: admin.email || 'admin',
      requesterRelationship: 'admin_initiated',
      notes: 'Opened from the Student Roster delete button',
      createdBy: admin.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not open deletion request';
    redirect(`/admin/privacy?error=${encodeURIComponent(message)}`);
  }

  revalidatePath('/admin/privacy');
  redirect(`/admin/privacy?focus=${requestId}&msg=${encodeURIComponent('Deletion request opened. Complete the steps below.')}`);
}

export async function suspendUser(formData: FormData) {
  await enforceAdmin();

  const userId = formData.get('userId') as string;
  if (!userId) return;

  await supabaseAdmin
    .from('profiles')
    .update({ status: 'suspended' })
    .eq('id', userId);

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function restoreUser(formData: FormData) {
  await enforceAdmin();

  const userId = formData.get('userId') as string;
  if (!userId) return;

  await supabaseAdmin
    .from('profiles')
    .update({ status: 'active' })
    .eq('id', userId);

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function updateLearningLevel(formData: FormData) {
  await enforceAdmin();

  const userId = formData.get('userId') as string;
  const learningLevel = formData.get('learningLevel') as string;
  if (!userId || !learningLevel) return;

  await supabaseAdmin
    .from('profiles')
    .update({ learning_level: learningLevel })
    .eq('id', userId);

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function resetModule0(formData: FormData) {
  await enforceAdmin();

  const userId = formData.get('userId') as string;
  if (!userId) return;

  await resetCourseModuleInternal(userId, 0);

  revalidatePath('/admin/users');
  revalidatePath('/student/home');
  revalidatePath('/student/assessment');
  redirect('/admin/users');
}

export async function resetSingleModule(formData: FormData) {
  await enforceAdmin();

  const userId = formData.get('userId') as string;
  const moduleNum = Number(formData.get('moduleNum'));
  if (!userId || !Number.isInteger(moduleNum) || moduleNum < 0 || moduleNum > 14) return;

  await resetCourseModuleInternal(userId, moduleNum);

  revalidatePath('/admin/users');
  revalidatePath('/student/home');
  if (moduleNum === 0) {
    revalidatePath('/student/assessment');
  } else {
    revalidatePath(`/student/modules/${moduleNum}/overview`);
  }
  redirect('/admin/users');
}

export async function adjustStudentModuleProgress(formData: FormData) {
  await enforceAdmin();

  const userId = formData.get('userId') as string;
  const moduleNum = Number(formData.get('moduleNum'));
  const adjustment = (formData.get('adjustment') as string) || 'unlock_to';

  if (!userId || !Number.isInteger(moduleNum) || moduleNum < 0 || moduleNum > 14) return;

  if (adjustment === 'reset_module') {
    await resetCourseModuleInternal(userId, moduleNum);
  } else if (adjustment === 'complete_module') {
    await markCourseModuleCompleteInternal(userId, moduleNum);
  } else if (adjustment === 'unlock_to') {
    // Ensure Module 0 and all prerequisite modules 1..(moduleNum - 1) are completed
    if (moduleNum >= 1) {
      await markCourseModuleCompleteInternal(userId, 0);
      for (let m = 1; m < moduleNum; m++) {
        await markCourseModuleCompleteInternal(userId, m);
      }
    }
  }

  revalidatePath('/admin/users');
  revalidatePath('/student/home');
  revalidatePath('/student/assessment');
  if (moduleNum >= 1) {
    revalidatePath(`/student/modules/${moduleNum}/overview`);
  }
  redirect('/admin/users');
}

export async function resetStudentProgress(formData: FormData) {
  await enforceAdmin();

  const userId = formData.get('userId') as string;
  if (!userId) return;

  // 1. Delete student_assessment_profiles (resets Module 0)
  await supabaseAdmin
    .from('student_assessment_profiles')
    .delete()
    .eq('student_id', userId);

  // 2. Delete student_node_progress (resets all module nodes across M01–M14)
  await supabaseAdmin
    .from('student_node_progress')
    .delete()
    .eq('student_id', userId);

  // 3. Delete course_release_learning_records (resets M00–M14 learning records & M13/M14 completion)
  try {
    await supabaseAdmin
      .from('course_release_learning_records')
      .delete()
      .eq('student_id', userId);
  } catch {
    // Non-fatal if table is absent
  }

  // 4. Delete assessment_submissions (resets all quizzes and boss battles)
  await supabaseAdmin
    .from('assessment_submissions')
    .delete()
    .eq('student_id', userId);

  // 5. Delete proof_artifact_submissions & proof_artifacts
  await supabaseAdmin
    .from('proof_artifact_submissions')
    .delete()
    .eq('student_id', userId);

  await supabaseAdmin
    .from('proof_artifacts')
    .delete()
    .eq('student_id', userId);

  // 6. Delete tutor, assistant, and knowledge files
  await supabaseAdmin
    .from('tutor_profiles')
    .delete()
    .eq('student_id', userId);

  try {
    await supabaseAdmin
      .from('assistant_profiles')
      .delete()
      .eq('student_id', userId);
  } catch {
    // Non-fatal if table is absent
  }

  await supabaseAdmin
    .from('knowledge_files')
    .delete()
    .eq('student_id', userId);

  revalidatePath('/admin/users');
  revalidatePath('/student/home');
  revalidatePath('/student/assessment');
  redirect('/admin/users');
}
