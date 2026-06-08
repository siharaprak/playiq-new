import * as fs from 'fs';
import * as path from 'path';

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

async function main() {
  console.log('=== User Acceptance Testing (UAT) Checklist Verifier ===\n');

  const docPath = path.resolve(process.cwd(), 'docs/runbooks/beta-uat-critical-journeys.md');
  if (!fs.existsSync(docPath)) {
    console.error(`❌ FAIL: UAT checklist document not found at ${docPath}`);
    exit(1);
    return;
  }

  const content = fs.readFileSync(docPath, 'utf8');
  const lines = content.split('\n');

  const metaFields: Record<string, string | null> = {
    'UAT Owner': null,
    'Target Environment': null,
    'Verification Date': null
  };

  const fieldRegex = /-\s+\*\*(.+?)\*\*:\s*(.+)/;
  for (const line of lines) {
    const match = line.trim().match(fieldRegex);
    if (match) {
      const fieldName = match[1].trim();
      const fieldValue = match[2].trim();
      if (fieldName in metaFields) {
        metaFields[fieldName] = fieldValue;
      }
    }
  }

  let failed = false;
  const placeholders = ['[User/Deploy Lead]', 'TBD', 'TODO', 'placeholder', 'PENDING', 'None', 'N/A'];

  for (const [field, value] of Object.entries(metaFields)) {
    if (!value) {
      console.error(`❌ FAIL: Meta field "${field}" is missing.`);
      failed = true;
      continue;
    }

    const hasPlaceholder = placeholders.some(ph => 
      value.toLowerCase().includes(ph.toLowerCase())
    );

    if (hasPlaceholder) {
      console.error(`❌ FAIL: UAT meta field "${field}" contains placeholder: "${value}"`);
      failed = true;
    } else {
      console.log(`✅ PASS: Checked "${field}" -> "${value}"`);
    }
  }

  console.log('\n📢 NOTE: Manual verification of critical journeys (Student, Parent, Admin) on the live URL is required for release.');

  console.log('\n-----------------------------------------');
  if (failed) {
    console.error('Status: HOLD. UAT checklist verification failed.');
    exit(1);
  } else {
    console.log('Status: SUCCESS. UAT checklist meta verified successfully.');
    exit(0);
  }
}

main().catch((err) => {
  console.error('UAT verifier crash:', err);
  exit(1);
});
