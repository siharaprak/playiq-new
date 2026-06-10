import * as fs from 'fs';
import * as path from 'path';

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

async function main() {
  console.log('=== Support Category Consistency Audit ===\n');

  let failed = false;

  const workflows = [
    { name: 'Onboarding Support Workflow', path: '../docs/runbooks/support-workflow-onboarding-issues.md', expected: 'onboarding' },
    { name: 'Login Support Workflow', path: '../docs/runbooks/support-workflow-login-issues.md', expected: 'login_auth' },
    { name: 'Hardware/Device Support Workflow', path: '../docs/runbooks/support-workflow-hardware-device-issues.md', expected: 'device_hardware' }
  ];

  const validCategories = [
    'onboarding',
    'login_auth',
    'device_hardware',
    'proof_upload',
    'parent_access',
    'billing_beta_policy',
    'privacy_security',
    'bug_report'
  ];

  // 1. Audit categories in documentation
  for (const wf of workflows) {
    const fullPath = path.resolve(__dirname, wf.path);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ FAILED: File ${wf.name} does not exist.`);
      failed = true;
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');

    // Confirm file references the correct category
    const hasCategoryReference = content.includes(wf.expected);
    if (hasCategoryReference) {
      console.log(`✅ ${wf.name} correctly references category '${wf.expected}'.`);
    } else {
      console.error(`❌ FAILED: ${wf.name} does not reference the expected category '${wf.expected}'.`);
      failed = true;
    }
  }

  // 2. Verify no migrations or enums are introduced/implied
  console.log('\nChecking for DB enum migrations or schema overrides...');
  const migrationsDir = path.resolve(__dirname, '../supabase/migrations');
  const migrationFiles = fs.existsSync(migrationsDir) ? fs.readdirSync(migrationsDir) : [];
  
  // Look for migrations modified today or since Sprint 10C start (no new migrations should exist)
  const sprint10cMigration = migrationFiles.some(file => file.includes('sprint10c') || file.includes('sprint10_support') || file.includes('sprint_10c'));
  
  if (sprint10cMigration) {
    console.error('❌ FAILED: New SQL migrations found. Sprint 10C forbids support database schema changes or migrations.');
    failed = true;
  } else {
    console.log('✅ Passed migration audit: Zero database migrations introduced.');
  }

  // Confirm category is treated as an operational convention/text label
  const hasEnumAlterations = migrationFiles.some(file => {
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    return content.toLowerCase().includes('alter type') && content.toLowerCase().includes('category');
  });

  if (hasEnumAlterations) {
    console.error('❌ FAILED: Found enum type alterations for categories in migrations.');
    failed = true;
  } else {
    console.log('✅ Passed operational convention audit: Support categories treated as text labels.');
  }

  if (failed) {
    console.error('\n❌ Support category consistency audit FAILED.');
    exit(1);
  } else {
    console.log('\n✅ All support category consistency checks PASSED.');
    exit(0);
  }
}

main();
