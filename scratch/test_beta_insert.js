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
      if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      env[key] = value.trim();
    }
  });

  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('Testing insert on beta_applications...');
  const { data, error } = await supabase
    .from('beta_applications')
    .insert({
      parent_full_name: 'Test Promo User',
      email: 'test-promo-run@test.com',
      child_age_band: '13_14',
      shipping_zip_code: '12345',
      status: 'fulfilled_promo',
      source: 'web_form'
    })
    .select();

  console.log('Inserted Data:', data);
  console.log('Insertion Error:', error);

  if (data && data.length > 0) {
    console.log('Cleaning up...');
    const { error: deleteError } = await supabase
      .from('beta_applications')
      .delete()
      .eq('email', 'test-promo-run@test.com');
    console.log('Delete Error:', deleteError);
  }
}

main().catch(console.error);
