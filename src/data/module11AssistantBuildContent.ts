import type { NodeContent } from './module1Content';

export const module11AssistantBuildNodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-01.png',
    title: 'Tutor vs. Personal Assistant & Separate Project Rule',
    bigIdea: [
      'Your mission: design and build a Personal AI Assistant for one safe, everyday workflow in a SEPARATE private Project named "My Personal Assistant".',
      'Your Module 00 PlayIQ Tutor helps you learn school subjects. Your Module 11 Personal Assistant helps you organize, plan, or structure one chosen everyday task — while you make the real decisions.',
    ],
    sections: [
      {
        title: 'Part 0: The 30-second assistant idea',
        content: [
          'Compare these two requests:',
          'Request A: "Be my assistant and help with my life."',
          'Request B: "Help plan my art-project ideas, ask which one to work on, and show three small steps I can choose from."',
          'Request B gives the assistant a clear job, clear steps, and leaves the choice with the student.',
        ],
      },
      {
        title: 'Part 1: Tutor vs. Personal Assistant (Keep Them in Separate Projects!)',
        content: [
          '• PlayIQ Personal Tutor (Modules 00–10): Lives in your Module 00 PlayIQ Tutor Project. Built for understanding, hints, Lesson Rescue, self-testing, and protecting your writing voice.',
          '• Personal AI Assistant (Modules 11–12): Lives in a NEW, SEPARATE private Project named "My Personal Assistant". Built for one safe everyday workflow (such as organizing club/art project steps, planning practice routines, sorting study checklists, or structuring hobby ideas).',
          'Never mix Assistant task files into your Module 00 Tutor Project, and never upload private family, financial, medical, or password data.',
        ],
      },
    ],
    activity: {
      title: 'Choose One Safe Everyday Task for Your Assistant',
      instructions: [
        'Answer the 30-second assistant choice in the digital choices panel.',
        'Pick one safe, specific task or routine you actually do (for example: planning a weekly sports/music practice routine, organizing creative project ideas, breaking homework checklists into time blocks, or tracking hobby materials).',
        'Verify with your parent/guardian that this task is safe and does not require private personal data.',
      ],
      scenarios: [
        'My chosen everyday task for My Personal Assistant:',
        'Why this belongs in a separate Project from my Module 00 Tutor:',
        'Privacy check: what information will I NEVER enter into this Assistant?',
      ],
      reflection: [
        'Why does "Help with one clear workflow" work better than "Help with my whole life"?',
      ],
    },
    miniCheck: [
      'What is the difference between your PlayIQ Tutor and your Personal AI Assistant?',
      'Should you build your Personal Assistant inside your Module 00 Tutor Project or in a separate Project?',
      'Why is Request B clearer than Request A?',
    ],
    teachBack: 'Explain the difference between your PlayIQ Tutor and your Personal AI Assistant, and describe the one safe workflow you chose.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-02.png',
    title: 'Map the Real Workflow & Run 9 One-at-a-Time Discovery Questions',
    bigIdea: [
      'Before writing any AI instructions, map how the task actually works in real life: Task, Steps, and Human Decision Points.',
      'Then use a 9-question one-at-a-time discovery interview in a new private chat to turn your rough idea into a clean Assistant Brief.',
    ],
    sections: [
      {
        title: 'Part 2: Map the real workflow before building',
        content: [
          'Every useful assistant starts with a real workflow map:',
          '1. The Task: What is the one job this assistant helps organize?',
          '2. The Steps: What happens first, second, and third when you do this task?',
          '3. The Human Decision Points: Which choices MUST stay with you (the student) rather than the AI?',
        ],
      },
      {
        title: 'Part 3: Use 9 one-at-a-time discovery questions to generate your Assistant Brief',
        content: [
          'If you are not sure how to specify your assistant, ask AI to interview you one question at a time before writing any instructions!',
          'Copy-and-paste Discovery Prompt (in a new private chat):',
          '"I want to design a safe Personal AI Assistant for one everyday workflow: [MY TASK]. Interview me with 9 short discovery questions, ONE QUESTION AT A TIME, waiting for my answer after each one: (1) exact job, (2) typical input I will give, (3) questions the assistant should ask me first, (4) step-by-step output format, (5) decisions that stay with me, (6) tone and length, (7) what to do when details are missing, (8) safety/privacy/school boundaries it must refuse, and (9) whether any reference file is needed. After Question 9, compile my answers into a clean Assistant Brief and wait for my review."',
        ],
      },
    ],
    activity: {
      title: 'Map Your Workflow & Generate Your Assistant Brief',
      instructions: [
        'Write your 3-part workflow map (Task, Steps, Human Decision Points).',
        'Run the 9 one-at-a-time discovery questions and review the resulting Assistant Brief.',
        'Edit out anything the AI guessed that you did not approve.',
      ],
      scenarios: [
        'Workflow Map: Task, Steps 1–3, and Human Decision Points',
        '9 one-at-a-time discovery questions completed',
        'Assistant Brief reviewed and approved in my own words',
      ],
      reflection: [
        'Which of the 9 discovery questions helped you clarify something you had not thought of yet?',
      ],
    },
    miniCheck: [
      'What are the three parts of mapping a real workflow before building an assistant?',
      'If you cannot describe the task clearly at first, what should you do before writing Project Instructions?',
      'Why should the discovery interview ask one question at a time?',
    ],
    teachBack: 'Walk through your workflow map and explain how the 9 one-at-a-time discovery questions shaped your Assistant Brief.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-03.png',
    title: 'Turn the Brief into 7-Section Project Instructions & Save My_Personal_Assistant_Kit',
    bigIdea: [
      'Turn your approved Assistant Brief into a clear 7-section Project Instruction set.',
      'Project Instructions tell the assistant how to behave; reference files only hold optional background information.',
    ],
    sections: [
      {
        title: 'Part 4: The 7 sections of clear Assistant Project Instructions',
        content: [
          '1. Role & Single Job: "You are my Personal Assistant for [one specific task]."',
          '2. Opening Check: What the assistant should ask me first before generating a plan or checklist.',
          '3. Step-by-Step Workflow: How the assistant organizes the task.',
          '4. Output Format: Short checklist, 3-option menu, table, or action steps.',
          '5. Missing-Detail Rule: "If my request is missing time, goal, or constraints, ask me 1–2 clarifying questions instead of guessing."',
          '6. Human Decision & Authorship Rule: "Show options and let me choose; never complete my schoolwork or make final decisions for me."',
          '7. Safety & Privacy Boundaries: What the assistant must refuse (passwords, private personal data, school cheating, or out-of-scope tasks).',
        ],
      },
      {
        title: 'Save your Assistant build (My_Personal_Assistant_Kit)',
        content: [
          'Reuse the saving method from Module 1 and Module 9: create a folder named My_Personal_Assistant_Kit.',
          'Save: (1) assistant_brief.md, (2) assistant_project_instructions.md, and (3) optional reference file (or record "No knowledge file needed yet" — which is completely valid!).',
        ],
      },
    ],
    activity: {
      title: 'Draft Your 7-Section Project Instructions & Save My_Personal_Assistant_Kit',
      instructions: [
        'Write or review all 7 sections of your Assistant Project Instructions.',
        'Check the Instruction Review Card: Does it define one job, ask clarifying questions when details are missing, and keep decisions with you?',
        'Save your files in My_Personal_Assistant_Kit.',
      ],
      scenarios: [
        '7-Section assistant_project_instructions.md drafted and reviewed',
        'Missing-Detail Rule and Safety/Authorship Boundaries included',
        'Saved in My_Personal_Assistant_Kit folder',
      ],
      reflection: [
        'What tells an assistant how to behave — Project Instructions, or a reference knowledge file alone?',
      ],
    },
    miniCheck: [
      'What are the seven sections of Assistant Project Instructions?',
      'What tells an assistant how to behave: Project Instructions or a reference file alone?',
      'Is it valid to build a Personal Assistant with Project Instructions and "No knowledge file needed yet"?',
    ],
    teachBack: 'Present the seven sections of your Assistant Project Instructions and explain why Project Instructions control behavior.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-04.png',
    title: 'Create Your Separate "My Personal Assistant" Project & Build Record',
    bigIdea: [
      'Create your separate "My Personal Assistant" Project in your parent-approved AI account, paste your 7-section Project Instructions, and save your Personal Assistant Build Record.',
      'In Module 11 you prepare and build the Assistant; in Module 12 you will run the three live Assistant tests.',
    ],
    sections: [
      {
        title: 'Part 5: Create the separate "My Personal Assistant" Project',
        content: [
          '1. With parent/guardian approval, create a NEW, separate Project (or Gem / workspace) named "My Personal Assistant" — keep it separate from your Module 00 PlayIQ Tutor Project.',
          '2. Paste your 7-section assistant_project_instructions.md into the Project Instructions box.',
          '3. Optional Reference File: Only upload a reference file if your task genuinely needs a safe template or checklist. Choosing "No knowledge file needed yet" is a smart, valid engineering choice when instructions alone are enough.',
          '4. Manual Fallback: If your account plan does not have Projects, save your My_Personal_Assistant_Kit folder and paste assistant_project_instructions.md at the top of a dedicated pinned chat thread named "My Personal Assistant".',
        ],
      },
      {
        title: 'Part 6: Personal Assistant Build Record',
        content: [
          'Complete the 3 Quick Quiz checks and save your Module 11 Learning Record on PlayIQ:',
          '• assistantBrief: Your separate Assistant purpose, workflow, discovery decisions, and boundaries',
          '• assistantBuild: Your approved instruction/file setup and actual build check (ready for Module 12 testing)',
        ],
      },
    ],
    activity: {
      title: 'Set Up "My Personal Assistant" & Save Your Build Record',
      instructions: [
        'Paste your 7-section Project Instructions into your separate My Personal Assistant Project.',
        'Complete the digital lesson choices (m11-brief and m11-quiz-1..3).',
        'Save your assistantBrief and assistantBuild in the Module 11 Learning Record panel below.',
      ],
      scenarios: [
        'Separate "My Personal Assistant" Project created (not mixed with Module 00 Tutor)',
        '7-section Project Instructions pasted and saved',
        'Personal Assistant Build Record saved on PlayIQ ready for Module 12 testing',
      ],
      reflection: [
        'Who reviews and decides whether the assistant’s output is useful — the student or the assistant?',
      ],
    },
    miniCheck: [
      'Why must "My Personal Assistant" live in a separate Project from your Module 00 Tutor?',
      'Who reviews and decides whether the assistant’s output is useful?',
      'What will you do with this Assistant in Module 12?',
    ],
    teachBack: 'Walk through how you set up your separate "My Personal Assistant" Project and explain your Personal Assistant Build Record.',
  },
};

