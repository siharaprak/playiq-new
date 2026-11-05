# PlayIQ Interface Restoration Contract

Revision 1, November 5, 2026. Task `playiq-restoration-20261105`.
Recipient and implementation owner: Iris, using her existing PlayIQ development environment.
Decision owner: Scott. Curriculum and acceptance review: Codex in Scott's main PlayIQ chat.

**Restore the last approved course interface, then update the course material inside it. No new UI or UX design.** Preserve the established branding, imagery, media, onboarding, and interaction patterns. Do not use Codex's rejected November 4 replacement as the visual reference.

Scott confirmed the recovered original lesson screenshot and its full colour treatment on November 5. It is included as `evidence/original-module-1-lesson.png`. The recovered pre-release course source is pinned in `VISUAL_BASELINE.md`. Restore those existing course components selectively on current main, rather than rolling back the whole application. Keep the working floating Orion, security fixes, newer persistence/export functions, and existing student records.

This is an implementation contract, not a claim that restoration is complete. Scott approved preparation and publication of these handoff documents only. Application changes, review acceptance, GitHub release publication, and production activation remain separate steps.

## Approval sequence

1. Complete Modules 00, 1, and 2 in the original interactive style for **Scott to review first here in his main PlayIQ chat**. Supply a runnable local review and a concise screen recording or screenshots of the same build. If working on another computer, provide a reproducible review package through the existing shared source workflow. Do not quietly publish an unreviewed replacement to production to make it accessible.
2. After Scott approves all three, complete Modules 3 through 14 using that accepted implementation. Verify the entire course, then commit and push the application release. Prepare the precise release handoff for Iris's existing hosting workflow.
3. Iris publishes the already-reviewed course for Sihara and beta testers to test the actual student experience. Their testing follows Scott's initial approval and full-course completion; it is not an additional design gate between the first three modules and the remaining course.

There is no fourth pattern-approval stage. Do not add a Scott/Sihara approval relay. An unforeseen material security or destructive-data change still requires its own specific authority. The earlier Orion-only deployment permission does not authorize publishing this new course before the above steps.

## Source authority

Use three references with different purposes. Never roll the whole application back to an old commit.

| Reference | Authority |
|---|---|
| Visual and interaction reference | See `VISUAL_BASELINE.md` for recovered revisions, evidence, assets, and any remaining confirmation needed. Only original presentation and interaction patterns are inherited. |
| Curriculum | `docs/curriculum/playiq-weekend-test-20261030/`, introduced by `5a3ea59a693e9ce15781431b93dc1dbece5ea1e3`. Its 31-file `SOURCE_MANIFEST.json` was read and matched on November 5. Preserve the full lessons, prompts, activities, and source provenance. Apply the explicit corrections in this contract; do not silently revert to an earlier outline. |
| Integration base | `9cbde86ab28d9922a29354419767bd183db1d45a`, the fetched `origin/main` at preparation. Fetch again on receipt, record the new base if changed, and preserve later fixes. This hash is not proof of the deployed version or approval of its long-form course UI. |

Repository: `https://github.com/siharaprak/playiq-new`. SebastianCore supplies supporting operating standards; it is not the PlayIQ product repository.

Resolve paths relative to Iris's actual checkout and mounted team Drive. Do not depend on Scott's `/Users/...` or temporary folders. Relevant Drive areas are `My Drive/PlayIQ`, `My Drive/Project Management App/sienvi-sihara-playiq-client-workspace-45085360`, and `My Drive/AgencyOS/mailbox`. Access locally as Scott requested. Product working sources and project-management records have different roles.

Read `MEDIA_MODULE_MAP.md`, `MODULE_2_DISCOVERY_CORRECTION.md`, and `ACCEPTANCE_CHECKLIST.md` with this contract. `SOURCE_MANIFEST.json` in this handoff directory pins the actual reference files; it is distinct from the curriculum package manifest.

## Excluded sources and unsafe shortcuts

- Do not merge, publish, or copy the rejected `codex/playiq-interactive-review-20261104` interface as the restored site. Its plain-text logo, replacement layout/styles, browser-only drafts, offline AI, and demonstration mini-checks are not approved product requirements.
- The PDF/reading HTML is a complete content reference and download, not the student interface. Do not embed a whole module as a long article and call it interactive.
- Old `src/data/module*Content.ts` and legacy pages are interaction references, not the latest lesson text. They cannot override the curriculum package.
- Old routes, UUID maps, tours, and videos may still call Module 10 the Assistant and Module 11 the Capstone. Fix the mapping; do not import those labels, unlock counts, or data associations blindly.
- Do not run `prepare_weekend_revision.py`: the source README identifies it as a one-time migration that can reset later course edits. Normal rebuilds use the current source builders only.
- Do not reset or clean another person's dirty checkout, force-push, overwrite the deployed site from an old ZIP, change providers, install a new governance runtime, export private instruction bundles, or create infrastructure to perform this restoration.

