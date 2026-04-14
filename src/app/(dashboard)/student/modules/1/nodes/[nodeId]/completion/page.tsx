import React from 'react';
import Link from 'next/link';
import { enforceNodeGating } from '@/lib/gating';

export default async function NodeCompletionPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  await enforceNodeGating(nodeId, 'completion');

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 py-12 text-center">
      <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 text-4xl">
        ✓
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Node Mastered!</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-lg">
        You've successfully mastered Node {nodeId}. Your Teach-Back was approved and you're ready to proceed.
      </p>

      {nodeId === '4' ? (
        <Link 
          href="/student/modules/1/quiz"
          className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
        >
          Proceed to Module Quiz →
        </Link>
      ) : (
        <Link 
          href="/student/modules/1/overview"
          className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
        >
          Unlock Next Node →
        </Link>
      )}
    </div>
  );
}
