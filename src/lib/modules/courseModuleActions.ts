'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getDbModuleIdForCourseModule, getCourseModuleNodeKey } from '@/lib/constants';
import { logAttemptEvent, logCompletionEvent, logProofEvent, logModuleCompletedIdempotent } from '@/lib/events/learning-events';
import { COURSE_MODULES_3_TO_12_CONFIG } from '@/data/courseModules3To12Meta';

export async function advanceCourseNodePhase(
  moduleNum: number,
  nodeId: string,
  phase: 'lesson' | 'activity' | 'mini-check',
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const dbModuleId = getDbModuleIdForCourseModule(moduleNum);
  const dbNodeKey = getCourseModuleNodeKey(moduleNum, nodeId);
  const base = `/student/modules/${moduleNum}`;

  const { data: progress } = await supabase
    .from('student_node_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('module_id', dbModuleId)
    .eq('node_id', dbNodeKey)
    .maybeSingle();

  if (!progress) {
    await supabase.from('student_node_progress').insert({
      student_id: user.id,
      module_id: dbModuleId,
      node_id: dbNodeKey,
      lesson_completed: phase === 'lesson',
      activity_completed: phase === 'activity',
      mini_check_passed: phase === 'mini-check',
      teach_back_status: 'revise',
      node_mastered: false,
    });
  } else {
    const updates: Record<string, boolean> = {};
    if (phase === 'lesson') updates.lesson_completed = true;
    if (phase === 'activity') updates.activity_completed = true;
    if (phase === 'mini-check') updates.mini_check_passed = true;

    await supabase
      .from('student_node_progress')
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
      target_id: dbNodeKey,
    });
  }

  if (phase === 'mini-check') {
    const { data: submission } = await supabase
      .from('assessment_submissions')
      .insert({
        student_id: user.id,
        module_id: dbModuleId,
        node_id: moduleNum <= 9 ? nodeId : null,
        assessment_type: 'mini_check',
        submission_payload: {
          status: 'passed',
          nodeId,
          dbNodeKey,
          courseModuleNumber: moduleNum,
        },
        pass_status: 'pass',
      })
      .select()
      .maybeSingle();

    if (submission) {
      await logAttemptEvent({
        studentId: user.id,
        eventType: 'assessment_submitted',
        submissionId: submission.id,
        assessmentType: 'mini_check',
        metadata: {
          nodeId: dbNodeKey,
          moduleId: dbModuleId,
          courseModuleNumber: moduleNum,
          source: 'advanceNodePhase',
        },
      });
    }
  }

  if (phase === 'lesson') redirect(`${base}/nodes/${nodeId}/activity`);
  if (phase === 'activity') redirect(`${base}/nodes/${nodeId}/mini-check`);
  if (phase === 'mini-check') redirect(`${base}/nodes/${nodeId}/teach-back`);
}

export async function submitCourseTeachBackAction(
  moduleNum: number,
  nodeId: string,
  prompt: string,
  prevState: unknown,
  formData: FormData,
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const dbModuleId = getDbModuleIdForCourseModule(moduleNum);
  const dbNodeKey = getCourseModuleNodeKey(moduleNum, nodeId);
  const base = `/student/modules/${moduleNum}`;

  const content = formData.get('teachBackResponse') as string;
  if (!content) return { error: 'Response is required.', submittedText: content };

  const { evaluateTeachBack } = await import('@/lib/gemini');
  const evaluation = await evaluateTeachBack(prompt, content);

  if (!evaluation.passed) {
    return { error: evaluation.feedback, submittedText: content };
  }

  const { data: submission } = await supabase
    .from('assessment_submissions')
    .insert({
      student_id: user.id,
      module_id: dbModuleId,
      node_id: moduleNum <= 9 ? nodeId : null,
      assessment_type: 'teach_back',
      submission_payload: {
        text: content,
        geminiFeedback: evaluation.feedback,
        nodeId,
        dbNodeKey,
        courseModuleNumber: moduleNum,
      },
      pass_status: 'pass',
    })
    .select()
    .maybeSingle();

  if (submission) {
    await logAttemptEvent({
      studentId: user.id,
      eventType: 'assessment_submitted',
      submissionId: submission.id,
      assessmentType: 'teach_back',
      metadata: {
        nodeId: dbNodeKey,
        moduleId: dbModuleId,
        courseModuleNumber: moduleNum,
        passed: true,
        auto_graded: true,
        source: 'submitTeachBackAction',
      },
    });
  }

  const { error: progressError } = await supabase
    .from('student_node_progress')
    .update({ teach_back_status: 'pass', node_mastered: true })
    .eq('student_id', user.id)
    .eq('module_id', dbModuleId)
    .eq('node_id', dbNodeKey);

  if (!progressError) {
    await logCompletionEvent({
      studentId: user.id,
      eventType: 'node_mastered',
      targetType: 'student_node_progress',
      metadata: {
        nodeId: dbNodeKey,
        moduleId: dbModuleId,
        courseModuleNumber: moduleNum,
        source: 'submitTeachBackAction',
      },
    });
  }

  redirect(`${base}/nodes/${nodeId}/completion`);
}

