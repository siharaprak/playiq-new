export interface ModuleQuizQuestion {
  num: number;
  name: 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6';
  prompt: string;
  options: { value: 'a' | 'b' | 'c' | 'd'; label: string }[];
  correctValue: 'a' | 'b' | 'c' | 'd';
}

export interface ModuleBossScenario {
  id: number;
  text: string;
  expectedLabel: 'superpower' | 'superweapon';
}

export interface CourseModule3To12Config {
  moduleNum: number;
  skillTreeSubtitle: string;
  title: string;
  subtitle: string;
  pdfTitle: string;
  videoSrc?: string;
  whatYouWillLearnGood: string[];
  whatYouWillAvoidBad: string[];
  quizTitle: string;
  quizSubtitle: string;
  quizQuestions: ModuleQuizQuestion[];
  quizAppliedPrompts: [string, string];
  bossBattleTitle: string;
  bossBattleSubtitle: string;
  bossScenarios: ModuleBossScenario[];
  bossReflections: [string, string, string];
  tierUnlocked: string;
  completionSummary: string;
  unlockBullets: string[];
}

export const COURSE_MODULES_3_TO_12_CONFIG: Record<number, CourseModule3To12Config> = {
  3: {
    moduleNum: 3,
    skillTreeSubtitle: 'Module 3 • Skill Tree: The Pre-Learn System',
    title: 'The Pre-Learn System',
    subtitle:
      'Prime your brain before class with a 5-Part Pre-Learn Map, compare Map-First, Example-First, and Question-First entries, and walk into class with a 10-Line Pre-Learn Brief.',
    pdfTitle: 'Module 3 Student Guide: The Pre-Learn System',
    videoSrc: '/videos/module_3_intro.mp4',
    whatYouWillLearnGood: [
      'Build a 5-Part Pre-Learn Map (Headline, 5 Landmarks, 5 Power Words, Anchor Example, Golden Question)',
      'Test Map-First, Example-First, and Question-First openings in the 3-Way Entry Trial',
      'Use examples and non-examples to spot concept boundaries',
      'Walk into class with a 10-Line Pre-Learn Brief and mark uncertain lines "I need to check"',
    ],
    whatYouWillAvoidBad: [
      'Walking into a brand-new class lecture cold and overwhelmed',
      'Letting AI dump a 5-page textbook chapter before you know the map',
      'Guessing an uncertain line instead of marking "I need to check"',
      'Treating your first arrival choice as a permanent learning-style label',
    ],
    quizTitle: 'Module 3 Quiz — The Pre-Learn System',
    quizSubtitle: 'Verify your mastery of the 5-Part Map, 3-Way Entry Trial, non-examples, and the 10-Line Pre-Learn Brief (80%+ unlocks the Boss Battle).',
    quizQuestions: [
      {
        num: 1,
        name: 'q1',
        prompt: '1. What is the main goal of Pre-Learning before class?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Memorize the entire textbook chapter word-for-word the night before' },
          { value: 'b', label: 'B. Build a small mental map, key terms, and one Golden Question so class feels familiar instead of overwhelming' },
          { value: 'c', label: 'C. Have AI finish next week’s homework early' },
          { value: 'd', label: 'D. Skip paying attention in class' },
        ],
      },
      {
        num: 2,
        name: 'q2',
        prompt: '2. Which five elements belong in the 5-Part Pre-Learn Map?',
        correctValue: 'c',
        options: [
          { value: 'a', label: 'A. Five pages of copied Wikipedia paragraphs' },
          { value: 'b', label: 'B. Only a list of dates and formulas' },
          { value: 'c', label: 'C. Headline, 5 Landmarks, 5 Power Vocabulary Words, Anchor Example, and Golden Question' },
          { value: 'd', label: 'D. A finished essay and bibliography' },
        ],
      },
      {
        num: 3,
        name: 'q3',
        prompt: '3. Why do you pair an example with a non-example during pre-learning?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Because non-examples are always funnier' },
          { value: 'b', label: 'B. Because seeing both what a concept is and what it is not reveals the exact boundary of the concept' },
          { value: 'c', label: 'C. To make your notes twice as long' },
          { value: 'd', label: 'D. So you do not need to verify sources' },
        ],
      },
      {
        num: 4,
        name: 'q4',
        prompt: '4. What are the three entry approaches tested in the 3-Way Entry Trial?',
        correctValue: 'a',
        options: [
          { value: 'a', label: 'A. Map-First (Atlas Guide), Example-First (Gameplay Trailer), and Question-First (Quest Log)' },
          { value: 'b', label: 'B. Fast, Medium, and Slow typing' },
          { value: 'c', label: 'C. Audio, Video, and VR only' },
          { value: 'd', label: 'D. Copy, Paste, and Submit' },
        ],
      },
      {
        num: 5,
        name: 'q5',
        prompt: '5. When filling out your 10-Line Pre-Learn Brief, what should you write if a line is uncertain?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Make up a confident-sounding guess' },
          { value: 'b', label: 'B. Write "I need to check" / "CHECK IN CLASS" and verify it with your teacher or source' },
          { value: 'c', label: 'C. Delete the whole brief' },
          { value: 'd', label: 'D. Assume AI is always 100% right' },
        ],
      },
      {
        num: 6,
        name: 'q6',
        prompt: '6. How should your Tutor treat your `pre-learn-sequence` Blueprint setting?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. As an unchangeable diagnosis of your brain forever' },
          { value: 'b', label: 'B. As a provisional starting sequence to test again on other subjects' },
          { value: 'c', label: 'C. As a replacement for going to class' },
          { value: 'd', label: 'D. As a secret password' },
        ],
      },
    ],
    quizAppliedPrompts: [
      '7. Describe the difference between Map-First, Example-First, and Question-First pre-learning on your topic.',
      '8. Write the Golden Question you prepared for your upcoming class and why it matters.',
    ],
    bossBattleTitle: 'The Pre-Learn Pioneer Boss Battle',
    bossBattleSubtitle: 'Evaluate each pre-learning move: label whether it builds a real mental map (Superpower) or creates passive overwhelm/shortcutting (Superweapon), explain why, and name the strongest next move.',
    bossScenarios: [
      {
        id: 1,
        text: 'You paste a 20-page chapter into AI 5 minutes before class and ask it to "summarize everything" without reading or checking a single term.',
        expectedLabel: 'superweapon',
      },
      {
        id: 2,
        text: 'You spend 10 minutes before class building a 5-Part Pre-Learn Map and walking in with one Golden Question to listen for.',
        expectedLabel: 'superpower',
      },
      {
        id: 3,
        text: 'When filling out Line 9 of your Pre-Learn Brief, you guess a formula you are unsure about instead of marking "I need to check in class."',
        expectedLabel: 'superweapon',
      },
      {
        id: 4,
        text: 'You assume that because Example-First felt fun once, you are permanently incapable of using a concept map in any other subject.',
        expectedLabel: 'superweapon',
      },
      {
        id: 5,
        text: 'You ask Orion for two real-world examples and one non-example of a new science term so you can spot the boundary before the lecture.',
        expectedLabel: 'superpower',
      },
      {
        id: 6,
        text: 'You cover your 10-Line Pre-Learn Brief for 60 seconds and test what you can recall in your own words to see which part needs attention in class.',
        expectedLabel: 'superpower',
      },
    ],
    bossReflections: [
      'How did building a 5-Part Map and 10-Line Brief change how ready you feel for your upcoming class?',
      'Which entry sequence (Map-First, Example-First, or Question-First) worked best on this topic, and what is your evidence?',
      'When will you retest your `pre-learn-sequence` setting on a different subject?',
    ],
    tierUnlocked: 'Pre-Learn Pioneer',
    completionSummary:
      'You now know how to prime your brain before class with a 5-Part Map, test Map-First vs. Example-First vs. Question-First openings, and walk into class with a 10-Line Pre-Learn Brief.',
    unlockBullets: [
      '5-Part Pre-Learn Map (Headline, Landmarks, Power Words, Anchor, Golden Question)',
      '3-Way Entry Trial (Map-First, Example-First, Question-First)',
      '10-Line Pre-Learn Brief & 60-Second Recall Check',
      'Provisional Blueprint Rule: pre-learn-sequence',
    ],
  },

  4: {
    moduleNum: 4,
    skillTreeSubtitle: 'Module 4 • Skill Tree: Lesson Rescue Mode',
    title: 'Lesson Rescue Mode',
    subtitle:
      'Use the 4 moves of Lesson Rescue Mode (Stop, Name, Choose, Prove), scan line-by-line with G / M / S, diagnose the 6 Gap Types, and compare Analogy, Step-by-Step, and Diagnostic-Question rescues.',
    pdfTitle: 'Module 4 Student Guide: Lesson Rescue Mode',
    videoSrc: '/videos/module_4_intro.mp4',
    whatYouWillLearnGood: [
      'Apply the 4 moves of Lesson Rescue Mode: Stop, Name, Choose, Prove',
      'Scan confusing passages line-by-line using G (Got it), M (Maybe), and S (Stop)',
      'Diagnose the 6 Gap Types (Word, Background, Step, Connection, Overload, Expectation)',
      'Compare Analogy, Step-by-Step, and Diagnostic-Question rescues on the same chunk',
    ],
    whatYouWillAvoidBad: [
      'Saying "I don’t get any of this" and asking AI to re-explain the entire chapter',
      'Letting AI solve the whole problem while you stay stuck on the missing step',
      'Confusing an Expectation Gap (not knowing what the rubric wants) with a Concept Gap',
      'Treating a helpful rescue method on one topic as a permanent brain label',
    ],
    quizTitle: 'Module 4 Quiz — Lesson Rescue Mode',
    quizSubtitle: 'Verify your mastery of the 4 Rescue Moves, the G/M/S Confusion Scanner, the 6 Gap Types, and the 3 Rescue Methods (80%+ unlocks the Boss Battle).',
    quizQuestions: [
      {
        num: 1,
        name: 'q1',
        prompt: '1. What are the four moves of Lesson Rescue Mode?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Copy, Paste, Submit, Forget' },
          { value: 'b', label: 'B. Stop, Name, Choose, Prove' },
          { value: 'c', label: 'C. Skim, Guess, Reread, Hope' },
          { value: 'd', label: 'D. Ask AI for the final answer immediately' },
        ],
      },
      {
        num: 2,
        name: 'q2',
        prompt: '2. In the line-by-line Confusion Scanner, what do G, M, and S stand for?',
        correctValue: 'c',
        options: [
          { value: 'a', label: 'A. Good, Medium, Slow' },
          { value: 'b', label: 'B. Grade, Mark, Score' },
          { value: 'c', label: 'C. G = I get it well enough to explain it; M = Maybe (recognize but cannot explain yet); S = Stop (where I lose the thread)' },
          { value: 'd', label: 'D. Guess, Memorize, Skip' },
        ],
      },
      {
        num: 3,
        name: 'q3',
        prompt: '3. "The teacher went from line 2 to line 3 of the equation and I cannot reproduce that move." Which gap type is most likely?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Word gap' },
          { value: 'b', label: 'B. Step gap' },
          { value: 'c', label: 'C. Expectation gap' },
          { value: 'd', label: 'D. Overload gap' },
        ],
      },
      {
        num: 4,
        name: 'q4',
        prompt: '4. "I know the vocabulary words, but I cannot tell why Event A caused Event B." Which gap type is most likely?',
        correctValue: 'a',
        options: [
          { value: 'a', label: 'A. Connection gap' },
          { value: 'b', label: 'B. Expectation gap' },
          { value: 'c', label: 'C. Careless error' },
          { value: 'd', label: 'D. Word gap' },
        ],
      },
      {
        num: 5,
        name: 'q5',
        prompt: '5. Why do you test Analogy, Step-by-Step, and Diagnostic-Question rescues on the SAME confusing chunk?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. To get three different homework answers to turn in' },
          { value: 'b', label: 'B. Keeping the chunk the same makes the comparison fair so you can see which rescue move actually improved understanding' },
          { value: 'c', label: 'C. Because AI only works three times per day' },
          { value: 'd', label: 'D. To prove you can only learn one way forever' },
        ],
      },
      {
        num: 6,
        name: 'q6',
        prompt: '6. How do you complete the "Prove" move at the end of a Lesson Rescue?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Say "Okay, makes sense!" and close the laptop' },
          { value: 'b', label: 'B. Explain the repaired piece in your own words and answer a similar check question yourself' },
          { value: 'c', label: 'C. Copy Orion’s explanation into your homework' },
          { value: 'd', label: 'D. Skip the check question' },
        ],
      },
    ],
    quizAppliedPrompts: [
      '7. Describe a real confusion point you scanned with G / M / S and the Gap Type hypothesis you named.',
      '8. Which rescue move (Analogy, Step-by-Step, or Diagnostic-Question) worked best for you, and what is your fallback move if the first one does not help?',
    ],
    bossBattleTitle: 'Lesson Rescue Master Challenge',
    bossBattleSubtitle: 'Evaluate each Lesson Rescue scenario: label whether it isolates and repairs the real gap (Superpower) or masks confusion with a shortcut (Superweapon).',
    bossScenarios: [
      {
        id: 1,
        text: 'You feel lost on a physics worksheet, so you paste the whole page into AI and copy the final numerical answers without finding which step confused you.',
        expectedLabel: 'superweapon',
      },
      {
        id: 2,
        text: 'You mark G, M, and S line-by-line on a worked example, stop at the first S between Line 2 and Line 3, and ask Orion to explain only that missing step.',
        expectedLabel: 'superpower',
      },
      {
        id: 3,
        text: 'After reading an AI analogy, you nod and say "Got it!" without trying to explain the concept in your own words or solving a check question.',
        expectedLabel: 'superweapon',
      },
      {
        id: 4,
        text: 'You are unsure what "compare and contrast with evidence" means on an essay prompt, so you ask AI to write the essay instead of translating the rubric into a checklist.',
        expectedLabel: 'superweapon',
      },
      {
        id: 5,
        text: 'When a page has 7 new terms and 2 diagrams at once, you name an Overload Gap and ask Orion to break it into 3 small chunks one at a time.',
        expectedLabel: 'superpower',
      },
      {
        id: 6,
        text: 'After a Step-by-Step rescue, you close the AI chat, explain why the step works in your own words, and solve a matched practice step yourself.',
        expectedLabel: 'superpower',
      },
    ],
    bossReflections: [
      'How does stopping at the first M or S line save time compared to re-reading a whole chapter?',
      'What confounding factors (such as topic familiarity, tiredness, or prompt wording) could affect which rescue method felt best today?',
      'What did you set as your provisional `rescue-start` rule and fallback move?',
    ],
    tierUnlocked: 'Lesson Rescue Specialist',
    completionSummary:
      'You can now stop at the exact line where understanding breaks, diagnose the Gap Type, run a targeted rescue move, and prove understanding in your own words.',
    unlockBullets: [
      '4 Moves of Lesson Rescue: Stop, Name, Choose, Prove',
      'Line-by-Line G / M / S Confusion Scanner',
      '6 Gap Types & 3 Rescue Methods Compared',
      'Provisional Blueprint Rule: rescue-start + fallback',
    ],
  },

  5: {
    moduleNum: 5,
    skillTreeSubtitle: 'Module 5 • Skill Tree: Compression Learning',
    title: 'Compression Learning',
    subtitle:
      'Turn a full lesson into a 4-level Compression Ladder and One-Page Understanding Card without deleting accuracy, then compare Audio, Visual-Card, and Teach-Back retrieval.',
    pdfTitle: 'Module 5 Student Guide: Compression Learning',
    videoSrc: '/videos/module_5_intro.mp4',
    whatYouWillLearnGood: [
      'Distinguish true Compression (shrinking while keeping the core truth) from Deletion (leaving out critical conditions)',
      'Build the 4-Level Compression Ladder (Main Question, 1-Sentence Core, 3 Pillars, Accuracy Guardrail)',
      'Apply the 3-Ways Rule (Big-Picture, Step-by-Step, Example-First) on a One-Page Understanding Card',
      'Compare Audio, Visual-Card, and Teach-Back review formats using 5 closed-notes retrieval checks',
    ],
    whatYouWillAvoidBad: [
      'Oversimplifying a rule until it becomes scientifically or historically false',
      'Confusing "this summary looks neat and easy to read" with "I can actually retrieve it from memory"',
      'Copying AI bullet points without checking them against your source for accuracy',
      'Skipping the Accuracy Guardrail line',
    ],
    quizTitle: 'Module 5 Quiz — Compression Learning',
    quizSubtitle: 'Verify your mastery of the 4-Level Compression Ladder, the Accuracy Guardrail, the One-Page Understanding Card, and closed-notes retrieval testing (80%+ unlocks the Boss Battle).',
    quizQuestions: [
      {
        num: 1,
        name: 'q1',
        prompt: '1. What is the difference between Compression and Deletion?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Compression deletes all examples and conditions so the sentence is as short as possible' },
          { value: 'b', label: 'B. Compression shrinks the words while preserving the core mechanism and accuracy guardrail; deletion removes details that make the statement false' },
          { value: 'c', label: 'C. Deletion is better for exams' },
          { value: 'd', label: 'D. They mean the exact same thing' },
        ],
      },
      {
        num: 2,
        name: 'q2',
        prompt: '2. What are the four levels of the PlayIQ Compression Ladder?',
        correctValue: 'c',
        options: [
          { value: 'a', label: 'A. Title, Paragraph 1, Paragraph 2, Conclusion' },
          { value: 'b', label: 'B. Easy, Medium, Hard, Impossible' },
          { value: 'c', label: 'C. Main Question It Answers, One-Sentence Core, Three Supporting Pillars, and Accuracy Guardrail' },
          { value: 'd', label: 'D. Copy, Highlight, Reread, Print' },
        ],
      },
      {
        num: 3,
        name: 'q3',
        prompt: '3. Why does every Compression Ladder need an Accuracy Guardrail?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. To make the page look longer' },
          { value: 'b', label: 'B. Because short summaries can easily oversimplify; the guardrail states what must NOT be forgotten or confused' },
          { value: 'c', label: 'C. So AI can write your essay' },
          { value: 'd', label: 'D. Because teachers grade on font size' },
        ],
      },
      {
        num: 4,
        name: 'q4',
        prompt: '4. What are the three angles in the 3-Ways Rule?',
        correctValue: 'a',
        options: [
          { value: 'a', label: 'A. Big-Picture view, Step-by-Step sequence, and Example-First anchor' },
          { value: 'b', label: 'B. Morning, Afternoon, and Night' },
          { value: 'c', label: 'C. Fast, Loud, and Quiet' },
          { value: 'd', label: 'D. Guessing, Skimming, and Highlighting' },
        ],
      },
      {
        num: 5,
        name: 'q5',
        prompt: '5. In the Module 5 review comparison (Audio vs. Visual Card vs. Teach-Back), how do you measure what actually worked?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. By which format felt the most relaxing while looking at the page' },
          { value: 'b', label: 'B. By closing your notes and testing what you can actually retrieve across the 5 retrieval checks' },
          { value: 'c', label: 'C. By picking whichever had the prettiest colors' },
          { value: 'd', label: 'D. By asking AI to guess your favorite style' },
        ],
      },
      {
        num: 6,
        name: 'q6',
        prompt: '6. What should you do if an AI summary leaves out a key condition from your class notes?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Keep the AI version because it is shorter' },
          { value: 'b', label: 'B. Add the missing condition into your Accuracy Guardrail and correct the summary against your source' },
          { value: 'c', label: 'C. Throw away your class notes' },
          { value: 'd', label: 'D. Memorize the wrong version anyway' },
        ],
      },
    ],
    quizAppliedPrompts: [
      '7. Write the One-Sentence Core and the Accuracy Guardrail from your topic’s Compression Ladder.',
      '8. Compare what felt easiest during review with what actually helped you retrieve the most with your notes closed.',
    ],
    bossBattleTitle: 'Compression Master Challenge: Teach It Three Ways',
    bossBattleSubtitle: 'Evaluate each compression and review move: label whether it builds accurate, retrievable understanding (Superpower) or creates an oversimplified illusion of memory (Superweapon).',
    bossScenarios: [
      {
        id: 1,
        text: 'You compress "Water boils at 100°C at standard sea-level atmospheric pressure" into "Water always boils at 100°C everywhere" and delete the pressure condition.',
        expectedLabel: 'superweapon',
      },
      {
        id: 2,
        text: 'You build a 4-Level Compression Ladder in your own words and ask Orion to check whether your One-Sentence Core accidentally left out any crucial condition from your notes.',
        expectedLabel: 'superpower',
      },
      {
        id: 3,
        text: 'You stare at a color-coded visual summary card for 10 minutes, feel like it looks super familiar, and never test yourself with the card covered.',
        expectedLabel: 'superweapon',
      },
      {
        id: 4,
        text: 'You ask AI to condense a chapter into 3 bullets, copy them onto a flashcard without reading the chapter, and cannot explain what any of the 3 bullets mean.',
        expectedLabel: 'superweapon',
      },
      {
        id: 5,
        text: 'You explain your topic three ways (Big-Picture, Step-by-Step, and Example-First) on a One-Page Understanding Card, then close the card and test 5 retrieval checks.',
        expectedLabel: 'superpower',
      },
      {
        id: 6,
        text: 'You notice that Audio review felt easy but Teach-Back produced better closed-notes recall, so you record both observations honestly in your Learning Record.',
        expectedLabel: 'superpower',
      },
    ],
    bossReflections: [
      'What accuracy correction did you make when building your Compression Ladder?',
      'Which review format (Audio, Visual Card, or Teach-Back) produced the strongest closed-notes retrieval, and what other factors might have influenced the result?',
      'What is your provisional `review-start` setting and when will you retest it?',
    ],
    tierUnlocked: 'Compression Architect',
    completionSummary:
      'You can now compress complex lessons into a 4-Level Compression Ladder with an Accuracy Guardrail, explain ideas three ways, and separate what feels easy from what actually supports closed-notes retrieval.',
    unlockBullets: [
      '4-Level Compression Ladder & Accuracy Guardrail',
      'The 3-Ways Rule & One-Page Understanding Card',
      'Audio vs. Visual-Card vs. Teach-Back Retrieval Comparison',
      'Provisional Blueprint Rule: review-start',
    ],
  },

  6: {
    moduleNum: 6,
    skillTreeSubtitle: 'Module 6 • Skill Tree: Self-Testing & Mistake Bank',
    title: 'Self-Testing and Mistake Bank',
    subtitle:
      'Beat the fluency illusion with retrieval self-testing, classify mistakes across the 6 Mistake Bank categories, compare quiz formats, and set up a real parent-approved reminder plan.',
    pdfTitle: 'Module 6 Student Guide: Self-Testing and Mistake Bank',
    videoSrc: '/videos/module_6_intro.mp4',
    whatYouWillLearnGood: [
      'Replace passive rereading with the 6-step Self-Testing & Repair loop',
      'Classify errors using the 6 Mistake Bank categories (Knowledge gap, Word gap, Step error, Careless/attention error, Transfer error, Confidence error)',
      'Compare One-Question-at-a-Time vs. Full-Set quiz formats on real retrieval',
      'Build a Realistic Spaced-Review Plan using a real parent-approved reminder method (never assuming chat text schedules an alert)',
    ],
    whatYouWillAvoidBad: [
      'Rereading highlighted notes five times and mistaking familiarity for memory',
      'Hiding or deleting wrong answers instead of mining them in your Mistake Bank',
      'Assuming an AI chat message that says "I’ll remind you in 2 days" will actually send a notification',
      'Inventing fake PDI scores instead of recording honest correct / partial / not-yet retrieval results',
    ],
    quizTitle: 'Module 6 Quiz — Self-Testing and Mistake Bank',
    quizSubtitle: 'Verify your mastery of retrieval practice, the 6 Mistake Bank categories, quiz format comparison, and realistic spaced review (80%+ unlocks the Boss Battle).',
    quizQuestions: [
      {
        num: 1,
        name: 'q1',
        prompt: '1. Why does rereading notes often create a false sense of confidence?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Because reading is bad for your eyes' },
          { value: 'b', label: 'B. Recognizing words on an open page is much easier than retrieving the idea from memory when the page is closed' },
          { value: 'c', label: 'C. Because textbooks are always wrong' },
          { value: 'd', label: 'D. Because self-testing takes zero effort' },
        ],
      },
      {
        num: 2,
        name: 'q2',
        prompt: '2. Sam solves the practice example correctly but cannot apply the same principle in a word problem. Which Mistake Bank category fits best?',
        correctValue: 'c',
        options: [
          { value: 'a', label: 'A. Word gap' },
          { value: 'b', label: 'B. Careless or attention error' },
          { value: 'c', label: 'C. Transfer error' },
          { value: 'd', label: 'D. Typo error' },
        ],
      },
      {
        num: 3,
        name: 'q3',
        prompt: '3. Noor understands the evidence in a passage but thinks "justify" means "state your opinion" rather than "support with evidence and reasoning." Which Mistake Bank category fits best?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Step error' },
          { value: 'b', label: 'B. Word gap' },
          { value: 'c', label: 'C. Careless error' },
          { value: 'd', label: 'D. Hardware error' },
        ],
      },
      {
        num: 4,
        name: 'q4',
        prompt: '4. What are the two quiz formats compared in the Module 6 active experiment?',
        correctValue: 'a',
        options: [
          { value: 'a', label: 'A. One question at a time vs. Full set of questions with feedback at the end' },
          { value: 'b', label: 'B. Open-book copying vs. Guessing' },
          { value: 'c', label: 'C. True/False only vs. Crossword puzzles' },
          { value: 'd', label: 'D. Group chat vs. Social media polls' },
        ],
      },
      {
        num: 5,
        name: 'q5',
        prompt: '5. How do you prove that a mistake in your Mistake Bank has actually been repaired?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Read the answer key once and cross your fingers' },
          { value: 'b', label: 'B. Write the correction in your own words and solve a new matched question with your notes closed' },
          { value: 'c', label: 'C. Delete the wrong answer so you never see it again' },
          { value: 'd', label: 'D. Ask AI to solve ten problems for you' },
        ],
      },
      {
        num: 6,
        name: 'q6',
        prompt: '6. When setting up your Spaced-Review Plan (Reviews 1–4), why must you use a real parent-approved reminder method (like a calendar, alarm, or planner)?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Because paper planners are required by law' },
          { value: 'b', label: 'B. Because an AI chat message promising "I will remind you in 3 days" is just text in a chat window, not a scheduled notification' },
          { value: 'c', label: 'C. Because spaced review only works once a year' },
          { value: 'd', label: 'D. Because you should never review mistakes' },
        ],
      },
    ],
    quizAppliedPrompts: [
      '7. Describe one mistake you logged in your Mistake Bank, its category hypothesis, and how you repaired and retested it.',
      '8. Which quiz format (One-at-a-Time vs. Full-Set) worked better for you today, and what real reminder method did you set up for spaced review?',
    ],
    bossBattleTitle: 'Mistake Bank & Repair Boss Battle',
    bossBattleSubtitle: 'Evaluate each study and testing habit: label whether it builds durable retrieval and mistake repair (Superpower) or falls for the fluency illusion (Superweapon).',
    bossScenarios: [
      {
        id: 1,
        text: 'You reread your highlighted biology notes four times the night before the test without ever closing the notebook to answer a question from memory.',
        expectedLabel: 'superweapon',
      },
      {
        id: 2,
        text: 'You close your notes, ask Orion for a 5-question retrieval check one question at a time, and rate your confidence before seeing feedback.',
        expectedLabel: 'superpower',
      },
      {
        id: 3,
        text: 'When you miss Question 3, you say "Oh, silly mistake!" and immediately move on without naming the Mistake Category or trying a matched problem.',
        expectedLabel: 'superweapon',
      },
      {
        id: 4,
        text: 'You ask an AI chat to "send me a push notification on Thursday at 5 PM to study" and assume it will alert you without setting a real calendar or alarm.',
        expectedLabel: 'superweapon',
      },
      {
        id: 5,
        text: 'You log a missed algebra problem as a Step Error in your Mistake Bank, write the rule in your own words, and pass a new matched problem with notes closed.',
        expectedLabel: 'superpower',
      },
      {
        id: 6,
        text: 'You schedule Review 1 (next day) and Review 2 (3 days later) on a real parent-approved wall calendar or alarm and mark future reviews as pending until you run them.',
        expectedLabel: 'superpower',
      },
    ],
    bossReflections: [
      'What was the biggest difference you noticed between rereading and closed-notes self-testing?',
      'How did classifying your mistake into one of the 6 Mistake Bank categories change how you fixed it?',
      'What did you choose for your provisional `quiz-start` setting and how should your Tutor respond right after a wrong answer?',
    ],
    tierUnlocked: 'Retrieval & Mistake Master',
    completionSummary:
      'You now know how to replace passive rereading with closed-notes retrieval, repair errors using the 6 Mistake Bank categories, and schedule spaced reviews with real reminder tools.',
    unlockBullets: [
      '6-Step Retrieval Self-Testing Loop',
      '6 Mistake Bank Categories & Matched-Question Repair',
      'One-at-a-Time vs. Full-Set Quiz Format Comparison',
      'Realistic Spaced-Review Plan & Provisional Rule: quiz-start',
    ],
  },

  7: {
    moduleNum: 7,
    skillTreeSubtitle: 'Module 7 • Skill Tree: Build Knowledge Files Your Tutor Can Trust',
    title: 'Build Knowledge Files Your Tutor Can Trust',
    subtitle:
      'Separate source facts from summaries and guesses, build an 8-part source-aware Study Pack, and compare messy note dumps against clean Knowledge Files.',
    pdfTitle: 'Module 7 Student Guide: Build Knowledge Files Your Tutor Can Trust',
    videoSrc: '/videos/module_7_intro.mp4',
    whatYouWillLearnGood: [
      'Separate 4 information types: Source Fact, My Summary, My Question, and Unchecked Guess',
      'Build the 8-part Study Pack (`M07_[Subject]_[Topic]_Study_Pack.md`) with clear source IDs and scope',
      'Compare a messy note dump against a clean, source-labeled Study Pack in live Tutor testing',
      'Run a Privacy & Scope Check before saving or uploading any Knowledge File',
    ],
    whatYouWillAvoidBad: [
      'Dumping unverified rumors, messy half-sentences, and personal info into a Tutor Knowledge File',
      'Thinking that neat formatting or bold headings automatically make an unchecked claim true',
      'Expecting your Tutor to know answers that are outside the scope of your uploaded Study Pack without flagging it',
      'Uploading private family details, other students’ work, or restricted materials',
    ],
    quizTitle: 'Module 7 Quiz — Build Knowledge Files Your Tutor Can Trust',
    quizSubtitle: 'Verify your mastery of source-fact separation, the 8-Part Study Pack, Messy vs. Clean File testing, and Privacy & Scope review (80%+ unlocks the Boss Battle).',
    quizQuestions: [
      {
        num: 1,
        name: 'q1',
        prompt: '1. Why does a Tutor need clean, source-labeled Knowledge Files instead of a messy note dump?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Because AI refuses to read files under 10 pages' },
          { value: 'b', label: 'B. If a file mixes verified source facts with unchecked guesses, the Tutor may repeat your guesses back to you as if they were facts' },
          { value: 'c', label: 'C. Because messy files cost extra money' },
          { value: 'd', label: 'D. Because formatting automatically makes false facts true' },
        ],
      },
      {
        num: 2,
        name: 'q2',
        prompt: '2. What four types of statements must be kept distinct inside a trustworthy Knowledge File?',
        correctValue: 'c',
        options: [
          { value: 'a', label: 'A. Long, Short, Bold, and Italic' },
          { value: 'b', label: 'B. Math, Science, History, and Art' },
          { value: 'c', label: 'C. Source Fact, My Summary, My Question, and Unchecked Guess' },
          { value: 'd', label: 'D. Easy, Hard, Bonus, and Secret' },
        ],
      },
      {
        num: 3,
        name: 'q3',
        prompt: '3. Does clean, neat Markdown formatting prove that a statement in your file is factually accurate?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Yes — if it has bullet points and headings, it is verified' },
          { value: 'b', label: 'B. No — organization makes a file easier to search and cite, but accuracy still requires checking a trusted source' },
          { value: 'c', label: 'C. Yes, if Orion generated the headings' },
          { value: 'd', label: 'D. Only if the filename ends in .md' },
        ],
      },
      {
        num: 4,
        name: 'q4',
        prompt: '4. How many structured parts are in the PlayIQ Module 7 Study Pack (`M07_[Subject]_[Topic]_Study_Pack.md`)?',
        correctValue: 'a',
        options: [
          { value: 'a', label: 'A. 8 parts (File Identity, Source Record, Source Notes, 10-Line Summary, Key Terms, Active Recall Questions, Missing Links & Mistake Bank Connection, Precision Tutor Prompt)' },
          { value: 'b', label: 'B. 1 giant unnumbered paragraph' },
          { value: 'c', label: 'C. 2 parts (Questions and Final Answers)' },
          { value: 'd', label: 'D. 50 pages of raw transcripts' },
        ],
      },
      {
        num: 5,
        name: 'q5',
        prompt: '5. What should your Tutor do when you ask a question that is NOT covered in your uploaded Study Pack?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Pretend the answer was on page 3 of your Study Pack' },
          { value: 'b', label: 'B. State clearly that the answer is not in the uploaded Study Pack before offering general help or asking you to check your source' },
          { value: 'c', label: 'C. Delete your Study Pack' },
          { value: 'd', label: 'D. Refuse to talk to you' },
        ],
      },
      {
        num: 6,
        name: 'q6',
        prompt: '6. When recording your Privacy & Scope Review on PlayIQ, how should you describe private items you chose to exclude?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Paste the full private messages and passwords so you remember what you excluded' },
          { value: 'b', label: 'B. Describe the category excluded (e.g., "removed teacher email and classmate names") without copying the private content itself' },
          { value: 'c', label: 'C. Upload everything without checking' },
          { value: 'd', label: 'D. Skip the privacy check' },
        ],
      },
    ],
    quizAppliedPrompts: [
      '7. What differences did you observe when testing your messy note dump vs. your clean 8-part Study Pack?',
      '8. What rule did you set for `knowledge-file-use` when an answer is missing from your uploaded file?',
    ],
    bossBattleTitle: 'Knowledge Architect Challenge: Build a Tutor-Ready Study Pack',
    bossBattleSubtitle: 'Evaluate each Knowledge File practice: label whether it builds a trustworthy, source-grounded Study Pack (Superpower) or pollutes your Tutor with unverified/private data (Superweapon).',
    bossScenarios: [
      {
        id: 1,
        text: 'You paste raw, unedited class chat logs—including classmates’ full names, phone numbers, and half-finished guesses—directly into your Tutor Knowledge File.',
        expectedLabel: 'superweapon',
      },
      {
        id: 2,
        text: 'You label every claim in your Study Pack as [SOURCE FACT: Textbook p. 42], [MY SUMMARY], or [QUESTION TO CHECK] so your Tutor never confuses a guess with a fact.',
        expectedLabel: 'superpower',
      },
      {
        id: 3,
        text: 'You format a rumour in clean Markdown tables and assume that because it looks organized, you do not need to verify it against your textbook.',
        expectedLabel: 'superweapon',
      },
      {
        id: 4,
        text: 'When your Tutor invents a citation that is not in your Study Pack, you ignore it instead of instructing the Tutor to say "Not found in your uploaded Study Pack."',
        expectedLabel: 'superweapon',
      },
      {
        id: 5,
        text: 'You build all 8 parts of `M07_[Subject]_[Topic]_Study_Pack.md`, link your Module 6 Mistake Bank weak spots in Part 7, and test retrieval with Orion.',
        expectedLabel: 'superpower',
      },
      {
        id: 6,
        text: 'Before saving your Study Pack, you run the Privacy & Scope checklist and remove teacher contact details and unverified notes.',
        expectedLabel: 'superpower',
      },
    ],
    bossReflections: [
      'What changed in Orion’s answers when you switched from the messy note dump to the clean 8-part Study Pack?',
      'What did organization NOT prove on its own, and how did you verify factual accuracy?',
      'How will your `knowledge-file-use` rule guide your Tutor in Module 9 and Module 10?',
    ],
    tierUnlocked: 'Knowledge File Architect',
    completionSummary:
      'You can now build source-aware 8-part Study Packs that separate facts from summaries and guesses, protect privacy, and give your AI Tutor trustworthy context.',
    unlockBullets: [
      '4-Way Separation: Source Fact, Summary, Question, Unchecked Guess',
      '8-Part Tutor-Ready Study Pack (M07_[Subject]_[Topic]_Study_Pack.md)',
      'Messy Note Dump vs. Clean Study Pack Comparison',
      'Provisional Blueprint Rule: knowledge-file-use',
    ],
  },

  8: {
    moduleNum: 8,
    skillTreeSubtitle: 'Module 8 • Skill Tree: Protect Your Voice & Make Your Answers Clear',
    title: 'Protect Your Voice and Make Your Answers Clear',
    subtitle:
      'Plan clear Claim-Evidence-Reasoning (CER) answers with a 5-Line Answer Map, build a safe Writing Voice Evidence File, and use coaching prompts that keep every wording decision yours.',
    pdfTitle: 'Module 8 Student Guide: Protect Your Voice and Make Your Answers Clear',
    videoSrc: '/videos/module_8_intro.mp4',
    whatYouWillLearnGood: [
      'Structure clear arguments and short answers using Claim, Evidence, and Reasoning (CER)',
      'Plan before drafting with the 5-Line Answer Map (Claim, Evidence, Reasoning, Uncertainty/Limit, Own-Voice Check)',
      'Use PlayIQ writing-coach prompts that ask diagnostic questions and leave every wording choice to you',
      'Compare AI replacement writing against coached revision and curate an optional safe Writing Voice Evidence File',
    ],
    whatYouWillAvoidBad: [
      'Asking AI to "rewrite my paragraph so it sounds smarter" and losing your authentic voice',
      'Accepting every AI suggestion blindly without deciding what to accept, adapt, or reject',
      'Stating a Claim and Evidence without explaining the Reasoning that connects them',
      'Uploading private diary entries or unapproved drafts into a Writing Voice file',
    ],
    quizTitle: 'Module 8 Quiz — Protect Your Voice & Make Your Answers Clear',
    quizSubtitle: 'Verify your mastery of Claim-Evidence-Reasoning (CER), the 5-Line Answer Map, Writing-Coach boundaries, and Voice Ownership (80%+ unlocks the Boss Battle).',
    quizQuestions: [
      {
        num: 1,
        name: 'q1',
        prompt: '1. In the CER writing framework, what is the job of "Reasoning"?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. To repeat the Claim in louder words' },
          { value: 'b', label: 'B. To explain WHY and HOW your Evidence supports your Claim' },
          { value: 'c', label: 'C. To list random quotes without explaining them' },
          { value: 'd', label: 'D. To let AI write the conclusion' },
        ],
      },
      {
        num: 2,
        name: 'q2',
        prompt: '2. What are the five lines of the PlayIQ 5-Line Answer Map?',
        correctValue: 'c',
        options: [
          { value: 'a', label: 'A. Title, Font, Margin, Header, Footer' },
          { value: 'b', label: 'B. Five sentences copied from ChatGPT' },
          { value: 'c', label: 'C. (1) My Claim, (2) My Evidence & Source, (3) My Reasoning Link, (4) What I Need to Check / Limit, and (5) Key Words in My Own Voice' },
          { value: 'd', label: 'D. Introduction, Body 1, Body 2, Body 3, Bibliography' },
        ],
      },
      {
        num: 3,
        name: 'q3',
        prompt: '3. What is the difference between AI Replacement Writing and Coached Revision?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Replacement writing is faster so it teaches you more' },
          { value: 'b', label: 'B. Replacement writing substitutes AI sentences for your thinking; coached revision asks questions or points out gaps while you write every sentence yourself' },
          { value: 'c', label: 'C. Coached revision means AI writes the first draft and you change one word' },
          { value: 'd', label: 'D. There is no difference' },
        ],
      },
      {
        num: 4,
        name: 'q4',
        prompt: '4. When your Writing Coach gives you three feedback suggestions, what should you do?',
        correctValue: 'a',
        options: [
          { value: 'a', label: 'A. Decide for each suggestion whether to accept, adapt, or reject it based on whether it makes YOUR thinking clearer in your own voice' },
          { value: 'b', label: 'B. Copy and paste all three suggestions without reading them' },
          { value: 'c', label: 'C. Reject all feedback forever' },
          { value: 'd', label: 'D. Ask AI to rewrite the whole paper' },
        ],
      },
      {
        num: 5,
        name: 'q5',
        prompt: '5. What is the purpose of an optional Writing Voice Evidence File (`M08_Writing_Voice_and_Coaching_Rules.md`)?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. So your Tutor can impersonate you and ghostwrite your future essays' },
          { value: 'b', label: 'B. To show your Tutor examples of your natural sentence rhythm and vocabulary so it respects your style while coaching—never to ghostwrite for you' },
          { value: 'c', label: 'C. To store private family secrets' },
          { value: 'd', label: 'D. To grade your classmates' },
        ],
      },
      {
        num: 6,
        name: 'q6',
        prompt: '6. Who owns the final wording and authorship of every school answer you turn in?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Orion' },
          { value: 'b', label: 'B. You, the student — 100% of the time' },
          { value: 'c', label: 'C. Whichever AI model has the highest score' },
          { value: 'd', label: 'D. Nobody' },
        ],
      },
    ],
    quizAppliedPrompts: [
      '7. Share your 5-Line Answer Map (Claim, Evidence, Reasoning) and one coaching suggestion you accepted, adapted, or rejected.',
      '8. What boundary did you set in `writing-coach-and-voice` so your Tutor never takes over your authorship?',
    ],
    bossBattleTitle: 'Voice & Clarity Boss Battle: Upgrade the Answer, Keep Your Voice',
    bossBattleSubtitle: 'Evaluate each writing scenario: label whether it strengthens clear student-owned thinking (Superpower) or surrenders your voice and authorship (Superweapon).',
    bossScenarios: [
      {
        id: 1,
        text: 'You write a rough history paragraph, then prompt AI: "Rewrite this so it sounds like a college professor wrote it" and paste the AI version into your assignment.',
        expectedLabel: 'superweapon',
      },
      {
        id: 2,
        text: 'Before drafting, you fill out a 5-Line CER Answer Map in your own words so you know your exact Claim, Evidence, and Reasoning.',
        expectedLabel: 'superpower',
      },
      {
        id: 3,
        text: 'You upload a Writing Voice sample and ask AI to "imitate my style and write my book report for me so the teacher cannot tell."',
        expectedLabel: 'superweapon',
      },
      {
        id: 4,
        text: 'You accept every word change a grammar/AI tool suggests even when it changes your meaning and uses vocabulary you cannot define out loud.',
        expectedLabel: 'superweapon',
      },
      {
        id: 5,
        text: 'You ask Orion: "Do not rewrite my paragraph. Ask me one question about where my Reasoning link between my evidence and claim is unclear, then let me revise it."',
        expectedLabel: 'superpower',
      },
      {
        id: 6,
        text: 'You review three coaching suggestions, accept one structural tip, reject a suggestion that sounded unnatural, and write the revised draft yourself.',
        expectedLabel: 'superpower',
      },
    ],
    bossReflections: [
      'How did your coached revision compare with AI replacement writing in sounding like you and helping you think?',
      'What is one writing decision you learned to make yourself using the 5-Line CER Answer Map?',
      'Which starting support and feedback amount did you choose for your `writing-coach-and-voice` rule?',
    ],
    tierUnlocked: 'Voice & Clarity Defender',
    completionSummary:
      'You have completed all eight foundation modules (Modules 00–08)! You can now plan CER answers, coach your own writing without surrendering your voice, and you are ready to compile your Personal AI Tutor in Module 9.',
    unlockBullets: [
      'Claim-Evidence-Reasoning (CER) & 5-Line Answer Map',
      'Coached Revision vs. Replacement Writing Comparison',
      'Safe Writing Voice Boundaries (Never Impersonation)',
      'Ready for Module 9: Build Your Personal AI Tutor!',
    ],
  },

  9: {
    moduleNum: 9,
    skillTreeSubtitle: 'Module 9 • Skill Tree: Build Your Personal AI Tutor',
    title: 'Build Your Personal AI Tutor',
    subtitle:
      'Review and download your approved personal_learning_knowledge_file.md (File 2 of 6, replacing student_tutor_profile.md), compile your 6-file PlayIQ_Tutor_Kit, and update your existing Module 00 PlayIQ Tutor Project.',
    pdfTitle: 'Module 9 Student Guide: Build Your Personal AI Tutor',
    videoSrc: '/videos/module_9_intro.mp4',
    whatYouWillLearnGood: [
      'Review your approved Module 00–08 learning records on PlayIQ and download `personal_learning_knowledge_file.md` (File 2 of 6)',
      'Understand the 3 Tutor layers (Personality, Function, Knowledge) and why contextual personalization is not base-model fine-tuning',
      'Compile your 6-file `PlayIQ_Tutor_Kit` without inventing missing evidence (`MISSING_INPUT` / `pending_validation`)',
      'Upload your files to the SAME Module 00 `PlayIQ Tutor Project` and run the Read-Back Check (keeping `tutor_test_log.md` as `not_tested` for Module 10)',
    ],
    whatYouWillAvoidBad: [
      'Creating a second, separate Tutor Project instead of updating your Module 00 `PlayIQ Tutor Project`',
      'Treating `personal_learning_knowledge_file.md` as a 7th file instead of File 2 of 6 (replacing `student_tutor_profile.md`)',
      'Letting Orion guess or invent missing module results instead of marking `MISSING_INPUT`',
      'Marking the 6 Tutor tests as Passed in Module 9 before running them in Module 10',
    ],
    quizTitle: 'Module 9 Quiz — Build Your Personal AI Tutor',
    quizSubtitle: 'Verify your mastery of the 6-file PlayIQ_Tutor_Kit architecture, personal_learning_knowledge_file.md (File 2 of 6), and updating your Module 00 Project (80%+ unlocks the Boss Battle).',
    quizQuestions: [
      {
        num: 1,
        name: 'q1',
        prompt: '1. Where do you build your Personal AI Tutor in Module 9?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. In a brand-new, second Tutor Project' },
          { value: 'b', label: 'B. In the SAME parent-approved PlayIQ Tutor Project you created in Module 00' },
          { value: 'c', label: 'C. On a public social media page' },
          { value: 'd', label: 'D. Inside a video game chat' },
        ],
      },
      {
        num: 2,
        name: 'q2',
        prompt: '2. In the six-file `PlayIQ_Tutor_Kit` architecture, what is `personal_learning_knowledge_file.md`?',
        correctValue: 'c',
        options: [
          { value: 'a', label: 'A. An extra 7th file added on top of student_tutor_profile.md' },
          { value: 'b', label: 'B. A file that fine-tunes and retrains the base AI model weights' },
          { value: 'c', label: 'C. File 2 of the 6 Tutor files (replacing student_tutor_profile.md), downloaded from your approved Module 00–08 PlayIQ records for contextual personalization' },
          { value: 'd', label: 'D. A file containing your passwords and home address' },
        ],
      },
      {
        num: 3,
        name: 'q3',
        prompt: '3. What should Orion do if a module record or assessment field is missing when compiling your Tutor files?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Guess a likely answer so the file looks complete' },
          { value: 'b', label: 'B. Mark it explicitly as MISSING_INPUT or excluded and wait for your review — never infer or invent missing evidence' },
          { value: 'c', label: 'C. Copy another student’s profile' },
          { value: 'd', label: 'D. Delete the whole Project' },
        ],
      },
      {
        num: 4,
        name: 'q4',
        prompt: '4. What are the exact six files in `PlayIQ_Tutor_Kit`?',
        correctValue: 'a',
        options: [
          { value: 'a', label: 'A. (1) project_instructions.md, (2) personal_learning_knowledge_file.md, (3) learning_rules.yaml, (4) course_learning_record.md, (5) tutor_test_log.md, and (6) student_setup_checklist.md' },
          { value: 'b', label: 'B. Seven files including both student_tutor_profile.md and personal_learning_knowledge_file.md' },
          { value: 'c', label: 'C. Only one giant text file' },
          { value: 'd', label: 'D. Three image files and three audio files' },
        ],
      },
      {
        num: 5,
        name: 'q5',
        prompt: '5. Are the six Tutor behavior tests in `tutor_test_log.md` already passed when Module 9 ends?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Yes, because the test log file exists' },
          { value: 'b', label: 'B. No — in Module 9 the log is prepared with status not_tested; you run the six live tests in Module 10' },
          { value: 'c', label: 'C. Yes, Orion grades them automatically without testing' },
          { value: 'd', label: 'D. Tests are never run' },
        ],
      },
      {
        num: 6,
        name: 'q6',
        prompt: '6. Why do you run a Read-Back Check right after uploading `personal_learning_knowledge_file.md` into your Module 00 Tutor Project?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. To make the AI write a poem' },
          { value: 'b', label: 'B. To verify that the Tutor can read your uploaded file and accurately report which modules are approved vs. missing without guessing' },
          { value: 'c', label: 'C. To delete your Project Instructions' },
          { value: 'd', label: 'D. To share your account password' },
        ],
      },
    ],
    quizAppliedPrompts: [
      '7. Which modules (00–08) were included as approved in your downloaded `personal_learning_knowledge_file.md`, and were any marked missing or excluded?',
      '8. What did your Tutor report when you ran the Read-Back Check inside your Module 00 PlayIQ Tutor Project?',
    ],
    bossBattleTitle: 'Personal AI Tutor Build & Integration Boss Battle',
    bossBattleSubtitle: 'Evaluate each Tutor integration step: label whether it builds an honest, evidence-backed Tutor in your Module 00 Project (Superpower) or introduces invented data / architecture mistakes (Superweapon).',
    bossScenarios: [
      {
        id: 1,
        text: 'You ask Orion to "fill in probable answers" for Module 5 and Module 7 because you skipped saving those records, instead of marking them MISSING_INPUT.',
        expectedLabel: 'superweapon',
      },
      {
        id: 2,
        text: 'You review your Module 00–08 answers on PlayIQ with a parent/guardian, download `personal_learning_knowledge_file.md` as File 2 of 6, and upload it to your existing Module 00 Tutor Project.',
        expectedLabel: 'superpower',
      },
      {
        id: 3,
        text: 'You mark all 6 tests in `tutor_test_log.md` as "5/5 PASS" in Module 9 before you have actually tested a single prompt in Module 10.',
        expectedLabel: 'superweapon',
      },
      {
        id: 4,
        text: 'You upload both `student_tutor_profile.md` and `personal_learning_knowledge_file.md` as 7 conflicting files instead of using `personal_learning_knowledge_file.md` as File 2 of 6.',
        expectedLabel: 'superweapon',
      },
      {
        id: 5,
        text: 'You combine a friendly, encouraging tone (Layer 1) with strict Function-First coaching rules (Layer 2) and your approved Knowledge Files (Layer 3) inside your Module 00 Project.',
        expectedLabel: 'superpower',
      },
      {
        id: 6,
        text: 'After uploading your files, you run the Read-Back Check to confirm your Tutor distinguishes approved modules from missing/untested ones and waits for Module 10 to run the 6 tests.',
        expectedLabel: 'superpower',
      },
    ],
    bossReflections: [
      'How did thePersonality-First vs. Function-First comparison shape your `project_instructions.md`?',
      'What did you verify during your `personal_learning_knowledge_file.md` download and Read-Back Check?',
      'How is your `PlayIQ_Tutor_Kit` organized and ready for Module 10 testing?',
    ],
    tierUnlocked: 'Personal AI Tutor Engineer',
    completionSummary:
      'You have assembled your 6-file PlayIQ_Tutor_Kit, downloaded your verified personal_learning_knowledge_file.md (File 2 of 6), and updated your Module 00 PlayIQ Tutor Project! Next up: Module 10 — Test Your Tutor and Learn With It.',
    unlockBullets: [
      'File 2 of 6: personal_learning_knowledge_file.md Reviewed & Downloaded',
      '6-File PlayIQ_Tutor_Kit Saved & Uploaded to Module 00 Project',
      'Read-Back Check Verified (No Invented Evidence)',
      'tutor_test_log.md Prepared (not_tested) for Module 10!',
    ],
  },

  10: {
    moduleNum: 10,
    skillTreeSubtitle: 'Module 10 • Skill Tree: Test Your Tutor and Learn With It',
    title: 'Test Your Tutor and Learn With It',
    subtitle:
      'Run the 6 quick behavior tests on the Tutor in your Module 00 Project, revise one instruction and retest it, and use the 7-step New Idea to Learning loop on a real topic.',
    pdfTitle: 'Module 10 Student Guide: Test Your Tutor and Learn With It',
    whatYouWillLearnGood: [
      'Run the 6 quick Tutor behavior tests in your Module 00 PlayIQ Tutor Project using the honest `1 / 2 / 3 / N/T` scorecard',
      'Improve one weak behavior by changing ONE related instruction and repeating the exact same test',
      'Use the repeatable 7-step "New Idea to Learning" loop to learn a real school or curiosity topic with your Tutor',
      'Prove what you learned with a closed-notes own-words retrieval summary and update `tutor_test_log.md`',
    ],
    whatYouWillAvoidBad: [
      'Marking an unrun test as Passed instead of `not_tested` (`N/T`)',
      'Rewriting all 6 Tutor files at once when one behavior misses, so you cannot tell what fixed it',
      'Assuming that enjoying a video or analogy once proves it teaches every subject best forever',
      'Ending a Tutor session without closing your notes to check what you can explain in your own words',
    ],
    quizTitle: 'Module 10 Quiz — Test Your Tutor and Learn With It',
    quizSubtitle: 'Verify your mastery of the 6 Tutor behavior tests, the 1/2/3/N/T scorecard, one-instruction retesting, and the 7-step learning loop (80%+ unlocks the Boss Battle).',
    quizQuestions: [
      {
        num: 1,
        name: 'q1',
        prompt: '1. How should a Tutor test that you did NOT run yet be recorded in `tutor_test_log.md`?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Passed, because the Tutor was designed carefully in Module 9' },
          { value: 'b', label: 'B. not_tested (N/T)' },
          { value: 'c', label: 'C. 3 out of 3' },
          { value: 'd', label: 'D. Deleted from the table' },
        ],
      },
      {
        num: 2,
        name: 'q2',
        prompt: '2. If one Tutor behavior misses during testing (for example, it gives a 5-paragraph lecture instead of asking what you know first), what should you change first?',
        correctValue: 'c',
        options: [
          { value: 'a', label: 'A. Rewrite all six files from scratch at the same time' },
          { value: 'b', label: 'B. Blame yourself and stop using the Tutor' },
          { value: 'c', label: 'C. Change ONE related instruction in project_instructions.md or learning_rules.yaml, then repeat the exact same test prompt' },
          { value: 'd', label: 'D. Create a third Tutor Project' },
        ],
      },
      {
        num: 3,
        name: 'q3',
        prompt: '3. Does liking a video or analogy on one topic prove that format always teaches every subject best?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Yes — once you like a format, it is your permanent learning style forever' },
          { value: 'b', label: 'B. No — it is a changeable preference to test against what you can actually explain or do on each subject' },
          { value: 'c', label: 'C. Yes, if AI agrees' },
          { value: 'd', label: 'D. Only for math' },
        ],
      },
      {
        num: 4,
        name: 'q4',
        prompt: '4. What are the six quick behavior tests you run on your Tutor in Module 10?',
        correctValue: 'a',
        options: [
          { value: 'a', label: 'A. (1) Start from what I know, (2) Give a hint not the answer, (3) Check learning one question at a time, (4) Find the missing connection, (5) Be honest about uncertainty, and (6) Protect my authorship' },
          { value: 'b', label: 'B. Typing speed, battery life, screen brightness, font size, Wi-Fi speed, and volume' },
          { value: 'c', label: 'C. Six requests for AI to write your homework essays' },
          { value: 'd', label: 'D. Only one test: asking AI its name' },
        ],
      },
      {
        num: 5,
        name: 'q5',
        prompt: '5. On the Module 10 Tutor Scorecard, what do `3`, `2`, `1`, and `N/T` mean?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Grade level 1, 2, or 3' },
          { value: 'b', label: 'B. 3 = Followed instruction clearly; 2 = Partly followed; 1 = Missed instruction; N/T = not_tested' },
          { value: 'c', label: 'C. Number of hours spent' },
          { value: 'd', label: 'D. 1 is best and 3 is worst' },
        ],
      },
      {
        num: 6,
        name: 'q6',
        prompt: '6. How do you finish the 7-step "New Idea to Learning" loop to prove real learning happened?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Copy the Tutor’s explanation into your notebook while looking at the screen' },
          { value: 'b', label: 'B. Close your notes/chat and explain the core idea + answer retrieval questions in your own words' },
          { value: 'c', label: 'C. Ask the Tutor "Am I smart?"' },
          { value: 'd', label: 'D. Skip the retrieval check' },
        ],
      },
    ],
    quizAppliedPrompts: [
      '7. Share the results of your 6 Tutor tests (including which one you chose to improve and how the retest went).',
      '8. Write the own-words retrieval summary from the real topic you learned using the 7-step loop.',
    ],
    bossBattleTitle: 'Tutor Stress-Test & Learning Loop Boss Battle',
    bossBattleSubtitle: 'Evaluate each Tutor testing move: label whether it reflects honest engineering and real learning (Superpower) or wishful thinking / shortcutting (Superweapon).',
    bossScenarios: [
      {
        id: 1,
        text: 'You only have time to run 4 of the 6 Tutor tests today, so you mark Tests 5 and 6 as "3 — Followed clearly" without running them.',
        expectedLabel: 'superweapon',
      },
      {
        id: 2,
        text: 'When Test 2 (Give a hint, not the answer) scores a 2 because the Tutor gave away too much of the solution, you tighten the Hint Rule in `project_instructions.md` and re-run the exact same prompt.',
        expectedLabel: 'superpower',
      },
      {
        id: 3,
        text: 'When Test 3 misses, you delete all 6 files and paste a random prompt from the internet so you have no idea which instruction changed.',
        expectedLabel: 'superweapon',
      },
      {
        id: 4,
        text: 'After a fun 10-minute chat with your Tutor, you close the laptop without testing whether you can explain the concept or solve a problem with the chat closed.',
        expectedLabel: 'superweapon',
      },
      {
        id: 5,
        text: 'You test Test 6 by asking your Tutor to "rewrite my paragraph for school," verify that it politely refuses and offers CER coaching questions, and log a 3 in `tutor_test_log.md`.',
        expectedLabel: 'superpower',
      },
      {
        id: 6,
        text: 'You run the 7-step New Idea to Learning loop on a real class topic, close your notes, and write a 3-sentence retrieval explanation in your own words.',
        expectedLabel: 'superpower',
      },
    ],
    bossReflections: [
      'Which of the 6 Tutor tests was strongest right away, and which one improved the most after your one-instruction edit?',
      'What did you learn during your Personal Learning Mission, and what could you explain from memory afterward?',
      'What is the next real school topic you plan to bring to your tested PlayIQ Tutor?',
    ],
    tierUnlocked: 'Tested AI Tutor Operator',
    completionSummary:
      'You have stress-tested your Personal AI Tutor across all 6 behaviors, engineered a targeted instruction improvement, and used the 7-step loop to learn a real topic! Next up: Module 11 — Build Your Personal AI Assistant.',
    unlockBullets: [
      '6-Test Tutor Scorecard Completed Honestly (1 / 2 / 3 / N/T)',
      'One-Instruction Revision & Retest Verified',
      '7-Step "New Idea to Learning" Loop Mastered',
      'tutor_test_log.md Updated in PlayIQ_Tutor_Kit',
    ],
  },

  11: {
    moduleNum: 11,
    skillTreeSubtitle: 'Module 11 • Skill Tree: Build Your Personal AI Assistant',
    title: 'Build Your Personal AI Assistant',
    subtitle:
      'Map one safe everyday workflow, run the 9 one-at-a-time discovery questions to draft an Assistant Brief, and build your separate My Personal Assistant Project.',
    pdfTitle: 'Module 11 Student Guide: Build Your Personal AI Assistant',
    whatYouWillLearnGood: [
      'Distinguish your Module 00 PlayIQ Tutor (for learning subjects) from your separate Module 11 Personal AI Assistant (for organizing one safe workflow)',
      'Map a real everyday workflow before building: Task, Steps, and Human Decision Points',
      'Use 9 one-at-a-time discovery questions in a new private chat to generate a clear Assistant Brief',
      'Write 7-section Assistant Project Instructions, save `My_Personal_Assistant_Kit`, and set up your separate `My Personal Assistant` Project',
    ],
    whatYouWillAvoidBad: [
      'Mixing Personal Assistant task files into your Module 00 PlayIQ Tutor Project',
      'Giving a vague prompt like "Be my assistant and run my life" instead of defining one clear workflow',
      'Uploading a reference knowledge file alone without Project Instructions and expecting the assistant to know how to behave',
      'Entering private family, medical, financial, or password details into an assistant',
    ],
    quizTitle: 'Module 11 Quiz — Build Your Personal AI Assistant',
    quizSubtitle: 'Verify your mastery of Tutor vs. Assistant separation, workflow mapping, the 9 discovery questions, and 7-section Project Instructions (80%+ unlocks the Boss Battle).',
    quizQuestions: [
      {
        num: 1,
        name: 'q1',
        prompt: '1. Which request gives a Personal AI Assistant a clearer, safer job?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. "Be my assistant and help with my whole life."' },
          { value: 'b', label: 'B. "Help plan my art-project ideas, ask which one I want to work on today, and show three small steps I can choose from."' },
          { value: 'c', label: 'C. "Do all my school homework and email my teacher."' },
          { value: 'd', label: 'D. "Make all my decisions for me."' },
        ],
      },
      {
        num: 2,
        name: 'q2',
        prompt: '2. What tells an AI assistant how to behave, ask questions, and format its output?',
        correctValue: 'c',
        options: [
          { value: 'a', label: 'A. A reference knowledge file alone with no instructions' },
          { value: 'b', label: 'B. The color of the chat window' },
          { value: 'c', label: 'C. Clear Project Instructions (your 7-section instruction set)' },
          { value: 'd', label: 'D. Guessing what you want without asking' },
        ],
      },
      {
        num: 3,
        name: 'q3',
        prompt: '3. If you cannot describe your workflow task clearly at first, what should you do before writing Project Instructions?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Ask the AI to guess the whole design without talking to you' },
          { value: 'b', label: 'B. Map the current workflow (Task, Steps, Decision Points) and run the 9 one-at-a-time discovery questions' },
          { value: 'c', label: 'C. Upload random school files' },
          { value: 'd', label: 'D. Give up on building an assistant' },
        ],
      },
      {
        num: 4,
        name: 'q4',
        prompt: '4. Where should you build your Personal AI Assistant?',
        correctValue: 'a',
        options: [
          { value: 'a', label: 'A. In a NEW, SEPARATE private Project named "My Personal Assistant" — kept separate from your Module 00 PlayIQ Tutor Project' },
          { value: 'b', label: 'B. Inside your Module 00 PlayIQ Tutor Project by overwriting your Tutor instructions' },
          { value: 'c', label: 'C. In a public forum' },
          { value: 'd', label: 'D. Without parent approval' },
        ],
      },
      {
        num: 5,
        name: 'q5',
        prompt: '5. Who reviews and decides whether the Personal Assistant’s output is useful and accurate?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. The assistant, without any human checking' },
          { value: 'b', label: 'B. You, the student (with parent/guardian guidance when needed)' },
          { value: 'c', label: 'C. Random internet comments' },
          { value: 'd', label: 'D. Nobody' },
        ],
      },
      {
        num: 6,
        name: 'q6',
        prompt: '6. Is "No knowledge file needed yet" a valid choice when setting up `My Personal Assistant`?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. No — you must upload at least 10 files or it breaks' },
          { value: 'b', label: 'B. Yes — if your 7-section Project Instructions already define the workflow clearly, starting without an extra reference file is clean and valid' },
          { value: 'c', label: 'C. No, you must upload your personal_learning_knowledge_file.md into every project' },
          { value: 'd', label: 'D. Only if you skip Project Instructions' },
        ],
      },
    ],
    quizAppliedPrompts: [
      '7. Describe the one safe everyday workflow you mapped for `My Personal Assistant` and which decisions stay with you.',
      '8. Summarize how the 9 one-at-a-time discovery questions helped you build your 7-section Project Instructions.',
    ],
    bossBattleTitle: 'Personal Assistant Architect Boss Battle',
    bossBattleSubtitle: 'Evaluate each Assistant design move: label whether it creates a focused, human-led assistant in a separate Project (Superpower) or a messy, unsafe design (Superweapon).',
    bossScenarios: [
      {
        id: 1,
        text: 'You paste your new Personal Assistant instructions over your Module 00 PlayIQ Tutor Project, erasing your Tutor’s Socratic teaching rules.',
        expectedLabel: 'superweapon',
      },
      {
        id: 2,
        text: 'You create a separate Project named "My Personal Assistant" for organizing your weekly music/sports practice routine and keep your Module 00 Tutor Project untouched.',
        expectedLabel: 'superpower',
      },
      {
        id: 3,
        text: 'You upload a messy document into a Project with zero Project Instructions and expect the AI to magically know what workflow steps and boundaries to follow.',
        expectedLabel: 'superweapon',
      },
      {
        id: 4,
        text: 'You design an assistant whose job is to "write my school essays and answer my take-home quizzes so I don’t have to read."',
        expectedLabel: 'superweapon',
      },
      {
        id: 5,
        text: 'You use the 9 one-at-a-time discovery questions to clarify your workflow, then write a 7-section Project Instruction set that asks clarifying questions when details are missing.',
        expectedLabel: 'superpower',
      },
      {
        id: 6,
        text: 'You save your `assistant_brief.md` and `assistant_project_instructions.md` in a clean `My_Personal_Assistant_Kit` folder ready for Module 12 testing.',
        expectedLabel: 'superpower',
      },
    ],
    bossReflections: [
      'Why is it important to keep your Module 11 Personal Assistant in a separate Project from your Module 00 PlayIQ Tutor?',
      'Which human decision points in your workflow must always stay with you rather than the assistant?',
      'What will you test first when you open `My Personal Assistant` in Module 12?',
    ],
    tierUnlocked: 'Personal AI Assistant Builder',
    completionSummary:
      'You have mapped a real workflow, completed the 9 discovery questions, written your 7-section Project Instructions, and built your separate My Personal Assistant Project! Next up: Module 12 — Test Your Assistant and See What It Could Do.',
    unlockBullets: [
      'Separate "My Personal Assistant" Project Created',
      '3-Part Workflow Map & 9-Question Discovery Brief',
      '7-Section Assistant Project Instructions & My_Personal_Assistant_Kit',
      'Ready for Module 12 Live Assistant Testing!',
    ],
  },

  12: {
    moduleNum: 12,
    skillTreeSubtitle: 'Module 12 • Skill Tree: Test Your Assistant and See What It Could Do',
    title: 'Test Your Assistant and See What It Could Do',
    subtitle:
      'Run the 3 Assistant tests (normal request, missing detail, boundary), revise one instruction and retest, verify real reminder tools vs. chat text, and try journal-with-a-helper capture.',
    pdfTitle: 'Module 12 Student Guide: Test Your Assistant and See What It Could Do',
    whatYouWillLearnGood: [
      'Verify the critical difference between a reminder written in chat text and a real scheduled notification/alarm',
      'Run the 3 Assistant tests in your separate `My Personal Assistant` Project: Normal Request, Missing Detail / Changed Plan, and Boundary Test',
      'Improve one Assistant instruction and repeat the exact same test to confirm the fix',
      'Use the "Journal with a Helper" workflow (Capture -> Organize -> Review) while distinguishing chat text from permanent saved memory',
    ],
    whatYouWillAvoidBad: [
      'Believing that an AI writing "✅ I will remind you tomorrow at 4 PM!" in chat means a real alarm is scheduled',
      'Assuming that anything typed in one chat turn is permanently remembered forever across all future chats without checking memory/file settings',
      'Ignoring a missed Missing-Detail or Boundary test instead of tightening one instruction and retesting',
      'Letting the assistant make final personal or school decisions without your review',
    ],
    quizTitle: 'Module 12 Quiz — Test Your Assistant and See What It Could Do',
    quizSubtitle: 'Verify your mastery of the 3 Assistant tests, one-instruction retesting, chat reminders vs. real scheduling tools, and Capture -> Organize -> Review (80%+ unlocks the Boss Battle).',
    quizQuestions: [
      {
        num: 1,
        name: 'q1',
        prompt: '1. Your Personal Assistant writes in chat: "Reminder set for 5:00 PM!" What do you know for sure?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. A real phone alarm and push notification are guaranteed to ring at 5:00 PM' },
          { value: 'b', label: 'B. It wrote text in chat; you must check a real scheduling feature, permissions, settings, or your own alarm/calendar to confirm any real reminder' },
          { value: 'c', label: 'C. Your teacher was automatically notified' },
          { value: 'd', label: 'D. You never need a calendar again' },
        ],
      },
      {
        num: 2,
        name: 'q2',
        prompt: '2. What are the three tests you run on your Personal Assistant in Module 12?',
        correctValue: 'c',
        options: [
          { value: 'a', label: 'A. Spelling, Rhyming, and Drawing' },
          { value: 'b', label: 'B. Asking it to write three essays' },
          { value: 'c', label: 'C. Test 1: A normal request; Test 2: A missing detail or changed plan; Test 3: A safety/authorship boundary' },
          { value: 'd', label: 'D. Only testing whether it knows your name' },
        ],
      },
      {
        num: 3,
        name: 'q3',
        prompt: '3. What should you do if one of your three Assistant tests misses (for example, it guesses a full schedule instead of asking about a missing detail)?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Assume the assistant will magically do better next week without any changes' },
          { value: 'b', label: 'B. Change ONE related instruction in your Assistant Project Instructions and repeat the exact same test' },
          { value: 'c', label: 'C. Copy your Tutor instructions over your Assistant' },
          { value: 'd', label: 'D. Mark the test as 3/3 anyway' },
        ],
      },
      {
        num: 4,
        name: 'q4',
        prompt: '4. Can your Personal Assistant help organize messy notes in a chat turn without permanently remembering them forever?',
        correctValue: 'a',
        options: [
          { value: 'a', label: 'A. Yes — chat text in a current turn, uploaded Project files, and saved account memory are different capabilities' },
          { value: 'b', label: 'B. No — every word in any chat is automatically carved into permanent memory forever' },
          { value: 'c', label: 'C. No — AI cannot organize bullet points' },
          { value: 'd', label: 'D. Only if you pay $1,000' },
        ],
      },
      {
        num: 5,
        name: 'q5',
        prompt: '5. What are the three steps of the "Journal with a Helper" workflow?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Guess, Copy, Forget' },
          { value: 'b', label: 'B. Capture (jot quick safe notes) -> Organize (ask Assistant to group & suggest options) -> Review (you verify and save what you approve)' },
          { value: 'c', label: 'C. Post private secrets publicly' },
          { value: 'd', label: 'D. Let AI write your diary without you' },
        ],
      },
      {
        num: 6,
        name: 'q6',
        prompt: '6. In Test 3 (Boundary Test), what should your Personal Assistant do if asked to complete a graded school assignment or accept private credentials?',
        correctValue: 'b',
        options: [
          { value: 'a', label: 'A. Do it secretly' },
          { value: 'b', label: 'B. Politely refuse the out-of-bounds request and redirect to a safe planning or organizing step' },
          { value: 'c', label: 'C. Crash the browser' },
          { value: 'd', label: 'D. Invent fake data' },
        ],
      },
    ],
    quizAppliedPrompts: [
      '7. Summarize what happened in Test 1 (Normal), Test 2 (Missing detail), and Test 3 (Boundary), plus the one instruction you revised and retested.',
      '8. Explain what real reminder method you use outside chat text and how you plan to use Capture -> Organize -> Review.',
    ],
    bossBattleTitle: 'Personal Assistant Stress-Test & Capability Boss Battle',
    bossBattleSubtitle: 'Evaluate each Assistant usage scenario: label whether it uses your tested Assistant with realistic capability checks (Superpower) or falls for an AI capability illusion (Superweapon).',
    bossScenarios: [
      {
        id: 1,
        text: 'Your assistant writes "I set an alarm for your 7:00 AM bus!" in a normal chat window, so you turn off your real alarm clock without checking if any scheduling tool exists.',
        expectedLabel: 'superweapon',
      },
      {
        id: 2,
        text: 'You test your Assistant with a missing detail ("Plan my Saturday project" with no time or materials listed) and verify that it asks 2 clarifying questions before making a plan.',
        expectedLabel: 'superpower',
      },
      {
        id: 3,
        text: 'When your Assistant fails the Missing-Detail test and guesses a whole schedule, you tighten Section 5 (Missing-Detail Rule) in its Project Instructions and repeat the exact same test.',
        expectedLabel: 'superpower',
      },
      {
        id: 4,
        text: 'You paste private family passwords and bank numbers into your Assistant chat so it can "remember them for later."',
        expectedLabel: 'superweapon',
      },
      {
        id: 5,
        text: 'You use Capture -> Organize -> Review on 4 messy after-school task bullets, review the organized checklist yourself, and set a real phone/calendar reminder for the time block.',
        expectedLabel: 'superpower',
      },
      {
        id: 6,
        text: 'You assume that because you mentioned a deadline in one temporary chat thread, every other Project and chat in your account automatically knows about it without you saving or uploading it.',
        expectedLabel: 'superweapon',
      },
    ],
    bossReflections: [
      'Which of the 3 Assistant tests revealed the most useful improvement to your Project Instructions?',
      'Why is distinguishing chat text from real scheduled reminders and saved memory such an important real-world AI skill?',
      'How do your Module 00 PlayIQ Tutor and your Module 11 Personal Assistant complement each other as two separate tools?',
    ],
    tierUnlocked: 'Verified AI Assistant Operator',
    completionSummary:
      'You have built and stress-tested both your Personal AI Tutor (Modules 9–10) and your separate Personal AI Assistant (Modules 11–12)! Next up: Module 13 — Your Orion Character’s Next Adventure (a short, fun possibility preview with no required homework) before Module 14: Capstone — The Master Trial!',
    unlockBullets: [
      '3-Scenario Assistant Test Log Completed (Normal, Missing Detail, Boundary)',
      'One-Instruction Assistant Revision & Retest Verified',
      'Chat Text vs. Real Scheduled Reminder Check Mastered',
      'Capture -> Organize -> Review ("Journal with a Helper") Workflow Ready',
    ],
  },
};

