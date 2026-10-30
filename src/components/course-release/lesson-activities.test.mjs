// Pure/source QA: node --experimental-strip-types --test src/components/course-release/lesson-activities.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  LESSON_ACTIVITIES, activitiesForModule, validateLessonChoices, parseLessonChoices,
  formatLessonChoices, normalizeActivityText,
} from '../../lib/course-release/activities.ts';

const html = readFileSync('docs/curriculum/playiq-weekend-test-20261030/PLAYIQ_COMPLETE_COURSE_MASTER_20261030.html', 'utf8');
const client = readFileSync(new URL('./CourseShellClient.tsx', import.meta.url), 'utf8');
const portal = readFileSync(new URL('./LessonActivities.tsx', import.meta.url), 'utf8');
function text(value) {
  return value.replace(/<[^>]*>/g, '').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([a-f\d]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
}

test('all registry anchors resolve in current complete generated lesson elements', () => {
  const missing = [];
  for (const activity of LESSON_ACTIVITIES) {
    const section = html.match(new RegExp(`<section id="module-${activity.moduleNumber}">([\\s\\S]*?)<\\/section>`))?.[1];
    assert.ok(section, `Module ${activity.moduleNumber} exists`);
    const candidates = [...section.matchAll(/<(p|li|td|th|h[234])\b[^>]*>([\s\S]*?)<\/\1>/g)].map(match => normalizeActivityText(text(match[2])));
    if (!candidates.some(candidate => candidate.includes(normalizeActivityText(activity.anchor)))) missing.push(activity.id);
  }
  assert.deepEqual(missing, [], 'No silent placement gaps are allowed; the component also reports a missing anchor visibly.');
});

test('every nonoptional module has digital activities, and M13 has none', () => {
  assert.equal(new Set(LESSON_ACTIVITIES.map(activity => activity.id)).size, LESSON_ACTIVITIES.length);
  for (let n = 0; n <= 14; n++) {
    if (n === 13) assert.deepEqual(activitiesForModule(n), []);
    else assert.ok(activitiesForModule(n).length > 0, `Module ${n} has an inline choice`);
  }
  assert.ok(activitiesForModule(1).some(activity => activity.id === 'm1-power'));
  assert.equal(activitiesForModule(1).filter(activity => activity.id.startsWith('m1-mode-')).length, 5);
  assert.equal(activitiesForModule(1).filter(activity => activity.id.startsWith('m1-verify-')).length, 5);
  for (const activity of LESSON_ACTIVITIES) {
    assert.ok(activity.options.length >= 2);
    assert.equal(new Set(activity.options.map(option => option.id)).size, activity.options.length);
    assert.ok(activity.question && activity.anchor && activity.nextStep);
  }
});

test('only known option IDs from the matching module are accepted', () => {
  assert.equal(validateLessonChoices('{}'), true);
  for (const activity of LESSON_ACTIVITIES) for (const option of activity.options) {
    const saved = JSON.stringify({ [activity.id]: option.id });
    assert.equal(validateLessonChoices(saved, activity.moduleNumber), true);
    assert.deepEqual(parseLessonChoices(saved, activity.moduleNumber), { [activity.id]: option.id });
  }
  for (const bad of ['', 'null', '[]', 'true', '"A"', '{"unknown":"A"}', '{"m1-power":"Z"}', '{"m1-power":true}', '{"__proto__":"A"}', ' '.repeat(6001)]) {
    assert.equal(validateLessonChoices(bad), false, bad.slice(0, 50));
  }
  assert.equal(validateLessonChoices('{"m1-power":"B"}', 2), false);
  assert.equal(validateLessonChoices('{"m1-power":"B"}', 13), false);
});

test('stored choices produce readable questions and answers without invented result or score', () => {
  const saved = '{"m1-power":"B","m1-mode-1":"C"}';
  const result = formatLessonChoices(saved, 1);
  assert.match(result, /Choose your power/);
  assert.match(result, /Explain the three hardest ideas/);
  assert.match(result, /Student choice: Quiz Mode/);
  assert.doesNotMatch(result, /m1-power|m1-mode|score:|passed:/i);
  assert.match(formatLessonChoices('{"unknown":"A"}'), /MISSING_INPUT/);
});

test('inline choices save the existing record as draft with preserved approval and review token', () => {
  assert.match(client, /lessonChoices: JSON\.stringify\(nextChoices\)/);
  assert.match(client, /\.\.\.answers, lessonChoices:/);
  assert.match(client, /await save\(false, requestedAnswers\)/);
  assert.match(client, /includeInTutor: moduleNumber <= 8 && includeInTutor/);
  assert.match(client, /assessmentReviewToken: courseState\?\.assessmentReviewToken \?\? null/);
  assert.match(client, /field\.key !== 'lessonChoices'/);
  assert.match(client, /inFlight\.current/);
  assert.match(client, /if \(!result\.ok\) setChoiceError/);
  assert.doesNotMatch(client, /localStorage|sessionStorage/);
});

test('portals retain source text, give visible missing-anchor errors and gate next action on confirmed save', () => {
  assert.match(portal, /createPortal\(/);
  assert.match(portal, /Some digital questions could not be placed/);
  assert.match(portal, /selected === saved && !pending && !error/);
  assert.match(portal, /if \(!confirmed \|\| disabled\) return/);
  assert.match(portal, /Retry saving this choice/);
  assert.doesNotMatch(portal, /\.innerHTML\s*=|\.replaceChildren\(/);
  assert.match(client, /shell === 'beta' && <BetaBlockerReport shell=\{shell\} moduleNumber=\{moduleNumber\} submit=\{actions\.blocker\}/);
});
