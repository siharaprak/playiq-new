# Official platform tutorial verification - 2026-10-30

Status: **official-doc verified, not account tested**.

Scope: checked current official public guidance for the course's web-chat
workspace, instructions, reference-file, and image-input steps. No sign-in,
student account use, uploads, downloads from an AI account, provider requests,
permission changes, cloud setup, or runtime testing occurred. Source wording
does not establish availability or successful behavior in any particular
account. UI/rollout/age/region/workspace differences require parent review.

## Primary sources actually fetched

| Official page | Observed basis / course correction |
|---|---|
| [OpenAI Projects and chats](https://learn.chatgpt.com/docs/projects) | A ChatGPT project separates chats, shared instructions, and Sources. Removed the unsupported profile-icon creation path. The fetched page does not prescribe a universal instruction-editor click path; the course uses visible current controls and a parent-supported fallback instead of inventing one. |
| [OpenAI image inputs](https://learn.chatgpt.com/docs/image-inputs) | Web-chat image references may be attached, pasted, or dragged into the composer. Removed a fixed attachment menu-label guess from Module 1. |
| [OpenAI image generation](https://learn.chatgpt.com/docs/image-generation) | Reference input and image generation are distinct; web availability depends on account settings. Text-only fallback remains explicit. |
| [OpenAI working with files](https://learn.chatgpt.com/docs/artifacts-viewer) | Review generated outputs and download them. This is not a guarantee that every account can emit arbitrary files or a ZIP; packaging stays conditional. |
| [Claude create/manage Projects](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects) | Documented chat route is Projects, + New Project; behavior is Set project instructions/Save instructions, while references use project knowledge's +. The project name/description alone is not behavioral context. |
| [Claude Projects and rollout](https://support.claude.com/en/articles/9517075-what-are-projects) | A newer Projects interface is rolling out; do not claim the classic chat path applies to all accounts or send students into Claude Code/automated work to match it. |
| [Google use Gems](https://support.google.com/gemini/answer/15146780?hl=en) | Documented Gem layout: sidebar Gems/New Gem, name/Instructions, Knowledge/Add files for references, Save. Local upload avoids requiring a new Drive connection. |
| [Google Gem creation tips](https://support.google.com/gemini/answer/15235603?hl=en) | Some layouts say Explore Gems. Preview does not save; instructions and Knowledge are different surfaces. |
| [Google Gems-to-skills transition](https://support.google.com/gemini/answer/18560919?hl=en) | Google announces a personal-account transition starting November 2026 and differing skills eligibility. Flag the imminent change, preserve a permitted parent-approved fallback, and never direct a teen to bypass restrictions or add a skill package as a new requirement. |

## Applied distinctions

- Module 00 chooses one existing course-long private Tutor path and saves
  instructions in the actual instructions editor, not merely as an upload.
- Module 1's Character Lab attaches a reference to an ordinary chat; it does
  not replace the Tutor's instructions or source collection.
- Module 9 adds its existing reviewed `personal_learning_knowledge_file.md`
  as reference context, separately applies approved instructions, and checks
  both. A rejected file format/unsupported upload uses the labeled fallback,
  not a newly invented profile. File 2 remains one of six outputs.
- Module 11 uses a separate Assistant and local kit; Module 13's separate
  character-story setup stays optional and never includes Tutor/Assistant
  private data. Both reuse Module 00's account-aware platform guidance.
- Actual digital controls are distinguished from workbook blanks. Saving is
  confirmed explicitly before progression. Beta technical blocker reporting
  is available before completion, distinct from the final module survey.

## Remaining acceptance boundary

The release owner/Iris must test the actual permitted account, current
instructions and reference controls, save/reopen, real download, actual
attachment/read-back, and mobile layout with the intended testers. No claim
is made here that those checks passed. Do not install, buy, connect accounts,
change account-wide instructions, or start automated work to hide a mismatch.
