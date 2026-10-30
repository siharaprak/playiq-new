# PlayIQ beta technical blocker reporting — implementation copyback

Date: 2026-10-30. Project: PlayIQ. Lab: `PLAYIQ_ORION_WIZARD_LAB`.
Agent/owner: BETA_BLOCKER_REPORT worker. Cycle: `playiq-weekend-test-20261030`.
Active department/SOP step: Course Release Implementation.
Worktree: `/private/tmp/playiq-weekend-test-20261030`; original main checkout untouched.

## What is implemented

`BetaBlockerReport` is an accessible collapsible **Report a problem / I’m blocked** form.
It is present for the beta shell only, at any module 00–14, independent of saved answers,
approval, progress, lesson completion, Tutor creation or end-of-module surveys. Module 13
remains an optional future-project seed, not a new assignment. A problem report itself is
optional, never a course-completion requirement.

The learner writes a 10–4000-character technical description and chooses:

- `blocked`: cannot continue;
- `problem`: can continue but something is wrong.

The form visibly shows the included browser name/major version, coarse OS label and viewport
size, and the beta course page path. It does not capture raw user-agent, IP address, account
identity fields, arbitrary URL parameters/fragments, learning answers, screenshots, camera,
screen capture, attachments or external files. Private information is explicitly discouraged.
Screenshots are not uploaded; a learner may merely mention that a safely cropped screenshot
is available separately. The message and context are learner/client-supplied reports, not
trusted proof of browser state or completion.

Server validation permits only module 0–14 and `/student/course-beta`, optionally with the
single `?module=N` selector matching the report's module. Final-course routes, absolute URLs,
private query parameters, fragments, invalid types, hidden controls and unknown payload keys
are rejected. Browser/device fields are at most 120 characters each.

The new server action calls main-owned `requireCourseReleaseAccess('beta')`: exact server
flag, direct verified cookie auth, then administrator-managed enabled release enrollment.
There is no profile role/status dependency, legacy support helper, mock client, service-role
override, provider call, notification or external message. `student_id` and release ID are
set by the server, not accepted from the caller.

## Integration contract for the course-shell owner

```tsx
import BetaBlockerReport from './BetaBlockerReport';

<BetaBlockerReport shell={shell} moduleNumber={lesson.moduleNumber} />
```

Place it near the beta module header, **outside** any completion gate, loading/error branch
or disabled lesson fieldset, and outside another `<form>`. Do not hide it when a learning
record fails to load or the lesson remains incomplete. It returns `null` for `shell='final'`.
The component uses existing course-release styles; no shared CSS was edited by this worker.

For a caller-controlled synthetic client harness only, pass optional
`submit={(input) => Promise<CourseBlockerResult>}`. There is no query, cookie or environment
setting that can replace the production action. The real browser path is captured when the
form opens/submits; a synthetic preview route must use the injected fake action rather than
pretend it is a real beta route. Browser interaction QA should label such reports synthetic.

The action exports `CourseBlockerInput`, `CourseBlockerResult`, and `submitCourseBlocker` from
`src/app/(dashboard)/student/course-blocker-actions.ts`.

```ts
type CourseBlockerInput = {
  reportId: string; // crypto.randomUUID() v4; stable across uncertain retries
  moduleNumber: number;
  message: string;
  browser: string;
  device: string;
  pagePath: string;
  severity: 'blocked' | 'problem';
};
// Success only after owner-scoped readback matches all report fields:
{ ok: true, ticketId: string, status: 'confirmed' }
// Failure: safe text; optional reason='validation' means rejected before any write.
{ ok: false, error: string, reason?: 'validation' }
```

## Honest confirmation and retry behavior

A client-generated reference alone is **not** a saved ticket. Before confirmation it is
labelled “Report reference (not a confirmation).” Initial reconciliation checks whether that
owner/release already has the same report ID and payload. A new insert is then read back;
the UI says saved only when the persisted fields match. An insert response alone does not
count as confirmation.

If the connection ends or storage is unavailable, the text/reference stay visible in the
open page. Retrying reuses the same ID and frozen payload. A prior successful-but-unconfirmed
insert is recovered without a duplicate; a concurrent duplicate insert is reconciled once.
A changed payload under the same reference is a conflict, never an overwrite. Validation
failures occur before writes, so the learner may correct the form after those failures.
After confirmation the learner can copy the ticket ID, with a select-and-manual-copy fallback,
or explicitly start another report. No retry loop runs autonomously.

Text is held only in the current React page state, not local/session storage; navigating away
or reloading can lose an unconfirmed draft/reference. The form warns the learner to keep
the page open and keep the reference if asking the team to reconcile. Nothing claims the team
has read, fixed, emailed or been notified about the report. “Confirmed” means durable storage,
not resolution. Browser clipboard failure never becomes a false copied-success message.

## Migration and Iris staging inspection

New migration: `supabase/migrations/20261030091000_course_release_blockers.sql`.
Apply **after** main's `20261030090000_course_release_learning_records.sql`, which defines
trusted enrollment, `course_release_can_access`, and the bounded-text validator.
The release owner, not this worker, owns hosted migration authority.

`course_release_blockers` stores exactly the requested technical context:
`id`, `student_id`, `release_id`, `module_number`, `message`, `browser`, `device`, `page_path`,
`severity`, `created_at`. The UUID also serves as the idempotent report reference. The
server-default creation timestamp is not included in the authenticated INSERT column grant.
RLS is enabled and forced. Authenticated users receive SELECT and bounded-column INSERT
only, constrained to their own identity and `course_release_can_access('beta')`. No student
UPDATE/DELETE grants or policies are added. There is no linked-parent/admin bypass policy.
Anonymous users receive no grants. The report has no foreign key to module progress and no
completion prerequisite.

