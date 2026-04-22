import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import { submitArtifacts } from '../actions';

export default async function ProofArtifactsPage() {
  await enforceModuleGating('artifacts');

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-4 text-sm text-[#00f2ff] font-semibold uppercase tracking-wider">
        Module 1 • Final Output
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-8 text-white uppercase font-display">Proof Artifact Generation</h1>

      <div className="prose dark:prose-invert max-w-none mb-12">
        <p className="text-slate-400 font-mono text-sm leading-relaxed mb-8">
          Turn your learning into a personal code. Submit your AI Study Rules and Error Review Sheet below.
        </p>

        <form action={submitArtifacts} className="space-y-12">

          {/* Artifact 1: My AI Study Rules */}
          <div className="bg-slate-800/60 p-8 rounded-xl border border-[#00f2ff]/50 backdrop-blur-md">
            <h3 className="text-[#00f2ff] font-bold uppercase tracking-widest text-sm mb-6 border-b border-[#00f2ff]/30 pb-2">ARTIFACT 1: MY AI STUDY RULES</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 font-mono text-sm mb-2">&gt; I use AI to ________, not to ________.</label>
                <input required name="sr_use" type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00f2ff] rounded p-3 text-white text-sm outline-none" />
              </div>
              <div>
                <label className="block text-slate-300 font-mono text-sm mb-2">&gt; When I'm confused, I usually start with ________ Mode.</label>
                <input required name="sr_confused" type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00f2ff] rounded p-3 text-white text-sm outline-none" />
              </div>
              <div>
                <label className="block text-slate-300 font-mono text-sm mb-2">&gt; Before trusting an answer, I always ________.</label>
                <input required name="sr_trust" type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00f2ff] rounded p-3 text-white text-sm outline-none" />
              </div>
              <div>
                <label className="block text-slate-300 font-mono text-sm mb-2">&gt; One way AI can make me stronger is ________.</label>
                <input required name="sr_strengthen" type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00f2ff] rounded p-3 text-white text-sm outline-none" />
              </div>
            </div>
          </div>

          {/* Artifact 2: AI Error Review Sheet */}
          <div className="bg-slate-800/60 p-8 rounded-xl border border-[#ff00ff]/50 backdrop-blur-md">
            <h3 className="text-[#ff00ff] font-bold uppercase tracking-widest text-sm mb-6 border-b border-[#ff00ff]/30 pb-2">ARTIFACT 2: AI ERROR REVIEW SHEET</h3>
            <div className="space-y-6">
              <p className="text-slate-400 font-mono text-sm mb-4">Choose an AI mistake from this module and review it below.</p>
              <div>
                <label className="block text-slate-300 font-mono text-sm mb-2">&gt; What was the AI trying to help with?</label>
                <input required name="er_trying" type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#ff00ff] rounded p-3 text-white text-sm outline-none" />
              </div>
              <div>
                <label className="block text-slate-300 font-mono text-sm mb-2">&gt; What was wrong or risky about the answer?</label>
                <input required name="er_wrong" type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#ff00ff] rounded p-3 text-white text-sm outline-none" />
              </div>
              <div>
                <label className="block text-slate-300 font-mono text-sm mb-2">&gt; What clue told you it needed checking?</label>
                <input required name="er_clue" type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#ff00ff] rounded p-3 text-white text-sm outline-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <button
              type="submit"
              className="w-full md:w-auto bg-white text-black px-10 py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors"
            >
              Submit Artifacts &amp; Complete Module →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
