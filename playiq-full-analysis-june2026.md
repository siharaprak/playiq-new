# PlayIQ — Latest Project Directory Structure, Database Schema, and Framework Analysis (June 10, 2026)

This document serves as a comprehensive, compiled handoff packet for LLMs (such as ChatGPT) to understand the PlayIQ codebase, directory layout, live database schema, and operational framework.

---

## 1. Project Directory Structure

```
playiq-new/
├── docs/                             # Project planning, checklist logs, and runbooks (Gitignored)
│   ├── runbooks/                     # Operational procedures & support triage workflows
│   │   ├── beta-backup-rollback-release-procedures.md  # DB backups confirmation & promotion rollbacks
│   │   ├── beta-first-user-support-protocol.md          # Quick-start / first-week support protocol
│   │   ├── beta-support-runbook.md                      # Master runbook (triage targets, safety windows)
│   │   ├── final-security-and-access-review.md          # Access boundary evidence check & Stripe rules
│   │   ├── support-workflow-hardware-device-issues.md   # Browser/device/network support rules
│   │   ├── support-workflow-login-issues.md             # MFA loops, redirect loops, and cookie clearing
│   │   ├── support-workflow-onboarding-issues.md        # Invite codes, role mismatches, and billing free beta
│   │   └── staging-to-production-readiness-checklist.md # Production checklists & human owner mappings
│   └── sprint/                       # Sprint readiness reports and decision logs
│       ├── sprint-10a-beta-readiness-uat-launch-support.md
│       └── sprint-10c-final-security-access-and-support-readiness.md  # Sprint 10C status & untouched boundaries
│
├── scripts/                          # Static validation and release gates scripts
│   ├── audit-support-category-consistency.ts            # Audits support category operational tags
│   ├── audit-sprint10-blockers.ts                       # Verifies Sprint 10 launch blocker status
│   ├── run-sprint10-security-support-checks.ts          # Sprint 10C master validation pipeline runner
│   ├── verify-beta-support-workflows.ts                # Checks support runbooks for placeholders & schema matches
│   ├── verify-final-security-access-review.ts           # Audits client leakage and route bounds
│   ├── verify-logging-safety.ts                         # Checks files for SUPABASE_SERVICE_ROLE_KEY console logs
│   ├── verify-production-config-secrets.ts              # Audits env variables and raw keys
│   └── verify-uat-readiness.ts                          # Validates UAT checklists logs completion
│
├── src/                              # Source code
│   ├── app/                          # Next.js App Router folders
│   │   ├── (auth)/                   # Public authorization views (login, signup, MFA challenge)
│   │   ├── (dashboard)/              # Private role-based dashboard screens
│   │   │   ├── admin/                # Admin dashboards (Support ticket triage, student rosters, moderation)
│   │   │   ├── parent/               # Parent digests and apprentice progress views
│   │   │   ├── student/              # Student curriculum roadmap and modules 1-11
│   │   │   └── discussions/          # Forum category categories and threads
│   │   ├── api/                      # REST endpoints (LLM chat proxy, proof-artifacts upload pre-signing)
│   │   └── globals.css               # Styling design system definitions
│   │
│   ├── components/                   # UI modular panels (floating AI tutor chatbot, upload dropzone)
│   │
│   ├── lib/                          # Data Access Layer & core systems
│   │   ├── artifacts/                # Submission workflows and proof-artifact metadata validation
│   │   ├── curriculum/               # Module content matrices
│   │   ├── events/                   # Student action logging telemetry
│   │   ├── guided-ai/                # Gemini hint ladder triggers and lesson rescue prompts
│   │   ├── proof-artifacts/          # State machines, file parameters, and access policies
│   │   └── supabase/                 # supabaseAdmin client dynamic dynamic initialization
│   │
│   └── utils/supabase/              # Supabase server actions and middleware routing interceptors
│
├── supabase/migrations/              # Database schema migrations
└── package.json                      # Target dependencies and npm verify scripts
```

---

## 2. Latest Database Schema (PostgreSQL on Supabase)

