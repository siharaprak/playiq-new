import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getTutorBuildMilestoneStatus } from '@/lib/tutor/tutor-course-link';

export interface ParentTutorBuildSummary {
  status: string;
  completionPercent: number;
  hasProfile: boolean;
  hasVersion: boolean;
  hasKnowledgeFile: boolean;
  hasTestedTutor: boolean;
  betaComplete: boolean;
  lastUpdatedAt: string | null;
  milestoneLabel: string;
}

/**
 * Returns a parent-safe custom tutor build progress summary for a linked student child.
 * Strictly verifies the parent-child link before returning any data.
 * Whitelists output fields, ensuring no instructions, filenames, URLs, or prompts are exposed.
 */
export async function getParentTutorBuildSummary(
  parentId: string,
  studentId: string
): Promise<ParentTutorBuildSummary | null> {
  try {
    // 1. Verify parent-child link
    const { data: link, error: linkError } = await supabaseAdmin
      .from('parent_child_links')
      .select('id')
      .eq('parent_id', parentId)
      .eq('student_id', studentId)
      .limit(1)
      .maybeSingle();

    if (linkError || !link) {
      console.warn(`[getParentTutorBuildSummary] Unauthorized parent access attempt by ${parentId} for child ${studentId}`);
      return null;
    }

    // 2. Fetch the read-only milestone status
    const milestone = await getTutorBuildMilestoneStatus(studentId);

    // 3. Fetch the profile last updated at time (whitelisted query)
    const { data: profile } = await supabaseAdmin
      .from('tutor_profiles')
      .select('updated_at')
      .eq('student_id', studentId)
      .limit(1)
      .maybeSingle();

    // 4. Calculate parent-safe fields
    let completionPercent = 0;
    if (milestone.status === 'profile_created') completionPercent = 25;
    else if (milestone.status === 'version_created') completionPercent = 50;
    else if (milestone.status === 'tested') completionPercent = 75;
    else if (milestone.status === 'complete') completionPercent = 100;

    // Beta completion requires profile, version, and testing
    const betaComplete = milestone.hasProfile && milestone.hasVersion && milestone.hasTestedTutor;

    return {
      status: milestone.status,
      completionPercent,
      hasProfile: milestone.hasProfile,
      hasVersion: milestone.hasVersion,
      hasKnowledgeFile: milestone.hasKnowledgeFile,
      hasTestedTutor: milestone.hasTestedTutor,
      betaComplete,
      lastUpdatedAt: profile?.updated_at ?? null,
      milestoneLabel: milestone.milestoneLabel,
    };
  } catch (err) {
    console.error('[getParentTutorBuildSummary] error:', err);
    return null;
  }
}
