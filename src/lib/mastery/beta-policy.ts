/**
 * Sprint 3 — Beta Config Policy
 *
 * Exposes the beta configurable/hard-coded/deferred decisions as typed
 * constants for reference and future imports.
 *
 * Rules:
 * - Pure TypeScript only. No DB access. No server-only.
 * - Not wired into gating enforcement.
 * - Does not change runtime behavior.
 */

// ---------------------------------------------------------------------------
// Configurable items for beta
// ---------------------------------------------------------------------------

export const BETA_CONFIGURABLE_ITEMS = [
  'quiz_pass_percent',
  'mini_check_pass_percent',
  'boss_battle_pass_percent',
  'teach_back_required_status',
  'proof_required_status',
  'proof_review_roles',
  'tutor_build_min_status',
  'assistant_build_min_status',
  'module_threshold_overrides',
  'enforcement_mode',
] as const;

export type BetaConfigurableItem = (typeof BETA_CONFIGURABLE_ITEMS)[number];

// ---------------------------------------------------------------------------
// Hard-coded items for beta
// ---------------------------------------------------------------------------

export const BETA_HARD_CODED_ITEMS = [
  'static_curriculum_source',
  'module_route_structure',
  'gating_function_shape',
  'canonical_attempt_table',
  'event_logging_locations',
  'parent_child_isolation',
  'no_admin_threshold_ui',
  'no_live_pdi_formula',
  'boss_battle_integer_pass_score',
] as const;

export type BetaHardCodedItem = (typeof BETA_HARD_CODED_ITEMS)[number];

// ---------------------------------------------------------------------------
// Deferred items
// ---------------------------------------------------------------------------

export const BETA_DEFERRED_ITEMS = [
  'skill_nodes_seeding',
  'dynamic_node_mastery_enforcement',
  'final_pdi_formula',
  'dependency_decay_logic',
  'tutor_build_enforcement',
  'assistant_build_enforcement',
  'admin_threshold_editor',
  'materialized_rollup_tables',
  'duplicate_capstone_cleanup',
  'constants_ts_uuid_alignment',
] as const;

export type BetaDeferredItem = (typeof BETA_DEFERRED_ITEMS)[number];

// ---------------------------------------------------------------------------
// Beta configurable defaults
// ---------------------------------------------------------------------------

/**
 * The canonical beta defaults for all configurable thresholds.
 * These match what is stored in courses.metadata.threshold_framework.
 *
 * NOTE: boss_battle_pass_percent = 80 is aspirational.
 * Live code uses integer totalScore >= 4 (approx 44% of 9 pts).
 * Do not use boss_battle_pass_percent for enforcement until scoring overhaul.
 */
export const BETA_CONFIGURABLE_DEFAULTS = {
  quiz_pass_percent: 80,
  mini_check_pass_percent: 80,
  boss_battle_pass_percent: 80, // aspirational — live code uses >= 4 integer
  boss_battle_live_pass_score: 4, // actual live behavior in submitBossBattleAction
  teach_back_required_status: 'pass' as const,
  proof_required_status: 'submitted' as const, // beta behavior — 'approved' is future target
  proof_review_roles: ['teacher', 'admin'] as string[],
  tutor_build_min_status: 'draft' as const,
  assistant_build_min_status: 'draft' as const,
  pdi_formula_status: 'placeholder_pending_final_formula' as const,
  dependency_decay_mode: 'placeholder' as const,
  enforcement_mode: 'not_enforced' as const,
} as const;

// ---------------------------------------------------------------------------
// Summary helper
// ---------------------------------------------------------------------------

export interface BetaPolicySummaryItem {
  item: string;
  decision: 'configurable' | 'hard-coded' | 'deferred';
  betaDefault?: string;
  notes?: string;
}

/**
 * Returns a human-readable summary of the beta policy decisions.
 * Useful for admin reference pages or developer docs.
 */
export function getBetaConfigPolicySummary(): BetaPolicySummaryItem[] {
  return [
    {
      item: 'quiz_pass_percent',
      decision: 'configurable',
      betaDefault: '80%',
      notes: 'Source: courses.metadata.threshold_framework',
    },
    {
      item: 'mini_check_pass_percent',
      decision: 'configurable',
      betaDefault: '80%',
      notes: 'Source: courses.metadata.threshold_framework',
    },
    {
      item: 'boss_battle_pass_percent',
      decision: 'configurable',
      betaDefault: '80% (aspirational) / >= 4 integer (live)',
      notes: 'Mismatch: live code uses integer totalScore >= 4, not percent. Do not enforce percent until scoring overhaul.',
    },
    {
      item: 'teach_back_required_status',
      decision: 'configurable',
      betaDefault: 'pass',
      notes: 'Already enforced by Gemini grader in practice',
    },
    {
      item: 'proof_required_status',
      decision: 'configurable',
      betaDefault: 'submitted',
      notes: "'approved' is future target when review workflow is built",
    },
    {
      item: 'proof_review_roles',
      decision: 'configurable',
      betaDefault: 'teacher, admin',
      notes: 'Not enforced until proof review workflow exists',
    },
    {
      item: 'tutor_build_min_status',
      decision: 'configurable',
      betaDefault: 'draft',
      notes: 'Not enforced — Module 9 builder pending',
    },
    {
      item: 'assistant_build_min_status',
      decision: 'configurable',
      betaDefault: 'draft',
      notes: 'Not enforced — Module 10 builder pending',
    },
    {
      item: 'enforcement_mode',
      decision: 'configurable',
      betaDefault: 'not_enforced',
      notes: 'Will move to soft_warn then hard_gate post-beta',
    },
    {
      item: 'static_curriculum_source',
      decision: 'hard-coded',
      notes: 'skill_nodes empty; data alignment sprint pending',
    },
    {
      item: 'gating_function_shape',
      decision: 'hard-coded',
      notes: 'enforceNodeGating / enforceModuleGating must not change until data alignment',
    },
    {
      item: 'parent_child_isolation',
      decision: 'hard-coded',
      notes: 'Security-critical — not configurable',
    },
    {
      item: 'boss_battle_integer_pass_score',
      decision: 'hard-coded',
      betaDefault: '>= 4',
      notes: 'Cannot change to percent without scoring model overhaul',
    },
    {
      item: 'final_pdi_formula',
      decision: 'deferred',
      notes: 'Requires real beta data before formula can be finalized',
    },
    {
      item: 'skill_nodes_seeding',
      decision: 'deferred',
      notes: 'Blocked by data alignment sprint',
    },
    {
      item: 'tutor_build_enforcement',
      decision: 'deferred',
      notes: 'Module 9 builder UI must exist first',
    },
    {
      item: 'assistant_build_enforcement',
      decision: 'deferred',
      notes: 'Module 10 builder UI must exist first',
    },
    {
      item: 'constants_ts_uuid_alignment',
      decision: 'deferred',
      notes: 'Dedicated data alignment sprint required',
    },
  ];
}
