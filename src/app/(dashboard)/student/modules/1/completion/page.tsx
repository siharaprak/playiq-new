import React from 'react';
import Link from 'next/link';
import { enforceModuleGating } from '@/lib/gating';

export default async function ModuleCompletionPage() {
  await enforceModuleGating('completion');

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 py-12 text-center bg-gradient-to-b from-background to-accent/20">
      <div className="w-32 h-32 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-8 text-6xl shadow-xl">
        🏆
      </div>
      
      <h1 className="text-5xl font-extrabold tracking-tight mb-4">Module 1 Complete!</h1>
      <p className="text-2xl border-b pb-4 mb-6 inline-block font-medium">New Tier Unlocked: <span className="text-primary font-bold">Strategist</span></p>
      
      <p className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
        You've proven you understand how to use AI as a coach, rather than a shortcut. 
        Your Proof Artifacts have been logged and shared with your parents.
      </p>

      <Link 
        href="/student/home"
        className="bg-foreground text-background px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
