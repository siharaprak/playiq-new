'use client';

import React, { useEffect, useMemo, useState } from 'react';
import BetaBlockerReport from '@/components/course-release/BetaBlockerReport';
import {
  activitiesForModule,
  parseLessonChoices,
  type LessonChoices,
} from '@/lib/course-release/activities';
import {
  MODULE_FIELDS,
  buildPersonalLearningKnowledgeFile,
} from '@/lib/course-release/learning-record';
import {
  loadInteractiveModuleRecordState,
  saveInteractiveBetaFeedback,
  saveInteractiveLessonChoice,
  saveInteractiveModuleRecord,
  submitInteractiveCourseBlocker,
  type InteractiveModuleLearningRecord,
} from '@/app/(dashboard)/student/interactive-learning-record-actions';

const TUTOR_CHECKPOINT_PROMPTS: Record<number, string> = {
  0: `Orion, this is my PlayIQ Module 00 assessment. Help me record only what I chose to share. Separate what I reported from what the activity observed. Treat learning preferences as hypotheses, not fixed labels. Ask one clarification question at a time if needed. Show me a concise proposed Course Learning Record entry and exactly what you would add or change. Do not claim anything was saved. Wait for my approval.`,
  1: `Record my Module 1 assessment using my PlayIQ course-recordkeeping rules. Compare this result with my Module 00 starting hypothesis. Use only the ratings and answers I provide below. Show me one concise dated Course Learning Record entry and any proposed instruction change. Keep the result provisional, identify what needs another test, and wait for my approval.`,
  2: `Record my Module 2 assessment using my PlayIQ course-recordkeeping rules. Separate my authorship/integrity boundary from my focus-sprint experiment. Use only my actual results. Show the dated Course Learning Record entry and any proposed Learning Rule; label untested preferences as pending_validation. Wait for my approval.`,
  3: `Record my Module 3 pre-learning assessment using my PlayIQ course-recordkeeping rules. Separate my starting arrival choice from my 3-Way Entry Trial results and any after-class debrief. If class has not happened yet, mark the after-class debrief as pending. Show the concise Course Learning Record entry and any proposed pre-learn sequence rule. Wait for my approval.`,
  4: `Record my Module 4 Lesson Rescue assessment using my PlayIQ course-recordkeeping rules. Use only my actual confusion point, gap hypothesis, and comparison of Analogy, Step-by-Step, and Diagnostic-Question rescues. Note any confounding conditions (such as fatigue, familiarity, or topic change). Show the concise Course Learning Record entry and proposed rescue-start rule. Wait for my approval.`,
  5: `Record my Module 5 Compression Learning assessment using my PlayIQ course-recordkeeping rules. Separate what felt easy during review from what actually helped me retrieve the idea without looking. Use only my actual Audio, Visual-Card, and Teach-Back results. Show the concise Course Learning Record entry and proposed review-start rule. Wait for my approval.`,
  6: `Record my Module 6 Self-Testing and Mistake Bank assessment using my PlayIQ course-recordkeeping rules. Separate my quiz-format comparison from my Mistake Bank repair loop and my real parent-approved reminder method. Do not assume a chat message is a scheduled notification. Show the concise Course Learning Record entry and proposed quiz-start rule. Wait for my approval.`,
  7: `Record my Module 7 Knowledge File assessment using my PlayIQ course-recordkeeping rules. Use only my messy-notes vs. clean Study Pack comparison, source citations, and privacy exclusions (without copying excluded private text). Show the concise Course Learning Record entry and proposed knowledge-file-use rule. Wait for my approval.`,
  8: `Record my Module 8 Writing & Voice assessment using my PlayIQ course-recordkeeping rules. Keep my authorship boundary strict: coaching only, never ghostwriting or impersonation. Use only my CER Answer Map, coaching choices, and any explicitly approved voice samples. Show the concise Course Learning Record entry and proposed writing-coach rule. Wait for my approval.`,
  9: `Orion, review my six-file PlayIQ Tutor Kit and my uploaded personal_learning_knowledge_file.md (File 2 of 6) in this same Module 00 PlayIQ Tutor Project. Summarize only EVIDENCE USED, RULES ADDED, RULES REVISED, PENDING VALIDATION, MISSING INPUT, and REMOVED FOR PRIVACY. Do not invent missing answers or mark the Module 10 Tutor tests as passed yet. Wait for my approval.`,
  10: `Orion, record my Module 10 Tutor test results in this same Module 00 PlayIQ Tutor Project. Use only the tests I actually ran (1, 2, 3, or N/T for not_tested), the one instruction I revised, and the repeated test result. Update my tutor_test_log.md draft and wait for my approval.`,
  11: `In my separate My Personal Assistant Project: review my Assistant Brief and 7-section Project Instructions for my one chosen safe workflow. Confirm what you will help organize, what decisions stay with me, and what boundaries you will follow. Wait for my approval.`,
  12: `In my separate My Personal Assistant Project: record my three Assistant test results (normal request, missing detail, boundary), the one instruction I revised and retested, and how I will verify any real reminder tool outside chat text. Wait for my approval.`,
  14: `Orion, help me compile my Module 14 Master Trial review in my Module 00 PlayIQ Tutor Project. Use only my actual 6-Stage Exam & Performance System evidence, my Learning Dashboard observations, and my chosen Track A–E skills demonstration. Separate preferences from demonstrated results, do not invent scores, and wait for my approval.`,
};

