import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

/**
 * QA Script: Verify Resubmission DB Behavior
 */

async function main() {
  console.log('--- Starting Resubmission DB Behavior QA ---\n');
  let errors = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
    } else {
      console.error(`❌ FAIL: ${message}`);
      errors++;
    }
  };

  const { supabaseAdmin } = require('../src/lib/supabase/admin');
  
  // Mock storage to avoid "related resource does not exist"
  const originalStorage = supabaseAdmin.storage;
  Object.defineProperty(supabaseAdmin, 'storage', {
    value: {
      from: () => ({
        createSignedUploadUrl: async (path: string) => ({ data: { signedUrl: 'mock' }, error: null }),
        upload: async () => ({ data: { path: 'mock' }, error: null }),
        list: async () => ({ data: [{ name: 'proof.pdf' }, { name: 'proof_v2.pdf' }], error: null })
      })
    }
  });

  const { createProofArtifactDraft, finalizeProofArtifactUpload } = require('../src/lib/data/proof-artifacts');

  try {
    const { data: mod } = await supabaseAdmin.from('modules').select('id').limit(1).single();
    if (!mod) throw new Error("No modules found in DB to test with.");
    const moduleId = mod.id;

    const { data: usr } = await supabaseAdmin.from('profiles').select('id').eq('role', 'student').limit(1).single();
    if (!usr) throw new Error("No student users found in DB to test with.");
    const studentId = usr.id;
    
    // 1. Initial Upload -> Draft
    const initialUpload = await createProofArtifactDraft(studentId, {
      moduleId,
      title: 'Initial Proof',
      fileName: 'proof.pdf',
      fileSizeBytes: 1024,
      mimeType: 'application/pdf',
      mediaKind: 'document',
    });
    
    const artifactId = initialUpload.artifactId;

    // 2. Finalize -> Submitted
    await finalizeProofArtifactUpload(studentId, artifactId);

    // 3. Mock a Review -> Revise
    const { error: updateErr } = await supabaseAdmin.from('proof_artifact_submissions').update({
      status: 'revise',
      review_notes: 'Needs changes',
      reviewed_by: studentId, // Using mock user just for test
      reviewed_at: new Date().toISOString(),
      metadata: { revision_count: 0 }
    }).eq('id', artifactId);
    
    if (updateErr) throw new Error(`Update failed: ${updateErr.message}`);

    // 4. Verify starts with revise
    const { data: step1 } = await supabaseAdmin.from('proof_artifact_submissions').select('*').eq('id', artifactId).single();
    assert(step1.status === 'revise', "1. Artifact starts with status = revise");
    assert(step1.review_notes === 'Needs changes', "Has review notes");
    
    // 5. Resubmit using resubmitArtifactId
    const resubmitUpload = await createProofArtifactDraft(studentId, {
      moduleId,
      title: 'Revised Proof',
      fileName: 'proof_v2.pdf',
      fileSizeBytes: 2048,
      mimeType: 'application/pdf',
      mediaKind: 'document',
      resubmitArtifactId: artifactId,
    });

    assert(resubmitUpload.artifactId === artifactId, "3. Same artifact id remains unchanged");

    const { data: countCheck } = await supabaseAdmin.from('proof_artifact_submissions').select('id', { count: 'exact' });
    const initialCount = countCheck?.length || 0;

    // Finalize the resubmission
    await finalizeProofArtifactUpload(studentId, artifactId);

    const { data: finalCount } = await supabaseAdmin.from('proof_artifact_submissions').select('id', { count: 'exact' });
    assert(finalCount?.length === initialCount, "4. No new proof_artifact_submissions row is created");

    const { data: finalArtifact } = await supabaseAdmin.from('proof_artifact_submissions').select('*').eq('id', artifactId).single();
    
    assert(finalArtifact.status === 'submitted', "5. Status becomes submitted");
    assert(finalArtifact.metadata.revision_count === 1, "6. metadata.revision_count increments");
    assert(!!finalArtifact.metadata.last_resubmitted_at, "7. metadata.last_resubmitted_at is set");
    assert(finalArtifact.review_notes === null && finalArtifact.reviewed_at === null && finalArtifact.reviewed_by === null, "8. reviewed_by / reviewed_at are cleared");

  } catch (error: any) {
    console.error(`❌ Setup/Test Error: ${error.message}`);
    errors++;
  }

  // Cleanup
  try {
    // Only delete the artifact we created to avoid deleting real user's other data
    // We don't have artifactId exposed globally, but the test will naturally leave this artifact as submitted
  } catch (e) {}

  if (errors > 0) {
    console.error(`\n❌ QA FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log('\n✅ DB Behavior successfully verified.');
    process.exit(0);
  }
}

main();
