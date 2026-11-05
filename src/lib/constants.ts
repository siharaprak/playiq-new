export const MODULES = {
  MODULE_0_ID: 'a97994fc-7afe-4798-a169-75a3266e649f',
  MODULE_1_ID: 'a0b94091-62d9-4ac9-8f0a-86c2e3650228',
  MODULE_2_ID: '1d711232-e906-468c-9f32-ef8d0c7aa0b9',
  MODULE_3_ID: 'fe87ea18-8042-43e6-9cc3-da9117590809',
  MODULE_4_ID: 'aeaf7949-9bc3-44a1-b481-2d1c02106708',
  MODULE_5_ID: 'ab18311b-17d7-49af-918a-4a6d7723ced6',
  MODULE_6_ID: '03fd0323-1ddd-4f9e-8bb0-8b92d662921c',
  MODULE_7_ID: 'cdc1916e-cc2f-42b1-b90a-2d07182408cb',
  MODULE_8_ID: 'b097c132-f521-441c-83b7-2824b7a37622',
  MODULE_9_ID: '7ce93ee8-20ef-4531-a516-8fae1b705a09',
  MODULE_10_ID: '93217a54-63f1-4ce4-b955-16eb86e2f84c',
  CAPSTONE_ID: 'c1f94091-62d9-4ac9-8f0a-86c2e3650238',
};

/**
 * Distinct tracking IDs for the expanded 15-module sequence (Modules 10-14)
 * so legacy 12-module Module 10 (Assistant) and Module 11 (Capstone) DB records
 * are never attached to the wrong modules in the 15-module sequence.
 */
export const COURSE_15_EXTENDED_IDS = {
  NEW_MODULE_10_TUTOR_TESTING_ID: '10101010-63f1-4ce4-b955-16eb86e2f010',
  NEW_MODULE_11_PREPARE_ASSISTANT_ID: '11111111-63f1-4ce4-b955-16eb86e2f011',
  NEW_MODULE_12_TEST_ASSISTANT_ID: '12121212-63f1-4ce4-b955-16eb86e2f012',
  NEW_MODULE_13_LOOK_AHEAD_ID: '13131313-63f1-4ce4-b955-16eb86e2f013',
  NEW_MODULE_14_CAPSTONE_ID: '14141414-63f1-4ce4-b955-16eb86e2f014',
} as const;

/**
 * Maps a 15-module course number (0..14) to a valid foreign-key UUID in `public.modules(id)`.
 * Modules 10-14 use namespaced `node_id` values (`m10-1`, `m11-1`, `m12-1`, `m13-1`, `m14-1`)
 * and `courseModuleNumber` metadata so they satisfy the DB foreign key while remaining
 * 100% isolated from legacy 12-module Module 10/11 rows and from each other.
 */
export function getDbModuleIdForCourseModule(moduleNumber: number): string {
  switch (moduleNumber) {
    case 0:
      return MODULES.MODULE_0_ID;
    case 1:
      return MODULES.MODULE_1_ID;
    case 2:
      return MODULES.MODULE_2_ID;
    case 3:
      return MODULES.MODULE_3_ID;
    case 4:
      return MODULES.MODULE_4_ID;
    case 5:
      return MODULES.MODULE_5_ID;
    case 6:
      return MODULES.MODULE_6_ID;
    case 7:
      return MODULES.MODULE_7_ID;
    case 8:
      return MODULES.MODULE_8_ID;
    case 9:
      return MODULES.MODULE_9_ID;
    case 10:
    case 11:
    case 12:
      return MODULES.MODULE_10_ID;
    case 13:
    case 14:
      return MODULES.CAPSTONE_ID;
    default:
      return MODULES.MODULE_1_ID;
  }
}

/**
 * Returns the isolated `student_node_progress.node_id` key for a given course module (1..14) and route nodeId.
 * Modules 1-9 use `'1'..'N'`. Modules 10-14 use `'m10-1'..'m14-1'` so legacy Module 10 (`'1'..'7'`)
 * and legacy Module 11 (`'e1f94091-...'`) progress rows are never attached to the new modules.
 */
export function getCourseModuleNodeKey(moduleNumber: number, nodeId: string): string {
  const normalized = String(nodeId).trim();
  if (moduleNumber >= 10) {
    const prefix = `m${moduleNumber}-`;
    return normalized.startsWith(prefix) ? normalized : `${prefix}${normalized}`;
  }
  return normalized;
}

