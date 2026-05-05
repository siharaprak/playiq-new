/**
 * UserAvatar — Colored initials avatar with role-based accent colors.
 * Used across the Discussion Board for a Reddit-like author identity.
 */

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string; badge: string; label: string }> = {
  admin:   { bg: 'bg-red-500/20',    text: 'text-red-400',    border: 'border-red-500/40',    badge: 'bg-red-500/10 text-red-400 border-red-500/30',     label: 'ADMIN' },
  teacher: { bg: 'bg-amber-500/20',  text: 'text-amber-400',  border: 'border-amber-500/40',  badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', label: 'TEACHER' },
  student: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/40', badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', label: 'STUDENT' },
  parent:  { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'PARENT' },
};

const DEFAULT_COLORS = { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/40', badge: 'bg-slate-500/10 text-slate-400 border-slate-500/30', label: 'USER' };

function getInitials(name: string | null | undefined): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

export function UserAvatar({ name, role, size = 'md' }: { name?: string | null; role?: string | null; size?: 'sm' | 'md' | 'lg' }) {
  const colors = ROLE_COLORS[role || ''] || DEFAULT_COLORS;
  const initials = getInitials(name);

  const sizeClasses = {
    sm: 'w-7 h-7 text-[0.6rem]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colors.bg} ${colors.text} ${colors.border} border rounded-full flex items-center justify-center font-bold shrink-0 select-none`}
      title={name || 'User'}
    >
      {initials}
    </div>
  );
}

export function RoleBadge({ role }: { role?: string | null }) {
  const colors = ROLE_COLORS[role || ''] || DEFAULT_COLORS;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider border rounded ${colors.badge}`}>
      {colors.label}
    </span>
  );
}
