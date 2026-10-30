"""Reproduce the scoped course revision from the pinned October 27 package.

Only writes inside this release directory. It never edits the source snapshot,
application code, public assets, package manifests, credentials, or Git state.
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
BASE = ROOT.parent / "playiq-15-module-course-20261027"


def replace_once(text, old, new):
    if text.count(old) != 1:
        raise ValueError(f"Expected one occurrence: {old[:90]!r}")
    return text.replace(old, new, 1)


def replace_section(text, heading, next_heading, replacement):
    start = text.index(heading)
    end = text.index(next_heading, start + len(heading))
    return text[:start] + replacement.rstrip() + "\n\n" + text[end:]


TOP_NOTE = """### Where your answers go

Use the learning-answer area on this PlayIQ module page for the short answers,
actual results, and Tutor setting you choose to keep. Review the wording, mark
only accurate, privacy-safe information as approved, then use its **Save**
control. Wait for a saved confirmation before leaving. If saving fails, retry
and keep a temporary copy in your parent-approved course notes; an unsaved
answer is not in your learning file. Reopen the page to check it returns.

Your external **PlayIQ Tutor Project** is a separate place. When a lesson
asks you to paste a prompt there, switch to the AI account your parent approved
and open the same Project from Module 00. PlayIQ cannot read that private chat.
Bring back only the small learning summary you choose to save on this course
page, not the full conversation. A printed workbook does not sync: type your
chosen answers into the website later, or mark the online record as missing.

In Module 9, review and download those saved, approved learning answers as
**personal_learning_knowledge_file.md**, your **Personal Learning Knowledge
File**. It is one of the six Tutor files, not an extra seventh file.
"""

TOP_LATE = """### Keep the website and your AI Project separate

PlayIQ saves only the learning answers you enter and approve on the course
page. It cannot read your external AI chat or verify a file upload there. Keep
private task details in the appropriate parent-approved Project. If you choose
to save a course reflection on PlayIQ, review it, use **Save**, wait for saved
confirmation, and reopen it to check. A paper worksheet does not sync itself.
Your **Personal Learning Knowledge File** is context for the Tutor, not
fine-tuning or retraining of the AI's underlying model.
"""

FOCUS = {
    0: "your goals, Rescue and Advance Targets, starting preferences, parent-reviewed boundaries, and what actually happened in the handshake",
    1: "the explanation/hint comparison, your actual ratings, and the provisional coaching rule you approve; character colors are design choices, not learning evidence",
    2: "your authorship boundary, actual focus-sprint results, and the pacing rule you want to test",
    3: "your pre-learning entry comparison, actual class debrief when available, and the rule you want to retest",
    4: "the specific confusion gap, rescue methods tried, what you could explain afterward, and your provisional rescue rule",
    5: "the compression and retrieval comparison, corrections, and the setting to test again",
    6: "actual quiz/repair results, confidence comparison, review plan, and the approved quiz rule",
    7: "the Study Pack's source/coverage check and file-use result; do not upload private school records into a course answer",
    8: "the writing-coach comparison and your approved authorship boundary; include no writing sample unless it is safe and specifically approved",
}


def save_checkpoint(index):
    return f"""## Save your approved Module {index:02d} learning answers on PlayIQ

Before leaving, return to this module's learning-answer area. Save a short
record of {FOCUS[index]}.

1. Enter what you actually did or noticed, separately from what you prefer.
2. Include only a Tutor setting you approve, its source activity, and when to
   retest it. Use **not tested** or **MISSING_INPUT** for an unknown result;
   do not copy example scores as your own.
3. Review the proposed text. Leave private, unrelated, or unapproved details
   out. Ask your parent if unsure, then use **Save** and wait for confirmation.
4. Reopen the saved entry. If it is missing or saving failed, keep your notes
   and retry; do not assume Orion retained them from an external conversation.

