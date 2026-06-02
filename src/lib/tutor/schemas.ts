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
  instruction_set: z.string().min(1, 'Instruction set is required'),
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
