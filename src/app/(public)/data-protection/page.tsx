import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Protection | PlayIQ',
  description: 'How PlayIQ safeguards your data with industry-standard security measures.',
};

export default function DataProtectionPage() {
  return (
    <main className="w-full min-h-screen" style={{ background: '#020617' }}>
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 border-b border-slate-800/50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-[10%] w-[400px] h-[400px] bg-[rgba(123,79,206,0.06)] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="font-display text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#7b4fce] mb-3 sm:mb-4">Legal</p>
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-wider sm:tracking-widest uppercase drop-shadow-[0_0_20px_rgba(123,79,206,0.3)]">
            Data <span className="text-[#7b4fce]">Protection</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-slate-500 text-xs sm:text-sm">
            Last updated: October 6, 2026
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-6 sm:space-y-10 text-slate-400 leading-relaxed text-xs sm:text-sm">

          <div className="glass-card p-5 sm:p-8">
            <h2 className="font-display text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#00c8ff] font-bold mb-3 sm:mb-4">Overview</h2>
            <p>This page describes the technical measures that protect PlayIQ user data, particularly the data of minors using our platform. For what we collect, who we share it with, and how deletion works, see our <Link href="/privacy" className="text-[#00c8ff] hover:underline">Privacy Policy</Link>.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">Technical Security Measures</h2>
            <h3 className="text-white font-semibold mb-2">Encryption</h3>
            <p>PlayIQ's database and file storage are provided by Supabase, which documents encryption of data at rest (AES-256) and in transit (TLS). Build photos and student submissions are stored in private, access-controlled storage.</p>
            <h3 className="text-white font-semibold mt-5 mb-2">Access Controls</h3>
            <p>Authentication is handled through Supabase Auth. Role-based access control (RBAC) ensures students, parents, and administrators each have appropriately scoped permissions.</p>
            <h3 className="text-white font-semibold mt-5 mb-2">Infrastructure</h3>
            <p>PlayIQ is hosted on Google Cloud / Firebase App Hosting.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">Student Data Protection</h2>
            <p>Student data, including build submissions, AI tutor designs, and mission progress, is treated with heightened sensitivity. This data is:</p>
            <ul className="space-y-2 list-disc list-inside mt-3">
              <li>Never sold to third parties</li>
              <li>Never used for advertising targeting</li>
              <li>Accessible to the student, their parent/guardian, and authorized PlayIQ staff. Discussion board posts are also visible to other signed-in PlayIQ members</li>
              <li>Shared only with the service providers named in our Privacy Policy, and only to run PlayIQ</li>
            </ul>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">Payment Security</h2>
            <p>Payment processing is handled by Stripe, a PCI-DSS Level 1 certified provider. PlayIQ does not store raw card numbers. All transactions are tokenized and processed in Stripe's secure environment.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">Data Retention &amp; Deletion</h2>
            <p>We aim to collect only the data necessary to provide PlayIQ. Parents may request deletion of their account or their child's account and associated data by contacting <a href="mailto:support@weplayiq.com" className="text-[#00c8ff] hover:underline">support@weplayiq.com</a>. See Section 9 of our <Link href="/privacy" className="text-[#00c8ff] hover:underline">Privacy Policy</Link> for details.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">Contact</h2>
            <p>For data protection inquiries or to report a security concern:</p>
            <div className="mt-4 space-y-1 text-sm">
              <p className="text-white font-semibold">PlayIQ Learning — Data Protection</p>
              <p>Email: <a href="mailto:support@weplayiq.com" className="text-[#00c8ff] hover:underline">support@weplayiq.com</a></p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-4 border-t border-slate-800/50">
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-[#00c8ff] transition-colors">← Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-[#00c8ff] transition-colors">Terms of Service →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
