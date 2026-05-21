/**
 * Sprint 4A+4B+4C+4D — Guided AI Layer Types
 *
 * Core type definitions for the guided AI mode system.
 * All API input/output is validated with Zod.
 * No conversation history — each request is stateless and bounded.
 *
 * Sprint 4B adds: lesson_rescue mode, ConfusionType enum,
 * LessonRescueData structured output schema.
 *
 * Sprint 4C adds: hintLevel, retryCount, effortRequired,
 * teachBackRequired, retryRequired for integrity hardening.
 *
 * Sprint 4D adds: SafetyRoute optional field for unsafe
 * assistance routing metadata in responses.
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Mode identifiers
// ---------------------------------------------------------------------------

export const GuidedAiModeId = z.enum([
  'explain',
  'hint',
  'quiz',
  'coach',
  'learn_your_way',
  'lesson_rescue_stub',
  'lesson_rescue',
]);

export type GuidedAiModeId = z.infer<typeof GuidedAiModeId>;

// ---------------------------------------------------------------------------
// Page type context
// ---------------------------------------------------------------------------

export const PageType = z.enum([
  'lesson',
  'activity',
  'mini_check',
  'teach_back',
  'quiz',
  'boss_battle',
  'proof',
  'dashboard',
  'overview',
]);

export type PageType = z.infer<typeof PageType>;

// ---------------------------------------------------------------------------
// Integrity action results
// ---------------------------------------------------------------------------

export type IntegrityAction = 'allowed' | 'refused' | 'modified' | 'flagged';

export interface IntegrityResult {
  action: IntegrityAction;
  reason?: string;
  refusalMessage?: string;
}

// ---------------------------------------------------------------------------
// Learn Your Way — bounded enum values only (correction #4)
// ---------------------------------------------------------------------------

export const ExplanationStyle = z.enum(['examples', 'steps', 'analogy', 'plain']);
export type ExplanationStyle = z.infer<typeof ExplanationStyle>;

export const PacePreference = z.enum(['fast', 'slow', 'moderate']);
export type PacePreference = z.infer<typeof PacePreference>;

export const PracticePreference = z.enum(['practice_first', 'explanation_first']);
export type PracticePreference = z.infer<typeof PracticePreference>;

export const SupportPreference = z.enum(['visual_analogy', 'plain_explanation', 'worked_examples']);
export type SupportPreference = z.infer<typeof SupportPreference>;

export const LearnYourWayPreferences = z.object({
  explanation_style: ExplanationStyle.optional(),
  pace_preference: PacePreference.optional(),
  practice_preference: PracticePreference.optional(),
  support_preference: SupportPreference.optional(),
});

export type LearnYourWayPreferences = z.infer<typeof LearnYourWayPreferences>;

// ---------------------------------------------------------------------------
// Hint level (Sprint 4C)
// ---------------------------------------------------------------------------

export const HintLevelSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export type HintLevel = z.infer<typeof HintLevelSchema>;

// ---------------------------------------------------------------------------
// API Request (Zod validated — no conversation history)
// ---------------------------------------------------------------------------

export const GuidedAiRequestSchema = z.object({
  mode: GuidedAiModeId,
  moduleNumber: z.number().int().min(1).max(11).optional(),
  nodeId: z.string().max(10).optional(),
  pageType: PageType.optional(),
  message: z.string().min(1).max(2000),
  selectedText: z.string().max(1000).optional(),
  studentAttempt: z.string().max(2000).optional(),
  preferences: LearnYourWayPreferences.optional(),
  // Sprint 4C — integrity hardening fields
  hintLevel: HintLevelSchema.optional(),
  retryCount: z.number().int().min(0).max(10).optional(),
  previousIntegrityAction: z.string().max(50).optional(),
});

export type GuidedAiRequest = z.infer<typeof GuidedAiRequestSchema>;

// ---------------------------------------------------------------------------
// API Response (Zod validated)
// ---------------------------------------------------------------------------

export const PracticeItemSchema = z.object({
  type: z.enum(['multiple_choice', 'short_answer']),
  question: z.string(),
  options: z.array(z.string()).optional(),
  answer: z.string().optional(),
});

export type PracticeItem = z.infer<typeof PracticeItemSchema>;

// ---------------------------------------------------------------------------
// Lesson Rescue — bounded confusion types and structured output (Sprint 4B)
// ---------------------------------------------------------------------------

export const ConfusionType = z.enum([
  'vocabulary',
  'missing_prerequisite',
  'too_abstract',
  'procedure',
  'attention',
  'confidence',
  'unknown',
]);

export type ConfusionType = z.infer<typeof ConfusionType>;

export const LessonRescueDataSchema = z.object({
  confusionType: ConfusionType,
  gapDiagnosis: z.string(),
  rescueExplanation: z.string(),
  microExample: z.string().optional(),
  checkQuestion: z.string(),
  teachBackPrompt: z.string(),
  nextStep: z.string(),
});

export type LessonRescueData = z.infer<typeof LessonRescueDataSchema>;

export const GuidedAiResponseDataSchema = z.object({
  mode: GuidedAiModeId,
  response: z.string(),
  suggestedNextStep: z.string().optional(),
  integrityAction: z.enum(['allowed', 'refused', 'modified', 'flagged']),
  followUpQuestion: z.string().optional(),
  practiceItems: z.array(PracticeItemSchema).optional(),
  preferenceSummary: LearnYourWayPreferences.optional(),
  lessonRescue: LessonRescueDataSchema.optional(),
  // Sprint 4C — integrity hardening response fields
  effortRequired: z.boolean().optional(),
  effortPrompt: z.string().optional(),
  hintLevel: HintLevelSchema.optional(),
  nextHintAvailable: z.boolean().optional(),
  teachBackRequired: z.boolean().optional(),
  teachBackPrompt: z.string().optional(),
  retryRequired: z.boolean().optional(),
  retryPrompt: z.string().optional(),
  // Sprint 4D — safety route metadata for unsafe assistance routing
  safetyRoute: z.object({
    classification: z.enum([
      'direct_answer_request',
      'homework_outsourcing',
      'assessment_answer_request',
      'unsafe_personal_info',
      'self_harm_or_crisis',
      'prohibited_content',
      'low_effort_deeper_help',
      'allowed',
    ]),
    target: z.enum(['hint', 'explain', 'coach', 'lesson_rescue', 'blocked']),
    message: z.string(),
  }).optional(),
});

export type GuidedAiResponseData = z.infer<typeof GuidedAiResponseDataSchema>;

// ---------------------------------------------------------------------------
// Mode config shape (used by mode registry)
// ---------------------------------------------------------------------------

export interface GuidedAiModeConfig {
  id: GuidedAiModeId;
  label: string;
  description: string;
  allowedInputs: ('message' | 'selectedText' | 'studentAttempt' | 'preferences')[];
  integrityRules: string[];
  outputContract: string;
  betaStatus: 'active' | 'beta' | 'scaffold';
}

// ---------------------------------------------------------------------------
// Context shape (assembled from static curriculum)
// ---------------------------------------------------------------------------

export interface GuidedAiContext {
  moduleNumber?: number;
  moduleSummary: string;
  nodeTitle?: string;
  nodeContent?: string;
  pageType?: string;
}
