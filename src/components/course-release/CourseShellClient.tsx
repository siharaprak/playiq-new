'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  downloadPersonalLearningKnowledgeFile,
  loadCourseReleaseState,
  saveCourseBetaFeedback,
  saveCourseModuleRecord,
} from '@/app/(dashboard)/student/course-actions';
import {
  ASSESSMENT_FIELDS, MODULE_FIELDS, RELEASE_ID,
  type CourseModuleRecord, type CourseReleaseState, type CourseShell,
} from '@/lib/course-release/learning-record';
import type { CourseLesson } from '@/lib/course-release/content';
import { activitiesForModule, formatLessonChoices, parseLessonChoices, validateLessonChoices, type LessonChoices } from '@/lib/course-release/activities';
import type { submitCourseBlocker } from '@/app/(dashboard)/student/course-blocker-actions';
import BetaBlockerReport from './BetaBlockerReport';
import LessonActivities, { type LessonActivitiesProps } from './LessonActivities';
import styles from './course-release.module.css';

export interface CourseShellActions {
  load: typeof loadCourseReleaseState;
  save: typeof saveCourseModuleRecord;
  download: typeof downloadPersonalLearningKnowledgeFile;
  feedback: typeof saveCourseBetaFeedback;
  blocker?: typeof submitCourseBlocker;
}

export interface CourseShellClientProps {
  shell: CourseShell;
  lesson: CourseLesson;
  navigation: { moduleNumber: number; title: string }[];
  initialResult: Awaited<ReturnType<typeof loadCourseReleaseState>>;
  // Dependency injection for a caller-controlled, isolated test harness only.
  // No URL, cookie, or environment setting switches the production actions.
  actions?: CourseShellActions;
}

const realActions: CourseShellActions = {
  load: loadCourseReleaseState,
  save: saveCourseModuleRecord,
  download: downloadPersonalLearningKnowledgeFile,
  feedback: saveCourseBetaFeedback,
};

function moduleLabel(moduleNumber: number): string {
  return moduleNumber === 0 ? 'Module 00' : `Module ${moduleNumber}`;
}

function shortTitle(title: string): string {
  return title.replace(/^PlayIQ\s+Module\s+\d+:?\s*/i, '');
}

function sameAnswers(left: Record<string, string>, right: Record<string, string>): boolean {
  return [...new Set([...Object.keys(left), ...Object.keys(right)])]
    .every(key => (left[key] ?? '') === (right[key] ?? ''));
}

function LessonContent(props: Omit<LessonActivitiesProps, 'articleRef'>) {
  const { html } = props;
  const article = useRef<HTMLElement>(null);
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    const root = article.current;
    if (!root) return;
    const cleanups: (() => void)[] = [];
    root.querySelectorAll<HTMLElement>('pre, blockquote').forEach(block => {
      if (block.tagName === 'BLOCKQUOTE' && block.querySelector('pre')) return;
      const content = block.tagName === 'PRE' ? block.querySelector('code') ?? block : block;
      const text = content.textContent?.trim() ?? '';
      if (!text) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = styles.copyButton;
      button.textContent = block.tagName === 'PRE' ? 'Copy prompt / block' : 'Copy text';
      button.setAttribute('aria-label', `Copy ${block.tagName === 'PRE' ? 'prompt or code block' : 'quoted text'}`);
      const copy = async () => {
        try {
          if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
          await navigator.clipboard.writeText(text);
          setCopyMessage('Copied. Paste it into the AI or notes specified in this lesson.');
        } catch {
          const selection = window.getSelection();
          const range = document.createRange();
          // A blockquote may contain its copy button, so select the original child
          // nodes only. Never include the button label in a manual-copy fallback.
          if (content === block && block.firstChild && button.previousSibling) {
            range.setStartBefore(block.firstChild);
            range.setEndAfter(button.previousSibling);
          } else {
            range.selectNodeContents(content);
          }
          selection?.removeAllRanges();
          selection?.addRange(range);
          setCopyMessage('Automatic copy was unavailable. The text is selected: press Ctrl+C (⌘C on Mac), or touch and hold to copy.');
        }
      };
      button.addEventListener('click', copy);
      block.appendChild(button);
      cleanups.push(() => { button.removeEventListener('click', copy); button.remove(); });
    });
    return () => cleanups.forEach(cleanup => cleanup());
  }, [html]);

  return (
    <>
      <p className={styles.copyStatus} role="status" aria-live="polite">{copyMessage || 'Copy controls are available on prompts and quoted text. If automatic copy is blocked, the text will be selected for manual copying.'}</p>
      <article ref={article} className={styles.lesson} aria-label="Complete module lesson" dangerouslySetInnerHTML={{ __html: html }} />
      <LessonActivities {...props} articleRef={article} />
    </>
  );
}

