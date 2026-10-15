import { emitOrionReaction, emitOrionCharacterAction } from './local-events';

/**
 * Phase 4: Tie Orion to student learning progress.
 *
 * Emits allowlisted, client-only visual reactions for key learning milestones:
 * - node_complete: thumbs_up
 * - quiz_pass: cheer
 * - boss_defeated: barrel_roll
 * - proof_uploaded: hop
 * - module_unlocked: cheer
 *
 * These celebrations are triggered strictly by trusted client code and cannot
 * be invoked via untrusted AI output or user chat prose.
 */
export type OrionCelebrationKind =
  | 'node_complete'
  | 'quiz_pass'
  | 'boss_defeated'
  | 'proof_uploaded'
  | 'module_unlocked';

export function celebrateOrion(kind: OrionCelebrationKind): boolean {
  if (typeof window === 'undefined') return false;
  switch (kind) {
    case 'node_complete':
      return emitOrionCharacterAction('thumbs_up');
    case 'quiz_pass':
      return emitOrionCharacterAction('cheer');
    case 'boss_defeated':
      return emitOrionReaction('barrel_roll');
    case 'proof_uploaded':
      return emitOrionReaction('hop');
    case 'module_unlocked':
      return emitOrionCharacterAction('cheer');
    default:
      return false;
  }
}
