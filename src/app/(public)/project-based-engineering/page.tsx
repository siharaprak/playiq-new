import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Project-Based STEM & AI Engineering for Teens | PlayIQ',
  description: 'Learn project-based engineering with PlayIQ. Teens design logical prompts, construct custom AI assistants, and complete capstone mastery trials.',
  keywords: ['project-based engineering', 'AI prompt design', 'cognitive mapping', 'systems thinking', 'teen software projects'],
};

export default function ProjectBasedEngineeringPage() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-[rgba(0,200,255,0.03)] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-28 relative z-10 space-y-16">
        {/* Header */}
        <section className="text-center border-b-2 border-slate-800 pb-10">
          <h1 className="font-display font-black text-4xl md:text-5xl uppercase tracking-widest text-[#00c8ff] drop-shadow-[2px_2px_0_#7b4fce] mb-6">
            PROJECT-BASED AI ENGINEERING
          </h1>
          <p className="font-mono text-xs md:text-sm tracking-widest uppercase text-slate-400 bg-black/50 inline-block px-4 py-2 border border-[#00c8ff]">
            &gt; SYSTEMS CREATION // SYSTEM MASTER TRIALS
          </p>
        </section>

        {/* Content */}
        <section className="font-mono space-y-10 text-xs md:text-sm text-slate-300 leading-relaxed uppercase">
          <div className="glass-card p-8 border-l-4 border-l-[#7b4fce]">
            <h2 className="font-display text-lg text-white mb-4 tracking-wider">&gt; SYSTEMS OVER SYNTAX</h2>
            <p>
              Rather than forcing syntax memorization, PlayIQ teaches systems engineering. Students apply logical constructs to configure AI tools, writing precise instructions and mapping parameters. They build functional software modules that they can actually use in school.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 !rounded-none">
              <h3 className="text-[#00c8ff] font-bold mb-3">01. CUSTOM AI TUTORS</h3>
              <p className="text-[10px] text-slate-400">
                In Module 9, students build a customized AI tutor using prompt structuring rules. They formulate prompt-ladders and set safety parameters.
              </p>
            </div>
            <div className="glass-card p-6 !rounded-none">
              <h3 className="text-[#00c8ff] font-bold mb-3">02. COMPILATION OF PROOF</h3>
              <p className="text-[10px] text-slate-400">
                Every project generates a verifiable submission package, which is compiled directly into the parent digest to verify understanding.
              </p>
            </div>
          </div>

          <div className="glass-card p-8 border-r-4 border-r-[#00c8ff] text-center max-w-2xl mx-auto">
            <h3 className="font-display text-sm text-white mb-3 tracking-wider">MODULE 11 CAPSTONE MASTER TRIAL</h3>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Students demonstrate complete command of all study engines by passing an integrated systems audit. This final master gate unlocks their certification.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-6">
          <Link href="/beta" className="inline-block font-display uppercase font-bold text-sm tracking-[0.2em] text-[#020617] bg-[#00c8ff] px-8 py-4 hover:bg-[#7b4fce] hover:text-white transition-all border-2 border-white shadow-[0_0_15px_#00c8ff]">
            Apply for Pilot Access &gt;
          </Link>
        </section>
      </div>
    </main>
  );
}
