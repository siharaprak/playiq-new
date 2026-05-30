import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import Module from 'node:module';
const originalRequire = Module.prototype.require;
(Module.prototype as any).require = function(request: string) {
  if (request === 'server-only') return {};
  return originalRequire.apply(this, arguments as any);
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('--- Simulating Proof Event with Forbidden Metadata ---');

  const { logProofEvent } = await import('../src/lib/events/learning-events');
  
  // We need a valid student_id. Let's find one, or just use a dummy one if foreign keys are disabled.
  // Actually, events_log usually enforces student_id exists. Let's get any student.
  const { data: user } = await supabaseAdmin.from('profiles').select('id').limit(1).single();
  const studentId = user ? user.id : '00000000-0000-0000-0000-000000000000';

  console.log(`Using student ID: ${studentId}`);

  const submissionId = crypto.randomUUID();

  // 1. Call logProofEvent with explicitly forbidden keys
  const result = await logProofEvent({
    studentId,
    eventType: 'proof_submitted',
    submissionId,
    artifactType: 'supplemental_proof',
    metadata: {
      safeKey: 'this_is_allowed',
      signedUrl: 'https://evil.com/leak',
      publicUrl: 'https://evil.com/public',
      storagePath: '/path/to/secret',
      fileUrl: 'https://evil.com/file',
      fileContent: 'base64:evil==',
      email: 'hacker@evil.com',
      fullName: 'Evil Hacker',
      reviewNotes: 'These are private notes'
    }
  });

  if (!result.ok) {
    console.error('❌ Failed to log event:', result.error);
    process.exit(1);
  }

  const eventId = result.eventId;
  console.log(`✅ Logged event successfully with ID: ${eventId}`);

  // 2. Fetch the event from DB to verify it was sanitized
  const { data: event } = await supabaseAdmin
    .from('events_log')
    .select('metadata')
    .eq('id', eventId)
    .single();

  if (!event) {
    console.error('❌ Could not find the logged event in the DB.');
    process.exit(1);
  }

  console.log('Stored Metadata:', event.metadata);

  const forbiddenKeys = ['signedUrl', 'publicUrl', 'storagePath', 'fileUrl', 'fileContent', 'email', 'fullName', 'reviewNotes'];
  let leaked = false;

  for (const key of forbiddenKeys) {
    if (event.metadata && key in event.metadata) {
      console.error(`❌ LEAK DETECTED: ${key} made it into the database!`);
      leaked = true;
    }
  }

  if (leaked) {
    process.exit(1);
  } else {
    console.log('✅ SANITIZER SUCCESS: No forbidden metadata keys leaked into the database!');
    
    // Cleanup the dummy event
    await supabaseAdmin.from('events_log').delete().eq('id', eventId);
    console.log('Cleaned up dummy event.');
    process.exit(0);
  }
}

run();
