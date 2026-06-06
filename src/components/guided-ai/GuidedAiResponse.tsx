'use client';

import React, { useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import type { GuidedAiResponseData, PracticeItem, LessonRescueData } from '@/lib/guided-ai/types';

interface GuidedAiResponseProps {
  data: GuidedAiResponseData;
}

/**
 * Custom CodeBlock component with copy functionality
 */
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="my-3 rounded-xl overflow-hidden border border-[rgba(0,200,255,0.2)] shadow-lg text-xs leading-relaxed font-mono"
      style={{ backgroundColor: 'var(--space-deep)' }}
    >
      {/* Title bar */}
      <div 
        className="flex items-center justify-between px-3.5 py-2 border-b border-[rgba(0,200,255,0.15)] text-[10px] font-bold uppercase tracking-wider"
        style={{ backgroundColor: 'var(--space-mid)', color: 'var(--text-secondary)' }}
      >
        <span>{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-[var(--neon-cyan)] transition-colors py-0.5 px-1.5 rounded border border-[var(--glass-border)] bg-transparent hover:bg-[var(--glass-bg)]"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <>
              <Check size={11} className="text-[var(--neon-green)]" />
              <span className="text-[var(--neon-green)]">Copied</span>
            </>
          ) : (
            <>
              <Copy size={11} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <pre 
        className="p-3.5 overflow-x-auto custom-scrollbar selection:bg-[rgba(0,200,255,0.3)] select-text"
        style={{ color: 'var(--text-primary)' }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Renders basic markdown bold, italic, inline code, fenced code blocks and bullets, sanitizing HTML first.
 */
function renderMarkdown(text: string) {
  let sanitized = text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const lines = sanitized.split('\n');
  const elements: React.ReactNode[] = [];
  
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = 'code';

  lines.forEach((line, i) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = trimmedLine.slice(3).trim().toLowerCase() || 'code';
        codeLines = [];
      } else {
        inCodeBlock = false;
        const finalCode = codeLines.join('\n');
        elements.push(
          <CodeBlock key={`code-${i}`} code={finalCode} language={codeLang} />
        );
      }
    } else if (inCodeBlock) {
      codeLines.push(line);
    } else {
      let processed = line;

      // Bold: **text**
      processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text-primary);font-weight:700">$1</strong>');

      // Italic: *text*
      processed = processed.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

      // Inline code: `text`
      processed = processed.replace(/`(.+?)`/g, '<code style="background:rgba(0,200,255,0.12);color:var(--neon-cyan);padding:2px 5px;border-radius:4px;font-family:monospace;font-size:0.9em">$1</code>');

      // Bullet points
      const isBullet = /^\s*[-*]\s+/.test(processed);
      if (isBullet) {
        processed = processed.replace(/^\s*[-*]\s+/, '');
        elements.push(
          <div key={i} className="flex gap-2 ml-1 text-[var(--text-secondary)] text-sm leading-relaxed mt-1">
            <span className="text-[var(--neon-cyan)] flex-shrink-0">▸</span>
            <span dangerouslySetInnerHTML={{ __html: processed }} />
          </div>
        );
      } else if (processed.trim() === '') {
        elements.push(<div key={i} className="h-2" />);
      } else {
        elements.push(
          <span key={i} className="text-[var(--text-secondary)] text-sm block leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: processed }} />
          </span>
        );
      }
    }
  });

  // Fallback for unclosed code blocks
  if (inCodeBlock && codeLines.length > 0) {
    elements.push(
      <CodeBlock key="code-unclosed" code={codeLines.join('\n')} language={codeLang} />
    );
  }

  return <>{elements}</>;
}

