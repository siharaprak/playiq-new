import Link from 'next/link';

export default function Apprentice() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-[rgba(0,200,255,0.04)] rounded-full blur-[140px] animate-drift pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[ 
    $m = $args[0].Value
    $m -replace 'rgba\(255,\s*0,\s*255,\s*', 'rgba(123,79,206,' 
  ] rounded-full blur-[120px] animate-drift pointer-events-none" style={{ animationDelay: '5s' }} />

      {/* Screen Tracker */}
      <div className="absolute top-[10%] right-[5%] font-display text-[0.6rem] tracking-[0.3em] text-[#7b4fce] opacity-60 uppercase text-right">
        COURSE: APPRENTICE<br/>
        READY
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10 space-y-16">
        
        {/* Header HUD */}
        <section className="text-center pt-10">
          <p className="font-display uppercase tracking-[0.4em] text-[0.65rem] text-[#00c8ff] opacity-80 mb-4">&gt; COURSE 1</p>
          <h1 className="font-display font-black text-5xl md:text-7xl uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-8">
            THE APPRENTICE
          </h1>
          <p className="font-mono text-sm md:text-lg text-slate-400 max-w-2xl mx-auto border-l-2 border-[#00c8ff] pl-4 text-left">
            HARDWARE INCLUDED. A SCREEN-FREE ENGINEERING CHALLENGE FOR TEENS.
          </p>
        </section>

        {/* Data Grid */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8 border-l-[3px] border-l-[#7b4fce] !rounded-none">
            <h2 className="font-display text-xl uppercase tracking-[0.2em] text-[#7b4fce] mb-6">&gt; WHO IS THIS FOR?</h2>
            <p className="text-sm font-mono text-slate-300 leading-relaxed uppercase mb-6 opacity-80">
              BUILT FOR AGES 13-17. BRIDGING THE GAP BETWEEN SCROLLING ON A SCREEN AND ACTUAL TACTILE ENGINEERING.
            </p>
            <div className="w-full h-48 border border-[rgba(123,79,206,0.3)] bg-[rgba(0,0,0,0.5)] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('/images/tier3-apprentice-teen.png')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
              <span className="font-display text-xs tracking-widest text-[#7b4fce]">[ IMAGE_DATA_MISSING ]</span>
            </div>
          </div>

          <div className="glass-card p-8 border-r-[3px] border-r-[#00c8ff] !rounded-none">
            <h2 className="font-display text-xl uppercase tracking-[0.2em] text-[#00c8ff] mb-6">&gt; WHAT YOU GET</h2>
            <ul className="space-y-6 font-mono text-xs text-slate-300 tracking-wider">
              <li className="flex gap-4">
                <span className="text-[#00c8ff]">&gt;&gt;</span>
                <div>
                  <h3 className="text-[#00c8ff] uppercase font-bold mb-1">MAGNETIC BLOCKS</h3>
                  <p className="opacity-70">Physical construction nodes shipped straight to your door.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-[#00c8ff]">&gt;&gt;</span>
                <div>
                  <h3 className="text-[#00c8ff] uppercase font-bold mb-1">THE APP GUIDE</h3>
                  <p className="opacity-70">Digital access to the challenges and validation engine.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-[#00c8ff]">&gt;&gt;</span>
                <div>
                  <h3 className="text-[#00c8ff] uppercase font-bold mb-1">PARENT PROOF PACKET</h3>
                  <p className="opacity-70">Over-the-shoulder transmission of verified structures.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* System Differentiators */}
        <section className="glass-card p-10 !border-t-4 !border-t-[#7b4fce] !rounded-none">
          <div className="mb-12 text-center">
            <h2 className="font-display text-2xl uppercase tracking-[0.3em] text-white">SYSTEM_DIFFERENTIATORS</h2>
            <p className="font-mono text-xs mt-4 text-[#7b4fce]">&gt; ANOMALY DETECTED IN STANDARD EDUCATION PROTOCOLS</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 font-mono">
            <div className="border border-[rgba(0,200,255,0.2)] bg-black/40 p-6">
              <h3 className="text-[#00c8ff] mb-2 uppercase text-sm">01. OFFLINE_EXEC</h3>
              <p className="text-xs text-slate-400 uppercase leading-relaxed">App provides blueprint. Execution is physical. Screen logic suspended.</p>
            </div>
            <div className="border border-[rgba(0,200,255,0.2)] bg-black/40 p-6">
              <h3 className="text-[#00c8ff] mb-2 uppercase text-sm">02. SMART_HINTING</h3>
              <p className="text-xs text-slate-400 uppercase leading-relaxed">Direct answers = false. Demanding user effort = true.</p>
            </div>
            <div className="border border-[rgba(0,200,255,0.2)] bg-black/40 p-6">
              <h3 className="text-[#00c8ff] mb-2 uppercase text-sm">03. VISUAL_PROOF</h3>
              <p className="text-xs text-slate-400 uppercase leading-relaxed">Upload physical structure image array for verification.</p>
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
