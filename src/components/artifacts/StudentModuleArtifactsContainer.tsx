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
    title: "Power and Responsibility",
    parts: [
      "Part 1: The Power Tool Principle (Superpowers vs. Superweapons)",
      "Part 2: Truth, Trust, and Misinformation (Applying the Truth Filter)",
      "Part 3: Attention, Distraction, and Algorithm Traps (Rest vs. Escape)",
      "Part 4: Human Responsibility and the Highest Path (Ethical Choices)",
      "Part 5: Applied Ethics and Social Impact (Digital Smartness & Reflection)"
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

  // Form payload states
  const [dwBeMore, setDwBeMore] = useState('');
  const [dwAttention, setDwAttention] = useState('');
  const [dwTrust, setDwTrust] = useState('');
  const [dwEnsure, setDwEnsure] = useState('');
  const [dwHpQuestion, setDwHpQuestion] = useState('');
  const [dwHabit, setDwHabit] = useState('');

  const [hpBoundary1, setHpBoundary1] = useState({ boundary: '', whyMatters: '', when: '' });
  const [hpBoundary2, setHpBoundary2] = useState({ boundary: '', whyMatters: '', when: '' });
  const [hpBoundary3, setHpBoundary3] = useState({ boundary: '', whyMatters: '', when: '' });

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
            setDwBeMore(p.beMore || '');
            setDwAttention(p.protectAttention || '');
            setDwTrust(p.beforeTrust || '');
            setDwEnsure(p.stillEnsure || '');
            setDwHpQuestion(p.highestPathQ || '');
            setDwHabit(p.habitToImprove || '');

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
            setHpBoundary1(p.boundary1 || { boundary: '', whyMatters: '', when: '' });
            setHpBoundary2(p.boundary2 || { boundary: '', whyMatters: '', when: '' });
            setHpBoundary3(p.boundary3 || { boundary: '', whyMatters: '', when: '' });

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
  }, [moduleId, supabase]);

  const isLocked = artifactStatus === 'submitted' || artifactStatus === 'approved' || artifactStatus === 'under_review';

  // Core handler to save active drafts to DB
  const handleSaveDraft = async (showBanner = true) => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const warriorPayload = {
      beMore: dwBeMore,
      protectAttention: dwAttention,
      beforeTrust: dwTrust,
      stillEnsure: dwEnsure,
      highestPathQ: dwHpQuestion,
      habitToImprove: dwHabit,
    };

    const boundariesPayload = {
      boundary1: hpBoundary1,
      boundary2: hpBoundary2,
      boundary3: hpBoundary3,
    };

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
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit artifacts for review.');
    } finally {
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
              Open the Markdown template in any editor, type in your answers under the ✍️ **[ YOUR RESPONSE ]** blocks, and save your completed file.
            </p>
            
            {/* Scrollable Preview panel */}
            <div className="mt-4 p-3 bg-black/60 border border-slate-800/80 rounded max-h-[140px] overflow-y-auto font-mono text-[10px] text-slate-500 space-y-2">
              <p className="text-[#00c8ff]/80 font-bold uppercase tracking-wider">&gt; Worksheet Structure Preview</p>
              {currentWorksheet.parts.map((p, idx) => (
                <p key={idx} className="pl-3 border-l border-slate-800">&gt; {p}</p>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <a
              href={`/worksheets/Module_${moduleNum}_Worksheet.md`}
              download
              className="w-full text-center bg-transparent border border-[#00c8ff] hover:bg-[#00c8ff]/10 text-[#00c8ff] font-display font-bold py-3.5 px-6 text-xs transition-all uppercase tracking-widest shadow-[0_0_10px_rgba(0,200,255,0.05)]"
            >
              Download Template (.md)
            </a>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmitReview} className="space-y-12">
        
        {moduleNum <= 2 ? (
          <>
            {/* ARTIFACT 1 */}
            <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 backdrop-blur-md space-y-6">
              <h3 className="text-[#00c8ff] font-bold uppercase tracking-widest text-sm border-b border-[#00c8ff]/20 pb-2 flex justify-between items-center">
                <span>ARTIFACT 1: DIGITAL WARRIOR CODE</span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">REQUIRED TYPE: STUDY_RULES</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Fields */}
                <div className="space-y-4">
                  <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-2">&gt; Written Synthesis</p>
                  <div>
                    <label className="block text-slate-300 font-mono text-xs mb-1.5">&gt; I want tech to help me become more...</label>
                    <input
                      required
                      disabled={isLocked}
                      value={dwBeMore}
                      onChange={(e) => setDwBeMore(e.target.value)}
                      type="text"
                      placeholder="e.g. focused on building models"
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-[var(--text-primary)] text-xs font-mono outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-mono text-xs mb-1.5">&gt; One way I will protect my attention is...</label>
                    <input
                      required
                      disabled={isLocked}
                      value={dwAttention}
                      onChange={(e) => setDwAttention(e.target.value)}
                      type="text"
                      placeholder="e.g. blocking browser access before 2 PM"
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-[var(--text-primary)] text-xs font-mono outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-mono text-xs mb-1.5">&gt; Before I trust something online, I will...</label>
                    <input
                      required
                      disabled={isLocked}
                      value={dwTrust}
                      onChange={(e) => setDwTrust(e.target.value)}
                      type="text"
                      placeholder="e.g. checking author credentials"
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-[var(--text-primary)] text-xs font-mono outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-mono text-xs mb-1.5">&gt; When AI helps me, I will still make sure I...</label>
                    <input
                      required
                      disabled={isLocked}
                      value={dwEnsure}
                      onChange={(e) => setDwEnsure(e.target.value)}
                      type="text"
                      placeholder="e.g. write the tests myself"
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-[var(--text-primary)] text-xs font-mono outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-mono text-xs mb-1.5">&gt; A Highest Path question I want to use is...</label>
                    <input
                      required
                      disabled={isLocked}
                      value={dwHpQuestion}
                      onChange={(e) => setDwHpQuestion(e.target.value)}
                      type="text"
                      placeholder="e.g. Does this help build long-term value?"
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-[var(--text-primary)] text-xs font-mono outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-mono text-xs mb-1.5">&gt; One digital habit I want to improve is...</label>
                    <input
                      required
                      disabled={isLocked}
                      value={dwHabit}
                      onChange={(e) => setDwHabit(e.target.value)}
                      type="text"
                      placeholder="e.g. turning off screens 1 hr before sleep"
                      className="neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-[var(--text-primary)] text-xs font-mono outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Upload Zone */}
                <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8 space-y-4">
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
            </div>

            {/* ARTIFACT 2 */}
            <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 backdrop-blur-md space-y-6">
              <h3 className="text-[#7b4fce] font-bold uppercase tracking-widest text-sm border-b border-[#7b4fce]/20 pb-2 flex justify-between items-center">
                <span>ARTIFACT 2: HIGHEST PATH BOUNDARIES PLAN</span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">REQUIRED TYPE: ERROR_REVIEW</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Fields */}
                <div className="space-y-6">
                  <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">&gt; Written Synthesis</p>
                  {[1, 2, 3].map((n) => {
                    const boundary = n === 1 ? hpBoundary1 : n === 2 ? hpBoundary2 : hpBoundary3;
                    const setBoundary = n === 1 ? setHpBoundary1 : n === 2 ? setHpBoundary2 : setHpBoundary3;

                    return (
                      <div key={n} className="p-4 border border-slate-800/80 rounded bg-black/20 space-y-3 font-mono text-xs">
                        <p className="text-[#7b4fce] font-bold uppercase tracking-wider text-[10px]">&gt; Boundary {n}</p>
                        <div>
                          <input
                            required
                            disabled={isLocked}
                            value={boundary.boundary}
                            onChange={(e) => setBoundary({ ...boundary, boundary: e.target.value })}
                            type="text"
                            placeholder="What is the boundary?"
                            className="w-full bg-black/60 border border-slate-800 focus:border-[#7b4fce] rounded p-2 text-slate-200 outline-none disabled:opacity-50 text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            required
                            disabled={isLocked}
                            value={boundary.whyMatters}
                            onChange={(e) => setBoundary({ ...boundary, whyMatters: e.target.value })}
                            type="text"
                            placeholder="Why does it matter?"
                            className="w-full bg-black/60 border border-slate-800 focus:border-[#7b4fce] rounded p-2 text-slate-200 outline-none disabled:opacity-50 text-xs"
                          />
                          <input
                            required
                            disabled={isLocked}
                            value={boundary.when}
                            onChange={(e) => setBoundary({ ...boundary, when: e.target.value })}
                            type="text"
                            placeholder="When to apply?"
                            className="w-full bg-black/60 border border-slate-800 focus:border-[#7b4fce] rounded p-2 text-slate-200 outline-none disabled:opacity-50 text-xs"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Upload Zone */}
                <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8 space-y-4">
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
