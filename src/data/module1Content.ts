export type NodeContent = {
  id: string;
  title: string;
  imageUrl?: string;
  bigIdea: string[];
  sections: { title?: string; content: string[] }[];
  activity: {
    title: string;
    instructions: string[];
    scenarios: string[];
    reflection?: string[];
  };
  miniCheck: string[];
  teachBack: string;
};

export const module1Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-01.png',
    title: 'The AI Learning Code — Modes & Power',
    bigIdea: [
      'Your mission: learn how to control the genie.',
      'AI can explain ideas, give hints, quiz you, coach you through a plan, adapt to how you learn, and rescue a lesson you missed. But it can only do those things well if you tell it which role to play.',
      'A strong prompt tells Orion what role to play and what not to do. If you ask the genie for "help," you get whatever it guesses. If you ask for the right mode, you get the right kind of help.',
    ],
    sections: [
      {
        title: 'Lightning Hook — Choose your power',
        content: [
          'Imagine you have 20 minutes before a big test. You can pick one AI power. Which would you choose?',
          'A. "Give me all the answers so I can memorize them."',
          'B. "Explain the three hardest ideas simply and then quiz me."',
          'C. "Find where I am confused and fix only that part."',
          'Your choice tells Orion something about how you want to learn. There is no wrong answer — but the second and third choices tend to build skills that stay with you after the test is over.',
        ],
      },
      {
        title: '1. Explain Mode',
        content: [
          'Use it when a topic is new or confusing.',
          'Example prompt: "Explain fractions using one simple example. Then ask me to explain the idea back in my own words."',
        ],
      },
      {
        title: '2. Hint Mode',
        content: [
          'Use it when you have started but feel stuck.',
          'Example prompt: "Give me one hint only. Do not solve the problem. Wait for my attempt."',
        ],
      },
      {
        title: '3. Quiz Mode',
        content: [
          'Use it when you want to prove what you remember.',
          'Example prompt: "Quiz me one question at a time. Do not reveal the answer until I try."',
        ],
      },
      {
        title: '4. Coach Mode',
        content: [
          'Use it when you need a plan, sequence, or way to begin.',
          'Example prompt: "Help me divide this assignment into three short work blocks. I will do the work."',
        ],
      },
      {
        title: '5. Learn-My-Way Mode',
        content: [
          'Use it when you want to test a different explanation format.',
          'Example prompt: "Start with a real example, then explain the rule in simple steps."',
        ],
      },
      {
        title: '6. Lesson Rescue Mode',
        content: [
          'Use it when you are overwhelmed and do not know exactly where understanding broke.',
          'Example prompt: "Ask me three short questions to find the first part I do not understand. Repair only that part."',
        ],
      },
    ],
    activity: {
      title: 'Quick Mode Match',
      instructions: [
        'Write the best mode beside each situation.',
        'Suggested matches: Hint, Quiz, Lesson Rescue, Coach, Explain.',
      ],
      scenarios: [
        'I understand half the equation but cannot see the next step.',
        'I have a test tomorrow and need to check my memory.',
        'My textbook paragraph makes no sense at all.',
        'I have three assignments and do not know what to start.',
        'I have never learned this topic before.',
      ],
      reflection: [
        'Which mode would help you most right now, and why?',
        'What would happen if you always used Explain Mode even when you only needed a hint?',
      ],
    },
    miniCheck: [
      'Name three of the six PlayIQ learning modes.',
      'When should you use Hint Mode instead of Explain Mode?',
      'Why does choosing the right mode matter?',
    ],
    teachBack: 'Explain to a friend how to choose between Hint Mode and Explain Mode for a problem they are stuck on.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-02.png',
    title: 'Ask for Learning, Not Just Answers',
    bigIdea: [
      'The real cheat is not getting an answer early. The real learning advantage is knowing how to understand something faster without skipping the understanding.',
      'A learning prompt keeps you in control. Orion supplies support; you supply the thinking.',
    ],
    sections: [
      {
        title: 'Answer-seeking vs learning prompts',
        content: [
          'Answer-seeking prompt: "What is the answer to question 4?"',
          'Learning prompt: "Do not give me the answer. Ask what I have tried, then give one hint and one check question."',
          'The second prompt keeps you in control. Orion supplies support; you supply the thinking.',
        ],
      },
      {
        title: 'Prompt upgrade practice',
        content: [
          'Weak: "Write my history paragraph." \u2192 Stronger: Ask for coaching that helps you write it yourself.',
          'Weak: "Solve all these math questions." \u2192 Stronger: Ask for one hint at a time while you attempt each question.',
        ],
      },
      {
        title: 'Orion checkpoint \u2014 before sending a school prompt, ask:',
        content: [
          '1. What am I trying to learn?',
          '2. Which mode would help?',
          '3. What work must remain mine?',
          '4. How will I check the result?',
        ],
      },
    ],
    activity: {
      title: 'Prompt Upgrade Workshop',
      instructions: [
        'Rewrite each weak prompt into a learning prompt that keeps you doing the thinking.',
        'For each upgraded prompt, identify which mode it uses.',
      ],
      scenarios: [
        '"What is the answer?"',
        '"Do this for me."',
        '"Write my paragraph."',
        '"Solve this worksheet."',
        '"Tell me what to put."',
      ],
      reflection: [
        'Write three strong learning prompts for something you are currently studying in school.',
        'For each prompt, which Orion checkpoint question helped you most?',
      ],
    },
    miniCheck: [
      'What is the difference between a shortcut prompt and a coaching prompt?',
      'What are the four Orion checkpoint questions?',
      'Why does a learning prompt help more than an answer-seeking prompt?',
    ],
    teachBack: 'Explain why better questions lead to better learning, using an example from your own school experience.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-03.png',
    title: 'Learn How You Learn Lab',
    bigIdea: [
      'This module is not about finding one correct learning style. It is about testing what works for you today with a specific topic and seeing the evidence.',
      'You will ask Orion to explain the same topic three different ways, then compare which opening made the idea easiest to follow.',
    ],
    sections: [
      {
        title: 'The three explanation tests',
        content: [
          'Choose one topic you understand a little but want to understand better. Examples: gravity, a historical event, percentages, photosynthesis, or a skill from a hobby.',
          'Test A \u2014 Example-first: "Explain [topic] by starting with one everyday example. Then give the rule."',
          'Test B \u2014 Step-by-step: "Explain [topic] as four short numbered steps. Use simple words."',
          'Test C \u2014 Big-picture or visual-first: "Explain [topic] by describing the big picture or a simple diagram first, then connect the details."',
        ],
      },
      {
        title: 'Active comparison \u2014 Explain Mode versus Hint Mode',
        content: [
          'Choose a problem you can attempt but cannot solve instantly.',
          'Round A \u2014 Explain Mode: "Explain how to solve this type of problem. Use a similar example, not my exact answer. Then ask one check question." Try the original problem yourself afterward.',
          'Round B \u2014 Hint Mode: Start a fresh attempt and send: "Give me one hint only. Do not solve it. Wait for my attempt before giving another hint."',
          'Rate understanding, thinking effort, and temptation to copy for each round.',
          'Explain Mode may help when you are missing the whole method. Hint Mode may help when you already understand enough to take the next step.',
        ],
      },
      {
        title: 'Verification Ritual',
        content: [
          'AI can sound confident while being incomplete or wrong. Verification is not a punishment; it is how you stay smarter than the tool.',
          '1. Does it make sense?',
          '2. Can I explain it myself?',
          '3. Can I check it with a trusted source, calculation, or example?',
          '4. What might be missing?',
          'Choose one claim from Orion\'s explanation and verify it using these four questions.',
        ],
      },
    ],
    activity: {
      title: 'Three-Way Comparison & Verification',
      instructions: [
        'Run all three explanation tests (A, B, C) on your chosen topic.',
        'Then run the Explain vs Hint Mode comparison on a problem.',
        'Finally, verify one AI claim using the four-question ritual.',
      ],
      scenarios: [
        'Which opening made the idea easiest to follow \u2014 not merely the most fun?',
        'Which opening made you want to keep reading?',
        'Which opening gave you enough information without overwhelming you?',
        'Did any format work badly because Orion\'s explanation was unclear rather than because the format itself was wrong?',
        'Which format should Orion test first next time?',
      ],
      reflection: [
        'Which mode (Explain vs Hint) fit this situation better, and why?',
        'What claim did you verify, how did you check it, and what was the result?',
      ],
    },
    miniCheck: [
      'What are the three explanation tests you ran?',
      'What are the four steps of the Verification Ritual?',
      'Why might Hint Mode be better than Explain Mode for some problems?',
    ],
    teachBack: 'Describe the Verification Ritual and explain why it matters for staying smarter than the tool.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-04.png',
    title: 'Blueprint, Proof & Mastery Challenge',
    bigIdea: [
      'Your Learning Supercharger Blueprint is a set of tutor settings that Orion will test and improve. It is not a permanent label such as "I am only a visual learner."',
      'In this module, you choose how Orion should begin an explanation. Orion will try that opening first, then you will keep or change it based on evidence.',
    ],
    sections: [
      {
        title: 'Learning Supercharger Blueprint update',
        content: [
          'Choose the first explanation opening Orion should test with you:',
          'example-first: show a real example before the rule',
          'step-by-step: begin with a short sequence',
          'big-picture-first: show how the parts connect before details',
          'question-first: ask what the student already knows before explaining',
          'Your setting is based on evidence from your comparison. Confidence can be low, medium, or high. Review rule: Test again in Module 3 with a different topic.',
        ],
      },
      {
        title: 'Knowledge File update \u2014 How I Learn Best',
        content: [
          'Copy this record into your approved course profile. Orion should show you what changed and should not invent missing answers.',
          'module: 1',
          'record_type: experiment_result',
          'topic_tested: [your topic]',
          'explanation_start_to_test: [example-first | step-by-step | big-picture-first | question-first]',
          'best_mode_for_this_task: [explain | hint]',
          'evidence: [one-sentence result]',
          'confidence: [low | medium | high]',
          'rule_updated: explanation-start',
          'privacy: safe_for_tutor_project',
        ],
      },
      {
        title: 'Proof artifact \u2014 AI Learning Code Card',
        content: [
          'Complete this card to document your Module 1 learning:',
          'Topic tested:',
          'Mode that helped most:',
          'Explanation opening to test again:',
          'One weak prompt I improved:',
          'One claim I verified:',
          'What I did myself:',
          'Orion rule staged: explanation-start =',
          'Save or screenshot the completed card.',
        ],
      },
    ],
    activity: {
      title: 'Mastery Challenge \u2014 Keep Your Brain in the Game',
      instructions: [
        'Ask Orion for a medium puzzle or problem suitable for your age.',
        'Tell Orion: "Use Hint Mode. Give one hint at a time and never reveal the answer before I attempt it."',
        'Record your first attempt and each hint used.',
        'Solve it or explain exactly where you remain stuck.',
        'Teach the key idea back in two or three sentences.',
        'Verify one part of the final reasoning.',
      ],
      scenarios: [
        'I can choose a mode.',
        'I can improve a weak prompt.',
        'I can verify an AI claim.',
        'I can explain my first Blueprint rule.',
      ],
      reflection: [
        'What evidence shows that I \u2014 not Orion \u2014 did the thinking?',
        'What question do you want to learn how to ask better in Module 2?',
      ],
    },
    miniCheck: [
      'What is your current Blueprint explanation-start setting?',
      'What evidence supports that choice?',
      'Can you verify one part of your mastery challenge reasoning?',
    ],
    teachBack: 'Teach the key idea from your mastery challenge back in two or three sentences, showing evidence that you \u2014 not Orion \u2014 did the thinking.',
  },
};