export function isNodeKeyForCourseModule(moduleNumber: number, dbModuleId: string, dbNodeId: string): boolean {
  const expectedModuleId = getDbModuleIdForCourseModule(moduleNumber);
  if (dbModuleId !== expectedModuleId) return false;
  if (moduleNumber >= 10) {
    return String(dbNodeId).startsWith(`m${moduleNumber}-`);
  }
  return /^[1-9][0-9]*$/.test(String(dbNodeId));
}

export function resolveCourseModuleFromAnyId(moduleIdOrExtendedId: string, fallbackModuleNum?: number): {
  dbModuleId: string;
  courseModuleNumber: number;
} {
  if (fallbackModuleNum !== undefined && fallbackModuleNum >= 0 && fallbackModuleNum <= 14) {
    return {
      dbModuleId: getDbModuleIdForCourseModule(fallbackModuleNum),
      courseModuleNumber: fallbackModuleNum,
    };
  }
  switch (moduleIdOrExtendedId) {
    case MODULES.MODULE_0_ID:
      return { dbModuleId: MODULES.MODULE_0_ID, courseModuleNumber: 0 };
    case MODULES.MODULE_1_ID:
      return { dbModuleId: MODULES.MODULE_1_ID, courseModuleNumber: 1 };
    case MODULES.MODULE_2_ID:
      return { dbModuleId: MODULES.MODULE_2_ID, courseModuleNumber: 2 };
    case MODULES.MODULE_3_ID:
      return { dbModuleId: MODULES.MODULE_3_ID, courseModuleNumber: 3 };
    case MODULES.MODULE_4_ID:
      return { dbModuleId: MODULES.MODULE_4_ID, courseModuleNumber: 4 };
    case MODULES.MODULE_5_ID:
      return { dbModuleId: MODULES.MODULE_5_ID, courseModuleNumber: 5 };
    case MODULES.MODULE_6_ID:
      return { dbModuleId: MODULES.MODULE_6_ID, courseModuleNumber: 6 };
    case MODULES.MODULE_7_ID:
      return { dbModuleId: MODULES.MODULE_7_ID, courseModuleNumber: 7 };
    case MODULES.MODULE_8_ID:
      return { dbModuleId: MODULES.MODULE_8_ID, courseModuleNumber: 8 };
    case MODULES.MODULE_9_ID:
      return { dbModuleId: MODULES.MODULE_9_ID, courseModuleNumber: 9 };
    case COURSE_15_EXTENDED_IDS.NEW_MODULE_10_TUTOR_TESTING_ID:
    case MODULES.MODULE_10_ID:
      return { dbModuleId: MODULES.MODULE_10_ID, courseModuleNumber: 10 };
    case COURSE_15_EXTENDED_IDS.NEW_MODULE_11_PREPARE_ASSISTANT_ID:
      return { dbModuleId: MODULES.MODULE_10_ID, courseModuleNumber: 11 };
    case COURSE_15_EXTENDED_IDS.NEW_MODULE_12_TEST_ASSISTANT_ID:
      return { dbModuleId: MODULES.MODULE_10_ID, courseModuleNumber: 12 };
    case COURSE_15_EXTENDED_IDS.NEW_MODULE_13_LOOK_AHEAD_ID:
      return { dbModuleId: MODULES.CAPSTONE_ID, courseModuleNumber: 13 };
    case COURSE_15_EXTENDED_IDS.NEW_MODULE_14_CAPSTONE_ID:
    case MODULES.CAPSTONE_ID:
      return { dbModuleId: MODULES.CAPSTONE_ID, courseModuleNumber: 14 };
    default:
      return { dbModuleId: moduleIdOrExtendedId, courseModuleNumber: 1 };
  }
}

export interface Course15ModuleMeta {
  id: string;
  dbModuleId: string;
  num: number;
  code: string;
  title: string;
  desc: string;
  totalNodes: number;
  href: string;
  artifactSummary: string;
  requiresArtifact: boolean;
}

