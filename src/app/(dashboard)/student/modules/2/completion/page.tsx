import React from 'react';
import Link from 'next/link';
import { enforceModuleGating } from '@/lib/gating';

export default async function Module2CompletionPage() {
  await enforceModuleGating('completion', 2, 6);

  const unlocks = [
    'Stronger digital judgment',
    'More control over your attention',
    'A clearer sense of responsibility',
    'Better habits for using AI and the internet wisely',
  ];

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center px-6 py-12 text-center"
      style={{ background: 'linear-gradient(to bottom, #0a0f1e, rgba(123,79,206,0.08))' }}
    >
      <div
        className="w-32 h-32 rounded-full flex items-center justify-center mb-8 text-6xl shadow-xl"
        style={{ background: 'rgba(123,79,206,0.15)', border: '2px solid rgba(123,79,206,0.4)' }}
      >
        🏆
      </div>

      <h1
        className="text-5xl font-extrabold tracking-tight mb-4 font-display"
        style={{
          background: 'linear-gradient(135deg, #7b4fce, #00c8ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Module 2 Complete!
      </h1>

      <p className="text-2xl pb-4 mb-6 font-medium" style={{ color: 'var(--text-secondary)' }}>
        New Tier Unlocked:{' '}
        <span className="font-bold" style={{ color: 'var(--neon-cyan)' }}>Digital Strategist</span>
      </p>

      <p className="text-lg mb-8 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        You&apos;ve proven you understand how to use technology as a force multiplier for your growth — not a distraction from it.
        You stop being someone pulled around by technology, and start becoming someone who knows how to use power without being used by it.
      </p>

      {/* What You Unlocked */}
      <div
        className="mb-10 p-6 rounded-xl text-left max-w-md w-full"
        style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(0,200,255,0.2)' }}
      >
        <p className="text-[#00c8ff] font-bold uppercase tracking-widest text-xs mb-4">What You Unlock</p>
        <ul className="space-y-2">
          {unlocks.map(item => (
            <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#cbd5e1' }}>
              <span style={{ color: 'var(--neon-green)' }}>✓</span> {item}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/student/home"
        className="px-8 py-4 rounded-lg font-bold text-lg transition-opacity hover:opacity-90 shadow-lg"
        style={{ background: '#fff', color: '#0a0f1e' }}
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
