/**
 * Sprint 3 — Mastery Engine Config Foundation
 *
 * Pure functions for generating, merging, and querying mastery requirement
 * placeholder configs. No DB access, no server-only restriction.
 *
 * These helpers produce the canonical MasteryRequirementConfig shape for
 * any node based on its module number and optional node type.
 */

import type {
  MasteryRequirementConfig,
  PlaceholderRequirementKey,
  PlaceholderRequirementStatus,
} from './types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PLACEHOLDER_VERSION = 'sprint3_placeholder_v1';

// ---------------------------------------------------------------------------
// Default config generators
// ---------------------------------------------------------------------------

/**
 * Returns the base placeholder config with all requirements disabled.
 */
export function getDefaultMasteryPlaceholderConfig(): MasteryRequirementConfig {
  return {
    version: PLACEHOLDER_VERSION,
    requirements: {
      teach_back: {
        required: false,
        placeholder: true,
        status_source: 'student_node_progress.teach_back_status',
        passing_status: 'pass',
        notes: 'Placeholder — not enforced yet.',
      },
      proof: {
        required: false,
        placeholder: true,
        artifact_source: 'proof_artifacts',
        allowed_artifact_types: [],
        review_required: false,
        review_roles: ['teacher', 'admin'],
        notes: 'Placeholder — not enforced yet.',
      },
      tutor_build: {
        required: false,
        placeholder: true,
        source_table: 'tutor_profiles',
        version_source: 'tutor_versions',
        minimum_status: 'draft',
        notes: 'Placeholder — not enforced yet.',
      },
      assistant_build: {
        required: false,
        placeholder: true,
        source_table: 'assistant_profiles',
        version_source: 'assistant_versions',
        minimum_status: 'draft',
        notes: 'Placeholder — not enforced yet.',
      },
    },
    unlock_policy: {
      placeholder: true,
      enforcement_mode: 'not_enforced',
      future_engine: 'mastery_rule_engine',
    },
  };
}

// ---------------------------------------------------------------------------
// Merge helper
// ---------------------------------------------------------------------------

/**
 * Deep-merges placeholder defaults into an existing mastery config.
 * Preserves any existing keys that are already set.
 */
export function mergeMasteryPlaceholderConfig(
  existingConfig: Partial<MasteryRequirementConfig> | Record<string, unknown>,
  defaults: MasteryRequirementConfig
): MasteryRequirementConfig {
  // If existing config is empty or has no version, use defaults entirely
  if (!existingConfig || Object.keys(existingConfig).length === 0) {
    return { ...defaults };
  }

  const existing = existingConfig as Partial<MasteryRequirementConfig>;

  return {
    version: existing.version ?? defaults.version,
    requirements: {
      teach_back: {
        ...defaults.requirements.teach_back,
        ...(existing.requirements?.teach_back ?? {}),
      },
      proof: {
        ...defaults.requirements.proof,
        ...(existing.requirements?.proof ?? {}),
      },
      tutor_build: {
        ...defaults.requirements.tutor_build,
        ...(existing.requirements?.tutor_build ?? {}),
      },
      assistant_build: {
        ...defaults.requirements.assistant_build,
        ...(existing.requirements?.assistant_build ?? {}),
      },
    },
    unlock_policy: {
      ...defaults.unlock_policy,
      ...(existing.unlock_policy ?? {}),
    },
  };
}

// ---------------------------------------------------------------------------
// Node-level inference
// ---------------------------------------------------------------------------

/**
 * Infers the correct mastery requirement defaults for a node based on
 * its module number and optional node type.
 *
 * Mapping rules (from sprint spec):
 * - node_type = 'proof_task' → proof.required = true
 * - node_type = 'boss_battle' → teach_back.required = true, proof.review_required = true
 * - node_type = 'quiz' → no proof required
 * - node_type = 'lesson' → no proof required
 * - node_type = 'build_task' + module 9 → tutor_build.required = true
 * - node_type = 'build_task' + module 10 → assistant_build.required = true
 * - node_type = 'capstone_task' → all requirements enabled
 * - Module 9 → tutor_build placeholders
 * - Module 10 → assistant_build placeholders
 * - Capstone (11/99) → both tutor + assistant build
 */
