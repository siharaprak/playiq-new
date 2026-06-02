'use client';

import React, { useState } from 'react';
import { submitSupportIssue } from './actions';
import { HelpCircle, Check, Loader2 } from 'lucide-react';

/**
 * SupportIssueForm — Allows students to file manual support tickets.
 */
export default function SupportIssueForm() {
  const [issueText, setIssueText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueText.trim()) return;

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMsg('');

    try {
      const result = await submitSupportIssue(issueText);
      if (result.ok) {
        setStatus('success');
        setIssueText('');
      } else {
        setStatus('error');
        setErrorMsg(result.error);
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Failed to submit ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="border border-green-500/30 bg-green-950/20 rounded-xl p-4 text-center space-y-2 mt-4">
        <Check className="w-8 h-8 text-green-400 mx-auto" />
        <p className="font-mono text-xs text-green-400 font-bold uppercase tracking-wider">Ticket Submitted</p>
        <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
          Your support ticket has been logged in the admin queue. An instructor will review your request shortly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-[10px] font-mono text-slate-500 hover:text-slate-300 underline mt-1 block w-full"
        >
          Submit another ticket
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4 pt-4 border-t border-slate-800">
      <div className="space-y-1">
        <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 font-bold">
          Submit Support Ticket
        </label>
        <textarea
          rows={2}
          value={issueText}
          disabled={isSubmitting}
          onChange={(e) => setIssueText(e.target.value)}
          placeholder="Describe your issue or question for instructors..."
          className="w-full bg-black/40 border border-slate-800 focus:border-[#00c8ff] rounded p-2 text-slate-200 text-xs font-mono outline-none resize-none min-h-[60px]"
        />
      </div>

      {status === 'error' && (
        <p className="text-[10px] font-mono text-red-400">⚠ {errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !issueText.trim()}
        className="w-full bg-[#00c8ff] hover:bg-[#00c8ff]/90 disabled:opacity-40 transition-colors text-slate-950 rounded py-2 text-center text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Ticket'
        )}
      </button>
    </form>
  );
}
