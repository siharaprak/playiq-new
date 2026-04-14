import React from 'react';
import Link from 'next/link';
import { enforceModuleGating } from '@/lib/gating';
import { submitArtifacts } from '../actions';

export default async function ProofArtifactsPage() {
  await enforceModuleGating('artifacts');

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-emerald-500">
        Proof Generation
      </div>
      
      <header className="mb-8 border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Build Your Proof Artifacts</h1>
        <p className="text-muted-foreground text-lg">
          Finalize your "My AI Study Rules" and "AI Error Review Sheet" to complete the module.
        </p>
      </header>

      <form action={submitArtifacts} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm flex flex-col">
          <h2 className="text-2xl font-bold mb-4">My AI Study Rules</h2>
          <p className="text-muted-foreground mb-6 flex-grow">
            Draft the 3 rules you will commit to when using AI for homework or studying going forward.
          </p>
          <textarea 
            name="studyRules"
            className="w-full min-h-[150px] p-4 bg-background border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            placeholder="1. I will always...\n2. I will never...\n3. If I get confused, I will..."
            required
            minLength={20}
          />
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm flex flex-col">
          <h2 className="text-2xl font-bold mb-4">AI Error Review Sheet</h2>
          <p className="text-muted-foreground mb-6 flex-grow">
            Summarize the biggest mistake you caught in the Boss Battle and how to prevent it.
          </p>
          <textarea 
            name="errorReview"
            className="w-full min-h-[150px] p-4 bg-background border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            placeholder="The biggest mistake was..."
            required
            minLength={15}
          />
        </div>

        <div className="md:col-span-2 flex justify-end mt-4 border-t pt-8">
          <button 
            type="submit"
            className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-500 transition-colors shadow-lg"
          >
            Submit Artifacts & Complete Module
          </button>
        </div>
      </form>
    </div>
  );
}
