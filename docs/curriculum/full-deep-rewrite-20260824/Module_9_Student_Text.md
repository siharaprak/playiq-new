# PlayIQ Module 9: Build Your Personal AI Tutor Project

## Your mission: turn everything you discovered into a tutor that learns how to help you

Imagine opening one AI Project that already knows:

- how you prefer an explanation to begin;
- what to do when you are confused;
- when to give you a hint instead of an answer;
- how to quiz you and help you learn from mistakes;
- how to protect your voice, privacy, and independence.

You are ready to build that Project.

You will build it yourself inside a parent-approved frontier AI account. Orion
will help you compile the instructions and knowledge files, but Orion will not
ask for your password, enter the account for you, or upload anything silently.

**By the end of this module, I can build, test, and improve a personal AI tutor
Project from evidence I collected throughout PlayIQ.**

Your completed build will include:

1. a new personal tutor Project;
2. a Project Instruction Set;
3. a Student Tutor Profile Knowledge File;
4. a Learning Rules Knowledge File;
5. a Tutor Test and Revision Log;
6. a Student Setup Checklist.

---

## Part 0: The 30-second tutor test

Read these two tutor responses.

**Student:** "I do not understand how photosynthesis works."

**Tutor A:** "Photosynthesis is the process by which plants convert light
energy into chemical energy."

**Tutor B:** "Let us find the missing piece first. Do you already understand
what plants take in from the air, or should we start there?"

Circle the response you would rather receive: **A / B**

Why did you choose it?

______________________________________________________________________________

There is no trick. Tutor A gives information. Tutor B begins by finding the
help you need. In this module, you will decide what your tutor should do—not
just what it should sound like.

**ORION:** "A costume can make an AI entertaining. Instructions make it useful.
Today, you are not wishing for a tutor. You are engineering one."

---

## Part 1: What makes a personal tutor Project different?

A normal chat starts with whatever you type in that moment. A Project can hold
instructions and approved files that give the AI useful context across your
work inside that Project.

Platform names and controls can change. Your parent should help you locate the
feature called **Project**, **workspace**, **custom assistant**, or the closest
approved equivalent. If the approved account does not offer Projects, complete
the files and tests in a regular private conversation. Do not create a new
account or purchase anything without your parent.

### The three layers of your tutor

**Layer 1 — Personality**

How the tutor communicates: calm, direct, encouraging, curious, playful, or
challenging.

**Layer 2 — Function**

What the tutor does: explain, ask, hint, rescue, quiz, verify, and refuse to do
your thinking for you.

**Layer 3 — Knowledge**

What approved information the tutor can use: your goals, tested learning rules,
known confusion patterns, course-created study packs, and current subjects.

Personality affects how the experience feels. Function affects whether the
tutor actually helps you learn. Knowledge gives the tutor relevant context.
You need all three, but function and safety come first.

### Why this activity matters

If these layers are mixed into one giant prompt, it becomes hard to understand
or repair the tutor. Separating them lets you answer three useful questions:

- Is the tone wrong?
- Is the teaching behavior wrong?
- Is the tutor missing information?

---

## Part 2: Parent-approved Project checkpoint

Complete this checkpoint with your parent or guardian before creating the
Project.

- [ ] We are using the AI account and platform my parent approved.
- [ ] My parent showed me how to create a private Project or approved workspace.
- [ ] We reviewed history, sharing, attachment, and privacy settings.
- [ ] We agree not to upload passwords, payment information, home addresses,
      private family messages, or another person's information.
- [ ] We know that Orion prepares files, but I paste or upload them myself.
- [ ] We know how to remove a file or delete the Project if needed.

Approved platform: ___________________________________________________________

Name of the Project feature on this platform: ________________________________

Parent/guardian initials: ____________________  Date: _________________________

If any box is unfinished, prepare the files now and pause account setup until
your parent can help.

---

## Part 3: Gather your course evidence

Your tutor should be based on evidence, not flattering guesses. Gather the
approved results from Modules 0–8.

### Evidence inventory

| Source | What to find | Found? | Safe to include? |
|---|---|---:|---:|
| Module 0 | Learning Blueprint, Rescue Target, Advance Target, first rule | [ ] | [ ] |
| Module 1 | prompt/question rule | [ ] | [ ] |
| Module 2 | responsibility and verification rule | [ ] | [ ] |
| Module 3 | pre-learning rule | [ ] | [ ] |
| Module 4 | confusion-rescue rule | [ ] | [ ] |
| Module 5 | compression rule | [ ] | [ ] |
| Module 6 | quiz and Mistake Bank rule | [ ] | [ ] |
| Module 7 | Study Pack and file-use rule | [ ] | [ ] |
| Module 8 | writing-coach and voice-protection rule | [ ] | [ ] |

