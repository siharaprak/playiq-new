
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ProofArtifactUploadSlotInput, ProofArtifactReviewInput } from '@/lib/proof-artifacts/types';
import { ArtifactStatus, canTransitionArtifact } from '@/lib/proof-artifacts/state-machine';
import { MODULES } from '@/lib/constants';
import { getProofArtifactStoragePath } from '@/lib/proof-artifacts/storage-paths';

const BUCKET_NAME = 'proof-artifacts';

/**
 * Creates a draft proof artifact and returns the signed upload URL.
 */
export async function createProofArtifactDraft(
  studentId: string,
  input: ProofArtifactUploadSlotInput
) {
  const artifactId = input.resubmitArtifactId || crypto.randomUUID();
  const modId = input.moduleId || Object.values(MODULES)[(input.moduleNumber || 1) - 1] || MODULES.MODULE_1_ID;
  const modLabel = input.moduleNumber || input.moduleId || 'unknown';
  
  const { path: storagePath, error: pathError } = getProofArtifactStoragePath({
    studentId,
    artifactId,
    moduleIdOrModuleNumber: modLabel,
    fileName: input.fileName
  });

  if (pathError || !storagePath) {
    throw new Error(pathError || 'Failed to generate storage path');
  }

  if (input.resubmitArtifactId) {
    // Verify it exists and belongs to user and is in 'revise' status
    const { data: existing, error: verifyError } = await supabaseAdmin
      .from('proof_artifact_submissions')
      .select('status')
      .eq('id', input.resubmitArtifactId)
      .eq('student_id', studentId)
      .single();

    if (verifyError || !existing) {
      throw new Error('Artifact not found or unauthorized for resubmission');
    }

    if (existing.status !== 'revise') {
      throw new Error('Artifact is not in a revisable state');
    }
    
    // We do NOT update the DB row here. We just generate the signed URL.
    // The DB row will be updated during the 'finalize' step.
  } else {
    // Insert new draft row
    const { error: insertError } = await supabaseAdmin
      .from('proof_artifact_submissions')
      .insert({
        id: artifactId,
        student_id: studentId,
        module_id: modId,
        artifact_type: 'supplemental_proof',
        content_payload: {}, // Empty for file uploads
        status: 'draft',
        title: input.title,
        description: input.description,
        file_name: input.fileName,
        file_size_bytes: input.fileSizeBytes,
        mime_type: input.mimeType,
        media_kind: input.mediaKind,
        storage_bucket: BUCKET_NAME,
        storage_path: storagePath,
      });

    if (insertError) {
      throw new Error(`Failed to create draft artifact: ${insertError.message}`);
    }
  }

  // Generate signed upload URL (Valid for 10 minutes)
  const { data: uploadData, error: uploadError } = await supabaseAdmin
    .storage
    .from(BUCKET_NAME)
    .createSignedUploadUrl(storagePath);

  if (uploadError || !uploadData) {
    // Attempt rollback only if it's a new draft
    if (!input.resubmitArtifactId) {
      await supabaseAdmin.from('proof_artifact_submissions').delete().eq('id', artifactId);
    }
    throw new Error(`Failed to create signed upload URL: ${uploadError?.message}`);
  }

  return {
    artifactId,
    uploadUrl: uploadData.signedUrl,
    token: uploadData.token,
    storagePath,
  };
}

/**
 * Finalizes the upload by moving draft -> submitted.
 */
export async function finalizeProofArtifactUpload(studentId: string, artifactId: string) {
  // Check if exists and is draft or revise
  const { data: artifact, error: fetchError } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('status, storage_path, module_id, media_kind, metadata')
    .eq('id', artifactId)
    .eq('student_id', studentId)
    .single();

  if (fetchError || !artifact) {
    throw new Error('Artifact not found');
  }

  if (artifact.status !== 'draft' && artifact.status !== 'revise' && artifact.status !== 'rejected') {
    throw new Error(`Invalid state transition from ${artifact.status} to submitted`);
  }

  // Check if file actually exists in storage
  // We list files in the directory
  const pathParts = artifact.storage_path.split('/');
  const fileName = pathParts.pop();
  const folderPath = pathParts.join('/');

  const { data: files, error: storageError } = await supabaseAdmin
    .storage
    .from(BUCKET_NAME)
    .list(folderPath, { limit: 1, search: fileName });

  if (storageError || !files || files.length === 0) {
    throw new Error('File not found in storage. Upload may not have completed.');
  }

  // Merge metadata safely
  const oldMetadata = (artifact.metadata as Record<string, unknown>) || {};
  const currentRevisionCount = typeof oldMetadata.revision_count === 'number' ? oldMetadata.revision_count : 0;
  
  const newMetadata = {
    ...oldMetadata,
    last_resubmitted_at: new Date().toISOString(),
    revision_count: artifact.status === 'revise' ? currentRevisionCount + 1 : currentRevisionCount
  };

  const updatePayload: Record<string, unknown> = {
    status: 'submitted',
    submitted_at: new Date().toISOString(),
    metadata: newMetadata
  };

  // If this was a resubmission, we clear review_notes and reviewed_at
  if (artifact.status === 'revise') {
    updatePayload.review_notes = null;
    updatePayload.reviewed_at = null;
    updatePayload.reviewed_by = null;
  }

  // Mark submitted
  const { error: updateError } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .update(updatePayload)
    .eq('id', artifactId)
    .eq('student_id', studentId);

  if (updateError) {
    throw new Error('Failed to finalize artifact submission');
  }

  return artifact;
}

