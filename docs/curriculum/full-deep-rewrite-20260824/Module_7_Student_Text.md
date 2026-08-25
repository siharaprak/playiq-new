# PlayIQ Module 7: Build Knowledge Files Your Tutor Can Trust

## Your mission: turn scattered notes into a tutor-ready Study Pack

Have you ever opened a page of notes and thought, "I know I wrote this, but I
still do not know what matters"?

Have you ever asked an AI to quiz you, only to get questions about information
that was never in your notes?

In this module, you will turn one small set of school notes into a clean
Knowledge File that helps both you and Orion understand the topic. You are not
building a giant database. You are making one useful file, testing it, and
learning what makes information trustworthy.

**By the end, I can:**

- separate source facts from my own summary;
- organize one topic into a clean Study Pack;
- add provenance so Orion knows where the information came from;
- turn notes into questions and identify missing links;
- compare a messy note dump with an organized Knowledge File;
- create a testable `knowledge-file-use` rule for my future personal tutor;
- add one approved, privacy-safe file to my Tutor Knowledge Pack.

You will need:

- one short set of school-approved notes on a topic you understand at least a
  little;
- your private, parent-approved AI workspace;
- your Module 6 Mistake Bank, if you have one;
- this workbook or a digital copy of it.

Do not upload private class records, another student's work, passwords, account
details, or anything your parent or teacher has not approved for AI use.

---

## Part 0 - The 30-second clean-file challenge

Look at these two ways of saving the same fact.

**Version A**

> plants sun energy food chlorophyll maybe roots water photosynthesis oxygen

**Version B**

> **Topic:** Photosynthesis  
> **Source fact:** Plants use light energy, water, and carbon dioxide to make
> glucose, releasing oxygen.  
> **Key term:** Chlorophyll - a pigment that absorbs light.

Which version would be easier to study tomorrow? Circle one: **A / B**

Write one reason:

______________________________________________________________________________

______________________________________________________________________________

There is no hidden trick. You just made your first file-design decision.

**ORION:** "A useful Knowledge File does not need to look fancy. It needs to
make the important information easy to find, trace, test, and update. Today,
you will teach your future tutor where the facts came from and how to use them
without pretending it knows more than the file contains."

Why this matters: your personal tutor will eventually use the files you choose
to give it. Clear files reduce guessing. Provenance helps you check the source.
Questions turn saved information into practice.

---

## Part 1 - What a Knowledge File really is

A **Knowledge File** is an organized document that gives an AI useful context
for a specific purpose.

It is not automatically true because it is neatly formatted. It becomes more
trustworthy when it clearly separates:

1. what the original source says;
2. what you wrote in your own words;
3. what you are still unsure about;
4. what Orion or another AI suggested;
5. what you checked and approved.

### Source, summary, question, or guess?

Read each line and mark what it is.

| Line | Source fact | My summary | Question | Unchecked guess |
|---|---:|---:|---:|---:|
| "The textbook says mitochondria release usable energy from food." | [ ] | [ ] | [ ] | [ ] |
| "I think of mitochondria as the cell's energy station." | [ ] | [ ] | [ ] | [ ] |
| "How is energy stored before the cell uses it?" | [ ] | [ ] | [ ] | [ ] |
| "Mitochondria probably control every part of the cell." | [ ] | [ ] | [ ] | [ ] |

Suggested interpretation:

- The first line reports a source fact.
- The second is a student-created memory explanation.
- The third is a question.
- The fourth is an unchecked guess and should not be stored as a fact.

### Why this activity matters

An AI may write every sentence in the same confident tone. Labels help Orion
tell the difference between evidence, your own understanding, and something
that still needs checking.

**ORION:** "If I cannot tell where a statement came from, I should not act as
if it is confirmed. Give me a label, and I can help you verify it."

---

## Part 2 - Build the eight-part Study Pack

Your Module 7 Knowledge File will use eight parts. Each part has a job.

