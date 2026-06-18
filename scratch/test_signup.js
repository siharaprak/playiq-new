const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  const supabase = createClient(supabaseUrl, serviceKey);
  
  const email = `test-${Date.now()}@test.com`;
  const password = 'Password123!';
  const name = 'Test User Signup';
  
  console.log(`Signing up ${email}...`);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name
      }
    }
  });
  
  if (error) {
    console.error('Signup error:', error);
    return;
  }
  
  const userId = data.user.id;
  console.log('Signup succeeded. User ID:', userId);
  
  // Wait 1 second
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('Checking if profile was created...');
  const { data: profile, error: pError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
    
  if (pError) {
    console.error('Error fetching profile:', pError);
  } else {
    console.log('Profile:', profile);
  }
  
  // Clean up
  console.log('Cleaning up user...');
  await supabase.auth.admin.deleteUser(userId);
  console.log('Done.');
}

run();
