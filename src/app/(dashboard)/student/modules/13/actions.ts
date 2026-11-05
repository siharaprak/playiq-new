'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';

export async function completeModule13PreviewAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const now = new Date().toISOString();

  await supabase.from('student_node_progress').upsert(
    {
      student_id: user.id,
      module_id: MODULES.CAPSTONE_ID,
      node_id: 'm13-1',
      lesson_completed: true,
      activity_completed: true,
      mini_check_passed: true,
      teach_back_status: 'pass',
      node_mastered: true,
      completed_at: now,
    },
    { onConflict: 'student_id,module_id,node_id' },
  );

  await supabase.from('course_release_learning_records').upsert(
    {
      student_id: user.id,
      module_number: 13,
      module_slug: 'module-13',
      completed: true,
      updated_at: now,
    },
    { onConflict: 'student_id,module_number' },
  );

  revalidatePath('/student/home');
  revalidatePath('/student/modules/13/overview');
  redirect('/student/modules/13/completion');
}

