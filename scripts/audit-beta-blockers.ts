import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
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

async function main() {
  const { BETA_BLOCKERS } = await import('../src/lib/ops/beta-blockers');

  console.log('=== PlayIQ Beta Blocker Audit ===\n');

  let openCount = 0;
  let resolvedCount = 0;

  for (const blocker of BETA_BLOCKERS) {
    const statusSymbol = blocker.status === 'open' || blocker.status === 'in_progress' ? '🚨' : '✅';
    console.log(
      `[${blocker.id}] ${statusSymbol} [${blocker.category.toUpperCase()}] ${blocker.title} - ${blocker.status.toUpperCase()}`
    );
    console.log(`      Description: ${blocker.description}`);
    console.log(`      Severity: ${blocker.severity.toUpperCase()}\n`);

    if (blocker.status === 'open') {
      openCount++;
    } else {
      resolvedCount++;
    }
  }

  console.log('=================================');
  console.log(`Summary: ${resolvedCount} resolved, ${openCount} open blockers.`);
  console.log('=================================');

  if (openCount > 0) {
    console.error(`\n❌ FAILED: ${openCount} open beta blockers detected.`);
    exit(1);
  } else {
    console.log('\n✅ PASSED: All registered beta blockers are resolved.');
    exit(0);
  }
}

main();
