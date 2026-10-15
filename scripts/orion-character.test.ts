import assert from 'node:assert/strict';
import test from 'node:test';
import {
  LOCAL_POSES,
  POSES,
  applyIdleLife,
  dampFrame,
  evaluatePose,
  neutralFrame,
  shouldInterrupt,
} from '../src/lib/orion/poses';
import {
  ORION_LOCAL_EVENT_NAME,
  emitOrionReaction,
  parseOrionLocalEvent,
  pickOrionLine,
  selectLocalReactionForGuidedAiResponse,
} from '../src/lib/orion/local-events';
import { CHARACTER_ACTIONS } from '../src/lib/orion/action-contract';

test('every AI action and local pose has a pose definition', () => {
  for (const action of [...CHARACTER_ACTIONS, ...LOCAL_POSES]) {
    assert.ok(POSES[action], `missing pose: ${action}`);
  }
});

test('local poses never widen the AI-facing allowlist', () => {
  for (const pose of LOCAL_POSES) {
    assert.equal((CHARACTER_ACTIONS as readonly string[]).includes(pose), false, `${pose} leaked into v1 actions`);
  }
});

test('evaluatePose is deterministic and still frames contain no full rotations', () => {
  for (const pose of Object.keys(POSES) as (keyof typeof POSES)[]) {
    assert.deepEqual(evaluatePose(pose, 0.4, true), evaluatePose(pose, 0.4, true));
    const still = evaluatePose(pose, 99, false);
    assert.equal(still.spinYaw, 0);
    assert.equal(still.spinRoll, 0);
    for (const value of [still.yaw, still.pitch, still.roll, still.lift, still.armR.shoulder, still.antennaSpread]) {
      assert.ok(Number.isFinite(value));
    }
  }
});

test('timed poses finish their full rotation', () => {
  const end = evaluatePose('barrel_roll', 1.9, true);
  assert.ok(Math.abs(end.spinRoll - Math.PI * 2) < 1e-6);
  assert.ok(Math.abs(evaluatePose('spin', 1.3, true).spinYaw - Math.PI * 2) < 1e-6);
});

test('higher-priority gestures are not interrupted; held poses always yield', () => {
  assert.equal(shouldInterrupt('idle', 0, 'wave'), true);
  assert.equal(shouldInterrupt('think', 5000, 'look_up'), true);
  assert.equal(shouldInterrupt('cheer', 100, 'wave'), false);
  assert.equal(shouldInterrupt('cheer', 5000, 'wave'), true);
  assert.equal(shouldInterrupt('wave', 100, 'barrel_roll'), true);
});

test('damping converges towards the target', () => {
  const current = neutralFrame();
  const target = evaluatePose('cheer', 0.26, false);
  for (let i = 0; i < 120; i += 1) dampFrame(current, target, 1 / 60);
  assert.ok(Math.abs(current.armR.shoulder - target.armR.shoulder) < 0.01);
  assert.equal(current.face.eyeShape, 'star');
});

test('idle life blinks at some point in every cycle', () => {
  let blinked = false;
  for (let t = 0; t < 4.4; t += 0.01) {
    const frame = neutralFrame();
    applyIdleLife(frame, t, null);
    if (frame.face.eyeOpen < 0.2) blinked = true;
  }
  assert.equal(blinked, true);
});

test('local events parse strictly', () => {
  assert.deepEqual(parseOrionLocalEvent({ kind: 'reaction', pose: 'hop' }), { kind: 'reaction', pose: 'hop' });
  assert.deepEqual(parseOrionLocalEvent({ kind: 'thinking', on: true }), { kind: 'thinking', on: true });
  assert.equal(parseOrionLocalEvent({ kind: 'reaction', pose: 'wave' }), null);
  assert.equal(parseOrionLocalEvent({ kind: 'reaction', pose: 'think' }), null);
  assert.equal(parseOrionLocalEvent({ kind: 'reaction', pose: 'hop', extra: 1 }), null);
  assert.equal(parseOrionLocalEvent({ kind: 'thinking', on: 'yes' }), null);
  assert.equal(parseOrionLocalEvent('hop'), null);
  assert.equal(parseOrionLocalEvent(null), null);
});

test('emitOrionReaction dispatches a validated event', () => {
  const target = new EventTarget();
  const seen: unknown[] = [];
  target.addEventListener(ORION_LOCAL_EVENT_NAME, (event) => seen.push((event as CustomEvent).detail));
  assert.equal(emitOrionReaction('proud', target), true);
  assert.deepEqual(seen, [{ kind: 'reaction', pose: 'proud' }]);
});

test('local reactions stay neutral for refusals and safety routes', () => {
  assert.equal(selectLocalReactionForGuidedAiResponse({ integrityAction: 'allowed', effortRequired: true }, 'reply'), 'encourage');
  assert.equal(selectLocalReactionForGuidedAiResponse({ integrityAction: 'allowed' }, 'teach_back'), 'proud');
  assert.equal(selectLocalReactionForGuidedAiResponse({ integrityAction: 'allowed', retryRequired: true }, 'teach_back'), null);
  assert.equal(selectLocalReactionForGuidedAiResponse({ integrityAction: 'allowed' }, 'reply'), null);
  assert.equal(selectLocalReactionForGuidedAiResponse({ integrityAction: 'refused', effortRequired: true }, 'reply'), null);
  assert.equal(selectLocalReactionForGuidedAiResponse({ integrityAction: 'allowed', safetyRoute: { target: 'x' }, effortRequired: true }, 'reply'), null);
  assert.equal(selectLocalReactionForGuidedAiResponse(null, 'reply'), null);
});

test('voice lines avoid repeating the previous line', () => {
  for (let i = 0; i < 20; i += 1) {
    assert.notEqual(pickOrionLine('wave', 'Hey there! 👋'), 'Hey there! 👋');
  }
});
