'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

export default function ReplyComposer({ topicId }: { topicId: string }) {
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (body.length < 2) return setError('Reply must be at least 2 characters');
    
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/discussions/topics/${topicId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to post reply');

      setBody('');
      setIsFocused(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <form onSubmit={handleSubmit}>
        {error && <div className="mx-4 mt-3 p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-sm">{error}</div>}
        
        <div className="p-3">
          <textarea 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="What are your thoughts?"
            rows={isFocused ? 4 : 2}
            className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all resize-none placeholder:text-slate-500"
            required
          />
        </div>
        
        {(isFocused || body.length > 0) && (
          <div className="flex justify-between items-center px-3 pb-3">
            <button 
              type="button"
              onClick={() => { setIsFocused(false); setBody(''); }}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || body.length < 2}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 px-4 py-1.5 rounded-full font-bold transition-all text-xs"
            >
              <Send className="w-3 h-3" />
              {isSubmitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
