/**
 * Sprint 3 — Mastery Engine Config Foundation
 *
 * Type definitions for mastery requirement placeholders.
 * These types describe the shape of skill_nodes.mastery_config JSONB
 * and module/course-level metadata.mastery_defaults.
 *
 * NOTE: skill_nodes has zero rows currently. These types are used by
 * TypeScript placeholder helpers and will be applied to DB rows once
 * skill_nodes are seeded in a future sprint.
 */

// ---------------------------------------------------------------------------
// Requirement sub-types
// ---------------------------------------------------------------------------

export interface TeachBackRequirement {
  required: boolean;
  placeholder: boolean;
  status_source: 'student_node_progress.teach_back_status';
  passing_status: 'pass';
  notes: string;
}

export interface ProofRequirement {
  required: boolean;
  placeholder: boolean;
  artifact_source: 'proof_artifacts';
  allowed_artifact_types: string[];
  review_required: boolean;
  review_roles: string[];
  notes: string;
}

export interface TutorBuildRequirement {
  required: boolean;
  placeholder: boolean;
  source_table: 'tutor_profiles';
  version_source: 'tutor_versions';
  minimum_status: 'draft' | 'active' | 'published';
  notes: string;
}

export interface AssistantBuildRequirement {
  required: boolean;
  placeholder: boolean;
  source_table: 'assistant_profiles';
  version_source: 'assistant_versions';
  minimum_status: 'draft' | 'active' | 'published';
  notes: string;
}

// ---------------------------------------------------------------------------
// Unlock policy
// ---------------------------------------------------------------------------

export interface UnlockPolicy {
  placeholder: boolean;
  enforcement_mode: 'not_enforced' | 'soft_warn' | 'hard_gate';
  future_engine: string;
}

// ---------------------------------------------------------------------------
// Top-level mastery config shape (for skill_nodes.mastery_config JSONB)
// ---------------------------------------------------------------------------

export interface MasteryRequirementConfig {
  version: string;
  requirements: {
    teach_back: TeachBackRequirement;
    proof: ProofRequirement;
    tutor_build: TutorBuildRequirement;
    assistant_build: AssistantBuildRequirement;
  };
  unlock_policy: UnlockPolicy;
}

// ---------------------------------------------------------------------------
// Node wrapper (combines node identity with config)
// ---------------------------------------------------------------------------

export interface NodeMasteryConfig {
  nodeId: string;
  moduleNumber: number;
  nodeType?: string;
  config: MasteryRequirementConfig;
}

// ---------------------------------------------------------------------------
// Placeholder requirement status (for runtime checks)
// ---------------------------------------------------------------------------

export type PlaceholderRequirementKey =
  | 'teach_back'
  | 'proof'
  | 'tutor_build'
  | 'assistant_build';

export interface PlaceholderRequirementStatus {
  key: PlaceholderRequirementKey;
  required: boolean;
  placeholder: boolean;
  label: string;
}

// ---------------------------------------------------------------------------
// Module-level mastery defaults (stored in modules.metadata.mastery_defaults)
// ---------------------------------------------------------------------------

export interface ModuleMasteryDefaults {
  version: string;
  teach_back: { required: boolean; placeholder: boolean };
  proof: { required: boolean; placeholder: boolean };
  tutor_build: { required: boolean; placeholder: boolean };
  assistant_build: { required: boolean; placeholder: boolean };
  notes: string;
}

// ---------------------------------------------------------------------------
// Course-level mastery placeholder summary (stored in courses.metadata)
// ---------------------------------------------------------------------------

export interface CourseMasteryPlaceholders {
  version: string;
  created_at: string;
  notes: string;
}
