import 'server-only';
import { AppUser } from '@/lib/auth/permissions';

/**
 * Returns a safe public display name.
 *
 * Fallback order:
 * 1. username (if present)
 * 2. Safe first name from full_name (first word only, never email)
 * 3. Role-based fallback: Student / Parent / Teacher / Admin
 *
 * Never returns email.
 */
export function getSafeDisplayName(
  user: AppUser | { full_name: string | null; username?: string | null; role?: string | null }
): string {
  if (!user) return 'User';

  // 1. Prefer username
  if ('username' in user && user.username) {
    return user.username;
  }

  // 2. Safe first name (first word of full_name, never email-like)
  if (user.full_name) {
    const firstName = user.full_name.split(/\s+/)[0];
    // Ensure it doesn't look like an email
    if (firstName && !firstName.includes('@')) {
      return firstName;
    }
  }

  // 3. Role-based fallback
  const role = 'primary_role' in user ? (user as AppUser).primary_role : (user as any).role;
  switch (role) {
    case 'student': return 'Student';
    case 'parent': return 'Parent';
    case 'teacher': return 'Teacher';
    case 'admin': return 'Admin';
    default: return 'User';
  }
}
