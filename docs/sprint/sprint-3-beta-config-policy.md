# Sprint 3 — Beta Config Policy
> Configurable vs Hard-Coded vs Deferred decisions for PlayIQ Beta

---

## Pre-Flight Audit Results

| Audit Item | Status |
|---|---|
| `src/lib/mastery/thresholds.ts` | ✅ Exists — full threshold framework with typed defaults |
| `courses.metadata.threshold_framework` | ✅ Set in live DB — version `sprint3_threshold_v1`, `enforcement_mode: not_enforced` |
| `modules.metadata.threshold_overrides` | ✅ Set on all modules — currently `{}` (empty, extensible) |
| Enforcement enabled | ❌ `not_enforced` — no enforcement active |
| Hardcoded thresholds in actions.ts | ⚠️ `score >= 80` (quiz), `totalScore < 4` (boss battle, ≠ 80%) |
| Hardcoded thresholds in gating.ts | ⚠️ Node count thresholds for module gating (no percent logic) |
| Configurable threshold source | `src/lib/mastery/thresholds.ts` + `courses.metadata.threshold_framework` |
| PDI formula | ❌ Placeholder — `placeholder_pending_final_formula` |
| skill_nodes populated | ❌ Zero rows — curriculum from static `src/data/module*Content.ts` |
| Admin threshold UI | ❌ Does not exist |
| Duplication/conflict risks | ⚠️ Boss battle uses integer score `>= 4` out of 9 points (not a %); framework defines `boss_battle_pass_percent: 80`. Mismatch documented below. |

### Boss Battle Score Mismatch (Documented)
The live `submitBossBattleAction()` passes if `totalScore >= 4` where `totalScore` is an integer out of a maximum of ~9 points (6 Gemini scenario points + 3 reflection points). This is approximately 44%, **not** 80%. The threshold framework records `boss_battle_pass_percent: 80` as the future target. For beta, the live integer pass threshold (`>= 4`) is the actual behavior. The framework default is the **aspirational** target pending a full scoring overhaul.

---

## Part A: Configurable vs Hard-Coded Decision Table

| # | Item | Beta Decision | Source of Truth | Owner | Reason | Future Migration Path |
|---|---|---|---|---|---|---|
| 1 | `quiz_pass_percent` | **Configurable** | `src/lib/mastery/thresholds.ts` → `courses.metadata.threshold_framework` | Product | Straightforward numeric threshold, safe to adjust per cohort | Wire `getCourseThresholdConfig().defaults.quiz_pass_percent` into `submitQuiz()` when enforcement is enabled |
| 2 | `mini_check_pass_percent` | **Configurable** | `src/lib/mastery/thresholds.ts` → `courses.metadata.threshold_framework` | Product | Same as quiz — numeric, low risk | Wire into `advanceNodePhase()` mini-check branch when enforcement enabled |
| 3 | `boss_battle_pass_percent` | **Configurable (aspirational)** | `src/lib/mastery/thresholds.ts` → `courses.metadata.threshold_framework` | Product + Tech | ⚠️ **Mismatch**: Live code uses integer `>= 4` (not %). Framework default is 80%. Beta behavior is `>= 4`. Future target is percent-based. Document `boss_battle_pass_percent: 80` as aspirational. | Requires scoring overhaul — convert Gemini evaluation to produce 0–100 score before percent threshold is meaningful |
| 4 | `teach_back_required_status` | **Configurable** | `src/lib/mastery/thresholds.ts` → `courses.metadata.threshold_framework` | Product | Beta default: `pass`. Currently enforced by Gemini grader in `submitTeachBackAction()`. | Already behavior-aligned. Enforcement layer will read this config when enabled |
| 5 | `proof_required_status` | **Configurable (beta: submitted)** | `src/lib/mastery/thresholds.ts` → `courses.metadata.threshold_framework` | Product | Framework default is `approved`. Beta behavior is `submitted` because no review workflow exists. | When proof review workflow is built, switch to `approved`. Framework key is already in place |
| 6 | `proof_review_roles` | **Configurable** | `src/lib/mastery/thresholds.ts` → `courses.metadata.threshold_framework` | Product + Tech | Beta default: `['teacher', 'admin']`. Not enforced until review workflow exists. | Wire into proof review gates when review workflow is built |
| 7 | `tutor_build_min_status` | **Configurable (beta: draft)** | `src/lib/mastery/thresholds.ts` → `courses.metadata.threshold_framework` | Tech | Not enforced — Module 9 builder does not exist yet. | Wire into Module 9 builder gating when CRUD flow is complete |
| 8 | `assistant_build_min_status` | **Configurable (beta: draft)** | `src/lib/mastery/thresholds.ts` → `courses.metadata.threshold_framework` | Tech | Not enforced — Module 10 builder does not exist yet. | Wire into Module 10 builder gating when CRUD flow is complete |
| 9 | `modules.metadata.threshold_overrides` | **Configurable (beta: empty)** | `modules.metadata.threshold_overrides` in Supabase | Tech | Overrides allowed in data config, no admin UI. Currently `{}` for all modules. | Populate specific overrides per module when data alignment sprint is done |
| 10 | `enforcement_mode` | **Configurable (beta: not_enforced)** | `courses.metadata.threshold_framework.enforcement_mode` | Tech + Product | Prevents any premature lockouts during beta. | Switch to `soft_warn` post-beta validation, then `hard_gate` when data is verified |

