const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://example.com', 'mockkey');
console.log('Function signature of _deleteFactor:');
console.log(supabase.auth.admin._deleteFactor.toString());
