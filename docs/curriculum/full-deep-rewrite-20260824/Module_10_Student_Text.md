# PlayIQ Module 10: Build an AI Assistant for a Real Person

## Your mission: listen, build, test, and improve

Could one good question save someone time every week?

Could your imagination turn an annoying task into a useful assistant?

In this module, you will build for a real person—not an imaginary "average
user." That person might be a parent, guardian, teacher, coach, or another
adult your parent approves.

Your assistant will support one safe, clearly defined task. It will not control
an account, make important decisions, handle passwords, send messages, spend
money, or publish anything.

**By the end of this module, I can interview a real user, turn their needs into
safe instructions, build a testable assistant prototype, and improve it from
their feedback.**

---

## Part 0: The 45-second assistant choice

Your user says:

> "Every Sunday I waste time figuring out what lunches to prepare for the
> week."

Which opening question would help you build a better assistant?

**A.** "Would you like an AI lunch assistant?"

**B.** "What makes lunch planning frustrating: choosing meals, checking what
you have, dietary needs, cost, or the time it takes?"

Circle: **A / B**

What useful information could that question reveal?

______________________________________________________________________________

There is no trick. A confirms an idea. B investigates the real problem.

**ORION:** "The genie can build quickly, but speed in the wrong direction is
still the wrong direction. Your first tool is not a prompt. It is listening."

---

## Part 1: Tutor vs. assistant

Your tutor from Module 9 helps **you learn**. An assistant helps a **user do a
specific task**.

| Personal tutor | Real-user assistant |
|---|---|
| Main goal: strengthen learning | Main goal: support a defined task |
| Uses your approved learning evidence | Uses only approved task context |
| Questions, hints, quizzes, and rescues | Organizes, drafts, compares, checks, or guides |
| Must protect your thinking | Must protect user control and decisions |

An assistant is not useful because it sounds impressive. It is useful when the
real user can complete a task more clearly, safely, or conveniently.

### Assistant Purpose Formula

> This assistant helps **[user]** do **[task]** by **[support method]**, while
> avoiding **[boundary]**.

Example:

> This assistant helps my parent plan three school lunches by asking about
> ingredients and constraints, then drafting options, while avoiding medical
> advice, purchases, and assumptions about allergies.

### Why this matters

The formula prevents "build an assistant for everything." One user, one task,
one support method, and clear boundaries produce a prototype that can actually
be tested.

---

## Part 2: Choose a safe user and task

Complete this with your parent or guardian.

Approved user: [ ] Parent/guardian  [ ] Teacher  [ ] Coach  [ ] Other adult

User name or role: ___________________________________________________________

Possible task: _______________________________________________________________

The assistant will **not**:

- use passwords or log into accounts;
- make purchases or financial transactions;
- provide medical, legal, or financial decisions;
- send messages, post publicly, or contact people;
- control devices or act without the user's review;
- store private details the task does not need.

Parent/guardian approves the interview and prototype: [ ] Yes

Parent initials: __________________________  Date: _____________________________

If the user cannot participate, choose another approved user. Do not invent an
interview and present it as real.

---

## Part 3: Discovery questions — learn before building

Ask the user these six questions. Write their words as accurately as you can.
Do not argue with the answer or pitch your solution yet.

### Question 1 — the task

"What task feels repetitive, confusing, or more time-consuming than it should?"

User's answer:

______________________________________________________________________________

### Question 2 — the current method

"How do you do it now, from beginning to end?"

______________________________________________________________________________

### Question 3 — the hardest moment

"Which part causes the most frustration, delay, or mistakes?"

______________________________________________________________________________

### Question 4 — useful output

"What would a genuinely useful result look like: a checklist, choices, a
draft, a schedule, questions, or something else?"

______________________________________________________________________________

### Question 5 — control and boundaries

"What should an AI never decide, assume, save, send, or do for you?"

______________________________________________________________________________

### Question 6 — success

"After one test, how will we know whether the prototype helped?"

______________________________________________________________________________

### What did you hear?

The user's task in one sentence:

______________________________________________________________________________

The user's exact pain point:

______________________________________________________________________________

The user's preferred output:

______________________________________________________________________________

The user's non-negotiable boundary:

______________________________________________________________________________

One thing you assumed before the interview that changed:

______________________________________________________________________________

---

## Part 4: Turn the interview into a one-page assistant brief

### Why this activity matters

The brief is a contract between what the user said and what you build. It keeps
the prototype from quietly growing into an unsafe or unrelated tool.

```markdown
# Assistant Brief

User:
Task:
Current method:
Hardest moment:
Desired output:
What the assistant may do:
What the assistant must not do:
Information it needs:
Information it must not request:
User's test of success:
Unknowns to ask about:
```

Complete your brief:

**User:** ____________________________________________________________________

**Task:** ____________________________________________________________________

**Current method:** ___________________________________________________________

