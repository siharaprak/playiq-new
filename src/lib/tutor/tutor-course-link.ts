import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { MODULES } from '@/lib/constants';

export interface TutorMilestoneStatus {
  courseId: string | null;
  moduleId: string;
  hasProfile: boolean;
  hasVersion: boolean;
  hasKnowledgeFile: boolean;
  hasTestedTutor: boolean;
  status: 'not_started' | 'profile_created' | 'version_created' | 'tested' | 'complete';
  milestoneLabel: string;
}

/**
 * Returns the milestone connection status for a student's custom tutor builder progress.
 * This function is completely read-only and does NOT write to student_node_progress
 * or modify gating.
 */
export async function getTutorBuildMilestoneStatus(
  studentId: string
): Promise<TutorMilestoneStatus> {
  const result: TutorMilestoneStatus = {
    courseId: null,
    moduleId: MODULES.MODULE_9_ID,
    hasProfile: false,
    hasVersion: false,
    hasKnowledgeFile: false,
    hasTestedTutor: false,
    status: 'not_started',
    milestoneLabel: 'Module 9: Custom Tutor Milestone',
  };

  try {
    // 1. Get Course ID from enrollment
    const { data: enrollment } = await supabaseAdmin
      .from('enrollments')
      .select('course_id')
      .eq('student_id', studentId)
      .limit(1)
      .maybeSingle();

    if (enrollment) {
      result.courseId = enrollment.course_id;
    }

    // 2. Fetch tutor profile
    const { data: profile } = await supabaseAdmin
      .from('tutor_profiles')
      .select('id, status')
      .eq('student_id', studentId)
      .limit(1)
      .maybeSingle();

    if (!profile) {
      return result;
    }

    result.hasProfile = true;
    result.status = 'profile_created';

    // 3. Fetch version count
    const { count: versionCount } = await supabaseAdmin
      .from('tutor_versions')
      .select('id', { count: 'exact', head: true })
      .eq('tutor_profile_id', profile.id);

    if (versionCount && versionCount > 0) {
      result.hasVersion = true;
      result.status = 'version_created';
    }

    // 4. Fetch knowledge files count (only count files active on profile)
    const { count: filesCount } = await supabaseAdmin
      .from('knowledge_files')
      .select('id', { count: 'exact', head: true })
      .eq('tutor_profile_id', profile.id);

    if (filesCount && filesCount > 0) {
      result.hasKnowledgeFile = true;
    }

    // 5. Check if user has tested their tutor style (query events_log for 'tutor_test_attempt')
    const { data: testEvent, error: eventError } = await supabaseAdmin
      .from('events_log')
      .select('id')
      .eq('student_id', studentId)
      .eq('event_type', 'tutor_profile_updated')
      .limit(1);

    // Filter test events safely in JS to avoid complex jsonb query syntax
    let hasTested = false;
    if (!eventError && testEvent) {
      const { data: allTutorEvents } = await supabaseAdmin
        .from('events_log')
        .select('metadata')
        .eq('student_id', studentId)
        .eq('event_type', 'tutor_profile_updated');

      hasTested = allTutorEvents?.some(
        (e: any) => e.metadata?.action === 'tutor_test_attempt'
      ) ?? false;
    }

    if (hasTested) {
      result.hasTestedTutor = true;
      result.status = 'tested';
    }

    // 6. Complete status checks
    if (profile.status === 'active' || profile.status === 'published') {
      result.status = 'complete';
    }

    return result;
  } catch (err) {
    console.error('[getTutorBuildMilestoneStatus] error:', err);
    return result;
  }
}
