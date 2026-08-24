import Link from 'next/link';
import { BetaForm } from '@/components/forms/BetaForm';
import { headers } from 'next/headers';

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
          // Ignore self-referrals (navigating within the app)
          if (!url.hostname.includes('weplayiq.com') && !url.hostname.includes('localhost')) {
            detectedSource = `referral:${url.hostname}`;
          }
        } catch (e) {
          // invalid url
        }
      }
    }
    
    // If still no source, it means they typed the URL directly or clicked a link from a non-web app (like a desktop email client)
    if (!detectedSource) {
      detectedSource = 'direct_traffic';
    }
  }

  return (
    <main className="w-full bg-[#020617] star-field min-h-screen relative overflow-hidden">
      <div className="absolute top-[30%] right-[15%] w-[600px] h-[600px] bg-[rgba(123,79,206,0.06)] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 sm:pt-16 sm:pb-24 relative z-10 space-y-10 sm:space-y-16">
        <section className="text-center">
          <p className="font-display uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[0.65rem] text-[#00c8ff] opacity-80 mb-3 sm:mb-4">&gt; FOUNDING COHORT</p>
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-6xl uppercase tracking-wider sm:tracking-widest text-[#7b4fce] drop-shadow-[0_0_15px_rgba(123,79,206,0.4)] mb-4 sm:mb-8">
            APPLY FOR PILOT
          </h1>
          <p className="font-mono text-xs sm:text-sm max-w-2xl mx-auto text-slate-400 capitalize bg-black/40 p-3.5 sm:p-4 border border-[rgba(0,200,255,0.2)] leading-relaxed">
            <span className="text-white font-bold">WARNING: SPOT LIMIT REACHED SOON.</span> We are opening exactly <strong>50 spots</strong> for the inaugural launch of Course 1 to calibrate system endpoints.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16">
          
          <div className="glass-card p-5 sm:p-8 !rounded-none border-t-4 border-t-[#00c8ff]">
             <h2 className="font-display text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6 uppercase tracking-[0.15em] sm:tracking-[0.2em]">&gt; WHAT YOU GET</h2>
             <ul className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 font-mono text-xs text-[#b4c6ef] uppercase tracking-wider sm:tracking-widest">
               <li className="flex items-start">
                 <span className="text-[#00c8ff] text-base sm:text-lg mr-2.5 sm:mr-3 shadow-[0_0_5px_#00c8ff] leading-none">[+]</span> 
                 <p className="opacity-80 mt-0.5 sm:mt-1 text-[11px] sm:text-xs">Instant activation of the digital study and AI coaching platform.</p>
               </li>
               <li className="flex items-start">
                 <span className="text-[#00c8ff] text-base sm:text-lg mr-2.5 sm:mr-3 shadow-[0_0_5px_#00c8ff] leading-none">[+]</span> 
                 <p className="opacity-80 mt-0.5 sm:mt-1 text-[11px] sm:text-xs">12 weeks of access to the guided system.</p>
               </li>
               <li className="flex items-start">
                 <span className="text-[#00c8ff] text-base sm:text-lg mr-2.5 sm:mr-3 shadow-[0_0_5px_#00c8ff] leading-none">[+]</span> 
                 <p className="opacity-80 mt-0.5 sm:mt-1 text-[11px] sm:text-xs">Live access to Parent Proof telemetry.</p>
               </li>
               <li className="flex items-start">
                 <span className="text-[#00c8ff] text-base sm:text-lg mr-2.5 sm:mr-3 shadow-[0_0_5px_#00c8ff] leading-none">[+]</span> 
                 <p className="opacity-80 mt-0.5 sm:mt-1 text-[11px] sm:text-xs">Direct feedback uplink for V2 calibration.</p>
               </li>
             </ul>
             
             <div className="p-4 sm:p-6 bg-[rgba(0,200,255,0.05)] border border-[#00c8ff] font-mono text-xs text-white">
               <h3 className="font-bold text-[#00c8ff] uppercase tracking-wider sm:tracking-widest mb-1.5 sm:mb-2">&gt; PRICING</h3>
               <p className="opacity-80 leading-relaxed uppercase text-[11px] sm:text-xs"><strong>[PRICING OVERRIDE]</strong> Includes full software license. Account setup is instant upon acceptance.</p>
             </div>
          </div>

          <div className="glass-card p-5 sm:p-8 border border-[rgba(123,79,206,0.3)] !rounded-none">
            <h3 className="text-[#7b4fce] font-display text-lg sm:text-2xl font-bold mb-4 sm:mb-6 uppercase tracking-[0.15em] sm:tracking-[0.2em] drop-shadow-[0_0_5px_#7b4fce]">&gt; SECURE APPLICATION</h3>
            <BetaForm source={detectedSource} initialPromo={initialPromo} />
          </div>
        </section>
        
        <section className="text-center pt-12 border-t border-[rgba(123,79,206,0.15)] flex flex-col items-center">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#7b4fce] mb-3 opacity-80">
            &gt; SECURE_COMMUNICATIONS
          </p>
          <p className="font-mono text-sm max-w-md mx-auto text-slate-400 mb-8 leading-relaxed">
            Have any additional questions? <br/>
            Contact our team for priority assistance.
          </p>
          <Link href="/contact" className="btn-neon-magenta !text-[0.7rem] !py-3 !px-6 bg-[rgba(0,0,0,0.4)]">
            OPEN SUPPORT CHANNEL
          </Link>
        </section>
      </div>
    </main>
  );
}
