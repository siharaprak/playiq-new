const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = 'c:/Users/Iris/OneDrive/Work/sienviagencyclientdashboard/.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx !== -1 && !line.trim().startsWith('#')) {
    const k = line.substring(0, idx).trim();
    let v = line.substring(idx + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[k] = v;
  }
});

const url = env['PLAYIQ_SUPABASE_URL'];
const key = env['PLAYIQ_SUPABASE_SERVICE_ROLE_KEY'];

console.log('PlayIQ URL:', url);
if (!url || !key) {
  console.error('Missing PlayIQ credentials in sienviagencyclientdashboard/.env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
  try {
    const { data: apps, error } = await supabase.from('beta_applications').select('*');
    if (error) {
      console.error('Error fetching beta_applications:', error.message);
    } else {
      console.log('Beta applications total count:', apps.length);
      console.log('Status breakdown:', apps.reduce((acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
      }, {}));
      console.log('Source breakdown:', apps.reduce((acc, a) => {
        acc[a.source || 'null'] = (acc[a.source || 'null'] || 0) + 1;
        return acc;
      }, {}));
      if (apps.length > 0) {
        console.log('First application record:', apps[0]);
      }
    }
  } catch (err) {
    console.error('Exception:', err.message);
  }
}

run();
