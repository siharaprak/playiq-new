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
  const userId = 'dd856a53-e732-4008-bcc9-f921ac551693';
  const moduleId = 'a0b94091-62d9-4ac9-8f0a-86c2e3650228';
  
  console.log("Checking all boss battle submissions for user:", userId);

  const { data: submissions, error } = await supabase
    .from('assessment_submissions')
    .select('id, score_numeric, pass_status, created_at')
    .eq('student_id', userId)
    .eq('assessment_type', 'boss_battle');

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Total entries in DB:", submissions.length);
    submissions.forEach((s, idx) => {
      console.log(`[#${idx + 1}] ID: ${s.id}, Score: ${s.score_numeric}, Status: ${s.pass_status}, Created: ${s.created_at}`);
    });
  }
}

main().catch(console.error);
