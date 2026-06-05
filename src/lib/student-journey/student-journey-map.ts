import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';

export interface JourneyStep {
  stepNumber: number;
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt: string | null;
}

/**
 * Returns the 14-step student journey map status dynamically.
 * Read-only, no database mutations.
 */
export async function getStudentJourneyMap(studentId: string): Promise<JourneyStep[]> {
  const journey: JourneyStep[] = [
    {
      stepNumber: 1,
      id: 'account_created',
      title: 'Account Creation',
      description: 'Profile created on registration.',
      completed: false,
      completedAt: null,
    },
    {
      stepNumber: 2,
      id: 'username_configured',
      title: 'Username Configuration',
      description: 'Set a custom student username.',
      completed: false,
      completedAt: null,
    },
    {
      stepNumber: 3,
      id: 'course_enrolled',
      title: 'Course Enrollment',
      description: 'Active subscription or course enrollment verified.',
      completed: false,
      completedAt: null,
    },
    {
      stepNumber: 4,
      id: 'module_1_node_progress',
      title: 'Module 1 Activity Started',
      description: 'Logged node progress or skill validation in Module 1.',
      completed: false,
      completedAt: null,
    },
    {
      stepNumber: 5,
      id: 'discussion_participation',
      title: 'Community Discussion',
      description: 'Created a topic or reply on the Discussion Board.',
      completed: false,
      completedAt: null,
    },
    {
      stepNumber: 6,
      id: 'guided_ai_interaction',
      title: 'Guided AI Interaction',
      description: 'Requested AI explanations, hints, or practice quizzes.',
      completed: false,
      completedAt: null,
    },
    {
      stepNumber: 7,
      id: 'proof_artifact_uploaded',
      title: 'Proof Artifact Draft Uploaded',
      description: 'Submitted a proof of learning artifact draft for review.',
      completed: false,
      completedAt: null,
    },
    {
      stepNumber: 8,
      id: 'proof_artifact_approved',
      title: 'Proof Artifact Approved',
      description: 'Proof artifact has been reviewed and approved.',
      completed: false,
      completedAt: null,
    },
    {
      stepNumber: 9,
      id: 'module_9_tutor_created',
      title: 'Tutor Builder Configured',
      description: 'Initiated custom tutor profile config.',
      completed: false,
      completedAt: null,
    },
    {
      stepNumber: 10,
      id: 'module_9_tutor_versioned',
      title: 'Tutor Version Snapshot Created',
      description: 'Published initial snapshot version of customized tutor.',
      completed: false,
      completedAt: null,
    },
    {
      stepNumber: 11,
      id: 'module_10_assistant_created',
      title: 'Assistant Builder Configured',
      description: 'Initiated custom assistant profile in builder tab.',
      completed: false,
      completedAt: null,
    },
    {
      stepNumber: 12,
      id: 'module_10_assistant_versioned',
      title: 'Assistant Version Snapshot Created',
      description: 'Published initial version snapshot of custom assistant.',
      completed: false,
      completedAt: null,
    },
    {
      stepNumber: 13,
      id: 'module_10_assistant_tested',
      title: 'Assistant Sandbox Test Attempted',
      description: 'Tested the customized assistant inside sandbox workspace.',
      completed: false,
      completedAt: null,
    },
    {
      stepNumber: 14,
      id: 'assistant_beta_completed',
      title: 'Assistant Beta Completion',
      description: 'Completed and finalized the AI Assistant beta cycle.',
      completed: false,
      completedAt: null,
    },
  ];

  try {
    // Step 1 & 2: Profile checks
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('created_at, username')
      .eq('id', studentId)
      .single();

    if (profile) {
      journey[0].completed = true;
      journey[0].completedAt = profile.created_at || null;

      if (profile.username) {
        journey[1].completed = true;
        journey[1].completedAt = profile.created_at || null;
      }
    }

    // Step 3: Enrollment check
    const { data: enrollment } = await supabaseAdmin
      .from('enrollments')
      .select('created_at')
      .eq('student_id', studentId)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();

    if (enrollment) {
      journey[2].completed = true;
      journey[2].completedAt = enrollment.created_at || null;
    }

    // Step 4: Module 1 progress
    const { data: progress } = await supabaseAdmin
      .from('student_node_progress')
      .select('created_at')
      .eq('student_id', studentId)
      .limit(1)
      .maybeSingle();

    if (progress) {
      journey[3].completed = true;
      journey[3].completedAt = progress.created_at || null;
    }

    // Step 5: Discussion topic/reply check
    const [{ data: topic }, { data: reply }] = await Promise.all([
      supabaseAdmin.from('discussion_topics').select('created_at').eq('author_id', studentId).limit(1).maybeSingle(),
      supabaseAdmin.from('discussion_replies').select('created_at').eq('author_id', studentId).limit(1).maybeSingle(),
    ]);

    const discDate = topic?.created_at || reply?.created_at;
    if (discDate) {
      journey[4].completed = true;
      journey[4].completedAt = discDate;
    }

    // Step 6: Guided AI events check
    const { data: aiEvent } = await supabaseAdmin
      .from('events_log')
      .select('created_at')
      .eq('student_id', studentId)
      .eq('event_type', 'guided_ai_used')
      .limit(1)
      .maybeSingle();

    if (aiEvent) {
      journey[5].completed = true;
      journey[5].completedAt = aiEvent.created_at || null;
    }

    // Step 7 & 8: Proof checks
    const { data: proof } = await supabaseAdmin
      .from('proof_artifact_submissions')
      .select('status, created_at, updated_at')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (proof) {
      journey[6].completed = true;
      journey[6].completedAt = proof.created_at || null;

      if (proof.status === 'approved') {
        journey[7].completed = true;
        journey[7].completedAt = proof.updated_at || null;
      }
    }

    // Step 9 & 10: Tutor profile and version checks
    const { data: tutor } = await supabaseAdmin
      .from('tutor_profiles')
      .select('id, current_version_id, created_at')
      .eq('student_id', studentId)
      .limit(1)
      .maybeSingle();

    if (tutor) {
      journey[8].completed = true;
      journey[8].completedAt = tutor.created_at || null;

      if (tutor.current_version_id) {
        journey[9].completed = true;
        journey[9].completedAt = tutor.created_at || null;
      }
    }

    // Step 11, 12, 13, 14: Assistant builder checks
    const { data: assistant } = await supabaseAdmin
      .from('assistant_profiles')
      .select('id, current_version_id, status, metadata, created_at, updated_at')
      .eq('student_id', studentId)
      .limit(1)
      .maybeSingle();

    if (assistant) {
      journey[10].completed = true;
      journey[10].completedAt = assistant.created_at || null;

      if (assistant.current_version_id) {
        journey[11].completed = true;
        journey[11].completedAt = assistant.created_at || null;
      }

      // Check if test attempts recorded
      const { data: testEvent } = await supabaseAdmin
        .from('events_log')
        .select('created_at')
        .eq('student_id', studentId)
        .eq('event_type', 'assistant_profile_updated')
        .eq('metadata->>action', 'assistant_test_attempt')
        .limit(1)
        .maybeSingle();

      const testLogExists = (assistant.metadata?.test_log && assistant.metadata.test_log.length > 0) || testEvent;
      if (testLogExists) {
        journey[12].completed = true;
        journey[12].completedAt = testEvent?.created_at || assistant.updated_at || null;
      }

      // Check beta complete (status active and beta_complete is true)
      if (assistant.status === 'active' && assistant.metadata?.beta_complete === true) {
        journey[13].completed = true;
        journey[13].completedAt = assistant.updated_at || null;
      }
    }
  } catch (err) {
    console.error('[getStudentJourneyMap] unexpected tracking error:', err);
  }

  return journey;
}
