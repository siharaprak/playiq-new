import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI-Powered STEM Learning for Teens | PlayIQ',
  description: 'Future-proof your child\'s education with structured STEM learning. PlayIQ combines active thinking with AI-guided programming and engineering.',
  keywords: ['STEM learning', 'AI science education', 'coding for teens', 'critical thinking', 'logical reasoning'],
};

export default function StemLearningPage() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-[rgba(0,200,255,0.03)] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-28 relative z-10 space-y-16">
        {/* Header */}
        <section className="text-center border-b-2 border-slate-800 pb-10">
          <h1 className="font-display font-black text-4xl md:text-5xl uppercase tracking-widest text-[#00c8ff] drop-shadow-[2px_2px_0_#7b4fce] mb-6">
            STEM LEARNING FOR THE FUTURE
          </h1>
          <p className="font-mono text-xs md:text-sm tracking-widest uppercase text-slate-400 bg-black/50 inline-block px-4 py-2 border border-[#00c8ff]">
            &gt; CRITICAL THINKING // APPLIED COGNITION
          </p>
        </section>

        {/* Content */}
        <section className="font-mono space-y-10 text-xs md:text-sm text-slate-300 leading-relaxed uppercase">
          <div className="glass-card p-8 border-l-4 border-l-[#7b4fce]">
            <h2 className="font-display text-lg text-white mb-4 tracking-wider">&gt; BEYOND MEMORIZATION</h2>
            <p>
              Traditional science and technology curricula emphasize rote formulas and passive watching. PlayIQ structures learning around active recall and verification rituals. Students learn to map complex concepts, identify logical gaps, and write explanations in their own words.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 !rounded-none">
              <h3 className="text-[#00c8ff] font-bold mb-3">01. LOGICAL REASONING</h3>
              <p className="text-[10px] text-slate-400">
                Mastering first-principles reasoning and mapping subject domains. Students break complex topics into manageable conceptual chunks.
              </p>
            </div>
            <div className="glass-card p-6 !rounded-none">
              <h3 className="text-[#00c8ff] font-bold mb-3">02. APPLIED AI CODING</h3>
              <p className="text-[10px] text-slate-400">
                Pupils design custom instruction sets, configure AI tutoring agents, and execute master trials to verify computational thinking.
              </p>
            </div>
          </div>

          <div className="glass-card p-8 border-r-4 border-r-[#00c8ff] text-center max-w-2xl mx-auto">
            <h3 className="font-display text-sm text-white mb-3 tracking-wider">VERIFIABLE MASTERY PORTFOLIOS</h3>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Every completed module produces completed retrieval worksheets and logical explanations. Parents can verify child competency in real time via the secure Parent Proof Packet.
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
