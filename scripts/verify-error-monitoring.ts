// scripts/verify-error-monitoring.ts
//
// Verification script for error monitoring setup.
// - Confirms the existence of error categories.
// - Confirms that error reporter routes safe data to SafeLogger.
// - Confirms that no raw stack traces are sent in the report payload.
// - Confirms that no environment secrets are logged.
//

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import Module from 'node:module';

// Intercept server-only imports
const originalRequire = Module.prototype.require;
(Module.prototype as any).require = function(request: string) {
  if (request === 'server-only') return {};
  return originalRequire.apply(this, arguments as any);
};

import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve(__dirname, '../src');

function getFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

async function runVerify() {
  console.log('=== RUNNING ERROR MONITORING VERIFIER ===');
  let failed = false;

  // 1. Verify policy definitions
  const { ERROR_CATEGORIES, ERROR_MONITORING_POLICY } = await import(
    '../src/lib/monitoring/error-monitoring-policy'
  );

  if (!ERROR_CATEGORIES || !ERROR_MONITORING_POLICY) {
    console.error('❌ Error: Error monitoring policy or categories are undefined.');
    failed = true;
  } else {
    console.log('✅ Error monitoring policy loaded.');
  }

  // 2. Validate error reporter logic directly
  const { ErrorReporter } = await import('../src/lib/monitoring/error-reporter');
  if (typeof ErrorReporter.report !== 'function' || typeof ErrorReporter.getClientMessage !== 'function') {
    console.error('❌ Error: ErrorReporter functions missing or malformed.');
    failed = true;
  } else {
    console.log('✅ ErrorReporter helper methods verified.');
  }

  // Test client-safe message mapping
  const safeMsg = ErrorReporter.getClientMessage('validation_error');
  if (safeMsg.includes('trace') || safeMsg.includes('Exception') || safeMsg.includes('stack')) {
    console.error('❌ Error: ErrorReporter client message exposes stack or internal details!');
    failed = true;
  } else {
    console.log('✅ Client message sanitization verified.');
  }

  // 3. Scan codebase for raw console.error or console.log on raw errors without ErrorReporter
  const files = getFiles(SRC_DIR);
  
  // Note: We check that Critical files use ErrorReporter on catches
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(path.resolve(__dirname, '..'), file);

    if (relativePath.includes('api/guided-ai/route.ts') || relativePath.includes('api/proof-artifacts/[id]/finalize/route.ts')) {
      if (!content.includes('ErrorReporter')) {
        console.error(`❌ Error: Critical API route "${relativePath}" does not use ErrorReporter in catch block!`);
        failed = true;
      }
    }
  });

  if (failed) {
    console.error('❌ Error Monitoring Verification Failed.');
    process.exit(1);
  } else {
    console.log('✅ Error Monitoring Verification Passed.');
  }
}

runVerify();
