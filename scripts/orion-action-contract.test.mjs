import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CHARACTER_ACTIONS,
  CHARACTER_ACTION_EVENT_PROTOCOL,
  parseCharacterActionForGuidedAiResponse,
  parseCharacterActionEvent,
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
