import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve(__dirname, '../src');

function getFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      results.push(filePath);
    }
  });
  return results;
}

function verifyLoggingSafety() {
  console.log('=== RUNNING LOGGING SAFETY VERIFIER ===');
  const files = getFiles(SRC_DIR);
  let failed = false;

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(path.resolve(__dirname, '..'), file);

    const isClientFile = content.includes("'use client'") || content.includes('"use client"');

    // 1. Check for service role imports in client files
    if (isClientFile && (content.includes('supabase/admin') || content.includes('supabaseAdmin'))) {
      console.error(`❌ Error: Client file "${relativePath}" imports service role admin client!`);
      failed = true;
    }

    // 2. Check for secret logging (service role key, API keys)
    const secretLogs = content.match(/console\.(log|error|warn|info)\([^)]*SUPABASE_SERVICE_ROLE_KEY[^)]*\)/i);
    if (secretLogs) {
      console.error(`❌ Error: File "${relativePath}" logs SUPABASE_SERVICE_ROLE_KEY in console!`);
      failed = true;
    }

    // 3. Check for process.env secrets logging
    if (content.match(/console\.(log|error|warn|info)\([^)]*process\.env\.[A-Z_]*KEY[^)]*\)/i)) {
      console.error(`❌ Error: File "${relativePath}" logs process.env keys in console!`);
      failed = true;
    }

    // 4. Check for storage_path or signed URL in client files
    if (isClientFile && (content.includes('storage_path') || content.includes('storagePath') || content.includes('signedUrl') || content.includes('signed_url'))) {
      // Allow if it is a type definition or simple property check, but flag console.log
      if (content.match(/console\.(log|error|warn|info)\([^)]*(storage_path|storagePath|signedUrl|signed_url)[^)]*\)/i)) {
        console.error(`❌ Error: Client file "${relativePath}" logs storage_path or signedUrl in console!`);
        failed = true;
      }
    }

    // 5. Check for raw prompt/response logging (e.g. console.log(prompt))
    // Flag matches where console.log contains words like prompt, response, message, text
    // BUT ignore safe identifiers or safe-logger calls
    if (content.includes('console.log') || content.includes('console.error')) {
      const promptLogs = content.match(/console\.(log|error|warn|info)\([^)]*(rawPrompt|rawResponse|systemPrompt|system_prompt)[^)]*\)/i);
      if (promptLogs) {
        console.error(`❌ Error: File "${relativePath}" logs raw prompts/responses in console!`);
        failed = true;
      }
    }
  });

  if (failed) {
    console.error('❌ Verification Failed: Fix logging safety violations.');
    process.exit(1);
  } else {
    console.log('✅ Verification Passed: Logging review verifiers find no leaks.');
  }
}

verifyLoggingSafety();
