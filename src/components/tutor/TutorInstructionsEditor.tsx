'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';
import type { TutorInstructions } from '@/lib/tutor/types';

interface TutorInstructionsEditorProps {
  instructions: TutorInstructions;
  onChange: (instructions: TutorInstructions) => void;
  disabled?: boolean;
}

const MAX_RULES = 10;

/**
 * TutorInstructionsEditor — Edit the core instruction_set textarea
 * and manage an ordered list of rules (max 10).
 */
export default function TutorInstructionsEditor({
  instructions,
  onChange,
  disabled = false,
}: TutorInstructionsEditorProps) {
  const inputCls = `neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-[var(--text-primary)] text-xs font-mono outline-none transition-colors ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  const labelCls = 'block font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-1.5';

  // ── Handlers ──────────────────────────────────────────────────────
  const handleInstructionSetChange = (value: string) => {
    onChange({ ...instructions, instruction_set: value });
  };

  const handleAddRule = () => {
    if (instructions.rules.length >= MAX_RULES) return;
    onChange({ ...instructions, rules: [...instructions.rules, ''] });
  };

  const handleRuleChange = (index: number, value: string) => {
    const updated = [...instructions.rules];
    updated[index] = value;
    onChange({ ...instructions, rules: updated });
  };

  const handleDeleteRule = (index: number) => {
    const updated = instructions.rules.filter((_, i) => i !== index);
    onChange({ ...instructions, rules: updated });
  };

  return (
    <div className="space-y-6">
      {/* Core Instruction Set */}
      <div>
        <label className={labelCls}>Core Instructions</label>
        <textarea
          rows={8}
          value={instructions.instruction_set}
          disabled={disabled}
          onChange={(e) => handleInstructionSetChange(e.target.value)}
          placeholder="Write the core instructions for your AI tutor. What should it always do? What should it never do?"
          className={inputCls + ' resize-y min-h-[180px]'}
        />
      </div>

      {/* Rules Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Rules ({instructions.rules.length}/{MAX_RULES})
          </label>
          {!disabled && instructions.rules.length < MAX_RULES && (
            <button
              type="button"
              onClick={handleAddRule}
              className="btn-neon-cyan inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all"
            >
              <Plus size={12} />
              Add Rule
            </button>
          )}
        </div>

        {instructions.rules.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-lg p-6 text-center">
            <p className="font-mono text-xs text-slate-500">
              No rules added yet. Rules help define clear boundaries for your tutor.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {instructions.rules.map((rule, index) => (
              <div key={index} className="flex items-center gap-2">
                {/* Rule number badge */}
                <span className="flex-shrink-0 w-6 h-6 rounded bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center">
                  {index + 1}
                </span>

                <input
                  type="text"
                  value={rule}
                  disabled={disabled}
                  onChange={(e) => handleRuleChange(index, e.target.value)}
                  placeholder={`Rule ${index + 1}...`}
                  className={inputCls}
                />

                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleDeleteRule(index)}
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
                    aria-label={`Delete rule ${index + 1}`}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
