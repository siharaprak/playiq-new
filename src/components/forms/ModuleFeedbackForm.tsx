'use client';

import React, { useState, useTransition } from 'react';
import { Star, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { submitModuleFeedback } from '@/app/(dashboard)/student/modules/feedback-actions';

interface ModuleFeedbackFormProps {
  moduleId: string;
  initialFeedback?: {
    rating: number;
    feedback_text?: string | null;
  } | null;
}

export default function ModuleFeedbackForm({ moduleId, initialFeedback }: ModuleFeedbackFormProps) {
  // Parse initial feedback fields if serialized as JSON
  let initialQ1 = '';
  let initialQ2 = '';
  let initialQ3 = '';

  if (initialFeedback?.feedback_text) {
    try {
      const parsed = JSON.parse(initialFeedback.feedback_text);
      if (parsed && typeof parsed === 'object') {
        initialQ1 = parsed.q1 || '';
        initialQ2 = parsed.q2 || '';
        initialQ3 = parsed.q3 || '';
      } else {
        initialQ1 = initialFeedback.feedback_text;
      }
    } catch (e) {
      initialQ1 = initialFeedback.feedback_text;
    }
  }

  const [rating, setRating] = useState<number>(initialFeedback?.rating ?? 0);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [q1, setQ1] = useState<string>(initialQ1);
  const [q2, setQ2] = useState<string>(initialQ2);
  const [q3, setQ3] = useState<string>(initialQ3);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating (1-5 stars).');
      return;
    }
    if (!q1.trim() || !q2.trim() || !q3.trim()) {
      setError('Please answer all three feedback questions.');
      return;
    }

    setError(null);
    startTransition(async () => {
      const serializedText = JSON.stringify({ q1, q2, q3 });
      const result = await submitModuleFeedback(moduleId, rating, serializedText);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  };

  if (success) {
    return (
      <div 
        className="glass-card card-accent-green p-8 rounded-xl max-w-2xl w-full mb-10 text-center animate-fade-in-up"
        style={{ background: 'rgba(17,24,39,0.85)' }}
      >
        <div className="flex justify-center mb-4 text-[var(--neon-green)]">
          <CheckCircle2 className="w-16 h-16 animate-pulse-glow" style={{ filter: 'drop-shadow(0 0 8px rgba(57,255,20,0.4))' }} />
        </div>
        <h3 className="text-xl font-bold uppercase tracking-wider mb-2 font-display text-[var(--neon-green)]">
          Feedback Transmitted
        </h3>
        <p className="text-sm font-mono leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Your input has been successfully recorded in the central learning logs. Thank you for helping refine the training protocols.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="glass-card card-accent-purple p-8 rounded-xl max-w-2xl w-full mb-10 text-left relative overflow-hidden"
      style={{ background: 'rgba(17,24,39,0.85)' }}
    >
      <div className="absolute top-0 right-0 p-3 opacity-10 font-mono text-xs select-none">
        BETA_FEEDBACK_PROTOCOL_v1.1
      </div>

      <h3 className="text-lg font-bold uppercase tracking-wider mb-2 font-display text-glow-purple" style={{ color: 'var(--text-primary)' }}>
        {initialFeedback ? 'Update Beta Feedback' : 'Beta Tester Feedback'}
      </h3>
      <p className="text-xs font-mono mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Complete this report to help tune the AI tutor algorithms and refine the educational experience.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-lg text-red-200 text-xs font-mono flex items-start gap-2 shadow-inner">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Rating Select */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest block font-mono" style={{ color: 'var(--text-primary)' }}>
            System Rating
          </label>
          <div className="flex items-center gap-3 py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const isActive = hoveredRating !== null ? star <= hoveredRating : star <= rating;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  disabled={isPending}
                  className="transition-all transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      isActive 
                        ? 'fill-[var(--neon-cyan)] text-[var(--neon-cyan)]' 
                        : 'text-slate-600 fill-none'
                    }`}
                    style={isActive ? { filter: 'drop-shadow(0 0 6px rgba(0,200,255,0.4))' } : {}}
                  />
                </button>
              );
            })}
            {rating > 0 && (
              <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded border border-[#00c8ff]/30 text-[var(--neon-cyan)] ml-2">
                {rating} / 5
              </span>
            )}
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider block font-mono text-[var(--text-primary)]">
            1. Did this module teach you something meaningful, useful, or new about AI and learning? Why or why not?
          </label>
          <textarea
            value={q1}
            onChange={(e) => setQ1(e.target.value)}
            disabled={isPending}
            className="neon-input min-h-[80px] w-full bg-black/40 text-sm font-mono focus:border-[#7b4fce]"
            placeholder="Type your answer here..."
            maxLength={1000}
          />
          <div className="text-right text-[10px] font-mono text-slate-500">
            {q1.length}/1000 CHARACTERS
          </div>
        </div>

        {/* Question 2 */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider block font-mono text-[var(--text-primary)]">
            2. Did the lessons feel clear and connected, or were there parts that felt confusing or boring?
          </label>
          <textarea
            value={q2}
            onChange={(e) => setQ2(e.target.value)}
            disabled={isPending}
            className="neon-input min-h-[80px] w-full bg-black/40 text-sm font-mono focus:border-[#7b4fce]"
            placeholder="Type your answer here..."
            maxLength={1000}
          />
          <div className="text-right text-[10px] font-mono text-slate-500">
            {q2.length}/1000 CHARACTERS
          </div>
        </div>

        {/* Question 3 */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider block font-mono text-[var(--text-primary)]">
            3. After finishing this module, are you interested in continuing to the next one? Why or why not?
          </label>
          <textarea
            value={q3}
            onChange={(e) => setQ3(e.target.value)}
            disabled={isPending}
            className="neon-input min-h-[80px] w-full bg-black/40 text-sm font-mono focus:border-[#7b4fce]"
            placeholder="Type your answer here..."
            maxLength={1000}
          />
          <div className="text-right text-[10px] font-mono text-slate-500">
            {q3.length}/1000 CHARACTERS
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-3 px-4 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all font-mono border ${
            isPending 
              ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' 
              : 'border-[#7b4fce] text-[#9b6fe8] hover:bg-[#7b4fce]/10 hover:shadow-[0_0_12px_rgba(123,79,206,0.2)]'
          }`}
        >
          {isPending ? (
            'TRANSMITTING...'
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              {initialFeedback ? 'Update Transmission' : 'Transmit Feedback'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
