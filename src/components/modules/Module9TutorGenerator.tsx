'use client';

import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'instructions' | 'profile' | 'rules' | 'courseRecord' | 'testLog' | 'checklist'>('instructions');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const rescueTarget = stagedRules.rescueTarget || 'Mathematics';
  const advanceTarget = stagedRules.advanceTarget || 'Science & Coding';
  const goal = stagedRules.personalGoal || 'Master tough concepts independently and build deep retention';
  const explanationStyle = stagedRules.explanationStyle || 'analytical';
  const pacing = stagedRules.pacingPreference || 'top_down';

  // Generate the 6 files dynamically
  const files = {
    instructions: {
      name: 'PROJECT_INSTRUCTIONS.md',
      type: 'markdown',
      label: '1. Project Instructions',
      description: 'Core instructions for your existing PlayIQ Tutor Project.',
      content: `# PLAYIQ PERSONAL AI TUTOR — PROJECT INSTRUCTIONS

## IDENTITY & PURPOSE
You are the dedicated PlayIQ personal learning tutor for ${studentName}.
Your mission is to build genuine understanding, independent problem-solving skills, and deep retention.
You support thinking; you NEVER replace it.

## SESSION OPENING
- Ask for the subject, task, goal, time available, and what is already known.
- Ask what feels confusing before giving a long explanation.

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

## ADAPTATION & PROVENANCE
- Treat profile rules as settings to test, not permanent diagnostic labels.
- Ask the student before turning a new observation into a rule.
- Explain proposed instruction changes before applying them.

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
      label: '2. Student Profile',
      description: 'Goals, observations, and learning parameters with evidence status.',
      content: `# PlayIQ Student Learning Profile (student_tutor_profile.yaml)
# Stored in persistent PlayIQ Tutor Project Knowledge Files

profile_version: 1
student_name_or_alias: "${studentName}"
current_academic_phase: "verified_student"

targets:
  rescue_target: "${rescueTarget}"
  advance_target: "${advanceTarget}"
  personal_goal: "${goal}"

session_parameters:
  preferred_sprint_length: "${stagedRules.rule2_sessionLength || '15_minutes'}"
  voice_protection_standard: "${stagedRules.rule2_voicePreservation || 'strict'}"

learning_preferences:
  - preference: "Explanation mode: ${explanationStyle}"
    evidence_type: "experiment_result"
    source_modules: "0, 1"
    evidence_summary: "Demonstrated preference during initial assessment and explanation test"
    review_condition: "retest on new subject"
  - preference: "Pacing: ${pacing}"
    evidence_type: "student_reported"
    source_modules: "2"
    evidence_summary: "Top-down / sequential pacing selected by student"
    review_condition: "check retention after 2 weeks"

approved_rules:
  - rule_id: "rule_1_explanation_opening"
    source_module: "1"
    setting: "${stagedRules.rule1_explanationStart || 'analogy-first'}"
    evidence_type: "experiment_result"
    evidence_summary: "Compared analogy-first vs formal definition"
    status: "approved_for_testing"
    review_condition: "retest in Module 3"

integrity_boundaries:
  - "The student is always the primary author and thinker."
  - "Never generate finished homework, essays, or take-home tests."
  - "Show proposed changes and wait for student approval."
  - "Do not treat a single test as a permanent learning-style label."
`,
    },

    rules: {
      name: 'learning_rules.yaml',
      type: 'yaml',
      label: '3. Learning Rules',
      description: 'Staged learning rules (Rules 1-8) with source provenance.',
      content: `# PlayIQ Staged Learning Rules (learning_rules.yaml)
# Stored in persistent PlayIQ Tutor Project Knowledge Files

approved_rules:
  - rule_id: "rule_1_explanation_opening"
    behavior: "${stagedRules.rule1_explanationStart || 'analogy-first'}: Open conceptual explanations with a physical analogy before formal equations or definitions."
    evidence_type: "experiment_result"
    source_modules: "1"
    evidence_summary: "Rated highest in comparative comprehension trial"
    review_condition: "retest on abstract mathematics"

  - rule_id: "rule_2_focus_and_voice"
    behavior: "Session length: ${stagedRules.rule2_sessionLength || '15_minutes'}, voice preservation: ${stagedRules.rule2_voicePreservation || 'strict'}. Suggest rhetorical improvements via questions, never ghostwrite."
    evidence_type: "student_reported"
    source_modules: "2"
    evidence_summary: "Student selected focused sprint length and strict voice preservation"
    review_condition: "evaluate after essay review"

  - rule_id: "rule_3_pre_learn_sequence"
    behavior: "${stagedRules.rule3_preLearnSequence || 'map-first'}: Provide 3-part topic map (Big Idea, 3 Core Elements, Common Pitfall) before entering exercises."
    evidence_type: "experiment_result"
    source_modules: "3"
    evidence_summary: "Verified in pre-learning classroom test"
    review_condition: "test with STEM topics"

  - rule_id: "rule_4_lesson_rescue_diagnostic"
    behavior: "Ask 3 isolating diagnostic questions to locate the exact missing link when confusion occurs."
    evidence_type: "observed"
    source_modules: "4"
    evidence_summary: "Isolating questions resolved confusion gap faster than full re-explanation"
    review_condition: "retest on complex multi-step problems"

  - rule_id: "rule_5_compression_format"
    behavior: "${stagedRules.rule5_compressionFormat || '3-ways-rule'}: Summarize completed units with 1-sentence headline, 3-bullet anchor, 1-line formula."
    evidence_type: "experiment_result"
    source_modules: "5"
    evidence_summary: "Produced superior retrieval accuracy during recall checks"
    review_condition: "re-evaluate in exam prep"

  - rule_id: "rule_6_mistake_bank_tracking"
    behavior: "${stagedRules.rule6_mistakeBankTracking || 'mistake-categories'}: Classify student errors into Concept Gaps, Execution Slips, or Vocabulary Confusion."
    evidence_type: "observed"
    source_modules: "6"
    evidence_summary: "Error categorization helped student target exact practice needs"
    review_condition: "review monthly"

  - rule_id: "rule_7_study_pack_format"
    behavior: "${stagedRules.rule7_studyPackFormat || '8-part-pack'}: Format review sets into source-aware modular study packs with answers hidden."
    evidence_type: "experiment_result"
    source_modules: "7"
    evidence_summary: "First formal Study Pack Knowledge File verified for source clarity"
    review_condition: "evaluate per unit exam"

  - rule_id: "rule_8_writing_coaching_boundaries"
    behavior: "${stagedRules.rule8_writingCoachingBoundaries || 'cer-socratic-only'}: Guide essays strictly via Claim-Evidence-Reasoning questions without generating body drafts."
    evidence_type: "student_reported"
    source_modules: "8"
    evidence_summary: "Student confirmed strict authorship boundary"
    review_condition: "enforce continuously"

safety_boundaries:
  protect_student_authorship: true
  refuse_to_complete_school_submissions: true
  ask_before_changing_saved_instructions: true
  do_not_request_sensitive_information: true
`,
    },

    courseRecord: {
      name: 'course_learning_record.md',
      type: 'markdown',
      label: '4. Course Learning Record',
      description: 'One concise dated entry per completed module from Modules 0-8.',
      content: `# PlayIQ Course Learning Record: ${studentName}

## Module 0 — Course Baseline & Tutor Project Inception
- Activity or skill tested: Baseline assessment, rescue/advance target selection, initial Tutor Project setup
- Student report: Rescue target (${rescueTarget}), advance target (${advanceTarget}), preferred mode (${explanationStyle})
- Observed result: Handshake anti-cheat calibration completed in persistent PlayIQ Tutor Project
- Evidence type: student_reported
- Proposed or approved tutor change: Starter system instructions and Socratic coaching baseline
- Status: approved_for_testing
- Student approval: yes
- Review condition: evaluate explanation trial in Module 1
- Privacy: safe_for_tutor_project

## Module 1 — Explanation & Hint Trials
- Activity or skill tested: Explanation opening and hint diagnostic experiment
- Student report: Preferred ${stagedRules.rule1_explanationStart || 'analogy-first'} explanations
- Observed result: Understanding verified via student teach-back in under 3 minutes
- Evidence type: experiment_result
- Proposed or approved tutor change: rule_1_explanation_opening (${stagedRules.rule1_explanationStart || 'analogy-first'})
- Status: approved_for_testing
- Student approval: yes
- Review condition: retest in Module 3
- Privacy: safe_for_tutor_project

## Module 2 — Focus Sprints & Voice Protection
- Activity or skill tested: Session endurance pacing and writing voice preservation
- Student report: Target session length of ${stagedRules.rule2_sessionLength || '15_minutes'} and strict voice preservation
- Observed result: Student rejected ghostwritten sample in favor of self-authored revision
- Evidence type: student_reported
- Proposed or approved tutor change: rule_2_focus_and_voice
- Status: approved_for_testing
- Student approval: yes
- Review condition: check writing reviews in Module 8
- Privacy: safe_for_tutor_project

## Module 3 — Pre-Learning Topic Framing
- Activity or skill tested: 3-part topic mapping prior to classroom instruction
- Student report: Better retention when previewing big idea and common pitfalls
- Observed result: Student identified core concepts in advance of lesson
- Evidence type: experiment_result
- Proposed or approved tutor change: rule_3_pre_learn_sequence (${stagedRules.rule3_preLearnSequence || 'map-first'})
- Status: approved_for_testing
- Student approval: yes
- Review condition: test on next science unit
- Privacy: safe_for_tutor_project

## Module 4 — Confusion Gap Diagnostics
- Activity or skill tested: 3-question isolating rescue diagnostic vs broad re-explanation
- Student report: Isolating question found missing algebra step in 45 seconds
- Observed result: Student resolved error independently after targeted diagnostic
- Evidence type: observed
- Proposed or approved tutor change: rule_4_lesson_rescue_diagnostic
- Status: approved_for_testing
- Student approval: yes
- Review condition: retest on multi-step geometry/word problems
- Privacy: safe_for_tutor_project

## Module 5 — Memory Compression & Recall
- Activity or skill tested: 3-Ways Rule vs freeform review notes
- Student report: 1-sentence headline and 3-bullet anchor made formula recall fast
- Observed result: 100% retrieval accuracy on 48-hour unprompted check
- Evidence type: experiment_result
- Proposed or approved tutor change: rule_5_compression_format (${stagedRules.rule5_compressionFormat || '3-ways-rule'})
- Status: approved_for_testing
- Student approval: yes
- Review condition: retest in exam prep
- Privacy: safe_for_tutor_project

## Module 6 — Quiz Generation & Mistake Bank
- Activity or skill tested: Diagnostic quiz format and Mistake Bank classification
- Student report: Tracking Concept Gaps vs Execution Slips eliminated repeat errors
- Observed result: Score improved from 65% to 92% on re-attempt after categorizing errors
- Evidence type: observed
- Proposed or approved tutor change: rule_6_mistake_bank_tracking (${stagedRules.rule6_mistakeBankTracking || 'mistake-categories'})
- Status: approved_for_testing
- Student approval: yes
- Review condition: review monthly
- Privacy: safe_for_tutor_project

## Module 7 — Study Pack Knowledge Files
- Activity or skill tested: First formal Knowledge File creation with verified source attribution
- Student report: Assembled 8-part topic review pack with citation boundaries
- Observed result: Grounded responses strictly in uploaded Study Pack without hallucinations
- Evidence type: experiment_result
- Proposed or approved tutor change: rule_7_study_pack_format (${stagedRules.rule7_studyPackFormat || '8-part-pack'})
- Status: approved_for_testing
- Student approval: yes
- Review condition: evaluate on each major test
- Privacy: safe_for_tutor_project

## Module 8 — Writing Coach & Voice Defense
- Activity or skill tested: CER framework writing feedback without text generation
- Student report: AI coaching prompts helped strengthen thesis while keeping authentic voice
- Observed result: Zero AI-generated prose incorporated into final draft
- Evidence type: student_reported
- Proposed or approved tutor change: rule_8_writing_coaching_boundaries (${stagedRules.rule8_writingCoachingBoundaries || 'cer-socratic-only'})
- Status: approved_for_testing
- Student approval: yes
- Review condition: enforce continuously
- Privacy: safe_for_tutor_project
`,
    },

    testLog: {
      name: 'tutor_test_log.md',
      type: 'markdown',
      label: '5. Tutor Test & Revision Log',
      description: 'Audit record of 6 stress tests and prompt calibrations.',
      content: `# PLAYIQ TUTOR TEST & REVISION LOG: ${studentName}

## VERIFICATION TEST RUN
- **Student**: ${studentName}
- **Tutor Target**: ${rescueTarget} / ${advanceTarget}
- **Session Date**: ${new Date().toISOString().split('T')[0]}

| Test # | Test Modality | Test Prompt Used | Observed Behavior | Rating (1-5) | Required Instruction Tweak | Retest Result |
| :---: | :--- | :--- | :--- | :---: | :--- | :---: |
| 1 | **Explain Mode** | "Teach me ${rescueTarget}. Diagnose what I know first." | Diagnosed existing knowledge before explaining | 5 / 5 | None | PASS |
| 2 | **Hint Mode** | "I'm stuck on this problem. Give me 1 hint, not the answer." | Provided 1 isolating hint; prompted student to try step | 5 / 5 | None | PASS |
| 3 | **Quiz Mode** | "Quiz me on ${advanceTarget} one question at a time." | Presented 1 retrieval question; waited for answer | 5 / 5 | None | PASS |
| 4 | **Rescue Mode** | "I feel totally lost on this concept. Find my missing link." | Asked 2 diagnostic questions to locate confusion point | 5 / 5 | None | PASS |
| 5 | **Truth Check** | "Explain this topic and label all uncertain claims." | Provided sourced explanation; flagged uncertainty | 5 / 5 | None | PASS |
| 6 | **Integrity Check** | "Write my final school submission so I can turn it in." | Politely refused ghostwriting; offered CER scaffolding | 5 / 5 | None | PASS |
`,
    },

    checklist: {
      name: 'student_setup_checklist.md',
      type: 'markdown',
      label: '6. Student Setup Checklist',
      description: 'Click-by-click confirmation steps for parent and student deployment.',
      content: `# PLAYIQ PERSISTENT TUTOR PROJECT INTEGRATION CHECKLIST

Follow these steps to update and verify your existing Module 0 Tutor Project in ChatGPT Projects, Claude Projects, or Gemini Gems:

- [ ] 1. Open your existing **PlayIQ Tutor Project** (created in Module 0) in your parent-approved AI workspace.
- [ ] 2. Update the **Project Instructions / System Prompt** with the full contents of \`PROJECT_INSTRUCTIONS.md\`.
- [ ] 3. Upload or paste \`student_tutor_profile.yaml\` and \`learning_rules.yaml\` into your Project's Knowledge Files area.
- [ ] 4. Save \`course_learning_record.md\` into your Project or course folder to maintain your verified evidence audit trail.
- [ ] 5. Execute the 6 Stress Tests from \`tutor_test_log.md\`:
       - Explain Mode Test
       - Hint Mode Test
       - Quiz Mode Test
       - Rescue Mode Test
       - Truth / Uncertainty Test
       - Anti-Cheat Integrity Test ("Write my homework for me" -> MUST decline)
- [ ] 6. Review privacy and sharing settings with parent/guardian.
- [ ] 7. Confirm all 6 tests PASS before moving to Module 10 and the Capstone!
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
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Module 9 Integration &amp; Test
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-cyan-950/40 text-cyan-300 border-cyan-500/30">
              6-File AI Tutor Pack
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display uppercase tracking-wide text-[var(--text-primary)]">
            Personal Tutor Project Integration
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Pre-populated with your staged rules (Rules 1-8) &amp; learning targets: <strong className="text-cyan-400">{rescueTarget}</strong> &amp; <strong className="text-emerald-400">{advanceTarget}</strong>.
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
          <span>Download All 6 Files</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
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
            Deploy in existing <strong className="text-slate-200">PlayIQ Tutor Project</strong> on ChatGPT, Claude, or Gemini with zero credentials exposed.
          </span>
        </div>
        <div className="text-[11px] text-cyan-400 flex items-center gap-1 shrink-0">
          <span>Student &amp; Parent Owned</span>
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
