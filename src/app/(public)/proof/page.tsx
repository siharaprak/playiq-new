import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Proof | PlayIQ',
  description: 'See how PlayIQ measures and logs actual cognitive progress, active retrieval scores, and effort ratios in the Parent Proof Packet.',
};

export default function Proof() {
  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-[rgba(0,200,255,0.03)] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-[rgba(123,79,206,0.04)] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-28 relative z-10 space-y-20">
        
        {/* Header */}
        <section className="text-center space-y-4">
          <p className="font-display uppercase tracking-[0.4em] text-[0.65rem] text-[#7b4fce] opacity-80 mb-2">&gt; SYS_TELEMETRY [DEMO_MODE]</p>
          <h1 className="font-display font-black text-4xl md:text-6xl uppercase tracking-widest text-[#00c8ff] drop-shadow-[0_0_15px_rgba(0,200,255,0.4)]">
            PARENT PROOF PACKET
          </h1>
          <p className="font-mono text-xs md:text-sm uppercase text-slate-400 max-w-2xl mx-auto leading-relaxed tracking-wider">
            Explore a simulation of the telemetry, worksheets, and competency logs parents receive. No empty progress bars — just real evidence.
          </p>
        </section>

        {/* Mock Telemetry Stats Cards */}
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
            <span className="font-mono text-xs uppercase text-slate-500">[ APPRENTICE IDENT: #082-ALEX ]</span>
            <span className="font-mono text-xs uppercase text-[#00c8ff] animate-pulse">[ DATA_FEED: ONLINE ]</span>
          </div>

          <div className="grid md:grid-cols-4 gap-6 font-mono text-left">
            <div className="glass-card p-6 !rounded-none border-l-2 border-l-[#00c8ff]">
              <div className="text-[10px] text-slate-500 uppercase mb-2">Recall Retention Rate</div>
              <div className="text-2xl text-white font-bold tracking-widest text-glow-cyan">92.4%</div>
              <p className="text-[9px] text-slate-500 uppercase mt-2">Target benchmark: &gt;85%</p>
            </div>
            <div className="glass-card p-6 !rounded-none border-l-2 border-l-[#7b4fce]">
              <div className="text-[10px] text-slate-500 uppercase mb-2">Hint Assistance Ratio</div>
              <div className="text-2xl text-white font-bold tracking-widest text-glow-purple">12.8%</div>
              <p className="text-[9px] text-slate-500 uppercase mt-2">Indicates high independent thinking</p>
            </div>
            <div className="glass-card p-6 !rounded-none border-l-2 border-l-[#f5c518]">
              <div className="text-[10px] text-slate-500 uppercase mb-2">Worksheets Logged</div>
              <div className="text-2xl text-white font-bold tracking-widest">18 / 18</div>
              <p className="text-[9px] text-slate-500 uppercase mt-2">Active retrieval submissions</p>
            </div>
            <div className="glass-card p-6 !rounded-none border-l-2 border-l-[#39ff14]">
              <div className="text-[10px] text-slate-500 uppercase mb-2">Modules Mastered</div>
              <div className="text-2xl text-white font-bold tracking-widest">4 / 11</div>
              <p className="text-[9px] text-slate-500 uppercase mt-2">Gated by Master Trials</p>
            </div>
          </div>
        </section>

        {/* Detailed Proof Packet Simulator */}
        <section className="grid md:grid-cols-3 gap-8">
          
          {/* Left panel: Activity Log */}
          <div className="glass-card p-6 !rounded-none md:col-span-1 border-t border-t-slate-800">
            <h3 className="font-display text-sm text-white uppercase tracking-wider mb-6 border-b border-slate-800/80 pb-3">&gt; RECENT PROGRESS LOGS</h3>
            <div className="space-y-4 font-mono text-[10px] uppercase text-slate-400">
              <div className="border-b border-slate-900 pb-2">
                <div className="text-[#39ff14] font-bold">[MASTERED] MODULE 3: SELF-TEST LOOP</div>
                <div className="text-slate-500 text-[9px] mt-1">2 hours ago // Score: 5/5</div>
              </div>
              <div className="border-b border-slate-900 pb-2">
                <div className="text-white font-bold">[SUBMITTED] MODULE 4: LESSON RESCUE</div>
                <div className="text-slate-500 text-[9px] mt-1">Yesterday // Status: Under Review</div>
              </div>
              <div className="border-b border-slate-900 pb-2">
                <div className="text-[#00c8ff] font-bold">[ACTIVATED] MODULE 4: RESCUE ENGINE</div>
                <div className="text-slate-500 text-[9px] mt-1">3 days ago // Adaptive hint mode active</div>
              </div>
              <div>
                <div className="text-[#39ff14] font-bold">[MASTERED] MODULE 2: DIGITAL SMARTS</div>
                <div className="text-slate-500 text-[9px] mt-1">4 days ago // Status: Confirmed</div>
              </div>
            </div>
          </div>

          {/* Right panel: Sample Submission Preview */}
          <div className="glass-card p-6 !rounded-none md:col-span-2 border-t border-t-[#00c8ff]">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800/80 pb-3">
              <h3 className="font-display text-sm text-white uppercase tracking-wider">&gt; PORTFOLIO ARTIFACT EVIDENCE</h3>
              <span className="font-mono text-[9px] text-[#00c8ff] uppercase tracking-wider bg-[#00c8ff]/10 px-2 py-0.5 border border-[#00c8ff]/30">Module_2_Submission</span>
            </div>
            
            <div className="font-mono text-xs uppercase space-y-6 text-slate-300">
              <div>
                <div className="text-[#7b4fce] font-semibold mb-1">&gt; Prompt: Define the Power Tool Principle and state your personal attention boundaries.</div>
                <div className="p-4 bg-black/60 border border-slate-800/60 rounded text-slate-400 text-[10px] leading-relaxed uppercase">
                  "Technology is a multiplier. If I use AI to write my paragraphs for me, it acts as a superweapon making my mind weaker. But if I use it to explain complex things simply and then write it in my own words, it acts as a superpower. 
                  My top attention trap is short-form video algorithms. My new boundary is setting a physical 15-minute timer before opening those applications."
                </div>
              </div>

              <div className="border-t border-slate-900 pt-4 flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Evaluated by: System Admin</span>
                <span className="text-[#39ff14] font-bold">[VERIFIED_PASS]</span>
              </div>
            </div>
          </div>
        </section>

        {/* Gated learning philosophy */}
        <section className="glass-card p-8 !rounded-none border-x-2 border-x-[#7b4fce]/50 text-center max-w-4xl mx-auto font-mono text-xs uppercase tracking-wider space-y-4">
          <h4 className="font-display text-sm text-white tracking-[0.2em]">&gt; THE EFFORT-GATING RULE</h4>
          <p className="text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Our AI mentor engines do not supply copy-paste responses. When students request hints, they must input their prior attempts. This gating mechanism prevents cognitive outsourcing, guaranteeing that every portfolio entry represents genuine, earned understanding.
          </p>
        </section>

        {/* Conversion path */}
        <section className="text-center pt-8">
          <Link href="/beta" className="inline-block font-display uppercase font-bold text-sm tracking-[0.2em] text-[#00c8ff] border-2 border-[#00c8ff] hover:bg-[#00c8ff] hover:text-[#020617] transition-all px-8 py-4 shadow-[0_0_15px_rgba(0,200,255,0.2)]">
            Secure Founding Cohort Entry &gt;
          </Link>
        </section>
      </div>
    </main>
  );
}
