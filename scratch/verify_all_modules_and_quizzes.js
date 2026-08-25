const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value.trim();
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function testAll() {
  console.log('🧪 =========================================================');
  console.log('   PLAYIQ FULL SYSTEM & CURRICULUM VERIFICATION SUITE');
  console.log('=========================================================\n');

  let totalTests = 0;
  let passedTests = 0;

  function assert(name, condition, details = '') {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passedTests++;
    } else {
      console.log(`  ❌ [FAIL] ${name} ${details ? `(${details})` : ''}`);
    }
  }

  // 1. MODULE DATA INTEGRITY (Modules 1-10)
  console.log('📁 1. Verifying Module Content Files & Node Structures...');
  for (let m = 1; m <= 10; m++) {
    const filePath = path.join(__dirname, `../src/data/module${m}Content.ts`);
    assert(`Module ${m} content file exists`, fs.existsSync(filePath));
    const content = fs.readFileSync(filePath, 'utf8');

    // Check exports
    assert(`Module ${m} exports module${m}Nodes`, content.includes(`module${m}Nodes`));

    // Check required fields
    assert(`Module ${m} has title, bigIdea, sections, activity, miniCheck, teachBack`, 
      content.includes('bigIdea') && 
      content.includes('sections') && 
      content.includes('activity') && 
      content.includes('miniCheck') && 
      content.includes('teachBack')
    );
  }

  // 2. LESSON RENDERER USAGE (Modules 1-10)
  console.log('\n🎨 2. Verifying LessonContentRenderer in all Lesson Pages...');
  for (let m = 1; m <= 10; m++) {
    const pagePath = path.join(__dirname, `../src/app/(dashboard)/student/modules/${m}/nodes/[nodeId]/lesson/page.tsx`);
    if (fs.existsSync(pagePath)) {
      const pageCode = fs.readFileSync(pagePath, 'utf8');
      assert(`Module ${m} uses LessonContentRenderer`, pageCode.includes('LessonContentRenderer'));
    }
  }

  // 3. DATABASE MODULES & QUIZZES
  console.log('\n🗄️ 3. Verifying Database Modules & Quizzes in Supabase...');
  const { data: dbModules, error: modErr } = await supabase
    .from('modules')
    .select('id, title, order_num')
    .order('order_num');

  if (modErr) {
    assert('Fetch DB modules', false, modErr.message);
  } else {
    assert(`DB has ${dbModules.length} registered modules`, dbModules.length >= 10);
    console.log(`     Found ${dbModules.length} modules in database:`);
    dbModules.forEach(m => console.log(`     - Module ${m.order_num}: ${m.title} (${m.id})`));
  }

  // Check assessment submissions table schema
  const { data: assessData, error: assessErr } = await supabase
    .from('assessment_submissions')
    .select('id, module_id, score_numeric, assessment_type')
    .limit(1);
  assert('assessment_submissions table is queryable', !assessErr);

  // Check student node progress table
  const { data: progData, error: progErr } = await supabase
    .from('student_node_progress')
    .select('id, student_id, module_id, node_id, node_mastered')
    .limit(1);
  assert('student_node_progress table is queryable', !progErr);

  // 4. RESET STUDENT STATE CHECK
  console.log('\n👤 4. Verifying futurefaker01@gmail.com Fresh State...');
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'futurefaker01@gmail.com')
    .single();

  assert('futurefaker profile exists', !!profile);
  assert('futurefaker role is student', profile?.role === 'student');

  const { data: studentProgress } = await supabase
    .from('student_node_progress')
    .select('*')
    .eq('student_id', profile?.id);
  assert('futurefaker has 0 progress rows (clean start)', (studentProgress?.length || 0) === 0);

  const { data: assessProfiles } = await supabase
    .from('student_assessment_profiles')
    .select('*')
    .eq('student_id', profile?.id);
  assert('futurefaker has 0 assessment profile rows (Module 0 active)', (assessProfiles?.length || 0) === 0);

  // 5. SUMMARY
  console.log('\n=========================================================');
  console.log(`📊 FINAL RESULT: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('=========================================================\n');
}

testAll().catch(console.error);
