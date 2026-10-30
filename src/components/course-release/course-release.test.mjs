// Run: node --conditions=react-server --experimental-strip-types --test src/components/course-release/course-release.test.mjs
// Pure/source contract tests; no Supabase, auth session, or AI provider is contacted.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { extractCourseLessons, COURSE_SOURCE_PATH, courseShellEnabled } from '../../lib/course-release/content.ts';

const html = readFileSync(path.join(process.cwd(), COURSE_SOURCE_PATH), 'utf8');
const client = readFileSync(new URL('./CourseShellClient.tsx', import.meta.url), 'utf8');
const server = readFileSync(new URL('./CourseReleasePage.tsx', import.meta.url), 'utf8');

test('every module retains its entire lesson body; only the beta tail is replaced', () => {
  const beta = extractCourseLessons(html, 'beta');
  const final = extractCourseLessons(html, 'final');
  for (const lesson of beta) {
    const raw = html.match(new RegExp(`<section id="module-${lesson.moduleNumber}">([\\s\\S]*?)<\\/section>`))[1];
    const feedbackStart = raw.search(/<h[23]\b[^>]*>\s*Beta\s+tester\s+feedback[\s\S]*?<\/h[23]>/i);
    assert.ok(feedbackStart > 0, `Module ${lesson.moduleNumber} has an end-feedback boundary`);
    const fullLesson = raw.slice(0, feedbackStart).replace(/(["'])(?:assets\/)?orion-reference\.png\1/g, '"/course-release/orion-reference.png"');
    assert.equal(lesson.html, fullLesson, `Module ${lesson.moduleNumber} is unabridged`);
    assert.equal(final[lesson.moduleNumber].html, lesson.html, 'beta/final share the same complete lesson');
    assert.ok(lesson.betaQuestions.length > 0);
    assert.deepEqual(final[lesson.moduleNumber].betaQuestions, []);
  }
});

test('active script/handler markup is removed from the trusted document defense in depth', () => {
  const changed = html.replace('<section id="module-2">', '<section id="module-2"><script>window.BAD=true</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">bad</a>');
  const result = extractCourseLessons(changed, 'beta')[2].html;
  assert.doesNotMatch(result, /<script|onerror=|javascript:/i);
});

test('only exact true enables each shell; invalid shell stays disabled', () => {
  const previous = [process.env.PLAYIQ_COURSE_BETA_ENABLED, process.env.PLAYIQ_COURSE_FINAL_ENABLED];
  try {
    for (const value of [undefined, 'false', 'TRUE', '1']) {
      if (value === undefined) { delete process.env.PLAYIQ_COURSE_BETA_ENABLED; delete process.env.PLAYIQ_COURSE_FINAL_ENABLED; }
      else { process.env.PLAYIQ_COURSE_BETA_ENABLED = value; process.env.PLAYIQ_COURSE_FINAL_ENABLED = value; }
      assert.equal(courseShellEnabled('beta'), false);
      assert.equal(courseShellEnabled('final'), false);
    }
    process.env.PLAYIQ_COURSE_BETA_ENABLED = 'true';
    assert.equal(courseShellEnabled('beta'), true);
    assert.equal(courseShellEnabled('final'), false);
    process.env.PLAYIQ_COURSE_FINAL_ENABLED = 'true';
    assert.equal(courseShellEnabled('final'), true);
    assert.equal(courseShellEnabled('other'), false);
  } finally {
    ['PLAYIQ_COURSE_BETA_ENABLED', 'PLAYIQ_COURSE_FINAL_ENABLED'].forEach((key, index) => {
      if (previous[index] === undefined) delete process.env[key]; else process.env[key] = previous[index];
    });
  }
});

test('server route gates feature and operator-managed enrollment before reading lessons', () => {
  assert.ok(server.indexOf('if (!courseShellEnabled(shell)) notFound()') < server.indexOf('await loadCourseReleaseState(shell)'));
  assert.ok(server.indexOf('await loadCourseReleaseState(shell)') < server.indexOf('lessons = loadCourseLessons(shell)'));
  assert.match(server, /if \(!initialResult\.ok\)/);
  assert.doesNotMatch(server, /requireRole|supabaseAdmin/);
  assert.match(server, /typeof requested !== 'string'/);
});

test('save confirmation controls Continue and beta form; no local-storage pretend persistence', () => {
  assert.match(client, /await actions\.save\(/);
  assert.match(client, /if \(!result\.ok\) \{ setSaveError\(result\.error\); return result; \}/);
  assert.match(client, /record\?\.completed && !dirty/);
  assert.match(client, /shell === 'beta' && completed && <BetaFeedback/);
  assert.match(client, /completed && !pending \? moduleNumber < 14/);
  assert.match(client, /courseState !== null && schemaAvailable && !pending/);
  assert.doesNotMatch(client, /localStorage|sessionStorage/);
});

test('Module 13 has no required artifact; Module 9 keeps external reviewed upload explicit', () => {
  assert.match(client, /moduleNumber !== 13 && <details className=\{styles\.reflectionDetails\}/);
  assert.match(client, /No character, story, storyboard, cartoon, or written response is required/);
  assert.match(client, /Continue to Orion’s assessment/);
  assert.match(client, /one of your six Tutor files, not a seventh file/);
  assert.match(client, /same external Tutor Project/);
  assert.match(client, /disabled=\{!reviewed\}/);
  assert.match(client, /not certify worksheet mastery, successful uploads, or passed AI behavior tests/);
});