These saved, approved answers feed the **Personal Learning Knowledge File**
you review and download in Module 9. This checkpoint uses the work you already
did; it is not another assignment or another Tutor Project. An unrun or
unapproved item stays visibly missing, never guessed or silently filled in.

---

"""


M00_STARTER = """## Start your learning record (Knowledge Files come later)

A **Knowledge File** is a readable reference your Tutor can consult, not a new
brain or a magical memory. In Module 7 you will practise building a source-aware
Study Pack. In Module 9 the website will assemble your approved learning answers
into your **Personal Learning Knowledge File** for you to review and download.

For now, enter your basic goals and starting preferences in this module's
learning-answer area. Do not upload an unexplained file or copy an example
result as your own. These are hypotheses to test, not a diagnosis.

```markdown
# My starting learning notes
- Name or alias I approve: [your choice, or MISSING_INPUT]
- Current goal: [your approved goal, or MISSING_INPUT]
- Rescue Target: [your approved subject, or MISSING_INPUT]
- Advance Target: [your approved subject, or MISSING_INPUT]
- Explanation approach I want to try: [preference, not a fixed type]
- Handshake observation: [what happened, or not tested]
- Boundary I approve: [exact wording]
- Next review: [when to test this again]
```

Save and check these answers on PlayIQ. You can also manually paste a small,
approved summary into your existing external Tutor Project, but doing that
does not save it on the website. The two places do not automatically sync.

---
"""

M00_CONTINUE = """## Continue to Orion's Assessment - what to do next

**Continue to Orion's Assessment** opens the assessment on PlayIQ. Answer the
questions there; you do not need to guess where to type a secret phrase.
When the results are ready, they appear on that page. Read the results, correct
anything inaccurate using the review controls, and use the single **Continue**
action to move forward. A loading message is not a completed result; if an
error appears, retry rather than assuming your answers were saved.

Review the short learning answers you want included in your future Personal
Learning Knowledge File. Use **Save**, wait for confirmation, and reopen the
entry. Your workbook answers and external AI chats do not save themselves to
PlayIQ. Leave unknown results visibly missing.

For the hands-on Tutor conversation, switch separately to your parent-approved
AI, open the same **PlayIQ Tutor Project**, and paste the prompt below plus
only the answers you choose to share. Review its proposed record; then bring
back the approved summary to this module's learning-answer area on PlayIQ.
No course button gives the website access to your external account.

**Prompt to start the external Tutor record:**

> Orion, this is my PlayIQ Module 00 assessment. Help me record only what I
> chose to share. Separate what I reported from what the activity observed.
> Treat learning preferences as hypotheses, not fixed labels. Ask one
> clarification question at a time if needed. Show me a concise proposed
> Course Learning Record entry and exactly what you would add or change. Do
> not claim anything was saved. Wait for my approval.

"""

M09_PREP = """## Part 3: Review and download your saved learning evidence

Start **on PlayIQ**, not in a new AI chat. Open Module 9's learning-file
review/download area. The website brings together the learning answers you
saved and approved in Module 00 and Modules 1-8. It cannot collect answers
from your private external Tutor Project, a paper workbook, or an unsaved page.

1. Read the available entries and the coverage list for Modules 00-8.
2. Check your goals, subject strengths and challenges if you supplied them,
   actual observations, preferences, approved Tutor rules, and retest notes.
   A preference is something to try, not a permanent auditory/visual label.
3. Correct inaccurate wording in the original module's answer area and save
   again. Return here and refresh the review. Do not approve someone else's
   example, an invented score, or a private detail just to fill a gap.
4. Look at **MISSING_INPUT**, **not tested**, and **pending_validation** items.
   You can return to the relevant module to supply the work you actually did,
   or keep the item explicitly missing. A missing entry is not a failed learner.
5. With your parent where needed, approve only what is safe and useful for
   your Tutor. Recheck the preview, then choose the Markdown download action
   for the **Personal Learning Knowledge File**.
6. Save **personal_learning_knowledge_file.md** in your parent-approved course
   folder. Open it from that folder and check its title and contents. Keep
   the `.md` extension. This is a readable text file, not an app to install.

