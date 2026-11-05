'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import { logAttemptEvent, logProofEvent, logModuleCompletedIdempotent } from '@/lib/events/learning-events';

export async function submitModule14MasterTrialAction(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const topic = ((formData.get('topic') as string) || '').trim();
  const stage1_prelearn = ((formData.get('stage1_prelearn') as string) || '').trim();
  const stage2_rescue = ((formData.get('stage2_rescue') as string) || '').trim();
  const stage3_compress = ((formData.get('stage3_compress') as string) || '').trim();
  const stage4_selftest = ((formData.get('stage4_selftest') as string) || '').trim();
  const stage5_studypack = ((formData.get('stage5_studypack') as string) || '').trim();
  const stage6_answer = ((formData.get('stage6_answer') as string) || '').trim();

  const record1_topic = ((formData.get('record1_topic') as string) || '').trim();
  const record1_before = ((formData.get('record1_before') as string) || '').trim();
  const record1_after = ((formData.get('record1_after') as string) || '').trim();
  const record1_help = ((formData.get('record1_help') as string) || '').trim();

  const record2_topic = ((formData.get('record2_topic') as string) || '').trim();
  const record2_before = ((formData.get('record2_before') as string) || '').trim();
  const record2_after = ((formData.get('record2_after') as string) || '').trim();
  const record2_help = ((formData.get('record2_help') as string) || '').trim();

  const record3_topic = ((formData.get('record3_topic') as string) || '').trim();
  const record3_before = ((formData.get('record3_before') as string) || '').trim();
  const record3_after = ((formData.get('record3_after') as string) || '').trim();
  const record3_help = ((formData.get('record3_help') as string) || '').trim();

  const dashboard_cue = ((formData.get('dashboard_cue') as string) || '').trim();
  const honest_interpretation = ((formData.get('honest_interpretation') as string) || '').trim();

  const selected_track = ((formData.get('selected_track') as string) || 'track-a').trim();
  const track_prompt = ((formData.get('track_prompt') as string) || '').trim();
  const track_output = ((formData.get('track_output') as string) || '').trim();
  const track_improvement = ((formData.get('track_improvement') as string) || '').trim();
  const track_rule_followed = ((formData.get('track_rule_followed') as string) || '').trim();

  const tutor_final_summary = ((formData.get('tutor_final_summary') as string) || '').trim();
  const parent_review_note = ((formData.get('parent_review_note') as string) || '').trim();

  const q1 = ((formData.get('q1') as string) || '').trim().toLowerCase();
  const q2 = ((formData.get('q2') as string) || '').trim().toLowerCase();
  const q3 = ((formData.get('q3') as string) || '').trim().toLowerCase();

  const boss_explain = ((formData.get('boss_explain') as string) || '').trim();
  const boss_show = ((formData.get('boss_show') as string) || '').trim();
  const boss_choose = ((formData.get('boss_choose') as string) || '').trim();

  if (!topic || !stage1_prelearn || !stage3_compress || !stage6_answer) {
    return {
      error:
        'Please complete your Master Trial topic and the 6-Stage Exam & Performance System fields before submitting.',
    };
  }

  if (!track_prompt || !track_output || !track_improvement) {
    return {
      error:
        'Please complete your chosen Skills Demonstration Track (prompt used, AI output/plan, and one improvement you made).',
    };
  }

  if (q1 !== 'b' || q2 !== 'b' || q3 !== 'b') {
    return {
      error:
        'Please review the 3 Quick Quiz questions in Part 7. All 3 must be answered accurately to certify your Master Trial.',
    };
  }

  if (!boss_explain || !boss_show || !boss_choose) {
    return {
      error:
        'Please complete all 3 Capstone Boss Battle responses (Explain, Show, and Choose) in Part 8.',
    };
  }

  const now = new Date().toISOString();
  const masterTrialPayload = {
    courseModuleNumber: 14,
    type: 'module_14_master_trial',
    topic,
    stages: {
      stage1_prelearn,
      stage2_rescue,
      stage3_compress,
      stage4_selftest,
      stage5_studypack,
      stage6_answer,
    },
    dashboard: {
      records: [
        { topic: record1_topic, before: record1_before, after: record1_after, help: record1_help },
        { topic: record2_topic, before: record2_before, after: record2_after, help: record2_help },
        { topic: record3_topic, before: record3_before, after: record3_after, help: record3_help },
      ],
      dashboard_cue,
      honest_interpretation,
    },
    skillsTrack: {
      selected_track,
      track_prompt,
      track_output,
      track_improvement,
      track_rule_followed,
    },
    reviews: {
      tutor_final_summary,
      parent_review_note,
    },
    quiz: { q1, q2, q3 },
    bossBattle: { boss_explain, boss_show, boss_choose },
    submittedAt: now,
  };

  const { data: bossSub } = await supabase
    .from('assessment_submissions')
    .insert({
      student_id: user.id,
      module_id: MODULES.CAPSTONE_ID,
      assessment_type: 'boss_battle',
      submission_payload: masterTrialPayload,
      score_numeric: 9,
      pass_status: 'pass',
    })
    .select()
    .maybeSingle();

  if (bossSub) {
    await logAttemptEvent({
      studentId: user.id,
      eventType: 'assessment_submitted',
      submissionId: bossSub.id,
      assessmentType: 'boss_battle',
      metadata: {
        moduleId: MODULES.CAPSTONE_ID,
        courseModuleNumber: 14,
        score: 9,
        passed: true,
        source: 'submitModule14MasterTrialAction',
      },
    });
  }

  const { data: artifactSub } = await supabase
    .from('proof_artifact_submissions')
    .insert({
      student_id: user.id,
      module_id: MODULES.CAPSTONE_ID,
      artifact_type: 'study_rules',
      content_payload: masterTrialPayload,
      status: 'submitted',
      submitted_at: now,
    })
    .select('id')
    .maybeSingle();

  if (artifactSub) {
    await logProofEvent({
      studentId: user.id,
      eventType: 'proof_submitted',
      submissionId: artifactSub.id,
      artifactType: 'study_rules',
      metadata: {
        moduleId: MODULES.CAPSTONE_ID,
        courseModuleNumber: 14,
        source: 'submitModule14MasterTrialAction',
      },
    });
  }

  await supabase.from('student_node_progress').upsert(
    {
      student_id: user.id,
      module_id: MODULES.CAPSTONE_ID,
      node_id: 'm14-1',
      lesson_completed: true,
      activity_completed: true,
      mini_check_passed: true,
      teach_back_status: 'pass',
      node_mastered: true,
      completed_at: now,
    },
    { onConflict: 'student_id,module_id,node_id' },
  );

  await supabase.from('course_release_learning_records').upsert(
    {
      student_id: user.id,
      module_number: 14,
      module_slug: 'module-14',
      completed: true,
      updated_at: now,
    },
    { onConflict: 'student_id,module_number' },
  );

  await logModuleCompletedIdempotent(user.id, MODULES.CAPSTONE_ID);

  revalidatePath('/student/home');
  revalidatePath('/student/modules/14/overview');
  redirect('/student/modules/14/completion');
}

