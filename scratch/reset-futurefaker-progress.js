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

  console.log(`Resetting database progress for futurefaker01@gmail.com (${studentId})...`);

  // 1. Delete from student_assessment_profiles
  const { error: err1 } = await supabase
    .from('student_assessment_profiles')
    .delete()
    .eq('student_id', studentId);
  if (err1) console.error('Error deleting assessment profile:', err1.message);
  else console.log('Deleted student_assessment_profiles row.');

  // 2. Delete from student_node_progress
  const { error: err2 } = await supabase
    .from('student_node_progress')
    .delete()
    .eq('student_id', studentId);
  if (err2) console.error('Error deleting node progress:', err2.message);
  else console.log('Deleted student_node_progress rows.');

  // 3. Delete from assessment_submissions
  const { error: err3 } = await supabase
    .from('assessment_submissions')
    .delete()
    .eq('student_id', studentId);
  if (err3) console.error('Error deleting assessment submissions:', err3.message);
  else console.log('Deleted assessment_submissions rows.');

  // 4. Delete from proof_artifact_submissions
  const { error: err4 } = await supabase
    .from('proof_artifact_submissions')
    .delete()
    .eq('student_id', studentId);
  if (err4) console.error('Error deleting proof submissions:', err4.message);
  else console.log('Deleted proof_artifact_submissions rows.');

  console.log('Reset complete.');
}

main();
