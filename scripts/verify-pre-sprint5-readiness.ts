import { execSync } from 'child_process';

function runScript(name: string, command: string) {
  console.log(`\n==================================================`);
  console.log(`⏳ Running ${name}...`);
  console.log(`> ${command}`);
  console.log(`==================================================\n`);
  try {
    const output = execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`\n❌ Script ${name} failed!`);
    process.exit(1);
  }
}

function run() {
  console.log("🚀 Starting Pre-Sprint 5 Readiness Aggregator...\n");

  runScript("Audit Curriculum DB", "npm run audit:curriculum-db");
  runScript("Verify Module Constants", "npm run verify:module-constants");
  runScript("Verify Curriculum Parity", "npm run verify:curriculum-parity");
  runScript("Verify Runtime Source", "npm run verify:runtime-source");
  runScript("Verify Capstone Resolution", "npm run verify:capstone-resolution");
  
  // Proof QA
  runScript("QA Proof State Machine", "npm run qa:proof-state-machine");
  runScript("QA Proof Storage Paths", "npm run qa:proof-storage-paths");
  runScript("Verify Proof Events", "npm run verify:proof-events");
  runScript("Verify Proof Parent Access", "npm run verify:proof-parent-access");
  runScript("Verify Parent Proof Summary", "npm run verify:parent-proof-summary");

  // Guided AI QA
  runScript("QA Guided AI", "npm run qa:guided-ai");
  runScript("Verify AI Events", "npm run verify:ai-events");
  
  console.log(`\n==================================================`);
  console.log(`✅ All Pre-Sprint 5 Readiness Checks Passed Successfully!`);
  console.log(`==================================================\n`);
  process.exit(0);
}

run();
