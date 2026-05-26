import * as fs from 'fs';
import * as crypto from 'crypto';
import { MODULES } from '../src/lib/constants';
import { module1Nodes } from '../src/data/module1Content';
import { module2Nodes } from '../src/data/module2Content';
import { module3Nodes } from '../src/data/module3Content';
import { module4Nodes } from '../src/data/module4Content';
import { module5Nodes } from '../src/data/module5Content';
import { module6Nodes } from '../src/data/module6Content';
import { module7Nodes } from '../src/data/module7Content';
import { module8Nodes } from '../src/data/module8Content';
import { module9Nodes } from '../src/data/module9Content';
import { module10Nodes } from '../src/data/module10Content';

// Generate a v5-like deterministic UUID based on namespace and name
function generateStableId(namespace: string, name: string): string {
  const hash = crypto.createHash('sha1');
  hash.update(namespace);
  hash.update(name);
  const digest = hash.digest('hex');
  // Format as UUID: 8-4-4-4-12
  return `${digest.substring(0, 8)}-${digest.substring(8, 12)}-${digest.substring(12, 16)}-${digest.substring(16, 20)}-${digest.substring(20, 32)}`;
}

const allModulesData = [
  { modKey: 'MODULE_1_ID', nodes: module1Nodes },
  { modKey: 'MODULE_2_ID', nodes: module2Nodes },
  { modKey: 'MODULE_3_ID', nodes: module3Nodes },
  { modKey: 'MODULE_4_ID', nodes: module4Nodes },
  { modKey: 'MODULE_5_ID', nodes: module5Nodes },
  { modKey: 'MODULE_6_ID', nodes: module6Nodes },
  { modKey: 'MODULE_7_ID', nodes: module7Nodes },
  { modKey: 'MODULE_8_ID', nodes: module8Nodes },
  { modKey: 'MODULE_9_ID', nodes: module9Nodes },
  { modKey: 'MODULE_10_ID', nodes: module10Nodes },
];

function run() {
  const namespace = 'playiq_skill_node_v1';
  let sql = `-- Data Alignment Sprint 1: Seed Skill Nodes
-- This migration inserts skill_nodes for Modules 1-10 based on static curriculum.
-- IDs are deterministically generated so re-running this migration is safe.
--
-- DO NOT modify student progress or rule-engine behavior.

`;

  const values: string[] = [];

  for (const mod of allModulesData) {
    const moduleId = (MODULES as any)[mod.modKey];
    if (!moduleId) {
      console.warn(`WARNING: Missing constant for ${mod.modKey}`);
      continue;
    }

    for (const [nodeKey, nodeData] of Object.entries(mod.nodes)) {
      const stableId = generateStableId(namespace, `${moduleId}:${nodeKey}`);
      // Escape single quotes in title
      const title = (nodeData as any).title?.replace(/'/g, "''") || nodeKey;
      
      values.push(`  ('${stableId}', '${moduleId}', '${title}', 80)`);
    }
  }

  // Capstone has no static nodes yet, but we can seed one placeholder if we want?
  // The plan said "Seed must be idempotent... Modules 1-10 and Capstone".
  // But wait, does Capstone have a static content file?
  // There is no `src/data/module11Content.ts` or capstoneContent.
  // We will just seed the nodes we have.

  if (values.length > 0) {
    sql += `INSERT INTO skill_nodes (id, module_id, title, mastery_threshold_placeholder)\nVALUES\n`;
    sql += values.join(',\n');
    sql += `\nON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;\n`;
  }

  const outPath = 'supabase/migrations/20260523061000_data_alignment_seed_skill_nodes_course1.sql';
  fs.writeFileSync(outPath, sql);
  console.log(`Generated ${outPath} with ${values.length} nodes.`);
}

run();
