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
  
  console.log("Checking boss_battle detail for user:", userId);

  const { data: submissions, error } = await supabase
    .from('assessment_submissions')
    .select('*')
    .eq('student_id', userId)
    .eq('module_id', moduleId)
    .eq('assessment_type', 'boss_battle')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Found " + submissions.length + " Boss Battle submissions:");
    submissions.forEach((s, idx) => {
      console.log(`\n--- Submission #${idx + 1} (${s.id}) ---`);
      console.log(`Created: ${s.created_at}`);
      console.log(`Score: ${s.score_numeric}`);
      console.log(`Pass status: ${s.pass_status}`);
      console.log(`Payload Reflections Keys:`, Object.keys(s.submission_payload?.reflections || {}));
      console.log(`Gemini Feedback:`, s.submission_payload?.geminiFeedback);
    });
  }
}

main().catch(console.error);
