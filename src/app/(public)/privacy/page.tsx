import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | PlayIQ',
  description:
    'Learn how PlayIQ collects, uses, and protects your personal information and your child\'s data.',
};

const cardClass = 'glass-card p-5 sm:p-8';
const h2Class =
  'font-display text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#00c8ff] font-bold mb-3 sm:mb-4';
const h3Class = 'text-white font-semibold mt-5 mb-2';
const linkClass = 'text-[#00c8ff] hover:underline font-mono';

/** Outside services that receive PlayIQ data. Keep in sync with the code and docs/privacy. */
const serviceProviders = [
  {
    name: 'Supabase',
    purpose: 'Database, account login, and private file storage (worksheets, photos, uploaded files).',
  },
  {
    name: 'Google Cloud / Firebase App Hosting',
    purpose: 'Hosts and runs the PlayIQ website and app.',
  },
  {
    name: 'Google Gemini API (paid)',
    purpose: 'Powers AI learning features. See "AI Features" below.',
  },
  {
    name: 'Amazon Simple Email Service (SES)',
    purpose: 'Sends account and service emails, such as confirmations and notifications.',
  },
  {
    name: 'Stripe',
    purpose: 'Processes payments. PlayIQ does not store card numbers.',
  },
  {
    name: 'Google Analytics',
    purpose:
      'Measures visits to our public website pages only. It does not run in student, parent, or admin dashboards.',
  },
];

const browserStorage = [
  {
    name: 'Login session cookies (Supabase)',
    purpose: 'Keep you signed in. Required for the app to work.',
  },
  {
    name: 'Google Analytics cookies (_ga, _ga_*)',
    purpose: 'Set only on public website pages, to count visits and see which pages are used.',
  },
  {
    name: 'Preferences and progress helpers (browser storage)',
    purpose:
      'Remember your light/dark theme, whether you have finished the dashboard tour, guide panels you opened or closed, and unsaved worksheet drafts on this device.',
  },
  {
    name: 'Pop-up and assistant reminders (browser storage)',
    purpose:
      'Remember whether you have already seen the early-access pop-up and whether the AI guide has opened automatically this session.',
  },
];

