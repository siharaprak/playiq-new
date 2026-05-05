import 'server-only';
import { AppUser } from '@/lib/auth/permissions';

export function getSafeDisplayName(user: AppUser | { full_name: string | null }): string {
  if (!user) return 'User';
  return user.full_name || 'User';
}