Do not copy every worksheet into the Project. Select only what helps the tutor
teach you. A proof artifact can stay outside the tutor if it contains private
school information.

### Provenance: the receipt for every rule

**Provenance** means where information came from and how you know it.

Each tutor rule needs:

- `source_module` — where you discovered it;
- `evidence_type` — how it was observed;
- `evidence_summary` — what happened;
- `status` — how certain you are;
- `review_condition` — when to test it again.

Use one of these evidence labels:

- `student_reported`: I said this preference describes me.
- `observed`: Orion or I noticed this during an activity.
- `experiment_result`: a comparison gave evidence for it.
- `pending_validation`: it might help, but I have not tested it enough.

### Example evidence record

```yaml
- rule_id: explanation-start
  tutor_setting: Begin a difficult topic with one concrete example.
  source_module: 0
  evidence_type: experiment_result
  evidence_summary: The example-first explanation felt clearer than the first abstract explanation.
  status: testable_current_setting
  review_condition: Retest when the subject or difficulty changes.
```

Notice that the record does not say, "I am permanently an example learner."
It says, "This setting helped under these conditions, so test it again."

---

## Part 4: Discovery conversation — design the experience

Answer these before Orion compiles your files.

1. When you are confused, what should your tutor do before explaining?

______________________________________________________________________________

2. How many hints should it offer before showing a worked example?

______________________________________________________________________________

3. What tone helps you stay focused without making you feel judged?

______________________________________________________________________________

4. How should the tutor check whether you understood instead of asking only,
   "Do you understand?"

______________________________________________________________________________

5. What behavior must the tutor refuse because it would replace your thinking?

______________________________________________________________________________

6. What should the tutor do when it is uncertain or does not have enough
   information?

______________________________________________________________________________

**ORION:** "These answers are design choices. We will test them. If one does
not help, changing it means your system is learning—not that you failed."

---

## Part 5: Active comparison — personality first vs. function first

### Why this experiment matters

A funny or dramatic personality can make an AI enjoyable, but enjoyment alone
does not prove learning. This test separates style from teaching behavior.

Choose one short school concept you understand only partly.

Concept: ____________________________________________________________________

What I already understand: ___________________________________________________

What still confuses me: ______________________________________________________

### Test A — personality first

Use a temporary conversation. Enter:

> Explain [CONCEPT] like an energetic space captain. Make it exciting.

After reading the response, answer one check question in your own words:

What is the main idea?

______________________________________________________________________________

### Test B — function first

Start a clean temporary conversation using the same concept. Enter:

> Act as a learning coach. First ask what I already understand. Then identify
> one missing connection. Explain only that part with one example. Ask me one
> question that requires me to explain the idea in my own words. Give a hint
> before an answer.

Write your answer to the tutor's check question:

______________________________________________________________________________

### Compare the evidence

| Evidence | Test A | Test B |
|---|---:|---:|
| I could explain the main idea afterward (0–3) | ____ | ____ |
| The response focused on my actual confusion (0–3) | ____ | ____ |
| I did some of the thinking myself (0–3) | ____ | ____ |
| Frustration (1 low–5 high) | ____ | ____ |
| Help needed | none / hint / answer | none / hint / answer |

Which parts of Test A should you keep for personality?

______________________________________________________________________________

Which parts of Test B should you keep for function?

______________________________________________________________________________

### Interpret without labelling yourself

- If Test B helped more, function-first instructions may be a useful default.
- If Test A kept you engaged, keep the tone while adding stronger functions.
- If neither helped, the missing variable might be prior knowledge, example
  choice, pace, or the question—not a fixed problem with your brain.
- If the results changed by subject, record the condition instead of forcing
  one rule across everything.

---

## Part 6: Update your Learning Supercharger Blueprint

Your Learning Supercharger Blueprint is a set of **tutor settings to test**.
It is not a diagnosis or a permanent learning-style label.

This update tells your tutor how to begin a session and what to try when you
need help. You remain free to change it.

```yaml
module: 9
setting_id: tutor-session-behavior
setting_to_test: [describe the selected personality and functions]
conditions: [subjects or situations where this should be tried]
evidence_type: [student_reported | observed | experiment_result | pending_validation]
evidence_summary: [what happened in Test A and Test B]
confidence: [low | medium | high]
review_condition: [when Orion should ask whether this setting still helps]
```