### 1. File identity

This tells Orion what the file is about and whether it is current.

```yaml
title: [clear topic name]
subject: [school subject]
created_by: [student]
created_date: [YYYY-MM-DD]
last_reviewed: [YYYY-MM-DD or pending]
status: draft
privacy: safe_for_tutor_project
```

Why it matters: the title finds the file, the date helps detect stale material,
and the status prevents a draft from being mistaken for a verified final copy.

### 2. Source record

Record only what you need to find the source again.

```yaml
sources:
  - source_id: S1
    type: [class notes | textbook | teacher handout | approved website]
    title: [source title]
    section_or_page: [location or unknown]
    access_date: [YYYY-MM-DD or not_applicable]
    verification_status: student_checked
```

Do not paste a private login link or another person's identifying information.

Why it matters: provenance means knowing where information came from. It lets
you, Orion, a parent, or a teacher trace an important claim instead of trusting
it only because it sounds convincing.

### 3. Source notes

Copy only short, permitted facts or write accurate notes from the source. Give
each fact a source label.

```text
- [S1] Fact or note from the source.
- [S1] Another fact or note from the same source.
- [S2] A fact from a different approved source.
```

Why it matters: Orion can connect claims to sources and can tell you when the
file does not contain enough information to answer.

### 4. Ten-line summary

Write the first version yourself. Use no more than ten short lines.

A useful summary includes:

- the main idea;
- the most important parts or steps;
- one cause-and-effect connection;
- one example;
- one limit, exception, or uncertainty when relevant.

Why it matters: choosing what belongs in ten lines forces you to process the
topic. Copying an entire page saves words but may not build understanding.

### 5. Key terms

Choose five terms that unlock the topic.

```text
Term:
Meaning in my own words:
Source:
Example or connection:
```

Why it matters: one missing word can make an entire explanation feel harder
than it really is.

### 6. Questions for active recall

Turn the notes into questions that make you retrieve or use the information.

- **Easy:** checks a key fact or definition.
- **Medium:** explains a step, cause, or connection.
- **Challenge:** applies, compares, predicts, or solves.

Why it matters: notes become more useful when they can test you. Rereading can
feel familiar even when you cannot recall the idea without looking.

### 7. Missing links and Mistake Bank connection

Record what is not yet clear.

```text
Missing word:
Missing background fact:
Missing step:
Missing connection:
Related Mistake Bank entry:
Next question to investigate:
```

Why it matters: confusion becomes a target instead of a fog. Orion can help
with the missing piece rather than repeating the whole chapter.

### 8. Precision tutor prompt

Tell Orion how to use the file.

```text
Role: Act as my learning coach.
Task: Quiz me on [topic] using only the approved Study Pack.
Limits: If the file does not support an answer, say "Not found in this file."
Format: Ask one easy, one medium, and one challenge question, one at a time.
Effort rule: Wait for my attempt. Give one hint before explaining.
Verification: Cite the source label connected to your explanation.
```

Why it matters: a file supplies the context; the prompt supplies the job and
boundaries.

---

## Part 3 - Learn how you use information

Answer these discovery questions. They are clues for today's experiment, not
permanent labels about your brain.

### Discovery question 1

When notes look crowded, what is your first reaction?

- [ ] I start anyway.
- [ ] I search for the main idea first.
- [ ] I reorganize before studying.
- [ ] I avoid the notes or feel overwhelmed.
- [ ] Something else: _________________________________________________

What usually helps you begin?

______________________________________________________________________________

### Discovery question 2

When you make a summary, what is hardest right now?

- [ ] Deciding what matters.
- [ ] Writing it in my own words.
- [ ] Keeping it short.
- [ ] Knowing whether it is accurate.
- [ ] Connecting the ideas.

Why did you choose that answer?

______________________________________________________________________________

### Discovery question 3

Which type of study question gives you the most useful practice today: easy,
medium, or challenge? Why?

