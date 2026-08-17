'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Loader2, Plus, X } from 'lucide-react';
import { sendBetaEmailAction } from './actions';

interface SendBetaEmailButtonProps {
  email: string;
  parentName: string;
  teenName?: string;
}

export function SendBetaEmailButton({ email, parentName, teenName }: SendBetaEmailButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSend = async () => {
    if (loading) return;
    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const res = await sendBetaEmailAction({
        email,
        parentName,
        teenName,
      });

      if (res.success) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setErrorMessage(res.error || 'Failed to send');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Error sending email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSend}
        disabled={loading}
        title={`Send Beta Setup Guide PDF to ${email}`}
        className={`px-3 py-1.5 text-[11px] font-mono uppercase font-bold tracking-wider rounded transition-all flex items-center gap-1.5 ${
          status === 'success'
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
            : status === 'error'
            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
            : 'bg-[#00c8ff]/10 hover:bg-[#00c8ff]/20 text-[#00c8ff] border border-[#00c8ff]/40 hover:shadow-[0_0_10px_rgba(0,200,255,0.3)]'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin text-[#00c8ff]" />
            <span>Sending...</span>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Sent!</span>
          </>
        ) : status === 'error' ? (
          <>
            <AlertCircle className="w-3 h-3 text-red-400" />
            <span>Retry</span>
          </>
        ) : (
          <>
            <Send className="w-3 h-3" />
            <span>Send Guide</span>
          </>
        )}
      </button>
      {errorMessage && (
        <span className="text-[10px] text-red-400 font-mono" title={errorMessage}>
          ⚠ {errorMessage.slice(0, 30)}...
        </span>
      )}
    </div>
  );
}

export function QuickSendBetaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [teenName, setTeenName] = useState('');
  const [promoCode, setPromoCode] = useState('PLAYIQ2025');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setFeedback(null);

    try {
      const res = await sendBetaEmailAction({
        email,
        parentName: parentName.trim() || undefined,
        teenName: teenName.trim() || undefined,
        promoCode: promoCode.trim() || 'PLAYIQ2025',
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Email & Parent Setup Guide PDF successfully delivered to ${email}!`,
        });
        setTimeout(() => {
          setEmail('');
          setParentName('');
          setTeenName('');
        }, 1500);
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to dispatch email.',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          setFeedback(null);
        }}
        className="px-4 py-2 bg-[#7b4fce] hover:bg-[#9064e8] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(123,79,206,0.4)]"
      >
        <Mail className="w-3.5 h-3.5" />
        <span>+ Dispatch Beta Email</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-lg max-w-lg w-full p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative font-sans text-slate-100 animate-in fade-in zoom-in duration-150">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-5">
              <div>
                <h3 className="text-lg font-display font-bold uppercase tracking-widest text-[#00c8ff] flex items-center gap-2">
                  <Send className="w-4 h-4" /> Send Beta Guide & Access
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">Dispatches branded HTML email + attached Parent Setup Guide PDF via Amazon SES</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded mb-4 text-xs font-mono flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}
              >
                {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Recipient Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. mystiquen21@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00c8ff] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Parent Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mystique"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full bg-[#020617] border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00c8ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Teen/Student Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lyric"
                    value={teenName}
                    onChange={(e) => setTeenName(e.target.value)}
                    className="w-full bg-[#020617] border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00c8ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Promo / Waiver Code
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded px-3 py-2 text-sm text-[#00c8ff] font-mono font-bold focus:outline-none focus:border-[#00c8ff]"
                />
              </div>

              <div className="p-3 bg-slate-900/80 rounded border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>📎 Attachment: Parent_Setup_Guide.pdf</span>
                <span className="text-emerald-400">Ready</span>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#00c8ff] hover:bg-white text-black text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,200,255,0.4)] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Beta Package</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
