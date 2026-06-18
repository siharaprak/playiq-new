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

// Mock server-only require
import Module from 'node:module';
const originalRequire = Module.prototype.require;
Module.prototype.require = function(request) {
  if (request === 'server-only') return {};
  return originalRequire.apply(this, arguments);
};

// Set env vars
process.env.NEXT_PUBLIC_SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;

async function main() {
  const { runGuidedMode } = await import('../src/lib/guided-ai/run-guided-mode.js');
  
  const studentId = '37c74b67-86b6-4dab-abdf-84fd244ab418'; // Spencer's ID
  
  const requestInput = {
    mode: 'explain',
    moduleNumber: 2,
    nodeId: '2',
    pageType: 'lesson',
    message: "Teach someone the Truth Filter. Explain each of the 4 questions and why they matter.",
  };
  
  console.log("Running runGuidedMode with inputs:", requestInput);
  try {
    const result = await runGuidedMode(requestInput, studentId);
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error caught:", error);
  }
}

main().catch(console.error);
