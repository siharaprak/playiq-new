const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function verify() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // Client 1: Only for signing up
  const client1 = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });
  
  const email = `test-heal-${Date.now()}@test.com`;
  const password = 'Password123!';
  const name = 'Test Healed User';
  
  console.log(`Signing up ${email}...`);
  const { data: authData, error: signupError } = await client1.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name
      }
    }
  });
  
  if (signupError) {
    console.error('Signup error:', signupError);
    return;
  }
  
  const userId = authData.user.id;
  
  // Client 2: Separate clean admin client for insert
  const client2 = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });
  
  console.log('Inserting profile via clean client...');
  const { data: newProfile, error: insertError } = await client2
    .from('profiles')
    .insert({
      id: userId,
      email: email,
      full_name: name,
      role: 'parent',
      status: 'active'
    })
    .select()
    .single();
    
  if (insertError) {
    console.error('Insert error:', insertError);
  } else {
    console.log('Insert succeeded! Profile:', newProfile);
  }
  
  // Clean up
  await client2.auth.admin.deleteUser(userId);
}

verify();
