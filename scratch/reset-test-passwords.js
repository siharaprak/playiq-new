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

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars');
    return;
  }

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const targets = [
    { email: 'futurefaker01@gmail.com', label: 'Mano Jr Aquino' },
    { email: 'test_student@student.playiq.dev', label: 'Test Student' },
    { email: 'cheeneebmacalino@gmail.com', label: 'Cheenee' }
  ];

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }

  for (const target of targets) {
    const user = users.find(u => u.email === target.email);
    if (!user) {
      console.log(`User not found: ${target.email}`);
      continue;
    }

    console.log(`Found user ${target.email} with ID ${user.id}. Resetting password to Password123!...`);
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: 'Password123!'
    });

    if (updateError) {
      console.error(`Error updating user ${target.email}:`, updateError.message);
    } else {
      console.log(`Successfully updated password for ${target.email}.`);
    }
  }
}

main();
