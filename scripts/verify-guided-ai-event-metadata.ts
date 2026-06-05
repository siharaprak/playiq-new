import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { createClient } from '@supabase/supabase-js';
import { hasForbiddenAiMetadataKeys } from '../src/lib/events/metadata-safety';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Cannot run verifier.');
  exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyAiMetadata() {
  console.log('--- Guided AI Metadata Safety Verifier ---');
  
  const { data: events, error } = await supabase
    .from('events_log')
    .select('id, event_type, metadata, created_at')
    .eq('target_type', 'guided_ai')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Failed to fetch events:', error.message);
    exit(1);
    return;
  }

  if (!events || events.length === 0) {
    console.log('No Guided AI events found. Assuming safe.');
    exit(0);
    return;
  }

  let failedCount = 0;
  let passedCount = 0;

  for (const event of events) {
    if (hasForbiddenAiMetadataKeys(event.metadata)) {
      failedCount++;
    } else {
      passedCount++;
    }
  }

  console.log(`Checked ${events.length} recent Guided AI events.`);
  console.log(`PASSED: ${passedCount}`);
  console.log(`FAILED: ${failedCount}`);

  if (failedCount > 0) {
    console.error('❌ FAILED: Found unsafe metadata containing forbidden keys (raw prompts, responses, or PII).');
    exit(1);
  } else {
    console.log('✅ PASSED: All checked events are safe.');
    exit(0);
  }
}

verifyAiMetadata();
