'use client';

import React, { useActionState } from 'react';
import { submitTeachBackAction } from '@/app/(dashboard)/student/modules/1/actions';

export function TeachBackForm({ nodeId, prompt }: { nodeId: string, prompt: string }) {
  // Bind the static arguments to the server action
  const boundAction = submitTeachBackAction.bind(null, nodeId, prompt);
  const [state, formAction, isPending] = useActionState(boundAction, null);

  return (
    <form action={formAction}>
      {state?.error && (
        <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-sm font-mono break-words leading-relaxed shadow-lg">
          <p className="font-bold text-red-400 mb-2 uppercase tracking-widest">&gt; SEMANTIC EVALUATION FAILED</p>
          {state.error}
        </div>
      )}
      
      <textarea 
        required
        name="teachBackResponse"
        className={`neon-input w-full min-h-[200px] p-5 rounded-lg border ${state?.error ? 'border-red-500/50 focus:border-red-400' : 'border-slate-700 focus:border-[#00f2ff]'} bg-black/60 text-white placeholder:opacity-50 font-mono text-sm outline-none mb-8 transition-colors`}
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
