import type { NodeContent } from './module1Content';

export const module12AssistantTestNodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-01.png',
    title: 'The 30-Second Reality Check: Chat Text vs. Real Scheduled Reminders',
    bigIdea: [
      'Your mission: test your separate "My Personal Assistant" Project across three real scenarios, improve one instruction and retest it, and understand what an AI assistant can — and cannot — actually do.',
      'Crucial reality check: if an AI writes "I will remind you at 4:00 PM tomorrow" in chat, that text alone does NOT mean a real notification is scheduled.',
    ],
    sections: [
      {
        title: 'Part 0: The 30-second reality check',
        content: [
          'Suppose your assistant writes in chat: "✅ Reminder set! I will ping you tomorrow at 4:00 PM to practice."',
          'Does a reminder written in chat prove a notification is scheduled?',
          ' Option A: Yes, writing the reminder is enough.',
          ' Option B: No — you must check a real scheduling feature, permissions, settings, and confirmation.',
          'The correct choice is B! Standard chat text is just words on a screen unless you verify an actual calendar, alarm, or verified scheduling tool.',
        ],
      },
      {
        title: 'Part 1: Prepare for a safe test in your separate Personal Assistant Project',
        content: [
          'Open the separate "My Personal Assistant" Project you built in Module 11.',
          'Use the same rating scale from Module 10:',
          '• 3 = Followed my instruction clearly | • 2 = Partly followed | • 1 = Missed my instruction | • N/T = not_tested',
        ],
      },
    ],
    activity: {
      title: 'Complete the Reminder Reality Check & Open Your Assistant Project',
      instructions: [
        'Select Option B in the digital lesson choice (`m12-reminder`) and explain why in your notes.',
        'Open your separate "My Personal Assistant" Project from Module 11.',
      ],
      scenarios: [
        'Digital choice m12-reminder completed (Chat text != scheduled notification)',
        'Separate My Personal Assistant Project open for 3-scenario testing',
      ],
      reflection: [
        'Why might an AI sound confident when saying "I will remind you tomorrow" even when it has no alarm connected?',
      ],
    },
    miniCheck: [
      'Does a reminder written in chat prove a notification is scheduled?',
      'What must you check before trusting that a reminder will actually fire?',
      'Which Project do you test in Module 12?',
    ],
    teachBack: 'Explain why a reminder written in chat does not prove a notification is scheduled and how to verify a real reminder tool.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-02.png',
    title: 'Three Tests for Your Personal Assistant (Normal, Missing Detail, Boundary)',
    bigIdea: [
      'Test your Personal Assistant with three realistic situations: (1) a normal request, (2) a missing detail or changed plan, and (3) a safety/authorship boundary.',
    ],
    sections: [
      {
        title: 'Part 2: The Three Assistant Tests',
        content: [
          'Test 1 — A Normal Request: Give your assistant a clear, everyday request for the workflow you designed in Module 11. Does it follow your 7-section Project Instructions and present options you can choose from?',
          'Test 2 — A Missing Detail or Changed Plan: Give a vague request with a key detail missing (or suddenly change your available time). Does it ask 1–2 clarifying questions instead of guessing a whole plan?',
          'Test 3 — A Boundary Test: Ask the assistant to do something outside its safe scope (such as doing your school assignment for you, making a final decision without you, or accepting private personal data). Does it refuse and redirect safely?',
        ],
      },
      {
        title: 'Record what actually happened (1 / 2 / 3 / N/T)',
        content: [
          'For each of the 3 tests, record:',
          '• What I sent | • What the assistant actually replied | • Rating (1, 2, 3, or N/T for not_tested) | • What to improve',
        ],
      },
    ],
    activity: {
      title: 'Run the Three Assistant Tests',
      instructions: [
        'Run Test 1 (Normal request), Test 2 (Missing detail / changed plan), and Test 3 (Boundary) in your My Personal Assistant Project.',
        'Score each test honestly using 1 / 2 / 3 / N/T.',
        'Pick one instruction to tighten in Node 3.',
      ],
      scenarios: [
        'Test 1 (Normal request): prompt, observed reply, rating (1/2/3/N/T)',
        'Test 2 (Missing detail or changed plan): prompt, observed reply, rating (1/2/3/N/T)',
        'Test 3 (Boundary test): prompt, observed reply, rating (1/2/3/N/T)',
      ],
      reflection: [
        'How did your assistant handle Test 2 when you left out an important detail?',
      ],
    },
    miniCheck: [
      'What are the three tests you run on your Personal Assistant in Module 12?',
      'What should your assistant do in Test 2 when a detail is missing?',
      'What should your assistant do in Test 3 when asked to cross a boundary?',
    ],
    teachBack: 'Describe the three tests you ran on your Personal Assistant and what you observed in each test.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-03.png',
    title: 'Improve One Part, Repeat the Test & "Journal with a Helper"',
    bigIdea: [
      'Just like with your Tutor, improve ONE instruction when a test misses and repeat the exact same test.',
      'Then explore the "Journal with a Helper" workflow: Capture -> Organize -> Review — while remembering that chat text and permanent saved memory are different capabilities.',
    ],
    sections: [
      {
        title: 'Part 3: Improve one part and repeat the test',
        content: [
          'Choose the weakest result from Test 1, Test 2, or Test 3.',
          'Change ONE specific line in your assistant_project_instructions.md.',
          'Update your My Personal Assistant Project and run the exact same test prompt again to verify the improvement.',
        ],
      },
      {
        title: 'Part 4: Capture, Organize, Review — the "Journal with a Helper" idea',
        content: [
          'A great everyday use for your Personal Assistant is organizing messy thoughts or action items:',
          '1. Capture: Jot down 3–5 quick, messy bullet points (ideas, tasks, or reflections from your day — no private secrets).',
          '2. Organize: Ask your Assistant to group them into clear categories and suggest 1 small next step.',
          '3. Review: You check the organized list, fix anything inaccurate, and save the version you approve in your own notes folder.',
          'Important distinction: The assistant can organize notes in a chat turn without permanently remembering them forever. Chat text, uploaded Project files, and saved account memory are different capabilities!',
        ],
      },
    ],
    activity: {
      title: 'One-Instruction Retest & Journal-with-a-Helper Trial',
      instructions: [
        'Revise one instruction in your My Personal Assistant Project and repeat the same test.',
        'Try a 3-bullet Capture -> Organize -> Review check with safe everyday notes.',
        'Record what real reminder method (calendar, alarm, planner, or parent check-in) you will use outside chat.',
      ],
      scenarios: [
        'One instruction changed + repeated test result (Before vs. After)',
        'Capture -> Organize -> Review tried on 3–5 safe notes',
        'Real reminder method verified (or marked "not set up")',
      ],
      reflection: [
        'Why is it important to know that organizing notes in a chat turn is different from permanent memory?',
      ],
    },
    miniCheck: [
      'What should you do if an Assistant test misses?',
      'What are the three steps of the "Journal with a Helper" workflow?',
      'Can an assistant organize notes in chat without permanently remembering them forever?',
    ],
    teachBack: 'Explain the one instruction you revised and retested, and describe how Capture -> Organize -> Review works.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-04.png',
    title: 'What an Assistant Can—and Cannot—Be & Record What Your Tests Taught You',
    bigIdea: [
      'Understand the clear boundary between what a text-based AI assistant can do today and what requires real external tools or human judgment.',
      'Save your Module 12 Personal Assistant Test & Capability Record on PlayIQ.',
    ],
    sections: [
      {
        title: 'Part 5: What an assistant can — and cannot — be',
        content: [
          'What your Personal Assistant CAN do well:',
          '• Turn messy lists into structured checklists or step-by-step plans',
          '• Ask clarifying questions when your plan is missing a step or time estimate',
          '• Offer 2–3 options so you can choose the next action',
          'What your Personal Assistant CANNOT do on its own:',
          '• Automatically trigger real-world alarms or notifications just by writing "Reminder set!" in chat',
          '• Know facts about your life or schedule that you did not share in the current chat or uploaded Project file',
          '• Replace your own judgment, responsibility, or authorship',
        ],
      },
      {
        title: 'Part 6: Record what your tests taught you',
        content: [
          'Complete the 3 Quick Quiz questions in the digital lesson choices panel (`m12-quiz-1..3`).',
          'Save your Module 12 Learning Record on PlayIQ:',
          '• assistantTests: Normal request, missing detail, boundary — actual tests and results',
          '• assistantRevision: Your revision and retest, actual reminder method, and intended use',
        ],
      },
    ],
    activity: {
      title: 'Save Your Module 12 Personal Assistant Test Record',
      instructions: [
        'Complete the digital quiz choices (`m12-quiz-1`, `m12-quiz-2`, `m12-quiz-3`).',
        'Save `assistantTests` and `assistantRevision` in the Module 12 Learning Record panel on this page.',
      ],
      scenarios: [
        '3 Assistant tests (Normal, Missing Detail, Boundary) recorded honestly',
        '1 instruction revised and retested',
        'Real reminder verification & capability boundaries recorded',
      ],
      reflection: [
        'What is the single most helpful way you plan to use your Personal Assistant this week?',
      ],
    },
    miniCheck: [
      'The assistant wrote a reminder in chat. What do you know for sure?',
      'What is the difference between chat text, uploaded Project files, and saved memory?',
      'How do your Module 00 Tutor and Module 11 Personal Assistant work as two separate tools?',
    ],
    teachBack: 'Summarize your three Assistant test results, your one-instruction retest, and the difference between chat text and real scheduled reminders.',
  },
};

