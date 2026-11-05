import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  MODULES,
  COURSE_15_MODULES,
  COURSE_15_EXTENDED_IDS,
  getDbModuleIdForCourseModule,
  getCourseModuleNodeKey,
  isNodeKeyForCourseModule,
  resolveCourseModuleFromAnyId,
} from '../src/lib/constants.ts';
import { COURSE_MODULES_3_TO_12_CONFIG } from '../src/data/courseModules3To12Meta.ts';
import { MODULE_13_PREVIEW_CONTENT } from '../src/data/module13CharacterPreviewContent.ts';
import {
  MODULE_14_SIX_STAGES,
  MODULE_14_CAPSTONE_TRACKS,
  MODULE_14_QUIZ_QUESTIONS,
} from '../src/data/module14CapstoneContent.ts';
import { COURSE_MODULE_NODES_MAP, getCourseModuleNodeCount } from '../src/lib/modules/courseModuleNodes.ts';

const root = process.cwd();

test('15-module constants preserve 12 canonical DB UUIDs and define all 15 course modules (00..14)', () => {
  const dbModuleKeys = Object.keys(MODULES);
  assert.equal(dbModuleKeys.length, 12);
  assert.equal(COURSE_15_MODULES.length, 15);

  for (let i = 0; i <= 14; i++) {
    const mod = COURSE_15_MODULES[i];
    assert.equal(mod.num, i);
    assert.equal(mod.code, String(i).padStart(2, '0'));
    const dbUuid = getDbModuleIdForCourseModule(i);
    assert.ok(Object.values(MODULES).includes(dbUuid), `Module ${i} must map to a valid DB UUID`);
  }

  // Module 13 is the only optional preview module without a required proof artifact
  assert.equal(COURSE_15_MODULES[13].requiresArtifact, false);
  for (const m of COURSE_15_MODULES) {
    if (m.num !== 13) {
      assert.equal(m.requiresArtifact, true, `Module ${m.num} should require artifact/completion`);
    }
  }
});

test('node keys for Modules 10-14 are strictly isolated from legacy 12-module rows and from each other', () => {
  // Modules 1-9 use plain node IDs ('1', '2', ...)
  assert.equal(getCourseModuleNodeKey(3, '1'), '1');
  assert.equal(isNodeKeyForCourseModule(3, MODULES.MODULE_3_ID, '1'), true);
  assert.equal(isNodeKeyForCourseModule(3, MODULES.MODULE_4_ID, '1'), false);

  // Modules 10-12 share MODULES.MODULE_10_ID in DB but use prefixed node_id keys 'm10-*', 'm11-*', 'm12-*'
  assert.equal(getCourseModuleNodeKey(10, '1'), 'm10-1');
  assert.equal(getCourseModuleNodeKey(11, '2'), 'm11-2');
  assert.equal(getCourseModuleNodeKey(12, '4'), 'm12-4');

  // Legacy Module 10 rows ('1'..'7') must NOT count toward New Modules 10, 11, or 12
  for (const legacyNodeId of ['1', '2', '3', '4', '5', '6', '7']) {
    assert.equal(isNodeKeyForCourseModule(10, MODULES.MODULE_10_ID, legacyNodeId), false);
    assert.equal(isNodeKeyForCourseModule(11, MODULES.MODULE_10_ID, legacyNodeId), false);
    assert.equal(isNodeKeyForCourseModule(12, MODULES.MODULE_10_ID, legacyNodeId), false);
  }

  assert.equal(isNodeKeyForCourseModule(10, MODULES.MODULE_10_ID, 'm10-1'), true);
  assert.equal(isNodeKeyForCourseModule(11, MODULES.MODULE_10_ID, 'm10-1'), false);
  assert.equal(isNodeKeyForCourseModule(11, MODULES.MODULE_10_ID, 'm11-1'), true);
  assert.equal(isNodeKeyForCourseModule(12, MODULES.MODULE_10_ID, 'm12-1'), true);

  // Legacy Capstone node ('e1f94091-62d9-4ac9-8f0a-86c2e3650238') must NOT count toward New Module 13 or 14
  const legacyCapstoneNode = 'e1f94091-62d9-4ac9-8f0a-86c2e3650238';
  assert.equal(isNodeKeyForCourseModule(13, MODULES.CAPSTONE_ID, legacyCapstoneNode), false);
  assert.equal(isNodeKeyForCourseModule(14, MODULES.CAPSTONE_ID, legacyCapstoneNode), false);
  assert.equal(isNodeKeyForCourseModule(13, MODULES.CAPSTONE_ID, 'm13-1'), true);
  assert.equal(isNodeKeyForCourseModule(14, MODULES.CAPSTONE_ID, 'm14-1'), true);

  // resolveCourseModuleFromAnyId maps extended IDs cleanly
  const m12Resolved = resolveCourseModuleFromAnyId(COURSE_15_EXTENDED_IDS.NEW_MODULE_12_TEST_ASSISTANT_ID);
  assert.equal(m12Resolved.courseModuleNumber, 12);
  assert.equal(m12Resolved.dbModuleId, MODULES.MODULE_10_ID);
});

