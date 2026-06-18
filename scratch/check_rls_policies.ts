import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceKey);

  console.log('Querying RLS policies for profiles table...');
  const { data: policies, error } = await supabase.rpc('pg_execute', {
    query: `
      SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
      FROM pg_policies
      WHERE tablename = 'profiles';
    `
  });

  if (error) {
    console.error('Error fetching policies via RPC pg_execute:', error);
    
    // Fallback: try querying directly if possible, or print migration information.
    console.log('Attempting alternative pg_policies query...');
    const { data: policiesAlt, error: errorAlt } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'profiles');
    if (errorAlt) {
      console.error('Error fetching pg_policies via standard select:', errorAlt);
    } else {
      console.log('Policies (Alt):', policiesAlt);
    }
  } else {
    console.log('RLS Policies for profiles:', policies);
  }
}

main().catch(console.error);
