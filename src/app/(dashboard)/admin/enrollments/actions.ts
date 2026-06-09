'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * Manually enrolls a student into a course by resolving their email and selecting the course.
 */
export async function manuallyEnrollStudent(
  studentEmail: string,
  courseId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // 1. Verify user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return { ok: false, error: 'Not authorized. Admin privileges required.' };
    }

    // 2. Resolve student
    const { data: student, error: studentError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', studentEmail.trim().toLowerCase())
      .single();

    if (studentError || !student) {
      return { ok: false, error: `Student with email '${studentEmail}' not found.` };
    }

    // 3. Check if enrollment already exists
    const { data: existing } = await supabaseAdmin
      .from('enrollments')
      .select('id')
      .eq('student_id', student.id)
      .eq('course_id', courseId)
      .maybeSingle();

    if (existing) {
      return { ok: false, error: 'This student is already enrolled in this course.' };
    }

    // 4. Create enrollment
    const { error: insertError } = await supabaseAdmin
      .from('enrollments')
      .insert({
        student_id: student.id,
        course_id: courseId,
        status: 'active',
      });

    if (insertError) {
      return { ok: false, error: `Failed to create enrollment: ${insertError.message}` };
    }

    revalidatePath('/admin/enrollments');
    return { ok: true, data: undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { ok: false, error: message };
  }
}

/**
 * Suspends a student's enrollment manually.
 */
export async function suspendEnrollment(enrollmentId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // Verify admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { ok: false, error: 'Not authorized' };

    const { error } = await supabaseAdmin
      .from('enrollments')
      .update({ status: 'suspended' })
      .eq('id', enrollmentId);

    if (error) return { ok: false, error: error.message };

    revalidatePath('/admin/enrollments');
    return { ok: true, data: undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { ok: false, error: message };
  }
}

/**
 * Reactivates a suspended enrollment manually.
 */
export async function reactivateEnrollment(enrollmentId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // Verify admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { ok: false, error: 'Not authorized' };

    const { error } = await supabaseAdmin
      .from('enrollments')
      .update({ status: 'active' })
      .eq('id', enrollmentId);

    if (error) return { ok: false, error: error.message };

    revalidatePath('/admin/enrollments');
    return { ok: true, data: undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { ok: false, error: message };
  }
}

export async function suspendEnrollmentFormAction(formData: FormData) {
  const enrollmentId = formData.get('enrollmentId') as string;
  if (enrollmentId) {
    await suspendEnrollment(enrollmentId);
  }
}

export async function reactivateEnrollmentFormAction(formData: FormData) {
  const enrollmentId = formData.get('enrollmentId') as string;
  if (enrollmentId) {
    await reactivateEnrollment(enrollmentId);
  }
}
