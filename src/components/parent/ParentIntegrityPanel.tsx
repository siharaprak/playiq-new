'use client';

import React from 'react';
import { Shield, ShieldCheck, MessageSquare } from 'lucide-react';

interface ParentIntegrityPanelProps {
  openTicketCount: number;
}

export default function ParentIntegrityPanel({
  openTicketCount,
}: ParentIntegrityPanelProps) {
  return (
    <div className="glass-card !rounded-none border border-slate-800 p-6 space-y-8">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Shield className="w-5 h-5 text-[#7b4fce]" />
        <h2 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-wider">
          Integrity &amp; Support
        </h2>
      </div>

      {/* ── Section 1: How We Protect Academic Integrity ──────── */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-sm text-[#00c8ff] uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          How We Protect Academic Integrity
        </h3>
        <div className="bg-black/40 border border-slate-800 p-4 space-y-3 font-mono text-xs text-slate-300 leading-relaxed">
          <p>
            <span className="text-[#00c8ff] font-bold">&gt;</span>{' '}
            PlayIQ uses <span className="text-[#39ff14] font-bold">AI-powered fingerprinting</span> to
            understand each learner&apos;s unique patterns — how they explain concepts,
            approach problems, and interact with learning materials.
          </p>
          <p>
            <span className="text-[#00c8ff] font-bold">&gt;</span>{' '}
            The system detects when answers don&apos;t match a student&apos;s established
            learning style, flagging inconsistencies for review rather than relying
            on surface-level plagiarism checks.
          </p>
          <p>
            <span className="text-[#7b4fce] font-bold">&gt;</span>{' '}
            This is used to <span className="text-[#f5c518] font-bold">guide learning</span>, not
            punish. The goal is to ensure authentic growth and mastery at every stage
            of the curriculum.
          </p>
        </div>
      </div>

      {/* ── Section 2: AI Fingerprinting ─────────────────────── */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-sm text-[#7b4fce] uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-4 h-4" />
          AI Fingerprinting
        </h3>
        <div className="bg-black/40 border border-slate-800 p-4 space-y-4">
          <p className="font-mono text-xs text-slate-400 leading-relaxed">
            Fingerprint signals are continuously updated as your apprentice progresses
            through the curriculum. These signals are used to personalize the{' '}
            <span className="text-[#00c8ff] font-bold">AI Tutor</span> and{' '}
            <span className="text-[#7b4fce] font-bold">Assistant builds</span>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                label: 'Explanation Preferences',
                desc: 'How they prefer concepts explained — visual, analogy-based, technical, step-by-step',
                color: '#00c8ff',
              },
              {
                label: 'Learning Mode Preferences',
                desc: 'Preferred study modes — compression, pre-learn, rescue, self-testing',
                color: '#7b4fce',
              },
              {
                label: 'Shortcut Tendencies',
                desc: 'Patterns indicating reliance on shortcuts vs. deep engagement with material',
                color: '#f5c518',
              },
              {
                label: 'Integrity Snapshots',
                desc: 'Periodic captures of writing style, reasoning depth, and consistency over time',
                color: '#39ff14',
              },
            ].map((signal) => (
              <div
                key={signal.label}
                className="border border-slate-800 bg-black/30 p-3"
              >
                <p
                  className="font-display font-bold text-[10px] uppercase tracking-widest mb-1"
                  style={{ color: signal.color }}
                >
                  {signal.label}
                </p>
                <p className="font-mono text-[10px] text-slate-500 leading-relaxed">
                  {signal.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 3: Support & Reporting ────────────────────── */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-sm text-[#39ff14] uppercase tracking-widest flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Support &amp; Reporting
        </h3>

        {openTicketCount > 0 && (
          <div className="flex items-center gap-3 bg-[#f5c518]/10 border border-[#f5c518]/30 p-3">
            <MessageSquare className="w-4 h-4 text-[#f5c518] flex-shrink-0" />
            <p className="font-mono text-xs text-[#f5c518] font-bold uppercase tracking-wider">
              {openTicketCount} open support ticket{openTicketCount !== 1 ? 's' : ''} from
              your apprentice
            </p>
          </div>
        )}

        <div className="bg-black/40 border border-slate-800 p-4 space-y-3 font-mono text-xs text-slate-300 leading-relaxed">
          <p>
            <span className="text-[#39ff14] font-bold">&gt;</span>{' '}
            Students can submit support tickets directly within the platform when
            they encounter issues, have questions, or need to report concerns.
          </p>
          <p>
            <span className="text-[#39ff14] font-bold">&gt;</span>{' '}
            Parents can view the status of all tickets submitted by their linked
            apprentice. Ticket history is retained for transparency.
          </p>
          <p>
            <span className="text-[#7b4fce] font-bold">&gt;</span>{' '}
            The <span className="text-[#00c8ff] font-bold">PlayIQ team</span> reviews
            all submitted tickets and responds within the platform. Critical issues
            are escalated for priority handling.
          </p>
        </div>
      </div>

    </div>
  );
}
