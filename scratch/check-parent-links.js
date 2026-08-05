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

  // Get parent child links
  const { data: links, error } = await supabase
    .from('parent_child_links')
    .select('parent_id, student_id, relationship_label');

  if (error) {
    console.error('Error fetching links:', error);
    return;
  }

  // Get profiles to map names
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, full_name, role');

  const profileMap = {};
  profiles.forEach(p => {
    profileMap[p.id] = p;
  });

  console.log('Parent-Child Links:');
  links.forEach(l => {
    const parent = profileMap[l.parent_id];
    const student = profileMap[l.student_id];
    console.log(`Parent: ${parent ? parent.email : l.parent_id} (${parent ? parent.full_name : ''})`);
    console.log(`  -> Student: ${student ? student.email : l.student_id} (${student ? student.full_name : ''}) | Relation: ${l.relationship_label}`);
  });
}

main();
