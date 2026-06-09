'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitModuleFeedback(moduleId: string, rating: number, feedbackText: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Not authenticated' };
    }

    if (rating < 1 || rating > 5) {
      return { error: 'Rating must be between 1 and 5' };
    }

    // Upsert the feedback record (unique constraint is on student_id and module_id)
    const { error } = await supabase
      .from('module_feedback')
      .upsert(
        {
          student_id: user.id,
          module_id: moduleId,
          rating,
          feedback_text: feedbackText,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'student_id,module_id' }
      );

    if (error) {
      console.error('Database error submitting module feedback:', error);
      return { error: 'Failed to save feedback: ' + error.message };
    }

    revalidatePath('/student/modules', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('Server Action crash during module feedback:', err);
    return { error: 'Server error: ' + err.message };
  }
}
