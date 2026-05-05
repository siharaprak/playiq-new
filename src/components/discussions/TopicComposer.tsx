'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquarePlus, X, Send } from 'lucide-react';

export default function TopicComposer({ categoryId }: { categoryId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.length < 5) return setError('Title must be at least 5 characters');
    if (body.length < 10) return setError('Message must be at least 10 characters');
    
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/discussions/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, title, body }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to create topic');

      setTitle('');
      setBody('');
      setIsOpen(false);
      router.refresh();
      router.push(`/discussions/topic/${data.data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-indigo-500/50 rounded-lg px-4 py-3 text-left transition-all group"
      >
        <div className="w-8 h-8 bg-indigo-500/20 border border-indigo-500/30 rounded-full flex items-center justify-center shrink-0">
          <MessageSquarePlus className="w-4 h-4 text-indigo-400" />
        </div>
        <span className="text-slate-500 group-hover:text-slate-300 text-sm transition-colors flex-1">Create a post...</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-800/50">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-indigo-400" />
            Create a Post
          </h3>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">{error}</div>}
          
          <div>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-lg font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
              required
              autoFocus
            />
          </div>
          
          <div>
            <textarea 
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What are your thoughts?"
              rows={6}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y placeholder:text-slate-500"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-2 rounded-full font-bold transition-all text-sm flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
