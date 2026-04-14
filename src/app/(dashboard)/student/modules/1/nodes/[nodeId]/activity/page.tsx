import React from 'react';
import Link from 'next/link';
import { enforceNodeGating } from '@/lib/gating';
import { advanceNodePhase } from '../../../actions';

export default async function NodeActivityPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  await enforceNodeGating(nodeId, 'activity');

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-blue-500 font-semibold uppercase tracking-wider">
        Node {nodeId} • Activity Phase
      </div>
      
      <h1 className="text-4xl font-bold tracking-tight mb-8">Interactive Challenge</h1>
      
      <div className="bg-card text-card-foreground p-8 rounded-xl border shadow-sm mb-12 min-h-[300px] flex items-center justify-center">
        <p className="text-center text-muted-foreground">
          Interactive AI Activity Canvas goes here.<br/>
          (Student interacts with prompts or examples specific to this node.)
        </p>
      </div>

      <div className="flex justify-between items-center mt-8 border-t pt-8">
        <Link 
          href={`/student/modules/1/nodes/${nodeId}/lesson`}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Lesson
        </Link>
        <form action={async () => {
          'use server';
          await advanceNodePhase(nodeId, 'activity');
        }}>
          <button 
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Complete Activity & Review →
          </button>
        </form>
      </div>
    </div>
  );
}
