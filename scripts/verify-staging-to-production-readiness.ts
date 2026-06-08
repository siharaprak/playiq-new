import * as fs from 'fs';
import * as path from 'path';

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

async function main() {
  console.log('=== Staging-to-Production Readiness Verifier ===\n');

  const docPath = path.resolve(process.cwd(), 'docs/runbooks/staging-to-production-readiness-checklist.md');
  if (!fs.existsSync(docPath)) {
    console.error(`❌ FAIL: Checklist document not found at ${docPath}`);
    exit(1);
    return;
  }

  const content = fs.readFileSync(docPath, 'utf8');
  const lines = content.split('\n');

  const requiredFields: Record<string, string | null> = {
    'Staging Deployment URL': null,
    'Staging Smoke (Local/Static)': null,
    'Staging Smoke (Live Vercel)': null,
    'Staging Environment Proof': null,
    'Production Environment Proof': null,
    'Previous Stable Vercel Deployment ID': null,
    'Previous Stable Vercel Deployment URL': null,
    'Previous Stable Vercel Deployment Commit': null,
    'Rollback Owner': null,
    'Deployment Owner': null,
    'Monitoring Owner': null,
    'Support Owner': null,
    'First Invite Batch Owner': null,
    'Staging Smoke Owner': null,
    'Backup Owner': null,
    'Supabase Backups Status': null,
    'Final Human Deployment Approval': null
  };

  const fieldRegex = /-\s+\*\*(.+?)\*\*:\s*(.+)/;
  for (const line of lines) {
    const match = line.trim().match(fieldRegex);
    if (match) {
      const fieldName = match[1].trim();
      const fieldValue = match[2].trim();
      if (fieldName in requiredFields) {
        requiredFields[fieldName] = fieldValue;
      }
    }
  }

  let failed = false;
  const placeholders = ['[User/Deploy Lead]', 'TBD', 'TODO', 'placeholder', 'PENDING', 'None', 'N/A', 'NOT PERFORMED'];

  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      console.error(`❌ FAIL: Required field "${field}" is missing from the checklist document.`);
      failed = true;
      continue;
    }

    const hasPlaceholder = placeholders.some(ph => 
      value.toLowerCase().includes(ph.toLowerCase())
    );

    if (hasPlaceholder) {
      console.error(`❌ FAIL: Field "${field}" contains a placeholder/unverified value: "${value}"`);
      failed = true;
    } else {
      console.log(`✅ PASS: Checked "${field}" -> "${value}"`);
    }
  }

  console.log('\n-----------------------------------------');
  if (failed) {
    console.error('Status: HOLD. Staging-to-production readiness checklist verification failed.');
    exit(1);
  } else {
    console.log('Status: SUCCESS. Staging-to-production readiness checklist verified successfully.');
    exit(0);
  }
}

main().catch((err) => {
  console.error('Readiness verifier crash:', err);
  exit(1);
});
