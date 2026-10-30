'use client';

import { useEffect, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import {
  activitiesForModule, normalizeActivityText,
  type LessonActivity, type LessonChoices,
} from '@/lib/course-release/activities';
import styles from './course-release.module.css';

type MountedActivity = { activity: LessonActivity; target: HTMLElement; cleanupNode: HTMLElement };
export interface LessonActivitiesProps {
  articleRef: RefObject<HTMLElement | null>;
  html: string;
  moduleNumber: number;
  choices: LessonChoices;
  savedChoices: LessonChoices;
  disabled: boolean;
  pendingId: string | null;
  error: { id: string; message: string } | null;
  onChoose: (activityId: string, optionId: string) => Promise<void>;
}

function ChoiceCard({ activity, selected, saved, disabled, pending, error, onChoose, target }: {
  activity: LessonActivity;
  selected: string | undefined;
  saved: string | undefined;
  disabled: boolean;
  pending: boolean;
  error: string | undefined;
  onChoose: LessonActivitiesProps['onChoose'];
  target: HTMLElement;
}) {
  const confirmed = Boolean(selected && selected === saved && !pending && !error);
  function continueReading() {
    if (!confirmed || disabled) return;
    const next = target.nextElementSibling ?? target.parentElement?.nextElementSibling;
    if (next instanceof HTMLElement) {
      next.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      next.setAttribute('tabindex', '-1');
      next.focus({ preventScroll: true });
    }
  }
  return (
    <section className={styles.inlineActivity} data-lesson-activity={activity.id} aria-labelledby={`question-${activity.id}`}>
      <p className={styles.eyebrow}>Answer here • digital lesson choice</p>
      <fieldset disabled={disabled} className={styles.choiceFieldset}>
        <legend id={`question-${activity.id}`}>{activity.question}</legend>
        {activity.options.map(option => <label className={styles.choiceOption} key={option.id}>
          <input type="radio" name={activity.id} value={option.id} checked={selected === option.id}
            onChange={() => void onChoose(activity.id, option.id)} />
          <span><strong>{option.id}.</strong> {option.label}</span>
        </label>)}
      </fieldset>
      <p className={styles.choiceStatus} role="status" aria-live="polite">{pending ? 'Saving your choice. Wait for server confirmation…'
        : error ? 'This choice was not confirmed saved. Stay here and retry.'
          : confirmed ? 'Choice confirmed saved. It will be available when you return.'
            : selected ? 'Selected on this page, but not confirmed saved.' : disabled ? 'Saving is unavailable. Your answer has not been collected.' : 'Choose one option. It saves your current lesson record as a draft; no export approval is added.'}</p>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {error && selected && <button type="button" className={styles.secondaryButton} disabled={disabled} onClick={() => void onChoose(activity.id, selected)}>Retry saving this choice</button>}
      {confirmed && <>
        <p className={styles.activityNext}><strong>Next:</strong> {activity.nextStep}</p>
        <button type="button" className={styles.secondaryButton} onClick={continueReading} disabled={disabled}>Continue reading ↓</button>
      </>}
    </section>
  );
}

/** Mount controls next to their exact repo-controlled questions, never at a guessed
 * position or in a second worksheet at the bottom. Original lesson nodes stay intact.
 */
export default function LessonActivities(props: LessonActivitiesProps) {
  const { articleRef, html, moduleNumber } = props;
  const [{ mounted, missing }, setPlacement] = useState<{ mounted: MountedActivity[]; missing: string[] }>({ mounted: [], missing: [] });

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    const placed: MountedActivity[] = [];
    const missingIds: string[] = [];
    // Snapshot the original candidates before adding any interactive content.
    const candidates = Array.from(article.querySelectorAll<HTMLElement>('p, li, td, th, h2, h3, h4'));
    const lastAfter = new Map<HTMLElement, HTMLElement>();
    for (const activity of activitiesForModule(moduleNumber)) {
      const anchor = normalizeActivityText(activity.anchor);
      const match = candidates.filter(node => normalizeActivityText(node.textContent ?? '').includes(anchor))
        .sort((a, b) => (a.textContent?.length ?? 0) - (b.textContent?.length ?? 0))[0];
      if (!match) { missingIds.push(activity.id); continue; }
      const target = document.createElement('div');
      target.className = styles.activityMount;
      target.dataset.activityMount = activity.id;
      let cleanupNode: HTMLElement = target;
      const cell = match.closest('td,th');
      if (cell?.parentElement?.tagName === 'TR') {
        // Matching-mode answers belong to their table rows, with valid table markup.
        const row = document.createElement('tr');
        const newCell = document.createElement('td');
        newCell.className = styles.activityTableCell;
        newCell.colSpan = cell.parentElement.children.length;
        newCell.appendChild(target);
        row.appendChild(newCell);
        (lastAfter.get(cell.parentElement) ?? cell.parentElement).after(row);
        lastAfter.set(cell.parentElement, row);
        cleanupNode = row;
      } else if (match.tagName === 'LI') {
        match.appendChild(target);
      } else {
        // Preference questions often have a printed option list directly below.
        // Keep that full source list, then place its active digital counterpart.
        let after = match;
        if (match.nextElementSibling?.tagName === 'UL') after = match.nextElementSibling as HTMLElement;
        (lastAfter.get(after) ?? after).after(target);
        lastAfter.set(after, target);
      }
      placed.push({ activity, target, cleanupNode });
    }
    // Portal destinations can only be discovered after the trusted HTML mounts.
    setPlacement({ mounted: placed, missing: missingIds });
    return () => placed.forEach(item => item.cleanupNode.remove());
  }, [articleRef, html, moduleNumber]);

  return <>
    {missing.length > 0 && <p className={styles.error} role="alert">Some digital questions could not be placed in this lesson ({missing.join(', ')}). Nothing was collected for them. Use the beta blocker report or contact the course team; do not assume a workbook circle was saved.</p>}
    {mounted.map(({ activity, target }) => createPortal(
      <ChoiceCard activity={activity} selected={props.choices[activity.id]} saved={props.savedChoices[activity.id]}
        disabled={props.disabled} pending={props.pendingId === activity.id} error={props.error?.id === activity.id ? props.error.message : undefined}
        onChoose={props.onChoose} target={target} />, target, activity.id,
    ))}
  </>;
}
