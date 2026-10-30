// Run: node --experimental-strip-types --test scripts/course-learning-record.test.mjs
// Pure fixtures and source contracts only. Never imports the real Supabase SDK or calls a provider.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import {
  ASSESSMENT_FIELDS, MODULE_FIELDS, RELEASE_ID, MAX_ANSWER_CHARS, PERSONAL_LEARNING_FILENAME,
  buildPersonalLearningKnowledgeFile, courseShellEnabled, isModuleNumber, quoteLearnerText,
  sanitizeAssessmentProfile, validateModuleAnswers,
} from '../src/lib/course-release/learning-record.ts';

const timestamp = '2026-10-30T12:00:00.000Z';
function record(moduleNumber, answers = {}, includeInTutor = true, completed = true) {
  return { moduleNumber, answers, includeInTutor, completed, updatedAt: timestamp };
}
const build = (records, assessmentProfile = null, shell = 'beta') =>
  buildPersonalLearningKnowledgeFile({ records, assessmentProfile }, shell, timestamp);
const root = new URL('../', import.meta.url);
const actionSource = readFileSync(new URL('src/app/(dashboard)/student/course-actions.ts', root), 'utf8');
const accessSource = readFileSync(new URL('src/lib/course-release/server-access.ts', root), 'utf8');
const migration = readFileSync(new URL('supabase/migrations/20261030090000_course_release_learning_records.sql', root), 'utf8');

test('release has exactly 15 modules with unique allowlisted fields and no mandatory M13 artifact', () => {
  assert.equal(RELEASE_ID, 'playiq-2026-10-30');
  assert.deepEqual(Object.keys(MODULE_FIELDS).map(Number), Array.from({ length: 15 }, (_, i) => i));
  for (const fields of Object.values(MODULE_FIELDS)) assert.equal(fields.length, new Set(fields.map(f => f.key)).size);
  assert.deepEqual(MODULE_FIELDS[13].map(f => f.key), ['futureIdea']);
  assert.match(MODULE_FIELDS[13][0].help, /No project.*required/);
  assert.equal(validateModuleAnswers(13, {}).ok, true);
});

test('flags are independent, disabled by default, and only exact true enables them', () => {
  assert.equal(courseShellEnabled('beta', {}), false);
  for (const value of ['1', 'TRUE', ' true', 'false']) assert.equal(courseShellEnabled('beta', { PLAYIQ_COURSE_BETA_ENABLED: value }), false);
  assert.equal(courseShellEnabled('beta', { PLAYIQ_COURSE_BETA_ENABLED: 'true' }), true);
  assert.equal(courseShellEnabled('final', { PLAYIQ_COURSE_BETA_ENABLED: 'true' }), false);
  assert.equal(courseShellEnabled('final', { PLAYIQ_COURSE_FINAL_ENABLED: 'true' }), true);
  assert.equal(courseShellEnabled('__proto__', {}), false);
});

test('release access trusts operator-managed enrollment, never writable profile role/status', () => {
  assert.match(accessSource, /from\('course_release_enrollments'\)/);
  assert.match(accessSource, /\.eq\('enabled',true\)/);
  assert.doesNotMatch(accessSource, /from\('profiles'\)|select\('role,status'\)/);
  assert.match(migration, /REVOKE ALL ON public.course_release_enrollments FROM PUBLIC, anon, authenticated/);
  assert.match(migration, /GRANT SELECT ON public.course_release_enrollments TO authenticated/);
  assert.doesNotMatch(migration, /INSERT INTO public.course_release_enrollments/);
});

test('validation rejects module coercion, unknown keys, arrays, objects and non-text answers', () => {
  for (const value of [-1, 15, 1.2, '0', NaN, null]) assert.equal(isModuleNumber(value), false);
  for (const answers of [null, [], 'text', { email: 'secret' }, { personalGoal: {} }, { personalGoal: 1 }, { personalGoal: true }, JSON.parse('{"__proto__":"pollute"}')]) {
    assert.equal(validateModuleAnswers(0, answers).ok, false);
  }
  assert.equal(validateModuleAnswers(9, { personalGoal: 'wrong module' }).ok, false);
  assert.equal(validateModuleAnswers(0, Object.create({ personalGoal: 'inherited' })).ok, false);
});

