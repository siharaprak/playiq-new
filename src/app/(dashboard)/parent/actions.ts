'use server';

import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function provisionApprenticeAction(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password || !name) {
    return { error: 'Name, Username, and Password are all required.' };
  }

  // To prevent logging the parent out, we use an Admin Service Client
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: 'Missing SUPABASE_SERVICE_ROLE_KEY in .env.local to provision sub-accounts!' };
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // Fake an email if they just input a username handle for their kid
  const email = username.includes('@') ? username : `${username}@student.playiq.dev`;

  // Create the authentic sub-account securely
  const { data: userData, error: signUpError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: name,
      role: 'student'
    }
  });

  if (signUpError || !userData.user) {
    return { error: signUpError?.message || 'Failed to create apprentice account.' };
  }

  // Get the current logged-in parent
  const parentClient = await createServerClient();
  const { data: parentSession } = await parentClient.auth.getUser();

  if (!parentSession.user) {
    return { error: 'Parent authentication lost during provisioning.' };
  }

  // Link them locally bypassing RLS just in case (using adminClient)
  const { error: linkError } = await adminClient
    .from('parent_child_links')
    .insert({
      parent_id: parentSession.user.id,
      student_id: userData.user.id
    });

  if (linkError) {
    return { error: 'Apprentice account created, but linking failed.' };
  }

  // Roster logic done!
  redirect('/parent/home');
}
