'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

// Lightweight markdown renderer for chat messages
function renderMarkdown(text: string) {
  // Split by double newlines for paragraphs, single newlines for line breaks
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    let processed = line;

    // Bold: **text** or __text__
    processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic: *text* or _text_
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

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function ChatBot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm Agent PiQ, your PlayIQ AI Guide. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();
  }, [pathname]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Only show when user is logged in
  if (!isLoggedIn) {
    return null;
  }

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 400); // Wait for the fade-out-down animation to finish
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to UI
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Determine module context from URL (e.g., /student/modules/1/...)
      const match = pathname.match(/\/student\/modules\/(\d+)/);
      const moduleId = match ? match[1] : 'unknown';

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          moduleId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('No reader available');
      }

      // Add a placeholder message for the bot
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      let botResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        botResponse += chunk;
        
        // Update the last message (the bot's message) with the new chunk
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = botResponse;
          return updated;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev, 
        { role: 'model', content: "Sorry, my circuits are a bit scrambled right now. Please try again later!" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#020617] border-2 border-[#00c8ff] text-[#00c8ff] shadow-[0_0_15px_rgba(0,200,255,0.3)] hover:shadow-[0_0_25px_rgba(0,200,255,0.6)] hover:bg-[rgba(0,200,255,0.1)] transition-all duration-300 group animate-bounce-slow"
          aria-label="Open Agent PiQ Chat"
        >
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Expanded Chat Panel */}
      {isOpen && (
        <div className={`!fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col glass-card rounded-xl overflow-hidden shadow-2xl ${isClosing ? 'animate-fade-out-down' : 'animate-fade-in-up'} border border-[#00c8ff]/40`}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#00c8ff]/20 bg-[#020617]/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#020617] border border-[#7b4fce] flex items-center justify-center text-[#7b4fce] shadow-[0_0_10px_rgba(123,79,206,0.3)]">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm tracking-wider text-[#e2e8f0]">AGENT <span className="text-[#00c8ff]">PIQ</span></h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] shadow-[0_0_5px_#39ff14]"></div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-slate-400 hover:text-[#7b4fce] transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#0b1120]/60 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
                  msg.role === 'user' 
                    ? 'bg-[#020617] border-[#00c8ff] text-[#00c8ff]' 
                    : 'bg-[#020617] border-[#7b4fce] text-[#7b4fce]'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#00c8ff]/10 border border-[#00c8ff]/30 text-white rounded-tr-none'
                    : 'bg-[#7b4fce]/10 border border-[#7b4fce]/30 text-slate-200 rounded-tl-none'
                }`}>
                  {msg.role === 'model' ? renderMarkdown(msg.content) : msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border bg-[#020617] border-[#7b4fce] text-[#7b4fce]">
                  <Bot size={16} />
                </div>
                <div className="p-3 rounded-xl bg-[#7b4fce]/10 border border-[#7b4fce]/30 text-slate-200 rounded-tl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#7b4fce] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#7b4fce] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#7b4fce] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-[#00c8ff]/20 bg-[#020617]/80">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Agent PiQ..."
                className="w-full bg-[#0b1120] border border-[#00c8ff]/30 rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-[#00c8ff] focus:shadow-[0_0_10px_rgba(0,200,255,0.2)] transition-all placeholder:text-slate-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-1.5 text-[#00c8ff] hover:bg-[#00c8ff]/20 rounded-md transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-display">Powered by Gemini</span>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
