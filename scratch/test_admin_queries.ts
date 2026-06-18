import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceKey);

  console.log('Testing admin dashboard queries...');

  try {
    console.log('1. Querying profiles for admin check...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .limit(1);
    if (profileError) console.error('❌ profiles error:', profileError);
    else console.log('✅ profiles success:', profile);

    console.log('2. Querying beta_applications...');
    const { data: apps, error: appsError } = await supabase
      .from('beta_applications')
      .select('id, parent_full_name, email, child_age_band, shipping_zip_code, status, created_at')
      .limit(5);
    if (appsError) console.error('❌ beta_applications error:', appsError);
    else console.log('✅ beta_applications success:', apps);

    console.log('3. Querying beta_applications statuses...');
    const { data: allApps, error: statusError } = await supabase
      .from('beta_applications')
      .select('status');
    if (statusError) console.error('❌ beta_applications status error:', statusError);
    else console.log('✅ beta_applications status success:', allApps?.length);

    console.log('4. Querying support_issues...');
    const { count: openTicketsCount, error: ticketError } = await supabase
      .from('support_issues')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'open');
    if (ticketError) console.error('❌ support_issues error:', ticketError);
    else console.log('✅ support_issues success:', openTicketsCount);

    console.log('5. Querying tutor_profiles...');
    const { count: totalTutorsCount, error: tutorError } = await supabase
      .from('tutor_profiles')
      .select('id', { count: 'exact', head: true });
    if (tutorError) console.error('❌ tutor_profiles error:', tutorError);
    else console.log('✅ tutor_profiles success:', totalTutorsCount);

    console.log('6. Querying assistant_profiles...');
    const { count: totalAssistantsCount, error: assistantError } = await supabase
      .from('assistant_profiles')
      .select('id', { count: 'exact', head: true });
    if (assistantError) console.error('❌ assistant_profiles error:', assistantError);
    else console.log('✅ assistant_profiles success:', totalAssistantsCount);

    console.log('7. Querying discussion_reports...');
    const { count: reportsCount, error: reportError } = await supabase
      .from('discussion_reports')
      .select('id', { count: 'exact', head: true });
    if (reportError) console.error('❌ discussion_reports error:', reportError);
    else console.log('✅ discussion_reports success:', reportsCount);

  } catch (err) {
    console.error('Fatal crash testing queries:', err);
  }
}

main().catch(console.error);
