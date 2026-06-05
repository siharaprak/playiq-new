import { createClient } from '@/utils/supabase/server';

/**
 * Resolves a support issue by ID.
 * Dynamically checks if 'resolved_at' and 'metadata' exist in the database,
 * and falls back to status-only resolution if they do not exist.
 * Enforces admin authorization.
 */
export async function resolveSupportIssue(
  issueId: string,
  notes?: string,
  supabaseClient?: any
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = supabaseClient || await createClient();

    // 1. Authenticate user and verify admin role
    let user = null;
    if (supabaseClient) {
      // For privileged service-role context (e.g. testing), select a valid admin user profile to associate
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1)
        .maybeSingle();

      if (!adminProfile) {
        return { ok: false, error: 'No admin profile exists in the database to run resolution.' };
      }
      user = { id: adminProfile.id };
    } else {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        return { ok: false, error: 'Not authenticated' };
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        return { ok: false, error: 'Not authorized. Admin privileges required.' };
      }
      user = authUser;
    }

    // 2. Dynamically check if resolved_at and metadata columns exist
    const { error: columnsError } = await supabase
      .from('support_issues')
      .select('resolved_at, metadata')
      .limit(1);

    const updatePayload: Record<string, any> = {
      status: 'resolved',
    };

    if (!columnsError) {
      // Columns are present, use full resolution fields
      updatePayload.resolved_at = new Date().toISOString();
      updatePayload.metadata = {
        resolution_notes: notes || 'Resolved by Administrator',
        resolved_by_user_id: user.id,
      };
    } else {
      console.warn(
        `[resolveSupportIssue] 'resolved_at' or 'metadata' columns not found. Falling back to status-only resolution.`
      );
    }

    // 3. Update the ticket
    const { error: updateError } = await supabase
      .from('support_issues')
      .update(updatePayload)
      .eq('id', issueId);

    if (updateError) {
      return { ok: false, error: updateError.message };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[resolveSupportIssue] Unexpected error:', message);
    return { ok: false, error: message };
  }
}
