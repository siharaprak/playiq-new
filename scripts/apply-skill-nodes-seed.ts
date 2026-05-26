import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function run() {
  const sql = fs.readFileSync('supabase/migrations/20260523061000_data_alignment_seed_skill_nodes_course1.sql', 'utf8');
  
  // A naive parser to grab the VALUES list since we know the format exactly
  const matches = sql.match(/\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*80\)/g);
  if (!matches) {
    console.error('No values found in SQL');
    process.exit(1);
  }

  const rows = matches.map(m => {
    // hacky regex parsing just for this simple file
    const parts = m.match(/\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*80\)/);
    if (!parts) throw new Error("bad parse");
    return {
      id: parts[1],
      module_id: parts[2],
      title: parts[3],
      mastery_threshold_placeholder: 80
    };
  });

  console.log(`Upserting ${rows.length} skill nodes...`);
  const { data, error } = await supabase.from('skill_nodes').upsert(rows, { onConflict: 'id' });
  
  if (error) {
    console.error('Error upserting nodes:', error);
    process.exit(1);
  }
  
  console.log('Successfully upserted skill nodes.');
  process.exit(0);
}

run().catch(console.error);
