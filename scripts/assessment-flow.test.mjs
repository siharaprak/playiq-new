import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { diagnosticAnswerPatch, assessmentDraftPatch, firstUnansweredDiagnostic } from '../src/lib/assessment/assessment-flow.ts';

test('diagnostic fields and choices are explicitly allowlisted', () => {
  assert.deepEqual(diagnosticAnswerPatch('q1', 'C'), {explanation_style:'visual'});
  assert.throws(() => diagnosticAnswerPatch('__proto__', 'C'));
  assert.throws(() => diagnosticAnswerPatch('q1', '__proto__'));
  assert.throws(() => diagnosticAnswerPatch('q2', 'D'));
});
test('resume chooses the first unanswered diagnostic', () => {
  assert.equal(firstUnansweredDiagnostic(null), 0);
  assert.equal(firstUnansweredDiagnostic({explanation_style:'visual', pacing_preference:'sequential'}), 2);
  assert.equal(firstUnansweredDiagnostic({explanation_style:'invalid'}), 0);
});
test('draft answers cannot mutate arbitrary profile fields', () => {
  assert.deepEqual(assessmentDraftPatch('rescue_target_subject', '  Biology  '), {rescue_target_subject:'Biology'});
  assert.throws(() => assessmentDraftPatch('assessment_completed', 'true'));
  assert.throws(() => assessmentDraftPatch('baseline_task1_answer', 'Z'));
  assert.throws(() => assessmentDraftPatch('personal_goal', 'x'.repeat(201)));
  assert.throws(() => assessmentDraftPatch('__proto__', 'yes'));
});
test('reveal loads automatically, provides retry and avoids the ambiguous trigger', () => {
  const source = readFileSync(new URL('../src/components/assessment/OrionAssessment.tsx', import.meta.url),'utf8');
  assert.match(source, /phase === 5 && !revealSummary && !revealRequested.current/);
  assert.match(source, /Retry preparing my results/);
  assert.doesNotMatch(source, /Show Me What Orion Found/);
  assert.match(source, /await saveDiagnosticAnswer\(questionId, optionId\)/);
  assert.match(source, /Your answer was not saved/);
});
