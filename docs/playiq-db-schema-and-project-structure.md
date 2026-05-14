# PlayIQ — Project Reference: DB Schema & Directory Structure
> Last updated: 2026-05-14 (post Sprint 3 completion)

---

## Tech Stack
| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.3 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Database | Supabase Postgres |
| Auth | Supabase Cookie-based SSR |
| Hosting | Firebase App Hosting |
| AI Grading | Google Gemini (via `src/lib/gemini.ts`) |
| Schema Validation | Zod v4.3.6 |

---

## Live Database Schema (Supabase Postgres)

> 33 tables in public schema

---

### `profiles`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | — |
| email | text | YES | — |
| full_name | text | YES | — |
| role | text | YES | `'student'` |
| created_at | timestamptz | YES | `now()` |
| updated_at | timestamptz | YES | `now()` |
| avatar_url | text | YES | — |
| stripe_customer_id | text | YES | — |

### `user_roles`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| user_id | uuid | NO | — |
| role | text | NO | — |
| created_at | timestamptz | NO | `now()` |

### `courses`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| title | text | NO | — |
| description | text | YES | — |
| created_at | timestamptz | YES | `now()` |
| metadata | jsonb | YES | — |

> `metadata` now contains `threshold_framework` (Sprint 3) and `mastery_placeholders` (Sprint 3a)

### `modules`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| course_id | uuid | YES | — |
| title | text | NO | — |
| order | integer | NO | — |
| description | text | YES | — |
| created_at | timestamptz | YES | `now()` |
| metadata | jsonb | YES | — |

> `metadata` now contains `threshold_overrides: {}` placeholder (Sprint 3)

### `skill_nodes`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| module_id | uuid | YES | — |
| title | text | NO | — |
| order | integer | NO | — |
| description | text | YES | — |
| mastery_config | jsonb | YES | — |
| created_at | timestamptz | YES | `now()` |

> ⚠️ Currently zero rows. Curriculum is served from static `src/data/module*Content.ts` files.

### `enrollments`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| student_id | uuid | YES | — |
| course_id | uuid | YES | — |
| enrolled_at | timestamptz | YES | `now()` |
| status | text | YES | `'active'` |
| metadata | jsonb | YES | — |

### `events_log`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| student_id | uuid | NO | — |
| event_type | event_type_enum | NO | — |
| target_type | text | YES | — |
| target_id | uuid | YES | — |
| metadata | jsonb | YES | — |
| created_at | timestamptz | YES | `now()` |

#### `event_type_enum` values (17 total — 6 original + 11 added Sprint 3)
```
lesson_started, activity_completed, assessment_submitted, node_mastered,
tier_unlocked, module_completed,
attempt_started*, revision_submitted*, unlock_granted*,
proof_submitted, proof_reviewed*,
tutor_profile_created*, tutor_profile_updated*, tutor_version_created*,
assistant_profile_created*, assistant_profile_updated*, assistant_version_created*
```
> `*` = Enum exists; live integration pending (documented in sprint docs)

### `assessment_submissions`
> **Canonical table for all attempt-like activity**
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| student_id | uuid | NO | — |
| module_id | uuid | YES | — |
| node_id | uuid | YES | — |
| assessment_type | text | NO | — |
| submission_payload | jsonb | NO | `'{}'` |
| score_numeric | numeric | YES | — |
| pass_status | text | YES | — |
| graded_by | text | YES | — |
| grader_feedback | text | YES | — |
| created_at | timestamptz | YES | `now()` |

> `assessment_type` values: `mini_check`, `teach_back`, `module_quiz`, `boss_battle`

### `student_node_progress`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| student_id | uuid | NO | — |
| module_id | uuid | YES | — |
| node_id | uuid | YES | — |
| lesson_completed | boolean | YES | `false` |
| activity_completed | boolean | YES | `false` |
| mini_check_passed | boolean | YES | `false` |
| teach_back_status | text | YES | `'revise'` |
| node_mastered | boolean | YES | `false` |
| created_at | timestamptz | YES | `now()` |
| updated_at | timestamptz | YES | `now()` |

### `proof_artifact_submissions`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| student_id | uuid | NO | — |
| module_id | uuid | YES | — |
| artifact_type | text | NO | — |
| content_payload | jsonb | NO | `'{}'` |
| status | text | YES | `'submitted'` |
| reviewed_by | uuid | YES | — |
| review_notes | text | YES | — |
| created_at | timestamptz | YES | `now()` |
| updated_at | timestamptz | YES | `now()` |

