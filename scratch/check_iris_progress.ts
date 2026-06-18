import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const email = 'ivllnv.000@gmail.com';
  console.log(`Checking database state for student: ${email}...`);

  const { data: profile, error: pError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (pError || !profile) {
    console.error('Profile query failed:', pError);
    return;
  }

  const userId = profile.id;
  console.log('User Profile:', profile);

  // 1. Check Node Progress
  const { data: nodeProgress } = await supabase
    .from('student_node_progress')
    .select('*')
    .eq('student_id', userId);
  
  console.log(`\n--- Node Progress (${nodeProgress?.length || 0} rows) ---`);
  nodeProgress?.forEach(np => {
    console.log(`Node ${np.node_id} (Module ${np.module_id}): mastered=${np.node_mastered}, lesson=${np.lesson_completed}, activity=${np.activity_completed}, mini=${np.mini_check_passed}, teach_back=${np.teach_back_status}`);
  });

  // 2. Check Assessment Submissions (Quiz, Boss Battle)
  const { data: assessments } = await supabase
    .from('assessment_submissions')
    .select('*')
    .eq('student_id', userId);

  console.log(`\n--- Assessment Submissions (${assessments?.length || 0} rows) ---`);
  assessments?.forEach(a => {
    console.log(`Type: ${a.assessment_type}, Module: ${a.module_id}, Score: ${a.score_numeric}, Created At: ${a.created_at}`);
  });

  // 3. Check Proof Artifact Submissions
  const { data: artifacts } = await supabase
    .from('proof_artifact_submissions')
    .select('*')
    .eq('student_id', userId);

  console.log(`\n--- Proof Artifact Submissions (${artifacts?.length || 0} rows) ---`);
  artifacts?.forEach(art => {
    console.log(`Type: ${art.artifact_type}, Module: ${art.module_id}, Status: ${art.status}, File: ${art.original_name || 'None'}, Created At: ${art.created_at}`);
  });
}

main().catch(console.error);
