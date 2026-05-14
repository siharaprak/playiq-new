# Threshold Escalation Policy
> PlayIQ Sprint 3 — Mastery Engine / Progression Rules

---

## Default Fallback Rule

> [!IMPORTANT]
> If a threshold decision remains unresolved at sprint midpoint, use the configurable beta defaults and keep `enforcement_mode = not_enforced`.

| Threshold | Beta Default Fallback |
|---|---|
| `quiz_pass_percent` | 80 |
| `mini_check_pass_percent` | 80 |
| `boss_battle_pass_percent` | 80 (aspirational) / `>= 4` integer (live behavior) |
| `teach_back_required_status` | `pass` |
| `proof_required_status` | `submitted` (beta) — `approved` is future target |
| `proof_review_roles` | `['teacher', 'admin']` |
| `tutor_build_min_status` | `draft` |
| `assistant_build_min_status` | `draft` |
| `pdi_formula_status` | `placeholder_pending_final_formula` |
| `dependency_decay_mode` | `placeholder` |
| `enforcement_mode` | `not_enforced` |

---

## Sprint Midpoint Definition

| Sprint Length | Midpoint |
|---|---|
| 1-week sprint | End of Day 3 |
| 2-week sprint | End of Day 5 |
| Unknown sprint length | Calendar midpoint between sprint start and sprint end |

Escalation trigger: If any threshold decision is unresolved at midpoint, escalate within **24 hours**.

---

## Escalation Levels

**Level 1 — Product Owner:**
- `quiz_pass_percent` / `mini_check_pass_percent` final values
- Boss battle scoring model (integer `>= 4` vs 80% percent)
- Proof `submitted` vs `approved` beta behavior

**Level 2 — Strategy Owner:**
- PDI formula
- Dependency decay logic
- Parent-facing metric definitions
- Mastery transcript criteria

**Level 3 — Technical Owner:**
- Whether enforcement_mode can safely be enabled
- Whether data alignment is blocking enforcement
- Whether threshold stays config-only

---

## Escalation Artifact Template

```
Owner:
Unresolved Decision:
Current Default:
Risk if Unresolved:
Recommended Default:
Decision Deadline:
Escalation Recipient:
Final Decision:
```

---

## Current Sprint Escalation Status

| Item | Level | Status | Recipient | Deadline |
|---|---|---|---|---|
| Boss battle scoring (integer vs percent) | L1 + L3 | ⚠️ Unresolved — documented mismatch | Product + Tech | Before enforcement sprint |
| PDI formula | L2 | 🔴 Deferred — placeholder active | Strategy | After beta data collection |
| Dependency decay | L2 | 🔴 Deferred — placeholder active | Strategy | After beta data collection |
| `proof_required_status` beta behavior | L1 | ✅ Resolved — `submitted` for beta | Product | Sprint 3 |
| `enforcement_mode` | L3 | ✅ Resolved — `not_enforced` for beta | Tech | Sprint 3 |
| `quiz_pass_percent` | L1 | ✅ Resolved — 80 | Product | Sprint 3 |
| `teach_back_required_status` | L1 | ✅ Resolved — `pass` | Product | Sprint 3 |
| `tutor_build_min_status` | L1+L3 | ✅ Resolved — `draft`, not enforced | Tech | Module 9 sprint |
| `assistant_build_min_status` | L1+L3 | ✅ Resolved — `draft`, not enforced | Tech | Module 10 sprint |

---

## Cross-References
- Beta config policy: [sprint-3-beta-config-policy.md](./sprint-3-beta-config-policy.md)
- Threshold implementation: [sprint-3-events-rollups-threshold-framework.md](./sprint-3-events-rollups-threshold-framework.md)
