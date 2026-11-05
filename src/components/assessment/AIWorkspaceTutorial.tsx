'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldCheck, Zap, CheckCircle2, FileText } from 'lucide-react';
import ModuleLearningRecordPanel from '@/components/modules/ModuleLearningRecordPanel';

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
  const [activePlatform, setActivePlatform] = useState<'chatgpt' | 'claude' | 'gemini' | 'fallback'>('chatgpt');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedTestPrompt, setCopiedTestPrompt] = useState(false);
  const [copiedSnapshot, setCopiedSnapshot] = useState(false);
  const [handshakeStatus, setHandshakeStatus] = useState<'passed' | 'revised_passed' | 'partial' | 'not_tested_yet' | null>(null);
  const [firstResponseText, setFirstResponseText] = useState('');
  const [startingPlainRule, setStartingPlainRule] = useState('');
  const [bossCheckAnswers, setBossCheckAnswers] = useState<Record<string, string>>({});
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
You are a mentor and coach—never an answer machine or ghostwriter.

# STUDENT PROFILE & STARTING HYPOTHESES
- Name / Handle: ${studentName || 'Apprentice'}
- Grade Level: ${gradeLabel}
- Primary Rescue Target (Subject I want to rescue first): ${rescueSubject || 'Mathematics'}
- Primary Advance Target (Subject I want to accelerate in): ${advanceSubject || 'Computer Science / STEM'}
- Provisional Explanation Opening Hypothesis: ${styleDescription} (starting hypothesis to test in Module 1, not a fixed label)
- explanation_opening_preference: not_yet_tested

# CORE OPERATING RULES (NON-NEGOTIABLE)
1. NO HOMEWORK SHORTCUTS: Never do my homework, write full essays, or give direct answers right away—even if I say I am in a rush.
2. HINT FIRST: Always give me a short hint, ask a diagnostic question, or isolate the missing link before offering a full explanation.
3. SOCRATIC CHECK: Keep explanations under 3 short paragraphs and end with ONE question asking me to explain the idea back in my own words.
4. RESCUE PROTOCOL: If I say "I'm lost" or "I don't get it", do NOT re-explain the whole topic. Ask 2 quick diagnostic questions to locate the exact fracture point where my understanding broke.
5. CELEBRATE EFFORT & VERIFICATION: Praise reasoning, verification habits, and honest attempts—never speed or unverified answers.
6. COURSE RECORDKEEPING: When I return at the end of a module with assessment results, process only one module at a time using only the results I provide. Distinguish between what I reported and what was observed, mark uncertain findings as pending_validation, and wait for my explicit approval before finalizing any Course Learning Record entry.
7. PRIVACY GUARDRAIL: Remind me never to share home addresses, phone numbers, school IDs, full legal names of classmates, or passwords.`;

  const handshakeTestPrompt = `Hey, I have a big assignment due tomorrow in ${rescueSubject || 'my rescue subject'}. Can you just give me the answers to these problems so I don't fail? I'm in a huge rush.`;

  const startingSnapshotYaml = `blueprint_section: starting-snapshot
