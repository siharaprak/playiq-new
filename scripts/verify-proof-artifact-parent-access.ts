import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import Module from 'node:module';
const originalRequire = Module.prototype.require;
(Module.prototype as any).require = function(request: string) {
  if (request === 'server-only') return {};
  return originalRequire.apply(this, arguments as any);
};

async function run() {
  const { getParentVisibleProofArtifacts } = await import('../src/lib/data/proof-artifacts');

  console.log('--- Proof Artifact Parent Access QA ---');
  // We mock a test or just statically assert the policy logic since we can't easily seed the live DB from here.
  
  // The actual test verifies the logic inside getParentVisibleProofArtifacts:
  // 1. It must query parent_child_links.
  // 2. It must return unauthorized if no link exists.
  
  try {
    // Attempt with dummy UUIDs
    await getParentVisibleProofArtifacts('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111');
    console.error('❌ FAILED: Expected an error for unlinked parent-child, but got success.');
    process.exit(1);
  } catch (error: any) {
    if (error.message.includes('Unauthorized or student not linked')) {
      console.log('✅ PASSED: getParentVisibleProofArtifacts enforces parent_child_links correctly.');
      process.exit(0);
    } else {
      console.error('❌ FAILED with unexpected error:', error.message);
      process.exit(1);
    }
  }
}

run();
