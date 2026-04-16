'use client';

import React, { useActionState } from 'react';
import { submitBossBattleAction } from '@/app/(dashboard)/student/modules/1/actions';

export function BossBattleForm() {
  const [state, formAction, isPending] = useActionState(submitBossBattleAction, null);

  return (
    <form action={formAction} className="space-y-12 mt-12">
      {state?.error && (
        <div className="mb-6 p-6 bg-red-900/40 border-2 border-red-500 rounded-xl text-red-200 text-sm font-mono break-words leading-relaxed shadow-[0_0_20px_rgba(255,0,0,0.3)] animate-pulse">
          <p className="font-bold text-red-400 mb-2 uppercase tracking-widest text-lg">&gt; CRITICAL EVALUATION FAILURE</p>
          <p className="mb-2">Your choices failed to meet the required cognitive threshold.</p>
          <p className="bg-black/60 p-4 rounded text-[#00f2ff]">{state.error}</p>
        </div>
      )}

      {/* Scenario 1 */}
      <div className="bg-slate-800/80 p-8 rounded-xl border border-slate-700/50 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
        <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">SCENARIO 1</h3>
        <div className="bg-black/50 p-4 rounded border border-slate-700 mb-6 font-mono text-sm text-[#00f2ff]">
          AI Response: "The quadratic formula is used only in geometry."
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">Step 1 — Label</label>
            <select required name="s1_label" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00f2ff] rounded p-3 text-white text-sm outline-none">
              <option value="">Select Label...</option>
              <option value="useful">Useful</option>
              <option value="risky">Risky</option>
              <option value="wrong">Wrong</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">Step 2 — Best Next Mode</label>
            <select required name="s1_mode" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00f2ff] rounded p-3 text-white text-sm outline-none">
              <option value="">Select Mode...</option>
              <option value="Explain Mode">Explain Mode</option>
              <option value="Hint Mode">Hint Mode</option>
              <option value="Quiz Mode">Quiz Mode</option>
              <option value="Coach Mode">Coach Mode</option>
              <option value="Learn Your Way Mode">Learn Your Way Mode</option>
              <option value="Lesson Rescue Mode">Lesson Rescue Mode</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">Step 3 — Better Next Question</label>
            <input required type="text" name="s1_question" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00f2ff] rounded p-3 text-white text-sm outline-none" placeholder="Your question..." />
          </div>
          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">Step 4 — How would you verify it?</label>
            <input required type="text" name="s1_verify" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00f2ff] rounded p-3 text-white text-sm outline-none" placeholder="Verification method..." />
          </div>
        </div>
      </div>
      
      {/* Scenario 2 */}
      <div className="bg-slate-800/80 p-8 rounded-xl border border-slate-700/50 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff00ff] to-purple-500"></div>
        <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">SCENARIO 2</h3>
        <div className="bg-black/50 p-4 rounded border border-slate-700 mb-6 font-mono text-sm text-[#00f2ff]">
          AI Response: "Here is your completed paragraph. Submit it like this."
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">Step 1 — Label</label>
            <select required name="s2_label" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#ff00ff] rounded p-3 text-white text-sm outline-none">
              <option value="">Select Label...</option>
              <option value="useful">Useful</option>
              <option value="risky">Risky</option>
              <option value="wrong">Wrong</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">Step 2 — Best Next Mode</label>
            <select required name="s2_mode" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#ff00ff] rounded p-3 text-white text-sm outline-none">
              <option value="">Select Mode...</option>
              <option value="Explain Mode">Explain Mode</option>
              <option value="Hint Mode">Hint Mode</option>
              <option value="Quiz Mode">Quiz Mode</option>
              <option value="Coach Mode">Coach Mode</option>
              <option value="Learn Your Way Mode">Learn Your Way Mode</option>
              <option value="Lesson Rescue Mode">Lesson Rescue Mode</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">Step 3 — Better Next Question</label>
            <input required type="text" name="s2_question" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#ff00ff] rounded p-3 text-white text-sm outline-none" placeholder="Your question..." />
          </div>
          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">Step 4 — How would you verify it?</label>
            <input required type="text" name="s2_verify" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#ff00ff] rounded p-3 text-white text-sm outline-none" placeholder="Verification method..." />
          </div>
        </div>
      </div>

      <div className="bg-indigo-900/40 p-8 rounded-xl border border-indigo-500/50 backdrop-blur-md">
        <h3 className="text-indigo-200 font-bold uppercase tracking-widest text-sm mb-4">BOSS BATTLE REFLECTION</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-indigo-300 font-mono text-sm mb-2">&gt; What was the biggest mistake AI made in these examples?</label>
            <textarea required name="reflection" className="neon-input w-full bg-black/50 border border-indigo-500/50 focus:border-indigo-400 rounded p-4 text-white text-sm outline-none min-h-[100px]" placeholder="Synthesis..." />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button 
          type="submit"
          disabled={isPending}
          className={`w-full md:w-auto px-10 py-4 rounded-lg font-bold uppercase tracking-widest transition-all ${isPending ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#ff00ff] to-[#00f2ff] text-black hover:opacity-90 shadow-[0_0_20px_rgba(0,242,255,0.4)]'}`}
        >
          {isPending ? 'ANALYZING THREAT LEVELS...' : 'Execute Final Strike →'}
        </button>
      </div>
    </form>
  );
}
