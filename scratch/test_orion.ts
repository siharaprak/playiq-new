import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import Module from 'node:module';
const originalRequire = Module.prototype.require;
(Module.prototype as any).require = function(request: string) {
  if (request === 'server-only') return {};
  return originalRequire.apply(this, arguments as any);
};

async function testOrion() {
  console.log("Testing Orion (Guided AI engine) via Gemini API...");
  
  const { runGuidedMode } = await import('../src/lib/guided-ai/run-guided-mode');
  
  const studentId = "2341f139-eaa9-45cc-85f4-10501a732293"; // test_student@student.playiq.dev
  
  const requestInput = {
    mode: 'explain' as const,
    moduleNumber: 1,
    nodeId: '1',
    pageType: 'lesson' as const,
    message: 'Explain what AI is in one short sentence.',
  };
  
  try {
    const result = await runGuidedMode(requestInput, studentId);
    console.log("\nOrion Response Result:");
    console.log(JSON.stringify(result, null, 2));
    
    if (result.response && result.response.length > 0) {
      console.log("\n✅ SUCCESS: Orion is responding correctly!");
    } else {
      console.error("\n❌ FAILED: Orion returned an empty response.");
    }
  } catch (error) {
    console.error("❌ FAILED with error:", error);
  }
}

testOrion();
