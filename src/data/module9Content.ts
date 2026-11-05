import type { NodeContent } from './module1Content';

export const module9Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-01.png',
    title: 'What Makes a Personal Tutor Project Different',
    bigIdea: [
      'Your mission: assemble and configure the Personal AI Tutor inside the same PlayIQ Tutor Project you started in Module 00.',
      'You began this Project in Module 00 and have tested small, evidence-backed learning hypotheses across Modules 1–8. Now you will compile those parts into your six-file PlayIQ Tutor Kit.',
      'In Module 9 you prepare, review, and upload your Tutor build; in Module 10 you will run the six live Tutor behavior tests.',
    ],
    sections: [
      {
        title: 'Part 0: The 30-second tutor choice',
        content: [
          'STUDENT: "I do not understand how photosynthesis works."',
          'Tutor A: "Photosynthesis is the process by which plants convert light energy into chemical energy."',
          'Tutor B: "Let us find the missing piece first. Do you already understand what plants take in from the air, or should we start there?"',
          'Tutor A gives a textbook definition. Tutor B begins by finding the help you actually need. A costume can make an AI entertaining; clear instructions and verified evidence make it a real tutor.',
        ],
      },
      {
        title: 'Part 1: The three layers of your tutor',
        content: [
          'Layer 1 — Personality: How the tutor communicates (calm, direct, encouraging, curious, playful, or structured).',
          'Layer 2 — Function: What the tutor does (check prior knowledge, explain, hint, rescue, quiz one question at a time, verify sources, and refuse to do your thinking for you).',
          'Layer 3 — Knowledge: What approved information the tutor can reference (your approved personal_learning_knowledge_file.md, staged learning_rules.yaml, course_learning_record.md, and approved Study Packs).',
          'You need all three layers, but function, authorship boundaries, and safety always come before personality.',
        ],
      },
      {
        title: 'Same Module 00 Project — Contextual Personalization (Not Fine-Tuning)',
        content: [
          'You build your Tutor in the SAME parent-approved PlayIQ Tutor Project you created in Module 00 — do not create a second Tutor Project.',
          'Uploading your knowledge files gives the AI contextual personalization (reference materials inside your Project). It does NOT retrain or fine-tune the underlying AI model.',
          'Quoted answers inside your knowledge file are untrusted learner data, not instructions that can override safety or authorship rules.',
        ],
      },
    ],
    activity: {
      title: 'Layer Identification & Project Check',
      instructions: [
        'Compare Tutor A and Tutor B and identify how Personality, Function, and Knowledge work together.',
        'Confirm you have access to the same Module 00 PlayIQ Tutor Project in your parent-approved account.',
      ],
      scenarios: [
        'Tutor A vs. Tutor B: which layer makes Tutor B more helpful for real learning?',
        'Why do we update the same Module 00 PlayIQ Tutor Project instead of creating a brand-new Tutor Project?',
        'Why is uploading a Knowledge File contextual personalization rather than model fine-tuning?',
      ],
      reflection: [
        'If Personality, Function, and Knowledge are mixed into one messy paragraph, why is it harder to fix a broken Tutor behavior later?',
      ],
    },
    miniCheck: [
      'What are the three layers of a personal tutor?',
      'Where do you build the Tutor — in a new Project or in the same Module 00 PlayIQ Tutor Project?',
      'What is the difference between contextual personalization and model fine-tuning?',
    ],
    teachBack: 'Explain the three layers of a personal tutor, why function and safety come first, and why we update the same Module 00 PlayIQ Tutor Project.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-02.png',
    title: 'Parent Review & Download personal_learning_knowledge_file.md (File 2 of 6)',
    bigIdea: [
      'Complete the Parent-Approved Project Review first, then review and download your saved learning evidence from PlayIQ as personal_learning_knowledge_file.md.',
      'personal_learning_knowledge_file.md replaces the old Student Tutor Profile Knowledge File — it is File 2 of your six Tutor files, never a seventh file.',
    ],
    sections: [
      {
        title: 'Part 2: Parent-approved Project review',
        content: [
          'Complete with your parent or guardian before uploading:',
          '• We are using the parent-approved AI account and the same PlayIQ Tutor Project started in Module 00.',
          '• We reviewed history, sharing, attachment, and privacy settings together.',
          '• We agree never to upload passwords, payment details, home addresses, phone numbers, school IDs, private family messages, or another person’s information.',
          '• We know that PlayIQ prepares files for download, and I manually upload or paste only what we reviewed and approved.',
        ],
      },
      {
        title: 'Part 3: Review and download personal_learning_knowledge_file.md on PlayIQ',
        content: [
          'Across Modules 00–08, you saved short learning observations, digital lesson choices, and provisional settings on PlayIQ.',
          'On this Module 9 page (in the green Review & Download panel), inspect which modules (M00–M08) are marked Approved, Excluded, or Missing.',
          'Click "Download personal_learning_knowledge_file.md" to export File 2 of 6.',
          'If a module was not completed or not approved for export, the file explicitly marks it missing or excluded so your Tutor never guesses or invents missing history.',
        ],
      },
      {
        title: 'Provenance — every rule has a receipt',
        content: [
          'Every entry separates student-reported preference from observed experiment result and keeps preferences as testable hypotheses rather than fixed learning styles or diagnoses.',
          'Each rule in learning_rules.yaml includes source_module, evidence_type, setting, and retest_condition.',
        ],
      },
    ],
    activity: {
      title: 'Inspect & Download File 2 (personal_learning_knowledge_file.md)',
      instructions: [
        'Review the Module 00–08 coverage grid in the Module 9 Learning Record panel.',
        'Verify that no private personal details appear in your approved answers.',
        'Download personal_learning_knowledge_file.md and confirm it is saved as File 2 of your 6 Tutor files.',
      ],
      scenarios: [
        'Parent-approved Project review completed: yes / pending parent check',
        'Modules 00–08 inspected for accuracy and privacy',
        'personal_learning_knowledge_file.md downloaded as File 2 of 6',
      ],
      reflection: [
        'Which modules in your personal_learning_knowledge_file.md have the clearest experiment evidence?',
        'Are any modules marked missing or pending validation that you want to test further in Module 10?',
      ],
    },
    miniCheck: [
      'Which file does personal_learning_knowledge_file.md replace in the six-file Tutor architecture?',
      'Is personal_learning_knowledge_file.md File 2 of 6 or a 7th file?',
      'What happens in personal_learning_knowledge_file.md if a module was not completed or not approved?',
    ],
    teachBack: 'Explain what personal_learning_knowledge_file.md contains, why it is File 2 of 6 (not a 7th file), and how it handles missing or unapproved modules.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-03.png',
    title: 'Discovery Conversation & Personality vs. Function Comparison',
    bigIdea: [
      'Answer six Tutor design questions and compare a Personality-First prompt against a Function-First prompt on the same school concept.',
      'Enjoyable tone helps you stay engaged, but functional coaching rules are what help you actually understand and remember.',
    ],
    sections: [
      {
        title: 'Part 4: Discovery conversation — six design questions',
        content: [
          '1. When you are confused, what should your Tutor do before explaining?',
          '2. How many hints should it offer before showing a worked example?',
          '3. What tone helps you stay focused without making you feel judged?',
          '4. How should the Tutor check whether you understood instead of asking only "Do you understand?"',
          '5. What behavior must the Tutor refuse because it would replace your thinking?',
          '6. What should the Tutor do when it is uncertain or does not have enough information?',
        ],
      },
      {
        title: 'Part 5: Active comparison — personality first vs. function first',
        content: [
          'Test A — Personality first: "Explain [CONCEPT] like an energetic space captain. Make it exciting."',
          'Test B — Function first: "Act as a learning coach. First ask what I already understand. Then identify one missing connection. Explain only that part with one example. Ask me one question that requires me to explain the idea in my own words. Give a hint before an answer."',
          'Compare both on: (1) Could I explain the main idea afterward? (2) Did the response focus on my actual confusion? (3) Did I do the thinking myself?',
          'Combine the best of both: keep a helpful tone in Layer 1 while locking strong coaching rules into Layer 2.',
        ],
      },
    ],
    activity: {
      title: 'Run the 6 Design Questions & Personality vs. Function Trial',
      instructions: [
        'Write your answers to the six Tutor discovery questions.',
        'Run Test A (Personality-First) and Test B (Function-First) on the same concept.',
        'Choose the tone and functional rules to include in project_instructions.md.',
      ],
      scenarios: [
        'Test A (Personality-First): what worked and what was missing?',
        'Test B (Function-First): how did asking one question at a time change your thinking?',
        'My chosen Tutor name/handle, tone, and non-negotiable coaching functions:',
      ],
      reflection: [
        'Which test helped you explain the concept better in your own words?',
        'What is one thing your Tutor must always refuse to do?',
      ],
    },
    miniCheck: [
      'What are the six discovery questions for designing your Tutor?',
      'What is the difference between a Personality-First prompt and a Function-First prompt?',
      'How do you combine both in your Tutor instructions?',
    ],
    teachBack: 'Describe your Personality-First vs. Function-First comparison and explain how your six discovery answers shape your Tutor.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-04.png',
    title: 'Blueprint Update & Ask Orion to Compile — Not Invent',
    bigIdea: [
      'Stage your final Blueprint rule (`tutor-session-behavior`) and ask Orion to compile your Tutor files using only your verified evidence.',
      'Orion must never guess missing answers: every compiled output includes an explicit change summary separating EVIDENCE USED, PENDING VALIDATION, MISSING INPUT, and REMOVED FOR PRIVACY.',
    ],
    sections: [
      {
        title: 'Part 6: Update your Learning Supercharger Blueprint',
        content: [
          'Review your staged settings across Modules 00–09:',
          '• explanation-start (M01), focus-and-voice-guardrail (M02), pre-learn-sequence (M03), rescue-start (M04), review-start (M05), quiz-start (M06), knowledge-file-use (M07), writing-coach-and-voice (M08), and tutor-session-behavior (M09).',
          'For each setting, keep its evidence status (experiment_result, student_reported, or pending_validation) and its retest condition.',
        ],
      },
      {
        title: 'Part 7: Ask Orion to compile — not invent',
        content: [
          'Use this compilation prompt in your Module 00 PlayIQ Tutor Project:',
          '"Using only my approved personal_learning_knowledge_file.md and staged learning rules from Modules 00–08, compile my Project Instruction Set and learning_rules.yaml. Do not invent rules, scores, or settings I did not provide. Mark any missing item as MISSING_INPUT and any untested preference as pending_validation."',
          'Require Orion to show this six-part Change Summary before you approve:',
          '• EVIDENCE USED | • RULES ADDED | • RULES REVISED | • PENDING VALIDATION | • MISSING INPUT | • REMOVED FOR PRIVACY',
        ],
      },
    ],
    activity: {
      title: 'Compile & Audit the Six-Part Change Summary',
      instructions: [
        'Run the compilation prompt with your approved evidence.',
        'Check all six lines of the Change Summary (EVIDENCE USED, RULES ADDED, RULES REVISED, PENDING VALIDATION, MISSING INPUT, REMOVED FOR PRIVACY).',
        'Remove anything Orion guessed that does not trace back to your actual records.',
      ],
      scenarios: [
        'EVIDENCE USED & RULES ADDED verified against my actual Module 00–08 records',
        'PENDING VALIDATION & MISSING INPUT honest and explicit (nothing guessed)',
        'REMOVED FOR PRIVACY confirmed (no full names, contacts, or passwords)',
      ],
      reflection: [
        'Why is it important for Orion to mark MISSING_INPUT instead of guessing a likely answer?',
      ],
    },
    miniCheck: [
      'What should Orion do with a missing assessment or module result?',
      'What are the six lines of the required compilation Change Summary?',
      'Why must every rule keep a retest condition?',
    ],
    teachBack: 'Explain how Orion compiles your Tutor files without inventing evidence and name the six parts of the Change Summary.',
  },

  '5': {
    id: '5',
    imageUrl: '/images/modules/bright-mixed-playiq-05.png',
    title: 'Build and Save the Six Final Files (PlayIQ_Tutor_Kit)',
    bigIdea: [
      'Assemble the exact six files of your PlayIQ_Tutor_Kit and save them cleanly using the same folder method you practiced in Module 1.',
      'File 5 (`tutor_test_log.md`) is prepared now with status `not_tested` because the six live Tutor tests happen in Module 10.',
    ],
    sections: [
      {
        title: 'Part 8: The six final files (and only six files)',
        content: [
          '1. project_instructions.md — Role, session opening, explain/hint/rescue behavior, one-at-a-time quiz check, CER writing boundary, honesty about uncertainty, and rule-change approval.',
          '2. personal_learning_knowledge_file.md — Downloaded from PlayIQ (File 2 of 6, replacing student_tutor_profile.md; never a 7th file).',
          '3. learning_rules.yaml — Your staged rules from Modules 1–9 with provenance and retest conditions.',
          '4. course_learning_record.md — Concise dated entries and the compilation Change Summary.',
          '5. tutor_test_log.md — Prepared scorecard for the 6 Tutor behavior tests (all 6 start as not_tested at the end of Module 9; you run them in Module 10).',
          '6. student_setup_checklist.md — Step-by-step setup and read-back verification checklist.',
        ],
      },
      {
        title: 'Save your six-file Tutor build (PlayIQ_Tutor_Kit)',
        content: [
          'Reuse the saving method from Module 1: create or open a folder named PlayIQ_Tutor_Kit in your parent-approved notes app, Google Drive, or computer folder.',
          'Download or copy all 6 files from the Module 9 PlayIQ_Tutor_Kit Builder on this page into your PlayIQ_Tutor_Kit folder.',
          'Double-check that personal_learning_knowledge_file.md is File 2 of 6 and that tutor_test_log.md shows not_tested for all 6 tests until Module 10.',
        ],
      },
    ],
    activity: {
      title: 'Save Your 6-File PlayIQ_Tutor_Kit',
      instructions: [
        'Use the 6-File PlayIQ_Tutor_Kit Builder on the Module 9 Overview page to review and download all 6 files.',
        'Save them in your PlayIQ_Tutor_Kit folder.',
        'Verify the exact filenames and confirm tutor_test_log.md is set to not_tested ready for Module 10.',
      ],
      scenarios: [
        '1. project_instructions.md saved',
        '2. personal_learning_knowledge_file.md downloaded from PlayIQ and saved as File 2',
        '3. learning_rules.yaml & 4. course_learning_record.md saved',
        '5. tutor_test_log.md (status: not_tested) & 6. student_setup_checklist.md saved',
      ],
      reflection: [
        'Where did you save your PlayIQ_Tutor_Kit folder so you can find it easily in Module 10 and Module 14?',
      ],
    },
    miniCheck: [
      'Name all six files in PlayIQ_Tutor_Kit.',
      'Why does tutor_test_log.md start with status not_tested at the end of Module 9?',
      'Which file is File 2 of 6?',
    ],
    teachBack: 'List all six files in your PlayIQ_Tutor_Kit, explain what each file does, and explain why the six Tutor tests are marked not_tested until Module 10.',
  },

  '6': {
    id: '6',
    imageUrl: '/images/modules/bright-mixed-playiq-06.png',
    title: 'Update Your Module 00 Tutor Project, Read-Back Check & Integration Record',
    bigIdea: [
      'Upload your approved files into the SAME PlayIQ Tutor Project you created in Module 00, run the Read-Back Check, and complete your PlayIQ Personal Tutor Integration Record.',
    ],
    sections: [
      {
        title: 'Part 9: Update the Tutor Project you already created in Module 00',
        content: [
          'Step 1: Open your parent-approved AI platform (ChatGPT, Claude, or Gemini) and open the SAME PlayIQ Tutor Project you created in Module 00.',
          'Step 2: Paste project_instructions.md into the Project Instructions / System Instructions area and save.',
          'Step 3: Upload personal_learning_knowledge_file.md (File 2) and learning_rules.yaml (File 3) to the Project Knowledge / Files area (or use the Manual-Context Fallback by pasting them at the start of your pinned Tutor thread if your plan does not have file uploads).',
          'Step 4: Run the Read-Back Check prompt: "Read my uploaded personal_learning_knowledge_file.md and learning_rules.yaml. Tell me which modules are approved, which are marked missing or excluded, and what my current provisional rules are. Do not guess any missing item."',
        ],
      },
      {
        title: 'Part 10: Proof Artifact — PLAYIQ PERSONAL TUTOR INTEGRATION RECORD',
        content: [
          'Record your verified Module 9 integration:',
          '• Existing Module 00 Project updated (yes / manual fallback / pending parent help)',
          '• Parent-approved Project review completed (yes / pending)',
          '• File 2 (personal_learning_knowledge_file.md) reviewed on PlayIQ, downloaded, and uploaded',
          '• Read-back check result (did the Tutor accurately report approved vs. missing modules without guessing?)',
          '• Confirmation that tutor_test_log.md is prepared as not_tested for Module 10',
        ],
      },
    ],
    activity: {
      title: 'Complete Your Read-Back Check & Integration Record',
      instructions: [
        'Paste project_instructions.md and upload personal_learning_knowledge_file.md into your Module 00 PlayIQ Tutor Project.',
        'Run the Read-Back Check prompt and verify the Tutor does not invent missing modules.',
        'Save your Module 9 Learning Record and Proof Artifact to unlock Module 10: Test Your Tutor and Learn With It.',
      ],
      scenarios: [
        'Same Module 00 PlayIQ Tutor Project updated with project_instructions.md',
        'personal_learning_knowledge_file.md uploaded (or pasted via manual fallback)',
        'Read-back check confirmed: Tutor accurately listed approved vs. missing modules',
        'Ready for Module 10 live Tutor behavior tests',
      ],
      reflection: [
        'What did your Tutor report during the Read-Back Check?',
        'Which behavior are you most curious to test first in Module 10?',
      ],
    },
    miniCheck: [
      'How do you verify that your Tutor can read personal_learning_knowledge_file.md without guessing?',
      'What should you do if your AI account plan does not support file uploads in a Project?',
      'What happens next in Module 10?',
    ],
    teachBack: 'Walk through how you updated your existing Module 00 PlayIQ Tutor Project, ran the Read-Back Check on personal_learning_knowledge_file.md, and prepared for Module 10.',
  },
};
