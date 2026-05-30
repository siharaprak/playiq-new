import Link from 'next/link';

export default function HowItWorks() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-[rgba(0,200,255,0.03)] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-28 relative z-10 space-y-16">
        <section className="text-center border-b-2 border-slate-800 pb-10">
          <h1 className="font-display font-black text-4xl md:text-6xl uppercase tracking-widest text-[#00c8ff] drop-shadow-[2px_2px_0_#7b4fce] mb-6">
            HOW IT WORKS
          </h1>
          <p className="font-mono text-sm tracking-widest uppercase text-slate-400 bg-black/50 inline-block px-4 py-2 border border-[#00c8ff]">
            BUILD &gt; CHECK &gt; CONQUER
          </p>
        </section>

        <section className="font-mono relative">
          <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-[rgba(0,200,255,0.2)]"></div>
          
          <div className="space-y-12">
            
            <div className="relative pl-8 md:pl-12">
              <div className="absolute left-0 top-1.5 w-4 h-4 border-2 border-[#00c8ff] bg-[#020617] rotate-45 shadow-[0_0_10px_#00c8ff]"></div>
              <h3 className="text-[#00c8ff] text-xl font-display font-bold uppercase tracking-[0.2em] mb-2">[01] GET YOUR MISSION</h3>
              <p className="text-slate-400 text-sm leading-relaxed uppercase opacity-80">
                The app presents your engineering challenge. Example: "Build a truss bridge that supports maximum structural load." Then put the screen away and start building with the physical kit.
              </p>
            </div>

            <div className="relative pl-8 md:pl-12">
              <div className="absolute left-0 top-1.5 w-4 h-4 border-2 border-[#7b4fce] bg-[#020617] rotate-45 shadow-[0_0_10px_#7b4fce]"></div>
              <h3 className="text-[#7b4fce] text-xl font-display font-bold uppercase tracking-[0.2em] mb-2">[02] ASK FOR A HINT</h3>
              <p className="text-slate-400 text-sm leading-relaxed uppercase opacity-80">
                Direct answers are disabled. If you get stuck, the system will ask what you tried. It gives you nudges, not spoon-fed solutions.
              </p>
            </div>

            <div className="relative pl-8 md:pl-12">
              <div className="absolute left-0 top-1.5 w-4 h-4 border-2 border-[#00c8ff] bg-[#020617] rotate-45 shadow-[0_0_10px_#00c8ff]"></div>
              <h3 className="text-[#00c8ff] text-xl font-display font-bold uppercase tracking-[0.2em] mb-2">[03] SNAP A PICTURE</h3>
              <p className="text-slate-400 text-sm leading-relaxed uppercase opacity-80">
                Mission complete. Use your camera to capture your build. The app checks your structure against the goals.
              </p>
            </div>

            <div className="relative pl-8 md:pl-12">
              <div className="absolute left-0 top-1.5 w-4 h-4 border-2 border-[#7b4fce] bg-[#020617] rotate-45 shadow-[0_0_10px_#7b4fce]"></div>
              <h3 className="text-[#7b4fce] text-xl font-display font-bold uppercase tracking-[0.2em] mb-2">[04] LEVEL UP</h3>
              <p className="text-slate-400 text-sm leading-relaxed uppercase opacity-80">
                Proof of your build is sent to your parents. You unlock the next level and get ready for a harder challenge.
              </p>
            </div>

          </div>
        </section>
        
        {/* Temporarily hidden
        <section className="text-center pt-10">
           <Link href="/beta" className="inline-block font-display uppercase font-bold text-xl tracking-[0.3em] text-[#020617] bg-[#00c8ff] px-10 py-5 hover:bg-[#7b4fce] transition-colors border-2 border-white shadow-[0_0_20px_#00c8ff] hover:shadow-[0_0_30px_#7b4fce]">
              JOIN EARLY ACCESS
           </Link>
        </section>
        */}
      </div>
    </main>
  );
}
