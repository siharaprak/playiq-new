import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import Module from 'node:module';
const originalRequire = Module.prototype.require;
(Module.prototype as any).require = function(request: string) {
  if (request === 'server-only') return {};
  return originalRequire.apply(this, arguments as any);
};

async function main() {
  const { cleanupExpiredDraftArtifacts } = await import('../src/lib/proof-artifacts/cleanup');

  const args = process.argv.slice(2);
  const isDryRun = !args.includes('--execute');

  console.log('--- Proof Artifact Cleanup ---');
  if (isDryRun) {
    console.log('Mode: DRY RUN (Use --execute to perform actual deletion)');
  } else {
    console.log('Mode: LIVE DELETION');
  }

  try {
    const result = await cleanupExpiredDraftArtifacts(isDryRun);
    console.log(`\nCleanup Results:`);
    console.log(`- Expired Draft Rows: ${result.deletedCount}`);
    console.log(`- Orphaned Storage Objects: ${result.storageDeletedCount}`);
    console.log(`\nStatus: ${isDryRun ? 'DRY RUN COMPLETE' : 'LIVE DELETION COMPLETE'}`);
    process.exit(0);
  } catch (error: any) {
    console.error('❌ FAILED:', error.message);
    process.exit(1);
  }
}

main();
