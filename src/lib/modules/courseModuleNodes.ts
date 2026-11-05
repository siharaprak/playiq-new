import type { NodeContent } from '../../data/module1Content.ts';
import { module3Nodes } from '../../data/module3Content.ts';
import { module4Nodes } from '../../data/module4Content.ts';
import { module5Nodes } from '../../data/module5Content.ts';
import { module6Nodes } from '../../data/module6Content.ts';
import { module7Nodes } from '../../data/module7Content.ts';
import { module8Nodes } from '../../data/module8Content.ts';
import { module9Nodes } from '../../data/module9Content.ts';
import { module10TutorTestNodes } from '../../data/module10TutorTestContent.ts';
import { module11AssistantBuildNodes } from '../../data/module11AssistantBuildContent.ts';
import { module12AssistantTestNodes } from '../../data/module12AssistantTestContent.ts';

export const COURSE_MODULE_NODES_MAP: Record<number, Record<string, NodeContent>> = {
  3: module3Nodes,
  4: module4Nodes,
  5: module5Nodes,
  6: module6Nodes,
  7: module7Nodes,
  8: module8Nodes,
  9: module9Nodes,
  10: module10TutorTestNodes,
  11: module11AssistantBuildNodes,
  12: module12AssistantTestNodes,
};

export function getCourseModuleNodes(moduleNum: number): Record<string, NodeContent> {
  return COURSE_MODULE_NODES_MAP[moduleNum] || {};
}

export function getCourseModuleNodeCount(moduleNum: number): number {
  return Object.keys(getCourseModuleNodes(moduleNum)).length;
}
