// =============================================================================
// Sprint 8: Assistant Build — Zod Validation Schemas
// =============================================================================

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Persona Config — validates the assistant personality settings
// ---------------------------------------------------------------------------
export const AssistantPersonaConfigSchema = z.object({
  purpose: z.string().min(1, 'Purpose is required'),
  user_target: z.string().min(1, 'Target user is required'),
  boundaries: z.string().min(1, 'Boundaries and rules are required'),
});

// ---------------------------------------------------------------------------
// Tools Config — validates the assistant tools and knowledge base
// ---------------------------------------------------------------------------
export const AssistantToolsConfigSchema = z.object({
  knowledge_file_ids: z.array(z.string().uuid()).default([]),
});

// ---------------------------------------------------------------------------
// Profile Input — used when creating or updating an assistant profile
// ---------------------------------------------------------------------------
export const AssistantProfileInputSchema = z.object({
  name: z.string().min(1, 'Assistant name is required').max(100),
  persona_config: AssistantPersonaConfigSchema,
  metadata: z.object({
    test_log: z.array(z.string()).optional(),
  }).catchall(z.unknown()).optional(),
});

// ---------------------------------------------------------------------------
// Version Input — used when publishing a new assistant version
// ---------------------------------------------------------------------------
export const AssistantVersionInputSchema = z.object({
  system_prompt: z.string().min(1, 'System prompt / instruction set is required'),
  tools_config: AssistantToolsConfigSchema,
  change_summary: z.string().min(1, 'Change summary is required').max(500),
});