function PracticeItemCard({ item, index }: { item: PracticeItem; index: number }) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  return (
    <div
      className="p-4 rounded-xl border border-[var(--glass-border)] hover:border-[var(--neon-cyan)]/40 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.1)] space-y-3"
      style={{ backgroundColor: 'var(--space-card)' }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-0 font-mono text-[var(--neon-cyan)]">
          Question {index + 1} · {item.type === 'multiple_choice' ? 'Multiple Choice' : 'Short Answer'}
        </p>
        {selectedOption !== null && (
          <button
            type="button"
            onClick={() => setSelectedOption(null)}
            className="text-[9px] text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors uppercase tracking-wider font-mono bg-transparent border-0"
          >
            Clear choice
          </button>
        )}
      </div>
      
      <div className="text-sm font-semibold text-[var(--text-primary)] leading-relaxed">
        {renderMarkdown(item.question)}
      </div>

      {item.options && (
        <div className="space-y-2 pt-1">
          {item.options.map((opt, i) => {
            const isSelected = selectedOption === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedOption(i)}
                className={`w-full flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border text-left text-xs transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-[var(--neon-cyan)] text-[var(--neon-cyan)] shadow-[0_0_12px_rgba(0,200,255,0.2)]'
                    : 'border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--neon-cyan)]/40'
                }`}
                style={{
                  background: isSelected
                    ? 'linear-gradient(to right, rgba(0,200,255,0.15), rgba(123,79,206,0.1))'
                    : 'var(--space-deep)',
                }}
              >
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all ${
                  isSelected
                    ? 'border-[var(--neon-cyan)] bg-[var(--neon-cyan)] shadow-[0_0_6px_var(--neon-cyan)]'
                    : 'border-[var(--text-muted)] bg-transparent'
                }`}>
                  {isSelected && <span className="w-1 h-1 rounded-full bg-[var(--space-deep)]"></span>}
                </span>
                <span className="leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>
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
    <div className="space-y-4">
      {/* Confusion type badge */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
          Confusion type:
        </span>
        <span
          className="text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono"
          style={{
            color: confusionMeta.color,
            border: `1px solid ${confusionMeta.color}`,
            background: `${confusionMeta.color}10`,
          }}
        >
          {confusionMeta.label}
        </span>
      </div>

      {/* Gap diagnosis */}
      <div
        className="p-3.5 rounded-xl border bg-[rgba(123,79,206,0.04)] border-[rgba(123,79,206,0.18)] card-accent-purple shadow-sm"
      >
        <span className="text-[9px] font-bold uppercase tracking-widest block mb-1.5 font-mono" style={{ color: 'var(--neon-purple)' }}>
          What you might be missing:
        </span>
        <div className="text-[var(--text-secondary)]">{renderMarkdown(rescue.gapDiagnosis)}</div>
      </div>

      {/* Rescue explanation */}
      <div
        className="p-3.5 rounded-xl border bg-[rgba(57,255,20,0.03)] border-[rgba(57,255,20,0.18)] card-accent-green shadow-sm"
      >
        <span className="text-[9px] font-bold uppercase tracking-widest block mb-1.5 font-mono" style={{ color: 'var(--neon-green)' }}>
          Here&apos;s the idea in plain language:
        </span>
        <div className="text-[var(--text-primary)]">{renderMarkdown(rescue.rescueExplanation)}</div>
      </div>

      {/* Micro-example */}
      {rescue.microExample && (
        <div
          className="p-3.5 rounded-xl border bg-[rgba(0,200,255,0.02)] border-[rgba(0,200,255,0.15)] card-accent-cyan shadow-sm"
        >
          <span className="text-[9px] font-bold uppercase tracking-widest block mb-1.5 font-mono" style={{ color: 'var(--neon-cyan)' }}>
            Quick example:
          </span>
          <div className="text-[var(--text-secondary)]">{renderMarkdown(rescue.microExample)}</div>
        </div>
      )}

      {/* Check question */}
      <div
        className="p-3.5 rounded-xl border bg-[rgba(0,200,255,0.04)] border-[rgba(0,200,255,0.18)] card-accent-cyan shadow-sm"
      >
        <span className="text-[9px] font-bold uppercase tracking-widest block mb-1.5 font-mono" style={{ color: 'var(--neon-cyan)' }}>
          Check yourself:
        </span>
        <div className="text-[var(--text-primary)] font-medium">{renderMarkdown(rescue.checkQuestion)}</div>
      </div>

      {/* Teach-back prompt */}
      <div
        className="p-3.5 rounded-xl border bg-[rgba(123,79,206,0.07)] border-[rgba(123,79,206,0.25)] card-accent-purple shadow-sm"
      >
        <span className="text-[9px] font-bold uppercase tracking-widest block mb-1.5 font-mono" style={{ color: 'var(--neon-purple)' }}>
          Teach Orion:
        </span>
        <div className="text-[var(--text-primary)]">{renderMarkdown(rescue.teachBackPrompt)}</div>
      </div>

      {/* Next step */}
      <div className="text-xs pt-1 flex items-start gap-1.5 text-[var(--text-secondary)]">
        <span className="font-bold font-mono text-[10px] uppercase tracking-wider text-[var(--neon-green)] mt-0.5">Next step: </span>
        <span>{rescue.nextStep}</span>
      </div>
    </div>
  );
}

export function GuidedAiResponse({ data }: GuidedAiResponseProps) {
  const isRefused = data.integrityAction === 'refused';
  const hintMeta = data.hintLevel ? HINT_LEVEL_LABELS[data.hintLevel] : null;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Hint level badge */}
      {hintMeta && !isRefused && (
        <div className="flex items-center gap-2">
          <span
            className="text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono"
            style={{
              color: hintMeta.color,
              border: `1px solid ${hintMeta.color}`,
              background: `${hintMeta.color}12`,
            }}
          >
            Hint {data.hintLevel} · {hintMeta.name}
          </span>
        </div>
      )}

      {/* Main response */}
      <div
        className="p-4 rounded-2xl border text-sm leading-relaxed card-accent-purple shadow-[0_2px_12px_rgba(123,79,206,0.08)]"
        style={{
          background: isRefused ? 'rgba(255,100,100,0.04)' : 'rgba(123,79,206,0.03)',
          borderColor: isRefused ? 'rgba(255,100,100,0.25)' : 'rgba(123,79,206,0.25)',
        }}
      >
        <div className="space-y-1">
          {renderMarkdown(data.response)}
        </div>
      </div>

      {/* Safety route suggestion card */}
      {data.safetyRoute && (
        <div
          className="p-3.5 rounded-xl border text-xs leading-relaxed card-accent-gold shadow-sm"
          style={{
            background: data.safetyRoute.classification === 'self_harm_or_crisis'
              ? 'rgba(100,149,237,0.05)'
              : 'rgba(255,170,0,0.04)',
            borderColor: data.safetyRoute.classification === 'self_harm_or_crisis'
              ? 'rgba(100,149,237,0.3)'
              : 'rgba(255,170,0,0.25)',
            color: 'var(--text-secondary)',
          }}
        >
          <span
            className="text-[9px] font-bold uppercase tracking-wider block mb-1 font-mono"
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

      {/* Effort required prompt */}
      {data.effortRequired && data.effortPrompt && (
        <div
          className="p-3.5 rounded-xl border text-xs card-accent-cyan shadow-sm"
          style={{
            background: 'rgba(0,200,255,0.04)',
            borderColor: 'rgba(0,200,255,0.25)',
            color: 'var(--text-secondary)',
          }}
        >
          <span className="text-[9px] font-bold uppercase tracking-wider block mb-1 font-mono" style={{ color: 'var(--neon-cyan)' }}>
            ✏️ Show your effort:
          </span>
          <span>{data.effortPrompt}</span>
        </div>
      )}

      {/* Retry required prompt */}
      {data.retryRequired && data.retryPrompt && !data.effortRequired && (
        <div
          className="p-3.5 rounded-xl border text-xs card-accent-gold shadow-sm"
          style={{
            background: 'rgba(255,170,0,0.04)',
            borderColor: 'rgba(255,170,0,0.25)',
            color: 'var(--text-secondary)',
          }}
        >
          <span className="text-[9px] font-bold uppercase tracking-wider block mb-1 font-mono" style={{ color: 'var(--neon-gold, #ffaa00)' }}>
            🔄 Try again:
          </span>
          <span>{data.retryPrompt}</span>
        </div>
      )}

      {/* Practice items (Quiz Mode) */}
      {data.practiceItems && data.practiceItems.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider font-mono text-[var(--text-muted)]">
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
          className="p-3.5 rounded-xl border text-xs card-accent-cyan shadow-sm"
          style={{
            background: 'rgba(0,200,255,0.03)',
            borderColor: 'rgba(0,200,255,0.2)',
            color: 'var(--neon-cyan)',
          }}
        >
          <span className="font-bold text-[9px] uppercase tracking-wider block mb-1 font-mono">Check yourself:</span>
          <span className="text-[var(--text-primary)]">{data.followUpQuestion}</span>
        </div>
      )}

      {/* Suggested next step */}
      {data.suggestedNextStep && !isRefused && (
        <div className="text-xs flex items-start gap-1.5 text-[var(--text-secondary)]">
          <span className="font-bold font-mono text-[9px] uppercase tracking-widest text-[var(--neon-green)] mt-0.5">Next step: </span>
          <span>{data.suggestedNextStep}</span>
        </div>
      )}

      {/* Preference summary (Learn Your Way) */}
      {data.preferenceSummary && (
        <div
          className="p-3.5 rounded-xl border text-xs card-accent-purple shadow-sm"
          style={{ background: 'rgba(123,79,206,0.04)', borderColor: 'rgba(123,79,206,0.18)' }}
        >
          <span className="font-bold uppercase tracking-wider block mb-1.5 font-mono text-[var(--text-primary)]" style={{ color: 'var(--neon-purple)' }}>
            Your Learning Profile:
          </span>
          <ul className="space-y-1 text-[var(--text-secondary)] font-mono text-[11px]">
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
