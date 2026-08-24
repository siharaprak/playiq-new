import Link from 'next/link';

export default function Apprentice() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-[rgba(0,200,255,0.04)] rounded-full blur-[140px] animate-drift pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[rgba(123,79,206,0.06)] rounded-full blur-[120px] animate-drift pointer-events-none" style={{ animationDelay: '5s' }} />

      {/* Screen Tracker */}
      <div className="absolute top-[10%] right-[5%] font-display text-[0.6rem] tracking-[0.3em] text-[#7b4fce] opacity-60 uppercase text-right hidden sm:block pointer-events-none">
        COURSE: APPRENTICE<br/>
        READY
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16 sm:pt-16 sm:pb-24 relative z-10 space-y-10 sm:space-y-16">
        
        {/* Header HUD */}
        <section className="text-center pt-2 sm:pt-6">
          <p className="font-display uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[0.65rem] text-[#00c8ff] opacity-80 mb-3 sm:mb-4">&gt; COURSE 1</p>
          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-7xl uppercase tracking-wider sm:tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-4 sm:mb-8">
            THE APPRENTICE
          </h1>
          <p className="font-mono text-xs sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto border-l-2 border-[#00c8ff] pl-3 sm:pl-4 text-left">
            A DIGITALLY GUIDED AI LEARNING AND LOGIC CHALLENGE FOR TEENS.
          </p>
        </section>

        {/* Data Grid */}
        <section className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <div className="glass-card p-5 sm:p-8 border-l-[3px] border-l-[#7b4fce] !rounded-none">
            <h2 className="font-display text-lg sm:text-xl uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#7b4fce] mb-4 sm:mb-6">&gt; WHO IS THIS FOR?</h2>
            <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed uppercase mb-4 sm:mb-6 opacity-80">
              BUILT FOR AGES 13-17. BRIDGING THE GAP BETWEEN SCROLLING ON A SCREEN AND ACTUAL TACTILE ENGINEERING.
            </p>
            <div className="w-full h-40 sm:h-48 border border-[rgba(123,79,206,0.3)] bg-[rgba(0,0,0,0.5)] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('/images/tier3-apprentice-teen.png')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
              <span className="font-display text-xs tracking-widest text-[#7b4fce]">[ IMAGE_DATA_MISSING ]</span>
            </div>
          </div>

          <div className="glass-card p-5 sm:p-8 border-r-[3px] border-r-[#00c8ff] !rounded-none">
            <h2 className="font-display text-lg sm:text-xl uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#00c8ff] mb-4 sm:mb-6">&gt; WHAT YOU GET</h2>
            <ul className="space-y-4 sm:space-y-6 font-mono text-xs text-slate-300 tracking-wider">
              <li className="flex gap-3 sm:gap-4">
                <span className="text-[#00c8ff]">&gt;&gt;</span>
                <div>
                  <h3 className="text-[#00c8ff] uppercase font-bold mb-1">AI LEARNING PATHWAY</h3>
                  <p className="opacity-70 text-[11px] sm:text-xs">Interactive study and logic pathways calibrated to your pace.</p>
                </div>
              </li>
              <li className="flex gap-3 sm:gap-4">
                <span className="text-[#00c8ff]">&gt;&gt;</span>
                <div>
                  <h3 className="text-[#00c8ff] uppercase font-bold mb-1">THE APP GUIDE</h3>
                  <p className="opacity-70 text-[11px] sm:text-xs">Digital access to the challenges and validation engine.</p>
                </div>
              </li>
              <li className="flex gap-3 sm:gap-4">
                <span className="text-[#00c8ff]">&gt;&gt;</span>
                <div>
                  <h3 className="text-[#00c8ff] uppercase font-bold mb-1">PARENT PROOF PACKET</h3>
                  <p className="opacity-70 text-[11px] sm:text-xs">Over-the-shoulder transmission of verified study progress.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* System Differentiators */}
        <section className="glass-card p-5 sm:p-8 md:p-10 !border-t-4 !border-t-[#7b4fce] !rounded-none">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="font-display text-lg sm:text-2xl uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white">SYSTEM_DIFFERENTIATORS</h2>
            <p className="font-mono text-[10px] sm:text-xs mt-2 sm:mt-4 text-[#7b4fce]">&gt; ANOMALY DETECTED IN STANDARD EDUCATION PROTOCOLS</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 font-mono">
            <div className="border border-[rgba(0,200,255,0.2)] bg-black/40 p-4 sm:p-6">
              <h3 className="text-[#00c8ff] mb-1.5 sm:mb-2 uppercase text-xs sm:text-sm">01. GUIDED_COACHING</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 uppercase leading-relaxed">System guides learner with interactive prompts. Active retrieval reinforced.</p>
            </div>
            <div className="border border-[rgba(0,200,255,0.2)] bg-black/40 p-4 sm:p-6">
              <h3 className="text-[#00c8ff] mb-1.5 sm:mb-2 uppercase text-xs sm:text-sm">02. SMART_HINTING</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 uppercase leading-relaxed">Direct answers = false. Demanding user effort = true.</p>
            </div>
            <div className="border border-[rgba(0,200,255,0.2)] bg-black/40 p-4 sm:p-6">
              <h3 className="text-[#00c8ff] mb-1.5 sm:mb-2 uppercase text-xs sm:text-sm">03. CONCEPT_PROOF</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 uppercase leading-relaxed">Upload completed worksheet files and portfolios for verification.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        {/* Temporarily hidden
        <section className="text-center pt-8 pb-16">
          <Link href="/beta" className="inline-block font-display uppercase font-black text-xl tracking-[0.3em] text-[#020617] bg-[#7b4fce] px-10 py-5 hover:bg-[#00c8ff] transition-colors border-2 border-white shadow-[0_0_20px_#7b4fce] hover:shadow-[0_0_30px_#00c8ff]">
            JOIN EARLY ACCESS
          </Link>
        </section>
        */}

      </div>
    </main>
  );
}