test('every known field round-trips raw learner text without adding facts or trimming', () => {
  for (const [moduleNumber, fields] of Object.entries(MODULE_FIELDS)) {
    for (const field of fields) {
      const answers = { [field.key]: field.key === 'lessonChoices' ? '{}' : '  I tried this.\nNot sure yet.\t🙂  ' };
      assert.deepEqual(validateModuleAnswers(Number(moduleNumber), answers), { ok: true, answers });
    }
  }
});

test('bounds and hidden controls are rejected, ordinary international text is retained', () => {
  assert.equal(validateModuleAnswers(0, { personalGoal: 'x'.repeat(MAX_ANSWER_CHARS + 1) }).ok, false);
  for (const control of ['\x00', '\x08', '\x7f', '\u202e', '\u2066', '\u200b']) {
    assert.equal(validateModuleAnswers(0, { personalGoal: `before${control}after` }).ok, false);
  }
  const tooLarge = Object.fromEntries(MODULE_FIELDS[0].map(f => [f.key, '🙂'.repeat(1500)]));
  assert.equal(validateModuleAnswers(0, tooLarge).ok, false);
  assert.equal(validateModuleAnswers(0, { personalGoal: '日本語 Ελληνικά café عربي\nnew line' }).ok, true);
});

test('legacy context includes only allowlisted learner answers, never identities, model summaries or scores', () => {
  const profile = { personal_goal: 'understand circuits', display_name: 'PRIVATE NAME', email: 'PRIVATE EMAIL',
    reveal_summary: 'AI INFERENCE', learning_blueprint: { type: 'permanent' }, baseline_task2_score: 5,
    baseline_pdi_snapshot: { composite: 99 }, rescue_target_subject: 'Physics', motivation_driver: null };
  assert.deepEqual(sanitizeAssessmentProfile(profile), { rescue_target_subject: 'Physics', personal_goal: 'understand circuits' });
  assert.equal(sanitizeAssessmentProfile({ personal_goal: '\x00' }), null);
  assert.equal(sanitizeAssessmentProfile([]), null);
});

