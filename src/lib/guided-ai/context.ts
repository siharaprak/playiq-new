/**
 * Sprint 4A — Guided AI Context Loader
 *
 * Loads curriculum context from static src/data/module*Content.ts files.
 * Does NOT use skill_nodes table.
 * Does NOT fix constants.ts UUID mismatch.
 * Does NOT expose private student data.
 */

import type { GuidedAiContext } from './types';
import type { NodeContent } from '@/data/module1Content';
import { COURSE_15_MODULES } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Module content loaders (dynamic import by module number)
// ---------------------------------------------------------------------------

type ModuleNodes = Record<string, NodeContent>;

const SPECIAL_MODULE_SUMMARIES: Record<number, { title: string; summary: string; nodeContent: string }> = {
  0: {
    title: 'Module 00: The Assessment & AI Workspace Orientation',
    summary: [
      'Module 0 topics:',
      'Step 1: 10-Question Baseline Learning & AI Diagnostic',
      'Step 2: Provisional Learning Fingerprint Reveal (Explanation Style, Pace, Practice Preference, Verification Habit)',
      'Step 3: PlayIQ AI Workspace Orientation (Coach vs. Crutch Rules & 6 PlayIQ AI Modes)',
    ].join('\n'),
    nodeContent: [
      'Topic: The Assessment & AI Workspace Orientation',
      '',
      'Key concepts:',
      '- Complete the 10-question baseline diagnostic to build your provisional Learning Fingerprint.',
      '- Understand the difference between using AI as a learning coach vs. an answer-machine crutch.',
      '- Meet Orion, your AI Study Partner across Chat, Explain, Hint Ladder, Quiz Practice, Study Coach, Learn Your Way, and Lesson Rescue modes.',
    ].join('\n'),
  },
  13: {
    title: "Module 13: Create Your Character Adventure — Orion's World",
    summary: [
      'Module 13 topics:',
      "Step 1: Enter Orion's 3D World & Character Adventure Preview",
      'Step 2: Complete Interactive Mission Checkpoints with Your Guardrailed Character',
      'Step 3: Review Coaching Feedback & Submit Adventure Reflection',
    ].join('\n'),
    nodeContent: [
      "Topic: Create Your Character Adventure — Orion's World",
      '',
      'Key concepts:',
      '- Test your custom AI character guardrails inside an interactive adventure environment.',
      '- Practice Socratic problem-solving and verify how your character responds under pressure.',
      '- Reflect on how character design, boundaries, and coaching habits come together before the Master Trial.',
    ].join('\n'),
  },
  14: {
    title: 'Module 14: The Master Trial — Capstone Project',
    summary: [
      'Module 14 topics:',
      'Phase 1: Pre-Learn & Target Selection (3-Minute Skim, 3 Anchor Terms, 2 Prediction Questions)',
      'Phase 2: Lesson Rescue Diagnosis (Gap Type Identification & Rescue Mode Selection)',
      'Phase 3: Active Recall Practice Engine & Hint Ladder Discipline',
      'Phase 4: Socratic Coach Verification & Truth Filter Audit',
      'Phase 5: Final Proof Packet & Teach-Back Synthesis',
    ].join('\n'),
    nodeContent: [
      'Topic: The Master Trial — Capstone Project',
      '',
      'Key concepts:',
      '- Combine every PlayIQ system—Pre-Learn, Lesson Rescue, Practice Engine, Socratic Coach, and Proof Packet—into one independent learning run.',
      '- Demonstrate authentic voice, verification discipline, and zero-shortcut mastery on a real study topic.',
      '- Submit your complete 5-phase Capstone Proof Packet to graduate the 15-module PlayIQ curriculum.',
    ].join('\n'),
  },
};

/**
 * Dynamically loads the static content for a given module number.
 * Returns null if module content is not available.
 */
export async function getStaticModuleContent(moduleNumber: number): Promise<ModuleNodes | null> {
  try {
    switch (moduleNumber) {
      case 1: {
        const mod = await import('@/data/module1Content');
        return mod.module1Nodes;
      }
      case 2: {
        const mod = await import('@/data/module2Content');
        return mod.module2Nodes;
      }
      case 3: {
        const mod = await import('@/data/module3Content');
        return mod.module3Nodes;
      }
      case 4: {
        const mod = await import('@/data/module4Content');
        return mod.module4Nodes;
      }
      case 5: {
        const mod = await import('@/data/module5Content');
        return mod.module5Nodes;
      }
      case 6: {
        const mod = await import('@/data/module6Content');
        return mod.module6Nodes;
      }
      case 7: {
        const mod = await import('@/data/module7Content');
        return mod.module7Nodes;
      }
      case 8: {
        const mod = await import('@/data/module8Content');
        return mod.module8Nodes;
      }
      case 9: {
        const mod = await import('@/data/module9Content');
        return mod.module9Nodes;
      }
      case 10: {
        const mod = await import('@/data/module10TutorTestContent');
        return mod.module10TutorTestNodes;
      }
      case 11: {
        const mod = await import('@/data/module11AssistantBuildContent');
        return mod.module11AssistantBuildNodes;
      }
      case 12: {
        const mod = await import('@/data/module12AssistantTestContent');
        return mod.module12AssistantTestNodes;
      }
      default:
        return null;
    }
  } catch {
    console.error(`[context] Failed to load module ${moduleNumber} content`);
    return null;
  }
}

