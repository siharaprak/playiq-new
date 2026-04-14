import React from 'react';
import Link from 'next/link';
import { enforceModuleGating } from '@/lib/gating';
import { submitBossBattle } from '../actions';

export default async function BossBattlePage() {
  await enforceModuleGating('boss-battle');

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-500">
        Final Challenge
      </div>
      
      <header className="mb-8 border-b pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">1B Error Hunter</h1>
          <p className="text-muted-foreground text-lg">
            Find the critical errors in the AI interactions. Score 4/5 to pass.
          </p>
        </div>
        <div className="text-2xl font-bold bg-amber-500/10 text-amber-500 px-4 py-2 rounded-lg">
          Boss Battle
        </div>
      </header>

      <div className="bg-card text-card-foreground p-8 rounded-xl border-2 border-amber-500/20 shadow-sm mb-12">
        <form action={submitBossBattle} className="space-y-8">
          
          <div className="p-6 bg-accent rounded-lg">
            <h3 className="font-bold text-lg mb-2">Scenario 1</h3>
            <p className="italic text-muted-foreground mb-4">"Hey AI, write my entire history paper on the French Revolution."</p>
            <p className="mb-4">Identify the primary Error Code:</p>
            <textarea name="scenario1" className="w-full bg-background p-3 rounded border" placeholder="Type your diagnosis..." required />
          </div>

          <div className="p-6 bg-accent rounded-lg">
            <h3 className="font-bold text-lg mb-2">Scenario 2</h3>
            <p className="italic text-muted-foreground mb-4">"The AI gave me a list of 5 citations for my sociology paper. I copied them into my bibliography."</p>
            <p className="mb-4">Identify the primary Error Code:</p>
            <textarea name="scenario2" className="w-full bg-background p-3 rounded border" placeholder="Type your diagnosis..." required />
          </div>

          <div className="p-6 bg-accent rounded-lg">
            <h3 className="font-bold text-lg mb-2">Scenario 3</h3>
            <p className="italic text-muted-foreground mb-4">"I'm confused about calculus. I asked the AI to solve the problem and give me the answer."</p>
            <p className="mb-4">Identify the primary Error Code:</p>
            <textarea name="scenario3" className="w-full bg-background p-3 rounded border" placeholder="Type your diagnosis..." required />
          </div>

          <div className="flex justify-end mt-8 border-t pt-8">
            <button 
              type="submit"
              className="bg-amber-500 text-amber-950 px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-400 transition-colors shadow-lg"
            >
              Submit Final Answers
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