export async function submitCourseQuizAction(
  moduleNum: number,
  prevState: unknown,
  formData: FormData,
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const dbModuleId = getDbModuleIdForCourseModule(moduleNum);
  const base = `/student/modules/${moduleNum}`;
  const config = COURSE_MODULES_3_TO_12_CONFIG[moduleNum];

  const q1 = formData.get('q1') as string;
  const q2 = formData.get('q2') as string;
  const q3 = formData.get('q3') as string;
  const q4 = formData.get('q4') as string;
  const q5 = formData.get('q5') as string;
  const q6 = formData.get('q6') as string;
  const applied1 = (formData.get('applied1') as string) || '';
  const applied2 = (formData.get('applied2') as string) || '';

  let score = 0;
  if (config?.quizQuestions?.length === 6) {
    const weights = [17, 17, 17, 17, 16, 16];
    config.quizQuestions.forEach((q, idx) => {
      const val = (formData.get(q.name) as string) || '';
      if (val.toLowerCase() === q.correctValue.toLowerCase()) {
        score += weights[idx];
      }
    });
  } else {
    if (q1?.toLowerCase() === 'b') score += 17;
    if (q2?.toLowerCase() === 'c') score += 17;
    if (q3?.toLowerCase() === 'b') score += 17;
    if (q4?.toLowerCase() === 'a') score += 17;
    if (q5?.toLowerCase() === 'b') score += 16;
    if (q6?.toLowerCase() === 'b') score += 16;
  }

  const passStatus = score >= 80 ? 'pass' : 'revise';

  const { data: quizSub } = await supabase
    .from('assessment_submissions')
    .insert({
      student_id: user.id,
      module_id: dbModuleId,
      assessment_type: 'module_quiz',
      submission_payload: {
        q1,
        q2,
        q3,
        q4,
        q5,
        q6,
        applied1,
        applied2,
        courseModuleNumber: moduleNum,
      },
      score_numeric: score,
      pass_status: passStatus,
    })
    .select()
    .maybeSingle();

  if (quizSub) {
    await logAttemptEvent({
      studentId: user.id,
      eventType: 'assessment_submitted',
      submissionId: quizSub.id,
      assessmentType: 'module_quiz',
      metadata: {
        moduleId: dbModuleId,
        courseModuleNumber: moduleNum,
        score,
        passStatus,
        source: 'submitQuizAction',
      },
    });
  }

  if (passStatus === 'pass') {
    redirect(`${base}/boss-battle`);
  }

  return {
    error: `You scored ${score}%. An 80%+ score is required to unlock the Boss Battle. Please review your answers.`,
    score,
    passed: false,
  };
}

