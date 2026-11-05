'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LearningBlueprint from '@/components/assessment/LearningBlueprint';
import AIWorkspaceTutorial from '@/components/assessment/AIWorkspaceTutorial';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import type { LearningBlueprintData } from '@/lib/assessment/assessment-reveal';

interface Module0CompletedViewProps {
  studentName: string;
  gradeLevel: string;
  rescueSubject: string;
  advanceSubject: string;
  explanationStyle: string;
  blueprint: LearningBlueprintData | null;
}

export default function Module0CompletedView({
  studentName,
  gradeLevel,
  rescueSubject,
  advanceSubject,
  explanationStyle,
  blueprint,
}: Module0CompletedViewProps) {
  const router = useRouter();

  const handleReturnToDashboard = () => {
    router.push('/student/home');
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-4 pt-24 pb-12"
      style={{
        backgroundColor: 'var(--space-deep)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="w-full max-w-3xl mx-auto space-y-8" style={{ maxWidth: '768px', margin: '0 auto', width: '100%' }}>
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <Link
            href="/student/home"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-[var(--neon-cyan)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Module 0 Complete
            </span>
          </div>
        </div>

        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-6 h-6 text-[var(--neon-cyan)]" />
            Module 00: The Assessment &amp; AI Workspace Orientation
          </h1>
          <p className="text-sm text-slate-400">
            Here is your saved Parent &amp; Student Co-Pilot Setup reference, provisional Learning Blueprint hypotheses, personalized Starter System Instructions, and Module 00 Course Learning Record.
          </p>
        </div>

        {/* Moment 1: Parent & Student Co-Pilot Summary */}
        <div className="p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/70 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--neon-cyan)]">
            Moment 1 Reference • Parent &amp; Student Co-Pilot Ground Rules
          </div>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300">
            <li className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-white">1. Account Access Verified:</strong> Parent-approved AI workspace selected (<code className="text-cyan-300">PlayIQ Tutor Project</code>).
            </li>
            <li className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-white">2. Privacy Guardrails:</strong> Never share home addresses, phone numbers, school IDs, full legal names, or passwords.
            </li>
            <li className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-white">3. No Shortcuts Rule:</strong> AI is a thinking coach and sparring partner—never a homework ghostwriter.
            </li>
            <li className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-white">4. School Policy First:</strong> Always follow your teacher&apos;s classroom AI rules 100% of the time.
            </li>
            <li className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-white">5. Weekly 5-Min Check-In:</strong> Share one cool thing you built or learned each week with your parent/guardian.
            </li>
            <li className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-white">6. Verification Mindset:</strong> AI can sound confident and still be wrong—the human is the final fact-checker.
            </li>
          </ul>
        </div>

        {/* Blueprint Card */}
        {blueprint && (
          <div className="w-full">
            <LearningBlueprint
              blueprint={blueprint}
              studentName={studentName}
            />
          </div>
        )}

        {/* AI Workshop Tutorial Reference */}
        <div className="pt-4 border-t border-slate-800">
          <AIWorkspaceTutorial
            studentName={studentName}
            gradeLevel={gradeLevel}
            rescueSubject={rescueSubject}
            advanceSubject={advanceSubject}
            explanationStyle={explanationStyle}
            onComplete={handleReturnToDashboard}
            isPending={false}
          />
        </div>

        {/* Bottom Return Button */}
        <div className="text-center pt-6 pb-12">
          <Link
            href="/student/home"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase bg-[var(--neon-cyan)] text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(0,200,255,0.3)] transition-all"
          >
            Return to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
