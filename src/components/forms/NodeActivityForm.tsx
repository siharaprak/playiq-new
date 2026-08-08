'use client';

import React, { useRef } from 'react';
import { useFormAutoSave } from '@/hooks/useFormAutoSave';

interface NodeActivityFormProps {
  nodeId: string;
  moduleId: string | number;
  scenarios: string[];
  reflection?: string[];
  backLink: string;
  submitAction: () => Promise<void>;
}

export function NodeActivityForm({ nodeId, moduleId, scenarios, reflection, backLink, submitAction }: NodeActivityFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  // Apply auto-save hook
  useFormAutoSave(`activity-autosave-m${moduleId}-n${nodeId}`, formRef);

  return (
    <form ref={formRef} action={submitAction} className="w-full">
      <div className="space-y-6 mb-12">
        {scenarios.map((scenario, i) => (
          <div key={i} className="bg-slate-900/80 p-5 border border-[#7b4fce]/30 rounded-lg shadow-lg">
            <p className="text-[var(--text-primary)] font-mono text-sm mb-4 tracking-wide">&gt; {scenario}</p>
            <textarea
              name={`scenario-${i}`}
              placeholder="AWAITING INPUT..."
              className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm font-mono placeholder:opacity-50 outline-none h-20"
            />
          </div>
        ))}

        {reflection && reflection.length > 0 && (
          <div className="mt-12 pt-12 border-t border-slate-800">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 font-display uppercase tracking-wider">Reflective Synthesis</h3>
            <div className="space-y-6">
              {reflection.map((prompt, i) => (
                <div key={`ref-${i}`} className="bg-[#7b4fce]/10 p-5 border border-[#7b4fce]/40 rounded-lg">
                  <p className="text-purple-200 font-bold mb-3">{prompt}</p>
                  <textarea
                    name={`reflection-${i}`}
                    placeholder="Synthesizing..."
                    className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm font-mono h-24 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-8 border-t border-slate-800 pt-8 w-full">
        <a
          href={backLink}
          className="text-slate-500 hover:text-[var(--text-primary)] transition-colors font-mono text-sm uppercase tracking-widest"
        >
          ← Return to Lesson
        </a>
        <button
          type="submit"
          className="btn-neon-filled px-8 py-3 rounded-lg font-bold uppercase tracking-wider"
        >
          Submit &amp; Continue →
        </button>
      </div>
    </form>
  );
}
