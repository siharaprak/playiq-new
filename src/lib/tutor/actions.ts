'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { logTutorUpdateEvent } from '@/lib/events/learning-events';
import { TutorProfileInputSchema, TutorVersionInputSchema } from './schemas';
import type {
  TutorProfile,
  TutorVersion,
  KnowledgeFile,
  TutorProfileInput,
  TutorVersionInput,
  TutorDoctrineConfig,
  TutorInstructions,
} from './types';

// ---------------------------------------------------------------------------
// Shared result type — mirrors the ok/error pattern used across the codebase
// ---------------------------------------------------------------------------

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

// ---------------------------------------------------------------------------
// Read: Get tutor profile
// ---------------------------------------------------------------------------

/**
 * Fetches the authenticated student's tutor profile (single profile per student).
 * Returns null if no profile exists yet.
 */
export async function getTutorProfile(): Promise<ActionResult<TutorProfile | null>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('tutor_profiles')
      .select('*')
      .eq('student_id', user.id)
      .limit(1)
      .maybeSingle();

    if (error) return { ok: false, error: error.message };

    return { ok: true, data: data as TutorProfile | null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[getTutorProfile] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Read: Get tutor profile with current version
// ---------------------------------------------------------------------------

/**
 * Fetches the profile AND its current version in one call.
 * Returns null when no profile exists.
 */
export async function getTutorProfileWithVersion(): Promise<
  ActionResult<{ profile: TutorProfile; currentVersion: TutorVersion | null } | null>
> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // 1. Fetch the profile
    const { data: profile, error: profileError } = await supabase
      .from('tutor_profiles')
      .select('*')
      .eq('student_id', user.id)
      .limit(1)
      .maybeSingle();

    if (profileError) return { ok: false, error: profileError.message };
    if (!profile) return { ok: true, data: null };

    // 2. Fetch the current version (if one is set)
    let currentVersion: TutorVersion | null = null;

    if (profile.current_version_id) {
      const { data: version, error: versionError } = await supabase
        .from('tutor_versions')
        .select('*')
        .eq('id', profile.current_version_id)
        .single();

      if (versionError) {
        console.error('[getTutorProfileWithVersion] version fetch error:', versionError.message);
        // Non-fatal — return profile without version
      } else {
        currentVersion = version as TutorVersion;
      }
    }

    return {
      ok: true,
      data: { profile: profile as TutorProfile, currentVersion },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[getTutorProfileWithVersion] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Create: New tutor profile + initial version
// ---------------------------------------------------------------------------

/**
 * Creates a new tutor profile for the authenticated student.
 * Also bootstraps an initial version (v1) with empty instructions.
 * Only one profile per student is allowed.
 */
export async function createTutorProfile(
  input: TutorProfileInput
): Promise<ActionResult<TutorProfile>> {
  try {
    // 1. Validate input
    const parsed = TutorProfileInputSchema.parse(input);

    // 2. Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // 3. Check for existing profile (one per student)
    const { data: existing } = await supabase
      .from('tutor_profiles')
      .select('id')
      .eq('student_id', user.id)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return { ok: false, error: 'A tutor profile already exists for this student' };
    }

    // 3b. Look up the student's first enrolled course (if any)
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('student_id', user.id)
      .limit(1)
      .maybeSingle();

    const courseId = enrollment?.course_id ?? null;

    // 4. Insert the profile
    const { data: profile, error: profileError } = await supabase
      .from('tutor_profiles')
      .insert({
        student_id: user.id,
        course_id: courseId,
        name: parsed.name,
        doctrine_config: parsed.doctrine_config,
        fingerprint_snapshot: parsed.fingerprint_snapshot ?? {},
        status: 'draft',
      })
      .select('*')
      .single();

    if (profileError || !profile) {
      return { ok: false, error: `Failed to create profile: ${profileError?.message ?? 'Unknown'}` };
    }

    // 5. Create the initial version (v1)
    const { data: version, error: versionError } = await supabase
      .from('tutor_versions')
      .insert({
        tutor_profile_id: profile.id,
        version_number: 1,
        instructions: { instruction_set: '', rules: [] },
        knowledge_file_ids: [],
        change_summary: 'Initial version',
        created_by: user.id,
      })
      .select('id')
      .single();

    if (versionError || !version) {
      console.error('[createTutorProfile] version creation error:', versionError?.message);
      // Profile was created but version failed — still return profile
      return { ok: true, data: profile as TutorProfile };
    }

    // 6. Point profile to the initial version
    const { data: updatedProfile, error: updateError } = await supabase
      .from('tutor_profiles')
      .update({ current_version_id: version.id })
      .eq('id', profile.id)
      .select('*')
      .single();

    if (updateError) {
      console.error('[createTutorProfile] version link error:', updateError.message);
    }

    // 7. Non-blocking event logging
    logTutorUpdateEvent({
      studentId: user.id,
      eventType: 'tutor_profile_created',
      targetId: profile.id,
      metadata: { name: parsed.name },
    }).catch((e) => console.error('[createTutorProfile] event log error:', e));

    revalidatePath('/student/modules/9');

    return { ok: true, data: (updatedProfile ?? profile) as TutorProfile };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[createTutorProfile] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Update: Modify tutor profile fields
// ---------------------------------------------------------------------------

/**
 * Updates an existing tutor profile. Only provided fields are changed.
 * Verifies ownership before modifying.
 */
export async function updateTutorProfile(
  profileId: string,
  input: Partial<TutorProfileInput>
): Promise<ActionResult<TutorProfile>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // 1. Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('tutor_profiles')
      .select('id, student_id')
      .eq('id', profileId)
      .single();

    if (fetchError || !existing) {
      return { ok: false, error: 'Tutor profile not found' };
    }
    if (existing.student_id !== user.id) {
      return { ok: false, error: 'Not authorized to update this profile' };
    }

    // 2. Build update payload — only include provided fields
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (input.name !== undefined) updatePayload.name = input.name;
    if (input.doctrine_config !== undefined) updatePayload.doctrine_config = input.doctrine_config;
    if (input.fingerprint_snapshot !== undefined) updatePayload.fingerprint_snapshot = input.fingerprint_snapshot;

    // 3. Perform the update
    const { data: updated, error: updateError } = await supabase
      .from('tutor_profiles')
      .update(updatePayload)
      .eq('id', profileId)
      .select('*')
      .single();

    if (updateError || !updated) {
      return { ok: false, error: `Failed to update profile: ${updateError?.message ?? 'Unknown'}` };
    }

    // 4. Non-blocking event logging
    logTutorUpdateEvent({
      studentId: user.id,
      eventType: 'tutor_profile_updated',
      targetId: profileId,
      metadata: { updatedFields: Object.keys(input) },
    }).catch((e) => console.error('[updateTutorProfile] event log error:', e));

    revalidatePath('/student/modules/9');

    return { ok: true, data: updated as TutorProfile };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[updateTutorProfile] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Create: New tutor version
// ---------------------------------------------------------------------------

/**
 * Creates a new version for the given tutor profile.
 * Auto-increments version_number and updates the profile's current_version_id.
 */
export async function createTutorVersion(
  profileId: string,
  input: TutorVersionInput
): Promise<ActionResult<TutorVersion>> {
  try {
    // 1. Validate input
    const parsed = TutorVersionInputSchema.parse(input);

    // 2. Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // 3. Verify profile ownership
    const { data: profile, error: profileError } = await supabase
      .from('tutor_profiles')
      .select('id, student_id')
      .eq('id', profileId)
      .single();

    if (profileError || !profile) {
      return { ok: false, error: 'Tutor profile not found' };
    }
    if (profile.student_id !== user.id) {
      return { ok: false, error: 'Not authorized to create versions for this profile' };
    }

    // 4. Get the current max version number
    const { data: latestVersions, error: versionsError } = await supabase
      .from('tutor_versions')
      .select('version_number')
      .eq('tutor_profile_id', profileId)
      .order('version_number', { ascending: false })
      .limit(1);

    if (versionsError) {
      return { ok: false, error: `Failed to fetch versions: ${versionsError.message}` };
    }

    const nextVersionNumber = (latestVersions?.[0]?.version_number ?? 0) + 1;

    // 5. Insert the new version
    const { data: version, error: insertError } = await supabase
      .from('tutor_versions')
      .insert({
        tutor_profile_id: profileId,
        version_number: nextVersionNumber,
        instructions: parsed.instructions,
        knowledge_file_ids: parsed.knowledge_file_ids,
        change_summary: parsed.change_summary,
        created_by: user.id,
      })
      .select('*')
      .single();

    if (insertError || !version) {
      return { ok: false, error: `Failed to create version: ${insertError?.message ?? 'Unknown'}` };
    }

    // 6. Update profile to point to the new version
    const { error: updateError } = await supabase
      .from('tutor_profiles')
      .update({
        current_version_id: version.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId);

    if (updateError) {
      console.error('[createTutorVersion] profile update error:', updateError.message);
    }

    // 7. Non-blocking event logging
    logTutorUpdateEvent({
      studentId: user.id,
      eventType: 'tutor_version_created',
      targetId: version.id,
      metadata: {
        profileId,
        versionNumber: nextVersionNumber,
        changeSummary: parsed.change_summary,
      },
    }).catch((e) => console.error('[createTutorVersion] event log error:', e));

    revalidatePath('/student/modules/9');

    return { ok: true, data: version as TutorVersion };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[createTutorVersion] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Read: List tutor versions
// ---------------------------------------------------------------------------

/**
 * Lists all versions for a tutor profile, newest first.
 */
export async function getTutorVersions(
  profileId: string
): Promise<ActionResult<TutorVersion[]>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('tutor_versions')
      .select('*')
      .eq('tutor_profile_id', profileId)
      .order('version_number', { ascending: false });

    if (error) return { ok: false, error: error.message };

    return { ok: true, data: (data ?? []) as TutorVersion[] };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[getTutorVersions] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Read: List knowledge files for a profile
// ---------------------------------------------------------------------------

/**
 * Lists all knowledge files attached to a tutor profile, newest first.
 */
export async function getKnowledgeFiles(
  profileId: string
): Promise<ActionResult<KnowledgeFile[]>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('knowledge_files')
      .select('*')
      .eq('tutor_profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) return { ok: false, error: error.message };

    return { ok: true, data: (data ?? []) as KnowledgeFile[] };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[getKnowledgeFiles] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Activate: Transition profile from 'draft' → 'active'
// ---------------------------------------------------------------------------

/**
 * Activates a tutor profile after validating all completion criteria:
 * - Profile has a non-empty name
 * - Profile has a non-empty purpose in doctrine_config
 * - Profile has at least 1 version
 * - The latest version has non-empty instructions.instruction_set
 */
export async function activateTutorProfile(
  profileId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // 1. Fetch the profile
    const { data: profile, error: profileError } = await supabase
      .from('tutor_profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (profileError || !profile) {
      return { ok: false, error: 'Tutor profile not found' };
    }

    // 2. Verify ownership
    if (profile.student_id !== user.id) {
      return { ok: false, error: 'Not authorized to activate this profile' };
    }

    // 3. Validate completion criteria
    if (!profile.name || profile.name.trim() === '') {
      return { ok: false, error: 'Tutor must have a name before activation' };
    }

    const doctrine = profile.doctrine_config as TutorDoctrineConfig | null;
    if (!doctrine?.purpose || doctrine.purpose.trim() === '') {
      return { ok: false, error: 'Tutor must have a purpose defined in doctrine before activation' };
    }

    // 4. Check for at least 1 version
    const { data: versions, error: versionsError } = await supabase
      .from('tutor_versions')
      .select('*')
      .eq('tutor_profile_id', profileId)
      .order('version_number', { ascending: false });

    if (versionsError) {
      return { ok: false, error: `Failed to fetch versions: ${versionsError.message}` };
    }

    if (!versions || versions.length === 0) {
      return { ok: false, error: 'Tutor must have at least 1 version before activation' };
    }

    // 5. Check the latest version has non-empty instructions
    const latestVersion = versions[0];
    const instructions = latestVersion.instructions as TutorInstructions | null;
    if (!instructions?.instruction_set || instructions.instruction_set.trim() === '') {
      return { ok: false, error: 'Latest version must have non-empty instructions before activation' };
    }

    // 6. Update status to 'active'
    const { error: updateError } = await supabase
      .from('tutor_profiles')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('id', profileId);

    if (updateError) {
      return { ok: false, error: `Failed to activate profile: ${updateError.message}` };
    }

    // 7. Non-blocking event logging
    logTutorUpdateEvent({
      studentId: user.id,
      eventType: 'tutor_profile_updated',
      targetId: profileId,
      metadata: { action: 'activated' },
    }).catch((e) => console.error('[activateTutorProfile] event log error:', e));

    revalidatePath('/student/modules/9');

    return { ok: true, data: undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[activateTutorProfile] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Publish: Transition profile from 'active' → 'published'
// ---------------------------------------------------------------------------

/**
 * Publishes a tutor profile after validating:
 * - Profile is currently 'active'
 * - Profile has at least 1 knowledge file attached
 */
export async function publishTutorProfile(
  profileId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // 1. Fetch the profile
    const { data: profile, error: profileError } = await supabase
      .from('tutor_profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (profileError || !profile) {
      return { ok: false, error: 'Tutor profile not found' };
    }

    // 2. Verify ownership AND active status
    if (profile.student_id !== user.id) {
      return { ok: false, error: 'Not authorized to publish this profile' };
    }

    if (profile.status !== 'active') {
      return { ok: false, error: 'Profile must be active before it can be published' };
    }

    // 3. Check for at least 1 knowledge file
    const { data: knowledgeFiles, error: filesError } = await supabase
      .from('knowledge_files')
      .select('id')
      .eq('tutor_profile_id', profileId)
      .limit(1);

    if (filesError) {
      return { ok: false, error: `Failed to check knowledge files: ${filesError.message}` };
    }

    if (!knowledgeFiles || knowledgeFiles.length === 0) {
      return { ok: false, error: 'Tutor must have at least 1 knowledge file before publishing' };
    }

    // 4. Update status to 'published'
    const { error: updateError } = await supabase
      .from('tutor_profiles')
      .update({ status: 'published', updated_at: new Date().toISOString() })
      .eq('id', profileId);

    if (updateError) {
      return { ok: false, error: `Failed to publish profile: ${updateError.message}` };
    }

    // 5. Non-blocking event logging
    logTutorUpdateEvent({
      studentId: user.id,
      eventType: 'tutor_profile_updated',
      targetId: profileId,
      metadata: { action: 'published' },
    }).catch((e) => console.error('[publishTutorProfile] event log error:', e));

    revalidatePath('/student/modules/9');

    return { ok: true, data: undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[publishTutorProfile] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Chat: Test Sandbox with Custom AI Tutor
// ---------------------------------------------------------------------------

/**
 * Sends a message sequence to the custom AI tutor and returns the AI's reply.
 * Uses the tutor's profile, doctrine config, instructions, and rules.
 */
export async function chatWithTutor(
  profileId: string,
  messages: { role: 'user' | 'model'; content: string }[]
): Promise<ActionResult<string>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // 1. Fetch tutor profile
    const { data: profile, error: profileError } = await supabase
      .from('tutor_profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (profileError || !profile) {
      return { ok: false, error: 'Tutor profile not found' };
    }

    if (profile.student_id !== user.id) {
      return { ok: false, error: 'Not authorized to chat with this tutor' };
    }

    // 2. Fetch current version
    let currentVersion: any = null;
    if (profile.current_version_id) {
      const { data: version } = await supabase
        .from('tutor_versions')
        .select('*')
        .eq('id', profile.current_version_id)
        .single();
      currentVersion = version;
    }

    // 3. Fetch knowledge files
    const { data: knowledgeFiles } = await supabase
      .from('knowledge_files')
      .select('*')
      .eq('tutor_profile_id', profileId);

    // 4. Construct system instruction
    const doctrine = profile.doctrine_config || {};
    const instructions = currentVersion?.instructions || {};

    let systemInstruction = `You are a custom AI Tutor designed by the student to help them learn.
Here is your persona profile:
- Name: ${profile.name}
- Core Purpose: ${doctrine.purpose || 'Help me learn'}
- Teaching Style: ${doctrine.teaching_style || 'Socratic'}
- Explanation Preferences: ${doctrine.explanation_preferences || 'Explain with analogies'}
- Subject Focus: ${doctrine.subject_focus || 'Curriculum concepts'}

`;

    if (instructions.instruction_set) {
      systemInstruction += `Core Instructions:
${instructions.instruction_set}

`;
    }

    if (instructions.rules && instructions.rules.length > 0) {
      systemInstruction += `Boundaries & Rules:
${instructions.rules.map((r: string, idx: number) => `${idx + 1}. ${r}`).join('\n')}

`;
    }

    if (knowledgeFiles && knowledgeFiles.length > 0) {
      systemInstruction += `Available Knowledge Files for Context (Reference these files when appropriate):
${knowledgeFiles.map((kf: any) => `- ${kf.file_name}`).join('\n')}

`;
    }

    // 5. Initialize Google Gen AI and call Gemini API
    const { GoogleGenAI } = await import('@google/genai');
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: 'AI API Key is not configured on the server' };
    }

    const ai = new GoogleGenAI({ apiKey });

    // Map history to Google Gen AI format
    const contents = messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents as any,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || '';
    return { ok: true, data: replyText };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[chatWithTutor] error:', message);
    return { ok: false, error: message };
  }
}

