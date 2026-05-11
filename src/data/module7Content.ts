import type { NodeContent } from './module1Content';

export const module7Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    title: '10-Line Summary System',
    bigIdea: [
      'A good summary is short, clear, and useful.',
      'A bad summary copies too much.',
      'The 10-Line Summary forces you to decide what matters.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Act as my PlayIQ study coach. Help me turn my notes on [topic] into a 10-Line Summary. Ask me to write my first version before improving it. Do not write the whole summary without my attempt."',
        ],
      },
    ],
    activity: {
      title: '10-Line Summary',
      instructions: [
        'Turn your notes into a 10-Line Summary following the template.',
      ],
      scenarios: [
        '1. This topic is about...',
        '2. The main idea is...',
        '3. Key term 1 & 4. Key term 2 & 5. Key term 3:',
        '6. One example is...',
        '7. One common mistake is...',
        '8. One thing I should remember is...',
        '9. One thing I need to check is...',
        '10. My best study question is...',
      ],
      reflection: [
        'Which line was hardest to write?',
        'What does that show you?',
      ],
    },
    miniCheck: [
      'Why is a 10-Line Summary better than copying notes?',
      'Which line was hardest to write?',
      'What does that show you?',
    ],
    teachBack:
      'Explain why copying a full page of notes is less effective for learning than forcing yourself to write a 10-Line Summary.',
  },

  '2': {
    id: '2',
    title: 'Turn Notes Into Questions',
    bigIdea: [
      'Notes are not finished until they can test you.',
      'Every useful note should turn into a question.',
      'This changes studying from passive reading into active recall.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Help me turn these notes into study questions. Make 3 easy questions, 3 medium questions, and 2 challenge questions. Do not include answers until I try."',
        ],
      },
    ],
    activity: {
      title: 'Notes to Questions',
      instructions: [
        'Convert your notes into 3 Easy, 3 Medium, and 2 Challenge questions.',
      ],
      scenarios: [
        'Easy questions 1, 2, 3:',
        'Medium questions 1, 2, 3:',
        'Challenge questions 1, 2:',
      ],
      reflection: [
        'Question I missed or struggled with:',
        'What that tells me:',
      ],
    },
    miniCheck: [
      'Why should notes become questions?',
      'Which question type was hardest?',
      'What should you practice next?',
    ],
    teachBack:
      'Explain how turning your notes into questions changes how your brain interacts with the material.',
  },

  '3': {
    id: '3',
    title: 'Find Missing Links',
    bigIdea: [
      'A missing link is the part between two ideas that you do not understand yet.',
      'You may know the words, but not the connection.',
      'Finding missing links makes studying faster.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Look at my summary and questions. Ask me 3 diagnostic questions to find any missing links. Tell me whether the missing link is a word, step, connection, example, or background idea."',
        ],
      },
    ],
    activity: {
      title: 'Missing Link Finder',
      instructions: [
        'Identify missing links in your understanding of the notes.',
      ],
      scenarios: [
        'My missing link is:',
        'Type (word, step, connection, example, or background):',
        'Clue that showed this:',
        'Best repair move:',
      ],
      reflection: [
        'One better question to ask:',
      ],
    },
    miniCheck: [
      'What missing link did you find?',
      'What type was it?',
      'How will you repair it?',
    ],
    teachBack:
      'Explain the difference between knowing the definitions of words and understanding the "missing link" connections between them.',
  },

  '4': {
    id: '4',
    title: 'Precision Prompting',
    bigIdea: [
      'A vague prompt gives vague help.',
      'A precision prompt tells AI: role, task, topic, limits, format, effort rule, output.',
      'This is the beginning of custom instruction thinking.',
    ],
    sections: [
      {
        title: 'Precision Prompt Formula',
        content: [
          'Role: Act as my learning coach.',
          'Task: Help me study this topic.',
          'Topic: [topic]',
          'Limits: Keep it short and do not give answers before I try.',
          'Format: Ask one question at a time.',
          'Effort rule: I must attempt before you explain.',
          'Output: End with a short review plan.',
        ],
      },
      {
        title: 'Prompt to Use',
        content: [
          '"Act as my PlayIQ learning coach. Help me improve this prompt using the precision prompt formula. Keep it beginner-friendly and explain what you changed."',
        ],
      },
    ],
    activity: {
      title: 'Prompt Upgrade',
      instructions: [
        'Take a weak prompt and upgrade it to a precision prompt.',
      ],
      scenarios: [
        'Weak prompt:',
        'Upgraded precision prompt:',
        'What changed:',
        'Why it is stronger:',
      ],
      reflection: [
        'How it keeps AI as coach, not crutch:',
      ],
    },
    miniCheck: [
      'What makes a prompt precise?',
      'Why do limits matter?',
      'How is this connected to custom instructions?',
    ],
    teachBack:
      'Explain to a friend why adding "Limits" and an "Effort Rule" to an AI prompt makes the AI a much better tutor.',
  },
};
