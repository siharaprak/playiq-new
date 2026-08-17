import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Parse .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const MODULE_IDS = {
  1: 'a0b94091-62d9-4ac9-8f0a-86c2e3650228',
  2: '1d711232-e906-468c-9f32-ef8d0c7aa0b9',
  3: 'fe87ea18-8042-43e6-9cc3-da9117590809',
  4: 'aeaf7949-9bc3-44a1-b481-2d1c02106708',
  5: 'ab18311b-17d7-49af-918a-4a6d7723ced6',
  6: '03fd0323-1ddd-4f9e-8bb0-8b92d662921c',
  7: 'cdc1916e-cc2f-42b1-b90a-2d07182408cb',
  8: 'b097c132-f521-441c-83b7-2824b7a37622',
  9: '7ce93ee8-20ef-4531-a516-8fae1b705a09',
  10: '93217a54-63f1-4ce4-b955-16eb86e2f84c',
  11: 'c1f94091-62d9-4ac9-8f0a-86c2e3650238',
};

const MODULE_ID_TO_NUM = {};
for (const [num, id] of Object.entries(MODULE_IDS)) {
  MODULE_ID_TO_NUM[id] = Number(num);
}

async function main() {
  // 1. Get all students
  const { data: profiles, error: profileErr } = await supabase
    .from('profiles')
    .select('id, full_name, username, role')
    .eq('role', 'student');

  if (profileErr) { console.error('Error fetching profiles:', profileErr); return; }
  console.log(`\n=== Found ${profiles.length} student profiles ===\n`);

  // 2. Get all node progress (determines which modules students have worked through)
  const { data: progress, error: progressErr } = await supabase
    .from('student_node_progress')
    .select('student_id, module_id, node_id, lesson_completed, activity_completed');

  if (progressErr) { console.error('Error fetching progress:', progressErr); return; }

  // 3. Get all module feedback
  const { data: feedback, error: feedbackErr } = await supabase
    .from('module_feedback')
    .select('student_id, module_id, rating, feedback_text, created_at, updated_at');

  if (feedbackErr) { console.error('Error fetching feedback:', feedbackErr); return; }

  console.log(`Total node progress records: ${progress.length}`);
  console.log(`Total feedback records: ${feedback.length}\n`);

  // 4. Group progress by student -> module
  const progressByUser = {};
  for (const p of progress) {
    if (!progressByUser[p.student_id]) progressByUser[p.student_id] = {};
    if (!progressByUser[p.student_id][p.module_id]) progressByUser[p.student_id][p.module_id] = [];
    progressByUser[p.student_id][p.module_id].push(p);
  }

  // 5. Group feedback by student -> module
  const feedbackByUser = {};
  for (const f of feedback) {
    if (!feedbackByUser[f.student_id]) feedbackByUser[f.student_id] = {};
    feedbackByUser[f.student_id][f.module_id] = f;
  }

  // 6. Count total nodes per module (from curriculum or from all progress data)
  const nodesPerModule = {};
  for (const p of progress) {
    const key = p.module_id;
    if (!nodesPerModule[key]) nodesPerModule[key] = new Set();
    nodesPerModule[key].add(p.node_id);
  }

  // 7. Analyze each student
  console.log('=== STUDENT FEEDBACK GAP ANALYSIS ===\n');

  for (const profile of profiles) {
    const userProgress = progressByUser[profile.id] || {};
    const userFeedback = feedbackByUser[profile.id] || {};
    const name = profile.full_name || profile.username || 'Unknown';
    const isLucas = name.toLowerCase().includes('lucas');

    const moduleNums = Object.keys(userProgress)
      .map(modId => MODULE_ID_TO_NUM[modId])
      .filter(n => n !== undefined)
      .sort((a, b) => a - b);

    if (moduleNums.length === 0 && !isLucas) continue;

    const highestModule = moduleNums.length > 0 ? Math.max(...moduleNums) : 0;

    const rows = [];
    let missingCount = 0;

    for (const modNum of moduleNums) {
      const modId = MODULE_IDS[modNum];
      const nodes = userProgress[modId] || [];
      const completedNodes = nodes.filter(n => n.lesson_completed);
      const totalNodesForModule = nodesPerModule[modId]?.size || nodes.length;
      const completionPct = totalNodesForModule > 0 ? Math.round((completedNodes.length / totalNodesForModule) * 100) : 0;

      const hasFeedback = !!userFeedback[modId];
      if (!hasFeedback && completionPct >= 50) missingCount++;

      rows.push({
        modNum,
        nodesCompleted: completedNodes.length,
        totalNodes: totalNodesForModule,
        completionPct,
        hasFeedback,
        rating: hasFeedback ? userFeedback[modId].rating : null,
      });
    }

    // Also check for feedback on modules where there's no progress (shouldn't happen but check)
    for (const modId of Object.keys(userFeedback)) {
      const modNum = MODULE_ID_TO_NUM[modId];
      if (modNum && !moduleNums.includes(modNum)) {
        rows.push({
          modNum,
          nodesCompleted: 0,
          totalNodes: 0,
          completionPct: 0,
          hasFeedback: true,
          rating: userFeedback[modId].rating,
          note: '⚠️ feedback exists but no progress'
        });
      }
    }

    rows.sort((a, b) => a.modNum - b.modNum);

    const flag = isLucas ? ' ⚠️  <<< LUCAS >>>' : '';
    const urgency = missingCount > 0 ? ` [${missingCount} MISSING FEEDBACK]` : '';

    console.log(`\n${'─'.repeat(70)}`);
    console.log(`👤 ${name}${flag}${urgency}`);
    console.log(`   Highest module reached: Module ${highestModule}`);
    console.log(`   ${'Module'.padEnd(10)} ${'Nodes Done'.padEnd(14)} ${'Completion'.padEnd(14)} ${'Feedback'.padEnd(14)} ${'Rating'}`);
    console.log(`   ${'─'.repeat(60)}`);

    for (const r of rows) {
      const modLabel = r.modNum === 11 ? 'Capstone' : `Mod ${r.modNum}`;
      const nodeStr = `${r.nodesCompleted}/${r.totalNodes}`;
      const pctStr = `${r.completionPct}%`;
      let fbStr;
      if (r.hasFeedback) {
        fbStr = '✅ Yes';
      } else if (r.completionPct >= 50) {
        fbStr = '❌ MISSING';
      } else {
        fbStr = '⏳ In progress';
      }
      const ratingStr = r.rating !== null ? `${r.rating}/5` : '-';
      const noteStr = r.note ? `  ${r.note}` : '';
      console.log(`   ${modLabel.padEnd(10)} ${nodeStr.padEnd(14)} ${pctStr.padEnd(14)} ${fbStr.padEnd(14)} ${ratingStr}${noteStr}`);
    }
  }

  // 8. Summary: All feedback entries
  console.log(`\n\n${'='.repeat(70)}`);
  console.log('=== ALL MODULE_FEEDBACK ENTRIES ===');
  console.log(`${'='.repeat(70)}`);
  console.log(`\n${feedback.length} total entries:\n`);

  for (const f of feedback) {
    const profile = profiles.find(p => p.id === f.student_id);
    const name = profile ? (profile.full_name || profile.username || 'Unknown') : `Unknown (${f.student_id.slice(0,8)}...)`;
    const modNum = MODULE_ID_TO_NUM[f.module_id];
    const modLabel = modNum === 11 ? 'Capstone' : modNum ? `Module ${modNum}` : f.module_id.slice(0,8);
    console.log(`  ${name.padEnd(22)} ${modLabel.padEnd(12)} Rating: ${f.rating}  Created: ${f.created_at?.slice(0,10)}`);
  }

  // 9. Check the completion page flow — is the feedback form rendering before the "next module" link?
  console.log(`\n\n${'='.repeat(70)}`);
  console.log('=== POTENTIAL ROOT CAUSE ANALYSIS ===');
  console.log(`${'='.repeat(70)}`);
  console.log(`
Key things to check:
1. Students may be skipping the completion page entirely (navigating directly to next module)
2. The completion page gating may redirect if lesson nodes aren't fully marked complete
3. RLS policies on module_feedback may be blocking inserts for some students
4. The upsert's onConflict='student_id,module_id' may fail if there's no unique constraint
`);

  // 10. Verify RLS isn't blocking — try to read module_feedback for a specific student
  // (We're using service role, so we can see everything. But let's check the table structure.)
  const { data: sampleFb, error: sampleErr } = await supabase
    .from('module_feedback')
    .select('*')
    .limit(1);
  
  if (sampleErr) {
    console.log('⚠️  Error reading module_feedback:', sampleErr);
  } else if (sampleFb.length > 0) {
    console.log('module_feedback table columns:', Object.keys(sampleFb[0]).join(', '));
  } else {
    console.log('⚠️  module_feedback table is EMPTY!');
  }
}

main().catch(console.error);
