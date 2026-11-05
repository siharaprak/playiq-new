'use client';

import React, { useActionState, useState } from 'react';
import {
  MODULE_14_SIX_STAGES,
  MODULE_14_CAPSTONE_TRACKS,
  MODULE_14_QUIZ_QUESTIONS,
} from '@/data/module14CapstoneContent';
import { submitModule14MasterTrialAction } from '../actions';

interface Module14CapstoneFormProps {
  initialPayload?: Record<string, any> | null;
}

export default function Module14CapstoneForm({ initialPayload }: Module14CapstoneFormProps) {
  const [state, formAction, isPending] = useActionState(submitModule14MasterTrialAction, null);
  const [selectedTrack, setSelectedTrack] = useState<string>(
    initialPayload?.skillsTrack?.selected_track || 'track-a',
  );

  const stages = initialPayload?.stages || {};
  const records = initialPayload?.dashboard?.records || [{}, {}, {}];
  const skillsTrack = initialPayload?.skillsTrack || {};
  const reviews = initialPayload?.reviews || {};
  const bossBattle = initialPayload?.bossBattle || {};

  const inputCls =
    'w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-[#00c8ff] focus:outline-none';
  const textareaCls =
    'w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-[#00c8ff] focus:outline-none';

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="p-4 rounded-xl border border-red-500/50 bg-red-950/30 text-red-300 text-sm font-mono">
          ⚠ {state.error}
        </div>
      )}

      {/* Part 0: Choose Your Master Trial Topic */}
      <section
        className="p-6 rounded-xl border space-y-4"
        style={{ background: 'var(--space-card)', borderColor: 'var(--neon-cyan)' }}
      >
        <div className="text-xs font-mono uppercase tracking-widest text-[#00c8ff] font-bold">
          Part 0 • Choose Your Master Trial Topic &amp; Practice Rules
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] font-display">
          Select One Safe School Topic or Skill for Your Master Trial
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Pick one real school unit, review topic, or skill where practice is allowed. Do <strong>not</strong> use a
          live graded test, closed-book assignment, or private personal data.
        </p>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
            Master Trial Topic / Unit Name *
          </label>
          <input
            type="text"
            name="topic"
            required
            defaultValue={initialPayload?.topic || ''}
            placeholder="e.g., Photosynthesis & Cellular Respiration, Fractions & Ratios, The American Revolution..."
            className={inputCls}
          />
        </div>
      </section>

      {/* Part 1: The 6-Stage Exam & Performance System */}
      <section
        className="p-6 rounded-xl border space-y-5"
        style={{ background: 'var(--space-card)', borderColor: 'var(--neon-purple)' }}
      >
        <div className="text-xs font-mono uppercase tracking-widest text-purple-300 font-bold">
          Part 1 • The 6-Stage Exam &amp; Performance System
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] font-display">
          Run All 6 PlayIQ Learning Stages on Your Topic
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Show how you used your PlayIQ system across all 6 stages—from Pre-Learn to Final Answer Clarity.
        </p>

        <div className="grid gap-4">
          {MODULE_14_SIX_STAGES.map((st, idx) => {
            const fieldNames = [
              'stage1_prelearn',
              'stage2_rescue',
              'stage3_compress',
              'stage4_selftest',
              'stage5_studypack',
              'stage6_answer',
            ];
            const fieldName = fieldNames[idx];
            return (
              <div
                key={st.stage}
                className="p-4 rounded-lg border border-slate-800 bg-slate-950/60 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#00c8ff] font-mono">
                    {st.stage}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{st.desc}</p>
                <textarea
                  name={fieldName}
                  rows={2}
                  required={idx === 0 || idx === 2 || idx === 5}
                  defaultValue={stages[fieldName] || ''}
                  placeholder={`Record your ${st.stage} output here...`}
                  className={textareaCls}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Part 2 & 3: Evidence Comparison & Learning Dashboard */}
      <section
        className="p-6 rounded-xl border space-y-5"
        style={{ background: 'var(--space-card)', borderColor: 'var(--neon-cyan)' }}
      >
        <div className="text-xs font-mono uppercase tracking-widest text-[#00c8ff] font-bold">
          Parts 2 &amp; 3 • Evidence Comparison &amp; Your Learning Dashboard
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] font-display">
          Compare Evidence Across 3 Course Records (Not Just Feelings)
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Compare 3 learning records from this course. Never invent a fake numerical score or PDI if one was not
          measured—separate what you <em>preferred</em> from what actually <em>improved your recall and clarity</em>.
        </p>

        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-slate-800 bg-slate-950/60 grid sm:grid-cols-2 gap-3"
            >
              <div className="sm:col-span-2 text-xs font-mono uppercase tracking-wider text-[#00c8ff] font-bold">
                Course Record #{i + 1} {i === 2 ? '(May be today’s Master Trial)' : ''}
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Module / Topic</label>
                <input
                  type="text"
                  name={`record${i + 1}_topic`}
                  defaultValue={records[i]?.topic || ''}
                  placeholder="e.g., Module 3 Pre-Learn or Module 6 Self-Test"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Which AI Move Helped Most
                </label>
                <input
                  type="text"
                  name={`record${i + 1}_help`}
                  defaultValue={records[i]?.help || ''}
                  placeholder="e.g., Analogy first + 3 no-notes self-test questions"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Before (Starting State)</label>
                <input
                  type="text"
                  name={`record${i + 1}_before`}
                  defaultValue={records[i]?.before || ''}
                  placeholder="e.g., Confused two key terms"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  After (Demonstrated Evidence)
                </label>
                <input
                  type="text"
                  name={`record${i + 1}_after`}
                  defaultValue={records[i]?.after || ''}
                  placeholder="e.g., Explained both from memory without notes"
                  className={inputCls}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Dashboard Visual Cue (`m14-dashboard-cue`)
            </label>
            <select
              name="dashboard_cue"
              defaultValue={initialPayload?.dashboard?.dashboard_cue || 'Before-to-After Progress Bars'}
              className={inputCls}
            >
              <option value="Before-to-After Progress Bars">Before-to-After Progress Bars</option>
              <option value="Traffic Light Readiness Badges (Red -> Amber -> Green)">
                Traffic Light Readiness Badges (Red → Amber → Green)
              </option>
              <option value="Stage-by-Stage Checkmark Ladder">Stage-by-Stage Checkmark Ladder</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Honest Evidence Interpretation (Preferences vs. Results)
            </label>
            <input
              type="text"
              name="honest_interpretation"
              defaultValue={initialPayload?.dashboard?.honest_interpretation || ''}
              placeholder="What actually proved you learned more (not just what felt easy)?"
              className={inputCls}
            />
          </div>
        </div>
      </section>

      {/* Part 4: Choose One Small Skills Demonstration Track (Tracks A - E) */}
      <section
        className="p-6 rounded-xl border space-y-5"
        style={{ background: 'var(--space-card)', borderColor: 'var(--neon-purple)' }}
      >
        <div className="text-xs font-mono uppercase tracking-widest text-purple-300 font-bold">
          Part 4 • Choose One Small Skills Demonstration (Tracks A–E)
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] font-display">
          Pick One Creative or Practical AI Track to Demonstrate
        </h2>

        <div className="grid sm:grid-cols-2 gap-3">
          {MODULE_14_CAPSTONE_TRACKS.map((tr) => {
            const active = selectedTrack === tr.id;
            return (
              <label
                key={tr.id}
                onClick={() => setSelectedTrack(tr.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                  active
                    ? 'border-[#00c8ff] bg-[#00c8ff]/10 shadow-[0_0_15px_rgba(0,200,255,0.12)]'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="selected_track"
                    value={tr.id}
                    checked={active}
                    onChange={() => setSelectedTrack(tr.id)}
                    className="accent-[#00c8ff]"
                  />
                  <span className="text-sm font-bold text-slate-100">{tr.title}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{tr.tagline}</p>
                <p className="text-[11px] font-mono text-amber-300/90 mt-1">Show: {tr.whatYouShow}</p>
              </label>
            );
          })}
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              1. The Prompt You Used for Your Track *
            </label>
            <textarea
              name="track_prompt"
              rows={2}
              required
              defaultValue={skillsTrack.track_prompt || ''}
              placeholder="Paste or write the structured prompt you used..."
              className={textareaCls}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              2. What You &amp; the AI Created (Concept / Plan / Output) *
            </label>
            <textarea
              name="track_output"
              rows={3}
              required
              defaultValue={skillsTrack.track_output || ''}
              placeholder="Summarize or paste your Track A–E result..."
              className={textareaCls}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                3. One Improvement You Made Yourself *
              </label>
              <input
                type="text"
                name="track_improvement"
                required
                defaultValue={skillsTrack.track_improvement || ''}
                placeholder="How did you refine or improve the first AI draft?"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                4. One Safety / Quality Rule You Followed
              </label>
              <input
                type="text"
                name="track_rule_followed"
                defaultValue={skillsTrack.track_rule_followed || ''}
                placeholder="e.g., Used sample data only / checked adult kitchen supervision"
                className={inputCls}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Parts 5 & 6: Tutor Final Course Review & Family Review */}
      <section
        className="p-6 rounded-xl border space-y-4"
        style={{ background: 'var(--space-card)', borderColor: 'var(--neon-cyan)' }}
      >
        <div className="text-xs font-mono uppercase tracking-widest text-[#00c8ff] font-bold">
          Parts 5 &amp; 6 • Tutor Final Course Review &amp; Family Check-In
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] font-display">
          Review Your Growth With Your Module 00 Tutor &amp; Family Co-Pilot
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Open your persistent <strong>PlayIQ Tutor Project</strong> from Module 00 (keeping your Module 11 Personal
          Assistant separate) and ask it for a final course review based on your knowledge file and Master Trial.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Tutor’s Final Course Review Summary
            </label>
            <textarea
              name="tutor_final_summary"
              rows={3}
              defaultValue={reviews.tutor_final_summary || ''}
              placeholder="What did your PlayIQ Tutor notice about your strongest habits and next growth area?"
              className={textareaCls}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Parent / Adult Co-Pilot Review Note
            </label>
            <textarea
              name="parent_review_note"
              rows={3}
              defaultValue={reviews.parent_review_note || ''}
              placeholder="Share your Master Trial and Learning Dashboard with a parent/adult and record one takeaway..."
              className={textareaCls}
            />
          </div>
        </div>
      </section>

      {/* Part 7: Quick Quiz */}
      <section
        className="p-6 rounded-xl border space-y-5"
        style={{ background: 'var(--space-card)', borderColor: 'var(--neon-purple)' }}
      >
        <div className="text-xs font-mono uppercase tracking-widest text-purple-300 font-bold">
          Part 7 • Module 14 Quick Quiz
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] font-display">
          Verify Your Master Trial Principles
        </h2>

        <div className="space-y-4">
          {MODULE_14_QUIZ_QUESTIONS.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-lg border border-slate-800 bg-slate-950/60 space-y-2.5">
              <p className="text-sm font-bold text-slate-100">
                {idx + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer hover:text-white"
                  >
                    <input
                      type="radio"
                      name={`q${idx + 1}`}
                      value={opt.value}
                      defaultChecked={initialPayload?.quiz?.[`q${idx + 1}`] === opt.value}
                      required
                      className="mt-0.5 accent-[#00c8ff]"
                    />
                    <span>
                      <strong className="uppercase">{opt.value})</strong> {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Part 8: PlayIQ Mastery Record & Capstone Boss Battle */}
      <section
        className="p-6 rounded-xl border space-y-5"
        style={{ background: 'var(--space-card)', borderColor: 'var(--neon-cyan)' }}
      >
        <div className="text-xs font-mono uppercase tracking-widest text-[#00c8ff] font-bold">
          Part 8 • Capstone Boss Battle &amp; PlayIQ Mastery Record
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] font-display">
          Final Boss Battle: Explain, Show, and Choose
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              1. EXPLAIN: How do your AI Tutor (M00/M09) and your Personal AI Assistant (M11) do different jobs? *
            </label>
            <textarea
              name="boss_explain"
              rows={2}
              required
              defaultValue={bossBattle.boss_explain || ''}
              placeholder="Explain why your Tutor is for learning/coaching and your Assistant is for one bounded practical job..."
              className={textareaCls}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              2. SHOW: Which piece of evidence from your Master Trial proves you understood the topic in your own brain? *
            </label>
            <textarea
              name="boss_show"
              rows={2}
              required
              defaultValue={bossBattle.boss_show || ''}
              placeholder="Point to your closed-notes self-test, compression summary, or teach-back..."
              className={textareaCls}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              3. CHOOSE: What is your #1 PlayIQ rule when an AI gives a fast, polished answer on schoolwork? *
            </label>
            <textarea
              name="boss_choose"
              rows={2}
              required
              defaultValue={bossBattle.boss_choose || ''}
              placeholder="Explain how you verify, test yourself without notes, and keep human responsibility..."
              className={textareaCls}
            />
          </div>
        </div>

        {/* Family Note About What Could Come Next */}
        <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/70 text-xs text-slate-300 space-y-1.5">
          <div className="font-mono uppercase tracking-wider text-[#00c8ff] font-bold">
            Family Note • What Could Come Next After Course 1
          </div>
          <p className="leading-relaxed">
            Completing Course 1 gives you a working PlayIQ Tutor Project, a separate Personal AI Assistant, and the
            6-Stage Learning System. For families who want deeper multi-project building, advanced Orion World
            missions, and guided mentorship, the planned follow-up advanced program is listed at $4,999 (optional
            future information for parents and guardians—never required to complete Course 1).
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="btn-neon-filled px-8 py-4 rounded-lg font-bold text-sm cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Submitting Master Trial...' : 'Submit Module 14 Capstone: The Master Trial →'}
          </button>
        </div>
      </section>
    </form>
  );
}