export async function getStudentProofArtifacts(studentId: string, moduleId?: string) {
  let query = supabaseAdmin
    .from('proof_artifact_submissions')
    .select('id, status, title, description, file_name, file_size_bytes, mime_type, media_kind, created_at, submitted_at, reviewed_at, module_id, artifact_type')
    .eq('student_id', studentId)
    .eq('artifact_type', 'supplemental_proof')
    .order('created_at', { ascending: false });

  if (moduleId) query = query.eq('module_id', moduleId);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProofArtifactForOwner(studentId: string, artifactId: string) {
  const { data, error } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('*')
    .eq('id', artifactId)
    .eq('student_id', studentId)
    .single();
  if (error) throw error;
  return data;
}

export async function getProofArtifactForReviewer(artifactId: string) {
  const { data, error } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select(`
      *,
      profiles:student_id (full_name)
    `)
    .eq('id', artifactId)
    .single();
  if (error) throw error;
  return data;
}

export async function getReviewQueue(filters?: { status?: string, moduleId?: string }) {
  let query = supabaseAdmin
    .from('proof_artifact_submissions')
    .select(`
      id,
      student_id,
      module_id,
      artifact_type,
      title,
      description,
      file_name,
      file_size_bytes,
      media_kind,
      status,
      submitted_at,
      reviewed_at,
      profiles:student_id (full_name)
    `)
    .eq('artifact_type', 'supplemental_proof')
    .in('status', ['submitted', 'under_review'])
    .order('submitted_at', { ascending: true });

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.moduleId) query = query.eq('module_id', filters.moduleId);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function reviewProofArtifact(reviewerId: string, artifactId: string, input: ProofArtifactReviewInput) {
  // Fetch current state
  const { data: artifact, error: fetchError } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('status, student_id, module_id, media_kind, file_size_bytes, mime_type')
    .eq('id', artifactId)
    .single();

  if (fetchError || !artifact) throw new Error('Artifact not found');

  if (!canTransitionArtifact(artifact.status as ArtifactStatus, input.status, 'reviewer')) {
    throw new Error(`Reviewer cannot transition artifact from ${artifact.status} to ${input.status}`);
  }

  const { error: updateError } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .update({
      status: input.status,
      review_notes: input.reviewNotes || null,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', artifactId);

  if (updateError) throw new Error('Failed to update artifact status');

  return artifact;
}

/**
 * Returns proof artifact summary data for a parent viewing their linked child's artifacts.
 *
 * @security PARENT-SAFE: This function intentionally returns only safe fields.
 * It must NEVER return: storage_path, storage_bucket, signed URLs, public URLs,
 * file_name, review_notes, email, full_name, or raw metadata/content_payload.
 * Any change to the select clause must be reviewed for parent data safety.
 */
export async function getParentVisibleProofArtifacts(parentId: string, studentId: string) {
  // Verify link
  const { data: link } = await supabaseAdmin
    .from('parent_child_links')
    .select('student_id')
    .eq('parent_id', parentId)
    .eq('student_id', studentId)
    .single();

  if (!link) throw new Error('Unauthorized or student not linked');

  // Return ONLY safe fields — no file access data, no review notes, no raw metadata
  const { data, error } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('id, status, artifact_type, media_kind, module_id, created_at, submitted_at, reviewed_at')
    .eq('student_id', studentId)
    .eq('artifact_type', 'supplemental_proof')
    .in('status', ['submitted', 'under_review', 'approved', 'revise', 'rejected'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createProofArtifactSignedDownloadUrl(artifactId: string) {
  const { data: artifact, error } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('storage_path, storage_bucket')
    .eq('id', artifactId)
    .single();

  if (error || !artifact || !artifact.storage_path) {
    throw new Error('Artifact or storage path not found');
  }

  const bucket = artifact.storage_bucket || BUCKET_NAME;

  const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin
    .storage
    .from(bucket)
    .createSignedUrl(artifact.storage_path, 600); // 10 minutes

  if (signedUrlError || !signedUrlData) {
    throw new Error('Failed to generate signed download URL');
  }

  return signedUrlData.signedUrl;
}

export async function getParentProofSummary(parentId: string, studentId: string) {
  // Verify link
  const { data: link } = await supabaseAdmin
    .from('parent_child_links')
    .select('student_id')
    .eq('parent_id', parentId)
    .eq('student_id', studentId)
    .single();

  if (!link) {
    throw new Error('Unauthorized or student not linked');
  }

  // Get proof artifacts for this student, omitting drafts
  const { data: artifacts, error } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('status, created_at, submitted_at, reviewed_at')
    .eq('student_id', studentId)
    .eq('artifact_type', 'supplemental_proof')
    .neq('status', 'draft');

  if (error) {
    throw new Error('Failed to fetch summary');
  }

  let approvedCount = 0;
  let pendingReviewCount = 0;
  let needsRevisionCount = 0;
  let latestApprovedAt: string | null = null;
  let latestSubmittedAt: string | null = null;

  artifacts?.forEach((art: any) => {
    if (art.status === 'approved') {
      approvedCount++;
      if (!latestApprovedAt || new Date(art.reviewed_at) > new Date(latestApprovedAt)) {
        latestApprovedAt = art.reviewed_at;
      }
    } else if (art.status === 'submitted' || art.status === 'under_review') {
      pendingReviewCount++;
      if (!latestSubmittedAt || new Date(art.submitted_at) > new Date(latestSubmittedAt)) {
        latestSubmittedAt = art.submitted_at;
      }
    } else if (art.status === 'revise' || art.status === 'rejected') {
      needsRevisionCount++;
    }
  });

  return {
    studentId,
    approvedCount,
    pendingReviewCount,
    needsRevisionCount,
    latestApprovedAt,
    latestSubmittedAt,
    parentCanDownloadApproved: false // Hardcoded rule for beta
  };
}
