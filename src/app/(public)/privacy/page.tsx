import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | PlayIQ',
  description:
    'Learn how PlayIQ collects, uses, and protects your personal information and your child\'s data.',
};

export default function PrivacyPage() {
  return (
    <main className="w-full min-h-screen" style={{ background: '#020617' }}>
      {/* Header */}
      <section className="relative py-20 px-6 border-b border-slate-800/50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-[400px] h-[400px] bg-[rgba(0,200,255,0.06)] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-[#7b4fce] mb-4">
            Legal
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white tracking-widest uppercase drop-shadow-[0_0_20px_rgba(0,200,255,0.4)]">
            Privacy <span className="text-[#00c8ff]">Policy</span>
          </h1>
          <p className="mt-4 text-slate-500 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl space-y-10 text-slate-400 leading-relaxed">

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">
              1. Introduction
            </h2>
            <p>
              PlayIQ Learning ("we," "our," or "us") is committed to protecting your privacy and the privacy of your
              children. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
              you use our platform, including the PlayIQ app, website, and associated physical learning kits.
            </p>
            <p className="mt-3">
              By using PlayIQ, you agree to the data practices described in this policy. If you do not agree, please
              discontinue use of our services.
            </p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-white font-semibold mb-2">Personal Information</h3>
            <p>
              We collect information you provide directly to us, such as name, email address, and billing information
              when you create an account or make a purchase.
            </p>
            <h3 className="text-white font-semibold mt-5 mb-2">Student & Child Data</h3>
            <p>
              For minor users (under 18), we collect only the data necessary to deliver the learning experience —
              course progress, mission completions, build photo submissions, and achievement records. We do not
              knowingly collect personal data from children under 13 without verifiable parental consent.
            </p>
            <h3 className="text-white font-semibold mt-5 mb-2">Usage Information</h3>
            <p>
              We automatically collect technical data such as IP address, device type, browser type, pages viewed, and
              time spent on features, to improve platform performance and personalize the learning experience.
            </p>
            <h3 className="text-white font-semibold mt-5 mb-2">AI Mentor Data</h3>
            <p>
              Interactions with the PlayIQ AI guidance system — including hints requested, challenge responses, and
              mission feedback — are logged to improve adaptive learning algorithms and provide personalized progress
              insights for parents.
            </p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>To deliver, personalize, and improve the PlayIQ learning experience</li>
              <li>To process orders, subscriptions, and send transactional communications</li>
              <li>To generate Parent Proof Packets showing your child's verified progress</li>
              <li>To respond to customer support inquiries</li>
              <li>To send product updates, educational tips, and promotional offers (you may opt out at any time)</li>
              <li>To comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">
              4. Sharing Your Information
            </h2>
            <p>
              We do not sell your personal information. We may share data with trusted third-party service providers
              (e.g., payment processors, hosting providers, email delivery services) only to the extent necessary to
              operate PlayIQ. These partners are contractually bound to protect your data.
            </p>
            <p className="mt-3">
              We may also disclose information when required by law or to protect the rights, property, or safety of
              PlayIQ, our users, or others.
            </p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">
              5. Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies and similar technologies to keep you logged in, remember preferences, and analyze usage
              patterns. You can control cookie settings via your browser. Note that disabling cookies may affect
              platform functionality.
            </p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">
              6. Your Rights and Choices
            </h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="space-y-2 list-disc list-inside mt-3">
              <li>Access or request a copy of your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data ("right to be forgotten")</li>
              <li>Opt out of marketing communications</li>
              <li>Lodge a complaint with your local data protection authority</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:hello@playiq.com" className="text-[#00c8ff] hover:underline">
                hello@playiq.com
              </a>
              .
            </p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">
              7. Children's Privacy (COPPA)
            </h2>
            <p>
              PlayIQ is designed for use by children under parental supervision. We comply with the Children's Online
              Privacy Protection Act (COPPA). If you believe we have inadvertently collected information from a child
              under 13 without parental consent, please contact us immediately at{' '}
              <a href="mailto:hello@playiq.com" className="text-[#00c8ff] hover:underline">
                hello@playiq.com
              </a>{' '}
              and we will delete it promptly.
            </p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting
              the new policy on this page and updating the "Last updated" date. Continued use of PlayIQ after changes
              constitutes acceptance of the revised policy.
            </p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">
              9. Contact Us
            </h2>
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <div className="mt-4 space-y-1 text-sm">
              <p className="text-white font-semibold">PlayIQ Learning</p>
              <p>
                Email:{' '}
                <a href="mailto:hello@playiq.com" className="text-[#00c8ff] hover:underline">
                  hello@playiq.com
                </a>
              </p>
            </div>
          </div>

          {/* Nav to other legal */}
          <div className="flex flex-wrap justify-center gap-6 pt-4 border-t border-slate-800/50">
            <Link href="/data-protection" className="text-sm text-slate-500 hover:text-[#00c8ff] transition-colors">
              Data Protection Policy →
            </Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-[#00c8ff] transition-colors">
              Terms of Service →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
