import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFeedback() {
  console.log('Querying module_feedback table...');
  const { data, error } = await supabase
    .from('module_feedback')
    .select('module_id');

  if (error) {
    console.error('Error:', error);
  } else {
    const counts: Record<string, number> = {};
    for (const row of data) {
      counts[row.module_id] = (counts[row.module_id] || 0) + 1;
    }
    console.log('Feedback counts by module:', counts);
    console.log(`Total feedback entries: ${data.length}`);
  }
}

checkFeedback();
