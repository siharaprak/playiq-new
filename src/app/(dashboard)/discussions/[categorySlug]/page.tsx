import { getDiscussionCategory, listTopics } from '@/lib/data/discussions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Pin, MessageCircle, Search } from 'lucide-react';
import TopicComposer from '@/components/discussions/TopicComposer';
import { requireAuth } from '@/lib/auth/permissions';
import { headers } from 'next/headers';
import { UserAvatar, RoleBadge } from '@/components/discussions/UserAvatar';
import TimeAgo from '@/components/discussions/TimeAgo';

export default async function CategoryPage(props: { params: Promise<{ categorySlug: string }>; searchParams: Promise<{ q?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const categorySlug = params.categorySlug;
  const query = searchParams.q?.toLowerCase() || '';
  
  const req = new Request('http://localhost', { headers: await headers() });
  const user = await requireAuth(req).catch(() => null);
  
  if (!user) {
    return <div className="p-8 text-center rounded-xl" style={{ color: '#64748b', background: 'rgba(17,24,39,0.8)' }}>Please log in to view discussions.</div>;
  }
  
  let category;
  try {
    category = await getDiscussionCategory(categorySlug);
  } catch (e) {
    notFound();
  }

  const { topics } = await listTopics({ categoryId: category.id, page: 1, pageSize: 50 });

  const filteredTopics = topics.filter((t: any) => 
    !query || 
    t.title.toLowerCase().includes(query) || 
    (t.author?.full_name && t.author.full_name.toLowerCase().includes(query))
  );

  return (
    <div className="space-y-3">
      {/* Category header */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(17,24,39,0.8)', borderLeft: '3px solid #7b4fce', border: '1px solid rgba(123,79,206,0.25)' }}>
        <h2 className="font-bold text-lg font-display">
          <span className="mr-1" style={{ color: '#00c8ff' }}>#</span>{category.title}
        </h2>
        {category.description && <p className="text-xs mt-1" style={{ color: '#64748b' }}>{category.description}</p>}
      </div>

      {/* Create a post bar (hidden for parents) */}
      {user?.primary_role !== 'parent' && (
        <TopicComposer categoryId={category.id} />
      )}

      {/* Search */}
      <form className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748b' }} />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search posts..."
            className="w-full rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none"
            style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(123,79,206,0.25)' }}
          />
        </div>
        <button type="submit" className="px-3 py-2 rounded-lg text-xs font-bold transition-colors" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(123,79,206,0.3)', color: '#94a3b8' }}>
          Search
        </button>
        {query && (
          <Link href={`/discussions/${categorySlug}`} className="text-xs px-2 transition-colors" style={{ color: '#64748b' }}>Clear</Link>
        )}
      </form>

      {/* Topic feed */}
      <div className="space-y-2">
        {filteredTopics.length === 0 ? (
          <div className="text-center py-16 text-sm" style={{ color: '#64748b' }}>
            {query ? 'No posts found matching your search.' : 'No posts yet. Be the first to start a discussion!'}
          </div>
        ) : (
          filteredTopics.map((topic: any) => (
            <Link 
              key={topic.id} 
              href={`/discussions/topic/${topic.id}`}
              className="block rounded-lg p-4 transition-all group"
            style={{ background: topic.is_pinned ? 'rgba(245,197,24,0.05)' : 'rgba(17,24,39,0.8)', border: topic.is_pinned ? '1px solid rgba(245,197,24,0.3)' : '1px solid rgba(123,79,206,0.2)' }}
            >
              {/* Pinned badge */}
              {topic.is_pinned && (
                <div className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-wider mb-2" style={{ color: '#f5c518' }}>
                  <Pin className="w-3 h-3" style={{ fill: 'rgba(245,197,24,0.3)' }} />
                  Pinned
                </div>
              )}

              <div className="flex gap-3">
                {/* Avatar */}
                <UserAvatar name={topic.author?.full_name} role={topic.author?.role} size="md" />
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Meta line */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 flex-wrap">
                    <span className="font-medium text-slate-300">{topic.author?.full_name || 'Anonymous'}</span>
                    <RoleBadge role={topic.author?.role} />
                    <span>·</span>
                    <TimeAgo date={topic.created_at} />
                    {topic.status === 'edited' && <span className="italic text-slate-600">(edited)</span>}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-white transition-colors leading-snug mb-1 group-hover:text-[#00c8ff]">
                    {topic.title}
                  </h3>

                  {/* Body preview */}
                  {topic.body && topic.status !== 'deleted' && topic.status !== 'removed' && (
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {topic.body.substring(0, 200)}
                    </p>
                  )}

                  {/* Action bar */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {topic.reply_count || 0} {(topic.reply_count || 0) === 1 ? 'comment' : 'comments'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
