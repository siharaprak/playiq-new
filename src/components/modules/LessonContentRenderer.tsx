'use client';

import React from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Bot, 
  User, 
  Lightbulb, 
  ShieldAlert, 
  Layers, 
  Zap,
  BookOpen
} from 'lucide-react';
import type { LessonSection } from '@/data/module1Content';

interface LessonContentRendererProps {
  sections: LessonSection[];
}

export default function LessonContentRenderer({ sections }: LessonContentRendererProps) {
  return (
    <div className="space-y-8">
      {sections.map((section, sIdx) => {
        const title = section.title || '';
        const isHook = title.toLowerCase().includes('hook') || title.toLowerCase().includes('lightning') || title.toLowerCase().includes('30-second') || title.toLowerCase().includes('45-second');
        const isDialogue = title.toLowerCase().includes('conversation') || title.toLowerCase().includes('dialogue') || section.content.some(c => c.startsWith('STUDENT:') || c.startsWith('ORION:'));
        const isComparison = title.toLowerCase().includes('vs') || title.toLowerCase().includes('comparison') || title.toLowerCase().includes('weak vs');
        const isSteps = title.toLowerCase().includes('step') || title.toLowerCase().includes('ladder') || title.toLowerCase().includes('ways') || title.toLowerCase().includes('rule');

        return (
          <div 
            key={sIdx} 
            className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/80 p-6 md:p-8 backdrop-blur-md shadow-xl transition-all hover:border-slate-600/80"
            style={{
              background: isHook 
                ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(123, 79, 206, 0.12))' 
                : 'linear-gradient(180deg, rgba(17, 24, 39, 0.95), rgba(15, 23, 42, 0.9))'
            }}
          >
            {/* Top Accent Line */}
            <div 
              className="absolute top-0 left-0 right-0 h-[2px]" 
              style={{
                background: isHook 
                  ? 'linear-gradient(90deg, #00c8ff, #7b4fce)' 
                  : isComparison 
                    ? 'linear-gradient(90deg, #f5c518, #00c8ff)' 
                    : 'linear-gradient(90deg, #7b4fce, rgba(0, 200, 255, 0.3))'
              }}
            />

            {/* Section Header */}
            {title && (
              <div className="mb-6 flex items-center gap-3">
                <div 
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm"
                  style={{
                    borderColor: isHook ? 'rgba(0, 200, 255, 0.4)' : 'rgba(123, 79, 206, 0.4)',
                    background: isHook ? 'rgba(0, 200, 255, 0.1)' : 'rgba(123, 79, 206, 0.1)',
                    color: isHook ? '#00c8ff' : '#9b6fe8'
                  }}
                >
                  {isHook ? <Zap className="h-5 w-5" /> : isDialogue ? <Bot className="h-5 w-5" /> : isComparison ? <Layers className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white">
                    {title}
                  </h3>
                </div>
              </div>
            )}

            {/* Section Body Content */}
            <div className="space-y-4">
              {renderSectionItems(section.content)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Intelligent parser for individual content items inside a section.
 */
function renderSectionItems(items: string[]) {
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const trimmed = item.trim();

    // 1. Dialogue Speaker (STUDENT: ... or ORION: ...)
    if (trimmed.startsWith('STUDENT:') || trimmed.startsWith('ORION:')) {
      const isOrion = trimmed.startsWith('ORION:');
      const speaker = isOrion ? 'ORION (AI Coach)' : 'STUDENT';
      const text = trimmed.replace(/^(STUDENT:|ORION:)\s*/, '').replace(/^"|"$/g, '');

      elements.push(
        <div 
          key={i} 
          className={`flex gap-3.5 p-4 rounded-xl border ${
            isOrion 
              ? 'bg-purple-950/30 border-purple-500/30 shadow-[0_0_15px_rgba(123,79,206,0.1)]' 
              : 'bg-cyan-950/30 border-cyan-500/30'
          }`}
        >
          <div 
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
              isOrion 
                ? 'bg-purple-500/20 border-purple-400 text-purple-300' 
                : 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
            }`}
          >
            {isOrion ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>
          <div className="space-y-1">
            <div className={`text-xs font-bold uppercase tracking-wider ${isOrion ? 'text-[#9b6fe8]' : 'text-[#00c8ff]'}`}>
              {speaker}
            </div>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed font-sans">
              “{text}”
            </p>
          </div>
        </div>
      );
      continue;
    }

    // 2. Multiple Choice Options (A. "...", B. "...", C. "...", D. "...")
    const optionMatch = trimmed.match(/^([A-D])\.\s*(.*)$/);
    if (optionMatch) {
      const letter = optionMatch[1];
      const rawText = optionMatch[2].replace(/^"|"$/g, '');

      elements.push(
        <div 
          key={i}
          className="group relative flex items-start gap-4 rounded-xl border border-slate-700/70 bg-slate-800/60 p-4 transition-all hover:border-[#00c8ff]/60 hover:bg-slate-800/90"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#00c8ff]/40 bg-[#00c8ff]/10 text-xs font-bold text-[#00c8ff] shadow-sm group-hover:bg-[#00c8ff] group-hover:text-slate-950 transition-colors">
            {letter}
          </div>
          <div className="text-sm md:text-base font-medium text-slate-100 leading-relaxed">
            “{rawText}”
          </div>
        </div>
      );
      continue;
    }

    // 3. Weak vs Safer / Correct vs Incorrect Comparisons
    if (trimmed.startsWith('Weak:') || trimmed.startsWith('Safer:')) {
      const isWeak = trimmed.startsWith('Weak:');
      const label = isWeak ? 'Weak Example' : 'Safer / Accurate';
      const content = trimmed.replace(/^(Weak:|Safer:)\s*/, '');

      elements.push(
        <div 
          key={i}
          className={`flex gap-3 rounded-xl border p-4 ${
            isWeak 
              ? 'bg-rose-950/20 border-rose-500/30' 
              : 'bg-emerald-950/20 border-emerald-500/30'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {isWeak ? <XCircle className="h-5 w-5 text-rose-400" /> : <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
          </div>
          <div>
            <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isWeak ? 'text-rose-400' : 'text-emerald-400'}`}>
              {label}
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{content}</p>
          </div>
        </div>
      );
      continue;
    }

    // 4. Numbered Steps / Levels / Ways (e.g., "1. What is...", "Level 1: ...", "Way 1: ...", "Step 1: ...")
    const stepMatch = trimmed.match(/^((?:Level|Way|Step|Method|Part|Round)?\s*\d+[:.]?)\s*(.*)$/i);
    if (stepMatch && stepMatch[2] && (trimmed.startsWith('1.') || trimmed.startsWith('2.') || trimmed.startsWith('3.') || trimmed.startsWith('4.') || trimmed.startsWith('5.') || trimmed.startsWith('6.') || trimmed.toLowerCase().startsWith('level') || trimmed.toLowerCase().startsWith('way') || trimmed.toLowerCase().startsWith('method') || trimmed.toLowerCase().startsWith('step'))) {
      const stepBadge = stepMatch[1];
      const stepBody = stepMatch[2];

      elements.push(
        <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
          <span className="inline-flex shrink-0 items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-purple-500/20 border border-purple-500/30 text-purple-300">
            {stepBadge}
          </span>
          <span className="text-sm md:text-base text-slate-200 leading-relaxed font-medium">
            {stepBody}
          </span>
        </div>
      );
      continue;
    }

    // 5. Synthesis / Takeaway / Conclusion paragraphs (e.g. "Your choice tells Orion...", "The first answer has too many...")
    if (
      trimmed.startsWith('Your choice tells') || 
      trimmed.startsWith('The first answer') || 
      trimmed.startsWith('The ladder lets') || 
      trimmed.startsWith('Why this matters:') || 
      trimmed.startsWith('This is not cheating')
    ) {
      elements.push(
        <div 
          key={i} 
          className="flex items-start gap-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 shadow-inner"
        >
          <Lightbulb className="h-5 w-5 text-[#00c8ff] shrink-0 mt-0.5" />
          <div className="text-sm md:text-base text-cyan-100 leading-relaxed">
            {trimmed}
          </div>
        </div>
      );
      continue;
    }

    // 6. Prompts / Question Opening (e.g. "Imagine you have 20 minutes before a big test...")
    if (trimmed.startsWith('Imagine you have') || trimmed.startsWith('Your friend missed') || trimmed.startsWith('Without looking back')) {
      elements.push(
        <div key={i} className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 font-medium text-base leading-relaxed">
          {trimmed}
        </div>
      );
      continue;
    }

    // 7. Regular Bullet or Checklist Item (e.g. starting with "•" or "-")
    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
      elements.push(
        <div key={i} className="flex items-start gap-3 text-sm md:text-base text-slate-200">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00c8ff]" />
          <span className="leading-relaxed">{trimmed.replace(/^[•\-]\s*/, '')}</span>
        </div>
      );
      continue;
    }

    // 8. Default Prose Paragraph
    elements.push(
      <p key={i} className="text-base text-slate-200 leading-relaxed">
        {trimmed}
      </p>
    );
  }

  return elements;
}