> `artifact_type` values: `study_rules`, `error_review`

### `proof_artifacts`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | — |
| student_id | uuid | YES | — |
| module_id | uuid | YES | — |
| artifact_type | text | YES | — |
| content | text | YES | — |
| status | text | YES | `'pending'` |
| reviewed_by | uuid | YES | — |
| review_notes | text | YES | — |
| created_at | timestamptz | YES | — |
| updated_at | timestamptz | YES | — |

### `parent_child_links`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| parent_id | uuid | NO | — |
| child_id | uuid | NO | — |
| created_at | timestamptz | YES | `now()` |
| status | text | YES | `'active'` |

### `link_invites`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| parent_id | uuid | YES | — |
| invite_code | text | NO | — |
| used_by | uuid | YES | — |
| expires_at | timestamptz | YES | — |
| created_at | timestamptz | YES | `now()` |

### `tutor_profiles`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| student_id | uuid | NO | — |
| course_id | uuid | YES | — |
| name | text | NO | `'My PlayIQ Tutor'` |
| status | text | NO | `'draft'` |
| current_version_id | uuid | YES | — |
| fingerprint_snapshot | jsonb | NO | `'{}'` |
| doctrine_config | jsonb | NO | `'{}'` |
| metadata | jsonb | NO | `'{}'` |
| created_at | timestamptz | YES | `now()` |
| updated_at | timestamptz | YES | `now()` |

> No CRUD UI yet — builder flow pending Module 9

### `tutor_versions`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| tutor_profile_id | uuid | NO | — |
| version_number | int4 | NO | — |
| instructions | jsonb | NO | `'{}'` |
| knowledge_file_ids | uuid[] | NO | `'{}'` |
| change_summary | text | YES | — |
| created_by | uuid | YES | — |
| created_at | timestamptz | YES | `now()` |

### `assistant_profiles`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| student_id | uuid | NO | — |
| course_id | uuid | YES | — |
| name | text | NO | `'My Assistant'` |
| status | text | NO | `'draft'` |
| current_version_id | uuid | YES | — |
| persona_config | jsonb | NO | `'{}'` |
| metadata | jsonb | NO | `'{}'` |
| created_at | timestamptz | YES | `now()` |
| updated_at | timestamptz | YES | `now()` |

> No CRUD UI yet — builder flow pending Module 10

### `assistant_versions`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| assistant_profile_id | uuid | NO | — |
| version_number | int4 | NO | — |
| system_prompt | text | YES | — |
| tools_config | jsonb | NO | `'{}'` |
| change_summary | text | YES | — |
| created_by | uuid | YES | — |
| created_at | timestamptz | YES | `now()` |

### `assistant_feedback_signals`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| assistant_profile_id | uuid | YES | — |
| student_id | uuid | YES | — |
| signal_type | text | YES | — |
| signal_value | text | YES | — |
| created_at | timestamptz | YES | `now()` |

### `assistant_usage_logs`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| student_id | uuid | YES | — |
| assistant_version_id | uuid | YES | — |
| session_id | text | YES | — |
| input_tokens | int4 | YES | — |
| output_tokens | int4 | YES | — |
| created_at | timestamptz | YES | `now()` |

### `fingerprint_signals`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| student_id | uuid | YES | — |
| module_id | uuid | YES | — |
| signal_type | text | YES | — |
| signal_value | text | YES | — |
| created_at | timestamptz | YES | `now()` |

### `mastery_checkpoints`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| student_id | uuid | NO | — |
| module_id | uuid | YES | — |
| checkpoint_type | text | NO | — |
| achieved_at | timestamptz | YES | `now()` |
| metadata | jsonb | YES | — |

### `missions`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| student_id | uuid | YES | — |
| module_id | uuid | YES | — |
| mission_type | text | YES | — |
| status | text | YES | `'active'` |
| metadata | jsonb | YES | `'{}'` |
| created_at | timestamptz | YES | `now()` |
| updated_at | timestamptz | YES | `now()` |

### `knowledge_files`
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | `gen_random_uuid()` |
| student_id | uuid | YES | — |
| tutor_profile_id | uuid | YES | — |
| file_name | text | NO | — |
| file_url | text | YES | — |
| file_size | int4 | YES | — |
| mime_type | text | YES | — |
| created_at | timestamptz | YES | `now()` |

