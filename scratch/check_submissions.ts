import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'supabase_migrations' }
});

async function run() {
  const { data, error } = await supabase.from('schema_migrations').select('*');
  if (error) {
    console.error('Error fetching schema migrations:', error);
  } else {
    console.log('Remote migrations in DB:', data);
  }
}
run();
