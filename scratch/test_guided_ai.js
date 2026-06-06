import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Parse .env.local manually
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

// Set env variables so the imported modules can see them
process.env.NEXT_PUBLIC_SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;

// Mock server-only since we are in a node environment
import module from 'module';
const originalRequire = module.prototype.require;
module.prototype.require = function(arg) {
  if (arg === 'server-only') {
    return {};
  }
  return originalRequire.apply(this, arguments);
};

// Now import runGuidedMode
import { runGuidedMode } from '../src/lib/guided-ai/run-guided-mode.ts';

async function main() {
  console.log("Testing runGuidedMode...");
  
  // Let's get a real student ID to test
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: profile } = await supabase.from('profiles').select('id').eq('role', 'student').limit(1).single();
  const studentId = profile?.id || 'dd856a53-e732-4008-bcc9-f921ac551693';
  console.log("Using studentId:", studentId);

  const requestPayload = {
    mode: 'coach',
    message: 'Hello guided AI coach! I want to understand how variables work.',
    moduleNumber: 1,
    nodeId: 'node_1',
    pageType: 'lesson'
  };

  try {
    const result = await runGuidedMode(requestPayload, studentId);
    console.log("runGuidedMode Succeeded!");
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("runGuidedMode Failed with error:", err);
  }
}

main().catch(console.error);
