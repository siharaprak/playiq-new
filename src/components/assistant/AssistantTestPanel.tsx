'use client';

import React, { useState, useEffect } from 'react';
import { Send, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import { chatWithAssistant, markAssistantBetaComplete } from '@/lib/assistant/actions';
import { isAssistantBuildComplete } from '@/lib/assistant/assistant-build-policy';
import type { AssistantProfile, AssistantVersion, KnowledgeFile } from '@/lib/assistant/types';

interface AssistantTestPanelProps {
  profile: AssistantProfile;
  versions: AssistantVersion[];
  knowledgeFiles: KnowledgeFile[];
  onProfileUpdate: (updated: AssistantProfile) => void;
  disabled?: boolean;
}

export default function AssistantTestPanel({
  profile,
  versions,
  knowledgeFiles,
  onProfileUpdate,
  disabled = false,
}: AssistantTestPanelProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [hasTested, setHasTested] = useState(false);

  // Check completion criteria
  const completion = isAssistantBuildComplete(
    profile,
    versions,
    knowledgeFiles,
    hasTested || !!(profile.metadata?.test_log && profile.metadata.test_log.length > 0)
  );

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    setError(null);
    setLoading(true);

    const userMessage = { role: 'user' as const, content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    try {
      const result = await chatWithAssistant(profile.id, updatedMessages);
      if (result.ok) {
        setMessages((prev) => [...prev, { role: 'model', content: result.data }]);
        setHasTested(true);
      } else {
        setError(result.error);
        // Remove the user's message from the visible list if it failed before sending/processing
        setMessages((prev) => prev.slice(0, -1));
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send message to the assistant.');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!completion.complete || completing) return;
    setError(null);
    setCompleting(true);

    try {
      const result = await markAssistantBetaComplete(profile.id);
      if (result.ok) {
        onProfileUpdate(result.data);
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to mark beta complete.');
    } finally {
      setCompleting(false);
    }
  };

  const isBetaComplete = !!profile.metadata?.beta_complete;

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* Sandbox Workspace Title */}
      <div className="border border-slate-800 bg-slate-950/40 p-4 rounded-lg flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#00c8ff] mt-0.5 flex-shrink-0" />
        <div className="space-y-1 text-slate-400">
          <p className="text-[#00c8ff] font-bold uppercase tracking-wider">Interactive Test Sandbox</p>
          <p>
            Test your assistant configuration in real-time. Verify its responses, check that it stays within its defined boundaries, and ensure it respects the PlayIQ Integrity Rules.
          </p>
        </div>
      </div>

      {/* Completion Criteria Status Card */}
      <div className="border border-slate-800 bg-black/45 p-5 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Beta Release Criteria</span>
          <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${completion.complete ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
            {completion.completionPercent}% READY
          </span>
        </div>

        {/* Missing criteria list */}
        {!isBetaComplete && completion.missingItems.length > 0 && (
          <div className="space-y-1 text-[10px] text-slate-500">
            <p className="text-slate-400 font-bold">Pending Tasks:</p>
            {completion.missingItems.map((item, idx) => (
              <p key={idx} className="flex items-center gap-1.5">
                <span className="text-amber-500">•</span> {item}
              </p>
            ))}
          </div>
        )}

        {/* Beta completion action */}
        {isBetaComplete ? (
          <div className="p-3 bg-green-950/20 border border-green-500/20 text-green-400 flex items-center gap-2 rounded">
            <CheckCircle className="w-4 h-4" />
            <span>Assistant Beta Cycle is complete. Status is ACTIVE.</span>
          </div>
        ) : (
          <div className="pt-2 border-t border-slate-900 flex flex-col gap-2">
            <div className="text-[10px] text-slate-500 italic">
              Wording: Mark assistant profile beta_complete when criteria pass.
            </div>
            <button
              onClick={handleMarkComplete}
              disabled={!completion.complete || completing}
              className={`w-full py-2.5 rounded font-bold uppercase tracking-wider text-center transition-all ${
                completion.complete
                  ? 'bg-green-500 hover:bg-green-600 text-slate-950 shadow-[0_0_10px_rgba(34,197,94,0.2)] cursor-pointer'
                  : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {completing ? 'Completing Beta...' : 'Mark Assistant Beta Complete'}
            </button>
          </div>
        )}
      </div>

      {/* Chat messages list */}
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-black/30 flex flex-col h-[320px]">
        {/* Messages viewport */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0 select-text">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center px-4">
              <Sparkles className="w-8 h-8 text-slate-700 mb-2" />
              <p className="uppercase tracking-widest text-[10px]">Sandbox Conversation History</p>
              <p className="text-[9px] mt-1">Send a message below to start testing.</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              const bg = isUser ? 'bg-slate-900/60 border border-slate-800 text-slate-200' : 'bg-[#7b4fce]/10 border border-[#7b4fce]/20 text-[#be9ff0]';
              const label = isUser ? 'Apprentice' : 'Custom Assistant';
              return (
                <div key={idx} className={`space-y-1 ${isUser ? 'text-right' : 'text-left'}`}>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">{label}</span>
                  <div className={`p-3 rounded-lg max-w-[85%] inline-block text-left leading-relaxed whitespace-pre-wrap ${bg}`}>
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
          {loading && (
            <div className="text-left space-y-1">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Custom Assistant</span>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-900 text-slate-400 inline-flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7b4fce]" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="p-3 border-t border-slate-800 bg-black/50">
          {error && (
            <div className="mb-2 p-2 border border-red-500/20 bg-red-950/20 rounded text-red-400 text-[10px] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={disabled || loading}
              placeholder="Type test message... e.g. How does this algorithm work?"
              className="flex-1 bg-black/60 border border-slate-800 focus:border-[#00c8ff] rounded px-3 py-2 text-xs outline-none transition-colors text-slate-100 disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={disabled || loading || !input.trim()}
              className="px-4 bg-[#7b4fce] hover:bg-[#7b4fce]/90 text-white rounded font-bold uppercase transition-colors flex items-center justify-center disabled:opacity-50"
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
