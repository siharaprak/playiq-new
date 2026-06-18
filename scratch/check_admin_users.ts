import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceKey);

  console.log('Querying admin profiles...');
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('role', 'admin');

  if (error) {
    console.error('Error fetching admin profiles:', error);
  } else {
    console.log('Admin profiles:', profiles);
  }
}

main().catch(console.error);
