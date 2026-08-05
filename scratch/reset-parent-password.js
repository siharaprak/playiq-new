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

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }

  const user = users.find(u => u.email === 'jimboyaquino12@gmail.com');
  if (!user) {
    console.log(`User not found: jimboyaquino12@gmail.com`);
    return;
  }

  console.log(`Resetting jimboyaquino12@gmail.com's password to 12345678...`);
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password: '12345678'
  });

  if (updateError) {
    console.error(`Error updating user:`, updateError.message);
  } else {
    console.log(`Successfully updated password to 12345678.`);
  }
}

main();
