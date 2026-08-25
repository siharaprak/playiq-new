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
    env[match[1]] = value;
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function testInvite() {
  // Use Gmail alias so it lands in ivllnv.000@gmail.com inbox but triggers the fresh invite flow
  const targetEmail = 'ivllnv.000+betatest@gmail.com';

  console.log(`Sending fresh invite to ${targetEmail} (delivers to ivllnv.000@gmail.com)...`);
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(targetEmail, {
    data: {
      full_name: 'Mystique (Test)',
      role: 'parent'
    },
    redirectTo: 'https://weplayiq.com/parent/home'
  });

  if (error) {
    console.error('Invite error:', error);
  } else {
    console.log('Invite successfully dispatched!', data);
  }
}

testInvite();
