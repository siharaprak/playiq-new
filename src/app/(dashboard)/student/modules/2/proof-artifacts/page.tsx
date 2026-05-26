import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import { submitArtifacts } from '../actions';
import { MODULES } from '@/lib/constants';
import { ProofArtifactSection } from '@/components/proof-artifacts/ProofArtifactSection';

export default async function Module2ProofArtifactsPage() {
  // Module 2 gating check (phase: artifacts, moduleNumber: 2, nodeCount: 6)
  await enforceModuleGating('artifacts', 2, 6);

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-4 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider">
        Module 2 · Final Output
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-4 text-[var(--text-primary)] uppercase font-display">Proof Artifact Generation</h1>
      <p className="text-slate-400 font-mono text-sm leading-relaxed mb-10">
        Turn your learning into a personal code. Complete both artifacts below to finalize Module 2.
      </p>

      <form action={submitArtifacts} className="space-y-12">

        {/* Artifact 1: Digital Warrior Code */}
        <div className="bg-slate-800/60 p-8 rounded-xl border border-[#00c8ff]/50 backdrop-blur-md">
          <h3 className="text-[#00c8ff] font-bold uppercase tracking-widest text-sm mb-6 border-b border-[#00c8ff]/30 pb-2">
            ARTIFACT 1: DIGITAL WARRIOR CODE
          </h3>
          <p className="text-slate-400 font-mono text-sm mb-6">Complete these sentences in your own words.</p>
          <div className="space-y-5">
            <div>
              <label className="block text-slate-300 font-mono text-sm mb-2">&gt; I want technology to help me become more _______________.</label>
              <input required name="dw_be_more" type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none" />
            </div>
            <div>
              <label className="block text-slate-300 font-mono text-sm mb-2">&gt; One way I will protect my attention is _______________.</label>
              <input required name="dw_attention" type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none" />
            </div>
            <div>
              <label className="block text-slate-300 font-mono text-sm mb-2">&gt; Before I trust something online, I will _______________.</label>
              <input required name="dw_trust" type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none" />
            </div>
            <div>
              <label className="block text-slate-300 font-mono text-sm mb-2">&gt; When AI helps me, I will still make sure I _______________.</label>
              <input required name="dw_ensure" type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none" />
            </div>
            <div>
              <label className="block text-slate-300 font-mono text-sm mb-2">&gt; One Highest Path question I want to use more often is _______________.</label>
              <input required name="dw_hp_question" type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none" />
            </div>
            <div>
              <label className="block text-slate-300 font-mono text-sm mb-2">&gt; One digital habit I want to improve is _______________.</label>
              <input required name="dw_habit" type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00c8ff] rounded p-3 text-[var(--text-primary)] text-sm outline-none" />
            </div>
          </div>
        </div>

        {/* Artifact 2: Highest Path Boundaries Plan */}
        <div className="bg-slate-800/60 p-8 rounded-xl border border-[#7b4fce]/50 backdrop-blur-md">
          <h3 className="text-[#7b4fce] font-bold uppercase tracking-widest text-sm mb-6 border-b border-[#7b4fce]/30 pb-2">
            ARTIFACT 2: HIGHEST PATH BOUNDARIES PLAN
          </h3>
          <p className="text-slate-400 font-mono text-sm mb-6">
            Choose 3 real boundaries you want to use in your life. For each one, explain what it is, why it matters, and when you will use it.
          </p>
          <p className="text-slate-500 font-mono text-xs mb-8">
            Example — Boundary: No random scrolling before homework | Why it matters: Keeps my attention from getting hijacked | When: Every school day before I study
          </p>

          {[1, 2, 3].map(n => (
            <div key={n} className="mb-8 p-5 rounded-lg border border-slate-700/50" style={{ background: 'rgba(123,79,206,0.05)' }}>
              <p className="text-[#7b4fce] font-bold uppercase tracking-widest text-xs mb-4">BOUNDARY {n}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-mono text-xs mb-2 uppercase tracking-wider">Boundary</label>
                  <input required name={`hp_b${n}_boundary`} type="text" placeholder="What is the boundary?" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#7b4fce] rounded p-3 text-[var(--text-primary)] text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-slate-300 font-mono text-xs mb-2 uppercase tracking-wider">Why It Matters</label>
                  <input required name={`hp_b${n}_why`} type="text" placeholder="Why does this boundary matter?" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#7b4fce] rounded p-3 text-[var(--text-primary)] text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-slate-300 font-mono text-xs mb-2 uppercase tracking-wider">When I Will Use It</label>
                  <input required name={`hp_b${n}_when`} type="text" placeholder="When will you use this boundary?" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#7b4fce] rounded p-3 text-[var(--text-primary)] text-sm outline-none" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="w-full md:w-auto bg-white text-black px-10 py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            Submit Artifacts &amp; Complete Module →
          </button>
        </div>
      </form>

      {/* Sprint 5 File Upload Beta */}
      <ProofArtifactSection moduleId={MODULES.MODULE_2_ID} />
    </div>
  );
}