______________________________________________________________________________

______________________________________________________________________________

### Discovery question 4

When Orion uses your notes, what mistake would bother you most?

- [ ] Adding facts that are not in the file.
- [ ] Asking vague questions.
- [ ] Giving the answer before I try.
- [ ] Using an old or incorrect source.
- [ ] Something else: _________________________________________________

### Discovery question 5

What information about you or your schoolwork should **not** be included in
your future personal tutor files?

______________________________________________________________________________

______________________________________________________________________________

**ORION:** "Your answers tell us what to test. They do not lock you into one
way of studying. A different subject or a different day may need a different
file or quiz format."

---

## Part 4 - Build your first clean Study Pack

Choose a topic with enough material for a short quiz. Keep the source small
enough to review carefully.

### My file identity

Topic: ______________________________________________________________________

Subject: ____________________________________________________________________

Created date: ____________________  Status: [ ] draft  [ ] student-checked

Privacy check:

- [ ] I am allowed to use this material.
- [ ] It contains no unnecessary personal information.
- [ ] I know where the source came from.

### My source record

Source ID: ________

Type and title: ______________________________________________________________

Page, section, lesson, or location: __________________________________________

Verification status: [ ] student-checked  [ ] needs checking

### My source notes

Write five to ten short notes. Put the source ID beside each one.

1. __________________________________________________________________________

2. __________________________________________________________________________

3. __________________________________________________________________________

4. __________________________________________________________________________

5. __________________________________________________________________________

6. __________________________________________________________________________

7. __________________________________________________________________________

8. __________________________________________________________________________

### My ten-line summary

Write this version yourself before asking Orion for feedback.

1. __________________________________________________________________________

2. __________________________________________________________________________

3. __________________________________________________________________________

4. __________________________________________________________________________

5. __________________________________________________________________________

6. __________________________________________________________________________

7. __________________________________________________________________________

8. __________________________________________________________________________

9. __________________________________________________________________________

10. _________________________________________________________________________

### Five key terms

| Term | Meaning in my words | Source ID | Example or connection |
|---|---|---|---|
| 1. | | | |
| 2. | | | |
| 3. | | | |
| 4. | | | |
| 5. | | | |

### Turn the notes into questions

Easy question:

______________________________________________________________________________

Medium question:

______________________________________________________________________________

Challenge question:

______________________________________________________________________________

### Find one missing link

I understand: ________________________________________________________________

I am missing: [ ] a word  [ ] background  [ ] a step  [ ] a connection

My missing-link question:

______________________________________________________________________________

Related Mistake Bank entry, if any:

______________________________________________________________________________

### Ask Orion for feedback without giving away ownership

Paste only the approved Study Pack and use:

> "Act as my knowledge-file coach. Check whether my ten-line summary matches
> the source notes I provided. Identify one missing connection and one unclear
> line. Do not rewrite the summary. Refer to source IDs when you explain your
> feedback. If the file does not contain enough information, say so."

Orion's first useful feedback:

______________________________________________________________________________

What I changed myself:

______________________________________________________________________________

What I did **not** change, and why:

______________________________________________________________________________

---

## Part 5 - Active comparison: messy notes versus a clean file

You will use the **same topic** and the **same five-question standard** in both
tests. This keeps the comparison fair enough to learn from, but one small test
still does not prove a permanent preference.

### Test A - Messy note dump

1. Make a temporary copy of your source notes as one unlabelled paragraph.
2. In a fresh conversation, paste that paragraph.
3. Ask:

   > "Quiz me on this material with five questions. Wait for all five answers,
   > then show which source sentence supports each correction."

4. Answer without looking back at the notes.
5. Mark any question or correction that cannot be traced to the pasted text.

### Test B - Clean Study Pack

1. In another fresh conversation, paste your organized Study Pack.
2. Use the same request:

   > "Quiz me on this material with five questions. Wait for all five answers,
   > then show which source label supports each correction."