export async function submitCourseBossBattleAction(
  moduleNum: number,
  prevState: unknown,
  formData: FormData,
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const dbModuleId = getDbModuleIdForCourseModule(moduleNum);
  const base = `/student/modules/${moduleNum}`;
  const config = COURSE_MODULES_3_TO_12_CONFIG[moduleNum];

  const scenarios = [1, 2, 3, 4, 5, 6].map((i) => ({
    label: (formData.get(`s${i}_label`) as string) || '',
    nextMode: (formData.get(`s${i}_label`) as string) || '',
    question: (formData.get(`s${i}_why`) as string) || '',
    verification: (formData.get(`s${i}_next`) as string) || '',
  }));

  const reflection1 = (formData.get('reflection1') as string) || '';
  const reflection2 = (formData.get('reflection2') as string) || '';
  const reflection3 = (formData.get('reflection3') as string) || '';

  // Compute deterministic scenario score against expected labels for this module
  let scenarioScore = 0;
  if (config?.bossScenarios?.length === 6) {
    config.bossScenarios.forEach((sc, idx) => {
      const submitted = scenarios[idx];
      if (!submitted) return;
      const labelMatches =
        submitted.label.trim().toLowerCase() === sc.expectedLabel.trim().toLowerCase();
      const hasReasoning =
        submitted.question.trim().length >= 8 && submitted.verification.trim().length >= 8;
      if (labelMatches && hasReasoning) {
        scenarioScore += 1;
      } else if (hasReasoning) {
        scenarioScore += 0.5;
      }
    });
  } else {
    const { evaluateBossBattle } = await import('@/lib/gemini');
    const evaluation = await evaluateBossBattle(scenarios);
    scenarioScore = evaluation.score;
  }

  const reflectionScore = [reflection1, reflection2, reflection3].filter(
    (r) => r && r.trim().length >= 12,
  ).length;
  const totalScore = Math.round((scenarioScore + reflectionScore) * 10) / 10;

  if (totalScore < 4) {
    return {
      error: `You scored ${totalScore}/9 on the Boss Battle. Review your scenario classifications and explain both why each move is strong/weak and the better next move.`,
    };
  }

  const { data: bossSubmission } = await supabase
    .from('assessment_submissions')
    .insert({
      student_id: user.id,
      module_id: dbModuleId,
      assessment_type: 'boss_battle',
      submission_payload: {
        scenarios,
        reflections: { reflection1, reflection2, reflection3 },
        courseModuleNumber: moduleNum,
      },
      score_numeric: totalScore,
      pass_status: 'pass',
    })
    .select()
    .maybeSingle();

  if (bossSubmission) {
    await logAttemptEvent({
      studentId: user.id,
      eventType: 'assessment_submitted',
      submissionId: bossSubmission.id,
      assessmentType: 'boss_battle',
      metadata: {
        moduleId: dbModuleId,
        courseModuleNumber: moduleNum,
        score: totalScore,
        passed: totalScore >= 4,
        source: 'submitBossBattleAction',
      },
    });
  }

  redirect(`${base}/proof-artifacts`);
}

export async function submitCourseArtifacts(moduleNum: number, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const dbModuleId = getDbModuleIdForCourseModule(moduleNum);
  const base = `/student/modules/${moduleNum}`;

  const warriorCodePayload = {
    courseModuleNumber: moduleNum,
    beMore: formData.get('dw_be_more') as string,
    protectAttention: formData.get('dw_attention') as string,
    beforeTrust: formData.get('dw_trust') as string,
    stillEnsure: formData.get('dw_ensure') as string,
    highestPathQ: formData.get('dw_hp_question') as string,
    habitToImprove: formData.get('dw_habit') as string,
  };

  const boundariesPayload = {
    courseModuleNumber: moduleNum,
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
      module_id: dbModuleId,
      artifact_type: 'study_rules',
      content_payload: warriorCodePayload,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    },
    {
      student_id: user.id,
      module_id: dbModuleId,
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
        moduleId: dbModuleId,
        courseModuleNumber: moduleNum,
        artifactTypes: ['study_rules', 'error_review'],
        source: 'submitArtifacts',
      },
    });

    await logModuleCompletedIdempotent(user.id, dbModuleId);
  }

  redirect(`${base}/completion`);
}
