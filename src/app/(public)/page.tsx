"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlayIQLogo } from '@/components/layout/PlayIQLogo';

export default function Home() {
  const [selectedPath, setSelectedPath] = useState<'none' | 'physical' | 'digital' | 'both'>('none');

  return (
    <main className="w-full">
      {/* ═══════════ 1. HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020617] star-field border-b-4 border-b-[#7b4fce]">
        {/* Nebula glow accent */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-[rgba(0,200,255,0.08)] rounded-full blur-[140px] animate-drift" />
          <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-[ 
    $m = $args[0].Value
    $m -replace 'rgba\(255,\s*0,\s*255,\s*', 'rgba(123,79,206,' 
  ] rounded-full blur-[120px] animate-drift" style={{ animationDelay: '3s' }} />
        </div>

        {/* HUD Overlay Elements */}
        <div className="absolute top-[20%] right-[3%] font-display tracking-[0.3em] text-[#00c8ff] text-[0.6rem] uppercase opacity-60 text-right">
          SYS.INIT // v.2.0.4<br/>
          CONNECTING...
        </div>
        <div className="absolute bottom-[10%] left-[8%] font-display tracking-[0.3em] text-[#7b4fce] text-[0.6rem] uppercase opacity-60">
          [SYSTEM_READY]<br/>
          STATUS: ONLINE
        </div>

        <div className="relative z-10 w-full max-w-7xl px-4 pt-20 pb-10 flex flex-col items-center justify-center">
          {/* MASSIVE Logo */}
          <div className="animate-fade-in-up mb-6 w-full text-center">
            <PlayIQLogo variant="hero" className="mx-auto" />
          </div>

          <div className="glass-card !bg-transparent !border-none !backdrop-blur-none text-center max-w-4xl mx-auto flex flex-col items-center gap-6 mt-[-1rem] md:mt-[-2rem]">
            <p className="animate-fade-in-up font-display font-bold text-xs md:text-sm uppercase tracking-[0.4em] text-[#7b4fce] text-glow-magenta bg-black/50 px-4 py-1 border border-[#7b4fce]"
               style={{ animationDelay: '0.2s' }}>
              IMAGINE &gt; BUILD &gt; CONQUER
            </p>

            <div className="text-center animate-fade-in-up w-full" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-2xl md:text-5xl font-extrabold text-white leading-tight uppercase font-display tracking-widest drop-shadow-[2px_2px_0_#7b4fce]">
                Engineer Your <br/>
                <span className="text-[#00c8ff] text-glow-cyan text-[1.2em]">Reality</span>
              </h2>
              <p className="mt-8 text-sm md:text-lg text-slate-300 font-bold max-w-2xl mx-auto uppercase tracking-wide">
                Where physical building blocks meet digital dominance. 
              </p>
              
              <div className="mt-12 flex flex-col items-center justify-center gap-6">
                <p className="font-display text-sm md:text-base text-white tracking-[0.1em] uppercase">
                  Do you want <span className="text-[#7b4fce]">physical hands-on play</span> OR <span className="text-[#00c8ff]">digital learning</span> OR the best of both worlds?
                </p>
                <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                  <button 
                    onClick={() => {
                        setSelectedPath('physical');
                        setTimeout(() => document.getElementById('content-start')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className={`font-display uppercase font-bold text-sm tracking-[0.1em] px-6 py-4 transition-all border-2 ${selectedPath === 'physical' ? 'bg-[#7b4fce] text-white border-[#7b4fce] shadow-[0_0_20px_#7b4fce]' : 'bg-transparent text-white border-white/30 hover:border-[#7b4fce] hover:text-[#7b4fce]'}`}
                  >
                    Physical Play
                  </button>
                  <button 
                    onClick={() => {
                        setSelectedPath('digital');
                        setTimeout(() => document.getElementById('content-start')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className={`font-display uppercase font-bold text-sm tracking-[0.1em] px-6 py-4 transition-all border-2 ${selectedPath === 'digital' ? 'bg-[#00c8ff] text-[#020617] border-[#00c8ff] shadow-[0_0_20px_#00c8ff]' : 'bg-transparent text-white border-white/30 hover:border-[#00c8ff] hover:text-[#00c8ff]'}`}
                  >
                    Digital Learning
                  </button>
                  <button 
                    onClick={() => {
                        setSelectedPath('both');
                        setTimeout(() => document.getElementById('content-start')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className={`font-display uppercase font-bold text-sm tracking-[0.1em] px-6 py-4 transition-all border-2 ${selectedPath === 'both' ? 'bg-gradient-to-r from-[#00c8ff] to-[#7b4fce] text-white border-transparent shadow-[0_0_20px_rgba(123,79,206,0.5)]' : 'bg-transparent text-white border-white/30 hover:border-[#7b4fce] hover:shadow-[0_0_15px_#7b4fce]'}`}
                  >
                    Best of Both Worlds
                  </button>
                </div>

                <Link href="/how-it-works" className="mt-4 font-display uppercase font-bold text-xs tracking-[0.2em] text-white/70 underline hover:text-white transition-colors">
                  OR SEE HOW IT WORKS &gt;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="content-start" className="scroll-mt-10" />

      {/* ═══════════ 2. PRODUCT — Magnetic Building Set ═══════════ */}
      {(selectedPath === 'physical' || selectedPath === 'both') && (
      <section className="relative px-6 py-20 md:py-28 bg-space-gradient star-field overflow-hidden animate-fade-in-up">
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="glass-card glass-card-hover p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 glow-border-cyan">
            <div className="circle-frame animate-float" style={{ animationDelay: '0.5s' }}>
              <Image
                src="/images/playiq-amz-product.jpg"
                alt="181-Piece Magnetic Building Blocks"
                width={220}
                height={220}
              />
            </div>
            <div className="text-left flex-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                181-Piece Magnetic{' '}
                <span className="text-[#7b4fce] text-glow-magenta">Building Blocks Set</span>
              </h2>
              <p className="mt-3 text-slate-400 text-sm md:text-base">
                STEM Toys for Kids Ages 3+ | Educational Space-Themed Magnetic Construction Kit with LED Light-Up Cubes
              </p>
              <div className="mt-5 flex gap-4">
                <Link href="#get-started" className="btn-neon-cyan">
                  LEARN MORE ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ═══════════ 3. FEATURES — Why Teens Stick ═══════════ */}
      {(selectedPath === 'digital' || selectedPath === 'both') && (
      <section className="relative px-6 py-20 md:py-28 overflow-hidden animate-fade-in-up" style={{ background: '#0b1120' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-[rgba(0,200,255,0.04)] rounded-full blur-[80px]" />
          <div className="absolute bottom-[15%] left-[5%] w-[250px] h-[250px] bg-[ 
    $m = $args[0].Value
    $m -replace 'rgba\(255,\s*0,\s*255,\s*', 'rgba(123,79,206,' 
  ] rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="font-display text-xs uppercase tracking-[0.25em] text-[#00c8ff] text-glow-cyan mb-4">
              Why It Works
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              Why teens <span className="text-[#7b4fce] text-glow-magenta">won&apos;t put it down.</span>
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
                <h4 className="font-display text-sm uppercase tracking-wider text-[#00c8ff] font-bold mb-3">
                  {item.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ═══════════ 4. CHARACTER / YOUR FIRST ADVENTURE ═══════════ */}
      {(selectedPath === 'digital' || selectedPath === 'both') && (
      <section className="relative px-6 py-20 md:py-28 bg-space-gradient star-field overflow-hidden animate-fade-in-up">
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
                <span className="text-[#00c8ff] text-glow-cyan">Adventure Awaits</span>
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
      )}

      {/* ═══════════ 5. PARENT TRUST / PROOF ═══════════ */}
      {(selectedPath === 'digital' || selectedPath === 'both') && (
      <section className="relative px-6 py-20 md:py-28 overflow-hidden animate-fade-in-up" style={{ background: '#0b1120' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[30%] left-[50%] w-[400px] h-[400px] bg-[rgba(0,200,255,0.03)] rounded-full blur-[100px]" />
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
              <h2 className="font-display text-xs uppercase tracking-[0.25em] text-[#00c8ff] text-glow-cyan mb-4">
                Parent Proof Packet
              </h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Total visibility into their{' '}
                <span className="text-[#7b4fce] text-glow-magenta">learning.</span>
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
      )}

      {/* ═══════════ 6. REPLAYABILITY ═══════════ */}
      {(selectedPath === 'physical' || selectedPath === 'both') && (
      <section className="relative px-6 py-20 md:py-28 bg-space-gradient star-field overflow-hidden animate-fade-in-up">
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <h2 className="font-display text-xs uppercase tracking-[0.25em] text-[#00c8ff] text-glow-cyan mb-4">
            Infinite Replay
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            More ways to <span className="text-[#7b4fce] text-glow-magenta">build.</span>
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
      )}

      {/* ═══════════ 7. FAQ & FINAL CTA ═══════════ */}
      {selectedPath !== 'none' && (
      <section id="get-started" className="relative px-6 py-20 md:py-28 overflow-hidden animate-fade-in-up" style={{ background: '#0b1120' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[rgba(0,200,255,0.05)] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="font-display text-xs uppercase tracking-[0.25em] text-[#00c8ff] text-glow-cyan mb-4">
            Get Started
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-10">
            Ready to reshape how they{' '}
            <span className="text-[#7b4fce] text-glow-magenta">learn?</span>
          </h3>
          <Link href="/beta" className="btn-neon-filled animate-pulse-glow mb-16 inline-block">
            JOIN EARLY ACCESS
          </Link>

          {/* FAQ */}
          <div className="glass-card p-8 text-left max-w-2xl mx-auto mt-12">
            <h4 className="font-display text-sm uppercase tracking-wider text-[#00c8ff] font-bold border-b border-slate-700/50 pb-4 mb-6 text-glow-cyan">
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
              className="mt-6 inline-block text-[#00c8ff] font-semibold text-sm hover:underline"
            >
              Read all FAQs &rarr;
            </Link>
          </div>
        </div>
      </section>
      )}
    </main>
  );
}
