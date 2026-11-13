'use client';

import {useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent, type RefObject, type TouchEvent} from 'react';
import {createPortal} from 'react-dom';
import {CHARACTER_ACTION_EVENT_NAME, CHARACTER_NEUTRAL_EVENT_NAME, parseCharacterActionEvent} from '@/lib/orion/action-contract';
import {DEFAULT_ORION_PREFERENCES, ORION_LOCAL_EVENT_NAME, loadOrionPreferences, parseOrionLocalEvent, saveOrionPreferences, type OrionPreferences} from '@/lib/orion/local-events';
import {animationForOrionPose, companionFrame, idleCompanion, transitionCompanion, type CompanionAnimation, type CompanionState} from '@/lib/orion/companion-state';
import {boundCompanion, companionGeometry, defaultCompanionPosition, type CompanionViewport} from '@/lib/orion/companion-policy';
import styles from './OrionCompanion.module.css';

const LEGACY_STORE = 'playiq-orion-companion-position-v1';
const STORE = 'playiq-orion-companion-position-v2';
const DEFAULT_HIT_PATH = 'M24,16h144v176H24Z';
const NO_UNLOCKS: readonly string[] = Object.freeze([]);
type Manifest = {version: number; cell: {width: number; height: number}; anchors: Record<string, {hat: [number, number]; held: [number, number]}>};
type Props = {onOpenChat: () => void; chatOpen?: boolean; launcherRef?: RefObject<HTMLButtonElement | null>; unlocks?: readonly string[]};

