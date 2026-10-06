'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

async function enforceAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error('Not authorized');
  return user;
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
  
  // Change their status to 'suspended'
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

  // Delete from student_assessment_profiles to reset Module 0
  const { error } = await supabaseAdmin
    .from('student_assessment_profiles')
    .delete()
    .eq('student_id', userId);

  if (error) {
    console.error('Reset Module 0 error:', error);
  }

  revalidatePath('/admin/users');
  revalidatePath('/student/home');
  revalidatePath('/student/assessment');
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

  // 2. Delete student_node_progress (resets all module nodes)
  await supabaseAdmin
    .from('student_node_progress')
    .delete()
    .eq('student_id', userId);

  // 3. Delete assessment_submissions (resets all quizzes and boss battles)
  await supabaseAdmin
    .from('assessment_submissions')
    .delete()
    .eq('student_id', userId);

  // 4. Delete proof_artifact_submissions & proof_artifacts
  await supabaseAdmin
    .from('proof_artifact_submissions')
    .delete()
    .eq('student_id', userId);

  await supabaseAdmin
    .from('proof_artifacts')
    .delete()
    .eq('student_id', userId);

  // 5. Delete tutor and knowledge files
  await supabaseAdmin
    .from('tutor_profiles')
    .delete()
    .eq('student_id', userId);

  await supabaseAdmin
    .from('knowledge_files')
    .delete()
    .eq('student_id', userId);

  revalidatePath('/admin/users');
  revalidatePath('/student/home');
  revalidatePath('/student/assessment');
  redirect('/admin/users');
}