/**
 * Returns the specific node content from a module.
 * Returns null if not found.
 */
export async function getNodeContext(
  moduleNumber: number,
  nodeId: string
): Promise<NodeContent | null> {
  const nodes = await getStaticModuleContent(moduleNumber);
  if (!nodes) return null;
  return nodes[nodeId] ?? null;
}

/**
 * Returns a summary of all node titles in a module.
 */
export async function getModuleContextSummary(moduleNumber: number): Promise<string> {
  const special = SPECIAL_MODULE_SUMMARIES[moduleNumber];
  if (special) {
    return `${special.title}\n${special.summary}`;
  }

  const courseMeta = COURSE_15_MODULES.find(m => m.num === moduleNumber);
  const moduleHeader = courseMeta
    ? `Module ${moduleNumber}: ${courseMeta.title} — ${courseMeta.desc}`
    : `Module ${moduleNumber}`;

  const nodes = await getStaticModuleContent(moduleNumber);
  if (!nodes) return `${moduleHeader} (content not available)`;

  const titles = Object.values(nodes).map((n, i) => `Node ${i + 1}: ${n.title}`);
  return `${moduleHeader}\nModule ${moduleNumber} topics:\n${titles.join('\n')}`;
}

/**
 * Assembles the full context string for a guided AI request.
 * Uses module/node content from static files only.
 */
export async function buildGuidedAiContext(params: {
  moduleNumber?: number;
  nodeId?: string;
  pageType?: string;
}): Promise<GuidedAiContext> {
  const { moduleNumber, nodeId, pageType } = params;

  // Default context when no module specified (e.g., main dashboard)
  if (moduleNumber === undefined || moduleNumber === null) {
    const overviewLines = COURSE_15_MODULES.map(
      m => `- Module ${String(m.num).padStart(2, '0')}: ${m.title}`
    ).join('\n');
    return {
      moduleSummary: [
        'Student is on the PlayIQ Student Dashboard (15-Module AI Learning Curriculum: Module 00 Assessment through Module 14 Master Trial Capstone).',
        'PlayIQ teaches students how to use AI as a high-integrity thinking coach rather than an answer-machine crutch, earn node mastery, pass quizzes (80%+), defeat Boss Battles, and submit Proof Packets.',
        'Full 15-Module Course Map:',
        overviewLines,
      ].join('\n'),
      pageType: pageType ?? 'dashboard',
    };
  }

  const special = SPECIAL_MODULE_SUMMARIES[moduleNumber];
  if (special) {
    return {
      moduleNumber,
      moduleSummary: `${special.title}\n${special.summary}`,
      nodeTitle: special.title,
      nodeContent: special.nodeContent,
      pageType,
    };
  }

  const moduleSummary = await getModuleContextSummary(moduleNumber);

  // If no specific node, return module-level context
  if (!nodeId) {
    const nodes = await getStaticModuleContent(moduleNumber);
    const firstNode = nodes ? Object.values(nodes)[0] : undefined;
    return {
      moduleNumber,
      moduleSummary,
      nodeTitle: firstNode?.title,
      nodeContent: firstNode
        ? [
            `Module ${moduleNumber} Overview — First Topic: ${firstNode.title}`,
            '',
            'Key concepts:',
            ...firstNode.bigIdea.map(idea => `- ${idea}`),
          ].join('\n')
        : undefined,
      pageType,
    };
  }

  // Get specific node content
  const node = await getNodeContext(moduleNumber, nodeId);

  if (!node) {
    // Fallback: use module summary if node not found
    return {
      moduleNumber,
      moduleSummary,
      pageType,
    };
  }

  // Build node content string (title + big idea + section summaries)
  const nodeContentParts = [
    `Topic: ${node.title}`,
    '',
    'Key concepts:',
    ...node.bigIdea.map(idea => `- ${idea}`),
  ];

  // Add section titles and first content item for context (not full content)
  for (const section of node.sections) {
    if (section.title) {
      nodeContentParts.push('', `${section.title}:`);
    }
    if (section.content.length > 0) {
      // Include first 3 content items max for context
      const items = section.content.slice(0, 3);
      items.forEach(item => nodeContentParts.push(`- ${item}`));
      if (section.content.length > 3) {
        nodeContentParts.push(`- (${section.content.length - 3} more points...)`);
      }
    }
  }

  return {
    moduleNumber,
    moduleSummary,
    nodeTitle: node.title,
    nodeContent: nodeContentParts.join('\n'),
    pageType,
  };
}
