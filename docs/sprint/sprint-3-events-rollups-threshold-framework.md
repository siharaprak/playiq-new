# Sprint 3 Continued — Events, Rollups, Threshold Framework

## Audit Results

### Where Things Currently Happen

| Area | Location | Finding |
|---|---|---|
| Assessment submissions created | `src/app/(dashboard)/student/modules/*/actions.ts` | `advanceNodePhase()` → mini_check, `submitTeachBackAction()` → teach_back, `submitQuiz()` → module_quiz, `submitBossBattleAction()` → boss_battle |
| Student node progress updated | Same actions.ts files | `advanceNodePhase()` inserts/updates flags; `submitTeachBackAction()` sets node_mastered=true |
| Unlocks calculated | `src/lib/gating.ts` | `enforceNodeGating()` checks progress flags per phase; `enforceModuleGating()` checks node mastery count + quiz/boss/artifacts |
| Module/node completion calculated | `src/lib/gating.ts` + actions.ts | node_mastered set in teach-back; module completion checked in `enforceModuleGating('completion')` |
| Proof artifacts created | Each module's `submitArtifacts()` | Two rows per module (study_rules + error_review) |
| Events logged | Each module's `advanceNodePhase()` + `submitTeachBackAction()` | Only lesson_started, activity_completed, assessment_submitted currently logged |
| Tutor/assistant tables used | **NOWHERE** in app code | Tables exist with 0 rows; no CRUD flows |
| Reports table used | **NOWHERE** | 0 rows, never queried |
| Parent dashboard queries | `parent/home/page.tsx` | Raw inline supabaseAdmin queries to parent_child_links, profiles, student_node_progress |

### Event Type Enum — Before and After

| Enum Value | Status Before | Status After |
|---|---|---|
| lesson_started | ✅ exists, logged | Unchanged |
| activity_completed | ✅ exists, logged | Unchanged |
| assessment_submitted | ✅ exists, logged | Unchanged |
| node_mastered | ✅ exists, NOT logged | Unchanged (helper ready) |
| tier_unlocked | ✅ exists, NOT logged | Unchanged |
| module_completed | ✅ exists, NOT logged | Unchanged (helper ready) |
| attempt_started | ❌ missing | ✅ Added — NOT integrated (placeholder) |
| revision_submitted | ❌ missing | ✅ Added |
| unlock_granted | ❌ missing | ✅ Added |
| proof_submitted | ❌ missing | ✅ Added |
| proof_reviewed | ❌ missing | ✅ Added |
| tutor_profile_created | ❌ missing | ✅ Added (pending integration) |
| tutor_profile_updated | ❌ missing | ✅ Added (pending integration) |
| tutor_version_created | ❌ missing | ✅ Added (pending integration) |
| assistant_profile_created | ❌ missing | ✅ Added (pending integration) |
| assistant_profile_updated | ❌ missing | ✅ Added (pending integration) |
| assistant_version_created | ❌ missing | ✅ Added (pending integration) |

### Event Gaps Still Open

| Event | Status |
|---|---|
| attempt_started | Enum added, helper exists, NOT integrated — no explicit start phase in current flow |
| tutor_profile_created/updated | Helper exists — no CRUD flow to integrate with (pending Module 9) |
| tutor_version_created | Helper exists — no CRUD flow (pending Module 9) |
| assistant_profile_created/updated | Helper exists — no CRUD flow (pending Module 10) |
| assistant_version_created | Helper exists — no CRUD flow (pending Module 10) |
| quiz submission event | Not logged yet — would need actions.ts integration |
| boss_battle submission event | Not logged yet — would need actions.ts integration |
| proof_submitted event | Not logged yet — would need actions.ts integration |
| node_mastered event | Enum exists, helper exists — not called from actions.ts yet |
| module_completed event | Enum exists, helper exists — not called from actions.ts yet |

### Integration Decision

Rather than editing all 10 module `actions.ts` files (risky, identical patterns), the event helpers are created as a standalone layer. Integration into each module's actions should be done in a focused follow-up sprint where each module is verified individually.

## Event Helper Architecture

```
src/lib/events/
├── types.ts            # Zod schemas + TypeScript types
└── learning-events.ts  # Server-only event helpers (supabaseAdmin)
```

All helpers:
- Import `server-only`
- Use `supabaseAdmin` (service role)
- Validate with Zod
- Catch errors silently (non-blocking)
- Return `{ ok, eventId?, error? }`
- Use `assessment_submission` as canonical target_type (not legacy `attempts` table)

## Rollup Field Definitions

