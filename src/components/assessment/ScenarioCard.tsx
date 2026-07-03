'use client';

import React from 'react';

interface ScenarioOption {
  id: string;
  text: string;
}

interface ScenarioCardProps {
  questionNumber: number;
  scenarioText: string;
  options: ScenarioOption[];
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
}

/**
 * Scenario card for Phase 2 diagnostic questions.
 * Presents real-world scenarios with honest response options.
 * Not a quiz — no right/wrong indicators.
 */
export default function ScenarioCard({
  questionNumber,
  scenarioText,
  options,
  selectedOptionId,
  onSelect,
}: ScenarioCardProps) {
  return (
    <div className="assessment-scenario-card">
      {/* Question indicator */}
      <div className="flex items-center gap-3 mb-5">
        <div className="assessment-question-badge">
          {questionNumber}
        </div>
        <div className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Signal {questionNumber} of 5
        </div>
      </div>

      {/* Scenario text */}
      <p className="text-base leading-relaxed mb-6 font-sans" style={{ color: 'var(--text-primary)' }}>
        &ldquo;{scenarioText}&rdquo;
      </p>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`assessment-option-button ${isSelected ? 'assessment-option-selected' : ''}`}
            >
              <span className="assessment-option-letter">
                {option.id}
              </span>
              <span className="text-sm leading-relaxed flex-1 text-left">
                {option.text}
              </span>
              {isSelected && (
                <span className="assessment-option-check">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
