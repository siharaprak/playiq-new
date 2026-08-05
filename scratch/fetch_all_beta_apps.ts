import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: apps, error } = await supabase
    .from('beta_applications')
    .select('id, parent_full_name, email, child_age_band, shipping_zip_code, status, source, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching beta_applications:', error);
    process.exit(1);
  }

  console.log(JSON.stringify(apps, null, 2));
}

main().catch(console.error);
