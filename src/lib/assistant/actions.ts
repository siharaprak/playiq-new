'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { logAssistantUpdateEvent } from '@/lib/events/learning-events';
import { AssistantProfileInputSchema, AssistantVersionInputSchema } from './schemas';
import type {
  AssistantProfile,
  AssistantVersion,
  KnowledgeFile,
  AssistantProfileInput,
  AssistantVersionInput,
} from './types';

// ---------------------------------------------------------------------------
// Shared result type
// ---------------------------------------------------------------------------
type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

// ---------------------------------------------------------------------------
// Read: Get assistant profile
// ---------------------------------------------------------------------------
/**
 * Fetches the authenticated student's assistant profile.
 * Returns null if no profile exists yet.
 */
export async function getAssistantProfile(): Promise<ActionResult<AssistantProfile | null>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('assistant_profiles')
      .select('*')
      .eq('student_id', user.id)
      .limit(1)
      .maybeSingle();

    if (error) return { ok: false, error: error.message };

    return { ok: true, data: data as AssistantProfile | null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[getAssistantProfile] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Read: Get assistant profile with current version
// ---------------------------------------------------------------------------
/**
 * Fetches the profile AND its current version in one call.
 * Returns null when no profile exists.
 */
export async function getAssistantProfileWithVersion(): Promise<
  ActionResult<{ profile: AssistantProfile; currentVersion: AssistantVersion | null } | null>
> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // 1. Fetch the profile
    const { data: profile, error: profileError } = await supabase
      .from('assistant_profiles')
      .select('*')
      .eq('student_id', user.id)
      .limit(1)
      .maybeSingle();

    if (profileError) return { ok: false, error: profileError.message };
    if (!profile) return { ok: true, data: null };

    // 2. Fetch the current version (if one is set)
    let currentVersion: AssistantVersion | null = null;

    if (profile.current_version_id) {
      const { data: version, error: versionError } = await supabase
        .from('assistant_versions')
        .select('*')
        .eq('id', profile.current_version_id)
        .single();

      if (versionError) {
        console.error('[getAssistantProfileWithVersion] version fetch error:', versionError.message);
      } else {
        currentVersion = version as AssistantVersion;
      }
    }

    return {
      ok: true,
      data: { profile: profile as AssistantProfile, currentVersion },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[getAssistantProfileWithVersion] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Create: New assistant profile + initial version
// ---------------------------------------------------------------------------
/**
 * Creates a new assistant profile for the authenticated student.
 * Also bootstraps an initial version (v1) with empty system prompt.
 */
export async function createAssistantProfile(
  input: AssistantProfileInput
): Promise<ActionResult<AssistantProfile>> {
  try {
    // 1. Validate input
    const parsed = AssistantProfileInputSchema.parse(input);

    // 2. Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // 3. Check for existing profile (one per student)
    const { data: existing } = await supabase
      .from('assistant_profiles')
      .select('id')
      .eq('student_id', user.id)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return { ok: false, error: 'An assistant profile already exists for this student' };
    }

    // 4. Insert the profile
    const { data: profile, error: profileError } = await supabase
      .from('assistant_profiles')
      .insert({
        student_id: user.id,
        name: parsed.name,
        persona_config: parsed.persona_config,
        metadata: parsed.metadata ?? {},
        status: 'draft',
      })
      .select('*')
      .single();

    if (profileError || !profile) {
      return { ok: false, error: `Failed to create profile: ${profileError?.message ?? 'Unknown'}` };
    }

    // 5. Create the initial version (v1)
    const { data: version, error: versionError } = await supabase
      .from('assistant_versions')
      .insert({
        assistant_profile_id: profile.id,
        version_number: 1,
        system_prompt: '',
        tools_config: { knowledge_file_ids: [] },
        change_summary: 'Initial version',
        created_by: user.id,
      })
      .select('id')
      .single();

    if (versionError || !version) {
      console.error('[createAssistantProfile] version creation error:', versionError?.message);
      return { ok: true, data: profile as AssistantProfile };
    }

    // 6. Point profile to the initial version
    const { data: updatedProfile, error: updateError } = await supabase
      .from('assistant_profiles')
      .update({ current_version_id: version.id })
      .eq('id', profile.id)
      .select('*')
      .single();

    if (updateError) {
      console.error('[createAssistantProfile] version link error:', updateError.message);
    }

    // 7. Telemetry logging
    logAssistantUpdateEvent({
      studentId: user.id,
      eventType: 'assistant_profile_created',
      targetId: profile.id,
      metadata: { name: parsed.name },
    }).catch((e) => console.error('[createAssistantProfile] event log error:', e));

    revalidatePath('/student/modules/10');

    return { ok: true, data: (updatedProfile ?? profile) as AssistantProfile };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[createAssistantProfile] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Update: Modify assistant profile fields
// ---------------------------------------------------------------------------
/**
 * Updates an existing assistant profile. Verifies ownership.
 */
export async function updateAssistantProfile(
  profileId: string,
  input: Partial<AssistantProfileInput>
): Promise<ActionResult<AssistantProfile>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // 1. Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('assistant_profiles')
      .select('id, student_id')
      .eq('id', profileId)
      .single();

    if (fetchError || !existing) {
      return { ok: false, error: 'Assistant profile not found' };
    }
    if (existing.student_id !== user.id) {
      return { ok: false, error: 'Not authorized to update this profile' };
    }

    // 2. Build update payload
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (input.name !== undefined) updatePayload.name = input.name;
    if (input.persona_config !== undefined) updatePayload.persona_config = input.persona_config;
    if (input.metadata !== undefined) updatePayload.metadata = input.metadata;

    // 3. Perform update
    const { data: updated, error: updateError } = await supabase
      .from('assistant_profiles')
      .update(updatePayload)
      .eq('id', profileId)
      .select('*')
      .single();

    if (updateError || !updated) {
      return { ok: false, error: `Failed to update profile: ${updateError?.message ?? 'Unknown'}` };
    }

    // 4. Telemetry logging
    logAssistantUpdateEvent({
      studentId: user.id,
      eventType: 'assistant_profile_updated',
      targetId: profileId,
      metadata: { updatedFields: Object.keys(input) },
    }).catch((e) => console.error('[updateAssistantProfile] event log error:', e));

    revalidatePath('/student/modules/10');

    return { ok: true, data: updated as AssistantProfile };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[updateAssistantProfile] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Create: New assistant version
// ---------------------------------------------------------------------------
/**
 * Creates a new version for the given assistant profile.
 */
export async function createAssistantVersion(
  profileId: string,
  input: AssistantVersionInput
): Promise<ActionResult<AssistantVersion>> {
  try {
    // 1. Validate input
    const parsed = AssistantVersionInputSchema.parse(input);

    // 2. Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // 3. Verify profile ownership
    const { data: profile, error: profileError } = await supabase
      .from('assistant_profiles')
      .select('id, student_id')
      .eq('id', profileId)
      .single();

    if (profileError || !profile) {
      return { ok: false, error: 'Assistant profile not found' };
    }
    if (profile.student_id !== user.id) {
      return { ok: false, error: 'Not authorized to create versions for this profile' };
    }

    // 4. Get current max version number
    const { data: latestVersions, error: versionsError } = await supabase
      .from('assistant_versions')
      .select('version_number')
      .eq('assistant_profile_id', profileId)
      .order('version_number', { ascending: false })
      .limit(1);

    if (versionsError) {
      return { ok: false, error: `Failed to fetch versions: ${versionsError.message}` };
    }

    const nextVersionNumber = (latestVersions?.[0]?.version_number ?? 0) + 1;

    // 5. Insert new version
    const { data: version, error: insertError } = await supabase
      .from('assistant_versions')
      .insert({
        assistant_profile_id: profileId,
        version_number: nextVersionNumber,
        system_prompt: parsed.system_prompt,
        tools_config: parsed.tools_config,
        change_summary: parsed.change_summary,
        created_by: user.id,
      })
      .select('*')
      .single();

    if (insertError || !version) {
      return { ok: false, error: `Failed to create version: ${insertError?.message ?? 'Unknown'}` };
    }

    // 6. Update profile to point to the new version and unlock/activate it
    const { error: updateError } = await supabase
      .from('assistant_profiles')
      .update({
        current_version_id: version.id,
        status: 'active', // Update status to active when a version is successfully created
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId);

    if (updateError) {
      console.error('[createAssistantVersion] profile update error:', updateError.message);
    }

    // 7. Telemetry logging
    logAssistantUpdateEvent({
      studentId: user.id,
      eventType: 'assistant_version_created',
      targetId: version.id,
      metadata: {
        profileId,
        versionNumber: nextVersionNumber,
        changeSummary: parsed.change_summary,
      },
    }).catch((e) => console.error('[createAssistantVersion] event log error:', e));

    revalidatePath('/student/modules/10');

    return { ok: true, data: version as AssistantVersion };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[createAssistantVersion] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Read: List assistant versions
// ---------------------------------------------------------------------------
/**
 * Lists all versions for an assistant profile, newest first.
 */
export async function getAssistantVersions(
  profileId: string
): Promise<ActionResult<AssistantVersion[]>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('assistant_versions')
      .select('*')
      .eq('assistant_profile_id', profileId)
      .order('version_number', { ascending: false });

    if (error) return { ok: false, error: error.message };

    return { ok: true, data: (data ?? []) as AssistantVersion[] };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[getAssistantVersions] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Read: List knowledge files for an assistant
// ---------------------------------------------------------------------------
/**
 * Lists all knowledge files attached to an assistant profile, newest first.
 */
export async function getAssistantKnowledgeFiles(
  profileId: string
): Promise<ActionResult<KnowledgeFile[]>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('knowledge_files')
      .select('*')
      .eq('assistant_profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) return { ok: false, error: error.message };

    return { ok: true, data: (data ?? []) as KnowledgeFile[] };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[getAssistantKnowledgeFiles] error:', message);
    return { ok: false, error: message };
  }
}
