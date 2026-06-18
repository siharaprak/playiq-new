const { submitBetaApplication } = require('../src/app/(public)/beta/actions');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function runTest() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, serviceKey);

  console.log('--- TEST 1: Submitting with INVALID promo code ---');
  const invalidResult = await submitBetaApplication({
    parentFullName: 'Test Parent Invalid',
    emailAddress: 'test-promo-invalid@test.com',
    childAge: 'under_13',
    shippingZipCode: '90210',
    promoCode: 'WRONG_CODE'
  });
  console.log('Invalid code result:', invalidResult);

  console.log('\n--- TEST 2: Submitting with VALID promo code ---');
  const validResult = await submitBetaApplication({
    parentFullName: 'Test Parent Valid',
    emailAddress: 'test-promo-valid@test.com',
    childAge: 'under_13',
    shippingZipCode: '90210',
    promoCode: 'PLAYIQ2025'
  });
  console.log('Valid code result:', validResult);

  // Clean up database records
  console.log('\nCleaning up test applications...');
  const { error: deleteError } = await supabase
    .from('beta_applications')
    .delete()
    .in('email', ['test-promo-invalid@test.com', 'test-promo-valid@test.com']);

  if (deleteError) {
    console.error('Error during cleanup:', deleteError);
  } else {
    console.log('Cleanup successful.');
  }
}

runTest();
