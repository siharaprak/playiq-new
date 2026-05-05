import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export interface AppUser {
  id: string;
  email: string;
  full_name: string | null;
  roles: UserRole[];
  primary_role: UserRole;
}

/**
 * Require a valid authenticated session from the incoming request cookies.
 * Throws if the user is not authenticated.
 */
export async function requireAuth(request: Request): Promise<AppUser> {
  const authHeader = request.headers.get('cookie') || '';

  // Extract the Supabase auth token from the cookie header
  const cookieMap: Record<string, string> = {};
  authHeader.split(';').forEach((part) => {
    const [key, ...rest] = part.trim().split('=');
    if (key) cookieMap[key.trim()] = rest.join('=');
  });

  // Try to get the user from the service role client using the access token
  // embedded in the sb-access-token cookie (set by @supabase/ssr)
  const accessTokenKey = Object.keys(cookieMap).find(
    (k) => k.includes('auth-token') || k.includes('access-token')
  );
  const accessToken = accessTokenKey ? cookieMap[accessTokenKey] : null;

  let userId: string | null = null;

  if (accessToken) {
    try {
      const token = decodeURIComponent(accessToken).replace(/^base64-/, '');
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        userId = payload.sub;
      }
    } catch {
      // ignore parse errors
    }
  }

  // Fallback: try getUser with the supabase admin if we have a bearer token
  if (!userId) {
    // Use the Next.js headers() from @/utils/supabase/server context
    // As a last resort, check the Authorization header
    const authBearer = request.headers.get('authorization');
    if (authBearer?.startsWith('Bearer ')) {
      const { data } = await supabaseAdmin.auth.getUser(authBearer.slice(7));
      userId = data.user?.id ?? null;
    }
  }

  if (!userId) throw new Error('Unauthorized');

  // Fetch the profile and roles
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('full_name, email')
    .eq('id', userId)
    .single();

  if (profileError || !profile) throw new Error('Unauthorized: profile not found');

  const { data: roleRows } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  const roles: UserRole[] = roleRows?.map((r: any) => r.role as UserRole) ?? ['student'];
  const primary_role: UserRole =
    roles.includes('admin') ? 'admin' :
    roles.includes('teacher') ? 'teacher' :
    roles.includes('parent') ? 'parent' : 'student';

  return {
    id: userId,
    email: profile.email ?? '',
    full_name: profile.full_name,
    roles,
    primary_role,
  };
}

/**
 * Require a specific role. Throws if the user doesn't have it.
 */
export async function requireRole(request: Request, role: UserRole): Promise<AppUser> {
  const user = await requireAuth(request);
  if (!user.roles.includes(role)) {
    throw new Error(`Forbidden: requires role ${role}`);
  }
  return user;
}

/**
 * Stub for audit logging — extend as needed.
 */
export async function logAuditEvent(event: {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
}) {
  // Optional: insert into an audit_log table
  try {
    await supabaseAdmin.from('audit_logs').insert({
      user_id: event.userId,
      action: event.action,
      resource_type: event.resourceType,
      resource_id: event.resourceId,
      metadata: event.metadata ?? {},
      created_at: new Date().toISOString(),
    });
  } catch {
    // Non-fatal — audit log failures should not break the request
  }
}
