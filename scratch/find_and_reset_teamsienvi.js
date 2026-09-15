const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
  const envPaths = [
    path.join(__dirname, '../.env.local'),
    path.join(__dirname, '../.env')
  ];
  const env = {};
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          if (!env[match[1]]) env[match[1]] = value.trim();
        }
      });
    }
  }
  return env;
}

async function main() {
  const env = loadEnv();
  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Service Role Key in env');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('=== Searching for teamsienvi users ===');
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing auth users:', listError.message);
    process.exit(1);
  }

  const { data: profiles, error: profListError } = await supabase.from('profiles').select('*');
  if (profListError) {
    console.error('Error listing profiles:', profListError.message);
  }

  console.log('\n--- ALL AUTH USERS ---');
  users.forEach(u => {
    console.log(`ID: ${u.id} | Email: ${u.email} | Created: ${u.created_at} | Meta:`, u.user_metadata);
  });

  console.log('\n--- ALL PROFILES ---');
  (profiles || []).forEach(p => {
    console.log(`ID: ${p.id} | Username: ${p.username} | FullName: ${p.full_name} | Role: ${p.role}`);
  });
}

main().catch(console.error);