test('Modules 3-12 nodes, quizzes, boss battles, and route files are complete and aligned', () => {
  const expectedNodeCounts = {
    3: 4,
    4: 5,
    5: 4,
    6: 4,
    7: 4,
    8: 4,
    9: 6,
    10: 4,
    11: 4,
    12: 4,
  };

  for (let n = 3; n <= 12; n++) {
    assert.equal(getCourseModuleNodeCount(n), expectedNodeCounts[n], `Module ${n} node count mismatch`);
    const nodes = COURSE_MODULE_NODES_MAP[n];
    for (let k = 1; k <= expectedNodeCounts[n]; k++) {
      const node = nodes[String(k)];
      assert.ok(node, `Module ${n} missing node ${k}`);
      assert.ok(node.title.length > 3);
      assert.ok(node.sections.length > 0);
      assert.ok(node.activity.title.length > 3);
      assert.ok(node.activity.instructions.length > 0);
      assert.ok(node.miniCheck.length > 0);
      assert.ok(node.teachBack.length > 10);
    }

    const cfg = COURSE_MODULES_3_TO_12_CONFIG[n];
    assert.ok(cfg, `Missing config for Module ${n}`);
    assert.equal(cfg.quizQuestions.length, 6, `Module ${n} must have 6 quiz questions`);
    assert.equal(cfg.bossScenarios.length, 6, `Module ${n} must have 6 boss scenarios`);
    assert.equal(cfg.bossReflections.length, 3, `Module ${n} must have 3 boss reflections`);

    // Check route files exist on disk
    const modDir = path.join(root, 'src', 'app', '(dashboard)', 'student', 'modules', String(n));
    for (const rel of [
      'page.tsx',
      'actions.ts',
      'overview/page.tsx',
      'quiz/page.tsx',
      'boss-battle/page.tsx',
      'proof-artifacts/page.tsx',
      'completion/page.tsx',
      'nodes/[nodeId]/lesson/page.tsx',
      'nodes/[nodeId]/activity/page.tsx',
      'nodes/[nodeId]/mini-check/page.tsx',
      'nodes/[nodeId]/teach-back/page.tsx',
      'nodes/[nodeId]/completion/page.tsx',
    ]) {
      assert.ok(fs.existsSync(path.join(modDir, rel)), `Missing route file Module ${n}/${rel}`);
    }
  }
});

test('Modules 13 and 14 content and route files are complete', () => {
  assert.ok(MODULE_13_PREVIEW_CONTENT.title.includes('Orion Character'));
  assert.equal(MODULE_13_PREVIEW_CONTENT.sections.length, 4);

  assert.equal(MODULE_14_SIX_STAGES.length, 6);
  assert.equal(MODULE_14_CAPSTONE_TRACKS.length, 5);
  assert.equal(MODULE_14_QUIZ_QUESTIONS.length, 3);

  for (const rel of [
    '13/page.tsx',
    '13/actions.ts',
    '13/overview/page.tsx',
    '13/completion/page.tsx',
    '14/page.tsx',
    '14/actions.ts',
    '14/overview/page.tsx',
    '14/overview/Module14CapstoneForm.tsx',
    '14/completion/page.tsx',
    'capstone/overview/page.tsx',
  ]) {
    const full = path.join(root, 'src', 'app', '(dashboard)', 'student', 'modules', rel);
    assert.ok(fs.existsSync(full), `Missing route file ${rel}`);
  }
});

test('sequential unlocking prevents later modules from unlocking when an earlier module is incomplete', () => {
  const homeSource = fs.readFileSync(
    path.join(root, 'src', 'app', '(dashboard)', 'student', 'home', 'page.tsx'),
    'utf8',
  );
  assert.ok(
    homeSource.includes('previousUnlockedAndCompleted = isUnlocked && isCompleted'),
    'Dashboard must require cumulative sequential unlock (isUnlocked && isCompleted)',
  );
  assert.ok(
    homeSource.includes('const recordCompleted = mod.num >= 13 && Boolean(learningRecordCompletedMap[mod.num])'),
    'Modules 1-12 must require Skill Tree node mastery rather than learningRecordCompletedMap alone',
  );

  const gatingSource = fs.readFileSync(path.join(root, 'src', 'lib', 'gating.ts'), 'utf8');
  assert.ok(
    gatingSource.includes('export async function enforceSequentialModuleUnlock'),
    'gating.ts must export enforceSequentialModuleUnlock',
  );
});

test('Orion stays visible when chat opens and BetaBlockerReport is centered in dark mode', () => {
  const panelSource = fs.readFileSync(
    path.join(root, 'src', 'components', 'guided-ai', 'GuidedAIPanel.tsx'),
    'utf8',
  );
  assert.ok(
    panelSource.includes('chatOpen={false}'),
    'GuidedAIPanel must pass chatOpen={false} so floating Orion remains visible when chat is open',
  );

  const cssSource = fs.readFileSync(
    path.join(root, 'src', 'components', 'course-release', 'course-release.module.css'),
    'utf8',
  );
  assert.ok(
    cssSource.includes('margin:28px auto') &&
      cssSource.includes('var(--course-panel-bg,rgba(15,23,42,0.88))'),
    'BetaBlockerReport .panel must be centered with margin:28px auto and dark fallback background',
  );
});
