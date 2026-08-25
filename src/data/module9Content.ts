import type { NodeContent } from './module1Content';

export const module9Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-01.png',
    title: 'What Makes a Personal Tutor Project Different',
    bigIdea: [
      'Your mission: turn everything you discovered into a tutor that learns how to help you.',
      'Imagine opening one AI Project that already knows: how you prefer an explanation to begin, what to do when you are confused, when to give a hint instead of an answer, how to quiz you and help you learn from mistakes, and how to protect your voice, privacy, and independence.',
      'You are not wishing for a tutor. You are engineering one.',
    ],
    sections: [
      {
        title: 'The 30-second tutor test',
        content: [
          'STUDENT: "I do not understand how photosynthesis works."',
          'Tutor A: "Photosynthesis is the process by which plants convert light energy into chemical energy."',
          'Tutor B: "Let us find the missing piece first. Do you already understand what plants take in from the air, or should we start there?"',
          'Tutor A gives information. Tutor B begins by finding the help you need. In this module, you will decide what your tutor should do \u2014 not just what it should sound like.',
          'A costume can make an AI entertaining. Instructions make it useful.',
        ],
      },
      {
        title: 'The three layers of your tutor',
        content: [
          'Layer 1 \u2014 Personality: How the tutor communicates: calm, direct, encouraging, curious, playful, or challenging.',
          'Layer 2 \u2014 Function: What the tutor does: explain, ask, hint, rescue, quiz, verify, and refuse to do your thinking for you.',
          'Layer 3 \u2014 Knowledge: What approved information the tutor can use: your goals, tested learning rules, known confusion patterns, course-created Study Packs, and current subjects.',
          'Personality affects how the experience feels. Function affects whether the tutor actually helps you learn. Knowledge gives the tutor relevant context.',
          'You need all three, but function and safety come first.',
        ],
      },
      {
        title: 'A Project holds instructions and files',
        content: [
          'A normal chat starts with whatever you type in that moment. A Project can hold instructions and approved files that give the AI useful context across your work inside that Project.',
          'Platform names and controls can change. Your parent should help you locate the feature called Project, workspace, custom assistant, or the closest approved equivalent.',
          'If the approved account does not offer Projects, complete the files and tests in a regular private conversation.',
          'Do not create a new account or purchase anything without your parent.',
        ],
      },
    ],
    activity: {
      title: 'Layer Identification',
      instructions: [
        'Choose whether Tutor A or Tutor B would help you learn more.',
        'Identify the personality, function, and knowledge layers in each response.',
        'Describe what your ideal tutor should prioritize: tone, teaching behavior, or knowledge.',
      ],
      scenarios: [
        'Tutor A: What layer is strongest?',
        'Tutor B: What layer is strongest?',
        'Which tutor would help you learn more? Why?',
      ],
      reflection: [
        'If these layers are mixed into one giant prompt, why is it hard to repair the tutor?',
      ],
    },
    miniCheck: [
      'What are the three layers of a personal tutor?',
      'Why does function come before personality?',
      'What is the difference between a Project and a normal chat?',
    ],
    teachBack: 'Explain the three layers of a personal tutor and why function and safety come first.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-02.png',
    title: 'Parent-Approved Project Checkpoint & Evidence Gathering',
    bigIdea: [
      'Complete the parent-approved checkpoint before creating the Project. No exceptions.',
      'Your tutor should be based on evidence, not flattering guesses. Gather the approved results from Modules 0\u20138.',
    ],
    sections: [
      {
        title: 'Parent-approved Project checkpoint',
        content: [
          'Complete with your parent or guardian:',
          '\u2022 We are using the AI account and platform my parent approved.',
          '\u2022 My parent showed me how to create a private Project or approved workspace.',
          '\u2022 We reviewed history, sharing, attachment, and privacy settings.',
          '\u2022 We agree not to upload passwords, payment information, home addresses, private family messages, or another person\u2019s information.',
          '\u2022 We know that Orion prepares files, but I paste or upload them myself.',
          '\u2022 We know how to remove a file or delete the Project if needed.',
          'If any box is unfinished, prepare the files now and pause account setup until your parent can help.',
        ],
      },
      {
        title: 'Evidence inventory',
        content: [
          'Module 0: Learning Blueprint, Rescue Target, Advance Target, first rule',
          'Module 1: prompt/question rule',
          'Module 2: responsibility and verification rule',
          'Module 3: pre-learning rule',
          'Module 4: confusion-rescue rule',
          'Module 5: compression rule',
          'Module 6: quiz and Mistake Bank rule',
          'Module 7: Study Pack and file-use rule',
          'Module 8: writing-coach and voice-protection rule',
          'Do not copy every worksheet. Select only what helps the tutor teach you.',
        ],
      },
      {
        title: 'Provenance \u2014 the receipt for every rule',
        content: [
          'Each tutor rule needs: source_module, evidence_type, evidence_summary, status, review_condition.',
          'Evidence labels: student_reported, observed, experiment_result, pending_validation.',
          'The record does not say "I am permanently this type of learner." It says "This setting helped under these conditions, so test it again."',
        ],
      },
    ],
    activity: {
      title: 'Complete Checkpoint & Gather Evidence',
      instructions: [
        'Complete the parent-approved checkpoint with your parent.',
        'Review each module and check off evidence found.',
        'Ensure each rule has provenance: source, evidence type, summary, status, and review condition.',
      ],
      scenarios: [
        'Parent checkpoint: all boxes checked',
        'Module 0\u20138 evidence inventory: found and safe to include',
        'Each rule has provenance attached',
      ],
      reflection: [
        'Which rules have the strongest evidence?',
        'Which rules are still pending_validation?',
      ],
    },
    miniCheck: [
      'What are the six items on the parent-approved checkpoint?',
      'What are the four evidence labels?',
      'Why does each rule need provenance?',
    ],
    teachBack: 'Explain the parent checkpoint and why provenance matters for tutor rules.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-03.png',
    title: 'Discovery Conversation & Personality vs Function Comparison',
    bigIdea: [
      'Design your tutor\u2019s behavior through six key discovery questions before Orion compiles your files.',
      'A funny personality can make an AI enjoyable, but enjoyment alone does not prove learning.',
    ],
    sections: [
      {
        title: 'Discovery conversation \u2014 six design questions',
        content: [
          '1. When you are confused, what should your tutor do before explaining?',
          '2. How many hints should it offer before showing a worked example?',
          '3. What tone helps you stay focused without making you feel judged?',
          '4. How should the tutor check whether you understood instead of asking only "Do you understand?"',
          '5. What behavior must the tutor refuse because it would replace your thinking?',
          '6. What should the tutor do when it is uncertain or does not have enough information?',
          'These answers are design choices. You will test them.',
        ],
      },
      {
        title: 'Active comparison \u2014 personality first vs function first',
        content: [
          'Test A \u2014 Personality first: "Explain [CONCEPT] like an energetic space captain. Make it exciting."',
          'Test B \u2014 Function first: "Act as a learning coach. First ask what I already understand. Then identify one missing connection. Explain only that part with one example. Ask me one question that requires me to explain the idea in my own words. Give a hint before an answer."',
          'Compare: Could I explain the main idea afterward? Did the response focus on my actual confusion? Did I do some of the thinking myself?',
          'If Test B helped more, function-first instructions may be a useful default.',
          'If Test A kept you engaged, keep the tone while adding stronger functions.',
        ],
      },
    ],
    activity: {
      title: 'Discovery & Comparison',
      instructions: [
        'Answer all six discovery questions.',
        'Run both tests (personality first and function first) on the same school concept.',
        'Compare results and decide which elements to keep from each.',
      ],
      scenarios: [
        'Test A: personality-first response \u2014 could I explain afterward?',
        'Test B: function-first response \u2014 could I explain afterward?',
        'Which parts of Test A to keep for personality:',
        'Which parts of Test B to keep for function:',
      ],
      reflection: [
        'Which test helped you learn more?',
        'What tone do you want your tutor to use?',
      ],
    },
    miniCheck: [
      'What are the six discovery questions?',
      'What was the difference between personality-first and function-first results?',
      'Which elements will you keep for your tutor?',
    ],
    teachBack: 'Describe the personality vs function comparison and explain how the results will shape your tutor.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-04.png',
    title: 'Blueprint Update & Compile the Five Final Files',
    bigIdea: [
      'Your Blueprint is now complete enough to generate your personal tutor\u2019s instruction set.',
      'Orion compiles \u2014 but does not invent. Every instruction must trace back to evidence you collected.',
    ],
    sections: [
      {
        title: 'Learning Supercharger Blueprint \u2014 complete update',
        content: [
          'Compile all settings from Modules 0\u20138:',
          'explanation-start, pre-learn-sequence, rescue-start, review-start, quiz-format, writing-coach-mode, focus-block, voice-protection, student-owns-final-work',
          'For each setting: value, evidence type, source module, review condition.',
          'This is the master reference your tutor will use.',
        ],
      },
      {
        title: 'Ask Orion to compile \u2014 not invent',
        content: [
          'Prompt: "Using only my Blueprint and Knowledge File records from Modules 0\u20138, compile a Project Instruction Set and Student Tutor Profile. Flag any rule that lacks evidence or needs validation. Do not invent rules, settings, or personality traits I did not provide."',
          'Review everything Orion generates. Remove anything that does not match your evidence.',
        ],
      },
      {
        title: 'The five final files',
        content: [
          '1. Project Instructions: Role, session opening, explain behavior, hint and rescue behavior, quiz and verify, writing integrity, privacy and safety, adaptation rules.',
          '2. Student Tutor Profile Knowledge File: Explanation style, motivation, targets, subjects, focus block, and voice protection.',
          '3. Learning Rules Knowledge File: All module rules with provenance.',
          '4. Tutor Test and Revision Log: Record of tests and improvements.',
          '5. Student Setup Checklist: Verification that the Project is configured correctly.',
        ],
      },
    ],
    activity: {
      title: 'Compile Your Files',
      instructions: [
        'Ask Orion to compile your files from your Blueprint and Knowledge File records.',
        'Review every instruction \u2014 remove anything Orion invented.',
        'Verify each rule traces back to evidence from a specific module.',
      ],
      scenarios: [
        'Project Instructions: all sections complete',
        'Student Tutor Profile: matches my Blueprint',
        'Learning Rules: each has provenance',
        'No invented rules or settings',
      ],
      reflection: [
        'Did Orion invent any rules you did not provide?',
        'Which rules still need validation?',
      ],
    },
    miniCheck: [
      'What are the five final files?',
      'What sections are in the Project Instructions?',
      'Why must Orion compile, not invent?',
    ],
    teachBack: 'Walk through all five files and explain how each one contributes to your tutor.',
  },

  '5': {
    id: '5',
    imageUrl: '/images/modules/bright-mixed-playiq-05.png',
    title: 'Create the Project & Test It',
    bigIdea: [
      'You create the Project yourself inside the parent-approved account. Orion does not enter the account for you.',
      'Test your tutor by trying to break it \u2014 send confusing requests, test boundaries, and see if it follows your instructions.',
    ],
    sections: [
      {
        title: 'Create the Project yourself',
        content: [
          'Step 1: Open the parent-approved AI platform.',
          'Step 2: Create a new Project (or workspace or custom assistant).',
          'Step 3: Paste or upload the Project Instructions.',
          'Step 4: Add the Student Tutor Profile as a Knowledge File.',
          'Step 5: Add the Learning Rules as a Knowledge File.',
          'Step 6: Name the Project (e.g., "[Your Name]\u2019s Learning Tutor").',
          'Step 7: Verify the setup using the Student Setup Checklist.',
          'Orion should never ask for your password, enter the account for you, or upload anything silently.',
        ],
      },
      {
        title: 'Test, break, and improve the tutor',
        content: [
          'Test 1: Ask for help with a real topic. Does the tutor follow your rescue-start rule?',
          'Test 2: Ask the tutor to write your homework. Does it refuse?',
          'Test 3: Submit a wrong answer. Does it help you classify the mistake?',
          'Test 4: Ask for a quiz. Does it use your preferred format?',
          'Test 5: Ask it to explain something. Does it use your explanation-start setting?',
          'For each test, record: what you sent, what the tutor did, whether it followed the instruction, and what to improve.',
        ],
      },
      {
        title: 'Revision log',
        content: [
          'After each test, update the Tutor Test and Revision Log:',
          'Test number, Date, What I tested, Tutor response, Followed instruction? (yes/partly/no), Change made.',
          'If a rule does not work, revise the instruction \u2014 do not blame yourself.',
        ],
      },
    ],
    activity: {
      title: 'Build & Stress Test Your Tutor',
      instructions: [
        'Create the Project in your parent-approved account following the step-by-step guide.',
        'Run all five tests.',
        'Update the Revision Log with results and improvements.',
      ],
      scenarios: [
        'Test 1: Rescue-start behavior',
        'Test 2: Homework refusal',
        'Test 3: Mistake classification',
        'Test 4: Quiz format',
        'Test 5: Explanation-start setting',
      ],
      reflection: [
        'Which test revealed the most useful improvement?',
        'Did any instruction need revision?',
      ],
    },
    miniCheck: [
      'What are the seven steps to create the Project?',
      'What five tests should you run?',
      'What should you do if a rule does not work?',
    ],
    teachBack: 'Walk through how you created the Project and describe the results of your five tests.',
  },

  '6': {
    id: '6',
    imageUrl: '/images/modules/bright-mixed-playiq-06.png',
    title: 'Proof Artifact & Tutor Stress Test Mastery',
    bigIdea: [
      'Your proof artifact is the Personal Tutor Build Record \u2014 it documents your entire build process and serves as evidence for the Capstone.',
    ],
    sections: [
      {
        title: 'Proof artifact \u2014 Personal Tutor Build Record',
        content: [
          'Platform used:',
          'Project created: yes / not yet',
          'Parent checkpoint completed: yes / not yet',
          'Files uploaded: Project Instructions / Student Tutor Profile / Learning Rules',
          'Number of tests run:',
          'Number of revisions made:',
          'Strongest instruction:',
          'Instruction that needed the most revision:',
          'Tutor behavior I am most proud of:',
          'One thing I would change with more time:',
        ],
      },
      {
        title: 'Knowledge File update \u2014 Tutor Build',
        content: [
          'rule_id: module_9_tutor_build',
          'module: 9',
          'skill_tested: personal_tutor_project_creation',
          'source_activity: personality_vs_function_comparison_and_five_test_battery',
          'tutor_project_created: [yes|not_yet]',
          'tests_run: [number]',
          'revisions_made: [number]',
          'confidence: [low|medium|high]',
          'privacy: safe_for_tutor_project',
        ],
      },
    ],
    activity: {
      title: 'Mastery Challenge \u2014 The Tutor Stress Test',
      instructions: [
        'Choose a real school topic your tutor has not seen.',
        '1. Ask the tutor for help using your rescue-start method.',
        '2. Submit a wrong answer and see if it helps you classify the mistake.',
        '3. Ask for a quiz and check if it uses your format.',
        '4. Ask it to rewrite your work \u2014 verify it refuses.',
        '5. Teach back what you learned to prove the tutor helped you think.',
        'Record all results in the Revision Log.',
      ],
      scenarios: [
        'The tutor followed my instructions on a new topic.',
        'The tutor refused to do my thinking.',
        'The tutor used my preferred quiz format.',
        'I could explain what I learned in my own words.',
        'I saved the Build Record and Revision Log.',
      ],
      reflection: [
        'Is your tutor ready for real schoolwork?',
        'What is the first thing you would improve with more testing?',
        'How will you maintain your tutor as your learning evolves?',
      ],
    },
    miniCheck: [
      'What does your Personal Tutor Build Record document?',
      'How many tests and revisions did you complete?',
      'Is your tutor ready for the Capstone?',
    ],
    teachBack: 'Present your Personal Tutor Build Record and demonstrate your tutor handling a real learning task.',
  },
};
