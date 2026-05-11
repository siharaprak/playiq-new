import Link from 'next/link';
import React from 'react';
import { enforceNodeGating } from '@/lib/gating';
import { advanceNodePhase } from '../../../actions';
import { module10Nodes } from '@/data/module10Content';

export default async function NodeMiniCheckPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  await enforceNodeGating(nodeId, 'mini-check', 2);

  const lessonData = module10Nodes[nodeId];

  if (!lessonData) {
    return <div className="p-12 text-center text-red-500 font-mono">ERR: NODE_DATA_NOT_FOUND</div>;
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider">
        Module 10 · Node {nodeId} · Check Phase
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-8 text-[var(--text-primary)] uppercase font-display">Mini-Check Validation</h1>

      <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 mb-12 backdrop-blur-md">
        <h2 className="text-[#7b4fce] font-bold uppercase tracking-widest text-xs mb-3">LESSON CHECK</h2>
        <p className="mb-8 text-slate-400 font-mono text-sm">Answer the following questions in 1–3 full sentences each to confirm your understanding.</p>

        <form action={async () => {
          'use server';
          await advanceNodePhase(nodeId, 'mini-check');
        }} className="space-y-8">
          {lessonData.miniCheck.map((q, i) => (
            <div key={i}>
              <label className="block text-[var(--text-primary)] font-mono text-sm mb-3">&gt; {q}</label>
              <textarea
                required
                placeholder="Awaiting validation input..."
                className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded-lg p-4 text-[var(--text-primary)] text-sm outline-none placeholder:opacity-50 h-24"
              />
            </div>
          ))}

          <div className="flex justify-end mt-8 border-t border-slate-700 pt-8">
            <button
              type="submit"
              className="btn-neon-filled px-8 py-3 rounded-lg font-bold uppercase tracking-wider w-full md:w-auto"
            >
              Submit Check →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