3. Answer without looking back at the file.
4. Mark any question or correction that cannot be traced to a source label.

### Evidence table

Use real observations. If something cannot be measured, write `not observed`
or `not tested`.

| Evidence | Test A: messy notes | Test B: clean Study Pack |
|---|---:|---:|
| Correct answers | ____ / 5 | ____ / 5 |
| Questions clearly connected to the provided material | ____ / 5 | ____ / 5 |
| Unsupported or untraceable claims noticed | ____ | ____ |
| Time to complete | ____ min | ____ min |
| Frustration during the test (1-5) | ____ | ____ |
| Help or clarification needed | ____ | ____ |

Which test made it easier to check Orion's questions and corrections?

______________________________________________________________________________

Which test helped you retrieve the topic more clearly?

______________________________________________________________________________

What part of the file organization created the biggest difference, if any?

______________________________________________________________________________

### Interpret the evidence without turning it into a label

Complete these statements:

**What I observed:**

______________________________________________________________________________

**A possible explanation:**

______________________________________________________________________________

**Another explanation I should keep open:**

______________________________________________________________________________

Examples of other explanations include topic familiarity, question quality,
fatigue, the order of the tests, or an incomplete source file.

**What I want to test again on another topic:**

______________________________________________________________________________

Do not write, "I am an organized learner forever." A stronger conclusion is,
"For this topic, source labels and a short summary made Orion's questions easier
to check. I will test the same format again."

---

## Part 6 - Learning Supercharger Blueprint update

Your Learning Supercharger Blueprint records **settings for your future tutor
to try**. It is not a personality test and it does not decide the only way you
can learn.

In this module, the setting controls how your tutor should use Knowledge Files.
You choose a first version based on the evidence, Orion tests it in real study
sessions, and you can keep, revise, or remove it later.

### Choose a testable setting

Check the actions supported by today's evidence:

- [ ] Ask me to name the topic and source before using a file.
- [ ] Separate source facts, my summary, and unanswered questions.
- [ ] Use source IDs when correcting or explaining.
- [ ] Say `not found in this file` instead of guessing beyond the file.
- [ ] Ask me to organize a very messy note dump before creating a quiz.
- [ ] Let me use quick raw notes first, then help me organize them afterward.
- [ ] Another setting: __________________________________________________

Write your rule in plain language:

______________________________________________________________________________

______________________________________________________________________________

Structured rule:

```yaml
rule_id: knowledge-file-use
status: pending_validation
instruction: [write the tutor behavior to test]
applies_when: [the tutor is using student-provided study material]
evidence: [messy-versus-clean comparison result]
review_condition: [test on another topic or revise if it slows learning]
```

Student decision: [ ] approve for testing  [ ] revise first  [ ] do not add

Why this setting may help:

______________________________________________________________________________

---

## Part 7 - Tutor Knowledge Pack update with provenance

Save the Study Pack as a separate file. Suggested filename:

`M07_[Subject]_[Topic]_Study_Pack.md`

Then add this module record to your **Learning Rules Knowledge File**. Replace
every bracketed placeholder with your actual evidence. Do not claim a result
you did not observe.

```yaml
module_record:
  module: 7
  date: [YYYY-MM-DD]
  skill_tested: knowledge_file_design
  experiment: messy_notes_vs_clean_study_pack
  result:
    organized_file_helped_checkability: [yes | no | mixed | not_tested]
    organized_file_helped_retrieval: [yes | no | mixed | not_tested]
    unsupported_claims_observed:
      messy: [number | not_observed]
      organized: [number | not_observed]
  proposed_tutor_rule:
    rule_id: knowledge-file-use
    instruction: [student-approved wording]
    status: [pending_validation | student_approved | rejected]
  provenance:
    evidence_type: experiment_result
    student_artifact: [Study Pack filename]
    source_ids: [S1]
    student_approved: [true | false]
  privacy: safe_for_tutor_project
  next_test: [what should be tested again]
```