### `attempts` ⚠️ Legacy — Unused
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | — |
| student_id | uuid | YES | — |
| assessment_id | uuid | YES | — |
| response | jsonb | YES | — |
| score | numeric | YES | — |
| feedback | text | YES | — |
| created_at | timestamptz | YES | — |

> **Do not write new logic against this table.** Canonical table is `assessment_submissions`.

### `reports` ⚠️ Legacy — Unused
| Column | Type | Nullable | Default |
|---|---|---|---|
| id | uuid | NO | — |
| student_id | uuid | YES | — |
| module_id | uuid | YES | — |
| report_type | text | YES | — |
| payload | jsonb | YES | — |
| created_at | timestamptz | YES | — |

### `discussion_topics`, `discussion_replies`, `discussion_categories`, `discussion_reports`
> Full discussion board. Actively used. Do not modify in mastery engine sprints.

### `beta_applications`
| Column | Type | Nullable |
|---|---|---|
| id | uuid | NO |
| name, email, role, etc. | text | YES |
| created_at | timestamptz | YES |

### `audit_events`, `support_issues`, `shipments`
> Admin/ops tables. Not part of the learning engine.

---

## Known Data Integrity Issues (Documented, Not Fixed)

> [!WARNING]
> **Module ID mismatch**: `constants.ts` hardcodes UUIDs for modules 1-10 that do not match the live `modules` table rows in Supabase. This must be resolved in a dedicated data alignment sprint.

> [!WARNING]
> **Duplicate capstone rows**: The `modules` table contains duplicate rows for the capstone. Do not delete live data until a dedicated cleanup sprint is planned.

---

## Project Directory Structure (`src/`)

