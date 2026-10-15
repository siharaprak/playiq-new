import type { CharacterAction } from './action-contract';

/**
 * Orion pose system.
 *
 * Pure, renderer-agnostic data: every pose is a function of time that mutates a
 * PoseFrame of *offsets* from the authored rest pose. The same evaluator feeds
 * both the animated (damped) path and the reduced-motion (still) path, so new
 * poses only need to be written once.
 *
 * Arm values are side-normalised: the renderer multiplies shoulder/elbow/wrist/
 * thumb by the arm side (-1 left, +1 right) before applying them to rotation.z.
 */

/** Client-only poses. Triggered by trusted UI code, never by AI output. */
export const LOCAL_POSES = [
  'think', 'encourage', 'proud', 'hop', 'spin', 'wink', 'giggle', 'barrel_roll', 'sleepy', 'wake',
] as const;
export type LocalPose = (typeof LOCAL_POSES)[number];
export type OrionPose = CharacterAction | LocalPose;

export type EyeShape = 'normal' | 'happy' | 'star' | 'wink' | 'sleepy' | 'loading' | 'wide';
export type MouthShape = 'grin' | 'smile' | 'open' | 'o' | 'flat' | 'smirk';

export type FaceState = {
  /** 0 closed – 1 open. */
  eyeOpen: number;
  /** -1..1, positive = viewer's right. */
  pupilX: number;
  /** -1..1, positive = down. */
  pupilY: number;
  eyeShape: EyeShape;
  mouth: MouthShape;
  /** -1 worried … +1 determined. 0 hides brows. */
  brow: number;
  blush: boolean;
  zzz: boolean;
  /** Radians; drives the loading-eye spinner. */
  spin: number;
};

export type ArmTarget = { shoulder: number; elbow: number; wrist: number; finger: number; thumb: number };

export type PoseFrame = {
  yaw: number;
  pitch: number;
  roll: number;
  lift: number;
  armL: ArmTarget;
  armR: ArmTarget;
  /** Positive splays both antennae outward (droop), negative perks them up. */
  antennaSpread: number;
  antennaL: number;
  antennaR: number;
  podLift: number;
  podTilt: number;
  /** Thruster glow multiplier, 1 = authored intensity. */
  thruster: number;
  /** Undamped full rotations (spins and rolls) applied after smoothing. */
  spinYaw: number;
  spinRoll: number;
  face: FaceState;
};

export type PoseDef = {
  /** Milliseconds before returning to the base pose; null holds until replaced. */
  durationMs: number | null;
  /** Higher priority poses are not interrupted by lower ones; they queue instead. */
  priority: number;
  /** Seconds into the pose that best represents it as a still (reduced motion). */
  stillT: number;
  facing?: 'front' | 'rear' | 'toggle';
  keyboard?: 'open' | 'closed' | 'follow-facing';
  apply: (frame: PoseFrame, t: number) => void;
};

const arm = (): ArmTarget => ({ shoulder: 0, elbow: 0, wrist: 0, finger: 0, thumb: 0 });

export const neutralFace = (): FaceState => ({
  eyeOpen: 1, pupilX: 0, pupilY: 0, eyeShape: 'normal', mouth: 'smile', brow: 0, blush: false, zzz: false, spin: 0,
});

