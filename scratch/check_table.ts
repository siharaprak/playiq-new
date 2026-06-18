import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function run() {
  const targetId = 'a0a58884-b810-4f8c-92e5-80f0111f8a54'; // local.student@example.test
  console.log(`Attempting direct profiles table delete for ${targetId}...`);

  const { data, error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', targetId)
    .select();

  if (error) {
    console.error('❌ Profiles delete error:', error);
  } else {
    console.log('✅ Profiles delete success! Deleted rows:', data);
  }
  process.exit(0);
}

run().catch(console.error);