const BETA_REFLECTION_PROMPTS: Record<number, string[]> = {
  0: [
    '1. Did the Custom Instructions / Project setup feel easy to follow, or was any step confusing?',
    '2. When you ran the Handshake Test, did the AI respond the way you expected?',
    '3. What is one thing that made this feel different from normal school work?',
    '4. What are you most excited to build or solve in Module 1?',
  ],
  1: [
    'Character tutorial: Could you follow the character tutorial, save your card, and reuse it in a new scene or clearly labeled text test? Which exact step, if any, was unclear?',
    '1. Which of the 6 AI modes felt most immediately useful for your school life?',
    '2. Did the 3-way explanation lab help you compare formats, without making you feel locked into one learning style?',
    '3. What was the hardest part of the 1B Error Hunter Boss Battle?',
  ],
  2: [
    '1. Did the Focus Lab help you identify your real attention limit?',
    '2. Was the Voice Preservation Experiment convincing on why AI rewrites sound fake?',
    '3. What is one rule about AI you wish your school would clarify?',
  ],
  3: [
    '1. Which of the 3 entry styles (Map-First, Example-First, Question-First) felt strongest on your chosen topic?',
    '2. Did building the 5-Part Pre-Learn Map make the upcoming class topic feel less overwhelming?',
    '3. Was any part of the 10-Line Pre-Learn Brief or Golden Question step unclear?',
  ],
  4: [
    '1. Was the G / M / S line-by-line confusion scanner easy to use on a real school passage?',
    '2. Which of the 6 Gap Types showed up in your lesson rescue?',
    '3. Did comparing Analogy, Step-by-Step, and Diagnostic-Question rescues help you see what works when you are stuck?',
  ],
  5: [
    '1. Did the 4-level Compression Ladder help you shrink a topic without losing accuracy?',
    '2. Which review format (Audio, Visual Card, or Teach-Back) helped you retrieve the most with your notes closed?',
    '3. Was the difference between feeling easy and actual retrieval clear?',
  ],
  6: [
    '1. Which of the 6 Mistake Bank categories best matched the error you analyzed?',
    '2. How did One-Question-at-a-Time compare with the Full-Set quiz format for your focus?',
    '3. Was the distinction between a chat reminder and a real parent-approved reminder tool clear?',
  ],
  7: [
    '1. Did the 8-part Study Pack structure make your notes easier for your Tutor to use accurately?',
    '2. What difference did you notice between the messy note dump and the clean Study Pack?',
    '3. Were the source-labeling and privacy-exclusion steps clear?',
  ],
  8: [
    '1. Did the 5-Line CER Answer Map help you plan your claim, evidence, and reasoning before drafting?',
    '2. How did coached revision compare with AI replacement writing for keeping your own voice?',
    '3. Were the rules for choosing optional safe Writing Voice samples clear?',
  ],
  9: [
    '1. Was reviewing and downloading personal_learning_knowledge_file.md (File 2 of 6) on PlayIQ clear and straightforward?',
    '2. Could you upload personal_learning_knowledge_file.md into your existing Module 00 PlayIQ Tutor Project and run the read-back check?',
    '3. Was the 6-file PlayIQ Tutor Kit organization easy to follow?',
  ],
  10: [
    '1. Which of the 6 Tutor behavior tests worked right away, and which one needed an instruction adjustment?',
    '2. Did changing one instruction and repeating the same test make your Tutor respond better?',
    '3. How did the 7-step New Idea to Learning loop feel on a real topic?',
  ],
  11: [
    '1. What everyday task or workflow did you choose for your separate My Personal Assistant Project?',
    '2. Did the 9 one-at-a-time discovery questions help you turn a rough idea into a clear Assistant Brief?',
    '3. Was it clear why your Personal Assistant lives in a separate Project from your Module 00 Tutor?',
  ],
  12: [
    '1. How did your Personal Assistant handle the 3 tests (normal request, missing detail, and boundary)?',
    '2. Did revising one instruction and retesting improve your Assistant?',
    '3. Was the reality check on chat text vs. real scheduled reminders helpful?',
  ],
  13: [
    '1. Did this short preview give you fun ideas for what you could build later with your Module 1 Character Guardrail Card?',
    '2. Was it clear that this module is an optional possibility preview with no required homework or upload?',
  ],
  14: [
    '1. Which topic and which Track A–E skills demonstration did you choose for your Master Trial?',
    '2. Did your Learning Dashboard help you see how your hypotheses evolved from Module 00 to Module 14?',
    '3. Looking back across all 15 modules, what is the biggest change in how you learn and build with AI?',
  ],
};

