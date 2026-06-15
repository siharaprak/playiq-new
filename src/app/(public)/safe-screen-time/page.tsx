import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Safe Screen Time & Active Learning | PlayIQ',
  description: 'Transform zombie-scrolling into productive thinking. PlayIQ uses effort-gated hints and active recall tasks to keep teens focused and engaged.',
  keywords: ['safe screen time', 'digital focus', 'attention span', 'active recall', 'learning apps for teens'],
};

export default function SafeScreenTimePage() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-[rgba(123,79,206,0.03)] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-28 relative z-10 space-y-16">
        {/* Header */}
        <section className="text-center border-b-2 border-slate-800 pb-10">
          <h1 className="font-display font-black text-4xl md:text-5xl uppercase tracking-widest text-[#7b4fce] drop-shadow-[2px_2px_0_#00c8ff] mb-6">
            SAFE & FOCUSED SCREEN TIME
          </h1>
          <p className="font-mono text-xs md:text-sm tracking-widest uppercase text-slate-400 bg-black/50 inline-block px-4 py-2 border border-[#7b4fce]">
            &gt; PROTECT ATTENTION // ENGAGE RESILIENCE
          </p>
        </section>

        {/* Content */}
        <section className="font-mono space-y-10 text-xs md:text-sm text-slate-300 leading-relaxed uppercase">
          <div className="glass-card p-8 border-l-4 border-l-[#00c8ff]">
            <h2 className="font-display text-lg text-white mb-4 tracking-wider">&gt; ACTIVE THINKING VS. ZOMBIE SCROLLING</h2>
            <p>
              Many educational apps rely on passive media consumption — pushing students to sit and watch videos or guess trivial questions. This damages attention spans. PlayIQ builds cognitive strength by gating progress behind active recall worksheets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 !rounded-none">
              <h3 className="text-[#7b4fce] font-bold mb-3">01. EFFORT-GATED HINTS</h3>
              <p className="text-[10px] text-slate-400">
                Direct answers are blocked. To receive a hint from their AI tutors, students must input their previous attempts. This builds mental stamina and independent problem-solving.
              </p>
            </div>
            <div className="glass-card p-6 !rounded-none">
              <h3 className="text-[#7b4fce] font-bold mb-3">02. ATTENTION AUDITING</h3>
              <p className="text-[10px] text-slate-400">
                Module 2 introduces attention trap diagnostics. Teens audit their digital habits, learn to configure system focus limits, and evaluate rest vs. escape.
              </p>
            </div>
          </div>

          <div className="glass-card p-8 border-r-4 border-r-[#7b4fce] text-center max-w-2xl mx-auto">
            <h3 className="font-display text-sm text-white mb-3 tracking-wider">COPPA CLARITY & PRIVACY</h3>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              We collect zero location data, zero audio/video feeds, and run zero advertising. We only store active lesson progress coordinates. Parents hold permanent deletion rights.
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
