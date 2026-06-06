import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log("Testing status update to 'under_review'...");
  const { data: topic } = await supabase.from('discussion_topics').select('id, status').limit(1).single();
  if (!topic) {
    console.log("No topics found to test update.");
    return;
  }

  console.log("Found topic:", topic.id, "current status:", topic.status);
  
  // Try updating to 'under_review'
  const { data, error } = await supabase
    .from('discussion_topics')
    .update({ status: 'under_review' })
    .eq('id', topic.id)
    .select();

  if (error) {
    console.log("Update failed as expected or due to constraint:", error.message);
  } else {
    console.log("Update succeeded! 'under_review' is allowed in the database.", data);
    // Revert status
    await supabase.from('discussion_topics').update({ status: topic.status }).eq('id', topic.id);
    console.log("Reverted status successfully.");
  }
}

main().catch(console.error);
