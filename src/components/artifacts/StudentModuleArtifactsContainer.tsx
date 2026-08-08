'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { saveArtifactDraft, submitArtifactsForReview } from '@/lib/artifacts/actions';
import ArtifactUploadZone from './ArtifactUploadZone';

interface StudentModuleArtifactsContainerProps {
  moduleId: string;
  moduleNum: number;
}

const WORKSHEET_OVERVIEWS: Record<number, { title: string; parts: string[] }> = {
  1: {
    title: "The PlayIQ Foundation",
    parts: [
      "Part 1: What AI Is Good At vs. Bad At (Classification, Scenarios)",
      "Part 2: Choosing the Right AI Mode (Coach, Quiz, Rescue, Hint)",
      "Part 3: Ask Better Questions (Prompt Upgrades & Rewrites)",
      "Part 4: Verify Before You Believe (The Verification Ritual)",
      "Part 5: Integrity and Identity (Shortcut Identity Audit)",
      "Part 6: Social Impact & Digital Power (Pause Before Share Rule)"
    ]
  },
  2: {
    title: "Power, Policies, and Gray Zones",
    parts: [
      "Part 1: The Power Tool Principle (Active Branching Scenario)",
      "Part 2: Navigation — AI Detectors and School Policies",
      "Part 3: Mid-Module Check-In & Attention Traps (Micro-Win)",
      "Part 4: The Highest Path Test (Real Decisions)",
      "Part 5: Social Power & Applied Ethics"
    ]
  },
  3: {
    title: "Maps, Principles, and Self-Testing",
    parts: [
      "Part 1: Topic Mapping (Pre-Learn Maps & Nudges)",
      "Part 2: First Principles (Core Idea Simplification & Levels)",
      "Part 3: Example-First Learning (Examples vs. Non-Examples)",
      "Part 4: Self-Test Loop (Rereading vs. Testing Reflection)"
    ]
  },
  4: {
    title: "Rescue and Remediate",
    parts: [
      "Part 1: Paste, Chunk, Scan (Lesson Rescue Prompts)",
      "Part 2: Identify Gap Type (Word, Background, Step, Overload Gaps)",
      "Part 3: Remediate in Personal Style (Analogy, Step-by-Step repairs)",
      "Part 4: Adaptive Questioning Loop (Analyzing Errors & Explaining)",
      "Part 5: Teach-Back Unlock (Own the Idea in Your Own Words)"
    ]
  },
  5: {
    title: "Compression Learning",
    parts: [
      "Part 1: Deep Skimming (Visual Cues & Structural Scans)",
      "Part 2: Summary Gaps (Condensing Info & Finding Core Principles)",
      "Part 3: Analogy Engine (Building Memorable Memory Anchors)",
      "Part 4: Real-Life Application (Translating Theory into Practice)"
    ]
  },
  6: {
    title: "Self-Testing & Mistake Bank",
    parts: [
      "Part 1: The Forgetting Curve (Spaced Retrieval Rationale)",
      "Part 2: Designing Your Quiz (Writing High-Quality Distractors)",
      "Part 3: Analyzing Your Errors (Root Cause Categorization)",
      "Part 4: Managing the Mistake Bank (Curing the Weak Spot)"
    ]
  },
  7: {
    title: "Notes & Study Pack Creation",
    parts: [
      "Part 1: The Cornell Upgrade (Active Recall Notes)",
      "Part 2: Visual Concept Maps (Non-Linear Connections)",
      "Part 3: Assembling a Study Pack (Curating the Survival Toolkit)",
      "Part 4: Spaced Retrieval Schedule (Setting up the Tracker)"
    ]
  },
  8: {
    title: "Writing & Answer Clarity",
    parts: [
      "Part 1: The Thesis Core (Crafting Unarguable Arguments)",
      "Part 2: Evidence and Citation (Separating Opinions from Proofs)",
      "Part 3: AI Peer Review Loop (Prompting for Critical Editing)",
      "Part 4: Final Clarity Check (The Human Voice Polish)"
    ]
  },
  9: {
    title: "Build Your AI Tutor",
    parts: [
      "Part 1: Defining the Persona (Target Role & Scope)",
      "Part 2: Seeding the Rules (Guardrails & Dynamic Gating)",
      "Part 3: Prompt Crafting & Testing (Iterative Refinement)",
      "Part 4: The Evaluation Standard (Measuring AI Instruction Quality)"
    ]
  },
  10: {
    title: "Build Your AI Assistant",
    parts: [
      "Part 1: Core Use Case (Solving Real-world Problems)",
      "Part 2: Behavior and Guardrails (Safety & Boundaries)",
      "Part 3: Multi-Turn Conversation Flow (State Handshakes)",
      "Part 4: The Live Demonstration (Final Portfolio Presentation)"
    ]
  }
};