### Student Rollup
| Field | Source | Notes |
|---|---|---|
| student_id | parameter | — |
| display_name | profiles.full_name | Never email |
| modules_total | hardcoded (10) | — |
| modules_started | student_node_progress distinct module_ids | — |
| modules_completed | computed (all nodes mastered + quiz + boss + proofs) | — |
| nodes_total_or_known | hardcoded (51) | Sum of known module node counts |
| nodes_mastered | student_node_progress where node_mastered=true | — |
| assessments_submitted | assessment_submissions count | — |
| latest_activity_at | events_log latest created_at | — |
| proof_submissions_total | proof_artifact_submissions count | — |
| proof_approved_total | proof_artifact_submissions where status='approved' | — |
| tutor_profile_status | tutor_profiles exists check | 'none' or 'exists' |
| tutor_versions_count | tutor_versions count | — |
| assistant_profiles_count | assistant_profiles count | — |
| assistant_versions_count | assistant_versions count | — |
| discussion_topics_count | discussion_topics count | — |
| discussion_replies_count | discussion_replies count | — |

### Parent Child Rollup
| Field | Source | Notes |
|---|---|---|
| display_name | profiles.full_name | **Never email** |
| modules_completed | computed | — |
| current_module_title | first incomplete module | — |
| latest_activity_at | events_log | — |
| proof_submissions_total | proof_artifact_submissions | — |
| proof_approved_total | proof_artifact_submissions status='approved' | — |
| discussion_activity_count | topics + replies | — |
| tutor_build_status | tutor_profiles + tutor_versions | 'none'/'started'/'has_version' |
| assistant_build_status | assistant_profiles + assistant_versions | 'none'/'started'/'has_version' |
| flags | computed | 'Not started', 'No recent activity' |

## Parent Visibility Rules
- Parent rollups ONLY include children linked via `parent_child_links`
- `getParentChildSummary()` verifies the link before returning data
- Email is NEVER returned — uses `full_name` or 'Student' fallback
- No cross-child data leakage

## Threshold Defaults

| Threshold | Default | Enforced? |
|---|---|---|
| quiz_pass_percent | 80 | ❌ Not enforced |
| mini_check_pass_percent | 80 | ❌ Not enforced |
| boss_battle_pass_percent | 80 | ❌ Not enforced |
| teach_back_required_status | pass | ❌ Not enforced |
| proof_required_status | approved | ❌ Not enforced |
| proof_review_roles | teacher, admin | ❌ Not enforced |
| tutor_build_min_status | draft | ❌ Not enforced |
| tutor_version_required | true | ❌ Not enforced |
| assistant_build_min_status | draft | ❌ Not enforced |
| assistant_version_required | true | ❌ Not enforced |
| dependency_decay_mode | placeholder | ❌ Not enforced |
| pdi_formula_status | placeholder_pending_final_formula | ❌ Not enforced |

## What Remains Placeholder
- `attempt_started` event — enum value exists, not integrated
- Tutor/assistant event helpers — created, no CRUD flows to integrate with
- PDI formula — status is `placeholder_pending_final_formula`
- Dependency decay — mode is `placeholder`
- Full enforcement — `enforcement_mode` is `not_enforced`
- Event integration into module actions — helpers exist, not wired in yet

## What Is Intentionally NOT Enforced
- All threshold values are configurable defaults only
- Gating behavior is unchanged (`src/lib/gating.ts` untouched except Sprint 3 placeholder helpers)
- No student progress is mutated
- No lockouts or scoring changes

## Future Handoff to Full Rule Engine
1. **Wire event logging into module actions** — add `logAttemptEvent`, `logCompletionEvent`, `logProofEvent` calls
2. **Build tutor/assistant CRUD flows** — Module 9/10 UI + server actions
3. **Wire threshold reads into gating** — replace hardcoded `>= 80` with `getCourseThresholdConfig().defaults.quiz_pass_percent`
4. **Implement PDI formula** — replace placeholder with actual formula
5. **Switch enforcement_mode** — from `not_enforced` to `soft_warn` or `hard_gate`
6. **Replace parent dashboard raw queries** — use `getParentChildrenRollups()` instead

## Manual QA Checklist
- [ ] Student dashboard loads
- [ ] Student Module 1 works
- [ ] Student Module 2 works
- [ ] Parent dashboard loads
- [ ] Admin users page loads
- [ ] Discussion board loads
- [ ] Post/reply/report/moderation still works
- [ ] Assessment submission still works
- [ ] Existing student progress not reset
- [ ] Tutor update event helper exists (documented as pending)
- [ ] Assistant update event helper exists (documented as pending)
- [ ] Student rollup returns expected safe fields
- [ ] Parent rollup returns only linked children
- [ ] No emails exposed in rollups
- [ ] Threshold defaults available and documented