### 2.1. Custom Database Enumerations (Enums)
- `checkpoint_status`: `locked`, `in_progress`, `mastered`
- `artifact_status`: `submitted`, `verified`
- `shipment_status`: `preparing`, `shipped`, `delivered`, `activated`
- `issue_status`: `open`, `resolved`
- `user_role`: `student`, `parent`, `admin`, `staff`, `teacher`
- `pass_status_enum`: `pass`, `fail`, `revise`
- `assessment_type_enum`: `mini_check`, `teach_back`, `module_quiz`, `boss_battle`
- `artifact_type_enum`: `study_rules`, `error_review`, `supplemental_proof`
- `artifact_status_enum`: `draft`, `submitted`, `under_review`, `approved`, `revise`, `rejected`

### 2.2. Table Index & Fields Structure

#### 1. `profiles`
Tracks credentials, system privileges, and access state.
- `id` (`uuid`, PK): Matches `auth.users.id`.
- `email` (`character varying`): Unique profile email.
- `full_name` (`character varying`).
- `role` (`public.user_role`): Defaults to `'student'`.
- `status` (`text`): Toggles between `'active'` and `'suspended'`. Gated dynamically by middleware and server actions.
- `username` (`text`): Unique forum handle.
- `created_at`/`updated_at` (`timestamp with time zone`).

#### 2. `support_issues`
Internal support ticket repository. Maps to operational guidelines without rigid type constraints (treated as text strings).
- `id` (`uuid`, PK): Unique issue identity.
- `reporter_id` (`uuid`): Matches `profiles.id`.
- `issue_text`/`subject`/`body` (`text`).
- `category` (`text`): Operational tag (`'onboarding'`, `'login_auth'`, `'device_hardware'`, etc.).
- `priority` (`text`): Defaults to P3. Evaluated statically.
- `status` (`public.issue_status`): Defaults to `'open'`.
- `assigned_to` (`uuid`): References the support owner's `profiles.id`.
- `metadata` (`jsonb`): Stores JSON payload tracking triage logs and resolution comments.
- `created_at`/`resolved_at` (`timestamp with time zone`).

#### 3. `proof_artifact_submissions`
Handles student capstone proof uploads and reviews.
- `id` (`uuid`, PK).
- `student_id` (`uuid`): References `profiles.id`.
- `module_id` (`uuid`): References `modules.id`.
- `artifact_type` (`public.artifact_type_enum`): `'study_rules'` (Warrior Code) or `'error_review'` (Boundaries Plan).
- `content_payload` (`jsonb`): Serialized student answers.
- `status` (`text`): Defaults to `'draft'`. Valid states include `'draft'`, `'submitted'`, `'approved'`, and `'revise'`.
- `file_path`/`mime_type`/`original_name` (`text`): Storage pointer reference.
- `reviewed_by` (`uuid`): Admin auditor's `profiles.id`.
- `reviewed_at` (`timestamp with time zone`).
- `review_notes` (`text`).

#### 4. `student_node_progress`
Core course pacing progression logger.
- `id` (`uuid`, PK).
- `student_id` (`uuid`): References `profiles.id`.
- `module_id` (`uuid`): References `modules.id`.
- `node_id` (`character varying`): References `skill_nodes.id`.
- `lesson_completed`/`activity_completed`/`mini_check_passed` (`boolean`): Milestones check.
- `teach_back_status` (`public.pass_status_enum`): Defaults to `'revise'`.
- `node_mastered` (`boolean`): Mastered node flag.
- `completed_at` (`timestamp with time zone`).

#### 5. `assessment_submissions`
Details scores and grading states for checks and quizzes.
- `id` (`uuid`, PK).
- `student_id` (`uuid`): References `profiles.id`.
- `module_id` (`uuid`): References `modules.id`.
- `node_id` (`character varying`).
- `assessment_type` (`public.assessment_type_enum`).
- `submission_payload` (`jsonb`): Stores prompts/responses.
- `score_numeric` (`numeric`).
- `pass_status` (`public.pass_status_enum`).
- `created_at` (`timestamp with time zone`).

