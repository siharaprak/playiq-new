const fs = require('fs');
const path = require('path');

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

  // 1. Get module IDs
  const { data: modules } = await supabase.from('modules').select('id, order_num');
  const modMap = {};
  modules.forEach(m => {
    modMap[m.order_num] = m.id;
  });
  const m1Id = modMap[1];
  const m2Id = modMap[2];

  console.log('Preparing student progress state...');

  // 2. Clear old state
  await supabase.from('student_assessment_profiles').delete().eq('student_id', studentId);
  await supabase.from('student_node_progress').delete().eq('student_id', studentId);

  // 3. Upsert completed assessment profile
  const { error: profileErr } = await supabase.from('student_assessment_profiles').insert({
    student_id: studentId,
    display_name: 'Mano Jr',
    grade_level: 'middle',
    assessment_completed: true,
    learning_blueprint: {
      baselinePDI: 'Recorded — visible after Module 3',
      currentAIUse: 'explanation_seeking',
      personalGoal: 'Help me build awesome AI tools',
      rescueTarget: 'Math',
      advanceTarget: 'Computer Science',
      visionOutcomes: [
        'You can build your own AI tools.',
        'You can think like an entrepreneur.',
        'You can learn to understand anything.'
      ],
      explanationStyle: 'analytical',
      currentAIUseLabel: 'Explanation-seeking — healthy curiosity',
      primaryMotivation: 'purpose',
      explanationStyleLabel: 'Analytical / Step-by-Step',
      primaryMotivationLabel: 'Building real-world skills'
    }
  });
  if (profileErr) console.error('Error inserting profile:', profileErr.message);
  else console.log('Successfully set assessment_completed = true');

  // 4. Unlock Module 1 Node 1
  const { error: m1Err } = await supabase.from('student_node_progress').insert({
    student_id: studentId,
    module_id: m1Id,
    node_id: '1',
    lesson_completed: false,
    activity_completed: false,
    mini_check_passed: false,
    teach_back_status: null,
    node_mastered: false
  });
  if (m1Err) console.error('Error unlocking Module 1 Node 1:', m1Err.message);
  else console.log('Successfully unlocked Module 1 Node 1');

  // 5. Unlock Module 2 Node 1
  const { error: m2Err } = await supabase.from('student_node_progress').insert({
    student_id: studentId,
    module_id: m2Id,
    node_id: '1',
    lesson_completed: false,
    activity_completed: false,
    mini_check_passed: false,
    teach_back_status: null,
    node_mastered: false
  });
  if (m2Err) console.error('Error unlocking Module 2 Node 1:', m2Err.message);
  else console.log('Successfully unlocked Module 2 Node 1');

  console.log('Preparation complete.');
}

main().catch(console.error);
