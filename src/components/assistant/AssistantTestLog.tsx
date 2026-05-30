'use client';

import React, { useState } from 'react';
import { Plus, X, ShieldAlert } from 'lucide-react';

interface AssistantTestLogProps {
  testLog: string[];
  onChange: (updatedLog: string[]) => void;
  disabled?: boolean;
}

/**
 * AssistantTestLog — Tracks testing observations and outcomes.
 */
export default function AssistantTestLog({
  testLog = [],
  onChange,
  disabled = false,
}: AssistantTestLogProps) {
  const [newScenario, setNewScenario] = useState('');

  const handleAddScenario = () => {
    if (!newScenario.trim()) return;
    onChange([...testLog, newScenario.trim()]);
    setNewScenario('');
  };

  const handleDeleteScenario = (index: number) => {
    const updated = testLog.filter((_, i) => i !== index);
    onChange(updated);
  };

  const inputCls = `neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-[var(--text-primary)] text-xs font-mono outline-none transition-colors ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  return (
    <div className="space-y-6">
      <div className="border border-slate-800 bg-black/30 p-4 rounded-lg flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs font-mono space-y-1 text-slate-400">
          <p className="text-amber-400 font-bold uppercase tracking-wider">Verification Protocol Required</p>
          <p>
            Before publishing an assistant, you must verify it works as intended under different conditions. Document your testing scenarios, inputs tested, and whether it successfully respected its boundaries.
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Testing Scenarios Tested ({testLog.length})
          </label>
        </div>

        {/* Add scenario input */}
        {!disabled && (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newScenario}
              onChange={(e) => setNewScenario(e.target.value)}
              placeholder="e.g., Scenario 1: Refused to write essay draft directly — PASSED"
              className={inputCls}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddScenario();
              }}
            />
            <button
              type="button"
              onClick={handleAddScenario}
              className="btn-neon-cyan px-4 py-2.5 rounded font-mono text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Plus size={14} />
            </button>
          </div>
        )}

        {testLog.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-lg p-8 text-center text-slate-500 font-mono text-xs">
            No test entries yet. Add your verification details above.
          </div>
        ) : (
          <div className="space-y-2">
            {testLog.map((logItem, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border border-slate-800 bg-black/40 rounded-lg font-mono text-xs"
              >
                <span className="text-slate-300 break-all pr-4">{logItem}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleDeleteScenario(idx)}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded transition-colors flex-shrink-0"
                    aria-label={`Delete entry ${idx + 1}`}
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
