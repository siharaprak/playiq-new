import * as fs from 'fs';
import * as path from 'path';

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

async function main() {
  console.log('=== Backup, Rollback, and Release Procedures Verifier ===\n');

  const docPath = path.resolve(process.cwd(), 'docs/runbooks/beta-backup-rollback-release-procedures.md');
  if (!fs.existsSync(docPath)) {
    console.error(`❌ FAIL: Procedures document not found at ${docPath}`);
    exit(1);
    return;
  }

  const content = fs.readFileSync(docPath, 'utf8');
  const lines = content.split('\n');

  // Verify manual backup confirmation header text
  const requiredConfirmationText = 'The verifier only checks that manual backup confirmation has been recorded. It does not independently prove Supabase backups are enabled.';
  const hasConfirmationText = content.includes(requiredConfirmationText);
  if (!hasConfirmationText) {
    console.error('❌ FAIL: Missing required human confirmation statement in backup procedures.');
    exit(1);
    return;
  }
  console.log('✅ PASS: Backup confirmation disclaimer statement is present.');

  // Required backup fields
  const requiredBackupFields: Record<string, string | null> = {
    'Environment': null,
    'Human Backup Owner': null,
    'Confirmation Date': null,
    'Confirmation Method': null,
    'Backup Frequency': null,
    'Restore Procedure': null,
    'Restore Rehearsal Status': null,
    'Evidence Note': null
  };

  // Other required metadata
  const otherRequiredFields: Record<string, string | null> = {
    'Rollback Owner': null,
    'Release Owner': null,
    'Previous Stable Vercel Deployment ID': null,
    'Previous Stable Vercel Deployment URL': null,
    'Previous Stable Vercel Deployment Commit': null,
    'Rollback Method': null,
    'Rollback Decision Criteria': null
  };

  const fieldRegex = /-\s+\*\*(.+?)\*\*:\s*(.+)/;
  for (const line of lines) {
    const match = line.trim().match(fieldRegex);
    if (match) {
      const fieldName = match[1].trim();
      const fieldValue = match[2].trim();
      if (fieldName in requiredBackupFields) {
        requiredBackupFields[fieldName] = fieldValue;
      } else if (fieldName in otherRequiredFields) {
        otherRequiredFields[fieldName] = fieldValue;
      }
    }
  }

  let failed = false;
  const placeholders = ['[User/Deploy Lead]', 'TBD', 'TODO', 'placeholder', 'PENDING', 'None', 'N/A', 'NOT PERFORMED'];

  // Check Backup Fields
  console.log('\nVerifying manual backup confirmation fields:');
  for (const [field, value] of Object.entries(requiredBackupFields)) {
    if (!value) {
      console.error(`❌ FAIL: Backup field "${field}" is missing.`);
      failed = true;
      continue;
    }
    const hasPlaceholder = placeholders.some(ph => value.toLowerCase().includes(ph.toLowerCase()));
    
    // Restore Rehearsal can be deferred as P2 if not completed, but must be documented
    if (field === 'Restore Rehearsal Status') {
      if (hasPlaceholder) {
        console.log(`⚠️ INFO: "Restore Rehearsal Status" is pending ("${value}"). Deferred to P2 debt.`);
      } else {
        console.log(`✅ PASS: Checked "${field}" -> "${value}"`);
      }
      continue;
    }

    if (hasPlaceholder) {
      console.error(`❌ FAIL: Backup field "${field}" has placeholder: "${value}"`);
      failed = true;
    } else {
      console.log(`✅ PASS: Checked "${field}" -> "${value}"`);
    }
  }

  // Check Other Fields (Rollback targets/owners)
  console.log('\nVerifying release & rollback fields:');
  for (const [field, value] of Object.entries(otherRequiredFields)) {
    if (!value) {
      console.error(`❌ FAIL: Release/Rollback field "${field}" is missing.`);
      failed = true;
      continue;
    }
    const hasPlaceholder = placeholders.some(ph => value.toLowerCase().includes(ph.toLowerCase()));
    if (hasPlaceholder) {
      console.error(`❌ FAIL: Release/Rollback field "${field}" has placeholder: "${value}"`);
      failed = true;
    } else {
      console.log(`✅ PASS: Checked "${field}" -> "${value}"`);
    }
  }

  // Verify that staging reset is blocked in production config references
  const hasStagingResetBlock = content.includes('Staging Reset Execute Mode**: strictly blocked in production target');
  if (!hasStagingResetBlock) {
    console.error('❌ FAIL: Missing explicit statement blocking staging reset execute mode in production.');
    failed = true;
  } else {
    console.log('✅ PASS: Staging reset execution mode restriction statement is documented.');
  }

  console.log('\n-----------------------------------------');
  if (failed) {
    console.error('Status: HOLD. Backup, Rollback, and Release procedures verification failed.');
    exit(1);
  } else {
    console.log('Status: SUCCESS. Backup, Rollback, and Release procedures verified successfully.');
    exit(0);
  }
}

main().catch((err) => {
  console.error('Procedures verifier crash:', err);
  exit(1);
});
