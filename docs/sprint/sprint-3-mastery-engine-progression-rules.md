# Sprint 3 — Mastery Engine + Progression Rules (Config Foundation)

## Purpose

This sprint establishes the **configuration foundation** for PlayIQ's mastery requirement system.
It defines placeholder schemas for teach-back, proof, tutor build, and assistant build requirements
without enforcing any new gates or altering live student progress.

This is a **config-only** sprint. No scoring, no lockouts, no UI changes.

## Scope

### What was done
- Set mastery placeholder metadata on `courses.metadata` and `modules.metadata` via DB migration
- Created TypeScript type definitions for the mastery requirement config shape
- Created pure helper functions for generating, merging, and querying placeholder configs
- Created seed-defaults helper for future `skill_nodes` seeding
- Created server-only data access layer for reading mastery metadata from DB
- Added non-breaking helper functions to `src/lib/gating.ts` (no enforcement)
- Documented all findings and decisions

### What is intentionally NOT enforced yet
- No gates or lockouts based on mastery config
- No scoring or grading based on mastery config
- No UI badges or indicators
- No student progress modifications
- No automatic creation of tutor/assistant profiles
- No proof artifact creation
- No changes to existing `enforceNodeGating` or `enforceModuleGating` behavior

## Tables Reused

| Table | Usage |
|---|---|
| `courses` | `metadata` JSONB updated with `mastery_placeholders` |
| `modules` | `metadata` JSONB updated with `mastery_defaults` |
| `skill_nodes` | NOT updated (0 rows exist — config lives in TypeScript) |
| `student_node_progress` | NOT touched |
| `attempts` | NOT touched |
| `assessment_submissions` | NOT touched |
| `mastery_checkpoints` | NOT touched |
| `proof_artifacts` | NOT touched |
| `proof_artifact_submissions` | NOT touched |
| `tutor_profiles` | NOT touched |
| `tutor_versions` | NOT touched |
| `assistant_profiles` | NOT touched |
| `assistant_versions` | NOT touched |

## Critical Blockers Found

### 1. `skill_nodes` table is empty
The entire module learning flow runs off static TypeScript files (`src/data/module*Content.ts`)
with simple string IDs (`'1'`, `'2'`, etc.). The `skill_nodes` table has zero rows.
Node-level mastery config must live in TypeScript helpers until skill_nodes are seeded.

### 2. Module ID mismatch
`src/lib/constants.ts` has hardcoded UUIDs that do not match the live database for modules 2-10.
Module 1 ID matches. **This must be resolved in a dedicated data alignment sprint.**

### 3. Duplicate capstone rows
Two capstone module rows exist in the DB:
- `c1f94091...` (order_num = 11, "Capstone: Master Trial")
- `c9210282...` (order_num = 99, "Capstone Master Trial")

**Both were given metadata safely. Neither was deleted in this sprint.**

## Files Changed

| File | Action | Description |
|---|---|---|
| `supabase/migrations/20260514105122_sprint3_mastery_requirement_placeholders.sql` | NEW | Migration: course + module metadata defaults |
| `src/lib/mastery/types.ts` | NEW | TypeScript types for mastery config shape |
| `src/lib/mastery/placeholders.ts` | NEW | Pure placeholder config helpers |
| `src/lib/mastery/seed-defaults.ts` | NEW | Future seed defaults helper |
| `src/lib/data/mastery-config.ts` | NEW | Server-only DB access for mastery metadata |
| `src/lib/gating.ts` | MODIFIED | Added 3 non-breaking helper functions |
| `docs/sprint/sprint-3-mastery-engine-progression-rules.md` | NEW | This document |

## Placeholder Schema

```json
{
  "version": "sprint3_placeholder_v1",
  "requirements": {
    "teach_back": {
      "required": boolean,
      "placeholder": true,
      "status_source": "student_node_progress.teach_back_status",
      "passing_status": "pass",
      "notes": string
    },
    "proof": {
      "required": boolean,
      "placeholder": true,
      "artifact_source": "proof_artifacts",
      "allowed_artifact_types": string[],
      "review_required": boolean,
      "review_roles": ["teacher", "admin"],
      "notes": string
    },
    "tutor_build": {
      "required": boolean,
      "placeholder": true,
      "source_table": "tutor_profiles",
      "version_source": "tutor_versions",
      "minimum_status": "draft",
      "notes": string
    },
    "assistant_build": {
      "required": boolean,
      "placeholder": true,
      "source_table": "assistant_profiles",
      "version_source": "assistant_versions",
      "minimum_status": "draft",
      "notes": string
    }
  },
  "unlock_policy": {
    "placeholder": true,
    "enforcement_mode": "not_enforced",
    "future_engine": "mastery_rule_engine"
  }
}
```

## Module-Level Defaults

| Module | order_num | teach_back | proof | tutor_build | assistant_build |
|---|---|---|---|---|---|
| Setup & Personalization | 0 | ❌ | ❌ | ❌ | ❌ |
| AI Learning Code | 1 | ✅ | ✅ | ❌ | ❌ |
| Digital Smarts | 2 | ✅ | ✅ | ❌ | ❌ |
| Pre-Learn System | 3 | ✅ | ✅ | ❌ | ❌ |
| Lesson Rescue Mode | 4 | ✅ | ✅ | ❌ | ❌ |
| Compression Learning | 5 | ✅ | ✅ | ❌ | ❌ |
| Self-Testing & Mistake Bank | 6 | ✅ | ✅ | ❌ | ❌ |
| Notes & Study Pack | 7 | ✅ | ✅ | ❌ | ❌ |
| Writing & Answer Clarity | 8 | ✅ | ✅ | ❌ | ❌ |
| Build Your AI Tutor | 9 | ✅ | ✅ | ✅ | ❌ |
| Build Your AI Assistant | 10 | ✅ | ✅ | ❌ | ✅ |
| Capstone | 11/99 | ✅ | ✅ | ✅ | ✅ |

## Future Sprint 4/5 Handoff

1. **Data alignment sprint** — Fix `constants.ts` module IDs to match live DB. Clean up duplicate capstone.
2. **Seed skill_nodes** — Use `src/lib/mastery/seed-defaults.ts` to generate correct `mastery_config` for each seeded row.
3. **Wire mastery_config reads into gating** — Modify `enforceNodeGating`/`enforceModuleGating` to read from mastery_config instead of hardcoded logic.
4. **Add UI badges** — Display placeholder requirement indicators in student module view.
5. **Build mastery rule engine** — Replace `enforcement_mode: 'not_enforced'` with actual `soft_warn` or `hard_gate` behavior.

## QA Checklist

- [ ] Student dashboard loads
- [ ] Student module page loads
- [ ] Module 1 still behaves as before
- [ ] Module 2 still behaves as before
- [ ] Discussion board loads
- [ ] Post/reply/report/moderation still works
- [ ] Parent dashboard loads
- [ ] Admin users page loads
- [ ] No new tables created
- [ ] No student progress rows changed
- [ ] Course metadata updated with placeholder version
- [ ] Module metadata updated with mastery_defaults
- [ ] Placeholder helpers return correct Module 9 defaults (tutor_build required)
- [ ] Placeholder helpers return correct Module 10 defaults (assistant_build required)
- [ ] Placeholder helpers return correct Capstone defaults (both required)
- [ ] Build and typecheck pass
- [ ] No service role usage in client code
