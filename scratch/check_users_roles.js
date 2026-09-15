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
    env[match[1]] = value.trim();
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('List users error:', error);
    return;
  }
  const student = users.find(u => u.email === 'futurefaker01@gmail.com');
  const admin = users.find(u => u.email === 'jimboyaquino12@gmail.com');
  console.log('Student:', student ? student.id : 'not found');
  console.log('Admin:', admin ? admin.id : 'not found');

  if (student) {
    const { data: studentRoles } = await supabase.from('user_roles').select('*').eq('user_id', student.id);
    console.log('Student roles:', studentRoles);
    const { data: studentProgress } = await supabase.from('student_node_progress').select('*').eq('student_id', student.id);
    console.log('Student node progress count:', studentProgress ? studentProgress.length : 0);
    const { data: studentAssessments } = await supabase.from('assessment_submissions').select('*').eq('student_id', student.id);
    console.log('Student assessments count:', studentAssessments ? studentAssessments.length : 0);
  }
  if (admin) {
    const { data: adminRoles } = await supabase.from('user_roles').select('*').eq('user_id', admin.id);
    console.log('Admin roles:', adminRoles);
  }
}

check().catch(console.error);