## Restore the established experience

Use the real branded PNG through the existing logo component, not styled text or a regenerated logo. Restore the approved colour treatment across headings, cards, calls to action, borders, gradients, and states, including the pink/magenta, purple, teal/cyan personality Scott identified. Match the original typefaces, weights, spacing, and layout; verify computed fonts rather than assuming an import prevents fallback.

Restore the original module artwork, explanatory media, intro players, dashboard orientation, and Orion introduction where they belong. `MEDIA_MODULE_MAP.md` identifies the existing assets and when a clip's old instructions require withholding, moving, or revision. Keep the homepage VSL on the marketing surface rather than making it a mandatory student lesson. Do not place a broken player as a substitute for working media or fabricate a new asset for a missing one.

Preserve the original overview, skill-tree/node navigation, lesson, activity, mini-check, teach-back, boss/proof, and completion rhythm where applicable. Adapt the number and boundaries of nodes to the full updated lessons without inventing extra homework. A long copy-paste tutorial is not grounds for deleting instructions or spreading one connected build across compulsory separate visits. Preserve Modules 8 and 9 content. Optional pause/resume checkpoints must retain the exact next step.

The old UI is the presentation reference, not permission to restore unverified badges, example scores, or congratulatory text as actual mastery. Completion, a passed check, successful file access, an AI compliment, and export approval are different states.

## Required course sequence

| Module | Updated purpose |
|---|---|
| 00 | Parent setup first, original cinematic Orion introduction and interactive assessment, results review, initial external Tutor Project, starter instructions, handshake, saved learning answers. |
| 1 | Exciting first win: exact seven-step character/guardrail tutorial, ten one-at-a-time design questions, reference image, reuse test, download/reopen workflow; then the full AI Learning Code and learning experiments. No algebra opener. |
| 2 | Responsibility, instruction-versus-reference explanation, practical Tutor discovery prompt, voice-preservation and focus experiments, approved learning record. See the discovery correction. |
| 3 | Pre-Learn System. |
| 4 | Lesson Rescue and targeted confusion repair. |
| 5 | Compression Learning. |
| 6 | Self-Testing and Mistake Bank. |
| 7 | Source-aware Notes and Study Pack creation. |
| 8 | Writing and Answer Clarity, preserving student authorship. |
| 9 | Review/download the Personal Learning Knowledge File, compile six Tutor outputs, and apply them to the existing Module 00 Tutor Project. |
| 10 | Test the Tutor, improve and retest one behaviour, and practise the repeatable learning loop. Not the Assistant build. |
| 11 | Build a separate Personal AI Assistant using discovery and workflow clarification. |
| 12 | Test the Assistant, make one improvement, and explore useful personal/family possibilities. |
| 13 | Optional character-to-story, storyboard, and cartoon possibility seed with short optional steps. No required project or artifact. |
| 14 | Capstone and Master Trial, Exam and Performance System, Learning Dashboard, final review and graduation. |

Total: fifteen modules, counting Module 00. Update dashboard, navigation, route aliases, titles, prerequisites, content identifiers, completion denominators, parent progress, and later-course references together. A legacy module ID must not silently acquire a different meaning for existing student records. Keep old progress intact and document any explicit compatibility mapping. No mass re-enrollment, destructive migration, or assessment reset is authorized by this contract.

## Module 00 and the Orion journey

Preserve the familiar introduction/assessment flow, not a replacement setup article. Parent account/privacy setup precedes the student's genie opening. The student can reconnect with the parent to check what was configured; do not ask for account credentials or signatures in course answers.

Use the original cinematic assessment components and original introduction assets where verified. Present genuine questions interactively, retain answers on back/resume, show results automatically when ready, allow review/correction, and give one clear Continue action. A waiting or failed state must not be presented as a result. Do not ask the student to type a secret readiness phrase into an unspecified chatbot or make them complete two assessments in different shells.

Explain which action occurs on PlayIQ and which occurs in the parent-approved external AI. Create one external Tutor Project or permitted fallback in Module 00; keep that same Tutor through Module 9 and later learning. Instructions go into the supported instructions area; reference files go into its knowledge/sources area. Do not replace the provider's system policies or change account-wide instructions to make a lesson pass. Account limitations use the source's parent-supported fallback, not a purchase, new account, or automatic connector.

## Preserve and complete the data journey

