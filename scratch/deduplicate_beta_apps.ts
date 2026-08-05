import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const duplicateIdsToDelete = [
    '46b7d5bd-bd6c-44b4-9575-b6e45c6d5959', // Sihara (2026-07-19 23:40:37)
    '43a3e1fb-3a74-4e1d-a522-6beca7dacddd', // Sihara (2026-07-19 23:40:17)
    'c11c8844-0ae3-4226-89e4-1b02118c727a', // Sihara (2026-06-09 19:16:47)
    '67fe94ef-c4cd-4f9c-bc93-f20cd8de9c57', // Sahen k (2026-06-10 17:30:25)
  ];

  console.log(`Deleting ${duplicateIdsToDelete.length} duplicate records...`);

  const { data, error } = await supabase
    .from('beta_applications')
    .delete()
    .in('id', duplicateIdsToDelete)
    .select();

  if (error) {
    console.error('Error deleting duplicate records:', error);
    process.exit(1);
  }

  console.log('Successfully deleted duplicate records:', data);

  // Fetch remaining clean roster
  const { data: remaining, error: fetchErr } = await supabase
    .from('beta_applications')
    .select('id, parent_full_name, email, child_age_band, shipping_zip_code, status, created_at')
    .order('created_at', { ascending: false });

  if (fetchErr) {
    console.error('Error fetching remaining records:', fetchErr);
  } else {
    console.log(`Clean roster count: ${remaining?.length}`);
    console.log(JSON.stringify(remaining, null, 2));
  }
}

main().catch(console.error);
