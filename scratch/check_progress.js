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
  
  console.log("Checking student_node_progress for user:", userId, "and module:", moduleId);
  
  const { data: progress, error } = await supabase
    .from('student_node_progress')
    .select('*')
    .eq('student_id', userId)
    .eq('module_id', moduleId);
    
  if (error) {
    console.error("Error reading progress:", error.message);
  } else {
    console.log("Student progress entries (total count = " + progress.length + "):");
    progress.forEach(p => {
      console.log(`- Node ${p.node_id}: mastered=${p.node_mastered}, updated_at=${p.updated_at}`);
    });
  }

  // Also check attempts / assessment submissions if any
  const { data: submissions, error: subErr } = await supabase
    .from('assessment_submissions')
    .select('*')
    .eq('student_id', userId)
    .eq('module_id', moduleId);

  if (subErr) {
    console.error("Error reading submissions:", subErr.message);
  } else {
    console.log("\nAssessment Submissions:");
    submissions.forEach(s => {
      console.log(`- Submission ID: ${s.id}, type=${s.assessment_type}, score=${s.score}, passed=${s.passed}`);
    });
  }
}

main().catch(console.error);