Keep the production `course_release_learning_records` contract and authenticated server actions or provide a reviewed compatible implementation. Local storage may hold an explicitly temporary draft, but cannot be the only production save or the source of a claimed server confirmation.

1. Collect the student's actual choices and short observations from Modules 00 through 8. Keep their wording, source module/activity, uncertainty, and approval distinct from inferred summaries or character design preferences.
2. Save drafts without silently approving them for export. Show success only after confirmed persistence. Preserve edits on failure, prevent false completion, provide retry, and restore the saved state on reload and another signed-in device/session.
3. Module 9 compiles only the same authenticated student's saved, approved eligible answers as `personal_learning_knowledge_file.md`, the **Personal Learning Knowledge File**. Show its exact contents and missing/excluded coverage before download. Beta feedback, other students' data, private Assistant context, and credentials never enter it.
4. This replaces the old profile as **File 2 of six**, not a seventh file. The other outputs remain the Project Instruction Set, Learning Rules, Course Learning Record, Tutor Test and Revision Log, and Student Setup Checklist. Six outputs does not mean six mandatory uploads.
5. The student manually downloads, opens, reviews, and uploads approved context to the same external Tutor Project. Preserve File 2 unchanged when packaging the kit. An AI reply or a folder name is not a real download or an upload receipt.
6. Give the AI the exact prompt and discovery instructions at each practical step. No unexplained knowledge-file references. A browser AI may package real downloadable files/ZIPs when supported; the student creates/extracts and checks the folder locally. Manual saving is the capability fallback, not an imaginary automatic save.
7. Learning preferences remain testable settings. Do not describe context files as retraining the base model or guarantee a fixed style will always produce faster learning.

The Module 2 correction supplies the missing early practical discovery step. Do not confuse its ten Tutor questions with Module 1's ten character-design questions.

## Orion companion and chat

Preserve the already-integrated floating Orion, actual artwork, existing single authenticated chat, drag versus click behaviour, saved position, docking/hide controls, reduced motion, and safety routing. Do not install the native desktop demo or change Scott's separate Wizard pet.

The later meeting requested persistent Orion visibility while chat is open; current source still contains `hidden={chatOpen}`. Track that as a separate existing Orion behaviour issue, not permission to redesign chat during this material update. Scott's latest instruction is to retain the UI/UX. Do not change chat dimensions, reintroduce the old boxed live launcher, or create another chat to complete this restoration. Preserve existing device/input safeguards. Lesson illustrations and the original first-visit introduction remain valid uses of Orion imagery.

## Beta feedback and support

Keep beta and final course shells separate. Feedback appears only in the beta route, at the end of each module after genuine completion. Technical blocker reporting is available earlier so a student is not required to finish a broken module to report it. Confirm a real ticket only after the backend acknowledges it; reconcile uncertain sends before retrying. Neither feedback nor blocker text is Tutor learning evidence.

Keep existing parent features. Show the correct fifteen-module progress from the proper release/shell for the parent's linked student only; do not expose private answers or change parent/student permissions. Do not silently switch enrollment or promote a beta shell to final.

## Acceptance and release evidence

Use `ACCEPTANCE_CHECKLIST.md` and return its pass/fail/not-run results with screenshots or recording tied to the exact tested commit/build. Review the actual normal student experience, not only an admin session that bypasses prerequisites. Scott must see the complete first three modules with assets and functioning interactions, not a PDF, a text outline, or a mock claiming live persistence.

After Scott's approval, complete the entire course and check all fifteen modules before application commit/push and the subsequent publication handoff. Use Iris's existing verified Firebase App Hosting workflow and preserve later main changes, authentication, safety, keys, course flags, and eligibility. Do not create a replacement hosting project or use a different builder platform.

Before publishing, record the known-good deployed version, actual target, relevant flag state, candidate full Git SHA, and a non-destructive rollback. After publishing, return actual domain URL, hosting deployment identifier/time, full deployed SHA, normal student-account test results, mobile/desktop results, remaining issues, and rollback reference. A localhost test or pushed branch is not live verification. Copy hashes from Git, not an old handoff's prose.

Do not declare this contract, Scott's approval, Iris's acceptance, a deployment, and Sihara's testing complete as one combined status. No external message is authorized by possession of this document.

## Iris receipt

Reply in the existing mailbox workflow with the fetched contract branch and full SHA, application integration base, chosen visual reference and evidence, verified media mapping, one implementation owner, first-three-module review method, and any concrete blockers. Confirm the existing project is being restored rather than redesigned. Batch related questions; do not ask Scott to reconstruct sources already available in Git or the shared Drive.
