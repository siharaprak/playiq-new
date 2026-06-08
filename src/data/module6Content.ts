import type { NodeContent } from './module1Content';

export const module6Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-22.png',
    title: 'Why Rereading Fails',
    bigIdea: [
      'Rereading can help a little, but it often tricks you.',
      'You recognize the answer when you see it, but you may not be able to produce it yourself.',
      'Retrieval practice means pulling the answer from your brain. That is stronger.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Explain why rereading can feel helpful but still fail. Then help me create a quick retrieval practice test for [topic]. Do not give answers until I try."',
        ],
      },
    ],
    activity: {
      title: 'Rereading vs Retrieval',
      instructions: [
        'Think about something you recently studied by just reading over it.',
      ],
      scenarios: [
        'Write one thing you reread recently:',
        'Did it feel familiar? (yes or no)',
        'Could you explain it without looking? (yes or no)',
      ],
      reflection: [
        'What does that show you about rereading versus retrieving?',
      ],
    },
    miniCheck: [
      'Why can rereading trick students?',
      'What is retrieval practice?',
      'Why is retrieval stronger than recognition?',
    ],
    teachBack:
      'Explain to a friend why reading a textbook chapter three times is less effective than taking a blank piece of paper and trying to write out what you remember.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-23.png',
    title: 'Retrieval Practice System',
    bigIdea: [
      'A good self-test is not random.',
      'It should include: easy recall, meaning, examples, application, and mistake correction.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Create a 6-question retrieval practice test for [topic]. Include 2 easy recall questions, 2 understanding questions, 1 example question, and 1 application question. Ask me one question at a time. Do not reveal answers until I try."',
        ],
      },
    ],
    activity: {
      title: 'Retrieval Tracker',
      instructions: [
        'Take the 6-question test and track your results.',
      ],
      scenarios: [
        'Question 1 & 2 results:',
        'Question 3 & 4 results:',
        'Question 5 & 6 results:',
        'Score: __ / 6',
      ],
      reflection: [
        'Strongest question type:',
        'Weakest question type:',
        'What I need to practice next:',
      ],
    },
    miniCheck: [
      'Which question type was easiest?',
      'Which question type was hardest?',
      'What does that tell you?',
    ],
    teachBack:
      'Explain the difference between an easy recall question and an application question.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-24.png',
    title: 'Mistake Bank Patterns',
    bigIdea: [
      'A mistake is data.',
      'The goal is not to feel bad. The goal is to find the pattern.',
      'Mistake Types: Knowledge Gap, Word Gap, Step Error, Careless Error, Transfer Error, Confidence Error.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Help me sort my missed questions into mistake types: knowledge gap, word gap, step error, careless error, transfer error, or confidence error. Ask me why I missed each one before giving your opinion."',
        ],
      },
    ],
    activity: {
      title: 'Mistake Bank Snapshot',
      instructions: [
        'Log up to 3 mistakes you made recently into your Mistake Bank.',
      ],
      scenarios: [
        'Mistake 1 - Question & My answer:',
        'Mistake 1 - Mistake type & Why I missed it:',
        'Mistake 2 - Question & My answer:',
        'Mistake 2 - Mistake type & Why I missed it:',
      ],
      reflection: [
        'What pattern do you notice in your mistakes?',
        'How can you fix this pattern next time?',
      ],
    },
    miniCheck: [
      'What is a Knowledge Gap vs. a Careless Error?',
      'Why is it important to know the type of mistake?',
      'How does a Mistake Bank help you study better?',
    ],
    teachBack:
      'Teach someone else how classifying mistakes (like "Step Error" or "Word Gap") makes studying less frustrating and more effective.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-28.png',
    title: 'Progressive Correction',
    bigIdea: [
      'Mistakes should be corrected progressively, not just reviewed once.',
      'You must prove you can answer the missed question correctly after time has passed.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"I want to review the mistakes from my Mistake Bank. Give me questions similar to the ones I missed, but change the examples or numbers so I cannot just memorize the answer. Ask them one at a time."',
        ],
      },
    ],
    activity: {
      title: 'Correction Loop',
      instructions: [
        'Have AI generate new questions based on your previous mistakes.',
      ],
      scenarios: [
        'Original Mistake 1 Type & New Question AI gave:',
        'Did I get it right this time? (yes or no)',
        'Original Mistake 2 Type & New Question AI gave:',
        'Did I get it right this time? (yes or no)',
      ],
      reflection: [
        'What feels easier now compared to the first time you tested yourself?',
      ],
    },
    miniCheck: [
      'Why should AI change the examples when re-testing you?',
      'Did you improve on your second attempt?',
      'Why is reviewing mistakes a few days later important?',
    ],
    teachBack:
      'Explain the concept of Progressive Correction. Why is it not enough to just look at the right answer and move on?',
  },
};
