import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: allProfiles, error: err } = await supabase.from('profiles').select('id, role, email, learning_level');
  if (err) {
    console.error('Database query error:', err);
    return;
  }
  
  console.log(`Total profiles in database: ${allProfiles?.length}`);
  const roles = allProfiles?.reduce((acc: Record<string, number>, p: any) => {
    acc[p.role] = (acc[p.role] || 0) + 1;
    return acc;
  }, {});
  console.log('Profile count by role:', roles);
  console.log('Sample profiles:', allProfiles?.slice(0, 5));
}
run();
