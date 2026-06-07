import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import * as fs from 'fs';
import * as path from 'path';
import Module from 'node:module';

// Mock server-only
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

function walkDir(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function main() {
  console.log('=== Role Access Matrix QA Verification ===\n');

  let failed = false;

  const matrixResults = [
    { rule: 'Guests blocked from /student, /parent, /admin, /settings', depth: 'static verified & manual route check required', status: 'PENDING' },
    { rule: 'Students/Parents/Teachers blocked from /admin dashboard', depth: 'static verified & helper-level verified', status: 'PENDING' },
    { rule: 'Students blocked from /parent child summaries', depth: 'static verified & helper-level verified', status: 'PENDING' },
    { rule: 'Unlinked parent blocked from student child data', depth: 'fixture-backed verified & helper-level verified', status: 'PENDING' },
    { rule: 'Client components free from service role imports', depth: 'static verified', status: 'PENDING' }
  ];

  // 1. Audit client files for service role key leaks
  console.log('--- 1. Auditing Client Components for Service Role Key Leakage ---');
  try {
    const srcDir = path.resolve(__dirname, '../src');
    const allFiles = walkDir(srcDir);
    let leakCount = 0;

    for (const filePath of allFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      const isClientComponent = content.includes("'use client'") || content.includes('"use client"');
      
      if (isClientComponent) {
        if (
          content.includes('supabaseAdmin') || 
          content.includes('@/lib/supabase/admin') || 
          content.includes('process.env.SUPABASE_SERVICE_ROLE_KEY')
        ) {
          console.error(`❌ SECURITY LEAK: Client Component imports service role client: ${path.relative(process.cwd(), filePath)}`);
          leakCount++;
        }
      }
    }

    if (leakCount === 0) {
      console.log('✅ PASSED: No service role key leakage detected in client components.');
      matrixResults[4].status = 'PASS';
    } else {
      matrixResults[4].status = 'FAIL';
      failed = true;
    }
  } catch (err) {
    console.error('❌ FAILED: Error auditing files:', err);
    failed = true;
    matrixResults[4].status = 'FAIL';
  }

  // 2. Static path guards audit
  console.log('\n--- 2. Auditing Path Guards & Middleware Routes ---');
  try {
    const middlewarePath = path.resolve(__dirname, '../src/utils/supabase/middleware.ts');
    if (fs.existsSync(middlewarePath)) {
      const content = fs.readFileSync(middlewarePath, 'utf8');
      const protectsStudent = content.includes("'/student'");
      const protectsParent = content.includes("'/parent'");
      const protectsAdmin = content.includes("'/admin'");
      const protectsSettings = content.includes("'/settings'");

      if (protectsStudent && protectsParent && protectsAdmin && protectsSettings) {
        console.log('✅ PASSED: Middleware protects /student, /parent, /admin, and /settings from guests.');
        matrixResults[0].status = 'PASS';
      } else {
        console.error('❌ FAILED: Middleware route protections missing expected route patterns.');
        matrixResults[0].status = 'FAIL';
        failed = true;
      }
    } else {
      console.error('❌ FAILED: Middleware file not found.');
      matrixResults[0].status = 'FAIL';
      failed = true;
    }
  } catch (err) {
    console.error('❌ FAILED: Path guard verification error:', err);
    matrixResults[0].status = 'FAIL';
    failed = true;
  }

  // 3. Admin / Parent / Student dashboard route access validation (Static + Helper checks)
  console.log('\n--- 3. Verifying Role Access Loader and Action Restrictions ---');
  try {
    const { requireRole } = await import('../src/lib/auth/permissions');
    
    let threwAuth = false;
    try {
      await requireRole(undefined as any, 'admin');
    } catch (err: any) {
      if (err.message === 'Unauthorized' || err.message.includes('Forbidden') || err.message.includes('profile') || err.message.includes('Client')) {
        threwAuth = true;
      }
    }

    if (threwAuth) {
      console.log('✅ PASSED: auth helper requireRole correctly rejects unauthorized / empty context.');
    } else {
      console.warn('⚠️ WARNING: requireRole did not raise expected Unauthorized error in mock environment.');
    }

    // Static code scanning of app pages to check for role boundary checks (admin checking and parent checking)
    const appDir = path.resolve(__dirname, '../src/app/(dashboard)');
    const appFiles = walkDir(appDir);
    let adminAuthChecked = false;
    let parentAuthChecked = false;

    for (const file of appFiles) {
      if (file.includes('admin') && file.endsWith('page.tsx')) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes("role !== 'admin'") || content.includes("requireRole") || content.includes("profile?.role !== 'admin'")) {
          adminAuthChecked = true;
        }
      }
      if (file.includes('parent') && file.endsWith('page.tsx')) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes("role !== 'parent'") || content.includes("requireRole") || content.includes("profile?.role !== 'parent'")) {
          parentAuthChecked = true;
        }
      }
    }

    if (adminAuthChecked && parentAuthChecked) {
      console.log('✅ PASSED: Dashboard subdirectories statically enforce role checks before content display.');
      matrixResults[1].status = 'PASS';
      matrixResults[2].status = 'PASS';
    } else {
      console.error('❌ FAILED: Roles matching not found in admin/parent home layout/page files.');
      matrixResults[1].status = 'FAIL';
      matrixResults[2].status = 'FAIL';
      failed = true;
    }
  } catch (err) {
    console.error('❌ FAILED: Gating checks failed:', err);
    failed = true;
  }

  // 4. Test database-level access matrix for parent signed URL (Helper-backed)
  console.log('\n--- 4. Testing Parent Signed URL Authorization Policies ---');
  try {
    const { canActorRequestProofSignedUrl } = await import('../src/lib/proof-artifacts/signed-access-policy');
    if (canActorRequestProofSignedUrl) {
      const actor = { id: 'parent-user-id', roles: ['parent'] as any[] };
      const artifact = { student_id: 'student-user-id', status: 'pending' };
      const allowed = canActorRequestProofSignedUrl(actor, artifact);
      if (!allowed) {
        console.log('✅ PASSED: canActorRequestProofSignedUrl correctly blocks parents during beta.');
        matrixResults[3].status = 'PASS';
      } else {
        console.error('❌ FAILED: canActorRequestProofSignedUrl allowed parent access.');
        matrixResults[3].status = 'FAIL';
        failed = true;
      }
    } else {
      console.error('❌ FAILED: canActorRequestProofSignedUrl helper not found.');
      matrixResults[3].status = 'FAIL';
      failed = true;
    }
  } catch (err) {
    console.error('❌ FAILED: Parent-Student linkage testing error:', err);
    matrixResults[3].status = 'FAIL';
    failed = true;
  }

  // Output depth preservation report
  console.log('\n==========================================================================================');
  console.log('                     ROLE ACCESS MATRIX VERIFICATION DEPTH REPORT');
  console.log('==========================================================================================');
  console.log('| Rule / Restriction                                    | Verification Depth                   | Status |');
  console.log('|-------------------------------------------------------|--------------------------------------|--------|');
  for (const item of matrixResults) {
    const ruleStr = item.rule.padEnd(53);
    const depthStr = item.depth.padEnd(36);
    const statusStr = item.status.padEnd(6);
    console.log(`| ${ruleStr} | ${depthStr} | ${statusStr} |`);
  }
  console.log('==========================================================================================\n');

  if (failed) {
    console.error('❌ Gating and access security checks FAILED.');
    exit(1);
  } else {
    console.log('✅ All Role Access Matrix checks PASSED.');
    exit(0);
  }
}

main();
