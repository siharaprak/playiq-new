'use client';

import {useEffect, useRef, useState, type RefObject} from 'react';
import {createPortal} from 'react-dom';
import {CHARACTER_ACTION_EVENT_NAME, CHARACTER_NEUTRAL_EVENT_NAME, parseCharacterActionEvent} from '@/lib/orion/action-contract';
import {DEFAULT_ORION_PREFERENCES, ORION_LOCAL_EVENT_NAME, loadOrionPreferences, parseOrionLocalEvent, saveOrionPreferences, type OrionPreferences} from '@/lib/orion/local-events';
import {animationForOrionPose, companionFrame, idleCompanion, transitionCompanion, type CompanionAnimation, type CompanionState} from '@/lib/orion/companion-state';
import {boundCompanion, companionGeometry, type CompanionViewport} from '@/lib/orion/companion-policy';
import styles from './OrionCompanion.module.css';

const STORE = 'playiq-orion-companion-position-v1';
const NO_UNLOCKS: readonly string[] = Object.freeze([]);
type Manifest = {version: number; cell: {width: number; height: number}; anchors: Record<string, {hat: [number, number]; held: [number, number]}>};
type Props = {onOpenChat: () => void; chatOpen?: boolean; launcherRef?: RefObject<HTMLButtonElement | null>; unlocks?: readonly string[]};