export const neutralFrame = (): PoseFrame => ({
  yaw: 0, pitch: 0, roll: 0, lift: 0,
  armL: arm(), armR: arm(),
  antennaSpread: 0, antennaL: 0, antennaR: 0,
  podLift: 0, podTilt: 0, thruster: 1,
  spinYaw: 0, spinRoll: 0,
  face: neutralFace(),
});

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeInOut = (value: number) => {
  const x = clamp01(value);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
/** Single arc 0→1→0 over `length` seconds. */
const arc = (t: number, length: number) => Math.sin(clamp01(t / length) * Math.PI);
/** Fades a wiggle out towards the end of a pose. */
const fade = (t: number, length: number) => 1 - clamp01((t - length * 0.7) / (length * 0.3));
const TAU = Math.PI * 2;

export const POSES: Readonly<Record<OrionPose, PoseDef>> = Object.freeze({
  idle: { durationMs: null, priority: 0, stillT: 0, facing: 'front', keyboard: 'closed', apply: () => {} },

  // ── AI-allowlisted actions (sienvi.character-action.v1) ──────────────────
  wave: {
    durationMs: 1900, priority: 2, stillT: 0.17,
    apply: (f, t) => {
      const w = Math.sin(t * 9) * fade(t, 1.9);
      f.armR.shoulder = 1.85 + w * 0.32;
      f.armR.elbow = 0.36 + w * 0.2;
      f.armR.wrist = w * 0.35;
      f.antennaR = w * 0.12;
      f.roll = Math.sin(t * 4.5) * 0.035;
      f.face.eyeShape = t > 0.25 && t < 1.5 ? 'happy' : 'normal';
    },
  },
  thumbs_up: {
    durationMs: 1700, priority: 2, stillT: 0.5,
    apply: (f, t) => {
      f.armR.shoulder = 1.48; f.armR.elbow = -0.24; f.armR.finger = 0.72; f.armR.thumb = 0.34;
      f.lift = arc(t, 0.45) * 0.1;
      f.face.eyeShape = 'wink';
      f.face.mouth = 'smirk';
      f.antennaR = -0.25;
    },
  },
  cheer: {
    durationMs: 2100, priority: 3, stillT: 0.26,
    apply: (f, t) => {
      const pump = Math.sin(t * 10) * 0.15 * fade(t, 2.1);
      f.armL.shoulder = 2.2 + pump; f.armL.elbow = -0.12;
      f.armR.shoulder = 2.2 - pump; f.armR.elbow = -0.12;
      f.lift = Math.abs(Math.sin(t * 6)) * 0.14 * fade(t, 2.1);
      f.thruster = 2.4;
      f.antennaSpread = -0.35;
      f.antennaL = Math.sin(t * 12) * 0.1;
      f.antennaR = -Math.sin(t * 12) * 0.1;
      f.face.eyeShape = 'star';
      f.face.mouth = 'open';
    },
  },
  concerned: {
    durationMs: 2300, priority: 2, stillT: 0.6,
    apply: (f, t) => {
      f.armL.shoulder = 1.36; f.armL.elbow = -0.38; f.armL.wrist = 0.14;
      f.armR.shoulder = 1.36; f.armR.elbow = -0.38; f.armR.wrist = 0.14;
      f.antennaSpread = 0.5;
      f.pitch = 0.04;
      f.roll = Math.sin(t * 1.6) * 0.03;
      f.face.brow = -1;
      f.face.mouth = 'o';
      f.face.eyeOpen = 0.92;
      f.face.pupilY = 0.25;
    },
  },
  turn_around: { durationMs: null, priority: 1, stillT: 0, facing: 'toggle', keyboard: 'follow-facing', apply: () => {} },
  show_keyboard: { durationMs: null, priority: 1, stillT: 0, facing: 'rear', keyboard: 'open', apply: () => {} },
  stow_keyboard: { durationMs: null, priority: 1, stillT: 0, keyboard: 'closed', apply: () => {} },
  look_left: {
    durationMs: 1700, priority: 1, stillT: 0.5,
    apply: (f) => { f.yaw = 0.22; f.face.pupilX = 0.85; f.antennaL = 0.12; },
  },
  look_right: {
    durationMs: 1700, priority: 1, stillT: 0.5,
    apply: (f) => { f.yaw = -0.22; f.face.pupilX = -0.85; f.antennaR = -0.12; },
  },
  look_up: {
    // Doubles as Orion's "curious" pose: one antenna perks up and the head tilts.
    durationMs: 1900, priority: 1, stillT: 0.6,
    apply: (f, t) => {
      f.pitch = -0.08;
      f.roll = 0.06;
      f.face.pupilY = -0.85;
      f.face.pupilX = 0.25;
      f.face.mouth = 'smile';
      f.face.brow = 0.25;
      f.antennaL = -0.3 + Math.sin(t * 7) * 0.06 * fade(t, 1.9);
    },
  },
  look_down: {
    durationMs: 1700, priority: 1, stillT: 0.5,
    apply: (f) => { f.pitch = 0.08; f.face.pupilY = 0.85; f.face.mouth = 'smile'; },
  },

  // ── Local, trusted-client poses ──────────────────────────────────────────
  think: {
    durationMs: null, priority: 1, stillT: 0.3,
    apply: (f, t) => {
      f.antennaL = Math.sin(t * 7) * 0.18;
      f.antennaR = Math.sin(t * 7 + Math.PI) * 0.18;
      f.antennaSpread = -0.15;
      f.roll = Math.sin(t * 1.5) * 0.045;
      f.yaw = 0.08;
      f.thruster = 1 + Math.sin(t * 12) * 0.25;
      f.face.eyeShape = 'loading';
      f.face.mouth = 'flat';
      f.face.spin = t * 5;
    },
  },
  encourage: {
    durationMs: 1700, priority: 2, stillT: 0.35,
    apply: (f, t) => {
      const pump = Math.sin(t * 8) * fade(t, 1.7);
      f.armR.shoulder = 1.7 + pump * 0.25;
      f.armR.elbow = 0.25;
      f.armR.finger = 0.72;
      f.lift = arc(t, 0.5) * 0.08;
      f.antennaSpread = -0.3;
      f.face.eyeShape = 'happy';
      f.face.brow = 0.6;
      f.face.mouth = 'grin';
    },
  },
  proud: {
    durationMs: 2300, priority: 3, stillT: 0.6,
    apply: (f, t) => {
      f.armL.shoulder = 0.7; f.armR.shoulder = 0.7;
      f.pitch = -0.06;
      f.lift = 0.06 + arc(t, 0.6) * 0.1;
      f.thruster = 1.9;
      f.antennaSpread = -0.4;
      f.face.eyeShape = 'star';
      f.face.mouth = 'grin';
      f.face.blush = true;
    },
  },
  hop: {
    durationMs: 900, priority: 2, stillT: 0.45,
    apply: (f, t) => {
      f.lift = arc(t, 0.9) * 0.38;
      f.thruster = 1 + arc(t, 0.5) * 2;
      f.antennaSpread = Math.cos(clamp01(t / 0.9) * Math.PI) * 0.3;
      f.armL.shoulder = arc(t, 0.9) * 0.6;
      f.armR.shoulder = arc(t, 0.9) * 0.6;
      f.face.eyeShape = 'wide';
      f.face.mouth = 'open';
    },
  },
  spin: {
    durationMs: 1300, priority: 2, stillT: 0.3,
    apply: (f, t) => {
      f.spinYaw = easeInOut(t / 1.2) * TAU;
      f.lift = arc(t, 1.2) * 0.12;
      f.thruster = 2;
      f.armL.shoulder = 1.1; f.armR.shoulder = 1.1;
      f.face.eyeShape = 'happy';
      f.face.mouth = 'open';
    },
  },
  wink: {
    durationMs: 1300, priority: 2, stillT: 0.5,
    apply: (f) => {
      f.roll = 0.06;
      f.antennaR = -0.3;
      f.face.eyeShape = 'wink';
      f.face.mouth = 'smirk';
    },
  },
  giggle: {
    durationMs: 1400, priority: 2, stillT: 0.3,
    apply: (f, t) => {
      const shake = Math.sin(t * 22) * fade(t, 1.4);
      f.roll = shake * 0.05;
      f.lift = Math.abs(shake) * 0.03;
      f.antennaL = shake * 0.15;
      f.antennaR = -shake * 0.15;
      f.face.eyeShape = 'happy';
      f.face.mouth = 'open';
      f.face.blush = true;
    },
  },
  barrel_roll: {
    durationMs: 1900, priority: 4, stillT: 0.9,
    apply: (f, t) => {
      f.spinRoll = easeInOut((t - 0.15) / 1.4) * TAU;
      f.lift = arc(t, 1.7) * 0.3;
      f.thruster = 3;
      f.armL.shoulder = 2; f.armR.shoulder = 2;
      f.face.eyeShape = 'star';
      f.face.mouth = 'open';
    },
  },
  sleepy: {
    durationMs: null, priority: 0, stillT: 0,
    apply: (f, t) => {
      f.antennaSpread = 1.05;
      f.pitch = 0.12;
      f.lift = -0.07 + Math.sin(t * 1.1) * 0.015;
      f.thruster = 0.35;
      f.armL.shoulder = -0.15;
      f.armR.shoulder = -0.15;
      f.armL.elbow = 0.12;
      f.armR.elbow = 0.12;
      f.face.eyeShape = 'sleepy';
      f.face.mouth = 'flat';
      f.face.zzz = true;
      f.face.spin = t;
    },
  },
  wake: {
    durationMs: 900, priority: 2, stillT: 0.3,
    apply: (f, t) => {
      f.lift = arc(t, 0.6) * 0.18;
      f.antennaSpread = -0.5 * (1 - clamp01(t / 0.9));
      f.thruster = 1.6;
      f.face.eyeShape = 'wide';
      f.face.mouth = 'o';
    },
  },
});

export const isOrionPose = (value: unknown): value is OrionPose =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(POSES, value);

/**
 * Evaluates a pose at `t` seconds. When `moving` is false (reduced motion) the
 * pose's representative still frame is returned with no full rotations.
 */
export function evaluatePose(pose: OrionPose, t: number, moving: boolean): PoseFrame {
  const frame = neutralFrame();
  const def = POSES[pose];
  def.apply(frame, moving ? Math.max(0, t) : def.stillT);
  if (!moving) {
    frame.spinYaw = 0;
    frame.spinRoll = 0;
    frame.face.spin = 0;
  }
  return frame;
}

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Ambient life layered on top of the idle pose: blinking, drifting gaze, hover bob. */
export function applyIdleLife(frame: PoseFrame, nowSeconds: number, gaze: { x: number; y: number } | null): void {
  const cycle = 4.4;
  const index = Math.floor(nowSeconds / cycle);
  const phase = nowSeconds - index * cycle;
  const blinkAt = 0.6 + hash(index) * 3;
  const blink = (start: number) => {
    const d = phase - start;
    return d > 0 && d < 0.16 ? Math.abs(d - 0.08) / 0.08 : 1;
  };
  const doubleBlink = hash(index + 99) > 0.75;
  frame.face.eyeOpen = Math.min(frame.face.eyeOpen, blink(blinkAt), doubleBlink ? blink(blinkAt + 0.24) : 1);

  if (gaze) {
    frame.face.pupilX = gaze.x * 0.9;
    frame.face.pupilY = gaze.y * 0.8;
    frame.yaw += gaze.x * 0.12;
    frame.pitch += gaze.y * 0.05;
  } else {
    frame.face.pupilX += Math.sin(nowSeconds * 0.37) * 0.35 + Math.sin(nowSeconds * 1.13) * 0.12;
    frame.face.pupilY += Math.sin(nowSeconds * 0.29 + 1) * 0.2;
  }

  const twitchIndex = Math.floor(nowSeconds / 3.1);
  const twitchPhase = nowSeconds - twitchIndex * 3.1;
  if (hash(twitchIndex + 7) > 0.55 && twitchPhase < 0.35) {
    const wiggle = Math.sin(twitchPhase * 40) * (1 - twitchPhase / 0.35) * 0.12;
    if (hash(twitchIndex + 13) > 0.5) frame.antennaL += wiggle; else frame.antennaR -= wiggle;
  }
}

/** Gentle hover bob shared by every pose while motion is enabled. */
export function applyHover(frame: PoseFrame, nowSeconds: number, sleepy: boolean): void {
  const speed = sleepy ? 1.1 : 2.1;
  frame.lift += Math.sin(nowSeconds * speed) * (sleepy ? 0.012 : 0.025);
  frame.podLift += Math.sin(nowSeconds * 3 + 0.8) * 0.05;
  frame.podTilt += Math.sin(nowSeconds * 2.4) * 0.05;
  frame.thruster *= 0.92 + Math.sin(nowSeconds * 17) * 0.05 + Math.sin(nowSeconds * 7.3) * 0.03;
}

const dampValue = (current: number, target: number, rate: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-rate * dt));

