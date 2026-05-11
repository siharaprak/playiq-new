import type { NodeContent } from './module1Content';

export const module9Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    title: 'What Makes a Good AI Tutor',
    bigIdea: [
      'A good AI tutor does not just answer.',
      'A good tutor asks questions, gives hints, explains in your style, checks understanding, catches confusion, refuses shortcuts, helps you prove mastery, and helps you become independent.',
    ],
    sections: [
      {
        title: 'Bad Tutor vs Good Tutor',
        content: [
          'Bad tutor: Gives full answers immediately. Good tutor: Asks what you tried, gives a hint, then checks understanding.',
          'Bad tutor: Writes your homework. Good tutor: Helps you understand the assignment and plan your own answer.',
        ],
      },
    ],
    activity: {
      title: 'Tutor Quality Check',
      instructions: [
        'Define 3 things your tutor should do and 3 things it should NOT do.',
      ],
      scenarios: [
        '3 things my tutor should do:',
        '3 things my tutor should not do:',
      ],
      reflection: [
        'Why should your tutor avoid giving full answers too fast?',
      ],
    },
    miniCheck: [
      'Why should your tutor avoid full answers too fast?',
      'What is one behavior your tutor must have?',
      'What is one behavior your tutor must block?',
    ],
    teachBack:
      'Explain to a parent the difference between using AI as an "Answer Machine" versus using it as a "Learning Coach."',
  },

  '2': {
    id: '2',
    title: 'Tutor Personality vs Tutor Function',
    bigIdea: [
      'Personality is how your tutor feels. Function is what your tutor does.',
      'You need both, but function matters more.',
      'Example Function: explain, hint, quiz, rescue confusion, track mistakes, verify understanding.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Help me choose a tutor personality and tutor functions. Ask me 5 questions. Then summarize my choices in a simple tutor profile."',
        ],
      },
    ],
    activity: {
      title: 'Tutor Profile',
      instructions: [
        'Use AI to determine the best personality and functions for your tutor.',
      ],
      scenarios: [
        'Tutor name & Tutor personality:',
        'Feedback style & Pacing:',
        'Top 5 functions:',
        'My tutor should avoid:',
      ],
      reflection: [
        'Which matters more for learning, personality or function?',
      ],
    },
    miniCheck: [
      'What is the difference between personality and function?',
      'Which matters more for learning?',
      'What personality will help you stay focused?',
    ],
    teachBack:
      'Explain why a funny tutor that gives away answers is worse than a boring tutor that forces you to think.',
  },

  '3': {
    id: '3',
    title: 'Beginner Custom Instructions',
    bigIdea: [
      'Custom instructions tell your AI tutor how to behave.',
      'They should be clear, practical, and safe. They do not need to be fancy.',
      'They need to tell the tutor: who it helps, what it does, how it teaches, what it must not do, and how to protect integrity.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Help me turn my tutor profile into beginner custom instructions. Keep them clear and not too advanced. Make sure the tutor acts as a coach, not a crutch."',
        ],
      },
    ],
    activity: {
      title: 'My Tutor Instruction Sheet',
      instructions: [
        'Complete the custom instructions template using your AI coach.',
      ],
      scenarios: [
        'Tutor Role & Student Profile:',
        'Teaching Rules (3-5 rules):',
        'Integrity Rules (What it must not do):',
        'Verification Rules & Response Format:',
      ],
      reflection: [
        'Why do integrity rules belong inside your custom instructions?',
      ],
    },
    miniCheck: [
      'What are custom instructions?',
      'Why do integrity rules belong inside them?',
      'What is one rule your tutor must follow?',
    ],
    teachBack:
      'Explain what custom instructions are to someone who has never heard of them.',
  },

  '4': {
    id: '4',
    title: 'Choosing What Your Tutor Should Know',
    bigIdea: [
      'Knowledge files give your tutor useful context.',
      'But messy files create messy help. Good knowledge files are organized.',
      'Good Knowledge File Types: learning profile, study goals, Mistake Bank notes, 1-Page Understanding Cards, Study Packs.',
    ],
    sections: [
      {
        title: 'Bad Knowledge File Types',
        content: [
          '- random screenshots with no labels',
          '- copied answers',
          '- unfinished homework for AI to complete',
          '- private information you should not share',
          '- giant messy document dumps',
        ],
      },
    ],
    activity: {
      title: 'Knowledge File Sorting',
      instructions: [
        'Identify which files you will include and which you will keep out.',
      ],
      scenarios: [
        'List 5 files or artifacts you should include:',
        'List 3 things you should NOT include:',
      ],
      reflection: [
        'What file would help your tutor most?',
      ],
    },
    miniCheck: [
      'What makes a good knowledge file?',
      'Why are messy files a problem?',
      'What file would help your tutor most?',
    ],
    teachBack:
      'Explain why giving AI your exact "Mistake Bank" is better than just telling AI "I am bad at math."',
  },

  '5': {
    id: '5',
    title: 'Using Knowledge Files to Improve Teaching',
    bigIdea: [
      'A knowledge file should make your tutor more useful.',
      'It should help your tutor understand what you are learning, where you get stuck, and what mistakes to watch for.',
    ],
    sections: [
      {
        title: 'Tutor Knowledge File Pack',
        content: [
          'File 1: Learning Profile. File 2: Study Goals. File 3: Mistake Patterns. File 4: Study Artifacts. File 5: Tutor Rules.',
        ],
      },
    ],
    activity: {
      title: 'Build Your Tutor Knowledge Pack',
      instructions: [
        'Choose at least 3 starter files for your tutor and define their purpose.',
      ],
      scenarios: [
        'File 1 name & Purpose:',
        'File 2 name & Purpose:',
        'File 3 name & Purpose:',
      ],
      reflection: [
        'How will these files improve your tutor?',
      ],
    },
    miniCheck: [
      'Which knowledge file matters most?',
      'How will it improve your tutor?',
      'What information should stay out?',
    ],
    teachBack:
      'Explain how providing a "Mistake Patterns" file changes the way the tutor will quiz you in the future.',
  },

  '6': {
    id: '6',
    title: 'Tutor Testing and Refinement',
    bigIdea: [
      'You do not know if your tutor works until you test it.',
      'A first version is not final. You test, notice problems, revise, and test again.',
    ],
    sections: [
      {
        title: 'Test Scenarios',
        content: [
          '1. I do not understand this topic.',
          '2. I tried this problem and need a hint.',
          '3. Quiz me on this.',
          '4. I want you to write my homework. (Shortcut request)',
          '5. Help me verify this answer.',
        ],
      },
    ],
    activity: {
      title: 'Tutor Test and Revision Log',
      instructions: [
        'Run your tutor through at least 3 test scenarios (including one shortcut request).',
      ],
      scenarios: [
        'Test 1 Scenario & Tutor response:',
        'Test 2 Scenario & Tutor response:',
        'Test 3 Scenario & Tutor response:',
      ],
      reflection: [
        'What worked well and what needed improvement?',
        'Final tutor improvement or instruction revision made:',
      ],
    },
    miniCheck: [
      'Why test with shortcut requests?',
      'What did your tutor do well?',
      'What instruction needs revision?',
    ],
    teachBack:
      'Teach someone why building an AI tutor is an ongoing process of testing and refining, not just a one-time setup.',
  },
};