export function inferRequirementDefaultsForNode(
  nodeId: string,
  moduleNumber: number,
  nodeType?: string
): MasteryRequirementConfig {
  const config = getDefaultMasteryPlaceholderConfig();
  const type = nodeType ?? 'lesson';

  // All standard learning nodes get teach_back required by default (modules 1+)
  if (moduleNumber >= 1) {
    config.requirements.teach_back.required = true;
    config.requirements.teach_back.notes = 'Teach-back required for mastery.';
  }

  // Node-type-specific rules
  switch (type) {
    case 'proof_task':
      config.requirements.proof.required = true;
      config.requirements.proof.notes = 'Proof artifact submission required.';
      break;

    case 'boss_battle':
      config.requirements.teach_back.required = true;
      config.requirements.teach_back.notes = 'Boss battle requires teach-back demonstration.';
      config.requirements.proof.review_required = true;
      config.requirements.proof.notes = 'Boss battle proof requires review if submitted.';
      break;

    case 'quiz':
      // Quiz nodes don't require proof by default
      config.requirements.proof.required = false;
      config.requirements.proof.notes = 'Quiz node — no proof required by default.';
      break;

    case 'lesson':
      // Lesson nodes don't require proof by default
      config.requirements.proof.required = false;
      config.requirements.proof.notes = 'Lesson node — no proof required by default.';
      break;

    case 'build_task':
      if (moduleNumber === 9) {
        config.requirements.tutor_build.required = true;
        config.requirements.tutor_build.notes = 'Module 9 build task — tutor build required.';
      }
      if (moduleNumber === 10) {
        config.requirements.assistant_build.required = true;
        config.requirements.assistant_build.notes = 'Module 10 build task — assistant build required.';
      }
      break;

    case 'capstone_task':
      config.requirements.proof.required = true;
      config.requirements.proof.notes = 'Capstone — proof artifact required.';
      config.requirements.tutor_build.required = true;
      config.requirements.tutor_build.notes = 'Capstone — tutor build required.';
      config.requirements.assistant_build.required = true;
      config.requirements.assistant_build.notes = 'Capstone — assistant build required.';
      break;
  }

  // Module-level overrides (regardless of node type)
  if (moduleNumber === 9) {
    config.requirements.tutor_build.required = true;
    if (config.requirements.tutor_build.notes === 'Placeholder — not enforced yet.') {
      config.requirements.tutor_build.notes = 'Module 9 — tutor build placeholder enabled.';
    }
  }

  if (moduleNumber === 10) {
    config.requirements.assistant_build.required = true;
    if (config.requirements.assistant_build.notes === 'Placeholder — not enforced yet.') {
      config.requirements.assistant_build.notes = 'Module 10 — assistant build placeholder enabled.';
    }
  }

  if (moduleNumber === 11 || moduleNumber === 99) {
    config.requirements.tutor_build.required = true;
    config.requirements.assistant_build.required = true;
    config.requirements.tutor_build.notes = 'Capstone — tutor build required.';
    config.requirements.assistant_build.notes = 'Capstone — assistant build required.';
  }

  // Module 0 (Setup) — no requirements
  if (moduleNumber === 0) {
    config.requirements.teach_back.required = false;
    config.requirements.teach_back.notes = 'Setup module — no teach-back required.';
  }

  return config;
}

// ---------------------------------------------------------------------------
// Requirement summary
// ---------------------------------------------------------------------------

const REQUIREMENT_LABELS: Record<PlaceholderRequirementKey, string> = {
  teach_back: 'Teach-Back',
  proof: 'Proof Artifact',
  tutor_build: 'AI Tutor Build',
  assistant_build: 'AI Assistant Build',
};

/**
 * Returns a human-readable summary of which requirements are active
 * for a given mastery config.
 */
export function getRequirementSummary(
  config: MasteryRequirementConfig
): PlaceholderRequirementStatus[] {
  const keys: PlaceholderRequirementKey[] = [
    'teach_back',
    'proof',
    'tutor_build',
    'assistant_build',
  ];

  return keys.map((key) => ({
    key,
    required: config.requirements[key].required,
    placeholder: config.requirements[key].placeholder,
    label: REQUIREMENT_LABELS[key],
  }));
}