If no file downloads or the preview cannot load, stop this download step and
retry or ask for help. Do not pretend it completed. Keep your approved notes
safe. Downloading does not upload anything to your AI Project; Part 9 shows
that separate manual step.

The file is **File 2 of the existing six outputs**, replacing the previous
profile file. Do not make a second profile or add a seventh file. It gives
the Tutor useful context; it does not fine-tune or retrain the base AI model.

### Evidence inventory

Use the review list and the table below to check coverage. Missing or unapproved
answers must remain labelled; a clean-looking profile is not worth invented
evidence.

"""

PROFILE = """### File 2 - Personal Learning Knowledge File (`personal_learning_knowledge_file.md`)

Use the Markdown file you reviewed and downloaded from PlayIQ in Part 3.
Do not ask the external AI to invent a replacement or create another profile.
It contains your saved, approved course answers and labels missing evidence.
Its headings may include the following; these are placeholders, not learner
results to copy:

```markdown
# Personal Learning Knowledge File

## Purpose and limits
Use approved learning context to personalize tutoring. Do not treat a format
preference as a fixed learning type. This is not base-model training.

## My approved goals and subjects
- Goal: [approved answer, or MISSING_INPUT]
- Subject I feel strong in: [approved answer, or MISSING_INPUT]
- Rescue Target: [approved answer, or MISSING_INPUT]
- Advance Target: [approved answer, or MISSING_INPUT]

## Current learning preferences to test
- Preference: [exact approved wording, or MISSING_INPUT]
- Source module and activity: [source, or MISSING_INPUT]
- Evidence type: [student_reported / observed / experiment_result / pending_validation]
- Actual observation: [what happened, or MISSING_INPUT]
- Review condition: [when to retest, or MISSING_INPUT]

## Approved Tutor rules and boundaries
- Rule: [exact approved wording, or MISSING_INPUT]
- Evidence and source: [actual evidence, or MISSING_INPUT]
- Status: [approved_for_testing / pending_validation]
- Keep the student the author; show proposed changes for review.

## Module coverage and missing inputs
- Module 00: [saved approved entry / MISSING_INPUT]
- Modules 1-8: [each module's saved approved entry / MISSING_INPUT]
- No score, answer, approval, or test result has been guessed.
```

The website preview is the authority for what was actually saved and included.
If an external AI proposes a rule that is not in your approved evidence, keep
it as a proposal until you review it. The Course Learning Record below is a
chronological learning journal; it is not a second competing profile.

"""

M09_UPLOAD = """## Part 9: Update the Tutor Project you already created

Do this with your parent in the same private Tutor Project from Module 00.
Keep PlayIQ open in one tab and the approved AI in another. Platform menus
change; ask your parent to locate the Project's instructions and file/knowledge
area if the labels differ. Do not create a second Tutor, Custom GPT, Gem, or
account for this build.

1. On PlayIQ, finish the Part 3 review and download. Open the saved
   **personal_learning_knowledge_file.md** and check the approved content and
   missing-input labels. A generated preview alone is not a downloaded file.
2. Sign in to the **AI account your parent approved in Module 00**. Open the
   same **PlayIQ Tutor Project**. Check its name before adding anything.
3. Open that Project's file/knowledge area, choose its add/upload-file control,
   select **personal_learning_knowledge_file.md** from your device, and wait
   for the platform to show the file as available. Check that it is attached
   to the **Project**, not only an unrelated temporary chat. The PlayIQ site
   cannot do or verify this step for you.
4. In a conversation inside that same Project, use this read-back request:

> Use the Personal Learning Knowledge File I just added. Tell me its title,
> summarize my approved goal and one preference with its source, and identify
> a missing or untested item if present. If you cannot access the file, say so.
> Do not invent content or turn preferences into permanent learning types.

