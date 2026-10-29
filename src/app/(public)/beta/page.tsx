import type { Metadata } from 'next';
import Link from 'next/link';
import { BetaForm } from '@/components/forms/BetaForm';
import { VslPlayer } from '@/components/marketing/VslPlayer';
import { headers } from 'next/headers';
import { CheckCircle2, Sparkles, ShieldCheck, Play, ArrowDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Apply for the Free Founding Cohort Pilot | PlayIQ',
  description:
    "Apply to PlayIQ's founding cohort: 12 weeks of 100% free guided AI study coaching for teens (Ages 13–17), live Parent Proof progress reports, and personalized AI tutor building.",
  alternates: { canonical: '/beta' },
};

export default async function Beta({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined } }) {
  const resolvedParams = await Promise.resolve(searchParams);
  const sourceParam = resolvedParams?.source || resolvedParams?.utm_source;
  const source = typeof sourceParam === 'string' ? sourceParam : Array.isArray(sourceParam) ? sourceParam[0] : undefined;

  const promoParam = resolvedParams?.promo || resolvedParams?.code || resolvedParams?.promoCode || resolvedParams?.accessCode;
  const initialPromo = typeof promoParam === 'string' ? promoParam : Array.isArray(promoParam) ? promoParam[0] : undefined;

  const headersList = await headers();
  const referer = headersList.get('referer');
  
  let detectedSource = source;
  if (!detectedSource) {
    if (referer) {
      if (referer.includes('facebook.com') || referer.includes('instagram.com') || referer.includes('t.co') || referer.includes('twitter.com') || referer.includes('linkedin.com') || referer.includes('tiktok.com')) {
        detectedSource = 'social_organic';
      } else if (referer.includes('google.com') || referer.includes('bing.com') || referer.includes('yahoo.com')) {
        detectedSource = 'search_organic';
      } else if (referer.includes('mail.google.com') || referer.includes('outlook.live.com') || referer.includes('yahoo.com/mail')) {
        detectedSource = 'email_organic';
      } else {
        try {
          const url = new URL(referer);
          if (!url.hostname.includes('weplayiq.com') && !url.hostname.includes('localhost')) {
            detectedSource = `referral:${url.hostname}`;
          }
        } catch {
          // invalid url
        }
      }
    }
    
    if (!detectedSource) {
      detectedSource = 'direct_traffic';
    }
  }

  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      {/* Background glow ambients */}
      <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-[rgba(123,79,206,0.08)] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[50%] left-[5%] w-[500px] h-[500px] bg-[rgba(0,200,255,0.06)] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 sm:pt-16 sm:pb-24 relative z-10 space-y-12 sm:space-y-16">
        
        {/* ═══════════ HERO: 100% FREE PILOT ═══════════ */}
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 border border-[#00c8ff] bg-[rgba(0,200,255,0.1)] shadow-[0_0_15px_rgba(0,200,255,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#00c8ff]" />
            <span className="font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[0.68rem] text-[#00c8ff] font-bold">
              FOUNDING COHORT PILOT • 100% FREE ACCESS ($0)
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-6xl uppercase tracking-wider sm:tracking-widest text-[#7b4fce] drop-shadow-[0_0_20px_rgba(123,79,206,0.45)] mb-4 sm:mb-6">
            APPLY FOR FREE PILOT
          </h1>

          <p className="font-mono text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
            Turn your teen&apos;s screen time into real-world AI mastery. 12 weeks of guided coaching, custom AI tutor building, and verifiable Parent Proof progress reports.
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-3 p-3 sm:p-4 bg-black/60 border border-[rgba(0,200,255,0.3)] shadow-[0_0_20px_rgba(0,200,255,0.15)] max-w-2xl mx-auto">
            <span className="flex items-center gap-1.5 text-xs font-mono text-[#00c8ff] font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-[#00c8ff]" /> 100% Free ($0)
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> No Credit Card Required
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              50 Inaugural Spots
            </span>
          </div>
        </section>

        {/* ═══════════ VSL (VIDEO SALES LETTER) + COURSE PROS/BENEFITS ═══════════ */}
        <section id="vsl" className="scroll-mt-20 glass-card p-6 sm:p-10 !rounded-none border-t-4 border-t-[#00c8ff] relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: VSL Player */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[280px] sm:max-w-[320px] shadow-[0_0_35px_rgba(0,200,255,0.3)]">
                <VslPlayer
                  src="/videos/playiq-vsl.mp4"
                  poster="/videos/playiq-vsl-poster.jpg"
                  orientation="portrait"
                  label="Watch: 100-Sec Overview"
                />
              </div>
              <p className="mt-3 text-[11px] font-mono uppercase tracking-widest text-[#00c8ff] text-center flex items-center gap-1.5">
                <Play className="w-3 h-3 fill-[#00c8ff]" /> PlayIQ in Action: 100-Second Tour
              </p>
            </div>

            {/* Right: What You Get & Course Benefits */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="font-mono text-xs text-[#00c8ff] uppercase tracking-[0.25em] mb-1 font-bold">
                  &gt; COURSE ADVANTAGES
                </p>
                <h2 className="font-display text-xl sm:text-3xl font-bold text-white uppercase tracking-wider">
                  Don’t Just Use AI. <span className="text-[#00c8ff] text-glow-cyan">Learn to Build With It.</span>
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 bg-black/40 border border-slate-800">
                  <h3 className="font-bold text-[#00c8ff] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span className="text-white">[01]</span> Build an AI Tutor
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Teens don&apos;t just chat with AI—they build and calibrate their own personalized study coach with knowledge files.
                  </p>
                </div>

                <div className="p-4 bg-black/40 border border-slate-800">
                  <h3 className="font-bold text-[#00c8ff] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span className="text-white">[02]</span> Catch AI Mistakes
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Learn to spot hallucinations, verify answers rigorously, and think critically instead of blindly copying answers.
                  </p>
                </div>

                <div className="p-4 bg-black/40 border border-slate-800">
                  <h3 className="font-bold text-[#00c8ff] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span className="text-white">[03]</span> Parent Proof Telemetry
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Parents receive weekly proof telemetry showing demonstrated skills, completion metrics, and growth—without micromanaging.
                  </p>
                </div>

                <div className="p-4 bg-black/40 border border-slate-800">
                  <h3 className="font-bold text-[#00c8ff] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span className="text-white">[04]</span> Real-World Skills
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Project-based engineering principles that transfer directly to high school, college prep, and high-demand careers.
                  </p>
                </div>
              </div>

              {/* Pricing Card: Loud & Clear 100% FREE */}
              <div className="p-4 sm:p-5 bg-[rgba(0,200,255,0.08)] border-2 border-[#00c8ff] font-mono text-xs shadow-[0_0_20px_rgba(0,200,255,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white uppercase tracking-widest text-sm flex items-center gap-2">
                    <span className="text-[#00c8ff]">&gt;</span> FOUNDING COHORT PRICING:
                    <span className="text-[#00c8ff] font-extrabold text-base sm:text-lg">$0 (100% FREE)</span>
                  </h3>
                  <p className="text-slate-300 text-[11px] uppercase tracking-wider mt-1">
                    Standard Price: <span className="line-through text-slate-500">$199</span> · Founding spots are 100% waived.
                  </p>
                </div>
                <a
                  href="#apply-form"
                  className="btn-neon-filled whitespace-nowrap !py-2.5 !px-5 text-xs font-display tracking-widest uppercase inline-flex items-center justify-center gap-1.5 self-start sm:self-auto"
                >
                  CLAIM SPOT <ArrowDown className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════ 3-STEP SIGN-UP INSTRUCTIONS ═══════════ */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00c8ff] font-bold mb-2">
              &gt; EASY ONBOARDING
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
              3 Steps to Join the Free Beta Pilot
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 font-mono">
            <div className="glass-card p-6 !rounded-none border-t-2 border-t-[#00c8ff] space-y-3">
              <div className="w-9 h-9 rounded bg-[#00c8ff]/15 border border-[#00c8ff] text-[#00c8ff] flex items-center justify-center font-display font-bold text-lg">
                1
              </div>
              <h3 className="font-display font-bold text-white text-base uppercase tracking-wider">
                Submit Application
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enter your parent email and teen&apos;s age group below. Takes less than 60 seconds. 100% free with no credit card required.
              </p>
            </div>

            <div className="glass-card p-6 !rounded-none border-t-2 border-t-[#7b4fce] space-y-3">
              <div className="w-9 h-9 rounded bg-[#7b4fce]/20 border border-[#7b4fce] text-[#7b4fce] flex items-center justify-center font-display font-bold text-lg">
                2
              </div>
              <h3 className="font-display font-bold text-white text-base uppercase tracking-wider">
                Instant Welcome Packet
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive instant confirmation, your direct parent login credentials, and our downloadable Parent Setup Guide PDF via email.
              </p>
            </div>

            <div className="glass-card p-6 !rounded-none border-t-2 border-t-[#00c8ff] space-y-3">
              <div className="w-9 h-9 rounded bg-[#00c8ff]/15 border border-[#00c8ff] text-[#00c8ff] flex items-center justify-center font-display font-bold text-lg">
                3
              </div>
              <h3 className="font-display font-bold text-white text-base uppercase tracking-wider">
                Launch 12-Week Pilot
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your teen logs in and begins Module 1 with Orion, their AI study coach, while you receive live Parent Proof progress updates.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════ APPLICATION FORM SECTION ═══════════ */}
        <section id="apply-form" className="scroll-mt-20 grid md:grid-cols-12 gap-8 sm:gap-12 items-start">
          
          <div className="md:col-span-5 glass-card p-6 sm:p-8 !rounded-none border-t-4 border-t-[#00c8ff] space-y-6">
             <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase tracking-[0.15em]">&gt; WHAT IS INCLUDED</h2>
             <ul className="space-y-4 font-mono text-xs text-[#b4c6ef]">
               <li className="flex items-start">
                 <span className="text-[#00c8ff] font-bold text-base mr-3 shadow-[0_0_5px_#00c8ff] leading-none">[+]</span> 
                 <p className="leading-relaxed">12 weeks of full platform access to PlayIQ Course 1.</p>
               </li>
               <li className="flex items-start">
                 <span className="text-[#00c8ff] font-bold text-base mr-3 shadow-[0_0_5px_#00c8ff] leading-none">[+]</span> 
                 <p className="leading-relaxed">Interactive Orion AI personal study coach with guided hint systems.</p>
               </li>
               <li className="flex items-start">
                 <span className="text-[#00c8ff] font-bold text-base mr-3 shadow-[0_0_5px_#00c8ff] leading-none">[+]</span> 
                 <p className="leading-relaxed">Parent Proof telemetry with weekly proof artifact tracking.</p>
               </li>
               <li className="flex items-start">
                 <span className="text-[#00c8ff] font-bold text-base mr-3 shadow-[0_0_5px_#00c8ff] leading-none">[+]</span> 
                 <p className="leading-relaxed">Direct beta feedback channel to influence the next platform release.</p>
               </li>
             </ul>
             
             <div className="p-4 bg-black/60 border border-emerald-500/40 font-mono text-xs space-y-1 text-slate-200">
               <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider">
                 <ShieldCheck className="w-4 h-4 text-emerald-400" /> Free Pilot Guarantee
               </div>
               <p className="text-[11px] text-slate-400 leading-relaxed">
                 You will never be asked for billing details during this pilot. Account setup is instant upon application.
               </p>
             </div>
          </div>

          <div className="md:col-span-7 glass-card p-6 sm:p-8 border border-[rgba(123,79,206,0.3)] !rounded-none">
            <div className="mb-6">
              <h3 className="text-[#7b4fce] font-display text-xl sm:text-2xl font-bold uppercase tracking-wider drop-shadow-[0_0_5px_#7b4fce]">
                &gt; SECURE FREE PILOT APPLICATION
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Fill in the details below to claim one of 50 founding cohort spots.
              </p>
            </div>
            <BetaForm source={detectedSource} initialPromo={initialPromo} />
          </div>
        </section>
        
        {/* Support Channel */}
        <section className="text-center pt-8 border-t border-[rgba(123,79,206,0.15)] flex flex-col items-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#7b4fce] mb-2 opacity-80">
            &gt; SECURE_COMMUNICATIONS
          </p>
          <p className="font-mono text-xs max-w-md mx-auto text-slate-400 mb-6 leading-relaxed">
            Have any questions regarding the Free Pilot program? Contact our team for priority assistance.
          </p>
          <Link href="/contact" className="btn-neon-magenta !text-[0.7rem] !py-3 !px-6 bg-[rgba(0,0,0,0.4)]">
            OPEN SUPPORT CHANNEL
          </Link>
        </section>
      </div>
    </main>
  );
}
