'use client';

import React from 'react';
import type { GuidedAiResponseData, PracticeItem, LessonRescueData } from '@/lib/guided-ai/types';

interface GuidedAiResponseProps {
  data: GuidedAiResponseData;
}

/**
 * Sanitizes text for safe display. Strips potential HTML/script injection.
 */
function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function PracticeItemCard({ item, index }: { item: PracticeItem; index: number }) {
  return (
    <div
      className="p-3 rounded-lg border"
      style={{ background: 'var(--space-mid)', borderColor: 'var(--glass-border)' }}
    >
      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--neon-cyan)' }}>
        Question {index + 1} ({item.type === 'multiple_choice' ? 'Multiple Choice' : 'Short Answer'})
      </p>
      <p className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
        {item.question}
      </p>
      {item.options && (
        <ul className="space-y-1 ml-2">
          {item.options.map((opt, i) => (
            <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const CONFUSION_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  vocabulary: { label: 'Vocabulary', color: 'var(--neon-cyan)' },
  missing_prerequisite: { label: 'Missing Prerequisite', color: 'var(--neon-purple)' },
  too_abstract: { label: 'Too Abstract', color: '#ff9f43' },
  procedure: { label: 'Procedure', color: 'var(--neon-green)' },
  attention: { label: 'Attention', color: '#ff6b6b' },
  confidence: { label: 'Confidence', color: '#48dbfb' },
  unknown: { label: 'Unknown', color: 'var(--text-muted)' },
};

const HINT_LEVEL_LABELS: Record<number, { name: string; color: string }> = {
  1: { name: 'Nudge', color: 'var(--neon-green)' },
  2: { name: 'Direction', color: 'var(--neon-cyan)' },
  3: { name: 'Micro-example', color: 'var(--neon-purple)' },
};

function LessonRescueCard({ rescue }: { rescue: LessonRescueData }) {
  const confusionMeta = CONFUSION_TYPE_LABELS[rescue.confusionType] ?? CONFUSION_TYPE_LABELS.unknown;

  return (
    <div className="space-y-3">
      {/* Confusion type badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Confusion type:
        </span>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
          style={{
            color: confusionMeta.color,
            border: `1px solid ${confusionMeta.color}`,
            background: `${confusionMeta.color}15`,
          }}
        >
          {confusionMeta.label}
        </span>
      </div>

      {/* Gap diagnosis */}
      <div
        className="p-3 rounded-lg border text-sm"
        style={{ background: 'rgba(123,79,206,0.05)', borderColor: 'rgba(123,79,206,0.2)' }}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--neon-purple)' }}>
          What you might be missing:
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>{rescue.gapDiagnosis}</span>
      </div>

      {/* Rescue explanation */}
      <div
        className="p-3 rounded-lg border text-sm"
        style={{ background: 'var(--space-mid)', borderColor: 'var(--neon-green)' }}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--neon-green)' }}>
          Here&apos;s the idea in plain language:
        </span>
        <span style={{ color: 'var(--text-primary)' }}>{rescue.rescueExplanation}</span>
      </div>

      {/* Micro-example */}
      {rescue.microExample && (
        <div
          className="p-3 rounded-lg border text-sm"
          style={{ background: 'rgba(0,200,255,0.03)', borderColor: 'rgba(0,200,255,0.15)' }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--neon-cyan)' }}>
            Quick example:
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>{rescue.microExample}</span>
        </div>
      )}

      {/* Check question */}
      <div
        className="p-3 rounded-lg border text-sm"
        style={{ background: 'rgba(0,200,255,0.05)', borderColor: 'rgba(0,200,255,0.2)' }}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--neon-cyan)' }}>
          Check yourself:
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>{rescue.checkQuestion}</span>
      </div>

      {/* Teach-back prompt */}
      <div
        className="p-3 rounded-lg border text-sm"
        style={{ background: 'rgba(123,79,206,0.08)', borderColor: 'rgba(123,79,206,0.3)' }}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--neon-purple)' }}>
          Teach it back:
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>{rescue.teachBackPrompt}</span>
      </div>

      {/* Next step */}
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        <span className="font-bold" style={{ color: 'var(--neon-green)' }}>Next step: </span>
        {rescue.nextStep}
      </p>
    </div>
  );
}

export function GuidedAiResponse({ data }: GuidedAiResponseProps) {
  const isRefused = data.integrityAction === 'refused';
  const hintMeta = data.hintLevel ? HINT_LEVEL_LABELS[data.hintLevel] : null;

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Sprint 4C: Hint level badge */}
      {hintMeta && !isRefused && (
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
            style={{
              color: hintMeta.color,
              border: `1px solid ${hintMeta.color}`,
              background: `${hintMeta.color}15`,
            }}
          >
            Hint {data.hintLevel}: {hintMeta.name}
          </span>
        </div>
      )}

      {/* Main response */}
      <div
        className="p-4 rounded-xl border text-sm leading-relaxed"
        style={{
          background: isRefused ? 'rgba(255,100,100,0.05)' : 'var(--space-mid)',
          borderColor: isRefused ? 'rgba(255,100,100,0.3)' : 'var(--neon-purple)',
          color: 'var(--text-primary)',
        }}
      >
        <p
          dangerouslySetInnerHTML={{ __html: sanitizeText(data.response).replace(/\n/g, '<br/>') }}
        />
      </div>

      {/* Sprint 4D: Safety route suggestion card */}
      {data.safetyRoute && (
        <div
          className="p-3 rounded-lg border text-sm"
          style={{
            background: data.safetyRoute.classification === 'self_harm_or_crisis'
              ? 'rgba(100,149,237,0.08)'
              : 'rgba(255,170,0,0.06)',
            borderColor: data.safetyRoute.classification === 'self_harm_or_crisis'
              ? 'rgba(100,149,237,0.4)'
              : 'rgba(255,170,0,0.3)',
            color: 'var(--text-secondary)',
          }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-wider block mb-1"
            style={{
              color: data.safetyRoute.classification === 'self_harm_or_crisis'
                ? 'rgba(100,149,237,1)'
                : 'var(--neon-gold, #ffaa00)',
            }}
          >
            {data.safetyRoute.classification === 'self_harm_or_crisis'
              ? '💙 ' + data.safetyRoute.message
              : '💡 ' + data.safetyRoute.message}
          </span>
          {data.safetyRoute.target !== 'blocked' && data.suggestedNextStep && (
            <span>{data.suggestedNextStep}</span>
          )}
        </div>
      )}

      {/* Sprint 4C: Effort required prompt */}
      {data.effortRequired && data.effortPrompt && (
        <div
          className="p-3 rounded-lg border text-sm"
          style={{
            background: 'rgba(0,200,255,0.06)',
            borderColor: 'var(--neon-cyan)',
            color: 'var(--text-secondary)',
          }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--neon-cyan)' }}>
            ✏️ Show your effort:
          </span>
          <span>{data.effortPrompt}</span>
        </div>
      )}

      {/* Sprint 4C: Retry required prompt */}
      {data.retryRequired && data.retryPrompt && !data.effortRequired && (
        <div
          className="p-3 rounded-lg border text-sm"
          style={{
            background: 'rgba(255,170,0,0.06)',
            borderColor: 'rgba(255,170,0,0.3)',
            color: 'var(--text-secondary)',
          }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--neon-gold, #ffaa00)' }}>
            🔄 Try again:
          </span>
          <span>{data.retryPrompt}</span>
        </div>
      )}

      {/* Practice items (Quiz Mode) */}
      {data.practiceItems && data.practiceItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--neon-green)' }}>
            Practice Questions
          </p>
          {data.practiceItems.map((item, i) => (
            <PracticeItemCard key={i} item={item} index={i} />
          ))}
        </div>
      )}

      {/* Lesson Rescue structured output */}
      {data.lessonRescue && !isRefused && (
        <LessonRescueCard rescue={data.lessonRescue} />
      )}

      {/* Follow-up question */}
      {data.followUpQuestion && !isRefused && (
        <div
          className="p-3 rounded-lg border text-sm"
          style={{
            background: 'rgba(0,200,255,0.05)',
            borderColor: 'rgba(0,200,255,0.2)',
            color: 'var(--neon-cyan)',
          }}
        >
          <span className="font-bold text-xs uppercase tracking-wider block mb-1">Check yourself:</span>
          <span style={{ color: 'var(--text-secondary)' }}>{data.followUpQuestion}</span>
        </div>
      )}

      {/* Suggested next step */}
      {data.suggestedNextStep && !isRefused && (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="font-bold" style={{ color: 'var(--neon-green)' }}>Next step: </span>
          {data.suggestedNextStep}
        </p>
      )}

      {/* Preference summary (Learn Your Way) */}
      {data.preferenceSummary && (
        <div
          className="p-3 rounded-lg border text-xs"
          style={{ background: 'rgba(123,79,206,0.05)', borderColor: 'rgba(123,79,206,0.2)' }}
        >
          <span className="font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--neon-purple)' }}>
            Your Learning Profile:
          </span>
          <ul className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
            {data.preferenceSummary.explanation_style && (
              <li>Explanation style: {data.preferenceSummary.explanation_style}</li>
            )}
            {data.preferenceSummary.pace_preference && (
              <li>Pace: {data.preferenceSummary.pace_preference}</li>
            )}
            {data.preferenceSummary.practice_preference && (
              <li>Practice: {data.preferenceSummary.practice_preference}</li>
            )}
            {data.preferenceSummary.support_preference && (
              <li>Support: {data.preferenceSummary.support_preference}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