#### 6. `tutor_profiles` & `tutor_versions`
User custom Module 9 AI tutor directives.
- `tutor_profiles` maps `student_id`, custom `name`, and references the `current_version_id`.
- `tutor_versions` tracks version state, custom `instructions` (JSONB), and whitelisted `knowledge_file_ids` (UUID array).

#### 7. `assistant_profiles` & `assistant_versions`
Student Module 10 custom AI Assistant parameters.
- `assistant_profiles` tracks `owner_user_id`, `name`, `status` (`'draft'` vs `'active'`), and `persona_config`.
- `assistant_versions` contains the `system_prompt` instructions, active version number, and `tools_config` integrations.

#### 8. `knowledge_files`
Metadata catalog for PDF/TXT files uploaded by students to train their tutors/assistants.
- `id` (`uuid`, PK).
- `owner_user_id`/`student_id` (`uuid`).
- `title`/`storage_bucket`/`storage_path` (`text`).
- `visibility` (`text`): Enforced as `'private'`.
- `tutor_profile_id`/`assistant_profile_id` (`uuid`): Parent references.

#### 9. `parent_child_links`
- Mapped columns: `parent_id` (`uuid`), `student_id` (`uuid`), `relationship_label` (`text`), `status` (`text`).

#### 10. `link_invites`
Tracks invitation codes to assign student or parent roles.
- Columns: `invite_code` (`text`), `target_email` (`text`), `target_role` (`text`), `status` (`'open'`, `'claimed'`), `claimed_by_user_id` (`uuid`).

---

## 3. Core Architectural Patterns

### 3.1. Dynamic `supabaseAdmin` Proxy Initializer
To prevent server build steps from throwing errors when environment configuration variables are not set during static page generation phase, the project utilizes a lazy proxy pattern in [admin.ts](file:///c:/Users/Auviore/Documents/Sienvi/Projects/playiq-new/src/lib/supabase/admin.ts):
```typescript
let memoizedClient: any = null;

function getClient() {
  if (!memoizedClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      console.error('❌ [supabaseAdmin] Error: Missing required admin environment variables!');
    }
    memoizedClient = createClient(url || '', key || '', {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return memoizedClient;
}

export const supabaseAdmin = new Proxy({} as any, {
  get(target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
```

### 3.2. Transitive Client-Side Secret Leakage Prevention
To protect administrative API keys, Next.js page generation assets are statically verified. The pipeline crawls client components (`"use client"`) and recursively traces their dependency imports. To avoid flagging backend server actions imported in client views, the scanner immediately terminates dependency traversal if a file declares `"use server"` or imports `"server-only"`.

### 3.3. Payment Gating Deferred for Invite-Only Beta
Stripe subscription hooks [stripe/webhook](file:///c:/Users/Auviore/Documents/Sienvi/Projects/playiq-new/src/app/api/stripe/webhook/route.ts) are fully configured but remained deferred/disabled. Invite-code registrations resolve roles directly and bypass checkout paths because the beta pilot is entirely free.

### 3.4. Parent Proof Storage Access Gating
Students upload proof submissions to a private storage bucket (`proof-artifacts`). Because parents are restricted to telemetry summaries, the system never passes pre-signed URLs down to the parent dashboard. The signed access policy [signed-access-policy.ts](file:///c:/Users/Auviore/Documents/Sienvi/Projects/playiq-new/src/lib/proof-artifacts/signed-access-policy.ts) strictly limits file downloading capabilities to administrators and the owning student.

### 3.5. Non-Cascade Administrative Purging
In administrative user-deletion flows, database foreign keys do not automatically cascade-erase records on the `audit_events` ledger. When deleting a user profile, the admin endpoint executes a sequence:
1. Erase all logging files linked to the user inside `audit_events`.
2. Clear parent link maps and student node progresses.
3. Call `supabaseAdmin.auth.admin.deleteUser` to remove authentication identities.
