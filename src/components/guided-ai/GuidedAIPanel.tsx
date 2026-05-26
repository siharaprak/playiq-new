'use client';

import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { ModeSelector } from './ModeSelector';
import { GuidedAiResponse } from './GuidedAiResponse';
import type { GuidedAiModeId, GuidedAiResponseData, LearnYourWayPreferences } from '@/lib/guided-ai/types';

interface GuidedAIPanelProps {
  moduleNumber: number;
  nodeId?: string;
  pageType?: string;
}

export function GuidedAIPanel({ moduleNumber, nodeId, pageType }: GuidedAIPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<GuidedAiModeId | null>(null);
  const [message, setMessage] = useState('');
  const [studentAttempt, setStudentAttempt] = useState('');
  const [response, setResponse] = useState<GuidedAiResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lywPrefs, setLywPrefs] = useState<LearnYourWayPreferences>({});
  const [showAttemptField, setShowAttemptField] = useState(false);
  const [showSelectedTextField, setShowSelectedTextField] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sprint 4C: ephemeral local state for hint ladder + retry + teach-back
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);
  const [retryCount, setRetryCount] = useState(0);
  const [teachBackActive, setTeachBackActive] = useState(false);
  const [teachBackInput, setTeachBackInput] = useState('');

  const handleModeSelect = (mode: GuidedAiModeId) => {
    setActiveMode(mode);
    setResponse(null);
    setError(null);
    setShowAttemptField(mode === 'hint' || mode === 'quiz' || mode === 'lesson_rescue');
    setShowSelectedTextField(mode === 'lesson_rescue');
    setSelectedText('');
    // Sprint 4C: reset ephemeral state on mode change
    setHintLevel(1);
    setRetryCount(0);
    setTeachBackActive(false);
    setTeachBackInput('');
    setStudentAttempt('');

    // Auto-populate message placeholder based on mode
    if (mode === 'learn_your_way') {
      setMessage('Help me discover my learning style');
    } else {
      setMessage('');
    }

    // Focus input after mode select
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMode || !message.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const body: Record<string, unknown> = {
        mode: activeMode,
        moduleNumber,
        message: message.trim(),
        pageType: pageType || 'lesson',
      };

      if (nodeId) body.nodeId = nodeId;
      if (studentAttempt.trim()) body.studentAttempt = studentAttempt.trim();
      if (selectedText.trim()) body.selectedText = selectedText.trim();

      // Sprint 4C: send hint level and retry count
      if (activeMode === 'hint') {
        body.hintLevel = hintLevel;
        body.retryCount = retryCount;
      }
      if (activeMode === 'quiz') {
        body.retryCount = retryCount;
      }

      // For Learn Your Way, include bounded preferences
      if (activeMode === 'learn_your_way' && Object.keys(lywPrefs).length > 0) {
        body.preferences = lywPrefs;
      }

      const res = await fetch('/api/guided-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        setError(json.error || 'Something went wrong. Please try again.');
        return;
      }

      const data = json.data as GuidedAiResponseData;
      setResponse(data);

      // Sprint 4C: handle effort / teach-back / retry state
      if (data.effortRequired) {
        // Show attempt field if effort is required
        setShowAttemptField(true);
      }
      if (data.teachBackRequired) {
        setTeachBackActive(true);
      } else {
        setTeachBackActive(false);
      }
      if (data.integrityAction === 'refused') {
        setRetryCount(prev => prev + 1);
      }
    } catch {
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sprint 4C: handle teach-back submission (reuses the normal submit flow)
  const handleTeachBackSubmit = async () => {
    if (!teachBackInput.trim() || isLoading) return;
    setMessage(teachBackInput.trim());
    setStudentAttempt(teachBackInput.trim());
    setTeachBackInput('');
    setTeachBackActive(false);
    // Advance retry count
    setRetryCount(prev => prev + 1);
    // Trigger a re-ask with the teach-back as the student attempt
    // We need to set state and then submit — use a timeout to let state settle
    setTimeout(() => {
      const form = document.getElementById('guided-ai-form') as HTMLFormElement | null;
      if (form) form.requestSubmit();
    }, 50);
  };

  // Sprint 4C: advance to next hint level
  const handleNextHint = () => {
    if (hintLevel < 3) {
      setHintLevel(prev => Math.min(3, prev + 1) as 1 | 2 | 3);
      setResponse(null);
      setTeachBackActive(false);
      setTeachBackInput('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const HINT_LEVEL_LABELS: Record<1 | 2 | 3, { name: string; color: string }> = {
    1: { name: 'Nudge', color: 'var(--neon-green)' },
    2: { name: 'Direction', color: 'var(--neon-cyan)' },
    3: { name: 'Micro-example', color: 'var(--neon-purple)' },
  };

  return (
    <div
      className="rounded-xl border overflow-hidden transition-all duration-300"
      style={{
        background: 'var(--space-card)',
        borderColor: isOpen ? 'var(--neon-purple)' : 'var(--glass-border)',
      }}
    >
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 transition-colors hover:bg-[rgba(123,79,206,0.05)]"
        aria-expanded={isOpen}
        aria-controls="guided-ai-panel-content"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: 'var(--neon-purple)' }} />
          <span className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            Guided AI Coach
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
        <div id="guided-ai-panel-content" className="px-4 pb-4 space-y-4">
          {/* Mode selector */}
          <div>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
              Choose how you want the AI to help you:
            </p>
            <ModeSelector
              activeMode={activeMode}
              onSelectMode={handleModeSelect}
              disabled={isLoading}
            />
          </div>

          {/* Sprint 4C: Hint level indicator */}
          {activeMode === 'hint' && (
            <div className="flex items-center gap-3">
              {([1, 2, 3] as const).map(level => {
                const meta = HINT_LEVEL_LABELS[level];
                const isActive = hintLevel === level;
                const isPast = hintLevel > level;
                return (
                  <div
                    key={level}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                    style={{
                      color: isActive ? meta.color : isPast ? 'var(--text-muted)' : 'var(--glass-border)',
                      opacity: isActive ? 1 : isPast ? 0.6 : 0.3,
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border"
                      style={{
                        borderColor: isActive ? meta.color : 'var(--glass-border)',
                        background: isActive ? `${meta.color}20` : 'transparent',
                      }}
                    >
                      {level}
                    </span>
                    <span className="hidden sm:inline">{meta.name}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Input form */}
          {activeMode && (
            <form id="guided-ai-form" onSubmit={handleSubmit} className="space-y-3">
              {/* Learn Your Way preference selectors */}
              {activeMode === 'learn_your_way' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                      Explain with
                    </label>
                    <select
                      value={lywPrefs.explanation_style || ''}
                      onChange={(e) => setLywPrefs(p => ({ ...p, explanation_style: e.target.value as LearnYourWayPreferences['explanation_style'] || undefined }))}
                      className="w-full bg-[var(--space-mid)] border rounded px-2 py-1.5 text-xs"
                      style={{ borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }}
                    >
                      <option value="">Choose...</option>
                      <option value="examples">Examples</option>
                      <option value="steps">Step-by-step</option>
                      <option value="analogy">Analogies</option>
                      <option value="plain">Plain text</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                      Pace
                    </label>
                    <select
                      value={lywPrefs.pace_preference || ''}
                      onChange={(e) => setLywPrefs(p => ({ ...p, pace_preference: e.target.value as LearnYourWayPreferences['pace_preference'] || undefined }))}
                      className="w-full bg-[var(--space-mid)] border rounded px-2 py-1.5 text-xs"
                      style={{ borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }}
                    >
                      <option value="">Choose...</option>
                      <option value="fast">Fast</option>
                      <option value="moderate">Moderate</option>
                      <option value="slow">Slow</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                      Support style
                    </label>
                    <select
                      value={lywPrefs.support_preference || ''}
                      onChange={(e) => setLywPrefs(p => ({ ...p, support_preference: e.target.value as LearnYourWayPreferences['support_preference'] || undefined }))}
                      className="w-full bg-[var(--space-mid)] border rounded px-2 py-1.5 text-xs"
                      style={{ borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }}
                    >
                      <option value="">Choose...</option>
                      <option value="visual_analogy">Visual analogies</option>
                      <option value="plain_explanation">Plain explanations</option>
                      <option value="worked_examples">Worked examples</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                      Start with
                    </label>
                    <select
                      value={lywPrefs.practice_preference || ''}
                      onChange={(e) => setLywPrefs(p => ({ ...p, practice_preference: e.target.value as LearnYourWayPreferences['practice_preference'] || undefined }))}
                      className="w-full bg-[var(--space-mid)] border rounded px-2 py-1.5 text-xs"
                      style={{ borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }}
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
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--neon-cyan)' }}>
                    Paste the confusing sentence
                  </label>
                  <p className="text-[10px] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    Copy a sentence or paragraph from the lesson that feels confusing.
                  </p>
                  <textarea
                    value={selectedText}
                    onChange={(e) => setSelectedText(e.target.value)}
                    placeholder="Paste the confusing part of the lesson here..."
                    rows={3}
                    maxLength={1000}
                    className="w-full bg-[var(--space-mid)] border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[var(--neon-cyan)] focus:shadow-[0_0_8px_rgba(0,200,255,0.15)] transition-all"
                    style={{ borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }}
                  />
                </div>
              )}

              {/* Student attempt field (Hint / Quiz / Lesson Rescue modes) */}
              {showAttemptField && (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                    {response?.effortRequired ? '✏️ Your attempt (required for deeper help)' : 'Your attempt (optional)'}
                  </label>
                  <textarea
                    value={studentAttempt}
                    onChange={(e) => setStudentAttempt(e.target.value)}
                    placeholder={response?.effortRequired
                      ? 'Share what you\'ve tried — this unlocks deeper help...'
                      : 'Share what you\'ve tried so far...'
                    }
                    rows={2}
                    maxLength={2000}
                    className="w-full bg-[var(--space-mid)] border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none transition-all"
                    style={{
                      borderColor: response?.effortRequired ? 'var(--neon-cyan)' : 'var(--glass-border)',
                      color: 'var(--text-primary)',
                      boxShadow: response?.effortRequired ? '0 0 8px rgba(0,200,255,0.15)' : 'none',
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
                  className="w-full bg-[var(--space-mid)] border rounded-lg px-3 py-2 pr-20 text-sm resize-none focus:outline-none focus:border-[var(--neon-cyan)] focus:shadow-[0_0_8px_rgba(0,200,255,0.15)] transition-all placeholder:text-[var(--text-muted)]"
                  style={{ borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="absolute right-2 bottom-2 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: message.trim() && !isLoading ? 'var(--neon-cyan)' : 'var(--glass-bg)',
                    color: message.trim() && !isLoading ? 'var(--space-deep)' : 'var(--text-muted)',
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    'Ask'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center gap-2 p-3" style={{ color: 'var(--neon-purple)' }}>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs font-bold uppercase tracking-wider">Thinking...</span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div
              className="flex items-start gap-2 p-3 rounded-lg border text-sm"
              style={{ background: 'rgba(255,100,100,0.05)', borderColor: 'rgba(255,100,100,0.3)', color: '#ff6464' }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Response */}
          {response && !isLoading && (
            <GuidedAiResponse data={response} />
          )}

          {/* Sprint 4C: Teach-back card (separate from main input — correction #2) */}
          {teachBackActive && response?.teachBackPrompt && !isLoading && (
            <div
              className="p-4 rounded-xl border space-y-3"
              style={{
                background: 'rgba(123,79,206,0.06)',
                borderColor: 'var(--neon-purple)',
              }}
            >
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--neon-purple)' }}>
                🎓 Teach it back
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {response.teachBackPrompt}
              </p>
              <textarea
                value={teachBackInput}
                onChange={(e) => setTeachBackInput(e.target.value)}
                placeholder="Explain this concept in your own words..."
                rows={3}
                maxLength={2000}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTeachBackSubmit();
                  }
                }}
                className="w-full bg-[var(--space-mid)] border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[var(--neon-purple)] focus:shadow-[0_0_8px_rgba(123,79,206,0.2)] transition-all"
                style={{ borderColor: 'rgba(123,79,206,0.3)', color: 'var(--text-primary)' }}
              />
              <button
                type="button"
                onClick={handleTeachBackSubmit}
                disabled={!teachBackInput.trim() || isLoading}
                className="px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: teachBackInput.trim() ? 'var(--neon-purple)' : 'var(--glass-bg)',
                  color: teachBackInput.trim() ? '#fff' : 'var(--text-muted)',
                }}
              >
                Submit
              </button>
            </div>
          )}

          {/* Sprint 4C: Next Hint button */}
          {activeMode === 'hint' && response && response.nextHintAvailable && !isLoading && !teachBackActive && (
            <button
              type="button"
              onClick={handleNextHint}
              className="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border"
              style={{
                borderColor: 'var(--neon-cyan)',
                color: 'var(--neon-cyan)',
                background: 'rgba(0,200,255,0.05)',
              }}
            >
              ➡️ Next Hint: {HINT_LEVEL_LABELS[Math.min(3, hintLevel + 1) as 1 | 2 | 3].name}
            </button>
          )}

          {/* Footer */}
          <div className="text-center pt-1">
            <span className="text-[9px] uppercase tracking-widest font-display" style={{ color: 'var(--text-muted)' }}>
              Guided AI Coach · Not an answer machine
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPlaceholder(mode: GuidedAiModeId): string {
  switch (mode) {
    case 'explain': return 'What concept would you like explained?';
    case 'hint': return 'What are you stuck on? Describe the problem...';
    case 'quiz': return 'What topic should I quiz you on?';
    case 'coach': return 'What do you need help planning or focusing on?';
    case 'learn_your_way': return 'Tell me about how you learn best...';
    case 'lesson_rescue_stub': return 'Paste the confusing part and tell me where you got lost...';
    case 'lesson_rescue': return 'Describe what feels confusing or unclear...';
    default: return 'How can I help you learn?';
  }
}
