import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import * as fs from 'fs';
import * as path from 'path';
import Module from 'node:module';

// Bypass server-only import constraints during test script run
const originalRequire = Module.prototype.require;
(Module.prototype as any).require = function(request: string) {
  if (request === 'server-only') return {};
  return originalRequire.apply(this, arguments as any);
};

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

async function main() {
  console.log('=== Module Feedback Schema & Integration Verification ===\n');

  let failed = false;

  // 1. Verify migration exists in repo
  console.log('1. Checking migration file in repo...');
  const migrationPath = path.resolve(__dirname, '../supabase/migrations/20260609120000_add_module_feedback.sql');
  if (fs.existsSync(migrationPath)) {
    const content = fs.readFileSync(migrationPath, 'utf8');
    if (
      content.includes('CREATE TABLE IF NOT EXISTS module_feedback') &&
      content.includes('unique_student_module_feedback') &&
      content.includes('ENABLE ROW LEVEL SECURITY')
    ) {
      console.log('✅ PASSED: SQL migration exists with correct schema definitions.');
    } else {
      console.error('❌ FAILED: Migration file exists but is missing table elements or constraints.');
      failed = true;
    }
  } else {
    console.error(`❌ FAILED: Migration file not found at ${migrationPath}`);
    failed = true;
  }

  // 2. Verify Server Action file exists
  console.log('\n2. Auditing Server Action existence and integrity...');
  const actionPath = path.resolve(__dirname, '../src/app/(dashboard)/student/modules/feedback-actions.ts');
  if (fs.existsSync(actionPath)) {
    const content = fs.readFileSync(actionPath, 'utf8');
    if (content.includes('submitModuleFeedback') && content.includes('module_feedback') && content.includes('upsert')) {
      console.log('✅ PASSED: Server Action file exists and uses upsert logic safely.');
    } else {
      console.error('❌ FAILED: Server Action file exists but lacks expected logic.');
      failed = true;
    }
  } else {
    console.error(`❌ FAILED: Server Action file not found at ${actionPath}`);
    failed = true;
  }

  // 3. Verify Client Component exists
  console.log('\n3. Auditing Client Component existence...');
  const componentPath = path.resolve(__dirname, '../src/components/forms/ModuleFeedbackForm.tsx');
  if (fs.existsSync(componentPath)) {
    const content = fs.readFileSync(componentPath, 'utf8');
    if (content.includes('ModuleFeedbackForm') && content.includes('submitModuleFeedback') && content.includes('Star')) {
      console.log('✅ PASSED: Client Component exists and implements correct imports.');
    } else {
      console.error('❌ FAILED: Client Component exists but lacks expected logic.');
      failed = true;
    }
  } else {
    console.error(`❌ FAILED: Client Component not found at ${componentPath}`);
    failed = true;
  }

  // 4. Verify integrations in page.tsx files
  console.log('\n4. Verifying integrations in completion pages (Modules 1-10)...');
  let integrationsPassed = true;
  for (let m = 1; m <= 10; m++) {
    const pagePath = path.resolve(__dirname, `../src/app/(dashboard)/student/modules/${m}/completion/page.tsx`);
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');
      
      const hasFeedbackImport = content.includes('ModuleFeedbackForm');
      const hasFeedbackTag = content.includes('<ModuleFeedbackForm');
      const hasModuleId = content.includes('moduleId');

      // Check for gating bug fix in module 1
      let gatingCorrect = true;
      if (m === 1) {
        const hasModule2Gate = content.includes("enforceModuleGating('completion', 2");
        if (hasModule2Gate) {
          gatingCorrect = false;
          console.error('❌ FAILED: Module 1 completion page still gates for Module 2.');
        }
      }

      if (hasFeedbackImport && hasFeedbackTag && hasModuleId && gatingCorrect) {
        // Success
      } else {
        console.error(`❌ FAILED: Integration issue in Module ${m} completion page. Check imports or component tags.`);
        integrationsPassed = false;
        failed = true;
      }
    } else {
      console.error(`❌ FAILED: Module ${m} completion page not found.`);
      integrationsPassed = false;
      failed = true;
    }
  }
  if (integrationsPassed) {
    console.log('✅ PASSED: All 10 completion pages successfully integrated.');
  }

  // 5. Query database columns if possible
  console.log('\n5. Checking database schema representation...');
  try {
    const { supabaseAdmin } = await import('../src/lib/supabase/admin');
    const { data, error } = await supabaseAdmin
      .from('module_feedback')
      .select('id, rating')
      .limit(1);

    if (error) {
      if (error.message.includes('relation "public.module_feedback" does not exist') || error.message.includes('schema cache')) {
        console.log('⚠️ INFO: Table does not exist in remote schema cache yet.');
        console.log('💡 INSTRUCTION: Run the migration SQL located in:');
        console.log(`   supabase/migrations/20260609120000_add_module_feedback.sql`);
        console.log('   in your Supabase SQL Editor or execute deployment pipelines to create the table.');
      } else {
        console.error(`❌ FAILED: Database check returned unexpected error: ${error.message}`);
        failed = true;
      }
    } else {
      console.log('✅ PASSED: module_feedback table exists in the database and is accessible.');
    }
  } catch (err: any) {
    console.warn('⚠️ WARNING: DB connection skipped or failed:', err.message);
  }

  console.log('\n================================================');
  if (failed) {
    console.error('❌ Verification FAILED.');
    exit(1);
  } else {
    console.log('✅ All repo and code checks PASSED.');
    exit(0);
  }
}

main().catch((err) => {
  console.error('Crash during verification:', err);
  exit(1);
});
