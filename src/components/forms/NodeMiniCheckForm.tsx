'use client';

import React, { useRef } from 'react';
import { useFormAutoSave } from '@/hooks/useFormAutoSave';

interface NodeMiniCheckFormProps {
  nodeId: string;
  moduleId: string | number;
  questions: string[];
  submitAction: () => Promise<void>;
}

export function NodeMiniCheckForm({ nodeId, moduleId, questions, submitAction }: NodeMiniCheckFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  // Apply auto-save hook
  useFormAutoSave(`minicheck-autosave-m${moduleId}-n${nodeId}`, formRef);

  return (
    <form ref={formRef} action={submitAction} className="space-y-8 w-full">
      {questions.map((q, i) => (
        <div key={i}>
          <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">&gt; {q}</label>
          <textarea
            name={`minicheck-${i}`}
            required
            placeholder="Awaiting validation input..."
            className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded-lg p-4 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-24"
          />
        </div>
      ))}

      <div className="flex justify-end mt-8 border-t border-slate-700 pt-8 w-full">
        <button
          type="submit"
          className="btn-neon-filled px-8 py-3 rounded-lg font-bold uppercase tracking-wider w-full md:w-auto"
        >
          Submit Check →
        </button>
      </div>
    </form>
  );
}
