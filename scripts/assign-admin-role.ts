import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  const targetEmail = 'teamsienvi@gmail.com';
  console.log(`Checking status for ${targetEmail}...`);

  // 1. List auth users
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing auth users:', listError);
  }

  let authUser = users?.find(u => u.email?.toLowerCase() === targetEmail.toLowerCase());
  console.log('Auth user found:', authUser ? { id: authUser.id, email: authUser.email, app_metadata: authUser.app_metadata, user_metadata: authUser.user_metadata } : 'NOT FOUND');

  // If auth user doesn't exist, we can check or create
  if (!authUser) {
    console.log(`User ${targetEmail} not found in auth.users. Creating user or waiting for signup...`);
  }

  // 2. Query profiles
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('email', targetEmail)
    .maybeSingle();

  if (profileError) {
    console.error('Error querying profiles:', profileError);
  } else {
    console.log('Profile found:', profile);
  }

  // 3. If auth user exists, ensure profile & user_roles are updated to admin
  if (authUser) {
    // Update auth user app_metadata if needed
    const { error: updateAuthErr } = await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
      app_metadata: { ...authUser.app_metadata, role: 'admin' },
      user_metadata: { ...authUser.user_metadata, role: 'admin' },
    });
    if (updateAuthErr) {
      console.error('Error updating auth metadata:', updateAuthErr);
    } else {
      console.log('Successfully updated auth.users metadata to admin');
    }

    if (profile) {
      const { error: updProfErr } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'admin', status: 'active' })
        .eq('id', authUser.id);
      if (updProfErr) {
        console.error('Error updating profiles table:', updProfErr);
      } else {
        console.log('Successfully updated profile role to admin');
      }
    } else {
      const { error: insProfErr } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authUser.id,
          email: targetEmail,
          full_name: authUser.user_metadata?.full_name || 'Sienvi Team Admin',
          role: 'admin',
          status: 'active',
        });
      if (insProfErr) {
        console.error('Error inserting admin profile:', insProfErr);
      } else {
        console.log('Successfully inserted admin profile');
      }
    }

    // Check user_roles table
    const { data: existingRoles, error: rolesErr } = await supabaseAdmin
      .from('user_roles')
      .select('*')
      .eq('user_id', authUser.id);

    console.log('Existing user_roles:', existingRoles, 'error:', rolesErr);

    if (!rolesErr) {
      const hasAdminRole = existingRoles?.some(r => r.role === 'admin');
      if (!hasAdminRole) {
        const { error: insRoleErr } = await supabaseAdmin
          .from('user_roles')
          .insert({
            user_id: authUser.id,
            role: 'admin',
          });
        if (insRoleErr) {
          console.error('Error inserting into user_roles:', insRoleErr);
        } else {
          console.log('Successfully inserted admin role into user_roles');
        }
      } else {
        console.log('Admin role already present in user_roles');
      }
    }
  }

  // 4. Verify all admin privileges
  console.log('\n--- VERIFICATION ---');
  const { data: finalProfile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('email', targetEmail)
    .maybeSingle();
  console.log('Final profile:', finalProfile);

  if (authUser) {
    const { data: finalRoles } = await supabaseAdmin
      .from('user_roles')
      .select('*')
      .eq('user_id', authUser.id);
    console.log('Final user_roles:', finalRoles);
  }
}

main().catch(console.error);
