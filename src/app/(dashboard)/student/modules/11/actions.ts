'use server';

import {
  advanceCourseNodePhase,
  submitCourseTeachBackAction,
  submitCourseQuizAction,
  submitCourseBossBattleAction,
  submitCourseArtifacts,
} from '@/lib/modules/courseModuleActions';

const MODULE_NUM = 11;

export async function advanceNodePhase(nodeId: string, phase: 'lesson' | 'activity' | 'mini-check') {
  return advanceCourseNodePhase(MODULE_NUM, nodeId, phase);
}

export async function submitTeachBackAction(
  nodeId: string,
  prompt: string,
  prevState: unknown,
  formData: FormData,
) {
  return submitCourseTeachBackAction(MODULE_NUM, nodeId, prompt, prevState, formData);
}

export async function submitQuizAction(prevState: unknown, formData: FormData) {
  return submitCourseQuizAction(MODULE_NUM, prevState, formData);
}

export async function submitQuiz(formData: FormData) {
  return submitCourseQuizAction(MODULE_NUM, null, formData);
}

export async function submitBossBattleAction(prevState: unknown, formData: FormData) {
  return submitCourseBossBattleAction(MODULE_NUM, prevState, formData);
}

export async function submitBossBattleDirectAction(formData: FormData) {
  await submitCourseBossBattleAction(MODULE_NUM, null, formData);
}

export async function submitArtifacts(formData: FormData) {
  return submitCourseArtifacts(MODULE_NUM, formData);
}
