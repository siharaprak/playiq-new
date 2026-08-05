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

  const studentId = '37c74b67-86b6-4dab-abdf-84fd244ab418';

  // Get modules to map
  const { data: modules } = await supabase.from('modules').select('id, order_num');
  const modMap = {};
  modules.forEach(m => {
    modMap[m.order_num] = m.id;
  });
  const m1Id = modMap[1];

  console.log('Querying student_node_progress for student:', studentId);
  const result = await supabase
    .from('student_node_progress')
    .select('*')
    .eq('student_id', studentId)
    .eq('node_id', '1')
    .eq('module_id', m1Id);

  console.log('Result count:', result.data ? result.data.length : 0);
  console.log('Data:', result.data);
  console.log('Error:', result.error);
}

main().catch(console.error);
