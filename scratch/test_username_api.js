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
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const userId = 'dd856a53-e732-4008-bcc9-f921ac551693';
  console.log("Testing username availability function in DB for user:", userId);

  // Check if columns exist
  const { data: profileCols, error: colsErr } = await supabase
    .from('profiles')
    .select('id, username, username_change_count')
    .eq('id', userId)
    .single();

  if (colsErr) {
    console.error("Columns error:", colsErr.message);
  } else {
    console.log("Profile username columns fetched successfully:", profileCols);
  }

  // Check checkBlockedTerms/moderation logic
  const testUsernames = ['iris', 'admin', 'moderator', 'iris_villanueva', 'test_user'];
  for (const username of testUsernames) {
    // Check if available
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', username)
      .neq('id', userId)
      .limit(1);
    console.log(`Checking DB availability for "${username}":`, !existing || existing.length === 0 ? "Available" : "Taken");
  }
}

main().catch(console.error);
