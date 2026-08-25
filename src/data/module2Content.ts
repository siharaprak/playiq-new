import type { NodeContent } from './module1Content';

export const module2Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-05.png',
    title: 'The Power Tool Principle',
    bigIdea: [
      'AI can multiply what you already do. If you use it to ask better questions, practice, and verify, it can accelerate learning. If you use it to avoid every hard moment, it can accelerate dependence.',
      'Power is not cheating. Power is knowing how to stay in control.',
      'The real learning advantage is not escaping the lesson. It is learning the lesson sooner, in a format that helps you understand it.',
    ],
    sections: [
      {
        title: 'Lightning Hook \u2014 Stronger or weaker?',
        content: [
          'Which option makes the student stronger?',
          'A. "Write my answer so I can submit it."',
          'B. "Explain the idea simply, then quiz me so I can write my own answer."',
          'The stronger choice is B because the fastest-looking choice is not always the fastest way to become capable.',
        ],
      },
      {
        title: 'AI multiplies the direction you give it',
        content: [
          'A calculator can help someone check arithmetic or help someone avoid learning the arithmetic. The tool is the same; the purpose and behavior are different.',
        ],
      },
      {
        title: 'Coach use',
        content: [
          'Explains an idea in another way',
          'Asks questions',
          'Gives a hint after your attempt',
          'Helps organize your plan',
          'Checks reasoning you created',
          'Quizzes you and helps repair mistakes',
        ],
      },
      {
        title: 'Crutch use',
        content: [
          'Produces work you submit as your own',
          'Replaces every difficult thought',
          'Hides what you do not understand',
          'Makes decisions you should make',
          'Encourages you to trust polished language without checking',
        ],
      },
      {
        title: 'Gray-zone use',
        content: [
          'Some uses depend on the teacher\u2019s rules. Brainstorming, outlining, grammar feedback, translation, and citation help may be allowed in one class and restricted in another.',
          'If the rule is unclear, pause and ask.',
        ],
      },
    ],
    activity: {
      title: 'Coach, Crutch, or Gray Zone?',
      instructions: [
        'Label each situation as Coach, Crutch, or Gray zone.',
        'For any gray-zone answer, write what rule you would need to check.',
      ],
      scenarios: [
        '"Give me one hint after I show my attempt."',
        '"Write my conclusion in my voice."',
        '"Help me brainstorm five research questions."',
        '"Quiz me on the notes I wrote."',
        '"Rewrite this whole assignment so it sounds smarter."',
      ],
      reflection: [
        'For any gray-zone answer, what rule would you need to check?',
      ],
    },
    miniCheck: [
      'What is the Power Tool Principle?',
      'Name two examples of coach use.',
      'Name two examples of crutch use.',
    ],
    teachBack: 'Explain the Power Tool Principle to someone who has never used AI for school.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-06.png',
    title: 'Know the Policy Before Using the Power',
    bigIdea: [
      'There is no single school AI rule. A teacher might allow brainstorming but not generated sentences. Another might allow AI only when the student discloses how it was used.',
      'Before using AI on school work, you must know the rules for that specific assignment.',
    ],
    sections: [
      {
        title: 'The Policy Check',
        content: [
          '1. Is AI allowed on this assignment?',
          '2. Which uses are allowed?',
          '3. What work must be completely mine?',
          '4. Must I disclose or cite AI help?',
          '5. What should I do if the instructions are unclear?',
        ],
      },
      {
        title: 'Practice policy',
        content: [
          'Imagine this class rule: "AI may be used for brainstorming, outlining, and feedback. It may not create sentences that appear in the submitted assignment. Students must note how AI was used."',
          'You must determine: Is each use allowed or not allowed under this rule?',
        ],
      },
    ],
    activity: {
      title: 'Policy Application Practice',
      instructions: [
        'Using the practice policy above, label each action as Allowed or Not Allowed.',
        'Then write a disclosure sentence explaining how AI was used.',
      ],
      scenarios: [
        'Ask for possible research questions.',
        'Ask AI to write the introduction.',
        'Ask for feedback on whether your outline is logical.',
        'Copy an AI sentence and change three words.',
        'Write the paragraph yourself, then ask which point is unclear.',
      ],
      reflection: [
        'Write a disclosure sentence: "I used AI to ___. I wrote and verified ___."',
      ],
    },
    miniCheck: [
      'What are the five Policy Check questions?',
      'Why is copying an AI sentence and changing words still risky?',
      'What should you do if the AI rules for an assignment are unclear?',
    ],
    teachBack: 'Explain why you should check the policy before using AI on any school assignment.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-07.png',
    title: 'Keep Your Own Voice',
    bigIdea: [
      'Your voice includes your word choices, examples, opinions, rhythm, humour, and way of connecting ideas. A polished AI rewrite can erase those things and may leave you unable to explain what you submitted.',
      'Your strongest protection is an honest process: keep your notes and drafts, follow the policy, use coaching rather than ghostwriting, and be able to explain your work.',
    ],
    sections: [
      {
        title: 'AI detection is not proof',
        content: [
          'Automated AI-detection tools can also make mistakes. Do not treat a detector score as proof of authorship.',
          'The real proof of ownership is being able to explain and defend your work.',
        ],
      },
      {
        title: 'Voice experiment',
        content: [
          'Write a short paragraph of four to six sentences about a topic you know.',
          'Round A \u2014 Rewrite request: "Rewrite this to sound professional."',
          'Round B \u2014 Coaching request: "Do not rewrite my paragraph. Identify one unclear idea, ask me one question, and suggest two ways I could improve it myself."',
          'Compare: Which version still sounds like you? Which could you explain and defend? Which kind of support helped you improve?',
        ],
      },
    ],
    activity: {
      title: 'Voice Preservation Exercise',
      instructions: [
        'Write your original paragraph, then test both AI help approaches.',
        'Compare the results and reflect on which preserved your voice.',
      ],
      scenarios: [
        'Which version still sounds like me?',
        'Which result could I explain and defend?',
        'Which kind of support helped me improve?',
        'One phrase or idea I chose to revise myself:',
      ],
      reflection: [
        'Why is coaching support better than rewrite support for protecting your voice?',
      ],
    },
    miniCheck: [
      'What makes your voice different from AI-generated writing?',
      'Why is coaching better than ghostwriting for school work?',
      'What is the strongest evidence of writing ownership?',
    ],
    teachBack: 'Explain why a coaching request protects your voice better than a rewrite request.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-08.png',
    title: 'Truth Filter and Pause Before Share',
    bigIdea: [
      'AI can generate convincing mistakes, incomplete summaries, fake images, and confident claims.',
      'Popularity, confidence, and professional-looking design are not proof.',
    ],
    sections: [
      {
        title: 'The PlayIQ Truth Filter',
        content: [
          '1. What exactly is the claim?',
          '2. What evidence is provided?',
          '3. Can I compare it with a trusted source?',
          '4. Is important context missing?',
          '5. What could happen if I am wrong?',
        ],
      },
      {
        title: 'Pause Before Share',
        content: [
          'Before posting or forwarding surprising content, ask:',
          'Is it true?',
          'Is it respectful?',
          'Could it hurt someone if it is false?',
          'Do I have permission to share it?',
        ],
      },
    ],
    activity: {
      title: 'Truth Check & Sharing Ethics',
      instructions: [
        'Apply the Truth Filter to the practice claim.',
        'Then decide the safest action for the sharing scenario.',
      ],
      scenarios: [
        'Claim: "The Moon produces its own visible light." \u2014 Is it believable, doubtful, or unsure?',
        'How could you check this claim?',
        'Scenario: A friend sends an embarrassing AI-generated image of a classmate and says "Post this \u2014 it will be hilarious." What is the safest next action?',
      ],
      reflection: [
        'Why might sharing false AI content hurt someone even if you thought it was funny?',
      ],
    },
    miniCheck: [
      'What are the five Truth Filter questions?',
      'What are the four Pause Before Share questions?',
      'Why should you check before sharing AI-generated content?',
    ],
    teachBack: 'Explain the Truth Filter to a friend and show them how to use it on a real claim.',
  },

  '5': {
    id: '5',
    imageUrl: '/images/modules/bright-mixed-playiq-09.png',
    title: 'Focus Without Overwhelm Lab',
    bigIdea: [
      'This is not a test of willpower. You are testing how long a focused work block currently helps before the quality of attention drops.',
      'One day is not enough to define your ideal focus length. This is a starting signal that should be tested again.',
    ],
    sections: [
      {
        title: 'The focus block experiment',
        content: [
          'Choose one normal learning task. Use the same kind of task for each test when possible. Put your phone away or silence notifications.',
          'Focus Block A \u2014 5 minutes: Rate focus quality (/5), work completed, urge to switch tasks (/5).',
          'Focus Block B \u2014 10 minutes: Same ratings. Take a short reset.',
          'Focus Block C \u2014 15 minutes: Same ratings.',
        ],
      },
      {
        title: 'Reflection questions',
        content: [
          'During which block did I make the best progress?',
          'When did my attention begin to wander?',
          'Was the problem the length, the difficulty, the environment, or something else?',
          'What reset helped me return: movement, water, breathing, quiet, or another choice?',
          'What block length should Orion test with me next time?',
        ],
      },
    ],
    activity: {
      title: 'Focus Block Experiment',
      instructions: [
        'Run all three focus blocks (5, 10, 15 minutes) with the same type of task.',
        'Record your focus quality, work completed, and urge to switch for each.',
        'Note what kind of reset helped you refocus.',
      ],
      scenarios: [
        'Focus Block A \u2014 5 minutes',
        'Focus Block B \u2014 10 minutes',
        'Focus Block C \u2014 15 minutes',
      ],
      reflection: [
        'What block length produced the best progress for you?',
        'What reset activity helped you return to focus?',
      ],
    },
    miniCheck: [
      'What was your best focus block length?',
      'What reset helped you return to focus?',
      'Why is this experiment a starting signal, not a permanent label?',
    ],
    teachBack: 'Describe the focus block experiment and what you learned about your attention patterns.',
  },

  '6': {
    id: '6',
    imageUrl: '/images/modules/bright-mixed-playiq-10.png',
    title: 'Blueprint, Proof & Mastery Challenge',
    bigIdea: [
      'Your Learning Supercharger Blueprint tells your future tutor how long to make the first work block before checking in. It is not a diagnosis and does not mean you can never focus longer.',
      'Your integrity rule confirms: the student owns the final work.',
    ],
    sections: [
      {
        title: 'Learning Supercharger Blueprint update',
        content: [
          'focus-block = ___ minutes: Orion suggests this first sprint length, gives one clear target, and checks whether to continue, shorten, or extend.',
          'student-owns-final-work = your integrity rule that confirms the final submission is your work.',
          'Evidence supporting these settings comes from your focus block experiment.',
          'Confidence: low | medium | high.',
        ],
      },
      {
        title: 'Knowledge File update \u2014 Focus, Voice, and Responsibility',
        content: [
          'module: 2',
          'record_type: experiment_result',
          'focus_block_to_test_minutes: [5 | 10 | 15 | other]',
          'best_reset: [movement | water | quiet | breathing | other]',
          'voice_support_preference: feedback_not_rewrite',
          'policy_check_required: true',
          'student_owns_final_work: true',
          'evidence: [one-sentence result]',
          'confidence: [low | medium | high]',
          'privacy: safe_for_tutor_project',
        ],
      },
      {
        title: 'Proof artifact \u2014 Digital Power Card',
        content: [
          'One coach use of AI:',
          'One crutch use I will avoid:',
          'Policy question I will ask:',
          'My focus block to test:',
          'How I will protect my voice:',
          'One truth-check method:',
          'Orion rules staged: focus-block / student-owns-final-work',
        ],
      },
    ],
    activity: {
      title: 'Mastery Challenge \u2014 The Highest Path',
      instructions: [
        'Read the policy: "AI is allowed for brainstorming, outlining, and feedback, but not for writing submitted sentences. AI use must be disclosed."',
        'You are preparing an essay about energy conservation.',
        'For each action, write allowed, not allowed, or ask the teacher, and explain why.',
        'Write your disclosure sentence.',
        'Teach back the Power Tool Principle in two sentences.',
      ],
      scenarios: [
        'Ask for five possible research questions.',
        'Ask AI to write the conclusion.',
        'Ask whether your outline is missing a counterargument.',
        'Ask AI to rewrite your paragraph in a more advanced voice.',
        'Ask AI to quiz you so you can write the paragraph yourself.',
      ],
      reflection: [
        'I can check a policy.',
        'I can protect my voice.',
        'I can use the Truth Filter.',
        'I can explain my focus-block setting.',
      ],
    },
    miniCheck: [
      'What is your focus-block setting and why?',
      'What does student-owns-final-work mean?',
      'Teach back the Power Tool Principle in two sentences.',
    ],
    teachBack: 'Teach back the Power Tool Principle in two sentences, showing that you understand the difference between using power to become stronger versus using it to avoid effort.',
  },
};
