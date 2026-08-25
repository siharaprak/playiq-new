import type { NodeContent } from './module1Content';

export const module6Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-01.png',
    title: 'Retrieval Over Rereading',
    bigIdea: [
      'Your mission: turn wrong answers into your fastest study map.',
      'What if every mistake could tell you exactly what to learn next? Most students hide mistakes, erase them, or reread the whole chapter. In this module, you will test what you can produce without looking, investigate why an answer missed, and save the useful clue in a Mistake Bank.',
      'A wrong answer is not a verdict. It is a message from the exact edge of what you know.',
    ],
    sections: [
      {
        title: 'The 30-second confidence hook',
        content: [
          'Without looking back at Module 5, answer quickly: What were the three supporting parts on your Understanding Card called?',
          'How confident are you? Very confident / Somewhat confident / Guessing',
          'Now check Module 5. Result: correct / partly correct / not yet',
          'In less than a minute, you discovered two pieces of useful information: what you could retrieve and whether your confidence matched the result.',
        ],
      },
      {
        title: 'Rereading can feel easier than remembering',
        content: [
          'When the answer is visible, your brain can recognize it. Recognition feels familiar, but a test usually asks you to produce, explain, select, or use the idea without the answer in front of you.',
          'Self-testing closes that gap:',
          '1. Hide the source.',
          '2. Try to retrieve or use the idea.',
          '3. Check against an approved source.',
          '4. Investigate the mistake.',
          '5. Correct it in your own words.',
          '6. Try a new question that tests the same missing skill.',
        ],
      },
      {
        title: 'Coach, not answer machine',
        content: [
          'STUDENT: "I got it wrong. Just tell me the answer."',
          'ORION: "I will help, but first let us use the mistake. Was the problem a missing fact, an unclear word, a skipped step, a rushed error, difficulty using the idea in a new situation, or confidence that did not match the answer?"',
          'The same wrong answer can need very different repairs. More rereading will not fix every kind of mistake.',
        ],
      },
    ],
    activity: {
      title: 'Quick Retrieval Test',
      instructions: [
        'Answer the confidence hook without looking.',
        'Check your answer and record the result.',
        'Reflect on whether your confidence matched reality.',
      ],
      scenarios: [
        'What were the three supporting parts on your Understanding Card called?',
        'How confident were you?',
        'Was your answer correct, partly correct, or not yet?',
      ],
      reflection: [
        'What did you discover about your retrieval vs. recognition?',
      ],
    },
    miniCheck: [
      'What is the difference between recognition and retrieval?',
      'What are the six steps of self-testing?',
      'Why is investigating a mistake more useful than just seeing the correct answer?',
    ],
    teachBack: 'Explain why self-testing reveals more than passive rereading.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-02.png',
    title: 'The Six Mistake Categories & Mistake Bank',
    bigIdea: [
      'Categories are working hypotheses. You can revise one after looking more closely.',
      'The categories help you ask the right kind of repair question instead of repeating the same study method.',
    ],
    sections: [
      {
        title: '1. Knowledge gap',
        content: [
          'You did not yet know or remember an important fact, rule, or concept.',
          'Useful Orion request: "Explain [concept] in plain language, give one example and one check question."',
        ],
      },
      {
        title: '2. Vocabulary or symbol gap',
        content: [
          'A word, phrase, unit, or notation blocked understanding.',
          'Useful Orion request: "Define [term] in this context. Show one correct use and one common misuse."',
        ],
      },
      {
        title: '3. Step or process gap',
        content: [
          'You knew the pieces but missed a move in between.',
          'Useful Orion request: "Show only the missing step between [A] and [B]. Then give me a similar step to try."',
        ],
      },
      {
        title: '4. Application gap',
        content: [
          'You understood the idea in one setting but could not transfer it to a new one.',
          'Useful Orion request: "Give me a different context and ask me to apply the same rule. Do not solve it."',
        ],
      },
      {
        title: '5. Attention or rush error',
        content: [
          'You knew the content but made a careless mistake under speed or fatigue.',
          'Useful Orion request: "Show me where my process was correct and where the error entered."',
        ],
      },
      {
        title: '6. Confidence mismatch',
        content: [
          'Your confidence was higher than your actual result. You believed you knew it.',
          'Useful Orion request: "Quiz me again on the same concept without hints. Do not reveal the answer until I attempt it."',
        ],
      },
      {
        title: 'Creating your Mistake Bank',
        content: [
          'For each mistake, record: Date, Topic, Question or task, My answer, Correct answer, Gap category, Why (one sentence), Correction in my own words, New question to prove the fix.',
          'Orion should ask for the correction before showing the complete answer.',
        ],
      },
    ],
    activity: {
      title: 'Build Your First Mistake Bank Entry',
      instructions: [
        'Choose a recent mistake from schoolwork or Module 5 retrieval.',
        'Classify it into one of the six categories.',
        'Write the correction in your own words.',
        'Ask Orion for a new question that tests the same skill.',
      ],
      scenarios: [
        'Date / Topic / Question',
        'My answer vs. correct answer',
        'Gap category and evidence',
        'Correction in my own words',
        'New question to prove the fix',
      ],
      reflection: [
        'Which mistake category was hardest to identify?',
        'Did the category help you choose a better repair strategy?',
      ],
    },
    miniCheck: [
      'Name all six Mistake Bank categories.',
      'What information goes in each Mistake Bank entry?',
      'Why should Orion ask for your correction before showing the answer?',
    ],
    teachBack: 'Explain the six Mistake Bank categories and give an example of each.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-03.png',
    title: 'Quiz Format Comparison & Spaced Review',
    bigIdea: [
      'Compare one-at-a-time and full-set quiz formats to see which helps you retrieve and repair more effectively.',
      'A spaced-review plan is only useful if you actually follow it. Start with a realistic, simple plan.',
    ],
    sections: [
      {
        title: 'Active comparison \u2014 two quiz formats',
        content: [
          'Format A \u2014 One-at-a-time: Orion asks one question, waits for your attempt, gives feedback, then asks the next.',
          'Format B \u2014 Full set: Orion gives five questions at once. You attempt all of them before checking any.',
          'Rate each: Thinking effort (1\u20135), Temptation to check early (1\u20135), Quality of mistake info (1\u20135), Frustration (1\u20135).',
        ],
      },
      {
        title: 'Build a spaced-review plan',
        content: [
          'A simple plan: Review Session 1 (same day), Session 2 (next day), Session 3 (three days later), Session 4 (one week later).',
          'Each session: attempt the retrieval questions from your Mistake Bank without looking. Check against the source. Update the entry if your answer changed.',
          'If you miss a review session, resume at the next one. Do not restart.',
        ],
      },
      {
        title: 'Learn How You Learn discovery',
        content: [
          'When a quiz feels hard, do you tend to push through, pause, switch topics, or avoid?',
          'What conditions help you focus during self-testing?',
          'What usually makes you stop reviewing before you planned to?',
          'When have you remembered something days later because you tested yourself?',
          'These answers help design your tutor\u2019s quiz behavior.',
        ],
      },
    ],
    activity: {
      title: 'Quiz Format Comparison',
      instructions: [
        'Run both quiz formats (one-at-a-time and full-set) on the same topic.',
        'Rate each format on thinking effort, temptation, mistake info quality, and frustration.',
        'Create your first spaced-review plan.',
      ],
      scenarios: [
        'Format A: one-at-a-time ratings',
        'Format B: full-set ratings',
        'My spaced-review plan: Session 1 (today), Session 2 (tomorrow), Session 3 (3 days), Session 4 (1 week)',
      ],
      reflection: [
        'Which format revealed more about what you actually know?',
        'Is your review plan realistic for your schedule?',
      ],
    },
    miniCheck: [
      'What is the difference between one-at-a-time and full-set quiz formats?',
      'What are the four sessions in a simple spaced-review plan?',
      'What should you do if you miss a review session?',
    ],
    teachBack: 'Describe both quiz formats and explain which one worked better for you, using evidence from your comparison.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-04.png',
    title: 'Blueprint, Proof & Repair-Retest Mastery',
    bigIdea: [
      'Your Blueprint quiz-and-feedback setting tells Orion how to quiz you and what to do when you get something wrong. It is testable and revisable.',
    ],
    sections: [
      {
        title: 'Learning Supercharger Blueprint update',
        content: [
          'quiz-format = [one-at-a-time | full-set | mixed | not-yet-known]',
          'mistake-response = how Orion should help when you get something wrong',
          'review-reminder = your planned review schedule',
          'evidence = your comparison result',
          'Rule in plain language: "When quizzing me, use ___. When I get something wrong, first ask me to classify the mistake, then ___."',
        ],
      },
      {
        title: 'Knowledge File updates',
        content: [
          'rule_id: module_6_quiz_format',
          'module: 6',
          'skill_tested: self_testing_and_mistake_repair',
          'source_activity: one_at_a_time_vs_full_set_comparison',
          'proposed_quiz_format: [format or not_yet_known]',
          'mistake_response_rule: [category_first | hint_first | explain_first]',
          'evidence: quiz format ratings, mistake categories used',
          'confidence: [low|medium|high]',
          'privacy: safe_for_tutor_project',
        ],
      },
      {
        title: 'Proof artifact \u2014 Quiz and Mistake Repair Card',
        content: [
          'Topic tested:',
          'Mistake Bank entries created:',
          'Quiz format comparison result:',
          'Proposed quiz-format setting:',
          'One mistake I classified and repaired:',
          'New question I answered to prove the fix:',
          'Spaced review plan:',
          'Orion rules staged: quiz-format / mistake-response',
        ],
      },
    ],
    activity: {
      title: 'Mastery Challenge \u2014 Repair and Retest',
      instructions: [
        'Choose one real topic from current schoolwork.',
        '1. Self-test using your preferred quiz format.',
        '2. Classify at least two mistakes using the six categories.',
        '3. Correct each mistake in your own words.',
        '4. Ask Orion for a new question that tests the same skill.',
        '5. Answer the new question without help.',
        '6. Record your results in the Mistake Bank.',
      ],
      scenarios: [
        'I can self-test without seeing the answers first.',
        'I can classify a mistake into the right category.',
        'I can correct the mistake in my own words.',
        'I can answer a new question that tests the same skill.',
        'I saved the proof artifact and knowledge-file record.',
      ],
      reflection: [
        'What did classifying the mistake reveal that rereading would not?',
        'Is your spaced-review plan realistic?',
        'What do you want to test again in your next review session?',
      ],
    },
    miniCheck: [
      'What is your quiz-format setting and why?',
      'How did you classify and repair your mistakes?',
      'What is your spaced-review plan?',
    ],
    teachBack: 'Walk through a mistake you classified, repaired, and retested \u2014 showing the full Mistake Bank process.',
  },
};
