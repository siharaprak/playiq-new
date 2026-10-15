'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp, Sparkles, Loader2, AlertCircle, MessageSquare, X } from 'lucide-react';
import { ModeSelector } from './ModeSelector';
import { GuidedAiResponse } from './GuidedAiResponse';
import type { GuidedAiModeId, GuidedAiResponseData, LearnYourWayPreferences } from '@/lib/guided-ai/types';
import { OrionCharacter } from './OrionCharacter';
import { CHARACTER_ACTION_EVENT_PROTOCOL, syncCharacterWithGuidedAiResponse } from '@/lib/orion/action-contract';
import { emitOrionCharacterAction, emitOrionReaction, selectLocalReactionForGuidedAiResponse, setOrionThinking } from '@/lib/orion/local-events';
import { ORION_AVATAR_URL, preloadOrion } from '@/lib/orion/scene-cache';

interface GuidedAIPanelProps {
  moduleNumber?: number;
  nodeId?: string;
  pageType?: string;
  isFloating?: boolean;
  hasProgress?: boolean;
  studentName?: string;
  studentId?: string;
  /** Release gate for the draft 3D Orion asset; false shows the static avatar. */
  orion3d?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  selectedText?: string;
  studentAttempt?: string;
  response?: GuidedAiResponseData;
  error?: string;
  isWelcome?: boolean;
}

const MODE_WELCOME_MESSAGES: Record<GuidedAiModeId, string> = {
  chat: "Hello! Let's chat about this lesson, coding, or logic. Ask me anything!",
  explain: "Hi! I'm here in Explain Mode. Ask me to explain any concept from this lesson in simpler language.",
  hint: "Stuck on a problem? Tell me what you're working on and what you've tried so far, and I'll give you a nudge in the right direction.",
  quiz: "Ready for some practice? Tell me what topic you want to test your skills on, and I'll generate some custom questions for you.",
  coach: "Need help planning your study sessions, staying focused, or building confidence? Ask me, and let's make a plan.",
  learn_your_way: "Let's discover your learning style! Fill out the preferences below or describe how you learn best to build your profile.",
  lesson_rescue_stub: "Lesson Rescue is in preview. Describe what is confusing you, and we will figure it out.",
  lesson_rescue: "Spotted a confusing sentence or concept in the lesson? Paste it below or describe it, and let's get you back on track."
};

const HINT_LEVEL_LABELS: Record<1 | 2 | 3, { name: string; color: string }> = {
  1: { name: 'Nudge', color: 'var(--neon-green)' },
  2: { name: 'Direction', color: 'var(--neon-cyan)' },
  3: { name: 'Micro-example', color: 'var(--neon-purple)' },
};

const ORION_NUDGES: Record<string, string> = {
  activity: 'Stuck? I’ve got hint fuel ⚡',
  lesson: 'Confusing bit? I can explain it another way 💡',
  boss_battle: 'Boss fight! Want a strategy nudge? ⚔️',
};
const NUDGE_DELAY_MS = 90_000;
const NUDGE_COOLDOWN_MS = 10 * 60_000;

