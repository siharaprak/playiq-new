import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { supabaseAdmin } from '../src/lib/supabase/admin';

async function main() {
  console.log('Checking topics count per category...');
  const { data: categories, error: catError } = await supabaseAdmin
    .from('discussion_categories')
    .select('id, title, slug');

  if (catError || !categories) {
    console.error('Error fetching categories:', catError);
    return;
  }

  for (const cat of categories) {
    const { count, error } = await supabaseAdmin
      .from('discussion_topics')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', cat.id);
    
    if (error) {
      console.error(`Error fetching topics count for ${cat.slug}:`, error.message);
    } else {
      console.log(`Category: "${cat.title}" (slug: "${cat.slug}", id: "${cat.id}") -> Topics count: ${count}`);
    }
  }
}

main();
