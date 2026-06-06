import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Parse .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    // Strip quotes if any
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const ALLOWED_AI_METADATA_KEYS = new Set([
  'mode',
  'moduleNumber',
  'nodeId',
  'pageType',
  'hintLevel',
  'retryCount',
  'refusalReason',
  'routingTarget',
  'effortRequired',
  'teachBackRequired',
  'confusionType',
  'noPromptStored',
  'noResponseStored',
  'source',
  'noFileContentStoredInEvent'
]);

function hasForbiddenAiMetadataKeys(metadata) {
  if (!metadata) return false;
  return Object.keys(metadata).some(key => !ALLOWED_AI_METADATA_KEYS.has(key));
}

function sanitizeAiEventMetadata(metadata) {
  if (!metadata) return {};
  const sanitized = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    if (ALLOWED_AI_METADATA_KEYS.has(key)) {
      sanitized[key] = value;
    }
  }

  if (Object.keys(metadata).length > Object.keys(sanitized).length) {
    sanitized['noPromptStored'] = true;
    sanitized['noResponseStored'] = true;
  }

  return sanitized;
}

async function main() {
  console.log("Fetching Guided AI events from database...");
  const { data: events, error } = await supabase
    .from('events_log')
    .select('id, event_type, metadata')
    .eq('target_type', 'guided_ai');

  if (error) {
    console.error("Error fetching events:", error);
    return;
  }

  console.log(`Found ${events.length} total Guided AI events.`);
  let updatedCount = 0;

  for (const event of events) {
    if (hasForbiddenAiMetadataKeys(event.metadata)) {
      const sanitized = sanitizeAiEventMetadata(event.metadata);
      console.log(`Sanitizing event ID ${event.id}. Original keys:`, Object.keys(event.metadata), "New keys:", Object.keys(sanitized));
      
      const { error: updateError } = await supabase
        .from('events_log')
        .update({ metadata: sanitized })
        .eq('id', event.id);

      if (updateError) {
        console.error(`Error updating event ${event.id}:`, updateError);
      } else {
        updatedCount++;
      }
    }
  }

  console.log(`Sanitization complete. Updated ${updatedCount} events.`);
}

main().catch(console.error);
