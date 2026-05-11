'use client';

import { useState } from 'react';
import { submitFeedbackRequest } from './feedback-actions';
import { X } from 'lucide-react';

export default function RequestFeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    const result = await submitFeedbackRequest(message);
    
    setIsSubmitting(false);
    if (result.success) {
      setSuccess(true);
      setMessage('');
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    } else {
      setError(result.error || 'Failed to submit feedback');
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-3 rounded-lg text-sm font-bold transition-colors hover:bg-[rgba(123,79,206,0.25)]" 
        style={{ background: 'rgba(123,79,206,0.15)', border: '1px solid rgba(123,79,206,0.3)', color: '#9b6fe8' }}
      >
        Request Feedback
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl relative shadow-2xl" style={{ background: '#0a0f1e', border: '1px solid rgba(123,79,206,0.4)' }}>
            <button 
              onClick={() => !isSubmitting && setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[var(--text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold mb-2 font-display text-[var(--text-primary)]">Request Feedback</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Explain your attempted approach before providing secondary hints. What are you stuck on?
            </p>

            {success ? (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm mb-4">
                Feedback request submitted successfully! We'll get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I am trying to solve the module 2 quiz but..."
                  className="w-full h-32 p-3 rounded-lg mb-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7b4fce]/50 transition-all"
                  style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  required
                  disabled={isSubmitting}
                />
                
                {error && (
                  <p className="text-red-400 text-xs mb-4">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full py-3 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                  style={{ background: '#7b4fce', color: 'white' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
