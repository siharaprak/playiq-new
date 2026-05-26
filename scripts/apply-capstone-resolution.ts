import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function run() {
  console.log('Applying capstone resolution...');
  
  // Update canonical capstone
  const res1 = await supabase.from('modules')
    .update({ course_id: '402b0dc5-10f7-4b10-afad-fd88a516fa40' })
    .eq('id', 'c1f94091-62d9-4ac9-8f0a-86c2e3650238')
    .is('course_id', null);
  console.log('Update Canonical:', res1.error || 'Success');

  // Archive duplicate capstone
  const { data: mod } = await supabase.from('modules').select('metadata').eq('id', 'c9210282-ee30-46f6-a74c-d8e4109b3da9').single();
  if (mod) {
    const meta = mod.metadata || {};
    meta.archived = true;
    const res3 = await supabase.from('modules').update({ metadata: meta }).eq('id', 'c9210282-ee30-46f6-a74c-d8e4109b3da9');
    console.log('Archive Duplicate:', res3.error || 'Success');
  } else {
    console.log('Duplicate capstone not found (already deleted or archived?)');
  }
  process.exit(0);
}
run().catch(console.error);
