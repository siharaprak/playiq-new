import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env if present (primarily for local execution)
if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
}

async function main() {
  const args = process.argv.slice(2);
  let targetEnv = 'local';
  
  for (const arg of args) {
    if (arg === 'local' || arg === 'staging' || arg === 'production') {
      targetEnv = arg;
    } else if (arg.startsWith('--env=')) {
      targetEnv = arg.split('=')[1];
    }
  }

  console.log(`=== Environment Variable Verification (Target: ${targetEnv}) ===\n`);

  // Define env vars configuration
  // For local checks, we do not require production-only values.
  const envConfig = [
    { name: 'NEXT_PUBLIC_SUPABASE_URL', required: true },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', required: true },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', required: true },
    { name: 'GEMINI_API_KEY', required: true, fallback: 'GOOGLE_GENERATIVE_AI_API_KEY' },
    { name: 'STRIPE_SECRET_KEY', required: false }, // optional/deferred for free/invite beta
    { name: 'STRIPE_WEBHOOK_SECRET', required: false }, // optional/deferred for free/invite beta
    { name: 'NEXT_PUBLIC_GA_ID', required: false }, // optional/deferred
    { name: 'PROOF_CLEANUP_CRON_SECRET', required: targetEnv !== 'local' } // required only for staging/production deployments
  ];

  let missingRequiredCount = 0;

  for (const item of envConfig) {
    let value = process.env[item.name];
    if (!value && item.fallback) {
      value = process.env[item.fallback];
    }

    const isPresent = value && value.trim() !== '';

    if (isPresent) {
      console.log(`[ENV CHECK] ${item.name}: PRESENT`);
    } else {
      if (item.required) {
        console.warn(`[ENV CHECK] ${item.name}: MISSING`);
        missingRequiredCount++;
      } else {
        console.log(`[ENV CHECK] ${item.name}: OPTIONAL_DEFERRED`);
      }
    }
  }

  console.log('\n-----------------------------------------');
  if (missingRequiredCount > 0) {
    console.error(`Status: FAILED. Missing ${missingRequiredCount} required environment variable(s) for target '${targetEnv}'.`);
    process.exit(1);
  } else {
    console.log(`Status: SUCCESS. Environment variables verified for target '${targetEnv}'.`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Environment verification error:', err);
  process.exit(1);
});
