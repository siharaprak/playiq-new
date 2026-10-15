import { LOCAL_POSES, type LocalPose, type OrionPose } from './poses';
import {
  CHARACTER_ACTION_EVENT_NAME,
  CHARACTER_ACTION_EVENT_PROTOCOL,
  parseCharacterActionEvent,
  type CharacterAction,
} from './action-contract';

/**
 * Trusted, client-only Orion events.
 *
 * These are deliberately separate from the AI-facing `sienvi.character-action.v1`
 * contract: they are emitted only by PlayIQ UI code (loading state, pokes,
 * learning milestones) and are never derived from model output or chat prose.
 */

export const ORION_LOCAL_EVENT_NAME = 'playiq:orion-local' as const;

export type OrionLocalEvent =
  | Readonly<{ kind: 'reaction'; pose: LocalPose }>
  | Readonly<{ kind: 'thinking'; on: boolean }>;

const localPoses = new Set<string>(LOCAL_POSES);
// Reactions UI code may request. `think`/`sleepy` are states managed by Orion itself.
const requestableReactions = new Set<string>(LOCAL_POSES.filter((pose) => pose !== 'think' && pose !== 'sleepy'));

export function parseOrionLocalEvent(value: unknown): OrionLocalEvent | null {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return null;
  try {
    const keys = Reflect.ownKeys(value);
    if (keys.length !== 2 || keys.some((key) => typeof key !== 'string')) return null;
    const kind = Object.getOwnPropertyDescriptor(value, 'kind');
    if (!kind || !('value' in kind)) return null;

    if (kind.value === 'reaction') {
      const pose = Object.getOwnPropertyDescriptor(value, 'pose');
      if (!pose || !('value' in pose) || typeof pose.value !== 'string' || !requestableReactions.has(pose.value)) return null;
      return Object.freeze({ kind: 'reaction', pose: pose.value as LocalPose });
    }
    if (kind.value === 'thinking') {
      const on = Object.getOwnPropertyDescriptor(value, 'on');
      if (!on || !('value' in on) || typeof on.value !== 'boolean') return null;
      return Object.freeze({ kind: 'thinking', on: on.value });
    }
    return null;
  } catch {
    return null;
  }
}

const defaultTarget = (): EventTarget | null => (typeof window === 'undefined' ? null : window);

export function emitOrionReaction(pose: LocalPose, target: EventTarget | null = defaultTarget()): boolean {
  const detail = parseOrionLocalEvent({ kind: 'reaction', pose });
  if (!detail || !target) return false;
  target.dispatchEvent(new CustomEvent(ORION_LOCAL_EVENT_NAME, { detail }));
  return true;
}

export function emitOrionCharacterAction(action: CharacterAction, target: EventTarget | null = defaultTarget()): boolean {
  const detail = parseCharacterActionEvent({ protocol: CHARACTER_ACTION_EVENT_PROTOCOL, action });
  if (!detail || !target) return false;
  target.dispatchEvent(new CustomEvent(CHARACTER_ACTION_EVENT_NAME, { detail }));
  return true;
}

export function setOrionThinking(on: boolean, target: EventTarget | null = defaultTarget()): void {
  target?.dispatchEvent(new CustomEvent(ORION_LOCAL_EVENT_NAME, { detail: Object.freeze({ kind: 'thinking', on }) }));
}

/**
 * Chooses an encouraging local reaction for an allowed Guided AI reply that
 * carried no gesture of its own. Refusals and safety routes stay neutral.
 */
export function selectLocalReactionForGuidedAiResponse(
  data: {
    integrityAction: unknown;
    safetyRoute?: unknown;
    effortRequired?: unknown;
    retryRequired?: unknown;
  } | null | undefined,
  context: 'reply' | 'teach_back',
): LocalPose | null {
  if (!data || data.integrityAction !== 'allowed' || data.safetyRoute) return null;
  if (data.effortRequired === true) return 'encourage';
  if (context === 'teach_back' && data.retryRequired !== true) return 'proud';
  return null;
}

export const isLocalPose = (value: unknown): value is LocalPose => typeof value === 'string' && localPoses.has(value);

// ── Preferences ────────────────────────────────────────────────────────────

