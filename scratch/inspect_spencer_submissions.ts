import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const studentId = '71285485-21d2-4be0-ad3a-2c9675d07089'; // Spencer's ID
  
  // 1. Fetch all modules for ID to order mapping
  const { data: modules } = await supabase
    .from('modules')
    .select('id, title, order_num')
    .order('order_num', { ascending: true });

  const modMap = new Map();
  modules?.forEach((m: any) => modMap.set(m.id, m));

  // 2. Fetch all Spencer's submissions
  const { data: submissions, error } = await supabase
    .from('assessment_submissions')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching submissions:', error);
    return;
  }

  console.log(`Found ${submissions.length} submissions for Spencer.\n`);

  // Count by module and type
  const counts: Record<string, Record<string, number>> = {};
  submissions.forEach((s: any) => {
    const mod = modMap.get(s.module_id);
    const modLabel = mod ? `Module ${mod.order_num}: ${mod.title}` : `Unknown module (${s.module_id})`;
    if (!counts[modLabel]) counts[modLabel] = {};
    counts[modLabel][s.assessment_type] = (counts[modLabel][s.assessment_type] || 0) + 1;
  });

  console.log('Submissions Counts:');
  console.log(JSON.stringify(counts, null, 2));

  console.log('\nSubmissions list with details:');
  submissions.forEach((s: any, index: number) => {
    const mod = modMap.get(s.module_id);
    const modLabel = mod ? `Mod ${mod.order_num}` : `Mod Unknown`;
    
    // get sample content
    let info = '';
    if (s.assessment_type === 'teach_back') {
      const text = s.submission_payload?.text || '';
      info = `"${text.substring(0, 50).replace(/\n/g, ' ')}..."`;
    } else if (s.assessment_type === 'mini_check') {
      info = JSON.stringify(s.submission_payload);
    }
    
    console.log(`${String(index + 1).padStart(3, ' ')}. ${s.created_at} | ${modLabel} | ${s.assessment_type.padEnd(12)} | Pass: ${s.pass_status} | node_id: ${s.node_id ? s.node_id.substring(0, 8) : 'null'} | ${info}`);
  });
}

run();