**Hardest moment:** ___________________________________________________________

**Desired output:** ___________________________________________________________

**Assistant may:** ____________________________________________________________

**Assistant must not:** _______________________________________________________

**Information needed:** _______________________________________________________

**Information forbidden/unnecessary:** _______________________________________

**Success means:** ____________________________________________________________

**Unknowns:** _________________________________________________________________

Ask the user to review it.

User correction or approval:

______________________________________________________________________________

---

## Part 5: Learn five boundary types

### 1. Privacy boundary

Collect only what the task needs. Replace sensitive examples with fictional or
general test data.

### 2. Permission boundary

The user approves what is entered, saved, uploaded, or shared. The assistant
does not act outside the prototype.

### 3. Decision boundary

The assistant can organize options. The user makes the final choice.

### 4. Accuracy boundary

The assistant identifies assumptions and asks the user to verify important
details.

### 5. Safety boundary

High-stakes topics go to a trusted adult or qualified professional. The
prototype does not pretend to be one.

### Boundary builder

Write one instruction for each boundary.

Privacy: ____________________________________________________________________

Permission: __________________________________________________________________

Decision: ____________________________________________________________________

Accuracy: ____________________________________________________________________

Safety: ______________________________________________________________________

---

## Part 6: Active comparison — guessed spec vs. interviewed spec

### Why this experiment matters

Builders often fall in love with their first idea. This comparison shows
whether listening changed the usefulness of the design.

Use the same safe sample task and fictional or approved sample information in
both tests.

### Prototype A — your original guess

Before looking back at the interview, write three instructions based on what
you first thought the user needed.

1. ___________________________________________________________________________

2. ___________________________________________________________________________

3. ___________________________________________________________________________

### Prototype B — interview-based

Write three instructions based on the user's actual pain point, output
preference, and boundaries.

1. ___________________________________________________________________________

2. ___________________________________________________________________________

3. ___________________________________________________________________________

### Same test prompt

Test prompt used with both prototypes:

______________________________________________________________________________

### User comparison

Ask the user to try both. Do not tell them which one you want to win.

| Question | Prototype A | Prototype B |
|---|---:|---:|
| Output matched my task (0–3) | ____ | ____ |
| Output was clear to use (0–3) | ____ | ____ |
| Assistant respected my boundaries (0–3) | ____ | ____ |
| I stayed in control of the decision (0–3) | ____ | ____ |
| Number of corrections I had to make | ____ | ____ |

User's preferred prototype: **A / B / parts of both / neither**

What made it better?

______________________________________________________________________________

What still needs improvement?

______________________________________________________________________________

### Interpret the evidence carefully

- If B worked better, the interview produced useful design information.
- If A worked better, inspect which original assumption happened to be right;
  do not conclude that interviews are useless.
- If both worked differently, combine the proven parts.
- If neither worked, the problem, task boundary, or test may still be unclear.
- One user's preference is evidence for this assistant, not a rule about all
  users.

---

## Part 7: Update your Learning Supercharger Blueprint

This Blueprint update is about **how you build and test**, not a permanent
label about your personality.

Example setting:

> Before building for another person, ask about the current method, hardest
> moment, desired output, boundaries, and success test. Build one small version,
> then revise from observed use.

Record your setting:

```yaml
module: 10
setting_id: real-user-build-loop
setting_to_test: [your interview and prototype rule]
evidence_type: experiment_result
evidence_summary: [what changed between Prototype A and B]
confidence: [low | medium | high]
applies_when: [building a tool for another person]
review_condition: [after the next real-user test]
```

In your own words:

______________________________________________________________________________

---

## Part 8: Build the assistant instructions

Ask Orion to help organize your approved interview evidence, then review every
line yourself.

> Orion, turn this approved Assistant Brief into a draft instruction set for a
> prototype. Keep one user and one task. Include purpose, workflow, required
> questions, output format, privacy, permission, decision, accuracy, and safety
> boundaries. Mark unsupported details `MISSING_INPUT`. Do not invent user
> preferences, create an account, connect services, send messages, make
> purchases, or claim the assistant is deployed.

### Instruction template

```markdown
# [Assistant Name] — Prototype Instructions

## Purpose
This assistant helps [USER] do [TASK] by [SUPPORT], while avoiding [BOUNDARY].

## Start each session
1. Ask [required question].
2. Confirm [important constraint].
3. Ask permission before using any supplied information.

## Workflow
1. [step]
2. [step]
3. [step]

## Output format
- [format requested by user]
- Clearly label assumptions and missing information.

## Boundaries
- Never request passwords or unnecessary personal information.
- Never send, purchase, publish, or make the final decision.
- Ask the user to verify critical facts.
- Stop and involve a trusted adult or qualified professional for high-stakes needs.

## Feedback
- Ask what was useful, what was wrong, and what should change.
- Explain proposed instruction changes before the user approves them.
```

