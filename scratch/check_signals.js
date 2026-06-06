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
  const userId = 'dd856a53-e732-4008-bcc9-f921ac551693';
  console.log("Checking fingerprint_signals for user:", userId);

  const { data: signals, error } = await supabase
    .from('fingerprint_signals')
    .select('*')
    .eq('student_id', userId);

  if (error) {
    console.error("Error reading fingerprint_signals:", error.message);
  } else {
    console.log("Found " + signals.length + " fingerprint signals:");
    signals.forEach(s => {
      console.log(`- type=${s.signal_type}, value=${s.signal_value}, module_id=${s.module_id}`);
    });
  }
}

main().catch(console.error);
