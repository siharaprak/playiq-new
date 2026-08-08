'use client';

import React, { useActionState, useRef } from 'react';
import { useFormAutoSave } from '@/hooks/useFormAutoSave';

interface TeachBackFormProps {
  nodeId: string;
  prompt: string;
  submitAction: (nodeId: string, prompt: string, prevState: any, formData: FormData) => Promise<any>;
}

export function TeachBackForm({ nodeId, prompt, submitAction }: TeachBackFormProps) {
  // Bind the static arguments to the passed-in server action
  const boundAction = submitAction.bind(null, nodeId, prompt);
  const [state, formAction, isPending] = useActionState(boundAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  
  useFormAutoSave(`teachback-autosave-${nodeId}`, formRef);

  return (
    <form ref={formRef} action={formAction}>
      {state?.error && (
        <div className="mb-6 p-5 bg-red-950/60 border-2 border-red-500 rounded-xl text-red-100 text-sm font-mono break-words leading-relaxed shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-start gap-4 animate-pulse-subtle">
          <span className="text-2xl shrink-0 mt-0.5 text-red-500">⚠️</span>
          <div className="flex-1">
            <p className="font-extrabold text-red-400 mb-1.5 uppercase tracking-widest text-xs">
              &gt; SEMANTIC EVALUATION FAILED
            </p>
            <p className="text-red-200/90 font-sans text-xs">
              {state.error}
            </p>
          </div>
        </div>
      )}
      
      <textarea 
        required
        name="teachBackResponse"
        className={`neon-input w-full min-h-[200px] p-5 rounded-lg border ${state?.error ? 'border-red-500/50 focus:border-red-400' : 'border-slate-700 focus:border-[#00c8ff]'} bg-black/60 text-white placeholder:opacity-50 font-mono text-sm outline-none mb-8 transition-colors`}
        placeholder="Awaiting audio/text dictation... Explain the concept clearly as if teaching another apprentice."
        defaultValue={state?.submittedText || ''}
      ></textarea>

      <div className="flex justify-end mt-4 border-t border-slate-800 pt-8">
        <button 
          type="submit"
          disabled={isPending}
          className={`px-8 py-4 rounded-lg font-bold uppercase tracking-wider w-full md:w-auto transition-all ${isPending ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'btn-neon-filled'}`}
        >
          {isPending ? 'EVALUATING...' : 'Submit Proof & Complete Node →'}
        </button>
      </div>
    </form>
  );
}