/** One visual companion for the existing Guided AI. Never creates a second chat. */
export default function OrionCompanion({onOpenChat, chatOpen = false, launcherRef, unlocks = NO_UNLOCKS}: Props) {
  const [mounted, setMounted] = useState(false), [ready, setReady] = useState(false), [error, setError] = useState('');
  const [position, setPosition] = useState({x: 0, y: 0}), [viewport, setViewport] = useState<CompanionViewport>({width: 1280, height: 900, offsetLeft: 0, offsetTop: 0});
  const [compact, setCompact] = useState(false), [menu, setMenu] = useState(false), [hit, setHit] = useState(''), [label, setLabel] = useState<CompanionAnimation>('idle');
  const [prefs, setPrefs] = useState<OrionPreferences>(DEFAULT_ORION_PREFERENCES);
  const canvas = useRef<HTMLCanvasElement>(null), optionsRef = useRef<HTMLButtonElement>(null);
  const state = useRef<CompanionState>(idleCompanion()), positionRef = useRef(position), viewportRef = useRef(viewport), compactRef = useRef(compact);
  const renderPrefs = useRef({prefs, chatOpen, compact});
  useEffect(() => {renderPrefs.current = {prefs, chatOpen, compact};}, [prefs, chatOpen, compact]);
  const drag = useRef<{id: number; x: number; y: number; previousX: number; startX: number; startY: number; moved: boolean} | null>(null);
  const suppressClick = useRef(false);
  const trigger = (event: CompanionAnimation) => {state.current = transitionCompanion(state.current, event, performance.now());};

  useEffect(() => {
    setPrefs(loadOrionPreferences());
    let saved: {x?: number; y?: number; compact?: boolean} = {};
    try {saved = JSON.parse(localStorage.getItem(STORE) ?? '{}') ?? {};} catch { /* Default position remains usable. */ }
    compactRef.current = saved.compact === true;
    setCompact(compactRef.current);
    const update = (initial = false) => {
      const visual = window.visualViewport;
      const v = {width: visual?.width ?? window.innerWidth, height: visual?.height ?? window.innerHeight, offsetLeft: visual?.offsetLeft ?? 0, offsetTop: visual?.offsetTop ?? 0};
      viewportRef.current = v; setViewport(v);
      const p = boundCompanion(initial ? saved.x ?? v.width - 208 : positionRef.current.x, initial ? saved.y ?? v.height - 260 : positionRef.current.y, v, compactRef.current);
      positionRef.current = p; setPosition(p);
    };
    update(true); setMounted(true);
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
    let disposed = false, timer = 0, last = '';
    const controller = new AbortController(), media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const run = async () => {
      const response = await fetch('/character-assets/orion/companion-v1/manifest.json', {signal: controller.signal});
      if (!response.ok) throw new Error('Character artwork could not load. Orion chat is still available.');
      const manifest: Manifest = await response.json();
      if (manifest.version !== 1 || manifest.cell?.width !== 192 || manifest.cell?.height !== 208) throw new Error('Character artwork format was not recognized. Chat is still available.');
      const image = new Image(); image.src = '/character-assets/orion/companion-v1/atlas.png'; await image.decode();
      if (disposed) return;
      const scratch = document.createElement('canvas'); scratch.width = 192; scratch.height = 208;
      const sc = scratch.getContext('2d', {willReadFrequently: true});
      if (!sc) throw new Error('Character canvas unavailable. Orion chat is still available.');
      const masks = new Map<string, string>();
      // Two-pixel alpha runs preserve internal holes; there is no rectangular hit box.
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
        masks.set(`${row}:${col}`, path);
      }
      setReady(true);
      const tick = () => {
        if (disposed) return;
        const current = renderPrefs.current;
        if (document.hidden || current.chatOpen || current.compact || current.prefs.textOnly) {timer = window.setTimeout(tick, 250); last = ''; return;}
        const reduced = current.prefs.reducedMotion ?? media.matches;
        const frame = companionFrame(state.current, performance.now(), reduced); state.current = frame.state;
        const key = `${frame.row}:${frame.column}`;
        if (key !== last) {
          last = key;
          const context = canvas.current?.getContext('2d');
          if (context) {
            context.clearRect(0, 0, 192, 208); context.drawImage(image, frame.column * 192, frame.row * 208, 192, 208, 0, 0, 192, 208);
            const anchor = manifest.anchors[key];
            // Caller-supplied verified unlocks only. No rewards are inferred here.
            if (anchor && unlocks.includes('hat')) {
              const [x, y] = anchor.hat; context.fillStyle = '#f9bc40'; context.beginPath(); context.moveTo(x - 15, y); context.lineTo(x - 12, y - 17); context.lineTo(x, y - 9); context.lineTo(x + 12, y - 17); context.lineTo(x + 15, y); context.closePath(); context.fill();
            }
            if (anchor && unlocks.includes('held')) {context.fillStyle = '#58dce8'; context.beginPath(); context.arc(anchor.held[0] + 7, anchor.held[1], 7, 0, Math.PI * 2); context.fill();}
          }
          setHit(masks.get(key) ?? ''); setLabel(state.current.animation);
        }
        timer = window.setTimeout(tick, reduced ? 250 : 50);
      };
      tick();
    };
    run().catch(() => {if (!disposed) setError('Character artwork could not load. Orion chat is still available.');});
    const action = (event: Event) => {if (event instanceof CustomEvent) {const value = parseCharacterActionEvent(event.detail); if (value) trigger(animationForOrionPose(value.action));}};
    const local = (event: Event) => {if (event instanceof CustomEvent) {const value = parseOrionLocalEvent(event.detail); if (value) trigger(value.kind === 'thinking' ? value.on ? 'thinking' : 'idle' : animationForOrionPose(value.pose));}};
    const neutral = () => trigger('idle');
    const review = (event: Event) => {if (process.env.NODE_ENV === 'development' && event instanceof CustomEvent && ['idle', 'wave', 'thinking', 'chatting', 'celebrate', 'boss'].includes(event.detail)) trigger(event.detail);};
    window.addEventListener(CHARACTER_ACTION_EVENT_NAME, action); window.addEventListener(CHARACTER_NEUTRAL_EVENT_NAME, neutral); window.addEventListener(ORION_LOCAL_EVENT_NAME, local); window.addEventListener('playiq:companion-review', review);
    return () => {disposed = true; controller.abort(); window.clearTimeout(timer); window.removeEventListener(CHARACTER_ACTION_EVENT_NAME, action); window.removeEventListener(CHARACTER_NEUTRAL_EVENT_NAME, neutral); window.removeEventListener(ORION_LOCAL_EVENT_NAME, local); window.removeEventListener('playiq:companion-review', review);};
  }, [mounted, unlocks]);

  function persist() {
    try {localStorage.setItem(STORE, JSON.stringify({...positionRef.current, compact: compactRef.current}));} catch {setError('Position could not be saved on this device. Orion remains usable.');}
  }
  function move(x: number, y: number) {const p = boundCompanion(x, y, viewportRef.current, compactRef.current); positionRef.current = p; setPosition(p);}
  function dock(value: boolean) {compactRef.current = value; setCompact(value); move(positionRef.current.x, positionRef.current.y); persist();}
  function updatePrefs(patch: Partial<OrionPreferences>) {const next = {...prefs, ...patch}; setPrefs(next); saveOrionPreferences(next);}
  function closeMenu() {setMenu(false); optionsRef.current?.focus();}
  function openChat() {
    setMenu(false);
    trigger('wave');
    const v = viewportRef.current;
    if (v.width >= 768 && positionRef.current.x > v.width - 760) {
      move(Math.max(16, v.width - 760), positionRef.current.y);
    }
    onOpenChat();
  }
  if (!mounted) return null;
  const fallback = !ready || Boolean(error) || prefs.textOnly;
  const geometry = companionGeometry(viewport, compact || fallback);
  const menuLeft = Math.max(viewport.offsetLeft + 8, Math.min(position.x, viewport.offsetLeft + viewport.width - 272));
  const menuTop = Math.max(viewport.offsetTop + 8, Math.min(position.y - 360, viewport.offsetTop + viewport.height - 380));

  return createPortal(<div className={styles.host} hidden={chatOpen} aria-label="Floating Orion companion" data-animation={label} data-x={position.x} data-y={position.y} data-compact={compact || fallback} style={{left: position.x, top: position.y, width: geometry.width, height: geometry.height}}>
    <p className={styles.srOnly} id="orion-companion-help">Drag Orion to move. Click or press Enter to chat. Arrow keys move Orion. Open options to dock, hide or reset the character.</p>
    {fallback || compact ? <button ref={launcherRef} className={styles.dock} onClick={openChat} aria-label="Open Orion chat" aria-describedby="orion-companion-help">
      {!prefs.textOnly && <img src="/character-assets/orion/orion-avatar-128.webp" alt=""/>}<span>{prefs.textOnly ? 'Ask Orion' : 'Chat'}</span>
    </button> : <div className={styles.sprite} style={{transform: `scale(${geometry.scale})`}}>
      <canvas ref={canvas} width={192} height={208} className={styles.art} aria-hidden="true"/>
      <button ref={launcherRef} type="button" className={styles.hit} aria-label="Open Orion chat; drag to move" aria-describedby="orion-companion-help"
        onClick={() => {if (suppressClick.current) {suppressClick.current = false; return;} openChat();}}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') suppressClick.current = false;
          if (event.key.startsWith('Arrow')) {event.preventDefault(); move(position.x + (event.key === 'ArrowRight' ? 12 : event.key === 'ArrowLeft' ? -12 : 0), position.y + (event.key === 'ArrowDown' ? 12 : event.key === 'ArrowUp' ? -12 : 0)); persist();}
          if (event.key === 'Escape') closeMenu();
        }}
        onContextMenu={event => {event.preventDefault(); setMenu(value => !value);}}
        onPointerDown={event => {
          if (event.button !== 0) return; event.currentTarget.setPointerCapture(event.pointerId); suppressClick.current = false;
          drag.current = {id: event.pointerId, x: event.clientX, y: event.clientY, previousX: event.clientX, startX: positionRef.current.x, startY: positionRef.current.y, moved: false};
          state.current = transitionCompanion(state.current, 'down', performance.now());
        }}
        onPointerMove={event => {
          const d = drag.current; if (!d || d.id !== event.pointerId) return;
          const dx = event.clientX - d.x, dy = event.clientY - d.y; d.moved ||= Math.hypot(dx, dy) > 4;
          move(d.startX + dx, d.startY + dy);
          const change = event.clientX - d.previousX; d.previousX = event.clientX;
          state.current = transitionCompanion(state.current, change < -0.3 ? 'left' : change > 0.3 ? 'right' : 'still', performance.now());
        }}
        onPointerUp={event => {
          const d = drag.current; if (!d || d.id !== event.pointerId) return;
          suppressClick.current = d.moved; drag.current = null;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          state.current = transitionCompanion(state.current, 'up', performance.now()); persist();
        }}
        onPointerCancel={() => {drag.current = null; suppressClick.current = true; state.current = idleCompanion(performance.now()); persist();}}
        onLostPointerCapture={() => {if (drag.current) {drag.current = null; suppressClick.current = true; state.current = idleCompanion(performance.now()); persist();}}}
      ><svg viewBox="0 0 192 208" width={192} height={208} aria-hidden="true"><path d={hit} fill="transparent" style={{pointerEvents: 'all'}}/></svg></button>
    </div>}
    <button ref={optionsRef} type="button" className={styles.options} aria-label="Orion companion options" aria-expanded={menu} aria-controls="orion-companion-options" onClick={() => setMenu(value => !value)}>⋯</button>
    {prefs.captions && <span className={styles.srOnly} role="status">{label === 'thinking' ? 'Orion is thinking.' : label === 'celebrate' ? 'Orion is celebrating your progress.' : ''}</span>}
    {menu && <section id="orion-companion-options" className={styles.menu} aria-label="Orion companion options" style={{left: menuLeft, top: menuTop}} onKeyDown={event => {if (event.key === 'Escape') {event.stopPropagation(); closeMenu();}}}>
      <strong>Orion companion</strong><p>Drag to move · Click to chat</p>
      <button onClick={openChat}>Open Orion chat</button>
      <button onClick={() => {dock(!compact); closeMenu();}}>{compact ? 'Undock Orion' : 'Dock Orion'}</button>
      <button onClick={() => {move(viewport.offsetLeft + viewport.width - 208, viewport.offsetTop + viewport.height - 260); persist(); closeMenu();}}>Reset position</button>
      <label><input type="checkbox" checked={prefs.reducedMotion ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches} onChange={event => updatePrefs({reducedMotion: event.currentTarget.checked})}/>Reduced motion</label>
      <button onClick={() => updatePrefs({reducedMotion: null})}>Use device motion setting</button>
      <label><input type="checkbox" checked={prefs.textOnly} onChange={event => updatePrefs({textOnly: event.currentTarget.checked})}/>Hide character / text-only</label>
      <p>Chat remains available when the character is hidden.</p>{error && <p role="status">{error}</p>}
      <button onClick={closeMenu}>Close options</button>
    </section>}
  </div>, document.body);
}
