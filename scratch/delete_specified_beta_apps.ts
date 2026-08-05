import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const idsToRemove = [
    '91eb6108-21ac-43fb-ae72-fdd7da75280b', // Test Parent (sdfasd1234@yahoo.com)
    '45df7832-0502-4e8b-9f3a-4caed276d88c', // Test Parent (test-403fix@example.com)
    'c468eace-e806-4ffd-9138-61b59b6e6ad3', // Test (parent@test.com)
    '5c1ca287-55cb-419d-887c-9e34a211b768', // Sienvi (teamsienvi@gmail.com)
    'a2d666ae-27ee-43e1-8023-2d052a7b5dfe', // Jane Doe (jane@example.com)
    'ebf0c7e8-9c3c-43db-ba27-322aa62a03c6', // Cheenee Macalino (chrbxdev@gmail.com)
    '84cf4b56-afd1-46d1-8e02-cb083e419b7b', // Iris Villanueva (ivllnv.000@gmail.com)
  ];

  console.log(`Deleting ${idsToRemove.length} records from beta_applications...`);

  const { data, error } = await supabase
    .from('beta_applications')
    .delete()
    .in('id', idsToRemove)
    .select();

  if (error) {
    console.error('Error deleting records:', error);
    process.exit(1);
  }

  console.log('Successfully deleted records:', data);

  // Fetch remaining records
  const { data: remaining, error: fetchErr } = await supabase
    .from('beta_applications')
    .select('id, parent_full_name, email, child_age_band, shipping_zip_code, status, created_at')
    .order('created_at', { ascending: false });

  if (fetchErr) {
    console.error('Error fetching remaining records:', fetchErr);
  } else {
    console.log(`Remaining records count: ${remaining?.length}`);
    console.log(JSON.stringify(remaining, null, 2));
  }
}

main().catch(console.error);