For the approved preview/staging operator only (not production; do not print the connection
string), apply through the approved migration runner or already-approved connection:

```sh
psql "$PLAYIQ_PREVIEW_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/20261030091000_course_release_blockers.sql
```

The prerequisite is not optional. No cloud migration was performed by this worker.
Enable only the approved beta preview flag and enroll the intended existing tester through
main's administrative enrollment process. Do not make a student self-enrollment endpoint.

Iris inspects reports manually through the **authorized staging database operator** interface,
not an admin/service-role shortcut added to the student app. Example read-only queries:

```sql
-- Recent reports for this course release; review the severity before the message.
SELECT id, module_number, severity, created_at, page_path, browser, device, message
FROM public.course_release_blockers
WHERE release_id = 'playiq-2026-10-30'
ORDER BY created_at DESC
LIMIT 100;

-- Replace with the learner's copied UUID; never ask for their password.
SELECT id, module_number, severity, created_at, page_path, browser, device, message
FROM public.course_release_blockers
WHERE release_id = 'playiq-2026-10-30'
  AND id = '00000000-0000-4000-8000-000000000000'::uuid;
```

A normal student session can see only its own enrolled reports. A privileged staging SQL
operator can inspect the queue under their existing authority; SQL-editor output is not proof
that student RLS is correct. No new triage dashboard, alerts or routing automation is delivered.
Do not publish private message text in the handoff or test evidence.

## Tests and actual observations

Completed locally:

```sh
node --experimental-strip-types --test scripts/course-blocker.test.mjs
node --experimental-strip-types --test scripts/course-learning-record.test.mjs scripts/course-blocker.test.mjs scripts/course-release-rls.test.mjs
./node_modules/.bin/tsc --noEmit --incremental false
./node_modules/.bin/eslint 'src/app/(dashboard)/student/course-blocker-actions.ts' src/components/course-release/BetaBlockerReport.tsx
```

Results: **14/14 blocker checks pass**, **35/35 combined offline checks pass**, TypeScript
no-emit exit 0, scoped blocker TS/TSX lint exit 0. The first scoped lint run caught a React
ref access during render; replacing the render condition with its existing state reference
fixed it. No rule was disabled. Node's experimental/type-less-package warnings are notices,
not test failures.

The blocker tests execute the real server action against an offline SDK fixture and render
the real TSX with React SSR. They cover bounded input, unsafe routes/private query rejection,
helper failure, pre-completion reports for all modules, owner/release checks, same-ID retry,
unknown insert outcome, conflict protection, missing migration, beta-only named inputs,
copy fallback source contract and absence of screenshots/providers/profile dependencies.

The main-owned `scripts/course-release-rls.test.mjs` additionally executes both actual SQL
migrations inside isolated PostgreSQL/WASM (PGlite), with synthetic users and **no**
`profiles.status`. Observed passing cases include enrollment/owner/shell isolation,
profile-mutation not granting access, inability to self-enroll, beta-feedback completion gating,
pre-completion blocker insertion, route mismatch rejection, and denial of student blocker
updates. This is real local SQL execution with synthetic data, **not** a hosted database
migration or live student/browser session.

Outstanding acceptance: main's independent review; component placement/interactive browser
exercise including failure/retry/copy behavior; approved hosted staging migration;
two actual enrolled student-cookie sessions, an unenrolled account and an anonymous session;
mobile/tablet/desktop; Iris confirming the actual ticket appears in staging. No production,
provider, external AI, learner-outcome or runtime-enforcement claim is made.

## Scope, hashes and handback

Changed by this worker in this step:

1. `src/components/course-release/BetaBlockerReport.tsx`
2. `src/app/(dashboard)/student/course-blocker-actions.ts`
3. `supabase/migrations/20261030091000_course_release_blockers.sql`
4. `scripts/course-blocker.test.mjs`
5. `docs/PLAYIQ_BLOCKER_REPORT_20261030.md`
6. `docs/PLAYIQ_ANSWER_TO_FILE_MAP_20261030.md` — added by the main owner's later explicit
   request; reconciled to enrollment-based authority, review token, snakecase filename,
   `lessonChoices`, and current offline SQL results. Shared data/actions/90000 migration and
   main's test scripts were read only, not edited in this blocker step.

Documents fall under the repository's `docs/` ignore rule. Main must explicitly include the
two exact documentation paths when staging the release. This worker did not stage, commit,
push, contact another person/thread, change providers/credentials or apply cloud migrations.

Loaded current local `AGENTS.md`, Next server/client component/directive references, and
reloaded the four canonical Derek/personality/execution sources from
`/Users/blackwizard/Repos/Sienvi/SebastianCore`. Per-file current SHA-256:

- Personality stack: `9c1925a82bd7eb3455edf44962288a8b8f485e59ff909862e11349c138eeb564`
- Derek prompt: `a55bca8f1836f8b04ce3fd2c1cdba8294282e0da5cf865e7e12041dc5ec4eb57`
- Execution contract: `a5c3a6310a28a19da6f1b57b345b839ef80cb2cb128f8e0718075fb4f01de422`
- Execution policy: `51a223a7c801bdc082944177c0553d605424844ef2ee638047b1d0051baa111e`

Parent-provided prior bundle acknowledgement reference:
`23a0a855e74eaefb8defb51f9fba279d3a78b965d5e676d11aa773a153a12319`.
No serialization/hashing scheme for that parent reference was inferred. The worker's
separate reproducible four-file `shasum` hash-list digest is
`06fdc07d56460c36d22c8ea097cec223245247fb813a9e31047bd802ac34737b`.
Source presence/load acknowledgement does not establish deployed multi-agent fencing or
durable memory synchronization. No memory write/sync was performed.
