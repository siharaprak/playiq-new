import 'server-only';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { requireAuth, requireRole, AppUser } from '@/lib/auth/permissions';

// --- Zod Schemas ---

export const TopicSchema = z.object({
  title: z.string().min(5).max(120),
  body: z.string().min(10).max(5000),
});

export const ReplySchema = z.object({
  body: z.string().min(2).max(3000),
});

// --- Categories ---

export async function listDiscussionCategories() {
  const { data, error } = await supabaseAdmin
    .from('discussion_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to list categories: ${error.message}`);
  return data;
}

export async function getDiscussionCategory(slugOrId: string) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slugOrId);
  
  let query = supabaseAdmin.from('discussion_categories').select('*');
  
  if (isUuid) {
    query = query.eq('id', slugOrId);
  } else {
    query = query.eq('slug', slugOrId);
  }
  
  const { data, error } = await query.single();

  if (error || !data) throw new Error('Category not found');
  return data;
}

// --- Topics ---

export async function listTopics({ categoryId, page = 1, pageSize = 20 }: { categoryId: string; page?: number; pageSize?: number }) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error, count } = await supabaseAdmin
    .from('discussion_topics')
    .select('*, author:profiles!author_id(full_name, role, username)', { count: 'exact' })
    .eq('category_id', categoryId)
    .in('status', ['active', 'edited', 'locked'])
    .order('is_pinned', { ascending: false, nullsFirst: false })
    .order('last_reply_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) throw new Error(`Failed to list topics: ${error.message}`);
  return { topics: data, count: count ?? 0 };
}

export async function getTopicWithReplies(topicId: string) {
  const { data: topic, error: topicError } = await supabaseAdmin
    .from('discussion_topics')
    .select('*, author:profiles!author_id(full_name, role, username), category:discussion_categories!category_id(slug, title)')
    .eq('id', topicId)
    .single();

  if (topicError || !topic) throw new Error('Topic not found');

  const { data: replies, error: repliesError } = await supabaseAdmin
    .from('discussion_replies')
    .select('*, author:profiles!author_id(full_name, role, username)')
    .eq('topic_id', topicId)
    .order('created_at', { ascending: true });

  if (repliesError) throw new Error(`Failed to get replies: ${repliesError.message}`);

  return { topic, replies };
}

