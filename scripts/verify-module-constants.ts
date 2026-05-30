import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { MODULES } from '../src/lib/constants';

dotenv.config({ path: '.env' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConstants() {
  console.log("=== VERIFYING CONSTANTS.TS ===");
  let errors = 0;

  const { data: dbModules, error } = await supabase.from('modules').select('id, title, order_num').order('order_num');
  if (error || !dbModules) {
    console.error("Failed to fetch modules:", error);
    process.exit(1);
  }

  // Define expected mappings based on order_num
  const expectedMappings: Record<string, number> = {
    MODULE_1_ID: 1,
    MODULE_2_ID: 2,
    MODULE_3_ID: 3,
    MODULE_4_ID: 4,
    MODULE_5_ID: 5,
    MODULE_6_ID: 6,
    MODULE_7_ID: 7,
    MODULE_8_ID: 8,
    MODULE_9_ID: 9,
    MODULE_10_ID: 10,
    CAPSTONE_ID: 11, // Canonical Capstone is order 11
  };

  const constantsEntries = Object.entries(MODULES);
  
  for (const [key, expectedOrder] of Object.entries(expectedMappings)) {
    const constantId = (MODULES as any)[key];
    if (!constantId) {
      console.error(`❌ ${key} is missing from constants.ts`);
      errors++;
      continue;
    }

    const dbMod = dbModules.find(m => m.id === constantId);
    if (!dbMod) {
      console.error(`❌ ${key} (${constantId}) DOES NOT EXIST in the database.`);
      errors++;
      continue;
    }

    if (dbMod.order_num !== expectedOrder) {
      console.error(`❌ ${key} (${constantId}) points to wrong order_num. Expected ${expectedOrder}, found ${dbMod.order_num}.`);
      errors++;
      continue;
    }
    
    // Check duplicate capstone row (Order 99)
    if (dbMod.order_num === 99) {
      console.error(`❌ ${key} (${constantId}) points to duplicate capstone row (Order 99). Should point to Canonical Capstone (Order 11).`);
      errors++;
      continue;
    }

    console.log(`✅ ${key} is correct. (DB Title: "${dbMod.title}")`);
  }

  if (errors > 0) {
    console.error(`\n❌ Validation FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log("\n✅ constants.ts successfully verified against DB.");
  }
}

verifyConstants().catch(console.error);
