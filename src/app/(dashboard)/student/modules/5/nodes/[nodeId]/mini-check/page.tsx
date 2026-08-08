import Link from 'next/link';
import React from 'react';
import { enforceNodeGating } from '@/lib/gating';
import { advanceNodePhase } from '../../../actions';
import { module5Nodes } from '@/data/module5Content';
import { NodeMiniCheckForm } from '@/components/forms/NodeMiniCheckForm';

export default async function NodeMiniCheckPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  await enforceNodeGating(nodeId, 'mini-check', 5);

  const lessonData = module5Nodes[nodeId];

  if (!lessonData) {
    return <div className="p-12 text-center text-red-500 font-mono">ERR: NODE_DATA_NOT_FOUND</div>;
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider">
        Module 5 · Node {nodeId} · Check Phase
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-8 text-[var(--text-primary)] uppercase font-display">Mini-Check Validation</h1>

      <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 mb-12 backdrop-blur-md">
        <h2 className="text-[#7b4fce] font-bold uppercase tracking-widest text-xs mb-3">LESSON CHECK</h2>
        <p className="mb-8 text-slate-400 font-mono text-sm">Answer the following questions in 1–3 full sentences each to confirm your understanding.</p>

        <NodeMiniCheckForm
          nodeId={nodeId}
          moduleId={5}
          questions={lessonData.miniCheck}
          submitAction={async () => {
            'use server';
            await advanceNodePhase(nodeId, 'mini-check');
          }}
        />
      </div>
    </div>
  );
}
