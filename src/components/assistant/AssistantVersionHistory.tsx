'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { AssistantVersion } from '@/lib/assistant/types';

interface AssistantVersionHistoryProps {
  versions: AssistantVersion[];
  currentVersionId: string | null;
}

/**
 * AssistantVersionHistory — Compact list of assistant versions (newest first).
 */
export default function AssistantVersionHistory({
  versions,
  currentVersionId,
}: AssistantVersionHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sort newest first by version_number descending
  const sorted = [...versions].sort((a, b) => b.version_number - a.version_number);

  if (sorted.length === 0) {
    return (
      <div className="border border-dashed border-slate-800 rounded-lg p-6 text-center">
        <p className="font-mono text-xs text-slate-500">
          No versions created yet.
        </p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-2">
      {sorted.map((version) => {
        const isCurrent = version.id === currentVersionId;
        const isExpanded = expandedId === version.id;

        return (
          <div
            key={version.id}
            className={`border rounded-lg transition-colors ${
              isCurrent
                ? 'border-[#00c8ff]/40 bg-[#00c8ff]/5'
                : 'border-slate-800 bg-black/30 hover:border-slate-700'
            }`}
          >
            {/* Header Row */}
            <button
              type="button"
              onClick={() => toggleExpand(version.id)}
              className="w-full flex items-center gap-3 p-3 text-left"
            >
              <span className="flex-shrink-0 text-slate-500">
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>

              <span
                className={`flex-shrink-0 px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${
                  isCurrent
                    ? 'bg-[#00c8ff]/20 text-[#00c8ff]'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                v{version.version_number}
              </span>

              <span className="flex-1 font-mono text-xs text-slate-300 truncate">
                {version.change_summary || 'No summary provided'}
              </span>

              {isCurrent && (
                <span className="flex-shrink-0 px-2 py-0.5 rounded bg-[#00c8ff]/20 text-[#00c8ff] font-mono text-[9px] font-bold uppercase tracking-widest">
                  Current
                </span>
              )}

              <span className="flex-shrink-0 font-mono text-[10px] text-slate-600">
                {formatRelativeTime(version.created_at)}
              </span>
            </button>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="px-4 pb-4 pt-1 border-t border-slate-800/50 space-y-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                    System Prompt Preview
                  </p>
                  <p className="font-mono text-xs text-slate-400 leading-relaxed bg-black/40 rounded p-3 border border-slate-800/50 line-clamp-4 whitespace-pre-wrap">
                    {version.system_prompt || '(empty)'}
                  </p>
                </div>

                <div className="flex items-center gap-4 font-mono text-[10px] text-slate-500">
                  <span>
                    Knowledge Files: {version.tools_config?.knowledge_file_ids?.length ?? 0}
                  </span>
                  <span>
                    Created: {new Date(version.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Utility: relative time formatting ───────────────────────────────
function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return 'just now';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;

  const diffMon = Math.floor(diffDay / 30);
  if (diffMon < 12) return `${diffMon}mo ago`;

  return `${Math.floor(diffMon / 12)}y ago`;
}
