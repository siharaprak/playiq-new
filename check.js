const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://scdbhpcnqihaswaijptx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZGJocGNucWloYXN3YWlqcHR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg2Njk5NywiZXhwIjoyMDkxNDQyOTk3fQ.mXbhQcLrRUC4oKVcswNdAFBDxJs9ZLsGWsT6MjZ3Jos";
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: users } = await supabase.from('profiles').select('*').eq('email', 'manolitojraquino0416@gmail.com');
  console.log('Parent Profile:', users);
  if(users && users[0]) {
    const { data: links } = await supabase.from('parent_child_links').select('*').eq('parent_id', users[0].id);
    console.log('Links:', links);
  }
}
run();
