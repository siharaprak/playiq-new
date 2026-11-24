'use client';

import React, { useActionState, useRef } from 'react';
import { useFormAutoSave } from '@/hooks/useFormAutoSave';

export type NodePhaseFormState = {
  error?: string;
  submittedValues?: Record<string, string>;
} | null;

interface NodeActivityFormProps {
  nodeId: string;
  moduleId: string | number;
  scenarios: string[];
  reflection?: string[];
  backLink: string;
  submitAction: (prevState: NodePhaseFormState, formData: FormData) => Promise<NodePhaseFormState>;
}

export function NodeActivityForm({
  nodeId,
  moduleId,
  scenarios,
  reflection,
  backLink,
  submitAction,
}: NodeActivityFormProps) {
  const [state, formAction, isPending] = useActionState(submitAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  const signature = `m${moduleId}:n${nodeId}:${scenarios.join('|')}::${(reflection ?? []).join('|')}`;

  useFormAutoSave(`activity-autosave-m${moduleId}-n${nodeId}`, formRef, signature);

  return (
    <form ref={formRef} action={formAction} className="w-full">
      {state?.error && (
        <div
          role="alert"
          className="mb-6 p-5 bg-red-950/60 border-2 border-red-500 rounded-xl text-red-100 text-sm font-mono break-words leading-relaxed shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-start gap-4"
        >
          <span className="text-2xl shrink-0 mt-0.5 text-red-500">⚠️</span>
          <div className="flex-1">
            <p className="font-extrabold text-red-400 mb-1.5 uppercase tracking-widest text-xs">
              &gt; SEMANTIC EVALUATION FAILED
            </p>
            <p className="text-red-200/90 font-sans text-xs">{state.error}</p>
          </div>
        </div>
      )}

      <div className="space-y-6 mb-12">
        {scenarios.map((scenario, i) => {
          const fieldName = `scenario-${i}`;
          return (
            <div key={i} className="bg-slate-900/80 p-5 border border-[#7b4fce]/30 rounded-lg shadow-lg">
              <p className="text-[var(--text-primary)] font-mono text-sm mb-4 tracking-wide">&gt; {scenario}</p>
              <textarea
                name={fieldName}
                required
                defaultValue={state?.submittedValues?.[fieldName] || ''}
                placeholder="AWAITING INPUT..."
                className={`neon-input w-full bg-black/50 border ${
                  state?.error ? 'border-red-500/50 focus:border-red-400' : 'border-slate-700 focus:border-[#00c8ff]'
                } rounded p-3 text-[var(--text-primary)] text-sm font-mono placeholder:opacity-50 outline-none h-24`}
              />
            </div>
          );
        })}

        {reflection && reflection.length > 0 && (
          <div className="mt-12 pt-12 border-t border-slate-800">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 font-display uppercase tracking-wider">
              Reflective Synthesis
            </h3>
            <div className="space-y-6">
              {reflection.map((prompt, i) => {
                const fieldName = `reflection-${i}`;
                return (
                  <div key={`ref-${i}`} className="bg-[#7b4fce]/10 p-5 border border-[#7b4fce]/40 rounded-lg">
                    <p className="text-purple-200 font-bold mb-3">{prompt}</p>
                    <textarea
                      name={fieldName}
                      required
                      defaultValue={state?.submittedValues?.[fieldName] || ''}
                      placeholder="Synthesizing..."
                      className={`neon-input w-full bg-black/50 border ${
                        state?.error ? 'border-red-500/50 focus:border-red-400' : 'border-slate-700 focus:border-[#00c8ff]'
                      } rounded p-3 text-[var(--text-primary)] text-sm font-mono h-24 outline-none`}
                    />
                  </div>
                );
              })}
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
          disabled={isPending}
          className={`px-8 py-3 rounded-lg font-bold uppercase tracking-wider transition-all ${
            isPending ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'btn-neon-filled cursor-pointer'
          }`}
        >
          {isPending ? 'EVALUATING...' : 'Submit & Continue →'}
        </button>
      </div>
    </form>
  );
}
