// Diagnostic script: Check Lucas's Module 2 boss battle submissions and progress
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://scdbhpcnqihaswaijptx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZGJocGNucWloYXN3YWlqcHR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg2Njk5NywiZXhwIjoyMDkxNDQyOTk3fQ.mXbhQcLrRUC4oKVcswNdAFBDxJs9ZLsGWsT6MjZ3Jos'
);

async function diagnose() {
  // 1. Find Lucas's profile
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .ilike('full_name', '%lucas%');

  if (!profiles || profiles.length === 0) {
    console.log('No profile found matching "Lucas"');
    return;
  }

  console.log('=== LUCAS PROFILE(S) ===');
  console.log(JSON.stringify(profiles, null, 2));

  for (const profile of profiles) {
    const studentId = profile.id;
    console.log(`\n=== Diagnosing: ${profile.full_name} (${studentId}) ===`);

    // 2. Get Module 2 ID
    const { data: mod } = await supabase
      .from('modules')
      .select('id, title')
      .eq('order_num', 2)
      .single();

    console.log('\n--- Module 2 ---');
    console.log(JSON.stringify(mod, null, 2));

    const moduleId = mod?.id;

    // 3. Check node mastery for Module 2
    const { data: nodeProgress } = await supabase
      .from('student_node_progress')
      .select('node_id, lesson_completed, activity_completed, mini_check_passed, teach_back_status, node_mastered')
      .eq('student_id', studentId)
      .eq('module_id', moduleId);

    console.log('\n--- Module 2 Node Progress ---');
    console.log(`Total nodes with progress: ${nodeProgress?.length || 0}`);
    console.log(`Nodes mastered: ${nodeProgress?.filter(n => n.node_mastered).length || 0} / 6 required`);
    console.log(JSON.stringify(nodeProgress, null, 2));

    // 4. Check ALL assessment submissions for Module 2
    const { data: assessments } = await supabase
      .from('assessment_submissions')
      .select('id, assessment_type, score_numeric, pass_status, created_at')
      .eq('student_id', studentId)
      .eq('module_id', moduleId)
      .order('created_at', { ascending: true });

    console.log('\n--- Module 2 Assessment Submissions ---');
    console.log(JSON.stringify(assessments, null, 2));

    // 5. Specifically check boss_battle submissions
    const bossBattles = assessments?.filter(a => a.assessment_type === 'boss_battle') || [];
    console.log(`\n--- Boss Battle Submissions: ${bossBattles.length} ---`);
    for (const bb of bossBattles) {
      console.log(`  Score: ${bb.score_numeric}, Pass: ${bb.pass_status}, Date: ${bb.created_at}`);
    }

    // 6. Check quiz submissions
    const quizzes = assessments?.filter(a => a.assessment_type === 'module_quiz') || [];
    console.log(`\n--- Quiz Submissions: ${quizzes.length} ---`);
    for (const q of quizzes) {
      console.log(`  Score: ${q.score_numeric}, Pass: ${q.pass_status}, Date: ${q.created_at}`);
    }

    // 7. Check proof artifacts
    const { data: artifacts } = await supabase
      .from('proof_artifact_submissions')
      .select('id, artifact_type, status, submitted_at')
      .eq('student_id', studentId)
      .eq('module_id', moduleId);

    console.log(`\n--- Proof Artifacts: ${artifacts?.length || 0} ---`);
    console.log(JSON.stringify(artifacts, null, 2));

    // 8. Simulate the gating check
    console.log('\n--- GATING DIAGNOSIS ---');
    const quiz = assessments?.find(a => a.assessment_type === 'module_quiz');
    const bossBattle = assessments?.find(a => a.assessment_type === 'boss_battle');

    console.log(`Quiz found: ${!!quiz}, Score: ${quiz?.score_numeric}`);
    console.log(`Quiz gate pass (>=80): ${quiz && quiz.score_numeric >= 80}`);
    console.log(`Boss Battle found: ${!!bossBattle}, Score: ${bossBattle?.score_numeric}`);
    console.log(`Boss Battle gate pass (>=4): ${bossBattle && bossBattle.score_numeric >= 4}`);

    // 9. Check if the gating uses the modules table order_num lookup
    const { data: moduleByOrder } = await supabase
      .from('modules')
      .select('id')
      .eq('order_num', 2)
      .single();

    const gatingModuleId = moduleByOrder?.id;
    console.log(`\nModule ID from constants (MODULES.MODULE_2_ID used in actions): should match`);
    console.log(`Module ID from modules table order_num=2: ${gatingModuleId}`);
    console.log(`Module ID used in actions.ts: ${moduleId}`);
    console.log(`IDs match: ${gatingModuleId === moduleId}`);

    // 10. Gating query exactly as enforceModuleGating does it (boss-battle phase)
    // The gating queries assessment_submissions filtered by the module ID from modules table
    const { data: gatingAssessments } = await supabase
      .from('assessment_submissions')
      .select('*')
      .eq('student_id', studentId)
      .eq('module_id', gatingModuleId)
      .order('created_at', { ascending: false });

    const gatingQuiz = gatingAssessments?.find(a => a.assessment_type === 'module_quiz');
    const gatingBoss = gatingAssessments?.find(a => a.assessment_type === 'boss_battle');

    console.log(`\n--- Gating query results (boss-battle gate) ---`);
    console.log(`Quiz via gating query: score=${gatingQuiz?.score_numeric}, pass_status=${gatingQuiz?.pass_status}`);
    console.log(`Boss via gating query: score=${gatingBoss?.score_numeric}, pass_status=${gatingBoss?.pass_status}`);
    console.log(`Would redirect to /quiz? ${!gatingQuiz || gatingQuiz.score_numeric < 80}`);
    console.log(`Would redirect to /boss-battle (artifact gate)? ${!gatingBoss || gatingBoss.score_numeric < 4}`);
  }
}

diagnose().catch(console.error);
