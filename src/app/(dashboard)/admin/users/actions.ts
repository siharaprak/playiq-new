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
  await enforceAdmin();

  const userId = formData.get('userId') as string;
  if (!userId) return;

  // 1. Delete from audit_events first (since it has a foreign key to profiles without cascade)
  const { error: auditError } = await supabaseAdmin
    .from('audit_events')
    .delete()
    .eq('actor_user_id', userId);

  if (auditError) {
    console.error('Delete audit events error:', auditError);
  }

  // 2. Delete from profiles table (this deletes associated child records via CASCADE)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (profileError) {
    console.error('Delete profile error:', profileError);
  }

  // 3. Delete from auth.users (ignore user_not_found errors for mock profiles)
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (authError) {
    console.error('Delete auth user error (ignored for mock profiles):', authError);
  }

  revalidatePath('/admin/users');
  redirect('/admin/users');
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
