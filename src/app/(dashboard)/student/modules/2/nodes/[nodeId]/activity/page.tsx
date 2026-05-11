import React from 'react';
import Link from 'next/link';
import { enforceNodeGating } from '@/lib/gating';
import { advanceNodePhase } from '../../../actions';
import { module2Nodes } from '@/data/module2Content';

export default async function NodeActivityPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  await enforceNodeGating(nodeId, 'activity', 2);

  const lessonData = module2Nodes[nodeId];

  if (!lessonData) {
    return <div className="p-12 text-center text-red-500 font-mono">ERR: NODE_DATA_NOT_FOUND</div>;
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider">
        Module 2 · Node {nodeId} · Application Phase
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-4 text-white uppercase font-display">
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

      <div className="space-y-6 mb-12">
        {lessonData.activity.scenarios.map((scenario, i) => (
          <div key={i} className="bg-slate-900/80 p-5 border border-[#7b4fce]/30 rounded-lg shadow-lg">
            <p className="text-white font-mono text-sm mb-4 tracking-wide">&gt; {scenario}</p>
            <textarea
              placeholder="AWAITING INPUT..."
              className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-white text-sm font-mono placeholder:opacity-50 outline-none h-20"
            />
          </div>
        ))}

        {lessonData.activity.reflection && lessonData.activity.reflection.length > 0 && (
          <div className="mt-12 pt-12 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white mb-6 font-display uppercase tracking-wider">Reflective Synthesis</h3>
            <div className="space-y-6">
              {lessonData.activity.reflection.map((prompt, i) => (
                <div key={`ref-${i}`} className="bg-[#7b4fce]/10 p-5 border border-[#7b4fce]/40 rounded-lg">
                  <p className="text-purple-200 font-bold mb-3">{prompt}</p>
                  <textarea
                    placeholder="Synthesizing..."
                    className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-white text-sm font-mono h-24 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-8 border-t border-slate-800 pt-8">
        <Link
          href={`/student/modules/2/nodes/${nodeId}/lesson`}
          className="text-slate-500 hover:text-white transition-colors font-mono text-sm uppercase tracking-widest"
        >
          ← Return to Lesson
        </Link>
        <form action={async () => {
          'use server';
          await advanceNodePhase(nodeId, 'activity');
        }}>
          <button
            type="submit"
            className="btn-neon-filled px-8 py-3 rounded-lg font-bold uppercase tracking-wider"
          >
            Submit &amp; Continue →
          </button>
        </form>
      </div>
    </div>
  );
}
