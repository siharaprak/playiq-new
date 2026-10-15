'use client';

import { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';
import {
  CHARACTER_ACTIONS,
  CHARACTER_ACTION_EVENT_NAME,
  CHARACTER_ACTION_EVENT_PROTOCOL,
  CHARACTER_NEUTRAL_EVENT_NAME,
  parseCharacterActionEvent,
  type CharacterAction,
} from '@/lib/orion/action-contract';
import {
  POSES,
  applyHover,
  applyIdleLife,
  cloneFrame,
  dampFrame,
  evaluatePose,
  neutralFrame,
  shouldInterrupt,
  type LocalPose,
  type OrionPose,
  type PoseFrame,
} from '@/lib/orion/poses';
import { drawOrionFace, faceKey } from '@/lib/orion/face';
import {
  ORION_LOCAL_EVENT_NAME,
  DEFAULT_ORION_PREFERENCES,
  greetingFor,
  loadOrionPreferences,
  parseOrionLocalEvent,
  pickOrionLine,
  saveOrionPreferences,
  type OrionPreferences,
} from '@/lib/orion/local-events';
import { loadOrionAssets } from '@/lib/orion/scene-cache';

type ArmRig = {
  side: -1 | 1;
  shoulder: THREE.Object3D;
  elbow: THREE.Object3D;
  wrist: THREE.Object3D;
  fingers: THREE.Object3D[];
  thumb: THREE.Object3D;
  shoulderBase: number;
  elbowBase: number;
  wristBase: number;
  thumbBase: number;
};

type AntennaRig = { side: -1 | 1; pivot: THREE.Object3D; base: number };
type PodRig = { pivot: THREE.Object3D; baseY: number; baseX: number };

type SceneState = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  root: THREE.Group;
  keyboard: THREE.Object3D;
  keyboardClosed: number;
  keyboardOpen: number;
  arms: ArmRig[];
  antennae: AntennaRig[];
  pods: PodRig[];
  thrusterMaterials: { material: THREE.MeshStandardMaterial; base: number }[];
  faceCanvas: HTMLCanvasElement;
  faceContext: CanvasRenderingContext2D;
  faceTexture: THREE.CanvasTexture;
  ownedMaterials: THREE.Material[];
  lastFaceKey: string;
};

type EngineApi = {
  request: (pose: OrionPose) => void;
  poke: () => void;
  redraw: () => void;
};

const AVATAR_256 = '/character-assets/orion/orion-avatar-256.webp';
const SLEEP_AFTER_MS = 120_000;
const GAZE_TIMEOUT_MS = 2_500;
const FACE_TEXTURE_SIZE = 512;
const POKE_REACTIONS: readonly LocalPose[] = ['hop', 'giggle', 'wink', 'spin'];

const TEST_POSES: ReadonlyArray<OrionPose> = [
  'wave', 'thumbs_up', 'cheer', 'concerned', 'look_up', 'look_left', 'look_right', 'look_down',
  'turn_around', 'show_keyboard', 'stow_keyboard', 'think', 'encourage', 'proud', 'hop', 'spin',
  'wink', 'giggle', 'barrel_roll', 'sleepy', 'wake', 'idle',
];

function sendLocalAction(action: CharacterAction) {
  if (typeof window === 'undefined') return;
  const detail = parseCharacterActionEvent({ protocol: CHARACTER_ACTION_EVENT_PROTOCOL, action });
  if (detail) window.dispatchEvent(new CustomEvent(CHARACTER_ACTION_EVENT_NAME, { detail }));
}

