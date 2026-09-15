'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Bot, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

interface AIWorkspaceTutorialProps {
  studentName: string;
  gradeLevel: string;
  rescueSubject: string;
  advanceSubject: string;
  explanationStyle: string;
  onComplete: () => void;
  isPending: boolean;
}

export default function AIWorkspaceTutorial({
  studentName,
  gradeLevel,
  rescueSubject,
  advanceSubject,
  explanationStyle,
  onComplete,
  isPending,
}: AIWorkspaceTutorialProps) {
  const [activePlatform, setActivePlatform] = useState<'chatgpt' | 'claude' | 'gemini'>('chatgpt');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedTestPrompt, setCopiedTestPrompt] = useState(false);
  const [handshakePassed, setHandshakePassed] = useState<boolean | null>(null);
  const [firstResponseText, setFirstResponseText] = useState('');
  const [confirmedSetup, setConfirmedSetup] = useState(false);

  const styleLabelMap: Record<string, string> = {
    verbal: 'Concrete Real-World Analogy First with Simple Examples',
    analytical: 'Analytical, Step-by-Step Breakdown with First Principles',
    visual: 'Visual Mental Models, Diagrams, and Spatial Representations',
  };

  const styleDescription = styleLabelMap[explanationStyle] || 'Concrete Real-World Analogy First with Step-by-Step Scaffolding';
  const gradeLabel = gradeLevel === 'adult' ? 'Adult Learner' : gradeLevel === 'middle' ? 'Middle School' : gradeLevel === 'college' ? 'College' : 'High School';

  const systemPromptTemplate = `# ROLE & IDENTITY
You are "Orion", my personal PlayIQ learning coach and study sparring partner.
Your goal is to help me understand concepts deeply, think for myself, and build real mastery.
You are a mentor and coach—never an answer machine.

# STUDENT PROFILE & TARGETS
- Name / Handle: ${studentName || 'Apprentice'}
- Grade Level: ${gradeLabel}
- Primary Rescue Target (Subject I struggle with): ${rescueSubject || 'Mathematics'}
- Primary Advance Target (Subject I want to excel in): ${advanceSubject || 'Computer Science / STEM'}
- Explanation Style: ${styleDescription}

# CORE OPERATING RULES (NON-NEGOTIABLE)
1. NO HOMEWORK SHORTCUTS: Never do my homework, write full essays, or give direct answers right away.
2. HINT FIRST: Always give me a short hint, ask a diagnostic question, or isolate the missing link before offering explanations.
3. SOCRATIC CHECK: When you explain a concept, keep it under 3 short paragraphs and always end with ONE question asking me to explain the idea back in my own words.
4. RESCUE PROTOCOL: If I say "I'm lost" or "I don't get it", do NOT re-explain the whole topic. Ask me 2 quick questions to find the exact step where my understanding broke.
5. CELEBRATE EFFORT: Praise good reasoning, verification habits, and honest attempts—not speed or easy answers.`;

  const handshakeTestPrompt = `Hey, I have a big assignment due tomorrow in ${rescueSubject || 'my rescue subject'}. Can you just give me the answers to these problems so I don't fail? I'm in a huge rush.`;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(systemPromptTemplate);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyTestPrompt = async () => {
    try {
      await navigator.clipboard.writeText(handshakeTestPrompt);
      setCopiedTestPrompt(true);
      setTimeout(() => setCopiedTestPrompt(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="assessment-reveal-content w-full max-w-3xl space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-cyan-950/60 border border-cyan-500/40 text-[var(--neon-cyan)]">
          <Zap className="w-3.5 h-3.5" /> Phase 5 • AI Workshop Orientation
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Build Your AI Study Workshop
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Program your external AI with your personalized PlayIQ System DNA so it acts as your personal coach from Day 1.
        </p>
      </div>

      {/* Step 1: Select Platform */}
      <div className="p-6 rounded-xl border border-slate-700/70 bg-slate-900/80 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--neon-purple-light)]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-xs font-mono">1</span>
          Select Your AI Platform
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com', sub: 'Custom Instructions' },
            { id: 'claude', name: 'Claude', url: 'https://claude.ai', sub: 'Projects' },
            { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com', sub: 'Gems' },
          ].map((platform) => (
            <button
              key={platform.id}
              type="button"
              onClick={() => setActivePlatform(platform.id as 'chatgpt' | 'claude' | 'gemini')}
              className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                activePlatform === platform.id
                  ? 'border-[var(--neon-cyan)] bg-[rgba(0,200,255,0.1)] shadow-[0_0_15px_rgba(0,200,255,0.15)] text-white'
                  : 'border-slate-700/60 bg-slate-800/40 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
            >
              <span className="font-bold text-sm sm:text-base">{platform.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">{platform.sub}</span>
            </button>
          ))}
        </div>

        {/* Platform-Specific Step-by-Step Instructions */}
        <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2">
          {activePlatform === 'chatgpt' && (
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
              <li>Open <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-[var(--neon-cyan)] underline inline-flex items-center gap-1 font-bold">chatgpt.com <ExternalLink className="w-3 h-3 inline" /></a> in a new tab.</li>
              <li>Click your <strong>Profile Name / Icon</strong> in the bottom-left corner and choose <strong>Customize ChatGPT</strong>.</li>
              <li>Paste your personalized instructions from Step 2 below and click <strong>Save</strong>.</li>
            </ol>
          )}

          {activePlatform === 'claude' && (
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
              <li>Open <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-[var(--neon-cyan)] underline inline-flex items-center gap-1 font-bold">claude.ai <ExternalLink className="w-3 h-3 inline" /></a> in a new tab.</li>
              <li>Click <strong>Projects</strong> on the left sidebar and select <strong>+ Create Project</strong>.</li>
              <li>Name it <code>PlayIQ AI Study Lab</code> and click <strong>Set Project Instructions</strong>.</li>
              <li>Paste your instructions from Step 2 below and click <strong>Save</strong>.</li>
            </ol>
          )}

          {activePlatform === 'gemini' && (
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
              <li>Open <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="text-[var(--neon-cyan)] underline inline-flex items-center gap-1 font-bold">gemini.google.com <ExternalLink className="w-3 h-3 inline" /></a> in a new tab.</li>
              <li>Click <strong>Gems</strong> on the left menu (or Gem Manager) and click <strong>+ New Gem</strong>.</li>
              <li>Name it <code>PlayIQ AI Study Lab</code> and paste the instructions below into the <strong>Instructions</strong> box.</li>
              <li>Click <strong>Save</strong> or <strong>Create Gem</strong>.</li>
            </ol>
          )}
        </div>
      </div>

      {/* Step 2: Personalized Starter System Prompt */}
      <div className="p-6 rounded-xl border border-slate-700/70 bg-slate-900/80 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--neon-cyan)]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-mono">2</span>
            Your Calibrated System Prompt
          </div>
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider transition-all bg-[var(--neon-cyan)] text-slate-950 hover:brightness-110 active:scale-95 shadow-[0_0_12px_rgba(0,200,255,0.3)]"
          >
            {copiedPrompt ? <Check className="w-3.5 h-3.5 text-slate-950 font-extrabold" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedPrompt ? 'COPIED!' : 'COPY SYSTEM PROMPT'}
          </button>
        </div>

        <p className="text-xs text-slate-400">
          This prompt is customized with your name, targets ({rescueSubject} &amp; {advanceSubject}), and explanation style.
        </p>

        <div className="relative">
          <pre className="p-4 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] sm:text-xs font-mono text-slate-200 overflow-x-auto max-h-60 whitespace-pre-wrap leading-relaxed">
            {systemPromptTemplate}
          </pre>
        </div>
      </div>

      {/* Step 3: Live Handshake Anti-Cheat Test */}
      <div className="p-6 rounded-xl border border-purple-500/30 bg-slate-900/80 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--neon-gold)]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-mono text-amber-300">3</span>
            The Live Handshake Test
          </div>
          <button
            type="button"
            onClick={handleCopyTestPrompt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider transition-all border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
          >
            {copiedTestPrompt ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedTestPrompt ? 'COPIED TEST PROMPT' : 'COPY TEST PROMPT'}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Open a new chat in your configured AI workshop and paste this test prompt to verify your tutor will coach you instead of doing your homework:
        </p>

        <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 font-mono text-xs sm:text-sm text-amber-200 italic">
          &ldquo;{handshakeTestPrompt}&rdquo;
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Passing Behavior:</p>
            <p className="text-slate-300 text-[11px]">AI politely declines direct answers and offers a fast step-by-step coaching plan or asks for the first problem.</p>
          </div>
          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5">✕ Failing Behavior:</p>
            <p className="text-slate-300 text-[11px]">AI says &ldquo;Sure! Here are the answers...&rdquo; and solves the problems for you without Socratic coaching.</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
            Did your AI decline the shortcut and offer to coach you?
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setHandshakePassed(true)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs transition-all ${
                handshakePassed === true
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ✓ Yes, Handshake Passed
            </button>
            <button
              type="button"
              onClick={() => setHandshakePassed(false)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs transition-all ${
                handshakePassed === false
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Revised Instructions &amp; Passed
            </button>
          </div>
        </div>
      </div>

      {/* Step 4: Verification Checkbox & Unlock */}
      <div className="p-6 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 space-y-5">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={confirmedSetup}
            onChange={(e) => setConfirmedSetup(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-700 text-[var(--neon-cyan)] focus:ring-[var(--neon-cyan)]"
          />
          <span className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            I have configured my external AI workspace (<strong>{activePlatform.toUpperCase()}</strong>) with my PlayIQ System Instructions and verified the calibration handshake test.
          </span>
        </label>

        <button
          type="button"
          disabled={!confirmedSetup || isPending}
          onClick={onComplete}
          className="assessment-begin-button w-full"
        >
          {isPending ? 'Unlocking Module 1...' : 'Complete Assessment & Unlock Module 1 →'}
        </button>
      </div>
    </div>
  );
}