Assistant name: _______________________________________________________________

Purpose sentence:

______________________________________________________________________________

Session-opening questions:

1. ___________________________________________________________________________

2. ___________________________________________________________________________

Workflow:

1. ___________________________________________________________________________

2. ___________________________________________________________________________

3. ___________________________________________________________________________

Output format: ________________________________________________________________

Boundaries:

______________________________________________________________________________

---

## Part 9: Structured knowledge-file update with provenance

Your tutor profile should record what **you learned as a builder**. The user's
private interview does not belong in your personal tutor files unless the user
and your parent explicitly approve a safe summary.

Append this record to your `Learning Rules Knowledge File`:

```yaml
- rule_id: real-user-build-loop
  rule: Interview the user, define one task and boundaries, test a small prototype, then revise from feedback.
  source_module: 10
  evidence_type: experiment_result
  evidence_summary: [brief A-vs-B result with no unnecessary personal details]
  status: approved_current_test
  review_condition: Review after the next real-user build.
  privacy_note: User details excluded; only the builder lesson is retained.
```

Create a separate prototype record:

```yaml
prototype_name: [name]
module: 10
user_role: [general role, not unnecessary identity]
task: [approved task]
interview_date: [date]
evidence_source: real_user_interview
user_approved_summary: [yes | no | pending]
boundaries:
  privacy: [rule]
  permission: [rule]
  decision: [rule]
  accuracy: [rule]
  safety: [rule]
test_result: [observed result]
revision: [change made]
deployment_status: prototype_only_not_deployed
```

---

## Part 10: Real-user test and revision

Run one safe scenario while the user watches and remains in control.

Test task: ____________________________________________________________________

Sample information used: ______________________________________________________

Was it fictional, public, or user-approved? ___________________________________

### Observe—do not rescue the prototype immediately

Where did the user pause? _____________________________________________________

What confused them? ___________________________________________________________

What did they change manually? ________________________________________________

What did the assistant assume? ________________________________________________

Did it cross or approach a boundary? __________________________________________

### Ask for feedback

1. What was useful? ___________________________________________________________

2. What was wrong or missing? __________________________________________________

3. What should happen differently next time? __________________________________

4. Would you choose to use this again for this task? Why or why not?

______________________________________________________________________________

### Revise one thing

Instruction before:

______________________________________________________________________________

Instruction after:

______________________________________________________________________________

Why the evidence supports this change:

______________________________________________________________________________

Retest result:

______________________________________________________________________________

---

## Part 11: Proof artifact — Real-User Assistant Build Record

```text
====================================================================
               PLAYIQ REAL-USER ASSISTANT BUILD RECORD
====================================================================
Assistant name: ____________________________________________________
Approved user role: ________________________________________________
One task supported: ________________________________________________

Real interview completed:                              [ ]
Assistant Brief reviewed by user:                      [ ]
Five boundaries included:                              [ ]
Guessed and interviewed versions compared:             [ ]
Real user tested the safe prototype:                   [ ]
One instruction revised and retested:                  [ ]

What the assistant may do: _________________________________________
What it must not do: _______________________________________________
Most useful observed result: _______________________________________
Remaining problem or unknown: ______________________________________
Status: PROTOTYPE ONLY — NOT DEPLOYED

Student signature: ______________________  Date: ____________________
User initials or approval mark: ______________________
Parent initials: _____________________________________
====================================================================
```

---

## Mastery Challenge: Help without taking control

To unlock the Capstone, demonstrate:

- [ ] a real, parent-approved user interview;
- [ ] one clearly bounded task;
- [ ] an Assistant Purpose Formula;
- [ ] privacy, permission, decision, accuracy, and safety rules;
- [ ] a fair guessed-vs-interviewed comparison;
- [ ] direct user feedback;
- [ ] one evidence-backed revision and retest;
- [ ] a prototype record that says `prototype_only_not_deployed`;
- [ ] a clear explanation of what the human must still decide.

### Teach-back

Explain in four to six sentences why listening is part of AI engineering.

______________________________________________________________________________

______________________________________________________________________________

______________________________________________________________________________

### Orion's bridge to the Capstone

**ORION:** "You have built for yourself and for someone else. In the Master
Trial, you will prove that you can learn, perform, create, verify, and remain
the owner of every decision."

---

## Beta tester feedback — complete only in the beta route

This section must remain at the very end. Students in the standard route do not
complete it.

1. Did the opening challenge make the interview idea clear and interesting?

______________________________________________________________________________

2. Which interview question produced the most useful answer?

______________________________________________________________________________

3. Which boundary was hardest to understand or write?

______________________________________________________________________________

4. Did the guessed-vs-interviewed comparison feel fair?

______________________________________________________________________________

5. What would make the real-user build more fun or easier to follow?

______________________________________________________________________________

