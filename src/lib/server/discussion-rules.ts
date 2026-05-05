import 'server-only';
import { AppUser } from '@/lib/auth/permissions';

export function assertCanCreateContent(user: AppUser) {
  if (user.primary_role === 'parent') {
    throw new Error('Parents cannot create content at this time.');
  }
}

export function assertCanModerate(user: AppUser) {
  if (!user.roles.includes('admin') && !user.roles.includes('teacher')) {
    throw new Error('Unauthorized moderation action');
  }
}
