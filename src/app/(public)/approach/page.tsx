import Link from 'next/link';

export default function Approach() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      <div className="absolute top-[10%] left-[30%] w-[500px] h-[500px] bg-[rgba(0,200,255,0.03)] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 sm:pt-16 sm:pb-24 relative z-10 space-y-10 sm:space-y-16">
        <section className="text-center">
          <p className="font-display uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[0.65rem] text-[#7b4fce] opacity-80 mb-3 sm:mb-4">&gt; PLAYIQ APPROACH</p>
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider sm:tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] mb-4 sm:mb-6">
            A GUIDE <br/> <span className="text-[#00c8ff]"> NEVER A CRUTCH</span>
          </h1>
          <p className="font-mono text-xs sm:text-sm max-w-3xl mx-auto text-slate-400 capitalize bg-[rgba(0,200,255,0.05)] p-3.5 sm:p-4 border border-[rgba(0,200,255,0.2)] leading-relaxed">
            We designed our logic engine to teach resilience, not dependency. Effort is mandatory before answers are decrypted.
          </p>
        </section>

        {/* The Why */}
        <section className="glass-card p-5 sm:p-8 md:p-10 !rounded-none !border-l-0 !border-r-0 border-y-4 border-t-[#00c8ff] border-b-[#7b4fce]">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <div className="font-mono text-xs text-slate-300 uppercase tracking-widest leading-[1.8] sm:leading-[2]">
              <h2 className="font-display text-lg sm:text-2xl text-white mb-4 sm:mb-6 tracking-[0.15em] sm:tracking-[0.2em]">&gt; EFFORT REWARDED</h2>
              <p className="mb-4 sm:mb-6 opacity-80 text-[11px] sm:text-xs">
                Passive education protocols (one-click answers) outsource cognition. Result: Compromised neural resilience.
              </p>
              <p className="opacity-80 text-[11px] sm:text-xs">
                PlayIQ’s logic engine is purposefully gated by effort limits. Force a solution? Denied. Users must demonstrate attempts.
              </p>
            </div>
            <div className="border border-[rgba(0,200,255,0.3)] bg-black h-56 sm:h-72 md:h-80 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('/images/tier2-effort-gating-app.png')] bg-cover bg-center opacity-30 mix-blend-screen"></div>
              <span className="font-display tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-xs text-[#00c8ff] z-10">[ APP PREVIEW ]</span>
            </div>
          </div>
        </section>

        <section className="text-center font-mono">
           <h2 className="font-display text-lg sm:text-2xl uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white mb-6 sm:mb-12">&gt; HOW IT WORKS</h2>
           
           <div className="grid md:grid-cols-3 gap-4 sm:gap-8 text-left">
             <div className="glass-card p-5 sm:p-8 border border-[rgba(0,200,255,0.2)] !rounded-none">
                <div className="text-[#00c8ff] font-display text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 drop-shadow-[0_0_5px_#00c8ff]">[01]</div>
                <h3 className="text-white uppercase font-bold tracking-wider mb-2 sm:mb-3 text-xs sm:text-sm">EFFORT BEFORE ANSWERS</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed uppercase opacity-80">Requesting help is not enough. You must show us what you tried first. Thinking is required.</p>
             </div>
             <div className="glass-card p-5 sm:p-8 border border-[rgba(123,79,206,0.2)] !rounded-none">
                <div className="text-[#7b4fce] font-display text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 drop-shadow-[0_0_5px_#7b4fce]">[02]</div>
                <h3 className="text-white uppercase font-bold tracking-wider mb-2 sm:mb-3 text-xs sm:text-sm">ASK THE GUIDE</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed uppercase opacity-80">The app gives hints, not solutions. You still have to figure out the final piece of the puzzle yourself.</p>
             </div>
             <div className="glass-card p-5 sm:p-8 border border-[rgba(0,200,255,0.2)] !rounded-none">
                <div className="text-[#00c8ff] font-display text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 drop-shadow-[0_0_5px_#00c8ff]">[03]</div>
                <h3 className="text-white uppercase font-bold tracking-wider mb-2 sm:mb-3 text-xs sm:text-sm">TEACH IT BACK</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed uppercase opacity-80">Sometimes the app will ask you to explain how you solved a tough problem to prove you really learned it.</p>
             </div>
           </div>
        </section>

        <section className="text-center pt-4 sm:pt-8 border-t border-slate-800">
           <Link href="/beta" className="font-display uppercase font-bold text-sm tracking-[0.15em] sm:tracking-[0.2em] text-[#7b4fce] underline hover:text-white transition-colors min-h-[44px] inline-flex items-center justify-center">
              JOIN EARLY ACCESS &gt;
           </Link>
        </section>
      </div>
    </main>
  );
}
