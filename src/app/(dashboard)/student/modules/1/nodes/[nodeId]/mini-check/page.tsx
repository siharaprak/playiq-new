import React from 'react';
import { enforceNodeGating } from '@/lib/gating';
import { advanceNodePhase } from '../../../actions';

export default async function NodeMiniCheckPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  await enforceNodeGating(nodeId, 'mini-check');

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-indigo-500 font-semibold uppercase tracking-wider">
        Node {nodeId} • Check Phase
      </div>
      
      <h1 className="text-4xl font-bold tracking-tight mb-8">Mini-Check</h1>
      
      <div className="bg-card text-card-foreground p-8 rounded-xl border shadow-sm mb-12">
        <h2 className="text-xl font-semibold mb-4">Quick Validation</h2>
        <p className="mb-6 text-muted-foreground">Select the correct answer to immediately test your understanding.</p>
        
        <form action={async () => {
          'use server';
          await advanceNodePhase(nodeId, 'mini-check');
        }} className="space-y-3">
          <label className="flex gap-4 p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors block">
            <input type="radio" name="mcq" required className="mt-1" /> Option A
          </label>
          <label className="flex gap-4 p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors block">
            <input type="radio" name="mcq" required className="mt-1" /> Option B
          </label>

          <div className="flex justify-end mt-8 border-t pt-8">
            <button 
              type="submit"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Submit & Proceed to Teach-Back →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
