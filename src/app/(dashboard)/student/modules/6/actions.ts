'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import { logAttemptEvent, logCompletionEvent, logProofEvent, logModuleCompletedIdempotent } from '@/lib/events/learning-events';

const MODULE_ID = MODULES.MODULE_6_ID;
const MODULE_NUM = 6;
const BASE = `/student/modules/${MODULE_NUM}`;

export async function advanceNodePhase(nodeId: string, phase: 'lesson' | 'activity' | 'mini-check') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: progress } = await supabase
    .from('student_node_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('module_id', MODULE_ID)
    .eq('node_id', nodeId)
    .single();

  if (!progress) {
    await supabase.from('student_node_progress').insert({
      student_id: user.id,
      module_id: MODULE_ID,
      node_id: nodeId,
      lesson_completed: phase === 'lesson',
      activity_completed: false,
      mini_check_passed: false,
      teach_back_status: 'revise',
      node_mastered: false
    });
  } else {
    const updates: Record<string, boolean> = {};
    if (phase === 'lesson') updates.lesson_completed = true;
    if (phase === 'activity') updates.activity_completed = true;
    if (phase === 'mini-check') updates.mini_check_passed = true;

    await supabase.from('student_node_progress')
      .update(updates)
      .eq('id', progress.id);
  }

  let eventType = '';
  if (phase === 'lesson') eventType = 'lesson_started';
  if (phase === 'activity') eventType = 'activity_completed';
  if (phase === 'mini-check') eventType = 'assessment_submitted';



  if (phase !== 'mini-check') {
    await supabase.from('events_log').insert({
      student_id: user.id,
      event_type: eventType,
      target_type: phase,
      target_id: nodeId,
    });
  }

  if (phase === 'mini-check') {
    const { data: submission } = await supabase.from('assessment_submissions').insert({
      student_id: user.id,
      module_id: MODULE_ID,
      node_id: nodeId,
      assessment_type: 'mini_check',
      submission_payload: { status: 'passed' },
      pass_status: 'pass'
    }).select().single();

    if (submission) {
      await logAttemptEvent({
        studentId: user.id,
        eventType: 'assessment_submitted',
        submissionId: submission.id,
        assessmentType: 'mini_check',
      metadata: {
          nodeId,
          moduleId: MODULE_ID,
          
          source: 'advanceNodePhase'
        }
    });
    }
  }

  if (phase === 'lesson') redirect(`${BASE}/nodes/${nodeId}/activity`);
  if (phase === 'activity') redirect(`${BASE}/nodes/${nodeId}/mini-check`);
  if (phase === 'mini-check') redirect(`${BASE}/nodes/${nodeId}/teach-back`);
}

export async function submitTeachBackAction(nodeId: string, prompt: string, prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const content = formData.get('teachBackResponse') as string;
  if (!content) return { error: 'Response is required.', submittedText: content };

  const { evaluateTeachBack } = await import('@/lib/gemini');
  const evaluation = await evaluateTeachBack(prompt, content);

  if (!evaluation.passed) {
    return { error: evaluation.feedback, submittedText: content };
  }

  const { data: submission } = await supabase.from('assessment_submissions').insert({
    student_id: user.id,
    module_id: MODULE_ID,
    node_id: nodeId,
    assessment_type: 'teach_back',
    submission_payload: { text: content, geminiFeedback: evaluation.feedback },
    pass_status: 'pass',
  }).select().single();

  if (submission) {
    await logAttemptEvent({
      studentId: user.id,
      eventType: 'assessment_submitted',
      submissionId: submission.id,
      assessmentType: 'teach_back',
      metadata: {
        nodeId,
        moduleId: MODULE_ID,
        
        passed: true,
        auto_graded: true,
        source: 'submitTeachBackAction'
      }
    });
  }

  const { error: progressError } = await supabase.from('student_node_progress')
    .update({ teach_back_status: 'pass', node_mastered: true })
    .eq('student_id', user.id)
    .eq('module_id', MODULE_ID)
    .eq('node_id', nodeId);

  if (!progressError) {
    await logCompletionEvent({
      studentId: user.id,
      eventType: 'node_mastered',
      targetType: 'student_node_progress',
      metadata: {
        nodeId,
        moduleId: MODULE_ID,
        source: 'submitTeachBackAction'
      }
    });
  }

  redirect(`${BASE}/nodes/${nodeId}/completion`);
}

export async function submitQuiz(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Part A answers: q1→B, q2→C, q3→B
  // Part B answers: q4→A, q5→B, q6→B
  const q1 = formData.get('q1') as string;
  const q2 = formData.get('q2') as string;
  const q3 = formData.get('q3') as string;
  const q4 = formData.get('q4') as string;
  const q5 = formData.get('q5') as string;
  const q6 = formData.get('q6') as string;

  let score = 0;
  if (q1?.toLowerCase() === 'b') score += 17;
  if (q2?.toLowerCase() === 'c') score += 17;
  if (q3?.toLowerCase() === 'b') score += 17;
  if (q4?.toLowerCase() === 'a') score += 17;
  if (q5?.toLowerCase() === 'b') score += 16;
  if (q6?.toLowerCase() === 'b') score += 16;

  const passStatus = score >= 80 ? 'pass' : 'revise';

  const { data: quizSub } = await supabase.from('assessment_submissions').insert({
    student_id: user.id,
    module_id: MODULE_ID,
    assessment_type: 'module_quiz',
    submission_payload: { q1, q2, q3, q4, q5, q6 },
    score_numeric: score,
    pass_status: passStatus
  }).select().single();

  if (quizSub) {
    await logAttemptEvent({
      studentId: user.id,
      eventType: 'assessment_submitted',
      submissionId: quizSub.id,
      assessmentType: 'module_quiz',
      metadata: {
        moduleId: MODULE_ID,
        
        score,
        passStatus,
        source: 'submitQuiz'
      }
    });
  }

  if (passStatus === 'pass') {
    redirect(`${BASE}/boss-battle`);
  } else {
    redirect(`${BASE}/quiz`);
  }
}

