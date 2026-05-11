'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitFeedbackRequest(message: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (!message || message.trim().length === 0) {
      return { success: false, error: 'Message cannot be empty' };
    }

    const { error } = await supabase
      .from('feedback_requests')
      .insert({
        student_id: user.id,
        message: message.trim()
      });

    if (error) {
      console.error('Error inserting feedback:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/student/home');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Internal server error' };
  }
}
