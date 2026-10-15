export const CHARACTER_ACTION_EVENT_NAME = 'sienvi:character-action' as const;
export const CHARACTER_NEUTRAL_EVENT_NAME = 'sienvi:character-neutral' as const;
export const CHARACTER_ACTION_EVENT_PROTOCOL = 'sienvi.character-action.v1' as const;

export const CHARACTER_ACTIONS = [
  'idle', 'wave', 'thumbs_up', 'cheer', 'concerned', 'turn_around',
  'show_keyboard', 'stow_keyboard', 'look_left', 'look_right', 'look_up', 'look_down',
] as const;

export type CharacterAction = (typeof CHARACTER_ACTIONS)[number];
export type CharacterActionEvent = Readonly<{
  protocol: typeof CHARACTER_ACTION_EVENT_PROTOCOL;
  action: CharacterAction;
}>;

const allowedActions = new Set<string>(CHARACTER_ACTIONS);

const defaultGuidedAiActions: Readonly<Record<string, CharacterAction>> = Object.freeze({
  chat: 'wave',
  explain: 'wave',
  // Asking for a hint is a good thing: Orion looks curious, not worried.
  hint: 'look_up',
  quiz: 'thumbs_up',
  coach: 'thumbs_up',
  learn_your_way: 'wave',
  lesson_rescue_stub: 'concerned',
  lesson_rescue: 'concerned',
});

/** Strictly parses the versioned event envelope. This never inspects chat prose. */
export function parseCharacterActionEvent(value: unknown): CharacterActionEvent | null {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return null;
  try {
    const keys = Reflect.ownKeys(value);
    if (
      keys.length !== 2 ||
      !keys.includes('action') ||
      !keys.includes('protocol') ||
      keys.some((key) => typeof key !== 'string')
    ) return null;

    const protocol = Object.getOwnPropertyDescriptor(value, 'protocol');
    const action = Object.getOwnPropertyDescriptor(value, 'action');
    if (!protocol || !('value' in protocol) || !action || !('value' in action)) return null;
    if (
      protocol.value !== CHARACTER_ACTION_EVENT_PROTOCOL ||
      typeof action.value !== 'string' ||
      !allowedActions.has(action.value)
    ) return null;

    return Object.freeze({
      protocol: CHARACTER_ACTION_EVENT_PROTOCOL,
      action: action.value as CharacterAction,
    });
  } catch {
    return null;
  }
}

/** Fail-closed adapter for the authorized Guided AI response metadata. */
export function parseCharacterActionForGuidedAiResponse(
  data: {
    integrityAction: unknown;
    safetyRoute?: unknown;
    characterAction?: unknown;
  } | null | undefined,
): CharacterActionEvent | null {
  try {
    if (!data || data.integrityAction !== 'allowed' || data.safetyRoute) return null;
    return parseCharacterActionEvent(data.characterAction);
  } catch {
    return null;
  }
}

/** Supplies a visible fallback for validated, allowed replies when the model omits visual metadata. */
export function selectCharacterActionForGuidedAiResponse(
  data: {
    mode: string;
    integrityAction: unknown;
    safetyRoute?: unknown;
    effortRequired?: unknown;
    retryRequired?: unknown;
    characterAction?: unknown;
  } | null | undefined,
): CharacterActionEvent | null {
  if (!data || data.integrityAction !== 'allowed' || data.safetyRoute || data.effortRequired || data.retryRequired) return null;
  if (data.characterAction !== undefined) {
    const parsed = parseCharacterActionForGuidedAiResponse(data);
    if (!parsed) return null;
    if (parsed.action !== 'idle') return parsed;
  }
  const action = defaultGuidedAiActions[data.mode];
  return action ? Object.freeze({ protocol: CHARACTER_ACTION_EVENT_PROTOCOL, action }) : null;
}

/** Dispatches visual metadata from an allowed response; prose never becomes an action. */
export function dispatchCharacterActionForGuidedAiResponse(
  data: Parameters<typeof parseCharacterActionForGuidedAiResponse>[0],
  target: EventTarget | null = typeof window === 'undefined' ? null : window,
): boolean {
  const detail = parseCharacterActionForGuidedAiResponse(data);
  if (!detail || !target) return false;
  target.dispatchEvent(new CustomEvent(CHARACTER_ACTION_EVENT_NAME, { detail }));
  return true;
}

/** Clears a prior pose when the reply has no permitted visual action. */
export function syncCharacterWithGuidedAiResponse(
  data: Parameters<typeof parseCharacterActionForGuidedAiResponse>[0],
  target: EventTarget | null = typeof window === 'undefined' ? null : window,
): boolean {
  const dispatched = dispatchCharacterActionForGuidedAiResponse(data, target);
  if (!dispatched && target) target.dispatchEvent(new Event(CHARACTER_NEUTRAL_EVENT_NAME));
  return dispatched;
}
