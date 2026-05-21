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

// ---------------------------------------------------------------------------
// Module content loaders (dynamic import by module number)
// ---------------------------------------------------------------------------

type ModuleNodes = Record<string, NodeContent>;

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
        const mod = await import('@/data/module10Content');
        return mod.module10Nodes;
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
  const nodes = await getStaticModuleContent(moduleNumber);
  if (!nodes) return `Module ${moduleNumber} (content not available)`;

  const titles = Object.values(nodes).map((n, i) => `Node ${i + 1}: ${n.title}`);
  return `Module ${moduleNumber} topics:\n${titles.join('\n')}`;
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

  // Default context when no module specified
  if (!moduleNumber) {
    return {
      moduleSummary: 'No specific module context. The student is browsing the platform.',
      pageType,
    };
  }

  const moduleSummary = await getModuleContextSummary(moduleNumber);

  // If no specific node, return module-level context
  if (!nodeId) {
    return {
      moduleNumber,
      moduleSummary,
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
