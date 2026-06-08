import type { NodeContent } from './module1Content';

export const module8Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-30.png',
    title: 'Claim, Evidence, Reasoning',
    bigIdea: [
      'Strong school answers often need three parts: Claim, Evidence, and Reasoning (CER).',
      'Claim: What you think or answer.',
      'Evidence: What supports it.',
      'Reasoning: Why the evidence proves the claim.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Act as my writing coach. Help me identify the claim, evidence, and reasoning in my answer. Do not rewrite it for me. Ask me questions if a part is missing."',
        ],
      },
    ],
    activity: {
      title: 'Answer Blueprint',
      instructions: [
        'Take a rough school answer and use AI to break it down into CER.',
      ],
      scenarios: [
        'Question or prompt:',
        'My claim & My evidence:',
        'My reasoning & Missing part:',
      ],
      reflection: [
        'Question AI asked me:',
        'My improved idea:',
      ],
    },
    miniCheck: [
      'What is a claim?',
      'What is evidence?',
      'What is reasoning?',
    ],
    teachBack:
      'Explain how using Claim, Evidence, Reasoning (CER) makes your writing stronger than just giving an opinion.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-31.png',
    title: 'Outline First',
    bigIdea: [
      'Outlining prevents messy writing.',
      'A short outline can save a lot of time.',
      'The outline should guide your answer, not replace your thinking.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Help me make a simple outline for my answer. Ask me for my claim first. Then ask me what evidence I want to use. Do not write the final paragraph."',
        ],
      },
    ],
    activity: {
      title: 'Outline Builder',
      instructions: [
        'Work with AI to build a simple outline for your answer.',
      ],
      scenarios: [
        'Claim:',
        'Evidence 1 & Evidence 2:',
        'Reasoning & Closing thought:',
      ],
      reflection: [
        'What I still need to check:',
      ],
    },
    miniCheck: [
      'Why outline before drafting?',
      'What part of your outline is strongest?',
      'What part needs more work?',
    ],
    teachBack:
      'Explain to a friend why spending 5 minutes on an outline saves 30 minutes of getting stuck while writing.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-32.png',
    title: 'Feedback Prompt System',
    bigIdea: [
      'Good AI feedback is specific. Bad feedback just says "Make this better."',
      'Good feedback asks for clarity, logic, structure, missing evidence, confusing sentences, and teacher expectations.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Act as my writing coach. Review my answer for clarity, logic, structure, and missing evidence. Do not rewrite it. Give me 3 specific suggestions and ask me which one I want to fix first."',
        ],
      },
    ],
    activity: {
      title: 'Feedback Tracker',
      instructions: [
        'Paste your draft and use the feedback prompt to get 3 suggestions.',
      ],
      scenarios: [
        'My answer:',
        'AI suggestion 1, 2, 3:',
        'Suggestion I chose first:',
      ],
      reflection: [
        'My revision & Why I changed it:',
      ],
    },
    miniCheck: [
      'Why is specific feedback better?',
      'Which suggestion helped most?',
      'How did you stay the writer?',
    ],
    teachBack:
      'Teach someone how to ask AI for specific feedback on their writing instead of asking AI to "fix it."',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-34.png',
    title: 'Revision Loop',
    bigIdea: [
      'Revision means improving your own work. It does not mean letting AI replace your voice.',
      'A strong revision keeps your meaning but makes it clearer.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"I will revise my own answer. After I revise, compare my first version and revised version. Tell me what improved, what still needs work, and whether it still sounds like me."',
        ],
      },
    ],
    activity: {
      title: 'Before and After Revision Sample',
      instructions: [
        'Revise your answer using the feedback, then have AI check your revision.',
      ],
      scenarios: [
        'Original answer & Feedback I used:',
        'Revised answer:',
        'What improved & What still needs work:',
      ],
      reflection: [
        'One sentence I am proud of:',
      ],
    },
    miniCheck: [
      'What changed between your first and revised version?',
      'Does it still sound like you?',
      'What writing habit do you want to keep?',
    ],
    teachBack:
      'Explain the difference between revising your own work with AI coaching, versus letting AI ghostwrite the answer for you.',
  },
};
