'use client';

import React from 'react';
import type { LearningBlueprintData } from '@/lib/assessment/assessment-reveal';

interface LearningBlueprintProps {
  blueprint: LearningBlueprintData;
  studentName: string;
}

/**
 * The Personal Learning Blueprint display card.
 * Shown at the end of Phase 5. This is the first artifact the apprentice owns.
 * Visible to parents from Day 1.
 */
export default function LearningBlueprint({ blueprint, studentName }: LearningBlueprintProps) {
  const rows = [
    { label: 'Explanation Style', value: blueprint.explanationStyleLabel, icon: '🧠' },
    { label: 'Primary Motivation', value: blueprint.primaryMotivationLabel, icon: '🎯' },
    { label: 'Current AI Use', value: blueprint.currentAIUseLabel, icon: '🤖' },
    { label: 'Rescue Target', value: blueprint.rescueTarget, icon: '🛟' },
    { label: 'Advance Target', value: blueprint.advanceTarget, icon: '🚀' },
    { label: 'Baseline PDI Score', value: blueprint.baselinePDI, icon: '📊' },
    { label: 'Your Goal', value: `"${blueprint.personalGoal}"`, icon: '💡' },
  ];

  return (
    <div className="assessment-blueprint-card">
      {/* Header */}
      <div className="assessment-blueprint-header">
        <div className="assessment-blueprint-orion-badge">Ω</div>
        <div>
          <h3 className="text-lg font-display font-bold tracking-wider" style={{ color: 'var(--text-primary)' }}>
            Your Learning Blueprint
          </h3>
          <p className="text-xs font-mono uppercase tracking-widest mt-0.5" style={{ color: 'var(--neon-cyan)' }}>
            Initial Profile — {studentName}
          </p>
        </div>
      </div>

      {/* Blueprint rows */}
      <div className="flex flex-col gap-0.5">
        {rows.map((row) => (
          <div key={row.label} className="assessment-blueprint-row">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base flex-shrink-0">{row.icon}</span>
              <span className="text-xs font-mono uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                {row.label}:
              </span>
            </div>
            <span className="text-sm font-semibold text-right" style={{ color: 'var(--neon-cyan-pale)' }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(0,200,255,0.15)' }}>
        <p className="text-xs text-center font-mono" style={{ color: 'var(--text-muted)' }}>
          &ldquo;This is your starting point. Orion is calibrated to you now.&rdquo;
        </p>
      </div>
    </div>
  );
}
