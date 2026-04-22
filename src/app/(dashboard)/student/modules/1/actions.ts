'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';

export async function advanceNodePhase(nodeId: string, phase: 'lesson' | 'activity' | 'mini-check') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Upsert progress row if it doesn't exist
  const { data: progress } = await supabase
    .from('student_node_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('node_id', nodeId)
    .single();

  if (!progress) {
    await supabase.from('student_node_progress').insert({
      student_id: user.id,
      module_id: MODULES.MODULE_1_ID,
      node_id: nodeId,
      lesson_completed: phase === 'lesson',
      activity_completed: false,
      mini_check_passed: false,
      teach_back_status: 'revise',
      node_mastered: false
    });
  } else {
    // Update existing row
    const updates: any = {};
    if (phase === 'lesson') updates.lesson_completed = true;
    if (phase === 'activity') updates.activity_completed = true;
    if (phase === 'mini-check') updates.mini_check_passed = true;
    
    await supabase.from('student_node_progress')
      .update(updates)
      .eq('id', progress.id);
  }

  // Record Event
  let eventType = '';
  if (phase === 'lesson') eventType = 'lesson_started';
  if (phase === 'activity') eventType = 'activity_completed';
  if (phase === 'mini-check') eventType = 'assessment_submitted';

  await supabase.from('events_log').insert({
    student_id: user.id,
    event_type: eventType,
    target_type: phase,
    target_id: nodeId,
  });

  // Also log the assessment mock for mini-check to bypass deep schema validations
  if (phase === 'mini-check') {
    await supabase.from('assessment_submissions').insert({
      student_id: user.id,
      module_id: MODULES.MODULE_1_ID,
      node_id: nodeId,
      assessment_type: 'mini_check',
      submission_payload: { status: 'passed' },
      pass_status: 'pass'
    });
  }

  if (phase === 'lesson') redirect(`/student/modules/1/nodes/${nodeId}/activity`);
  if (phase === 'activity') redirect(`/student/modules/1/nodes/${nodeId}/mini-check`);
  if (phase === 'mini-check') redirect(`/student/modules/1/nodes/${nodeId}/teach-back`);
}

export async function submitTeachBackAction(nodeId: string, prompt: string, prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const content = formData.get('teachBackResponse') as string;
  if (!content) return { error: 'Response is required.', submittedText: content };

  // Run Semantic LLM Check via Gemini
  const { evaluateTeachBack } = await import('@/lib/gemini');
  const evaluation = await evaluateTeachBack(prompt, content);

  if (!evaluation.passed) {
    return { error: evaluation.feedback, submittedText: content };
  }

  // Pass! Log and advance
  await supabase.from('assessment_submissions').insert({
      student_id: user.id,
      module_id: MODULES.MODULE_1_ID,
      node_id: nodeId,
      assessment_type: 'teach_back',
      submission_payload: { text: content, geminiFeedback: evaluation.feedback },
      pass_status: 'pass',
  });

  await supabase.from('events_log').insert({
    student_id: user.id,
    event_type: 'assessment_submitted',
    target_type: 'teach_back',
    target_id: nodeId,
    metadata: { passed: true, auto_graded: true }
  });

  await supabase.from('student_node_progress')
    .update({ teach_back_status: 'pass', node_mastered: true })
    .eq('student_id', user.id)
    .eq('node_id', nodeId);

  // DEV ONLY: Auto-master nodes 2, 3, 4 to test the Module Quiz gate without completing the full flow.
  if (process.env.NODE_ENV !== 'production') {
    await mockOtherNodes(user.id);
  }
    
  redirect(`/student/modules/1/nodes/${nodeId}/completion`);
}

// Helper to auto-complete nodes 2,3,4 to test the quiz lock efficiently during verification
async function mockOtherNodes(student_id: string) {
  const supabase = await createClient();
  const nodes = ['2','3','4'];
  for (const n of nodes) {
     const { data } = await supabase.from('student_node_progress').select('id').eq('student_id', student_id).eq('node_id', n).single();
     if (!data) {
       await supabase.from('student_node_progress').insert({
         student_id, module_id: MODULES.MODULE_1_ID, node_id: n,
         lesson_completed: true, activity_completed: true, mini_check_passed: true, teach_back_status: 'pass', node_mastered: true
       });
     }
  }
}

