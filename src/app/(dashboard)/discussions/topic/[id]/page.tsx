import { getTopicWithReplies } from '@/lib/data/discussions';
import { requireAuth } from '@/lib/auth/permissions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Lock, Pin, Eye } from 'lucide-react';
import ReplyComposer from '@/components/discussions/ReplyComposer';
import ThreadActions from '@/components/discussions/ThreadActions';
import { headers } from 'next/headers';
import { UserAvatar, RoleBadge } from '@/components/discussions/UserAvatar';
import TimeAgo from '@/components/discussions/TimeAgo';

export default async function TopicPage(props: { params: Promise<{ id: string }> }) {
  const req = new Request('http://localhost', { headers: await headers() });
  const appUser = await requireAuth(req).catch(() => null);
  
  if (!appUser) {
    return <div className="p-8 text-center text-slate-400 bg-slate-800 rounded-xl">Please log in to view discussions.</div>;
  }

  const params = await props.params;
  
  let topic, replies;
  try {
    const data = await getTopicWithReplies(params.id);
    topic = data.topic;
    replies = data.replies;
  } catch (e) {
    notFound();
  }

  const isModerator = appUser.roles.includes('admin') || appUser.roles.includes('teacher');
  const isParent = appUser.primary_role === 'parent';

  return (
    <div className="space-y-3">
      {/* Back nav */}
      <Link href={`/discussions/${topic.category?.slug || ''}`} className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-1">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to {topic.category?.title || 'feed'}
      </Link>

      {/* ── Main Post (OP) ── */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg overflow-hidden">
        {/* Pinned / Locked banners */}
        {topic.is_pinned && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-[0.65rem] font-bold uppercase tracking-wider">
            <Pin className="w-3 h-3 fill-amber-400/30" />
            Pinned by moderator
          </div>
        )}
        {topic.is_locked && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-[0.65rem] font-bold uppercase tracking-wider">
            <Lock className="w-3 h-3" />
            This thread is locked
          </div>
        )}

        <div className="p-4 md:p-5">
          {/* Author line */}
          <div className="flex items-center gap-3 mb-3">
            <UserAvatar name={topic.author?.full_name} role={topic.author?.role} size="md" />
            <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
              <span className="font-semibold text-slate-200">{topic.author?.full_name || 'Anonymous'}</span>
              <RoleBadge role={topic.author?.role} />
              <span>·</span>
              <TimeAgo date={topic.created_at} />
              {topic.status === 'edited' && <span className="italic text-slate-600">(edited)</span>}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-white mb-3 leading-snug">{topic.title}</h1>
          
          {/* Body */}
          <div className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
            {topic.status === 'deleted' || topic.status === 'removed' ? (
              <div className="italic text-slate-500 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                {topic.body}
                {topic.status === 'removed' && topic.removal_reason && (
                  <div className="mt-2 text-xs text-red-400">Reason: {topic.removal_reason}</div>
                )}
              </div>
            ) : (
              topic.body
            )}
          </div>
          
          {/* Action bar */}
          <div className="mt-4 pt-3 border-t border-slate-700/40">
            <ThreadActions 
              itemId={topic.id} 
              itemType="topic" 
              authorId={topic.author_id}
              currentUserId={appUser.id}
              currentTitle={topic.title}
              currentBody={topic.status !== 'deleted' && topic.status !== 'removed' ? topic.body : ''}
              status={topic.status}
              isModerator={isModerator}
              isPinned={topic.is_pinned}
              replyCount={replies.length}
            />
          </div>
        </div>
      </div>

      {/* ── Comments ── */}
      <div className="space-y-2">
        {replies.length > 0 && (
          <div className="px-1 py-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {replies.length} {replies.length === 1 ? 'Comment' : 'Comments'}
            </h3>
          </div>
        )}

        {replies.map((reply: any) => (
          <div key={reply.id} className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-4">
            <div className="flex gap-3">
              {/* Reply thread line + avatar */}
              <div className="flex flex-col items-center">
                <UserAvatar name={reply.author?.full_name} role={reply.author?.role} size="sm" />
                {/* Thread line */}
                <div className="w-px flex-1 bg-slate-700/40 mt-2" />
              </div>

              {/* Reply content */}
              <div className="flex-1 min-w-0">
                {/* Author meta */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 flex-wrap">
                  <span className="font-semibold text-slate-300">{reply.author?.full_name || 'Anonymous'}</span>
                  <RoleBadge role={reply.author?.role} />
                  <span>·</span>
                  <TimeAgo date={reply.created_at} />
                  {reply.status === 'edited' && <span className="italic text-slate-600">(edited)</span>}
                </div>

                {/* Reply body */}
                <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {reply.status === 'deleted' || reply.status === 'removed' ? (
                    <div className="italic text-slate-500 bg-slate-900/50 p-3 rounded border border-slate-800 text-xs">
                      {reply.body}
                      {reply.status === 'removed' && reply.removal_reason && (
                        <div className="mt-2 text-xs text-red-400">Reason: {reply.removal_reason}</div>
                      )}
                    </div>
                  ) : (
                    reply.body
                  )}
                </div>

                {/* Reply actions */}
                <div className="mt-2">
                  <ThreadActions 
                    itemId={reply.id} 
                    itemType="reply" 
                    authorId={reply.author_id}
                    currentUserId={appUser.id}
                    currentBody={reply.status !== 'deleted' && reply.status !== 'removed' ? reply.body : ''}
                    status={reply.status}
                    isModerator={isModerator}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Reply Composer ── */}
      {!topic.is_locked ? (
        !isParent ? (
          <div className="mt-2">
            <ReplyComposer topicId={topic.id} />
          </div>
        ) : (
          <div className="mt-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-emerald-400 text-xs">
            <Eye className="w-4 h-4" />
            <span>You have read-only access as a parent. You can view discussions but cannot post replies.</span>
          </div>
        )
      ) : (
        <div className="mt-2 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-2 text-amber-400 text-xs">
          <Lock className="w-4 h-4" />
          <span>This thread has been locked by a moderator. No new comments can be added.</span>
        </div>
      )}
    </div>
  );
}
