import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CHARACTER_ACTIONS,
  CHARACTER_ACTION_EVENT_NAME,
  CHARACTER_ACTION_EVENT_PROTOCOL,
  CHARACTER_NEUTRAL_EVENT_NAME,
  dispatchCharacterActionForGuidedAiResponse,
  parseCharacterActionForGuidedAiResponse,
  parseCharacterActionEvent,
  selectCharacterActionForGuidedAiResponse,
  syncCharacterWithGuidedAiResponse,
} from '../src/lib/orion/action-contract.ts';

test('accepts every exact action envelope from the allowlist', () => {
  for (const action of CHARACTER_ACTIONS) {
    const parsed = parseCharacterActionEvent({ protocol: CHARACTER_ACTION_EVENT_PROTOCOL, action });
    assert.deepEqual(parsed, { protocol: CHARACTER_ACTION_EVENT_PROTOCOL, action });
    assert.equal(Object.isFrozen(parsed), true);
  }
});

test('never treats action names or chat prose as events', () => {
  assert.equal(parseCharacterActionEvent('wave'), null);
  assert.equal(parseCharacterActionEvent('Please wave hello'), null);
  assert.equal(parseCharacterActionEvent({ response: 'wave' }), null);
});

test('rejects unsupported actions, wrong protocol, and extra fields', () => {
  assert.equal(parseCharacterActionEvent({ protocol: CHARACTER_ACTION_EVENT_PROTOCOL, action: 'run_code' }), null);
  assert.equal(parseCharacterActionEvent({ protocol: 'sienvi.character-action.v0', action: 'wave' }), null);
  assert.equal(parseCharacterActionEvent({ protocol: CHARACTER_ACTION_EVENT_PROTOCOL, action: 'wave', code: 'alert(1)' }), null);
  assert.equal(parseCharacterActionEvent(null), null);
  assert.equal(parseCharacterActionEvent([]), null);
  const accessorEnvelope = { protocol: CHARACTER_ACTION_EVENT_PROTOCOL };
  Object.defineProperty(accessorEnvelope, 'action', { enumerable: true, get() { throw new Error('accessor must not run'); } });
  assert.equal(parseCharacterActionEvent(accessorEnvelope), null);
  assert.equal(parseCharacterActionEvent(new Proxy({}, { ownKeys() { throw new Error('proxy rejected'); } })), null);
});

test('dispatches only allowed actions from non-routed allowed responses', () => {
  const characterAction = { protocol: CHARACTER_ACTION_EVENT_PROTOCOL, action: 'wave' };
  assert.deepEqual(
    parseCharacterActionForGuidedAiResponse({ integrityAction: 'allowed', characterAction }),
    characterAction,
  );
  assert.equal(parseCharacterActionForGuidedAiResponse({ integrityAction: 'refused', characterAction }), null);
  assert.equal(parseCharacterActionForGuidedAiResponse({ integrityAction: 'allowed', safetyRoute: { target: 'blocked' }, characterAction }), null);
  assert.equal(parseCharacterActionForGuidedAiResponse({ integrityAction: 'modified', characterAction }), null);
  assert.equal(parseCharacterActionForGuidedAiResponse({ integrityAction: 'allowed', response: 'wave' }), null);
});

test('automatic response metadata emits one event; prose and safety responses emit none', () => {
  const target = new EventTarget();
  const actions = [];
  target.addEventListener(CHARACTER_ACTION_EVENT_NAME, (event) => actions.push(event.detail.action));
  const characterAction = { protocol: CHARACTER_ACTION_EVENT_PROTOCOL, action: 'concerned' };

  assert.equal(dispatchCharacterActionForGuidedAiResponse({ integrityAction: 'allowed', response: 'Let us slow down.', characterAction }, target), true);
  assert.equal(dispatchCharacterActionForGuidedAiResponse({ integrityAction: 'allowed', response: 'wave' }, target), false);
  assert.equal(dispatchCharacterActionForGuidedAiResponse({ integrityAction: 'refused', characterAction }, target), false);
  assert.equal(dispatchCharacterActionForGuidedAiResponse({ integrityAction: 'allowed', safetyRoute: { target: 'blocked' }, characterAction }, target), false);
  assert.deepEqual(actions, ['concerned']);
});

test('validated allowed replies get a visual action when metadata is omitted', () => {
  const allowed = { mode: 'chat', integrityAction: 'allowed', response: 'Let us work through it.' };
  assert.deepEqual(selectCharacterActionForGuidedAiResponse(allowed), {
    protocol: CHARACTER_ACTION_EVENT_PROTOCOL,
    action: 'wave',
  });
  assert.deepEqual(selectCharacterActionForGuidedAiResponse({ ...allowed, response: 'Please do not wave' }), selectCharacterActionForGuidedAiResponse(allowed));
  assert.equal(selectCharacterActionForGuidedAiResponse({ ...allowed, integrityAction: 'refused' }), null);
  assert.equal(selectCharacterActionForGuidedAiResponse({ ...allowed, safetyRoute: { target: 'blocked' } }), null);
  assert.equal(selectCharacterActionForGuidedAiResponse({ ...allowed, effortRequired: true }), null);
  assert.equal(selectCharacterActionForGuidedAiResponse({ ...allowed, retryRequired: true }), null);
  assert.equal(selectCharacterActionForGuidedAiResponse({ ...allowed, characterAction: { protocol: 'wrong', action: 'cheer' } }), null);
  assert.deepEqual(selectCharacterActionForGuidedAiResponse({ ...allowed, characterAction: { protocol: CHARACTER_ACTION_EVENT_PROTOCOL, action: 'look_left' } }), {
    protocol: CHARACTER_ACTION_EVENT_PROTOCOL,
    action: 'look_left',
  });
});

test('a reply without a permitted action clears the previous pose without a gesture', () => {
  const target = new EventTarget();
  const actions = [];
  let neutralCount = 0;
  target.addEventListener(CHARACTER_ACTION_EVENT_NAME, (event) => actions.push(event.detail.action));
  target.addEventListener(CHARACTER_NEUTRAL_EVENT_NAME, () => { neutralCount += 1; });
  const characterAction = { protocol: CHARACTER_ACTION_EVENT_PROTOCOL, action: 'wave' };

  assert.equal(syncCharacterWithGuidedAiResponse({ integrityAction: 'allowed', characterAction }, target), true);
  assert.equal(syncCharacterWithGuidedAiResponse({ integrityAction: 'refused', characterAction }, target), false);
  assert.equal(syncCharacterWithGuidedAiResponse({ integrityAction: 'allowed', safetyRoute: { target: 'blocked' } }, target), false);
  assert.deepEqual(actions, ['wave']);
  assert.equal(neutralCount, 2);
});
