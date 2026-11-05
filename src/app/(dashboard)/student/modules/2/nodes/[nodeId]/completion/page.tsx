import React from 'react';
import Link from 'next/link';
import { enforceNodeGating } from '@/lib/gating';

const TOTAL_NODES = 6;

export default async function NodeCompletionPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  await enforceNodeGating(nodeId, 'completion', 2);

  const isLastNode = nodeId === String(TOTAL_NODES);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 pt-24 pb-12 text-center">
      <div className="mb-6">
        <Link
          href="/student/modules/2/overview"
          className="text-slate-400 hover:text-white transition-colors text-xs font-mono tracking-wider uppercase inline-flex items-center gap-2"
        >
          <span>←</span> Back to Module 2
        </Link>
      </div>
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6 text-4xl"
        style={{ background: 'rgba(57,255,20,0.15)', color: '#39ff14', border: '2px solid rgba(57,255,20,0.4)' }}
      >
        ✓
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-[var(--text-primary)]">Node {nodeId} Mastered!</h1>
      <p className="text-xl mb-8 max-w-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        You&apos;ve successfully mastered Node {nodeId}. Your Teach-Back was approved — you own this concept.
      </p>

      {isLastNode ? (
        <Link
          href="/student/modules/2/quiz"
          className="px-8 py-4 rounded-lg font-bold text-lg transition-opacity hover:opacity-90 shadow-lg"
          style={{ background: '#00c8ff', color: '#0a0f1e' }}
        >
          Proceed to Module Quiz →
        </Link>
      ) : (
        <Link
          href="/student/modules/2/overview"
          className="px-8 py-4 rounded-lg font-bold text-lg transition-opacity hover:opacity-90 shadow-lg"
          style={{ background: '#7b4fce', color: '#fff' }}
        >
          Unlock Next Node →
        </Link>
      )}
    </div>
  );
}
