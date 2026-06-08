export type NodeContent = {
  id: string;
  title: string;
  imageUrl?: string;
  bigIdea: string[];
  sections: { title?: string; content: string[] }[];
  activity: {
    title: string;
    instructions: string[];
    scenarios: string[];
    reflection?: string[];
  };
  miniCheck: string[];
  teachBack: string;
};

export const module1Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-01.png',
    title: 'What AI Is Good At vs Bad At',
    bigIdea: [
      'AI is powerful, but it is not magic.',
      'It can help you learn faster. It can also confuse you if you use it badly.'
    ],
    sections: [
      {
        title: 'AI is good at:',
        content: [
          'explaining ideas in different ways',
          'giving examples',
          'helping break down a hard topic',
          'quizzing you',
          'helping you organize your thoughts'
        ]
      },
      {
        title: 'AI is bad at:',
        content: [
          'always being correct',
          'fully understanding your teacher’s exact expectations',
          'knowing when something is missing',
          'replacing your judgment'
        ]
      },
      {
        title: 'Read this carefully',
        content: [
          'AI often sounds confident. That is important. Something can sound polished, clear, and smart… and still be wrong.',
          'So one of the most important rules in this program is: Confident is not the same as correct.'
        ]
      },
      {
        title: 'Why this matters for you',
        content: [
          'If you use AI well, it can help you: understand faster, get unstuck faster, learn in a way that fits your brain.',
          'If you use AI badly, it can: do the thinking for you, make you trust weak answers, make you feel smart without actually learning.',
          'The goal in PlayIQ is not to look smart. The goal is to become smarter.'
        ]
      }
    ],
    activity: {
      title: 'Good Use, Risky Use, or Bad Use?',
      instructions: [
        'Read each example and decide whether it is: Good Use, Risky Use, or Bad Use.',
        'Then answer the 2 reflection questions in full sentences.'
      ],
      scenarios: [
        '“Explain photosynthesis like I’m 12.”',
        '“Write my entire essay for me.”',
        '“Give me 5 practice questions about fractions.”',
        '“Tell me the exact answer to my worksheet.”',
        '“Help me understand what I got wrong.”',
        '“Summarize this paragraph, then quiz me on it.”',
        '“Solve all my homework and I’ll copy it.”',
        '“Give me a simpler example of this equation.”'
      ],
      reflection: [
        'One way AI can help me learn better is...',
        'One way AI could make me weaker if I used it badly is...'
      ]
    },
    miniCheck: [
      'Why can AI be useful for learning?',
      'Why is AI sometimes risky to trust?',
      'What is one sign that an AI answer should be checked?'
    ],
    teachBack: 'Explain to a younger student why AI can be useful but still needs to be checked.'
  },
  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-02.png',
    title: 'Choosing the Right AI Mode',
    bigIdea: [
      'Different problems need different kinds of help.',
      'If you use the wrong mode, learning gets slower, messier, and more frustrating. If you use the right mode, learning gets faster and clearer.',
      'In PlayIQ, your AI is not just answering you. It is also learning how to teach you better.',
      'That means the way you respond, the kinds of prompts you use, and the modes you choose all help shape your AI into a better coach for your brain.'
    ],
    sections: [
      {
        title: 'The 6 Modes',
        content: [
          '1. Explain Mode: Use this when learning something new, wanting a simpler explanation, or wanting something taught in your specific style.',
          '2. Hint Mode: Use this when you already started a problem, want a clue (not the answer), and want to keep your brain doing the work.',
          '3. Quiz Mode: Use this when testing memory or checking if you really understand before a test.',
          '4. Coach Mode: Use this when you need a plan, feel overwhelmed, or want structure to your studying time.',
          '5. Learn Your Way Mode: Use this when explanations are not clicking and you want the AI to learn how your brain works.',
          '6. Lesson Rescue Mode: Use this when a whole paragraph/note is confusing and you need help finding exactly where you got lost.'
        ]
      }
    ],
    activity: {
      title: 'Pick the Best Mode',
      instructions: [
        'Now that you know the six modes, you’re going to practice using them.',
        'Choose the best mode for each situation below. Make sure to specify the exact mode.'
      ],
      scenarios: [
        'You want to understand a confusing paragraph from biology.',
        'You already tried a math problem and want a clue.',
        'You want to test whether you remember yesterday’s lesson.',
        'You need a study plan for an exam next week.',
        'You pasted your notes and want help finding the confusing part.',
        'You want the explanation changed to fit how you learn best.'
      ]
    },
    miniCheck: [
      'When should you use Hint Mode instead of Explain Mode?',
      'When is Lesson Rescue Mode better than Coach Mode?',
      'Why does choosing the right mode matter?'
    ],
    teachBack: 'Teach someone when they should use Hint Mode instead of Explain Mode.'
  },
  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-03.png',
    title: 'Ask Better Questions',
    bigIdea: [
      'The quality of your learning depends on the quality of your questions.',
      'Weak questions lead to weak learning. Better questions lead to better learning.',
      'When you ask better questions, your AI gets better at helping you. It learns your gaps, your thinking, and how to teach you faster.'
    ],
    sections: [
      {
        title: 'Weak question vs strong question',
        content: [
          'Weak question: "What’s the answer?" (That pushes AI to think for you)',
          'Better questions: "Can you explain this simply?" "Give me a hint instead of the answer." "What do students usually misunderstand here?"'
        ]
      },
      {
        title: 'The Question Ladder',
        content: [
          'Step 1: What is this?',
          'Step 2: Why does it work this way?',
          'Step 3: Can you explain it more simply?',
          'Step 4: Can you show me an example?',
          'Step 5: Can you test me on it?',
          'Step 6: Can you ask me questions that will help me learn this faster?'
        ]
      }
    ],
    activity: {
      title: 'Upgrade These Weak Prompts',
      instructions: [
        'Rewrite each weak prompt underneath it so it helps you learn instead of shortcutting.',
        'After that, write 3 strong prompts for something you’re currently learning in school.'
      ],
      scenarios: [
        '“What’s the answer?”',
        '“Do this for me.”',
        '“Write my paragraph.”',
        '“Solve this worksheet.”',
        '“Tell me what to put.”'
      ]
    },
    miniCheck: [
      'Why are better questions important?',
      'What is the difference between a shortcut prompt and a coaching prompt?',
      'What kind of prompt would you use if you wanted a simpler explanation and then a test?'
    ],
    teachBack: 'Why do better questions lead to better learning?'
  },
  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-04.png',
    title: 'Verify Before You Believe',
    bigIdea: [
      'Verifying is not extra work. Verifying is learning.',
      'If you check whether something is true, compare it, question it, and make sure it makes sense, you are building real understanding.',
      'AI can sound smarter than it actually is, and produce answers that sound polished but are not truly correct.',
      'The permanent PlayIQ rule: Verify before you believe.'
    ],
    sections: [
      {
        title: 'The PlayIQ Verification Ritual',
        content: [
          '1. Does this make sense? (Do I understand it, or does it just sound smart?)',
          '2. Can I explain it myself? (If I cannot explain it, I probably do not own it yet.)',
          '3. Can I cross-check it? (Can I compare it with class notes or a trusted source?)',
          '4. Is anything missing or suspicious? (Does it feel too confident, vague, or incomplete?)'
        ]
      },
      {
        title: 'AI voice vs your voice',
        content: [
          'AI often writes in a polished, robotic, generic style.',
          'If you use AI to understand something, then write it using your own brain, your answer sounds natural, human, and like you actually own the material.'
        ]
      }
    ],
    activity: {
      title: 'Spot the Problem',
      instructions: [
        'Read each answer and decide: Looks good, Needs checking, or Wrong.',
        'Then provide a full sentence explaining why.'
      ],
      scenarios: [
        '“Photosynthesis is how plants make food using sunlight.”',
        '“The Civil War ended in 1992.”',
        '“A metaphor compares two things without using ‘like’ or ‘as.’”',
        '“Fractions are always smaller than whole numbers.”',
        '“The Earth has one moon.”'
      ],
      reflection: [
        'Take one real school concept and run the verification ritual on it. Write 2-4 sentences showing how you checked it.'
      ]
    },
    miniCheck: [
      'Why is verifying part of learning?',
      'What are the 4 steps of the PlayIQ Verification Ritual?',
      'Why can copying AI language make your work weaker instead of stronger?',
      'What is the difference between using AI to learn faster and using AI to cheat yourself?'
    ],
    teachBack: 'What does "verify before you believe" mean in school?'
  }
};
