'use client';

import React, { useState, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import OrionTypingEffect from './OrionTypingEffect';
import ScenarioCard from './ScenarioCard';
import { BaselineTask1, BaselineTask2, BaselineTask3 } from './BaselineChallenge';
import LearningBlueprint from './LearningBlueprint';
import {
  savePhase1,
  savePhase2,
  savePhase3,
  savePhase4,
  completeAssessment,
  finishAssessmentAction,
} from '@/app/(dashboard)/student/assessment/actions';
import type { LearningBlueprintData } from '@/lib/assessment/assessment-reveal';

// ── Types ───────────────────────────────────────────────────────────────────

interface OrionAssessmentProps {
  initialPhase: number;
  existingProfile: Record<string, unknown> | null;
  studentName: string;
}

interface DiagnosticAnswers {
  q1: string | null; // explanation style
  q2: string | null; // pacing preference
  q3: string | null; // challenge response
  q4: string | null; // AI literacy
  q5: string | null; // motivation driver
}

// ── Diagnostic Questions ────────────────────────────────────────────────────

const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'q1',
    scenario:
      'Your teacher just explained something complicated. You didn\'t fully get it. What do you do?',
    options: [
      { id: 'A', text: 'Ask for a simpler version with an example' },
      { id: 'B', text: 'Try to figure it out step by step on my own first' },
      { id: 'C', text: 'Look for a visual or diagram that shows how it works' },
    ],
    signalMap: { A: 'verbal', B: 'analytical', C: 'visual' } as Record<string, string>,
  },
  {
    id: 'q2',
    scenario: 'You\'re learning something new. Which feels better?',
    options: [
      { id: 'A', text: 'Go slow, make sure I understand each part before moving on' },
      { id: 'B', text: 'Get the big picture first, then fill in the details' },
    ],
    signalMap: { A: 'sequential', B: 'top_down' } as Record<string, string>,
  },
  {
    id: 'q3',
    scenario:
      'You hit a problem you don\'t understand at all. What\'s your honest first move?',
    options: [
      { id: 'A', text: 'Push through it until I figure it out' },
      { id: 'B', text: 'Ask for help or a hint quickly' },
      { id: 'C', text: 'Take a break and come back to it later' },
    ],
    signalMap: { A: 'push_through', B: 'ask_help', C: 'take_break' } as Record<string, string>,
  },
  {
    id: 'q4',
    scenario:
      'Be honest. When you use AI for school right now — what are you mostly doing?',
    options: [
      { id: 'A', text: 'Getting answers to questions or homework' },
      { id: 'B', text: 'Getting explanations to help me understand' },
      { id: 'C', text: 'I don\'t really use AI for school yet' },
      { id: 'D', text: 'I use it a lot, in a bunch of different ways' },
    ],
    signalMap: { A: 'answer_seeking', B: 'explanation_seeking', C: 'not_using', D: 'power_user' } as Record<string, string>,
  },
  {
    id: 'q5',
    scenario:
      'What would actually make you want to study more — if you\'re being real?',
    options: [
      { id: 'A', text: 'Seeing that I\'m actually getting better and smarter' },
      { id: 'B', text: 'Feeling like I\'m ahead of other students' },
      { id: 'C', text: 'Building things and skills that matter in real life' },
      { id: 'D', text: 'Leveling up and earning recognition for what I\'ve done' },
    ],
    signalMap: { A: 'mastery', B: 'competitive', C: 'purpose', D: 'identity' } as Record<string, string>,
  },
];

// ── Orion Opening Script Lines ──────────────────────────────────────────────

const ORION_OPENING_LINES = [
  "Hey. I'm Orion.",
  'Before we start — I need to learn something about you.',
  "Most AI just gives you answers. I don't. I'm here to make you smarter than the AI.",
  'But to do that right — I need to know how your brain actually works.',
  "This takes about 10 minutes. And what you share right now shapes everything that comes after.",
];

const ORION_BASELINE_INTRO = [
  "Now I'm going to show you three quick challenges.",
  "Don't overthink them. Just go with your gut. I'm not grading you — I'm learning how you think right now.",
];

const ORION_POST_BASELINE = [
  "Good. I have what I need.",
  "That's your starting point. By the time you finish this program, you're going to look back at this moment and see exactly how far you've come.",
];

const ORION_VISION_LINES = [
  "Here's what's actually possible for you starting today.",
  "None of this is a promise. It's a possibility. And whether it happens depends on what you do next.",
];

