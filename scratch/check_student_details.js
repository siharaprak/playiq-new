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
  const studentId = '37c74b67-86b6-4dab-abdf-84fd244ab418';
  const { data: progress } = await supabase
    .from('student_node_progress')
    .select('*')
    .eq('student_id', studentId);
  console.log('Node Progress:', JSON.stringify(progress, null, 2));

  const { data: assessments } = await supabase
    .from('assessment_submissions')
    .select('*')
    .eq('student_id', studentId);
  console.log('Assessments:', JSON.stringify(assessments, null, 2));
}

check().catch(console.error);