export function GuidedAIPanel({ 
  moduleNumber, 
  nodeId, 
  pageType, 
  isFloating = false,
  hasProgress = true,
  studentName = 'Student',
  studentId,
  orion3d = true,
}: GuidedAIPanelProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showAwakeAnimation, setShowAwakeAnimation] = useState(false);
  const [activeMode, setActiveMode] = useState<GuidedAiModeId | null>(null);
  const [message, setMessage] = useState('');
  const [studentAttempt, setStudentAttempt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lywPrefs, setLywPrefs] = useState<LearnYourWayPreferences>({});
  const [showAttemptField, setShowAttemptField] = useState(false);
  const [showSelectedTextField, setShowSelectedTextField] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageScrollRef = useRef<HTMLDivElement>(null);

  // Sprint 4C: ephemeral local state for hint ladder + retry + teach-back
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);
  const [retryCount, setRetryCount] = useState(0);
  const [teachBackActive, setTeachBackActive] = useState(false);
  const [teachBackInput, setTeachBackInput] = useState('');

  // Extract parameters dynamically if floating
  let activeModuleNumber = moduleNumber ?? 1;
  let activeNodeId = nodeId;
  let activePageType = pageType;

  const isStudentRoute = !isFloating || (pathname?.startsWith('/student') ?? false);

  if (isFloating && pathname?.startsWith('/student')) {
    const match = pathname?.match(/\/student\/modules\/(\d+)/);
    if (match) {
      activeModuleNumber = parseInt(match[1]);
    } else {
      activeModuleNumber = 1;
    }

    const nodeMatch = pathname?.match(/\/nodes\/([^/]+)/);
    if (nodeMatch) {
      activeNodeId = nodeMatch[1];
    }

    if (pathname?.includes('/lesson')) {
      activePageType = 'lesson';
    } else if (pathname?.includes('/activity')) {
      activePageType = 'activity';
    } else if (pathname?.includes('/boss-battle')) {
      activePageType = 'boss_battle';
    } else if (pathname?.includes('/overview')) {
      activePageType = 'overview';
    } else {
      activePageType = 'lesson';
    }
  }

  // Scroll only the conversation, leaving the character visible above it.
  const scrollToBottom = () => {
    const container = messageScrollRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading, teachBackActive]);

  // Contextual launcher nudge: only on module pages, after a quiet spell, rate-limited per session.
  const [nudge, setNudge] = useState<{ path: string; text: string } | null>(null);
  useEffect(() => {
    if (!isFloating || isOpen || !pathname?.startsWith('/student/modules')) return;
    const text = activePageType ? ORION_NUDGES[activePageType] : undefined;
    if (!text) return;
    const timer = window.setTimeout(() => {
      try {
        const key = 'playiq_orion_last_nudge';
        const last = Number(window.sessionStorage.getItem(key) || 0);
        if (Date.now() - last < NUDGE_COOLDOWN_MS) return;
        window.sessionStorage.setItem(key, String(Date.now()));
      } catch {
        // sessionStorage unavailable: still show the nudge once for this page.
      }
      setNudge({ path: pathname, text });
    }, NUDGE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isFloating, isOpen, pathname, activePageType]);
  const visibleNudge = nudge && nudge.path === pathname && !isOpen ? nudge.text : null;

  const openOrion = () => {
    setNudge(null);
    setIsOpen(true);
  };

  useEffect(() => {
    // If it's a new student on the dashboard and they manually open Orion, greet them with the onboarding walkthrough
    if (isOpen && isFloating && pathname === '/student/home' && !hasProgress && studentId) {
      const alreadyOpened = sessionStorage.getItem(`playiq_orion_auto_opened_${studentId}`);
      if (!alreadyOpened) {
        setActiveMode('chat');
        setMessages([
          {
            id: 'onboarding-walkthrough',
            role: 'model',
            content: `👋 Hello, Apprentice ${studentName}! I am Orion, your AI learning partner.

Since this is a new student account, let's run a quick simulation of how you will navigate the course:

1. 🌲 **Skill Tree:** You will unlock and complete 11 training modules in sequential order.
2. 📖 **Nodes:** Each module has interactive lesson nodes. You must write out your attempted approach before asking me for hints! No lazy prompt cheats allowed.
3. ⚔️ **Quizzes & Bosses:** Master all nodes in a module to unlock the Quiz. Score 80%+ to unlock the Boss Battle simulation.
4. 🛡️ **Proof:** Defeat the Boss to unlock the Proof Artifacts step. Upload your work to unlock the next module!

Try asking me "tell me about the first module" or "how do I earn hints?" to simulate how I can assist you.`,
            isWelcome: true
          }
        ]);
        sessionStorage.setItem(`playiq_orion_auto_opened_${studentId}`, 'true');
      }
    }
  }, [isOpen, isFloating, pathname, hasProgress, studentId, studentName]);

  const handleModeSelect = (mode: GuidedAiModeId) => {
    setActiveMode(mode);
    setError(null);
    setShowAttemptField(mode === 'hint' || mode === 'quiz' || mode === 'lesson_rescue');
    setShowSelectedTextField(mode === 'lesson_rescue');
    setSelectedText('');
    setHintLevel(1);
    setRetryCount(0);
    setTeachBackActive(false);
    setTeachBackInput('');
    setStudentAttempt('');

    if (mode === 'learn_your_way') {
      setMessage('Help me discover my learning style');
    } else {
      setMessage('');
    }

    // Set initial welcome message
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        content: MODE_WELCOME_MESSAGES[mode],
        isWelcome: true
      }
    ]);

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const latestResponse = messages.length > 0 ? messages[messages.length - 1].response : undefined;

  const simulateGuidedAiReply = (refused: boolean) => {
    const data: GuidedAiResponseData = {
      mode: 'chat',
      response: refused
        ? 'I can help you work through the problem, but I cannot provide the completed answer.'
        : 'Let’s take this one step at a time. What part feels unclear?',
      integrityAction: refused ? 'refused' : 'allowed',
      // The refusal intentionally carries an action to check the fail-closed boundary.
      characterAction: { protocol: CHARACTER_ACTION_EVENT_PROTOCOL, action: refused ? 'cheer' : 'wave' },
    };
    setActiveMode('chat');
    setMessages((previous) => [
      ...previous.filter((item) => !item.id.startsWith('orion-simulated-')),
      { id: `orion-simulated-${crypto.randomUUID()}`, role: 'model', content: data.response, response: data },
    ]);
    syncCharacterWithGuidedAiResponse(data);
  };

  const resetTestChat = () => {
    if (isLoading) return;
    setMessages([]);
    setActiveMode(null);
    setMessage('');
    setStudentAttempt('');
    setSelectedText('');
    setTeachBackInput('');
    setTeachBackActive(false);
    setShowAttemptField(false);
    setShowSelectedTextField(false);
    setHintLevel(1);
    setRetryCount(0);
    setError(null);
    messageScrollRef.current?.scrollTo({ top: 0 });
  };

  /**
   * Single Guided AI round-trip shared by ask, teach-back and next-hint.
   * Drives Orion's thinking state, the fail-closed gesture sync and the
   * trusted local reactions (encourage / proud).
   */
  const requestGuidedAi = async (
    body: Record<string, unknown>,
    botMsgId: string,
    context: 'reply' | 'teach_back',
    onData?: (data: GuidedAiResponseData) => void,
  ) => {
    setIsLoading(true);
    setError(null);
    setOrionThinking(true);

    try {
      if (activeNodeId) body.nodeId = activeNodeId;
      const res = await fetch('/api/guided-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        const errorText = json.error || 'Something went wrong. Please try again.';
        setError(errorText);
        setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, error: errorText } : m));
        setOrionThinking(false);
        emitOrionCharacterAction('concerned');
        return;
      }

      const data = json.data as GuidedAiResponseData;
      setOrionThinking(false);
      const gestured = syncCharacterWithGuidedAiResponse(data);
      const localReaction = selectLocalReactionForGuidedAiResponse(data, context);
      if (localReaction && (!gestured || context === 'teach_back')) emitOrionReaction(localReaction);

      setMessages(prev => prev.map(m => m.id === botMsgId ? {
        ...m,
        content: data.response,
        response: data
      } : m));

      if (data.effortRequired) {
        setShowAttemptField(true);
      }
      setTeachBackActive(Boolean(data.teachBackRequired));
      onData?.(data);
    } catch {
      const errorText = 'Connection error. Please check your internet and try again.';
      setError(errorText);
      setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, error: errorText } : m));
      emitOrionCharacterAction('concerned');
    } finally {
      setOrionThinking(false);
      setIsLoading(false);
    }
  };

  const newMessageIds = () => [
    Math.random().toString(36).substring(7),
    Math.random().toString(36).substring(7),
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMode || !message.trim() || isLoading) return;

    const userMsgText = message.trim();
    const userSelectedText = selectedText.trim();
    const userAttemptText = studentAttempt.trim();

    setMessage('');
    setSelectedText('');
    setStudentAttempt('');

    const [userMsgId, botMsgId] = newMessageIds();

    setMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        role: 'user',
        content: userMsgText,
        selectedText: userSelectedText || undefined,
        studentAttempt: userAttemptText || undefined
      },
      {
        id: botMsgId,
        role: 'model',
        content: '',
      }
    ]);

    const body: Record<string, unknown> = {
      mode: activeMode,
      moduleNumber: activeModuleNumber,
      message: userMsgText,
      pageType: activePageType || 'lesson',
    };

    if (userAttemptText) body.studentAttempt = userAttemptText;
    if (userSelectedText) body.selectedText = userSelectedText;

    if (activeMode === 'hint') {
      body.hintLevel = hintLevel;
      body.retryCount = retryCount;
    }
    if (activeMode === 'quiz') {
      body.retryCount = retryCount;
    }

    if (activeMode === 'learn_your_way' && Object.keys(lywPrefs).length > 0) {
      body.preferences = lywPrefs;
    }

    await requestGuidedAi(body, botMsgId, 'reply', (data) => {
      if (data.integrityAction === 'refused') {
        setRetryCount(prev => prev + 1);
      }
    });
  };

  const handleTeachBackSubmit = async () => {
    if (!teachBackInput.trim() || isLoading) return;
    
    const inputVal = teachBackInput.trim();
    setTeachBackInput('');
    setTeachBackActive(false);

    const [userMsgId, botMsgId] = newMessageIds();

    setMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        role: 'user',
        content: `🎓 Teach Back: ${inputVal}`,
        studentAttempt: inputVal
      },
      {
        id: botMsgId,
        role: 'model',
        content: ''
      }
    ]);

    setRetryCount(prev => prev + 1);

    const body: Record<string, unknown> = {
      mode: activeMode,
      moduleNumber: activeModuleNumber,
      message: inputVal,
      studentAttempt: inputVal,
      pageType: activePageType || 'lesson',
    };

    if (activeMode === 'hint') {
      body.hintLevel = hintLevel;
      body.retryCount = retryCount + 1;
    }
    if (activeMode === 'quiz') {
      body.retryCount = retryCount + 1;
    }

    await requestGuidedAi(body, botMsgId, 'teach_back');
  };

  const handleNextHint = () => {
    if (hintLevel < 3) {
      const nextLevel = Math.min(3, hintLevel + 1) as 1 | 2 | 3;
      setHintLevel(nextLevel);
      setTeachBackActive(false);
      setTeachBackInput('');

      const [userMsgId, botMsgId] = newMessageIds();

      setMessages(prev => [
        ...prev,
        {
          id: userMsgId,
          role: 'user',
          content: `➡️ Requesting Hint Level ${nextLevel}: ${HINT_LEVEL_LABELS[nextLevel].name}`,
        },
        {
          id: botMsgId,
          role: 'model',
          content: ''
        }
      ]);

      void requestGuidedAi({
        mode: 'hint',
        moduleNumber: activeModuleNumber,
        message: `Hint Level ${nextLevel}`,
        pageType: activePageType || 'lesson',
        hintLevel: nextLevel,
        retryCount: retryCount,
      }, botMsgId, 'reply');
    }
  };

  const renderMessageThread = () => {
    if (!activeMode) {
      return (
        <div className="space-y-4 animate-fade-in">
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            Choose a study tool to get started. Orion will help you work through the lesson step by step.
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[var(--text-muted)]">
                Select Study Tool
              </span>
              <span className="h-[1px] bg-[var(--glass-border)] flex-grow ml-3 opacity-50"></span>
            </div>
            <div className="p-3 rounded-xl border border-[var(--glass-border)] shadow-inner" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
              <ModeSelector
                activeMode={activeMode}
                onSelectMode={handleModeSelect}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4" role="log" aria-label="Orion chat messages" aria-live="polite" aria-relevant="additions text">
        {messages.map((msg) => {
          if (msg.role === 'user') {
            return (
              <div key={msg.id} className="flex justify-end animate-fade-in">
                <div className="max-w-[85%] bg-gradient-to-br from-[rgba(0,200,255,0.15)] to-[rgba(0,200,255,0.03)] border border-[rgba(0,200,255,0.22)] text-[var(--text-primary)] rounded-2xl rounded-tr-none px-4 py-3 text-sm shadow-[0_3px_10px_rgba(0,0,0,0.2)] space-y-2">
                  {msg.selectedText && (
                    <div className="text-[9px] text-[var(--neon-cyan)] uppercase tracking-wider font-mono px-2 py-1 rounded bg-[rgba(0,200,255,0.08)] border border-[rgba(0,200,255,0.15)] max-h-16 overflow-y-auto custom-scrollbar select-text">
                      🔍 Excerpt: &ldquo;{msg.selectedText}&rdquo;
                    </div>
                  )}
                  {msg.studentAttempt && (
                    <div className="text-[9px] text-[var(--neon-purple-light)] uppercase tracking-wider font-mono px-2 py-1 rounded bg-[rgba(123,79,206,0.08)] border border-[rgba(123,79,206,0.15)] max-h-16 overflow-y-auto custom-scrollbar select-text">
                      ✏️ Attempt: &ldquo;{msg.studentAttempt}&rdquo;
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed select-text">{msg.content}</p>
                </div>
              </div>
            );
          }

          // Orion (model) reply
          return (
            <div key={msg.id} className="flex gap-3 animate-fade-in items-start">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--neon-purple)] flex-shrink-0 shadow-[0_0_8px_rgba(123,79,206,0.3)] mt-0.5" style={{ backgroundColor: 'var(--space-deep)' }}>
                <img src={ORION_AVATAR_URL} alt="Orion" className="orion-avatar-image" />
              </div>
              <div className="flex-1 max-w-[85%] space-y-1">
                <div className="text-[9px] text-[var(--text-muted)] font-mono tracking-widest uppercase font-bold pl-1">
                  Orion
                </div>
                
                {msg.content || msg.response ? (
                  msg.response ? (
                    <GuidedAiResponse data={msg.response} />
                  ) : (
                    <div className="p-3.5 rounded-2xl rounded-tl-none border border-[var(--neon-purple)]/30 bg-[rgba(123,79,206,0.05)] text-[var(--text-primary)] text-sm leading-relaxed whitespace-pre-wrap card-accent-purple shadow-sm select-text">
                      {msg.content}
                    </div>
                  )
                ) : msg.error ? (
                  <div className="p-3.5 rounded-2xl rounded-tl-none border border-red-500/30 bg-red-500/5 text-red-400 text-sm leading-relaxed flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="select-text">{msg.error}</span>
                  </div>
                ) : (
                  // Thinking dots animation
                  <div className="inline-flex p-3 px-4 rounded-2xl rounded-tl-none border border-[rgba(123,79,206,0.2)] bg-[rgba(123,79,206,0.03)] items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 bg-[var(--neon-cyan)] shadow-[0_0_5px_var(--neon-cyan)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[#9b6fe8] shadow-[0_0_5px_#9b6fe8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[var(--neon-purple)] shadow-[0_0_5px_var(--neon-purple)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderInputForm = () => {
    return (
      <form id="guided-ai-form" onSubmit={handleSubmit} className="space-y-3">
        {/* Learn Your Way preference selectors */}
        {activeMode === 'learn_your_way' && messages.length === 1 && (
          <div className="grid grid-cols-2 gap-2 bg-[rgba(0,0,0,0.2)] p-3 rounded-lg border border-[var(--glass-border)] shadow-inner">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider block mb-1 text-[var(--text-muted)]">
                Explain with
              </label>
              <select
                value={lywPrefs.explanation_style || ''}
                onChange={(e) => setLywPrefs(p => ({ ...p, explanation_style: e.target.value as LearnYourWayPreferences['explanation_style'] || undefined }))}
                className="w-full bg-[var(--space-mid)] border border-[var(--glass-border)] rounded-md px-2 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)]"
              >
                <option value="">Choose...</option>
                <option value="examples">Examples</option>
                <option value="steps">Step-by-step</option>
                <option value="analogy">Analogies</option>
                <option value="plain">Plain text</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider block mb-1 text-[var(--text-muted)]">
                Pace
              </label>
              <select
                value={lywPrefs.pace_preference || ''}
                onChange={(e) => setLywPrefs(p => ({ ...p, pace_preference: e.target.value as LearnYourWayPreferences['pace_preference'] || undefined }))}
                className="w-full bg-[var(--space-mid)] border border-[var(--glass-border)] rounded-md px-2 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)]"
              >
                <option value="">Choose...</option>
                <option value="fast">Fast</option>
                <option value="moderate">Moderate</option>
                <option value="slow">Slow</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider block mb-1 text-[var(--text-muted)]">
                Support style
              </label>
              <select
                value={lywPrefs.support_preference || ''}
                onChange={(e) => setLywPrefs(p => ({ ...p, support_preference: e.target.value as LearnYourWayPreferences['support_preference'] || undefined }))}
                className="w-full bg-[var(--space-mid)] border border-[var(--glass-border)] rounded-md px-2 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)]"
              >
                <option value="">Choose...</option>
                <option value="visual_analogy">Visual analogies</option>
                <option value="plain_explanation">Plain explanations</option>
                <option value="worked_examples">Worked examples</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider block mb-1 text-[var(--text-muted)]">
                Start with
              </label>
              <select
                value={lywPrefs.practice_preference || ''}
                onChange={(e) => setLywPrefs(p => ({ ...p, practice_preference: e.target.value as LearnYourWayPreferences['practice_preference'] || undefined }))}
                className="w-full bg-[var(--space-mid)] border border-[var(--glass-border)] rounded-md px-2 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)]"
              >
                <option value="">Choose...</option>
                <option value="practice_first">Practice first</option>
                <option value="explanation_first">Explanation first</option>
              </select>
            </div>
          </div>
        )}

        {/* Selected text field (Lesson Rescue mode) */}
        {showSelectedTextField && (
          <div className="p-2.5 rounded-lg border border-[var(--glass-border)] shadow-inner" style={{ backgroundColor: 'var(--space-deep)', opacity: 0.95 }}>
            <label className="text-[9px] font-bold uppercase tracking-wider block mb-1 text-[var(--neon-cyan)]">
              Confusing Excerpt
            </label>
            <textarea
              value={selectedText}
              onChange={(e) => setSelectedText(e.target.value)}
              placeholder="Paste the confusing sentence or paragraph here..."
              rows={2}
              maxLength={1000}
              className="w-full border rounded-lg px-2.5 py-1.5 text-xs resize-none focus:outline-none focus:border-[var(--neon-cyan)] focus:shadow-[0_0_8px_rgba(0,200,255,0.15)] transition-all placeholder:text-[var(--text-muted)]"
              style={{ borderColor: 'var(--glass-border)', color: 'var(--text-primary)', backgroundColor: 'var(--space-mid)' }}
            />
          </div>
        )}

        {/* Student attempt field (Hint / Quiz / Lesson Rescue modes) */}
        {showAttemptField && (
          <div className="p-2.5 rounded-lg border border-[var(--glass-border)] shadow-inner" style={{ backgroundColor: 'var(--space-deep)', opacity: 0.95 }}>
            <label className="text-[9px] font-bold uppercase tracking-wider block mb-1 text-[var(--text-muted)]">
              {latestResponse?.effortRequired ? '✏️ Your attempt (required for answer lock release)' : 'Your attempt (optional)'}
            </label>
            <textarea
              value={studentAttempt}
              onChange={(e) => setStudentAttempt(e.target.value)}
              placeholder={latestResponse?.effortRequired
                ? 'Share your thoughts or code outline to proceed...'
                : 'Share what you\'ve tried so far...'
              }
              rows={2}
              maxLength={2000}
              className="w-full border rounded-lg px-2.5 py-1.5 text-xs resize-none focus:outline-none transition-all placeholder:text-[var(--text-muted)]"
              style={{
                borderColor: latestResponse?.effortRequired ? 'var(--neon-cyan)' : 'var(--glass-border)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--space-mid)',
                boxShadow: latestResponse?.effortRequired ? '0 0 8px rgba(0,200,255,0.15)' : 'none',
              }}
            />
          </div>
        )}

        {/* Main message input */}
        <div className="relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={getPlaceholder(activeMode)}
            rows={2}
            maxLength={2000}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="w-full border border-[#00c8ff]/30 hover:border-[#00c8ff]/50 rounded-xl pl-3 pr-16 py-2.5 text-sm resize-none focus:outline-none focus:border-[#00c8ff] focus:shadow-[0_0_12px_rgba(0,200,255,0.25)] transition-all placeholder:text-[var(--text-muted)] custom-scrollbar leading-relaxed"
            style={{ color: 'var(--text-primary)', backgroundColor: 'var(--space-deep)' }}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="absolute right-2 bottom-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 shadow-md"
            style={{
              background: message.trim() && !isLoading ? 'var(--neon-cyan)' : 'var(--glass-bg)',
              color: message.trim() && !isLoading ? 'var(--space-deep)' : 'var(--text-muted)',
            }}
          >
            Ask
          </button>
        </div>
      </form>
    );
  };

  const renderPanelContents = () => {
    return (
      <div className="flex flex-col h-full">
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-3 rounded-lg border border-[var(--glass-border)] px-3 py-2 text-xs text-[var(--text-secondary)]">
            <summary className="cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)]">Simulate a Guided AI reply</summary>
            <p className="mt-2 leading-relaxed">Local test responses. No AI or database request is sent. Use Return to front before checking the refusal.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={() => simulateGuidedAiReply(false)} className="rounded-md border border-[var(--glass-border)] px-2 py-1.5 text-[var(--text-primary)] hover:border-[var(--neon-cyan)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)]">Allowed reply: wave</button>
              <button type="button" onClick={() => simulateGuidedAiReply(true)} className="rounded-md border border-[var(--glass-border)] px-2 py-1.5 text-[var(--text-primary)] hover:border-[var(--neon-cyan)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)]">Refused reply: no gesture</button>
            </div>
          </details>
        )}
        {/* Mode selector stays within the message area. */}
        {activeMode && (
          <div className="pb-3 border-b border-[var(--glass-border)] mb-4 flex items-center justify-between" style={{ backgroundColor: 'var(--space-deep)' }}>
            <ModeSelector
              activeMode={activeMode}
              onSelectMode={handleModeSelect}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1">
          {renderMessageThread()}
        </div>
      </div>
    );
  };

  const renderCharacterSection = () => (
    <div className="relative z-20 flex-none p-3 pb-0">
      <OrionCharacter compact={activeMode !== null} active={isOpen} enable3d={orion3d} studentName={studentName} />
    </div>
  );

  if (isFloating) {
    return (
      <>
        {/* Floating Toggle Button */}
        {!isOpen && (
          <div id="orion-floating-button" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 orion-launcher-bob">
            {visibleNudge && (
              <div className="orion-nudge absolute bottom-[4.25rem] right-0 w-56 rounded-2xl rounded-br-sm border border-[var(--neon-cyan)]/40 px-3 py-2 text-xs leading-snug text-[var(--text-primary)] shadow-[0_6px_24px_rgba(0,0,0,0.35)]" style={{ backgroundColor: 'var(--space-deep)' }}>
                <button type="button" onClick={openOrion} className="block w-full pr-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)]">
                  {visibleNudge}
                </button>
                <button type="button" onClick={() => setNudge(null)} className="absolute right-1.5 top-1.5 p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Dismiss Orion tip">
                  <X size={12} />
                </button>
              </div>
            )}

            {/* Ambient pulse shadow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--neon-cyan)] to-[var(--neon-purple)] opacity-40 blur-md animate-pulse"></div>
            
            <button
              type="button"
              onClick={openOrion}
              onPointerEnter={orion3d ? preloadOrion : undefined}
              onFocus={orion3d ? preloadOrion : undefined}
              onTouchStart={orion3d ? preloadOrion : undefined}
              className="w-full h-full rounded-full border-2 border-[var(--neon-cyan)] text-[var(--neon-cyan)] shadow-[0_0_18px_rgba(0,200,255,0.4)] hover:shadow-[0_0_25px_rgba(123,79,206,0.7)] hover:border-[var(--neon-purple)] transition-all duration-300 group focus:outline-none transform hover:-translate-y-0.5 hover:scale-105 flex items-center justify-center overflow-hidden relative cursor-pointer"
              style={{ backgroundColor: 'var(--space-deep)' }}
              aria-label="Open Orion Chat"
            >
              {/* Concentric border ring */}
              <div className="absolute inset-0.5 rounded-full border border-[var(--neon-purple)]/30 group-hover:border-[var(--neon-cyan)]/50 transition-colors z-10"></div>
              
              <img 
                src="/character-assets/orion/orion-avatar-256.webp"
                alt="Orion AI"
                className="orion-avatar-image"
              />
            </button>
            
            {/* Active online green dot badge */}
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--neon-green)] border-2 shadow-[0_0_8px_var(--neon-green)] z-20 pointer-events-none" style={{ borderColor: 'var(--space-deep)' }}></span>
          </div>
        )}

        {/* Expanded Chat Panel: stays mounted while hidden so Orion keeps his state and WebGL context. */}
        <div hidden={!isOpen}>
          <div 
            className={`!fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[410px] max-w-[410px] h-[580px] max-h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl ${isClosing ? 'animate-fade-out-down' : 'animate-fade-in-up'} border border-[var(--neon-cyan)]/30 backdrop-blur-xl`}
            style={{ background: 'linear-gradient(to bottom, var(--space-deep), var(--space-mid))', opacity: 0.98 }}
          >
            {/* Real chat panel contents */}
            <>
                {/* Cyber Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--neon-cyan)]/20 backdrop-blur-md" style={{ backgroundColor: 'var(--space-deep)' }}>
                  <div className="flex items-center gap-2.5">
                    <div>
                      <h3 className="font-display font-bold text-sm tracking-widest" style={{ color: 'var(--text-primary)' }}>
                        <span className="gradient-text-cyan text-glow-cyan font-bold">ORION</span>
                      </h3>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] shadow-[0_0_4px_var(--neon-green)]"></div>
                        <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-widest font-mono">ACTIVE STUDY PARTNER</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {process.env.NODE_ENV === 'development' && messages.length > 0 && (
                      <button type="button" onClick={resetTestChat} disabled={isLoading} className="text-xs text-[var(--neon-cyan)] hover:underline disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)]">Reset chat</button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsClosing(true);
                        setTimeout(() => {
                          setIsOpen(false);
                          setIsClosing(false);
                        }, 400);
                      }}
                      className="text-[var(--text-muted)] hover:text-[var(--neon-purple)] transition-colors p-1 transform hover:rotate-90 duration-300 bg-transparent border-0"
                      aria-label="Close Chat"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col" style={{ backgroundColor: 'var(--glass-bg)' }}>
                  {renderCharacterSection()}
                  <div
                    ref={messageScrollRef}
                    className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar"
                    style={{
                      maskImage: 'linear-gradient(to bottom, transparent 0, #000 1.25rem)',
                      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 1.25rem)',
                    }}
                  >
                    {renderPanelContents()}
                  </div>
                </div>

                {/* Sticky Bottom Input Area */}
                {activeMode && (
                  <div className="p-3.5 border-t border-[var(--glass-border)] backdrop-blur-md space-y-3.5 z-20" style={{ backgroundColor: 'var(--space-deep)' }}>
                    {/* Ephemeral actions/cards */}
                    {teachBackActive && latestResponse?.teachBackPrompt && !isLoading && (
                      <div
                        className="p-3.5 rounded-xl border space-y-2.5 bg-[rgba(123,79,206,0.06)] border-[var(--neon-purple)] card-accent-purple shadow-sm animate-fade-in"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider font-mono text-[var(--neon-purple-light)]">
                          🎓 Teach it back
                        </p>
                        <p className="text-xs leading-relaxed font-semibold select-text" style={{ color: 'var(--text-primary)' }}>
                          {latestResponse.teachBackPrompt}
                        </p>
                        <textarea
                          value={teachBackInput}
                          onChange={(e) => setTeachBackInput(e.target.value)}
                          placeholder="Explain this concept in your own words..."
                          rows={2}
                          maxLength={2000}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleTeachBackSubmit();
                            }
                          }}
                          className="w-full border border-[rgba(123,79,206,0.3)] hover:border-[rgba(123,79,206,0.5)] rounded-lg px-2.5 py-1.5 text-xs resize-none focus:outline-none focus:border-[var(--neon-purple)] focus:shadow-[0_0_8px_rgba(123,79,206,0.2)] transition-all placeholder:text-[var(--text-muted)]"
                          style={{ color: 'var(--text-primary)', backgroundColor: 'var(--space-deep)' }}
                        />
                        <button
                          type="button"
                          onClick={handleTeachBackSubmit}
                          disabled={!teachBackInput.trim() || isLoading}
                          className="px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                          style={{
                            background: teachBackInput.trim() ? 'var(--neon-purple)' : 'var(--glass-bg)',
                            color: teachBackInput.trim() ? '#fff' : 'var(--text-muted)',
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    )}

                    {activeMode === 'hint' && latestResponse && latestResponse.nextHintAvailable && !isLoading && !teachBackActive && (
                      <button
                        type="button"
                        onClick={handleNextHint}
                        className="w-full py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border font-mono hover:bg-[rgba(0,200,255,0.08)] duration-200 active:scale-[0.98]"
                        style={{
                          borderColor: 'var(--neon-cyan)',
                          color: 'var(--neon-cyan)',
                          background: 'rgba(0,200,255,0.04)',
                        }}
                      >
                        ➡️ Next Hint: {HINT_LEVEL_LABELS[Math.min(3, hintLevel + 1) as 1 | 2 | 3].name}
                      </button>
                    )}

                    {renderInputForm()}
                    
                    <div className="text-center pt-0.5">
                      <span className="text-[8px] uppercase tracking-widest font-mono text-[var(--text-muted)]">
                        Orion · Not an answer machine
                      </span>
                    </div>
                  </div>
                )}
              </>
          </div>
        </div>
      </>
    );
  }

  if (!isStudentRoute) return null;

  // Non-floating layout
  return (
    <div
      className="rounded-xl border overflow-hidden transition-all duration-300 flex flex-col h-[520px]"
      style={{
        background: 'var(--space-card)',
        borderColor: isOpen ? 'var(--neon-purple)' : 'var(--glass-border)',
      }}
    >
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 border-b border-[var(--glass-border)] transition-colors hover:bg-[rgba(123,79,206,0.05)] focus:outline-none bg-transparent"
        aria-expanded={isOpen}
        aria-controls="guided-ai-panel-content"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full overflow-hidden border border-[var(--neon-purple)] flex-shrink-0 shadow-[0_0_5px_rgba(123,79,206,0.2)]" style={{ backgroundColor: 'var(--space-deep)' }}>
            <img src={ORION_AVATAR_URL} alt="Orion" className="orion-avatar-image" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider font-display" style={{ color: 'var(--text-primary)' }}>
            Orion Panel
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        ) : (
          <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        )}
      </button>

      {/* Panel content */}
      {isOpen && (
        <div id="guided-ai-panel-content" className="flex-1 flex flex-col min-h-0 relative overflow-hidden" style={{ backgroundColor: 'var(--glass-bg)' }}>
          {/* Subtle light spots */}
          <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-[var(--neon-cyan)]/3 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full bg-[var(--neon-purple)]/3 blur-2xl pointer-events-none"></div>

          {renderCharacterSection()}
          <div ref={messageScrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar relative z-10">
            {renderPanelContents()}
          </div>
          
          {activeMode && (
            <div className="p-3 border-t border-[var(--glass-border)] space-y-3 z-10" style={{ backgroundColor: 'var(--space-deep)' }}>
              {teachBackActive && latestResponse?.teachBackPrompt && !isLoading && (
                <div className="p-3 rounded-xl border space-y-2 bg-[rgba(123,79,206,0.06)] border-[var(--neon-purple)] card-accent-purple shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider font-mono text-[var(--neon-purple-light)]">
                    🎓 Teach it back
                  </p>
                  <p className="text-xs leading-relaxed font-semibold select-text" style={{ color: 'var(--text-primary)' }}>
                    {latestResponse.teachBackPrompt}
                  </p>
                  <textarea
                    value={teachBackInput}
                    onChange={(e) => setTeachBackInput(e.target.value)}
                    placeholder="Explain this concept in your own words..."
                    rows={2}
                    maxLength={2000}
                    className="w-full border border-[rgba(123,79,206,0.3)] rounded-lg px-2.5 py-1.5 text-xs resize-none focus:outline-none focus:border-[var(--neon-purple)] transition-all placeholder:text-[var(--text-muted)]"
                    style={{ color: 'var(--text-primary)', backgroundColor: 'var(--space-deep)' }}
                  />
                  <button
                    type="button"
                    onClick={handleTeachBackSubmit}
                    disabled={!teachBackInput.trim() || isLoading}
                    className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all"
                    style={{
                      background: teachBackInput.trim() ? 'var(--neon-purple)' : 'var(--glass-bg)',
                      color: teachBackInput.trim() ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    Submit
                  </button>
                </div>
              )}

              {activeMode === 'hint' && latestResponse && latestResponse.nextHintAvailable && !isLoading && !teachBackActive && (
                <button
                  type="button"
                  onClick={handleNextHint}
                  className="w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border font-mono hover:bg-[rgba(0,200,255,0.06)]"
                  style={{
                    borderColor: 'var(--neon-cyan)',
                    color: 'var(--neon-cyan)',
                    background: 'rgba(0,200,255,0.03)',
                  }}
                >
                  ➡️ Next Hint: {HINT_LEVEL_LABELS[Math.min(3, hintLevel + 1) as 1 | 2 | 3].name}
                </button>
              )}

              {renderInputForm()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getPlaceholder(mode: GuidedAiModeId | null): string {
  switch (mode) {
    case 'chat': return 'Ask Orion a question or chat about your study concepts...';
    case 'explain': return 'What concept would you like explained?';
    case 'hint': return 'What are you stuck on? Describe the problem...';
    case 'quiz': return 'What topic should I quiz you on?';
    case 'coach': return 'What do you need help planning or focusing on?';
    case 'learn_your_way': return 'Tell me about how you learn best...';
    case 'lesson_rescue': return 'Describe what feels confusing or unclear...';
    default: return 'How can I help you learn?';
  }
}

