import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { createClient } from '@supabase/supabase-js';

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

async function main() {
  console.log('=== Staging Test Data Reset Utility ===\n');

  const isExecute = process.argv.includes('--execute');
  const playiqEnv = process.env.PLAYIQ_ENV || '';
  const nodeEnv = process.env.NODE_ENV || '';
  const vercelEnv = process.env.VERCEL_ENV || '';
  const confirmReset = process.env.CONFIRM_STAGING_RESET || '';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const allowedProjectRef = process.env.PLAYIQ_ALLOWED_RESET_PROJECT_REF || '';

  // 1. Validate Environment & URL Safety Guards
  if (playiqEnv !== 'staging') {
    console.error(`❌ RESET BLOCKED: PLAYIQ_ENV must be 'staging'. Got: '${playiqEnv}'`);
    exit(1);
    return;
  }

  if (confirmReset !== 'RESET_PLAYIQ_STAGING_TEST_DATA') {
    console.error(`❌ RESET BLOCKED: CONFIRM_STAGING_RESET must be set to 'RESET_PLAYIQ_STAGING_TEST_DATA'.`);
    exit(1);
    return;
  }

  if (nodeEnv === 'production' || vercelEnv === 'production' || playiqEnv === 'production') {
    console.error(`❌ RESET BLOCKED: Production environment detected (NODE_ENV=${nodeEnv}, VERCEL_ENV=${vercelEnv}, PLAYIQ_ENV=${playiqEnv})`);
    exit(1);
    return;
  }

  if (!supabaseServiceKey) {
    console.error(`❌ RESET BLOCKED: SUPABASE_SERVICE_ROLE_KEY is missing.`);
    exit(1);
    return;
  }

  let urlIsAllowed = false;
  let authReason = '';

  if (allowedProjectRef) {
    if (supabaseUrl.includes(allowedProjectRef)) {
      urlIsAllowed = true;
      authReason = `URL matches explicit allowlist PLAYIQ_ALLOWED_RESET_PROJECT_REF: ${allowedProjectRef}`;
    } else {
      urlIsAllowed = false;
      authReason = `URL does not match explicit allowed project reference: ${allowedProjectRef}`;
    }
  } else {
    const isLocal = supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('::1');
    if (isLocal) {
      urlIsAllowed = true;
      authReason = 'URL points to local database (localhost/127.0.0.1)';
    } else {
      urlIsAllowed = false;
      authReason = 'No explicit allowed project reference configured and URL is not localhost (local Supabase)';
    }
  }

  if (!urlIsAllowed) {
    console.error(`❌ RESET BLOCKED: Database URL is unauthorized for staging reset: ${supabaseUrl}`);
    console.error(`Reason: ${authReason}`);
    exit(1);
    return;
  }

  console.log(`Authorized database connection: ${supabaseUrl}`);
  console.log(`Gating Reason: ${authReason}`);
  console.log(`Execution Mode: ${isExecute ? '⚡ EXECUTE MUTATION' : '🔎 DRY-RUN'}\n`);

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // 2. Fetch and identify test profiles using approved test email domains
  const { data: testProfiles, error: profileErr } = await supabaseAdmin
    .from('profiles')
    .select('id, email')
    .or('email.like.%@playiq.test,email.like.%@test.playiq.io');

  if (profileErr) {
    console.error(`❌ Error querying test profiles: ${profileErr.message}`);
    exit(1);
    return;
  }

  const testProfileIds = (testProfiles || []).map(p => p.id);
  console.log(`Identified ${testProfileIds.length} test profiles under approved domains.`);

  // Safe table list in dependency order
  const tables = [
    { name: 'events_log', idCol: 'student_id' },
    { name: 'assessment_submissions', idCol: 'student_id' },
    { name: 'proof_artifact_submissions', idCol: 'student_id' },
    { name: 'tutor_versions', idCol: 'student_id' },
    { name: 'tutor_profiles', idCol: 'student_id' },
    { name: 'assistant_versions', idCol: 'student_id' },
    { name: 'assistant_profiles', idCol: 'student_id' },
    { name: 'discussion_replies', idCol: 'author_id' },
    { name: 'discussion_topics', idCol: 'author_id' },
    { name: 'parent_child_links', idCol: 'student_id' }, // note: student or parent links, we filter student
    { name: 'student_node_progress', idCol: 'student_id' },
    { name: 'enrollments', idCol: 'student_id' },
    { name: 'profiles', idCol: 'id' }
  ];

  // 3. Process each table
  for (const table of tables) {
    if (testProfileIds.length === 0) {
      console.log(`Table ${table.name}: 0 scoped rows [Filter: ${table.idCol} in testProfileIds] [${isExecute ? 'EXECUTE' : 'DRY-RUN'}]`);
      continue;
    }

    // A. Query scoped row count
    const { count: scopedCount, error: countErr } = await supabaseAdmin
      .from(table.name)
      .select('*', { count: 'exact', head: true })
      .in(table.idCol, testProfileIds);

    if (countErr) {
      console.error(`❌ Error querying table ${table.name}: ${countErr.message}`);
      continue;
    }

    const rowCount = scopedCount || 0;

    // B. Safety Check: Never delete all rows from any table
    const { count: totalCount, error: totalErr } = await supabaseAdmin
      .from(table.name)
      .select('*', { count: 'exact', head: true });

    if (totalErr) {
      console.error(`❌ Error querying total rows for ${table.name}: ${totalErr.message}`);
      continue;
    }

    const totalRows = totalCount || 0;

    console.log(`Table ${table.name}: scoped count = ${rowCount}, total count = ${totalRows}, filter = [${table.idCol} in testProfileIds], mode = [${isExecute ? 'EXECUTE' : 'DRY-RUN'}]`);

    if (totalRows > 0 && totalRows === rowCount) {
      console.warn(`⚠️ SAFETY GATES TRIGGERED: Skipping delete for ${table.name} because scoped delete matches 100% of the table rows.`);
      continue;
    }

    // C. Execute deletion if requested and rows exist
    if (isExecute && rowCount > 0) {
      const { error: deleteErr } = await supabaseAdmin
        .from(table.name)
        .delete()
        .in(table.idCol, testProfileIds);

      if (deleteErr) {
        console.error(`❌ Failed to delete from ${table.name}: ${deleteErr.message}`);
      } else {
        console.log(`✅ Deleted ${rowCount} rows from ${table.name}.`);
      }
    }
  }

  // 4. Clean storage objects under student id prefixes only
  console.log('\n--- Auditing Storage Objects under Test Student Prefixes ---');
  for (const studentId of testProfileIds) {
    try {
      const { data: files } = await supabaseAdmin
        .storage
        .from('proof-artifacts')
        .list(`student/${studentId}`);

      if (files && files.length > 0) {
        const fileNames = files.map(f => `student/${studentId}/${f.name}`);
        console.log(`Storage: student/${studentId}/ - Found ${files.length} objects [${isExecute ? 'EXECUTE' : 'DRY-RUN'}]`);
        
        if (isExecute) {
          const { error: removeErr } = await supabaseAdmin
            .storage
            .from('proof-artifacts')
            .remove(fileNames);
          if (removeErr) {
            console.error(`❌ Storage deletion error for student ${studentId}: ${removeErr.message}`);
          } else {
            console.log(`✅ Deleted ${files.length} storage objects for student ${studentId}.`);
          }
        }
      } else {
        console.log(`Storage: student/${studentId}/ - 0 objects`);
      }
    } catch (e: any) {
      console.warn(`⚠️ Storage list warning for student ${studentId}: ${e.message}`);
    }
  }

  console.log('\n=== Reset Operations Complete ===');
  exit(0);
}

main();
