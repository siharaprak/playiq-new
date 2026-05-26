import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import Module from 'node:module';
const originalRequire = Module.prototype.require;
(Module.prototype as any).require = function(request: string) {
  if (request === 'server-only') return {};
  return originalRequire.apply(this, arguments as any);
};

async function main() {
  const { supabaseAdmin } = await import('../src/lib/supabase/admin');
  const { getParentProofSummary } = await import('../src/lib/data/proof-artifacts');

  console.log('--- Parent Proof Summary QA ---');

  // 1. Find a valid parent-child link
  const { data: link, error } = await supabaseAdmin
    .from('parent_child_links')
    .select('parent_id, student_id')
    .limit(1)
    .single();

  if (error || !link) {
    console.log('⚠️ No parent_child_links found. Skipping live query test.');
    return;
  }

  console.log(`Testing with parent_id: ${link.parent_id}, student_id: ${link.student_id}`);

  try {
    const summary = await getParentProofSummary(link.parent_id, link.student_id);
    
    // Assert structure
    if (
      typeof summary.approvedCount === 'number' &&
      typeof summary.pendingReviewCount === 'number' &&
      typeof summary.needsRevisionCount === 'number' &&
      summary.parentCanDownloadApproved === false &&
      summary.studentId === link.student_id
    ) {
      console.log('✅ PASSED: getParentProofSummary returns safe count-based structure.');
    } else {
      console.error('❌ FAILED: getParentProofSummary returned unexpected structure:', summary);
      process.exit(1);
    }

  } catch (err) {
    console.error('❌ FAILED: Error executing getParentProofSummary:', err);
    process.exit(1);
  }

  // 2. Test unauthorized (fake parent)
  try {
    await getParentProofSummary('00000000-0000-0000-0000-000000000000', link.student_id);
    console.error('❌ FAILED: getParentProofSummary did not reject invalid parent_id');
    process.exit(1);
  } catch (err: any) {
    if (err.message.includes('Unauthorized')) {
      console.log('✅ PASSED: getParentProofSummary rejected unauthorized parent access.');
    } else {
      console.error('❌ FAILED: getParentProofSummary rejected, but with wrong error:', err.message);
      process.exit(1);
    }
  }

  console.log('All Parent Summary QA passed.');
  process.exit(0);
}

main();
