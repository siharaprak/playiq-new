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
  const userId = 'dd856a53-e732-4008-bcc9-f921ac551693';
  console.log("Checking user profile for ID:", userId);

  // Check if they exist in auth
  const { data: { user }, error: authErr } = await supabase.auth.admin.getUserById(userId);
  if (authErr || !user) {
    console.log("User not found in auth.users:", authErr?.message || "Not found");
    return;
  }
  console.log("User found in auth.users. Email:", user.email);

  // Check profiles
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (profileErr) {
    console.error("Error reading profile:", profileErr.message);
  }

  if (!profile) {
    console.log("Profile is MISSING in public.profiles! Inserting...");
    const { data: newProfile, error: insErr } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'Student User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insErr) {
      console.error("Failed to insert profile:", insErr.message);
    } else {
      console.log("Successfully inserted profile:", newProfile);
    }
  } else {
    console.log("Profile exists in profiles:", profile);
  }

  // Check user_roles
  const { data: roles, error: rolesErr } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId);

  if (rolesErr) {
    console.error("Error reading user_roles:", rolesErr.message);
  }

  if (!roles || roles.length === 0) {
    console.log("No user roles found. Inserting 'student' role...");
    const { data: newRole, error: roleInsErr } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'student'
      })
      .select();

    if (roleInsErr) {
      console.error("Failed to insert role:", roleInsErr.message);
    } else {
      console.log("Successfully inserted student role:", newRole);
    }
  } else {
    console.log("Roles exist for user:", roles);
  }
}

main().catch(console.error);
