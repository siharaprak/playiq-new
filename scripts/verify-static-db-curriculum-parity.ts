import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
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

dotenv.config({ path: '.env' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

const staticNodesList = [
  { mod: 'MODULE_1_ID', nodes: module1Nodes },
  { mod: 'MODULE_2_ID', nodes: module2Nodes },
  { mod: 'MODULE_3_ID', nodes: module3Nodes },
  { mod: 'MODULE_4_ID', nodes: module4Nodes },
  { mod: 'MODULE_5_ID', nodes: module5Nodes },
  { mod: 'MODULE_6_ID', nodes: module6Nodes },
  { mod: 'MODULE_7_ID', nodes: module7Nodes },
  { mod: 'MODULE_8_ID', nodes: module8Nodes },
  { mod: 'MODULE_9_ID', nodes: module9Nodes },
  { mod: 'MODULE_10_ID', nodes: module10Nodes },
  { mod: 'CAPSTONE_ID', nodes: { 'e1f94091-62d9-4ac9-8f0a-86c2e3650238': { title: 'Genius Showcase Master Trial' } } },
];

async function run() {
  console.log("=== CURRICULUM PARITY VERIFIER ===");
  let errors = 0;

  const { data: dbModules } = await supabase.from('modules').select('id, title, order_num');
  const { data: skillNodes } = await supabase.from('skill_nodes').select('id, module_id, title');

  if (!dbModules || !skillNodes) {
    console.error("Failed to fetch from DB");
    process.exit(1);
  }

  let totalStaticNodes = 0;

  for (const staticData of staticNodesList) {
    const moduleId = (MODULES as any)[staticData.mod];
    const moduleNodes = Object.entries(staticData.nodes);
    totalStaticNodes += moduleNodes.length;

    const dbMod = dbModules.find(m => m.id === moduleId);
    if (!dbMod) {
      console.error(`❌ DB missing module: ${staticData.mod} (${moduleId})`);
      errors++;
      continue;
    }

    const dbNodesForMod = skillNodes.filter(n => n.module_id === moduleId);
    if (dbNodesForMod.length !== moduleNodes.length) {
      console.error(`❌ Node count mismatch for ${staticData.mod}. Expected ${moduleNodes.length}, found ${dbNodesForMod.length}`);
      errors++;
    } else {
      console.log(`✅ Node count matches for ${staticData.mod} (${moduleNodes.length} nodes)`);
    }

    // Check duplicate skill_nodes for the same module
    const uniqueTitles = new Set(dbNodesForMod.map(n => n.title));
    if (uniqueTitles.size !== dbNodesForMod.length) {
      console.error(`❌ Duplicate skill_nodes found in ${staticData.mod}`);
      errors++;
    }
  }

  // Module 0 node absence
  const module0 = dbModules.find(m => m.order_num === 0);
  if (module0) {
    const dbNodesForMod0 = skillNodes.filter(n => n.module_id === module0.id);
    if (dbNodesForMod0.length > 0) {
      console.error(`❌ Module 0 unexpectedly has ${dbNodesForMod0.length} nodes`);
      errors++;
    } else {
      console.log(`✅ Module 0 node absence verified.`);
    }
  }

  if (totalStaticNodes !== skillNodes.length) {
    console.error(`❌ Total static nodes (${totalStaticNodes}) does not match total DB nodes (${skillNodes.length})`);
    errors++;
  } else {
    console.log(`✅ Total node count parity verified: ${totalStaticNodes} nodes.`);
  }

  if (errors > 0) {
    console.error(`\n❌ Validation FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log("\n✅ Static DB curriculum parity perfectly verified.");
  }
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