export interface ModuleLearningRecordPanelProps {
  moduleNumber: number;
  showBlockerOnly?: boolean;
  showChoices?: boolean;
  showRecordForm?: boolean;
  showBetaFeedback?: boolean;
  activityFilterIds?: string[];
  title?: string;
}

export default function ModuleLearningRecordPanel({
  moduleNumber,
  showBlockerOnly = false,
  showChoices = true,
  showRecordForm = true,
  showBetaFeedback = false,
  activityFilterIds,
  title,
}: ModuleLearningRecordPanelProps) {
  const fields = MODULE_FIELDS[moduleNumber] ?? [];
  const allModuleActivities = activitiesForModule(moduleNumber);
  const activities = activityFilterIds
    ? allModuleActivities.filter(a => activityFilterIds.includes(a.id))
    : allModuleActivities;

  const [loading, setLoading] = useState(!showBlockerOnly);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [choices, setChoices] = useState<LessonChoices>({});
  const [savedChoices, setSavedChoices] = useState<LessonChoices>({});
  const [choicePendingId, setChoicePendingId] = useState<string | null>(null);
  const [choiceError, setChoiceError] = useState<{ id: string; message: string } | null>(null);
  const [includeInTutor, setIncludeInTutor] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | undefined>(undefined);
  const [allRecords, setAllRecords] = useState<InteractiveModuleLearningRecord[]>([]);
  const [savingRecord, setSavingRecord] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [recordConfirmedMsg, setRecordConfirmedMsg] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedKnowledgeMd, setCopiedKnowledgeMd] = useState(false);
  const [showKnowledgePreview, setShowKnowledgePreview] = useState(false);

  const [betaRating, setBetaRating] = useState<number>(5);
  const [betaText, setBetaText] = useState<string>('');
  const [betaSaving, setBetaSaving] = useState(false);
  const [betaMsg, setBetaMsg] = useState<string | null>(null);
  const [betaErr, setBetaErr] = useState<string | null>(null);

  useEffect(() => {
    if (showBlockerOnly) return;
    let active = true;
    async function load() {
      setLoading(true);
      setLoadError(null);
      const res = await loadInteractiveModuleRecordState(moduleNumber);
      if (!active) return;
      if (!res.ok) {
        setLoadError(res.error);
        setLoading(false);
        return;
      }

      const loadedAnswers = { ...(res.record?.answers ?? {}) };
      if (moduleNumber === 0 && res.legacyAssessment) {
        if (!loadedAnswers.rescueSubject && res.legacyAssessment.rescue_target_subject) {
          loadedAnswers.rescueSubject = res.legacyAssessment.rescue_target_subject;
        }
        if (!loadedAnswers.advanceSubject && res.legacyAssessment.advance_target_subject) {
          loadedAnswers.advanceSubject = res.legacyAssessment.advance_target_subject;
        }
        if (!loadedAnswers.personalGoal && res.legacyAssessment.personal_goal) {
          loadedAnswers.personalGoal = res.legacyAssessment.personal_goal;
        }
        if (!loadedAnswers.explanationSignal && res.legacyAssessment.explanation_style) {
          loadedAnswers.explanationSignal = `Starting hypothesis from assessment: ${res.legacyAssessment.explanation_style}`;
        }
        if (!loadedAnswers.pacingSignal && res.legacyAssessment.pacing_preference) {
          loadedAnswers.pacingSignal = `Starting hypothesis from assessment: ${res.legacyAssessment.pacing_preference}`;
        }
        if (!loadedAnswers.challengeResponse && res.legacyAssessment.challenge_response) {
          loadedAnswers.challengeResponse = `Starting hypothesis from assessment: ${res.legacyAssessment.challenge_response}`;
        }
      }

      const parsedChoices = parseLessonChoices(loadedAnswers.lessonChoices, moduleNumber);
      setAnswers(loadedAnswers);
      setChoices(parsedChoices);
      setSavedChoices(parsedChoices);
      setIncludeInTutor(Boolean(res.record?.includeInTutor));
      setCompleted(Boolean(res.record?.completed));
      setUpdatedAt(res.record?.updatedAt);
      setAllRecords(res.allRecords);
      if (res.betaFeedback) {
        setBetaRating(res.betaFeedback.rating);
        setBetaText(res.betaFeedback.feedback);
      }
      setLoading(false);
    }
    void load();
    return () => {
      active = false;
    };
  }, [moduleNumber, showBlockerOnly]);

  const knowledgeFileExport = useMemo(() => {
    if (moduleNumber !== 9) return null;
    try {
      const m0 = allRecords.find(r => r.moduleNumber === 0);
      return buildPersonalLearningKnowledgeFile(
        {
          records: allRecords,
          assessmentProfile: m0?.assessmentContext ?? null,
        },
        'beta',
        new Date().toISOString(),
      );
    } catch {
      return null;
    }
  }, [allRecords, moduleNumber]);

  async function handleChoose(activityId: string, optionId: string) {
    setChoices(prev => ({ ...prev, [activityId]: optionId }));
    setChoicePendingId(activityId);
    setChoiceError(null);
    const res = await saveInteractiveLessonChoice(moduleNumber, activityId, optionId);
    setChoicePendingId(null);
    if (!res.ok) {
      setChoiceError({ id: activityId, message: res.error });
      return;
    }
    setChoices(res.choices);
    setSavedChoices(res.choices);
    setAnswers(prev => ({ ...prev, lessonChoices: JSON.stringify(res.choices) }));
    if (res.updatedAt) setUpdatedAt(res.updatedAt);
  }

  async function handleSaveRecord(markComplete: boolean) {
    setSavingRecord(true);
    setRecordError(null);
    setRecordConfirmedMsg(null);
    const payloadAnswers: Record<string, string> = { ...answers };
    if (moduleNumber !== 13 && Object.keys(savedChoices).length > 0) {
      payloadAnswers.lessonChoices = JSON.stringify(savedChoices);
    }
    const nextCompleted = markComplete ? true : completed;
    const res = await saveInteractiveModuleRecord(moduleNumber, payloadAnswers, includeInTutor, nextCompleted);
    setSavingRecord(false);
    if (!res.ok) {
      setRecordError(res.error);
      return;
    }
    setAnswers(res.record.answers);
    setIncludeInTutor(res.record.includeInTutor);
    setCompleted(res.record.completed);
    setUpdatedAt(res.record.updatedAt);
    setAllRecords(prev => {
      const others = prev.filter(r => r.moduleNumber !== moduleNumber);
      return [...others, res.record].sort((a, b) => a.moduleNumber - b.moduleNumber);
    });
    setRecordConfirmedMsg(
      res.record.completed
        ? `Confirmed saved & marked complete (${res.record.updatedAt ? new Date(res.record.updatedAt).toLocaleTimeString() : 'just now'}). Reopen this page anytime to verify your saved answers.`
        : `Draft confirmed saved (${res.record.updatedAt ? new Date(res.record.updatedAt).toLocaleTimeString() : 'just now'}).`,
    );
  }

  async function handleSaveBeta(e: React.FormEvent) {
    e.preventDefault();
    setBetaSaving(true);
    setBetaMsg(null);
    setBetaErr(null);
    const res = await saveInteractiveBetaFeedback(moduleNumber, betaRating, betaText);
    setBetaSaving(false);
    if (!res.ok) {
      setBetaErr(res.error);
      return;
    }
    setBetaMsg('Beta reflection saved and confirmed.');
  }

  function handleDownloadKnowledgeFile() {
    const m0 = allRecords.find(r => r.moduleNumber === 0);
    const { markdown, filename } = buildPersonalLearningKnowledgeFile(
      {
        records: allRecords,
        assessmentProfile: m0?.assessmentContext ?? null,
      },
      'beta',
      new Date().toISOString(),
    );
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const checkpointPrompt = TUTOR_CHECKPOINT_PROMPTS[moduleNumber];
  const betaPrompts = BETA_REFLECTION_PROMPTS[moduleNumber];

  if (showBlockerOnly) {
    return (
      <div className="my-6 w-full mx-auto" style={{ width: '100%', margin: '24px auto' }}>
        <BetaBlockerReport
          shell="beta"
          moduleNumber={moduleNumber}
          submit={submitInteractiveCourseBlocker}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 my-8 w-full mx-auto" style={{ width: '100%', margin: '32px auto' }}>
      {/* Beta Technical Problem Report — Always available before module completion */}
      <BetaBlockerReport
        shell="beta"
        moduleNumber={moduleNumber}
        submit={submitInteractiveCourseBlocker}
      />

      {/* Where Your Answers Go Banner */}
      <section
        className="p-6 rounded-xl border font-mono text-xs leading-relaxed space-y-3"
        style={{ background: 'rgba(13, 22, 38, 0.85)', borderColor: 'rgba(0, 200, 255, 0.3)' }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider font-display text-[#00c8ff]">
            {title || `Module ${moduleNumber === 0 ? '00' : moduleNumber} • Where Your Answers Go & Learning Record`}
          </h3>
          {updatedAt && (
            <span className="text-[11px] px-2.5 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/40 text-emerald-300">
              ✓ Saved on PlayIQ ({new Date(updatedAt).toLocaleString()})
            </span>
          )}
        </div>
        {moduleNumber === 13 ? (
          <p className="text-slate-300 font-sans text-sm">
            Module 13 is a short possibility preview showing how your Module 1 <code className="text-[#00c8ff]">Character Guardrail Card</code> can grow into a future story, storyboard, or cartoon short. <strong>No answer, quiz, artifact, or Tutor upload is required</strong> to complete this module—you may optionally jot down a future idea below or mark the preview complete right away.
          </p>
        ) : (
          <>
            <p className="text-slate-300 font-sans text-sm">
              Use the learning-answer area below on this PlayIQ page for the short answers, actual experiment results, and provisional settings you choose to keep. Review the wording, mark only accurate, privacy-safe information as approved, then click <strong>Save</strong> and wait for confirmation before leaving.
            </p>
            <p className="text-slate-400 font-sans text-xs">
              Your external <strong>PlayIQ Tutor Project</strong> (in your parent-approved ChatGPT, Claude, or Gemini account from Module 00) and your separate <strong>My Personal Assistant Project</strong> (started in Module 11) are external workspaces. PlayIQ cannot read those external chats, and printed workbooks do not sync automatically. In <strong>Module 9</strong>, you review and download your saved, approved Module 00–8 answers from PlayIQ as <code className="text-[#00c8ff]">personal_learning_knowledge_file.md</code> — File 2 of your 6 Tutor files, replacing <code className="text-slate-300">student_tutor_profile.md</code> (never a 7th file).
            </p>
          </>
        )}
      </section>

      {loading && (
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 font-mono text-xs">
          Loading your saved Module {moduleNumber === 0 ? '00' : moduleNumber} learning record...
        </div>
      )}

      {loadError && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/30 text-red-200 font-mono text-xs">
          ⚠️ {loadError}
        </div>
      )}

      {/* Module 9 Exclusive: Review & Download personal_learning_knowledge_file.md (File 2 of 6) */}
      {!loading && moduleNumber === 9 && knowledgeFileExport && (
        <section
          className="p-6 rounded-xl border space-y-5"
          style={{ background: 'rgba(16, 185, 129, 0.06)', borderColor: 'rgba(57, 255, 20, 0.4)' }}
        >
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#39ff14] mb-1">
                Module 9 • File 2 of 6 (Replaces student_tutor_profile.md)
              </p>
              <h4 className="text-lg font-bold font-display text-white">
                Review &amp; Download <code className="text-[#00c8ff]">personal_learning_knowledge_file.md</code>
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                This file compiles only your saved, student-approved learning records from <strong>Modules 00–08</strong>. It gives your Tutor contextual personalization inside your existing Module 00 <code className="text-[#00c8ff]">PlayIQ Tutor Project</code> (it is context, not base-model fine-tuning). Missing or unapproved modules are explicitly marked <code className="text-amber-300">missing</code> or <code className="text-amber-300">excluded</code> so your Tutor never guesses.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadKnowledgeFile}
                className="px-4 py-2.5 rounded-lg border border-[#39ff14] bg-[#39ff14]/15 text-[#39ff14] hover:bg-[#39ff14]/25 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                ⬇ Download personal_learning_knowledge_file.md
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(knowledgeFileExport.markdown);
                    setCopiedKnowledgeMd(true);
                    setTimeout(() => setCopiedKnowledgeMd(false), 2500);
                  } catch {
                    setCopiedKnowledgeMd(false);
                  }
                }}
                className="px-3.5 py-2.5 rounded-lg border border-[#00c8ff] text-[#00c8ff] hover:bg-[#00c8ff]/15 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {copiedKnowledgeMd ? '✓ Copied File Markdown' : 'Copy Markdown'}
              </button>
            </div>
          </div>

          {/* Module 00-08 Coverage Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(mNum => {
              const rec = allRecords.find(r => r.moduleNumber === mNum);
              const isApproved = Boolean(rec?.includeInTutor);
              const isDone = Boolean(rec?.completed);
              return (
                <div
                  key={mNum}
                  className="p-2.5 rounded-lg border text-center font-mono text-xs"
                  style={{
                    borderColor: isApproved
                      ? 'rgba(57, 255, 20, 0.45)'
                      : rec
                        ? 'rgba(245, 197, 24, 0.45)'
                        : 'rgba(148, 163, 184, 0.25)',
                    background: isApproved
                      ? 'rgba(16, 185, 129, 0.12)'
                      : rec
                        ? 'rgba(245, 197, 24, 0.08)'
                        : 'rgba(15, 23, 42, 0.6)',
                  }}
                >
                  <div className="font-bold text-white">M{String(mNum).padStart(2, '0')}</div>
                  <div
                    className={`text-[10px] mt-0.5 ${
                      isApproved ? 'text-[#39ff14]' : rec ? 'text-amber-300' : 'text-slate-400'
                    }`}
                  >
                    {isApproved ? (isDone ? '✓ Approved' : 'Draft OK') : rec ? 'Excluded' : 'Missing'}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono text-slate-300">
            <span>
              Missing / excluded / unfinished modules:{' '}
              <strong className="text-amber-300">
                {knowledgeFileExport.missingModules.length
                  ? knowledgeFileExport.missingModules.map(n => `M${String(n).padStart(2, '0')}`).join(', ')
                  : 'None — all M00–M08 approved!'}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => setShowKnowledgePreview(prev => !prev)}
              className="text-[#00c8ff] underline cursor-pointer"
            >
              {showKnowledgePreview ? 'Hide Markdown Preview ▲' : 'Inspect Full Markdown Before Upload ▼'}
            </button>
          </div>

          {showKnowledgePreview && (
            <pre className="p-4 rounded-lg bg-black/70 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed">
              {knowledgeFileExport.markdown}
            </pre>
          )}
        </section>
      )}

      {/* Digital Lesson Choices */}
      {!loading && showChoices && activities.length > 0 && (
        <section
          className="p-6 rounded-xl border space-y-6"
          style={{ background: 'var(--space-card)', borderColor: 'var(--glass-border)' }}
        >
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[#00c8ff] mb-1">
              Interactive Digital Lesson Choices
            </p>
            <h4 className="text-lg font-bold font-display text-white">
              Select &amp; Confirm Your Lesson Responses
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Each choice saves directly to your PlayIQ module draft with server confirmation. Remaining underlines in printed examples are workbook lines, not broken buttons.
            </p>
          </div>

          <div className="space-y-5">
            {activities.map(activity => {
              const selected = choices[activity.id];
              const saved = savedChoices[activity.id];
              const isPending = choicePendingId === activity.id;
              const err = choiceError?.id === activity.id ? choiceError.message : undefined;
              const isConfirmed = Boolean(selected && selected === saved && !isPending && !err);

              return (
                <div
                  key={activity.id}
                  data-lesson-activity={activity.id}
                  className="p-4 rounded-lg border bg-slate-950/60 space-y-3"
                  style={{ borderColor: isConfirmed ? 'rgba(57, 255, 20, 0.35)' : 'rgba(148, 163, 184, 0.2)' }}
                >
                  <p className="text-sm font-semibold text-slate-100">{activity.question}</p>
                  <div className="space-y-2">
                    {activity.options.map(option => (
                      <label
                        key={option.id}
                        className="flex items-start gap-3 p-2.5 rounded border cursor-pointer transition-colors text-xs sm:text-sm"
                        style={{
                          borderColor: selected === option.id ? 'var(--neon-cyan)' : 'rgba(51, 65, 85, 0.6)',
                          background: selected === option.id ? 'rgba(0, 200, 255, 0.08)' : 'rgba(15, 23, 42, 0.5)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <input
                          type="radio"
                          name={activity.id}
                          value={option.id}
                          checked={selected === option.id}
                          onChange={() => void handleChoose(activity.id, option.id)}
                          className="mt-0.5 accent-[#00c8ff]"
                        />
                        <span>
                          <strong className="text-[#00c8ff] font-mono mr-1.5">{option.id}.</strong>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="text-xs font-mono flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span
                      className={
                        err
                          ? 'text-red-400'
                          : isConfirmed
                            ? 'text-[#39ff14]'
                            : 'text-slate-400'
                      }
                    >
                      {isPending
                        ? 'Saving your choice. Wait for server confirmation…'
                        : err
                          ? `Not confirmed saved: ${err}`
                          : isConfirmed
                            ? '✓ Choice confirmed saved. It will be available when you return.'
                            : 'Choose one option to save to your lesson draft.'}
                    </span>
                    {err && selected && (
                      <button
                        type="button"
                        onClick={() => void handleChoose(activity.id, selected)}
                        className="px-3 py-1 rounded border border-red-400 text-red-200 hover:bg-red-950/50 text-xs"
                      >
                        Retry saving choice
                      </button>
                    )}
                  </div>
                  {isConfirmed && (
                    <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded border border-slate-800">
                      <strong className="text-[#00c8ff]">Next:</strong> {activity.nextStep}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* External Tutor / Assistant Project Checkpoint Prompt */}
      {!loading && showRecordForm && checkpointPrompt && (
        <section
          className="p-6 rounded-xl border space-y-4"
          style={{ background: 'rgba(123, 79, 206, 0.08)', borderColor: 'rgba(123, 79, 206, 0.4)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#a78bfa]">
                {moduleNumber === 11 || moduleNumber === 12
                  ? 'Separate My Personal Assistant Project Checkpoint'
                  : 'External PlayIQ Tutor Project Checkpoint'}
              </p>
              <h4 className="text-base font-bold font-display text-white">
                {moduleNumber === 11 || moduleNumber === 12
                  ? 'Run This in Your Separate My Personal Assistant Project'
                  : 'Update Your Same Module 00 PlayIQ Tutor Project'}
              </h4>
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(checkpointPrompt);
                  setCopiedPrompt(true);
                  setTimeout(() => setCopiedPrompt(false), 2500);
                } catch {
                  setCopiedPrompt(false);
                }
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-[#7b4fce] text-[#c4b5fd] hover:bg-[#7b4fce]/20 transition-colors cursor-pointer"
            >
              {copiedPrompt ? '✓ Copied Prompt' : 'Copy Checkpoint Prompt'}
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {moduleNumber === 11 || moduleNumber === 12 ? (
              <>
                Open your separate <strong>My Personal Assistant</strong> Project (never mix Assistant task files into your Module 00 Tutor Project). Paste this prompt along with only the safe workflow details you choose to share, then record your verified results below:
              </>
            ) : (
              <>
                Open the same <strong>PlayIQ Tutor Project</strong> you created in Module 00. Paste this prompt along with only the answers you choose to share, review Orion&apos;s proposed Course Learning Record entry, and bring your approved summary back to the PlayIQ fields below:
              </>
            )}
          </p>
          <pre className="p-4 rounded-lg bg-black/60 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
            {checkpointPrompt}
          </pre>
        </section>
      )}

      {/* Module Learning Record Fields */}
      {!loading && showRecordForm && fields.length > 0 && (
        <section
          className="p-6 rounded-xl border space-y-6"
          style={{ background: 'var(--space-card)', borderColor: 'var(--neon-cyan)' }}
        >
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[#00c8ff] mb-1">
              {moduleNumber <= 8
                ? `Personal Learning Knowledge File Input • Module ${moduleNumber === 0 ? '00' : moduleNumber}`
                : `PlayIQ Course Learning Record • Module ${moduleNumber}`}
            </p>
            <h4 className="text-xl font-bold font-display text-white">
              {moduleNumber === 13
                ? 'Optional: Save a Future Character / Story Idea (Not Required)'
                : `Save Your Approved Module ${moduleNumber === 0 ? '00' : moduleNumber} Learning Answers on PlayIQ`}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {moduleNumber === 13
                ? 'No written answer, project, or upload is required to complete Module 13. You can leave this blank and click "Save & Confirm Module Learning Record" to mark the preview complete, or jot down a fun idea for later.'
                : 'Enter what you actually did or observed, separately from what you prefer. Treat learning preferences as testable hypotheses, not fixed labels or diagnoses. Leave unknown or unrun items as not tested or MISSING_INPUT — never guess or include passwords, home addresses, or private family details.'}
            </p>
          </div>

          <div className="space-y-4">
            {fields
              .filter(field => field.key !== 'lessonChoices')
              .map(field => (
                <div key={field.key} className="space-y-1.5">
                  <label
                    htmlFor={`lr-${moduleNumber}-${field.key}`}
                    className="block text-xs font-mono font-semibold text-slate-200"
                  >
                    {field.label}
                  </label>
                  {field.help && (
                    <p className="text-[11px] text-slate-400">{field.help}</p>
                  )}
                  <textarea
                    id={`lr-${moduleNumber}-${field.key}`}
                    rows={2}
                    maxLength={6000}
                    value={answers[field.key] ?? ''}
                    onChange={e => {
                      const val = e.target.value;
                      setAnswers(prev => ({ ...prev, [field.key]: val }));
                      setRecordConfirmedMsg(null);
                    }}
                    placeholder={
                      moduleNumber === 13
                        ? 'Optional: jot down a future character/story idea, or leave blank...'
                        : 'Enter your actual observation, setting, or MISSING_INPUT / not tested...'
                    }
                    className="w-full rounded-lg bg-black/60 border border-slate-700 focus:border-[#00c8ff] p-3 text-xs sm:text-sm font-mono text-slate-100 outline-none"
                  />
                </div>
              ))}
          </div>

          {moduleNumber <= 8 && (
            <label className="flex items-start gap-3 p-4 rounded-lg border border-slate-700 bg-slate-900/70 cursor-pointer text-xs sm:text-sm text-slate-200">
              <input
                type="checkbox"
                checked={includeInTutor}
                onChange={e => {
                  setIncludeInTutor(e.target.checked);
                  setRecordConfirmedMsg(null);
                }}
                className="mt-1 accent-[#39ff14]"
              />
              <span>
                <strong>Approve for my Personal Learning Knowledge File:</strong> I reviewed this module&apos;s answers (with my parent/guardian if unsure), excluded private or unapproved details, and approve including this record when Module 9 builds <code className="text-[#00c8ff]">personal_learning_knowledge_file.md</code>.
              </span>
            </label>
          )}

          {recordError && (
            <div className="p-3 rounded-lg border border-red-500/40 bg-red-950/40 text-red-200 text-xs font-mono" role="alert">
              ⚠️ {recordError}
            </div>
          )}

          {recordConfirmedMsg && (
            <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs font-mono" role="status">
              ✓ {recordConfirmedMsg}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              disabled={savingRecord}
              onClick={() => void handleSaveRecord(false)}
              className="px-5 py-2.5 rounded-lg border border-[#00c8ff] text-[#00c8ff] hover:bg-[#00c8ff]/10 font-mono text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
            >
              {savingRecord ? 'Saving…' : 'Save Draft'}
            </button>
            <button
              type="button"
              disabled={savingRecord}
              onClick={() => void handleSaveRecord(true)}
              className="px-6 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-opacity disabled:opacity-50 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #00c8ff, #7b4fce)', color: '#fff' }}
            >
              {savingRecord
                ? 'Confirming Save…'
                : moduleNumber === 13
                  ? 'Confirm Module 13 Preview Complete'
                  : 'Save & Confirm Module Learning Record'}
            </button>
            {moduleNumber === 9 && (
              <button
                type="button"
                onClick={handleDownloadKnowledgeFile}
                className="px-5 py-2.5 rounded-lg border border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14]/10 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                ⬇ Download personal_learning_knowledge_file.md (File 2 of 6)
              </button>
            )}
          </div>
        </section>
      )}

      {/* Optional Beta Reflection Survey */}
      {!loading && showBetaFeedback && betaPrompts && (
        <section
          className="p-6 rounded-xl border space-y-4"
          style={{ background: 'rgba(17, 24, 39, 0.85)', borderColor: 'rgba(123, 79, 206, 0.4)' }}
        >
          <h4 className="text-base font-bold uppercase tracking-wider font-display text-[#c4b5fd]">
            Beta Tester Reflection (Module {moduleNumber === 0 ? '00' : moduleNumber})
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-5">
            {betaPrompts.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
          <form onSubmit={handleSaveBeta} className="space-y-4 pt-2">
            <div className="flex items-center gap-3 font-mono text-xs text-slate-200">
              <span>Module Rating (1–5):</span>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setBetaRating(star)}
                  className={`px-3 py-1 rounded border font-bold ${
                    betaRating === star
                      ? 'border-[#00c8ff] bg-[#00c8ff]/20 text-[#00c8ff]'
                      : 'border-slate-700 text-slate-400'
                  }`}
                >
                  {star} ★
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              maxLength={4000}
              value={betaText}
              onChange={e => setBetaText(e.target.value)}
              placeholder="Share your honest beta notes on the questions above (do not include passwords or private details)..."
              className="w-full rounded-lg bg-black/60 border border-slate-700 focus:border-[#7b4fce] p-3 text-xs font-mono text-slate-100 outline-none"
            />
            {betaErr && <p className="text-xs font-mono text-red-400">⚠️ {betaErr}</p>}
            {betaMsg && <p className="text-xs font-mono text-emerald-400">✓ {betaMsg}</p>}
            <button
              type="submit"
              disabled={betaSaving}
              className="px-5 py-2 rounded-lg border border-[#7b4fce] text-[#c4b5fd] hover:bg-[#7b4fce]/20 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              {betaSaving ? 'Saving Beta Reflection…' : 'Save Beta Reflection'}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