export async function submitBossBattleAction(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const scenarios = [1, 2, 3, 4, 5, 6].map(i => ({
    label: formData.get(`s${i}_label`) as string,
    nextMode: formData.get(`s${i}_label`) as string,       // module 2 doesn't use nextMode; reuse label
    question: formData.get(`s${i}_why`) as string,
    verification: formData.get(`s${i}_next`) as string,
  }));

  const reflection1 = formData.get('reflection1') as string;
  const reflection2 = formData.get('reflection2') as string;
  const reflection3 = formData.get('reflection3') as string;

  const { evaluateBossBattle } = await import('@/lib/gemini');
  const evaluation = await evaluateBossBattle(scenarios);

  const reflectionScore = [reflection1, reflection2, reflection3].filter(r => r && r.length > 20).length;
  const totalScore = evaluation.score + reflectionScore;

  if (totalScore < 4) {
    return { error: evaluation.feedback };
  }

  const { data: bossSubmission } = await supabase.from('assessment_submissions').insert({
    student_id: user.id,
    module_id: MODULE_ID,
    assessment_type: 'boss_battle',
    submission_payload: { scenarios, reflections: { reflection1, reflection2, reflection3 }, geminiFeedback: evaluation.feedback },
    score_numeric: totalScore,
    pass_status: 'pass'
  }).select().single();

  if (evaluation.fingerprints && bossSubmission) {
    const signals = [
      { student_id: user.id, module_id: MODULE_ID, signal_type: 'explanation_preference', signal_value: evaluation.fingerprints.explanationPreference },
      { student_id: user.id, module_id: MODULE_ID, signal_type: 'mode_preference', signal_value: evaluation.fingerprints.modePreference },
      { student_id: user.id, module_id: MODULE_ID, signal_type: 'shortcut_tendency', signal_value: evaluation.fingerprints.shortcutTendency },
      { student_id: user.id, module_id: MODULE_ID, signal_type: 'integrity_snapshot', signal_value: evaluation.fingerprints.integritySnapshot },
    ];
    await supabase.from('fingerprint_signals').insert(signals);
  }

  if (bossSubmission) {
    await logAttemptEvent({
      studentId: user.id,
      eventType: 'assessment_submitted',
      submissionId: bossSubmission.id,
      assessmentType: 'boss_battle',
      metadata: {
        moduleId: MODULE_ID,
        
        score: totalScore,
        passed: totalScore >= 4,
        source: 'submitBossBattleAction'
      }
    });
  }

  redirect(`${BASE}/proof-artifacts`);
}

export async function submitArtifacts(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Artifact 1: Digital Warrior Code
  const warriorCodePayload = {
    beMore: formData.get('dw_be_more') as string,
    protectAttention: formData.get('dw_attention') as string,
    beforeTrust: formData.get('dw_trust') as string,
    stillEnsure: formData.get('dw_ensure') as string,
    highestPathQ: formData.get('dw_hp_question') as string,
    habitToImprove: formData.get('dw_habit') as string,
  };

  // Artifact 2: Highest Path Boundaries Plan
  const boundariesPayload = {
    boundary1: {
      boundary: formData.get('hp_b1_boundary') as string,
      whyMatters: formData.get('hp_b1_why') as string,
      when: formData.get('hp_b1_when') as string,
    },
    boundary2: {
      boundary: formData.get('hp_b2_boundary') as string,
      whyMatters: formData.get('hp_b2_why') as string,
      when: formData.get('hp_b2_when') as string,
    },
    boundary3: {
      boundary: formData.get('hp_b3_boundary') as string,
      whyMatters: formData.get('hp_b3_why') as string,
      when: formData.get('hp_b3_when') as string,
    },
  };

  const { error: artifactsError } = await supabase.from('proof_artifact_submissions').insert([
    {
      student_id: user.id,
      module_id: MODULE_ID,
      artifact_type: 'study_rules',
      content_payload: warriorCodePayload,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    },
    {
      student_id: user.id,
      module_id: MODULE_ID,
      artifact_type: 'error_review',
      content_payload: boundariesPayload,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    },
  ]);

  if (!artifactsError) {
    await logProofEvent({
      studentId: user.id,
      eventType: 'proof_submitted',
      metadata: {
        moduleId: MODULE_ID,
        artifactTypes: ['study_rules', 'error_review'],
        source: 'submitArtifacts'
      }
    });

    await logModuleCompletedIdempotent(user.id, MODULE_ID);
  }

  redirect(`${BASE}/completion`);
}
