import type { NodeContent } from './module1Content';

export const module5Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    title: 'The 3-Ways Rule',
    bigIdea: [
      'A strong learner can explain one idea in more than one way.',
      'The 3-Ways Rule means you can ask for: 1. an analogy, 2. step-by-step, 3. example-first.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Act as my PlayIQ learning coach. Teach [topic] in three ways: analogy, step-by-step, and example-first. Keep each one short. After each version, ask me to rate how helpful it was from 1 to 5."',
        ],
      },
    ],
    activity: {
      title: '3-Ways Scorecard',
      instructions: [
        'Choose a topic that still feels hard.',
        'Use AI to teach it 3 ways and rate each one.',
      ],
      scenarios: [
        'Topic:',
        'Analogy version rating (1-5) & what helped/did not help:',
        'Step-by-step version rating (1-5) & what helped/did not help:',
        'Example-first version rating (1-5) & what helped/did not help:',
      ],
      reflection: [
        'The strongest explanation style for me was:',
        'Why:',
      ],
    },
    miniCheck: [
      'Which explanation style helped most?',
      'Which style helped least?',
      'What does this tell your future Learning Supercharger?',
    ],
    teachBack:
      'Explain a single concept in two different ways (e.g., as an analogy and as a step-by-step process).',
  },

  '2': {
    id: '2',
    title: 'Safe Simplification',
    bigIdea: [
      'A simple explanation is useful only if it stays accurate.',
      'Bad compression makes the idea sound easy but wrong.',
      'Good compression makes the idea clear and still true.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Simplify [topic] for me, but do not make it inaccurate. Give me one too-simple version, one better simple version, and one warning about what students often oversimplify."',
        ],
      },
    ],
    activity: {
      title: 'Safe Simplification Check',
      instructions: [
        'Use AI to see the difference between a bad simplification and a good one.',
      ],
      scenarios: [
        'Too-simple version:',
        'Why it is risky or incomplete:',
        'Better simple version:',
        'Why it is clearer:',
      ],
      reflection: [
        'Warning about oversimplifying:',
        'My final accurate simple explanation:',
      ],
    },
    miniCheck: [
      'What is the danger of oversimplifying?',
      'What did your too-simple version leave out?',
      'What is your best accurate simple explanation?',
    ],
    teachBack:
      'Explain the difference between simplifying something so it is clear, versus oversimplifying it so it becomes wrong.',
  },

  '3': {
    id: '3',
    title: 'Build a 1-Page Understanding Card',
    bigIdea: [
      'A 1-Page Understanding Card is a small study asset that captures the most useful version of a topic.',
      'It is not a giant note sheet. It is a clear page you can review fast.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Help me build a 1-Page Understanding Card for [topic]. Ask me for my own answer in each section before improving it. Do not write the whole card for me without my input."',
        ],
      },
    ],
    activity: {
      title: '1-Page Card Elements',
      instructions: [
        'Build your card by providing the core idea, simple explanation, analogy, and common mistakes.',
      ],
      scenarios: [
        'Subject & Topic:',
        'Core idea & Best simple explanation:',
        'Best analogy or example:',
        'Key words (list 3):',
      ],
      reflection: [
        'Common mistake and how to avoid it:',
        'One sentence teach-back:',
      ],
    },
    miniCheck: [
      'What belongs on a 1-Page Understanding Card?',
      'What should not be included?',
      'How could this help before a quiz?',
    ],
    teachBack:
      'Explain how having a 1-Page Understanding Card is better than having five pages of copied notes.',
  },

  '4': {
    id: '4',
    title: 'Practice Without Spoon-Feeding',
    bigIdea: [
      'Practice is where understanding becomes skill.',
      'But practice only works if AI does not give away the answer too fast.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Give me 5 practice questions on [topic], one at a time. Do not give the answer until I try. If I get stuck, give a hint instead of solving. After each answer, tell me what I did well and what to fix."',
        ],
      },
    ],
    activity: {
      title: 'Practice Tracker',
      instructions: [
        'Answer the 5 questions AI provides and track your results.',
      ],
      scenarios: [
        'Question 1 & 2 results:',
        'Question 3 & 4 results:',
        'Question 5 result:',
        'Score: __ / 5',
      ],
      reflection: [
        'Most common mistake:',
        'Best hint AI gave me:',
        'What I need to review next:',
      ],
    },
    miniCheck: [
      'Why should AI not solve too fast?',
      'What was your most common mistake?',
      'What kind of hint helped most?',
    ],
    teachBack:
      'Explain why it is important to force AI to give hints instead of giving you the final answer when practicing.',
  },
};
