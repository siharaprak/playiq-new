const fs = require('fs');
const path = require('path');

async function main() {
  const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  });

  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const parentEmail = 'jimboyaquino12@gmail.com';

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }

  const user = users.find(u => u.email === parentEmail);
  if (!user) {
    console.log(`User not found: ${parentEmail}`);
    return;
  }

  console.log(`Checking factors for user ${parentEmail} (${user.id})...`);
  
  // Get user details
  const { data: { user: fullUser }, error: getError } = await supabase.auth.admin.getUserById(user.id);
  if (getError) {
    console.error('Error getting user details:', getError);
    return;
  }

  const factors = fullUser.factors || [];
  console.log(`Found ${factors.length} MFA factors.`);

  for (const factor of factors) {
    console.log(`Deleting factor ${factor.id} (${factor.factor_type})...`);
    const { error: deleteError } = await supabase.auth.admin._deleteFactor({
      userId: user.id,
      id: factor.id
    });

    if (deleteError) {
      console.error(`Failed to delete factor:`, deleteError.message);
    } else {
      console.log(`Successfully deleted factor ${factor.id}.`);
    }
  }
}

main();
