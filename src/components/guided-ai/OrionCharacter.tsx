'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type * as THREE from 'three';
import {
  CHARACTER_ACTION_EVENT_NAME,
  CHARACTER_ACTION_EVENT_PROTOCOL,
  parseCharacterActionEvent,
  type CharacterAction,
} from '@/lib/orion/action-contract';

type ArmRig = {
  side: -1 | 1;
  shoulder: THREE.Object3D;
  elbow: THREE.Object3D;
  wrist: THREE.Object3D;
  fingers: THREE.Object3D[];
  thumb: THREE.Object3D;
  shoulderBase: THREE.Euler;
  elbowBase: THREE.Euler;
  wristBase: THREE.Euler;
  thumbBase: THREE.Euler;
};

type SceneState = {
  three: typeof import('three');
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  root: THREE.Group;
  keyboard: THREE.Object3D;
  keyboardClosed: number;
  keyboardOpen: number;
  arms: ArmRig[];
};

const MODEL = '/character-assets/orion/orion-reference-v001.glb';
const POSTER = '/character-assets/orion/orion-reference-v001-hero.png';

const captions: Record<CharacterAction, string> = {
  idle: 'Orion is ready.',
  wave: 'Orion waves hello.',
  thumbs_up: 'Orion gives a thumbs up.',
  cheer: 'Orion celebrates with you.',
  concerned: 'Orion acknowledges that something may be unclear.',
  turn_around: 'Orion turns to show the reversible rear design.',
  show_keyboard: 'Orion shows the rear display and fold-down keyboard.',
  stow_keyboard: 'Orion stows the keyboard.',
  look_left: 'Orion looks left.',
  look_right: 'Orion looks right.',
  look_up: 'Orion looks up.',
  look_down: 'Orion looks down.',
};

function sendLocalAction(action: CharacterAction) {
  if (typeof window === 'undefined') return;
  const detail = parseCharacterActionEvent({ protocol: CHARACTER_ACTION_EVENT_PROTOCOL, action });
  if (detail) window.dispatchEvent(new CustomEvent(CHARACTER_ACTION_EVENT_NAME, { detail }));
}

