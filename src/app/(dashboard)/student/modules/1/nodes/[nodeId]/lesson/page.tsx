import React from 'react';
import { enforceNodeGating } from '@/lib/gating';
import { advanceNodePhase } from '../../../actions';

export default async function NodeLessonPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  await enforceNodeGating(nodeId, 'lesson');

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-muted-foreground uppercase tracking-wider">
        Node {nodeId} • Lesson Phase
      </div>
      
      <h1 className="text-4xl font-bold tracking-tight mb-8">Concept Mastery</h1>
      
      <div className="prose dark:prose-invert max-w-none mb-12">
        {nodeId === '1' ? (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-indigo-500/30 p-6 rounded-xl shadow-inner font-mono text-sm text-indigo-200">
               <p className="uppercase tracking-widest text-indigo-400 mb-2 font-bold">&gt; TRANSMISSION INCOMING...</p>
               <p>Welcome to the grid, Apprentice. Before you can start commanding the Engine, you need to understand what it is—and what it isn't.</p>
               <p className="mt-4">
                 AI is an incredibly powerful pattern-matching engine. It is <strong>excellent</strong> at synthesizing large amounts of data, generating ideas quickly, and explaining complex logic (like how a structural load bearer works). 
               </p>
               <p className="mt-4">
                 However, AI is <strong>bad</strong> at absolute truth. It does not "think"—it predicts. It will hallucinate facts with absolute confidence, and it cannot replace your own physical ingenuity when the blocks are in your hands.
               </p>
               <p className="mt-4 text-[#00f2ff] font-bold">
                 &gt; MISSION OBJECTIVE: Learn to treat the AI as a Co-Pilot, not an Oracle.
               </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p>This is where the structured lesson content goes. Content will be dynamically pulled based on the nodeId.</p>
            <p>You cannot proceed simply by scrolling to the bottom. You must actively complete the activity next.</p>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-8 border-t pt-8">
        <form action={async () => {
          'use server';
          await advanceNodePhase(nodeId, 'lesson');
        }}>
          <button 
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Begin Activity →
          </button>
        </form>
      </div>
    </div>
  );
}
