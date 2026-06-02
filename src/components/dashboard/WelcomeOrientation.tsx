'use client';

import React, { useState } from 'react';
import { Play, Sparkles, BookOpen, Layers, X } from 'lucide-react';

interface WelcomeOrientationProps {
  studentName: string;
}

/**
 * WelcomeOrientation — High-fidelity onboarding manual for first-time students.
 */
export default function WelcomeOrientation({ studentName }: WelcomeOrientationProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="relative overflow-hidden p-8 rounded-2xl border border-[#00c8ff]/30 bg-slate-950/80 shadow-[0_0_25px_rgba(0,200,255,0.1)] mb-8 font-mono">
      {/* Cybersecurity pattern elements */}
      <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-[#00c8ff]/10 to-transparent pointer-events-none rounded-bl-full" />
      
      {/* Dismiss button */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute right-4 top-4 text-slate-500 hover:text-slate-300 p-1.5 transition-colors"
        aria-label="Dismiss orientation"
      >
        <X size={16} />
      </button>

      {/* Ranks and protocol details */}
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-[#00c8ff]/20 text-[#00c8ff] text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-[#00c8ff]/30">
          Protocol: Apprenticeship Setup
        </span>
        <span className="w-1.5 h-1.5 bg-[#00c8ff] rounded-full animate-ping" />
      </div>

      <h2 className="text-xl md:text-2xl font-black text-slate-100 uppercase tracking-wider mb-3">
        Welcome to PlayIQ, Apprentice <span className="text-[#00c8ff]">{studentName}</span>.
      </h2>

      <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mb-6">
        You are now connected to the learning interface. Your goal is to master advanced AI usage, learn to safely leverage custom tools, and ascend to the highest path.
      </p>

      {/* Grid of details */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-slate-800/80 bg-black/40 space-y-2">
          <div className="flex items-center gap-2 text-[#7b4fce]">
            <BookOpen size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">1. Skill Tree</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Progress sequentially through the 11 key training modules. Learn concepts through interactive lessons.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800/80 bg-black/40 space-y-2">
          <div className="flex items-center gap-2 text-[#00c8ff]">
            <Layers size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">2. AI Builders</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            In Module 9, build a personalized AI Tutor. In Module 10, engineer a dedicated AI Assistant.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800/80 bg-black/40 space-y-2">
          <div className="flex items-center gap-2 text-green-400">
            <Sparkles size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">3. Master Capstone</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Demonstrate your capabilities in the final Capstone trial to earn verification status.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-900">
        <div className="text-[10px] text-slate-600 uppercase">
          Recommendation: Select &apos;START MODULE 1&apos; below to begin.
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="btn-neon-cyan inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-all"
        >
          <Play size={12} />
          Initialize First Mission
        </button>
      </div>
    </div>
  );
}