5. Compare the reply with the actual file. If it does not match, check the
   Project, attachment status, and file availability with your parent. Do not
   mark the upload/read-back as passed because the AI sounds confident.
6. Use the Part 7 compilation prompt **inside this same Project**. It should
   use your reviewed profile as File 2, not rewrite it into a second profile.
   Review the other five drafts and the change summary. Correct unsupported
   claims before applying anything.
7. Put the approved **Project Instruction Set** into this Project's instruction
   settings and save it. Add only approved Learning Rules and Course Learning
   Record files to the knowledge area as useful. Module 7 Study Packs are
   optional topic references, not extra required profile outputs. Keep the
   Test Log and Setup Checklist in the parent-approved course folder where
   you can update them in Module 10. Reopen settings/files to confirm them.
8. If a current profile version already exists, review with your parent which
   copy should be active; avoid conflicting duplicates. Keep a local backup
   before replacing anything. A later website edit does not update the uploaded
   file automatically: review, download, and replace it manually when needed.

**No upload support?** With your parent, keep the approved `.md` file locally
and paste its relevant contents into the same dedicated Tutor conversation.
Ask for the same read-back and label the result **manual-context fallback**,
not **Project file uploaded**. Do not buy a plan or open another account to
clear a course checkbox. If you cannot find the original Project, pause and
ask your parent to help recover it; never silently create a duplicate.

**ORION:** "You are now an AI system architect. You gathered evidence, chose
the context, set the instructions, and checked the result. The Tutor is built;
Module 10 will test how it behaves. A file alone is not proof it teaches well."

---

