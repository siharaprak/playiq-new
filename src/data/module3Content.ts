import type { NodeContent } from './module1Content';

export const module3Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-09.png',
    title: 'Topic Mapping',
    bigIdea: [
      'Do not ask AI to explain everything at once.',
      'That usually creates too much information.',
      'First, ask AI to make a simple map.',
      'A learning map shows the main parts of a topic so your brain knows where to start.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Act as my PlayIQ learning coach. Help me pre-learn [topic] for school. Break it into 5 simple parts. Keep it clear and not overwhelming. Do not do my homework for me. After the map, ask me one question to check what I already understand."',
        ],
      },
      {
        title: 'Activity: Pre-Learn Map',
        content: [
          'Fill in: Topic / Part 1 / Part 2 / Part 3 / Part 4 / Part 5',
          'The part I understand most is:',
          'The part that looks most confusing is:',
          'One question I have is:',
        ],
      },
    ],
    activity: {
      title: 'Pre-Learn Map',
      instructions: [
        'Choose one real school topic you are about to study.',
        'Use AI with the prompt above to generate a 5-part map.',
        'Fill in the activity fields below based on what AI gives you.',
      ],
      scenarios: [
        'Topic I am pre-learning:',
        'Part 1 of the map:',
        'Part 2 of the map:',
        'Part 3 of the map:',
        'Part 4 of the map:',
        'Part 5 of the map:',
      ],
      reflection: [
        'The part I understand most is:',
        'The part that looks most confusing is:',
        'One question I have is:',
      ],
    },
    miniCheck: [
      'Why is a topic map better than asking AI to explain everything at once?',
      'Which part of your map seems easiest?',
      'Which part should you study first?',
    ],
    teachBack:
      'Explain why mapping a topic before diving in makes learning faster. Use an example from your own school subject.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-10.png',
    title: 'First Principles',
    bigIdea: [
      'A first principle is the main truth underneath a topic.',
      'It answers: What is this really about?',
      'If you understand the core idea, details become easier.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Explain the core idea of [topic] in three levels: 1. simple version, 2. normal school version, 3. slightly deeper version. Then ask me which version helped me most."',
        ],
      },
      {
        title: 'The 10-Line Summary Template',
        content: [
          '1. This topic is about...',
          '2. The main idea is...',
          '3. One key word is...',
          '4. Another key word is...',
          '5. A simple example is...',
          '6. This example matters because...',
          '7. One common mistake is...',
          '8. I should remember...',
          '9. I still need to check...',
          '10. My best question for class is...',
        ],
      },
    ],
    activity: {
      title: 'Core Idea Card',
      instructions: [
        'Use the prompt above with AI to get three levels of explanation for your topic.',
        'Rate each level (1-5) and write your own one-sentence explanation.',
      ],
      scenarios: [
        'Topic:',
        'Simple version (and my rating 1-5):',
        'Normal school version (and my rating 1-5):',
        'Deeper version (and my rating 1-5):',
        'The version that helped me most was:',
        'My own one-sentence explanation:',
      ],
      reflection: [
        'Write your 10-Line Summary (all 10 lines in your own words):',
      ],
    },
    miniCheck: [
      'What is the core idea of your topic?',
      'Which explanation level helped you most?',
      'What question would you ask your teacher or AI next?',
    ],
    teachBack:
      'Explain the core idea of your chosen topic to someone who has never heard of it. Use the simplest level that is still accurate.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-11.png',
    title: 'Example-First Learning',
    bigIdea: [
      'Examples help your brain see how the idea works.',
      'A strong pattern is: example first, pattern second, rule third, practice fourth.',
      'A non-example is also useful because it shows what the idea is not.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Give me 2 simple examples of [topic], 1 non-example, and explain why each one matters. Keep the examples school-appropriate and easy to understand. After that, ask me to explain the difference between the example and non-example."',
        ],
      },
      {
        title: 'Example from the PDF',
        content: [
          'Topic: Metaphor',
          'Example 1: "The classroom was a zoo." — compares classroom to a zoo without using like or as.',
          'Example 2: "His voice was thunder." — directly compares voice to thunder.',
          'Non-example: "His voice was like thunder." — uses like, so it is a simile, not a metaphor.',
          'Pattern: A metaphor compares two things directly.',
        ],
      },
    ],
    activity: {
      title: 'Example Stack',
      instructions: [
        'Use AI with the prompt above for your chosen topic.',
        'Record the 2 examples, 1 non-example, and the pattern you noticed.',
      ],
      scenarios: [
        'Topic:',
        'Example 1 and why it fits:',
        'Example 2 and why it fits:',
        'Non-example and why it does NOT fit:',
        'The pattern I notice is:',
      ],
      reflection: [
        'Which example helped most and why?',
        'What did the non-example make clearer?',
      ],
    },
    miniCheck: [
      'Which example helped most?',
      'What did the non-example make clearer?',
      'What pattern did you notice?',
    ],
    teachBack:
      'Teach someone what a non-example is and why using one helps you understand the real idea faster.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-12.png',
    title: 'Self-Test Loop',
    bigIdea: [
      'You do not know something just because it sounds familiar.',
      'You know it when you can answer questions, fix mistakes, explain it in your own words, and use it without copying.',
      'That is why every pre-learn session ends with a self-test.',
    ],
    sections: [
      {
        title: 'Prompt to Use',
        content: [
          '"Quiz me on [topic] one question at a time. Start easy, then make it a little harder. Do not give me the answer until I try. If I get one wrong, explain the mistake simply and ask a follow-up question."',
        ],
      },
      {
        title: 'Learning Supercharger Note',
        content: [
          'When your future AI tutor helps with this topic, it should remember:',
          '- Explanation style that helped most',
          '- The part that was most confusing',
          '- The mistake you made',
          '- Best practice style',
          '- One thing to quiz you on next',
        ],
      },
    ],
    activity: {
      title: '5 Self-Test Questions',
      instructions: [
        'Use the prompt above with AI. Record all 5 questions AI asked you.',
        'Write your answer and whether you got it correct.',
        'Track your score and what you learned from any mistakes.',
      ],
      scenarios: [
        'Question 1 + my answer + correct or not yet:',
        'Question 2 + my answer + correct or not yet:',
        'Question 3 + my answer + correct or not yet:',
        'Question 4 + my answer + correct or not yet:',
        'Question 5 + my answer + correct or not yet:',
      ],
      reflection: [
        'Score: __ / 5. One mistake I made was:',
        'The fix was:',
        'One thing I understand better now is:',
      ],
    },
    miniCheck: [
      'Why should AI wait until you try before giving answers?',
      'What did your self-test reveal?',
      'What should your future Learning Supercharger remember about how you learn?',
    ],
    teachBack:
      'Explain why a self-test is more powerful than rereading. What does testing prove that rereading does not?',
  },
};
