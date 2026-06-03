'use client';

import React, { useState } from 'react';
import { submitCapstoneProof, type CapstonePayload } from '../actions';
import ArtifactUploadZone from '@/components/artifacts/ArtifactUploadZone';
import { 
  Play, Sparkles, BookOpen, Layers, CheckCircle2, 
  Loader2, AlertCircle, Award, Cpu, ShieldCheck, 
  HelpCircle, ChevronRight, ChevronLeft, Upload
} from 'lucide-react';

interface CapstoneFormProps {
  studentId: string;
  moduleId: string;
  tutorComplete: boolean;
  assistantComplete: boolean;
  tutorStatus: string;
  assistantStatus: string;
  initialStatus: string;
  initialSubmissions: any[];
}

export default function CapstoneForm({
  studentId,
  moduleId,
  tutorComplete,
  assistantComplete,
  tutorStatus,
  assistantStatus,
  initialStatus,
  initialSubmissions,
}: CapstoneFormProps) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState(initialStatus || 'draft');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- Form States ---
  const [subject, setSubject] = useState('');
  const [unit, setUnit] = useState('');
  const [rationale, setRationale] = useState('');
  const [confidence, setConfidence] = useState(3);
  
  const [studyGuideFile, setStudyGuideFile] = useState<any | null>(null);
  
  const [teachBackText, setTeachBackText] = useState('');
  const [teachBackFile, setTeachBackFile] = useState<any | null>(null);
  
  const [assessmentType, setAssessmentType] = useState('');
  const [score, setScore] = useState('');
  const [delta, setDelta] = useState('');

  // Load initial data if exists
  React.useEffect(() => {
    if (initialSubmissions.length > 0) {
      const guide = initialSubmissions.find(s => s.artifact_type === 'study_rules');
      if (guide) {
        const p = guide.content_payload || {};
        setSubject(p.subject || '');
        setUnit(p.unit || '');
        setRationale(p.rationale || '');
        setConfidence(p.confidence || 3);
        if (guide.file_path) {
          setStudyGuideFile({
            filePath: guide.file_path,
            fileSize: guide.file_size,
            mimeType: guide.mime_type,
            originalName: guide.original_name,
          });
        }
      }

      const tb = initialSubmissions.find(s => s.artifact_type === 'error_review');
      if (tb) {
        const p = tb.content_payload || {};
        setTeachBackText(p.teachBackText || '');
        setAssessmentType(p.assessmentType || '');
        setScore(p.score || '');
        setDelta(p.delta || '');
        if (tb.file_path) {
          setTeachBackFile({
            filePath: tb.file_path,
            fileSize: tb.file_size,
            mimeType: tb.mime_type,
            originalName: tb.original_name,
          });
        }
      }
    }
  }, [initialSubmissions]);

  const canSubmit = tutorComplete && assistantComplete;
  const isLocked = status === 'submitted' || status === 'approved' || status === 'under_review';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isLocked) return;

    // Validate deliverables
    if (!subject.trim() || !unit.trim() || !rationale.trim()) {
      setErrorMsg('Task 1 details (Subject, Unit, and Rationale) are required.');
      setStep(1);
      return;
    }

    if (!studyGuideFile) {
      setErrorMsg('Task 2 study guide document file is required.');
      setStep(2);
      return;
    }

    if (!teachBackText.trim() && !teachBackFile) {
      setErrorMsg('Task 3 requires either a written Teach-Back text or a recorded media file.');
      setStep(3);
      return;
    }

    if (!assessmentType.trim() || !score.trim()) {
      setErrorMsg('Task 4 final assessment metadata is required.');
      setStep(4);
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload: CapstonePayload = {
      subject,
      unit,
      rationale,
      confidence,
      studyGuideFile: studyGuideFile ? {
        filePath: studyGuideFile.filePath,
        fileSize: studyGuideFile.fileSize,
        mimeType: studyGuideFile.mimeType,
        originalName: studyGuideFile.originalName,
      } : undefined,
      teachBackText,
      teachBackFile: teachBackFile ? {
        filePath: teachBackFile.filePath,
        fileSize: teachBackFile.fileSize,
        mimeType: teachBackFile.mimeType,
        originalName: teachBackFile.originalName,
      } : undefined,
      assessmentType,
      score,
      delta,
    };

    try {
      const res = await submitCapstoneProof(payload);
      if (res.ok) {
        setStatus('submitted');
        setSuccessMsg('Capstone Master Trial submitted successfully! Instructors will review your proof package.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-slate-100 text-xs font-mono outline-none transition-colors disabled:opacity-40';
  const textareaCls = 'neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-slate-100 text-xs font-mono outline-none resize-none disabled:opacity-40';

  return (
    <div className="space-y-8">
      {/* Dynamic Status Banner */}
      {status === 'submitted' && (
        <div className="border border-cyan-500/30 bg-cyan-950/15 p-4 rounded flex items-start gap-3 text-cyan-400 font-mono text-xs shadow-[0_0_15px_rgba(0,200,255,0.05)]">
          <Sparkles className="w-5 h-5 animate-pulse mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold uppercase tracking-wider mb-1">Status: Master Trial Submitted</p>
            <p className="text-slate-400">Your Capstone Proof Packet has been locked and logged in the evaluation queue. Teachers and administrators are reviewing your artifacts.</p>
          </div>
        </div>
      )}

      {status === 'approved' && (
        <div className="border border-green-500/30 bg-green-950/15 p-4 rounded flex items-start gap-3 text-green-400 font-mono text-xs shadow-[0_0_15px_rgba(57,255,20,0.05)]">
          <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold uppercase tracking-wider mb-1">Status: Master Trial Approved</p>
            <p className="text-slate-400">Congratulations! You have completed Course 1: Apprentice Mastery. Your verified status is active.</p>
          </div>
        </div>
      )}

      {status === 'revise' && (
        <div className="border border-red-500/40 bg-red-950/20 p-4 rounded flex items-start gap-3 text-red-400 font-mono text-xs shadow-[0_0_15px_rgba(239,68,68,0.05)]">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold uppercase tracking-wider mb-1">Status: Revisions Requested</p>
            <p className="text-slate-400">Please review teacher feedback in the comments, refine your study guide or teach-back, and submit again.</p>
          </div>
        </div>
      )}

      {/* Main Form Body */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Left/Middle Columns: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Form Step Headers */}
          <div className="flex border-b border-slate-800 pb-3 justify-between items-center font-mono text-[10px] text-slate-500">
            <span className={`pb-3 -mb-3.5 border-b-2 transition-all ${step === 1 ? 'border-[#00c8ff] text-[#00c8ff] font-bold' : 'border-transparent'}`}>
              01. PRE-LEARN
            </span>
            <span className={`pb-3 -mb-3.5 border-b-2 transition-all ${step === 2 ? 'border-[#00c8ff] text-[#00c8ff] font-bold' : 'border-transparent'}`}>
              02. STUDY GUIDE
            </span>
            <span className={`pb-3 -mb-3.5 border-b-2 transition-all ${step === 3 ? 'border-[#00c8ff] text-[#00c8ff] font-bold' : 'border-transparent'}`}>
              03. TEACH-BACK
            </span>
            <span className={`pb-3 -mb-3.5 border-b-2 transition-all ${step === 4 ? 'border-[#00c8ff] text-[#00c8ff] font-bold' : 'border-transparent'}`}>
              04. ASSESSMENT
            </span>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-8 !rounded-none border border-slate-800 space-y-6">
            
            {/* STEP 1: Pre-Learn */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-base text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <span className="text-[#00c8ff]">01 //</span> Pre-Learn Upcoming School Unit
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-400">Subject</label>
                    <input 
                      type="text"
                      required
                      disabled={isLocked}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Calculus"
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-400">Unit / Topic</label>
                    <input 
                      type="text"
                      required
                      disabled={isLocked}
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="e.g. Derivatives"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-400">Why I Chose This Unit</label>
                  <textarea 
                    rows={4}
                    required
                    disabled={isLocked}
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    placeholder="Describe how this unit connects to your goals..."
                    className={textareaCls}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-400">Initial Confidence Level (1-5)</label>
                  <select
                    disabled={isLocked}
                    value={confidence}
                    onChange={(e) => setConfidence(Number(e.target.value))}
                    className={inputCls + ' cursor-pointer'}
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} - {['Extremely Confused', 'Uncertain', 'Capable', 'Confident', 'Mastery Ready'][n - 1]}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2: Study Guide */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-base text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <span className="text-[#00c8ff]">02 //</span> Build Final Study Guide
                </h3>
                <p className="font-mono text-[11px] text-slate-400 leading-relaxed">
                  Your Capstone Study Guide should contain your unit title, 10-line summary, key terms, common mistakes, understanding card, and self-test questions. Upload your completed guide below.
                </p>

                <div className="border border-slate-800 bg-black/20 p-6 rounded-lg">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">&gt; Study Guide Attachment (Required)</label>
                  <ArtifactUploadZone
                    studentId={studentId}
                    moduleId={moduleId}
                    artifactType="study_rules"
                    initialFile={studyGuideFile}
                    status={status}
                    onUploadComplete={(file: any) => setStudyGuideFile(file)}
                    onFileDelete={() => setStudyGuideFile(null)}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Teach-Back */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-base text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <span className="text-[#00c8ff]">03 //</span> Recorded or Written Teach-Back
                </h3>
                <p className="font-mono text-[11px] text-slate-400 leading-relaxed">
                  Teach the unit concepts in your own words. Explain the core idea, key terms, best examples, common mistakes, and how your AI Tutor assisted you.
                </p>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">&gt; Written Synthesis (8 to 12 Sentences)</label>
                  <textarea 
                    rows={6}
                    disabled={isLocked}
                    value={teachBackText}
                    onChange={(e) => setTeachBackText(e.target.value)}
                    placeholder="Enter your written teach-back synthesis..."
                    className={textareaCls}
                  />
                </div>

                <div className="border border-slate-800 bg-black/20 p-6 rounded-lg">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">&gt; Optional recorded Audio/Video Teach-Back</label>
                  <ArtifactUploadZone
                    studentId={studentId}
                    moduleId={moduleId}
                    artifactType="error_review"
                    initialFile={teachBackFile}
                    status={status}
                    onUploadComplete={(file: any) => setTeachBackFile(file)}
                    onFileDelete={() => setTeachBackFile(null)}
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Assessment */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-base text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <span className="text-[#00c8ff]">04 //</span> Master Trial Final Assessment
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-400">Assessment Type</label>
                    <input 
                      type="text"
                      required
                      disabled={isLocked}
                      value={assessmentType}
                      onChange={(e) => setAssessmentType(e.target.value)}
                      placeholder="e.g. Quiz, Exam, Mock Test"
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-400">Final Assessment Score</label>
                    <input 
                      type="text"
                      required
                      disabled={isLocked}
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      placeholder="e.g. 95% or 45/50"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-400">What Changed from Baseline (Delta)</label>
                  <textarea 
                    rows={4}
                    disabled={isLocked}
                    value={delta}
                    onChange={(e) => setDelta(e.target.value)}
                    placeholder="Compare your initial confidence with your assessment scores, list strong and weak areas..."
                    className={textareaCls}
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 border border-red-500/20 rounded bg-red-950/20 text-red-400 font-mono text-xs text-center flex items-center justify-center gap-2">
                    <AlertCircle size={14} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 border border-green-500/20 rounded bg-green-950/20 text-green-400 font-mono text-xs text-center">
                    ✔ {successMsg}
                  </div>
                )}

                {!isLocked && (
                  <button
                    type="submit"
                    disabled={submitting || !canSubmit}
                    className="w-full bg-[#00c8ff] hover:bg-white text-black font-display font-black py-4 uppercase tracking-[0.2em] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,200,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] cursor-pointer text-xs flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Transmitting Proof...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Finalize & Submit Master Trial
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-900 font-mono text-xs">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-5 py-2.5 border border-slate-700 bg-transparent text-slate-350 hover:bg-slate-800 transition-colors uppercase font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft size={14} /> Previous Task
                </button>
              ) : <div />}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2.5 bg-[#00c8ff] text-black hover:bg-white font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Next Task <ChevronRight size={14} />
                </button>
              ) : <div />}
            </div>

          </form>

        </div>

        {/* Right Column: Pre-requisites checklist */}
        <div className="space-y-6 font-mono text-xs">
          
          <div className="glass-card p-6 !rounded-none border border-slate-800 space-y-4">
            <h4 className="font-display font-bold text-sm text-[#7b4fce] uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Award className="w-4 h-4" /> Mastery Checklists
            </h4>
            
            <p className="text-[10px] text-slate-500 leading-relaxed uppercase">
              The Capstone Master Trial requires proof of active deployment for both Course 1 custom AI engines.
            </p>

            <div className="space-y-3 pt-2">
              {/* Tutor Build */}
              <div className={`p-3 border flex items-center justify-between ${tutorComplete ? 'border-[#39ff14]/30 bg-[#39ff14]/5' : 'border-slate-800 bg-black/20'}`}>
                <div>
                  <p className="font-bold text-[10px] text-slate-300 uppercase">1. Custom AI Tutor (M9)</p>
                  <p className="text-[9px] text-slate-500 uppercase mt-0.5">Status: {tutorStatus || 'none'}</p>
                </div>
                {tutorComplete ? (
                  <span className="text-[#39ff14] text-base">✓</span>
                ) : (
                  <span className="text-slate-600">🔒</span>
                )}
              </div>

              {/* Assistant Build */}
              <div className={`p-3 border flex items-center justify-between ${assistantComplete ? 'border-[#39ff14]/30 bg-[#39ff14]/5' : 'border-slate-800 bg-black/20'}`}>
                <div>
                  <p className="font-bold text-[10px] text-slate-300 uppercase">2. Custom AI Assistant (M10)</p>
                  <p className="text-[9px] text-slate-500 uppercase mt-0.5">Status: {assistantStatus || 'none'}</p>
                </div>
                {assistantComplete ? (
                  <span className="text-[#39ff14] text-base">✓</span>
                ) : (
                  <span className="text-slate-600">🔒</span>
                )}
              </div>
            </div>

            {!canSubmit && (
              <div className="p-3 border border-amber-500/20 bg-amber-950/20 text-amber-400 rounded text-[10px] leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>You must complete node lessons and deploy your Tutor (M9) and Assistant (M10) to active/published status before you can finalize your trial.</span>
              </div>
            )}
          </div>

          <div className="p-5 border border-slate-800 bg-slate-900/30 rounded flex flex-col justify-center gap-1 leading-relaxed">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">&gt; Instruction recommendation</span>
            <p className="text-[10px] text-slate-500 uppercase">
              Once submitted, your sponsor/parent will be notified. They can inspect your finalized Study Guide and test run your engines on their gateway.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
