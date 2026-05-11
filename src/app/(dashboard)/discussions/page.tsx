import { listDiscussionCategories } from '@/lib/data/discussions';
import Link from 'next/link';
import { Hash, ChevronRight, TrendingUp } from 'lucide-react';

export default async function DiscussionsIndex() {
  const categories = await listDiscussionCategories();

  return (
    <div className="space-y-3">
      {/* Welcome banner */}
      <div className="rounded-lg p-5 mb-4" style={{ background: 'linear-gradient(135deg, rgba(123,79,206,0.18), rgba(0,200,255,0.08))', border: '1px solid rgba(123,79,206,0.25)' }}>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4" style={{ color: 'var(--neon-cyan)' }} />
          <h2 className="font-bold text-sm font-display" style={{ color: '#9b6fe8' }}>Welcome to PlayIQ Discussions</h2>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Choose a category below to browse topics or start a new conversation.</p>
      </div>

      {/* Category list */}
      {categories.map((category: any) => (
        <Link
          key={category.id}
          href={`/discussions/${category.slug}`}
          className="flex items-center gap-4 rounded-lg p-4 transition-all group"
          style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(123,79,206,0.2)' }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors" style={{ background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.2)' }}>
            <Hash className="w-5 h-5" style={{ color: 'var(--neon-cyan)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--neon-cyan)]">{category.title}</h3>
            {category.description && (
              <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{category.description}</p>
            )}
          </div>
          <ChevronRight className="w-4 h-4 shrink-0 transition-colors" style={{ color: '#4a5568' }} />
        </Link>
      ))}
    </div>
  );
}
