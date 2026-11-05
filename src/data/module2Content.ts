import type { NodeContent } from './module1Content';

export const module2Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-05.png',
    title: 'The Power Paradox & The Power Tool Principle',
    bigIdea: [
      'AI and the internet are multipliers: they amplify whatever habits, discipline, or shortcuts you already bring to the table.',
      'Power is not cheating. Power is knowing how to stay in control so the tool makes your mind stronger instead of making you dependent.',
      'In this node, you will master the Power Tool Principle and learn to separate Coach Use (which builds your brain) from Crutch Use (which replaces your brain) and Gray-Zone Use (which requires checking your teacher’s policy first).',
    ],
    sections: [
      {
        title: 'Part 0: Lightning Hook — The Power Paradox (Student A vs. Student B)',
        content: [
          'Two students have the same history essay due tomorrow and both open AI at 7:00 PM:',
          'A. Student A prompts: "Write a 500-word essay on the causes of the Industrial Revolution in a 9th-grade voice." Student A finishes in 3 minutes, learns nothing, and panics when the teacher asks a follow-up question in class.',
          'B. Student B prompts: "Explain the 3 main causes of the Industrial Revolution using a simple cause-and-effect map, then quiz me one question at a time so I can write my own outline." Student B finishes in 25 minutes and owns the material on exam day.',
          'Why this matters: The fastest way to finish an assignment is often the fastest way to become weaker. The Highest Path uses AI to accelerate understanding—never to escape effort.',
        ],
      },
      {
        title: 'Part 1: The Power Tool Principle — Coach Use vs. Crutch Use vs. Gray Zone',
        content: [
          'Think of AI like power equipment in a gym: if a forklift lifts the weights for you, the weights move, but your muscles never grow.',
          '• COACH USE (Builds Your Capability): Asking for an alternative explanation, requesting one hint after showing your attempt, asking AI to quiz you on your own notes, or asking for diagnostic feedback without rewriting your sentences.',
          '• CRUTCH USE (Creates Dependence): Having AI write sentences you submit as your own, solving homework problems without attempting them first, or letting AI make every creative and analytical decision for you.',
          '• GRAY-ZONE USE (Depends on Classroom Policy): Brainstorming topic ideas, checking grammar, translating unfamiliar vocabulary, or critiquing an outline. These may be encouraged in one class and prohibited in another—when in doubt, pause and check the policy.',
        ],
      },
    ],
    activity: {
      title: 'Activity 1: Coach Use, Crutch Use, or Gray Zone? (5 Real Scenarios)',
      instructions: [
        'Classify each of the 5 student scenarios below as Coach Use, Crutch Use, or Gray Zone, and explain in 1–2 sentences what makes it helpful or risky.',
      ],
      scenarios: [
        'Scenario 1 (Math Sign Error): "I solved this equation and got x = 7, but the back of the book says x = 12. Here are my 4 steps—do not solve it for me, just point out which line has a sign error."',
        'Scenario 2 (Climate Change Conclusion): "Write my conclusion paragraph on climate change in a 10th-grade voice so I can turn this paper in and go to sleep."',
        'Scenario 3 (Thesis Counterarguments): "Here is my thesis statement and my three main reasons. What is the strongest counterargument a critic might raise against my second reason?"',
        'Scenario 4 (College-Professor Rewrite): "Rewrite my entire rough draft so it sounds like a college professor wrote it."',
        'Scenario 5 (Spanish Translation & Quiz): "Translate this Spanish article into English so I don’t have to read the Spanish, then quiz me on 5 vocabulary words."',
      ],
      reflection: [
        'For any scenario that falls into the Gray Zone (such as Scenario 3 or Scenario 5), what specific question should you ask your teacher before submitting the assignment?',
      ],
    },
    miniCheck: [
      'What is the Power Tool Principle in your own words?',
      'Give two concrete examples of Coach Use and two examples of Crutch Use.',
      'Why is "finishing fast" a bad measure of whether an AI prompt helped you?',
    ],
    teachBack: 'Explain the Power Tool Principle and the difference between Coach Use, Crutch Use, and Gray-Zone Use to a friend who just started using AI for school.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-06.png',
    title: 'Know the Policy Before Using the Power & 10-Question Tutor Discovery',
    bigIdea: [
      'Before you use AI on any school task, you need two kinds of clarity: (1) knowing the exact classroom policy for that assignment, and (2) knowing how your own PlayIQ Tutor Project stores instructions versus knowledge.',
      'In Module 1, you used a 10-question one-at-a-time discovery interview to build a Character Guardrail Card. Now you will use that exact same 10-question one-at-a-time discovery method inside your existing PlayIQ Tutor Project to lock in your learning boundaries, policy rules, and focus habits.',
    ],
    sections: [
      {
        title: 'Part 2A: Workspace Architecture — Project vs. Project Instructions vs. Knowledge File',
        content: [
          'As you build your tutor across PlayIQ, keep these three building blocks distinct:',
          '1. Persistent Project (PlayIQ Tutor Project): Your dedicated workspace container in ChatGPT, Claude, or Gemini where all your course calibration chats live. Never create a second duplicate Tutor Project.',
          '2. Project Instructions (System Rules): The core behavioral rules that tell your tutor how to coach you on every turn (e.g., Hint First, No Homework Shortcuts, Voice Preservation).',
          '3. Knowledge Files (Reference Sources): Approved markdown documents (like your Module 1 Character Card and the 6 Tutor Knowledge Files you will compile in Module 9) that give your tutor verified evidence about how you learn.',
        ],
      },
      {
        title: 'Part 2B: The 5-Point Policy Checklist & PlayIQ Transparency Declaration',
        content: [
          'Different teachers have different AI rules. Before using AI on any school assignment, run the 5-Point Policy Checklist:',
          '1. Is AI allowed at all on this specific assignment?',
          '2. Which specific uses are permitted (e.g., brainstorming, outlining, Socratic quizzing, or feedback)?',
          '3. Which parts of the work must be 100% created by me without AI assistance?',
          '4. Am I required to disclose or cite how I used AI?',
          '5. If the instructions are unclear, have I asked my teacher BEFORE using AI?',
          'When AI coaching is allowed, use the PlayIQ Transparency Declaration formula at the bottom of your work: "I used [AI Tool] in [PlayIQ Mode] to [specific coaching/brainstorming action]. I wrote, verified, and edited all final work myself."',
        ],
      },
      {
        title: 'Part 2C: Practical 10-Question Tutor Discovery Step (In Your Existing PlayIQ Tutor Project)',
        content: [
          'In Module 1, you saw how a 10-question one-at-a-time discovery interview prevented your character from drifting. Now open your existing PlayIQ Tutor Project (the same one you created in Module 00) and run the 10-Question Tutor Discovery prompt below.',
          'PROMPT:Module 2 — 10-Question One-at-a-Time Tutor Discovery Prompt|I am in PlayIQ Module 2: Digital Smarts and Human Responsibility.\nHelp me turn what we already know about my learning into a clear Tutor Discovery Summary for my existing PlayIQ Tutor Project.\n\nRules:\n1. Ask me 10 short discovery questions, ONE question at a time, and wait for my answer before asking the next.\n2. Cover: subjects I want to rescue or advance, explanation openings that helped in Module 1, when I want hints vs explanations, how to protect my own writing voice, school-policy boundaries, focus block length to test, what distracts me, what reset helps me return, and how you should check my understanding.\n3. Do not write my schoolwork or invent results I have not tested.\n4. Mark any self-reported pattern without lab evidence as pending_validation.\n5. After Question 10, show me:\n   - a Tutor Guardrail Summary (Must-Do Coaching Rules, Must-Never-Do Shortcut Rules, Voice Protection Rule, Verification Rule)\n   - a proposed Module 2 Learning Record note\n6. Wait for my approval before treating the summary as final.\n\nStart now with Question 1 of 10.',
          'Why this matters: By answering 10 focused questions one at a time and reviewing the Tutor Guardrail Summary before approving it, you stay in full control of what your AI Tutor records about you.',
        ],
      },
    ],
    activity: {
      title: 'Activity 2: Classroom Policy Audit, Transparency Declaration & 10-Question Discovery',
      instructions: [
        'Apply this sample classroom policy to Scenarios 1–3: "AI may be used for brainstorming, outlining, and feedback. AI may NOT write or rewrite any sentences that appear in your submitted assignment. Students must include a 1-sentence AI disclosure." Then record your 10-Question Tutor Discovery check in Scenarios 4–5.',
      ],
      scenarios: [
        'Policy Check 1: Asking AI "Write my introduction paragraph on renewable energy, and I will change three words so it looks like mine." (Allowed or Not Allowed under the policy, and why?)',
        'Policy Check 2: Writing your own rough draft first, then asking AI "Point out the weakest claim in my second paragraph and ask me one question to help me strengthen it myself." (Allowed or Not Allowed, and why?)',
        'Transparency Declaration: Write a complete PlayIQ Transparency Declaration sentence for Policy Check 2 using the formula: "I used [AI Tool] in [Mode] to [action]. I wrote, verified, and edited all final work myself."',
        '10-Question Tutor Discovery Check: Did your PlayIQ Tutor Project ask the 10 discovery questions one at a time and mark untested patterns as pending_validation?',
        'Approved Tutor Guardrail Summary: Paste or summarize 2 Must-Do Coaching Rules and 2 Must-Never-Do Shortcut Rules from your approved Tutor Guardrail Summary.',
      ],
      reflection: [
        'Why is it essential to keep using your single persistent PlayIQ Tutor Project rather than creating a separate new project in every module?',
      ],
    },
    miniCheck: [
      'What is the difference between a Project, Project Instructions, and a Knowledge File?',
      'What are the 5 questions on the PlayIQ Policy Checklist?',
      'Why does the 10-Question Tutor Discovery prompt require the AI to ask one question at a time and mark untested habits as pending_validation?',
    ],
    teachBack: 'Explain to a classmate how to check a teacher’s AI policy, write a PlayIQ Transparency Declaration, and run the 10-Question Tutor Discovery step in their PlayIQ Tutor Project.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-07.png',
    title: 'Keep Your Own Voice',
    bigIdea: [
      'Your writing voice—your word choices, rhythm, examples, and way of connecting ideas—is the fingerprint of your thinking.',
      'When you ask AI to "rewrite this so it sounds smarter," it strips away your human voice and replaces it with generic, plastic AI prose that you cannot defend when your teacher asks you about it.',
      'Your strongest protection in the AI era is an authentic process: keep your notes and drafts, use Coaching Mode (feedback without rewriting), and be ready to explain every sentence out loud.',
    ],
    sections: [
      {
        title: 'Part 3A: Why AI Detectors Are Not Proof—And What Actually Protects You',
        content: [
          'Many schools and websites claim "AI detectors" can prove whether a human or an AI wrote an essay. In reality, automated AI detectors are unreliable: they frequently flag honest student writing as AI (false positives) and miss edited AI text (false negatives).',
          'Never rely on an AI detector score—or "humanizer" tricks—to prove your integrity.',
          'What actually proves your work is yours? Three concrete things:',
          '1. Your Paper Trail: Saved notes, outlines, and version history showing how your draft grew step by step.',
          '2. Your Natural Human Voice: Writing that uses your real vocabulary and concrete examples instead of inflated robotic buzzwords.',
          '3. Your Oral Defense: Being able to look your teacher in the eye and explain what your thesis means, why you chose your evidence, and what every word in your paragraph means.',
        ],
      },
      {
        title: 'Part 3B: Activity 3 — The Voice Preservation Experiment (Rewrite vs. Coaching)',
        content: [
          'Write a short 4-sentence paragraph about a hobby, game, sport you love—or about your Module 1 original character’s core motto. Then test these two prompts on your paragraph:',
          'PROMPT:Round A — Rewrite Request (Voice Eraser)|Rewrite my paragraph below so it sounds maximally sophisticated, formal, and academic:\n[Paste your 4-sentence paragraph]',
          'PROMPT:Round B — Coaching Request (Voice Protector)|Use Coach Mode. Do NOT rewrite my paragraph or generate replacement sentences. Read my 4-sentence paragraph below, identify 1 place where my idea could be clearer or more specific, and ask me 1 question so I can revise it in my own voice:\n[Paste your 4-sentence paragraph]',
          'Compare Round A and Round B: Notice how Round A erases your personality while Round B sharpens your thinking without stealing the pen from your hand.',
        ],
      },
    ],
    activity: {
      title: 'Activity 3: Voice Preservation Experiment',
      instructions: [
        'Write your original 4-sentence paragraph, run Round A (Rewrite Request) and Round B (Coaching Request), and record what happened.',
      ],
      scenarios: [
        'Your Original 4-Sentence Paragraph: Paste the 4 sentences you wrote in your own natural voice.',
        'Round A Observation (Rewrite Request): What words or phrases did the AI insert that do not sound like how you actually talk or think?',
        'Round B Observation (Coaching Request): What question or feedback did the AI coach give you without rewriting your sentences?',
        'Your Own Revision: Paste the 1 sentence you chose to revise yourself—still 100% in your own human voice.',
      ],
      reflection: [
        'If a teacher asked you to explain your paragraph out loud without looking at the page, why would Round B prepare you far better than Round A?',
      ],
    },
    miniCheck: [
      'Why are automated AI-detection scores not reliable proof of authorship?',
      'What three things provide real proof that you own your writing?',
      'What boundary must you put in a writing prompt so AI acts as a coach instead of a ghostwriter?',
    ],
    teachBack: 'Explain why asking AI to "rewrite my draft to sound smarter" hurts both your voice and your credibility, and give the exact prompt boundary that keeps your voice intact.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-08.png',
    title: 'The PlayIQ Truth Filter & Pause Before Share Protocol',
    bigIdea: [
      'Digital smarts isn’t just about how you write—it’s about what you believe and what you amplify online.',
      'AI can generate hyper-realistic fake images, voice clones, and viral misinformation in seconds. Popularity, shares, and confident formatting are never proof of truth.',
      'Before believing a claim, run the 5-Step PlayIQ Truth Filter. Before sharing or forwarding anything about another person, run the Triple-P Pause Before Share Protocol.',
    ],
    sections: [
      {
        title: 'Part 4A: The 5-Step PlayIQ Truth Filter',
        content: [
          'Whenever you encounter a surprising claim, viral statistic, or AI summary, run these 5 checks:',
          'Step 1: Exact Claim Check — What specific fact is being claimed once you strip away the emotional or dramatic headline?',
          'Step 2: Evidence Check — What primary evidence, data, or named source is actually provided (not just "experts say" or "people are saying")?',
          'Step 3: Trusted Source Cross-Check — Do at least two independent, reputable sources confirm this exact claim?',
          'Step 4: Missing Context Check — Was a clip, quote, or chart cropped or taken out of context to make it look outrageous?',
          'Step 5: Consequence Check — What happens to my work or to other people if I repeat this and it turns out to be false?',
        ],
      },
      {
        title: 'Part 4B: Pause Before Share — The Triple-P Check',
        content: [
          'Before you post, forward, or drop a shocking screenshot, image, or audio clip into a group chat, stop for 10 seconds and run the Triple-P Check:',
          '• 1. PLAUSIBILITY & TRUTH: Do I know for a verified fact that this is authentic and unaltered, or could it be AI-generated, edited, or staged?',
          '• 2. PERMISSION & RESPECT: Do I have permission to share this person’s likeness or words, and would I want this shared if it were about me or my family?',
          '• 3. PURPOSE & HARM: Am I sharing this to inform and help, or just to get laughs, clout, or drama at someone else’s expense?',
        ],
      },
    ],
    activity: {
      title: 'Activity 4: Truth Filter & The Principal AI Image Scenario',
      instructions: [
        'Apply the 5-Step PlayIQ Truth Filter and the Triple-P Pause Before Share Protocol to the scenarios below.',
      ],
      scenarios: [
        'Truth Filter Practice: A viral post claims, "NASA just confirmed the Moon produces 15% of its own visible light through radioactive glowing rocks." Walk through Steps 1–3 of the Truth Filter to evaluate and check this claim.',
        'The Principal Scenario (Part A — Triple-P Audit): A classmate sends you a realistic-looking image of your school principal spray-painting a rival school’s bus and says, "Drop this in the grade group chat right now before it gets deleted!" Evaluate this using Plausibility, Permission, and Purpose/Harm.',
        'The Principal Scenario (Part B — Highest Path Action): What is your exact next move, and what 1-sentence reply do you send to your classmate?',
      ],
      reflection: [
        'Why does forwarding an unverified or AI-faked image make the sharer part of the harm, even if they didn’t create the image themselves?',
      ],
    },
    miniCheck: [
      'List the 5 steps of the PlayIQ Truth Filter.',
      'What do the three Ps in the Triple-P Pause Before Share Check stand for?',
      'Why is "Everyone in the group chat is already sharing it" never a valid excuse to repost synthetic or harmful media?',
    ],
    teachBack: 'Walk a younger student through the 5-Step Truth Filter and the Triple-P Pause Before Share Check using a real-world example of viral or AI-generated content.',
  },

  '5': {
    id: '5',
    imageUrl: '/images/modules/bright-mixed-playiq-09.png',
    title: 'Learn How You Learn Lab: Focus Without Overwhelm',
    bigIdea: [
      'Even the best AI tutor cannot help you if your attention is fractured every 90 seconds by notifications, tab-switching, or overwhelm.',
      'Focus is not an all-or-nothing personality trait—it is a trainable sprint rhythm. In this lab, you will test three focus sprint lengths (5 minutes, 10 minutes, and 15 minutes) with short physical resets in between to discover your current optimal starting sprint.',
    ],
    sections: [
      {
        title: 'Part 5A: Focus Lab Setup & Rest vs. Escape',
        content: [
          'First, know the difference between Intentional Rest and Digital Escape:',
          '• INTENTIONAL REST (Recharges You): Standing up, stretching, drinking water, taking 5 slow breaths, or looking out a window for 2–3 minutes with a clear return time.',
          '• DIGITAL ESCAPE (Drains You): Clicking onto short-form video feeds, group chats, or games "just for a second" because a homework task feels uncomfortable—which hijacks your dopamine and makes returning to work 10x harder.',
          'Lab Setup: Pick ONE real school study task or homework assignment. Put your phone in another room or out of reach, close unrelated browser tabs, and keep a timer ready.',
        ],
      },
      {
        title: 'Part 5B: Run the 3 Calibrated Focus Sprints (5 / 10 / 15 Minutes)',
        content: [
          'Step 1 — Sprint 1 (5-Minute Micro-Sprint): Work with 100% single-task focus for 5 minutes. Stop when the timer rings. Rate Focus Quality (1–5) and Distraction Pull (1–5). Take a 2-minute physical reset (water, stretch, or breathing—no screens!).',
          'Step 2 — Sprint 2 (10-Minute Power Sprint): Continue the same study task for 10 uninterrupted minutes. Rate Focus Quality (1–5) and Distraction Pull (1–5). Take a 3-minute physical reset (no screens!).',
          'Step 3 — Sprint 3 (15-Minute Deep Sprint): Continue for 15 uninterrupted minutes. Rate Focus Quality (1–5), Distraction Pull (1–5), and note the exact minute your attention first tried to wander.',
          'Why this matters: You are gathering real data on your attention span today so your AI Tutor knows how long to make your study blocks before checking in.',
        ],
      },
    ],
    activity: {
      title: 'Activity 5: Calibrated Focus Sprint Scorecard & Lab Synthesis',
      instructions: [
        'Record your honest ratings from Sprint 1 (5 min), Sprint 2 (10 min), and Sprint 3 (15 min) and synthesize your focus rules.',
      ],
      scenarios: [
        'Sprint 1 (5-Min Micro-Sprint): What task did you work on, what was your Focus Quality (1–5) and Distraction Pull (1–5), and what did you finish?',
        'Sprint 2 (10-Min Power Sprint): What was your Focus Quality (1–5) and Distraction Pull (1–5), and how did your 2-minute non-screen reset affect your energy?',
        'Sprint 3 (15-Min Deep Sprint): What was your Focus Quality (1–5) and Distraction Pull (1–5), and at what minute did your attention first try to drift?',
        'Lab Synthesis: Which sprint length (5, 10, or 15 minutes) gave you the highest quality progress without overwhelm, what was your #1 distraction trigger, and which physical reset (movement, water, breathing, quiet) worked best?',
      ],
      reflection: [
        'What is the difference between taking a 3-minute Intentional Rest and falling into a 45-minute Digital Escape loop?',
      ],
    },
    miniCheck: [
      'What is the difference between Intentional Rest and Digital Escape?',
      'Why must your 2–3 minute reset between focus sprints be screen-free?',
      'Which focus sprint length (5, 10, or 15 minutes) worked best in your lab today, and why is that a starting calibration rather than a permanent limit?',
    ],
    teachBack: 'Explain how the 5/10/15-minute Focus Sprint Lab works and how separating Intentional Rest from Digital Escape protects your attention.',
  },

  '6': {
    id: '6',
    imageUrl: '/images/modules/bright-mixed-playiq-10.png',
    title: 'Blueprint Update, Course Learning Record & Digital Power Card',
    bigIdea: [
      'Now you will lock in your Module 2 discoveries—your calibrated focus sprint (`focus_block_setting`), your voice-protection rule (`coaching_boundary: feedback_only_never_rewrite`), and your policy/integrity rule (`student_owns_final_work: true`)—into your Learning Supercharger Blueprint and Course Learning Record.',
      'This prepares you for the Module 2 Highest Path Boss Battle and your PlayIQ Digital Power Card proof artifact.',
    ],
    sections: [
      {
        title: 'Part 6: Learning Supercharger Blueprint Update (voice-preservation-and-pacing)',
        content: [
          'Add these two evidence-tested settings to your Learning Supercharger Blueprint:',
          '• focus_block_setting: [5_min | 10_min | 15_min] — Orion structures study sessions into sprints of this length, gives one clear target per sprint, and prompts a short screen-free reset before checking in.',
          '• coaching_boundary: feedback_only_never_rewrite — Orion critiques clarity, asks Socratic questions, and points out gaps, but never rewrites or ghostwrites sentences for your school submissions.',
          '• student_owns_final_work: true — Every submitted sentence, calculation, and claim is written, verified, and understood by you.',
        ],
      },
      {
        title: 'Part 7: Module 2 Course Learning Record Checkpoint Prompt',
        content: [
          'Open your persistent PlayIQ Tutor Project and send this checkpoint prompt so your tutor updates your Course Learning Record with your Module 2 results:',
          'PROMPT:Part 7 — Module 2 Course Learning Record Checkpoint Prompt|Here are my Module 2 results for my PlayIQ Course Learning Record:\n- Coach vs. Crutch boundary I will enforce: [your rule]\n- Classroom Policy & Transparency rule: Always run the 5-Point Policy Checklist and include a PlayIQ Transparency Declaration when AI coaching is used\n- Voice Preservation Experiment result: Round B (Coaching) protected my voice; coaching_boundary = feedback_only_never_rewrite\n- Focus Without Overwhelm Lab result: Tested 5/10/15-min sprints; my calibrated starting sprint is [5 | 10 | 15] minutes with a [movement | water | breathing | quiet] reset\n- 10-Question Tutor Discovery status: Completed and approved in my PlayIQ Tutor Project\nPlease distinguish between my lab-tested evidence and any pending_validation items, and show me my concise Module 2 Course Learning Record entry for my approval.',
        ],
      },
      {
        title: 'Part 8 & Part 9 Preview: PlayIQ Digital Power Card & Highest Path Boss Battle',
        content: [
          'In your Module 2 Boss Battle and Proof Artifacts next, you will:',
          '1. Face the Sunday 10:30 PM History Paper Emergency (where a classmate texts you a "detector-bypass" ghostwriting prompt) and build a 3-Point Emergency Action Plan inside your Tutor Project that saves your grade AND your integrity.',
          '2. Complete your PlayIQ Digital Power Card with your Student Handle, Calibrated Focus Sprint (5 / 10 / 15 min), 5 Mastery Checkboxes, Transparent Disclosure Statement, and Personal Integrity Pledge.',
        ],
      },
    ],
    activity: {
      title: 'Blueprint Staging & Highest Path Pre-Check',
      instructions: [
        'Stage your Module 2 Blueprint rules and practice applying your Coach, Policy, and Voice rules before entering the Quiz and Boss Battle.',
      ],
      scenarios: [
        'Staged Focus Sprint Rule: Write your 1-sentence plain-English rule for how Orion should pace your study blocks and resets.',
        'Staged Voice Protection Rule: Write your 1-sentence plain-English rule forbidding AI ghostwriting and protecting your natural voice.',
        'Transparent Disclosure Draft: Draft a 1-sentence PlayIQ Transparency Declaration you can use whenever a teacher allows AI brainstorming or coaching.',
        'Emergency Pre-Check: If it is 10:30 PM the night before a 3-page paper is due and you only have messy notes, what is one Coach Mode move that helps you finish honestly without letting AI write a single sentence?',
      ],
      reflection: [
        'Confirm which of the 5 Digital Power Card competencies you feel strongest in right now: (1) Coach vs. Crutch, (2) 5-Point Policy Check, (3) Voice Protection, (4) 5-Step Truth Filter & Triple-P Check, (5) Calibrated Focus Sprint.',
      ],
    },
    miniCheck: [
      'What two settings are added to your Learning Supercharger Blueprint in Module 2?',
      'What is the exact formula for a PlayIQ Transparency Declaration?',
      'Why must your AI Tutor never act as a "humanizer" or rewrite your draft to evade detection?',
    ],
    teachBack: 'Summarize your Module 2 Blueprint settings (focus_block_setting and coaching_boundary) and explain how they keep technology as a Superpower on your Highest Path.',
  },
};
