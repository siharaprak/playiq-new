import type { FaceState } from './poses';

/**
 * Procedural renderer for Orion's green character display.
 *
 * Coordinates use the authored 768×768 face texture space so the default
 * expression matches the approved artwork (eyes at y≈270, grin at y≈472–630).
 */

const COLORS = {
  bgInner: '#0b600b',
  bgOuter: '#053d05',
  hill: '#55e000',
  ring: '#b5f53b',
  pupil: '#000d05',
  shine: '#fbfde8',
  dot: '#2e7a4a',
  ink: '#071207',
  teeth: '#eef5d8',
  star: '#f6ff6a',
  blush: 'rgba(255, 128, 170, 0.55)',
  tongue: '#e8577e',
} as const;

const EYES = [
  { cx: 197, side: -1 },
  { cx: 571, side: 1 },
] as const;
const EYE_CY = 270;

/** A stable key so the texture is only re-uploaded when the face visibly changes. */
export function faceKey(face: FaceState): string {
  const q = (value: number, steps: number) => Math.round(value * steps);
  return [
    face.eyeShape, face.mouth, face.blush ? 1 : 0, face.zzz ? q(face.spin % 3, 12) : 0,
    q(face.eyeOpen, 10), q(face.pupilX, 20), q(face.pupilY, 20), q(face.brow, 10),
    face.eyeShape === 'loading' ? q(face.spin % (Math.PI * 2), 16) : 0,
  ].join('|');
}

function ellipse(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, fill: string) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), 0, 0, Math.PI * 2);
  ctx.fill();
}

function happyArc(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.strokeStyle = COLORS.ring;
  ctx.lineWidth = 40;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 88, cy + 46);
  ctx.quadraticCurveTo(cx, cy - 110, cx + 88, cy + 46);
  ctx.stroke();
}

