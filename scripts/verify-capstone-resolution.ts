import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { MODULES } from '../src/lib/constants';

dotenv.config({ path: '.env' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== CAPSTONE RESOLUTION VERIFIER ===");
  let errors = 0;

  const CANONICAL_CAPSTONE = 'c1f94091-62d9-4ac9-8f0a-86c2e3650238';
  const DUPLICATE_CAPSTONE = 'c9210282-ee30-46f6-a74c-d8e4109b3da9';
  const EXPECTED_COURSE_ID = '402b0dc5-10f7-4b10-afad-fd88a516fa40';

  const { data: cap1 } = await supabase.from('modules').select('*').eq('id', CANONICAL_CAPSTONE).single();
  const { data: cap2 } = await supabase.from('modules').select('*').eq('id', DUPLICATE_CAPSTONE).single();

  // 1. canonical capstone ID exists
  if (!cap1) {
    console.error("❌ Canonical Capstone not found!");
    errors++;
  } else {
    console.log("✅ Canonical Capstone exists.");
    // 2. canonical capstone has correct course_id
    if (cap1.course_id !== EXPECTED_COURSE_ID) {
      console.error(`❌ Canonical Capstone course_id is ${cap1.course_id}, expected ${EXPECTED_COURSE_ID}`);
      errors++;
    } else {
      console.log("✅ Canonical Capstone has correct course_id.");
    }
  }

  // 3. archived duplicate capstone exists and metadata.archived = true
  // 8. no hard delete happened
  if (!cap2) {
    console.error("❌ Duplicate Capstone not found! It was hard deleted?");
    errors++;
  } else {
    console.log("✅ Duplicate Capstone exists (no hard delete).");
    if (cap2.metadata?.archived !== true) {
      console.error("❌ Duplicate Capstone does not have metadata.archived = true");
      errors++;
    } else {
      console.log("✅ Duplicate Capstone has metadata.archived = true.");
    }
  }

  // References to duplicate capstone
  const { count: progCount } = await supabase.from('student_node_progress').select('*', { count: 'exact', head: true }).eq('module_id', DUPLICATE_CAPSTONE);
  const { count: proofCount } = await supabase.from('proof_artifact_submissions').select('*', { count: 'exact', head: true }).eq('module_id', DUPLICATE_CAPSTONE);
  
  // 4. no student_node_progress rows reference archived capstone.
  if (progCount && progCount > 0) {
    console.error(`❌ Found ${progCount} student_node_progress rows referencing archived capstone.`);
    errors++;
  } else {
    console.log("✅ 0 student_node_progress references found.");
  }

  // 5. no proof_artifact_submissions rows reference archived capstone.
  if (proofCount && proofCount > 0) {
    console.error(`❌ Found ${proofCount} proof_artifact_submissions rows referencing archived capstone.`);
    errors++;
  } else {
    console.log("✅ 0 proof_artifact_submissions references found.");
  }

  // 7. constants.ts CAPSTONE_ID points to canonical capstone.
  if (MODULES.CAPSTONE_ID !== CANONICAL_CAPSTONE) {
    console.error(`❌ constants.ts CAPSTONE_ID is ${MODULES.CAPSTONE_ID}, expected ${CANONICAL_CAPSTONE}`);
    errors++;
  } else {
    console.log("✅ constants.ts CAPSTONE_ID points to Canonical Capstone.");
  }

  if (errors > 0) {
    console.error(`\n❌ Validation FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log("\n✅ Capstone resolution perfectly verified.");
  }
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
