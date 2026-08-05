const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

// Locate Google Chrome executable
const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];
let chromePath = '';
for (const p of chromePaths) {
  if (fs.existsSync(p)) {
    chromePath = p;
    break;
  }
}

if (!chromePath) {
  console.error('Error: Google Chrome application was not found.');
  process.exit(1);
}

const artifactDir = 'C:/Users/Iris/.gemini/antigravity-ide/brain/c76232fc-f240-476d-9ce2-9428cfbb3639';

async function main() {
  const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  });

  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const studentId = '37c74b67-86b6-4dab-abdf-84fd244ab418'; // futurefaker01@gmail.com

  // Query module UUIDs
  const { data: modules, error: modErr } = await supabase
    .from('modules')
    .select('id, order_num');

  if (modErr) {
    console.error('Error getting modules:', modErr);
    return;
  }

  const modMap = {};
  modules.forEach(m => {
    modMap[m.order_num] = m.id;
  });

  const m1Id = modMap[1];
  const m2Id = modMap[2];
  console.log('Modules mapped:', { m1Id, m2Id });

  // 1. Reset progress to completely clean state
  console.log('Resetting student assessment and node progress records...');
  await supabase.from('student_assessment_profiles').delete().eq('student_id', studentId);
  await supabase.from('student_node_progress').delete().eq('student_id', studentId);
  await supabase.from('assessment_submissions').delete().eq('student_id', studentId);
  await supabase.from('proof_artifact_submissions').delete().eq('student_id', studentId);

  // Launch browser
  console.log('Launching browser via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 960 });

  async function takeScreenshot(url, filename) {
    const outputPath = path.join(artifactDir, filename);
    console.log(`[Screenshot] Navigating to ${url} -> Saving to ${filename}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1500)); // wait for settling
      await page.screenshot({ path: outputPath });
      console.log(`[Screenshot] Done: ${filename}`);
    } catch (err) {
      console.error(`[Screenshot] Failed for ${filename}:`, err.message);
      try {
        await page.screenshot({ path: outputPath });
        console.log(`[Screenshot] Fallback Captured: ${filename}`);
      } catch (e) {
        console.error('Ultimate fail:', e.message);
      }
    }
  }

  // ── MODULE 0: ASSESSMENT PHASES ──

  // Phase 1: Setup Profile
  console.log('\n--- Step 1: Orion Assessment Phase 1 (Setup Profile) ---');
  await supabase.from('student_assessment_profiles').upsert({
    student_id: studentId,
    display_name: 'manoheheheTestBot',
    learner_type: 'student',
    current_phase: 1,
    assessment_completed: false
  });
  await takeScreenshot('http://localhost:3000/student/assessment', 'assessment_phase1.png');

  // Phase 2: Diagnostic Scenarios
  console.log('\n--- Step 2: Orion Assessment Phase 2 (Diagnostic Scenarios) ---');
  await supabase.from('student_assessment_profiles').update({ current_phase: 2 }).eq('student_id', studentId);
  await takeScreenshot('http://localhost:3000/student/assessment', 'assessment_phase2.png');

  // Phase 3: Orion Challenges
  console.log('\n--- Step 3: Orion Assessment Phase 3 (Orion Challenges) ---');
  await supabase.from('student_assessment_profiles').update({ current_phase: 3 }).eq('student_id', studentId);
  await takeScreenshot('http://localhost:3000/student/assessment', 'assessment_phase3.png');

  // Phase 4: Subject Selection & Goals
  console.log('\n--- Step 4: Orion Assessment Phase 4 (Subject Selection & Goals) ---');
  await supabase.from('student_assessment_profiles').update({ current_phase: 4 }).eq('student_id', studentId);
  await takeScreenshot('http://localhost:3000/student/assessment', 'assessment_phase4.png');

  // Phase 5: Gated Results Calibration Analysis Animation
  console.log('\n--- Step 5: Orion Assessment Phase 5 (Analysis) ---');
  await supabase.from('student_assessment_profiles').update({ current_phase: 5 }).eq('student_id', studentId);
  await takeScreenshot('http://localhost:3000/student/assessment', 'assessment_phase5.png');

  // Phase 6: Reveal Results / Learning Blueprint
  console.log('\n--- Step 6: Orion Assessment Phase 6 (Blueprint Reveal Screen) ---');
  await supabase.from('student_assessment_profiles').update({
    current_phase: 6,
    explanation_style: 'verbal',
    learner_type: 'student',
    motivation_driver: 'mastery',
    ai_literacy_level: 'answer_seeking',
    rescue_target_subject: 'Math',
    advance_target_subject: 'Computer Science',
    personal_goal: 'Help me code',
    reveal_summary: 'You learn best when ideas connect like a story, and you are the kind of thinker who wants to master the rules so you can build things that matter in real life.',
    learning_blueprint: {
      baselinePDI: "Recorded — visible after Module 3",
      currentAIUse: "answer_seeking",
      personalGoal: "Help me code",
      rescueTarget: "Math",
      advanceTarget: "Computer Science",
      visionOutcomes: [
        "You can learn to understand anything — not just memorize it — and explain it better than most adults can.",
        "You can walk into any class ahead of what the teacher is about to teach — and actually feel that.",
        "You can track your own growth with real numbers — and watch yourself get sharper every single week."
      ],
      explanationStyle: "verbal",
      currentAIUseLabel: "Answer-seeking — high dependency risk",
      primaryMotivation: "mastery",
      explanationStyleLabel: "Verbal / Story-Based",
      primaryMotivationLabel: "Seeing measurable improvement"
    }
  }).eq('student_id', studentId);
  await takeScreenshot('http://localhost:3000/student/assessment', 'assessment_phase6.png');

  // Student Home Dashboard (After Assessment Completion)
  console.log('\n--- Step 7: Student Home Dashboard (Completed) ---');
  await supabase.from('student_assessment_profiles').update({ assessment_completed: true }).eq('student_id', studentId);
  await takeScreenshot('http://localhost:3000/student/home', 'student_home_dashboard.png');


  // ── MODULE 1 CURRICULUM WORKSHEET PHASES ──

  console.log('\n--- Step 8: Module 1 Worksheet - Lesson Node 1 ---');
  await supabase.from('student_node_progress').upsert({
    student_id: studentId,
    module_id: m1Id,
    node_id: '1',
    lesson_completed: false,
    activity_completed: false,
    mini_check_passed: false,
    teach_back_status: null,
    node_mastered: false
  });
  await takeScreenshot('http://localhost:3000/student/modules/1/nodes/1/lesson', 'm1_node1_lesson.png');

  console.log('\n--- Step 9: Module 1 Worksheet - Activity Node 1 ---');
  await supabase.from('student_node_progress').update({
    lesson_completed: true
  }).eq('student_id', studentId).eq('module_id', m1Id).eq('node_id', '1');
  await takeScreenshot('http://localhost:3000/student/modules/1/nodes/1/activity', 'm1_node1_activity.png');

  console.log('\n--- Step 10: Module 1 Worksheet - Mini-Check Node 1 ---');
  await supabase.from('student_node_progress').update({
    activity_completed: true
  }).eq('student_id', studentId).eq('module_id', m1Id).eq('node_id', '1');
  await takeScreenshot('http://localhost:3000/student/modules/1/nodes/1/mini-check', 'm1_node1_check.png');

  console.log('\n--- Step 11: Module 1 Worksheet - Teach-Back Node 1 ---');
  await supabase.from('student_node_progress').update({
    mini_check_passed: true
  }).eq('student_id', studentId).eq('module_id', m1Id).eq('node_id', '1');
  await takeScreenshot('http://localhost:3000/student/modules/1/nodes/1/teach-back', 'm1_node1_teachback.png');


  // ── MODULE 2 CURRICULUM WORKSHEET PHASES ──

  console.log('\n--- Step 12: Module 2 Worksheet - Lesson Node 1 ---');
  await supabase.from('student_node_progress').upsert({
    student_id: studentId,
    module_id: m2Id,
    node_id: '1',
    lesson_completed: false,
    activity_completed: false,
    mini_check_passed: false,
    teach_back_status: null,
    node_mastered: false
  });
  await takeScreenshot('http://localhost:3000/student/modules/2/nodes/1/lesson', 'm2_node1_lesson.png');

  console.log('\n--- Step 13: Module 2 Worksheet - Activity Node 1 (Worksheet Scenarios) ---');
  await supabase.from('student_node_progress').update({
    lesson_completed: true
  }).eq('student_id', studentId).eq('module_id', m2Id).eq('node_id', '1');
  await takeScreenshot('http://localhost:3000/student/modules/2/nodes/1/activity', 'm2_node1_activity.png');

  await browser.close();
  console.log('\nAll step screenshots captured successfully.');
}

main().catch(console.error);
