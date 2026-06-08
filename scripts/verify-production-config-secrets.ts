import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

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
      // Ignore build directories and modules
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        walkDir(filePath, fileList);
      }
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function main() {
  console.log('=== Production Secrets & Configuration Auditor ===\n');

  // 1. Run environment variable checker programmatically for production
  console.log('Running target environment verification...');
  let envPass = false;
  try {
    execSync('npx tsx scripts/verify-beta-env-readiness.ts production', { stdio: 'inherit' });
    envPass = true;
  } catch (err) {
    console.error('❌ FAIL: Environment verification check failed for target production.');
  }

  // 2. Scan codebase for raw credentials
  console.log('\nScanning files for raw secrets exposure...');
  const repoRoot = process.cwd();
  const allFiles = walkDir(repoRoot);

  const ignoredFiles = [
    path.join(repoRoot, 'scripts/verify-production-config-secrets.ts'),
    path.join(repoRoot, 'docs/playiq-system-reference.md'),
    path.join(repoRoot, 'package-lock.json'),
    path.join(repoRoot, 'apphosting.yaml')
  ];

  let leaksCount = 0;

  // Regex patterns
  const patterns = [
    {
      name: 'Stripe Secret Key',
      regex: /sk_(live|test)_[a-zA-Z0-9]{20,}/g,
      severity: 'P0 Blocker'
    },
    {
      name: 'Stripe Webhook Secret',
      regex: /whsec_[a-zA-Z0-9]{20,}/g,
      severity: 'P0 Blocker'
    },
    {
      name: 'Google API Key',
      regex: /AIzaSy[a-zA-Z0-9_-]{33}/g,
      severity: 'P0 Blocker'
    },
    {
      name: 'Supabase Service Role JWT',
      regex: /eyJhbGciOi[a-zA-Z0-9_-]{30,}\.[a-zA-Z0-9_-]{30,}\.[a-zA-Z0-9_-]{30,}/g,
      severity: 'P0 Blocker'
    }
  ];

  const allowedPlaceholders = ['YOUR_KEY_HERE', '<redacted>', '[REDACTED]', 'placeholder'];

  for (const filePath of allFiles) {
    // Only check files in src, scripts, docs
    const relativePath = path.relative(repoRoot, filePath);
    if (!relativePath.startsWith('src') && !relativePath.startsWith('scripts') && !relativePath.startsWith('docs')) {
      continue;
    }

    if (ignoredFiles.includes(filePath)) {
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Skip lines containing allowed placeholders to avoid doc false positives
        const hasPlaceholder = allowedPlaceholders.some(ph => 
          line.toLowerCase().includes(ph.toLowerCase())
        );
        if (hasPlaceholder) {
          continue;
        }

        for (const pattern of patterns) {
          const match = line.match(pattern.regex);
          if (match) {
            console.error(`❌ LEAK FOUND:`);
            console.error(`   - File Path: ${relativePath}`);
            console.error(`   - Category: ${pattern.name}`);
            console.error(`   - Severity: ${pattern.severity}`);
            console.error(`   - Line Number: ${i + 1}`);
            console.error(`   - Status: REDACTED (Matched value hidden to prevent log leaks)`);
            leaksCount++;
          }
        }
      }
    } catch (err: any) {
      console.warn(`⚠️ Warning: Could not read file ${relativePath}: ${err.message}`);
    }
  }

  console.log('\n-----------------------------------------');
  if (!envPass || leaksCount > 0) {
    console.error(`Status: HOLD. Secrets audit failed with ${leaksCount} leak(s) detected.`);
    exit(1);
  } else {
    console.log('Status: SUCCESS. Secrets and configuration checked cleanly.');
    exit(0);
  }
}

main().catch((err) => {
  console.error('Secrets auditor crash:', err);
  exit(1);
});
