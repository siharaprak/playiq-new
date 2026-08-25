import type { NodeContent } from './module1Content';

export const module10Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-01.png',
    title: 'Tutor vs Assistant & The Purpose Formula',
    bigIdea: [
      'Your mission: listen, build, test, and improve.',
      'Could one good question save someone time every week? In this module, you will build for a real person \u2014 not an imaginary user.',
      'Your assistant will support one safe, clearly defined task. It will not control an account, make decisions, handle passwords, send messages, spend money, or publish anything.',
    ],
    sections: [
      {
        title: 'The 45-second assistant choice',
        content: [
          'Your user says: "Every Sunday I waste time figuring out what lunches to prepare for the week."',
          'A. "Would you like an AI lunch assistant?"',
          'B. "What makes lunch planning frustrating: choosing meals, checking what you have, dietary needs, cost, or the time it takes?"',
          'A confirms an idea. B investigates the real problem.',
          'Your first tool is not a prompt. It is listening.',
        ],
      },
      {
        title: 'Tutor vs assistant',
        content: [
          'Your tutor from Module 9 helps you learn. An assistant helps a user do a specific task.',
          'Personal tutor: strengthens learning, uses your evidence, questions/hints/quizzes, protects your thinking.',
          'Real-user assistant: supports a defined task, uses only approved task context, organizes/drafts/compares/checks, protects user control and decisions.',
        ],
      },
      {
        title: 'Assistant Purpose Formula',
        content: [
          'This assistant helps [user] do [task] by [support method], while avoiding [boundary].',
          'Example: "This assistant helps my parent plan three school lunches by asking about ingredients and constraints, then drafting options, while avoiding medical advice, purchases, and assumptions about allergies."',
          'One user, one task, one support method, and clear boundaries produce a prototype that can actually be tested.',
        ],
      },
    ],
    activity: {
      title: 'Write Your Purpose Formula',
      instructions: [
        'Choose which opening question (A or B) would help build a better assistant.',
        'Write your own Assistant Purpose Formula.',
      ],
      scenarios: [
        'Who is your user?',
        'What is the task?',
        'What support method will the assistant use?',
        'What boundaries must be in place?',
      ],
      reflection: [
        'Why is investigating the problem better than confirming your idea?',
      ],
    },
    miniCheck: [
      'What is the difference between a tutor and an assistant?',
      'What are the four parts of the Assistant Purpose Formula?',
      'Why does one task produce a better prototype than "everything"?',
    ],
    teachBack: 'Explain the Purpose Formula and describe why listening comes before building.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-02.png',
    title: 'Choose a Safe User & Discovery Interview',
    bigIdea: [
      'Choose a user and task with parent approval. Do not invent an interview and present it as real.',
      'Ask six discovery questions. Write their words as accurately as you can. Do not argue with the answer or pitch your solution yet.',
    ],
    sections: [
      {
        title: 'Choose a safe user and task',
        content: [
          'Approved user: Parent/guardian, Teacher, Coach, or other adult.',
          'The assistant will NOT: use passwords, make purchases, provide medical/legal/financial decisions, send messages or post publicly, control devices, or store private details the task does not need.',
          'Parent/guardian must approve the interview and prototype.',
        ],
      },
      {
        title: 'Six discovery questions',
        content: [
          '1. The task: "What task feels repetitive, confusing, or more time-consuming than it should?"',
          '2. The current method: "How do you do it now, from beginning to end?"',
          '3. The hardest moment: "Which part causes the most frustration, delay, or mistakes?"',
          '4. Useful output: "What would a genuinely useful result look like: a checklist, choices, a draft, a schedule, questions, or something else?"',
          '5. Control and boundaries: "What should an AI never decide, assume, save, send, or do for you?"',
          '6. Success: "After one test, how will we know whether the prototype helped?"',
        ],
      },
      {
        title: 'What did you hear?',
        content: [
          'The user\u2019s task in one sentence.',
          'The user\u2019s exact pain point.',
          'The user\u2019s preferred output.',
          'The user\u2019s non-negotiable boundary.',
          'One thing you assumed before the interview that changed.',
        ],
      },
    ],
    activity: {
      title: 'Conduct the Discovery Interview',
      instructions: [
        'Get parent approval for the user and task.',
        'Ask all six discovery questions and record the user\u2019s words.',
        'Summarize what you heard.',
      ],
      scenarios: [
        'Question 1: The task',
        'Question 2: Current method',
        'Question 3: Hardest moment',
        'Question 4: Useful output',
        'Question 5: Boundaries',
        'Question 6: Success criteria',
      ],
      reflection: [
        'What did you assume before the interview that changed after listening?',
      ],
    },
    miniCheck: [
      'What six questions do you ask in the discovery interview?',
      'What safety constraints must the assistant follow?',
      'What changed between your assumption and the user\u2019s actual answer?',
    ],
    teachBack: 'Describe the discovery interview process and what you learned by listening.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-03.png',
    title: 'The Assistant Brief & Five Boundary Types',
    bigIdea: [
      'The brief is a contract between what the user said and what you build. It keeps the prototype from quietly growing into an unsafe or unrelated tool.',
    ],
    sections: [
      {
        title: 'One-page assistant brief',
        content: [
          'User:',
          'Task:',
          'Current method:',
          'Hardest moment:',
          'Desired output:',
          'What the assistant may do:',
          'What the assistant must not do:',
          'Information it needs:',
          'Information it must not request:',
          'User\u2019s test of success:',
          'Unknowns to ask about:',
          'Ask the user to review and approve the brief.',
        ],
      },
      {
        title: 'Five boundary types',
        content: [
          '1. Privacy boundary: Collect only what the task needs. Replace sensitive examples with fictional or general test data.',
          '2. Permission boundary: The user approves what is entered, saved, uploaded, or shared.',
          '3. Decision boundary: The assistant can organize options. The user makes the final choice.',
          '4. Accuracy boundary: The assistant identifies assumptions and asks the user to verify important details.',
          '5. Safety boundary: High-stakes topics go to a trusted adult or qualified professional.',
        ],
      },
    ],
    activity: {
      title: 'Complete Brief & Set Boundaries',
      instructions: [
        'Fill in the complete assistant brief from your interview.',
        'Write one instruction for each of the five boundary types.',
        'Have the user review and approve the brief.',
      ],
      scenarios: [
        'Assistant brief: all fields completed',
        'Privacy boundary instruction:',
        'Permission boundary instruction:',
        'Decision boundary instruction:',
        'Accuracy boundary instruction:',
        'Safety boundary instruction:',
      ],
      reflection: [
        'Did the user correct or approve your brief?',
        'Which boundary is most important for your task?',
      ],
    },
    miniCheck: [
      'What goes in the assistant brief?',
      'What are the five boundary types?',
      'Why does the user need to approve the brief?',
    ],
    teachBack: 'Present the assistant brief and explain all five boundary types with examples from your project.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-04.png',
    title: 'Guessed Spec vs Interviewed Spec Comparison',
    bigIdea: [
      'Builders often fall in love with their first idea. This comparison shows whether listening changed the usefulness of the design.',
    ],
    sections: [
      {
        title: 'Prototype A \u2014 your original guess',
        content: [
          'Before looking back at the interview, write three instructions based on what you first thought the user needed.',
          'Test these instructions on a safe sample task.',
          'Rate: Addressed the real pain point (0\u20133), Output matched what the user wanted (0\u20133), Respected boundaries (0\u20133).',
        ],
      },
      {
        title: 'Prototype B \u2014 interview-based',
        content: [
          'Write three instructions based on the user\u2019s actual pain point, output preference, and boundaries.',
          'Test these on the same sample task.',
          'Rate using the same three criteria.',
        ],
      },
      {
        title: 'Compare the evidence',
        content: [
          'Which prototype addressed the real problem more accurately?',
          'What was the most significant difference?',
          'What did listening reveal that guessing missed?',
          'Use conditional language: "For this user and task, interviewing revealed ___, which my original guess missed."',
        ],
      },
    ],
    activity: {
      title: 'Guessed vs Interviewed Comparison',
      instructions: [
        'Write three instructions based on your original guess.',
        'Write three instructions based on the interview.',
        'Test both on the same sample task.',
        'Compare and rate results.',
      ],
      scenarios: [
        'Prototype A: guessed instructions \u2014 ratings',
        'Prototype B: interviewed instructions \u2014 ratings',
        'Which addressed the real pain point?',
      ],
      reflection: [
        'What was the most significant difference between guessed and interviewed specs?',
        'What did listening reveal that guessing missed?',
      ],
    },
    miniCheck: [
      'What was the difference between your guess and the interviewed spec?',
      'Which prototype was more useful and why?',
      'What did listening change about your design?',
    ],
    teachBack: 'Describe both prototypes and explain why the interviewed version was different.',
  },

  '5': {
    id: '5',
    imageUrl: '/images/modules/bright-mixed-playiq-05.png',
    title: 'Blueprint Update & Build the Assistant',
    bigIdea: [
      'Your Blueprint now includes assistant-building skills. The instructions must match what the user actually needs, not what you think would be cool.',
    ],
    sections: [
      {
        title: 'Learning Supercharger Blueprint update',
        content: [
          'assistant-design = [interview-first | brief-first | not-yet-known]',
          'boundary-priority = which boundary type matters most for this kind of task',
          'evidence = guessed vs interviewed comparison result',
          'Rule: "Before building an assistant, always interview the user. Start with the six discovery questions."',
        ],
      },
      {
        title: 'Build the assistant instructions',
        content: [
          'Your instructions should include these sections:',
          'Purpose: What the assistant does and who it helps.',
          'Start each session: How the assistant opens.',
          'Workflow: The step-by-step process the assistant follows.',
          'Output format: How results are presented.',
          'Boundaries: All five boundary types with specific instructions.',
          'Feedback: How the assistant asks whether the result was useful.',
        ],
      },
    ],
    activity: {
      title: 'Build the Assistant Instructions',
      instructions: [
        'Write complete assistant instructions with all six sections.',
        'Verify each instruction traces back to the interview.',
        'Include all five boundary types.',
      ],
      scenarios: [
        'Purpose section: complete',
        'Session opening: complete',
        'Workflow: complete',
        'Output format: complete',
        'Boundaries: all five types',
        'Feedback: complete',
      ],
      reflection: [
        'Does every instruction trace back to the interview?',
        'Are all five boundary types addressed?',
      ],
    },
    miniCheck: [
      'What six sections are in the assistant instructions?',
      'What is your assistant-design Blueprint setting?',
      'Does every instruction match the user\u2019s actual needs?',
    ],
    teachBack: 'Walk through your assistant instructions and explain how each section connects to the interview.',
  },

  '6': {
    id: '6',
    imageUrl: '/images/modules/bright-mixed-playiq-06.png',
    title: 'Real-User Test & Revision',
    bigIdea: [
      'The real test is not whether you like your assistant. The real test is whether the user can complete their task more easily, safely, and accurately.',
    ],
    sections: [
      {
        title: 'Real-user test',
        content: [
          'Ask the user to try the assistant on a real (or realistic) version of their task.',
          'Observe without interrupting. Take notes on what worked and what did not.',
          'After the test, ask: "Did this help? What was missing? What was confusing? What should be different?"',
        ],
      },
      {
        title: 'User feedback record',
        content: [
          'What the user tried:',
          'What worked:',
          'What did not work or was confusing:',
          'What the user wants changed:',
          'Did the assistant stay within boundaries?',
          'Was the output useful?',
        ],
      },
      {
        title: 'Make revisions',
        content: [
          'Based on user feedback, update:',
          '\u2022 Instructions that were unclear or wrong',
          '\u2022 Boundaries that were too loose or too strict',
          '\u2022 Output format that did not match user needs',
          '\u2022 Workflow steps that were missing or confusing',
          'Record each change and why you made it.',
        ],
      },
    ],
    activity: {
      title: 'Test & Revise',
      instructions: [
        'Have the real user test the assistant.',
        'Record their feedback.',
        'Make at least one revision based on their feedback.',
        'Test again if possible.',
      ],
      scenarios: [
        'User tested the assistant on a real task.',
        'User feedback recorded.',
        'At least one revision made.',
        'Boundaries were respected.',
      ],
      reflection: [
        'What was the most useful feedback from the user?',
        'How did you improve the assistant?',
      ],
    },
    miniCheck: [
      'What should you observe during the user test?',
      'What feedback questions should you ask?',
      'What revision did you make and why?',
    ],
    teachBack: 'Describe the user test and explain how their feedback improved the assistant.',
  },

  '7': {
    id: '7',
    imageUrl: '/images/modules/bright-mixed-playiq-07.png',
    title: 'Proof Artifact & Help Without Taking Control',
    bigIdea: [
      'Your proof artifact is the Real-User Assistant Build Record. It documents the full build process: interview, brief, instructions, test, feedback, and revision.',
    ],
    sections: [
      {
        title: 'Proof artifact \u2014 Real-User Assistant Build Record',
        content: [
          'User (role only, no private details):',
          'Task:',
          'Assistant Purpose Formula:',
          'Interview completed: yes / not yet',
          'Brief approved by user: yes / not yet',
          'Instructions written: yes / not yet',
          'Boundaries set: all five types / partial',
          'User test completed: yes / not yet',
          'Feedback received: yes / not yet',
          'Revisions made: (number)',
          'Most useful user feedback:',
          'Most important revision:',
          'One thing I would improve with more time:',
        ],
      },
      {
        title: 'Knowledge File update',
        content: [
          'rule_id: module_10_assistant_build',
          'module: 10',
          'skill_tested: real_user_assistant_design',
          'source_activity: guessed_vs_interviewed_comparison_and_user_test',
          'assistant_purpose: [Purpose Formula]',
          'evidence: interview_changed_design, user_feedback_improved_prototype',
          'confidence: [low|medium|high]',
          'privacy: safe_for_tutor_project',
        ],
      },
    ],
    activity: {
      title: 'Mastery Challenge \u2014 Help Without Taking Control',
      instructions: [
        'Present your assistant to the user for a final test on a realistic task.',
        'Verify: Did the assistant help without taking control?',
        'Complete the Build Record.',
        'Teach back what you learned about listening, building, and testing.',
      ],
      scenarios: [
        'The assistant helped the user without making decisions for them.',
        'All five boundary types were respected.',
        'The user said the prototype was useful.',
        'I can explain what I built and why.',
        'I saved the Build Record and Knowledge File update.',
      ],
      reflection: [
        'What is the most important thing you learned about building for a real person?',
        'How is building for someone else different from building for yourself?',
        'What would you do differently next time?',
      ],
    },
    miniCheck: [
      'What does your Build Record document?',
      'Did the assistant help without taking control?',
      'What is the most important lesson from Module 10?',
    ],
    teachBack: 'Present your Build Record and teach back what you learned about listening, building, testing, and improving for a real user.',
  },
};