/** One visual companion for the existing Guided AI. Never creates a second chat. */
export default function OrionCompanion({onOpenChat, chatOpen = false, launcherRef, unlocks = NO_UNLOCKS}: Props) {
  const [mounted, setMounted] = useState(false), [ready, setReady] = useState(false), [error, setError] = useState('');
  const [position, setPosition] = useState({x: 0, y: 0}), [viewport, setViewport] = useState<CompanionViewport>({width: 1280, height: 900, offsetLeft: 0, offsetTop: 0});
  const [compact, setCompact] = useState(false), [menu, setMenu] = useState(false), [hit, setHit] = useState(DEFAULT_HIT_PATH), [label, setLabel] = useState<CompanionAnimation>('idle');
  const [prefs, setPrefs] = useState<OrionPreferences>(DEFAULT_ORION_PREFERENCES);
  const canvas = useRef<HTMLCanvasElement>(null), optionsRef = useRef<HTMLButtonElement>(null);
  const state = useRef<CompanionState>(idleCompanion()), positionRef = useRef(position), viewportRef = useRef(viewport), compactRef = useRef(compact);
  const customPosRef = useRef<{x: number; y: number} | null>(null);
  const readyRef = useRef(ready), errorRef = useRef(error);
  const renderPrefs = useRef({prefs, chatOpen, compact});
  useEffect(() => {
    renderPrefs.current = {prefs, chatOpen, compact};
    readyRef.current = ready;
    errorRef.current = error;
  }, [prefs, chatOpen, compact, ready, error]);
  const drag = useRef<{id: number; x: number; y: number; previousX: number; startX: number; startY: number; moved: boolean} | null>(null);
  const suppressClick = useRef(false);
  const trigger = (event: CompanionAnimation) => {state.current = transitionCompanion(state.current, event, performance.now());};

  const getEffectiveCompact = () => compactRef.current || !readyRef.current || Boolean(errorRef.current) || renderPrefs.current.prefs.textOnly;

  const syncPositionToViewport = (v: CompanionViewport) => {
    const isCompact = getEffectiveCompact();
    const p = customPosRef.current
      ? boundCompanion(customPosRef.current.x, customPosRef.current.y, v, isCompact)
      : defaultCompanionPosition(v, isCompact);
    positionRef.current = p;
    setPosition(p);
  };

  useEffect(() => {
    const loadedPrefs = loadOrionPreferences();
    setPrefs(loadedPrefs);
    renderPrefs.current.prefs = loadedPrefs;
    let saved: {x?: number; y?: number; compact?: boolean} = {};
    try {
      localStorage.removeItem(LEGACY_STORE);
      saved = JSON.parse(localStorage.getItem(STORE) ?? '{}') ?? {};
    } catch { /* Default position remains usable. */ }
    compactRef.current = saved.compact === true;
    setCompact(compactRef.current);
    if (typeof saved.x === 'number' && Number.isFinite(saved.x) && typeof saved.y === 'number' && Number.isFinite(saved.y)) {
      customPosRef.current = {x: saved.x, y: saved.y};
    }
    const update = () => {
      const visual = window.visualViewport;
      const v = {width: visual?.width ?? window.innerWidth, height: visual?.height ?? window.innerHeight, offsetLeft: visual?.offsetLeft ?? 0, offsetTop: visual?.offsetTop ?? 0};
      viewportRef.current = v;
      setViewport(v);
      syncPositionToViewport(v);
    };
    update();
    setMounted(true);
    const resize = () => update();
    window.addEventListener('resize', resize);
    window.visualViewport?.addEventListener('resize', resize);
    window.visualViewport?.addEventListener('scroll', resize);
    return () => {
      window.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('scroll', resize);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    syncPositionToViewport(viewportRef.current);
  }, [mounted, ready, error, compact, prefs.textOnly]);

  useEffect(() => {
    if (!mounted) return;
    let disposed = false, timer = 0, last = '';
    const controller = new AbortController(), media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const run = async () => {
      const response = await fetch('/character-assets/orion/companion-v1/manifest.json', {signal: controller.signal});
      if (!response.ok) throw new Error('Character artwork could not load. Orion chat is still available.');
      const manifest: Manifest = await response.json();
      if (manifest.version !== 1 || manifest.cell?.width !== 192 || manifest.cell?.height !== 208) throw new Error('Character artwork format was not recognized. Chat is still available.');
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Character artwork could not load.'));
        image.src = '/character-assets/orion/companion-v1/atlas.png';
      });
      if (typeof image.decode === 'function') {
        await image.decode().catch(() => {});
      }
      if (disposed) return;
      const scratch = document.createElement('canvas'); scratch.width = 192; scratch.height = 208;
      const sc = scratch.getContext('2d', {willReadFrequently: true});
      if (!sc) throw new Error('Character canvas unavailable. Orion chat is still available.');
      const masks = new Map<string, string>();
      // Two-pixel alpha runs preserve internal holes; there is no rectangular hit box.
      try {
        for (let row = 0; row < 9; row++) for (let col = 0; col < 8; col++) {
          sc.clearRect(0, 0, 192, 208); sc.drawImage(image, col * 192, row * 208, 192, 208, 0, 0, 192, 208);
          const data = sc.getImageData(0, 0, 192, 208).data; let path = '';
          for (let y = 0; y < 208; y += 2) {
            let start = -1;
            for (let x = 0; x <= 192; x++) {
              const opaque = x < 192 && data[(y * 192 + x) * 4 + 3] >= 32;
              if (opaque && start < 0) start = x;
              if (!opaque && start >= 0) {path += `M${start},${y}h${x - start}v2H${start}Z`; start = -1;}
            }
          }
          masks.set(`${row}:${col}`, path || DEFAULT_HIT_PATH);
        }
      } catch {
        for (let row = 0; row < 9; row++) for (let col = 0; col < 8; col++) {
          masks.set(`${row}:${col}`, DEFAULT_HIT_PATH);
        }
      }
      readyRef.current = true;
      setReady(true);
      const tick = () => {
        if (disposed) return;
        const current = renderPrefs.current;
        if (document.hidden || current.chatOpen || current.compact || current.prefs.textOnly) {timer = window.setTimeout(tick, 250); last = ''; return;}
        const reduced = current.prefs.reducedMotion ?? media.matches;
        const frame = companionFrame(state.current, performance.now(), reduced); state.current = frame.state;
        const key = `${frame.row}:${frame.column}`;
        const context = canvas.current?.getContext('2d');
        if (context && key !== last) {
          last = key;
          context.clearRect(0, 0, 192, 208); context.drawImage(image, frame.column * 192, frame.row * 208, 192, 208, 0, 0, 192, 208);
          const anchor = manifest.anchors[key];
          // Caller-supplied verified unlocks only. No rewards are inferred here.
          if (anchor && unlocks.includes('hat')) {
            const [x, y] = anchor.hat; context.fillStyle = '#f9bc40'; context.beginPath(); context.moveTo(x - 15, y); context.lineTo(x - 12, y - 17); context.lineTo(x, y - 9); context.lineTo(x + 12, y - 17); context.lineTo(x + 15, y); context.closePath(); context.fill();
          }
          if (anchor && unlocks.includes('held')) {context.fillStyle = '#58dce8'; context.beginPath(); context.arc(anchor.held[0] + 7, anchor.held[1], 7, 0, Math.PI * 2); context.fill();}
          setHit(masks.get(key) ?? DEFAULT_HIT_PATH); setLabel(state.current.animation);
        }
        timer = window.setTimeout(tick, reduced ? 250 : 50);
      };
      tick();
    };
    run().catch(() => {if (!disposed) {errorRef.current = 'Character artwork could not load. Orion chat is still available.'; setError(errorRef.current);}});
    const action = (event: Event) => {if (event instanceof CustomEvent) {const value = parseCharacterActionEvent(event.detail); if (value) trigger(animationForOrionPose(value.action));}};
    const local = (event: Event) => {if (event instanceof CustomEvent) {const value = parseOrionLocalEvent(event.detail); if (value) trigger(value.kind === 'thinking' ? value.on ? 'thinking' : 'idle' : animationForOrionPose(value.pose));}};
    const neutral = () => trigger('idle');
    const review = (event: Event) => {if (process.env.NODE_ENV === 'development' && event instanceof CustomEvent && ['idle', 'wave', 'thinking', 'chatting', 'celebrate', 'boss'].includes(event.detail)) trigger(event.detail);};
    window.addEventListener(CHARACTER_ACTION_EVENT_NAME, action); window.addEventListener(CHARACTER_NEUTRAL_EVENT_NAME, neutral); window.addEventListener(ORION_LOCAL_EVENT_NAME, local); window.addEventListener('playiq:companion-review', review);
    return () => {disposed = true; controller.abort(); window.clearTimeout(timer); window.removeEventListener(CHARACTER_ACTION_EVENT_NAME, action); window.removeEventListener(CHARACTER_NEUTRAL_EVENT_NAME, neutral); window.removeEventListener(ORION_LOCAL_EVENT_NAME, local); window.removeEventListener('playiq:companion-review', review);};
  }, [mounted, unlocks]);

  function persist() {
    try {
      const payload = customPosRef.current
        ? {x: customPosRef.current.x, y: customPosRef.current.y, compact: compactRef.current}
        : {compact: compactRef.current};
      localStorage.setItem(STORE, JSON.stringify(payload));
    } catch {setError('Position could not be saved on this device. Orion remains usable.');}
  }
  function move(x: number, y: number, saveCustom = true) {
    const p = boundCompanion(x, y, viewportRef.current, getEffectiveCompact());
    if (saveCustom) customPosRef.current = p;
    positionRef.current = p;
    setPosition(p);
    return p;
  }
  function dock(value: boolean) {
    compactRef.current = value;
    setCompact(value);
    const v = viewportRef.current;
    const isCompact = value || !readyRef.current || Boolean(errorRef.current) || renderPrefs.current.prefs.textOnly;
    const p = customPosRef.current
      ? boundCompanion(customPosRef.current.x, customPosRef.current.y, v, isCompact)
      : defaultCompanionPosition(v, isCompact);
    positionRef.current = p;
    setPosition(p);
    persist();
  }
  function resetPosition() {
    customPosRef.current = null;
    const p = defaultCompanionPosition(viewportRef.current, getEffectiveCompact());
    positionRef.current = p;
    setPosition(p);
    persist();
  }
  function updatePrefs(patch: Partial<OrionPreferences>) {const next = {...prefs, ...patch}; setPrefs(next); saveOrionPreferences(next);}
  function closeMenu() {setMenu(false); optionsRef.current?.focus();}
  function openChat() {
    setMenu(false);
    trigger('wave');
    const v = viewportRef.current;
    if (v.width >= 768 && positionRef.current.x > v.width - 760) {
      move(Math.max(16, v.width - 760), positionRef.current.y, false);
    }
    onOpenChat();
  }

  const handleLauncherClick = () => {
    if (suppressClick.current) {suppressClick.current = false; return;}
    openChat();
  };
  const handleLauncherKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') suppressClick.current = false;
    if (event.key.startsWith('Arrow')) {
      event.preventDefault();
      move(
        position.x + (event.key === 'ArrowRight' ? 12 : event.key === 'ArrowLeft' ? -12 : 0),
        position.y + (event.key === 'ArrowDown' ? 12 : event.key === 'ArrowUp' ? -12 : 0),
        true,
      );
      persist();
    }
    if (event.key === 'Escape') closeMenu();
  };
  const handleLauncherContextMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setMenu(value => !value);
  };
  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    try {event.currentTarget.setPointerCapture(event.pointerId);} catch {}
    suppressClick.current = false;
    drag.current = {id: event.pointerId, x: event.clientX, y: event.clientY, previousX: event.clientX, startX: positionRef.current.x, startY: positionRef.current.y, moved: false};
    state.current = transitionCompanion(state.current, 'down', performance.now());
  };
  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current; if (!d || d.id !== event.pointerId) return;
    const dx = event.clientX - d.x, dy = event.clientY - d.y;
    d.moved ||= Math.hypot(dx, dy) > 4;
    if (d.moved) move(d.startX + dx, d.startY + dy, true);
    const change = event.clientX - d.previousX; d.previousX = event.clientX;
    state.current = transitionCompanion(state.current, change < -0.3 ? 'left' : change > 0.3 ? 'right' : 'still', performance.now());
  };
  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current; if (!d || d.id !== event.pointerId) return;
    suppressClick.current = d.moved; drag.current = null;
    try {if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);} catch {}
    state.current = transitionCompanion(state.current, 'up', performance.now());
    if (d.moved) persist();
  };
  const handlePointerCancel = () => {
    const d = drag.current;
    drag.current = null;
    suppressClick.current = Boolean(d?.moved);
    state.current = idleCompanion(performance.now());
    if (d?.moved) persist();
  };
  const handleLostPointerCapture = () => {
    if (drag.current) {
      const d = drag.current;
      drag.current = null;
      suppressClick.current = d.moved;
      state.current = idleCompanion(performance.now());
      if (d.moved) persist();
    }
  };
  const handleTouchMove = (event: TouchEvent<HTMLButtonElement>) => {
    if (drag.current) event.preventDefault();
  };

  if (!mounted) return null;
  const fallback = !ready || Boolean(error) || prefs.textOnly;
  const geometry = companionGeometry(viewport, compact || fallback);
  const menuLeft = Math.max(viewport.offsetLeft + 8, Math.min(position.x, viewport.offsetLeft + viewport.width - 272));
  const menuTop = Math.max(viewport.offsetTop + 8, Math.min(position.y - 360, viewport.offsetTop + viewport.height - 380));

  return createPortal(<div className={styles.host} hidden={chatOpen} aria-label="Floating Orion companion" data-animation={label} data-x={position.x} data-y={position.y} data-compact={compact || fallback} style={{left: position.x, top: position.y, width: geometry.width, height: geometry.height}}>
    <p className={styles.srOnly} id="orion-companion-help">Drag Orion to move. Click or press Enter to chat. Arrow keys move Orion. Open options to dock, hide or reset the character.</p>
    {fallback || compact ? <button ref={launcherRef} type="button" className={styles.dock} aria-label="Open Orion chat; drag to move" aria-describedby="orion-companion-help"
      onClick={handleLauncherClick}
      onKeyDown={handleLauncherKeyDown}
      onContextMenu={handleLauncherContextMenu}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
      onTouchMove={handleTouchMove}
    >
      {!prefs.textOnly && <img src="/character-assets/orion/orion-avatar-128.webp" alt="" draggable={false}/>}<span>{prefs.textOnly ? 'Ask Orion' : 'Chat'}</span>
    </button> : <div className={styles.sprite} style={{transform: `scale(${geometry.scale})`}}>
      <canvas ref={canvas} width={192} height={208} className={styles.art} aria-hidden="true"/>
      <button ref={launcherRef} type="button" className={styles.hit} aria-label="Open Orion chat; drag to move" aria-describedby="orion-companion-help"
        onClick={handleLauncherClick}
        onKeyDown={handleLauncherKeyDown}
        onContextMenu={handleLauncherContextMenu}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handleLostPointerCapture}
        onTouchMove={handleTouchMove}
      ><svg viewBox="0 0 192 208" width={192} height={208} aria-hidden="true"><path d={hit} fill="transparent" style={{pointerEvents: 'all'}}/></svg></button>
    </div>}
    <button ref={optionsRef} type="button" className={styles.options} aria-label="Orion companion options" aria-expanded={menu} aria-controls="orion-companion-options" onClick={() => setMenu(value => !value)}>⋯</button>
    {prefs.captions && <span className={styles.srOnly} role="status">{label === 'thinking' ? 'Orion is thinking.' : label === 'celebrate' ? 'Orion is celebrating your progress.' : ''}</span>}
    {menu && <section id="orion-companion-options" className={styles.menu} aria-label="Orion companion options" style={{left: menuLeft, top: menuTop}} onKeyDown={event => {if (event.key === 'Escape') {event.stopPropagation(); closeMenu();}}}>
      <strong>Orion companion</strong><p>Drag to move · Click to chat</p>
      <button onClick={openChat}>Open Orion chat</button>
      <button onClick={() => {dock(!compact); closeMenu();}}>{compact ? 'Undock Orion' : 'Dock Orion'}</button>
      <button onClick={() => {resetPosition(); closeMenu();}}>Reset position</button>
      <label><input type="checkbox" checked={prefs.reducedMotion ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches} onChange={event => updatePrefs({reducedMotion: event.currentTarget.checked})}/>Reduced motion</label>
      <button onClick={() => updatePrefs({reducedMotion: null})}>Use device motion setting</button>
      <label><input type="checkbox" checked={prefs.textOnly} onChange={event => updatePrefs({textOnly: event.currentTarget.checked})}/>Hide character / text-only</label>
      <p>Chat remains available when the character is hidden.</p>{error && <p role="status">{error}</p>}
      <button onClick={closeMenu}>Close options</button>
    </section>}
  </div>, document.body);
}
