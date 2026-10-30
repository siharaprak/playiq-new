// Offline only: actual action logic against a synthetic SDK, plus SSR/source contracts.
// Run: node --experimental-strip-types --test scripts/course-blocker.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes, createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const root = new URL('../', import.meta.url);
const actionText = readFileSync(new URL('src/app/(dashboard)/student/course-blocker-actions.ts', root), 'utf8');
const componentText = readFileSync(new URL('src/components/course-release/BetaBlockerReport.tsx', root), 'utf8');
const migration = readFileSync(new URL('supabase/migrations/20261030091000_course_release_blockers.sql', root), 'utf8');
const memory = { records: [], access: true, user: 'student-a', queryCount: 0,
  errorCode: null, readbackFailOnce: false, inserted: false, duplicateRace: false };

function fakeClient() {
  return { from(table) {
    assert.equal(table, 'course_release_blockers', 'never reads progress, survey, assessment or legacy support tables');
    memory.queryCount++;
    const filters = [];
    let payload;
    const query = {
      select() { return query; },
      eq(key, value) { filters.push([key, value]); return query; },
      insert(row) { payload = row; return query; },
      async execute(single) {
        if (memory.errorCode) return { data: null, error: { code: memory.errorCode, message: 'PRIVATE DB DETAIL' } };
        if (payload) {
          assert.equal(payload.student_id, memory.user);
          assert.equal(payload.release_id, 'playiq-2026-10-30');
          assert.equal(payload.created_at, undefined, 'timestamp comes from DB default');
          const existing = memory.records.find(row => row.id === payload.id);
          if (existing) return { data: null, error: { code: '23505' } };
          memory.records.push({ ...payload, created_at: '2026-10-30T12:00:00Z' });
          memory.inserted = true;
          if (memory.duplicateRace) return { data: null, error: { code: '23505' } };
          return { data: { id: payload.id }, error: null };
        }
        if (memory.readbackFailOnce && memory.inserted) {
          memory.readbackFailOnce = false;
          return { data: null, error: { code: 'CONNECTION_ENDED', message: 'PRIVATE DB DETAIL' } };
        }
        const matches = memory.records.filter(row => filters.every(([key, value]) => row[key] === value));
        return { data: single ? matches[0] ?? null : matches, error: null };
      },
      single: () => query.execute(true),
      maybeSingle: () => query.execute(true),
    };
    return query;
  } };
}
globalThis.__playiqBlockerAccess = async shell => {
  assert.equal(shell, 'beta', 'only the beta helper can authorize reporting');
  if (!memory.access) throw new Error('PRIVATE AUTH DETAIL');
  return { supabase: fakeClient(), user: { id: memory.user } };
};
const offlineAction = stripTypeScriptTypes(actionText, { mode: 'strip' })
  .replace(/import \{ requireCourseReleaseAccess \} from '@\/lib\/course-release\/server-access';/,
    'const requireCourseReleaseAccess = (...args) => globalThis.__playiqBlockerAccess(...args);')
  .replace(/from ['"]@\/lib\/course-release\/learning-record['"]/, `from ${JSON.stringify(new URL('src/lib/course-release/learning-record.ts', root).href)}`);
assert.ok(!offlineAction.includes("from '@/lib/course-release/server-access'"), 'no real SDK/helper imported in fixture');
const { submitCourseBlocker } = await import(`data:text/javascript;base64,${Buffer.from(offlineAction).toString('base64')}`);

const ID = 'e487520c-567a-438b-9c38-e6011ee371e3';
const valid = (overrides = {}) => ({ reportId: ID, moduleNumber: 0, message: 'The Continue button does nothing after I click it.',
  browser: 'Firefox 144', device: 'Linux; viewport 1280 × 800', pagePath: '/student/course-beta?module=0', severity: 'blocked', ...overrides });
function reset() {
  Object.assign(memory, { records: [], access: true, user: 'student-a', queryCount: 0,
    errorCode: null, readbackFailOnce: false, inserted: false, duplicateRace: false });
}

test('invalid text/types, extra identity fields, unsafe routes and mismatched modules fail before access', async () => {
  reset();
  const bad = [null, {}, valid({ message: 'short' }), valid({ message: 'x'.repeat(4001) }), valid({ message: 'hidden\u202e text here' }),
    valid({ moduleNumber: '0' }), valid({ moduleNumber: 15 }), valid({ severity: 'critical' }), valid({ reportId: 'not-uuid' }),
    valid({ browser: {} }), valid({ browser: 'x'.repeat(121) }), valid({ device: '' }), valid({ device: '\x00' }),
    valid({ pagePath: '/student/course?module=0' }), valid({ pagePath: 'https://site/student/course-beta' }),
    valid({ pagePath: '/student/course-beta?module=1' }), valid({ pagePath: '/student/course-beta?module=0&email=private' }),
    valid({ pagePath: '/student/course-beta#private' }), valid({ student_id: 'other-user' }), valid({ release_id: 'other' }), valid({ shell: 'final' })];
  for (const input of bad) {
    const result = await submitCourseBlocker(input);
    assert.equal(result.ok, false);
    assert.equal(result.reason, 'validation');
  }
  assert.equal(memory.queryCount, 0);
});

test('verified beta access is required; helper errors are not exposed', async () => {
  reset(); memory.access = false;
  const result = await submitCourseBlocker(valid());
  assert.equal(result.ok, false);
  assert.ok(!result.error.includes('PRIVATE AUTH DETAIL'));
  assert.equal(memory.queryCount, 0);
});

test('blocker saves before completion and returns confirmed id only after owner readback', async () => {
  reset();
  const result = await submitCourseBlocker(valid());
  assert.deepEqual(result, { ok: true, ticketId: ID, status: 'confirmed' });
  assert.equal(memory.records.length, 1);
  assert.equal(memory.records[0].student_id, 'student-a');
  assert.equal(memory.queryCount, 3, 'initial reconciliation, insert, confirmed readback');
  assert.equal(memory.records[0].message, valid().message);
});

test('same-id same-payload retry reconciles without duplicate or update', async () => {
  reset();
  assert.equal((await submitCourseBlocker(valid())).ok, true);
  assert.equal((await submitCourseBlocker(valid())).ok, true);
  assert.equal(memory.records.length, 1);
  const changed = await submitCourseBlocker(valid({ message: 'A different report cannot overwrite the saved ticket.' }));
  assert.equal(changed.ok, false);
  assert.match(changed.error, /different saved report/);
  assert.equal(memory.records[0].message, valid().message);
});

test('uncertain post-insert response stays unconfirmed; next retry recovers same ticket', async () => {
  reset(); memory.readbackFailOnce = true;
  const first = await submitCourseBlocker(valid());
  assert.equal(first.ok, false);
  assert.ok(!('ticketId' in first));
  assert.equal(memory.records.length, 1);
  assert.ok(!first.error.includes('PRIVATE DB DETAIL'));
  assert.deepEqual(await submitCourseBlocker(valid()), { ok: true, ticketId: ID, status: 'confirmed' });
  assert.equal(memory.records.length, 1);
});

test('concurrent duplicate insert reconciles once against readback', async () => {
  reset(); memory.duplicateRace = true;
  assert.deepEqual(await submitCourseBlocker(valid()), { ok: true, ticketId: ID, status: 'confirmed' });
  assert.equal(memory.records.length, 1);
});

test('another user cannot retrieve a known ticket ID or see its payload', async () => {
  reset(); await submitCourseBlocker(valid());
  memory.user = 'student-b';
  const other = await submitCourseBlocker(valid());
  assert.equal(other.ok, false);
  assert.ok(!other.error.includes(valid().message));
  assert.equal(memory.records.length, 1);
});

test('a mismatched release ticket is not confirmed', async () => {
  reset(); memory.records.push({ ...valid(), id: ID, student_id: 'student-a', release_id: 'other-release' });
  assert.equal((await submitCourseBlocker(valid())).ok, false);
});

test('missing schema and denied/failed writes produce safe explicit failures', async () => {
  for (const code of ['42P01', '42703', 'PGRST204', 'PGRST205', '42501']) {
    reset(); memory.errorCode = code;
    const result = await submitCourseBlocker(valid());
    assert.equal(result.ok, false);
    if (code !== '42501') assert.match(result.error, /20261030091000/);
    assert.ok(!result.error.includes('PRIVATE DB DETAIL'));
    assert.equal(memory.records.length, 0);
  }
});

test('all 15 modules, including optional Module13, can report without lesson or artifact gates', async () => {
  for (let moduleNumber = 0; moduleNumber <= 14; moduleNumber++) {
    reset();
    const result = await submitCourseBlocker(valid({ moduleNumber, pagePath: `/student/course-beta?module=${moduleNumber}` }));
    assert.equal(result.ok, true);
  }
});

test('source contracts use shared enrollment helper, no legacy support/admin/provider/profile dependence', () => {
  assert.match(actionText, /requireCourseReleaseAccess\('beta'\)/);
  for (const forbidden of ['support_issues', 'SUPABASE_SERVICE_ROLE_KEY', "from('profiles')", 'fetch(', '.upsert(', '.update(', '.delete(']) {
    assert.ok(!actionText.includes(forbidden));
  }
  assert.match(actionText, /\.eq\('student_id', user\.id\)\.eq\('release_id', RELEASE_ID\)/);
  assert.ok(!actionText.includes('completed'));
});

test('migration enforces owner and beta enrollment, bounded input, no student update/delete or created_at insert grant', () => {
  assert.match(migration, /FORCE ROW LEVEL SECURITY/);
  for (const policy of migration.matchAll(/CREATE POLICY ([\s\S]*?);/g)) {
    assert.match(policy[1], /auth\.uid\(\)\) = student_id/);
    assert.match(policy[1], /course_release_can_access\('beta'\)/);
  }
  assert.ok(!/FOR UPDATE|FOR DELETE|SECURITY DEFINER/.test(migration));
  const insertGrant = migration.match(/GRANT INSERT \(([^)]+)\)/)[1];
  assert.ok(!insertGrant.includes('created_at'));
  assert.match(migration, /module_number BETWEEN 0 AND 14/);
  assert.match(migration, /BETWEEN 10 AND 4000/);
  assert.match(migration, /page_path = '\/student\/course-beta\?module=' \|\| module_number::text/);
  assert.ok(!migration.includes('r.completed'));
});