function closedLine(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.strokeStyle = COLORS.ring;
  ctx.lineWidth = 34;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 92, cy + 10);
  ctx.quadraticCurveTo(cx, cy + 46, cx + 92, cy + 10);
  ctx.stroke();
}

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, outer: number, inner: number) {
  ctx.fillStyle = COLORS.star;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

function drawEye(ctx: CanvasRenderingContext2D, cx: number, side: -1 | 1, face: FaceState) {
  const shape = face.eyeShape === 'wink' ? (side > 0 ? 'happy' : 'normal') : face.eyeShape;

  if (shape === 'happy') { happyArc(ctx, cx, EYE_CY); return; }
  if (shape === 'sleepy') { closedLine(ctx, cx, EYE_CY + 40); return; }

  const open = face.eyeOpen;
  if (open < 0.18) { closedLine(ctx, cx, EYE_CY); return; }

  const wide = shape === 'wide' ? 1.07 : 1;
  const cy = EYE_CY;
  const ringRy = 178 * open * wide;
  ellipse(ctx, cx, cy, 113 * wide, ringRy, COLORS.ring);

  const px = 7 + face.pupilX * 22;
  const py = 13 * open + face.pupilY * 28 * open;
  const pupilRx = shape === 'wide' ? 52 : 67;
  const pupilRy = (shape === 'wide' ? 104 : 135) * open;
  const icx = cx + px;
  const icy = cy + py;
  ellipse(ctx, icx, icy, pupilRx, pupilRy, COLORS.pupil);

  if (shape === 'star') {
    star(ctx, icx, icy, 58 * Math.min(1, open + 0.2), 24);
  } else if (shape === 'loading') {
    for (let i = 0; i < 8; i += 1) {
      const angle = face.spin + (i * Math.PI) / 4;
      const alpha = 0.25 + 0.75 * (((i - Math.floor(face.spin * 1.27)) % 8 + 8) % 8) / 7;
      ctx.globalAlpha = alpha;
      ellipse(ctx, icx + Math.cos(angle) * 40, icy + Math.sin(angle) * 40 * Math.min(1, open * 1.4), 11, 11, COLORS.ring);
    }
    ctx.globalAlpha = 1;
  } else {
    ellipse(ctx, icx - 21, icy - 75 * open, 21, 30 * open, COLORS.shine);
    ellipse(ctx, icx + 31, icy + 27 * open, 9, 9 * open, COLORS.dot);
  }
}

function drawBrows(ctx: CanvasRenderingContext2D, brow: number) {
  if (Math.abs(brow) < 0.05) return;
  ctx.strokeStyle = COLORS.ring;
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';
  // Negative brow lifts the inner ends (worried); positive lowers them (determined).
  const tilt = brow * 38;
  ctx.beginPath();
  ctx.moveTo(105, 64 - tilt);
  ctx.lineTo(286, 64 + tilt);
  ctx.moveTo(482, 64 + tilt);
  ctx.lineTo(663, 64 - tilt);
  ctx.stroke();
}

function strokeCurve(ctx: CanvasRenderingContext2D, points: [number, number, number, number, number, number], width = 16) {
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  ctx.quadraticCurveTo(points[2], points[3], points[4], points[5]);
  ctx.stroke();
}

function drawMouth(ctx: CanvasRenderingContext2D, face: FaceState) {
  switch (face.mouth) {
    case 'grin': {
      ctx.beginPath();
      ctx.moveTo(228, 472);
      ctx.quadraticCurveTo(384, 564, 540, 472);
      ctx.quadraticCurveTo(470, 640, 384, 632);
      ctx.quadraticCurveTo(298, 640, 228, 472);
      ctx.closePath();
      ctx.fillStyle = COLORS.teeth;
      ctx.fill();
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = COLORS.ink;
      ctx.lineWidth = 6;
      for (const x of [288, 336, 384, 432, 480]) {
        ctx.beginPath();
        ctx.moveTo(x, 460);
        ctx.lineTo(x, 650);
        ctx.stroke();
      }
      ctx.restore();
      ctx.strokeStyle = COLORS.ink;
      ctx.lineWidth = 9;
      ctx.lineJoin = 'round';
      ctx.stroke();
      return;
    }
    case 'open': {
      ctx.beginPath();
      ctx.moveTo(262, 488);
      ctx.quadraticCurveTo(384, 512, 506, 488);
      ctx.quadraticCurveTo(384, 760, 262, 488);
      ctx.closePath();
      ctx.fillStyle = COLORS.ink;
      ctx.fill();
      ctx.save();
      ctx.clip();
      ellipse(ctx, 384, 628, 72, 40, COLORS.tongue);
      ctx.restore();
      return;
    }
    case 'o':
      ellipse(ctx, 384, 558, 42, 49, COLORS.ink);
      ctx.strokeStyle = COLORS.teeth;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(384, 558, 30, 37, 0, Math.PI * 1.12, Math.PI * 1.88);
      ctx.stroke();
      return;
    case 'smile':
      strokeCurve(ctx, [270, 500, 384, 610, 498, 500]);
      return;
    case 'flat':
      strokeCurve(ctx, [314, 560, 384, 566, 454, 560]);
      return;
    case 'smirk':
      strokeCurve(ctx, [296, 548, 420, 596, 488, 500]);
      return;
  }
}

function drawZzz(ctx: CanvasRenderingContext2D, spin: number) {
  ctx.fillStyle = COLORS.ring;
  ctx.font = 'bold 72px system-ui, sans-serif';
  const drift = (spin * 18) % 36;
  ctx.globalAlpha = 0.9;
  ctx.fillText('z', 600, 150 - drift);
  ctx.font = 'bold 54px system-ui, sans-serif';
  ctx.globalAlpha = 0.6;
  ctx.fillText('z', 660, 92 - drift * 0.6);
  ctx.globalAlpha = 1;
}

/** Draws Orion's face into a square canvas context of `size` pixels. */
export function drawOrionFace(ctx: CanvasRenderingContext2D, size: number, face: FaceState): void {
  ctx.save();
  ctx.setTransform(size / 768, 0, 0, size / 768, 0, 0);

  const background = ctx.createRadialGradient(384, 330, 40, 384, 330, 560);
  background.addColorStop(0, COLORS.bgInner);
  background.addColorStop(1, COLORS.bgOuter);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 768, 768);

  ctx.fillStyle = COLORS.hill;
  ctx.beginPath();
  ctx.arc(384, 909, 509, 0, Math.PI * 2);
  ctx.fill();

  if (face.blush) {
    ellipse(ctx, 92, 470, 54, 28, COLORS.blush);
    ellipse(ctx, 676, 470, 54, 28, COLORS.blush);
  }

  for (const eye of EYES) drawEye(ctx, eye.cx, eye.side, face);
  drawBrows(ctx, face.brow);
  drawMouth(ctx, face);
  if (face.zzz) drawZzz(ctx, face.spin);

  ctx.restore();
}
