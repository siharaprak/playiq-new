import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { supabaseAdmin } from '../src/lib/supabase/admin';

async function main() {
  console.log('Fetching discussion categories...');
  const { data, error } = await supabaseAdmin
    .from('discussion_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Categories count:', data.length);
    console.log(JSON.stringify(data, null, 2));
  }
}

main();