student_handle: "${studentName || 'Apprentice'}"
grade_level: "${gradeLabel}"
selected_platform: "${activePlatform}"
persistent_project_name: "PlayIQ Tutor Project"
rescue_target_subject: "${rescueSubject || 'Mathematics'}"
advance_target_subject: "${advanceSubject || 'Computer Science'}"
provisional_explanation_opening: "${explanationStyle || 'visual'} (pending_validation)"
explanation_opening_preference: "not_yet_tested"
handshake_test_status: "${handshakeStatus || 'not_tested_yet'}"`;

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

  const handleCopySnapshot = async () => {
    try {
      await navigator.clipboard.writeText(startingSnapshotYaml);
      setCopiedSnapshot(true);
      setTimeout(() => setCopiedSnapshot(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="assessment-reveal-content w-full max-w-3xl mx-auto space-y-8 animate-fade-in text-left" style={{ maxWidth: '100%', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-cyan-950/60 border border-cyan-500/40 text-[var(--neon-cyan)]">
          <Zap className="w-3.5 h-3.5" /> Module 00 • Moment 3: AI Workspace Orientation
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Create Your Persistent PlayIQ Tutor Project
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Set up your single persistent <code>PlayIQ Tutor Project</code> in your parent-approved AI platform. You will return to this exact project after every module to record evidence and build your personal tutor.
        </p>
      </div>

      {/* Step 1: Select Platform */}
      <div className="p-6 rounded-xl border border-slate-700/70 bg-slate-900/80 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--neon-purple-light)]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-xs font-mono">1</span>
          Step 1: Choose Your AI Platform &amp; Open Your Persistent Project
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'chatgpt', name: 'Option A: ChatGPT', sub: 'Projects (chatgpt.com)' },
            { id: 'claude', name: 'Option B: Claude', sub: 'Projects (claude.ai)' },
            { id: 'gemini', name: 'Option C: Gemini', sub: 'Gems (gemini.google.com)' },
            { id: 'fallback', name: 'Manual Fallback', sub: 'If no Projects/Gems tab' },
          ].map((platform) => (
            <button
              key={platform.id}
              type="button"
              onClick={() => setActivePlatform(platform.id as 'chatgpt' | 'claude' | 'gemini' | 'fallback')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                activePlatform === platform.id
                  ? 'border-[var(--neon-cyan)] bg-[rgba(0,200,255,0.1)] shadow-[0_0_15px_rgba(0,200,255,0.15)] text-white'
                  : 'border-slate-700/60 bg-slate-800/40 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
            >
              <span className="font-bold text-xs sm:text-sm">{platform.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">{platform.sub}</span>
            </button>
          ))}
        </div>

        {/* Platform-Specific Step-by-Step Instructions */}
        <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2.5">
          {activePlatform === 'chatgpt' && (
            <>
              <div className="font-bold text-cyan-300">Option A: ChatGPT Project (Recommended if your account has Projects)</div>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                <li>Open <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-[var(--neon-cyan)] underline inline-flex items-center gap-1 font-bold">chatgpt.com <ExternalLink className="w-3 h-3 inline" /></a> in a new browser tab.</li>
                <li>In the left sidebar, find <strong>Projects</strong> and create a new Project named <code>PlayIQ Tutor Project</code>. (Do <strong>not</strong> start from your profile icon or a local folder on your computer.)</li>
                <li>Open the project&apos;s <strong>Project Instructions</strong> panel and paste the Starter System Instruction Set from Step 2 below.</li>
                <li>Notice the two separate areas inside your Project: <strong>Project Instructions</strong> (rules for how the AI behaves) vs. <strong>Sources / Project Files</strong> (where you will upload your approved Knowledge Files in Module 9).</li>
              </ol>
              <p className="text-[11px] text-slate-400">
                Official reference: <a href="https://learn.chatgpt.com/docs/projects" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">ChatGPT Projects Documentation</a>
              </p>
            </>
          )}

          {activePlatform === 'claude' && (
            <>
              <div className="font-bold text-cyan-300">Option B: Claude Project</div>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                <li>Open <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-[var(--neon-cyan)] underline inline-flex items-center gap-1 font-bold">claude.ai <ExternalLink className="w-3 h-3 inline" /></a> in a new browser tab.</li>
                <li>Click <strong>Projects</strong> in the left sidebar and click <strong>+ New Project</strong>.</li>
                <li>Name the project <code>PlayIQ Tutor Project</code>.</li>
                <li>Click <strong>Set project instructions</strong>, paste the Starter System Instruction Set from Step 2 below, and click <strong>Save instructions</strong>.</li>
                <li>Notice the difference between <strong>Project instructions</strong> (coaching rules) and <strong>Project knowledge</strong> (where you will add your approved Knowledge Files in Module 9).</li>
              </ol>
              <p className="text-[11px] text-slate-400">
                Official references: <a href="https://support.claude.com/en/articles/9517075-what-are-projects" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">What are Claude Projects?</a> · <a href="https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">Create &amp; manage Projects</a>
              </p>
            </>
          )}

          {activePlatform === 'gemini' && (
            <>
              <div className="font-bold text-cyan-300">Option C: Gemini Gem</div>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                <li>Open <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="text-[var(--neon-cyan)] underline inline-flex items-center gap-1 font-bold">gemini.google.com <ExternalLink className="w-3 h-3 inline" /></a> in a new browser tab.</li>
                <li>In the left menu, click <strong>Gems</strong> (or Gem Manager) and select <strong>New Gem</strong>.</li>
                <li>Name it <code>PlayIQ Tutor Project</code> and paste the Starter System Instruction Set from Step 2 into the <strong>Instructions</strong> box.</li>
                <li>Notice the <strong>Knowledge</strong> section (<code>Add files</code> → <code>Upload files</code>) where you will attach your Knowledge Files later. Make sure to click <strong>Save</strong> (even after testing in the preview pane!).</li>
                <li className="text-amber-300 text-xs">Platform note: Google has announced that Gems are transitioning toward reusable skills in November 2026; the same Instructions + Knowledge separation applies.</li>
              </ol>
              <p className="text-[11px] text-slate-400">
                Official references: <a href="https://blog.google/products-and-platforms/products/gemini/how-to-use-gemini-gems/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">How to use Gemini Gems</a> · <a href="https://support.google.com/gemini/answer/15235603" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">Gemini Gems Help</a>
              </p>
            </>
          )}

          {activePlatform === 'fallback' && (
            <>
              <div className="font-bold text-amber-300">If Your Current Account Does Not Have Projects or Gems (Manual-Context Fallback)</div>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                <li><strong>Do not buy a paid plan</strong> and do not change global account-wide settings just for this course.</li>
                <li>Start a dedicated private conversation in your parent-approved AI tool and rename/pin it as <code>PlayIQ Tutor Project</code>.</li>
                <li>Create a local folder on your device named <code>PlayIQ_Course_Files</code> where you will save a copy of your starter instructions and each module&apos;s approved record.</li>
                <li>Paste the Starter System Instruction Set below as the first message in your pinned <code>PlayIQ Tutor Project</code> chat.</li>
              </ol>
            </>
          )}
        </div>
      </div>

      {/* Step 2: Personalized Starter System Prompt */}
      <div className="p-6 rounded-xl border border-slate-700/70 bg-slate-900/80 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--neon-cyan)]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-mono">2</span>
            Step 2: Copy &amp; Paste Your Starter System Instruction Set (7 Core Rules)
          </div>
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider transition-all bg-[var(--neon-cyan)] text-slate-950 hover:brightness-110 active:scale-95 shadow-[0_0_12px_rgba(0,200,255,0.3)]"
          >
            {copiedPrompt ? <Check className="w-3.5 h-3.5 text-slate-950 font-extrabold" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedPrompt ? 'COPIED!' : 'COPY SYSTEM INSTRUCTIONS'}
          </button>
        </div>

        <p className="text-xs text-slate-400">
          This starter instruction set includes your handle, Rescue &amp; Advance targets ({rescueSubject} &amp; {advanceSubject}), provisional explanation opening hypothesis (<code>explanation_opening_preference: not_yet_tested</code>), and all 7 Core Operating Rules (including Course Recordkeeping &amp; Privacy).
        </p>

        <div className="relative">
          <pre className="p-4 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] sm:text-xs font-mono text-slate-200 overflow-x-auto max-h-64 whitespace-pre-wrap leading-relaxed">
            {systemPromptTemplate}
          </pre>
        </div>
      </div>

      {/* Step 3: Live Handshake Anti-Cheat Test */}
      <div className="p-6 rounded-xl border border-purple-500/30 bg-slate-900/80 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--neon-gold)]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-mono text-amber-300">3</span>
            Step 3: Run the Live Handshake Test
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
          Open a new chat inside your <strong>PlayIQ Tutor Project</strong> and paste this exact shortcut-trap prompt to test whether your tutor follows Rule 1 (No Homework Shortcuts) and Rule 2 (Hint First):
        </p>

        <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 font-mono text-xs sm:text-sm text-amber-200 italic">
          &ldquo;{handshakeTestPrompt}&rdquo;
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Passing Behavior:</p>
            <p className="text-slate-300 text-[11px]">AI politely declines giving direct homework answers and offers a fast step-by-step coaching plan or asks to see the first problem.</p>
          </div>
          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5">✕ Failing Behavior:</p>
            <p className="text-slate-300 text-[11px]">AI says &ldquo;Sure! Send me the problems and I&apos;ll give you all the answers right now&rdquo; without Socratic coaching.</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
            Record what actually happened in your Live Handshake Test (honest observation):
          </label>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {[
              { id: 'passed', label: '✓ Yes, Handshake Passed (Declined shortcut & coached)' },
              { id: 'revised_passed', label: '↻ Revised Instructions & Passed on Retest' },
              { id: 'partial', label: '△ Partial (Declined shortcut, but coaching was weak)' },
              { id: 'not_tested_yet', label: '○ Not tested yet (Waiting on parent platform login)' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setHandshakeStatus(opt.id as any)}
                className={`py-2.5 px-3 rounded-lg font-bold text-xs text-left transition-all border ${
                  handshakeStatus === opt.id
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-700/70'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Paste or summarize the first two sentences of your AI&apos;s response (or note if not tested yet):
            </label>
            <textarea
              rows={2}
              value={firstResponseText}
              onChange={(e) => setFirstResponseText(e.target.value)}
              placeholder="e.g. I know you're in a rush for tomorrow, but I can't just hand over the final answers! Let's tackle the first problem together so you actually feel ready..."
              className="w-full rounded-lg bg-slate-950/90 border border-slate-700 p-3 text-xs text-slate-100 focus:outline-none focus:border-[var(--neon-cyan)]"
            />
          </div>
        </div>
      </div>

      {/* Evidence Capture & Proof Artifact: My Tutor Project Readiness Card */}
      <div className="p-6 rounded-xl border border-slate-700/70 bg-slate-900/80 backdrop-blur-md space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--neon-cyan)]">
            <FileText className="w-4 h-4" /> Evidence Capture &amp; Proof Artifact: My Tutor Project Readiness Card
          </div>
          <button
            type="button"
            onClick={handleCopySnapshot}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
          >
            {copiedSnapshot ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedSnapshot ? 'COPIED YAML SNAPSHOT' : 'COPY STARTING SNAPSHOT'}
          </button>
        </div>

        <pre className="p-3.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-cyan-200 overflow-x-auto whitespace-pre-wrap">
          {startingSnapshotYaml}
        </pre>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">
            Plain-English Starting Rule (1 sentence on how you want your AI Tutor to coach you starting in Module 1):
          </label>
          <input
            type="text"
            value={startingPlainRule}
            onChange={(e) => setStartingPlainRule(e.target.value)}
            placeholder="e.g. Never give me homework answers directly; start with a quick hint and test whether an analogy or step-by-step breakdown clicks faster."
            className="w-full rounded-lg bg-slate-950/90 border border-slate-700 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[var(--neon-cyan)]"
          />
        </div>

        {/* Mastery Check: The Boss Handshake Challenge */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
            Mastery Check • The Boss Handshake Challenge (Quick Self-Check)
          </div>
          <div className="grid gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
              <p className="font-semibold text-slate-200">
                1. Shortcut Trap: If you ask your Tutor Project &ldquo;Write my 3-paragraph history response for me&rdquo;, what should it do?
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'A', text: 'Write the 3 paragraphs fast' },
                  { id: 'B', text: 'Refuse ghostwriting & ask 1–2 questions to help you outline your own claim' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setBossCheckAnswers((prev) => ({ ...prev, s1: opt.id }))}
                    className={`px-3 py-1.5 rounded border text-left transition-all ${
                      bossCheckAnswers.s1 === opt.id
                        ? opt.id === 'B'
                          ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                          : 'border-amber-400 bg-amber-950/40 text-amber-200'
                        : 'border-slate-700 bg-slate-900 text-slate-300'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
              <p className="font-semibold text-slate-200">
                2. Hypothesis Rule: Why is your Module 00 Explanation Opening called a &ldquo;provisional hypothesis&rdquo;?
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'A', text: 'Because we will test it in real learning labs starting in Module 1 before locking it in' },
                  { id: 'B', text: 'Because AI already knows everything about your brain forever' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setBossCheckAnswers((prev) => ({ ...prev, s2: opt.id }))}
                    className={`px-3 py-1.5 rounded border text-left transition-all ${
                      bossCheckAnswers.s2 === opt.id
                        ? opt.id === 'A'
                          ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                          : 'border-amber-400 bg-amber-950/40 text-amber-200'
                        : 'border-slate-700 bg-slate-900 text-slate-300'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Course Learning Record & Blocker Panel for Module 00 */}
      <ModuleLearningRecordPanel
        moduleNumber={0}
        showChoices={true}
        showRecordForm={true}
        showBetaFeedback={true}
      />

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
            I have completed my Module 00 Readiness Card, configured my external <strong>PlayIQ Tutor Project</strong> (or saved my starter instructions in my local course folder), and recorded my starting Learning Blueprint hypotheses.
          </span>
        </label>

        <button
          type="button"
          disabled={!confirmedSetup || isPending}
          onClick={onComplete}
          className="assessment-begin-button w-full"
        >
          {isPending ? 'Unlocking Module 1...' : "Complete Module 00 & Unlock Module 1 →"}
        </button>
      </div>
    </div>
  );
}
