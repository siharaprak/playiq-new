import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceKey);

  // Fetch profiles with parent or student role
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at');

  if (pErr) console.error('Error fetching profiles:', pErr);
  else console.log('Profiles:', profiles);

  // Fetch parent child links
  const { data: links, error: lErr } = await supabase
    .from('parent_child_links')
    .select('*');

  if (lErr) console.error('Error fetching parent_child_links:', lErr);
  else console.log('Parent-Child Links:', links);
}

main().catch(console.error);
