import Link from 'next/link';
import { BetaForm } from '@/components/forms/BetaForm';

export default function Beta() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      <div className="absolute top-[30%] right-[15%] w-[600px] h-[600px] bg-[rgba(255,0,255,0.03)] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-28 relative z-10 space-y-16">
        <section className="text-center">
          <p className="font-display uppercase tracking-[0.4em] text-[0.65rem] text-[#00f2ff] opacity-80 mb-4">&gt; FOUNDING COHORT</p>
          <h1 className="font-display font-black text-4xl md:text-6xl uppercase tracking-widest text-[#ff00ff] drop-shadow-[0_0_15px_rgba(255,0,255,0.4)] mb-8">
            APPLY FOR PILOT
          </h1>
          <p className="font-mono text-sm max-w-2xl mx-auto text-slate-400 capitalize bg-black/40 p-4 border border-[rgba(0,242,255,0.2)]">
            <span className="text-white font-bold">WARNING: SPOT LIMIT REACHED SOON.</span> We are opening exactly <strong>25 spots</strong> for the inaugural launch of Course 1 to calibrate system endpoints.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-16">
          
          <div className="glass-card p-8 !rounded-none border-t-4 border-t-[#00f2ff]">
             <h2 className="font-display text-2xl font-bold text-white mb-6 uppercase tracking-[0.2em]">&gt; WHAT YOU GET</h2>
             <ul className="space-y-6 mb-8 font-mono text-xs text-slate-300 uppercase tracking-widest">
               <li className="flex items-start">
                 <span className="text-[#00f2ff] text-lg mr-3 shadow-[0_0_5px_#00f2ff] leading-none">[+]</span> 
                 <p className="opacity-80 mt-1">Full physical hardware kit shipped immediately.</p>
               </li>
               <li className="flex items-start">
                 <span className="text-[#00f2ff] text-lg mr-3 shadow-[0_0_5px_#00f2ff] leading-none">[+]</span> 
                 <p className="opacity-80 mt-1">12 weeks of access to the guided system.</p>
               </li>
               <li className="flex items-start">
                 <span className="text-[#00f2ff] text-lg mr-3 shadow-[0_0_5px_#00f2ff] leading-none">[+]</span> 
                 <p className="opacity-80 mt-1">Live access to Parent Proof telemetry.</p>
               </li>
               <li className="flex items-start">
                 <span className="text-[#00f2ff] text-lg mr-3 shadow-[0_0_5px_#00f2ff] leading-none">[+]</span> 
                 <p className="opacity-80 mt-1">Direct feedback uplink for V2 calibration.</p>
               </li>
             </ul>
             
             <div className="p-6 bg-[rgba(0,242,255,0.05)] border border-[#00f2ff] font-mono text-xs text-white">
               <h3 className="font-bold text-[#00f2ff] uppercase tracking-widest mb-2">&gt; PRICING</h3>
               <p className="opacity-80 leading-relaxed uppercase"><strong>[PRICING OVERRIDE]</strong> Includes all hardware and software license. Dropship executes in 3-5 standard cycles.</p>
             </div>
          </div>

          <div className="glass-card p-8 border border-[rgba(255,0,255,0.3)] !rounded-none">
            <h3 className="text-[#ff00ff] font-display text-2xl font-bold mb-6 uppercase tracking-[0.2em] drop-shadow-[0_0_5px_#ff00ff]">&gt; SECURE APPLICATION</h3>
            <BetaForm />
          </div>
        </section>
        
        <section className="text-center pt-8 border-t border-slate-800">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4">QUESTIONS?</p>
          <Link href="/contact" className="font-display uppercase text-sm tracking-[0.2em] text-[#00f2ff] underline hover:text-[#ff00ff] transition-colors">
            CONTACT SUPPORT
          </Link>
        </section>
      </div>
    </main>
  );
}
