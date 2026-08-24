export default function Contact() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-[rgba(0,200,255,0.03)] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 sm:pt-16 sm:pb-24 relative z-10 space-y-10 sm:space-y-16">
        <section className="text-center border-b-2 border-slate-800 pb-6 sm:pb-10">
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider sm:tracking-widest text-[#00c8ff] drop-shadow-[0_0_15px_rgba(0,200,255,0.4)] mb-3 sm:mb-4">
            SUPPORT & FAQs
          </h1>
          <p className="font-mono text-xs sm:text-sm tracking-wider sm:tracking-widest uppercase text-slate-400 bg-black/50 inline-block px-3 sm:px-4 py-1.5 sm:py-2 border border-[#00c8ff]">
            &gt; WE ARE HERE TO HELP
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16">
          <div className="glass-card p-5 sm:p-8 border-l-[3px] border-l-[#00c8ff] !rounded-none">
            <h2 className="font-display text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6 uppercase tracking-[0.15em] sm:tracking-[0.2em] drop-shadow-[0_0_5px_#00c8ff]">&gt; SEND A MESSAGE</h2>
            <p className="font-mono text-[11px] sm:text-xs text-slate-400 mb-6 sm:mb-8 uppercase tracking-wider sm:tracking-widest leading-relaxed">
              We aim to respond to all parent inquiries within 24 hours.
            </p>
            <form className="space-y-4 sm:space-y-6 font-mono text-sm">
               <div>
                <label className="block text-[#00c8ff] uppercase tracking-wider sm:tracking-widest mb-1.5 sm:mb-2 opacity-80 text-xs sm:text-sm">YOUR EMAIL</label>
                <input type="email" className="neon-input !rounded-none !border-b-2 !border-b-slate-700 focus:!border-b-[#00c8ff] !bg-black/40 text-white min-h-[44px]" placeholder="ENTER EMAIL" />
              </div>
              <div>
                <label className="block text-[#00c8ff] uppercase tracking-wider sm:tracking-widest mb-1.5 sm:mb-2 opacity-80 text-xs sm:text-sm">MESSAGE</label>
                <textarea rows={4} className="neon-input !rounded-none !border-b-2 !border-b-slate-700 focus:!border-b-[#00c8ff] !bg-black/40 text-white resize-none" placeholder="HOW CAN WE HELP?"></textarea>
              </div>
              <button type="button" className="font-display uppercase font-bold text-sm tracking-[0.15em] sm:tracking-[0.2em] text-[#020617] bg-[#00c8ff] px-6 py-3.5 min-h-[48px] hover:bg-[#7b4fce] hover:text-white transition-colors border-2 border-[#00c8ff] shadow-[0_0_10px_#00c8ff] w-full active:scale-[0.98]">
                SEND MESSAGE
              </button>
            </form>
          </div>

          <div className="glass-card p-5 sm:p-8 border-r-[3px] border-r-[#7b4fce] !rounded-none">
            <h2 className="font-display text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6 uppercase tracking-[0.15em] sm:tracking-[0.2em] drop-shadow-[0_0_5px_#7b4fce]">&gt; FAQs</h2>
            <div className="space-y-4 sm:space-y-6 font-mono text-xs text-slate-300">
               <div className="border border-[rgba(123,79,206,0.2)] bg-black/40 p-3.5 sm:p-4 relative">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7b4fce]"></div>
                 <h3 className="text-[#7b4fce] uppercase font-bold tracking-wider mb-1.5 text-xs sm:text-sm">Q: RETURN_POLICY_OVERRIDE</h3>
                 <p className="opacity-80 leading-relaxed uppercase text-[11px] sm:text-xs">During the pilot launch, if your teen does not engage with the kit within the first 14 days, you may return the hardware for a full refund.</p>
               </div>
               <div className="border border-[rgba(123,79,206,0.2)] bg-black/40 p-3.5 sm:p-4 relative">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7b4fce]"></div>
                 <h3 className="text-[#7b4fce] uppercase font-bold tracking-wider mb-1.5 text-xs sm:text-sm">Q: HARDWARE_DEPLOYMENT</h3>
                 <p className="opacity-80 leading-relaxed uppercase text-[11px] sm:text-xs">We process cohort hardware shipments within 48 hours. Transit generally takes 3-5 business days.</p>
               </div>
               <div className="border border-[rgba(123,79,206,0.2)] bg-black/40 p-3.5 sm:p-4 relative">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7b4fce]"></div>
                 <h3 className="text-[#7b4fce] uppercase font-bold tracking-wider mb-1.5 text-xs sm:text-sm">Q: LOCAL_DEVICE_SPECS</h3>
                 <p className="opacity-80 leading-relaxed uppercase text-[11px] sm:text-xs">The digital app handles missions and artifact capture, so any modern smartphone or tablet with a camera will work perfectly.</p>
               </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
