'use server';

import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { sendApprenticeProvisionedNotifications } from '@/lib/server/notifications';

export async function provisionApprenticeAction(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const ageBand = formData.get('ageBand') as string;

  if (!username || !password || !name) {
    return { error: 'Name, Username, and Password are all required.' };
  }

  if (!['under_13', '13_14', '15_17'].includes(ageBand)) {
    return { error: "Please select your child's age." };
  }

  // Phase 3B: If under-13, require parental consent confirmations
  const consentCollection = formData.get('consentCollection') === 'on' || formData.get('consentCollection') === 'true';
  const consentAI = formData.get('consentAI') === 'on' || formData.get('consentAI') === 'true';
  const consentNotice = formData.get('consentNotice') === 'on' || formData.get('consentNotice') === 'true';

  if (ageBand === 'under_13' && (!consentCollection || !consentAI || !consentNotice)) {
    return {
      error: 'Please review and accept all parental consent acknowledgments before adding a child under 13.',
    };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  if (!username.includes('@')) {
    if (username.trim() !== username) {
      return { error: 'Username handle cannot start or end with spaces.' };
    }
    if (/\s/.test(username)) {
      return { error: 'Username handle cannot contain spaces. Use underscores (_) or hyphens (-) instead.' };
    }
    if (!/^[a-zA-Z0-9_\-]+$/.test(username)) {
      return { error: 'Username handle can only contain letters, numbers, underscores, and hyphens.' };
    }
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

  // Check parent session & email verification first
  const parentClient = await createServerClient();
  const { data: parentSession } = await parentClient.auth.getUser();

  if (!parentSession.user) {
    return { error: 'Parent session expired during provisioning. Please log in again.' };
  }

  // Phase 3A: Enforce parent email verification before allowing child account creation
  if (!parentSession.user.email_confirmed_at) {
    return {
      error: 'Please verify your parent email address before setting up an apprentice account. Check your inbox for the confirmation link, or click resend.',
      unverified: true,
      email: parentSession.user.email,
    };
  }

  // Step 1: Create the Supabase auth user for student
  const { data: userData, error: signUpError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Skip email verification for provisioned apprentice accounts
    user_metadata: { full_name: name }
  });

  if (signUpError || !userData.user) {
    if (signUpError?.message?.includes('already been registered')) {
      return { error: `That username "${username}" is already taken. Please choose another.` };
    }
    return { error: signUpError?.message || 'Failed to create apprentice account.' };
  }

  const studentId = userData.user.id;

  // Step 2: Query the parent's beta application to find the target child age band
  const { data: betaApp } = parentSession.user?.email ? await adminClient
    .from('beta_applications')
    .select('child_age_band')
    .ilike('email', parentSession.user.email.trim())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle() : { data: null };

  let initialLevel: 'elementary' | 'middle' | 'high' | 'adult' = 'high';
  const effectiveBand = ageBand || betaApp?.child_age_band;
  if (effectiveBand) {
    if (effectiveBand === 'under_13') initialLevel = 'elementary';
    else if (effectiveBand === '13_14') initialLevel = 'middle';
    else if (effectiveBand === '15_17') initialLevel = 'high';
    else if (effectiveBand === 'over_17') initialLevel = 'adult';
  }

  // Step 3: Explicitly set profile role to 'student', age band, and consent status
  const { error: profileError } = await adminClient
    .from('profiles')
    .upsert({
      id: studentId,
      full_name: name,
      email: email,
      role: 'student',
      learning_level: initialLevel,
      age_band: ageBand,
      consent_status: 'verified',
    }, { onConflict: 'id' });

  if (profileError) {
    await adminClient.auth.admin.deleteUser(studentId);
    return { error: 'Failed to configure apprentice profile. Please try again.' };
  }

  // Step 4: Record parental consent record
  const { error: consentError } = await adminClient
    .from('parental_consents')
    .insert({
      parent_id: parentSession.user.id,
      student_id: studentId,
      policy_version: '2026-10-06',
      consent_text: 'Direct Parental Consent: Guardian authorized collection of student educational progress, project artifact photos, and AI-assisted tutoring under PlayIQ Children Privacy Policy.',
      verification_method: 'parent_verified_email',
      verification_status: 'verified',
      collection_consent: true,
      ai_processing_consent: true,
      third_party_disclosure_consent: true,
    });

  if (consentError) {
    console.error('Failed to log parental consent:', consentError);
  }

  // Step 5: Link parent → student
  const { error: linkError } = await adminClient
    .from('parent_child_links')
    .insert({
      parent_id: parentSession.user.id,
      student_id: studentId,
    });

  if (linkError) {
    console.error('Link error:', linkError);
    return { error: 'Apprentice account created but could not link to your account. Please contact support.' };
  }

  // Trigger non-blocking user confirmation + admin alerts
  const parentName = parentSession.user?.user_metadata?.full_name || 'Parent';
  const parentEmail = parentSession.user?.email || '';

  sendApprenticeProvisionedNotifications({
    parentName,
    parentEmail,
    apprenticeName: name,
    username,
    learningLevel: initialLevel,
  }).catch(err => console.error('Error dispatching apprentice notifications:', err));

  // All done — redirect to parent home showing success
  redirect('/parent/home?provisioned=1');
}

export async function resendParentVerificationEmailAction() {
  const parentClient = await createServerClient();
  const { data: parentSession } = await parentClient.auth.getUser();

  if (!parentSession.user || !parentSession.user.email) {
    return { error: 'You must be logged in to resend verification email.' };
  }

  if (parentSession.user.email_confirmed_at) {
    return { success: true, message: 'Your email is already verified.' };
  }

  const { error } = await parentClient.auth.resend({
    type: 'signup',
    email: parentSession.user.email,
  });

  if (error) {
    console.error('Error resending parent verification email:', error);
    return { error: error.message || 'Failed to resend verification email.' };
  }

  return { success: true, message: `Verification link resent to ${parentSession.user.email}. Please check your inbox.` };
}
