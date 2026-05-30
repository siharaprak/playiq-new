// src/lib/curriculum/canonical-course-map.ts

export interface CanonicalModule {
  order_num: number;
  slug: string;
  title: string;
  skill_tree_name: string | null;
  engine_name: string | null;
  expected_nodes: { id_slug: string; title: string }[];
  mastery_requirements: {
    proof_required: boolean;
    teach_back_required: boolean;
    tutor_build_required: boolean;
    assistant_build_required: boolean;
  };
}

export const PLAYIQ_COURSE_1_CANONICAL: CanonicalModule[] = [
  {
    order_num: 0,
    slug: 'setup-personalization',
    title: 'Setup & Personalization',
    skill_tree_name: null,
    engine_name: null,
    expected_nodes: [],
    mastery_requirements: { proof_required: false, teach_back_required: false, tutor_build_required: false, assistant_build_required: false }
  },
  {
    order_num: 1,
    slug: 'ai-learning-code',
    title: 'AI Learning Code',
    skill_tree_name: null,
    engine_name: null,
    expected_nodes: [],
    mastery_requirements: { proof_required: true, teach_back_required: true, tutor_build_required: false, assistant_build_required: false }
  },
  {
    order_num: 2,
    slug: 'digital-smarts',
    title: 'Digital Smarts & Human Responsibility',
    skill_tree_name: null,
    engine_name: null,
    expected_nodes: [],
    mastery_requirements: { proof_required: true, teach_back_required: true, tutor_build_required: false, assistant_build_required: false }
  },
  {
    order_num: 3,
    slug: 'pre-learn-system',
    title: 'Pre-Learn System',
    skill_tree_name: null,
    engine_name: null,
    expected_nodes: [],
    mastery_requirements: { proof_required: true, teach_back_required: true, tutor_build_required: false, assistant_build_required: false }
  },
  {
    order_num: 4,
    slug: 'lesson-rescue-mode',
    title: 'Lesson Rescue Mode',
    skill_tree_name: null,
    engine_name: null,
    expected_nodes: [],
    mastery_requirements: { proof_required: true, teach_back_required: true, tutor_build_required: false, assistant_build_required: false }
  },
  {
    order_num: 5,
    slug: 'compression-learning',
    title: 'Compression Learning',
    skill_tree_name: null,
    engine_name: null,
    expected_nodes: [],
    mastery_requirements: { proof_required: true, teach_back_required: true, tutor_build_required: false, assistant_build_required: false }
  },
  {
    order_num: 6,
    slug: 'self-testing-mistake-bank',
    title: 'Self-Testing & Mistake Bank',
    skill_tree_name: null,
    engine_name: null,
    expected_nodes: [],
    mastery_requirements: { proof_required: true, teach_back_required: true, tutor_build_required: false, assistant_build_required: false }
  },
  {
    order_num: 7,
    slug: 'notes-study-pack',
    title: 'Notes & Study Pack Creation',
    skill_tree_name: null,
    engine_name: null,
    expected_nodes: [],
    mastery_requirements: { proof_required: true, teach_back_required: true, tutor_build_required: false, assistant_build_required: false }
  },
  {
    order_num: 8,
    slug: 'writing-answer-clarity',
    title: 'Writing & Answer Clarity',
    skill_tree_name: null,
    engine_name: null,
    expected_nodes: [],
    mastery_requirements: { proof_required: true, teach_back_required: true, tutor_build_required: false, assistant_build_required: false }
  },
  {
    order_num: 9,
    slug: 'build-ai-tutor',
    title: 'Build Your AI Tutor',
    skill_tree_name: null,
    engine_name: null,
    expected_nodes: [],
    mastery_requirements: { proof_required: true, teach_back_required: true, tutor_build_required: true, assistant_build_required: false }
  },
  {
    order_num: 10,
    slug: 'build-ai-assistant',
    title: 'Build Your AI Assistant',
    skill_tree_name: null,
    engine_name: null,
    expected_nodes: [],
    mastery_requirements: { proof_required: true, teach_back_required: true, tutor_build_required: false, assistant_build_required: true }
  },
  {
    order_num: 99, // Assuming Capstone is 99 based on existing DB dump
    slug: 'capstone-master-trial',
    title: 'Capstone: Master Trial',
    skill_tree_name: null,
    engine_name: null,
    expected_nodes: [],
    mastery_requirements: { proof_required: true, teach_back_required: true, tutor_build_required: true, assistant_build_required: true }
  }
];

export function getCanonicalModuleByOrder(orderNum: number): CanonicalModule | undefined {
  return PLAYIQ_COURSE_1_CANONICAL.find(m => m.order_num === orderNum);
}

export function getCanonicalModuleBySlug(slug: string): CanonicalModule | undefined {
  return PLAYIQ_COURSE_1_CANONICAL.find(m => m.slug === slug);
}

export function getCanonicalNodeList(moduleOrder: number): { id_slug: string; title: string }[] {
  const mod = getCanonicalModuleByOrder(moduleOrder);
  return mod ? mod.expected_nodes : [];
}

export function validateCanonicalCourseMap(): boolean {
  const slugs = new Set<string>();
  const orders = new Set<number>();
  let valid = true;

  for (const mod of PLAYIQ_COURSE_1_CANONICAL) {
    if (slugs.has(mod.slug)) valid = false;
    if (orders.has(mod.order_num)) valid = false;
    slugs.add(mod.slug);
    orders.add(mod.order_num);
  }

  return valid;
}
