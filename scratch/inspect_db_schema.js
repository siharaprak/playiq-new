import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data: cols, error } = await supabase.rpc('inspect_table_cols', { table_name: 'student_node_progress' });
  if (error) {
    // If RPC doesn't exist, query via custom select or postgres functions if we can, or just query a sample row.
    console.log("RPC inspect_table_cols failed, let's select a sample row from student_node_progress:");
    const { data: rows, error: rErr } = await supabase
      .from('student_node_progress')
      .select('*')
      .limit(1);
    if (rErr) {
      console.error(rErr);
    } else {
      console.log("Sample row keys and types:");
      if (rows && rows.length > 0) {
        Object.keys(rows[0]).forEach(k => {
          console.log(`- ${k}: value=${rows[0][k]}, type=${typeof rows[0][k]}`);
        });
      } else {
        console.log("No rows found.");
      }
    }
  } else {
    console.log(cols);
  }
}

main().catch(console.error);