```
src/
├── app/
│   ├── layout.tsx                          # Root layout (GA4, ThemeProvider)
│   ├── globals.css
│   ├── icon.png / icon.svg
│   │
│   ├── (dashboard)/                        # Auth-gated dashboard layout group
│   │   ├── admin/
│   │   │   ├── discussions/page.tsx        # Discussion moderation
│   │   │   └── users/page.tsx             # User management
│   │   │
│   │   ├── parent/
│   │   │   ├── apprentice-setup/page.tsx  # Link child accounts
│   │   │   ├── home/page.tsx              # Parent dashboard
│   │   │   └── modules/[1-2]/page.tsx     # Parent module previews
│   │   │
│   │   └── student/
│   │       ├── home/page.tsx              # Student dashboard
│   │       └── modules/[1-10]/            # 10 modules — each contains:
│   │           ├── actions.ts             # ✅ Sprint 3: Event telemetry wired here
│   │           ├── page.tsx
│   │           ├── overview/page.tsx
│   │           ├── nodes/[nodeId]/
│   │           │   ├── lesson/page.tsx
│   │           │   ├── activity/page.tsx
│   │           │   ├── mini-check/page.tsx
│   │           │   ├── teach-back/page.tsx
│   │           │   └── completion/page.tsx
│   │           ├── quiz/page.tsx
│   │           ├── boss-battle/page.tsx
│   │           ├── proof-artifacts/page.tsx
│   │           └── completion/page.tsx
│   │
│   ├── (public)/                          # Public-facing marketing pages
│   │   ├── page.tsx                       # Landing / Home
│   │   ├── apprentice/page.tsx
│   │   ├── approach/page.tsx
│   │   ├── beta/                          # Beta signup flow
│   │   ├── contact/page.tsx
│   │   ├── how-it-works/page.tsx
│   │   ├── parents/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── proof/page.tsx
│   │   └── terms/page.tsx
│   │
│   ├── api/
│   │   ├── chat/route.ts                  # Gemini chatbot API
│   │   ├── dev-seed/route.ts              # Dev-only seeder
│   │   ├── stripe/webhook/route.ts        # Stripe payment webhooks
│   │   └── discussions/                   # Full CRUD + moderation API
│   │       ├── categories/route.ts
│   │       ├── topics/route.ts
│   │       ├── topics/[id]/route.ts
│   │       ├── topics/[id]/replies/route.ts
│   │       ├── topics/[id]/pin/route.ts
│   │       ├── topics/[id]/report/route.ts
│   │       ├── topics/[id]/moderate/route.ts
│   │       ├── replies/[id]/route.ts
│   │       ├── replies/[id]/report/route.ts
│   │       └── replies/[id]/moderate/route.ts
│   │
│   └── auth/
│       └── signout/route.ts
│
├── components/
│   ├── analytics/
│   │   └── GA4RouteTracker.tsx            # SPA route change tracking
│   ├── chat/
│   │   └── ChatBot.tsx                    # Gemini chat widget
│   ├── discussions/
│   │   ├── ReplyComposer.tsx
│   │   ├── ThreadActions.tsx
│   │   ├── TimeAgo.tsx
│   │   ├── TopicComposer.tsx
│   │   └── UserAvatar.tsx
│   ├── forms/
│   │   ├── BetaForm.tsx
│   │   ├── BossBattleForm.tsx
│   │   └── TeachBackForm.tsx
│   └── layout/
│       ├── Footer.tsx
│       ├── Navbar.tsx
│       ├── PlayIQLogo.tsx
│       ├── SocialSidebar.tsx
│       ├── ThemeProvider.tsx
│       └── ThemeToggle.tsx
│
├── data/                                  # Static curriculum content
│   ├── module1Content.ts
│   ├── module2Content.ts
│   └── ... module10Content.ts
│
├── lib/
│   ├── constants.ts                       # ⚠️ Module UUID constants (mismatched with DB)
│   ├── gating.ts                          # enforceNodeGating, enforceModuleGating
│   ├── gemini.ts                          # Gemini grading (evaluateTeachBack, evaluateBossBattle)
│   │
│   ├── auth/
│   │   └── permissions.ts                # Role-based permission helpers
│   │
│   ├── data/
│   │   ├── discussions.ts                # Discussion data helpers
│   │   ├── mastery-config.ts             # ✅ Sprint 3a: Mastery config helpers
│   │   └── progress-rollups.ts           # ✅ Sprint 3b: Safe student/parent rollups
│   │
│   ├── events/                           # ✅ Sprint 3b: Event capture layer
│   │   ├── types.ts                      # Zod schemas for all 17 event types
│   │   └── learning-events.ts            # Non-blocking logging helpers + idempotent module_completed
│   │
│   ├── mastery/                          # ✅ Sprint 3a: Mastery engine foundation
│   │   ├── types.ts                      # MasteryRequirementConfig, PlaceholderRequirementKey
│   │   ├── placeholders.ts               # inferRequirementDefaultsForNode, getRequirementSummary
│   │   ├── seed-defaults.ts              # Default mastery config seeds
│   │   └── thresholds.ts                # Type-safe threshold factory & defaults
│   │
│   ├── server/
│   │   ├── discussion-rules.ts           # Discussion server rules
│   │   ├── pagination.ts                 # Pagination helpers
│   │   ├── responses.ts                  # API success/error response helpers
│   │   └── safe-display.ts              # Safe display field sanitizer
│   │
│   └── supabase/
│       └── admin.ts                      # supabaseAdmin service-role client
│
├── utils/
│   └── supabase/
│       ├── client.ts                     # Browser Supabase client
│       ├── server.ts                     # SSR Supabase client
│       └── middleware.ts                 # Auth middleware (cookie refresh)
│
└── proxy.ts                              # Firebase Hosting proxy config
```

---

## Supabase Migrations (Applied)
| File | Description |
|---|---|
| `20260514113936_sprint3_events_rollups_threshold_defaults.sql` | Extends `event_type_enum` (+11 values), sets `threshold_framework` in `courses.metadata`, and `threshold_overrides` in `modules.metadata` |

> Previous Sprint 3a migration was applied directly via SQL Editor. Migration file is tracked in repo.

---

## Sprint Status
| Sprint | Status | Notes |
|---|---|---|
| Sprint 3a — Mastery Config Foundation | ✅ Complete | Placeholder requirements, gating.ts helpers, mastery types |
| Sprint 3b — Events, Rollups, Thresholds | ✅ Complete | Enum extended, rollups built, threshold defaults set |
| Sprint 3c — Event Integration into Module Actions | ✅ Complete | All 10 `actions.ts` files wired |
| Module 9 — Tutor Builder UI | 🔴 Pending | Tutor CRUD flows needed before event wiring |
| Module 10 — Assistant Builder UI | 🔴 Pending | Assistant CRUD flows needed before event wiring |
| Data Alignment Sprint | 🔴 Pending | Fix `constants.ts` UUID mismatch vs live DB |
