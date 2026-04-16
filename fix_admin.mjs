import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if(k && v) env[k.trim()] = v.trim().replace(/^"|"$/g, '');
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const email = 'sienviclientsiharaprak@gmail.com';
const password = 'playiq_admin_123';

async function run() {
  console.log("Scanning for corrupted database entries...");
  const { data: users, error: listErr } = await supabase.auth.admin.listUsers();
  
  if (listErr) {
    console.error("Could not list users:", listErr);
    return;
  }

  const existing = users.users.find(u => u.email === email);
  if (existing) {
    console.log("Found ghost user. Nuking ID:", existing.id);
    const { error: delErr } = await supabase.auth.admin.deleteUser(existing.id);
    if (delErr) {
      console.error("Failed to delete ghost user:", delErr);
      return;
    }
  }

  // Double check profiles
  await supabase.from('profiles').delete().eq('email', email);

  console.log("Triggering native GoTrue Creation API for secure hashing...");
  const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'admin', full_name: 'Sienvi Admin' }
  });

  if (createErr) {
    console.error("GoTrue failed to create user:", createErr);
    return;
  }

  const userId = newUser.user.id;
  console.log("User officially established in GoTrue. Injecting Modules...", userId);

  const { error: progErr } = await supabase.from('student_node_progress').upsert([
    { student_id: userId, module_id: 'a0b94091-62d9-4ac9-8f0a-86c2e3650228', node_id: '1', lesson_completed: true, activity_completed: true, mini_check_passed: true, teach_back_status: 'pass', node_mastered: true },
    { student_id: userId, module_id: 'a0b94091-62d9-4ac9-8f0a-86c2e3650228', node_id: '2', lesson_completed: true, activity_completed: true, mini_check_passed: true, teach_back_status: 'pass', node_mastered: true },
    { student_id: userId, module_id: 'a0b94091-62d9-4ac9-8f0a-86c2e3650228', node_id: '3', lesson_completed: true, activity_completed: true, mini_check_passed: true, teach_back_status: 'pass', node_mastered: true },
    { student_id: userId, module_id: 'a0b94091-62d9-4ac9-8f0a-86c2e3650228', node_id: '4', lesson_completed: true, activity_completed: true, mini_check_passed: true, teach_back_status: 'pass', node_mastered: true }
  ], { onConflict: 'student_id, node_id' });

  if (progErr) {
     console.error("Progress injection error:", progErr);
  } else {
     console.log("Full Admin Sandbox successfully created!");
  }
}

run();
