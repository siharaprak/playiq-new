import Link from 'next/link';
import React from 'react';
import { enforceNodeGating } from '@/lib/gating';
import { advanceNodePhase } from '../../../actions';
import { module2Nodes } from '@/data/module2Content';
import { NodeMiniCheckForm } from '@/components/forms/NodeMiniCheckForm';
import ModuleLearningRecordPanel from '@/components/modules/ModuleLearningRecordPanel';

export default async function NodeMiniCheckPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  await enforceNodeGating(nodeId, 'mini-check', 2);

  const lessonData = module2Nodes[nodeId];

  if (!lessonData) {
    return <div className="p-12 text-center text-red-500 font-mono">ERR: NODE_DATA_NOT_FOUND</div>;
  }

  return (
    <div className="flex flex-col min-h-screen px-6 pt-24 pb-12 max-w-3xl mx-auto">
      <Link href="/student/modules/2/overview" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-6 transition-colors group" style={{ color: 'var(--text-secondary)' }}>
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Module</span>
      </Link>
      <div className="mb-4 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider">
        Module 2 · Node {nodeId} · Check Phase
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-8 text-[var(--text-primary)] uppercase font-display">Mini-Check Validation</h1>

      <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 mb-12 backdrop-blur-md">
        <h2 className="text-[#7b4fce] font-bold uppercase tracking-widest text-xs mb-3">LESSON CHECK</h2>
        <p className="mb-8 text-slate-400 font-mono text-sm">Answer the following questions in 1–3 full sentences each to confirm your understanding.</p>

        <NodeMiniCheckForm
          nodeId={nodeId}
          moduleId={2}
          questions={lessonData.miniCheck}
          submitAction={async () => {
            'use server';
            await advanceNodePhase(nodeId, 'mini-check');
          }}
        />
      </div>

      <ModuleLearningRecordPanel moduleNumber={2} showBlockerOnly={true} />
    </div>
  );
}
