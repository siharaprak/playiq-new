import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Cannot run verifier.');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

const FORBIDDEN_KEYS = [
  'signedUrl',
  'publicUrl',
  'storagePath',
  'fileUrl',
  'fileContent',
  'email',
  'fullName',
  'reviewNotes'
];

async function run() {
  console.log('--- Proof Event Metadata Safety Verifier ---');
  const { data: events, error } = await supabaseAdmin
    .from('events_log')
    .select('id, metadata')
    .in('event_type', ['proof_submitted', 'proof_reviewed']);

  if (error) {
    console.error('Failed to fetch proof events:', error);
    process.exit(1);
  }

  if (!events || events.length === 0) {
    console.log('No proof events found. Assuming safe.');
    process.exit(0);
  }

  let failed = 0;
  for (const event of events) {
    const md = event.metadata || {};
    const foundKeys = FORBIDDEN_KEYS.filter(k => k in md);
    if (foundKeys.length > 0) {
      console.error(`❌ Event ${event.id} contains forbidden keys: ${foundKeys.join(', ')}`);
      failed++;
    }
  }

  if (failed > 0) {
    console.error(`\n❌ FAILED: Found ${failed} unsafe proof events.`);
    process.exit(1);
  }

  console.log(`✅ PASSED: Checked ${events.length} proof events safely.`);
  process.exit(0);
}

run();
