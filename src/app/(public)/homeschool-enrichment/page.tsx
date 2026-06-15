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

      <div className="max-w-4xl mx-auto px-6 py-28 relative z-10 space-y-16">
        {/* Header */}
        <section className="text-center border-b-2 border-slate-800 pb-10">
          <h1 className="font-display font-black text-4xl md:text-5xl uppercase tracking-widest text-[#7b4fce] drop-shadow-[2px_2px_0_#00c8ff] mb-6">
            HOMESCHOOL STEM ENRICHMENT
          </h1>
          <p className="font-mono text-xs md:text-sm tracking-widest uppercase text-slate-400 bg-black/50 inline-block px-4 py-2 border border-[#7b4fce]">
            &gt; SELF-PACED PROGRESS // INDEPENDENT INSTRUCTION
          </p>
        </section>

        {/* Content */}
        <section className="font-mono space-y-10 text-xs md:text-sm text-slate-300 leading-relaxed uppercase">
          <div className="glass-card p-8 border-l-4 border-l-[#00c8ff]">
            <h2 className="font-display text-lg text-white mb-4 tracking-wider">&gt; SELF-DIRECTED STUDY INFRASTRUCTURE</h2>
            <p>
              Homeschool educators need tools that build independent study resilience while documenting progress. PlayIQ supplies a complete 11-module study layout that guides teens through structured worksheets and prompt configuration tasks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 !rounded-none">
              <h3 className="text-[#7b4fce] font-bold mb-3">01. CONTINUOUS PROGRESS LOGS</h3>
              <p className="text-[10px] text-slate-400">
                PlayIQ tracks active time spent, worksheets finalized, and retention rates. We generate detailed portfolios that satisfy state compliance review expectations.
              </p>
            </div>
            <div className="glass-card p-6 !rounded-none">
              <h3 className="text-[#7b4fce] font-bold mb-3">02. VERIFIABLE PORTFOLIOS</h3>
              <p className="text-[10px] text-slate-400">
                Rather than simple completion checkmarks, review the actual written answers, study codes, and AI tutor models customized by your child.
              </p>
            </div>
          </div>

          <div className="glass-card p-8 border-r-4 border-r-[#00c8ff] text-center max-w-2xl mx-auto">
            <h3 className="font-display text-sm text-white mb-3 tracking-wider">STRUCTURED ACADEMIC OUTCOMES</h3>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Course 1: Apprentice is optimized for ages 13-17. It operates as a structured, self-guided elective that takes approximately 12 weeks to complete.
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