export default function PrivacyPage() {
  return (
    <main className="w-full min-h-screen" style={{ background: '#020617' }}>
      {/* Header */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 border-b border-slate-800/50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-[400px] h-[400px] bg-[rgba(0,200,255,0.06)] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="font-display text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#7b4fce] mb-3 sm:mb-4">
            Legal
          </p>
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-wider sm:tracking-widest uppercase drop-shadow-[0_0_20px_rgba(0,200,255,0.4)]">
            Privacy <span className="text-[#00c8ff]">Policy</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-slate-500 text-xs sm:text-sm">
            Last updated: October 6, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-6 sm:space-y-10 text-slate-400 leading-relaxed text-xs sm:text-sm">

          <div className={cardClass}>
            <h2 className={h2Class}>1. Introduction</h2>
            <p>
              PlayIQ Learning (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy and the privacy of your
              children. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
              you use our platform, including the PlayIQ app, website, and associated services.
            </p>
            <p className="mt-3">
              By using PlayIQ, you agree to the data practices described in this policy. If you do not agree, please
              discontinue use of our services.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className={h2Class}>2. Information We Collect</h2>

            <h3 className="text-white font-semibold mb-2">Parent and Guardian Information</h3>
            <p>
              When you create an account, we collect your name, email address, and password (passwords are handled by
              our login provider and are not visible to us). If you make a purchase, payment details are collected and
              processed by Stripe.
            </p>

            <h3 className={h3Class}>Student Information</h3>
            <p>Child profiles are created by a parent or guardian. To deliver the learning experience, we collect:</p>
            <ul className="space-y-1 list-disc list-inside mt-2">
              <li>Name, username, and login details for the student profile</li>
              <li>Lesson and module progress, quiz and worksheet answers, and achievements</li>
              <li>Answers to the starting learning-style assessment (for example, preferred explanation style)</li>
              <li>Files and photos submitted as part of learning activities, such as build photos and completed worksheets</li>
              <li>The AI tutors and assistants students design, and any files they add to them</li>
              <li>Posts and replies on the PlayIQ discussion board</li>
            </ul>

            <h3 className={h3Class}>Photos and Uploaded Files</h3>
            <p>
              Students can upload photos and files to show their work. A photo may capture more than the project
              itself, such as a person or a room. We encourage parents to review what their child uploads. Uploaded
              files are kept in private storage and are not publicly accessible.
            </p>

            <h3 className={h3Class}>Discussion Board</h3>
            <p>
              Discussion posts and replies, along with the author&apos;s display name, are visible to other signed-in
              PlayIQ members. Parents have read-only access. Posts are screened for safety, including by automated AI
              review, and may be removed by moderators.
            </p>

            <h3 className={h3Class}>Usage Information</h3>
            <p>
              Our hosting provider records standard technical data, such as IP address, browser type, and the pages
              requested, to operate and secure the service. On public website pages only, Google Analytics measures
              visits (see Section 6).
            </p>
          </div>

          <div className={cardClass}>
            <h2 className={h2Class}>3. How We Use Your Information</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>To deliver, personalize, and improve the PlayIQ learning experience</li>
              <li>To process orders and subscriptions, and send account and service emails</li>
              <li>To generate Parent Proof Packets showing your child&apos;s verified progress</li>
              <li>To keep the discussion board and platform safe</li>
              <li>To respond to support requests</li>
              <li>To send parents product updates and offers (you may opt out at any time)</li>
              <li>To comply with legal obligations and enforce our Terms of Service</li>
            </ul>
            <p className="mt-3">We do not sell personal information, and we do not show advertising in PlayIQ.</p>
          </div>

          <div className={cardClass}>
            <h2 className={h2Class}>4. AI Features</h2>
            <p>
              PlayIQ uses Google&apos;s paid Gemini API to provide AI-powered learning features. According to Google&apos;s
              current Gemini API terms, content submitted through Paid Services is not used to improve Google&apos;s
              products. Google may process or temporarily retain certain data for service operation, security, and
              abuse monitoring as described in its terms.
            </p>
            <h3 className={h3Class}>Where AI is used</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>The AI guide that gives hints and explanations during lessons</li>
              <li>The AI tutors and assistants students build and test</li>
              <li>Scoring and feedback on the starting learning-style assessment</li>
              <li>Safety screening of discussion board posts</li>
            </ul>
            <h3 className={h3Class}>What we keep</h3>
            <p>
              We keep the AI tutor and assistant designs students create, files they add to them, and short learning
              signals from AI guidance (for example, the type of confusion a hint addressed, or a student&apos;s chosen
              learning preferences) so we can personalize lessons and show progress to parents.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className={h2Class}>5. Who We Share Data With</h2>
            <p>
              We share data only with the service providers below, and only as needed to run PlayIQ:
            </p>
            <ul className="mt-4 space-y-3">
              {serviceProviders.map((provider) => (
                <li key={provider.name} className="border-l-2 border-[#7b4fce]/50 pl-3">
                  <p className="text-white font-semibold">{provider.name}</p>
                  <p className="mt-0.5">{provider.purpose}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              We may also disclose information when required by law or to protect the rights, property, or safety of
              PlayIQ, our users, or others.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className={h2Class}>6. Cookies and Browser Storage</h2>
            <p>PlayIQ uses the following cookies and browser storage:</p>
            <ul className="mt-4 space-y-3">
              {browserStorage.map((item) => (
                <li key={item.name} className="border-l-2 border-[#00c8ff]/40 pl-3">
                  <p className="text-white font-semibold">{item.name}</p>
                  <p className="mt-0.5">{item.purpose}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              You can clear cookies and browser storage in your browser settings. Blocking login cookies will prevent
              you from signing in.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className={h2Class}>7. Your Rights and Choices</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="space-y-2 list-disc list-inside mt-3">
              <li>Access or request a copy of your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Lodge a complaint with your local data protection authority</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:support@weplayiq.com" className={linkClass}>
                support@weplayiq.com
              </a>
              .
            </p>
          </div>

          <div className={cardClass}>
            <h2 className={h2Class}>8. Children&apos;s Privacy</h2>
            <p>PlayIQ is designed for young learners and takes children&apos;s privacy seriously.</p>

            <h3 className={h3Class}>Parent-Created Accounts</h3>
            <p>
              Child profiles are created by a parent or guardian through their own PlayIQ account. If we learn that we
              have collected personal information from a child under 13 without a parent&apos;s involvement, we will
              delete it.
            </p>

            <h3 className={h3Class}>Parental Rights</h3>
            <p>Parents have the ongoing right to:</p>
            <ul className="space-y-1 list-disc list-inside mt-2">
              <li>Review the personal information collected from their child</li>
              <li>Ask us to correct or delete their child&apos;s information</li>
              <li>Refuse further collection or use of their child&apos;s information</li>
            </ul>
            <p className="mt-3">
              To make a request, email{' '}
              <a href="mailto:support@weplayiq.com" className={linkClass}>
                support@weplayiq.com
              </a>{' '}
              from the email address on the parent account. We will verify the request before acting on it.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className={h2Class}>9. Data Retention and Deletion</h2>
            <p>
              We keep account information for as long as the account is active, or until a parent or account holder
              asks us to delete it.
            </p>
            <p className="mt-3">
              When we receive a verified deletion request, we delete the account&apos;s profile, learning records, and
              uploaded files, and let you know when it is done. Some information may remain for a limited time in
              our service providers&apos; routine backups before it is overwritten, and we may keep records we are
              legally required to retain, such as payment records.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className={h2Class}>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting
              the new policy on this page and updating the &quot;Last updated&quot; date. Continued use of PlayIQ after changes
              constitutes acceptance of the revised policy.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className={h2Class}>11. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
            <div className="mt-4 space-y-1 text-sm">
              <p className="text-white font-semibold">PlayIQ Learning</p>
              <p>
                Email:{' '}
                <a href="mailto:support@weplayiq.com" className="text-[#00c8ff] hover:underline">
                  support@weplayiq.com
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