### Orion compilation checkpoint

Submit through the approved PlayIQ module flow:

- your Study Pack;
- your comparison table;
- your proposed tutor rule;
- your privacy choice;
- your next test.

**ORION:** "I will add only what you approve. I will mark this rule as an
experiment result or pending validation unless repeated evidence supports it.
At the end of the course, this file may become part of the Knowledge File Pack
you choose to upload to your personal tutor Project."

What Orion says it will add or change:

______________________________________________________________________________

Does that summary feel accurate? [ ] Yes  [ ] No, revise it

Student approval: __________________________________  Date: __________________

---

## Part 8 - Proof Artifact: File Quality Test Card

Complete this card. A screenshot or saved copy becomes your proof that you
tested the skill.

```text
============================================================
              PLAYIQ FILE QUALITY TEST CARD
============================================================
Student: _________________________________________________
Topic organized: _________________________________________
Study Pack filename: _____________________________________
Source IDs recorded: _____________________________________

Messy test score:                 ____ / 5
Clean-file test score:            ____ / 5
Traceable messy questions:        ____ / 5
Traceable clean-file questions:   ____ / 5
Unsupported claims noticed:       messy ____  clean ____

Rule proposed: knowledge-file-use
Rule status: [ pending_validation | student_approved | rejected ]
Privacy: [ safe_for_tutor_project | parent_approval_required | do_not_include ]

One thing the evidence suggests:
___________________________________________________________

One thing the evidence does not prove:
___________________________________________________________
============================================================
```

---

## Part 9 - Mastery Challenge: build a tutor-ready Study Pack

To unlock Module 8, complete one final Study Pack without copying the example.

Your pack must contain:

- [ ] a clear subject and topic;
- [ ] a privacy classification;
- [ ] at least one traceable source record;
- [ ] five to ten source-labelled notes;
- [ ] a student-written summary of no more than ten lines;
- [ ] five key terms in your own words;
- [ ] one easy, one medium, and one challenge question;
- [ ] one missing-link question;
- [ ] one connection to your Mistake Bank, or `none observed`;
- [ ] a precision tutor prompt with a source boundary and effort rule;
- [ ] a draft, student-checked, or needs-review status.

### Orion's review conversation

Use this prompt with the approved file:

> "Review my Study Pack as a learning coach. Do not add facts from outside the
> file. Check whether the summary matches the source-labelled notes, whether
> the questions cover more than memorization, and whether any claim needs a
> source. Ask me to make the corrections myself. End with one question that
> tests the missing connection."

Corrections Orion requested:

1. __________________________________________________________________________

2. __________________________________________________________________________

Corrections I made myself:

1. __________________________________________________________________________

2. __________________________________________________________________________

Final status: [ ] student-checked  [ ] needs teacher/parent review

### Mastery reflection

Why is a clean-looking file not automatically a trustworthy file?

______________________________________________________________________________

How will provenance help your future personal tutor?

______________________________________________________________________________

What should Orion do when the answer is not supported by the file?

______________________________________________________________________________

**ORION:** "You have moved from saving notes to designing context. In Module 8,
you will protect something just as important as the facts: your own voice. Your
Knowledge Files will carry what you know; your tutor rules will make sure AI
helps you express it without taking over."

---

## Beta tester feedback - complete only in the beta route

This section appears only for beta testers and stays at the very end of the
module.

1. Did the 30-second challenge make the purpose of the module clear? Why or why
not?

______________________________________________________________________________

2. Which Study Pack section was most useful?

______________________________________________________________________________

3. Which instruction or template was still confusing?

______________________________________________________________________________

4. Did the messy-versus-clean comparison feel fair and useful?

______________________________________________________________________________

5. What would make this module faster, more fun, or easier to complete without
removing the important learning?

______________________________________________________________________________