export default function StudentModuleArtifactsContainer({
  moduleId,
  moduleNum,
}: StudentModuleArtifactsContainerProps) {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Status and submission records
  const [artifactStatus, setArtifactStatus] = useState<string>('draft');
  const [adminNotes, setAdminNotes] = useState<string | null>(null);

  // Form payload states for Module 2 (Power, Policies, and Gray Zones)
  const [m2Q1Superpower, setM2Q1Superpower] = useState('');
  const [m2Q1Superweapon, setM2Q1Superweapon] = useState('');
  const [m2Q2, setM2Q2] = useState('');
  const [m2Q3, setM2Q3] = useState('');
  const [m2Q4Analysis, setM2Q4Analysis] = useState('');
  const [m2Q4Boundary, setM2Q4Boundary] = useState('');
  const [m2Q5, setM2Q5] = useState('');
  const [m2Q6, setM2Q6] = useState('');
  const [m2Q7, setM2Q7] = useState('');

  // Form payload states for Module 1 (The PlayIQ Foundation Worksheet)
  const [m1Q1Choice, setM1Q1Choice] = useState('');
  const [m1Q1Explanation, setM1Q1Explanation] = useState('');
  const [m1Q2Use, setM1Q2Use] = useState('');
  const [m1Q2Explanation, setM1Q2Explanation] = useState('');
  const [m1Q3Use, setM1Q3Use] = useState('');
  const [m1Q3Explanation, setM1Q3Explanation] = useState('');
  const [m1Q4, setM1Q4] = useState('');
  const [m1Q5, setM1Q5] = useState('');
  const [m1Q6, setM1Q6] = useState('');
  const [m1Q7, setM1Q7] = useState('');
  const [m1Q8, setM1Q8] = useState('');
  const [m1Q9, setM1Q9] = useState('');
  const [m1Q10, setM1Q10] = useState('');
  const [m1Q11, setM1Q11] = useState('');
  const [m1Q12, setM1Q12] = useState('');
  const [m1Q13, setM1Q13] = useState('');
  const [m1Q14, setM1Q14] = useState('');
  const [m1Q15, setM1Q15] = useState('');
  const [m1Q16, setM1Q16] = useState('');
  const [m1Q17, setM1Q17] = useState('');
  const [m1Q18, setM1Q18] = useState('');
  const [m1Q19, setM1Q19] = useState('');
  const [m1Q20, setM1Q20] = useState('');
  const [m1Q21, setM1Q21] = useState('');

  // File upload metadata states
  const [studyRulesFile, setStudyRulesFile] = useState<any | null>(null);
  const [errorReviewFile, setErrorReviewFile] = useState<any | null>(null);

  const [studentId, setStudentId] = useState<string>('');

  // Fetch initial submission state from DB
  useEffect(() => {
    async function loadSubmissions() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setStudentId(user.id);

        const { data: submissions, error } = await supabase
          .from('proof_artifact_submissions')
          .select('*')
          .eq('student_id', user.id)
          .eq('module_id', moduleId);

        if (error) throw error;

        if (submissions && submissions.length > 0) {
          // Both submissions share the status, default status from first item found
          setArtifactStatus(submissions[0].status || 'draft');
          setAdminNotes(submissions[0].review_notes || null);

          // Find Study Rules
          const rules = submissions.find(s => s.artifact_type === 'study_rules');
          if (rules) {
            const p = rules.content_payload || {};
            if (moduleNum === 1) {
              setM1Q1Choice(p.m1Q1Choice || '');
              setM1Q1Explanation(p.m1Q1Explanation || '');
              setM1Q2Use(p.m1Q2Use || '');
              setM1Q2Explanation(p.m1Q2Explanation || '');
              setM1Q3Use(p.m1Q3Use || '');
              setM1Q3Explanation(p.m1Q3Explanation || '');
              setM1Q4(p.m1Q4 || '');
              setM1Q5(p.m1Q5 || '');
              setM1Q6(p.m1Q6 || '');
              setM1Q7(p.m1Q7 || '');
              setM1Q8(p.m1Q8 || '');
              setM1Q9(p.m1Q9 || '');
            } else if (moduleNum === 2) {
              setM2Q1Superpower(p.m2Q1Superpower || '');
              setM2Q1Superweapon(p.m2Q1Superweapon || '');
              setM2Q2(p.m2Q2 || '');
              setM2Q3(p.m2Q3 || '');
              setM2Q4Analysis(p.m2Q4Analysis || '');
              setM2Q4Boundary(p.m2Q4Boundary || '');
            }

            if (rules.file_path) {
              setStudyRulesFile({
                filePath: rules.file_path,
                fileSize: rules.file_size,
                mimeType: rules.mime_type,
                originalName: rules.original_name,
              });
            }
          }

          // Find Error Review / Boundaries
          const boundaries = submissions.find(s => s.artifact_type === 'error_review');
          if (boundaries) {
            const p = boundaries.content_payload || {};
            if (moduleNum === 1) {
              setM1Q10(p.m1Q10 || '');
              setM1Q11(p.m1Q11 || '');
              setM1Q12(p.m1Q12 || '');
              setM1Q13(p.m1Q13 || '');
              setM1Q14(p.m1Q14 || '');
              setM1Q15(p.m1Q15 || '');
              setM1Q16(p.m1Q16 || '');
              setM1Q17(p.m1Q17 || '');
              setM1Q18(p.m1Q18 || '');
              setM1Q19(p.m1Q19 || '');
              setM1Q20(p.m1Q20 || '');
              setM1Q21(p.m1Q21 || '');
            } else if (moduleNum === 2) {
              setM2Q5(p.m2Q5 || '');
              setM2Q6(p.m2Q6 || '');
              setM2Q7(p.m2Q7 || '');
            }

            if (boundaries.file_path) {
              setErrorReviewFile({
                filePath: boundaries.file_path,
                fileSize: boundaries.file_size,
                mimeType: boundaries.mime_type,
                originalName: boundaries.original_name,
              });
            }
          }
        }
      } catch (err: any) {
        console.error('Error loading submissions:', err.message);
        setErrorMsg('Failed to load previous submission details.');
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, [moduleId, supabase, moduleNum]);

  const isLocked = artifactStatus === 'submitted' || artifactStatus === 'approved' || artifactStatus === 'under_review';

  // Core handler to save active drafts to DB
  const handleSaveDraft = async (showBanner = true) => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    let warriorPayload = {};
    let boundariesPayload = {};

    if (moduleNum === 1) {
      warriorPayload = {
        m1Q1Choice,
        m1Q1Explanation,
        m1Q2Use,
        m1Q2Explanation,
        m1Q3Use,
        m1Q3Explanation,
        m1Q4,
        m1Q5,
        m1Q6,
        m1Q7,
        m1Q8,
        m1Q9
      };

      boundariesPayload = {
        m1Q10,
        m1Q11,
        m1Q12,
        m1Q13,
        m1Q14,
        m1Q15,
        m1Q16,
        m1Q17,
        m1Q18,
        m1Q19,
        m1Q20,
        m1Q21
      };
    } else if (moduleNum === 2) {
      warriorPayload = {
        m2Q1Superpower,
        m2Q1Superweapon,
        m2Q2,
        m2Q3,
        m2Q4Analysis,
        m2Q4Boundary,
      };

      boundariesPayload = {
        m2Q5,
        m2Q6,
        m2Q7,
      };
    }

    try {
      // Save Draft 1
      await saveArtifactDraft(moduleId, 'study_rules', warriorPayload, studyRulesFile || undefined);
      // Save Draft 2
      await saveArtifactDraft(moduleId, 'error_review', boundariesPayload, errorReviewFile || undefined);
      
      setArtifactStatus('draft'); // Set local state to draft
      if (showBanner) {
        setSuccessMsg('Progress saved as draft successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
      return true;
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save drafts.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Debounced auto-save effect
  useEffect(() => {
    // Only auto-save if we are in draft mode and not already saving/loading
    if (loading || isLocked || artifactStatus === 'approved') return;

    // Use a 5-second debounce to save to backend silently
    const timeoutId = setTimeout(() => {
      handleSaveDraft(false); // false = silent save without banner
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [
    loading, isLocked, artifactStatus,
    m1Q1Choice, m1Q1Explanation, m1Q2Use, m1Q2Explanation, m1Q3Use, m1Q3Explanation,
    m1Q4, m1Q5, m1Q6, m1Q7, m1Q8, m1Q9, m1Q10, m1Q11, m1Q12, m1Q13, m1Q14, m1Q15,
    m1Q16, m1Q17, m1Q18, m1Q19, m1Q20, m1Q21, m2Q1Superpower, m2Q1Superweapon,
    m2Q2, m2Q3, m2Q4Analysis, m2Q4Boundary, m2Q5, m2Q6, m2Q7
  ]);

  // Core handler to finalize submissions
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    // Modules 3-10 require the worksheet file attachment to be uploaded before submission
    if (moduleNum >= 3 && !studyRulesFile) {
      setErrorMsg(`You must upload your completed Module ${moduleNum} Worksheet file to submit.`);
      setSubmitting(false);
      return;
    }

    // 1. Save drafts first to capture any active edits
    const saveOk = await handleSaveDraft(false);
    if (!saveOk) {
      setSubmitting(false);
      return;
    }

    try {
      // 2. Fire final submission triggers
      await submitArtifactsForReview(moduleId, moduleNum);
      setArtifactStatus('submitted');
      setSuccessMsg('Your proof artifacts have been submitted for evaluation!');
      // Navigate to completion page, forcing a reload to ensure layout cache is fresh
      window.location.href = `/student/modules/${moduleNum}/completion`;
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit artifacts for review.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] font-mono text-[#00c8ff]">
        <div className="w-12 h-12 border-4 border-t-[#00c8ff] border-slate-800 rounded-full animate-spin mb-4" />
        <span className="uppercase tracking-widest text-xs animate-pulse">Decrypting Artifact Console...</span>
      </div>
    );
  }

  const currentWorksheet = WORKSHEET_OVERVIEWS[moduleNum];

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto space-y-8">
      
      {/* Dynamic State Machine Header Banner */}
      {artifactStatus === 'draft' && (
        <div className="border border-yellow-500/30 bg-yellow-950/10 p-4 rounded-lg flex items-start space-x-3 text-yellow-400 font-mono text-xs">
          <span className="text-sm">📝</span>
          <div>
            <p className="font-bold uppercase tracking-wider mb-1">Status: Sandbox Draft</p>
            <p className="text-slate-400">Feel free to save your work and return later. Upload attachments to support your answers.</p>
          </div>
        </div>
      )}

      {(artifactStatus === 'submitted' || artifactStatus === 'under_review') && (
        <div className="border border-cyan-500/30 bg-cyan-950/10 p-4 rounded-lg flex items-start space-x-3 text-cyan-400 font-mono text-xs shadow-[0_0_15px_rgba(0,200,255,0.05)]">
          <span className="text-sm animate-pulse">⚡</span>
          <div>
            <p className="font-bold uppercase tracking-wider mb-1">Status: Awaiting Admin Evaluation</p>
            <p className="text-slate-400">Your proof packet has been logged. Review operations are underway. Forms are locked during grading.</p>
          </div>
        </div>
      )}

      {artifactStatus === 'approved' && (
        <div className="border border-green-500/30 bg-green-950/10 p-4 rounded-lg flex items-start space-x-3 text-green-400 font-mono text-xs shadow-[0_0_15px_rgba(34,197,94,0.05)]">
          <span className="text-sm">✔</span>
          <div>
            <p className="font-bold uppercase tracking-wider mb-1">Status: Artifacts Approved</p>
            <p className="text-slate-400">Excellent work! Your credentials have been signed and dynamic gating blockages have been lifted.</p>
          </div>
        </div>
      )}

      {artifactStatus === 'revise' && (
        <div className="border border-red-500/40 bg-red-950/20 p-4 rounded-lg flex items-start space-x-3 text-red-400 font-mono text-xs shadow-[0_0_15px_rgba(239,68,68,0.05)]">
          <span className="text-sm">⚠</span>
          <div>
            <p className="font-bold uppercase tracking-wider mb-1 text-red-400">Status: Revision Required</p>
            <div className="bg-black/40 border border-red-950/50 p-3 rounded text-slate-300 mb-3 mt-1.5 leading-relaxed font-mono">
              <span className="text-red-400 font-bold uppercase block text-[10px] tracking-widest mb-1">&gt; Reviewer Comments</span>
              "{adminNotes || 'Please review your submissions and update appropriately.'}"
            </div>
            <p className="text-slate-400">Upload forms have been unlocked. Make adjustments as requested and re-submit.</p>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div>
        <div className="mb-2 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider font-mono">
          Module {moduleNum} · Output Deck
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-[var(--text-primary)] uppercase font-display">Proof Artifact Generation</h1>
        <p className="text-slate-400 font-mono text-xs leading-relaxed max-w-2xl">
          {moduleNum >= 3 
            ? `Download your Module ${moduleNum} worksheet template, record your findings, and upload the completed file below.`
            : "Integrate and translate your module experience into visual and text representations. Complete both files below to proceed."
          }
        </p>
      </div>

      {/* Worksheet Template Card (added beautifully for every module) */}
      {currentWorksheet && (
        <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800 backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h3 className="text-[#00c8ff] font-bold font-display uppercase tracking-widest text-xs mb-2">
              📥 MODULE {moduleNum} OFFICIAL WORKSHEET TEMPLATE
            </h3>
            <p className="text-slate-400 font-mono text-[11px] leading-relaxed">
              Open the Word/Google Docs template, double-click to type your responses inside the dedicated response boxes, and save.
            </p>
            
            {/* Scrollable Preview panel */}
            <div className="mt-4 p-3 bg-black/60 border border-slate-800/80 rounded max-h-[140px] overflow-y-auto font-mono text-[10px] text-slate-500 space-y-2">
              <p className="text-[#00c8ff]/80 font-bold uppercase tracking-wider">&gt; Worksheet Structure Preview</p>
              {currentWorksheet.parts.map((p, idx) => (
                <p key={idx} className="pl-3 border-l border-slate-800">&gt; {p}</p>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-col gap-2 w-full">
              <a
                href={`/worksheets/Module_${moduleNum}_Worksheet.doc`}
                download
                className="w-full text-center bg-transparent border border-[#00c8ff] hover:bg-[#00c8ff]/15 text-[#00c8ff] font-display font-bold py-3 px-4 text-[10px] transition-all uppercase tracking-widest shadow-[0_0_12px_rgba(0,200,255,0.1)] hover:shadow-[0_0_20px_rgba(0,200,255,0.3)]"
              >
                Download Word (.doc)
              </a>
              <a
                href={`/worksheets/Module_${moduleNum}_Worksheet.md`}
                download
                className="w-full text-center bg-transparent border border-slate-700 hover:bg-slate-800/40 text-slate-400 font-display font-bold py-2 px-4 text-[9px] transition-all uppercase tracking-wider"
              >
                Download Markdown (.md)
              </a>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmitReview} className="space-y-12">
        
        {moduleNum === 1 ? (
          <>
            {/* PART 0 & PART 1 & PART 2 (Artifact 1: study_rules) */}
            <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 backdrop-blur-md space-y-8 animate-fade-in">
              <h3 className="text-[#00c8ff] font-bold uppercase tracking-widest text-sm border-b border-[#00c8ff]/20 pb-2 flex justify-between items-center">
                <span>ARTIFACT 1: FOUNDATION DIAGNOSTICS (PARTS 0-2)</span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">REQUIRED TYPE: STUDY_RULES</span>
              </h3>

              {/* Part 0: The Lightning Challenge */}
              <div className="space-y-4">
                <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider font-mono">&gt; Part 0: The Lightning Challenge (Spot the Trap)</h4>
                <div className="bg-black/50 p-4 border border-slate-800 rounded font-mono text-xs text-slate-300 leading-relaxed">
                  <p className="font-bold text-[#00c8ff] mb-2">// Math Rule Explanation from AI:</p>
                  <p className="italic bg-black/40 p-3 border-l-2 border-slate-700">
                    "To divide fractions, simply divide the numerators and divide the denominators. For example, (1/2) ÷ (1/4) = (1÷1) / (2÷4) = 1 / (1/2) = 2. This works because division is the opposite of multiplication."
                  </p>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <label className="block text-slate-300 font-semibold">&gt; Is this statement correct, or is there a subtle mistake?</label>
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                      <input
                        type="radio"
                        name="m1q1choice"
                        value="spots_error"
                        checked={m1Q1Choice === 'spots_error'}
                        onChange={(e) => setM1Q1Choice(e.target.value)}
                        disabled={isLocked}
                        className="accent-[#00c8ff]"
                      />
                      It has a subtle mistake
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                      <input
                        type="radio"
                        name="m1q1choice"
                        value="missed"
                        checked={m1Q1Choice === 'missed'}
                        onChange={(e) => setM1Q1Choice(e.target.value)}
                        disabled={isLocked}
                        className="accent-[#00c8ff]"
                      />
                      It is correct
                    </label>
                  </div>

                  {m1Q1Choice === 'spots_error' && (
                    <div className="mt-3 p-4 border border-green-500/30 bg-green-950/20 text-green-400 font-mono text-xs rounded transition-all">
                      <strong>Orion Feedback:</strong> "Boom! You spotted it. Most students fall for that because the final answer was correct and the AI sounded so polished. You didn't. That is your first victory. Let's build on this."
                    </div>
                  )}
                  {m1Q1Choice === 'missed' && (
                    <div className="mt-3 p-4 border border-yellow-500/30 bg-yellow-950/20 text-yellow-400 font-mono text-xs rounded transition-all">
                      <strong>Orion Feedback:</strong> "Don't sweat it. 90% of students fall for this trap because the AI sounds so confident and the final number is correct. But the method is completely broken. That's why we're here. Let's learn how to spot these."
                    </div>
                  )}

                  <div className="pt-2">
                    <label className="block text-slate-300 mb-1.5">&gt; Explain why (spotting the rule violation):</label>
                    <textarea
                      required
                      placeholder="e.g. Dividing denominators directly is not the correct rule for fraction division..."
                      disabled={isLocked}
                      value={m1Q1Explanation}
                      onChange={(e) => setM1Q1Explanation(e.target.value)}
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-slate-200 text-xs font-mono outline-none h-16 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Part 1: What AI Is Good At vs. Bad At */}
              <div className="space-y-6 pt-6 border-t border-slate-800">
                <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider font-mono">&gt; Part 1: What AI Is Good At vs. Bad At</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Q2 */}
                  <div className="p-4 border border-slate-800 rounded bg-black/20 space-y-3 font-mono text-xs">
                    <p className="text-[#00c8ff] font-bold uppercase tracking-wider text-[10px]">&gt; Q2: Complex Science Skateboard Analogy</p>
                    <select
                      required
                      disabled={isLocked}
                      value={m1Q2Use}
                      onChange={(e) => setM1Q2Use(e.target.value)}
                      className="w-full bg-black/60 border border-slate-800 focus:border-[#00c8ff] rounded p-2 text-slate-200 outline-none text-xs disabled:opacity-50"
                    >
                      <option value="">Select Classification...</option>
                      <option value="good">Good Use</option>
                      <option value="risky">Risky Use</option>
                      <option value="bad">Bad Use</option>
                    </select>
                    <textarea
                      required
                      placeholder="Explain why..."
                      disabled={isLocked}
                      value={m1Q2Explanation}
                      onChange={(e) => setM1Q2Explanation(e.target.value)}
                      className="w-full bg-black/60 border border-slate-800 focus:border-[#00c8ff] rounded p-2 text-slate-200 outline-none text-xs h-16 disabled:opacity-50"
                    />
                  </div>

                  {/* Q3 */}
                  <div className="p-4 border border-slate-800 rounded bg-black/20 space-y-3 font-mono text-xs">
                    <p className="text-[#00c8ff] font-bold uppercase tracking-wider text-[10px]">&gt; Q3: Paste Math Worksheet and write "Solve these"</p>
                    <select
                      required
                      disabled={isLocked}
                      value={m1Q3Use}
                      onChange={(e) => setM1Q3Use(e.target.value)}
                      className="w-full bg-black/60 border border-slate-800 focus:border-[#00c8ff] rounded p-2 text-slate-200 outline-none text-xs disabled:opacity-50"
                    >
                      <option value="">Select Classification...</option>
                      <option value="good">Good Use</option>
                      <option value="risky">Risky Use</option>
                      <option value="bad">Bad Use</option>
                    </select>
                    <textarea
                      required
                      placeholder="Explain why..."
                      disabled={isLocked}
                      value={m1Q3Explanation}
                      onChange={(e) => setM1Q3Explanation(e.target.value)}
                      className="w-full bg-black/60 border border-slate-800 focus:border-[#00c8ff] rounded p-2 text-slate-200 outline-none text-xs h-16 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1.5">&gt; Q4: Why is it dangerous to trust an AI answer just because it sounds polished?</label>
                    <textarea
                      required
                      placeholder="Write your explanation..."
                      disabled={isLocked}
                      value={m1Q4}
                      onChange={(e) => setM1Q4(e.target.value)}
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-slate-200 text-xs outline-none h-20 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1.5">&gt; Q5: Your friend is frustrated because AI missed the main requirement of their history project. What is one thing AI is typically "bad at" that might explain this?</label>
                    <textarea
                      required
                      placeholder="Write your explanation..."
                      disabled={isLocked}
                      value={m1Q5}
                      onChange={(e) => setM1Q5(e.target.value)}
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-slate-200 text-xs outline-none h-20 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Part 2: Choosing the Right AI Mode */}
              <div className="space-y-6 pt-6 border-t border-slate-800">
                <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider font-mono">&gt; Part 2: Choosing the Right AI Mode</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                  {/* Q6 */}
                  <div className="p-4 border border-slate-800 rounded bg-black/20 space-y-2">
                    <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px]">&gt; Q6: Reading textbook paragraph, no idea what it means. Mode:</label>
                    <select
                      required
                      disabled={isLocked}
                      value={m1Q6}
                      onChange={(e) => setM1Q6(e.target.value)}
                      className="w-full bg-black/60 border border-slate-800 focus:border-[#00c8ff] rounded p-2 text-slate-200 outline-none text-xs disabled:opacity-50"
                    >
                      <option value="">Select Mode...</option>
                      <option value="coach">Coach Mode</option>
                      <option value="quiz">Quiz Mode</option>
                      <option value="rescue">Lesson Rescue Mode</option>
                      <option value="hint">Hint Mode</option>
                    </select>
                  </div>

                  {/* Q7 */}
                  <div className="p-4 border border-slate-800 rounded bg-black/20 space-y-2">
                    <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px]">&gt; Q7: Done half a math problem, got stuck. Want a nudge. Mode:</label>
                    <select
                      required
                      disabled={isLocked}
                      value={m1Q7}
                      onChange={(e) => setM1Q7(e.target.value)}
                      className="w-full bg-black/60 border border-slate-800 focus:border-[#00c8ff] rounded p-2 text-slate-200 outline-none text-xs disabled:opacity-50"
                    >
                      <option value="">Select Mode...</option>
                      <option value="coach">Coach Mode</option>
                      <option value="quiz">Quiz Mode</option>
                      <option value="rescue">Lesson Rescue Mode</option>
                      <option value="hint">Hint Mode</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1.5">&gt; Q8: Explain to a younger student when they should use "Quiz Mode" instead of "Explain Mode."</label>
                    <textarea
                      required
                      placeholder="Write your explanation..."
                      disabled={isLocked}
                      value={m1Q8}
                      onChange={(e) => setM1Q8(e.target.value)}
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-slate-200 text-xs outline-none h-20 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1.5">&gt; Q9: You feel completely overwhelmed by your study schedule. How could "Coach Mode" help you without doing the work for you?</label>
                    <textarea
                      required
                      placeholder="Write your explanation..."
                      disabled={isLocked}
                      value={m1Q9}
                      onChange={(e) => setM1Q9(e.target.value)}
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-slate-200 text-xs outline-none h-20 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* PART 3 & PART 4 & PART 5 & PART 6 (Artifact 2: error_review) */}
            <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 backdrop-blur-md space-y-8 animate-fade-in">
              <h3 className="text-[#7b4fce] font-bold uppercase tracking-widest text-sm border-b border-[#7b4fce]/20 pb-2 flex justify-between items-center">
                <span>ARTIFACT 2: APPLIED STRATEGIES (PARTS 3-6)</span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">REQUIRED TYPE: ERROR_REVIEW</span>
              </h3>

              {/* Part 3: Ask Better Questions */}
              <div className="space-y-4 font-mono text-xs">
                <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider">&gt; Part 3: Ask Better Questions</h4>
                <div className="space-y-4 mt-2">
                  <div>
                    <label className="block text-slate-300 mb-1.5">&gt; Q10 (Prompt Upgrade): Rewrite "What's the answer to question 4?" into a strong prompt that helps you learn:</label>
                    <input
                      required
                      disabled={isLocked}
                      value={m1Q10}
                      onChange={(e) => setM1Q10(e.target.value)}
                      type="text"
                      placeholder="e.g. Can you explain the concept behind question 4 and give me a similar example to try?"
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#7b4fce] rounded p-2.5 text-slate-200 text-xs outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1.5">&gt; Q11 (Prompt Upgrade): Rewrite "Write my history paragraph about the Civil War" so the AI acts as a writing coach:</label>
                    <input
                      required
                      disabled={isLocked}
                      value={m1Q11}
                      onChange={(e) => setM1Q11(e.target.value)}
                      type="text"
                      placeholder="e.g. I need to write a history paragraph about the Civil War. Can you help me outline it and review my draft?"
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#7b4fce] rounded p-2.5 text-slate-200 text-xs outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1.5">&gt; Q12: Why does asking better, more specific questions lead to faster learning?</label>
                    <textarea
                      required
                      placeholder="Write your explanation..."
                      disabled={isLocked}
                      value={m1Q12}
                      onChange={(e) => setM1Q12(e.target.value)}
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#7b4fce] rounded p-2.5 text-slate-200 text-xs outline-none h-20 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Part 4: Verify Before You Believe */}
              <div className="space-y-6 pt-6 border-t border-slate-800">
                <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider font-mono">&gt; Part 4: Verify Before You Believe</h4>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1.5">&gt; Q13: What is the very first step of the PlayIQ Verification Ritual?</label>
                    <select
                      required
                      disabled={isLocked}
                      value={m1Q13}
                      onChange={(e) => setM1Q13(e.target.value)}
                      className="w-full bg-black/60 border border-slate-800 focus:border-[#7b4fce] rounded p-2 text-slate-200 outline-none text-xs disabled:opacity-50"
                    >
                      <option value="">Select Option...</option>
                      <option value="cross_check">Can I cross-check it?</option>
                      <option value="make_sense">Does this make sense?</option>
                      <option value="missing">Is anything missing?</option>
                      <option value="explain_myself">Can I explain it myself?</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1.5">&gt; Q14: An AI tells you "Fractions are always smaller than whole numbers." You think back to improper fractions like 5/4. What part of the Verification Ritual are you using?</label>
                    <textarea
                      required
                      placeholder="Write your explanation..."
                      disabled={isLocked}
                      value={m1Q14}
                      onChange={(e) => setM1Q14(e.target.value)}
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#7b4fce] rounded p-2.5 text-slate-200 text-xs outline-none h-20 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1.5">&gt; Q15: Why does copying an AI's polished, robotic words actually make your work weaker in the long run?</label>
                    <textarea
                      required
                      placeholder="Write your explanation..."
                      disabled={isLocked}
                      value={m1Q15}
                      onChange={(e) => setM1Q15(e.target.value)}
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#7b4fce] rounded p-2.5 text-slate-200 text-xs outline-none h-20 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Part 5: Integrity and Identity */}
              <div className="space-y-6 pt-6 border-t border-slate-800">
                <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider font-mono">&gt; Part 5: Integrity and Identity</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                  {/* Q16 */}
                  <div className="p-4 border border-slate-800 rounded bg-black/20 space-y-2">
                    <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px]">&gt; Q16: Ask AI to give a hint, solve it yourself. Classification:</label>
                    <select
                      required
                      disabled={isLocked}
                      value={m1Q16}
                      onChange={(e) => setM1Q16(e.target.value)}
                      className="w-full bg-black/60 border border-slate-800 focus:border-[#7b4fce] rounded p-2 text-slate-200 outline-none text-xs disabled:opacity-50"
                    >
                      <option value="">Select classification...</option>
                      <option value="coach">Coach</option>
                      <option value="cheat">Cheat</option>
                      <option value="borderline">Borderline</option>
                    </select>
                  </div>

                  {/* Q17 */}
                  <div className="p-4 border border-slate-800 rounded bg-black/20 space-y-2">
                    <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px]">&gt; Q17: Copy AI answer directly because you're tired. Classification:</label>
                    <select
                      required
                      disabled={isLocked}
                      value={m1Q17}
                      onChange={(e) => setM1Q17(e.target.value)}
                      className="w-full bg-black/60 border border-slate-800 focus:border-[#7b4fce] rounded p-2 text-slate-200 outline-none text-xs disabled:opacity-50"
                    >
                      <option value="">Select classification...</option>
                      <option value="coach">Coach</option>
                      <option value="cheat">Cheat</option>
                      <option value="borderline">Borderline</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1.5">&gt; Q18: PlayIQ says: "Cheating is not just a rule problem. It is an identity problem." In your own words, what does it mean to train a "shortcut identity"?</label>
                    <textarea
                      required
                      placeholder="Write your explanation..."
                      disabled={isLocked}
                      value={m1Q18}
                      onChange={(e) => setM1Q18(e.target.value)}
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#7b4fce] rounded p-2.5 text-slate-200 text-xs outline-none h-20 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1.5">&gt; Q19: Explain the PlayIQ principle: "AI can coach me, but I earn the skill."</label>
                    <textarea
                      required
                      placeholder="Write your explanation..."
                      disabled={isLocked}
                      value={m1Q19}
                      onChange={(e) => setM1Q19(e.target.value)}
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#7b4fce] rounded p-2.5 text-slate-200 text-xs outline-none h-20 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Part 6: Social Impact & Digital Power */}
              <div className="space-y-6 pt-6 border-t border-slate-800">
                <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider font-mono">&gt; Part 6: Social Impact & Digital Power</h4>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1.5">&gt; Q20: Before sharing a surprising fact online, you should use the Pause Before Share Rule. Which of the following is NOT one of those questions?</label>
                    <select
                      required
                      disabled={isLocked}
                      value={m1Q20}
                      onChange={(e) => setM1Q20(e.target.value)}
                      className="w-full bg-black/60 border border-slate-800 focus:border-[#7b4fce] rounded p-2 text-slate-200 outline-none text-xs disabled:opacity-50"
                    >
                      <option value="">Select option...</option>
                      <option value="true">Is it true?</option>
                      <option value="likes">Will this get a lot of likes?</option>
                      <option value="respectful">Is it respectful?</option>
                      <option value="hurt">Could this hurt someone if I'm wrong?</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1.5">&gt; Q21: A friend sends you a crazy, AI-generated image of a politician doing something embarrassing and says, "Post this!" Apply the Pause Before Share rule to explain what your next move should be.</label>
                    <textarea
                      required
                      placeholder="Write your explanation..."
                      disabled={isLocked}
                      value={m1Q21}
                      onChange={(e) => setM1Q21(e.target.value)}
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#7b4fce] rounded p-2.5 text-slate-200 text-xs outline-none h-20 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

            </div>
          </>
                ) : moduleNum === 2 ? (
          <>
            {/* ARTIFACT 1 */}
            <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 backdrop-blur-md space-y-8 animate-fade-in">
              <h3 className="text-[#00c8ff] font-bold uppercase tracking-widest text-sm border-b border-[#00c8ff]/20 pb-2 flex justify-between items-center">
                <span>ARTIFACT 1: POWER, POLICIES, AND GRAY ZONES (PARTS 1-3)</span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">REQUIRED TYPE: STUDY_RULES</span>
              </h3>

              {/* Part 1: The Power Tool Principle */}
              <div className="space-y-4">
                <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider font-mono">&gt; Part 1: The Power Tool Principle (Active Branching Scenario)</h4>
                <div className="bg-black/50 p-4 border border-slate-800 rounded font-mono text-xs text-slate-300 space-y-3 leading-relaxed">
                  <p className="font-bold text-[#00c8ff]">// Scenario Card: You have a major history report due. You're completely stuck on how to structure it.</p>
                  <div className="space-y-2 pl-3 border-l border-slate-700">
                    <p><strong>Option A:</strong> Prompt the AI: <em>"Write a 5-paragraph outline for an essay on the causes of the American Revolution."</em> Use it to structure your own research and writing.</p>
                    <p><strong>Option B:</strong> Prompt the AI: <em>"Write the intro and first body paragraph for my history essay."</em> Copy it and write the rest yourself.</p>
                    <p><strong>Option C:</strong> Paste a draft you wrote into the AI and prompt: <em>"Give me feedback on my arguments and highlight sentences that are confusing."</em></p>
                  </div>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">&gt; Q1a: Which of these choices is a Superpower that builds your writing skill? Explain why.</label>
                    <textarea
                      required
                      disabled={isLocked}
                      value={m2Q1Superpower}
                      onChange={(e) => setM2Q1Superpower(e.target.value)}
                      placeholder="e.g. Option C is a Superpower because it acts as an editor..."
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-slate-200 outline-none h-24 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">&gt; Q1b: Which of these choices is a Superweapon that shortcut-trains your brain to avoid hard work? Explain why.</label>
                    <textarea
                      required
                      disabled={isLocked}
                      value={m2Q1Superweapon}
                      onChange={(e) => setM2Q1Superweapon(e.target.value)}
                      placeholder="e.g. Option B is a Superweapon because you copy AI work directly..."
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-slate-200 outline-none h-24 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Part 2: Navigation — AI Detectors and School Policies */}
              <div className="space-y-4 border-t border-slate-800/80 pt-6">
                <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider font-mono">&gt; Part 2: Navigation — AI Detectors and School Policies</h4>
                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">&gt; Q2 (The Detector Trap): Why do AI detectors sometimes flag human essays as "AI-written" (false positives), and how can writing in your own natural voice protect you from false accusations?</label>
                    <textarea
                      required
                      disabled={isLocked}
                      value={m2Q2}
                      onChange={(e) => setM2Q2(e.target.value)}
                      placeholder="Explain perplexity/burstiness and voice protection..."
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-slate-200 outline-none h-24 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">&gt; Q3 (School Policy Variance): Under which of policies A, B, and C is AI translation + summary acceptable, and where does it cross into cheating?</label>
                    <textarea
                      required
                      disabled={isLocked}
                      value={m2Q3}
                      onChange={(e) => setM2Q3(e.target.value)}
                      placeholder="e.g. Acceptable under C, crossing under A..."
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-slate-200 outline-none h-24 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Part 3: Mid-Module Check-In & Attention Traps */}
              <div className="space-y-4 border-t border-slate-800/80 pt-6">
                <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider font-mono">&gt; Part 3: Mid-Module Check-In & Attention Traps</h4>
                
                {/* Micro-Win box */}
                <div className="bg-[#00c8ff]/10 border border-[#00c8ff]/30 p-4 rounded text-slate-300 font-mono text-xs leading-relaxed flex items-start gap-3">
                  <span className="text-xl">🎉</span>
                  <div>
                    <p className="font-bold text-[#00c8ff]">Micro-Win Unlock!</p>
                    <p className="text-slate-400 mt-0.5">"You've made it through the core gray-zone strategy guide. Your digital navigation score has been updated (+50 XP). Let's do a quick reality check before moving to the final section."</p>
                  </div>
                </div>

                <div className="bg-black/50 p-4 border border-slate-800 rounded font-mono text-xs text-slate-300 leading-relaxed">
                  <p className="font-bold text-[#00c8ff]">// Trap Audit Scenario:</p>
                  <p className="italic">You feel overwhelmed about starting a big project, so you click on social media "just for a minute" and end up scrolling for two hours.</p>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">&gt; Q4a (Trap Audit Analysis): Is this Rest (recharging energy) or Escape (running from discomfort)? Why?</label>
                    <input
                      required
                      disabled={isLocked}
                      value={m2Q4Analysis}
                      onChange={(e) => setM2Q4Analysis(e.target.value)}
                      type="text"
                      placeholder="e.g. Escape, because it is driven by avoidance of task friction..."
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-slate-200 outline-none disabled:opacity-50 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">&gt; Q4b (The Boundary): What is one practical friction point you can set up on your phone/browser to break the Escape loop before it starts?</label>
                    <input
                      required
                      disabled={isLocked}
                      value={m2Q4Boundary}
                      onChange={(e) => setM2Q4Boundary(e.target.value)}
                      type="text"
                      placeholder="e.g. Setting a screen time block limit or keeping the phone in another room..."
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-slate-200 outline-none disabled:opacity-50 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Zone for study_rules */}
              <div className="border-t border-slate-800/80 pt-6 space-y-4">
                <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">&gt; Upload Attachment (Optional)</p>
                <ArtifactUploadZone
                  studentId={studentId}
                  moduleId={moduleId}
                  artifactType="study_rules"
                  initialFile={studyRulesFile}
                  status={artifactStatus}
                  onUploadComplete={(file) => setStudyRulesFile(file)}
                  onFileDelete={() => setStudyRulesFile(null)}
                />
              </div>
            </div>

            {/* ARTIFACT 2 */}
            <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 backdrop-blur-md space-y-8 animate-fade-in">
              <h3 className="text-[#7b4fce] font-bold uppercase tracking-widest text-sm border-b border-[#7b4fce]/20 pb-2 flex justify-between items-center">
                <span>ARTIFACT 2: ETHICAL CHOICES & SOCIAL IMPACT (PARTS 4-5)</span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">REQUIRED TYPE: ERROR_REVIEW</span>
              </h3>

              {/* Part 4: The Highest Path Test */}
              <div className="space-y-4">
                <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider font-mono">&gt; Part 4: The Highest Path Test (Real Decisions)</h4>
                <div className="bg-black/50 p-4 border border-slate-800 rounded font-mono text-xs text-slate-300 space-y-3 leading-relaxed">
                  <p className="font-bold text-[#7b4fce]">// Scenario - The Lab Report:</p>
                  <p className="italic">Your lab partner suggests using AI to write the "Discussion" section of your chemistry report because the class is hard. Apply the Highest Path Test questions:</p>
                  <div className="space-y-1 pl-3 border-l border-slate-700 text-slate-400">
                    <p>1. <em>Does this make me stronger or weaker?</em></p>
                    <p>2. <em>Would I be proud if a mentor saw this choice?</em></p>
                    <p>3. <em>Am I using this to create or to escape?</em></p>
                  </div>
                </div>

                <div className="font-mono text-xs">
                  <label className="block text-slate-300 font-semibold mb-1.5">&gt; Q5 (Highest Path Decision): What is the highest path action you should take, and what do you tell your partner?</label>
                  <textarea
                    required
                    disabled={isLocked}
                    value={m2Q5}
                    onChange={(e) => setM2Q5(e.target.value)}
                    placeholder="Describe your choice and response to your partner..."
                    className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#7b4fce] rounded p-2.5 text-slate-200 outline-none h-24 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Part 5: Social Power & Applied Ethics */}
              <div className="space-y-4 border-t border-slate-800/80 pt-6">
                <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider font-mono">&gt; Part 5: Social Power & Applied Ethics</h4>
                <div className="bg-black/50 p-4 border border-slate-800 rounded font-mono text-xs text-slate-300 space-y-3 leading-relaxed">
                  <p className="font-bold text-[#7b4fce]">// Scenario - Pause Before Share:</p>
                  <p className="italic">A classmate sends you an AI-edited audio clip of a teacher saying something funny but completely out of character. They tell you to post it in the class group chat. Apply Pause Before Share rules:</p>
                  <div className="space-y-1 pl-3 border-l border-slate-700 text-slate-400">
                    <p>1. <em>Is it true/real?</em></p>
                    <p>2. <em>Is it respectful?</em></p>
                    <p>3. <em>Could this hurt someone's job or reputation if shared?</em></p>
                  </div>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">&gt; Q6 (Pause Before Share Action): Explain what your response should be to prevent digital harm.</label>
                    <textarea
                      required
                      disabled={isLocked}
                      value={m2Q6}
                      onChange={(e) => setM2Q6(e.target.value)}
                      placeholder="Describe your action and what you tell the classmate..."
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#7b4fce] rounded p-2.5 text-slate-200 outline-none h-24 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">&gt; Q7 (Reflection): What is the difference between letting AI do the thinking for you (keeps you dependent) and using AI to build a custom study tool (makes you a creator)?</label>
                    <textarea
                      required
                      disabled={isLocked}
                      value={m2Q7}
                      onChange={(e) => setM2Q7(e.target.value)}
                      placeholder="Reflect on dependency vs creator mindset..."
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#7b4fce] rounded p-2.5 text-slate-200 outline-none h-24 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Zone for error_review */}
              <div className="border-t border-slate-800/80 pt-6 space-y-4">
                <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">&gt; Upload Attachment (Optional)</p>
                <ArtifactUploadZone
                  studentId={studentId}
                  moduleId={moduleId}
                  artifactType="error_review"
                  initialFile={errorReviewFile}
                  status={artifactStatus}
                  onUploadComplete={(file) => setErrorReviewFile(file)}
                  onFileDelete={() => setErrorReviewFile(null)}
                />
              </div>
            </div>
          </>

        ) : (
          <>
            {/* UPLOAD WORKSHEET CARD FOR MODULES 3 TO 10 */}
            <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 backdrop-blur-md space-y-6">
              <h3 className="text-[#00c8ff] font-bold uppercase tracking-widest text-sm border-b border-[#00c8ff]/20 pb-2 flex justify-between items-center">
                <span>ARTIFACT 1: UPLOAD COMPLETED WORKSHEET FILE</span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">REQUIRED TYPE: STUDY_RULES</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Information panel */}
                <div className="space-y-4 flex flex-col justify-center">
                  <p className="text-[#00c8ff] font-mono font-bold text-xs uppercase tracking-wider">&gt; Required Deliverable</p>
                  <p className="text-slate-300 font-mono text-xs leading-relaxed">
                    Upload your completed Module {moduleNum} Worksheet here. We support multiple file types:
                  </p>
                  <ul className="space-y-2 text-slate-400 font-mono text-[11px] list-disc list-inside pl-2">
                    <li>Markdown files (`.md`)</li>
                    <li>PDF documents (`.pdf`)</li>
                    <li>Photos of handwritten pages (`.png`, `.jpeg`, `.jpg`)</li>
                  </ul>
                  <p className="text-slate-500 font-mono text-[10px] italic">
                    * Make sure all response blocks in the worksheet are filled out before uploading.
                  </p>
                </div>

                {/* Upload Zone */}
                <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8">
                  <ArtifactUploadZone
                    studentId={studentId}
                    moduleId={moduleId}
                    artifactType="study_rules"
                    initialFile={studyRulesFile}
                    status={artifactStatus}
                    onUploadComplete={(file) => setStudyRulesFile(file)}
                    onFileDelete={() => setStudyRulesFile(null)}
                  />
                </div>
              </div>
            </div>

            {/* UPLOAD SUPPORTING NOTES (OPTIONAL) */}
            <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 backdrop-blur-md space-y-6">
              <h3 className="text-[#7b4fce] font-bold uppercase tracking-widest text-sm border-b border-[#7b4fce]/20 pb-2 flex justify-between items-center">
                <span>ARTIFACT 2: UPLOAD CONCEPT MAPS / STUDY NOTES (OPTIONAL)</span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">OPTIONAL TYPE: ERROR_REVIEW</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Information panel */}
                <div className="space-y-4 flex flex-col justify-center">
                  <p className="text-[#7b4fce] font-mono font-bold text-xs uppercase tracking-wider">&gt; Supplemental Material</p>
                  <p className="text-slate-300 font-mono text-xs leading-relaxed">
                    If you created visual mind maps, Cornell notes, or an AI mistake bank, you can upload them here to add to your portfolios.
                  </p>
                </div>

                {/* Upload Zone */}
                <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8">
                  <ArtifactUploadZone
                    studentId={studentId}
                    moduleId={moduleId}
                    artifactType="error_review"
                    initialFile={errorReviewFile}
                    status={artifactStatus}
                    onUploadComplete={(file) => setErrorReviewFile(file)}
                    onFileDelete={() => setErrorReviewFile(null)}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Global Notifications */}
        {successMsg && (
          <div className="p-3 border border-green-500/20 rounded bg-green-950/20 text-green-400 font-mono text-xs text-center">
            ✔ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-3 border border-red-500/20 rounded bg-red-950/20 text-red-400 font-mono text-xs text-center animate-shake">
            ⚠ {errorMsg}
          </div>
        )}

        {/* Operations Footers */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-900 font-mono text-xs">
          
          <button
            type="button"
            disabled={isLocked || saving}
            onClick={() => handleSaveDraft(true)}
            className="w-full md:w-auto bg-slate-900 text-slate-300 border border-slate-700 px-8 py-3.5 rounded-lg uppercase tracking-wider font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Preserving Draft...' : 'Save Draft Progress'}
          </button>

          <button
            type="submit"
            disabled={isLocked || submitting}
            className="w-full md:w-auto bg-[#00c8ff] text-black shadow-[0_0_15px_rgba(0,200,255,0.2)] px-10 py-3.5 rounded-lg uppercase tracking-wider font-bold hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting to Review Ops...' : 'Submit Artifacts & Complete Module →'}
          </button>
        </div>
      </form>
    </div>
  );
}
