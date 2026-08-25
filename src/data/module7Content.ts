import type { NodeContent } from './module1Content';

export const module7Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-01.png',
    title: 'What a Knowledge File Really Is',
    bigIdea: [
      'Your mission: turn scattered notes into a tutor-ready Study Pack.',
      'A Knowledge File is not a homework dump. It is structured information that your future AI tutor can read, understand, and use to help you more accurately.',
      'The difference between messy notes and a clean file is the difference between handing a tutor a random pile of paper and handing them an organized brief.',
    ],
    sections: [
      {
        title: 'The 30-second clean-file challenge',
        content: [
          'Imagine you have 30 seconds to hand a tutor your notes on a topic. Which would help them help you faster?',
          'A. A photo of your messy notebook page.',
          'B. A structured file with topic, core idea, key terms, examples, mistakes, and questions.',
          'The structured file wins because the tutor can immediately see what you know, what you are confused about, and where to start.',
        ],
      },
      {
        title: 'What makes a file tutor-ready',
        content: [
          'Clear labels: topic, subject, date, source.',
          'Core idea in your own words.',
          'Key terms with short definitions.',
          'Examples and non-examples.',
          'Your mistakes and corrections (from your Mistake Bank).',
          'Questions you still have.',
          'Evidence of what you tried.',
          'Provenance: where each piece of information came from.',
        ],
      },
    ],
    activity: {
      title: 'Identify Tutor-Ready vs Messy Notes',
      instructions: [
        'Look at your current notes for any subject.',
        'Identify which elements are tutor-ready and which are missing.',
        'List what a tutor would need that your notes do not currently provide.',
      ],
      scenarios: [
        'Does the file have clear labels?',
        'Is the core idea stated in your own words?',
        'Are key terms defined?',
        'Are mistakes and corrections included?',
        'Is the source identified?',
      ],
      reflection: [
        'What is the biggest gap between your current notes and a tutor-ready file?',
      ],
    },
    miniCheck: [
      'What makes a Knowledge File different from regular notes?',
      'What eight elements make a file tutor-ready?',
      'Why does provenance matter in a Knowledge File?',
    ],
    teachBack: 'Explain what makes a Knowledge File tutor-ready and why it matters for your future AI tutor.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-02.png',
    title: 'Build the Eight-Part Study Pack',
    bigIdea: [
      'A Study Pack turns one topic into a complete learning resource. It combines your Compression Ladder, Understanding Card, Mistake Bank entries, and retrieval questions into one organized file.',
    ],
    sections: [
      {
        title: 'The eight parts',
        content: [
          '1. Topic and source',
          '2. Core idea in your own words',
          '3. Key terms with plain-language definitions',
          '4. Compression Ladder (from Module 5)',
          '5. Examples and non-examples',
          '6. Mistake Bank entries relevant to this topic',
          '7. Retrieval questions (self-test questions you created)',
          '8. Accuracy guardrail \u2014 what the Study Pack leaves out',
        ],
      },
      {
        title: 'Quality standards',
        content: [
          'Every claim has a source or is marked "I need to check."',
          'Definitions are in your own words, not copied AI text.',
          'Mistakes include the correction and a new question.',
          'The file is organized enough that someone else could use it.',
        ],
      },
      {
        title: 'Learn how you use information',
        content: [
          'When you review, do you prefer to read, quiz yourself, teach someone, or reorganize?',
          'What makes you more likely to actually return to your notes?',
          'What format makes information easiest to find: numbered lists, headers, cards, tables, or something else?',
          'These answers help design your tutor\u2019s file format preferences.',
        ],
      },
    ],
    activity: {
      title: 'Build Your First Study Pack',
      instructions: [
        'Choose a topic you are currently studying.',
        'Complete all eight parts of the Study Pack.',
        'Check each part against the quality standards.',
      ],
      scenarios: [
        'Topic and source',
        'Core idea in your own words',
        'Key terms with definitions',
        'Compression Ladder',
        'Examples and non-examples',
        'Mistake Bank entries',
        'Retrieval questions',
        'Accuracy guardrail',
      ],
      reflection: [
        'Which part was hardest to complete?',
        'What would make this Study Pack more useful for your future tutor?',
      ],
    },
    miniCheck: [
      'What are the eight parts of a Study Pack?',
      'What quality standards must each part meet?',
      'Why should definitions be in your own words?',
    ],
    teachBack: 'Walk someone through the eight-part Study Pack and explain why each part matters.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-03.png',
    title: 'Messy Notes vs Clean File Comparison',
    bigIdea: [
      'Compare messy notes with a clean Study Pack to see which one actually helps you retrieve, explain, and use information.',
    ],
    sections: [
      {
        title: 'Active comparison \u2014 messy vs clean',
        content: [
          'Round A: Use your original messy notes to answer five retrieval questions.',
          'Round B: Use your clean Study Pack to answer the same five questions.',
          'Rate each: Speed to find the answer (1\u20135), Accuracy of your answer (1\u20135), Confidence in your answer (1\u20135).',
        ],
      },
      {
        title: 'Orion review prompt',
        content: [
          '"Review my Study Pack against the source I provide. Identify one section that is accurate, one place that may be vague or misleading, and one important detail I may have removed. Do not rewrite the whole file. Ask me to make the correction."',
        ],
      },
    ],
    activity: {
      title: 'Messy vs Clean Comparison',
      instructions: [
        'Run both rounds (messy notes and clean Study Pack) with the same retrieval questions.',
        'Rate each on speed, accuracy, and confidence.',
        'Ask Orion to review your Study Pack for accuracy.',
      ],
      scenarios: [
        'Messy notes: speed, accuracy, confidence ratings',
        'Clean Study Pack: speed, accuracy, confidence ratings',
        'Orion review: what was accurate, what was vague, what was missing',
      ],
      reflection: [
        'Which format helped you retrieve information faster?',
        'What correction did you make after Orion\u2019s review?',
      ],
    },
    miniCheck: [
      'What was the difference between using messy notes and a clean Study Pack?',
      'What did Orion identify as needing improvement?',
      'How did you correct the Study Pack?',
    ],
    teachBack: 'Describe the comparison and explain why organized files are better for learning.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-04.png',
    title: 'Blueprint, Proof & Tutor-Ready Study Pack',
    bigIdea: [
      'Your Blueprint file-format setting tells your future tutor how to organize information for you. Your Study Pack becomes fuel for your personal tutor Project.',
    ],
    sections: [
      {
        title: 'Learning Supercharger Blueprint update',
        content: [
          'file-format = [numbered-list | headers-and-sections | cards | tables | not-yet-known]',
          'notes-style = how you prefer to organize learning information',
          'evidence = your messy vs clean comparison result',
          'Rule: "When organizing my learning, use ___ format. Include sources for every claim."',
        ],
      },
      {
        title: 'Tutor Knowledge Pack update',
        content: [
          'rule_id: module_7_file_format',
          'module: 7',
          'skill_tested: note_organization_and_study_pack',
          'source_activity: messy_vs_clean_comparison',
          'proposed_file_format: [format or not_yet_known]',
          'evidence: speed/accuracy/confidence ratings',
          'confidence: [low|medium|high]',
          'privacy: safe_for_tutor_project',
        ],
      },
      {
        title: 'Proof artifact \u2014 File Quality Test Card',
        content: [
          'Topic:',
          'Study Pack parts completed: _/8',
          'Accuracy correction made:',
          'Comparison result: messy vs clean',
          'Proposed file-format setting:',
          'Orion rules staged: file-format / notes-style',
        ],
      },
    ],
    activity: {
      title: 'Mastery Challenge \u2014 Build a Tutor-Ready Study Pack',
      instructions: [
        'Choose a real topic from current learning.',
        '1. Build the complete eight-part Study Pack.',
        '2. Ask Orion to check accuracy without rewriting.',
        '3. Make corrections yourself.',
        '4. Test retrieval using the Study Pack.',
        '5. Complete the File Quality Test Card.',
      ],
      scenarios: [
        'All eight Study Pack parts are complete.',
        'Every claim has a source or is marked for checking.',
        'Definitions are in my own words.',
        'Mistakes include corrections and new questions.',
        'The file is organized enough for my future tutor.',
      ],
      reflection: [
        'Is this Study Pack ready for your personal tutor Project?',
        'What would you improve next time?',
      ],
    },
    miniCheck: [
      'What is your file-format setting and why?',
      'Is your Study Pack tutor-ready?',
      'What evidence supports your file-format choice?',
    ],
    teachBack: 'Present your completed Study Pack and explain how it will help your future personal tutor.',
  },
};
