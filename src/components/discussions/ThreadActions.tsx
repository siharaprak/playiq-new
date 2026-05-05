'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit2, ShieldAlert, X, Flag, Pin, MessageCircle } from 'lucide-react';

type ThreadActionsProps = {
  itemId: string;
  itemType: 'topic' | 'reply';
  authorId: string;
  currentUserId: string;
  currentTitle?: string;
  currentBody?: string;
  status: string;
  isModerator: boolean;
  isPinned?: boolean;
  replyCount?: number;
};

export default function ThreadActions({ itemId, itemType, authorId, currentUserId, currentTitle, currentBody, status, isModerator, isPinned = false, replyCount }: ThreadActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModModal, setShowModModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modReason, setModReason] = useState('');
  const [modAction, setModAction] = useState<'remove' | 'lock'>('remove');
  
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [isPinning, setIsPinning] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(currentTitle || '');
  const [editBody, setEditBody] = useState(currentBody || '');
  const [isEditing, setIsEditing] = useState(false);

  const isAuthor = currentUserId === authorId;
  const canEdit = isAuthor && (status === 'active' || status === 'edited');
  const canDelete = isAuthor && (status === 'active' || status === 'edited');
  
  const executeSoftDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/discussions/${itemType === 'topic' ? 'topics' : 'replies'}/${itemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setShowDeleteModal(false);
        router.refresh();
      } else {
        alert('Failed to delete');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/discussions/${itemType === 'topic' ? 'topics' : 'replies'}/${itemId}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: modAction, reason: modReason }),
      });
      if (res.ok) {
        setShowModModal(false);
        router.refresh();
      } else {
        alert('Failed to apply moderation');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsReporting(true);
    try {
      const res = await fetch(`/api/discussions/${itemType === 'topic' ? 'topics' : 'replies'}/${itemId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reportReason }),
      });
      if (res.ok) {
        setShowReportModal(false);
        setReportReason('');
        alert('Report submitted successfully.');
      } else {
        alert('Failed to submit report');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsReporting(false);
    }
  };

  const handleTogglePin = async () => {
    setIsPinning(true);
    try {
      const res = await fetch(`/api/discussions/topics/${itemId}/pin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !isPinned }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to toggle pin');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPinning(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(true);
    try {
      const endpoint = itemType === 'topic' 
        ? `/api/discussions/topics/${itemId}` 
        : `/api/discussions/replies/${itemId}`;
      const payload = itemType === 'topic' 
        ? { title: editTitle, body: editBody } 
        : { body: editBody };
      
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowEditModal(false);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to edit');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEditing(false);
    }
  };

  if (status === 'deleted' || status === 'removed') return null;

  const btnClass = "flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 px-2 py-1.5 rounded transition-colors";

  return (
    <>
      {/* Reddit-style horizontal action bar */}
      <div className="flex items-center gap-0.5 flex-wrap">
        {/* Reply count (display only, for topic cards) */}
        {replyCount !== undefined && (
          <span className={btnClass + " cursor-default"}>
            <MessageCircle className="w-3.5 h-3.5" />
            {replyCount} {replyCount === 1 ? 'Comment' : 'Comments'}
          </span>
        )}

        {/* Pin (moderator only, topic only) */}
        {itemType === 'topic' && isModerator && (
          <button 
            onClick={handleTogglePin}
            disabled={isPinning}
            className={`${btnClass} ${isPinned ? '!text-amber-400' : ''}`}
          >
            <Pin className="w-3.5 h-3.5" />
            {isPinned ? 'Unpin' : 'Pin'}
          </button>
        )}

        {/* Report (non-author only) */}
        {!isAuthor && (
          <button 
            onClick={() => setShowReportModal(true)}
            className={btnClass}
          >
            <Flag className="w-3.5 h-3.5" />
            Report
          </button>
        )}

        {/* Edit (author only) */}
        {canEdit && (
          <button 
            onClick={() => setShowEditModal(true)}
            className={`${btnClass} hover:!text-indigo-400`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
        )}

        {/* Delete (author only) */}
        {canDelete && (
          <button 
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
            className={`${btnClass} hover:!text-red-400`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        )}

        {/* Moderate (moderator only) */}
        {isModerator && (
          <button 
            onClick={() => setShowModModal(true)}
            className={`${btnClass} hover:!text-amber-400`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Mod
          </button>
        )}
      </div>

      {/* ── Moderation Modal ── */}
      {showModModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-800/50">
              <h3 className="font-bold text-amber-400 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Moderation Action
              </h3>
              <button onClick={() => setShowModModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleModerate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Action</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-white">
                    <input type="radio" checked={modAction === 'remove'} onChange={() => setModAction('remove')} className="text-amber-500" />
                    Remove Post
                  </label>
                  {itemType === 'topic' && (
                    <label className="flex items-center gap-2 text-sm text-white">
                      <input type="radio" checked={modAction === 'lock'} onChange={() => setModAction('lock')} className="text-amber-500" />
                      Lock Thread
                    </label>
                  )}
                </div>
              </div>
              
              {modAction === 'remove' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Reason (Optional)</label>
                  <input 
                    type="text" 
                    value={modReason}
                    onChange={(e) => setModReason(e.target.value)}
                    placeholder="e.g. Inappropriate content, spam..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowModModal(false)} className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Apply Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-800/50">
              <h3 className="font-bold text-red-400 flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Delete {itemType === 'topic' ? 'Post' : 'Comment'}
              </h3>
              <button onClick={() => setShowDeleteModal(false)} disabled={isDeleting} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Are you sure you want to delete this {itemType === 'topic' ? 'post' : 'comment'}? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowDeleteModal(false)} 
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeSoftDelete}
                  disabled={isDeleting}
                  className="bg-red-500/10 border border-red-500/50 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Report Modal ── */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-800/50">
              <h3 className="font-bold text-red-400 flex items-center gap-2">
                <Flag className="w-5 h-5" /> Report {itemType === 'topic' ? 'Post' : 'Comment'}
              </h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleReport} className="p-6">
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Please describe why you are reporting this content. Our moderation team will review it shortly.
              </p>
              
              <textarea 
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Reason for reporting..."
                required
                className="w-full h-24 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 mb-4 resize-none"
              />
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowReportModal(false)} 
                  disabled={isReporting}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isReporting || !reportReason.trim()}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Flag className="w-4 h-4" />
                  {isReporting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-800/50">
              <h3 className="font-bold text-indigo-400 flex items-center gap-2">
                <Edit2 className="w-5 h-5" /> Edit {itemType === 'topic' ? 'Post' : 'Comment'}
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              {itemType === 'topic' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                    required
                    minLength={5}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Content</label>
                <textarea 
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 resize-y"
                  required
                  minLength={itemType === 'topic' ? 10 : 2}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowEditModal(false)} disabled={isEditing} className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isEditing}
                  className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
