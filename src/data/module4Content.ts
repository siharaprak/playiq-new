import type { NodeContent } from './module1Content';

export const module4Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    title: 'Paste, Chunk, Scan',
    bigIdea: [
      'Confusing material feels harder when it is all smashed together.',
      'Chunking makes it easier to handle.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Act as my PlayIQ Lesson Rescue coach. I am going to paste a confusing school section. Do not do my work for me. Break it into 3 to 6 simple chunks. Give each chunk a short label. Then ask me to rate my understanding of each chunk from 1 to 5."',
        ],
      },
    ],
    activity: {
      title: 'Chunk Scan Table',
      instructions: [
        'Choose one confusing school section (paragraph, slide, notes section).',
        'Use AI with the prompt to chunk it.',
        'Rate your understanding for each chunk.',
      ],
      scenarios: [
        'Subject & Topic:',
        'Chunk A label and score (1-5):',
        'Chunk B label and score (1-5):',
        'Chunk C label and score (1-5):',
      ],
      reflection: [
        'The chunk I understand best is:',
        'The chunk I understand least is:',
        'One word or phrase that feels confusing is:',
      ],
    },
    miniCheck: [
      'Why is chunking better than asking AI to explain everything at once?',
      'Which chunk was hardest?',
      'What did your understanding score help you notice?',
    ],
    teachBack:
      'Explain how breaking a large confusing text into smaller chunks helps your brain process it better.',
  },

  '2': {
    id: '2',
    title: 'Identify Gap Type',
    bigIdea: [
      'Not all confusion is the same.',
      'If you know the type of confusion, you can fix it faster.',
      'Gap types: Word Gap, Background Gap, Step Gap, Connection Gap, Overload Gap, Expectation Gap.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Based on my chunk ratings, ask me 3 short questions to figure out my main gap type. Do not give me the full explanation yet. Help me identify whether this is a word gap, background gap, step gap, connection gap, overload gap, or expectation gap."',
        ],
      },
    ],
    activity: {
      title: 'Gap Diagnosis Card',
      instructions: [
        'Use AI to diagnose the type of gap for your hardest chunk.',
        'Record the gap type and what showed you that.',
      ],
      scenarios: [
        'Hardest chunk:',
        'My main gap type is:',
        'I know this because:',
        'One clue that showed the gap was:',
      ],
      reflection: [
        'The best next move is:',
      ],
    },
    miniCheck: [
      'What was your main gap type?',
      'How did you figure it out?',
      'Why is it useful to know the type of confusion?',
    ],
    teachBack:
      'Explain the difference between a Word Gap and an Overload Gap to someone else.',
  },

  '3': {
    id: '3',
    title: 'Remediate in Personal Style',
    bigIdea: [
      'Once you find the gap, do not reteach everything.',
      'Teach only the missing piece.',
      'That is faster and less overwhelming.',
    ],
    sections: [
      {
        title: 'Choose a Repair Style',
        content: [
          'Pick one: simple explanation, step-by-step explanation, example-first explanation, analogy, quick diagram-style explanation, quiz me through it.',
        ],
      },
      {
        title: 'Prompt to Use',
        content: [
          '"Teach only the missing piece from this chunk: [chunk]. My gap type is: [gap type]. Use this style: [repair style]. Keep it short. Give me one example. Then ask me one check question before moving on."',
        ],
      },
    ],
    activity: {
      title: 'Repair Card',
      instructions: [
        'Choose a repair style and use AI to fix the specific gap.',
        'Record the missing piece and answer the check question.',
      ],
      scenarios: [
        'Chunk I repaired & Gap type:',
        'Repair style I chose:',
        'The missing piece was:',
        'The example that helped me was:',
        'The check question AI asked me was:',
      ],
      reflection: [
        'My answer was:',
        'Did I get it right? (yes or not yet)',
      ],
    },
    miniCheck: [
      'What repair style helped most?',
      'What was the missing piece?',
      'What sentence makes more sense now?',
    ],
    teachBack:
      'Explain why you should only repair the missing piece instead of reteaching the whole chapter.',
  },

  '4': {
    id: '4',
    title: 'Adaptive Questioning Loop',
    bigIdea: [
      'You do not prove understanding by nodding.',
      'You prove it by answering questions.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Ask me 4 questions about this rescued chunk, one at a time. Start easy, then make them slightly harder. Do not give me the answer before I try. If I get one wrong, diagnose why I missed it and give me a smaller hint."',
        ],
      },
    ],
    activity: {
      title: 'Rescue Loop Tracker',
      instructions: [
        'Answer 4 questions from AI about your rescued chunk.',
        'Track your results and what you learned from any mistakes.',
      ],
      scenarios: [
        'Question 1 result (correct or not yet) and what I learned:',
        'Question 2 result (correct or not yet) and what I learned:',
        'Question 3 result (correct or not yet) and what I learned:',
        'Question 4 result (correct or not yet) and what I learned:',
      ],
      reflection: [
        'Score: __ / 4',
        'One mistake I made and the fix was:',
        'One thing I understand better now is:',
      ],
    },
    miniCheck: [
      'Why should AI ask one question at a time?',
      'What did your mistake show you?',
      'How did the loop improve your understanding?',
    ],
    teachBack:
      'Explain why proving understanding through questions is better than just saying "I get it now."',
  },

  '5': {
    id: '5',
    title: 'Teach-Back Unlock',
    bigIdea: [
      'You do not own the idea until you can explain it in your own words.',
      'A teach-back proves: I understand this now.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"I am going to explain this rescued chunk in my own words. After I explain it, score my teach-back from 1 to 5 using this checklist: clear main idea, correct key terms, good example, not copied from AI, no major confusion left. Then give me one improvement suggestion."',
        ],
      },
    ],
    activity: {
      title: 'Teach-Back Record',
      instructions: [
        'Write 5 to 7 sentences explaining the rescued chunk.',
        'Get feedback from AI and record your improved sentence.',
      ],
      scenarios: [
        'This lesson section is about... The most important idea is...',
        'One key word is... An example is...',
        'The part that confused me before was... Now I understand that...',
      ],
      reflection: [
        'AI Teach-back score: __ / 5',
        'One thing I did well and one thing I need to improve:',
        'My final improved sentence:',
      ],
    },
    miniCheck: [
      'Why is teach-back required before mastery?',
      'What changed from the start to now?',
      'What should your future Learning Supercharger remember?',
    ],
    teachBack:
      'Teach someone the process of rescuing a confusing lesson step-by-step from chunking to teach-back.',
  },
};
