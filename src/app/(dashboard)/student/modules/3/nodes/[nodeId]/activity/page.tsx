import React from 'react';
import Link from 'next/link';
import { enforceNodeGating } from '@/lib/gating';
import { advanceNodePhase } from '../../../actions';
import { module3Nodes } from '@/data/module3Content';
import { NodeActivityForm } from '@/components/forms/NodeActivityForm';

export default async function NodeActivityPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  await enforceNodeGating(nodeId, 'activity', 3);

  const lessonData = module3Nodes[nodeId];

  if (!lessonData) {
    return <div className="p-12 text-center text-red-500 font-mono">ERR: NODE_DATA_NOT_FOUND</div>;
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider">
        Module 3 · Node {nodeId} · Application Phase
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-4 text-[var(--text-primary)] uppercase font-display">
        {lessonData.activity.title}
      </h1>

      <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50 mb-8 backdrop-blur-md">
        <h3 className="text-[#7b4fce] font-bold uppercase tracking-widest text-xs mb-3">MISSION BRIEFING</h3>
        <ul className="space-y-2 text-slate-300 text-sm">
          {lessonData.activity.instructions.map((inst, i) => (
            <li key={i}>{inst}</li>
          ))}
        </ul>
      </div>

      <NodeActivityForm
        nodeId={nodeId}
        moduleId={3}
        scenarios={lessonData.activity.scenarios}
        reflection={lessonData.activity.reflection}
        backLink={`/student/modules/3/nodes/${nodeId}/lesson`}
        submitAction={async () => {
          'use server';
          await advanceNodePhase(nodeId, 'activity');
        }}
      />
    </div>
  );
}
