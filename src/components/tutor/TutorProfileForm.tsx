'use client';

import React from 'react';
import type { TutorDoctrineConfig } from '@/lib/tutor/types';
import { TEACHING_STYLES } from '@/lib/tutor/types';

interface TutorProfileFormProps {
  name: string;
  doctrineConfig: TutorDoctrineConfig;
  onChange: (updates: { name?: string; doctrine_config?: Partial<TutorDoctrineConfig> }) => void;
  disabled?: boolean;
}

/**
 * TutorProfileForm — Editable form for tutor name + doctrine configuration.
 * All fields disable when `disabled` is true (locked states).
 */
export default function TutorProfileForm({
  name,
  doctrineConfig,
  onChange,
  disabled = false,
}: TutorProfileFormProps) {
  const inputCls = `neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-[var(--text-primary)] text-xs font-mono outline-none transition-colors ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  const labelCls = 'block font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-1.5';

  return (
    <div className="space-y-5">
      {/* Tutor Name */}
      <div>
        <label className={labelCls}>Tutor Name</label>
        <input
          type="text"
          value={name}
          disabled={disabled}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g., AlgebraBot, ScienceCoach..."
          className={inputCls}
        />
      </div>

      {/* Purpose */}
      <div>
        <label className={labelCls}>Purpose</label>
        <textarea
          rows={3}
          value={doctrineConfig.purpose}
          disabled={disabled}
          onChange={(e) => onChange({ doctrine_config: { purpose: e.target.value } })}
          placeholder="What is this tutor's main purpose? e.g., Help me master algebra concepts..."
          className={inputCls + ' resize-none'}
        />
      </div>

      {/* Teaching Style */}
      <div>
        <label className={labelCls}>Teaching Style</label>
        <select
          value={doctrineConfig.teaching_style}
          disabled={disabled}
          onChange={(e) => onChange({ doctrine_config: { teaching_style: e.target.value } })}
          className={inputCls + ' appearance-none cursor-pointer'}
        >
          <option value="">— Select a teaching style —</option>
          {TEACHING_STYLES.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>

      {/* Explanation Preferences */}
      <div>
        <label className={labelCls}>Explanation Preferences</label>
        <textarea
          rows={3}
          value={doctrineConfig.explanation_preferences}
          disabled={disabled}
          onChange={(e) =>
            onChange({ doctrine_config: { explanation_preferences: e.target.value } })
          }
          placeholder="How should your tutor explain things? e.g., Use simple analogies, start with examples..."
          className={inputCls + ' resize-none'}
        />
      </div>

      {/* Subject Focus */}
      <div>
        <label className={labelCls}>Subject Focus</label>
        <input
          type="text"
          value={doctrineConfig.subject_focus}
          disabled={disabled}
          onChange={(e) => onChange({ doctrine_config: { subject_focus: e.target.value } })}
          placeholder="e.g., Mathematics, Science, History..."
          className={inputCls}
        />
      </div>
    </div>
  );
}
