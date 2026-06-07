import * as fs from 'fs';
import * as path from 'path';
import { BETA_ISSUE_REGISTRY } from '../src/lib/release/beta-issue-registry';
import { classifyBetaIssue } from '../src/lib/release/beta-severity-policy';

const SCAN_DIR = path.resolve(__dirname, '../src');

// Critical security/privacy blocker keywords
const CRITICAL_KEYWORDS = [
  'security',
  'privacy',
  'service role',
  'service_role',
  'signed url',
  'signed_url',
  'raw prompt',
  'raw response',
  'access',
  'payment',
  'data loss',
  'data_loss',
  'bypass',
  'leak',
  'unauthorized'
];

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
  console.log('=== PlayIQ Cosmetic vs Critical Issue Priority Audit ===\n');

  let failed = false;

  // 1. Verify registry issues have correct severity assigned
  console.log('1. Auditing Registered Issue Classifications...');
  for (const issue of BETA_ISSUE_REGISTRY) {
    const calculated = classifyBetaIssue(issue);
    if (issue.severity && issue.severity !== calculated) {
      console.warn(`⚠️ Warning: Registered Issue ${issue.id} has manual severity [${issue.severity}] but keyword rules classified as [${calculated}].`);
      if ((calculated === 'P0' || calculated === 'P1') && issue.severity === 'P2') {
        console.error(`❌ SEVERITY VIOLATION: Issue ${issue.id} contains critical keywords but is down-classified to P2!`);
        failed = true;
      }
    }
  }
  if (!failed) {
    console.log('✅ Registered issue classifications match severity guidelines.');
  }

  // 2. Scan code files for TODO/FIXME with critical keywords
  console.log('\n2. Scanning codebase for unresolved TODO/FIXME comments...');
  const files = walkDir(SCAN_DIR);
  let blockerCount = 0;
  let p2DeferredCount = 0;

  for (const file of files) {
    const relativePath = path.relative(path.resolve(__dirname, '..'), file);
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      const lowerLine = line.toLowerCase();
      // Check if line contains TODO, FIXME, or HACK
      if (lowerLine.includes('todo') || lowerLine.includes('fixme') || lowerLine.includes('hack')) {
        const matchedKeyword = CRITICAL_KEYWORDS.find(k => lowerLine.includes(k));
        if (matchedKeyword) {
          console.error(`❌ BLOCKER TAG IN CODE (P0/P1): ${relativePath}:${idx + 1} -> Contains '${matchedKeyword}': "${line.trim()}"`);
          blockerCount++;
          failed = true;
        } else {
          // Defer to P2 (Cosmetic UI, minor layout, performance, etc.)
          p2DeferredCount++;
        }
      }
    });
  }

  console.log(`\nScan Summary:`);
  console.log(` - Open critical blocker tags (P0/P1): ${blockerCount}`);
  console.log(` - Open deferred technical debt tags (P2): ${p2DeferredCount}`);

  console.log('================================================================');
  if (failed) {
    console.error('❌ Critical Issue Triage Audit FAILED.');
    process.exitCode = 1;
  } else {
    console.log('✅ Blocker comments and issues checks PASSED.');
    process.exitCode = 0;
  }
}

main();
