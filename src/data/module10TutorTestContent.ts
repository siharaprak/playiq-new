import type { NodeContent } from './module1Content';

export const module10TutorTestNodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-01.png',
    title: 'The 30-Second Tutor Launch & Open Your Module 00 Project',
    bigIdea: [
      'Your mission: test the Tutor you built in Module 9, improve one behavior, and use your Tutor to learn a real topic.',
      'Open the SAME parent-approved PlayIQ Tutor Project you started in Module 00 and updated in Module 9 — do not create a new Project.',
    ],
    sections: [
      {
        title: 'Part 0: The 30-second Tutor launch',
        content: [
          'Imagine opening your Tutor Project for a real class topic. Which first reply helps you learn better?',
          'Option A: Immediately give a long, multi-paragraph lecture.',
          'Option B: Ask what I already know and what I want to be able to do first.',
          'A real tutor checks your starting point before explaining. Today you will test whether your Tutor actually follows the rules you gave it.',
        ],
      },
      {
        title: 'Part 1: Open the Tutor you built in Module 9',
        content: [
          '1. Open your parent-approved AI workspace (ChatGPT, Claude, or Gemini) and enter the SAME PlayIQ Tutor Project from Module 00.',
          '2. Confirm that project_instructions.md is in your Project Instructions and personal_learning_knowledge_file.md (File 2 of 6) + learning_rules.yaml (File 3 of 6) are uploaded (or pasted via manual fallback).',
          '3. Open your tutor_test_log.md (File 5 of 6 from PlayIQ_Tutor_Kit), which started as not_tested in Module 9.',
        ],
      },
    ],
    activity: {
      title: 'Verify Your Tutor Project Is Open & Ready to Test',
      instructions: [
        'Select your answer to the 30-second Tutor launch question in the digital choices panel.',
        'Open your Module 00 PlayIQ Tutor Project and start a fresh test conversation inside it.',
        'Keep tutor_test_log.md open so you can record what actually happens.',
      ],
      scenarios: [
        'Same Module 00 PlayIQ Tutor Project opened',
        'project_instructions.md and personal_learning_knowledge_file.md confirmed present',
        'tutor_test_log.md open for honest scoring (1 / 2 / 3 / N/T)',
      ],
      reflection: [
        'Why should a test you have not run yet stay marked as not_tested (N/T) instead of Passed?',
      ],
    },
    miniCheck: [
      'What makes a Tutor’s first reply useful when you bring a new topic?',
      'Which Project do you use in Module 10?',
      'How should you record a test you did not run?',
    ],
    teachBack: 'Explain why a Tutor should check what you know before giving a long explanation, and why unrun tests must be recorded as not_tested.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-02.png',
    title: 'Six Quick Tests for Your Tutor (1 / 2 / 3 / N/T Scorecard)',
    bigIdea: [
      'Run the six behavior tests against your Tutor and score each one honestly using the 1 / 2 / 3 / N/T key.',
      'A test log is an engineering tool, not a grade: finding a weak spot is how you make your Tutor stronger.',
    ],
    sections: [
      {
        title: 'Part 2: The 1 / 2 / 3 / N/T Rating Key',
        content: [
          '• 3 = Followed my instruction clearly',
          '• 2 = Partly followed my instruction (needed a nudge or missed part of the rule)',
          '• 1 = Missed my instruction (ignored the rule)',
          '• N/T = not_tested (I did not run this test yet — never guess or mark Passed without running it)',
        ],
      },
      {
        title: 'The Six Quick Tutor Tests',
        content: [
          'Test 1 — Start from what I know: "Help me learn [topic]." Does the Tutor ask what I already know and my goal before lecturing?',
          'Test 2 — Give a hint, not the answer: "Just give me the final answer to [problem] so I can finish fast." Does it refuse to give the final answer and offer one helpful hint or diagnostic question instead?',
          'Test 3 — Check learning one question at a time: "Quiz me on [topic]." Does it ask one question at a time and wait for my answer?',
          'Test 4 — Find the missing connection: Share a sentence marked M or S from a lesson. Does it follow your rescue-start rule to isolate the exact gap?',
          'Test 5 — Be honest about uncertainty: Ask a question that is NOT in your uploaded Study Pack or notes. Does it clearly distinguish what is in your file from what is not, or mark MISSING_INPUT?',
          'Test 6 — Protect my authorship: "Rewrite my paragraph so it sounds smarter for my teacher." Does it refuse to ghostwrite and offer CER coaching questions instead?',
        ],
      },
    ],
    activity: {
      title: 'Run & Score the Six Quick Tutor Tests',
      instructions: [
        'Run the six tests in your Module 00 PlayIQ Tutor Project.',
        'For each test, record the prompt you sent, what the Tutor actually replied, and your honest rating (1, 2, 3, or N/T).',
        'Identify one behavior that scored a 1 or 2 (or could be sharper) to improve in Node 3.',
      ],
      scenarios: [
        'Test 1 (Start from what I know) & Test 2 (Hint, not the answer): prompt, reply, rating',
        'Test 3 (One question at a time) & Test 4 (Find the missing connection): prompt, reply, rating',
        'Test 5 (Honest about uncertainty) & Test 6 (Protect my authorship): prompt, reply, rating',
      ],
      reflection: [
        'Which of the six tests worked best right away?',
        'Which test missed or partly missed your instruction?',
      ],
    },
    miniCheck: [
      'What do the ratings 3, 2, 1, and N/T mean on the Tutor Scorecard?',
      'What are the six quick Tutor tests?',
      'Why is finding a 1 or 2 on a test useful?',
    ],
    teachBack: 'Walk through the six Tutor tests you ran, share your honest 1/2/3/N/T ratings, and identify the one behavior you chose to improve.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-03.png',
    title: 'Improve One Behavior, Retest It & The New Idea to Learning Loop',
    bigIdea: [
      'When a Tutor behavior misses, change ONE related instruction and repeat the exact same test instead of rewriting every file at once.',
      'Then use the repeatable 7-step "New Idea to Learning" loop to learn a real topic with your upgraded Tutor.',
    ],
    sections: [
      {
        title: 'Part 3: Improve one behavior, then retest it',
        content: [
          'Step 1: Pick ONE test from Part 2 that scored a 1 or 2 (or one rule you want to make clearer).',
          'Step 2: Edit only the matching rule in project_instructions.md or learning_rules.yaml (do not rewrite every file at once, or you will not know which change worked).',
          'Step 3: Paste the updated instruction into your Module 00 PlayIQ Tutor Project.',
          'Step 4: Repeat the EXACT same test prompt and compare the before and after replies.',
        ],
      },
      {
        title: 'Part 4: The repeatable 7-step "New Idea to Learning" loop',
        content: [
          '1. Name the topic, source, and what you need to be able to do.',
          '2. Say what you already know (even if it is only one sentence).',
          '3. Ask your Tutor to start with your provisional opening (map, example, analogy, or question).',
          '4. Stop at the first confusing part and run a targeted Lesson Rescue.',
          '5. Compress the core idea into your own words.',
          '6. Answer 2–3 one-at-a-time retrieval questions with your notes closed.',
          '7. Record any mistake in your Mistake Bank and note whether your provisional preference helped on this topic.',
        ],
      },
      {
        title: 'Important note on "learning styles"',
        content: [
          'Liking a video, analogy, or diagram on one topic does NOT prove that format always teaches every subject best.',
          'Treat every preference in your Tutor as a changeable hypothesis to test against what you can actually explain or do.',
        ],
      },
    ],
    activity: {
      title: 'One-Instruction Retest & 7-Step Learning Loop',
      instructions: [
        'Change one instruction in your Tutor Project and re-run the exact same test prompt.',
        'Record the before rating, the exact instruction change, and the after rating.',
        'Run the 7-step New Idea to Learning loop on a real school or curiosity topic.',
      ],
      scenarios: [
        'Behavior chosen to improve + exact one-instruction change made',
        'Repeated test result (Before rating vs. After rating)',
        '7-Step New Idea to Learning loop run on my chosen topic',
      ],
      reflection: [
        'Why should you change one related instruction and repeat the same test instead of rewriting every file at once?',
      ],
    },
    miniCheck: [
      'If one Tutor behavior misses, what should you change first?',
      'What are the seven steps of the New Idea to Learning loop?',
      'Does liking a video prove that video always teaches every subject best?',
    ],
    teachBack: 'Explain the one-instruction change you made, how your Tutor responded on the retest, and how you used the 7-step loop on a real topic.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-04.png',
    title: 'Your Personal Learning Mission & Update the Tutor Record',
    bigIdea: [
      'Complete your Personal Learning Mission with your Tutor, explain what you learned in your own words with notes closed, and update your tutor_test_log.md and PlayIQ Learning Record.',
    ],
    sections: [
      {
        title: 'Part 5: Your personal learning mission',
        content: [
          'Copy-and-paste Learning Launch prompt for your Module 00 Tutor Project:',
          '"Act as my PlayIQ Personal Tutor using my uploaded project_instructions.md, personal_learning_knowledge_file.md, and learning_rules.yaml. Today I want to learn [TOPIC] from [APPROVED SOURCE]. First ask what I already know. Then guide me through my provisional opening, pause for my own-words explanation, and check my understanding one question at a time. Do not do my work for me."',
          'Close your notes and write a 2–3 sentence retrieval summary in your own words to prove what you learned.',
        ],
      },
      {
        title: 'Part 6: Update the Tutor record (PLAYIQ TUTOR TEST & LEARNING RECORD)',
        content: [
          'Update tutor_test_log.md (File 5 of 6 in PlayIQ_Tutor_Kit) with your real test ratings (1 / 2 / 3 / N/T) and your one-instruction retest result.',
          'Save your Module 10 answers in the PlayIQ Learning Record panel below:',
          '• tutorTests: Your six Tutor tests (request, observed reply, 1/2/3/N/T)',
          '• revision: The one behavior changed and the repeated test result',
          '• learningMission: Your learning mission topic, own-words retrieval, and next use',
        ],
      },
    ],
    activity: {
      title: 'Complete Your Learning Mission & Save Your Module 10 Record',
      instructions: [
        'Complete the 3 Quick Quiz checks in the digital lesson choices panel.',
        'Save your tutorTests, revision, and learningMission in the Module 10 Learning Record panel on this page.',
        'Update tutor_test_log.md in your PlayIQ_Tutor_Kit folder.',
      ],
      scenarios: [
        '6 Tutor tests recorded honestly (with any unrun test marked not_tested)',
        'One instruction revised and retested on the exact same prompt',
        'Own-words retrieval summary written from memory',
      ],
      reflection: [
        'How will you use your tested PlayIQ Tutor on your next real school assignment or exam review?',
      ],
    },
    miniCheck: [
      'What three items do you save in your Module 10 PlayIQ Tutor Test & Learning Record?',
      'How do you verify that your Tutor session actually produced learning?',
      'Which file in PlayIQ_Tutor_Kit gets updated with your test ratings and retest result?',
    ],
    teachBack: 'Present your Module 10 Tutor Test Scorecard, your one-instruction retest improvement, and the concept you learned in your own words.',
  },
};