"""


def relocate_notices():
    """Keep the possibility hook first; put the practical note before work."""
    for index in range(15):
        path = ROOT / f"Module_{index:02d}_Student_Text.md"
        text = path.read_text()
        start = text.index("### Where your answers go" if index <= 8 else "### Keep the website and your AI Project separate")
        first_h2 = re.search(r"^## ", text[start:], re.M)
        if not first_h2:
            raise ValueError(path.name)
        end = start + first_h2.start()
        note = text[start:end].strip()
        text = text[:start].rstrip() + "\n\n" + text[end:]
        sections = list(re.finditer(r"^## ", text, re.M))
        insertion = sections[1].start()
        text = text[:insertion].rstrip() + "\n\n" + note + "\n\n" + text[insertion:]
        path.write_text(text)


def main():
    for index in range(15):
        name = f"Module_{index:02d}_Student_Text.md"
        text = (BASE / name).read_text()
        text = text.replace("Student Tutor Profile Knowledge File", "Personal Learning Knowledge File")
        text = text.replace("student_tutor_profile.yaml", "personal_learning_knowledge_file.md")
        text = text.replace("Student Tutor Profile", "Personal Learning Knowledge File")
        text = text.replace("student_profile.yaml", "personal_learning_knowledge_file.md")
        title_end = text.index("\n")
        # A heading-level notice is visible before any external-chat instructions.
        note = TOP_NOTE if index <= 8 else TOP_LATE
        if index == 13:
            note += "\nThis is an optional possibility preview: no required answer, artifact, or Tutor update.\n"
        text = text[:title_end] + "\n\n" + note + text[title_end:]
        if index <= 8:
            feedback = re.search(r"^##[^\n]*beta[^\n]*feedback[^\n]*$", text, re.M | re.I)
            assert feedback
            text = text[:feedback.start()] + save_checkpoint(index) + text[feedback.start():]
        if index == 0:
            text = replace_section(text, "## Start your Tutor Project record (Knowledge Files come later)",
                "## Proof Artifact", M00_STARTER)
            text = replace_section(text, "## Continue to Orion's Assessment", "## Mastery Check", M00_CONTINUE)
            text = text.replace("[✓]", "[ ]")
            text = text.replace("but it leaves your brain weaker.", "but a copied answer alone does not show that you understand it.")
            text = text.replace("Now Orion synthesizes all your data into your **Personal Learning Blueprint**.",
                "When the assessment results are ready, they appear here as your **Personal Learning Blueprint**. Read them, review the proposed learning answers, then use **Continue**. These are starting hypotheses, not a diagnosis.")
            text = text.replace("If your AI tells you your question is strong and explains *why*, you have officially mastered Module 00!",
                "Check that your revised question asks for coaching rather than a finished answer, and that the AI waits for your attempt. Record what actually happened; AI praise alone is not proof of mastery.")
        if index == 1:
            text = text.replace("## Part 8 — Knowledge File Update: `personal_learning_knowledge_file.md`",
                "## Part 8 — Learning Answer Update for Your Future Knowledge File")
            text = text.replace('preferred_challenge_mode: "hint_mode"',
                'preferred_challenge_mode: "[actual choice, or pending_validation]"')
            text = text.replace("measure which style lands fastest in your brain.",
                "compare which approach helps on this topic, then check what you can explain without the answer visible.")
            text = text.replace("test whether my brain learns faster from analogies, step-by-step sequences, or big-picture diagrams;",
                "compare analogies, step-by-step sequences, and big-picture diagrams using actual learning evidence;")
        if index == 2:
            text = text.replace("the leverage stays in your brain forever.", "the practice gives you something you can keep testing and using.")
            text = text.replace('truth_filter_protocol_active: true', 'truth_filter_protocol_active: "[observed | not_tested]"')
            text = text.replace('academic_integrity_declaration_signed: true', 'academic_integrity_declaration_signed: "[yes | no | pending]"')
        if index == 3:
            text = text.replace("Why this setting matched your brain's processing:",
                "What evidence supported trying this setting on this task:")
            text = text.replace("discover whether your brain prefers", "compare whether this topic felt clearer with")
        if index == 8:
            text = text.replace("materials, and test whether the tutor behaves as you intended.",
                "materials. Module 10 then tests whether the tutor behaves as you intended.")
        if index == 9:
            text = replace_section(text, "## Part 3: Gather your course evidence", "| Source |", M09_PREP)
            text = replace_section(text, "### File 2", "### File 3", PROFILE)
            text = replace_section(text, "## Part 9: Update the Tutor Project you already created", "## Part 10", M09_UPLOAD)
            text = text.replace("Give Orion only the course evidence you and your parent approved. Then use\nthis request:",
                "After reviewing the website download, manually upload File 2 to your existing\nexternal Tutor Project using Part 9. Use this prompt there; the external AI\ncannot fetch your PlayIQ answers itself:")
            text = text.replace("drafts: (1) Project Instruction Set, (2) Personal Learning Knowledge File Knowledge\n> File,", "drafts: (1) Project Instruction Set, (2) the reviewed Personal Learning Knowledge\n> File I uploaded - preserve it as File 2, not a second profile -,")
            text = text.replace("### File 2 — Personal Learning Knowledge File", "### File 2 - Personal Learning Knowledge File")
            text = text.replace("Personal Learning Knowledge File added:", "Personal Learning Knowledge File uploaded/read back:")
            text = text.replace("Six Tutor files prepared and reviewed:", "Six Tutor files prepared and reviewed:")
            text = text.replace("- [ ] My six files are separate and human-readable.",
                "- [ ] My six files are separate and human-readable.\n- [ ] I reviewed/downloaded my Personal Learning Knowledge File from PlayIQ,\n      then checked its upload/read-back in the existing Project, or recorded\n      the manual-context fallback accurately.")
        (ROOT / name).write_text(text)

    relocate_notices()
    for name in ["build_combined_master.mjs", "make_reading_html.mjs", "make_light_print_pdf.py", "verify_revision.py"]:
        text = (BASE / name).read_text().replace("20261027", "20261030").replace("2026-10-27", "2026-10-30").replace("October 27, 2026", "October 30, 2026")
        (ROOT / name).write_text(text)
    print("Prepared fifteen full lesson sources and dated build scripts; original snapshot unchanged.")


if __name__ == "__main__":
    main()
