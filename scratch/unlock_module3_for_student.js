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

async function unlock() {
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const student = users.find(u => u.email === 'futurefaker01@gmail.com');
  if (!student) {
    console.error('Student futurefaker01@gmail.com not found');
    return;
  }
  const studentId = student.id;
  const moduleId = 'fe87ea18-8042-43e6-9cc3-da9117590809'; // Module 3

  console.log(`Setting up Module 3 node progress for student ${student.email} (${studentId})...`);

  // Insert or upsert node progress for nodes 1, 2, 3, 4
  for (const nodeId of ['1', '2', '3', '4']) {
    const { data, error } = await supabase
      .from('student_node_progress')
      .upsert({
        student_id: studentId,
        module_id: moduleId,
        node_id: nodeId,
        lesson_completed: true,
        activity_completed: true,
        mini_check_passed: true,
        teach_back_status: 'pass',
        node_mastered: true,
        unlocked_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      }, { onConflict: 'student_id,module_id,node_id' })
      .select();

    if (error) {
      console.error(`Error upserting node ${nodeId}:`, error.message);
    } else {
      console.log(`Node ${nodeId} mastered:`, data);
    }
  }

  // Insert passed module quiz
  const { data: quizData, error: quizError } = await supabase
    .from('assessment_submissions')
    .insert({
      student_id: studentId,
      module_id: moduleId,
      node_id: null,
      assessment_type: 'module_quiz',
      submission_payload: {
        q1: 'a',
        q2: 'b',
        q3: 'c',
        q4: 'd',
        q5: 'a',
        q6: 'b'
      },
      score_numeric: 100,
      pass_status: 'pass',
      created_at: new Date().toISOString()
    })
    .select();

  if (quizError) {
    console.error('Error inserting module quiz:', quizError.message);
  } else {
    console.log('Module 3 Quiz recorded as passed (100%):', quizData);
  }
}

unlock().catch(console.error);
