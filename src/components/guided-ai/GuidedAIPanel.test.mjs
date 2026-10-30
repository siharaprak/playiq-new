import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getOrionPanelLayout } from './panel-layout.ts';

const source = readFileSync(new URL('./GuidedAIPanel.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('./GuidedAIPanel.module.css', import.meta.url), 'utf8');
const viewport = (width, height, offsetLeft = 0, offsetTop = 0) => ({ width, height, offsetLeft, offsetTop });

test('desktop expands to about two-thirds width and restores without changing viewport', () => {
  const normal = getOrionPanelLayout(viewport(1440, 900), false);
  const expanded = getOrionPanelLayout(viewport(1440, 900), true);
  assert.equal(normal.width, 544);
  assert.equal(normal.height, 736);
  assert.equal(expanded.width, 1440 * .68);
  assert.equal(expanded.height, 868);
  assert.equal(expanded.canExpand, true);
  assert.deepEqual(getOrionPanelLayout(viewport(1440, 900), false), normal);
});

test('phone is almost full viewport without needing an expand control', () => {
  for (const expanded of [false, true]) {
    const layout = getOrionPanelLayout(viewport(390, 844), expanded);
    assert.equal(layout.width, 374);
    assert.equal(layout.height, 828);
    assert.equal(layout.left, 8);
    assert.equal(layout.top, 8);
    assert.equal(layout.autoCollapseCharacter, true);
    assert.equal(layout.canExpand, false);
  }
});

test('mobile keyboard resize and pan keep the composer panel in the visual viewport', () => {
  const layout = getOrionPanelLayout(viewport(390, 300, 12, 160), true);
  assert.equal(layout.left, 20);
  assert.equal(layout.top, 168);
  assert.equal(layout.width, 374);
  assert.equal(layout.height, 284);
  assert.ok(layout.top + layout.height < 460);
});

test('landscape/zoom and tiny heights prefer full available space with character collapsed', () => {
  for (const [width, height] of [[844, 390], [720, 450], [320, 256], [240, 120]]) {
    const layout = getOrionPanelLayout(viewport(width, height), false);
    assert.equal(layout.autoCollapseCharacter, true);
    assert.equal(layout.canExpand, false);
    assert.ok(layout.height >= height - 16);
    assert.ok(layout.width >= width - 16);
  }
});

test('layout stays bounded over desktop, tablet, zoom, and keyboard dimensions', () => {
  for (const width of [160, 240, 320, 375, 640, 767, 768, 820, 1024, 1440, 2560]) {
    for (const height of [100, 240, 390, 499, 500, 599, 600, 768, 900, 1400]) {
      for (const expanded of [false, true]) {
        const layout = getOrionPanelLayout(viewport(width, height, 7, 13), expanded);
        assert.ok(layout.width > 0 && layout.height > 0);
        assert.ok(layout.left >= 7 && layout.top >= 13);
        assert.ok(layout.left + layout.width <= width + 7);
        assert.ok(layout.top + layout.height <= height + 13);
      }
    }
  }
});

test('invalid numeric dimensions fail to finite, bounded values', () => {
  for (const dimension of [NaN, Infinity, -Infinity, -10, 0]) {
    const layout = getOrionPanelLayout(viewport(dimension, dimension, dimension, dimension), true);
    for (const key of ['width', 'height', 'left', 'top']) assert.ok(Number.isFinite(layout[key]));
    assert.ok(layout.width > 0 && layout.height > 0);
  }
});

test('minimize and character collapse hide mounted contents instead of clearing conversation', () => {
  assert.match(source, /<div hidden=\{!isOpen\}>/);
  assert.match(source, /id=\{characterId\} hidden=\{isCharacterCollapsed\}/);
  assert.match(source, /id=\{contentId\} hidden=\{!isOpen\}/);
  const minimize = source.slice(source.indexOf('const minimizeOrion ='), source.indexOf('// Sprint 4C:'));
  assert.match(minimize, /setIsOpen\(false\)/);
  assert.doesNotMatch(minimize, /setMessages|setMessage\(|setActiveMode|setStudentAttempt/);
  assert.match(source, /active=\{isOpen && !isCharacterCollapsed\} enable3d=\{orion3d\}/);
  assert.match(css, /\.characterContent\[hidden\], \.inlineContent\[hidden\] \{ display: none;/);
});

test('dialog and controls are named, keyboard-dismissable, with return focus', () => {
  assert.match(source, /role="dialog"\s+aria-modal="false"\s+aria-labelledby=\{titleId\}/);
  assert.match(source, /aria-label=\{isExpanded \? 'Restore Orion chat size' : 'Expand Orion chat'\}/);
  assert.match(source, /aria-label="Minimize Orion chat"/);
  assert.match(source, /event.key === 'Escape'/);
  assert.match(source, /launcherRef.current\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(source, /panelRef.current\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(source, /aria-label="Message to Orion"/);
  assert.match(source, /aria-expanded=\{!isCharacterCollapsed\}/);
});

test('visual viewport listeners clean up; conversation and composer have bounded independent scrolling', () => {
  for (const event of ['resize', 'scroll']) {
    assert.ok(source.includes(`visual?.addEventListener('${event}', updateViewport)`));
    assert.ok(source.includes(`visual?.removeEventListener('${event}', updateViewport)`));
  }
  assert.match(css, /\.conversation \{[\s\S]*?min-height: 0;[\s\S]*?overflow-y: auto;/);
  assert.match(css, /\.composer \{[\s\S]*?max-height: 45%;[\s\S]*?overflow-y: auto;/);
  assert.match(css, /env\(safe-area-inset-bottom, 0px\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(source, /max-w-\[410px\]|h-\[580px\]/);
});

test('source contract keeps the authenticated endpoint, hint effort, teach-back and character boundary', () => {
  assert.match(source, /fetch\('\/api\/guided-ai', \{\s+method: 'POST'/);
  assert.match(source, /if \(!activeMode \|\| !message.trim\(\) \|\| isLoading\) return;/);
  assert.match(source, /if \(data.effortRequired\) \{\s+setShowAttemptField\(true\);/);
  assert.match(source, /setTeachBackActive\(Boolean\(data.teachBackRequired\)\)/);
  assert.match(source, /const gestured = syncCharacterWithGuidedAiResponse\(data\)/);
  assert.match(source, /selectLocalReactionForGuidedAiResponse\(data, context\)/);
  assert.match(source, /if \(data.integrityAction === 'refused'\)/);
  assert.doesNotMatch(source, /ORION_3D_MODE|localStorage.setItem/);
});
