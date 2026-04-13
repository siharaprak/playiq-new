export default function Contact() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-[rgba(0,242,255,0.03)] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-28 relative z-10 space-y-16">
        <section className="text-center border-b-2 border-slate-800 pb-10">
          <h1 className="font-display font-black text-4xl md:text-5xl uppercase tracking-widest text-[#00f2ff] drop-shadow-[0_0_15px_rgba(0,242,255,0.4)] mb-4">
            SUPPORT & FAQs
          </h1>
          <p className="font-mono text-sm tracking-widest uppercase text-slate-400 bg-black/50 inline-block px-4 py-2 border border-[#00f2ff]">
            &gt; WE ARE HERE TO HELP
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-16">
          <div className="glass-card p-8 border-l-[3px] border-l-[#00f2ff] !rounded-none">
            <h2 className="font-display text-2xl font-bold text-white mb-6 uppercase tracking-[0.2em] drop-shadow-[0_0_5px_#00f2ff]">&gt; SEND A MESSAGE</h2>
            <p className="font-mono text-xs text-slate-400 mb-8 uppercase tracking-widest leading-relaxed">
              We aim to respond to all parent inquiries within 24 hours.
            </p>
            <form className="space-y-6 font-mono text-sm">
               <div>
                <label className="block text-[#00f2ff] uppercase tracking-widest mb-2 opacity-80">YOUR EMAIL</label>
                <input type="email" className="neon-input !rounded-none !border-b-2 !border-b-slate-700 focus:!border-b-[#00f2ff] !bg-black/40 text-white" placeholder="ENTER EMAIL" />
              </div>
              <div>
                <label className="block text-[#00f2ff] uppercase tracking-widest mb-2 opacity-80">MESSAGE</label>
                <textarea rows={4} className="neon-input !rounded-none !border-b-2 !border-b-slate-700 focus:!border-b-[#00f2ff] !bg-black/40 text-white resize-none" placeholder="HOW CAN WE HELP?"></textarea>
              </div>
              <button type="button" className="font-display uppercase font-bold text-sm tracking-[0.2em] text-[#020617] bg-[#00f2ff] px-6 py-3 hover:bg-[#ff00ff] hover:text-white transition-colors border-2 border-[#00f2ff] shadow-[0_0_10px_#00f2ff] w-full">
                SEND MESSAGE
              </button>
            </form>
          </div>

          <div className="glass-card p-8 border-r-[3px] border-r-[#ff00ff] !rounded-none">
            <h2 className="font-display text-2xl font-bold text-white mb-6 uppercase tracking-[0.2em] drop-shadow-[0_0_5px_#ff00ff]">&gt; FAQs</h2>
            <div className="space-y-8 font-mono text-xs text-slate-300">
               <div className="border border-[rgba(255,0,255,0.2)] bg-black/40 p-4 relative">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff00ff]"></div>
                 <h3 className="text-[#ff00ff] uppercase font-bold tracking-widest mb-2">Q: RETURN_POLICY_OVERRIDE</h3>
                 <p className="opacity-80 leading-relaxed uppercase">During the pilot launch, if your teen does not engage with the kit within the first 14 days, you may return the hardware for a full refund.</p>
               </div>
               <div className="border border-[rgba(255,0,255,0.2)] bg-black/40 p-4 relative">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff00ff]"></div>
                 <h3 className="text-[#ff00ff] uppercase font-bold tracking-widest mb-2">Q: HARDWARE_DEPLOYMENT</h3>
                 <p className="opacity-80 leading-relaxed uppercase">We process cohort hardware shipments within 48 hours. Transit generally takes 3-5 business days.</p>
               </div>
               <div className="border border-[rgba(255,0,255,0.2)] bg-black/40 p-4 relative">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff00ff]"></div>
                 <h3 className="text-[#ff00ff] uppercase font-bold tracking-widest mb-2">Q: LOCAL_DEVICE_SPECS</h3>
                 <p className="opacity-80 leading-relaxed uppercase">The digital app handles missions and artifact capture, so any modern smartphone or tablet with a camera will work perfectly.</p>
               </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
