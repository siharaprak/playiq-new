import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Future Skills, AI Prompting & Focus | PlayIQ',
  description: 'Equip your teenager with the critical skills for an AI-driven economy. PlayIQ teaches prompt engineering, cognitive mapping, and digital safety.',
  keywords: ['future skills', 'AI prompting', 'prompt engineering for teens', 'digital literacy', 'career readiness'],
};

export default function FutureSkillsPage() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-[rgba(0,200,255,0.03)] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-16 sm:pt-16 sm:pb-24 relative z-10 space-y-10 sm:space-y-16">
        {/* Header */}
        <section className="text-center border-b-2 border-slate-800 pb-6 sm:pb-10">
          <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-wider sm:tracking-widest text-[#00c8ff] drop-shadow-[2px_2px_0_#7b4fce] mb-4 sm:mb-6">
            FUTURE SKILLS FOR AN AI ECONOMY
          </h1>
          <p className="font-mono text-xs sm:text-sm tracking-wider sm:tracking-widest uppercase text-slate-400 bg-black/50 inline-block px-3 sm:px-4 py-1.5 sm:py-2 border border-[#00c8ff]">
            &gt; AI LITERACY // COGNITIVE RESILIENCE
          </p>
        </section>

        {/* Content */}
        <section className="font-mono space-y-6 sm:space-y-10 text-xs sm:text-sm text-slate-300 leading-relaxed uppercase">
          <div className="glass-card p-5 sm:p-8 border-l-4 border-l-[#7b4fce]">
            <h2 className="font-display text-base sm:text-lg text-white mb-3 sm:mb-4 tracking-wider">&gt; MULTIPLYING COGNITIVE CAPACITY</h2>
            <p className="text-[11px] sm:text-xs sm:leading-relaxed">
              In an era dominated by large language models, the primary differentiator will be computational reasoning and critical evaluation. PlayIQ ensures students do not use AI as a crutch, but instead master it as a multiplier to solve complex problems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="glass-card p-4 sm:p-6 !rounded-none">
              <h3 className="text-[#00c8ff] font-bold mb-2 sm:mb-3 text-xs sm:text-sm">01. ADVANCED PROMPT STRUCTURING</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
                Pupils master prompt design principles: formatting context parameters, choosing temperature values, and configuring complex system instruction files.
              </p>
            </div>
            <div className="glass-card p-4 sm:p-6 !rounded-none">
              <h3 className="text-[#00c8ff] font-bold mb-2 sm:mb-3 text-xs sm:text-sm">02. VERIFICATION PROTOCOLS</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
                Students practice verification checks to identify generative hallucinations, cross-referencing information against trusted source documents.
              </p>
            </div>
          </div>

          <div className="glass-card p-5 sm:p-8 border-r-4 border-r-[#00c8ff] text-center max-w-2xl mx-auto">
            <h3 className="font-display text-xs sm:text-sm text-white mb-2 sm:mb-3 tracking-wider">PREPARING FOR INDEPENDENT RESEARCH</h3>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
              By designing, constructing, and testing their own custom study tools, students build systemic confidence for secondary and university-level research.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-4 sm:pt-6">
          <Link href="/beta" className="w-full sm:w-auto inline-flex items-center justify-center font-display uppercase font-bold text-sm tracking-[0.15em] sm:tracking-[0.2em] text-[#020617] bg-[#00c8ff] px-8 py-3.5 min-h-[48px] hover:bg-[#7b4fce] hover:text-white transition-all border-2 border-white shadow-[0_0_15px_#00c8ff] active:scale-[0.98]">
            Apply for Pilot Access &rarr;
          </Link>
        </section>
      </div>
    </main>
  );
}
