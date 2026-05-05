'use client';

/**
 * Formats a date string into a relative time string like "2h ago", "3d ago", etc.
 */
function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export default function TimeAgo({ date, className = '' }: { date: string; className?: string }) {
  return (
    <time dateTime={date} title={new Date(date).toLocaleString()} className={className}>
      {getTimeAgo(date)}
    </time>
  );
}
