import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | PlayIQ',
  description: 'Read the PlayIQ Terms of Service governing use of the platform, subscriptions, and digital learning content.',
};

export default function TermsPage() {
  return (
    <main className="w-full min-h-screen" style={{ background: '#020617' }}>
      <section className="relative py-20 px-6 border-b border-slate-800/50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[20%] w-[400px] h-[400px] bg-[rgba(0,242,255,0.05)] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-[#ff00ff] mb-4">Legal</p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white tracking-widest uppercase drop-shadow-[0_0_20px_rgba(0,242,255,0.4)]">
            Terms of <span className="text-[#00f2ff]">Service</span>
          </h1>
          <p className="mt-4 text-slate-500 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl space-y-10 text-slate-400 leading-relaxed">

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00f2ff] font-bold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using PlayIQ Learning ("PlayIQ," "we," "our," or "us") — including the website, mobile application, digital learning platform, and associated physical products — you agree to be bound by these Terms of Service. If you are a parent or guardian registering on behalf of a minor, you accept these terms on their behalf.</p>
            <p className="mt-3">If you do not agree to these terms, do not use PlayIQ.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00f2ff] font-bold mb-4">2. Eligibility</h2>
            <p>You must be at least 18 years old to create an account. Minor users (ages 13–17) may access PlayIQ only with a parent or guardian who has created and manages the account. Users under 13 require verifiable parental consent in accordance with COPPA.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00f2ff] font-bold mb-4">3. Account Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at <a href="mailto:hello@playiq.com" className="text-[#00f2ff] hover:underline">hello@playiq.com</a> if you suspect unauthorized access.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00f2ff] font-bold mb-4">4. Subscriptions & Payments</h2>
            <p>PlayIQ offers subscription-based access to digital learning content. By subscribing, you authorize us to charge your payment method on a recurring basis at the selected billing interval.</p>
            <h3 className="text-white font-semibold mt-4 mb-2">Cancellation</h3>
            <p>You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period. We do not provide refunds for unused portions of a subscription period.</p>
            <h3 className="text-white font-semibold mt-4 mb-2">Physical Products</h3>
            <p>Physical product orders (e.g., Magnetic Building Kits) are subject to separate return and refund policies per Amazon marketplace policies where applicable.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00f2ff] font-bold mb-4">5. Permitted Use</h2>
            <p>PlayIQ is licensed — not sold — to you for personal, non-commercial educational use. You may not:</p>
            <ul className="space-y-2 list-disc list-inside mt-3">
              <li>Copy, redistribute, or resell PlayIQ content</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Share account credentials with others outside your family unit</li>
              <li>Use the platform to transmit harmful, unlawful, or abusive content</li>
              <li>Use automated tools to scrape or interact with the platform</li>
            </ul>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00f2ff] font-bold mb-4">6. Intellectual Property</h2>
            <p>All PlayIQ content — including course materials, AI-generated hints, characters, branding, and software — is owned by PlayIQ Learning and protected by copyright and intellectual property laws. User-generated content (e.g., build photos submitted for Parent Proof Packets) remains yours; however, you grant us a limited license to display and process it within the platform.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00f2ff] font-bold mb-4">7. AI Mentor Disclaimer</h2>
            <p>The PlayIQ AI Mentor provides educational guidance and hints. It is not a substitute for professional educational assessment. AI-generated feedback is provided as-is, and PlayIQ makes no warranties regarding its accuracy or completeness for any particular educational outcome.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00f2ff] font-bold mb-4">8. Disclaimers & Limitation of Liability</h2>
            <p>PlayIQ is provided on an "as-is" and "as-available" basis. We disclaim all warranties of any kind. To the maximum extent permitted by law, PlayIQ's liability to you for any claim arising out of or related to these terms shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00f2ff] font-bold mb-4">9. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at our discretion if you violate these terms, engage in fraudulent activity, or misuse the platform. You may delete your account at any time from account settings.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00f2ff] font-bold mb-4">10. Governing Law</h2>
            <p>These Terms shall be governed by the laws of the United States, without regard to its conflict of law provisions. Any disputes shall be resolved through binding arbitration or in the courts located in the applicable jurisdiction.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00f2ff] font-bold mb-4">11. Changes to Terms</h2>
            <p>We may modify these Terms at any time. Material changes will be communicated via email or platform notification. Continued use of PlayIQ after changes constitute acceptance of the revised Terms.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00f2ff] font-bold mb-4">12. Contact</h2>
            <div className="space-y-1 text-sm">
              <p className="text-white font-semibold">PlayIQ Learning</p>
              <p>Email: <a href="mailto:hello@playiq.com" className="text-[#00f2ff] hover:underline">hello@playiq.com</a></p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-4 border-t border-slate-800/50">
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-[#00f2ff] transition-colors">← Privacy Policy</Link>
            <Link href="/data-protection" className="text-sm text-slate-500 hover:text-[#00f2ff] transition-colors">Data Protection →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