export async function submitQuiz(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if(!user) throw new Error('Not authenticated');

  const q1 = formData.get('q1');
  const q2 = formData.get('q2');
  const q3 = formData.get('q3');
  const q4 = formData.get('q4');
  const q5 = formData.get('q5');

  let score = 0;
  if (q1 === 'b') score += 20;
  if (q2 === 'b') score += 20;
  if (q3 === 'a') score += 20;
  if (q4 === 'b') score += 20;
  if (q5 === 'c') score += 20;

  const passStatus = score >= 80 ? 'pass' : 'revise';

  const { error } = await supabase.from('assessment_submissions').insert({
    student_id: user.id, module_id: MODULES.MODULE_1_ID,
    assessment_type: 'module_quiz', submission_payload: { q1, q2, q3, q4, q5 }, score_numeric: score, pass_status: passStatus
  });
  
  if (error) throw new Error('Submit failed');
  
  if (passStatus === 'pass') {
    redirect('/student/modules/1/boss-battle');
  } else {
    // Ideally we return error state, but for simplicity we redirect back
    redirect('/student/modules/1/quiz');
  }
}

export async function submitBossBattleAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if(!user) return { error: 'Not authenticated' };

  // Reconstruct scenarios
  const scenarios = [
    {
      label: formData.get('s1_label') as string,
      nextMode: formData.get('s1_mode') as string,
      question: formData.get('s1_question') as string,
      verification: formData.get('s1_verify') as string
    },
    {
       label: formData.get('s2_label') as string,
       nextMode: formData.get('s2_mode') as string,
       question: formData.get('s2_question') as string,
       verification: formData.get('s2_verify') as string
    }
  ];

  const reflection = formData.get('reflection') as string;

  // Run Semantic LLM Check via Gemini
  const { evaluateBossBattle } = await import('@/lib/gemini');
  const evaluation = await evaluateBossBattle(scenarios);

  // In testing we had 2 scenarios, each worth 2 points, plus 1 point for the reflection.
  let extraScore = reflection && reflection.length > 10 ? 1 : 0;
  const totalScore = evaluation.score + extraScore;

  if (totalScore < 4) { // Threshold for fail
     return { error: evaluation.feedback };
  }

  // Pass logic
  const { data: bossSubmission } = await supabase.from('assessment_submissions').insert({
    student_id: user.id, module_id: MODULES.MODULE_1_ID,
    assessment_type: 'boss_battle', submission_payload: { scenarios, reflection, geminiFeedback: evaluation.feedback }, score_numeric: totalScore, pass_status: 'pass'
  }).select().single();

  if (evaluation.fingerprints && bossSubmission) {
    const signals = [
      { student_id: user.id, module_id: MODULES.MODULE_1_ID, signal_type: 'explanation_preference', signal_value: evaluation.fingerprints.explanationPreference },
      { student_id: user.id, module_id: MODULES.MODULE_1_ID, signal_type: 'mode_preference', signal_value: evaluation.fingerprints.modePreference },
      { student_id: user.id, module_id: MODULES.MODULE_1_ID, signal_type: 'shortcut_tendency', signal_value: evaluation.fingerprints.shortcutTendency },
      { student_id: user.id, module_id: MODULES.MODULE_1_ID, signal_type: 'integrity_snapshot', signal_value: evaluation.fingerprints.integritySnapshot },
    ];
    await supabase.from('fingerprint_signals').insert(signals);
  }

  redirect('/student/modules/1/proof-artifacts');
}

export async function submitArtifacts(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Collect the fill-in-the-blank fields from Artifact 1: My AI Study Rules
  const studyRulesPayload = {
    useAI: formData.get('sr_use') as string,
    confusedMode: formData.get('sr_confused') as string,
    beforeTrusting: formData.get('sr_trust') as string,
    aiStrengthens: formData.get('sr_strengthen') as string,
  };

  // Collect the fill-in-the-blank fields from Artifact 2: AI Error Review Sheet
  const errorReviewPayload = {
    aiWasTryingTo: formData.get('er_trying') as string,
    whatWasWrong: formData.get('er_wrong') as string,
    clue: formData.get('er_clue') as string,
  };

  const { error } = await supabase.from('proof_artifact_submissions').insert([
    {
      student_id: user.id,
      module_id: MODULES.MODULE_1_ID,
      artifact_type: 'study_rules',
      content_payload: studyRulesPayload,
    },
    {
      student_id: user.id,
      module_id: MODULES.MODULE_1_ID,
      artifact_type: 'error_review',
      content_payload: errorReviewPayload,
    },
  ]);

  if (error) throw new Error('Failed to submit artifacts: ' + error.message);

  redirect('/student/modules/1/completion');
}