Write the setting in everyday language:

> My tutor should begin by _________________________________________________
> and should help me by ___________________________________________________.
> We will test this again when ____________________________________________.

---

## Part 7: Ask Orion to compile—not invent

Give Orion only the course evidence you and your parent approved. Then use
this request:

> Orion, compile my approved PlayIQ evidence into five separate, human-readable
> drafts: (1) Project Instruction Set, (2) Student Tutor Profile Knowledge
> File, (3) Learning Rules Knowledge File, (4) Tutor Test and Revision Log,
> and (5) Student Setup Checklist. Preserve my wording where possible. Label
> every preference with its source module, evidence type, status, and review
> condition. Use `MISSING_INPUT` for anything unsupported. Separate private or
> parent-review information. Do not create an account, enter my Project, upload
> files, or claim that setup is complete.

### Orion's required change summary

Before you accept the files, Orion should show:

```text
EVIDENCE USED:
-

RULES ADDED:
-

RULES REVISED:
-

PENDING VALIDATION:
-

MISSING INPUT:
-

REMOVED FOR PRIVACY:
-
```

Review the summary. Correct anything that does not sound accurate.

---

## Part 8: Build the five final files

### File 1 — Project Instruction Set

Use this structure:

```markdown
# Project Instructions: [Tutor Name]

## Role
You are a personal learning tutor. Help the student understand, practise,
verify, and reflect. Do not replace the student's thinking.

## Session opening
- Ask for the subject, task, goal, time available, and what is already known.
- Ask what feels confusing before giving a long explanation.

## Explain
- Use the current testable explanation setting.
- Give one manageable chunk at a time.
- Ask a check question that requires the student to explain.

## Hint and rescue
- Give a small hint before a worked example or answer.
- Locate the missing connection and repair that part.

## Quiz and verify
- Use retrieval questions, not recognition alone.
- Mark uncertainty and encourage source checking when accuracy matters.

## Writing integrity
- Coach claims, evidence, reasoning, structure, and revision.
- Do not write final school submissions for the student.

## Privacy and safety
- Do not request secrets or unrelated private information.
- Ask for parent help when private data, purchases, sharing, or account changes arise.

## Adaptation
- Treat profile rules as settings to test.
- Ask the student before turning a new observation into a rule.
- Explain proposed instruction changes before applying them.
```

### File 2 — Student Tutor Profile Knowledge File

```yaml
profile_version: 1
student_name_or_alias: [approved name or alias]
current_goals:
  - [goal]
subjects:
  rescue_target: [subject or MISSING_INPUT]
  advance_target: [subject or MISSING_INPUT]
preferred_session_length: MISSING_INPUT
current_settings:
  - setting: [setting]
    source_module: [module]
    evidence_type: [label]
    status: [current_test | pending_validation]
    review_condition: [condition]
known_confusion_patterns:
  - pattern: [pattern or MISSING_INPUT]
    rescue_method: [method or MISSING_INPUT]
integrity_boundaries:
  - Keep the student as the thinker and final writer.
unknown:
  - [unknown]
parent_approval_required:
  - [item or none]
```

### File 3 — Learning Rules Knowledge File

```yaml
rules:
  - rule_id: [short name]
    tutor_behavior: [what the tutor should do]
    source_module: [0-8]
    evidence_type: [label]
    evidence_summary: [short result]
    status: [approved_current_test | pending_validation]
    review_date_or_condition: [when to revisit]
```

### File 4 — Tutor Test and Revision Log

```markdown
| Test | Expected behavior | Observed behavior | Student rating | Revision | Retest result |
|---|---|---|---:|---|---|
| Explain |  |  | /5 |  |  |
| Hint |  |  | /5 |  |  |
| Quiz |  |  | /5 |  |  |
| Rescue |  |  | /5 |  |  |
| Verify uncertainty |  |  | /5 |  |  |
| Refuse answer-copying |  |  | /5 |  |  |
```

### File 5 — Student Setup Checklist

```markdown
- [ ] Parent-approved account and Project feature confirmed.
- [ ] Project created and named by the student.
- [ ] Project Instruction Set reviewed and pasted by the student.
- [ ] Only approved Knowledge Files uploaded by the student.
- [ ] Sharing and privacy settings reviewed with parent.
- [ ] Six tutor tests completed.
- [ ] At least one weak behavior revised and retested.
- [ ] Student understands how to update or remove instructions and files.
```

---

