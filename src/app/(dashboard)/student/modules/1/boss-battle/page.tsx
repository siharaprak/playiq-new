import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function BossBattlePage() {
  const { user } = await enforceModuleGating('boss-battle');
  
  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-4 text-sm text-[#ff00ff] font-semibold uppercase tracking-wider animate-pulse">
        Module 1 • Final Assessment
      </div>
      
      <h1 className="text-5xl font-bold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00f2ff] font-display uppercase drop-shadow-[0_0_15px_rgba(255,0,255,0.5)]">
        1B Error Hunter Challenge
      </h1>
      
      <div className="prose dark:prose-invert max-w-none mb-12">
        <div className="bg-slate-900 border border-[#ff00ff]/50 p-6 rounded-xl shadow-[0_0_20px_rgba(255,0,255,0.15)] font-mono text-sm text-slate-300">
           <p className="uppercase tracking-widest text-[#ff00ff] mb-2 font-bold">&gt; BOSS BATTLE PROTOCOL INITIATED</p>
           <p>This is your final Challenge for Module 1. You are going to act like a real AI learner.</p>
           <ul className="mt-4 list-none space-y-2">
             <li><span className="text-[#00f2ff] mr-2">1.</span> Label the AI response (Useful, Risky, Wrong)</li>
             <li><span className="text-[#00f2ff] mr-2">2.</span> Choose the best next mode</li>
             <li><span className="text-[#00f2ff] mr-2">3.</span> Write a better next question or action</li>
             <li><span className="text-[#00f2ff] mr-2">4.</span> Explain how you would verify it</li>
           </ul>
        </div>

        <form action={async () => {
          'use server';
          const supabase = await createClient();
          // Mocking a perfect pass submission (5/5)
          await supabase
            .from('assessment_submissions')
            .upsert({
               student_id: user.id,
               assessment_type: 'boss_battle',
               score_numeric: 5,
               pass_status: true,
               raw_responses: { autoPass: true }
            }, { onConflict: 'student_id, assessment_type' });
            
          redirect('/student/modules/1/proof-artifacts');
        }} className="space-y-12 mt-12">

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
                <select required className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00f2ff] rounded p-3 text-white text-sm outline-none">
                  <option value="">Select Label...</option>
                  <option value="useful">Useful</option>
                  <option value="risky">Risky</option>
                  <option value="wrong">Wrong</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">Step 2 — Best Next Mode</label>
                <select required className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00f2ff] rounded p-3 text-white text-sm outline-none">
                  <option value="">Select Mode...</option>
                  <option value="explain">Explain Mode</option>
                  <option value="hint">Hint Mode</option>
                  <option value="quiz">Quiz Mode</option>
                  <option value="coach">Coach Mode</option>
                  <option value="learn">Learn Your Way Mode</option>
                  <option value="rescue">Lesson Rescue Mode</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">Step 3 — Better Next Question</label>
                <input required type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00f2ff] rounded p-3 text-white text-sm outline-none" placeholder="Your question..." />
              </div>
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">Step 4 — How would you verify it?</label>
                <input required type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#00f2ff] rounded p-3 text-white text-sm outline-none" placeholder="Verification method..." />
              </div>
            </div>
          </div>
          
          {/* Scenario 2 */}
          <div className="bg-slate-800/80 p-8 rounded-xl border border-slate-700/50 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">SCENARIO 2</h3>
            <div className="bg-black/50 p-4 rounded border border-slate-700 mb-6 font-mono text-sm text-[#00f2ff]">
              AI Response: "Here is your completed paragraph. Submit it like this."
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">Step 1 — Label</label>
                <select required className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#ff00ff] rounded p-3 text-white text-sm outline-none">
                  <option value="">Select Label...</option>
                  <option value="useful">Useful</option>
                  <option value="risky">Risky</option>
                  <option value="wrong">Wrong</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">Step 2 — Better Next Question</label>
                <input required type="text" className="neon-input w-full bg-black/50 border border-slate-700 focus:border-[#ff00ff] rounded p-3 text-white text-sm outline-none" placeholder="Your question..." />
              </div>
            </div>
          </div>

          <div className="bg-indigo-900/40 p-8 rounded-xl border border-indigo-500/50 backdrop-blur-md">
            <h3 className="text-indigo-200 font-bold uppercase tracking-widest text-sm mb-4">BOSS BATTLE REFLECTION</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-indigo-300 font-mono text-sm mb-2">&gt; What was the biggest mistake AI made in these examples?</label>
                <textarea required className="neon-input w-full bg-black/50 border border-indigo-500/50 focus:border-indigo-400 rounded p-4 text-white text-sm outline-none min-h-[100px]" placeholder="Synthesis..." />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <button 
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-[#ff00ff] to-[#00f2ff] text-black px-10 py-4 rounded-lg font-bold uppercase tracking-widest hover:opacity-90 shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all"
            >
              Excute Final Strike →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