export const COURSE_15_MODULES: Course15ModuleMeta[] = [
  {
    id: MODULES.MODULE_0_ID,
    dbModuleId: MODULES.MODULE_0_ID,
    num: 0,
    code: '00',
    title: 'The Assessment & AI Workspace Orientation',
    desc: 'Set up your Parent & Student Co-Pilot safety rules, discover your provisional Learning Blueprint hypotheses with Orion, and initialize your external PlayIQ Tutor Project.',
    totalNodes: 1,
    href: '/student/assessment',
    artifactSummary: 'My Tutor Project Readiness Card + Starting Snapshot',
    requiresArtifact: true,
  },
  {
    id: MODULES.MODULE_1_ID,
    dbModuleId: MODULES.MODULE_1_ID,
    num: 1,
    code: '01',
    title: 'Create Your Character & Learn the AI Learning Code',
    desc: 'Complete your First-Win Character Lab tutorial, build a reusable Character Guardrail Card, master the 6 PlayIQ AI Modes, climb the 6-Rung Question Ladder, and test your explanation-opening hypothesis.',
    totalNodes: 4,
    href: '/student/modules/1/overview',
    artifactSummary: 'Character Guardrail Card + My AI Study Rules + AI Error Review Sheet',
    requiresArtifact: true,
  },
  {
    id: MODULES.MODULE_2_ID,
    dbModuleId: MODULES.MODULE_2_ID,
    num: 2,
    code: '02',
    title: 'Digital Smarts & Human Responsibility',
    desc: 'Distinguish Coach Use from Crutch Use, run the 10-question one-at-a-time Tutor Discovery interview, preserve your authentic voice, apply the Truth Filter, and calibrate your Focus Sprint.',
    totalNodes: 6,
    href: '/student/modules/2/overview',
    artifactSummary: 'PlayIQ Digital Power Card + Calibrated Focus Sprint + Personal Integrity Pledge',
    requiresArtifact: true,
  },
  {
    id: MODULES.MODULE_3_ID,
    dbModuleId: MODULES.MODULE_3_ID,
    num: 3,
    code: '03',
    title: 'The Pre-Learn System',
    desc: 'Walk into class with a 5-Part Pre-Learn Map (Headline, 5 Landmarks, 5 Power Words, Anchor Example, Golden Question), run the 3-Way Entry Trial, and write a 10-Line Pre-Learn Brief.',
    totalNodes: 4,
    href: '/student/modules/3/overview',
    artifactSummary: 'Pre-Learn Mission Card + 10-Line Pre-Learn Brief',
    requiresArtifact: true,
  },
  {
    id: MODULES.MODULE_4_ID,
    dbModuleId: MODULES.MODULE_4_ID,
    num: 4,
    code: '04',
    title: 'Lesson Rescue Mode',
    desc: 'Use the 4 moves of Lesson Rescue Mode (Stop, Name, Choose, Prove), diagnose the 6 Gap Types with line-by-line G/M/S scanning, and compare Analogy, Step-by-Step, and Diagnostic-Question rescues.',
    totalNodes: 5,
    href: '/student/modules/4/overview',
    artifactSummary: 'Lesson Rescue Report + First Rescue Move Rule',
    requiresArtifact: true,
  },
  {
    id: MODULES.MODULE_5_ID,
    dbModuleId: MODULES.MODULE_5_ID,
    num: 5,
    code: '05',
    title: 'Compression Learning',
    desc: 'Turn a full lesson into a 4-level Compression Ladder and One-Page Understanding Card without deleting accuracy, then compare Audio, Visual-Card, and Teach-Back review formats.',
    totalNodes: 4,
    href: '/student/modules/5/overview',
    artifactSummary: 'Retention Test Card + One-Page Understanding Card',
    requiresArtifact: true,
  },
  {
    id: MODULES.MODULE_6_ID,
    dbModuleId: MODULES.MODULE_6_ID,
    num: 6,
    code: '06',
    title: 'Self-Testing & Mistake Bank',
    desc: 'Replace passive rereading with retrieval self-testing, classify mistakes across the 6 Mistake Bank categories, compare one-at-a-time vs. full-set quizzes, and set up a real reminder plan.',
    totalNodes: 4,
    href: '/student/modules/6/overview',
    artifactSummary: 'Quiz and Mistake Repair Card + Realistic Spaced-Review Plan',
    requiresArtifact: true,
  },
  {
    id: MODULES.MODULE_7_ID,
    dbModuleId: MODULES.MODULE_7_ID,
    num: 7,
    code: '07',
    title: 'Build Knowledge Files Your Tutor Can Trust',
    desc: 'Separate source facts from summaries and guesses, build an 8-part source-aware Study Pack, and compare messy note dumps against clean Knowledge Files.',
    totalNodes: 4,
    href: '/student/modules/7/overview',
    artifactSummary: 'File Quality Test Card + 8-Part Tutor-Ready Study Pack',
    requiresArtifact: true,
  },
  {
    id: MODULES.MODULE_8_ID,
    dbModuleId: MODULES.MODULE_8_ID,
    num: 8,
    code: '08',
    title: 'Protect Your Voice & Make Your Answers Clear',
    desc: 'Plan clear Claim-Evidence-Reasoning (CER) answers with a 5-Line Answer Map, build a safe Writing Voice Evidence File, and use writing-coach prompts that keep every wording decision yours.',
    totalNodes: 4,
    href: '/student/modules/8/overview',
    artifactSummary: 'Writing Ownership Test Card + 5-Line CER Answer Map',
    requiresArtifact: true,
  },
  {
    id: MODULES.MODULE_9_ID,
    dbModuleId: MODULES.MODULE_9_ID,
    num: 9,
    code: '09',
    title: 'Build Your Personal AI Tutor',
    desc: 'Review and download your approved personal_learning_knowledge_file.md (File 2 of 6), compile your 6-file PlayIQ Tutor Kit, and upload it into the same Module 00 PlayIQ Tutor Project.',
    totalNodes: 6,
    href: '/student/modules/9/overview',
    artifactSummary: 'PlayIQ Personal Tutor Integration Record + 6-File PlayIQ Tutor Kit',
    requiresArtifact: true,
  },
  {
    id: COURSE_15_EXTENDED_IDS.NEW_MODULE_10_TUTOR_TESTING_ID,
    dbModuleId: MODULES.MODULE_10_ID,
    num: 10,
    code: '10',
    title: 'Test Your Tutor and Learn With It',
    desc: 'Run the 6 quick behavior tests on the Tutor in your Module 00 Project, revise one instruction and retest it, and use the 7-step New Idea to Learning loop on a real topic.',
    totalNodes: 4,
    href: '/student/modules/10/overview',
    artifactSummary: 'PlayIQ Tutor Test & Learning Record + 6-Test Scorecard + Retest',
    requiresArtifact: true,
  },
  {
    id: COURSE_15_EXTENDED_IDS.NEW_MODULE_11_PREPARE_ASSISTANT_ID,
    dbModuleId: MODULES.MODULE_10_ID,
    num: 11,
    code: '11',
    title: 'Build Your Personal AI Assistant',
    desc: 'Map one safe everyday workflow, run the 9 one-at-a-time discovery questions to draft an Assistant Brief, and build your separate My Personal Assistant Project.',
    totalNodes: 4,
    href: '/student/modules/11/overview',
    artifactSummary: 'Personal Assistant Build Record + My_Personal_Assistant_Kit',
    requiresArtifact: true,
  },
  {
    id: COURSE_15_EXTENDED_IDS.NEW_MODULE_12_TEST_ASSISTANT_ID,
    dbModuleId: MODULES.MODULE_10_ID,
    num: 12,
    code: '12',
    title: 'Test Your Assistant and See What It Could Do',
    desc: 'Run the 3 Assistant tests (normal request, missing detail, boundary), revise one instruction and retest, verify real reminder tools vs. chat text, and try journal-with-a-helper capture.',
    totalNodes: 4,
    href: '/student/modules/12/overview',
    artifactSummary: 'Personal Assistant Test & Capability Record + 3-Scenario Test Log',
    requiresArtifact: true,
  },
  {
    id: COURSE_15_EXTENDED_IDS.NEW_MODULE_13_LOOK_AHEAD_ID,
    dbModuleId: MODULES.CAPSTONE_ID,
    num: 13,
    code: '13',
    title: "Your Orion Character's Next Adventure",
    desc: 'See how your Module 1 Character Guardrail Card can grow into a future story, storyboard, or short cartoon in a separate project. Short possibility preview—no required answer, quiz, or artifact.',
    totalNodes: 1,
    href: '/student/modules/13/overview',
    artifactSummary: 'Optional Possibility Preview (No Artifact, Quiz, or Upload Required)',
    requiresArtifact: false,
  },
  {
    id: COURSE_15_EXTENDED_IDS.NEW_MODULE_14_CAPSTONE_ID,
    dbModuleId: MODULES.CAPSTONE_ID,
    num: 14,
    code: '14',
    title: 'Capstone — The Master Trial',
    desc: 'Complete the 6-stage Exam & Performance System on a real topic, compare honest evidence, build your Learning Dashboard, choose one Track A–E demonstration, and record your PlayIQ Mastery Record.',
    totalNodes: 1,
    href: '/student/modules/14/overview',
    artifactSummary: 'PlayIQ Mastery Record + Learning Dashboard + Track A–E Demonstration',
    requiresArtifact: true,
  },
];
