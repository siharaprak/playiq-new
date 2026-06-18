import Link from 'next/link';
import React from 'react';
import { enforceNodeGating } from '@/lib/gating';
import { module9Nodes } from '@/data/module9Content';
import { TeachBackForm } from '@/components/forms/TeachBackForm';
import { submitTeachBackAction } from '@/app/(dashboard)/student/modules/9/actions';

export default async function NodeTeachBackPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  await enforceNodeGating(nodeId, 'teach-back', 9);

  const lessonData = module9Nodes[nodeId];

  if (!lessonData) {
    return <div className="p-12 text-center text-red-500 font-mono">ERR: NODE_DATA_NOT_FOUND</div>;
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider">
        Module 9 · Node {nodeId} · Teach-Back Phase
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-8 text-[var(--text-primary)] uppercase font-display">Knowledge Extraction</h1>

      <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 mb-12 backdrop-blur-md">
        <h2 className="text-[#7b4fce] font-bold uppercase tracking-widest text-xs mb-3">FINAL GATING PROTOCOL</h2>
        <p className="mb-6 text-slate-300 font-mono text-sm leading-relaxed">
          To complete this node, you must prove cognitive ownership of the concept. Write your answer in full sentences.
        </p>

        <div className="bg-[#7b4fce]/10 p-6 border-l-4 border-[#00c8ff] rounded-r-lg mb-8">
          <p className="text-[var(--text-primary)] font-mono text-lg">&gt; &quot;{lessonData.teachBack}&quot;</p>
        </div>

        <TeachBackForm nodeId={nodeId} prompt={lessonData.teachBack} submitAction={submitTeachBackAction} />
      </div>
    </div>
  );
}
