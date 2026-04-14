import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function enforceNodeGating(nodeId: string, phase: 'lesson' | 'activity' | 'mini-check' | 'teach-back' | 'completion') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch progress for this specific node
  const { data: progress } = await supabase
    .from('student_node_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('node_id', nodeId)
    .single();

  switch (phase) {
    case 'activity':
      // Cannot access activity unless lesson started (we use lesson_completed flag for simplicity of DB state)
      if (!progress?.lesson_completed) {
        redirect(`/student/modules/1/nodes/${nodeId}/lesson`);
      }
      break;
    case 'mini-check':
      if (!progress?.activity_completed) {
        redirect(`/student/modules/1/nodes/${nodeId}/activity`);
      }
      break;
    case 'teach-back':
      if (!progress?.mini_check_passed) {
        redirect(`/student/modules/1/nodes/${nodeId}/mini-check`);
      }
      break;
    case 'completion':
      if (progress?.teach_back_status !== 'pass') {
        redirect(`/student/modules/1/nodes/${nodeId}/teach-back`);
      }
      break;
  }

  return { user, progress };
}

export async function enforceModuleGating(phase: 'quiz' | 'boss-battle' | 'artifacts' | 'completion') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check 4 nodes mastery for quiz step
  if (phase === 'quiz' || phase === 'boss-battle' || phase === 'artifacts' || phase === 'completion') {
    const { data: allNodes } = await supabase
      .from('student_node_progress')
      .select('node_id')
      .eq('student_id', user.id)
      .eq('node_mastered', true);

    if (!allNodes || allNodes.length < 4) {
      redirect('/student/modules/1/overview');
    }
  }

  // Fetch assessments and artifacts
  const { data: assessments } = await supabase
    .from('assessment_submissions')
    .select('*')
    .eq('student_id', user.id);

  const quiz = assessments?.find(a => a.assessment_type === 'module_quiz');
  const bossBattle = assessments?.find(a => a.assessment_type === 'boss_battle');

  const { data: artifacts } = await supabase
    .from('proof_artifact_submissions')
    .select('*')
    .eq('student_id', user.id);

  const studyRules = artifacts?.find(a => a.artifact_type === 'study_rules');
  const errorReview = artifacts?.find(a => a.artifact_type === 'error_review');

  switch (phase) {
    case 'boss-battle':
      if (!quiz || quiz.score_numeric < 80) {
        redirect('/student/modules/1/quiz');
      }
      break;
    case 'artifacts':
      // Cannot access artifacts until boss battle passed (e.g. score >= 4)
      if (!bossBattle || bossBattle.score_numeric < 4) {
        redirect('/student/modules/1/boss-battle');
      }
      break;
    case 'completion':
      // Module completion requires ALL 4 nodes mastered, quiz passed, boss battle passed, BOTH artifacts submitted.
      if (!quiz || quiz.score_numeric < 80) {
        redirect('/student/modules/1/quiz');
      }
      if (!bossBattle || bossBattle.score_numeric < 4) {
        redirect('/student/modules/1/boss-battle');
      }
      if (!studyRules || !errorReview) {
        redirect('/student/modules/1/proof-artifacts');
      }
      break;
  }

  return { user };
}
