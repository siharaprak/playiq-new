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

async function checkTable(tableName, columns = []) {
  try {
    let query = supabase.from(tableName).select(columns.length > 0 ? columns.join(',') : '*').limit(1);
    const { data, error } = await query;
    if (error) {
      console.log(`❌ Table/Columns check failed for "${tableName}" [Columns: ${columns.join(', ') || 'all'}]:`, error.message);
    } else {
      console.log(`✅ Table/Columns exist for "${tableName}" [Columns: ${columns.join(', ') || 'all'}]`);
    }
  } catch (err) {
    console.log(`❌ Exception checking "${tableName}":`, err.message);
  }
}

async function main() {
  console.log("Checking DB schema tables and columns...");
  
  // 1. Profiles columns
  await checkTable('profiles', ['id', 'email', 'role']);
  await checkTable('profiles', ['username', 'username_change_count', 'username_updated_at']);

  // 2. Discussion tables
  await checkTable('discussion_topics');
  await checkTable('discussion_replies');
  await checkTable('discussion_reports');

  // 3. Proof artifacts
  await checkTable('proof_artifacts');

  // 4. Tutor tables
  await checkTable('tutor_profiles');
  await checkTable('tutor_versions');
  await checkTable('knowledge_files');

  // 5. Assistant tables
  await checkTable('assistant_profiles');
  await checkTable('assistant_versions');
  await checkTable('assistant_feedback_signals');
  await checkTable('assistant_usage_logs');
}

main().catch(console.error);