// Render the actual TSX component without Next/server or browser/network services.
const require = createRequire(import.meta.url);
const compiled = ts.transpileModule(componentText, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const fixtureModule = { exports: {} };
function fixtureRequire(name) {
  if (name === 'react' || name === 'react/jsx-runtime') return require(name);
  if (name.endsWith('course-blocker-actions')) return { submitCourseBlocker: async () => { throw new Error('SSR cannot submit'); } };
  if (name.endsWith('.module.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
  throw new Error(`Unexpected component dependency: ${name}`);
}
new Function('require', 'module', 'exports', compiled)(fixtureRequire, fixtureModule, fixtureModule.exports);
const Component = fixtureModule.exports.default;

test('SSR component is beta-only, accessible, usable before completion, and distinct from surveys', () => {
  assert.equal(renderToStaticMarkup(React.createElement(Component, { shell: 'final', moduleNumber: 0 })), '');
  const html = renderToStaticMarkup(React.createElement(Component, { shell: 'beta', moduleNumber: 0 }));
  assert.match(html, /Report a problem \/ I’m blocked/);
  assert.match(html, /even if you cannot finish/);
  assert.match(html, /separate from the end-of-module feedback/);
  assert.match(html, /name="message"/);
  assert.match(html, /name="severity"/);
  assert.match(html, /name="browser"/);
  assert.match(html, /name="device"/);
  assert.match(html, /<label[^>]+for=/);
  assert.ok(!html.includes('disabled=""'));
  assert.ok(!html.includes('name="file"'));
  assert.ok(!html.includes('Report saved and confirmed'));
});

test('component freezes uncertain reports, checks confirmed status, exposes copy fallback, collects no screenshots', () => {
  assert.match(componentText, /submit = submitCourseBlocker/);
  assert.match(componentText, /result\.status === 'confirmed'/);
  assert.match(componentText, /Retry this same report/);
  assert.match(componentText, /Report reference \(not a confirmation\)/);
  assert.match(componentText, /ticketInput\.current\?\.select\(\)/);
  assert.match(componentText, /navigator\.clipboard/);
  for (const forbidden of ['getDisplayMedia', 'getUserMedia', 'html2canvas', 'localStorage', 'sessionStorage', 'document.cookie', 'window.location.href']) {
    assert.ok(!componentText.includes(forbidden));
  }
});
