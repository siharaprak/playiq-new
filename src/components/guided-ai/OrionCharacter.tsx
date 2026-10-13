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
  face: THREE.Mesh;
  faceMaterial: THREE.MeshStandardMaterial;
  concernedFaceMaterial: THREE.MeshStandardMaterial;
  concernedFaceTexture: THREE.CanvasTexture;
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

const previewMovements: ReadonlyArray<{ action: CharacterAction; label: string }> = [
  { action: 'wave', label: 'Wave' },
  { action: 'thumbs_up', label: 'Thumbs up' },
  { action: 'cheer', label: 'Cheer' },
  { action: 'concerned', label: 'Concerned' },
  { action: 'turn_around', label: 'Turn around' },
  { action: 'stow_keyboard', label: 'Stow keyboard' },
  { action: 'look_left', label: 'Look left' },
  { action: 'look_right', label: 'Look right' },
  { action: 'look_up', label: 'Look up' },
  { action: 'look_down', label: 'Look down' },
];

function makeConcernedFaceTexture(
  three: typeof import('three'),
  source: THREE.Texture,
): THREE.CanvasTexture {
  const image = source.image as CanvasImageSource & { width: number; height: number };
  if (!image?.width || !image?.height) throw new Error('Orion face texture is unavailable.');

  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Orion face canvas is unavailable.');

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const background = context.getImageData(Math.round(canvas.width * 560 / 768), 0, 1, canvas.height).data;
  context.scale(canvas.width / 768, canvas.height / 768);

  // Preserve the authored eyes and display, replacing only the smile and adding brows.
  for (let y = 468; y < 658; y += 1) {
    const index = Math.min(canvas.height - 1, Math.round(y * canvas.height / 768)) * 4;
    context.fillStyle = `rgb(${background[index]}, ${background[index + 1]}, ${background[index + 2]})`;
    context.fillRect(220, y, 328, 1);
  }
  context.strokeStyle = '#b7ff40';
  context.lineWidth = 20;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(105, 83);
  context.lineTo(286, 44);
  context.moveTo(482, 44);
  context.lineTo(663, 83);
  context.stroke();

  context.fillStyle = '#061507';
  context.beginPath();
  context.ellipse(384, 558, 42, 49, 0, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = '#e8f3d3';
  context.lineWidth = 6;
  context.beginPath();
  context.ellipse(384, 558, 30, 37, 0, Math.PI * 1.12, Math.PI * 1.88);
  context.stroke();

  const texture = new three.CanvasTexture(canvas);
  texture.colorSpace = three.SRGBColorSpace;
  texture.flipY = false;
  texture.needsUpdate = true;
  return texture;
}

function sendLocalAction(action: CharacterAction) {
  if (typeof window === 'undefined') return;
  const detail = parseCharacterActionEvent({ protocol: CHARACTER_ACTION_EVENT_PROTOCOL, action });
  if (detail) window.dispatchEvent(new CustomEvent(CHARACTER_ACTION_EVENT_NAME, { detail }));
}

export function OrionCharacter({ compact = false }: { compact?: boolean }) {
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
  const [status, setStatus] = useState('Loading Orion…');
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
      renderState.face.material = action === 'concerned'
        ? renderState.concernedFaceMaterial
        : renderState.faceMaterial;
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
      renderState?.concernedFaceMaterial.dispose();
      renderState?.concernedFaceTexture.dispose();
      renderState = null;
      renderer?.dispose();
      renderer = null;
      setLoaded(false);
      setDegraded(true);
      setStatus('Animation unavailable');
      setCaption('Orion’s picture is shown. Chat remains available.');
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
        const face = pivot(three.PropertyBinding.sanitizeNodeName('Face | curved emissive display_export'));
        if (!(face instanceof three.Mesh) || Array.isArray(face.material) || !(face.material instanceof three.MeshStandardMaterial)) {
          throw new Error('Orion face material is unavailable.');
        }
        const faceMaterial = face.material;
        const sourceTexture = faceMaterial.emissiveMap ?? faceMaterial.map;
        if (!sourceTexture) throw new Error('Orion face texture is unavailable.');
        const concernedFaceTexture = makeConcernedFaceTexture(three, sourceTexture);
        const concernedFaceMaterial = faceMaterial.clone();
        concernedFaceMaterial.emissiveMap = concernedFaceTexture;
        concernedFaceMaterial.needsUpdate = true;
        const arms = [makeArm(-1), makeArm(1)];
        for (const arm of arms) for (const finger of arm.fingers) finger.rotation.x = 0;

        renderState = {
          three, renderer: activeRenderer, scene, camera, root, keyboard,
          keyboardClosed: keyboard.rotation.x,
          keyboardOpen: keyboard.rotation.x - three.MathUtils.degToRad(88),
          arms, face, faceMaterial, concernedFaceMaterial, concernedFaceTexture,
        };
        runtimeFailed = false;
        setLoaded(true);
        setDegraded(false);
        setStatus('Ready to help');
        setCaption('Orion is ready. Choose an action or continue the chat.');

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
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('Orion 3D preview failed to start:', error);
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
      renderState?.concernedFaceMaterial.dispose();
      renderState?.concernedFaceTexture.dispose();
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
      : 'Orion’s 3D preview is visible; chat remains available.');
    redrawRef.current();
  };

  const controls = (
    <>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => sendLocalAction('show_keyboard')} disabled={textOnly} className="rounded-md border border-[var(--glass-border)] px-2 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--neon-cyan)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)] disabled:opacity-50">View keyboard</button>
        <button type="button" onClick={() => sendLocalAction('idle')} disabled={textOnly} className="rounded-md border border-[var(--glass-border)] px-2 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--neon-cyan)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)] disabled:opacity-50">Front view</button>
      </div>
      {process.env.NODE_ENV === 'development' && !compact && (
        <details className="mt-2 text-xs text-[var(--text-secondary)]">
          <summary className="cursor-pointer rounded-md px-1 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)]">Test movements</summary>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {previewMovements.map(({ action, label }) => (
              <button key={action} type="button" onClick={() => sendLocalAction(action)} disabled={textOnly} className="rounded-md border border-[var(--glass-border)] px-2 py-1.5 text-left text-xs text-[var(--text-primary)] hover:border-[var(--neon-cyan)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)] disabled:opacity-50">{label}</button>
            ))}
          </div>
        </details>
      )}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-[var(--glass-border)] pt-2 text-[10px] text-[var(--text-secondary)]">
        <label className="inline-flex items-center gap-1.5"><input type="checkbox" checked={reducedMotion} onChange={(event) => changeReducedMotion(event.currentTarget.checked)} className="accent-cyan-400" />Reduced motion</label>
        <label className="inline-flex items-center gap-1.5"><input type="checkbox" checked={captionsEnabled} onChange={(event) => setCaptionsEnabled(event.currentTarget.checked)} className="accent-cyan-400" />Captions</label>
        <label className="inline-flex items-center gap-1.5"><input type="checkbox" checked={textOnly} onChange={(event) => changeTextOnly(event.currentTarget.checked)} className="accent-cyan-400" />Text-only</label>
      </div>
    </>
  );

  return (
    <section className={compact ? 'border-b border-[var(--glass-border)] px-1 pb-2' : 'mb-4 rounded-xl border border-[var(--neon-cyan)]/20 bg-[var(--space-deep)]/60 p-3'} aria-label="Orion character preview">
      <div className="flex items-center gap-3">
        <div ref={stageRef} className={`relative shrink-0 overflow-hidden rounded-lg border border-[var(--glass-border)] bg-[radial-gradient(circle_at_50%_40%,rgba(0,200,255,0.12),transparent_72%)] ${compact ? 'h-24 w-24' : 'h-28 w-24'}`}>
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" hidden={!loaded || degraded || textOnly} />
          <Image src={POSTER} alt="Orion character illustration" fill sizes="96px" className="object-contain" hidden={(loaded && !degraded) || textOnly} />
          {textOnly && <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-xs text-[var(--text-secondary)]">Text-only mode<br />Chat remains available.</div>}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          {compact ? (
            <p className="text-sm font-semibold text-[var(--text-primary)]" role="status" aria-live="polite">{status}</p>
          ) : (
            <>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">Orion</h4>
              <p className="text-xs leading-snug text-[var(--text-secondary)]" role="status" aria-live="polite">{status}</p>
            </>
          )}
          {compact && captionsEnabled && <p className="text-[11px] leading-snug text-[var(--text-muted)]" aria-live="polite" aria-atomic="true">{caption}</p>}
        </div>
      </div>
      {compact ? (
        <details className="mt-2 text-xs text-[var(--text-secondary)]">
          <summary className="cursor-pointer rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)]">Orion options</summary>
          <div className="mt-2 rounded-lg border border-[var(--glass-border)] bg-[var(--space-deep)] p-2">
            {controls}
          </div>
        </details>
      ) : controls}
      {!compact && captionsEnabled && <p className="mt-1 text-[10px] leading-snug text-[var(--text-muted)]" aria-live="polite" aria-atomic="true">Caption: {caption}</p>}
    </section>
  );
}
