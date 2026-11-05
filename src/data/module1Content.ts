export type LessonSection = { title?: string; content: string[] };

export type NodeContent = {
  id: string;
  title: string;
  imageUrl?: string;
  bigIdea: string[];
  sections: LessonSection[];
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
    title: 'First-Win Character Lab & What AI Is Good At vs. Bad At',
    bigIdea: [
      'Module 1: Create Your Character & Learn the AI Learning Code — Before you use AI for schoolwork, you will experience a fast, concrete creative win: designing a recognizable character and locking in its rules with a Character Guardrail Card.',
      'Why start with a character? Because the exact same skill that keeps an AI character from drifting from scene to scene—clear constraints, one-at-a-time discovery, verification, and saved guardrails—is the skill that keeps an AI tutor from giving sloppy or dishonest school help.',
      'After your First-Win Character Lab, you will map the AI Capability Balance Sheet so you never fall into Cognitive Outsourcing (letting the machine do the thinking your brain needs to grow).',
    ],
    sections: [
      {
        title: 'First-Win Tutorial (Steps 1–2): Reference & Starting Character',
        content: [
          'Step 1: Open one fresh chat in your parent-approved AI tool (do not use your persistent PlayIQ Tutor Project chat yet—keep this creative test in its own chat). Inspect Orion below as an example of a consistent character with locked visual rules. You will create your own original character—do not recreate Orion.',
          'ASSET:/course-release/orion-reference.png|Orion Reference Sheet (Example Only)|Notice how Orion keeps the same holographic cyan hood, glowing chest emblem, and friendly proportions across poses. Your goal is to build your own original character that stays recognizable across scenes.',
          'Step 2: Create or describe your starting character. If your AI tool supports image generation, ask for a simple concept sketch; if your tool is text-only, use the text-only character blueprint route.',
          'PROMPT:Step 2 Starting Character Prompt|I am designing an original character for my PlayIQ First-Win Lab. Here is my initial idea: [describe your character idea in 1-2 sentences, e.g., a clockwork fox inventor or a cyber-botanist]. Do not generate a long story yet. Give me a short 4-bullet visual snapshot of this character so we can refine it.',
        ],
      },
      {
        title: 'First-Win Tutorial (Steps 3–5): 10-Question Discovery & Character Guardrail Card',
        content: [
          'Step 3: Instead of guessing everything at once, tell the AI to interview you one question at a time for 10 questions to lock in your character’s design.',
          'PROMPT:Step 3 Ten-Question One-at-a-Time Discovery Interview|Act as a Character Design Coach. Ask me 10 short discovery questions to lock in my character’s visual identity, personality, gear, and world. CRITICAL RULE: Ask only ONE question at a time and wait for my answer before asking the next question. Number each question (1 of 10, 2 of 10, etc.). Start with Question 1 now.',
          'Step 4: Once you answer the discovery questions, turn your answers into a structured Character Guardrail Card and review it before generating your final prompt.',
          'PROMPT:Step 4 Character Guardrail Card Builder|Using my answers, build a concise Character Guardrail Card with four exact sections:\n1. Character Name & Core Role\n2. Three Must-Keep Visual Features (features that must never disappear)\n3. Flexible Scene Details (what can change from scene to scene)\n4. Never-Change Rules (colors, proportions, or traits the AI must not alter)\nShow me the card and wait for my approval before writing any image prompt.',
          'Step 5: After you approve the Character Guardrail Card, ask the AI to generate one clean, reusable master image prompt (or detailed visual scene description if using a text-only account).',
          'PROMPT:Step 5 Custom Image Prompt Generator|My Character Guardrail Card is approved. Now write one copy-ready Master Character Prompt that includes my 3 Must-Keep Visual Features and Never-Change Rules so I can generate or describe my character consistently.',
        ],
      },
      {
        title: 'First-Win Tutorial (Steps 6–7): New-Scene Reuse Test & Local Kit Save',
        content: [
          'Step 6: Test whether your guardrails actually hold! Put your character into a brand-new action or setting and check what stayed consistent and what drifted.',
          'PROMPT:Step 6 New-Scene Reuse Test|Using my approved Character Guardrail Card, place my character in a completely new scene: [e.g., repairing a bridge in a rainstorm / studying at a futuristic desk]. Keep all 3 Must-Keep Visual Features identical. If my account is text-only, write a vivid 5-sentence visual scene check showing how each Must-Keep feature appears in the new setting.',
          'Step 7: Package and save your approved Character Guardrail Card on your device. Remember: a browser AI chat cannot automatically create folders on your computer—you must download or copy-paste the markdown file into your own local folder (e.g., PlayIQ_Character_Kit / My_Character_Card_v1.md) and reopen it to verify it saved.',
          'PROMPT:Step 7 Reusable Prompt — Package My Approved Build|Package my approved Character Guardrail Card as a clean Markdown file named My_Character_Card_v1.md so I can download or copy-paste it into my local PlayIQ_Character_Kit folder. Include my Character Name, 3 Must-Keep Features, Never-Change Rules, Reusable Scene Prompt, and 1 instruction improvement I discovered during the scene test.',
        ],
      },
      {
        title: 'Part 0: Lightning Hook — Choose Your Power',
        content: [
          'Imagine you have 20 minutes before a big test. You can pick one AI power. Which would you choose?',
          'A. "Give me all the answers so I can memorize them."',
          'B. "Explain the three hardest ideas simply and then quiz me."',
          'C. "Find where I am confused and fix only that part."',
          'Your choice reveals how you use power. Option A feels fast in the moment, but it leaves your brain weaker when the test sheet is in front of you. Options B and C use AI as a learning multiplier so the skill stays inside your head.',
        ],
      },
      {
        title: 'Part 1: What AI Is Good At vs. Bad At (The Capability Balance Sheet)',
        content: [
          'AI is a pattern-prediction engine, not a truth engine. To stay in control of the genie, you must know what AI is naturally strong at and where it fails.',
          '• AI IS EXCELLENT AT: Explaining ideas in multiple ways (analogies, steps, diagrams), generating practice questions, breaking big tasks into small steps, spotting gaps in your explanation, and brainstorming examples.',
          '• AI IS TERRIBLE AT: Guaranteeing 100% factual accuracy (it can hallucinate fake dates, quotes, or math steps with total confidence), knowing what your teacher emphasized in class today, caring whether you actually learned, and replacing your own human judgment.',
          'Why this matters: When you hand over the thinking step to AI—called Cognitive Outsourcing—your prompt looks productive, but your brain skips the exact struggle that builds memory and skill.',
        ],
      },
    ],
    activity: {
      title: 'First-Win Character Check & AI Capability Audit (Activity 1)',
      instructions: [
        'Complete your Character Guardrail Card check and classify each school AI use case below as Good Use, Risky Use, or Bad Use (Cognitive Outsourcing), explaining why in 1–2 sentences.',
      ],
      scenarios: [
        'Character Lab Check: Name your character, list its 3 Must-Keep Features, and state one instruction improvement that kept it consistent in Step 6.',
        'Scenario 1: Asking AI to explain a confusing science concept using a skateboarding analogy, then explaining it back in your own words.',
        'Scenario 2: Pasting an entire math worksheet into AI and typing "Solve 1–20 for me."',
        'Scenario 3: Asking AI to quiz you one question at a time on your history notes and waiting for your answer before showing the correction.',
        'Scenario 4: Copying an AI-written paragraph directly into your English essay because it sounds more "professional" than your draft.',
        'Scenario 5: Asking AI for a 3-step study plan when you have three tests on Friday and feel overwhelmed.',
      ],
      reflection: [
        'How is locking Must-Keep Features on a Character Guardrail Card similar to setting rules for how an AI tutor helps you with schoolwork?',
        'Where on your device did you save My_Character_Card_v1.md, and did you reopen it to verify the text is complete?',
      ],
    },
    miniCheck: [
      'Why must you ask discovery questions one at a time and build a Character Guardrail Card before expecting consistent results from AI?',
      'What is Cognitive Outsourcing, and why does it hurt your performance on real tests?',
      'Name two things AI is excellent at and two things AI is terrible at.',
    ],
    teachBack: 'Explain to a classmate how building a Character Guardrail Card teaches you to control AI, and why trusting AI blindly or letting it do your homework is a trap.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-02.png',
    title: 'Choosing the Right AI Mode (The 6 PlayIQ AI Modes)',
    bigIdea: [
      'If you just say "Help me with this," AI guesses what role to play—and usually defaults to dumping a long wall of text or giving away the final answer.',
      'In PlayIQ, you command the genie by declaring one of the 6 PlayIQ AI Modes at the start of your prompt: Explain Mode, Hint Mode, Quiz Mode, Coach Mode, Learn-My-Way Mode, or Lesson Rescue Mode.',
      'Each mode has a specific job and a specific boundary ("what NOT to do") so you stay in the driver’s seat.',
    ],
    sections: [
      {
        title: 'Modes 1–3: Explain Mode, Hint Mode & Quiz Mode',
        content: [
          '1. Explain Mode — Use when a topic is brand new or confusing and you need a clear mental model first.',
          'PROMPT:Mode 1 — Explain Mode Master Prompt|Use Explain Mode. Explain [topic] using one everyday analogy and 3 short steps. Keep it under 150 words, do not do my assignment for me, and end with 1 question asking me to explain the core idea back in my own words.',
          '2. Hint Mode — Use when you are working on a problem, have already made an attempt, and got stuck on the next step.',
          'PROMPT:Mode 2 — Hint Mode Master Prompt|Use Hint Mode. Here is the problem: [paste problem] and here is what I tried so far: [your attempt]. Give me ONE short hint for the next step only. Do NOT solve the problem or reveal the final answer. Wait for my next attempt.',
          '3. Quiz Mode — Use when you think you know the material and want to prove what you can recall without looking at your notes.',
          'PROMPT:Mode 3 — Quiz Mode Master Prompt|Use Quiz Mode. Quiz me on [topic] with 5 questions, asking ONE question at a time. Wait for my answer after each question, tell me what I got right or wrong, and do not reveal the next question until I respond.',
        ],
      },
      {
        title: 'Modes 4–6: Coach Mode, Learn-My-Way Mode & Lesson Rescue Mode',
        content: [
          '4. Coach Mode — Use when you have a big assignment, project, or study session and feel overwhelmed about how to start or organize your time.',
          'PROMPT:Mode 4 — Coach Mode Master Prompt|Use Coach Mode. I need to complete [assignment/goal] and I have [time available]. Break this into 3 short, doable work blocks. Tell me only Step 1 to start right now. I will do the actual writing and thinking myself.',
          '5. Learn-My-Way Mode — Use when a standard textbook explanation is not clicking and you want to test a specific explanation opening (e.g., Analogy-First, Step-by-Step, or Big-Picture Map).',
          'PROMPT:Mode 5 — Learn-My-Way Mode Master Prompt|Use Learn-My-Way Mode. Re-explain [topic] by starting with [an everyday sports/gaming analogy | 4 numbered steps | a big-picture system map], then connect it to the exact school vocabulary term.',
          '6. Lesson Rescue Mode — Use when you walked out of class feeling lost and cannot even tell where the lesson stopped making sense.',
          'PROMPT:Mode 6 — Lesson Rescue Mode Master Prompt|Use Lesson Rescue Mode. I am confused about [topic]. Do not re-explain the whole chapter. Ask me 2 quick diagnostic questions, one at a time, to locate the exact fracture point where my understanding broke, then repair only that missing piece.',
        ],
      },
    ],
    activity: {
      title: 'Activity 2: Match the Situation to the Right PlayIQ Mode',
      instructions: [
        'For each school scenario (A–E), name the best PlayIQ AI Mode (Explain, Hint, Quiz, Coach, Learn-My-Way, or Lesson Rescue) and write the 1-sentence command you would send to Orion.',
      ],
      scenarios: [
        'Situation A: You solved the first half of a linear equation, but your negative signs look wrong and you do not want the final answer spoiled.',
        'Situation B: You have a Biology test tomorrow morning and want to make sure you actually remember the stages of mitosis without looking at your notes.',
        'Situation C: Your teacher explained chemical bonding for 40 minutes today and you feel completely lost—you are not even sure which part confused you first.',
        'Situation D: You have a history project, a math review, and English reading due in two days and you are frozen staring at your screen.',
        'Situation E: Your textbook defines "opportunity cost" in dry economic jargon that puts you to sleep, and you want to see it through a video-game inventory example first.',
      ],
      reflection: [
        'Which of the 6 PlayIQ AI Modes do you need most in your hardest class this week, and why?',
        'What happens if you use Explain Mode when you really needed Hint Mode or Quiz Mode?',
      ],
    },
    miniCheck: [
      'List all 6 PlayIQ AI Modes and the primary purpose of each.',
      'What is the key difference between Explain Mode and Lesson Rescue Mode?',
      'Why does every strong Mode prompt include a boundary telling the AI what NOT to do?',
    ],
    teachBack: 'Explain to a younger student how to choose between Hint Mode, Quiz Mode, and Lesson Rescue Mode when studying for a difficult class.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-03.png',
    title: 'Ask Better Questions (6-Rung Ladder) & Verify Before You Believe',
    bigIdea: [
      'Vague questions produce generic, unhelpful AI output. Specific, high-rung questions force the AI to coach you at the exact level your brain needs.',
      'Even when you ask a Rung 5 or Rung 6 question, AI can still state a falsehood in a polished, confident tone. That is why every PlayIQ apprentice uses the 4-Step Verification Ritual before trusting any AI claim.',
    ],
    sections: [
      {
        title: 'Part 3: The 6-Rung Question Ladder',
        content: [
          'Whenever you type a prompt, check which rung of the Question Ladder you are standing on:',
          '1. Rung 1 — Answer-Grabber (Weakest): "What is the answer to #4?" (Zero learning; outsources your brain.)',
          '2. Rung 2 — Topic Dump: "Tell me about the Civil War." (Too broad; produces a giant wall of textbook text.)',
          '3. Rung 3 — Targeted Explain: "Explain the main economic cause of the Civil War in 3 simple bullet points."',
          '4. Rung 4 — Diagnostic & Hint: "Here is my attempt at #4: [attempt]. Give me one hint on where my setup went wrong without solving it."',
          '5. Rung 5 — Active Recall & Stress-Test: "Quiz me one question at a time on the causes of the Civil War and challenge any vague answer I give."',
          '6. Rung 6 — System & Rule Builder (Strongest): "Use Lesson Rescue Mode to find what I am missing about [topic], test whether an analogy or step-by-step fix works better, and help me turn the fix into a study rule."',
        ],
      },
      {
        title: 'Part 4: The 4-Step PlayIQ Verification Ritual & AI Voice vs. Human Voice',
        content: [
          'AI sounds just as confident when it is making things up as when it is right. Run the 4-Step Verification Ritual on every important claim:',
          'Step 1: Sense Check — Does this actually make logical sense given what I already know, or does something feel off?',
          'Step 2: Self-Explain Check — Can I explain WHY this is true in my own plain human words without parroting the AI’s phrasing?',
          'Step 3: Source Cross-Check — Can I verify this specific date, formula, quote, or rule against my class notes, textbook, or a trusted primary source?',
          'Step 4: Missing-Piece Check — What nuance, exception, or classroom rule did the AI leave out?',
          'Weak: Copying "AI Voice" (bloated, generic phrases like "Delving into the multifaceted tapestry of photosynthesis, it is crucial to underscore...").',
          'Safer: Writing in authentic "Human Voice" (clear, direct sentences you can explain out loud at the dinner table or in class).',
        ],
      },
      {
        title: 'Activity 4 Preview: Spot the Problem in 5 Confident AI Claims',
        content: [
          'Look closely at these 5 confident AI statements—each one has a trap you will analyze in your activity:',
          '• Claim 1 (Photosynthesis): "Plants perform photosynthesis only at night because moonlight activates chlorophyll without overheating the leaves." (False science!)',
          '• Claim 2 (History): "The American Civil War officially ended in 1992 with the signing of the Treaty of Paris." (Hallucinated date and wrong treaty!)',
          '• Claim 3 (Math Trap): "To add 1/3 + 1/4, simply add the tops and bottoms to get 2/7." (Broken denominator rule!)',
          '• Claim 4 (Physics Over-Precision): "Light travels at exactly 300,000,000 meters per second in every material, including diamond and water, without ever slowing down." (Missing piece: light slows down in denser media like water and glass!)',
          '• Claim 5 (Chemistry Over-Generalization): "Water always boils at 100°C no matter where you are on Earth, even at the top of Mount Everest." (Missing piece: atmospheric pressure changes boiling point!)',
        ],
      },
    ],
    activity: {
      title: 'Activity 3 & 4: Climb the Question Ladder & Spot the AI Errors',
      instructions: [
        'Part A (Scenarios 1–3): Upgrade each Rung 1–2 weak prompt into a Rung 4–6 coaching prompt that names a PlayIQ Mode and keeps you doing the thinking.',
        'Part B (Scenarios 4–5): Apply the 4-Step Verification Ritual to explain what is wrong with the confident AI claims and how you would verify them.',
      ],
      scenarios: [
        'Upgrade Prompt 1: Weak prompt — "What is the answer to question 4 on my algebra homework?"',
        'Upgrade Prompt 2: Weak prompt — "Write my history paragraph about the Industrial Revolution."',
        'Upgrade Prompt 3: Weak prompt — "I don’t get biology. Explain cells."',
        'Verification Check 4: Why did Claim 2 ("The Civil War ended in 1992 with the Treaty of Paris") and Claim 3 ("1/3 + 1/4 = 2/7") sound convincing, and which step of the Verification Ritual catches each one?',
        'Verification Check 5: Look at Claim 5 ("Water always boils at 100°C even on Mount Everest"). Which step of the 4-Step Verification Ritual catches this error, and what is the missing scientific factor?',
      ],
      reflection: [
        'Why is "AI Voice" easy for teachers to spot, and why does rewriting an idea in your own human voice prove you actually learned it?',
        'Which rung of the 6-Rung Question Ladder have you used most in the past, and which rung will you aim for this week?',
      ],
    },
    miniCheck: [
      'What is the difference between a Rung 1 prompt and a Rung 4–6 prompt on the Question Ladder?',
      'Name all 4 steps of the PlayIQ Verification Ritual in order.',
      'How can an AI answer have a correct-sounding tone (or even a lucky final number) while still teaching you a broken method?',
    ],
    teachBack: 'Walk through the 4-Step PlayIQ Verification Ritual using one concrete example of an AI mistake, and explain how to upgrade a weak homework prompt into a Rung 5 or Rung 6 learning prompt.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-04.png',
    title: 'Learn How You Learn Lab, Active Experiment & Blueprint Update',
    bigIdea: [
      'Your Module 00 Learning Blueprint gave you a starting hypothesis for how you like explanations to open—not a permanent label.',
      'In this lab, you become a scientist of your own brain: you will test three different explanation openings (Analogy-First, Step-by-Step, and Big-Picture Map) on the same real topic, score them on Clarity, Focus, and 60-Second Recall, and then pit Explain Mode against Hint Mode.',
      'Finally, you will record your evidence-backed `explanation-start` setting in your Course Learning Record.',
    ],
    sections: [
      {
        title: 'Part 5: Learn How You Learn Lab — Three-Way Explanation Style Test',
        content: [
          'Pick ONE real school topic you are studying this week (for example: cellular respiration, quadratic functions, supply and demand, or plate tectonics). Run all three prompts below on that exact same topic:',
          'PROMPT:Test A — Analogy-First Opening|Explain [topic] using an Analogy-First opening: start with one vivid everyday or sports/gaming analogy in 3 sentences, then connect the analogy to the real academic definition. End with 1 recall check question.',
          'PROMPT:Test B — Step-by-Step Opening|Explain [topic] using a Step-by-Step opening: break the mechanism into 4 short numbered steps from start to finish using plain language. End with 1 recall check question.',
          'PROMPT:Test C — Big-Picture Map Opening|Explain [topic] using a Big-Picture Map opening: first show how the whole system fits together in a simple text diagram or 3-part overview map, then zoom into the key detail. End with 1 recall check question.',
          'Score each test (A, B, and C) from 1 to 5 on three criteria: (1) Clarity — how fast did it click? (2) Focus — did it hold your attention without overwhelm? (3) 60-Second Recall — close the screen for 60 seconds and see how much you can explain from memory.',
        ],
      },
      {
        title: 'Part 6: Active Experiment — Explain Mode vs. Hint Mode',
        content: [
          'Next, pick two similar practice problems in your Rescue Target subject.',
          'Round 1 (Explain Mode): Ask AI to explain the method using a similar example first, then solve Problem 1 on your own.',
          'Round 2 (Hint Mode): Start Problem 2 cold and ask AI for ONE hint at a time only when you hit a wall.',
          'Compare your two rounds honestly: Which mode required more active brain effort? Which mode left you more confident that you could solve a third problem on a closed-book quiz?',
        ],
      },
      {
        title: 'Parts 7 & 8: Blueprint Update (explanation-start) & Course Learning Record',
        content: [
          'Based on your lab scores, stage your provisional `explanation-start` rule for your AI Tutor (`analogy-first`, `step-by-step`, `big-picture-map`, or `question-first`). Remember: this is an evidence-backed setting for this subject that we will re-test in Module 3—not a permanent label on your intelligence.',
          'PROMPT:Part 8 — Module 1 Course Learning Record Checkpoint Prompt|Here are my Module 1 lab results for my PlayIQ Course Learning Record:\n- Topic tested: [your topic]\n- Test A (Analogy-First) score (Clarity/Focus/Recall out of 15): [score]\n- Test B (Step-by-Step) score (out of 15): [score]\n- Test C (Big-Picture Map) score (out of 15): [score]\n- Winning explanation-start hypothesis: [analogy-first | step-by-step | big-picture-map]\n- Explain Mode vs. Hint Mode finding: [which mode helped more and why]\n- One claim I verified using the 4-Step Verification Ritual: [claim + how I checked it]\nPlease review these results, mark any untested areas as pending_validation, and draft my concise Module 1 Course Learning Record entry for my approval.',
        ],
      },
    ],
    activity: {
      title: 'Learn How You Learn Lab Scorecard & Blueprint Staging',
      instructions: [
        'Record your actual findings from the Three-Way Explanation Style Test (Tests A, B, and C) and the Explain Mode vs. Hint Mode experiment.',
      ],
      scenarios: [
        'Topic Tested & Scores: Which school topic did you test, and what were your Clarity, Focus, and 60-Second Recall scores (1–5) for Test A (Analogy-First), Test B (Step-by-Step), and Test C (Big-Picture Map)?',
        'Winning Explanation Opening: Which opening (`analogy-first`, `step-by-step`, or `big-picture-map`) made the concept click fastest—and did it match or surprise your Module 00 hypothesis?',
        'Explain vs. Hint Mode Experiment: On your practice problem, when did Explain Mode help more and when did Hint Mode keep your brain more engaged?',
        'Live Verification Record: State one factual claim from your AI lab today and how you verified it using the 4-Step Verification Ritual.',
      ],
      reflection: [
        'Write your plain-English `explanation-start` rule in one sentence (e.g., "When I start a new topic in Biology, open with a 3-sentence everyday analogy before giving numbered steps").',
        'Why is it important to treat your Blueprint setting as a testable hypothesis rather than a fixed "learning style" box?',
      ],
    },
    miniCheck: [
      'What are the three criteria you used to score Test A, Test B, and Test C in the Learn How You Learn Lab?',
      'When is Hint Mode a better choice than Explain Mode?',
      'What is your staged `explanation-start` rule for Module 1, and what evidence from your lab supports it?',
    ],
    teachBack: 'Summarize your Learn How You Learn Lab results in 2–3 sentences, explaining which explanation opening won, how Explain Mode compared to Hint Mode, and why your Blueprint rule is a hypothesis you will keep testing.',
  },
};
