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
  const email = 'teamsienvi-student@student.playiq.dev';

  console.log(`=== Full Reset for ${email} ===`);

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing auth users:', listError.message);
    process.exit(1);
  }

  const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    console.error(`No auth user found with email ${email}`);
    process.exit(1);
  }

  const userId = user.id;
  console.log(`Found Auth User ID: ${userId}`);

  // 1. Reset user metadata
  const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...user.user_metadata,
      has_completed_assessment: false
    }
  });

  if (updateError) {
    console.error('Error updating user metadata:', updateError.message);
  } else {
    console.log('✅ User metadata updated.');
  }

  // 2. Clear all progress and assessment tables for this student
  const studentTables = [
    { table: 'student_node_progress', col: 'student_id' },
    { table: 'student_assessment_profiles', col: 'student_id' },
    { table: 'assessment_submissions', col: 'student_id' },
    { table: 'proof_artifact_submissions', col: 'student_id' },
    { table: 'proof_artifacts', col: 'student_id' },
    { table: 'module_feedback', col: 'user_id' },
    { table: 'feedback_submissions', col: 'user_id' },
    { table: 'tutor_profiles', col: 'student_id' },
    { table: 'knowledge_files', col: 'student_id' },
    { table: 'assistant_profiles', col: 'user_id' },
    { table: 'events_log', col: 'student_id' },
  ];

  for (const { table, col } of studentTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq(col, userId)
        .select();

      if (error) {
        console.log(`ℹ️ Table ${table} (${col}): ${error.message}`);
      } else {
        console.log(`✅ Cleared ${data ? data.length : 0} rows from ${table}`);
      }
    } catch (err) {
      console.log(`⚠️ Exception on table ${table}: ${err.message}`);
    }
  }

  console.log(`\n🎉 Reset completed successfully for ${email} (${userId})!`);
}

main().catch(console.error);
