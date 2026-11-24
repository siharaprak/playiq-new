import type { NodeContent } from './module1Content';

export const module12AssistantTestNodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-01.png',
    title: '5-Prompt Personal Assistant Builder, Local Memory Folder & Reminder Reality Check',
    bigIdea: [
      'A real Personal AI Assistant needs two superpowers: (1) Discovery Questions so it learns how you think and work, and (2) Structured Local Memory Files saved in a plain folder on your computer (`My_Personal_Assistant/`) so it remembers you across sessions without needing GitHub or code.',
      'Crucial reality check: if an AI writes "I will remind you at 4:00 PM tomorrow" in chat, that text alone does NOT schedule a real notification—just like chatting does NOT permanently save memory unless you write it to your files ("Text > Brain").',
    ],
    sections: [
      {
        title: 'Part 0: The 30-second reality check',
        content: [
          'Suppose your assistant writes in chat: "✅ Reminder set! I will ping you tomorrow at 4:00 PM to practice."',
          'Does a reminder written in chat prove a notification is scheduled?',
          ' Option A: Yes, writing the reminder is enough.',
          ' Option B: No — you must check a real scheduling feature, permissions, settings, and confirmation.',
          'The correct choice is B! Standard chat text is just words on a screen unless you verify an actual calendar, alarm, or verified scheduling tool.',
        ],
      },
      {
        title: 'Part 1: Build Your Assistant & Local Memory Vault in 5 Copy-Paste Prompts',
        content: [
          'Create one plain folder on your computer named `Documents/My_Personal_Assistant/` (keep it separate from your Module 00 PlayIQ Tutor). Then open the Module 12 Overview page and copy-paste Prompts 1 -> 5 in order into one private AI chat:',
          '• Prompt 1 (Discovery Interview) -> Interviews you 1 question at a time (8 questions) and outputs `01_ABOUT_ME_AND_HOW_I_WORK.md`.',
          '• Prompt 2 (Compass & Goals) -> Builds `00_MY_COMPASS.md` (your 1-page Top 3 priorities & file router) + `02_ACTIVE_GOALS_AND_ROUTINES.md` (clean Project Cards).',
          '• Prompt 3 (Long-Term Memory Vault) -> Builds `03_LONG_TERM_MEMORY_VAULT.md` with Trust Tags (`[CONFIRMED]`, `[TRYING_OUT]`, `[NEEDS_CHECK]`), a human approval gate, and a strict privacy/secret filter.',
          '• Prompt 4 (5-Bullet Handoff Log) -> Builds `04_SESSION_HANDOFF_LOG.md` so `/closeout` saves compact 5-bullet updates instead of losing progress.',
          '• Prompt 5 (Locked-Spine Master Compiler) -> Compiles `00_MASTER_ASSISTANT_INSTRUCTIONS.md` without letting the AI shorten or water down its 8 core sections. Paste `00_MASTER_ASSISTANT_INSTRUCTIONS.md` into your separate `My Personal Assistant` Project Instructions (and PlayIQ Assistant Builder Studio Tab 2) and upload `00_MY_COMPASS.md` + `01–04` as Knowledge Files!',
        ],
      },
    ],
    activity: {
      title: 'Run the 5-Prompt Builder & Complete the Reminder Reality Check',
      instructions: [
        'Select Option B in the digital lesson choice (`m12-reminder`).',
        'Run Prompts 1–5 from the Module 12 Overview panel, save the `.md` files into your local `My_Personal_Assistant/` folder, and install them in your separate `My Personal Assistant` Project + PlayIQ Assistant Studio.',
      ],
      scenarios: [
        'Digital choice m12-reminder completed (Chat text != scheduled notification)',
        'Local folder My_Personal_Assistant/ created & Prompts 1–5 installed in separate Assistant Project + Studio',
      ],
      reflection: [
        'Why does starting with 1-at-a-time Discovery questions and saving `.md` files to your local drive create a much stronger Personal Assistant than asking AI to "make me an assistant" in one vague sentence?',
      ],
    },
    miniCheck: [
      'Does a reminder written in chat prove a notification is scheduled?',
      'What must you check before trusting that a reminder will actually fire?',
      'Which separate Project and local folder hold your Personal Assistant instructions and memory files in Module 12?',
    ],
    teachBack: 'Explain why a reminder written in chat does not prove a notification is scheduled, and how your local My_Personal_Assistant folder keeps memory separate from your Module 00 Tutor.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-02.png',
    title: 'Four Verification Checks (Normal, Missing Detail, Boundary & Fresh-Chat Memory)',
    bigIdea: [
      'Put your configured Personal Assistant through three core behavior tests—(1) Normal Request, (2) Missing Detail, and (3) Safety/Authorship Boundary—plus a Fresh-Chat Memory Check to verify it actually reads your uploaded `00_MY_COMPASS.md` and `01_ABOUT_ME_AND_HOW_I_WORK.md`.',
    ],
    sections: [
      {
        title: 'Part 2: Run Your Verification Tests (Rating: 3 / 2 / 1 / N/T)',
        content: [
          'Test 1 — A Normal Request (`/capture` or `/plan`): Give a clear everyday request for one of your active goals. Does it follow your 8-section Master Instructions and offer 2–3 options you choose from?',
          'Test 2 — A Missing Detail or Changed Plan: Leave out a key detail (like time available or which project) or change your plan mid-chat. Does it stop and ask 1–2 clarifying questions instead of guessing?',
          'Test 3 — A Boundary Test: Ask it to cross a boundary (such as writing a graded school assignment for you or making a final decision without you—never paste real private data). Does it refuse politely and keep you in control?',
          'Test 4 — Fresh-Chat Memory Check: Open a brand-new chat inside your `My Personal Assistant` Project and ask: "Based on my uploaded Compass and About Me files, what are my top priorities and how do I like plans formatted?" Confirm it knows you immediately from your Knowledge Files!',
        ],
      },
      {
        title: 'Record what actually happened (3 = Worked | 2 = Partly | 1 = Missed | N/T = not_tested)',
        content: [
          'For each test, record honestly:',
          '• What prompt I sent | • What the assistant actually replied | • Rating (1, 2, 3, or N/T for not_tested) | • One rule to tighten if needed',
        ],
      },
    ],
    activity: {
      title: 'Run the Assistant Stress Tests & Fresh-Chat Memory Check',
      instructions: [
        'Run Test 1 (Normal), Test 2 (Missing detail), Test 3 (Boundary), and the Fresh-Chat Memory Check in your My Personal Assistant Project and/or PlayIQ Studio Sandbox.',
        'Score each test honestly using 1 / 2 / 3 / N/T.',
      ],
      scenarios: [
        'Test 1 (Normal request) & Fresh-Chat Memory recall: prompt, observed reply, rating (1/2/3/N/T)',
        'Test 2 (Missing detail or changed plan): prompt, observed reply, rating (1/2/3/N/T)',
        'Test 3 (Boundary test): prompt, observed reply, rating (1/2/3/N/T)',
      ],
      reflection: [
        'How did your assistant handle Test 2 when you left out a detail, and what did it recall in a fresh chat from your uploaded Knowledge Files?',
      ],
    },
    miniCheck: [
      'What are the three core behavior tests you run on your Personal Assistant in Module 12?',
      'What should your assistant do in Test 2 when a detail is missing?',
      'What should your assistant do in Test 3 when asked to cross a schoolwork or safety boundary?',
    ],
    teachBack: 'Describe the tests you ran on your Personal Assistant (Normal, Missing Detail, Boundary, and Fresh-Chat Memory) and what you observed.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-03.png',
    title: 'Improve One Rule, Run `/capture` & Save a 5-Bullet `/closeout` Handoff',
    bigIdea: [
      'Tighten ONE specific line in `00_MASTER_ASSISTANT_INSTRUCTIONS.md` and repeat the exact same test to verify improvement.',
      'Practice daily memory hygiene ("Text > Brain"): use `/capture` (Capture -> Organize -> Review) on rough notes, then run `/closeout` to save a 5-Bullet Handoff entry into `04_SESSION_HANDOFF_LOG.md` on your local drive.',
    ],
    sections: [
      {
        title: 'Part 3: Improve one part and repeat the test',
        content: [
          'Pick any weak spot from your tests (or customize one workflow rule even more sharply).',
          'Update ONE specific line in `00_MASTER_ASSISTANT_INSTRUCTIONS.md` (save Snapshot `v2` in Studio and update your local file + external Project).',
          'Repeat the exact same test prompt to confirm Before vs. After improvement.',
        ],
      },
      {
        title: 'Part 4: `/capture` + `/closeout` — Keeping Your Local Drive Memory Alive',
        content: [
          '1. Capture (`/capture`): Drop 3–5 messy, non-private bullet points (ideas, tasks, or project notes) into your Assistant.',
          '2. Organize & Review: Let your Assistant group them into options, review every line yourself, and choose what to keep.',
          '3. Save to Local Memory (`/closeout` & `/remember`): Type `/closeout` at the end of your session. Copy the 5-Bullet Handoff block into `04_SESSION_HANDOFF_LOG.md` (and any approved `[CONFIRMED]` preference into `03_LONG_TERM_MEMORY_VAULT.md`) inside `My_Personal_Assistant/` on your computer!',
          'Remember: chat text in one window, uploaded Knowledge Files, and permanent account memory are separate capabilities—saving clean `.md` files on your local drive keeps YOU in control across any AI.',
        ],
      },
    ],
    activity: {
      title: 'One-Instruction Retest, `/capture` Trial & `/closeout` Local Save',
      instructions: [
        'Tighten one line in `00_MASTER_ASSISTANT_INSTRUCTIONS.md` and repeat the same test.',
        'Run `/capture` on 3–5 safe notes and `/closeout` to save a 5-bullet entry in your local `04_SESSION_HANDOFF_LOG.md`.',
        'Verify what real reminder method (calendar, phone alarm, or planner) you use outside chat.',
      ],
      scenarios: [
        'One instruction tightened + repeated test result (Before vs. After)',
        'Capture -> Organize -> Review + /closeout 5-bullet handoff saved to local My_Personal_Assistant/ folder',
        'Real reminder method verified outside chat (or marked "not set up")',
      ],
      reflection: [
        'Why does the "Text > Brain" rule (saving approved updates to your local `.md` files instead of assuming chat remembers forever) make your assistant portable across any AI?',
      ],
    },
    miniCheck: [
      'What should you do if one of your Assistant tests misses?',
      'What are the three steps of the "Journal with a Helper" (`/capture`) workflow?',
      'Can an assistant organize notes in chat without permanently remembering them unless you save an update?',
    ],
    teachBack: 'Explain the one instruction you revised and retested, and describe how Capture -> Organize -> Review and `/closeout` work with your local files.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-04.png',
    title: 'Capability Boundaries & Confirm Your Module 12 Personal Assistant Record',
    bigIdea: [
      'You now own a portable, memory-backed Personal AI Assistant stored on your own computer (`My_Personal_Assistant/`)—separate from your Module 00 PlayIQ Subject Tutor.',
      'Complete the final capability check and save your Module 12 Learning Record on PlayIQ.',
    ],
    sections: [
      {
        title: 'Part 5: What your Personal Assistant CAN — and CANNOT — do',
        content: [
          'What your Personal Assistant CAN do reliably:',
          '• Read your uploaded `00_MY_COMPASS.md` and `01–04` memory files so every new chat starts knowing your goals and style',
          '• Ask 1–2 clarifying questions when details are missing instead of guessing',
          '• Turn messy ideas into structured checklists (`/capture`, `/plan`, `/morning`) and generate 5-bullet `/closeout` memory updates for your local drive',
          'What your Personal Assistant CANNOT do on its own:',
          '• Trigger a real phone alarm just by writing "Reminder set!" in chat without a verified scheduling tool',
          '• Silently know things you never shared or never saved into its files',
          '• Replace your human decisions, responsibility, or schoolwork authorship',
        ],
      },
      {
        title: 'Part 6: Record what your tests taught you',
        content: [
          'Complete the 3 Quick Quiz questions in the digital lesson choices panel (`m12-quiz-1..3`).',
          'Save & Confirm your Module 12 Learning Record on PlayIQ:',
          '• `assistantTests`: Your Normal, Missing Detail, Boundary, and Fresh-Chat Memory test results',
          '• `assistantRevision`: Your 1-line revision & retest, local `My_Personal_Assistant/` setup, and real reminder method',
        ],
      },
    ],
    activity: {
      title: 'Save Your Module 12 Personal Assistant & Local Memory Record',
      instructions: [
        'Complete the digital quiz choices (`m12-quiz-1`, `m12-quiz-2`, `m12-quiz-3`).',
        'Save `assistantTests` and `assistantRevision` in the Module 12 Learning Record panel.',
      ],
      scenarios: [
        'Core Assistant tests (Normal, Missing Detail, Boundary + Fresh-Chat Memory) recorded honestly',
        '1 instruction tightened and retested on Snapshot v2',
        'Local My_Personal_Assistant/ memory folder & real reminder verification recorded',
      ],
      reflection: [
        'What is the #1 workflow or goal in `00_MY_COMPASS.md` you plan to use your Personal Assistant for this week?',
      ],
    },
    miniCheck: [
      'The assistant wrote a reminder in chat. What do you know for sure?',
      'What is the difference between temporary chat text, your local/uploaded `.md` Knowledge Files, and automatic account memory?',
      'How do your Module 00 Tutor and your Module 12 Personal Assistant work as two separate tools?',
    ],
    teachBack: 'Summarize your Assistant test results, your one-instruction retest, how your local My_Personal_Assistant memory files work, and why chat text is not a scheduled reminder.',
  },
};
