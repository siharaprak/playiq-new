/**
 * Sprint 5B — Orphan Draft Cleanup
 * 
 * Functions to clean up draft artifacts that were never finalized and
 * their associated storage objects (if any). Only touches artifacts older than 24h.
 */
import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function cleanupExpiredDraftArtifacts(dryRun = true, olderThanHours = 24) {
  // Enforce absolute minimum floor of 24 hours to prevent aggressive sweeping
  const effectiveHours = Math.max(olderThanHours, 24);
  const timeThreshold = new Date(Date.now() - effectiveHours * 60 * 60 * 1000).toISOString();

  // Find expired drafts
  const { data: drafts, error } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('id, storage_bucket, storage_path')
    .eq('status', 'draft')
    .lt('created_at', timeThreshold);

  if (error) {
    throw new Error(`Failed to list expired drafts: ${error.message}`);
  }

  if (!drafts || drafts.length === 0) {
    return { deletedCount: 0, storageDeletedCount: 0 };
  }

  let storageDeletedCount = 0;
  let deletedCount = 0;

  for (const draft of drafts) {
    if (!dryRun && draft.storage_bucket && draft.storage_path) {
      // Attempt to delete from storage first
      const { error: storageError } = await supabaseAdmin
        .storage
        .from(draft.storage_bucket)
        .remove([draft.storage_path]);
        
      if (!storageError) {
        storageDeletedCount++;
      } else {
        console.warn(`[Cleanup] Failed to delete storage object ${draft.storage_path}:`, storageError.message);
      }
    } else if (dryRun && draft.storage_path) {
      storageDeletedCount++; // count for dry run
    }

    if (!dryRun) {
      const { error: dbError } = await supabaseAdmin
        .from('proof_artifact_submissions')
        .delete()
        .eq('id', draft.id);

      if (!dbError) {
        deletedCount++;
      } else {
        console.warn(`[Cleanup] Failed to delete DB row ${draft.id}:`, dbError.message);
      }
    } else {
      deletedCount++; // count for dry run
    }
  }

  return { deletedCount, storageDeletedCount, dryRun };
}