const dampArm = (current: ArmTarget, target: ArmTarget, rate: number, dt: number) => {
  current.shoulder = dampValue(current.shoulder, target.shoulder, rate, dt);
  current.elbow = dampValue(current.elbow, target.elbow, rate, dt);
  current.wrist = dampValue(current.wrist, target.wrist, rate, dt);
  current.finger = dampValue(current.finger, target.finger, rate, dt);
  current.thumb = dampValue(current.thumb, target.thumb, rate, dt);
};

/** Smooths `current` towards `target` in place. Discrete face fields snap. */
export function dampFrame(current: PoseFrame, target: PoseFrame, dt: number): PoseFrame {
  const body = 7;
  current.yaw = dampValue(current.yaw, target.yaw, body, dt);
  current.pitch = dampValue(current.pitch, target.pitch, body, dt);
  current.roll = dampValue(current.roll, target.roll, body, dt);
  current.lift = dampValue(current.lift, target.lift, 10, dt);
  dampArm(current.armL, target.armL, 11, dt);
  dampArm(current.armR, target.armR, 11, dt);
  current.antennaSpread = dampValue(current.antennaSpread, target.antennaSpread, 9, dt);
  current.antennaL = dampValue(current.antennaL, target.antennaL, 16, dt);
  current.antennaR = dampValue(current.antennaR, target.antennaR, 16, dt);
  current.podLift = dampValue(current.podLift, target.podLift, 8, dt);
  current.podTilt = dampValue(current.podTilt, target.podTilt, 8, dt);
  current.thruster = dampValue(current.thruster, target.thruster, 12, dt);
  current.spinYaw = target.spinYaw;
  current.spinRoll = target.spinRoll;
  current.face = {
    ...target.face,
    eyeOpen: target.face.eyeOpen < current.face.eyeOpen ? target.face.eyeOpen : dampValue(current.face.eyeOpen, target.face.eyeOpen, 30, dt),
    pupilX: dampValue(current.face.pupilX, target.face.pupilX, 14, dt),
    pupilY: dampValue(current.face.pupilY, target.face.pupilY, 14, dt),
  };
  return current;
}

/** Copies `source` into a fresh frame (used for reduced-motion snapping). */
export function cloneFrame(source: PoseFrame): PoseFrame {
  return {
    ...source,
    armL: { ...source.armL },
    armR: { ...source.armR },
    face: { ...source.face },
  };
}

/** Decides whether `incoming` should replace the running pose now or wait. */
export function shouldInterrupt(current: OrionPose, currentElapsedMs: number, incoming: OrionPose): boolean {
  const running = POSES[current];
  if (running.durationMs === null) return true;
  if (currentElapsedMs >= running.durationMs) return true;
  return POSES[incoming].priority >= running.priority;
}
