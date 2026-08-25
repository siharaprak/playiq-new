import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parents | PlayIQ',
  description: 'Learn how PlayIQ delivers structured STEM outcomes, safer screen time, and verifiable academic progress for teenagers aged 13-17.',
};

export default function Parents() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      {/* Glow Accent */}
      <div className="absolute top-[25%] right-[10%] w-[500px] h-[500px] bg-[rgba(0,200,255,0.04)] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-[rgba(123,79,206,0.04)] rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute top-[5%] left-[5%] font-display text-[0.6rem] tracking-[0.3em] text-[#7b4fce] opacity-60 uppercase text-left hidden sm:block pointer-events-none">
        VIEW_MODE: PARENT_INSIGHT<br/>
        SECURE // COPPA_COMPLIANT
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 sm:pt-16 sm:pb-24 relative z-10 space-y-12 sm:space-y-20">
        
        {/* Hero */}
        <section className="text-center space-y-4 sm:space-y-6">
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-6xl uppercase tracking-wider sm:tracking-widest text-[#00c8ff] drop-shadow-[0_0_15px_rgba(0,200,255,0.4)]">
            PROOF, NOT PROMISES
          </h1>
          <p className="font-mono text-xs md:text-sm uppercase text-slate-400 max-w-3xl mx-auto leading-relaxed tracking-wider border-r-2 border-[#7b4fce] pr-3 sm:pr-4">
            Don't just trust that they are studying. See actual, verifiable proof of their conceptual understanding, effort levels, and worksheets in the Parent Proof Packet.
          </p>
        </section>

        {/* Core methodology differences */}
        <section className="glass-card p-5 sm:p-8 md:p-10 !rounded-none !border-t-0 !border-b-0 border-x-4 border-l-[#00c8ff] border-r-[#7b4fce]">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <div className="border border-[rgba(123,79,206,0.3)] bg-black h-56 sm:h-72 md:h-80 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('/images/tier2-parent-proof-packet.png')] bg-cover bg-center opacity-30 mix-blend-screen"></div>
              <span className="font-display tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-xs text-[#7b4fce] z-10">[ DASHBOARD_PREVIEW ]</span>
            </div>
            <div className="font-mono text-xs text-slate-300 uppercase tracking-widest leading-[1.8] sm:leading-[2]">
              <h2 className="font-display text-lg sm:text-xl text-glow-cyan text-white mb-4 sm:mb-6 tracking-[0.15em] sm:tracking-[0.2em] border-b border-[#00c8ff] pb-3 sm:pb-4 inline-block">&gt; WHY THIS IS DIFFERENT</h2>
              <p className="mb-4 sm:mb-6 opacity-80 text-[11px] sm:text-xs">
                Passive learning applications give false progress metrics. Clicking buttons, skipping videos, and guessing multiple-choice options look like success.
              </p>
              <p className="opacity-80 font-semibold text-[#00c8ff] text-[11px] sm:text-xs">
                PlayIQ forces cognitive engagement. Students must write explanations in their own words, complete active recall worksheets, and configure custom AI tools. We log that proof straight to your parent portal.
              </p>
            </div>
          </div>
        </section>

        {/* Measurable Outcomes */}
        <section className="space-y-8 sm:space-y-12">
          <div className="text-center">
            <h2 className="font-display text-lg sm:text-2xl uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#7b4fce] text-glow-purple">&gt; MEASURABLE STEM OUTCOMES</h2>
            <p className="text-slate-400 font-mono text-[10px] sm:text-xs mt-2 sm:mt-3 uppercase tracking-wider">How we measure and prove academic growth</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-mono">
            {[
              {
                title: '85% Recall Retention',
                desc: 'Active retrieval decks ensure students move knowledge from short-term memory to long-term mastery.',
                tag: '[RETENTION]'
              },
              {
                title: 'Resilient Focus',
                desc: 'Our effort-gated hint ladder encourages students to work through blockages instead of opting out.',
                tag: '[FOCUS_TIME]'
              },
              {
                title: 'Independent Learning',
                desc: 'Students learn to identify their own learning gaps and request specific modes of instruction.',
                tag: '[METADEGREE]'
              },
              {
                title: 'System Engineering',
                desc: 'Hands-on creation of custom AI tutors and functional prompts teaches structural coding logics.',
                tag: '[ENGINEERING]'
              }
            ].map((out) => (
              <div key={out.title} className="glass-card p-4 sm:p-6 !rounded-none border-t border-t-[#00c8ff]">
                <div className="text-[#00c8ff] text-xs font-bold mb-1">{out.tag}</div>
                <h3 className="text-white text-xs sm:text-sm font-bold uppercase mb-2 sm:mb-3">{out.title}</h3>
                <p className="text-[10px] text-slate-400 uppercase leading-relaxed">{out.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 11 Modules Parent Breakdown */}
        <section className="space-y-8 sm:space-y-12">
          <div className="text-center">
            <h2 className="font-display text-lg sm:text-2xl uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#00c8ff] text-glow-cyan">&gt; DETAILED CURRICULUM VALUE</h2>
            <p className="text-slate-400 font-mono text-[10px] sm:text-xs mt-2 sm:mt-3 uppercase tracking-wider">What your teen will master across 11 structured modules</p>
          </div>

          <div className="space-y-3 sm:space-y-4 font-mono text-xs uppercase tracking-wider">
            {[
              { mod: 'Module 1', title: 'AI Learning Code', benefit: 'Teaches age-appropriate AI literacy: understanding models, limiting AI shortcuts, and running verification steps.' },
              { mod: 'Module 2', title: 'Digital Smarts & Responsibility', benefit: 'Instills digital safety: identifying algorithms, managing device distractions, and building cyber integrity.' },
              { mod: 'Module 3', title: 'Pre-Learn System', benefit: 'Structures study habits: learning to map complex academic subjects and self-testing to verify retention.' },
              { mod: 'Module 4', title: 'Lesson Rescue Mode', benefit: 'Handles confusion: teaching pupils how to break confusing textbook text down and repair specific gaps.' },
              { mod: 'Module 5', title: 'Compression Learning', benefit: 'Improves reading comprehension: synthesizing notes into concise cheat sheets and conceptual links.' },
              { mod: 'Module 6', title: 'Mistake Banking', benefit: 'Transforms errors: tracking failed questions and building a personalized index for revision.' },
              { mod: 'Module 7', title: 'Study Pack Creation', benefit: 'Builds synthesis skills: compiling comprehensive exam study packages directly within the workspace.' },
              { mod: 'Module 8', title: 'Writing & Answer Clarity', benefit: 'Refines communication: structuring clear written answers and logical arguments instead of robotic copy.' },
              { mod: 'Module 9', title: 'Build Your AI Tutor', benefit: 'System design practice: building a customized AI coach using precise prompts to master target subjects.' },
              { mod: 'Module 10', title: 'Build Your AI Assistant', benefit: 'AI integration: developing custom personas, safety layers, and automated tools for complex challenges.' },
              { mod: 'Module 11', title: 'Capstone Master Trial', benefit: 'Culminating evaluation: a comprehensive system test verifying mastery across all study protocols.' }
            ].map((item, idx) => (
              <div key={item.mod} className="glass-card p-4 sm:p-6 !rounded-none flex flex-col md:flex-row gap-2 sm:gap-4 justify-between items-start md:items-center hover:border-[#7b4fce]/50 transition-colors">
                <div className="md:w-1/3">
                  <span className="text-[#7b4fce] font-bold mr-2">[{item.mod}]</span>
                  <span className="text-white font-bold">{item.title}</span>
                </div>
                <div className="md:w-2/3 text-slate-400 text-[10px] leading-relaxed uppercase border-l-0 md:border-l border-slate-800/80 pl-0 md:pl-6 pt-1 md:pt-0">
                  {item.benefit}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-4 sm:pt-8 pb-6 sm:pb-10">
          <Link href="/beta" className="w-full sm:w-auto inline-flex items-center justify-center font-display uppercase font-bold text-sm sm:text-base tracking-[0.15em] sm:tracking-[0.2em] text-[#020617] bg-[#00c8ff] px-8 py-3.5 min-h-[48px] hover:bg-[#7b4fce] hover:text-white transition-all border-2 border-white shadow-[0_0_20px_#00c8ff] active:scale-[0.98]">
            JOIN EARLY ACCESS &rarr;
          </Link>
        </section>
      </div>
    </main>
  );
}
