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
        <p>This is where the structured lesson content goes. Content will be dynamically pulled or hardcoded based on the nodeId.</p>
        <p>You cannot proceed simply by scrolling to the bottom. You must actively complete the activity next.</p>
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
