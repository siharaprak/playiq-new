import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // 1. Create Parent Admin
  const parentEmail = 'admin@playiq.dev';
  const parentPassword = 'playiq_secret_admin';
  const { data: parentData, error: parentErr } = await supabase.auth.admin.createUser({
    email: parentEmail,
    password: parentPassword,
    email_confirm: true,
    user_metadata: { full_name: 'System Admin', role: 'parent' }
  });

  if (parentErr && !parentErr.message.includes('already exists')) {
     return NextResponse.json({ error: 'Parent creation failed', msg: parentErr.message });
  }

  // 2. Create Student Admin (Apprentice)
  const studentEmail = 'apprentice@playiq.dev';
  const studentPassword = 'playiq_secret_student';
  const { data: studentData, error: studentErr } = await supabase.auth.admin.createUser({
    email: studentEmail,
    password: studentPassword,
    email_confirm: true,
    user_metadata: { full_name: 'Test Apprentice', role: 'student' }
  });

  if (studentErr && !studentErr.message.includes('already exists')) {
     return NextResponse.json({ error: 'Student creation failed', msg: studentErr.message });
  }

  const pId = parentData?.user?.id;
  const sId = studentData?.user?.id;

  if (pId && sId) {
     // Link them securely
     await supabase.from('parent_child_links').upsert({
       parent_id: pId,
       student_id: sId
     });
  }

  return NextResponse.json({
    success: true,
    message: "Admin testing accounts injected successfully. You can now log into the frontend.",
    credentials: {
       parent: { email: parentEmail, password: parentPassword },
       student: { email: studentEmail, password: studentPassword }
    }
  });
}
