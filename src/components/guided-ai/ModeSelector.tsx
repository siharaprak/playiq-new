'use client';

import React from 'react';
import type { GuidedAiModeId } from '@/lib/guided-ai/types';

interface ModeSelectorProps {
  activeMode: GuidedAiModeId | null;
  onSelectMode: (mode: GuidedAiModeId) => void;
  disabled?: boolean;
}

const MODES: { id: GuidedAiModeId; label: string; icon: string; beta?: boolean; scaffold?: boolean }[] = [
  { id: 'explain', label: 'Explain', icon: '💡' },
  { id: 'hint', label: 'Hint', icon: '🔍' },
  { id: 'quiz', label: 'Quiz Me', icon: '📝' },
  { id: 'coach', label: 'Coach', icon: '🎯' },
  { id: 'learn_your_way', label: 'Learn Your Way', icon: '🧠', beta: true },
  { id: 'lesson_rescue', label: 'Lesson Rescue', icon: '🆘', beta: true },
];

export function ModeSelector({ activeMode, onSelectMode, disabled }: ModeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Guided AI Modes">
      {MODES.map((mode) => {
        const isActive = activeMode === mode.id;
        const isDisabled = disabled || mode.scaffold;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => !isDisabled && onSelectMode(mode.id)}
            disabled={isDisabled}
            aria-pressed={isActive}
            aria-label={`${mode.label}${mode.beta ? ' (Beta)' : ''}${mode.scaffold ? ' (Coming Soon)' : ''}`}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
              uppercase tracking-wider transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--space-deep)]
              ${isActive
                ? 'border-[var(--neon-cyan)] bg-[rgba(0,200,255,0.15)] text-[var(--neon-cyan)] shadow-[0_0_10px_rgba(0,200,255,0.2)]'
                : isDisabled
                  ? 'border-[var(--glass-border)] bg-transparent text-[var(--text-muted)] opacity-50 cursor-not-allowed'
                  : 'border-[var(--glass-border)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] hover:bg-[rgba(0,200,255,0.05)]'
              }
            `}
            style={{ border: '1px solid' }}
          >
            <span>{mode.icon}</span>
            <span>{mode.label}</span>
            {mode.beta && (
              <span className="text-[8px] px-1 py-0.5 rounded bg-[rgba(123,79,206,0.2)] text-[var(--neon-purple)] border border-[var(--neon-purple)]">
                BETA
              </span>
            )}
            {mode.scaffold && (
              <span className="text-[8px] px-1 py-0.5 rounded bg-[rgba(255,170,0,0.15)] text-[var(--neon-gold)] border border-[var(--neon-gold)]">
                SOON
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