export type OrionPreferences = {
  /** null follows the operating-system setting. */
  reducedMotion: boolean | null;
  captions: boolean;
  textOnly: boolean;
};

const PREFS_KEY = 'playiq_orion_prefs_v1';
export const DEFAULT_ORION_PREFERENCES: OrionPreferences = Object.freeze({ reducedMotion: null, captions: true, textOnly: false });

export function loadOrionPreferences(): OrionPreferences {
  if (typeof window === 'undefined') return { ...DEFAULT_ORION_PREFERENCES };
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...DEFAULT_ORION_PREFERENCES };
    const parsed = JSON.parse(raw) as Partial<OrionPreferences>;
    return {
      reducedMotion: typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : null,
      captions: typeof parsed.captions === 'boolean' ? parsed.captions : true,
      textOnly: typeof parsed.textOnly === 'boolean' ? parsed.textOnly : false,
    };
  } catch {
    return { ...DEFAULT_ORION_PREFERENCES };
  }
}

export function saveOrionPreferences(prefs: OrionPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Storage can be unavailable (private mode, quota); preferences stay in memory.
  }
}

// ── Voice ──────────────────────────────────────────────────────────────────

/** Short lines in Orion's voice. Also serve as accessible captions. */
export const ORION_LINES: Readonly<Record<OrionPose, readonly string[]>> = Object.freeze({
  idle: ['Standing by, apprentice.', 'Ready when you are.', 'Thrusters warm. Brain warmer.'],
  wave: ['Hey there! 👋', 'Hi, apprentice!', 'Beep boop — hello!'],
  thumbs_up: ['Nice thinking! 👍', 'Solid move.', 'That’s the spirit.'],
  cheer: ['WOOHOO! 🎉', 'You did it!', 'Victory thrusters engaged!'],
  concerned: ['Hmm, let’s untangle this together.', 'Tricky one. We’ve got this.', 'Let’s slow down and look closer.', 'My circuits need a breather — try again in a moment.'],
  turn_around: ['Check out my back panel!', 'Spinning around…'],
  show_keyboard: ['Keyboard deployed. ⌨️', 'Let me type that out…'],
  stow_keyboard: ['Keyboard stowed.', 'Tucking that away.'],
  look_left: ['Ooh, what’s over there?', 'Scanning left…'],
  look_right: ['Scanning right…', 'Hmm, over here?'],
  look_up: ['Ooh, interesting question…', 'Let me think about that…', 'Curious! Tell me more.'],
  look_down: ['Let’s look at the details.', 'Zooming in…'],
  think: ['Thinking…', 'Crunching the numbers…', 'Processing… beep boop.', 'Consulting my circuits…'],
  encourage: ['Give it a shot — I believe in you! 💪', 'Your turn! Try it first.', 'Show me what you’ve got!'],
  proud: ['Look at you go! ⭐', 'That was brilliant!', 'Big brain energy!'],
  hop: ['Boing!', 'Whee!', 'Hop!'],
  spin: ['Wheee!', 'Spin cycle!', 'Round and round!'],
  wink: ['😉', 'Psst — you’re doing great.', 'Our secret.'],
  giggle: ['Hehe, that tickles!', 'Ha! Stop it!', 'Bzzt — ticklish circuits!'],
  barrel_roll: ['DO A BARREL ROLL! 🚀', 'Maximum thrust!', 'You found my secret move!'],
  sleepy: ['Zzz… (poke me to wake me up)', 'Power-saving mode… zzz'],
  wake: ['Huh?! I’m up!', 'Whoa — back online!', 'I wasn’t sleeping, I was… defragmenting.'],
});

export function pickOrionLine(pose: OrionPose, previous?: string, random: () => number = Math.random): string {
  const lines = ORION_LINES[pose];
  if (lines.length === 1) return lines[0];
  const options = lines.filter((line) => line !== previous);
  return options[Math.floor(random() * options.length)] ?? lines[0];
}

export function greetingFor(name: string | undefined, now: Date = new Date()): string {
  const hour = now.getHours();
  const time = hour < 5 ? 'Burning the midnight oil' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const who = name && name !== 'Student' ? `, ${name}` : '';
  return `${time}${who}! 👋`;
}
