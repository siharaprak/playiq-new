import React from 'react';
import { enforceNodeGating } from '@/lib/gating';
import { advanceNodePhase } from '../../../actions';
import { module1Nodes } from '@/data/module1Content';

import { TeachBackForm } from '@/components/forms/TeachBackForm';

export default async function NodeTeachBackPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  await enforceNodeGating(nodeId, 'teach-back');

  const lessonData = module1Nodes[nodeId];

  if (!lessonData) {
    return <div className="p-12 text-center text-red-500 font-mono">ERR: NODE_DATA_NOT_FOUND</div>;
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-[#00f2ff] font-semibold uppercase tracking-wider">
        Node {nodeId} • Teach-Back Phase
      </div>
      
      <h1 className="text-4xl font-bold tracking-tight mb-8 text-white uppercase font-display">Knowledge Extraction</h1>
      
      <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 mb-12 backdrop-blur-md">
        <h2 className="text-[#39ff14] font-bold uppercase tracking-widest text-xs mb-3">FINAL GATING PROTOCOL</h2>
        <p className="mb-6 text-slate-300 font-mono text-sm leading-relaxed">
          To complete this node, you must prove cognitive ownership of the concept.
        </p>

        <div className="bg-indigo-900/30 p-6 border-l-4 border-[#00f2ff] rounded-r-lg mb-8">
           <p className="text-white font-mono text-lg">&gt; "{lessonData.teachBack}"</p>
        </div>
        
        <TeachBackForm nodeId={nodeId} prompt={lessonData.teachBack} />
      </div>
    </div>
  );
}