export function OrionCharacter({
  compact = false,
  active = true,
  enable3d = true,
  studentName,
}: {
  compact?: boolean;
  /** False while the surrounding panel is hidden; rendering pauses entirely. */
  active?: boolean;
  /** Server-controlled release gate for the draft 3D asset. */
  enable3d?: boolean;
  studentName?: string;
}) {
  const stageRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<EngineApi | null>(null);
  const movingRef = useRef(false);
  const textOnlyRef = useRef(false);
  const activeRef = useRef(active);
  const studentNameRef = useRef(studentName);

  const [prefs, setPrefs] = useState<OrionPreferences>(DEFAULT_ORION_PREFERENCES);
  const [systemReduced, setSystemReduced] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [degraded, setDegraded] = useState(!enable3d);
  const [mood, setMood] = useState<'loading' | 'ready' | 'thinking' | 'sleeping' | 'static'>(enable3d ? 'loading' : 'static');
  const [caption, setCaption] = useState('');
  const [captionId, setCaptionId] = useState(0);

  const reducedMotion = prefs.reducedMotion ?? systemReduced;
  const textOnly = prefs.textOnly;

  // Preferences and the OS motion setting are read after mount to avoid hydration mismatches.
  useEffect(() => {
    setPrefs(loadOrionPreferences());
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemReduced(media.matches);
    const onMedia = (event: MediaQueryListEvent) => setSystemReduced(event.matches);
    media.addEventListener('change', onMedia);
    return () => media.removeEventListener('change', onMedia);
  }, []);

  useEffect(() => {
    movingRef.current = !reducedMotion && !textOnly;
    textOnlyRef.current = textOnly;
    activeRef.current = active;
    studentNameRef.current = studentName;
    engineRef.current?.redraw();
  }, [reducedMotion, textOnly, active, studentName]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    let disposed = false;
    let raf = 0;
    let expiryTimer = 0;
    let lastFrame = 0;
    let lastRender = 0;
    let renderState: SceneState | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let lastCaption = '';
    let wasActive = false;
    let greeted = false;
    let loadFailed = false;

    const engine = {
      pose: 'idle' as OrionPose,
      poseStart: performance.now(),
      queue: [] as OrionPose[],
      thinking: false,
      sleeping: false,
      facingRear: false,
      keyboardOpen: false,
      current: neutralFrame() as PoseFrame,
      facingAngle: 0,
      keyboardAngle: 0,
      gaze: null as { x: number; y: number } | null,
      gazeAt: 0,
      lastInteraction: performance.now(),
      pokeTimes: [] as number[],
      lastPokePose: '' as string,
      lastPokeAt: 0,
    };

    const say = (line: string) => {
      lastCaption = line;
      setCaption(line);
      setCaptionId((id) => id + 1);
    };

    const clearCaption = () => {
      lastCaption = '';
      setCaption('');
      setCaptionId((id) => id + 1);
    };

    const syncMood = () => {
      if (!renderState && !disposed && enable3d && !loadFailed) return;
      setMood(engine.thinking ? 'thinking' : engine.sleeping ? 'sleeping' : renderState ? 'ready' : 'static');
    };

    const basePose = (): OrionPose => (engine.thinking ? 'think' : engine.sleeping ? 'sleepy' : 'idle');

    const startPose = (pose: OrionPose, options: { quiet?: boolean } = {}) => {
      const def = POSES[pose];
      engine.pose = pose;
      engine.poseStart = performance.now();
      if (def.facing === 'front') engine.facingRear = false;
      else if (def.facing === 'rear') engine.facingRear = true;
      else if (def.facing === 'toggle') engine.facingRear = !engine.facingRear;
      if (def.keyboard === 'open') engine.keyboardOpen = true;
      else if (def.keyboard === 'closed') engine.keyboardOpen = false;
      else if (def.keyboard === 'follow-facing') engine.keyboardOpen = engine.facingRear;
      if (!options.quiet && pose !== 'idle') say(pickOrionLine(pose, lastCaption));
      else if (pose === 'idle') clearCaption();
      window.clearTimeout(expiryTimer);
      if (def.durationMs !== null) expiryTimer = window.setTimeout(requestRender, def.durationMs + 20);
      syncMood();
      requestRender();
    };

    const request = (pose: OrionPose) => {
      if (pose === 'sleepy') {
        engine.sleeping = true;
      } else if (engine.sleeping) {
        engine.sleeping = false;
      }
      const elapsed = performance.now() - engine.poseStart;
      if (shouldInterrupt(engine.pose, elapsed, pose)) {
        startPose(pose);
      } else if (!engine.queue.includes(pose)) {
        engine.queue.push(pose);
        if (engine.queue.length > 3) engine.queue.shift();
      }
    };

    const advance = (now: number) => {
      const def = POSES[engine.pose];
      if (def.durationMs !== null && now - engine.poseStart >= def.durationMs) {
        const next = engine.queue.shift() ?? basePose();
        startPose(next, { quiet: next === 'think' || next === 'sleepy' ? false : next === 'idle' });
      }
      const base = basePose();
      const idleish = engine.pose === 'idle' || engine.pose === 'think' || engine.pose === 'sleepy';
      if (idleish && engine.pose !== base && POSES[engine.pose].durationMs === null) {
        // Base state changed (thinking finished, woke up) while holding an idle pose.
        startPose(base, { quiet: base === 'idle' });
      }
      if (
        activeRef.current && !engine.thinking && !engine.sleeping && engine.pose === 'idle'
        && now - engine.lastInteraction > SLEEP_AFTER_MS
      ) {
        engine.sleeping = true;
        startPose('sleepy');
      }
    };

    const wake = () => {
      engine.lastInteraction = performance.now();
      if (engine.sleeping) {
        engine.sleeping = false;
        engine.queue = [];
        startPose('wake');
      }
    };

    const applyToScene = (state: SceneState, frame: PoseFrame) => {
      state.root.rotation.set(frame.pitch, engine.facingAngle + frame.yaw + frame.spinYaw, frame.roll + frame.spinRoll);
      state.root.position.y = frame.lift;
      state.keyboard.rotation.x = engine.keyboardAngle;

      for (const armRig of state.arms) {
        const target = armRig.side < 0 ? frame.armL : frame.armR;
        armRig.shoulder.rotation.z = armRig.shoulderBase + armRig.side * target.shoulder;
        armRig.elbow.rotation.z = armRig.elbowBase + armRig.side * target.elbow;
        armRig.wrist.rotation.z = armRig.wristBase + armRig.side * target.wrist;
        armRig.thumb.rotation.z = armRig.thumbBase + armRig.side * target.thumb;
        for (const finger of armRig.fingers) finger.rotation.x = target.finger;
      }
      for (const antenna of state.antennae) {
        const outward = frame.antennaSpread + (antenna.side < 0 ? frame.antennaL : frame.antennaR);
        antenna.pivot.rotation.z = antenna.base - antenna.side * outward;
      }
      state.pods.forEach((pod, index) => {
        const phase = index === 0 ? 1 : -1;
        pod.pivot.position.y = pod.baseY + frame.podLift * (index === 0 ? 1 : 0.8) * 1.5;
        pod.pivot.rotation.x = pod.baseX + frame.podTilt * phase;
      });
      for (const { material, base } of state.thrusterMaterials) {
        material.emissiveIntensity = base * Math.max(0.2, frame.thruster);
      }

      const key = faceKey(frame.face);
      if (key !== state.lastFaceKey) {
        drawOrionFace(state.faceContext, FACE_TEXTURE_SIZE, frame.face);
        state.faceTexture.needsUpdate = true;
        state.lastFaceKey = key;
      }
    };

    const frameLoop = (now: number) => {
      raf = 0;
      if (disposed) return;
      advance(now);

      const state = renderState;
      const visible = activeRef.current && !textOnlyRef.current;
      if (!state || !visible) { lastFrame = 0; return; }

      const moving = movingRef.current;
      const idleLike = engine.pose === 'idle' || engine.pose === 'sleepy';
      // Idle animation runs at ~30fps to save battery; gestures run at full rate.
      if (moving && idleLike && lastRender && now - lastRender < 32) {
        raf = window.requestAnimationFrame(frameLoop);
        return;
      }
      const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 1 / 60;
      lastFrame = now;
      lastRender = now;

      const nowSeconds = now / 1000;
      const target = evaluatePose(engine.pose, (now - engine.poseStart) / 1000, moving);
      if (moving) {
        const gazeActive = engine.gaze && now - engine.gazeAt < GAZE_TIMEOUT_MS ? engine.gaze : null;
        if (engine.pose === 'idle') applyIdleLife(target, nowSeconds, gazeActive);
        applyHover(target, nowSeconds, engine.pose === 'sleepy');
      }

      const facingTarget = engine.facingRear ? Math.PI : 0;
      const keyboardTarget = engine.keyboardOpen ? state.keyboardOpen : state.keyboardClosed;
      if (moving) {
        engine.current = dampFrame(engine.current, target, dt);
        const k = 1 - Math.exp(-5 * dt);
        engine.facingAngle += (facingTarget - engine.facingAngle) * k;
        engine.keyboardAngle += (keyboardTarget - engine.keyboardAngle) * k;
      } else {
        engine.current = cloneFrame(target);
        engine.facingAngle = facingTarget;
        engine.keyboardAngle = keyboardTarget;
      }

      applyToScene(state, engine.current);
      state.renderer.render(state.scene, state.camera);
      if (moving) raf = window.requestAnimationFrame(frameLoop);
    };

    function requestRender() {
      if (!raf && !disposed) raf = window.requestAnimationFrame(frameLoop);
    }

    const poke = () => {
      const now = performance.now();
      engine.lastInteraction = now;
      if (engine.sleeping) { wake(); return; }
      engine.pokeTimes = [...engine.pokeTimes.filter((time) => now - time < 2_000), now];
      if (engine.pokeTimes.length >= 5) {
        engine.pokeTimes = [];
        engine.lastPokeAt = now;
        startPose('barrel_roll');
        return;
      }
      if (now - engine.lastPokeAt < 350) return;
      engine.lastPokeAt = now;
      const options = POKE_REACTIONS.filter((pose) => pose !== engine.lastPokePose);
      const pose = options[Math.floor(Math.random() * options.length)] ?? 'hop';
      engine.lastPokePose = pose;
      request(pose);
    };

    engineRef.current = {
      request,
      poke,
      redraw: () => {
        if (activeRef.current && !wasActive) {
          engine.lastInteraction = performance.now();
          if (!greeted) {
            greeted = true;
            say(greetingFor(studentNameRef.current));
            if (shouldInterrupt(engine.pose, performance.now() - engine.poseStart, 'wave')) startPose('wave', { quiet: true });
          }
        }
        wasActive = activeRef.current;
        requestRender();
      },
    };

    const onAction = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const detail = parseCharacterActionEvent(event.detail);
      if (detail) request(detail.action);
    };
    const onNeutral = () => {
      engine.queue = [];
      clearCaption();
      startPose(basePose(), { quiet: true });
    };
    const onLocal = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const detail = parseOrionLocalEvent(event.detail);
      if (!detail) return;
      engine.lastInteraction = performance.now();
      if (detail.kind === 'thinking') {
        engine.thinking = detail.on;
        if (detail.on) {
          engine.sleeping = false;
          engine.queue = [];
          startPose('think');
        } else {
          clearCaption();
          if (engine.pose === 'think') {
            startPose('idle', { quiet: true });
          }
        }
        syncMood();
        return;
      }
      request(detail.pose);
    };
    const onPointerMove = (event: PointerEvent) => {
      const box = stage.getBoundingClientRect();
      if (box.width <= 0) return;
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const clampUnit = (value: number) => Math.max(-1, Math.min(1, value));
      engine.gaze = {
        x: clampUnit((event.clientX - cx) / (window.innerWidth * 0.35)),
        y: clampUnit((event.clientY - cy) / (window.innerHeight * 0.35)),
      };
      engine.gazeAt = performance.now();
      if (!engine.sleeping) {
        engine.lastInteraction = engine.gazeAt;
      }
    };
    const onStagePointerEnter = () => {
      if (engine.sleeping) wake();
    };
    const onKeyDown = () => {
      if (engine.sleeping) wake();
    };

    window.addEventListener(CHARACTER_ACTION_EVENT_NAME, onAction);
    window.addEventListener(CHARACTER_NEUTRAL_EVENT_NAME, onNeutral);
    window.addEventListener(ORION_LOCAL_EVENT_NAME, onLocal);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    stage.addEventListener('pointerenter', onStagePointerEnter);
    const sleepCheck = window.setInterval(requestRender, 5_000);

    const fail = (error?: unknown) => {
      if (disposed) return;
      if (error && process.env.NODE_ENV === 'development') console.error('Orion 3D preview failed to start:', error);
      loadFailed = true;
      disposeScene();
      setLoaded(false);
      setDegraded(true);
      setMood('static');
    };

    const disposeScene = () => {
      if (!renderState) return;
      renderState.faceTexture.dispose();
      for (const material of renderState.ownedMaterials) material.dispose();
      renderState.renderer.dispose();
      renderState = null;
    };

    const onResize = () => {
      if (!renderState) return;
      const box = canvas.getBoundingClientRect();
      if (box.width <= 0 || box.height <= 0) return;
      renderState.renderer.setSize(box.width, box.height, false);
      renderState.camera.aspect = box.width / box.height;
      renderState.camera.updateProjectionMatrix();
      requestRender();
    };
    const onContextLost = (event: Event) => { event.preventDefault(); fail(); };
    canvas.addEventListener('webglcontextlost', onContextLost);

    const start = async () => {
      try {
        const { three, gltf } = await loadOrionAssets();
        if (disposed) return;
        const renderer = new three.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.outputColorSpace = three.SRGBColorSpace;
        renderer.toneMapping = three.ACESFilmicToneMapping;

        const scene = new three.Scene();
        scene.background = null;
        const camera = new three.PerspectiveCamera(32, 1, 0.1, 80);
        camera.position.set(0, 0.65, 8.9);
        scene.add(new three.HemisphereLight(0xf5ffff, 0x647582, 2.1));
        const keyLight = new three.DirectionalLight(0xffffff, 2.5);
        keyLight.position.set(-4, 7, 6);
        scene.add(keyLight);
        const rimLight = new three.DirectionalLight(0x78e6ef, 1.4);
        rimLight.position.set(4, 3, -5);
        scene.add(rimLight);

        const root = new three.Group();
        root.rotation.order = 'YXZ';
        scene.add(root);
        const model = gltf.scene.clone(true);
        const box = new three.Box3().setFromObject(model);
        if (box.isEmpty()) throw new Error('Orion GLB has no visible geometry.');
        const center = box.getCenter(new three.Vector3());
        model.position.set(-center.x, -center.y, -center.z);
        const scaled = new three.Group();
        scaled.scale.setScalar(0.68);
        scaled.add(model);
        root.add(scaled);

        const pivot = (name: string) => {
          const result = model.getObjectByName(name);
          if (!result) throw new Error('Required Orion pivot is missing: ' + name);
          return result;
        };
        const makeArm = (side: -1 | 1): ArmRig => {
          const prefix = side < 0 ? 'L' : 'R';
          const shoulder = pivot(prefix + '_Shoulder_PIVOT_export');
          const elbow = pivot(prefix + '_Elbow_PIVOT_export');
          const wrist = pivot(prefix + '_Wrist_PIVOT_export');
          const thumb = pivot(prefix + '_Thumb_PIVOT_export');
          const fingers = [0, 1, 2].map((index) => pivot(prefix + '_Finger_' + index + '_PIVOT_export'));
          for (const finger of fingers) finger.rotation.x = 0;
          return {
            side, shoulder, elbow, wrist, thumb, fingers,
            shoulderBase: shoulder.rotation.z,
            elbowBase: elbow.rotation.z,
            wristBase: wrist.rotation.z,
            thumbBase: thumb.rotation.z,
          };
        };
        const makeAntenna = (side: -1 | 1): AntennaRig => {
          const antennaPivot = pivot((side < 0 ? 'L' : 'R') + '_Antenna_PIVOT_export');
          return { side, pivot: antennaPivot, base: antennaPivot.rotation.z };
        };
        const makePod = (side: -1 | 1): PodRig => {
          const podPivot = pivot((side < 0 ? 'L' : 'R') + '_HoverPod_PIVOT_export');
          return { pivot: podPivot, baseY: podPivot.position.y, baseX: podPivot.rotation.x };
        };

        const ownedMaterials: THREE.Material[] = [];
        const thrusterClones = new Map<THREE.Material, THREE.MeshStandardMaterial>();
        model.traverse((object) => {
          if (!(object instanceof three.Mesh) || Array.isArray(object.material)) return;
          const material = object.material;
          if (!(material instanceof three.MeshStandardMaterial) || material.name !== 'Thruster plasma core') return;
          let clone = thrusterClones.get(material);
          if (!clone) {
            clone = material.clone();
            thrusterClones.set(material, clone);
            ownedMaterials.push(clone);
          }
          object.material = clone;
        });

        const keyboard = pivot('Keyboard_Hinge_PIVOT_export');
        const face = pivot(three.PropertyBinding.sanitizeNodeName('Face | curved emissive display_export'));
        if (!(face instanceof three.Mesh) || Array.isArray(face.material) || !(face.material instanceof three.MeshStandardMaterial)) {
          throw new Error('Orion face material is unavailable.');
        }
        const faceCanvas = document.createElement('canvas');
        faceCanvas.width = FACE_TEXTURE_SIZE;
        faceCanvas.height = FACE_TEXTURE_SIZE;
        const faceContext = faceCanvas.getContext('2d');
        if (!faceContext) throw new Error('Orion face canvas is unavailable.');
        const faceTexture = new three.CanvasTexture(faceCanvas);
        faceTexture.colorSpace = three.SRGBColorSpace;
        faceTexture.flipY = false;
        const faceMaterial = face.material.clone();
        faceMaterial.emissiveMap = faceTexture;
        faceMaterial.needsUpdate = true;
        face.material = faceMaterial;
        ownedMaterials.push(faceMaterial);

        const keyboardClosed = keyboard.rotation.x;
        renderState = {
          renderer, scene, camera, root, keyboard,
          keyboardClosed,
          keyboardOpen: keyboardClosed - three.MathUtils.degToRad(88),
          arms: [makeArm(-1), makeArm(1)],
          antennae: [makeAntenna(-1), makeAntenna(1)],
          pods: [makePod(-1), makePod(1)],
          thrusterMaterials: [...thrusterClones.values()].map((material) => ({ material, base: material.emissiveIntensity })),
          faceCanvas, faceContext, faceTexture, ownedMaterials,
          lastFaceKey: '',
        };
        engine.keyboardAngle = keyboardClosed;

        setLoaded(true);
        setDegraded(false);
        syncMood();

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(onResize);
          resizeObserver.observe(canvas);
        } else {
          window.addEventListener('resize', onResize);
        }
        onResize();
        requestRender();
      } catch (error) {
        fail(error);
      }
    };

    if (enable3d) void start();
    else setMood('static');

    return () => {
      disposed = true;
      engineRef.current = null;
      window.removeEventListener(CHARACTER_ACTION_EVENT_NAME, onAction);
      window.removeEventListener(CHARACTER_NEUTRAL_EVENT_NAME, onNeutral);
      window.removeEventListener(ORION_LOCAL_EVENT_NAME, onLocal);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('keydown', onKeyDown);
      stage.removeEventListener('pointerenter', onStagePointerEnter);
      window.removeEventListener('resize', onResize);
      window.clearInterval(sleepCheck);
      window.clearTimeout(expiryTimer);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      resizeObserver?.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
      disposeScene();
    };
  }, [enable3d]);

  // Greets on first activation and resumes rendering whenever the panel opens.
  useEffect(() => {
    engineRef.current?.redraw();
  }, [active, loaded]);

  const updatePrefs = (next: Partial<OrionPreferences>) => {
    setPrefs((previous) => {
      const merged = { ...previous, ...next };
      saveOrionPreferences(merged);
      return merged;
    });
  };

  const status = {
    loading: 'Warming up thrusters…',
    ready: 'Ready to help',
    thinking: 'Thinking…',
    sleeping: 'Napping — poke to wake',
    static: 'Ready to help',
  }[mood];

  const showCanvas = loaded && !degraded && !textOnly;
  const stageSize = compact ? 'h-[140px] w-[140px]' : 'h-36 w-32';

  const settings = (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[var(--text-secondary)]">
      <label className="inline-flex items-center gap-1.5"><input type="checkbox" checked={reducedMotion} onChange={(event) => updatePrefs({ reducedMotion: event.currentTarget.checked })} className="accent-cyan-400" />Reduced motion</label>
      <label className="inline-flex items-center gap-1.5"><input type="checkbox" checked={prefs.captions} onChange={(event) => updatePrefs({ captions: event.currentTarget.checked })} className="accent-cyan-400" />Speech bubbles</label>
      <label className="inline-flex items-center gap-1.5"><input type="checkbox" checked={textOnly} onChange={(event) => updatePrefs({ textOnly: event.currentTarget.checked })} className="accent-cyan-400" />Text-only</label>
    </div>
  );

  return (
    <section
      className={compact ? 'border-b border-[var(--glass-border)] px-1 pb-2' : 'mb-4 rounded-xl border border-[var(--neon-cyan)]/20 bg-[var(--space-deep)]/60 p-3'}
      aria-label="Orion, your study buddy"
    >
      <div className="flex items-center gap-3">
        <button
          ref={stageRef}
          type="button"
          onClick={() => engineRef.current?.poke()}
          disabled={textOnly}
          aria-label="Poke Orion"
          title="Poke me!"
          className={`orion-stage group relative shrink-0 overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[radial-gradient(circle_at_50%_40%,rgba(0,200,255,0.16),transparent_72%)] transition-[border-color,box-shadow] duration-300 hover:border-[var(--neon-cyan)]/60 hover:shadow-[0_0_18px_rgba(0,200,255,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)] disabled:cursor-default ${stageSize} ${mood === 'thinking' ? 'orion-stage-thinking' : ''}`}
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" hidden={!showCanvas} />
          {!showCanvas && !textOnly && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={AVATAR_256} alt="" aria-hidden="true" className={`absolute inset-0 h-full w-full object-contain p-1 ${mood === 'loading' ? 'animate-pulse' : ''}`} />
          )}
          {textOnly && <span className="absolute inset-0 flex items-center justify-center p-3 text-center text-xs text-[var(--text-secondary)]">Text-only mode</span>}
        </button>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-1.5">
            {!compact && <h4 className="text-sm font-bold text-[var(--text-primary)]">Orion</h4>}
            <span
              className={`h-1.5 w-1.5 rounded-full ${mood === 'thinking' ? 'bg-[var(--neon-cyan)] animate-pulse' : mood === 'sleeping' ? 'bg-amber-300' : 'bg-[var(--neon-green)]'}`}
              aria-hidden="true"
            />
            <p className="text-xs font-semibold text-[var(--text-secondary)]" role="status" aria-live="polite">{status}</p>
          </div>
          {prefs.captions && caption && (
            <p
              key={captionId}
              className="orion-bubble relative rounded-xl rounded-tl-sm border border-[var(--neon-cyan)]/25 bg-[rgba(0,200,255,0.08)] px-2.5 py-1.5 text-xs leading-snug text-[var(--text-primary)]"
              aria-live="polite"
              aria-atomic="true"
            >
              {caption}
            </p>
          )}
        </div>
      </div>

      <details className="mt-2 text-xs text-[var(--text-secondary)]">
        <summary className="cursor-pointer rounded-md px-1 text-[10px] uppercase tracking-wider focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)]">⚙️ Orion settings</summary>
        <div className="custom-scrollbar mt-2 max-h-[min(11rem,30vh)] space-y-2 overflow-y-auto overscroll-contain rounded-lg border border-[var(--glass-border)] bg-[var(--space-deep)] p-2">
          {settings}
          {process.env.NODE_ENV === 'development' && (
            <div className="border-t border-[var(--glass-border)] pt-2">
              <p className="mb-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Test movements (dev only)</p>
              <div className="grid grid-cols-3 gap-1">
                {TEST_POSES.map((pose) => (
                  <button
                    key={pose}
                    type="button"
                    onClick={() => {
                      // AI-allowlisted actions go through the real contract; local poses go straight to the engine.
                      if ((CHARACTER_ACTIONS as readonly string[]).includes(pose)) {
                        sendLocalAction(pose as CharacterAction);
                      } else {
                        engineRef.current?.request(pose);
                      }
                    }}
                    className="rounded border border-[var(--glass-border)] px-1 py-1 text-left text-[10px] text-[var(--text-primary)] hover:border-[var(--neon-cyan)]"
                  >
                    {pose}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </details>
    </section>
  );
}