function KnowledgeFilePanel({ shell, actions }: { shell: CourseShell; actions: CourseShellActions }) {
  const [file, setFile] = useState<Extract<Awaited<ReturnType<typeof downloadPersonalLearningKnowledgeFile>>, { ok: true }> | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const [message, setMessage] = useState('');

  async function prepare() {
    setPending(true);
    setError('');
    setMessage('');
    setReviewed(false);
    setFile(null);
    try {
      const result = await actions.download(shell);
      if (!result.ok) setError(result.error);
      else setFile(result);
    } catch {
      setError('The Knowledge File could not be prepared. Nothing was downloaded. Try again when your connection is restored.');
    } finally { setPending(false); }
  }

  function download() {
    if (!file || !reviewed) return;
    try {
      const url = URL.createObjectURL(new Blob([file.markdown], { type: 'text/markdown;charset=utf-8' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = file.filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage('Download requested. Check your browser’s downloads and open the file before you upload it. PlayIQ has not uploaded anything into your AI account.');
    } catch {
      setError('Your browser could not start the download. The full Markdown preview below is still available to select and copy into a .md file.');
    }
  }

  return (
    <section className={styles.panel} aria-labelledby="knowledge-file-heading">
      <p className={styles.eyebrow}>Module 9 • your real course evidence</p>
      <h2 id="knowledge-file-heading">Personal Learning Knowledge File</h2>
      <p>This is <strong>one of your six Tutor files, not a seventh file</strong>. It gathers the learning answers you approved for inclusion in Modules 00–8.{shell === 'beta' ? ' Beta feedback stays private to course testing and is never copied into this file.' : ''}</p>
      <p>It gives your Tutor context; it does not retrain the underlying AI model. Missing or unapproved entries stay explicitly missing—no results or learning preferences are invented.</p>
      <button type="button" className={styles.button} onClick={prepare} disabled={pending} aria-busy={pending}>{pending ? 'Preparing from saved answers…' : file ? 'Refresh preview from saved answers' : 'Prepare and preview my Knowledge File'}</button>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {file && <>
        {file.missingModules.length > 0 ? (
          <div className={styles.warning} role="status">
            <strong>Missing, unfinished, or unapproved learning records:</strong> {file.missingModules.map(moduleLabel).join(', ')}.
            <p>Return to those lessons to save and approve genuine evidence, or keep the explicit missing markers. Do not make up an answer to fill a gap.</p>
          </div>
        ) : <p className={styles.success}>Saved, approved records are available for Modules 00–8. Review the content yourself before sharing it with your AI.</p>}
        <label className={styles.field} htmlFor="knowledge-file-preview">Review the generated Markdown
          <textarea id="knowledge-file-preview" readOnly rows={16} value={file.markdown} spellCheck={false} className={styles.markdownPreview} />
        </label>
        <label className={styles.checkLabel}>
          <input type="checkbox" checked={reviewed} onChange={event => setReviewed(event.target.checked)} />
          <span>I have checked this file for accuracy, missing entries, and information I do not want to share.</span>
        </label>
        <button type="button" className={styles.button} onClick={download} disabled={!reviewed}>Download Personal Learning Knowledge File (.md)</button>
        <p className={styles.copyStatus} role="status" aria-live="polite">{message}</p>
      </>}
      <h3>Now put it in the Tutor Project you already started</h3>
      <ol>
        <li>Open your parent-approved AI account in another tab. Do not start PlayIQ’s older in-app Tutor Builder.</li>
        <li>Open the <strong>same external Tutor Project or equivalent dedicated workspace</strong> you created in Module 00—not a new random chat and not your separate Personal Assistant Project.</li>
        <li>Open the downloaded <code>personal_learning_knowledge_file.md</code> on your device and check it. If anything is inaccurate or too private, fix the saved course answer and refresh this preview first.</li>
        <li>In your AI’s Project knowledge/files area, upload this reviewed file. If the platform has no file upload, follow the offline/manual route in this lesson rather than claiming it is connected.</li>
        <li>Continue the full six-file tutorial below. Add the other five files and the Project Instructions where the lesson tells you; do not paste everything into a chat and assume it was saved.</li>
        <li>In Module 10, run the Tutor behavior checks and record what actually happens. Downloading or uploading a file is not a passed Tutor test.</li>
      </ol>
    </section>
  );
}

function BetaFeedback({ moduleNumber, questions, actions }: {
  moduleNumber: number; questions: string[]; actions: CourseShellActions;
}) {
  const prompts = questions.length ? questions : ['What worked, what was unclear, and what would you change?'];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [rating, setRating] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setPending(true);
    setSaved(false);
    try {
      const feedback = prompts.map((prompt, index) => `${index + 1}. ${prompt}\n${answers[index]?.trim() || 'Not answered'}`).join('\n\n');
      const result = await actions.feedback({ moduleNumber, rating: Number(rating), feedback });
      if (!result.ok) setError(result.error);
      else setSaved(true);
    } catch {
      setError('Your beta feedback was not confirmed saved. Keep this page open and try again.');
    } finally { setPending(false); }
  }

  return (
    <section className={styles.panel} aria-labelledby="beta-feedback-heading">
      <p className={styles.eyebrow}>Beta route only • after the lesson</p>
      <h2 id="beta-feedback-heading">Help us improve this module</h2>
      <p>Optional course feedback, not another learning test. Do not include private family details. These answers go to course testing—not your Tutor’s Knowledge File.</p>
      <form onSubmit={submit}>
        <label className={styles.field} htmlFor="beta-rating">How easy was this module to follow?
          <select id="beta-rating" value={rating} onChange={event => { setRating(event.target.value); setSaved(false); }} required disabled={pending}>
            <option value="">Choose a rating</option>
            <option value="1">1 — Very confusing</option><option value="2">2 — Often unclear</option><option value="3">3 — Mixed</option><option value="4">4 — Mostly clear</option><option value="5">5 — Very clear</option>
          </select>
        </label>
        {prompts.map((prompt, index) => <label className={styles.field} key={index} htmlFor={`beta-feedback-${index}`}>
          {prompt}
          <textarea id={`beta-feedback-${index}`} rows={3} maxLength={400} value={answers[index] ?? ''} onChange={event => { setAnswers(current => ({ ...current, [index]: event.target.value })); setSaved(false); }} disabled={pending} />
        </label>)}
        <button className={styles.button} type="submit" disabled={pending || !rating} aria-busy={pending}>{pending ? 'Saving feedback…' : 'Save beta feedback'}</button>
        {error && <p className={styles.error} role="alert">{error}</p>}
        {saved && <p className={styles.success} role="status">Beta feedback confirmed saved. Thank you.</p>}
      </form>
    </section>
  );
}

export default function CourseShellClient({ shell, lesson, navigation, initialResult, actions = realActions }: CourseShellClientProps) {
  const { moduleNumber } = lesson;
  const basePath = shell === 'beta' ? '/student/course-beta' : '/student/course';
  const [courseState, setCourseState] = useState<CourseReleaseState | null>(initialResult.ok ? initialResult.data : null);
  const initialRecord = initialResult.ok ? initialResult.data.records.find(record => record.moduleNumber === moduleNumber) : undefined;
  const [answers, setAnswers] = useState<Record<string, string>>(initialRecord?.answers ?? {});
  const [includeInTutor, setIncludeInTutor] = useState(initialRecord?.includeInTutor ?? false);
  const [loadError, setLoadError] = useState(initialResult.ok ? '' : initialResult.error);
  const [pending, setPending] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [pendingChoice, setPendingChoice] = useState<string | null>(null);
  const [choiceError, setChoiceError] = useState<{ id: string; message: string } | null>(null);
  const inFlight = useRef(false);
  const record = courseState?.records.find(item => item.moduleNumber === moduleNumber);
  const dirty = !sameAnswers(answers, record?.answers ?? {}) || (moduleNumber <= 8 && includeInTutor !== (record?.includeInTutor ?? false));
  const fields = MODULE_FIELDS[moduleNumber];
  const schemaAvailable = Boolean(fields && (fields.length > 0 || moduleNumber === 13));
  const canSave = courseState !== null && schemaAvailable && !pending;
  const choicesValid = !answers.lessonChoices || validateLessonChoices(answers.lessonChoices, moduleNumber);
  const choices: LessonChoices = parseLessonChoices(answers.lessonChoices, moduleNumber);
  const savedChoices = parseLessonChoices(record?.answers.lessonChoices, moduleNumber);
  const completed = Boolean(record?.completed && !dirty);
  const totalCompleted = courseState?.records.filter(item => item.completed).length ?? 0;

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function guardNavigation(event: MouseEvent<HTMLAnchorElement>) {
    if (pending || (dirty && !window.confirm('You have unsaved changes in this module. Leave without saving? Choose Cancel to save your draft first.'))) event.preventDefault();
  }

  async function reload() {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setSaveError('');
    try {
      const result = await actions.load(shell);
      if (!result.ok) { setLoadError(result.error); setCourseState(null); }
      else {
        setCourseState(result.data);
        setLoadError('');
        const saved = result.data.records.find(item => item.moduleNumber === moduleNumber);
        setAnswers(saved?.answers ?? {});
        setIncludeInTutor(saved?.includeInTutor ?? false);
        setSaveMessage('Your saved course record has been loaded from the server.');
      }
    } catch {
      setLoadError('Your saved course record could not be loaded. Saving and lesson completion remain blocked; retry when connected.');
      setCourseState(null);
    } finally { setPending(false); inFlight.current = false; }
  }

  async function save(complete: boolean, requestedAnswers = answers): Promise<Awaited<ReturnType<typeof saveCourseModuleRecord>>> {
    if (!canSave || inFlight.current) return { ok: false, error: 'Saving is unavailable or another save is still pending. Nothing new was confirmed saved.' };
    inFlight.current = true;
    setPending(true);
    setSaveMessage('');
    setSaveError('');
    try {
      const result = await actions.save({ shell, moduleNumber, answers: requestedAnswers, includeInTutor: moduleNumber <= 8 && includeInTutor, completed: complete,
        ...(moduleNumber === 0 ? { assessmentReviewToken: courseState?.assessmentReviewToken ?? null } : {}),
      });
      if (!result.ok) { setSaveError(result.error); return result; }
      const saved: CourseModuleRecord = result.record;
      setCourseState(current => current ? { ...current, records: [...current.records.filter(item => item.moduleNumber !== moduleNumber), saved] } : current);
      setAnswers(saved.answers);
      setIncludeInTutor(saved.includeInTutor);
      setChoiceError(null);
      setSaveMessage(complete ? 'Your lesson completion and learning record are confirmed saved.' : 'Your draft is confirmed saved. You can return to this module on another device.');
      return result;
    } catch {
      const error = 'The server did not confirm this save. Your answers are still on this page, but they may not be saved. Keep the page open, check your connection, and try again.';
      setSaveError(error);
      return { ok: false, error };
    } finally { setPending(false); inFlight.current = false; }
  }

  async function saveChoice(activityId: string, optionId: string) {
    if (!canSave || inFlight.current || !choicesValid) return;
    const activity = activitiesForModule(moduleNumber).find(item => item.id === activityId);
    if (!activity?.options.some(option => option.id === optionId)) return;
    const nextChoices = { ...choices, [activityId]: optionId };
    const requestedAnswers = { ...answers, lessonChoices: JSON.stringify(nextChoices) };
    setAnswers(requestedAnswers);
    setChoiceError(null);
    setPendingChoice(activityId);
    // A changed answer is a draft, even if this lesson was previously complete.
    // Existing export approval is preserved, never automatically granted.
    const result = await save(false, requestedAnswers);
    if (!result.ok) setChoiceError({ id: activityId, message: result.error });
    else if (parseLessonChoices(result.record.answers.lessonChoices, moduleNumber)[activityId] !== optionId) {
      setChoiceError({ id: activityId, message: 'The server reply did not confirm this choice. Do not continue as though it was saved; retry or report the blocker.' });
    }
    setPendingChoice(null);
  }

  function updateAnswer(key: string, value: string) {
    setAnswers(current => ({ ...current, [key]: value }));
    setSaveMessage('');
    setSaveError('');
  }

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#course-lesson">Skip to this module</a>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>PlayIQ • Course 1 {shell === 'beta' ? '• separate beta course' : '• final course'}</p>
          <h1>Imagine it. Learn it. Build it.</h1>
          <p>Module 00 + Modules 1–14. One personal Tutor Project, built step by step.</p>
        </div>
        <a className={styles.secondaryButton} href="/course-release/course-print.pdf" target="_blank" rel="noopener noreferrer">Open white-background print PDF <span className={styles.srOnly}>(new tab)</span></a>
      </header>
      <div className={styles.layout}>
        <nav className={styles.navigation} aria-label="Course modules">
          <h2>Your journey</h2>
          <p>{courseState ? `${totalCompleted} of 15 lessons marked complete` : 'Saved progress unavailable'}</p>
          <progress value={totalCompleted} max={15} aria-label="Lessons marked complete" />
          <ol>
            {navigation.map(item => {
              const saved = courseState?.records.find(entry => entry.moduleNumber === item.moduleNumber);
              const active = item.moduleNumber === moduleNumber;
              return <li key={item.moduleNumber}>
                <Link href={`${basePath}?module=${item.moduleNumber}`} aria-current={active ? 'page' : undefined} onClick={guardNavigation} className={active ? styles.currentModule : undefined}>
                  <strong>{moduleLabel(item.moduleNumber)}{item.moduleNumber === 14 ? ' · Capstone' : ''}</strong>
                  <span>{shortTitle(item.title)}</span>
                  <small>{active && dirty ? 'Unsaved changes' : !courseState ? 'Progress unavailable' : saved?.completed ? 'Lesson complete' : saved ? 'Saved draft' : 'Not yet saved'}</small>
                </Link>
              </li>;
            })}
          </ol>
          <p className={styles.small}>Lesson completion is your progress marker—not a claim that every worksheet or AI behavior test passed.</p>
        </nav>
        <main id="course-lesson" className={styles.main}>
          <div className={styles.moduleBar}>
            <p className={styles.eyebrow}>{moduleLabel(moduleNumber)} / 14 {moduleNumber === 13 ? '• Optional possibility preview' : moduleNumber === 14 ? '• Capstone' : ''}</p>
            <span className={styles.statusBadge}>{pending ? 'Saving / loading…' : !courseState ? 'Progress unavailable' : dirty ? 'Unsaved changes' : completed ? 'Lesson complete' : record ? 'Saved draft' : 'Not yet saved'}</span>
          </div>
          {loadError && <div className={styles.error} role="alert"><strong>Saved progress is unavailable.</strong><p>{loadError}</p><p>No lesson will be marked complete until the record can be loaded and a server save succeeds. Reading is still available.</p><button className={styles.secondaryButton} type="button" onClick={reload} disabled={pending}>Retry loading my record</button></div>}
          {shell === 'beta' && <BetaBlockerReport shell={shell} moduleNumber={moduleNumber} submit={actions.blocker} />}
          <div className={styles.readingNotice}>
            <strong>The full lesson is below—not a summary.</strong>
            <p>Use the active <strong>“Answer here”</strong> controls beside the lesson’s choice questions. Each choice saves the current lesson record as a draft; wait for confirmation before continuing. Other printed blanks and checkboxes are workbook-only—write those longer explanations on paper or in your private digital workbook. Save a short reflection at the end; you do not need to redo the whole worksheet.</p>
            {moduleNumber === 0 && <p>The digital choices here are course reflections. They do not silently complete or replace Orion’s separate cinematic assessment.</p>}
          </div>
          {moduleNumber === 0 && <section className={styles.panel} aria-labelledby="assessment-entry-heading">
            <p className={styles.eyebrow}>Start here, after parent setup</p>
            <h2 id="assessment-entry-heading">Meet Orion in your interactive assessment</h2>
            <p>Read the parent setup in this lesson first. Then open the cinematic assessment to explore your current goals and learning preferences. When it finishes, return through student home to this course and save the Module 00 learning record below. An assessment result is a starting hypothesis, not a permanent learning label.</p>
            <Link className={styles.button} href="/student/assessment" onClick={guardNavigation}>Continue to Orion’s assessment</Link>
            {courseState?.assessmentProfile && <p className={styles.success}>A saved assessment profile was found for your student account. Review it in the assessment; it does not automatically mean your external Tutor setup or lesson activities are complete.</p>}
          </section>}
          {moduleNumber === 9 && <KnowledgeFilePanel shell={shell} actions={actions} />}
          {!choicesValid && <p className={styles.error} role="alert">The saved digital-choice record is not readable for this module. No answers were guessed. Ask the course team to restore it before changing digital choices.</p>}
          <LessonContent html={lesson.html} moduleNumber={moduleNumber} choices={choices} savedChoices={savedChoices}
            disabled={!canSave || !choicesValid} pendingId={pendingChoice} error={choiceError} onChoose={saveChoice} />
          <section className={styles.panel} aria-labelledby="learning-record-heading">
            <p className={styles.eyebrow}>{moduleLabel(moduleNumber)} • save & resume</p>
            <h2 id="learning-record-heading">{moduleNumber === 13 ? 'Finish this optional preview' : 'Save this lesson’s learning record'}</h2>
            {moduleNumber === 13 ? <p>This is a seed for what you could explore after the course. No character, story, storyboard, cartoon, or written response is required to complete this preview.</p>
              : <p>Use the lesson/workbook you just worked through. These fields collect that work so you can resume and, in Modules 00–8, choose what your Tutor should know. They are not a new assessment. If you did not try something, say “Not tried yet”; do not invent evidence or a passed test.</p>}
            {!schemaAvailable && <p className={styles.error} role="alert">The learning-record field definitions are missing for this module. Saving and marking the lesson complete are blocked until the team restores them.</p>}
            <fieldset disabled={!canSave} className={styles.fieldset}>
              <legend className={styles.srOnly}>Your lesson record</legend>
              {moduleNumber !== 13 && <details className={styles.reflectionDetails}>
                <summary>Optional workbook reflection notes — save what is useful</summary>
                <p>Use short notes from work you already did. You do not have to copy the full workbook here or fill every field. Missing evidence stays missing; digital choices above are already in this same record.</p>
                {fields?.filter(field => field.key !== 'lessonChoices').map(field => <label className={styles.field} htmlFor={`record-${field.key}`} key={field.key}>
                  {field.label}
                  {field.help && <span className={styles.help} id={`help-${field.key}`}>{field.help}</span>}
                  <textarea id={`record-${field.key}`} rows={4} maxLength={6000} aria-describedby={field.help ? `help-${field.key}` : undefined} value={answers[field.key] ?? ''} onChange={event => updateAnswer(field.key, event.target.value)} />
                </label>)}
              </details>}
              {moduleNumber !== 13 && answers.lessonChoices && <details className={styles.assessmentReview}>
                <summary>Review my digital lesson choices</summary>
                <p>These are the same choices you made beside the questions, not another worksheet. Unsaved changes are not confirmed until the server save succeeds.</p>
                <pre className={styles.choiceSummary}>{formatLessonChoices(answers.lessonChoices, moduleNumber)}</pre>
              </details>}
              {moduleNumber === 0 && courseState?.assessmentProfile && <details className={styles.assessmentReview}>
                <summary>Review saved assessment answers included with Module 00 approval</summary>
                <p>The following student answers are also included when you approve this Module 00 record for your Knowledge File. They are not AI-generated summaries or fixed learning diagnoses. Leave approval unchecked if you do not want to share them.</p>
                <dl>{Object.entries(ASSESSMENT_FIELDS).map(([key, label]) => {
                  const value = courseState.assessmentProfile?.[key];
                  return <div key={key}><dt>{label}</dt><dd>{typeof value === 'string' && value.trim() ? value : 'MISSING_INPUT — not recorded'}</dd></div>;
                })}</dl>
              </details>}
              {moduleNumber <= 8 && <label className={styles.checkLabel}>
                <input type="checkbox" checked={includeInTutor} onChange={event => { setIncludeInTutor(event.target.checked); setSaveMessage(''); }} />
                <span>I reviewed these answers{moduleNumber === 0 && courseState?.assessmentProfile ? ' and the saved assessment answers shown above' : ''} and approve including this module’s learning record in my <strong>Personal Learning Knowledge File</strong> in Module 9. Leave unchecked to save privately without including it.</span>
              </label>}
            </fieldset>
            <p className={styles.small}>Save only information you and your parent are comfortable keeping. Your external AI cannot see these answers until you manually share a reviewed file or paste approved content. Save a draft whenever you pause. Editing a completed record makes it unsaved until you confirm it again.</p>
            <div className={styles.buttonRow}>
              <button type="button" className={styles.secondaryButton} onClick={() => save(false)} disabled={!canSave} aria-busy={pending}>Save draft</button>
              <button type="button" className={styles.button} onClick={() => save(true)} disabled={!canSave} aria-busy={pending}>{pending ? 'Waiting for server confirmation…' : completed ? 'Confirm lesson completion again' : moduleNumber === 13 ? 'Save preview completion' : 'Save & mark lesson complete'}</button>
            </div>
            {saveError && <p className={styles.error} role="alert">{saveError}</p>}
            <p className={saveMessage ? styles.success : styles.copyStatus} role="status" aria-live="polite">{pending ? 'Please wait. Progress is not confirmed saved yet.' : saveMessage || (dirty ? 'These changes have not been saved to the server.' : record ? 'Loaded from your saved course record.' : 'No learning record has been saved for this module yet.')}</p>
            {record?.updatedAt && <p className={styles.small}>Last server-confirmed save: <time dateTime={record.updatedAt}>{record.updatedAt}</time></p>}
            <p className={styles.small}>Marking a lesson complete records your own progress. It does not certify worksheet mastery, successful uploads, or passed AI behavior tests. Record those outcomes honestly in the lesson activities.</p>
          </section>
          {shell === 'beta' && completed && <BetaFeedback moduleNumber={moduleNumber} questions={lesson.betaQuestions} actions={actions} />}
          <footer className={styles.lessonFooter}>
            {moduleNumber > 0 && <Link className={styles.secondaryButton} href={`${basePath}?module=${moduleNumber - 1}`} onClick={guardNavigation}>← Previous module</Link>}
            {completed && !pending ? moduleNumber < 14
              ? <Link className={styles.button} href={`${basePath}?module=${moduleNumber + 1}`} onClick={guardNavigation}>Continue to {moduleLabel(moduleNumber + 1)} →</Link>
              : <p className={styles.success}>Your Capstone lesson completion is saved. Congratulations on reaching the end of Course 1. Keep testing and refining the tools you built.</p>
              : <p className={styles.small}>Save and mark this lesson complete to enable Continue. You can use the module navigation to review other lessons.</p>}
          </footer>
          <p className={styles.releaseLabel}>{RELEASE_ID} • {shell === 'beta' ? 'Beta course; feedback stays in this shell.' : 'Final course.'}</p>
        </main>
      </div>
    </div>
  );
}
