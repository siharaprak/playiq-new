import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MODULES } from '@/lib/constants';

export async function GET() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const email = 'sienviclientsiharaprak@gmail.com';
  const password = 'playiq_admin_123';
  
  // 0. Clean up any corrupted rows from previous manual SQL tests to stop GoTrue from crashing!
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const corruptUser = existingUsers?.users?.find(u => u.email === email);
  if (corruptUser) {
     await supabase.auth.admin.deleteUser(corruptUser.id);
  }
  
  // Also force raw DB cleanup just in case listUsers misses a fully broken ghost row
  await supabase.rpc('delete_user_by_email', { target_email: email }).catch(() => {});
  // Or just pure SQL equivalent via supabase client if we had setup an RPC...
  // Since we have the service role, let's just make sure the user is deleted via admin API.

  // 1. Fire true GoTrue API to safely hash passwords and manage identities
  const { data: adminData, error: adminErr } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: { full_name: 'Sienvi Admin', role: 'admin' }
  });

  if (adminErr && !adminErr.message.includes('already exists')) {
     return NextResponse.json({ error: 'Admin creation failed', msg: adminErr.message });
  }

  // If it already exists, let's grab the user ID to fix progress
  let userId = adminData?.user?.id;
  
  if (!userId) {
     const { data: existing } = await supabase.auth.admin.listUsers();
     const found = existing.users.find(u => u.email === email);
     if (found) userId = found.id;
  }

  if (userId) {
     // 2. Safely wipe constraints temporarily and inject string-based progress
     // Note: we just inject via standard RPC or API insert
     await supabase.from('student_node_progress').upsert([
        { student_id: userId, module_id: MODULES.MODULE_1_ID, node_id: '1', lesson_completed: true, activity_completed: true, mini_check_passed: true, teach_back_status: 'pass', node_mastered: true },
        { student_id: userId, module_id: MODULES.MODULE_1_ID, node_id: '2', lesson_completed: true, activity_completed: true, mini_check_passed: true, teach_back_status: 'pass', node_mastered: true },
        { student_id: userId, module_id: MODULES.MODULE_1_ID, node_id: '3', lesson_completed: true, activity_completed: true, mini_check_passed: true, teach_back_status: 'pass', node_mastered: true },
        { student_id: userId, module_id: MODULES.MODULE_1_ID, node_id: '4', lesson_completed: true, activity_completed: true, mini_check_passed: true, teach_back_status: 'pass', node_mastered: true }
     ], { onConflict: 'student_id, node_id' });
     
     // Update profiles to force admin role just in case trigger missed it
     await supabase.from('profiles').update({ role: 'admin' }).eq('id', userId);
  }

  return NextResponse.json({
    success: true,
    message: "Admin testing accounts injected via GoTrue successfully.",
    credentials: { email, password }
  });
}
