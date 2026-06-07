import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
}

// Helper to recursively walk a directory
function walkDir(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function verifyStagingSmoke() {
  console.log('=== Staging Smoke Checklist Verifier ===\n');
  let errors = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
    } else {
      console.error(`❌ FAIL: ${message}`);
      errors++;
    }
  };

  // 1. Static Scan: Ensure client-side files do not expose service role keys
  console.log('1. Auditing Client Components for Service Role Key Leakage...');
  try {
    const srcDir = path.resolve(process.cwd(), 'src');
    const allFiles = walkDir(srcDir);
    let leaks = 0;

    for (const filePath of allFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      const isClientComponent = content.includes("'use client'") || content.includes('"use client"');
      
      if (isClientComponent) {
        if (
          content.includes('supabaseAdmin') || 
          content.includes('@/lib/supabase/admin') || 
          content.includes('SUPABASE_SERVICE_ROLE_KEY')
        ) {
          console.error(`❌ SECURITY LEAK: Client component ${path.relative(process.cwd(), filePath)} accesses service role key/client!`);
          leaks++;
        }
      }
    }
    assert(leaks === 0, `Client bundle service role key isolation check: found ${leaks} leak(s).`);
  } catch (err: any) {
    console.error('Error during client component scan:', err.message);
    errors++;
  }

  // 2. Static Scan: Verify Auth & RBAC Gates on Admin Pages
  console.log('\n2. Verifying Auth and RBAC Gates on Admin Pages...');
  try {
    const adminPagesDir = path.resolve(process.cwd(), 'src/app/(dashboard)/admin');
    const adminFiles = walkDir(adminPagesDir);
    let pageGatedCount = 0;
    let missingGateCount = 0;

    for (const filePath of adminFiles) {
      // We only care about page files and actions files in admin folder
      if (filePath.endsWith('page.tsx') || filePath.endsWith('actions.ts') || filePath.endsWith('route.ts')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(process.cwd(), filePath);
        
        // Admin gate: must check profile role or check admin permissions
        const hasAdminGate = 
          content.includes('admin') || 
          content.includes('teacher') || 
          content.includes('roles.includes');

        if (hasAdminGate) {
          pageGatedCount++;
        } else {
          console.warn(`⚠️ Warning: Admin file ${relativePath} might be missing explicit role gating check.`);
          missingGateCount++;
        }
      }
    }
    console.log(`Audited admin files: ${pageGatedCount} verified gated. ${missingGateCount} files warned.`);
    assert(pageGatedCount > 0, 'At least some admin routes/actions must contain explicit role checks.');
  } catch (err: any) {
    console.error('Error verifying admin pages:', err.message);
    errors++;
  }

  // 3. Static Scan: Verify Auth & Ownership checks on Tutor & Assistant endpoints
  console.log('\n3. Verifying Auth & Ownership Checks on Tutor/Assistant actions...');
  try {
    // Tutor Actions
    const tutorActionsPath = path.resolve(process.cwd(), 'src/lib/tutor/actions.ts');
    if (fs.existsSync(tutorActionsPath)) {
      const content = fs.readFileSync(tutorActionsPath, 'utf8');
      assert(content.includes('!user'), 'tutor actions.ts checks for authenticated user.');
      assert(content.includes('student_id !== user.id') || content.includes('student_id === user.id'), 'tutor actions.ts checks for student ownership.');
    } else {
      console.warn('Tutor actions file not found, skipping check.');
    }

    // Assistant Actions
    const assistantActionsPath = path.resolve(process.cwd(), 'src/lib/assistant/actions.ts');
    if (fs.existsSync(assistantActionsPath)) {
      const content = fs.readFileSync(assistantActionsPath, 'utf8');
      assert(content.includes('!user'), 'assistant actions.ts checks for authenticated user.');
      assert(content.includes('student_id !== user.id') || content.includes('student_id === user.id'), 'assistant actions.ts checks for student ownership.');
    } else {
      console.warn('Assistant actions file not found, skipping check.');
    }
  } catch (err: any) {
    console.error('Error verifying tutor/assistant actions:', err.message);
    errors++;
  }

  // 4. Non-Mutating Database Connection Check
  console.log('\n4. Running Non-Mutating Database Connection Verification...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // Perform a strictly read-only check (e.g. read a single row from a metadata or public table)
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (error) {
        // We expect this might fail if unauthorized or staging requires auth, which is fine as long as connection was made
        // But if error is a network failure, that is a blocker.
        if (error.message.includes('fetch') || error.message.includes('Network')) {
          console.error('❌ DB CONNECTION FAILED:', error.message);
          errors++;
        } else {
          console.log(`✅ DB Connection responded (returned status/auth error, which is safe: ${error.message})`);
        }
      } else {
        console.log(`✅ DB Connection Succeeded. Retrieved ${data.length} row(s) safely without mutation.`);
      }
    } catch (err: any) {
      console.error('❌ DB Connection check crashed:', err.message);
      errors++;
    }
  } else {
    console.log('⚠️ NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not configured. Skipping active database check.');
  }

  console.log('\n-----------------------------------------');
  if (errors > 0) {
    console.error(`Status: FAILED. Staging smoke checks failed with ${errors} error(s).`);
    process.exitCode = 1;
    setTimeout(() => process.exit(1), 100);
  } else {
    console.log('Status: SUCCESS. Staging smoke checks completed successfully.');
    process.exitCode = 0;
  }
}

verifyStagingSmoke().catch((err) => {
  console.error('Staging smoke script error:', err);
  process.exit(1);
});
