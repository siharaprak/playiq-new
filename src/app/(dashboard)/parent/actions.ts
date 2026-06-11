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

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: 'Server configuration error. Please contact support.' };
  }

  // Admin client — bypasses RLS, won't log out the parent
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Accept username handle or real email
  const email = username.includes('@') ? username : `${username}@student.playiq.dev`;

  // Step 1: Create the Supabase auth user
  const { data: userData, error: signUpError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Skip email verification for provisioned accounts
    user_metadata: { full_name: name }
  });

  if (signUpError || !userData.user) {
    // Handle duplicate email gracefully
    if (signUpError?.message?.includes('already been registered')) {
      return { error: `That username "${username}" is already taken. Please choose another.` };
    }
    return { error: signUpError?.message || 'Failed to create apprentice account.' };
  }

  const studentId = userData.user.id;

  // Step 2: Query the parent's beta application to find the target child age band
  const parentClient = await createServerClient();
  const { data: parentSession } = await parentClient.auth.getUser();

  if (!parentSession.user) {
    return { error: 'Parent session expired during provisioning. Please log in again.' };
  }

  const { data: betaApp } = await adminClient
    .from('beta_applications')
    .select('child_age_band')
    .eq('email', parentSession.user.email)
    .maybeSingle();

  // Map the child age band to learning level
  let initialLevel: 'elementary' | 'middle' | 'high' | 'adult' = 'high';
  if (betaApp?.child_age_band) {
    if (betaApp.child_age_band === 'under_13') initialLevel = 'elementary';
    else if (betaApp.child_age_band === '13_14') initialLevel = 'middle';
    else if (betaApp.child_age_band === '15_17') initialLevel = 'high';
    else if (betaApp.child_age_band === 'over_17') initialLevel = 'adult';
  }

  // Step 3: Explicitly set profile role to 'student' and save the learning level
  // The DB trigger may create the profile but default to 'parent' — we override it here.
  const { error: profileError } = await adminClient
    .from('profiles')
    .upsert({
      id: studentId,
      full_name: name,
      email: email,
      role: 'student',   // ← Critical: this is what grants access to /student/home and modules
      learning_level: initialLevel, // ← Initialize based on age band select
    }, { onConflict: 'id' });

  if (profileError) {
    // Clean up the auth user if profile setup fails
    await adminClient.auth.admin.deleteUser(studentId);
    return { error: 'Failed to configure apprentice profile. Please try again.' };
  }

  // Step 4: Link parent → student
  const { error: linkError } = await adminClient
    .from('parent_child_links')
    .insert({
      parent_id: parentSession.user.id,
      student_id: studentId,
    });

  if (linkError) {
    // Don't fail silently — student exists but isn't linked yet
    console.error('Link error:', linkError);
    return { error: 'Apprentice account created but could not link to your account. Please contact support.' };
  }

  // All done — redirect to parent home showing success
  redirect('/parent/home?provisioned=1');
}