---

## Part B: Hard-Coded for Beta

| # | Item | Source | Reason |
|---|---|---|---|
| 1 | Static curriculum content | `src/data/module*Content.ts` | `skill_nodes` is empty; data alignment sprint pending |
| 2 | Module route structure | `src/app/(dashboard)/student/modules/[1-10]` | Stable live flow; not safe to restructure during beta |
| 3 | Gating function shape | `src/lib/gating.ts` | `enforceNodeGating` / `enforceModuleGating` must not change until data alignment is done |
| 4 | Canonical attempt table | `assessment_submissions` | `attempts` is legacy/unused; canonical table is locked |
| 5 | Event logging locations | Module `actions.ts` files | Wired in Sprint 3c; working correctly |
| 6 | Parent-child isolation | `parent_child_links` + permission helpers | Security-critical; not configurable |
| 7 | No admin threshold UI | — | Beta speed and reduced risk |
| 8 | Live PDI formula | Placeholder | Must be validated on real beta data before formula is finalized |
| 9 | Boss battle integer score pass (`>= 4`) | `submitBossBattleAction()` | Cannot safely change to percent-based without scoring overhaul |

---

## Part C: Deferred Until After Beta or Data Alignment

| # | Item | Reason |
|---|---|---|
| 1 | `skill_nodes` seeding | Empty table; requires data alignment sprint |
| 2 | Dynamic node-level DB mastery enforcement | Depends on populated `skill_nodes` |
| 3 | Final PDI formula | Must be validated on actual beta learning data |
| 4 | Dependency decay logic | Placeholder only — formula not defined |
| 5 | Tutor build enforcement | Module 9 builder UI pending |
| 6 | Assistant build enforcement | Module 10 builder UI pending |
| 7 | Admin threshold editor UI | Post-beta feature |
| 8 | Materialized rollup/reporting tables | Post-beta scale consideration |
| 9 | Duplicate capstone rows cleanup | Requires dedicated cleanup sprint |
| 10 | `constants.ts` module UUID alignment | Requires dedicated data alignment sprint |

---

## Beta Default Values Summary

```typescript
// src/lib/mastery/beta-policy.ts → BETA_CONFIGURABLE_DEFAULTS
{
  quiz_pass_percent: 80,
  mini_check_pass_percent: 80,
  boss_battle_pass_percent: 80,        // Aspirational. Live code uses integer >= 4.
  teach_back_required_status: 'pass',
  proof_required_status: 'submitted',  // Beta behavior. 'approved' is future target.
  proof_review_roles: ['teacher', 'admin'],
  tutor_build_min_status: 'draft',
  assistant_build_min_status: 'draft',
  pdi_formula_status: 'placeholder_pending_final_formula',
  dependency_decay_mode: 'placeholder',
  enforcement_mode: 'not_enforced',
}
```

---

## Cross-References
- Threshold framework implementation: [sprint-3-events-rollups-threshold-framework.md](./sprint-3-events-rollups-threshold-framework.md)
- Escalation policy: [threshold-escalation-policy.md](./threshold-escalation-policy.md)
- Mastery engine progression rules: [sprint-3-mastery-engine-progression-rules.md](./sprint-3-mastery-engine-progression-rules.md)
