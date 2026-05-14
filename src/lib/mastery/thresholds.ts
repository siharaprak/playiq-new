/**
 * Sprint 3 Continued — Threshold Framework
 *
 * Configurable defaults for mastery thresholds.
 * NOT enforced yet — this is a config-only framework.
 *
 * Thresholds are stored in:
 *   - courses.metadata.threshold_framework (course-wide defaults)
 *   - modules.metadata.threshold_overrides (per-module overrides)
 *
 * No new tables. No gating changes. No student progress mutations.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuizThresholdConfig {
  quiz_pass_percent: number;
  mini_check_pass_percent: number;
}

export interface BossBattleThresholdConfig {
  boss_battle_pass_percent: number;
}

export interface TeachBackThresholdConfig {
  teach_back_required_status: 'pass' | 'revise';
}

export interface ProofThresholdConfig {
  proof_required_status: 'submitted' | 'approved';
  proof_review_roles: string[];
}

export interface TutorBuildThresholdConfig {
  tutor_build_min_status: 'draft' | 'active' | 'published';
  tutor_version_required: boolean;
}

export interface AssistantBuildThresholdConfig {
  assistant_build_min_status: 'draft' | 'active' | 'published';
  assistant_version_required: boolean;
}

export interface DependencyDecayConfig {
  dependency_decay_mode: 'placeholder' | 'linear' | 'exponential' | 'custom';
}

export interface PdiPlaceholderConfig {
  pdi_formula_status: 'placeholder_pending_final_formula' | 'draft_v1' | 'active';
}

export interface ThresholdFramework {
  version: string;
  enforcement_mode: 'not_enforced' | 'soft_warn' | 'hard_gate';
  defaults: QuizThresholdConfig &
    BossBattleThresholdConfig &
    TeachBackThresholdConfig &
    ProofThresholdConfig &
    TutorBuildThresholdConfig &
    AssistantBuildThresholdConfig &
    DependencyDecayConfig &
    PdiPlaceholderConfig;
  notes: string;
}

// ---------------------------------------------------------------------------
// Default factory
// ---------------------------------------------------------------------------

/**
 * Returns the default threshold framework configuration.
 * These are configurable defaults — NOT enforced.
 */
export function getDefaultThresholdFramework(): ThresholdFramework {
  return {
    version: 'sprint3_threshold_v1',
    enforcement_mode: 'not_enforced',
    defaults: {
      quiz_pass_percent: 80,
      mini_check_pass_percent: 80,
      boss_battle_pass_percent: 80,
      teach_back_required_status: 'pass',
      proof_required_status: 'approved',
      proof_review_roles: ['teacher', 'admin'],
      tutor_build_min_status: 'draft',
      tutor_version_required: true,
      assistant_build_min_status: 'draft',
      assistant_version_required: true,
      dependency_decay_mode: 'placeholder',
      pdi_formula_status: 'placeholder_pending_final_formula',
    },
    notes: 'Configurable defaults only. Not enforced. Sprint 3 config foundation.',
  };
}

// ---------------------------------------------------------------------------
// Merge helper
// ---------------------------------------------------------------------------

/**
 * Deep-merges threshold overrides into defaults.
 * Preserves any existing default keys not present in overrides.
 */
export function mergeThresholdOverrides(
  defaults: ThresholdFramework,
  overrides: Partial<ThresholdFramework['defaults']>
): ThresholdFramework {
  return {
    ...defaults,
    defaults: {
      ...defaults.defaults,
      ...overrides,
    },
  };
}

// ---------------------------------------------------------------------------
// Metadata readers
// ---------------------------------------------------------------------------

/**
 * Reads the threshold_framework from module metadata.
 * Falls back to course-level defaults if module has no overrides.
 */
export function getModuleThresholdConfig(
  moduleMetadata: Record<string, unknown> | null
): Partial<ThresholdFramework['defaults']> {
  if (!moduleMetadata?.threshold_overrides) return {};

  const overrides = moduleMetadata.threshold_overrides as Record<string, unknown>;
  if (Object.keys(overrides).length === 0) return {};

  return overrides as Partial<ThresholdFramework['defaults']>;
}

/**
 * Reads the threshold_framework from course metadata.
 * Returns the full framework or default if not set.
 */
export function getCourseThresholdConfig(
  courseMetadata: Record<string, unknown> | null
): ThresholdFramework {
  if (!courseMetadata?.threshold_framework) {
    return getDefaultThresholdFramework();
  }

  return courseMetadata.threshold_framework as ThresholdFramework;
}

// ---------------------------------------------------------------------------
// Human-readable description
// ---------------------------------------------------------------------------

/**
 * Returns a human-readable summary of the threshold framework.
 */
export function describeThresholdFramework(
  config: ThresholdFramework
): { label: string; value: string; enforced: boolean }[] {
  const d = config.defaults;
  const enforced = config.enforcement_mode !== 'not_enforced';

  return [
    { label: 'Quiz Pass Threshold', value: `${d.quiz_pass_percent}%`, enforced },
    { label: 'Mini-Check Pass Threshold', value: `${d.mini_check_pass_percent}%`, enforced },
    { label: 'Boss Battle Pass Threshold', value: `${d.boss_battle_pass_percent}%`, enforced },
    { label: 'Teach-Back Required Status', value: d.teach_back_required_status, enforced },
    { label: 'Proof Required Status', value: d.proof_required_status, enforced },
    { label: 'Proof Review Roles', value: d.proof_review_roles.join(', '), enforced },
    { label: 'Tutor Build Min Status', value: d.tutor_build_min_status, enforced },
    { label: 'Tutor Version Required', value: d.tutor_version_required ? 'Yes' : 'No', enforced },
    { label: 'Assistant Build Min Status', value: d.assistant_build_min_status, enforced },
    { label: 'Assistant Version Required', value: d.assistant_version_required ? 'Yes' : 'No', enforced },
    { label: 'Dependency Decay Mode', value: d.dependency_decay_mode, enforced },
    { label: 'PDI Formula Status', value: d.pdi_formula_status, enforced },
    { label: 'Enforcement Mode', value: config.enforcement_mode, enforced },
  ];
}
