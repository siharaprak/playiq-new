import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import * as fs from 'fs';
import * as path from 'path';
import Module from 'node:module';

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

// Simple recursive directory walk helper
function walkDir(dir: string, fileList: string[] = []): string[] {
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
  console.log('=== Admin RBAC & Client Security QA ===\n');

  let failed = false;

  // 1. Static Leak Check: Verify that no Client Components import the service role client
  console.log('1. Auditing Client Components for Service Role Key Leakage...');
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
          console.error(`❌ SECURITY LEAK DETECTED in Client Component: ${path.relative(process.cwd(), filePath)}`);
          leakCount++;
          failed = true;
        }
      }
    }

    if (leakCount === 0) {
      console.log('✅ PASSED: No service role key leakage detected in client components.');
    }
  } catch (err) {
    console.error('❌ FAILED: Error auditing files:', err);
    failed = true;
  }

  // 2. Validate DB RBAC Roles Matrix
  console.log('\n2. Testing DB Authorization Matrix (Admin/Teacher/Student/Parent)...');
  try {
    const { supabaseAdmin } = await import('../src/lib/supabase/admin');

    // Fetch user roles to audit
    const { data: userRoles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      throw new Error(`Failed to query user roles: ${rolesError.message}`);
    }

    console.log(`Auditing ${userRoles?.length || 0} user role records...`);

    // Verify student profile roles are locked
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, role');

    if (profilesError) {
      throw new Error(`Failed to query profiles: ${profilesError.message}`);
    }

    let badRolesCount = 0;
    for (const profile of profiles || []) {
      const userRolesForProfile = (userRoles || []).filter((ur) => ur.user_id === profile.id);
      const roles = userRolesForProfile.map((ur) => ur.role);

      // Enforce: If profile.role is student/parent, they must not have admin/teacher in user_roles
      if (profile.role === 'student' || profile.role === 'parent') {
        if (roles.includes('admin') || roles.includes('teacher')) {
          console.error(`❌ ROLE VIOLATION: User ${profile.id} with profile role '${profile.role}' has admin/teacher in user_roles!`);
          badRolesCount++;
          failed = true;
        }
      }
    }

    if (badRolesCount === 0) {
      console.log('✅ PASSED: RBAC profiles-roles mapping aligns with security matrix.');
    }
  } catch (err) {
    console.error('❌ FAILED: RBAC testing error:', err);
    failed = true;
  }

  // 3. Test Action Level Gates on Server Actions
  console.log('\n3. Testing Server Action Role-Gating Security...');
  try {
    const { resolveSupportIssue } = await import('../src/lib/data/admin-support');

    // Test resolveSupportIssue directly with dummy ID (should fail authentication/authorization)
    const result = await resolveSupportIssue('00000000-0000-0000-0000-000000000000');
    if (result.ok) {
      console.error('❌ FAILED: resolveSupportIssue did not reject unauthorized context.');
      failed = true;
    } else {
      console.log(`✅ PASSED: resolveSupportIssue rejected unauthorized context correctly (Reason: ${result.error}).`);
    }
  } catch (err) {
    console.error('❌ FAILED: Server action check crashed:', err);
    failed = true;
  }

  console.log('\n=====================================');
  if (failed) {
    console.error('❌ RBAC Security & Client Audit FAILED.');
    exit(1);
  } else {
    console.log('✅ All Admin RBAC & client leakage checks PASSED.');
    exit(0);
  }
}

main();
