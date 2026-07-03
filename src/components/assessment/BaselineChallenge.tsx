'use client';

import React from 'react';
import { BASELINE_TASK1_CONTENT, BASELINE_TASK2_PROMPT, BASELINE_TASK3_CONTENT } from '@/lib/assessment/assessment-scoring';

// ── Task 1: AI Accuracy Check ───────────────────────────────────────────────

interface Task1Props {
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
}

export function BaselineTask1({ selectedAnswer, onSelect }: Task1Props) {
  const content = BASELINE_TASK1_CONTENT;

  return (
    <div className="assessment-baseline-task">
      <div className="flex items-center gap-3 mb-4">
        <div className="assessment-question-badge" style={{ background: 'var(--neon-gold)', color: '#000' }}>1</div>
        <h3 className="text-sm font-mono uppercase tracking-widest" style={{ color: 'var(--neon-gold)' }}>
          AI Accuracy Check
        </h3>
      </div>

      <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
        Below are two AI-generated answers to the question: <strong className="text-white">&ldquo;{content.topic}&rdquo;</strong>
      </p>
      <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
        One is correct. One contains a confident but subtle error. <strong className="text-white">Which one would you trust?</strong>
      </p>

      <div className="flex flex-col gap-4">
        {[content.answerA, content.answerB].map((answer) => {
          const isSelected = selectedAnswer === answer.label;
          return (
            <button
              key={answer.label}
              onClick={() => onSelect(answer.label)}
              className={`assessment-ai-answer-card ${isSelected ? 'assessment-ai-answer-selected' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className={`assessment-option-letter flex-shrink-0 ${isSelected ? 'assessment-option-letter-active' : ''}`}>
                  {answer.label}
                </span>
                <p className="text-sm leading-relaxed text-left" style={{ color: 'var(--text-primary)' }}>
                  {answer.text}
                </p>
              </div>
              {isSelected && (
                <div className="mt-2 text-right">
                  <span className="text-xs font-bold" style={{ color: 'var(--neon-cyan)' }}>Selected ✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Task 2: Concept Explanation ─────────────────────────────────────────────

interface Task2Props {
  response: string;
  onChange: (value: string) => void;
}

export function BaselineTask2({ response, onChange }: Task2Props) {
  return (
    <div className="assessment-baseline-task">
      <div className="flex items-center gap-3 mb-4">
        <div className="assessment-question-badge" style={{ background: 'var(--neon-gold)', color: '#000' }}>2</div>
        <h3 className="text-sm font-mono uppercase tracking-widest" style={{ color: 'var(--neon-gold)' }}>
          Concept Explanation
        </h3>
      </div>

      <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-primary)' }}>
        &ldquo;{BASELINE_TASK2_PROMPT}&rdquo;
      </p>

      <textarea
        value={response}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your explanation here..."
        className="assessment-textarea"
        rows={4}
        maxLength={1000}
      />
      <div className="flex justify-end mt-1">
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {response.length}/1000
        </span>
      </div>
    </div>
  );
}

// ── Task 3: Problem Approach ────────────────────────────────────────────────

interface Task3Props {
  response: string;
  onChange: (value: string) => void;
}

export function BaselineTask3({ response, onChange }: Task3Props) {
  return (
    <div className="assessment-baseline-task">
      <div className="flex items-center gap-3 mb-4">
        <div className="assessment-question-badge" style={{ background: 'var(--neon-gold)', color: '#000' }}>3</div>
        <h3 className="text-sm font-mono uppercase tracking-widest" style={{ color: 'var(--neon-gold)' }}>
          Problem Approach
        </h3>
      </div>

      <p className="text-base leading-relaxed mb-6 whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>
        &ldquo;{BASELINE_TASK3_CONTENT.prompt}&rdquo;
      </p>

      <textarea
        value={response}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Show your thinking here — not just the answer..."
        className="assessment-textarea"
        rows={6}
        maxLength={2000}
      />
      <div className="flex justify-end mt-1">
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {response.length}/2000
        </span>
      </div>
    </div>
  );
}
