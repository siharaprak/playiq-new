import React from 'react';
import { enforceNodeGating } from '@/lib/gating';
import { submitTeachBackMVP } from '../../../actions';

export default async function NodeTeachBackPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  await enforceNodeGating(nodeId, 'teach-back');

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-purple-500 font-semibold uppercase tracking-wider">
        Node {nodeId} • Mastery Phase
      </div>
      
      <h1 className="text-4xl font-bold tracking-tight mb-8">Teach-Back</h1>
      
      <form action={submitTeachBackMVP}>
        <input type="hidden" name="nodeId" value={nodeId} />
        
        <div className="bg-card text-card-foreground p-8 rounded-xl border shadow-sm mb-12">
          <h2 className="text-xl font-semibold mb-4">Explain It Your Way</h2>
          <p className="mb-6 text-muted-foreground">
            To prove mastery, write a short explanation of what you just learned. 
            Use your own words—do not copy the lesson.
          </p>
          
          <textarea 
            name="explanation"
            className="w-full min-h-[200px] p-4 bg-background border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Start typing your explanation here..."
            required
            minLength={50}
          />
          <div className="mt-2 text-sm text-muted-foreground text-right border-t pt-2">
            MVP threshold: Minimum 30 words required. Must cover 'AI', 'coach', or 'prompt'.
          </div>
        </div>

        <div className="flex justify-end mt-8 border-t pt-8">
          <button 
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Submit Teach-Back
          </button>
        </div>
      </form>
    </div>
  );
}
