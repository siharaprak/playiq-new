# Course source integration notes - release owner

This is internal release coordination, not student copy or deployment approval.

1. Stable completed HTML input is
   `PLAYIQ_COMPLETE_COURSE_MASTER_20261030.html`, with fifteen `<section>` IDs
   `module-0` through `module-14`. Consume all section content, not an outline.
   Split/hide only the final beta-feedback section in the final shell.
2. Course specification and all lesson examples use the download filename
   **`personal_learning_knowledge_file.md`** and human title **Personal Learning
   Knowledge File**. The earlier concurrent app draft used a spaced filename;
   a later read-only check now confirms `src/lib/course-release/learning-record.ts`
   exports `personal_learning_knowledge_file.md`, and the button says Download
   Personal Learning Knowledge File (.md). This naming mismatch is resolved
   in the inspected source. This worker did not edit that other scope.
3. Site copy currently uses Save draft / approval choices / mark complete.
   Course text says review, approve, use the Save control, await confirmation,
   and reopen; it does not claim auto-save. Ensure a save really persists
   the approved state used by the Module 9 export.
4. The course website answer area is the collection source for Modules 00-8.
   Existing external AI chat records and printed workbooks need deliberate
   manual entry. Never imply hidden access or include beta feedback in export.
5. All six deliverables remain distinct. File 2 is the reviewed site download,
   not another AI-generated profile. Instructions go into Project instructions;
   reference files are uploaded only where supported; editable Test Log and
   Checklist can remain local. Six outputs does not mean six required uploads.
6. This repository ignores `docs/`. The release coordinator must intentionally
   include only this package in its scoped commit (and any separately approved
   supporting docs), then read back the committed branch before handing it to
   Iris. This worker has not staged or committed anything.
7. PDF/HTML checks are local artifact evidence. Independent app acceptance,
   migration/RLS verification, authenticated cross-student isolation, real
   browser save/reopen/download, and provider account behavior are separate
   gates. No production deployment was performed or authorized by this lane.
8. The directly approved follow-up now teaches the reusable Save your build
   download/ZIP workflow in Module 1, brief reuse in Modules 9/11, and optional
   separate character-story Project steps in Module 13. Reconsume the rebuilt
   HTML after these edits.
9. The four review corrections are now approved: source lessons clarify
   online controls vs workbook entries, confirmed save/Continue, and beta
   pre-completion technical reporting. Platform steps are corrected against
   actual fetched official docs; see
   `OFFICIAL_PLATFORM_TUTORIAL_VERIFICATION_20261030.md`. Preserve the
   instructions/reference distinction in any UI callouts.
10. Source caveat for weekend testing: Google's fetched help announces a
    November 2026 Gems transition with differing skills eligibility; Claude
    documents a new Projects rollout. Do not imply all teen/parent accounts
    match classic menus. Use parent-supported permitted fallback, not new
    accounts, purchases, connectors, code tools, or automatic migrations.
    The allowed OpenAI Projects guide confirms shared instructions and
    Sources but not a universal instructions-editor click path. The course
    labels that exact limitation instead of fabricating a menu sequence.
11. The official verification note is internal package evidence. Student
    lessons use official help URLs rather than relative Markdown links to
    that internal file, avoiding unserved links in the embedded course shell.
    Final compiled HTML is ready to reconsume; preserve `module-0` through
    `module-14` section IDs and beta-feedback separation.
