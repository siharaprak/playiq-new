import type { NodeContent } from './module1Content';

export const module10Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/playiq-image-02.png',
    title: 'What Makes a Good AI Assistant',
    bigIdea: [
      'A good assistant has a clear job.',
      'A weak assistant tries to do everything.',
      'The clearer the purpose, the more useful the assistant.',
    ],
    sections: [
      {
        title: 'Assistant Purpose Formula',
        content: [
          'This assistant helps [user] do [task] by [support method], while avoiding [boundary].',
          'Example: This assistant helps my parent plan weekly meals by organizing preferences, grocery ideas, and simple recipes, while avoiding medical or diet advice.',
        ],
      },
    ],
    activity: {
      title: 'Assistant Purpose Draft',
      instructions: [
        'Draft a purpose sentence for two assistants: one for yourself, one for someone else.',
      ],
      scenarios: [
        'My assistant for myself - User & Task:',
        'Support method & Boundary:',
        'Purpose sentence:',
        'My assistant for someone else - User & Task:',
        'Support method & Boundary:',
        'Purpose sentence:',
      ],
      reflection: [
        'Why should an assistant have one clear purpose?',
      ],
    },
    miniCheck: [
      'Why should an assistant have one clear purpose?',
      'What makes an assistant too broad?',
      'What is one assistant boundary you need?',
    ],
    teachBack:
      'Explain why an assistant that "helps with everything" is actually less useful than an assistant that "helps organize my weekend study schedule."',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-08.png',
    title: 'Assistant Purpose and Boundaries',
    bigIdea: [
      'Boundaries protect the user. Boundaries tell the assistant what not to do.',
      'This matters more when building for someone else.',
      'Boundary Types: Privacy, Permission, Decision, Safety, Accuracy.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Help me create safe boundaries for an assistant that helps with [task]. Ask me who the assistant is for, what information it needs, what it must not do, and what should be verified by a human."',
        ],
      },
    ],
    activity: {
      title: 'Boundary Card',
      instructions: [
        'Define the safe boundaries for your assistant.',
      ],
      scenarios: [
        'Assistant purpose:',
        'Privacy boundary & Permission boundary:',
        'Decision boundary & Safety boundary:',
        'Accuracy boundary:',
      ],
      reflection: [
        'What the assistant should say when asked to cross a boundary:',
      ],
    },
    miniCheck: [
      'Why do assistants need boundaries?',
      'Which boundary matters most for your assistant?',
      'What should your assistant refuse?',
    ],
    teachBack:
      'Teach someone the difference between a Permission Boundary and a Decision Boundary.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-15.png',
    title: 'Custom Instructions for Real Tasks',
    bigIdea: [
      'Assistant custom instructions should be task-specific.',
      'They tell the assistant: who it helps, what problem it solves, what information it uses, format, tone, boundaries, when to ask questions, and when to verify.',
    ],
    sections: [
      {
        title: 'Assistant Instructions Template',
        content: [
          'Assistant Role: You are a helpful assistant for [user] that helps with [task].',
          'Goal: Help get [outcome].',
          'User Context: User prefers [style] and wants help with [specific need].',
          'What To Do: Ask clarifying questions, organize clearly, give options.',
          'What Not To Do: Do not make major decisions, do not request private info.',
          'Output Format: Use [checklist/table/etc].',
          'Verification Rule: Remind the user to verify important info.',
        ],
      },
    ],
    activity: {
      title: 'Assistant Custom Instructions',
      instructions: [
        'Write the custom instructions for your assistant.',
      ],
      scenarios: [
        'Assistant name & Assistant role:',
        'Goal & User context:',
        'What to do & What not to do:',
        'Output format & Verification rule:',
      ],
      reflection: [
        'Why should instructions include what NOT to do?',
      ],
    },
    miniCheck: [
      'What are assistant custom instructions?',
      'Why should instructions include what not to do?',
      'What output format fits your assistant?',
    ],
    teachBack:
      'Explain how writing custom instructions for a task makes an AI much better than just using generic ChatGPT.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-36.png',
    title: 'Knowledge Files for Useful Support',
    bigIdea: [
      'Knowledge files make assistants more useful.',
      'But they must be safe, organized, and relevant.',
      'Good Files: approved preferences, checklists, templates. Bad Files: passwords, medical records, secret data.',
    ],
    sections: [
      {
        title: 'Bad Assistant Knowledge Files',
        content: [
          '- private passwords',
          '- financial account information',
          '- medical records',
          '- secrets from another person',
          '- private messages without permission',
          '- giant messy files',
        ],
      },
    ],
    activity: {
      title: 'Knowledge File Plan',
      instructions: [
        'Plan the knowledge files your assistant will use, making sure they are safe.',
      ],
      scenarios: [
        'Knowledge file 1 (Name, What it includes, Why it helps):',
        'Permission confirmed? (yes/no):',
        'Knowledge file 2 (Name, What it includes, Why it helps):',
        'Permission confirmed? (yes/no):',
      ],
      reflection: [
        'What file would make your assistant most useful?',
      ],
    },
    miniCheck: [
      'What makes a safe knowledge file?',
      'What should never go into a knowledge file?',
      'What file would make your assistant most useful?',
    ],
    teachBack:
      'Explain why you need explicit permission before uploading a schedule or set of preferences into an AI assistant.',
  },

  '5': {
    id: '5',
    imageUrl: '/images/modules/bright-mixed-playiq-38.png',
    title: 'Build an Assistant for Yourself',
    bigIdea: [
      'Start with a simple assistant for yourself. Do not overbuild. Pick one real problem.',
      'Examples: study schedule assistant, habit tracker, weekly planning.',
    ],
    sections: [
      {
        title: 'Activity: Personal Assistant Build Sheet',
        content: [
          'Build and test the assistant for yourself.',
        ],
      },
    ],
    activity: {
      title: 'Personal Assistant Build Sheet',
      instructions: [
        'Fill out the details of your personal assistant and test it.',
      ],
      scenarios: [
        'Assistant name & Problem it solves:',
        'Custom instructions summary:',
        'Test scenario 1 & Test scenario 2:',
      ],
      reflection: [
        'What worked and what needs improvement:',
      ],
    },
    miniCheck: [
      'What problem does your assistant solve?',
      'What did your test show?',
      'What should you revise?',
    ],
    teachBack:
      'Share the biggest problem you found when you first tested your assistant, and how you fixed it.',
  },

  '6': {
    id: '6',
    imageUrl: '/images/modules/bright-mixed-playiq-37.png',
    title: 'Build an Assistant for Someone Else',
    bigIdea: [
      'Building for someone else requires empathy. You cannot just guess. You need to ask what they need.',
    ],
    sections: [
      {
        title: 'Mini User Interview',
        content: [
          'Ask your chosen person:',
          '1. What task would you like help with?',
          '2. What makes that task annoying?',
          '3. What kind of help would be useful?',
          '4. What should the assistant avoid?',
          '5. What info are you comfortable sharing?',
        ],
      },
    ],
    activity: {
      title: 'Real-User Assistant Build Sheet',
      instructions: [
        'Interview someone, build an assistant for them, and revise it based on their feedback.',
      ],
      scenarios: [
        'Chosen user & Task they want help with:',
        'Main frustration & Useful support needed:',
        'Boundaries & Approved information:',
        'Test scenario & User feedback:',
      ],
      reflection: [
        'Revision made:',
      ],
    },
    miniCheck: [
      'What did your chosen person actually need?',
      'What assumption did you avoid?',
      'How did user feedback improve the assistant?',
    ],
    teachBack:
      'Explain why you must interview the person you are building an assistant for, instead of just guessing what they want.',
  },

  '7': {
    id: '7',
    imageUrl: '/images/modules/bright-mixed-playiq-35.png',
    title: 'Ethics, Privacy, and Boundaries',
    bigIdea: [
      'Building assistants gives you power. Power requires responsibility.',
      'Your assistant should be: useful, respectful, permission-based, clear about limits, safe, and easy to correct.',
    ],
    sections: [
      {
        title: 'Assistant Builder Responsibility Check',
        content: [
          '1. Did the user agree to the purpose?',
          '2. Did the user approve the information?',
          '3. Are private details protected?',
          '4. Are boundaries clear?',
          '5. Does the assistant ask the human to verify?',
          '6. Can the assistant be improved?',
        ],
      },
    ],
    activity: {
      title: 'Final Responsibility Check',
      instructions: [
        'Run the final ethics checklist for your assistant.',
      ],
      scenarios: [
        'Purpose approved? (yes/no):',
        'Private information removed? (yes/no):',
        'Boundaries and Verification reminders included? (yes/no):',
        'Feedback collected and Revision made? (yes/no):',
      ],
      reflection: [
        'What boundary makes your assistant safer?',
      ],
    },
    miniCheck: [
      'Why is permission important?',
      'Why should private information be protected?',
      'What boundary makes your assistant safer?',
    ],
    teachBack:
      'Explain what makes an AI Builder "responsible." What rules do they follow that normal users might ignore?',
  },
};
