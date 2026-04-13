import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="w-full">
      {/* ═══════════ 1. HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020617] star-field border-b-4 border-b-[#ff00ff]">
        {/* Nebula glow accent */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-[rgba(0,242,255,0.08)] rounded-full blur-[140px] animate-drift" />
          <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-[rgba(255,0,255,0.08)] rounded-full blur-[120px] animate-drift" style={{ animationDelay: '3s' }} />
        </div>

        {/* HUD Overlay Elements */}
        <div className="absolute top-[20%] left-[5%] font-display tracking-[0.3em] text-[#00f2ff] text-[0.6rem] uppercase opacity-60">
          SYS.INIT // v.2.0.4<br/>
          CONNECTING...
        </div>
        <div className="absolute bottom-[10%] right-[5%] font-display tracking-[0.3em] text-[#ff00ff] text-[0.6rem] uppercase opacity-60 text-right">
          [SYSTEM_READY]<br/>
          STATUS: ONLINE
        </div>

        <div className="relative z-10 w-full max-w-7xl px-4 pt-20 pb-10 flex flex-col items-center justify-center">
          {/* MASSIVE Logo */}
          <div className="animate-fade-in-up mb-6 w-full text-center">
             <h1 className="font-display font-black text-[6rem] sm:text-[10rem] md:text-[14rem] leading-none tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-br from-[#00f2ff] to-[#ff00ff] drop-shadow-[0_0_40px_rgba(0,242,255,0.6)]">
               PLAY<span className="text-white">IQ</span>
             </h1>
          </div>

          <div className="glass-card !bg-transparent !border-none !backdrop-blur-none text-center max-w-4xl mx-auto flex flex-col items-center gap-6 mt-[-2rem] md:mt-[-4rem]">
            <p className="animate-fade-in-up font-display font-bold text-xs md:text-sm uppercase tracking-[0.4em] text-[#ff00ff] text-glow-magenta bg-black/50 px-4 py-1 border border-[#ff00ff]"
               style={{ animationDelay: '0.2s' }}>
              IMAGINE &gt; BUILD &gt; CONQUER
            </p>

            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-2xl md:text-5xl font-extrabold text-white leading-tight uppercase font-display tracking-widest drop-shadow-[2px_2px_0_#ff00ff]">
                Engineer Your <br/>
                <span className="text-[#00f2ff] text-glow-cyan text-[1.2em]">Reality</span>
              </h2>
              <p className="mt-8 text-sm md:text-lg text-slate-300 font-bold max-w-2xl mx-auto uppercase tracking-wide">
                Physical building blocks meet digital dominance. Earn your progress. 
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                <a href="https://www.amazon.com/dp/B0F3LV725Z" target="_blank" rel="noopener noreferrer" className="font-display uppercase font-black text-xl tracking-[0.3em] text-[#020617] bg-[#00f2ff] px-10 py-5 hover:bg-[#ff00ff] transition-colors border-2 border-white shadow-[0_0_20px_#00f2ff] hover:shadow-[0_0_30px_#ff00ff]">
                  BUY ON AMAZON
                </a>
                <Link href="/how-it-works" className="font-display uppercase font-bold text-sm tracking-[0.2em] text-white underline hover:text-[#00f2ff] transition-colors">
                  HOW IT WORKS &gt;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 2. PRODUCT — Magnetic Building Set ═══════════ */}
      <section className="relative px-6 py-20 md:py-28 bg-space-gradient star-field overflow-hidden">
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="glass-card glass-card-hover p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 glow-border-cyan">
            <div className="circle-frame animate-float" style={{ animationDelay: '0.5s' }}>
              <Image
                src="/images/playiq-branding/CONTENT, BRAND ASSETS & GUIDELINES/REFERENCE - MAGNETIC BLOCK PRODUCT IMAGES/Main Image #2 No Logo.png"
                alt="181-Piece Magnetic Building Blocks"
                width={220}
                height={220}
              />
            </div>
            <div className="text-left flex-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                181-Piece Magnetic{' '}
                <span className="text-[#ff00ff] text-glow-magenta">Building Blocks Set</span>
              </h2>
              <p className="mt-3 text-slate-400 text-sm md:text-base">
                STEM Toys for Kids Ages 3+ | Educational Space-Themed Magnetic Construction Kit with LED Light-Up Cubes
              </p>
              <div className="mt-5">
                <a href="https://www.amazon.com/dp/B0F3LV725Z" target="_blank" rel="noopener noreferrer" className="btn-neon-cyan">
                  BUY ON AMAZON ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 3. FEATURES — Why Teens Stick ═══════════ */}
      <section className="relative px-6 py-20 md:py-28 overflow-hidden" style={{ background: '#0b1120' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-[rgba(0,242,255,0.04)] rounded-full blur-[80px]" />
          <div className="absolute bottom-[15%] left-[5%] w-[250px] h-[250px] bg-[rgba(255,0,255,0.04)] rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="font-display text-xs uppercase tracking-[0.25em] text-[#00f2ff] text-glow-cyan mb-4">
              Why It Works
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              Why teens <span className="text-[#ff00ff] text-glow-magenta">won&apos;t put it down.</span>
            </h3>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
              PlayIQ operates on earned progress. They have to prove they understand the current challenge before the next one unlocks.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Earned Progress',
                desc: 'Lock-and-key mechanics mean they stay engaged trying to solve the puzzle, building resilience.',
                icon: '🔓',
              },
              {
                title: 'Guided Mentorship',
                desc: 'If they get stuck, the app provides smart hints, ensuring they do the thinking, not the software.',
                icon: '🧠',
              },
              {
                title: 'Real-World Skills',
                desc: 'Learning physics, structural design, and logic through hands-on play that lives in the physical world.',
                icon: '🚀',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="glass-card glass-card-hover p-7 text-center"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h4 className="font-display text-sm uppercase tracking-wider text-[#00f2ff] font-bold mb-3">
                  {item.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 4. CHARACTER / YOUR FIRST ADVENTURE ═══════════ */}
      <section className="relative px-6 py-20 md:py-28 bg-space-gradient star-field overflow-hidden">
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="glass-card glass-card-hover p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 glow-border-cyan">
            <div className="circle-frame animate-float" style={{ animationDelay: '1s' }}>
              <Image
                src="/images/playiq-branding/CONTENT, BRAND ASSETS & GUIDELINES/REFERENCE - MAGNETIC BLOCK PRODUCT IMAGES/Blocks in Space 1.jpg"
                alt="Blocks in Space — Your First Character"
                width={220}
                height={220}
              />
            </div>
            <div className="text-left flex-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Your First{' '}
                <span className="text-[#00f2ff] text-glow-cyan">Adventure Awaits</span>
              </h2>
              <p className="mt-3 text-slate-400 text-sm md:text-base">
                Explore immersive space worlds built with your own hands. Each course unlocks new challenges, characters, and engineering feats.
              </p>
              <div className="mt-5">
                <Link href="/apprentice" className="btn-neon-cyan">
                  Start Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 5. PARENT TRUST / PROOF ═══════════ */}
      <section className="relative px-6 py-20 md:py-28 overflow-hidden" style={{ background: '#0b1120' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[30%] left-[50%] w-[400px] h-[400px] bg-[rgba(0,242,255,0.03)] rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            {/* Image */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="glass-card p-3 rounded-2xl glow-border-cyan overflow-hidden animate-float" style={{ animationDelay: '1.5s' }}>
                <Image
                  src="/images/playiq-branding/CONTENT, BRAND ASSETS & GUIDELINES/REFERENCE - MAGNETIC BLOCK PRODUCT IMAGES/Family playIQ time.jpg"
                  alt="Family PlayIQ Time"
                  width={520}
                  height={360}
                  className="rounded-xl w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Text */}
            <div className="w-full md:w-1/2">
              <h2 className="font-display text-xs uppercase tracking-[0.25em] text-[#00f2ff] text-glow-cyan mb-4">
                Parent Proof Packet
              </h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Total visibility into their{' '}
                <span className="text-[#ff00ff] text-glow-magenta">learning.</span>
              </h3>
              <p className="mt-5 text-slate-400 leading-relaxed">
                You shouldn&apos;t have to guess if an educational tool is working. With PlayIQ, you receive a continuous Parent Proof Packet.
              </p>
              <p className="mt-3 text-slate-400 leading-relaxed">
                Instead of a generic screen saying &ldquo;100% complete,&rdquo; you see the actual photos of the structures they engineered, proving they grasped the concept.
              </p>
              <div className="mt-6">
                <Link href="/parents" className="btn-neon-magenta">
                  See How We Verify &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 6. REPLAYABILITY ═══════════ */}
      <section className="relative px-6 py-20 md:py-28 bg-space-gradient star-field overflow-hidden">
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <h2 className="font-display text-xs uppercase tracking-[0.25em] text-[#00f2ff] text-glow-cyan mb-4">
            Infinite Replay
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            More ways to <span className="text-[#ff00ff] text-glow-magenta">build.</span>
          </h3>
          <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
            The physical kit doesn&apos;t end when the course does. The hardware is a lifelong platform for invention.
          </p>
          <div className="glass-card p-3 rounded-2xl glow-border-cyan overflow-hidden">
            <Image
              src="/images/playiq-branding/CONTENT, BRAND ASSETS & GUIDELINES/REFERENCE - MAGNETIC BLOCK PRODUCT IMAGES/Blocks in Space 2.jpg"
              alt="Blocks in Space Creative Build"
              width={900}
              height={400}
              className="rounded-xl w-full h-[320px] md:h-[420px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* ═══════════ 7. FAQ & FINAL CTA ═══════════ */}
      <section className="relative px-6 py-20 md:py-28 overflow-hidden" style={{ background: '#0b1120' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[rgba(0,242,255,0.05)] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="font-display text-xs uppercase tracking-[0.25em] text-[#00f2ff] text-glow-cyan mb-4">
            Get Started
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-10">
            Ready to reshape how they{' '}
            <span className="text-[#ff00ff] text-glow-magenta">learn?</span>
          </h3>
          <a href="https://www.amazon.com/dp/B0F3LV725Z" target="_blank" rel="noopener noreferrer" className="btn-neon-filled animate-pulse-glow mb-16 inline-block">
            BUY ON AMAZON
          </a>

          {/* FAQ */}
          <div className="glass-card p-8 text-left max-w-2xl mx-auto mt-12">
            <h4 className="font-display text-sm uppercase tracking-wider text-[#00f2ff] font-bold border-b border-slate-700/50 pb-4 mb-6 text-glow-cyan">
              Frequently Asked Questions
            </h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-semibold text-white text-lg">What age group is this for?</h5>
                <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                  Course 1: Apprentice is optimized for ages 13–17, introducing advanced structural concepts and logic.
                </p>
              </div>
              <div>
                <h5 className="font-semibold text-white text-lg">Do they need their own tablet?</h5>
                <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                  A screen is used briefly to receive missions and snap photos of their builds. The heavy lifting happens strictly offline on the desk.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="mt-6 inline-block text-[#00f2ff] font-semibold text-sm hover:underline"
            >
              Read all FAQs &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
