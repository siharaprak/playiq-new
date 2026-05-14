/**
 * Sprint 3 — Mastery Engine Config Foundation
 *
 * Seed defaults for future skill_nodes seeding.
 *
 * When a future sprint seeds skill_nodes rows into the database,
 * use these helpers to generate the correct mastery_config JSONB
 * for each node based on its module number and node type.
 *
 * This file does NOT perform any DB operations itself.
 */

import type { MasteryRequirementConfig } from './types';
import { inferRequirementDefaultsForNode } from './placeholders';

/**
 * Returns the mastery_config JSONB value to use when inserting a
 * new skill_nodes row into the database.
 *
 * Usage (in a future seed script):
 *   INSERT INTO skill_nodes (module_id, title, node_type, mastery_config)
 *   VALUES (moduleId, 'Node Title', 'lesson', getSkillNodeMasteryDefaults(1, 'lesson'));
 */
export function getSkillNodeMasteryDefaults(
  moduleNumber: number,
  nodeType: string = 'lesson',
  nodeId: string = 'seed'
): MasteryRequirementConfig {
  return inferRequirementDefaultsForNode(nodeId, moduleNumber, nodeType);
}

/**
 * Returns a JSON string suitable for SQL INSERT statements.
 */
export function getSkillNodeMasteryDefaultsJson(
  moduleNumber: number,
  nodeType: string = 'lesson',
  nodeId: string = 'seed'
): string {
  return JSON.stringify(getSkillNodeMasteryDefaults(moduleNumber, nodeType, nodeId));
}