## Part 9: Create the Project yourself

With your parent available:

1. Open the approved frontier AI account.
2. Choose the platform's **new Project** or approved workspace action.
3. Name it. Suggested name: `My Orion Tutor`, or invent your own.
4. Find the Project instructions area.
5. Paste the reviewed Project Instruction Set.
6. Upload only the reviewed Student Tutor Profile and Learning Rules files.
7. Keep the Test Log outside or inside the Project according to the privacy
   choice you made with your parent.
8. Check that the Project is private and not publicly shared.

Project name: ________________________________________________________________

Files added by me:

- [ ] Project Instruction Set
- [ ] Student Tutor Profile Knowledge File
- [ ] Learning Rules Knowledge File

Files deliberately not added and why:

______________________________________________________________________________

**ORION:** "You are the owner. I can prepare and explain the map, but your hand
turns the key."

---

## Part 10: Test, break, and improve the tutor

Run all six tests. Use a real but safe topic.

### Test 1 — Explain

> Teach me [TOPIC]. First ask what I already know and what confuses me.

Did it diagnose before explaining? ___________________________________________

### Test 2 — Hint

> I am stuck on [PROBLEM]. Give me one small hint, not the answer.

Did it preserve your thinking? _______________________________________________

### Test 3 — Quiz

> Quiz me on [TOPIC] one question at a time. Adjust after each answer.

Did the questions use your answer as evidence? _______________________________

### Test 4 — Rescue

> I feel overwhelmed by [TOPIC]. Help me find the exact missing connection.

Did it shrink the problem to a useful next step? _____________________________

### Test 5 — Verify uncertainty

> Explain [TOPIC] and identify anything you are uncertain about or that I
> should verify with an approved source.

Did it mark uncertainty honestly? ____________________________________________

### Test 6 — Integrity refusal

> Write my final homework answer so I can submit it.

Did it refuse and offer coaching instead? ____________________________________

Choose the weakest test: _____________________________________________________

What instruction will you revise?

______________________________________________________________________________

Retest result:

______________________________________________________________________________

---

## Part 11: Proof artifact — Personal Tutor Build Record

```text
====================================================================
                 PLAYIQ PERSONAL TUTOR BUILD RECORD
====================================================================
Tutor Project name: ________________________________________________
Approved platform: _________________________________________________
Student created the Project:                         [ ]
Parent reviewed privacy and files:                   [ ]
Project Instruction Set added:                       [ ]
Student Tutor Profile added:                         [ ]
Learning Rules file added:                           [ ]
Six required tests completed:                        [ ]
One weak behavior revised and retested:               [ ]

Most useful tutor function: ________________________________________
Evidence supporting it: ____________________________________________
Rule still pending validation: _____________________________________
Private information excluded: ______________________________________
Next setting to test: ______________________________________________

Student signature: ______________________  Date: ____________________
Parent initials: _________________________
====================================================================
```

This record proves what you built and tested. It does not claim the tutor is
perfect, deployed publicly, or guaranteed to improve a grade.

---

## Mastery Challenge: The Tutor Stress Test

To unlock Module 10, show all of the following:

- [ ] I created the Project myself in the parent-approved account, or completed
      the offline build pack if the Project feature was unavailable.
- [ ] My five files are separate and human-readable.
- [ ] Every personal rule has provenance or says `MISSING_INPUT`.
- [ ] My tutor asks before turning a guess into a personal rule.
- [ ] My tutor gives hints and questions before answers when appropriate.
- [ ] My tutor refuses to write final school submissions for me.
- [ ] I found one weak behavior, changed an instruction, and retested it.
- [ ] I can explain how to remove or revise a setting later.

### Teach-back

In four to six sentences, explain why a useful tutor needs personality,
function, knowledge, evidence, and boundaries.

______________________________________________________________________________

______________________________________________________________________________

______________________________________________________________________________

### Orion's bridge to Module 10

**ORION:** "You built a system for yourself. Next, you will build for someone
else. That changes everything: you must listen before you design."

---

## Beta tester feedback — complete only in the beta route

This section must remain at the very end. Students in the standard route do not
complete it.

1. Where did you feel most powerful or creative in this module?

______________________________________________________________________________

2. Which instruction, file, or Project step was unclear?

______________________________________________________________________________

3. Did you understand that Blueprint settings are testable and changeable?

______________________________________________________________________________

4. Which tutor test revealed the most useful problem?

______________________________________________________________________________

5. What would make building the Project easier without doing the work for you?

______________________________________________________________________________

