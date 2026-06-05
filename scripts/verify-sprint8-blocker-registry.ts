import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import * as fs from 'fs';
import * as path from 'path';
import Module from 'node:module';

// Intercept server-only imports
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

async function main() {
  console.log('=== Sprint 8: Blocker Registry Parity Verification ===\n');

  let failed = false;

  // 1. Read Code Blocker Registry
  const { BETA_BLOCKERS } = await import('../src/lib/ops/beta-blockers');
  console.log(`Loaded ${BETA_BLOCKERS.length} blockers from code registry.`);

  // 2. Read Markdown Blocker Registry
  const markdownPath = path.resolve(__dirname, '../docs/sprint/sprint-8-beta-blocker-walkthrough.md');
  if (!fs.existsSync(markdownPath)) {
    console.error(`❌ FAILED: Blocker walkthrough markdown not found at: ${markdownPath}`);
    exit(1);
    return;
  }

  const markdownContent = fs.readFileSync(markdownPath, 'utf8');
  
  // Parse rows matching: | **ID** | Category | Title | Severity | Status | ...
  const lines = markdownContent.split('\n');
  const markdownBlockers: Array<{ id: string; category: string; title: string; status: string }> = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.includes('**') && !trimmed.toLowerCase().includes('id | category')) {
      const parts = trimmed.split('|').map(p => p.trim());
      if (parts.length >= 6) {
        const idPart = parts[1];
        const categoryPart = parts[2];
        const titlePart = parts[3];
        const statusPart = parts[5];

        // Clean ID (e.g. **SEC-01** -> SEC-01)
        const id = idPart.replace(/\*/g, '').trim();
        const category = categoryPart.replace(/\*/g, '').trim();
        const title = titlePart.replace(/\*/g, '').trim();
        const status = statusPart.replace(/\*/g, '').trim();

        if (id && category && title && status) {
          markdownBlockers.push({ id, category, title, status });
        }
      }
    }
  }

  console.log(`Parsed ${markdownBlockers.length} blockers from markdown registry.\n`);

  // --- Perform Parity Checks ---

  // Check 1: exactly 12 blockers exist in code registry
  if (BETA_BLOCKERS.length === 12) {
    console.log('✅ PASS: Exactly 12 blockers exist in code registry.');
  } else {
    console.error(`❌ FAIL: Expected 12 blockers in code registry, found ${BETA_BLOCKERS.length}.`);
    failed = true;
  }

  // Check 2: exactly 12 blockers exist in markdown registry
  if (markdownBlockers.length === 12) {
    console.log('✅ PASS: Exactly 12 blockers exist in markdown registry.');
  } else {
    console.error(`❌ FAIL: Expected 12 blockers in markdown registry, found ${markdownBlockers.length}.`);
    failed = true;
  }

  // Check 3: Check IDs, categories, titles, statuses matching
  const codeMap = new Map(BETA_BLOCKERS.map(b => [b.id, b]));
  const mdMap = new Map(markdownBlockers.map(b => [b.id, b]));

  // Check 4: ADM-02 exists
  if (codeMap.has('ADM-02') && mdMap.has('ADM-02')) {
    console.log('✅ PASS: ADM-02 (Support Issues Migration Reproducibility) exists in both registries.');
  } else {
    console.error('❌ FAIL: ADM-02 is missing from one or both registries.');
    failed = true;
  }

  // Check 5: ENR-01 exists
  if (codeMap.has('ENR-01') && mdMap.has('ENR-01')) {
    console.log('✅ PASS: ENR-01 (Duplicate Enrollment Prevention) exists in both registries.');
  } else {
    console.error('❌ FAIL: ENR-01 is missing from one or both registries.');
    failed = true;
  }

  // Compare every blocker
  for (const codeBlocker of BETA_BLOCKERS) {
    const mdBlocker = mdMap.get(codeBlocker.id);

    if (!mdBlocker) {
      console.error(`❌ FAIL: Code blocker [${codeBlocker.id}] is missing from markdown registry.`);
      failed = true;
      continue;
    }

    // Check titles match
    if (codeBlocker.title === mdBlocker.title) {
      console.log(`✅ PASS: [${codeBlocker.id}] titles match: "${codeBlocker.title}"`);
    } else {
      console.error(`❌ FAIL: [${codeBlocker.id}] Title mismatch: Code="${codeBlocker.title}", Markdown="${mdBlocker.title}"`);
      failed = true;
    }

    // Check categories match
    if (codeBlocker.category === mdBlocker.category) {
      console.log(`✅ PASS: [${codeBlocker.id}] categories match: "${codeBlocker.category}"`);
    } else {
      console.error(`❌ FAIL: [${codeBlocker.id}] Category mismatch: Code="${codeBlocker.category}", Markdown="${mdBlocker.category}"`);
      failed = true;
    }

    // Check statuses are verified/matching
    if (codeBlocker.status === 'verified' && mdBlocker.status.toLowerCase() === 'verified') {
      console.log(`✅ PASS: [${codeBlocker.id}] status is VERIFIED in both registries.`);
    } else {
      console.error(`❌ FAIL: [${codeBlocker.id}] Status mismatch or not verified: Code="${codeBlocker.status}", Markdown="${mdBlocker.status}"`);
      failed = true;
    }
  }

  // Check 6: no markdown-only blocker exists
  for (const mdBlocker of markdownBlockers) {
    if (!codeMap.has(mdBlocker.id)) {
      console.error(`❌ FAIL: Markdown blocker [${mdBlocker.id}] is missing from code registry.`);
      failed = true;
    }
  }

  console.log('\n================================================');
  if (failed) {
    console.error('❌ Blocker Registry Parity Verification FAILED.');
    exit(1);
  } else {
    console.log('✅ Blocker Registry Parity Verification PASSED.');
    exit(0);
  }
}

main();
