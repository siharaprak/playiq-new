import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Homeschool STEM Enrichment & Progress Logs | PlayIQ',
  description: 'Enrich your homeschool curriculum with self-paced, AI-guided learning. PlayIQ provides automated progress logs and portfolio packets.',
  keywords: ['homeschool enrichment', 'self-paced learning', 'STEM homeschool', 'homeschool portfolio logs', 'independent study'],
};

export default function HomeschoolEnrichmentPage() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-[rgba(123,79,206,0.03)] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-16 sm:pt-16 sm:pb-24 relative z-10 space-y-10 sm:space-y-16">
        {/* Header */}
        <section className="text-center border-b-2 border-slate-800 pb-6 sm:pb-10">
          <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-wider sm:tracking-widest text-[#7b4fce] drop-shadow-[2px_2px_0_#00c8ff] mb-4 sm:mb-6">
            HOMESCHOOL STEM ENRICHMENT
          </h1>
          <p className="font-mono text-xs sm:text-sm tracking-wider sm:tracking-widest uppercase text-slate-400 bg-black/50 inline-block px-3 sm:px-4 py-1.5 sm:py-2 border border-[#7b4fce]">
            &gt; SELF-PACED PROGRESS // INDEPENDENT INSTRUCTION
          </p>
        </section>

        {/* Content */}
        <section className="font-mono space-y-6 sm:space-y-10 text-xs sm:text-sm text-slate-300 leading-relaxed uppercase">
          <div className="glass-card p-5 sm:p-8 border-l-4 border-l-[#00c8ff]">
            <h2 className="font-display text-base sm:text-lg text-white mb-3 sm:mb-4 tracking-wider">&gt; SELF-DIRECTED STUDY INFRASTRUCTURE</h2>
            <p className="text-[11px] sm:text-xs sm:leading-relaxed">
              Homeschool educators need tools that build independent study resilience while documenting progress. PlayIQ supplies a complete 11-module study layout that guides teens through structured worksheets and prompt configuration tasks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="glass-card p-4 sm:p-6 !rounded-none">
              <h3 className="text-[#7b4fce] font-bold mb-2 sm:mb-3 text-xs sm:text-sm">01. CONTINUOUS PROGRESS LOGS</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
                PlayIQ tracks active time spent, worksheets finalized, and retention rates. We generate detailed portfolios that satisfy state compliance review expectations.
              </p>
            </div>
            <div className="glass-card p-4 sm:p-6 !rounded-none">
              <h3 className="text-[#7b4fce] font-bold mb-2 sm:mb-3 text-xs sm:text-sm">02. VERIFIABLE PORTFOLIOS</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
                Rather than simple completion checkmarks, review the actual written answers, study codes, and AI tutor models customized by your child.
              </p>
            </div>
          </div>

          <div className="glass-card p-5 sm:p-8 border-r-4 border-r-[#00c8ff] text-center max-w-2xl mx-auto">
            <h3 className="font-display text-xs sm:text-sm text-white mb-2 sm:mb-3 tracking-wider">STRUCTURED ACADEMIC OUTCOMES</h3>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
              Course 1: Apprentice is optimized for ages 13-17. It operates as a structured, self-guided elective that takes approximately 12 weeks to complete.
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
