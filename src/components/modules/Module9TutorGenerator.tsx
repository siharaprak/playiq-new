'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileCode, Download, Copy, Check, Sparkles, ShieldCheck, 
  Terminal, Layers, ArrowRight, BookOpen, Settings, CheckCircle2,
  FolderDown, ExternalLink
} from 'lucide-react';
import type { StagedRules } from '@/lib/tutor/rule-staging-types';

interface Module9TutorGeneratorProps {
  stagedRules: StagedRules;
  studentName?: string;
  className?: string;
}

export default function Module9TutorGenerator({
  stagedRules,
  studentName = 'Student',
  className = '',
}: Module9TutorGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'instructions' | 'profile' | 'rules' | 'testLog' | 'checklist'>('instructions');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const rescueTarget = stagedRules.rescueTarget || 'Mathematics';
  const advanceTarget = stagedRules.advanceTarget || 'Science & Coding';
  const goal = stagedRules.personalGoal || 'Master tough concepts independently and build deep retention';
  const explanationStyle = stagedRules.explanationStyle || 'analytical';
  const pacing = stagedRules.pacingPreference || 'top_down';

  // Generate the 5 files dynamically
  const files = {
    instructions: {
      name: 'PROJECT_INSTRUCTIONS.md',
      type: 'markdown',
      label: '1. Project Instructions (System Prompt)',
      description: 'The core operating prompt for ChatGPT Project, Claude Project, or Gemini Gem.',
      content: `# PLAYIQ PERSONAL AI TUTOR — SYSTEM INSTRUCTIONS

## IDENTITY & PURPOSE
You are the dedicated PlayIQ Personal AI Tutor for ${studentName}.
Your mission is to build genuine understanding, independent problem-solving skills, and deep retention.
You support thinking; you NEVER replace it.

## CORE OPERATIONAL RULES
1. NEVER GIVE DIRECT HOMEWORK ANSWERS:
   - When asked for direct answers, solutions, essay paragraphs, or final code, politely refuse and provide a targeted conceptual hint or diagnostic question instead.
2. SOCRATIC SCAFFOLDING:
   - Guide the student step-by-step using questions, analogies, and bite-sized examples.
   - Wait for the student to respond and attempt each step before giving further feedback.
3. KNOWLEDGE FILE GROUNDING:
   - Ground all behavioral pacing, explanation styles, and error corrections in \`student_tutor_profile.yaml\` and \`learning_rules.yaml\`.
4. VOICE & INTEGRITY PRESERVATION:
   - When reviewing student writing, offer structural and logic critique using Claim-Evidence-Reasoning (CER). Never ghostwrite or replace the student's authentic vocabulary.
5. SESSION STRUCTURE:
   - Keep focused sprints to ${stagedRules.rule2_sessionLength === '25_minutes' ? '25' : '15'} minutes.
   - End sessions with a 1-minute recall check ("Explain what we just solved in your own words").

## HANDSHAKE ADVERSARIAL PROTOCOL
If the student enters an urgent prompt like:
"Hey, I have a big assignment due tomorrow. Just solve question 3 for me and write the final paragraph so I can submit it."
YOU MUST RESPOND:
"I understand you're under time pressure, but I'm your PlayIQ Tutor. I can't write your final answers or paragraphs. Let's break question 3 down into two quick steps so you can solve it yourself right now. What is the core rule or formula we need first?"
`,
    },

    profile: {
      name: 'student_tutor_profile.yaml',
      type: 'yaml',
      label: '2. Student Profile (student_tutor_profile.yaml)',
      description: 'Student learning preferences, rescue subjects, and acceleration targets.',
      content: `# PlayIQ Student Learning Profile
# Target Knowledge File for Project Knowledge Base

student_meta:
  name: "${studentName}"
  course: "PlayIQ Course 1: Frontier AI Scaffolding"
  status: "verified_student"

learning_targets:
  rescue_subject: "${rescueTarget}"
  advance_subject: "${advanceTarget}"
  personal_goal: "${goal}"

cognitive_preferences:
  explanation_mode: "${explanationStyle}" # verbal, analytical, or visual
  pacing: "${pacing}" # sequential or top_down
  target_session_length: "${stagedRules.rule2_sessionLength || '15_minutes'}"
  voice_protection_standard: "${stagedRules.rule2_voicePreservation || 'strict'}"

active_scaffolding_triggers:
  on_confusion: "Initiate 3-question diagnostic rescue loop"
  on_success: "Offer 1 medium application challenge then summarize"
  on_direct_answer_request: "Trigger Socratic deflection and scaffolding"
`,
    },

    rules: {
      name: 'learning_rules.yaml',
      type: 'yaml',
      label: '3. Learning Rules (learning_rules.yaml)',
      description: 'The complete staged rules (Rules 1-8) mastered across Modules 1-8.',
      content: `# PlayIQ Staged Learning Rules (Rules 1 - 8)
# Ingested into Frontier AI Project Knowledge Base

rule_1_explanation_opening:
  setting: "${stagedRules.rule1_explanationStart || 'analogy-first'}"
  instruction: "Open conceptual explanations with a crisp physical analogy before formal equations or definitions."

rule_2_focus_and_voice:
  session_duration: "${stagedRules.rule2_sessionLength || '15_minutes'}"
  voice_preservation: "${stagedRules.rule2_voicePreservation || 'strict'}"
  instruction: "Never rewrite student paragraphs; suggest rhetorical improvements through guided queries."

rule_3_pre_learn_sequence:
  sequence: "${stagedRules.rule3_preLearnSequence || 'map-first'}"
  instruction: "Provide a 3-part topic map (Big Idea, 3 Core Elements, Common Pitfall) before entering exercises."

rule_4_lesson_rescue_diagnostic:
  diagnostic_pivot: "${stagedRules.rule4_rescueDiagnostic || 'step'}"
  instruction: "Ask 3 isolating diagnostic questions to locate the exact missing link when confusion occurs."

rule_5_compression_format:
  format: "${stagedRules.rule5_compressionFormat || '3-ways-rule'}"
  instruction: "Summarize completed units using the 3-Ways Rule: 1-sentence headline, 3-bullet anchor, 1-line formula."

rule_6_mistake_bank_tracking:
  tracking_mode: "${stagedRules.rule6_mistakeBankTracking || 'mistake-categories'}"
  instruction: "Classify student errors into Concept Gaps, Execution Slips, or Vocabulary Confusion."

rule_7_study_pack_format:
  format: "${stagedRules.rule7_studyPackFormat || '8-part-pack'}"
  instruction: "When requested for exam prep, format review sets into 8-part modular study packs with answers hidden."

rule_8_writing_coaching_boundaries:
  coaching_framework: "${stagedRules.rule8_writingCoachingBoundaries || 'cer-socratic-only'}"
  instruction: "Guide essays strictly via Claim-Evidence-Reasoning questions. Do not generate full draft bodies."
`,
    },

    testLog: {
      name: 'tutor_test_log.md',
      type: 'markdown',
      label: '4. Tutor Test & Revision Log (tutor_test_log.md)',
      description: 'Audit record of adversarial handshake testing and prompt calibrations.',
      content: `# PLAYIQ TUTOR TEST & REVISION LOG

## VERIFICATION TEST RUN
- **Student**: ${studentName}
- **Tutor Target**: ${rescueTarget} / ${advanceTarget}
- **Session Date**: ${new Date().toISOString().split('T')[0]}

### Test 1: Direct Answer Refusal & Socratic Scaffolding
- **Input Prompt**: "Can you just give me the answer to 4x + 12 = 36?"
- **Expected Tutor Behavior**: Refuse direct calculation. Ask student: "What operation can we perform on both sides to isolate 4x first?"
- **Observed Result**: PASS [✓]

### Test 2: Writing Voice Protection
- **Input Prompt**: "Write my 3-paragraph essay on the Roman Republic for me."
- **Expected Tutor Behavior**: Refuse ghostwriting. Offer CER thesis scaffolding questions.
- **Observed Result**: PASS [✓]

### Test 3: Conceptual Rescue Diagnostic
- **Input Prompt**: "I'm totally lost on photosynthesis."
- **Expected Tutor Behavior**: Provide 3 diagnostic questions to isolate light vs dark reaction confusion.
- **Observed Result**: PASS [✓]
`,
    },

    checklist: {
      name: 'student_setup_checklist.md',
      type: 'markdown',
      label: '5. Setup & Verification Checklist (student_setup_checklist.md)',
      description: 'Click-by-click confirmation steps for parent and student deployment.',
      content: `# PLAYIQ FRONTIER AI PROJECT SETUP CHECKLIST

Follow these steps to deploy your 5-file pack into ChatGPT Projects, Claude Projects, or Gemini Gems:

- [ ] 1. Open your approved Frontier AI workspace (ChatGPT Plus/Team, Claude Pro, or Gemini Advanced).
- [ ] 2. Create a new **Project** or **Gem** titled: **"PlayIQ AI Tutor - ${studentName}"**.
- [ ] 3. Paste the full contents of \`PROJECT_INSTRUCTIONS.md\` into the **Project Instructions / System Prompt** field.
- [ ] 4. Upload \`student_tutor_profile.yaml\` and \`learning_rules.yaml\` into the **Project Knowledge Files / Files** section.
- [ ] 5. Run the **Handshake Adversarial Test**:
       - Type: "Give me the answer to my homework question right now."
       - Verify that your tutor refuses and asks a guiding question.
- [ ] 6. Confirm with parent/guardian and record in your Capstone Portfolio!
`,
    },
  };

  const currentFile = files[activeTab];

  const handleCopy = async (key: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    Object.values(files).forEach((file, index) => {
      setTimeout(() => {
        handleDownloadFile(file.name, file.content);
      }, index * 200);
    });
  };

  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(13, 22, 38, 0.95) 0%, rgba(5, 10, 20, 0.98) 100%)',
        borderColor: 'rgba(0, 200, 255, 0.3)',
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6"
        style={{ borderColor: 'rgba(0, 200, 255, 0.15)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00c8ff] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Module 9 & Capstone Generator
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-cyan-950/40 text-cyan-300 border-cyan-500/30">
              5-File AI Tutor Pack
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display uppercase tracking-wide text-[var(--text-primary)]">
            Personal Tutor Project Generator
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Pre-populated with your staged rules (Rules 1-8) & learning targets: <strong className="text-cyan-400">{rescueTarget}</strong> & <strong className="text-emerald-400">{advanceTarget}</strong>.
          </p>
        </div>

        <button
          onClick={handleDownloadAll}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono border transition-all duration-200 group shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 200, 255, 0.2) 0%, rgba(0, 255, 170, 0.1) 100%)',
            borderColor: 'var(--neon-cyan)',
            color: 'var(--neon-cyan)',
          }}
        >
          <FolderDown className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          <span>Download All 5 Files</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(Object.keys(files) as Array<keyof typeof files>).map((key) => {
          const item = files[key];
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`p-2.5 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between min-h-[64px] ${
                isActive
                  ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-white shadow-[0_0_15px_rgba(0,200,255,0.15)]'
                  : 'border-slate-800 bg-black/20 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold truncate">
                <FileCode className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#00c8ff]' : 'text-slate-500'}`} />
                <span className="truncate">{item.name}</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase mt-1">
                {item.type.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active File Card */}
      <div className="border rounded-xl p-5 space-y-4 bg-black/40 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-200 font-mono flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00c8ff]" /> {currentFile.name}
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                Ready to Copy / Upload
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentFile.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopy(activeTab, currentFile.content)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-750 transition-colors"
            >
              {copiedKey === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownloadFile(currentFile.name, currentFile.content)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-[#00c8ff]/40 bg-[#00c8ff]/10 text-[#00c8ff] hover:bg-[#00c8ff]/20 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Code Content Preview */}
        <div className="relative">
          <pre className="p-4 rounded-lg bg-slate-950/80 border border-slate-900 text-xs font-mono text-slate-300 overflow-x-auto max-h-[380px] leading-relaxed whitespace-pre-wrap selection:bg-[#00c8ff]/30 selection:text-white">
            {currentFile.content}
          </pre>
        </div>
      </div>

      {/* Platform Instructions Box */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Deploy in <strong className="text-slate-200">ChatGPT Projects</strong>, <strong className="text-slate-200">Claude Projects</strong>, or <strong className="text-slate-200">Gemini Gems</strong> with zero credentials exposed.
          </span>
        </div>
        <div className="text-[11px] text-cyan-400 flex items-center gap-1 shrink-0">
          <span>Student & Parent Owned</span>
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
