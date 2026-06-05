import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import * as fs from 'fs';
import * as path from 'path';
import Module from 'node:module';

const originalRequire = Module.prototype.require;
(Module.prototype as any).require = function(request: string) {
  if (request === 'server-only') return {};
  if (request === 'next/cache') return { revalidatePath: () => {} };
  return originalRequire.apply(this, arguments as any);
};

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

async function main() {
  console.log('=== Sprint 8: Enrollment Integrity Verification (ENR-01) ===\n');

  let failed = false;

  const { supabaseAdmin } = await import('../src/lib/supabase/admin');

  // 1. Static Audit of manuallyEnrollStudent Action
  console.log('1. Checking application-level double-enrollment prevention...');
  const actionPath = path.resolve(__dirname, '../src/app/(dashboard)/admin/enrollments/actions.ts');
  if (fs.existsSync(actionPath)) {
    const actionContent = fs.readFileSync(actionPath, 'utf8');
    
    // Check that we query enrollments with both student_id and course_id
    const hasDuplicateCheck = actionContent.includes("from('enrollments')") &&
                              actionContent.includes(".eq('student_id'") &&
                              actionContent.includes(".eq('course_id'");
    
    const hasAlreadyEnrolledReturn = actionContent.includes('already enrolled') || 
                                     actionContent.includes('already_enrolled') ||
                                     actionContent.includes('student is already enrolled');

    if (hasDuplicateCheck && hasAlreadyEnrolledReturn) {
      console.log('✅ PASSED: manuallyEnrollStudent has active duplicate checking logic.');
    } else {
      console.error('❌ FAILED: manuallyEnrollStudent does not implement double-enrollment checking logic.');
      failed = true;
    }
  } else {
    console.error(`❌ FAILED: Enrollment actions file not found at ${actionPath}`);
    failed = true;
  }

  // 2. Dynamic DB Constraint Test
  console.log('\n2. Testing database unique constraint for enrollments...');
  try {
    // Get a student and course to perform check
    const { data: student } = await supabaseAdmin.from('profiles').select('id').limit(1).single();
    const { data: course } = await supabaseAdmin.from('courses').select('id').limit(1).single();

    if (student && course) {
      console.log(`Inserting test enrollment for student ${student.id} and course ${course.id}...`);
      
      // Clean up any pre-existing test enrollment first to ensure test is clean
      await supabaseAdmin
        .from('enrollments')
        .delete()
        .eq('student_id', student.id)
        .eq('course_id', course.id);

      // Insert first enrollment
      const { data: ins1, error: err1 } = await supabaseAdmin
        .from('enrollments')
        .insert({
          student_id: student.id,
          course_id: course.id,
          status: 'active',
          enrollment_type: 'sprint',
        })
        .select();

      if (err1) {
        throw new Error(`Failed to insert first enrollment: ${err1.message}`);
      }

      console.log('First enrollment inserted. Attempting duplicate insertion...');

      // Attempt second duplicate insertion
      const { error: err2 } = await supabaseAdmin
        .from('enrollments')
        .insert({
          student_id: student.id,
          course_id: course.id,
          status: 'active',
          enrollment_type: 'sprint',
        });

      if (err2 && err2.message.includes('unique constraint')) {
        console.log('✅ PASSED: Database rejected duplicate enrollment via unique constraint.');
      } else {
        console.error('❌ FAILED: Database did not reject duplicate enrollment or failed with unexpected error:', err2?.message || 'No error');
        failed = true;
      }

      // Cleanup
      if (ins1 && ins1[0]) {
        await supabaseAdmin.from('enrollments').delete().eq('id', ins1[0].id);
        console.log('Cleanup: Test enrollment deleted.');
      }
    } else {
      console.log('⚠️ Skipping database constraint check (no profile or course found).');
    }
  } catch (err: any) {
    console.error('❌ FAILED: Database unique constraint check crashed:', err.message);
    failed = true;
  }

  console.log('\n================================================');
  if (failed) {
    console.error('❌ Enrollment Integrity Verification FAILED.');
    exit(1);
  } else {
    console.log('✅ Enrollment Integrity Verification PASSED.');
    exit(0);
  }
}

main();
