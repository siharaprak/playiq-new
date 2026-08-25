import type { NodeContent } from './module1Content';

export const module4Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-01.png',
    title: 'Confusion Is Information',
    bigIdea: [
      'Your mission: find the one missing piece.',
      'Have you ever looked at a lesson and thought, "I understand every word, but I still do not understand what this means"? That feeling does not mean you are bad at the subject. It usually means there is a specific missing piece hiding inside the lesson.',
      'A vague request usually produces a vague explanation. A precise rescue signal gives Orion a much better chance of helping with the actual missing piece.',
    ],
    sections: [
      {
        title: 'The 30-second rescue hook',
        content: [
          'Read this sentence: "The membrane is selectively permeable, so some substances cross by diffusion while others require transport proteins."',
          'Circle the first place where your understanding becomes less clear:',
          '\u2022 membrane',
          '\u2022 selectively permeable',
          '\u2022 why some substances cross',
          '\u2022 why transport proteins are needed',
          '\u2022 I know the pieces, but not how the sentence fits together',
          '\u2022 the whole sentence arrived too quickly',
          'You just did the first move of Lesson Rescue Mode: you replaced "all of this is confusing" with "my confusion begins here."',
        ],
      },
      {
        title: 'The four moves of Lesson Rescue Mode',
        content: [
          '1. Stop at the first unclear point.',
          '2. Name the likely gap.',
          '3. Choose one rescue method.',
          '4. Prove the rescue by explaining or using the idea yourself.',
          'This is not about making every lesson instantly easy. It is about reducing a large confusing problem into the next learnable step.',
        ],
      },
      {
        title: 'From fog to a target \u2014 an Orion conversation',
        content: [
          'STUDENT: "I do not understand this chapter."',
          'ORION: "Let us make that smaller. Which paragraph is the first one that stops making sense?"',
          'STUDENT: "The second paragraph."',
          'ORION: "Which word, step, or connection inside it is unclear?"',
          'STUDENT: "I know the words, but I do not know why the equation changes on line three."',
          'ORION: "Good diagnosis. That sounds like a possible step gap. I will show only the move between lines two and three, then you will try a similar move."',
          'Notice: Orion did not replace the student\u2019s thinking or finish the whole assignment.',
        ],
      },
    ],
    activity: {
      title: 'First Rescue Signal',
      instructions: [
        'Read the membrane sentence and identify where your understanding becomes less clear.',
        'Write your first rescue signal.',
      ],
      scenarios: [
        'membrane',
        'selectively permeable',
        'why some substances cross',
        'why transport proteins are needed',
        'the whole sentence fits together',
        'the whole sentence arrived too quickly',
      ],
      reflection: [
        'My first rescue signal was:',
        'Why did I choose that point?',
      ],
    },
    miniCheck: [
      'What are the four moves of Lesson Rescue Mode?',
      'Why is a precise rescue signal better than saying "I do not get it"?',
      'What did Orion do differently from just giving the answer?',
    ],
    teachBack: 'Explain how to turn "I do not understand" into a precise rescue signal.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-02.png',
    title: 'The Six Gap Types',
    bigIdea: [
      'The same confused feeling can come from different causes. Use these six types as possibilities, not medical diagnoses or permanent traits.',
      'Your first gap choice is a hypothesis. You test it. If the rescue does not help, you change the hypothesis instead of blaming yourself.',
    ],
    sections: [
      {
        title: '1. Word gap',
        content: [
          'An important word, symbol, phrase, or instruction is unclear.',
          'Example: You cannot follow a history question because you do not know what "evaluate" means in that question.',
          'Useful Orion request: "In this sentence, explain the word \'evaluate\' in plain language. Give one example of what it asks me to do and one thing it does not ask me to do."',
        ],
      },
      {
        title: '2. Background gap',
        content: [
          'The lesson assumes you already know an earlier idea.',
          'Example: Factoring quadratics feels impossible because multiplying binomials was never fully understood.',
          'Useful Orion request: "Ask me three short questions to find the earlier idea I may be missing. Do not solve the current problem for me."',
        ],
      },
      {
        title: '3. Step gap',
        content: [
          'You understand the starting point and maybe the ending, but one move in the middle is missing.',
          'Example: You follow the first two steps in a chemistry calculation and then do not know why the units change.',
          'Useful Orion request: "Show only the missing move between these two lines. Explain why that move is allowed, then give me a similar move to try."',
        ],
      },
      {
        title: '4. Connection gap',
        content: [
          'You understand separate facts but not how they influence one another.',
          'Example: You know what supply and demand mean separately, but not why a shortage can affect price.',
          'Useful Orion request: "Connect these two ideas using one cause-and-effect chain and one real-world example. Then ask me to explain the connection back."',
        ],
      },
      {
        title: '5. Overload gap',
        content: [
          'Too much information is arriving at once, so you cannot see where to begin.',
          'Example: A page contains seven new terms, two diagrams, and a long explanation.',
          'Useful Orion request: "Break this into no more than three chunks. Tell me which chunk to understand first and hide the later details until I ask for them."',
        ],
      },
      {
        title: '6. Expectation gap',
        content: [
          'You may understand the topic but not what the task, teacher, rubric, or question expects you to produce.',
          'Example: You know the novel, but you are unsure whether the assignment asks for a summary, an argument, or evidence-based analysis.',
          'Useful Orion request: "Translate this instruction into a checklist. Do not write the response. Show me what a successful answer must demonstrate."',
        ],
      },
    ],
    activity: {
      title: 'Quick Gap Practice',
      instructions: [
        'Match each situation with the gap that seems most likely.',
        'More than one answer can be reasonable if you explain your evidence.',
      ],
      scenarios: [
        '"I know every vocabulary word, but I cannot tell why event A caused event B."',
        '"The teacher went from line 2 to line 3 and I cannot reproduce the move."',
        '"I studied the topic, but I do not know what \'compare and contrast\' requires in the final answer."',
        '"The whole page feels like ten things at once."',
      ],
      reflection: [
        'For each situation, write the likely gap type and your evidence.',
      ],
    },
    miniCheck: [
      'Name all six gap types.',
      'What is the difference between a step gap and a connection gap?',
      'Why is your gap choice a hypothesis, not a diagnosis?',
    ],
    teachBack: 'Explain the six gap types and give one example of each.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-03.png',
    title: 'Chunking & The Confusion Scanner',
    bigIdea: [
      'Chunking means dividing material into small enough pieces that you can locate the first breakdown.',
      'If you ask Orion to explain an entire chapter, you may receive another entire chapter. The scan helps you preserve what you already understand and focus energy only where it is needed.',
    ],
    sections: [
      {
        title: 'The line-by-line scan',
        content: [
          '1. Read only the first sentence or step.',
          '2. Mark it: G = I get it well enough to explain it. M = maybe; I recognize it but cannot explain it yet. S = stop; this is where I lose the thread.',
          '3. Continue only until the first M or S.',
          '4. Underline the exact word, step, or connection causing the uncertainty.',
          '5. Name a possible gap type.',
          'Use a short, school-approved paragraph or worked example. Do not upload private information or another student\u2019s work.',
        ],
      },
      {
        title: 'Learn How You Learn discovery',
        content: [
          '1. When confusion starts, what do you usually do first\u2014reread, guess, ask, pause, search, or something else?',
          '2. What makes you more likely to ask for help?',
          '3. What sometimes stops you from asking for help?',
          '4. Think of a recent lesson that finally clicked. What changed\u2014the words, the example, the steps, the connection, the amount shown, or the instructions?',
          '5. When someone gives you the whole answer while you are stuck, what do you gain and what do you lose?',
          '6. What should Orion do if its first rescue attempt does not help?',
          'These answers are clues for the tutor you will build later. They are not fixed statements about what your brain can or cannot do.',
        ],
      },
    ],
    activity: {
      title: 'My Confusion Scan',
      instructions: [
        'Choose a school-approved paragraph or worked example.',
        'Run the line-by-line scan marking G, M, or S.',
        'Identify the exact unclear word, step, or connection.',
        'Name your first gap hypothesis.',
      ],
      scenarios: [
        'Topic or lesson:',
        'Source used:',
        'First clear chunk:',
        'First M or S chunk:',
        'Exact unclear element:',
        'My first gap hypothesis:',
      ],
      reflection: [
        'Why did I choose this gap type?',
        'What do I usually do first when confusion starts?',
      ],
    },
    miniCheck: [
      'What do the marks G, M, and S mean in the confusion scan?',
      'Why should you stop at the first M or S?',
      'What should Orion do if the first rescue does not help?',
    ],
    teachBack: 'Walk someone through the line-by-line confusion scan using a real example.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-04.png',
    title: 'Three Rescue Methods Compared',
    bigIdea: [
      'Test three methods on the same confusing chunk. Keeping the chunk the same makes the comparison more useful.',
      'Do not conclude "I am an analogy learner" or "I can only learn through steps." A safer conclusion is: "For this topic, under these conditions, this method helped because of this evidence."',
    ],
    sections: [
      {
        title: 'Method A: Analogy rescue',
        content: [
          'Prompt: "Act as my learning coach. I am confused about [exact chunk]. My possible gap is [gap type]. Explain only that missing piece with one simple analogy. Tell me where the analogy stops being accurate. Then ask me one check question. Do not complete my assignment."',
          'Record: One thing the analogy clarified. One limit or confusing part. Check question result: correct / partly correct / not yet.',
        ],
      },
      {
        title: 'Method B: Step-by-step rescue',
        content: [
          'Prompt: "Act as my learning coach. I am confused about [exact chunk]. Show the smallest sequence of steps needed to connect what I know to what I am missing. Pause after each step for me to explain it back. Do not finish the school task for me."',
          'Record: The step where understanding improved. The step that still needs work. Check question result.',
        ],
      },
      {
        title: 'Method C: Diagnostic-question rescue',
        content: [
          'Prompt: "Act as my learning coach. Ask me up to three short questions, one at a time, to locate my exact confusion about [chunk]. After my answers, name the likely gap and give one hint. Do not give the final answer."',
          'Record: The question that exposed the gap. The hint I used. Check question result.',
        ],
      },
      {
        title: 'Evidence capture',
        content: [
          'Rate each method: Understanding before (1\u20135), Understanding after (1\u20135), Frustration after (1\u20135), Hints needed, Could I explain it?',
          'Which method produced the clearest improvement? What evidence supports that answer?',
          'What might have affected the result\u2014topic difficulty, prior knowledge, prompt quality, tiredness, time pressure?',
        ],
      },
    ],
    activity: {
      title: 'Three-Method Comparison',
      instructions: [
        'Use the same confusing chunk for all three methods.',
        'Run each method and record your results.',
        'Complete the evidence capture table.',
        'Write your evidence-based conclusion without labeling yourself.',
      ],
      scenarios: [
        'Method A: Analogy rescue',
        'Method B: Step-by-step rescue',
        'Method C: Diagnostic-question rescue',
      ],
      reflection: [
        'Which method produced the clearest improvement?',
        'What evidence supports that answer?',
        'Did another method help in a different way?',
      ],
    },
    miniCheck: [
      'What are the three rescue methods?',
      'Why do you keep the same chunk for all three tests?',
      'Why should you not label yourself as one type of learner?',
    ],
    teachBack: 'Describe all three rescue methods and explain which one worked best for your test, using evidence from your comparison.',
  },

  '5': {
    id: '5',
    imageUrl: '/images/modules/bright-mixed-playiq-05.png',
    title: 'Blueprint, Proof & Rescue a Real Lesson',
    bigIdea: [
      'Your Blueprint rescue-start setting tells your future tutor how to begin a rescue, not how it must teach you forever.',
      'If the move helps, keep using it where it works. If another move works better, revise the setting. If the topic changes, test again.',
    ],
    sections: [
      {
        title: 'Learning Supercharger Blueprint update',
        content: [
          'rescue-start = [analogy | step-by-step | diagnostic-questions | not-yet-known]',
          'when-to-use = your description of when this method helps most',
          'evidence = your comparison result',
          'fallback = the method to try if the first one does not work',
          'Rule in plain language: "When I say I am stuck, first help me locate the exact gap. For this kind of topic, begin with ___. If I cannot explain the idea after the check question, try ___ next."',
          'Status: experiment_result / student_reported / pending_validation',
        ],
      },
      {
        title: 'Knowledge File update',
        content: [
          'rule_id: module_4_rescue_start',
          'module: 4',
          'skill_tested: lesson_rescue',
          'source_activity: analogy_vs_steps_vs_questions_comparison',
          'confusing_topic: [topic]',
          'gap_hypothesis: [word|background|step|connection|overload|expectation]',
          'preferred_first_move: [method or not_yet_known]',
          'evidence: understanding_change, frustration_observation, hints_needed, teach_back_result',
          'provenance: [experiment_result|student_reported|pending_validation]',
          'confidence: [low|medium|high]',
          'fallback_method: [method or pending_validation]',
          'privacy: safe_for_tutor_project',
          'review_condition: Retest with a different subject or when the rule stops helping.',
        ],
      },
      {
        title: 'Proof artifact \u2014 Lesson Rescue Report',
        content: [
          'Student: / Date:',
          'Lesson/topic:',
          'The exact point where confusion began:',
          'My first gap hypothesis: [word | background | step | connection | overload | expectation]',
          'Evidence for that hypothesis:',
          'Methods tested: [analogy] [steps] [diagnostic questions]',
          'The first method Orion should test next time: / Why:',
          'Fallback method:',
          'Before the rescue, I thought:',
          'After the rescue, I can now explain:',
          'Rule status: [experiment_result | student_reported | pending_validation]',
        ],
      },
    ],
    activity: {
      title: 'Mastery Challenge \u2014 Rescue a Real Lesson',
      instructions: [
        'Choose one small section from current, school-approved material.',
        '1. Run the line-by-line confusion scan.',
        '2. Name a gap hypothesis.',
        '3. Ask Orion for your proposed first rescue method.',
        '4. Attempt a new example or explanation yourself.',
        '5. If the first rescue fails, test the fallback.',
        '6. Complete the teach-back record without copying Orion\u2019s wording.',
      ],
      scenarios: [
        'I located a specific gap instead of saying everything was confusing.',
        'I asked Orion for teaching help, not a completed answer.',
        'I tried the idea myself after the rescue.',
        'I explained what changed in my own words.',
        'I saved the proof artifact and knowledge-file record.',
      ],
      reflection: [
        'The section is about:',
        'The exact gap was:',
        'The missing piece was:',
        'Here is the idea in my own words:',
        'I still need to verify or practice:',
      ],
    },
    miniCheck: [
      'What is your rescue-start setting and why?',
      'What is your fallback method?',
      'Can you explain the rescued idea in your own words?',
    ],
    teachBack: 'Walk through your rescued lesson: what was the gap, what method worked, and how you proved you understood it.',
  },
};
