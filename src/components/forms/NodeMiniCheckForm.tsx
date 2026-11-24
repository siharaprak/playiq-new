'use client';

import React, { useActionState, useRef } from 'react';
import { useFormAutoSave } from '@/hooks/useFormAutoSave';
import type { NodePhaseFormState } from './NodeActivityForm';

interface NodeMiniCheckFormProps {
  nodeId: string;
  moduleId: string | number;
  questions: string[];
  submitAction: (prevState: NodePhaseFormState, formData: FormData) => Promise<NodePhaseFormState>;
}

export function NodeMiniCheckForm({ nodeId, moduleId, questions, submitAction }: NodeMiniCheckFormProps) {
  const [state, formAction, isPending] = useActionState(submitAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  const signature = `m${moduleId}:n${nodeId}:${questions.join('|')}`;

  useFormAutoSave(`minicheck-autosave-m${moduleId}-n${nodeId}`, formRef, signature);

  return (
    <form ref={formRef} action={formAction} className="space-y-8 w-full">
      {state?.error && (
        <div
          role="alert"
          className="p-5 bg-red-950/60 border-2 border-red-500 rounded-xl text-red-100 text-sm font-mono break-words leading-relaxed shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-start gap-4"
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

      {questions.map((q, i) => {
        const fieldName = `minicheck-${i}`;
        return (
          <div key={i}>
            <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">&gt; {q}</label>
            <textarea
              name={fieldName}
              required
              defaultValue={state?.submittedValues?.[fieldName] || ''}
              placeholder="Awaiting validation input..."
              className={`neon-input w-full bg-black/50 border ${
                state?.error ? 'border-red-500/50 focus:border-red-400' : 'border-slate-700 focus:border-[#00c8ff]'
              } rounded-lg p-4 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-24`}
            />
          </div>
        );
      })}

      <div className="flex justify-end mt-8 border-t border-slate-700 pt-8 w-full">
        <button
          type="submit"
          disabled={isPending}
          className={`px-8 py-3 rounded-lg font-bold uppercase tracking-wider w-full md:w-auto transition-all ${
            isPending ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'btn-neon-filled cursor-pointer'
          }`}
        >
          {isPending ? 'EVALUATING...' : 'Submit Check →'}
        </button>
      </div>
    </form>
  );
}
