import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { supabaseAdmin } from '../src/lib/supabase/admin';

async function main() {
  // Find topics in old general-discussion
  const oldGeneralId = '8133e910-425e-4371-8f83-59ab3dcc1a4d';
  const newGeneralId = '612be41c-0064-481c-b371-f3f41a1e956b';
  const oldAiId = 'e9770c3a-94bc-4b01-bdbc-1f1a56144102';
  const newAiId = '753e4a4e-97f6-46f1-a442-da07bc1538bc';

  console.log('--- Topics in old general-discussion ---');
  const { data: oldTopics, error: oldErr } = await supabaseAdmin
    .from('discussion_topics')
    .select('id, title, body, author_id');
  if (oldErr) console.error(oldErr);
  else console.log(JSON.stringify(oldTopics, null, 2));

  // Let's migrate the topics from oldGeneralId to newGeneralId
  console.log('\n--- Migrating topics in old general-discussion to new general ---');
  const { data: updatedTopics, error: updateErr } = await supabaseAdmin
    .from('discussion_topics')
    .update({ category_id: newGeneralId })
    .eq('category_id', oldGeneralId)
    .select();
  
  if (updateErr) {
    console.error('Update error:', updateErr);
  } else {
    console.log(`Migrated ${updatedTopics?.length || 0} topics.`);
  }

  // Set is_active = false (or delete) the old categories
  console.log('\n--- Deactivating old duplicate categories ---');
  const { data: deactivated, error: deacErr } = await supabaseAdmin
    .from('discussion_categories')
    .update({ is_active: false })
    .in('id', [oldGeneralId, oldAiId])
    .select();
  
  if (deacErr) {
    console.error('Deactivation error:', deacErr);
  } else {
    console.log('Successfully deactivated:', deactivated.map(c => c.slug));
  }
}

main();
