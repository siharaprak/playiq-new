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
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Extract imports from a file content
function getImportedPaths(content: string, filePath: string): string[] {
  const imports: string[] = [];
  const lines = content.split('\n');
  const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;

  for (const line of lines) {
    let match;
    while ((match = importRegex.exec(line)) !== null) {
      imports.push(match[1]);
    }
    while ((match = requireRegex.exec(line)) !== null) {
      imports.push(match[1]);
    }
  }
  return imports;
}

async function main() {
  console.log('=== Static Security and Access Boundary Evidence Check ===\n');

  let failed = false;

  // 1. Verify runbook text and terminology
  console.log('--- 1. Verifying Security Runbook Wording & Wording Warnings ---');
  const runbookPath = path.resolve(__dirname, '../docs/runbooks/final-security-and-access-review.md');
  if (fs.existsSync(runbookPath)) {
    const content = fs.readFileSync(runbookPath, 'utf8');
    const hasStaticReviewText = content.includes('Static security/access review') || content.includes('static security/access review');
    const hasEvidenceCheckText = content.includes('Access boundary evidence check') || content.includes('access boundary evidence check');
    const hasManualWarning = content.includes('Manual/live verification is still required where applicable') || content.includes('Manual/live verification still required');
    const hasStripeText = content.includes('Stripe/payment disabled/deferred for free invite-only beta');

    if (hasStaticReviewText && hasEvidenceCheckText && hasManualWarning && hasStripeText) {
      console.log('✅ PASSED: Runbook contains required non-overclaiming safety warnings.');
    } else {
      console.error('❌ FAILED: Runbook does not contain the required non-overclaiming safety warning/Stripe phrases.');
      failed = true;
    }
  } else {
    console.error('❌ FAILED: docs/runbooks/final-security-and-access-review.md does not exist.');
    failed = true;
  }

  // 2. Audit middleware routing guards
  console.log('\n--- 2. Verifying Middleware Routing Guards ---');
  const middlewarePath = path.resolve(__dirname, '../src/utils/supabase/middleware.ts');
  if (fs.existsSync(middlewarePath)) {
    const content = fs.readFileSync(middlewarePath, 'utf8');
    const protectsStudent = content.includes("'/student'");
    const protectsParent = content.includes("'/parent'");
    const protectsAdmin = content.includes("'/admin'");
    const protectsSettings = content.includes("'/settings'");
    const protectsMfa = content.includes("'/login/mfa'");

    if (protectsStudent && protectsParent && protectsAdmin && protectsSettings && protectsMfa) {
      console.log('✅ PASSED: Middleware protects student, parent, admin, settings, and mfa paths.');
    } else {
      console.error('❌ FAILED: Middleware is missing key path gates.');
      failed = true;
    }
  } else {
    console.error('❌ FAILED: src/utils/supabase/middleware.ts does not exist.');
    failed = true;
  }

  // 3. Verify parent signed URL blockage rules
  console.log('\n--- 3. Verifying Parent Signed URL Access Blockage ---');
  try {
    const { canActorRequestProofSignedUrl } = await import('../src/lib/proof-artifacts/signed-access-policy');
    const parentActor = { id: 'parent-id', roles: ['parent'] as any[] };
    const mockArtifact = { student_id: 'student-id', status: 'pending' };
    const isAllowed = canActorRequestProofSignedUrl(parentActor, mockArtifact);

    if (!isAllowed) {
      console.log('✅ PASSED: parent role correctly blocked from signed proof downloads.');
    } else {
      console.error('❌ FAILED: parent role was allowed access to signed URLs.');
      failed = true;
    }
  } catch (err) {
    console.error('❌ FAILED: Error importing or testing signed access policy:', err);
    failed = true;
  }

  // 4. Audit codebase for service-role leaks
  console.log('\n--- 4. Auditing Client-Bound Paths for Service Role Key Leakage ---');
  try {
    const srcDir = path.resolve(__dirname, '../src');
    const allFiles = walkDir(srcDir);
    let leakCount = 0;

    // Track imports map to trace transitive imports
    const importMap = new Map<string, string[]>();
    for (const filePath of allFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      const normalizedPath = path.normalize(filePath);
      const imports = getImportedPaths(content, filePath);
      importMap.set(normalizedPath, imports);
    }

    // Identify client components (having 'use client')
    const clientComponents = new Set<string>();
    for (const filePath of allFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes("'use client'") || content.includes('"use client"')) {
        clientComponents.add(path.normalize(filePath));
      }
    }

    // Recursively mark all files imported by client components as client-bound
    const clientBoundFiles = new Set<string>(clientComponents);
    let added = true;
    while (added) {
      added = false;
      for (const [file, imports] of importMap.entries()) {
        if (clientBoundFiles.has(file)) {
          for (const imp of imports) {
            // Try to resolve the import to a physical file path
            let resolved = '';
            if (imp.startsWith('@/')) {
              resolved = path.normalize(path.join(srcDir, imp.substring(2)));
            } else if (imp.startsWith('.')) {
              resolved = path.normalize(path.join(path.dirname(file), imp));
            }

            // Append extensions if missing
            const exts = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx'];
            let resolvedFile = '';
            if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
              resolvedFile = resolved;
            } else {
              for (const ext of exts) {
                if (fs.existsSync(resolved + ext) && fs.statSync(resolved + ext).isFile()) {
                  resolvedFile = resolved + ext;
                  break;
                }
              }
            }

            if (resolvedFile && !clientBoundFiles.has(resolvedFile)) {
              const resolvedContent = fs.readFileSync(resolvedFile, 'utf8');
              const isServerFile = resolvedContent.includes('"use server"') || 
                                   resolvedContent.includes("'use server'") ||
                                   resolvedContent.includes('"server-only"') ||
                                   resolvedContent.includes("'server-only'");
              if (!isServerFile) {
                clientBoundFiles.add(resolvedFile);
                added = true;
              }
            }
          }
        }
      }
    }

    // Now, scan all client-bound files, public-facing pages, and browser utilities for service role usages.
    for (const filePath of allFiles) {
      const relativePath = path.relative(process.cwd(), filePath);
      const content = fs.readFileSync(filePath, 'utf8');

      const isClientBound = clientBoundFiles.has(path.normalize(filePath));
      const isPublicRoute = relativePath.includes('src/app/(public)') || relativePath.includes('src/app/(auth)');
      const isBrowserUtility = relativePath.includes('src/utils/supabase/client.ts');
      const isUiPath = relativePath.includes('src/app/(dashboard)/student') || relativePath.includes('src/app/(dashboard)/parent') || relativePath.includes('src/components');

      if (isClientBound || isPublicRoute || isBrowserUtility || isUiPath) {
        // Exclude server actions (files with "use server")
        if (content.includes("'use server'") || content.includes('"use server"')) {
          continue;
        }

        // Check for NEXT_PUBLIC_ misuse
        if (content.includes('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY')) {
          console.error(`❌ LEAK DETECTED: [Public Env Key Misuse] -> ${relativePath}`);
          leakCount++;
        }

        // Check for supabaseAdmin usage
        if (content.includes('supabaseAdmin') || content.includes('@/lib/supabase/admin')) {
          let category = 'Client Component Leak';
          if (isPublicRoute) category = 'Public Route Import Leak';
          else if (isBrowserUtility) category = 'Browser Utility Leak';
          else if (isUiPath) category = 'UI Path Leak';

          console.error(`❌ LEAK DETECTED: [${category}] -> ${relativePath}`);
          leakCount++;
        }

        // Check for raw service role key usage
        if (content.includes('SUPABASE_SERVICE_ROLE_KEY') && !content.includes('process.env.SUPABASE_SERVICE_ROLE_KEY')) {
          console.error(`❌ LEAK DETECTED: [Raw Secret Leak] -> ${relativePath}`);
          leakCount++;
        }
      }
    }

    if (leakCount === 0) {
      console.log('✅ PASSED: No service role key leakage detected in client-bound files.');
    } else {
      console.error(`❌ FAILED: Found ${leakCount} service-role leakage issue(s).`);
      failed = true;
    }
  } catch (err) {
    console.error('❌ FAILED: Error auditing files for leakage:', err);
    failed = true;
  }

  if (failed) {
    console.error('\n❌ Security and access verification FAILED.');
    exit(1);
  } else {
    console.log('\n✅ All security and access boundary verification checks PASSED.');
    exit(0);
  }
}

main();