export async function createTopic({ categoryId, authorId, title, body }: { categoryId: string; authorId: string; title: string; body: string }) {
  const parsed = TopicSchema.parse({ title, body });

  const { data, error } = await supabaseAdmin
    .from('discussion_topics')
    .insert({
      category_id: categoryId,
      author_id: authorId,
      title: parsed.title,
      body: parsed.body,
      last_reply_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create topic: ${error.message}`);
  return data;
}

export async function updateOwnTopic({ topicId, authorId, title, body }: { topicId: string; authorId: string; title: string; body: string }) {
  const parsed = TopicSchema.parse({ title, body });

  // Verify ownership and status
  const { data: topic } = await supabaseAdmin.from('discussion_topics').select('author_id, status').eq('id', topicId).single();
  if (!topic || topic.author_id !== authorId) throw new Error('Unauthorized or topic not found');
  if (topic.status !== 'active' && topic.status !== 'edited') throw new Error('Cannot edit this topic');

  const { data, error } = await supabaseAdmin
    .from('discussion_topics')
    .update({
      title: parsed.title,
      body: parsed.body,
      status: 'edited',
      edited_at: new Date().toISOString(),
    })
    .eq('id', topicId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update topic: ${error.message}`);
  return data;
}

export async function softDeleteOwnTopic({ topicId, authorId }: { topicId: string; authorId: string }) {
  // Verify ownership
  const { data: topic } = await supabaseAdmin.from('discussion_topics').select('author_id, status').eq('id', topicId).single();
  if (!topic || topic.author_id !== authorId) throw new Error('Unauthorized or topic not found');

  const { data, error } = await supabaseAdmin
    .from('discussion_topics')
    .update({
      status: 'deleted',
      deleted_at: new Date().toISOString(),
      body: '[This post was deleted by the author]',
    })
    .eq('id', topicId)
    .select()
    .single();

  if (error) throw new Error(`Failed to delete topic: ${error.message}`);
  return data;
}

export async function moderateTopic({ topicId, moderatorId, action, reason }: { topicId: string; moderatorId: string; action: 'remove' | 'lock'; reason?: string }) {
  const updates: any = {};
  
  if (action === 'remove') {
    updates.status = 'removed';
    updates.removed_by = moderatorId;
    updates.removed_at = new Date().toISOString();
    updates.removal_reason = reason;
    updates.body = '[This post was removed by a moderator]';
  } else if (action === 'lock') {
    updates.status = 'locked';
    updates.is_locked = true;
  }

  const { data, error } = await supabaseAdmin
    .from('discussion_topics')
    .update(updates)
    .eq('id', topicId)
    .select()
    .single();

  if (error) throw new Error(`Failed to moderate topic: ${error.message}`);
  return data;
}

export async function togglePinTopic({ topicId, moderatorId, isPinned }: { topicId: string; moderatorId: string; isPinned: boolean }) {
  const { data, error } = await supabaseAdmin
    .from('discussion_topics')
    .update({ is_pinned: isPinned })
    .eq('id', topicId)
    .select()
    .single();

  if (error) throw new Error(`Failed to pin topic: ${error.message}`);
  return data;
}

// --- Replies ---

export async function createReply({ topicId, authorId, body }: { topicId: string; authorId: string; body: string }) {
  const parsed = ReplySchema.parse({ body });

  // Ensure topic isn't locked
  const { data: topic } = await supabaseAdmin.from('discussion_topics').select('is_locked, reply_count').eq('id', topicId).single();
  if (!topic) throw new Error('Topic not found');
  if (topic.is_locked) throw new Error('Topic is locked');

  const { data, error } = await supabaseAdmin
    .from('discussion_replies')
    .insert({
      topic_id: topicId,
      author_id: authorId,
      body: parsed.body,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create reply: ${error.message}`);

  // Update reply count and last_reply_at
  if (topic) {
    await supabaseAdmin.from('discussion_topics').update({
      reply_count: (topic as any).reply_count ? (topic as any).reply_count + 1 : 1,
      last_reply_at: new Date().toISOString()
    }).eq('id', topicId);
  }

  return data;
}

export async function updateOwnReply({ replyId, authorId, body }: { replyId: string; authorId: string; body: string }) {
  const parsed = ReplySchema.parse({ body });

  // Verify ownership
  const { data: reply } = await supabaseAdmin.from('discussion_replies').select('author_id, status').eq('id', replyId).single();
  if (!reply || reply.author_id !== authorId) throw new Error('Unauthorized or reply not found');
  if (reply.status !== 'active' && reply.status !== 'edited') throw new Error('Cannot edit this reply');

  const { data, error } = await supabaseAdmin
    .from('discussion_replies')
    .update({
      body: parsed.body,
      status: 'edited',
      edited_at: new Date().toISOString(),
    })
    .eq('id', replyId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update reply: ${error.message}`);
  return data;
}

export async function softDeleteOwnReply({ replyId, authorId }: { replyId: string; authorId: string }) {
  // Verify ownership
  const { data: reply } = await supabaseAdmin.from('discussion_replies').select('author_id, status').eq('id', replyId).single();
  if (!reply || reply.author_id !== authorId) throw new Error('Unauthorized or reply not found');

  const { data, error } = await supabaseAdmin
    .from('discussion_replies')
    .update({
      status: 'deleted',
      deleted_at: new Date().toISOString(),
      body: '[This reply was deleted by the author]',
    })
    .eq('id', replyId)
    .select()
    .single();

  if (error) throw new Error(`Failed to delete reply: ${error.message}`);
  return data;
}

export async function moderateReply({ replyId, moderatorId, action, reason }: { replyId: string; moderatorId: string; action: 'remove'; reason?: string }) {
  if (action === 'remove') {
    const { data, error } = await supabaseAdmin
      .from('discussion_replies')
      .update({
        status: 'removed',
        removed_by: moderatorId,
        removed_at: new Date().toISOString(),
        removal_reason: reason,
        body: '[This reply was removed by a moderator]',
      })
      .eq('id', replyId)
      .select()
      .single();

    if (error) throw new Error(`Failed to moderate reply: ${error.message}`);
    return data;
  }
  throw new Error('Invalid moderation action');
}

export async function reportDiscussionItem({ reporterId, topicId, replyId, reason }: { reporterId: string; topicId?: string; replyId?: string; reason: string }) {
  if (!topicId && !replyId) throw new Error('Must provide either topicId or replyId');
  
  const { data, error } = await supabaseAdmin
    .from('discussion_reports')
    .insert({
      reporter_id: reporterId,
      topic_id: topicId || null,
      reply_id: replyId || null,
      reason: reason,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to submit report: ${error.message}`);
  return data;
}
