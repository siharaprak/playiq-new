import Link from 'next/link';

export default function Approach() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      <div className="absolute top-[10%] left-[30%] w-[500px] h-[500px] bg-[rgba(0,242,255,0.03)] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-28 relative z-10 space-y-20">
        <section className="text-center">
          <p className="font-display uppercase tracking-[0.4em] text-[0.65rem] text-[#ff00ff] opacity-80 mb-4">&gt; PLAYIQ APPROACH</p>
          <h1 className="font-display font-black text-4xl md:text-5xl uppercase tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] mb-6">
            A GUIDE <br/> <span className="text-[#00f2ff]"> NEVER A CRUTCH</span>
          </h1>
          <p className="font-mono text-sm max-w-3xl mx-auto text-slate-400 capitalize bg-[rgba(0,242,255,0.05)] p-4 border border-[rgba(0,242,255,0.2)]">
            We designed our logic engine to teach resilience, not dependency. Effort is mandatory before answers are decrypted.
          </p>
        </section>

        {/* The Why */}
        <section className="glass-card p-10 !rounded-none !border-l-0 !border-r-0 border-y-4 border-t-[#00f2ff] border-b-[#ff00ff]">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="font-mono text-xs text-slate-300 uppercase tracking-widest leading-[2]">
              <h2 className="font-display text-2xl text-white mb-6 tracking-[0.2em]">&gt; EFFORT REWARDED</h2>
              <p className="mb-6 opacity-80">
                Passive education protocols (one-click answers) outsource cognition. Result: Compromised neural resilience.
              </p>
              <p className="opacity-80">
                PlayIQ’s logic engine is purposefully gated by effort limits. Force a solution? Denied. Users must demonstrate attempts.
              </p>
            </div>
            <div className="border border-[rgba(0,242,255,0.3)] bg-black h-80 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('/images/tier2-effort-gating-app.png')] bg-cover bg-center opacity-30 mix-blend-screen"></div>
              <span className="font-display tracking-[0.4em] text-xs text-[#00f2ff] z-10">[ APP PREVIEW ]</span>
            </div>
          </div>
        </section>

        <section className="text-center font-mono">
           <h2 className="font-display text-2xl uppercase tracking-[0.3em] text-white mb-12">&gt; HOW IT WORKS</h2>
           
           <div className="grid md:grid-cols-3 gap-8 text-left">
             <div className="glass-card p-8 border border-[rgba(0,242,255,0.2)] !rounded-none">
                <div className="text-[#00f2ff] font-display text-3xl font-bold mb-4 drop-shadow-[0_0_5px_#00f2ff]">[01]</div>
                <h3 className="text-white uppercase font-bold tracking-widest mb-3">EFFORT BEFORE ANSWERS</h3>
                <p className="text-xs text-slate-400 leading-relaxed uppercase opacity-80">Requesting help is not enough. You must show us what you tried first. Thinking is required.</p>
             </div>
             <div className="glass-card p-8 border border-[rgba(255,0,255,0.2)] !rounded-none">
                <div className="text-[#ff00ff] font-display text-3xl font-bold mb-4 drop-shadow-[0_0_5px_#ff00ff]">[02]</div>
                <h3 className="text-white uppercase font-bold tracking-widest mb-3">ASK THE GUIDE</h3>
                <p className="text-xs text-slate-400 leading-relaxed uppercase opacity-80">The app gives hints, not solutions. You still have to figure out the final piece of the puzzle yourself.</p>
             </div>
             <div className="glass-card p-8 border border-[rgba(0,242,255,0.2)] !rounded-none">
                <div className="text-[#00f2ff] font-display text-3xl font-bold mb-4 drop-shadow-[0_0_5px_#00f2ff]">[03]</div>
                <h3 className="text-white uppercase font-bold tracking-widest mb-3">TEACH IT BACK</h3>
                <p className="text-xs text-slate-400 leading-relaxed uppercase opacity-80">Sometimes the app will ask you to explain how you solved a tough problem to prove you really learned it.</p>
             </div>
           </div>
        </section>

        <section className="text-center pt-8 border-t border-slate-800">
           <Link href="/beta" className="font-display uppercase font-bold text-sm tracking-[0.2em] text-[#ff00ff] underline hover:text-white transition-colors">
              JOIN EARLY ACCESS &gt;
           </Link>
        </section>
      </div>
    </main>
  );
}
