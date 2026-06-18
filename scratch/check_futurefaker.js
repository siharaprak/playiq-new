import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  // Find profile
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'futurefaker01@gmail.com');

  if (pErr) {
    console.error('Error fetching profile:', pErr.message);
    return;
  }

  if (!profiles || profiles.length === 0) {
    console.log('No profile found for futurefaker01@gmail.com');
    return;
  }

  const profile = profiles[0];
  console.log('Found profile:', profile);

  // Fetch modules to map UUID to order_num
  const { data: modules } = await supabase
    .from('modules')
    .select('id, title, order_num');

  const modNameMap = {};
  modules?.forEach(m => {
    modNameMap[m.id] = `Module ${m.order_num}: ${m.title}`;
  });

  // Fetch student_node_progress
  const { data: progress, error: progErr } = await supabase
    .from('student_node_progress')
    .select('*')
    .eq('student_id', profile.id)
    .order('module_id');

  if (progErr) {
    console.error('Error fetching progress:', progErr.message);
  } else {
    console.log(`\nProgress entries (${progress.length}):`);
    progress.forEach(p => {
      console.log(`- ${modNameMap[p.module_id] || p.module_id} | Node ${p.node_id} | lesson_comp=${p.lesson_completed} | act_comp=${p.activity_completed} | mini_passed=${p.mini_check_passed} | teach_back=${p.teach_back_status} | mastered=${p.node_mastered}`);
    });
  }
}

main().catch(console.error);
