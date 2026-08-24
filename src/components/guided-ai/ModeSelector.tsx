'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { GuidedAiModeId } from '@/lib/guided-ai/types';

interface ModeSelectorProps {
  activeMode: GuidedAiModeId | null;
  onSelectMode: (mode: GuidedAiModeId) => void;
  disabled?: boolean;
}

const MODES: { id: GuidedAiModeId; label: string; icon: string; beta?: boolean; scaffold?: boolean }[] = [
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'explain', label: 'Explain', icon: '💡' },
  { id: 'hint', label: 'Hint', icon: '🔍' },
  { id: 'quiz', label: 'Quiz Me', icon: '📝' },
  { id: 'coach', label: 'Coach', icon: '🎯' },
  { id: 'learn_your_way', label: 'Learn Your Way', icon: '🧠', beta: true },
  { id: 'lesson_rescue', label: 'Lesson Rescue', icon: '🆘', beta: true },
];

export function ModeSelector({ activeMode, onSelectMode, disabled }: ModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeModeData = MODES.find((m) => m.id === activeMode);

  const handleSelect = (modeId: GuidedAiModeId) => {
    onSelectMode(modeId);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[44px] flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)] ${
          disabled
            ? 'border-[var(--glass-border)] bg-transparent text-[var(--text-muted)] opacity-50 cursor-not-allowed'
            : isOpen
              ? 'border-[var(--neon-cyan)] bg-gradient-to-r from-[rgba(0,200,255,0.12)] to-[rgba(123,79,206,0.12)] text-[var(--neon-cyan)] shadow-[0_0_12px_rgba(0,200,255,0.25)] text-glow-cyan'
              : 'border-[var(--glass-border)] bg-[var(--space-mid)]/40 text-[var(--text-primary)] hover:border-[var(--neon-cyan)] hover:bg-[rgba(0,200,255,0.05)] hover:shadow-[0_0_8px_rgba(0,200,255,0.15)]'
        }`}
      >
        <div className="flex items-center gap-2">
          {activeModeData ? (
            <>
              <span className="text-sm leading-none">{activeModeData.icon}</span>
              <span>{activeModeData.label}</span>
              {activeModeData.beta && (
                <span className="text-[7px] px-1 py-0.5 rounded bg-[rgba(123,79,206,0.2)] text-[var(--neon-purple)] border border-[var(--neon-purple)] ml-1">
                  BETA
                </span>
              )}
            </>
          ) : (
            <span className="text-[var(--text-secondary)] normal-case font-normal font-sans">Select Study Tool...</span>
          )}
        </div>
        <ChevronDown size={14} className={`text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--neon-cyan)]' : ''}`} />
      </button>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div 
          className="absolute left-0 right-0 mt-2 z-50 rounded-xl border border-[var(--glass-border)] backdrop-blur-xl shadow-2xl overflow-hidden animate-fade-in-up"
          style={{ animationDuration: '0.2s', backgroundColor: 'var(--space-deep)' }}
        >
          <div className="p-1 max-h-72 overflow-y-auto custom-scrollbar touch-scroll">
            {MODES.map((mode) => {
              const isActive = activeMode === mode.id;
              const isScaffold = mode.scaffold;

              return (
                <button
                  key={mode.id}
                  type="button"
                  disabled={isScaffold}
                  onClick={() => handleSelect(mode.id)}
                  className={`w-full min-h-[40px] flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs uppercase tracking-wider font-bold transition-all duration-205 border border-transparent ${
                    isActive
                      ? 'bg-gradient-to-r from-[rgba(0,200,255,0.15)] to-[rgba(123,79,206,0.1)] text-[var(--neon-cyan)] border-[rgba(0,200,255,0.2)] font-extrabold'
                      : isScaffold
                        ? 'text-[var(--text-muted)] opacity-50 cursor-not-allowed'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] active:bg-[rgba(0,200,255,0.1)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm leading-none">{mode.icon}</span>
                    <span>{mode.label}</span>
                    {mode.beta && (
                      <span className="text-[7px] px-1 py-0.5 rounded bg-[rgba(123,79,206,0.2)] text-[var(--neon-purple)] border border-[var(--neon-purple)] ml-1">
                        BETA
                      </span>
                    )}
                    {isScaffold && (
                      <span className="text-[7px] px-1 py-0.5 rounded bg-[rgba(255,170,0,0.15)] text-[var(--neon-gold)] border border-[var(--neon-gold)] ml-1">
                        SOON
                      </span>
                    )}
                  </div>
                  {isActive && <Check size={12} className="text-[var(--neon-cyan)]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
