// Apply migration using the Supabase service role key via pg_query endpoint
// This uses the PostgREST /rpc endpoint to execute raw SQL

const https = require('https');

const SUPABASE_HOST = 'scdbhpcnqihaswaijptx.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZGJocGNucWloYXN3YWlqcHR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg2Njk5NywiZXhwIjoyMDkxNDQyOTk3fQ.mXbhQcLrRUC4oKVcswNdAFBDxJs9ZLsGWsT6MjZ3Jos';
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD || '';

// Construct the connection string using the pooler
const connectionString = `postgresql://postgres.scdbhpcnqihaswaijptx:${DB_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;

async function runSQL(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });

    const options = {
      hostname: SUPABASE_HOST,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=minimal',
        'Content-Length': Buffer.byteLength(body),
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  // Step 1: Create the table  
  console.log('Step 1: Creating table via REST API...');

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS student_assessment_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      display_name TEXT, grade_level TEXT, learner_type TEXT,
      explanation_style TEXT, pacing_preference TEXT, challenge_response TEXT,
      ai_literacy_level TEXT, motivation_driver TEXT,
      baseline_task1_answer TEXT, baseline_task1_correct BOOLEAN,
      baseline_task2_response TEXT, baseline_task2_score INTEGER,
      baseline_task3_response TEXT, baseline_task3_score INTEGER,
      baseline_pdi_snapshot JSONB,
      rescue_target_subject TEXT, advance_target_subject TEXT, personal_goal TEXT,
      reveal_summary TEXT, learning_blueprint JSONB,
      assessment_completed BOOLEAN NOT NULL DEFAULT false,
      assessment_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      assessment_completed_at TIMESTAMPTZ,
      current_phase INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT student_assessment_profiles_student_id_key UNIQUE (student_id)
    );
  `;

  const result = await runSQL(createTableSQL);
  console.log('RPC result:', result.status, result.body.substring(0, 200));

  if (result.status === 404) {
    console.log('\nexec_sql RPC not found. Will use Supabase Edge Function approach...');
    
    // Alternative: Create an edge function that creates the table
    // For now, let's try the /sql endpoint available on paid plans
    
    // Last resort: Create the table via a server action triggered from the browser
    console.log('\n=== Alternative: Apply via psql or Supabase Dashboard ===');
    console.log('URL: https://supabase.com/dashboard/project/scdbhpcnqihaswaijptx/sql/new');
    console.log('\nOr use npx supabase db push if CLI is linked.');
  } else {
    console.log('Table creation result:', result.status);
  }
}

main().catch(console.error);
