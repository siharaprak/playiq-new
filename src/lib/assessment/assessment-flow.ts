// Shared allowlist for the diagnostic UI and authenticated save action.
export const DIAGNOSTIC_FIELDS = {
  q1: { field: 'explanation_style', options: { A: 'verbal', B: 'analytical', C: 'visual' } },
  q2: { field: 'pacing_preference', options: { A: 'sequential', B: 'top_down' } },
  q3: { field: 'challenge_response', options: { A: 'push_through', B: 'ask_help', C: 'take_break' } },
  q4: { field: 'ai_literacy_level', options: { A: 'answer_seeking', B: 'explanation_seeking', C: 'not_using', D: 'power_user' } },
  q5: { field: 'motivation_driver', options: { A: 'mastery', B: 'competitive', C: 'purpose', D: 'identity' } },
} as const;

export function diagnosticAnswerPatch(questionId: string, optionId: string): Record<string, string> {
  if (!Object.hasOwn(DIAGNOSTIC_FIELDS, questionId)) throw new Error('Unknown diagnostic question');
  const question = DIAGNOSTIC_FIELDS[questionId as keyof typeof DIAGNOSTIC_FIELDS];
  if (!Object.hasOwn(question.options, optionId)) throw new Error('Invalid diagnostic choice');
  return { [question.field]: (question.options as Record<string, string>)[optionId] };
}

export function firstUnansweredDiagnostic(profile: Record<string, unknown> | null): number {
  const index = Object.values(DIAGNOSTIC_FIELDS).findIndex(({ field, options }) =>
    !Object.values(options).includes(profile?.[field] as never));
  return index === -1 ? 4 : index;
}

export function assessmentDraftPatch(field: string, value: string): Record<string, string> {
  const limits: Record<string, number> = {
    baseline_task1_answer: 1, baseline_task2_response: 1000,
    baseline_task3_response: 2000, rescue_target_subject: 100,
    advance_target_subject: 100, personal_goal: 200,
  };
  if (!Object.hasOwn(limits, field) || typeof value !== 'string' ||
      !value.trim() || value.length > limits[field]) throw new Error('Invalid assessment answer');
  if (field === 'baseline_task1_answer' && !['A', 'B'].includes(value)) throw new Error('Invalid baseline choice');
  return { [field]: value.trim() };
}