export function OrionCharacter() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedRef = useRef(true);
  const textOnlyRef = useRef(false);
  const reducedOverrideRef = useRef(false);
  const redrawRef = useRef<() => void>(() => {});
  const [reducedMotion, setReducedMotion] = useState(true);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [textOnly, setTextOnly] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [degraded, setDegraded] = useState(false);
  const [status, setStatus] = useState('Loading local Orion preview…');
  const [caption, setCaption] = useState('Orion is ready.');

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    let disposed = false;
    let runtimeFailed = false;
    let raf = 0;
    let dirty = true;
    let lastFrame = 0;
    let renderState: SceneState | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let pendingAction: CharacterAction | null = null;
    let currentAction: CharacterAction = 'idle';
    let actionStart = performance.now();
    let facingRear = false;
    let keyboardOpen = false;

    const frame = (now: number) => {
      raf = 0;
      const state = renderState;
      if (!state || disposed) return;

      const moving = !reducedRef.current && !textOnlyRef.current;
      const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 1 / 60;
      lastFrame = now;
      if (!textOnlyRef.current && (moving || dirty)) {
        const damp = (current: number, target: number, rate: number) =>
          state.three.MathUtils.damp(current, target, rate, delta);

        if (moving) {
          const elapsed = (now - actionStart) / 1000;
          const yaw = currentAction === 'look_left' ? 0.22 : currentAction === 'look_right' ? -0.22 : 0;
          state.root.rotation.y = damp(state.root.rotation.y, (facingRear ? Math.PI : 0) + yaw, 5);
          state.root.rotation.x = damp(state.root.rotation.x, currentAction === 'look_up' ? -0.08 : currentAction === 'look_down' ? 0.08 : 0, 5);
          state.root.position.y = damp(state.root.position.y, Math.sin(now / 1000 * 2.1) * 0.025, 3.5);
          state.keyboard.rotation.x = damp(state.keyboard.rotation.x, keyboardOpen ? state.keyboardOpen : state.keyboardClosed, 5);

          for (const arm of state.arms) {
            let shoulder = arm.shoulderBase.z;
            let elbow = arm.elbowBase.z;
            let wrist = arm.wristBase.z;
            let finger = 0;
            let thumb = arm.thumbBase.z;
            if (currentAction === 'wave' && arm.side > 0) {
              shoulder += 1.85;
              elbow += 0.36;
              wrist += Math.sin(elapsed * 9) * 0.28;
            } else if (currentAction === 'thumbs_up' && arm.side > 0) {
              shoulder += 1.48; elbow -= 0.24; finger = 0.72; thumb += 0.34;
            } else if (currentAction === 'cheer') {
              shoulder += arm.side * 2.2; elbow += arm.side * -0.12;
            } else if (currentAction === 'concerned') {
              shoulder += arm.side * 1.36; elbow += arm.side * -0.38; wrist += arm.side * 0.14;
            }
            arm.shoulder.rotation.z = damp(arm.shoulder.rotation.z, shoulder, 10);
            arm.elbow.rotation.z = damp(arm.elbow.rotation.z, elbow, 10);
            arm.wrist.rotation.z = damp(arm.wrist.rotation.z, wrist, 10);
            arm.thumb.rotation.z = damp(arm.thumb.rotation.z, thumb, 10);
            for (const item of arm.fingers) item.rotation.x = damp(item.rotation.x, finger, 10);
          }
        } else {
          state.root.rotation.y = (facingRear ? Math.PI : 0)
            + (currentAction === 'look_left' ? 0.22 : currentAction === 'look_right' ? -0.22 : 0);
          state.root.rotation.x = currentAction === 'look_up' ? -0.08 : currentAction === 'look_down' ? 0.08 : 0;
          state.root.position.y = 0;
          state.keyboard.rotation.x = keyboardOpen ? state.keyboardOpen : state.keyboardClosed;
          for (const arm of state.arms) {
            arm.shoulder.rotation.z = arm.shoulderBase.z
              + (currentAction === 'wave' && arm.side > 0 ? 1.85 : 0)
              + (currentAction === 'thumbs_up' && arm.side > 0 ? 1.48 : 0)
              + (currentAction === 'cheer' ? arm.side * 2.2 : 0)
              + (currentAction === 'concerned' ? arm.side * 1.36 : 0);
            arm.elbow.rotation.z = arm.elbowBase.z
              + (currentAction === 'wave' && arm.side > 0 ? 0.36 : 0)
              + (currentAction === 'thumbs_up' && arm.side > 0 ? -0.24 : 0)
              + (currentAction === 'cheer' ? arm.side * -0.12 : 0)
              + (currentAction === 'concerned' ? arm.side * -0.38 : 0);
            arm.wrist.rotation.z = arm.wristBase.z
              + (currentAction === 'wave' && arm.side > 0 ? 0.15 : 0)
              + (currentAction === 'concerned' ? arm.side * 0.14 : 0);
            arm.thumb.rotation.z = arm.thumbBase.z + (currentAction === 'thumbs_up' && arm.side > 0 ? 0.34 : 0);
            for (const item of arm.fingers) item.rotation.x = currentAction === 'thumbs_up' && arm.side > 0 ? 0.72 : 0;
          }
        }
        state.renderer.render(state.scene, state.camera);
      }
      dirty = false;
      if (moving) raf = window.requestAnimationFrame(frame);
    };

    const requestRender = () => {
      dirty = true;
      if (!raf && renderState && !disposed) raf = window.requestAnimationFrame(frame);
    };
    redrawRef.current = requestRender;

    const applyAction = (action: CharacterAction) => {
      if (runtimeFailed) {
        setCaption('The 3D preview is unavailable. Orion’s static preview and chat remain available.');
        return;
      }
      if (textOnlyRef.current) {
        setCaption('Text-only mode is on. Orion stays still while chat remains available.');
        return;
      }
      if (!renderState) {
        pendingAction = action;
        setCaption('Orion’s 3D preview is loading. Chat remains available.');
        return;
      }
      currentAction = action;
      actionStart = performance.now();
      if (action === 'turn_around') {
        facingRear = !facingRear;
        keyboardOpen = facingRear;
      } else if (action === 'show_keyboard') {
        facingRear = true; keyboardOpen = true;
      } else if (action === 'stow_keyboard') {
        keyboardOpen = false;
      } else if (action === 'idle') {
        facingRear = false; keyboardOpen = false;
      }
      setCaption(captions[action]);
      requestRender();
    };

    const onAction = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const detail = parseCharacterActionEvent(event.detail);
      if (detail) applyAction(detail.action);
    };
    window.addEventListener(CHARACTER_ACTION_EVENT_NAME, onAction);

    const fail = () => {
      if (disposed) return;
      runtimeFailed = true;
      renderState = null;
      renderer?.dispose();
      renderer = null;
      setLoaded(false);
      setDegraded(true);
      setStatus('3D preview unavailable · showing the local static draft');
      setCaption('The 3D model is unavailable. Orion’s static preview and chat remain available.');
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    };

    const onResize = () => {
      if (!renderState) return;
      const box = stage.getBoundingClientRect();
      if (box.width <= 0 || box.height <= 0) return;
      renderState.renderer.setSize(box.width, box.height, false);
      renderState.camera.aspect = box.width / box.height;
      renderState.camera.updateProjectionMatrix();
      requestRender();
    };
    const onContextLost = (event: Event) => { event.preventDefault(); fail(); };
    canvas.addEventListener('webglcontextlost', onContextLost);

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedRef.current = media.matches;
    setReducedMotion(media.matches);
    const onMedia = (event: MediaQueryListEvent) => {
      if (reducedOverrideRef.current) return;
      reducedRef.current = event.matches;
      setReducedMotion(event.matches);
      requestRender();
    };
    media.addEventListener('change', onMedia);

    const start = async () => {
      try {
        const [three, { GLTFLoader }] = await Promise.all([
          import('three'),
          import('three/addons/loaders/GLTFLoader.js'),
        ]);
        if (disposed) return;
        const activeRenderer = new three.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
        renderer = activeRenderer;
        activeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        activeRenderer.outputColorSpace = three.SRGBColorSpace;
        activeRenderer.toneMapping = three.ACESFilmicToneMapping;

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
        scene.add(root);
        const gltf = await new GLTFLoader().loadAsync(MODEL);
        if (disposed) { activeRenderer.dispose(); return; }
        const model = gltf.scene;
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
          return {
            side, shoulder, elbow, wrist, thumb,
            fingers: [0, 1, 2].map((index) => pivot(prefix + '_Finger_' + index + '_PIVOT_export')),
            shoulderBase: shoulder.rotation.clone(),
            elbowBase: elbow.rotation.clone(),
            wristBase: wrist.rotation.clone(),
            thumbBase: thumb.rotation.clone(),
          };
        };
        const keyboard = pivot('Keyboard_Hinge_PIVOT_export');
        const arms = [makeArm(-1), makeArm(1)];
        for (const arm of arms) for (const finger of arm.fingers) finger.rotation.x = 0;

        renderState = {
          three, renderer: activeRenderer, scene, camera, root, keyboard,
          keyboardClosed: keyboard.rotation.x,
          keyboardOpen: keyboard.rotation.x - three.MathUtils.degToRad(88),
          arms,
        };
        runtimeFailed = false;
        setLoaded(true);
        setDegraded(false);
        setStatus('3D preview ready · local draft · human likeness review pending');
        setCaption('The local Orion draft is ready. Choose an action or continue the chat.');

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(onResize);
          resizeObserver.observe(stage);
        } else {
          window.addEventListener('resize', onResize);
        }
        onResize();
        if (pendingAction) {
          const next = pendingAction;
          pendingAction = null;
          applyAction(next);
        } else {
          requestRender();
        }
      } catch {
        fail();
      }
    };
    void start();

    return () => {
      disposed = true;
      window.removeEventListener(CHARACTER_ACTION_EVENT_NAME, onAction);
      window.removeEventListener('resize', onResize);
      media.removeEventListener('change', onMedia);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      resizeObserver?.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
      renderer?.dispose();
      redrawRef.current = () => {};
    };
  }, []);

  const changeReducedMotion = (enabled: boolean) => {
    reducedOverrideRef.current = true;
    reducedRef.current = enabled;
    setReducedMotion(enabled);
    redrawRef.current();
  };
  const changeTextOnly = (enabled: boolean) => {
    textOnlyRef.current = enabled;
    setTextOnly(enabled);
    setCaption(enabled
      ? 'Text-only mode is on. Orion stays still while chat remains available.'
      : 'Orion’s local draft preview is visible; chat remains available.');
    redrawRef.current();
  };

  return (
    <section className="mb-4 rounded-xl border border-[var(--neon-cyan)]/20 bg-[var(--space-deep)]/60 p-3" aria-label="Orion character preview">
      <div className="flex gap-3">
        <div ref={stageRef} className="relative h-32 w-28 shrink-0 overflow-hidden rounded-lg border border-[var(--glass-border)] bg-[radial-gradient(circle_at_50%_40%,rgba(0,200,255,0.12),transparent_72%)]">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" hidden={!loaded || degraded || textOnly} />
          <Image src={POSTER} alt="Draft static view of Orion; human likeness review is pending." fill sizes="112px" className="object-contain" hidden={(loaded && !degraded) || textOnly} />
          {textOnly && <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-xs text-[var(--text-secondary)]">Text-only mode<br />Chat remains available.</div>}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">Orion · local character preview</h4>
            <p className="text-[10px] leading-snug text-[var(--text-muted)]">Draft asset · likeness and rights review pending</p>
          </div>
          <p className="text-[10px] leading-snug text-[var(--text-secondary)]" role="status" aria-live="polite">{status}</p>
          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => sendLocalAction('show_keyboard')} disabled={textOnly} className="rounded-md border border-[var(--glass-border)] px-2 py-1 text-[9px] text-[var(--text-primary)] hover:border-[var(--neon-cyan)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)] disabled:opacity-50">Show rear keyboard</button>
            <button type="button" onClick={() => sendLocalAction('idle')} disabled={textOnly} className="rounded-md border border-[var(--glass-border)] px-2 py-1 text-[9px] text-[var(--text-primary)] hover:border-[var(--neon-cyan)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)] disabled:opacity-50">Return to front</button>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-[var(--glass-border)] pt-2 text-[10px] text-[var(--text-secondary)]">
        <label className="inline-flex items-center gap-1.5"><input type="checkbox" checked={reducedMotion} onChange={(event) => changeReducedMotion(event.currentTarget.checked)} className="accent-cyan-400" />Reduced motion</label>
        <label className="inline-flex items-center gap-1.5"><input type="checkbox" checked={captionsEnabled} onChange={(event) => setCaptionsEnabled(event.currentTarget.checked)} className="accent-cyan-400" />Captions</label>
        <label className="inline-flex items-center gap-1.5"><input type="checkbox" checked={textOnly} onChange={(event) => changeTextOnly(event.currentTarget.checked)} className="accent-cyan-400" />Text-only</label>
      </div>
      {captionsEnabled && <p className="mt-1 text-[10px] leading-snug text-[var(--text-muted)]" aria-live="polite" aria-atomic="true">Caption: {caption}</p>}
    </section>
  );
}
