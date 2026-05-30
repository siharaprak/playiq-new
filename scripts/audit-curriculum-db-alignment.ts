import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { PLAYIQ_COURSE_1_CANONICAL } from '../src/lib/curriculum/canonical-course-map';
import { MODULES } from '../src/lib/constants';

dotenv.config({ path: '.env' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function runAudit() {
  console.log("=== PLAYIQ CURRICULUM DB ALIGNMENT AUDIT ===\n");

  const { data: courses } = await supabase.from('courses').select('id, title');
  const { data: dbModules } = await supabase.from('modules').select('id, title, order_num, slug, course_id, status').order('order_num');
  const { data: skillTrees } = await supabase.from('skill_trees').select('id, name');
  const { data: skillNodes } = await supabase.from('skill_nodes').select('id');
  
  console.log("--- 1. Course Rows ---");
  console.log(`Found ${courses?.length || 0} courses.`);
  courses?.forEach(c => console.log(` - ID: ${c.id} | Title: ${c.title}`));
  
  console.log("\n--- 2. Module Rows ---");
  console.log(`Found ${dbModules?.length || 0} modules in DB. Expected ${PLAYIQ_COURSE_1_CANONICAL.length} canonical modules.`);
  
  const capstones = dbModules?.filter(m => m.title?.toLowerCase().includes('capstone'));
  console.log(`Found ${capstones?.length || 0} capstone rows:`);
  capstones?.forEach(c => console.log(` - ID: ${c.id} | Title: "${c.title}" | Order: ${c.order_num} | Course: ${c.course_id || 'null'}`));

  const duplicateSlugs = new Set();
  const seenSlugs = new Set();
  dbModules?.forEach(m => {
    if (seenSlugs.has(m.slug)) duplicateSlugs.add(m.slug);
    seenSlugs.add(m.slug);
  });
  if (duplicateSlugs.size > 0) {
    console.log(`WARNING: Duplicate module slugs found: ${Array.from(duplicateSlugs).join(', ')}`);
  }

  console.log("\n--- 3. Skill Trees & Nodes ---");
  console.log(`Skill Trees: ${skillTrees?.length || 0} rows found.`);
  console.log(`Skill Nodes: ${skillNodes?.length || 0} rows found.`);
  if (!skillNodes || skillNodes.length === 0) {
    console.log("skill_nodes table is EMPTY.");
  }

  console.log("\n--- 4. DB to Canonical Map Alignment ---");
  PLAYIQ_COURSE_1_CANONICAL.forEach(canon => {
    const matchingDbs = dbModules?.filter(m => m.order_num === canon.order_num);
    if (!matchingDbs || matchingDbs.length === 0) {
      console.log(` ❌ Missing DB module for canonical order ${canon.order_num} (${canon.title})`);
    } else if (matchingDbs.length > 1) {
      console.log(` ⚠️ DUPLICATE DB modules for canonical order ${canon.order_num} (${canon.title}): ${matchingDbs.map(m => m.id).join(', ')}`);
    } else {
      const dbm = matchingDbs[0];
      const matchStatus = dbm.slug === canon.slug ? "✅" : `❌ (DB slug: ${dbm.slug})`;
      console.log(` ${matchStatus} Order ${canon.order_num}: ${canon.title} -> DB ID: ${dbm.id}`);
    }
  });

  console.log("\n--- 5. constants.ts Mappings ---");
  const constantsEntries = Object.entries(MODULES);
  console.log(`Found ${constantsEntries.length} entries in constants.MODULES`);
  constantsEntries.forEach(([key, id]) => {
    const dbm = dbModules?.find(m => m.id === id);
    if (!dbm) {
      console.log(` ❌ ${key} -> ID ${id} (NOT FOUND IN DB)`);
    } else {
      console.log(` ✅ ${key} -> ID ${id} (DB Title: ${dbm.title}, Order: ${dbm.order_num})`);
    }
  });

  console.log("\n--- 6. Capstone References Check ---");
  if (capstones && capstones.length > 0) {
    for (const cap of capstones) {
      const prog = await supabase.from('student_node_progress').select('id', { count: 'exact', head: true }).eq('module_id', cap.id);
      const proofs = await supabase.from('proof_artifact_submissions').select('id', { count: 'exact', head: true }).eq('module_id', cap.id);
      const events = await supabase.from('events_log').select('id', { count: 'exact', head: true }).eq('module_id', cap.id);
      const mastery = await supabase.from('mastery_checkpoints').select('id', { count: 'exact', head: true }).eq('module_id', cap.id);
      
      console.log(`Capstone ID ${cap.id} ("${cap.title}") references:`);
      console.log(` - progress rows: ${prog.count || 0}`);
      console.log(` - proof rows: ${proofs.count || 0}`);
      console.log(` - event rows: ${events.count || 0}`);
      console.log(` - mastery rows: ${mastery.count || 0}`);
    }
  }

  console.log("\n=== AUDIT COMPLETE ===\n");
}

runAudit().catch(e => {
  console.error(e);
  process.exit(1);
});
