import Link from 'next/link';

export default function Parents() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      <div className="absolute top-[25%] right-[10%] w-[500px] h-[500px] bg-[rgba(0,242,255,0.04)] rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute top-[5%] left-[5%] font-display text-[0.6rem] tracking-[0.3em] text-[#ff00ff] opacity-60 uppercase text-left">
        VIEW_MODE: PARENT<br/>
        SECURE
      </div>

      <div className="max-w-6xl mx-auto px-6 py-28 relative z-10 space-y-20">
        
        {/* Hero */}
        <section className="text-center">
          <h1 className="font-display font-black text-4xl md:text-6xl uppercase tracking-widest text-[#00f2ff] drop-shadow-[0_0_15px_rgba(0,242,255,0.4)] mb-6">
            PROOF NOT PROMISES
          </h1>
          <p className="font-mono text-sm uppercase text-slate-400 max-w-2xl mx-auto leading-relaxed tracking-wider border-r-2 border-[#ff00ff] pr-4">
            Don't just trust that they are learning. 
            See actual photos of what they build with the Parent Proof Packet.
          </p>
        </section>

        {/* Difference / Trust factor */}
        <section className="glass-card p-10 !rounded-none !border-t-0 !border-b-0 border-x-4 border-l-[#00f2ff] border-r-[#ff00ff]">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <div className="border border-[rgba(255,0,255,0.3)] bg-black h-80 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('/images/tier2-parent-proof-packet.png')] bg-cover bg-center opacity-30 mix-blend-screen"></div>
              <span className="font-display tracking-[0.4em] text-xs text-[#ff00ff] z-10">[ PHOTO_EVIDENCE ]</span>
            </div>
            <div className="font-mono text-xs text-slate-300 uppercase tracking-widest leading-[2]">
              <h2 className="font-display text-xl text-white mb-6 tracking-[0.2em] border-b border-[#00f2ff] pb-4 inline-block">&gt; WHY THIS IS DIFFERENT</h2>
              <p className="mb-6 opacity-80">
                Passive learning apps give false progress (e.g. "100% COMPLETE") when kids just click buttons. Guesses look like success.
              </p>
              <p className="opacity-80">
                PlayIQ forces real-world effort. Kids must physically build the solution and snap a photo. We send that photo straight to you.
              </p>
            </div>
          </div>
        </section>

        {/* What parents can expect */}
        <section className="text-center">
          <h2 className="font-display text-2xl uppercase tracking-[0.3em] text-[#ff00ff] mb-12">&gt; WHAT PARENTS SEE</h2>
          
          <div className="grid md:grid-cols-3 gap-6 font-mono text-left">
            <div className="glass-card p-6 !rounded-none">
               <h3 className="text-[#00f2ff] text-sm uppercase font-bold mb-3">01. VISUAL PROOF</h3>
               <p className="text-xs text-slate-400 uppercase leading-relaxed">See photos of the real structures they build offline.</p>
            </div>
            <div className="glass-card p-6 !rounded-none">
               <h3 className="text-[#00f2ff] text-sm uppercase font-bold mb-3">02. EFFORT TRACKING</h3>
               <p className="text-xs text-slate-400 uppercase leading-relaxed">See how long they spent building vs how often they asked for hints.</p>
            </div>
            <div className="glass-card p-6 !rounded-none">
               <h3 className="text-[#00f2ff] text-sm uppercase font-bold mb-3">03. SKILL_GATES</h3>
               <p className="text-xs text-slate-400 uppercase leading-relaxed">Visual locks verifying concept mastery before next sequence initiates.</p>
            </div>
          </div>
        </section>

        <section className="text-center pt-8 pb-10">
           <Link href="/beta" className="inline-block font-display uppercase font-bold text-xl tracking-[0.3em] text-[#020617] bg-[#00f2ff] px-10 py-5 hover:bg-[#ff00ff] transition-colors border-2 border-white shadow-[0_0_20px_#00f2ff]">
              JOIN EARLY ACCESS
           </Link>
        </section>
      </div>
    </main>
  );
}
