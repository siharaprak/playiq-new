'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { chatWithTutor } from '@/lib/tutor/actions';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface TutorTestSandboxProps {
  profileId: string;
  tutorName: string;
  disabled?: boolean;
}

// Lightweight markdown renderer for chat messages
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    let processed = line;

    // Bold: **text**
    processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic: *text*
    processed = processed.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

    // Inline code: `text`
    processed = processed.replace(/`(.+?)`/g, '<code style="background:rgba(0,200,255,0.15);padding:1px 4px;border-radius:3px;font-size:0.85em">$1</code>');

    // Bullet points: lines starting with - or *
    const isBullet = /^\s*[-*]\s+/.test(processed);
    if (isBullet) {
      processed = processed.replace(/^\s*[-*]\s+/, '');
      elements.push(
        <div key={i} className="flex gap-2 ml-1">
          <span className="text-[#00c8ff] flex-shrink-0">▸</span>
          <span dangerouslySetInnerHTML={{ __html: processed }} />
        </div>
      );
    } else if (processed.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: processed }} />
          {i < lines.length - 1 && <br />}
        </span>
      );
    }
  });

  return <>{elements}</>;
}

export default function TutorTestSandbox({
  profileId,
  tutorName,
  disabled = false,
}: TutorTestSandboxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: `Hello! I am ${tutorName}, your custom AI Tutor. Ask me any question, or test how I explain things according to your preferences!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || disabled) return;

    const userMsg = input.trim();
    setInput('');
    setErrorMsg(null);

    const updatedMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const result = await chatWithTutor(profileId, updatedMessages);
      if (!result.ok) throw new Error(result.error);

      setMessages((prev) => [...prev, { role: 'model', content: result.data }]);
    } catch (err: any) {
      console.error('Tutor sandbox chat error:', err);
      setErrorMsg(err.message || 'Failed to get a response from your tutor.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'model',
        content: `Chat cleared. Hello! I am ${tutorName}, your custom AI Tutor. How can I help you today?`,
      },
    ]);
    setErrorMsg(null);
  };

  const handlePresetClick = (prompt: string) => {
    setInput(prompt);
  };

  const presets = [
    'Explain the importance of the verification habit.',
    'Test my understanding of choosing the right AI mode.',
    'Give me a Socratic prompt about question laddering.',
  ];

  return (
    <div className="border border-slate-800 bg-black/40 rounded-xl overflow-hidden flex flex-col h-[500px]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-black/60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00c8ff] animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#00c8ff] font-bold">
            Test Your Tutor Style: {tutorName}
          </span>
        </div>
        <button
          type="button"
          onClick={handleClearChat}
          className="text-slate-500 hover:text-red-400 p-1.5 transition-colors"
          title="Clear Chat"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <div className="border border-[#39ff14]/20 bg-[#39ff14]/5 px-3 py-2 rounded flex items-start gap-2.5 mb-2">
          <ShieldCheck className="w-4 h-4 text-[#39ff14] flex-shrink-0 mt-0.5" />
          <p className="font-mono text-[10px] text-slate-400 leading-normal">
            This is a private testing sandbox. Responses here reflect your current saved tutor configuration (doctrine config, instructions, and rules).
          </p>
        </div>

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border text-[10px] ${
                msg.role === 'user'
                  ? 'bg-black border-[#00c8ff] text-[#00c8ff]'
                  : 'bg-black border-[#7b4fce] text-[#7b4fce]'
              }`}
            >
              {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
            </div>
            <div
              className={`p-3 rounded-lg text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#00c8ff]/10 border border-[#00c8ff]/25 text-[var(--text-primary)] rounded-tr-none'
                  : 'bg-[#7b4fce]/10 border border-[#7b4fce]/25 text-slate-300 rounded-tl-none'
              }`}
            >
              {msg.role === 'model' ? renderMarkdown(msg.content) : msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border bg-black border-[#7b4fce] text-[#7b4fce]">
              <Bot size={12} />
            </div>
            <div className="p-3 rounded-lg bg-[#7b4fce]/10 border border-[#7b4fce]/25 text-slate-300 rounded-tl-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#7b4fce] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-[#7b4fce] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-[#7b4fce] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 border border-red-500/20 rounded bg-red-950/20 text-red-400 font-mono text-[10px] text-center">
            ⚠ {errorMsg}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {!disabled && messages.length === 1 && (
        <div className="px-4 py-2 border-t border-slate-800 bg-black/20 flex flex-wrap gap-2 items-center">
          <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">Test Prompts:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetClick(p)}
              className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-[#00c8ff]/40 text-slate-400 hover:text-slate-200 transition-all font-mono text-[9px] rounded flex items-center gap-1"
            >
              {p.slice(0, 35)}... <ArrowRight size={8} />
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800 bg-black/60 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={disabled ? 'Tutor build is locked' : 'Test your tutor style...'}
          disabled={loading || disabled}
          className="flex-1 bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded px-3 py-2 text-xs text-white placeholder:text-slate-600 font-mono outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading || disabled}
          className="p-2 bg-[#00c8ff] hover:bg-[#00c8ff]/80 disabled:opacity-40 text-black rounded transition-colors"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
