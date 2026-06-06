import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Parse .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    // Strip quotes if any
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
  console.log("Checking database schema for discussions...");
  
  // Let's do a select limit 1 on discussion_topics
  const { data: topics, error: topicsErr } = await supabase
    .from('discussion_topics')
    .select('*')
    .limit(1);
    
  if (topicsErr) {
    console.error("Error fetching discussion_topics:", topicsErr);
  } else {
    console.log("discussion_topics sample / keys:", Object.keys(topics[0] || {}));
    if (topics[0]) console.log("Topic sample data:", topics[0]);
  }

  // Let's check replies
  const { data: replies, error: repliesErr } = await supabase
    .from('discussion_replies')
    .select('*')
    .limit(1);
    
  if (repliesErr) {
    console.error("Error fetching discussion_replies:", repliesErr);
  } else {
    console.log("discussion_replies sample / keys:", Object.keys(replies[0] || {}));
    if (replies[0]) console.log("Reply sample data:", replies[0]);
  }

  // Let's check if there is a discussion_reports table
  const { data: reports, error: reportsErr } = await supabase
    .from('discussion_reports')
    .select('*')
    .limit(1);
    
  if (reportsErr) {
    console.error("Error fetching discussion_reports:", reportsErr);
  } else {
    console.log("discussion_reports sample / keys:", Object.keys(reports[0] || {}));
  }
}

main().catch(console.error);
