import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Protection | PlayIQ',
  description: 'How PlayIQ safeguards your data with industry-standard security measures.',
};

export default function DataProtectionPage() {
  return (
    <main className="w-full min-h-screen" style={{ background: '#020617' }}>
      <section className="relative py-20 px-6 border-b border-slate-800/50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-[10%] w-[400px] h-[400px] bg-[ 
    $m = $args[0].Value
    $m -replace 'rgba\(255,\s*0,\s*255,\s*', 'rgba(123,79,206,' 
  ] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-[#7b4fce] mb-4">Legal</p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white tracking-widest uppercase drop-shadow-[0_0_20px_rgba(123,79,206,0.3)]">
            Data <span className="text-[#7b4fce]">Protection</span>
          </h1>
          <p className="mt-4 text-slate-500 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl space-y-10 text-slate-400 leading-relaxed">

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">Overview</h2>
            <p>PlayIQ Learning is committed to maintaining the highest standards of data security. This policy outlines the technical and administrative controls we employ to protect user data — particularly the data of minors using our platform.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">Data Governance</h2>
            <p>We have designated internal data stewardship responsibilities to ensure accountability across all data-handling processes. Data access is governed on a strict least-privilege basis — personnel only access what is necessary to perform their role.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">Technical Security Measures</h2>
            <h3 className="text-white font-semibold mb-2">Encryption</h3>
            <p>All data at rest is encrypted using AES-256. All data in transit is protected by TLS 1.2+. Build photos and student submissions are stored in encrypted, access-controlled object storage.</p>
            <h3 className="text-white font-semibold mt-5 mb-2">Access Controls</h3>
            <p>Authentication is handled through Supabase Auth. Role-based access control (RBAC) ensures students, parents, and administrators each have appropriately scoped permissions.</p>
            <h3 className="text-white font-semibold mt-5 mb-2">Infrastructure</h3>
            <p>PlayIQ is hosted on Google Cloud / Firebase App Hosting, benefiting from enterprise-grade security, global DDoS mitigation, and 99.9% uptime SLA.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">Student Data Protection</h2>
            <p>Student data — including build submissions, AI mentor interactions, and mission progress — is treated with heightened sensitivity. This data is:</p>
            <ul className="space-y-2 list-disc list-inside mt-3">
              <li>Never sold to third parties</li>
              <li>Never used for advertising targeting</li>
              <li>Accessible only by the student, their designated parent/guardian, and authorized PlayIQ personnel</li>
              <li>Processed exclusively for educational improvement and Parent Proof Packet generation</li>
            </ul>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">Payment Security</h2>
            <p>Payment processing is handled by Stripe, a PCI-DSS Level 1 certified provider. PlayIQ does not store raw card numbers. All transactions are tokenized and processed in Stripe's secure environment.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">Data Retention</h2>
            <p>We collect only the data necessary to provide PlayIQ. Student progress data is retained for the duration of active subscription plus 12 months. Upon account deletion, all personal data is purged within 30 days, except where legally required.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">Incident Response</h2>
            <p>In the event of a data breach, we will notify affected users within 72 hours of becoming aware of the incident. Our plan includes immediate containment, root cause analysis, and remediation steps.</p>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#00c8ff] font-bold mb-4">Contact</h2>
            <p>For data protection inquiries or to report a security concern:</p>
            <div className="mt-4 space-y-1 text-sm">
              <p className="text-white font-semibold">PlayIQ Learning — Data Protection</p>
              <p>Email: <a href="mailto:hello@playiq.com" className="text-[#00c8ff] hover:underline">hello@playiq.com</a></p>
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
