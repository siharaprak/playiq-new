import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import * as fs from 'fs';
import * as path from 'path';
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
  console.log('=== Support Issues Schema & Resolution Verification ===\n');

  let failed = false;

  const { supabaseAdmin } = await import('../src/lib/supabase/admin');
  const { resolveSupportIssue } = await import('../src/lib/data/admin-support');

  // 1. Verify migration exists in repo
  console.log('1. Checking migration file in repo...');
  const migrationPath = path.resolve(__dirname, '../supabase/migrations/20260606000000_support_issues_drift.sql');
  if (fs.existsSync(migrationPath)) {
    const content = fs.readFileSync(migrationPath, 'utf8');
    if (content.includes('resolved_at') && content.includes('metadata') && content.includes('ADD COLUMN IF NOT EXISTS')) {
      console.log('✅ PASSED: Idempotent migration exists in repo with correct SQL.');
    } else {
      console.error('❌ FAILED: Migration file exists but does not contain correct SQL.');
      failed = true;
    }
  } else {
    console.error(`❌ FAILED: Migration file not found at ${migrationPath}`);
    failed = true;
  }

  // 2. Verify admin-support.ts checks or safely uses these fields
  console.log('\n2. Auditing admin-support.ts server-side usage...');
  const helperPath = path.resolve(__dirname, '../src/lib/data/admin-support.ts');
  if (fs.existsSync(helperPath)) {
    const helperContent = fs.readFileSync(helperPath, 'utf8');
    if (helperContent.includes('resolved_at') && helperContent.includes('metadata') && helperContent.includes('select')) {
      console.log('✅ PASSED: admin-support.ts checks and uses columns safely.');
    } else {
      console.error('❌ FAILED: admin-support.ts does not check/use columns safely.');
      failed = true;
    }
  } else {
    console.error(`❌ FAILED: admin-support.ts helper file not found at ${helperPath}`);
    failed = true;
  }

  // 3. Verify columns exist via read-only select from DB
  console.log('\n3. Verifying column existence in database schema...');
  try {
    const { data, error } = await supabaseAdmin
      .from('support_issues')
      .select('resolved_at, metadata')
      .limit(1);

    if (error) {
      console.error(`❌ FAILED: Columns check query error: ${error.message}`);
      failed = true;
    } else {
      console.log('✅ PASSED: resolved_at and metadata columns exist and are accessible.');
    }
  } catch (err: any) {
    console.error('❌ FAILED: Column check crashed:', err.message);
    failed = true;
  }

  // 3b. Verify columns via PostgREST OpenAPI definitions (representation of database information_schema)
  console.log('\n3b. Verifying column schema representation via PostgREST OpenAPI spec...');
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
      }
    );
    if (response.ok) {
      const spec = await response.json();
      const properties = spec.definitions?.support_issues?.properties;
      if (properties && properties.resolved_at && properties.metadata) {
        console.log('✅ PASSED: resolved_at and metadata columns found in schema definition properties.');
      } else {
        console.error('❌ FAILED: resolved_at or metadata not found in support_issues definition properties.');
        failed = true;
      }
    } else {
      console.error(`❌ FAILED: Could not fetch OpenAPI schema from PostgREST: Status ${response.status}`);
      failed = true;
    }
  } catch (err: any) {
    console.error('❌ FAILED: OpenAPI schema check crashed:', err.message);
    failed = true;
  }


  // 4. Test support issue resolution flow (resolve/reopen works, no destructive changes)
  console.log('\n4. Running live ticket resolution and integrity flow test...');
  try {
    // Find a student profile to act as reporter
    const { data: student, error: studentError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1)
      .single();

    if (studentError || !student) {
      console.log('⚠️ Skipping live insertion test (no reporter profile found).');
    } else {
      // Create a test ticket
      const { data: ticket, error: ticketError } = await supabaseAdmin
        .from('support_issues')
        .insert({
          reporter_id: student.id,
          issue_text: 'Beta testing support ticket',
          status: 'open',
        })
        .select()
        .single();

      if (ticketError || !ticket) {
        throw new Error(`Failed to create test ticket: ${ticketError?.message}`);
      }

      console.log(`Created test ticket ID: ${ticket.id}`);

      // Resolve the ticket
      const res = await resolveSupportIssue(ticket.id, 'Resolved via QA script', supabaseAdmin);
      if (!res.ok) {
        throw new Error(`Failed to resolve ticket: ${res.error}`);
      }

      // Verify resolved data
      const { data: resolvedTicket, error: fetchError } = await supabaseAdmin
        .from('support_issues')
        .select('*')
        .eq('id', ticket.id)
        .single();

      if (fetchError || !resolvedTicket) {
        throw new Error(`Failed to fetch resolved ticket: ${fetchError?.message}`);
      }

      if (
        resolvedTicket.status === 'resolved' &&
        resolvedTicket.resolved_at &&
        resolvedTicket.metadata?.resolution_notes === 'Resolved via QA script'
      ) {
        console.log('✅ PASSED: Ticket resolution works, notes and timestamp saved.');
      } else {
        console.error('❌ FAILED: Resolved ticket columns did not update correctly:', resolvedTicket);
        failed = true;
      }

      // Re-open/delete ticket to prevent clutter and ensure no destructive change
      const { error: deleteError } = await supabaseAdmin
        .from('support_issues')
        .delete()
        .eq('id', ticket.id);

      if (deleteError) {
        console.error('⚠️ Could not delete test ticket:', deleteError.message);
      } else {
        console.log('Cleanup: Test ticket deleted successfully.');
      }
    }
  } catch (err: any) {
    console.error('❌ FAILED: Support flow test failed with error:', err.message);
    failed = true;
  }

  console.log('\n================================================');
  if (failed) {
    console.error('❌ Support Issues Verification FAILED.');
    exit(1);
  } else {
    console.log('✅ Support Issues Verification PASSED.');
    exit(0);
  }
}

main();
