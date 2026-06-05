// =============================================================================
// Sprint 7: Tutor Build — Zod Validation Schemas
// =============================================================================

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Doctrine Config — validates the tutor personality settings
// ---------------------------------------------------------------------------
export const TutorDoctrineConfigSchema = z.object({
  purpose: z.string().min(1, 'Purpose is required'),
  teaching_style: z.string().min(1, 'Teaching style is required'),
  explanation_preferences: z.string().min(1, 'Explanation preferences are required'),
  subject_focus: z.string().min(1, 'Subject focus is required'),
});

// ---------------------------------------------------------------------------
// Instructions — validates the system prompt & rules
// ---------------------------------------------------------------------------
export const TutorInstructionsSchema = z.object({
  instruction_set: z
    .string()
    .min(1, 'Instruction set is required')
    .max(3000, 'Instruction set cannot exceed 3000 characters')
    .refine(
      (val) => {
        const lower = val.toLowerCase();
        const bypasses = [
          'do my homework',
          'give me answers',
          'ignore playiq rules',
          'reveal quiz answers',
          'bypass effort',
        ];
        return !bypasses.some((phrase) => lower.includes(phrase));
      },
      {
        message: 'Instruction set contains restricted phrases (e.g., bypass rules, homework completion, or quiz leaks).',
      }
    ),
  rules: z.array(z.string()).default([]),
});

// ---------------------------------------------------------------------------
// Fingerprint Snapshot — optional learner profile data
// ---------------------------------------------------------------------------
export const TutorFingerprintSnapshotSchema = z.object({
  learning_style: z.string().optional(),
  strengths: z.array(z.string()).optional(),
  struggles: z.array(z.string()).optional(),
  captured_at: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Profile Input — used when creating or updating a tutor profile
// ---------------------------------------------------------------------------
export const TutorProfileInputSchema = z.object({
  name: z.string().min(1, 'Tutor name is required').max(100),
  doctrine_config: TutorDoctrineConfigSchema,
  fingerprint_snapshot: TutorFingerprintSnapshotSchema.optional(),
});

// ---------------------------------------------------------------------------
// Version Input — used when publishing a new tutor version
// ---------------------------------------------------------------------------
export const TutorVersionInputSchema = z.object({
  instructions: TutorInstructionsSchema,
  knowledge_file_ids: z.array(z.string().uuid()).default([]),
  change_summary: z.string().min(1, 'Change summary is required').max(500),
});
