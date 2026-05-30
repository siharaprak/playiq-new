import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const courses = await supabase.from('courses').select('*');
  const modules = await supabase.from('modules').select('*').order('order_num');
  const skill_trees = await supabase.from('skill_trees').select('*');
  const skill_nodes = await supabase.from('skill_nodes').select('*').limit(10);
  
  console.log('Courses:', JSON.stringify(courses.data, null, 2));
  console.log('Modules:', JSON.stringify(modules.data, null, 2));
  console.log('Skill Trees:', JSON.stringify(skill_trees.data, null, 2));
  console.log('Skill Nodes (limit 10):', JSON.stringify(skill_nodes.data, null, 2));
  if (skill_nodes.error) console.error("skill_nodes error:", skill_nodes.error);
}
run();