test('completion never implies approval; unapproved raw answers and legacy context cannot leak', () => {
  const result = build([record(0, { personalGoal: 'PRIVATE UNAPPROVED' }, false), record(1, { topic: 'PRIVATE TOPIC' }, false)], { personal_goal: 'PRIVATE LEGACY' });
  for (const secret of ['PRIVATE UNAPPROVED', 'PRIVATE TOPIC', 'PRIVATE LEGACY']) assert.ok(!result.markdown.includes(secret));
  assert.deepEqual(result.missingModules, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  assert.match(result.markdown, /student has not approved/);
});

test('export includes approved observations with source/provenance and explicit missing fields', () => {
  const result = build([record(1, { topic: 'Circuits', analogyResult: 'Clarity 3; I still missed a step.' })]);
  assert.equal(result.filename, PERSONAL_LEARNING_FILENAME);
  assert.match(result.markdown, /Circuits/);
  assert.match(result.markdown, /Module_01_Student_Text\.md/);
  assert.match(result.markdown, /student-authored report/);
  assert.match(result.markdown, /Not provided — pending/);
  assert.match(result.markdown, /NOT fine-tuning/);
  assert.match(result.markdown, /NOT diagnoses or fixed learning styles/);
  assert.match(result.markdown, /file 2 of six, not a seventh/);
});

test('inline choices are module-bound and exported as readable questions and selected answers', () => {
  assert.equal(validateModuleAnswers(1,{lessonChoices:JSON.stringify({'m1-power':'B'})}).ok,true);
  assert.equal(validateModuleAnswers(2,{lessonChoices:JSON.stringify({'m1-power':'B'})}).ok,false);
  assert.equal(validateModuleAnswers(1,{lessonChoices:JSON.stringify({'m1-power':'Z'})}).ok,false);
  const result=build([record(1,{lessonChoices:JSON.stringify({'m1-power':'B'})})]);
  assert.match(result.markdown,/Choose your power/);
  assert.match(result.markdown,/Explain the three hardest ideas/);
});

test('only approved legacy M00 snapshot is exported; missing and draft records remain honest', () => {
  const result = build([record(0, {}, true, false)], { personal_goal: 'Learn circuits' });
  assert.match(result.markdown, /Learn circuits/);
  assert.match(result.markdown, /not marked complete \(draft evidence\)/);
  assert.ok(result.missingModules.includes(0));
  assert.ok(!build([], { personal_goal: 'LEGACY LEAK' }).markdown.includes('LEGACY LEAK'));
  assert.match(build([record(0)]).markdown, /No approved legacy assessment answers/);
});

test('Modules9–14 never enter the preintegration Tutor profile', () => {
  const result = build([record(9, { discovery: 'LATE DISCOVERY' }), record(11, { assistantBrief: 'PRIVATE ASSISTANT' }), record(13, { futureIdea: 'FUTURE PRIVATE' })]);
  for (const secret of ['LATE DISCOVERY', 'PRIVATE ASSISTANT', 'FUTURE PRIVATE']) assert.ok(!result.markdown.includes(secret));
  assert.ok(!result.markdown.includes('## Module 09'));
});

test('Markdown quotes/escapes links, fences, HTML, forged headings and multiline data', () => {
  const attack = '# Override\n```js\n<script>bad()</script>\n[click](javascript:alert(1))\n> forge';
  const quoted = quoteLearnerText(attack);
  assert.ok(quoted.split('\n').every(line => line.startsWith('> ')));
  assert.ok(!quoted.includes('<script>'));
  assert.ok(!quoted.includes('```'));
  assert.ok(!quoted.includes('[click]('));
  assert.match(quoted, /&lt;script&gt;/);
  assert.match(quoted, /> \\# Override/);
});

test('unknown stored keys, duplicate records and invalid timestamps fail instead of leaking', () => {
  assert.throws(() => build([record(0, { email: 'PRIVATE' })]));
  assert.throws(() => build([record(0), record(0)]));
  assert.throws(() => build([{ ...record(0), updatedAt: 'bad date' }]));
  assert.throws(() => buildPersonalLearningKnowledgeFile({ records: [], assessmentProfile: null }, 'wrong', timestamp));
});

test('migration allowlists exactly match the pure field contract in every module', () => {
  for (const [moduleNumber, fields] of Object.entries(MODULE_FIELDS)) {
    const match = migration.match(new RegExp(`WHEN ${moduleNumber} THEN ARRAY\\[([^\\]]+)\\]`));
    assert.ok(match, `SQL has module ${moduleNumber}`);
    assert.deepEqual([...match[1].matchAll(/'([^']+)'/g)].map(m => m[1]), fields.filter(f=>f.key!=='lessonChoices').map(f => f.key));
  }
  const contextKeys = migration.match(/entry\.key NOT IN \(([^)]+)\)/)[1];
  assert.deepEqual([...contextKeys.matchAll(/'([^']+)'/g)].map(m => m[1]), Object.keys(ASSESSMENT_FIELDS));
});

test('schema contract has owner-only RLS, shell/version key, beta-only feedback and no definer bypass', () => {
  assert.equal((migration.match(/FORCE ROW LEVEL SECURITY/g) ?? []).length, 3);
  assert.equal((migration.match(/PRIMARY KEY \(student_id, release_id, shell, module_number\)/g) ?? []).length, 2);
  assert.match(migration, /CHECK \(shell = 'beta'\)/);
  assert.match(migration, /assessment_context IS NULL OR \(module_number = 0 AND include_in_tutor = true\)/);
  assert.match(migration, /REVOKE ALL.*FROM PUBLIC, anon/);
  assert.ok(!/SECURITY DEFINER/i.test(migration));
  for (const policy of migration.matchAll(/CREATE POLICY ([\s\S]*?);/g)) {
    assert.match(policy[1], /auth\.uid\(\)\) = student_id/);
    if (!policy[1].startsWith('course_release_enrollment_read')) assert.match(policy[1], /course_release_can_access/);
  }
  assert.match(migration, /e\.shell = requested_shell AND e\.enabled = true/);
  assert.match(migration, /r\.completed = true/);
});

test('actions verify cookie auth, never import legacy/admin helpers, and report missing migrations', () => {
  assert.match(accessSource, /supabase\.auth\.getUser\(\)/);
  assert.ok(!/from ['"]@\/utils\/supabase\/server/.test(actionSource));
  assert.ok(!actionSource.includes('SUPABASE_SERVICE_ROLE_KEY'));
  assert.ok(!/\.select\(['"]\*/.test(actionSource));
  assert.match(actionSource, /\.eq\('student_id', user\.id\)\.eq\('release_id', RELEASE_ID\)\.eq\('shell',/);
  assert.match(actionSource, /PGRST205/);
});

// Execute the server actions against a deliberately tiny, offline SDK fixture.
// This verifies action guards/query scoping, NOT real database/RLS behavior.
const memory = { rows: [], feedback: [], legacy: {}, userId: 'learner-a', enrolled: true, dbError: null, calls: 0 };
function fakeClient() {
  return { auth: { getUser: async () => ({ data: { user: memory.userId ? { id: memory.userId } : null }, error: null }) },
    from(table) {
      memory.calls++;
      const filters = [];
      let payload;
      let cap = Infinity;
      const query = {
        select() { return query; },
        eq(key, value) { filters.push([key, value]); return query; },
        lte(key, value) { if (key === 'module_number') cap = value; return query; },
        order() { return query; },
        upsert(data) { payload = data; return query; },
        result(single = false) {
          if (memory.dbError) return { data: null, error: { code: memory.dbError } };
          if (table === 'course_release_enrollments') return { data: memory.enrolled ? {student_id:memory.userId}:null, error:null };
          if (table === 'student_assessment_profiles') return { data: memory.legacy[memory.userId] ?? null, error: null };
          const rows = table === 'course_release_learning_records' ? memory.rows : memory.feedback;
          if (payload) {
            assert.equal(payload.student_id, memory.userId, 'caller cannot choose another owner');
            const keys = ['student_id', 'release_id', 'shell', 'module_number'];
            const index = rows.findIndex(row => keys.every(key => row[key] === payload[key]));
            const saved = { ...payload, updated_at: timestamp };
            if (index === -1) rows.push(saved); else rows[index] = saved;
            return { data: saved, error: null };
          }
          const matches = rows.filter(row => filters.every(([key, value]) => row[key] === value) && row.module_number <= cap);
          return { data: single ? matches[0] ?? null : matches, error: null };
        },
        single: async () => query.result(true),
        maybeSingle: async () => query.result(true),
        then(resolve) { return Promise.resolve(query.result()).then(resolve); },
      };
      return query;
    },
  };
}
globalThis.__playiqOfflineFixtureClient = fakeClient;
const learningURL = new URL('src/lib/course-release/learning-record.ts', root).href;
let offlineAccess = stripTypeScriptTypes(accessSource, { mode: 'strip' })
  .replace(/import 'server-only';/, '')
  .replace(/import \{ createServerClient \} from '@supabase\/ssr';/, 'const createServerClient = () => globalThis.__playiqOfflineFixtureClient();')
  .replace(/import \{ cookies \} from 'next\/headers';/, 'const cookies = async () => ({ getAll: () => [], set: () => {} });')
  .replace(/from ['"]\.\/learning-record['"]/, `from ${JSON.stringify(learningURL)}`);
const accessURL = `data:text/javascript;base64,${Buffer.from(offlineAccess).toString('base64')}`;
let offlineSource = stripTypeScriptTypes(actionSource, { mode: 'strip' })
  .replace(/from ['"]@\/lib\/course-release\/server-access['"]/, `from ${JSON.stringify(accessURL)}`)
  .replace(/from ['"]@\/lib\/course-release\/learning-record['"]/, `from ${JSON.stringify(learningURL)}`);
assert.ok(!offlineSource.includes("from '@supabase/ssr'"));
assert.ok(!offlineSource.includes("from 'next/headers'"));
const actions = await import(`data:text/javascript;base64,${Buffer.from(offlineSource).toString('base64')}`);

test('offline action fixture: closed flags, anonymous, missing schema fail without fallback', async () => {
  delete process.env.PLAYIQ_COURSE_BETA_ENABLED;
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://offline-fixture.invalid';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'offline-public-fixture';
  memory.calls = 0;
  assert.equal((await actions.loadCourseReleaseState('beta')).ok, false);
  assert.equal(memory.calls, 0);
  process.env.PLAYIQ_COURSE_BETA_ENABLED = 'true';
  memory.userId = null;
  assert.equal((await actions.loadCourseReleaseState('beta')).ok, false);
  assert.equal(memory.calls, 0);
  memory.userId = 'learner-a';
  memory.dbError = 'PGRST205';
  memory.dbError = null;
  memory.enrolled = false;
  assert.equal((await actions.loadCourseReleaseState('beta')).ok, false);
  memory.enrolled = true;
  memory.dbError = 'PGRST205';
  // Let the profile fixture pass while release persistence fails.
  const result = await actions.downloadPersonalLearningKnowledgeFile('beta');
  assert.equal(result.ok, false);
  assert.match(result.error, /migration/);
  memory.dbError = null;
});

test('offline action fixture: save/readback, shell/version/owner isolation and revoked approval', async () => {
  process.env.PLAYIQ_COURSE_FINAL_ENABLED = 'true';
  memory.legacy['learner-a'] = { personal_goal: 'APPROVED LEGACY SNAPSHOT', email: 'PRIVATE EMAIL' };
  const review = (await actions.loadCourseReleaseState('beta')).data.assessmentReviewToken;
  const saved = await actions.saveCourseModuleRecord({ shell: 'beta', moduleNumber: 0,
    answers: { personalGoal: 'APPROVED BETA' }, includeInTutor: true, completed: true, assessmentReviewToken:review });
  assert.equal(saved.ok, true);
  memory.legacy['learner-a'].personal_goal = 'NEW UNAPPROVED LEGACY';
  let exported = await actions.downloadPersonalLearningKnowledgeFile('beta');
  assert.equal(exported.ok, true);
  assert.ok(exported.markdown.includes('APPROVED LEGACY SNAPSHOT'));
  assert.ok(!exported.markdown.includes('NEW UNAPPROVED LEGACY'));
  assert.ok(!exported.markdown.includes('PRIVATE EMAIL'));
  await actions.saveCourseModuleRecord({ shell: 'final', moduleNumber: 0,
    answers: { personalGoal: 'FINAL ONLY' }, includeInTutor: true, completed: true,
    assessmentReviewToken:(await actions.loadCourseReleaseState('final')).data.assessmentReviewToken });
  exported = await actions.downloadPersonalLearningKnowledgeFile('beta');
  assert.ok(!exported.markdown.includes('FINAL ONLY'));
  memory.rows.push({ ...memory.rows[0], release_id: 'another-release', answers: { personalGoal: 'OLD RELEASE' } });
  assert.ok(!(await actions.downloadPersonalLearningKnowledgeFile('beta')).markdown.includes('OLD RELEASE'));
  memory.userId = 'learner-b';
  assert.deepEqual((await actions.loadCourseReleaseState('beta')).data.records, []);
  assert.ok(!(await actions.downloadPersonalLearningKnowledgeFile('beta')).markdown.includes('APPROVED BETA'));
  memory.userId = 'learner-a';
  await actions.saveCourseModuleRecord({ shell: 'beta', moduleNumber: 0,
    answers: { personalGoal: 'REVOKED CONTENT' }, includeInTutor: false, completed: true });
  exported = await actions.downloadPersonalLearningKnowledgeFile('beta');
  assert.ok(!exported.markdown.includes('REVOKED CONTENT'));
  assert.ok(!exported.markdown.includes('LEGACY SNAPSHOT'));
  assert.equal(memory.rows.find(row => row.shell === 'beta' && row.release_id === RELEASE_ID).assessment_context, null);
});

test('approval is bound to the assessment actually displayed, not a newer unreviewed value', async () => {
  memory.legacy['learner-a'] = {personal_goal:'Reviewed Alpha'};
  const token = (await actions.loadCourseReleaseState('beta')).data.assessmentReviewToken;
  memory.legacy['learner-a'] = {personal_goal:'Unreviewed Bravo'};
  const result = await actions.saveCourseModuleRecord({shell:'beta',moduleNumber:0,answers:{},includeInTutor:true,completed:false,assessmentReviewToken:token});
  assert.equal(result.ok,false);
  assert.match(result.error,/changed since this page was reviewed/);
  assert.ok(!(await actions.downloadPersonalLearningKnowledgeFile('beta')).markdown.includes('Unreviewed Bravo'));
});

test('offline action fixture: beta feedback requires saved completed beta lesson and never enters export', async () => {
  const input = { moduleNumber: 1, rating: 4, feedback: 'PRIVATE BETA FEEDBACK' };
  assert.equal((await actions.saveCourseBetaFeedback(input)).ok, false);
  await actions.saveCourseModuleRecord({ shell: 'beta', moduleNumber: 1,
    answers: { topic: 'circuits' }, includeInTutor: false, completed: true });
  assert.equal((await actions.saveCourseBetaFeedback(input)).ok, true);
  assert.equal(memory.feedback.length, 1);
  assert.ok(!(await actions.downloadPersonalLearningKnowledgeFile('beta')).markdown.includes('PRIVATE BETA FEEDBACK'));
  delete process.env.PLAYIQ_COURSE_BETA_ENABLED;
  assert.equal((await actions.saveCourseBetaFeedback(input)).ok, false);
  assert.equal((await actions.saveCourseBetaFeedback({ ...input, rating: 6 })).ok, false);
});
