'use server';

import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
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
  await enforceAdmin();

  const userId = formData.get('userId') as string;
  if (!userId) return;

  // Use service role to delete from auth + cascade will handle profiles/progress
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    console.error('Delete user error:', error);
  }

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function suspendUser(formData: FormData) {
  await enforceAdmin();

  const userId = formData.get('userId') as string;
  if (!userId) return;

  const supabase = await createClient();
  
  // Change their role to 'suspended' — gating logic will bounce them on every page
  await supabase
    .from('profiles')
    .update({ role: 'suspended' })
    .eq('id', userId);

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function restoreUser(formData: FormData) {
  await enforceAdmin();

  const userId = formData.get('userId') as string;
  if (!userId) return;

  const supabase = await createClient();
  await supabase
    .from('profiles')
    .update({ role: 'student' })
    .eq('id', userId);

  revalidatePath('/admin/users');
  redirect('/admin/users');
}