// ── Main Component ──────────────────────────────────────────────────────────

export default function OrionAssessment({
  initialPhase,
  existingProfile,
  studentName,
}: OrionAssessmentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Flow state
  const [phase, setPhase] = useState(initialPhase);
  const [subStep, setSubStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Phase 1 state
  const [displayName, setDisplayName] = useState(
    (existingProfile?.display_name as string) || studentName || '',
  );
  const [gradeLevel, setGradeLevel] = useState(
    (existingProfile?.grade_level as string) || '',
  );
  const [learnerType, setLearnerType] = useState(
    (existingProfile?.learner_type as string) || 'student',
  );
  const [openingComplete, setOpeningComplete] = useState(false);

  // Phase 2 state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<DiagnosticAnswers>({
    q1: (existingProfile?.explanation_style as string) ? 'preset' : null,
    q2: (existingProfile?.pacing_preference as string) ? 'preset' : null,
    q3: (existingProfile?.challenge_response as string) ? 'preset' : null,
    q4: (existingProfile?.ai_literacy_level as string) ? 'preset' : null,
    q5: (existingProfile?.motivation_driver as string) ? 'preset' : null,
  });

  // Phase 3 state
  const [baselineStep, setBaselineStep] = useState(0); // 0 = intro, 1-3 = tasks
  const [task1Answer, setTask1Answer] = useState<string | null>(null);
  const [task2Response, setTask2Response] = useState('');
  const [task3Response, setTask3Response] = useState('');
  const [baselineIntroComplete, setBaselineIntroComplete] = useState(false);
  const [baselineIntroTyped, setBaselineIntroTyped] = useState(false);

  // Phase 4 state
  const [rescueSubject, setRescueSubject] = useState(
    (existingProfile?.rescue_target_subject as string) || '',
  );
  const [advanceSubject, setAdvanceSubject] = useState(
    (existingProfile?.advance_target_subject as string) || '',
  );
  const [personalGoal, setPersonalGoal] = useState(
    (existingProfile?.personal_goal as string) || '',
  );
  const [schoolQuestionStep, setSchoolQuestionStep] = useState(0);

  // Phase 5 state
  const [revealSummary, setRevealSummary] = useState('');
  const [visionOutcomes, setVisionOutcomes] = useState<string[]>([]);
  const [blueprint, setBlueprint] = useState<LearningBlueprintData | null>(null);
  const [revealStep, setRevealStep] = useState(0); // 0=generating, 1=summary, 2=vision, 3=blueprint
  const [postBaselineComplete, setPostBaselineComplete] = useState(false);
  const [postBaselineTyped, setPostBaselineTyped] = useState(false);

  // ── Phase transitions ─────────────────────────────────────────────────────

  const transitionTo = useCallback((nextPhase: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setPhase(nextPhase);
      setSubStep(0);
      setIsTransitioning(false);
    }, 500);
  }, []);

  // ── Phase 1 Submit ────────────────────────────────────────────────────────

  const handlePhase1Submit = () => {
    if (!displayName.trim() || !gradeLevel) return;
    setError(null);
    startTransition(async () => {
      try {
        await savePhase1({ displayName: displayName.trim(), gradeLevel, learnerType });
        transitionTo(2);
      } catch (err) {
        setError('Failed to save. Please try again.');
      }
    });
  };

  // ── Phase 2 Submit ────────────────────────────────────────────────────────

  const handleDiagnosticSelect = (questionId: string, optionId: string) => {
    setDiagnosticAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    // Auto-advance to next question after brief delay
    setTimeout(() => {
      if (currentQuestion < DIAGNOSTIC_QUESTIONS.length - 1) {
        setCurrentQuestion((c) => c + 1);
      }
    }, 400);
  };

  const handlePhase2Submit = () => {
    const q = DIAGNOSTIC_QUESTIONS;
    const a = diagnosticAnswers;
    if (!a.q1 || !a.q2 || !a.q3 || !a.q4 || !a.q5) return;

    setError(null);
    startTransition(async () => {
      try {
        await savePhase2({
          explanationStyle: q[0].signalMap[a.q1!] || 'visual',
          pacingPreference: q[1].signalMap[a.q2!] || 'top_down',
          challengeResponse: q[2].signalMap[a.q3!] || 'push_through',
          aiLiteracyLevel: q[3].signalMap[a.q4!] || 'answer_seeking',
          motivationDriver: q[4].signalMap[a.q5!] || 'mastery',
        });
        transitionTo(3);
      } catch {
        setError('Failed to save. Please try again.');
      }
    });
  };

  // ── Phase 3 Submit ────────────────────────────────────────────────────────

  const handlePhase3Submit = () => {
    if (!task1Answer || task2Response.trim().length < 10 || task3Response.trim().length < 10) return;

    setError(null);
    startTransition(async () => {
      try {
        await savePhase3({
          task1Answer,
          task2Response: task2Response.trim(),
          task3Response: task3Response.trim(),
        });
        setBaselineStep(4); // show post-baseline Orion message
      } catch {
        setError('Failed to save. Please try again.');
      }
    });
  };

  // ── Phase 4 Submit ────────────────────────────────────────────────────────

  const handlePhase4Submit = () => {
    if (!rescueSubject.trim() || !advanceSubject.trim() || !personalGoal.trim()) return;

    setError(null);
    startTransition(async () => {
      try {
        await savePhase4({
          rescueTargetSubject: rescueSubject.trim(),
          advanceTargetSubject: advanceSubject.trim(),
          personalGoal: personalGoal.trim(),
        });
        transitionTo(5);
      } catch {
        setError('Failed to save. Please try again.');
      }
    });
  };

  // ── Phase 5 Complete ──────────────────────────────────────────────────────

  const handleGenerateReveal = () => {
    setError(null);
    setRevealStep(0);
    startTransition(async () => {
      try {
        const result = await completeAssessment();
        setRevealSummary(result.revealSummary);
        setVisionOutcomes(result.visionOutcomes);
        setBlueprint(result.blueprint as LearningBlueprintData);
        setRevealStep(1);
      } catch {
        setError('Failed to generate your reveal. Please try again.');
      }
    });
  };

  const handleFinish = () => {
    setError(null);
    startTransition(async () => {
      try {
        await finishAssessmentAction();
        router.push('/student/home');
      } catch {
        setError('Failed to finish assessment. Please try again.');
      }
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={`assessment-container ${isTransitioning ? 'assessment-fade-out' : 'assessment-fade-in'}`}>
      {error && (
        <div className="assessment-error">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="ml-2 font-bold">×</button>
        </div>
      )}

      {/* ═══ PHASE 1: Orion Opens ═══════════════════════════════════════════ */}
      {phase === 1 && (
        <div className="assessment-phase">
          {/* Orion avatar / brand mark */}
          <div className="assessment-orion-avatar overflow-hidden relative">
            <img src="/images/orion-avatar.png" alt="Orion AI" className="w-full h-full object-cover rounded-full" />
          </div>

          <OrionTypingEffect
            lines={ORION_OPENING_LINES}
            speed={25}
            lineDelay={500}
            onComplete={() => setOpeningComplete(true)}
            className="mb-8"
          />

          {openingComplete && (
            <div className="assessment-form-section">
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="assessment-label">What should I call you?</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name or nickname"
                    className="assessment-input"
                    maxLength={50}
                    autoFocus
                  />
                </div>

                {/* Grade */}
                <div>
                  <label className="assessment-label">What grade or level are you?</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { value: 'middle', label: 'Middle School' },
                      { value: 'high', label: 'High School' },
                      { value: 'college', label: 'College' },
                      { value: 'adult', label: 'Adult Learner' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setGradeLevel(opt.value); setLearnerType(opt.value === 'adult' ? 'adult' : 'student'); }}
                        className={`assessment-option-button text-xs py-3 ${gradeLevel === opt.value ? 'assessment-option-selected' : ''}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handlePhase1Submit}
                  disabled={!displayName.trim() || !gradeLevel || isPending}
                  className="assessment-continue-button"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue →'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ PHASE 2: Learning Style Diagnostic ═══════════════════════════ */}
      {phase === 2 && (
        <div className="assessment-phase">
          <div className="assessment-orion-avatar overflow-hidden relative">
            <img src="/images/orion-avatar.png" alt="Orion AI" className="w-full h-full object-cover rounded-full" />
          </div>

          <p className="text-center text-sm mb-6 font-mono" style={{ color: 'var(--text-muted)' }}>
            {displayName}, I&apos;m going to ask you 5 quick questions. There are no right answers — only signals.
          </p>

          <ScenarioCard
            questionNumber={currentQuestion + 1}
            scenarioText={DIAGNOSTIC_QUESTIONS[currentQuestion].scenario}
            options={DIAGNOSTIC_QUESTIONS[currentQuestion].options}
            selectedOptionId={diagnosticAnswers[DIAGNOSTIC_QUESTIONS[currentQuestion].id as keyof DiagnosticAnswers]}
            onSelect={(optionId) =>
              handleDiagnosticSelect(DIAGNOSTIC_QUESTIONS[currentQuestion].id, optionId)
            }
          />

          {/* Question navigation dots */}
          <div className="flex justify-center gap-2 mt-6">
            {DIAGNOSTIC_QUESTIONS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className="w-2.5 h-2.5 rounded-full transition-all"
                style={{
                  background:
                    diagnosticAnswers[`q${idx + 1}` as keyof DiagnosticAnswers]
                      ? 'var(--neon-cyan)'
                      : idx === currentQuestion
                        ? 'var(--neon-purple)'
                        : 'rgba(100,116,139,0.3)',
                  transform: idx === currentQuestion ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>

          {/* Submit when all answered */}
          {diagnosticAnswers.q1 &&
            diagnosticAnswers.q2 &&
            diagnosticAnswers.q3 &&
            diagnosticAnswers.q4 &&
            diagnosticAnswers.q5 && (
              <button
                onClick={handlePhase2Submit}
                disabled={isPending}
                className="assessment-continue-button mt-6"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lock In My Signals →'}
              </button>
            )}
        </div>
      )}

      {/* ═══ PHASE 3: Baseline Capture ═══════════════════════════════════ */}
      {phase === 3 && (
        <div className="assessment-phase">
          {/* Orion avatar / brand mark */}
          <div className="assessment-orion-avatar overflow-hidden relative">
            <img src="/images/orion-avatar.png" alt="Orion AI" className="w-full h-full object-cover rounded-full" />
          </div>

          {/* Baseline intro typing */}
          {baselineStep === 0 && (
            <>
              <OrionTypingEffect
                lines={ORION_BASELINE_INTRO}
                speed={25}
                lineDelay={500}
                onComplete={() => setBaselineIntroTyped(true)}
                className="mb-8"
              />
              {baselineIntroTyped && (
                <button
                  onClick={() => { setBaselineIntroComplete(true); setBaselineStep(1); }}
                  className="assessment-continue-button mt-4"
                >
                  Start Challenges →
                </button>
              )}
            </>
          )}

          {/* Task 1 */}
          {baselineStep === 1 && (
            <>
              <BaselineTask1
                selectedAnswer={task1Answer}
                onSelect={(answer) => {
                  setTask1Answer(answer);
                  setTimeout(() => setBaselineStep(2), 500);
                }}
              />
            </>
          )}

          {/* Task 2 */}
          {baselineStep === 2 && (
            <>
              <BaselineTask2 response={task2Response} onChange={setTask2Response} />
              <button
                onClick={() => setBaselineStep(3)}
                disabled={task2Response.trim().length < 10}
                className="assessment-continue-button mt-4"
              >
                Next Challenge →
              </button>
            </>
          )}

          {/* Task 3 */}
          {baselineStep === 3 && (
            <>
              <BaselineTask3 response={task3Response} onChange={setTask3Response} />
              <button
                onClick={handlePhase3Submit}
                disabled={task3Response.trim().length < 10 || isPending}
                className="assessment-continue-button mt-4"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Challenges →'}
              </button>
            </>
          )}

          {/* Post-baseline Orion message */}
          {baselineStep === 4 && (
            <>
              <OrionTypingEffect
                lines={ORION_POST_BASELINE}
                speed={25}
                lineDelay={600}
                onComplete={() => setPostBaselineTyped(true)}
                className="mb-8"
              />
              {postBaselineTyped && (
                <button
                  onClick={() => { setPostBaselineComplete(true); transitionTo(4); }}
                  className="assessment-continue-button mt-4"
                >
                  Continue to school check →
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* ═══ PHASE 4: School Reality Check ═══════════════════════════════ */}
      {phase === 4 && (
        <div className="assessment-phase">
          <div className="assessment-orion-avatar overflow-hidden relative">
            <img src="/images/orion-avatar.png" alt="Orion AI" className="w-full h-full object-cover rounded-full" />
          </div>

          {schoolQuestionStep === 0 && (
            <div className="assessment-form-section">
              <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-primary)' }}>
                What&apos;s one subject where you feel lost or behind right now?
              </p>
              <input
                type="text"
                value={rescueSubject}
                onChange={(e) => setRescueSubject(e.target.value)}
                placeholder="e.g. Biology, Math, History..."
                className="assessment-input"
                maxLength={100}
                autoFocus
              />
              <button
                onClick={() => setSchoolQuestionStep(1)}
                disabled={!rescueSubject.trim()}
                className="assessment-continue-button mt-4"
              >
                Next →
              </button>
            </div>
          )}

          {schoolQuestionStep === 1 && (
            <div className="assessment-form-section">
              <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-primary)' }}>
                What&apos;s one subject you&apos;re actually decent at — or want to get way better at?
              </p>
              <input
                type="text"
                value={advanceSubject}
                onChange={(e) => setAdvanceSubject(e.target.value)}
                placeholder="e.g. Computer Science, History, Art..."
                className="assessment-input"
                maxLength={100}
                autoFocus
              />
              <button
                onClick={() => setSchoolQuestionStep(2)}
                disabled={!advanceSubject.trim()}
                className="assessment-continue-button mt-4"
              >
                Next →
              </button>
            </div>
          )}

          {schoolQuestionStep === 2 && (
            <div className="assessment-form-section">
              <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-primary)' }}>
                If PlayIQ could do one thing for you — what would it be?
              </p>
              <input
                type="text"
                value={personalGoal}
                onChange={(e) => setPersonalGoal(e.target.value)}
                placeholder="e.g. Stop feeling lost in class..."
                className="assessment-input"
                maxLength={200}
                autoFocus
              />
              <button
                onClick={handlePhase4Submit}
                disabled={!personalGoal.trim() || isPending}
                className="assessment-continue-button mt-4"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finish →'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ PHASE 5: The Reveal ═════════════════════════════════════════ */}
      {phase === 5 && (
        <div className="assessment-phase assessment-reveal-phase">
          <div className="assessment-orion-avatar assessment-reveal-orion overflow-hidden relative">
            <img src="/images/orion-avatar.png" alt="Orion AI" className="w-full h-full object-cover rounded-full" />
          </div>

          {/* Step 0: Generating */}
          {revealStep === 0 && !revealSummary && (
            <div className="text-center">
              <p className="text-sm font-mono mb-4" style={{ color: 'var(--neon-cyan)' }}>
                Orion is calibrating to your profile...
              </p>
              {isPending ? (
                <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: 'var(--neon-purple)' }} />
              ) : (
                <button
                  onClick={handleGenerateReveal}
                  className="assessment-reveal-button"
                >
                  Show Me What Orion Found →
                </button>
              )}
            </div>
          )}

          {/* Step 1: Personalized Summary (Part A) */}
          {revealStep === 1 && (
            <div className="assessment-reveal-content">
              <h2 className="text-sm font-mono uppercase tracking-widest mb-6 text-center" style={{ color: 'var(--neon-cyan)' }}>
                Here&apos;s what I can already tell about you.
              </h2>
              <div className="assessment-reveal-summary">
                {revealSummary.split('\n').filter(Boolean).map((line, idx) => (
                  <p key={idx} className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>
                    {line}
                  </p>
                ))}
              </div>
              <button
                onClick={() => setRevealStep(2)}
                className="assessment-continue-button mt-6"
              >
                What&apos;s possible? →
              </button>
            </div>
          )}

          {/* Step 2: Vision Outcomes (Part B) */}
          {revealStep === 2 && (
            <div className="assessment-reveal-content">
              <OrionTypingEffect
                lines={[ORION_VISION_LINES[0]]}
                speed={25}
                lineDelay={400}
                onComplete={() => {}}
                className="mb-6"
              />

              <div className="space-y-4 mb-6">
                {visionOutcomes.map((outcome, idx) => (
                  <div
                    key={idx}
                    className="assessment-vision-outcome"
                    style={{ animationDelay: `${idx * 300}ms` }}
                  >
                    <span className="text-lg mr-3" style={{ color: 'var(--neon-gold)' }}>✦</span>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      {outcome}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-sm italic text-center mb-6" style={{ color: 'var(--text-muted)' }}>
                {ORION_VISION_LINES[1]}
              </p>

              <button
                onClick={() => setRevealStep(3)}
                className="assessment-continue-button"
              >
                See My Blueprint →
              </button>
            </div>
          )}

          {/* Step 3: Learning Blueprint */}
          {revealStep === 3 && blueprint && (
            <div className="assessment-reveal-content">
              <LearningBlueprint blueprint={blueprint} studentName={displayName || 'Apprentice'} />

              <button
                onClick={handleFinish}
                className="assessment-begin-button mt-8"
              >
                Let&apos;s Begin →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
