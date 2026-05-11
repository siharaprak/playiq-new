'use client';

import React from 'react';

interface PlayIQLogoProps {
  variant?: 'navbar' | 'hero';
  className?: string;
}

/**
 * Neon-sign style PlayIQ logo.
 *
 * Design language (photo 1):
 *   - Thick outlined block letters (no fill) — neon tube look
 *   - Triple-layer glow: outer bloom → tube body → bright inner highlight
 *   - Arrow (→) inside the A crossbar
 *   - Lowercase "i" with dot on top
 *   - Q with magnifier handle extending bottom-right
 *   - "Imagine. Build. Grow." tagline in glowing text
 *
 * Color palette (photo 2 — navy/cyan/purple):
 *   - Letters:   cyan  #00d4ff  with white highlight
 *   - Accents:   purple #9d4edd  (i stem, arrow, Q handle)
 *   - Bloom:     deep purple haze behind everything
 *   - Background: transparent
 */
export function PlayIQLogo({ variant = 'navbar', className = '' }: PlayIQLogoProps) {
  const CYAN      = 'var(--neon-cyan, #00d4ff)';
  const CYAN_PALE = 'var(--neon-cyan-pale, #7df9ff)';
  const PURPLE    = 'var(--neon-purple, #9d4edd)';
  const PURPLE_LT = 'var(--neon-purple-light, #c77dff)';

  /* ─────────────────────────────────────────────────────────────────────
     Shared SVG defs (filters + gradients)
     ───────────────────────────────────────────────────────────────────── */
  const Defs = ({ id }: { id: string }) => (
    <defs>
      {/* ── cyan neon tube glow ── */}
      <filter id={`${id}-cyan`} filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
        {/* outer bloom */}
        <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur-outer" />
        {/* tight tube glow */}
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur-inner" />
        <feMerge>
          <feMergeNode in="blur-outer" />
          <feMergeNode in="blur-inner" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* ── purple glow ── */}
      <filter id={`${id}-purple`} filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* ── large purple ambient bloom ── */}
      <filter id={`${id}-bloom`} filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="30" />
      </filter>
    </defs>
  );

  /* ─────────────────────────────────────────────────────────────────────
     HERO variant  –  viewBox 760 × 210
     Letters are packed tightly; each ~100 wide, 140 tall
     ───────────────────────────────────────────────────────────────────── */
  if (variant === 'hero') {
    const id = 'hero-logo';
    /* stroke widths for neon tube layers */
    const SW_OUTER = 10;   // coloured tube
    const SW_HIGH  = 3.5;  // white highlight centre line
    const SW_ARROW = 5;
    const SW_HANDLE = 12;

    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        <svg
          viewBox="0 0 770 175"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="PlayIQ"
          role="img"
          className="w-full max-w-[760px]"
          style={{ overflow: 'visible' }}
        >
          <Defs id={id} />

          {/* ── ambient purple bloom behind all letters ── */}
          <ellipse cx="375" cy="90" rx="340" ry="75"
            fill="var(--neon-purple, rgba(100,0,200,0.45))" opacity="0.3"
            filter={`url(#${id}-bloom)`} className="logo-ambient-bloom" />

          {/* ═══════════════════════════════════════════════
              CYAN LETTER OUTLINES
              Each letter drawn as open stroked paths
              Layer 1: wide cyan stroke (tube)
              Layer 2: narrow white stroke (highlight)
          ═══════════════════════════════════════════════ */}
          {[
            /* ──────── P  (x 18 → 118) ──────── */
            /* vertical bar */
            'M 30,15 L 30,155',
            /* bowl — rectangular bump top-right */
            'M 30,15 L 95,15 Q 118,15 118,52 Q 118,88 95,88 L 30,88',

            /* ──────── L  (x 130 → 218) ──────── */
            'M 140,15 L 140,155',
            'M 140,155 L 218,155',

            /* ──────── A  (x 230 → 350) ──────── */
            'M 230,155 L 290,15 L 350,155',
            /* crossbar */
            'M 253,105 L 327,105',

            /* ──────── Y  (x 362 → 462) ──────── */
            'M 362,15 L 412,85',
            'M 462,15 L 412,85',
            'M 412,85 L 412,155',

            /* ──────── Q  (x 524 → 720) ──────── */
            /* full circle */
            // drawn separately below as <circle>
          ].map((d, i) => (
            <g key={i}>
              {/* tube stroke */}
              <path d={d}
                stroke={CYAN} strokeWidth={SW_OUTER}
                fill="none" strokeLinecap="round" strokeLinejoin="round"
                filter={`url(#${id}-cyan)`} />
              {/* centre highlight */}
              <path d={d}
                stroke={CYAN_PALE} strokeWidth={SW_HIGH}
                fill="none" strokeLinecap="round" strokeLinejoin="round"
                opacity="0.7" />
            </g>
          ))}

          {/* Q circle */}
          {[0].map(() => (
            <g key="q">
              <circle cx="628" cy="87" r="72"
                stroke={CYAN} strokeWidth={SW_OUTER}
                fill="none"
                filter={`url(#${id}-cyan)`} />
              <circle cx="628" cy="87" r="72"
                stroke={CYAN_PALE} strokeWidth={SW_HIGH}
                fill="none" opacity="0.7" />
            </g>
          ))}

          {/* ═══════════════════════════════════════════════
              PURPLE ACCENTS
          ═══════════════════════════════════════════════ */}

          {/* ── Arrow inside A crossbar ── */}
          <g filter={`url(#${id}-purple)`}>
            {/* arrow shaft */}
            <path d="M 262,105 L 312,105"
              stroke={PURPLE_LT} strokeWidth={SW_ARROW}
              strokeLinecap="round" />
            {/* arrowhead */}
            <path d="M 300,93 L 316,105 L 300,117"
              stroke={PURPLE_LT} strokeWidth={SW_ARROW}
              fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* bright highlight on arrow */}
            <path d="M 262,105 L 308,105"
              stroke="white" strokeWidth="1.5"
              strokeLinecap="round" opacity="0.5" />
          </g>

          {/* ── lowercase i  (x 480 → 514) ── */}
          <g filter={`url(#${id}-purple)`}>
            {/* dot */}
            <circle cx="497" cy="24" r="8"
              fill={PURPLE} stroke={PURPLE_LT} strokeWidth="2" />
            <circle cx="497" cy="24" r="4"
              fill="white" opacity="0.5" />
            {/* stem */}
            <path d="M 497,46 L 497,155"
              stroke={PURPLE_LT} strokeWidth={SW_OUTER}
              strokeLinecap="round" />
            {/* top serif */}
            <path d="M 483,46 L 511,46"
              stroke={PURPLE_LT} strokeWidth={SW_OUTER}
              strokeLinecap="round" />
            {/* bottom serif */}
            <path d="M 483,155 L 511,155"
              stroke={PURPLE_LT} strokeWidth={SW_OUTER}
              strokeLinecap="round" />
            {/* centre highlight on stem */}
            <path d="M 497,46 L 497,155"
              stroke="white" strokeWidth="1.5"
              strokeLinecap="round" opacity="0.4" />
          </g>

          {/* ── Q magnifier handle ── */}
          <g filter={`url(#${id}-purple)`}>
            <line x1="673" y1="136" x2="712" y2="178"
              stroke={PURPLE} strokeWidth={SW_HANDLE}
              strokeLinecap="round" />
            <line x1="673" y1="136" x2="712" y2="178"
              stroke={PURPLE_LT} strokeWidth="4"
              strokeLinecap="round" />
            <line x1="673" y1="136" x2="712" y2="178"
              stroke="white" strokeWidth="1.5"
              strokeLinecap="round" opacity="0.35" />
          </g>


        </svg>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────
     NAVBAR variant  –  compact, viewBox 280 × 56
     ───────────────────────────────────────────────────────────────────── */
  const id = 'nav-logo';
  const SW  = 3.2;
  const SWH = 1.2;
  const SWA = 2;

  return (
    <svg
      viewBox="0 0 280 56"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="PlayIQ"
      role="img"
      className={`h-9 w-auto ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id={`${id}-cyan`} filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${id}-purple`} filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${id}-bloom`} filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* ambient bloom */}
      <ellipse cx="140" cy="28" rx="130" ry="22"
        fill="var(--neon-purple, rgba(100,0,200,0.3))" opacity="0.2"
        filter={`url(#${id}-bloom)`} className="logo-ambient-bloom" />

      {/* ── P ── */}
      {['M 8,5 L 8,51', 'M 8,5 L 36,5 Q 46,5 46,18 Q 46,31 36,31 L 8,31'].map((d, i) => (
        <g key={`p${i}`}>
          <path d={d} stroke={CYAN} strokeWidth={SW} fill="none" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id}-cyan)`} />
          <path d={d} stroke={CYAN_PALE} strokeWidth={SWH} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        </g>
      ))}

      {/* ── L ── */}
      {['M 54,5 L 54,51', 'M 54,51 L 82,51'].map((d, i) => (
        <g key={`l${i}`}>
          <path d={d} stroke={CYAN} strokeWidth={SW} fill="none" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id}-cyan)`} />
          <path d={d} stroke={CYAN_PALE} strokeWidth={SWH} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        </g>
      ))}

      {/* ── A ── */}
      {['M 88,51 L 113,5 L 138,51', 'M 98,35 L 128,35'].map((d, i) => (
        <g key={`a${i}`}>
          <path d={d} stroke={CYAN} strokeWidth={SW} fill="none" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id}-cyan)`} />
          <path d={d} stroke={CYAN_PALE} strokeWidth={SWH} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        </g>
      ))}
      {/* arrow in A */}
      <g filter={`url(#${id}-purple)`}>
        <path d="M 101,35 L 122,35" stroke={PURPLE_LT} strokeWidth={SWA} strokeLinecap="round" />
        <path d="M 116,30 L 124,35 L 116,40" stroke={PURPLE_LT} strokeWidth={SWA} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ── Y ── */}
      {['M 144,5 L 162,28', 'M 180,5 L 162,28', 'M 162,28 L 162,51'].map((d, i) => (
        <g key={`y${i}`}>
          <path d={d} stroke={CYAN} strokeWidth={SW} fill="none" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id}-cyan)`} />
          <path d={d} stroke={CYAN_PALE} strokeWidth={SWH} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        </g>
      ))}

      {/* ── i (purple) ── */}
      <g filter={`url(#${id}-purple)`}>
        <circle cx="192" cy="8" r="3" fill={PURPLE} stroke={PURPLE_LT} strokeWidth="1" />
        <path d="M 192,15 L 192,51" stroke={PURPLE_LT} strokeWidth={SW} strokeLinecap="round" />
        <path d="M 185,15 L 199,15" stroke={PURPLE_LT} strokeWidth={SW} strokeLinecap="round" />
        <path d="M 185,51 L 199,51" stroke={PURPLE_LT} strokeWidth={SW} strokeLinecap="round" />
      </g>

      {/* ── Q ── */}
      <g>
        <circle cx="240" cy="28" r="24" stroke={CYAN} strokeWidth={SW} fill="none" filter={`url(#${id}-cyan)`} />
        <circle cx="240" cy="28" r="24" stroke={CYAN_PALE} strokeWidth={SWH} fill="none" opacity="0.6" />
        {/* handle */}
        <g filter={`url(#${id}-purple)`}>
          <line x1="258" y1="46" x2="272" y2="54" stroke={PURPLE} strokeWidth="5" strokeLinecap="round" />
          <line x1="258" y1="46" x2="272" y2="54" stroke={PURPLE_LT} strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
