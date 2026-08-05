import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceKey);

  // 1. Fetch beta_applications
  const { data: apps } = await supabase
    .from('beta_applications')
    .select('id, parent_full_name, email, child_age_band, shipping_zip_code, status, created_at');

  const appEmails = (apps || []).map((a) => a.email.toLowerCase());

  // 2. Fetch profiles for these emails (or all parent profiles)
  const { data: parentProfiles } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('role', 'parent');

  // Map parent profile id to lowercase email
  const parentIdToEmail: Record<string, string> = {};
  const emailToParentId: Record<string, string> = {};
  for (const p of parentProfiles || []) {
    if (p.email) {
      const em = p.email.toLowerCase();
      parentIdToEmail[p.id] = em;
      emailToParentId[em] = p.id;
    }
  }

  // 3. Fetch parent_child_links
  const { data: links } = await supabase
    .from('parent_child_links')
    .select('parent_id, student_id');

  // Fetch all student profiles
  const studentIds = Array.from(new Set((links || []).map((l) => l.student_id)));
  const { data: studentProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .in('id', studentIds);

  const studentMap: Record<string, { id: string; name: string; email: string }> = {};
  for (const s of studentProfiles || []) {
    studentMap[s.id] = { id: s.id, name: s.full_name || 'Student', email: s.email };
  }

  // Build parentEmail -> student list map
  const emailToStudentsMap: Record<string, { name: string; email: string }[]> = {};
  for (const link of links || []) {
    const parentEmail = parentIdToEmail[link.parent_id];
    if (parentEmail) {
      if (!emailToStudentsMap[parentEmail]) emailToStudentsMap[parentEmail] = [];
      const st = studentMap[link.student_id];
      if (st) emailToStudentsMap[parentEmail].push(st);
    }
  }

  console.log('App Email to Students Mapping:');
  for (const app of apps || []) {
    const em = app.email.toLowerCase();
    const students = emailToStudentsMap[em] || [];
    console.log(`- App: ${app.parent_full_name} (${app.email}) -> ${students.length} students:`, students.map(s => s.name).join(', ') || 'None enrolled yet');
  }
}

main().catch(console.error);
