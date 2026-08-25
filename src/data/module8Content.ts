import type { NodeContent } from './module1Content';

export const module8Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-01.png',
    title: 'Clear Writing Makes Thinking Visible',
    bigIdea: [
      'Your mission: use AI as a writing coach without letting it become your writer.',
      'Clear writing is not about sounding smart. It is about making your thinking visible so that someone else \u2014 or your future self \u2014 can follow it.',
      'If AI writes your answer, you cannot explain it, defend it, or learn from it.',
    ],
    sections: [
      {
        title: 'The 30-second voice spark',
        content: [
          'Read these two sentences and pick the one that sounds like a real student wrote it:',
          'A. "The implementation of photosynthetic processes facilitates the conversion of solar radiation into biochemical energy substrates."',
          'B. "Plants use sunlight, water, and CO\u2082 to make sugar \u2014 basically, they cook their own food using light."',
          'Both say roughly the same thing. One sounds human; one sounds like AI trying to sound impressive.',
          'Your voice is the one that sounds like you thought about it, not the one that sounds like a textbook.',
        ],
      },
      {
        title: 'Writing shows your thinking',
        content: [
          'When you write clearly, you discover what you actually understand and what is still fuzzy.',
          'A coaching AI helps you sharpen your thinking. A ghostwriting AI replaces it.',
          'The test: Can you explain and defend what you wrote?',
        ],
      },
      {
        title: 'Outline first',
        content: [
          'The blank page has too many decisions at once: topic, structure, evidence, wording.',
          'An outline reduces those decisions to a sequence:',
          '1. What am I trying to say? (main claim or purpose)',
          '2. What are the 2\u20134 key points?',
          '3. What evidence or example supports each point?',
          '4. What do I want the reader to understand at the end?',
          'Orion can help you check the outline \u2014 but the outline should be yours.',
        ],
      },
    ],
    activity: {
      title: 'Voice Spark & Outline Practice',
      instructions: [
        'Choose which sentence sounds like a real student wrote it.',
        'Create an outline for a short piece of writing using the four-question method.',
      ],
      scenarios: [
        'Sentence A vs Sentence B \u2014 which sounds human?',
        'My main claim or purpose:',
        'My 2\u20134 key points:',
        'Evidence or example for each:',
        'What I want the reader to understand:',
      ],
      reflection: [
        'Why does the human-sounding version communicate better?',
        'Did the outline reduce the difficulty of starting?',
      ],
    },
    miniCheck: [
      'What is the difference between a coaching AI and a ghostwriting AI?',
      'What are the four outline questions?',
      'How can you tell if your writing sounds like you?',
    ],
    teachBack: 'Explain why clear writing makes thinking visible and how an outline helps you start.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-02.png',
    title: 'Ask for Coaching, Not Replacement',
    bigIdea: [
      'The right coaching prompt keeps the writing decisions with you. The wrong prompt lets AI make every choice.',
      'Two types of AI writing help: replacement (AI writes it for you) and coaching (AI helps you improve what you wrote).',
    ],
    sections: [
      {
        title: 'Coaching prompts that preserve your voice',
        content: [
          '"Do not rewrite my paragraph. Identify one unclear idea, ask me one question, and suggest two ways I could improve it myself."',
          '"Which sentence in my paragraph is the weakest? Tell me why without rewriting it."',
          '"Check if my evidence actually supports my claim. If not, ask me what evidence I could add."',
          '"Is my conclusion consistent with my argument? Point out any gap."',
        ],
      },
      {
        title: 'Replacement prompts to avoid',
        content: [
          '"Rewrite this to sound professional." \u2014 erases your voice.',
          '"Make this paragraph better." \u2014 too vague; AI makes every choice.',
          '"Write a conclusion for my essay." \u2014 ghostwriting.',
          '"Fix all my grammar and improve the style." \u2014 might rewrite your thinking.',
        ],
      },
      {
        title: 'Learn what supports your writing today',
        content: [
          'When writing feels hard, what usually helps: talking it out, reading examples, making a list, or taking a break?',
          'What kind of feedback is most useful: grammar, structure, clarity, evidence, or logic?',
          'When have you improved a piece of writing because of specific feedback?',
          'These answers design your tutor\u2019s writing-coach behavior.',
        ],
      },
    ],
    activity: {
      title: 'Coaching vs Replacement Practice',
      instructions: [
        'Write a short paragraph (4\u20136 sentences) about a topic you know.',
        'Test two AI approaches: Round A (replacement prompt) and Round B (coaching prompt).',
        'Compare which version still sounds like you and which you could defend.',
      ],
      scenarios: [
        'Round A: "Rewrite this to sound professional."',
        'Round B: "Do not rewrite. Identify one unclear idea, ask me one question, suggest two improvements."',
        'Which version still sounds like me?',
        'Which result could I explain and defend?',
      ],
      reflection: [
        'Which kind of support helped you improve your writing?',
        'One phrase or idea you chose to revise yourself:',
      ],
    },
    miniCheck: [
      'What is the difference between a coaching prompt and a replacement prompt?',
      'Why does replacement writing make your work weaker?',
      'What kind of writing feedback is most useful for you?',
    ],
    teachBack: 'Explain the difference between coaching and replacement prompts, using examples from your own writing.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-03.png',
    title: 'Writing Voice Evidence & Comparison Lab',
    bigIdea: [
      'Build a small Writing Voice Evidence File that captures how you write naturally \u2014 your word choices, rhythms, and ways of connecting ideas.',
      'Compare replacement writing with coached revision to see which produces writing you actually own.',
    ],
    sections: [
      {
        title: 'Writing Voice Evidence File',
        content: [
          'Collect 3\u20135 short paragraphs you wrote yourself (no AI help).',
          'For each, note: the topic, your natural word choices, sentence patterns, how you connect ideas.',
          'This file helps your future tutor recognize your voice and coach you in your style.',
        ],
      },
      {
        title: 'Active comparison \u2014 replacement vs coached revision',
        content: [
          'Write a short answer to a school-type question.',
          'Round A: Ask AI to rewrite it in a professional voice. Record what changed.',
          'Round B: Ask AI to identify one weak point and suggest how you could improve it. Make the change yourself.',
          'Compare: Which version sounds like you? Which could you explain to a teacher? Which one taught you something about your writing?',
        ],
      },
      {
        title: 'Interpret the evidence',
        content: [
          'Rate each: Voice preserved (1\u20135), Could explain and defend (1\u20135), Learned something about my writing (1\u20135).',
          'Use conditional language: "For this type of writing, coaching helped me ___, while replacement ___."',
        ],
      },
    ],
    activity: {
      title: 'Voice Evidence & Comparison',
      instructions: [
        'Build your Writing Voice Evidence File with 3\u20135 original paragraphs.',
        'Run the replacement vs coaching comparison on one paragraph.',
        'Rate both approaches and write your interpretation.',
      ],
      scenarios: [
        'Original paragraph:',
        'Round A: AI rewrite \u2014 what changed?',
        'Round B: AI coaching \u2014 what did you improve?',
        'Voice preserved rating for each',
      ],
      reflection: [
        'Which approach taught you more about your writing?',
        'What did you choose to revise yourself?',
      ],
    },
    miniCheck: [
      'What goes in a Writing Voice Evidence File?',
      'What was the difference between replacement and coaching results?',
      'Which approach preserved your voice?',
    ],
    teachBack: 'Present your Writing Voice Evidence File and explain what you learned from the replacement vs coaching comparison.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-04.png',
    title: 'Blueprint, Proof & Writing Ownership Mastery',
    bigIdea: [
      'Your Blueprint writing-coach setting tells your future tutor how to help you write better without writing for you.',
    ],
    sections: [
      {
        title: 'Learning Supercharger Blueprint update',
        content: [
          'writing-coach-mode = [identify-weakness | ask-questions | suggest-structure | check-evidence | not-yet-known]',
          'voice-protection = "Never rewrite my sentences. Coach me to improve them myself."',
          'evidence = your comparison result',
          'Rule: "When I ask for writing help, ___ first. Never rewrite my work. Ask me to make the change."',
        ],
      },
      {
        title: 'Knowledge File update',
        content: [
          'rule_id: module_8_writing_coach',
          'module: 8',
          'skill_tested: writing_coaching_vs_replacement',
          'source_activity: replacement_vs_coached_revision_comparison',
          'proposed_writing_coach_mode: [mode or not_yet_known]',
          'voice_protection_rule: true',
          'evidence: voice/defense/learning ratings',
          'confidence: [low|medium|high]',
          'privacy: safe_for_tutor_project',
        ],
      },
      {
        title: 'Proof artifact \u2014 Writing Ownership Test Card',
        content: [
          'Topic written about:',
          'Writing approach compared: replacement vs coaching',
          'Voice preserved: (rating)',
          'Could explain and defend: (rating)',
          'Coaching mode proposed:',
          'Voice protection rule:',
          'Writing Voice Evidence File started: yes/no',
          'Orion rules staged: writing-coach-mode / voice-protection',
        ],
      },
    ],
    activity: {
      title: 'Mastery Challenge \u2014 Upgrade and Keep Your Voice',
      instructions: [
        'Choose a real writing task from schoolwork.',
        '1. Write your first draft without AI.',
        '2. Ask Orion to identify one weakness using coaching mode.',
        '3. Improve the weakness yourself.',
        '4. Verify: Can you explain every sentence? Does it sound like you?',
        '5. Complete the Writing Ownership Test Card.',
      ],
      scenarios: [
        'My first draft is my own work.',
        'Orion identified a weakness without rewriting.',
        'I improved the weakness myself.',
        'I can explain and defend every sentence.',
        'The writing sounds like me.',
      ],
      reflection: [
        'What weakness did Orion identify?',
        'How did you improve it?',
        'Does the final version sound like you wrote it?',
      ],
    },
    miniCheck: [
      'What is your writing-coach-mode setting?',
      'What is your voice-protection rule?',
      'Can you explain and defend every sentence in your mastery challenge?',
    ],
    teachBack: 'Present your upgraded writing and explain how you improved it while keeping your voice.',
  },
};
