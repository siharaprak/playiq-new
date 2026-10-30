import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { extractCourseLessons, courseShellEnabled, COURSE_SOURCE_PATH } from '../src/lib/course-release/content.ts';

const root = process.cwd();
const release = path.join(root, 'docs/curriculum/playiq-weekend-test-20261030');
const source = readFileSync(path.join(root, COURSE_SOURCE_PATH), 'utf8');

test('all fifteen complete lessons are available in both distinct shells', () => {
  for (const shell of ['beta', 'final']) {
    const lessons = extractCourseLessons(source, shell);
    assert.equal(lessons.length, 15);
    assert.match(lessons[14].title, /capstone/i);
    assert.match(lessons[9].html, /Personal Learning Knowledge File/);
    assert.match(lessons[10].html, /test/i);
    assert.match(lessons[11].title, /assistant/i);
    assert.match(lessons[12].title, /assistant/i);
    assert.match(lessons[13].html, /optional|not.*assignment/i);
    assert.ok(lessons.every(lesson => lesson.html.length > 1000));
    assert.ok(lessons.every(lesson => !/<script\b|onerror\s*=|javascript:/i.test(lesson.html)));
    assert.ok(lessons.every(lesson => !/Beta tester feedback/i.test(lesson.html)));
  }
});
test('final shell has no beta questions; beta questions remain end-of-module only', () => {
  assert.ok(extractCourseLessons(source, 'final').every(lesson => lesson.betaQuestions.length === 0));
  assert.ok(extractCourseLessons(source, 'beta').every(lesson => lesson.betaQuestions.length > 0));
});
test('source rejects missing and duplicated modules', () => {
  assert.throws(() => extractCourseLessons('<section id="module-0"><h1>Only one</h1></section>', 'beta'));
  assert.throws(() => extractCourseLessons(source + '<section id="module-0"><h1>Duplicate</h1></section>', 'beta'));
});
test('new release uses one Markdown profile among the six Tutor files', () => {
  for (let module = 0; module <= 14; module++) {
    const text = readFileSync(path.join(release, `Module_${String(module).padStart(2,'0')}_Student_Text.md`),'utf8');
    assert.doesNotMatch(text, /Student Tutor Profile Knowledge File|student_tutor_profile\.yaml/);
  }
  const module9 = readFileSync(path.join(release,'Module_09_Student_Text.md'),'utf8');
  assert.match(module9, /Personal Learning Knowledge File/);
  assert.match(module9, /six/i);
  assert.match(module9, /download/i);
  assert.match(module9, /upload/i);
  const code = readFileSync(path.join(root,'src/lib/course-release/learning-record.ts'),'utf8');
  assert.match(code, /PERSONAL_LEARNING_FILENAME = 'personal_learning_knowledge_file\.md'/);
});
test('both shells fail closed until explicitly enabled', () => {
  const beta = process.env.PLAYIQ_COURSE_BETA_ENABLED;
  const final = process.env.PLAYIQ_COURSE_FINAL_ENABLED;
  try {
    delete process.env.PLAYIQ_COURSE_BETA_ENABLED;
    delete process.env.PLAYIQ_COURSE_FINAL_ENABLED;
    assert.equal(courseShellEnabled('beta'),false);
    assert.equal(courseShellEnabled('final'),false);
    process.env.PLAYIQ_COURSE_BETA_ENABLED='true';
    assert.equal(courseShellEnabled('beta'),true);
    assert.equal(courseShellEnabled('final'),false);
  } finally {
    if (beta === undefined) delete process.env.PLAYIQ_COURSE_BETA_ENABLED; else process.env.PLAYIQ_COURSE_BETA_ENABLED=beta;
    if (final === undefined) delete process.env.PLAYIQ_COURSE_FINAL_ENABLED; else process.env.PLAYIQ_COURSE_FINAL_ENABLED=final;
  }
});
