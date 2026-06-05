import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import Module from 'node:module';
const originalRequire = Module.prototype.require;
(Module.prototype as any).require = function(request: string) {
  if (request === 'server-only') return {};
  return originalRequire.apply(this, arguments as any);
};

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

async function main() {
  const { supabaseAdmin } = await import('../src/lib/supabase/admin');
  const { getStudentJourneyMap } = await import('../src/lib/student-journey/student-journey-map');

  console.log('=== Student Journey Map Verification ===\n');

  // Find a student profile to test with
  const { data: student, error } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'student')
    .limit(1)
    .single();

  if (error || !student) {
    console.log('⚠️ No student profile found to run journey map test. Attempting generic user profile...');
    const { data: anyUser, error: anyUserError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .limit(1)
      .single();

    if (anyUserError || !anyUser) {
      console.error('❌ FAILED: No users exist in profiles table.');
      exit(1);
      return;
    }

    await testJourneyForUser(anyUser.id, anyUser.full_name);
  } else {
    await testJourneyForUser(student.id, student.full_name);
  }

  async function testJourneyForUser(userId: string, name: string) {
    console.log(`Running student journey mapping for user: ${name} (${userId})`);

    try {
      const journey = await getStudentJourneyMap(userId);

      if (!Array.isArray(journey)) {
        console.error('❌ FAILED: getStudentJourneyMap did not return an array.');
        exit(1);
        return;
      }

      if (journey.length !== 14) {
        console.error(`❌ FAILED: Expected exactly 14 journey steps, got ${journey.length}`);
        exit(1);
        return;
      }

      // Print steps overview
      console.log('\n--- Journey Steps Audit ---');
      for (const step of journey) {
        const statusStr = step.completed ? 'COMPLETED' : 'PENDING';
        console.log(`Step ${step.stepNumber}: [${step.id}] [${statusStr}] - ${step.title}`);
      }

      console.log('\n✅ PASSED: Student journey map verified successfully.');
      exit(0);
    } catch (err) {
      console.error('❌ FAILED: Unexpected error running journey map verification:', err);
      exit(1);
    }
  }
}

main();
