'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LOCAL_FOLDER_NAME,
  PERSONAL_ASSISTANT_BUILDER_PROMPTS,
  PERSONAL_ASSISTANT_KIT_DOCS,
} from '@/lib/assistant/starter-kit';

interface Module12AssistantKitPanelProps {
  moduleNum: number;
}

export default function Module12AssistantKitPanel({ moduleNum }: Module12AssistantKitPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>('prompt-1-discovery');
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  const builderHref =
    moduleNum === 12 ? '/student/modules/12/assistant-builder' : '/student/modules/11/assistant-builder';

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      setCopiedId(null);
    }
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="personal-assistant-kit"
      className="p-6 rounded-xl border mb-8 space-y-6 scroll-mt-24"
      style={{ background: 'rgba(13, 22, 38, 0.94)', borderColor: 'rgba(0, 200, 255, 0.5)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-mono uppercase tracking-widest text-[#39ff14] font-bold">
            Module {moduleNum} • Plug-and-Play Personal AI Assistant + Local Drive Memory Builder
          </p>
          <h2 className="text-2xl font-bold font-display text-white">
            {moduleNum === 12
              ? 'Copy-Paste These 5 Builder Prompts to Build Your Personal Assistant & Local Memory Vault'
              : 'Personal AI Assistant Starter Kit & Local Memory Blueprint'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A great Personal Assistant needs two things: it must <strong>learn how you work through Discovery</strong>,
            and it needs <strong>structured memory files stored on your own local drive</strong> (zero GitHub or coding
            required). Copy-paste <strong>Prompts 1 → 5</strong> below in order inside one private chat in your
            parent-approved AI (ChatGPT, Claude, or Gemini)—each prompt interviews you or compiles one exact{' '}
            <code className="text-[#00c8ff]">.md</code> file for your computer&apos;s{' '}
            <code className="text-[#39ff14]">{LOCAL_FOLDER_NAME}/</code> folder without letting the AI water down its
            own instructions.
          </p>
        </div>

        <Link
          href={builderHref}
          className="px-5 py-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-90 shrink-0"
          style={{ background: 'linear-gradient(135deg, #00c8ff, #7b4fce)', color: '#fff' }}
        >
          Open PlayIQ Assistant Studio →
        </Link>
      </div>

      {/* Step 0: Plain Local Folder Blueprint */}
      <div
        className="p-4 rounded-lg border space-y-3 text-xs text-slate-200"
        style={{ background: 'rgba(57, 255, 20, 0.06)', borderColor: 'rgba(57, 255, 20, 0.35)' }}
      >
        <p className="font-mono uppercase tracking-wider text-[#39ff14] font-bold">
          Step 0 (30 Seconds) — Create One Plain Folder on Your Computer: Documents/{LOCAL_FOLDER_NAME}/
        </p>
        <p className="text-slate-300 leading-relaxed">
          Create a regular folder named <code className="text-[#39ff14]">{LOCAL_FOLDER_NAME}</code> in your{' '}
          <strong>Documents</strong> or <strong>Desktop</strong> folder (keep it completely separate from your Module 00
          PlayIQ Tutor files). As you paste Prompts 1–5 into your AI, save each Markdown output block as a plain{' '}
          <code>.md</code> (or <code>.txt</code>) file inside that folder:
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 font-mono text-[11px]">
          <div className="p-2.5 rounded bg-black/50 border border-slate-800">
            <div className="text-[#00c8ff] font-bold">00_MY_COMPASS.md</div>
            <div className="text-slate-400 text-[10px]">1-page Top 3 priorities &amp; file router</div>
          </div>
          <div className="p-2.5 rounded bg-black/50 border border-slate-800">
            <div className="text-[#00c8ff] font-bold">01_ABOUT_ME_AND_HOW_I_WORK.md</div>
            <div className="text-slate-400 text-[10px]">Built from 8 one-at-a-time discovery Qs</div>
          </div>
          <div className="p-2.5 rounded bg-black/50 border border-slate-800">
            <div className="text-[#00c8ff] font-bold">02_ACTIVE_GOALS_AND_ROUTINES.md</div>
            <div className="text-slate-400 text-[10px]">Modular project &amp; routine cards</div>
          </div>
          <div className="p-2.5 rounded bg-black/50 border border-slate-800">
            <div className="text-[#00c8ff] font-bold">03_LONG_TERM_MEMORY_VAULT.md</div>
            <div className="text-slate-400 text-[10px]">Trust-tagged facts ([CONFIRMED] / [TRYING_OUT])</div>
          </div>
          <div className="p-2.5 rounded bg-black/50 border border-slate-800">
            <div className="text-[#00c8ff] font-bold">04_SESSION_HANDOFF_LOG.md</div>
            <div className="text-slate-400 text-[10px]">5-bullet /closeout log (&quot;Text &gt; Brain&quot;)</div>
          </div>
          <div className="p-2.5 rounded bg-black/50 border border-[#39ff14]/40">
            <div className="text-[#39ff14] font-bold">00_MASTER_ASSISTANT_INSTRUCTIONS.md</div>
            <div className="text-slate-400 text-[10px]">Locked 8-section operating brain</div>
          </div>
        </div>
      </div>

      {/* The 5 Sequential Copy-Paste Builder Prompts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[#00c8ff] font-bold">
            Part A — Copy-Paste Prompts 1 → 5 Into One AI Chat (In Exact Order)
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            1 Prompt = 1 Local Memory File • Locked Anti-Weak-AI Spine
          </span>
        </div>

        <div className="space-y-3">
          {PERSONAL_ASSISTANT_BUILDER_PROMPTS.map((item) => {
            const isExpanded = expandedPromptId === item.id;
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-700/90 bg-slate-950/85 space-y-3"
              >
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-[#00c8ff]/15 border border-[#00c8ff]/40 text-[#00c8ff] font-mono text-[10px] font-bold uppercase">
                        Step {item.stepNumber} of 5
                      </span>
                      <span className="text-sm font-bold text-white font-display">{item.title}</span>
                    </div>
                    <div className="text-[11px] font-mono text-[#39ff14]">
                      Builds local file: <span className="text-slate-200">{item.outputFilename}</span>
                    </div>
                    <p className="text-xs text-slate-300">{item.purpose}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      How to use: {item.saveInstruction}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => void handleCopy(item.id, item.promptText)}
                      className="px-4 py-2 rounded-lg border border-[#00c8ff] bg-[#00c8ff]/10 text-[#00c8ff] hover:bg-[#00c8ff]/20 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {isCopied ? '✓ Prompt Copied!' : `Copy Prompt #${item.stepNumber}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedPromptId(isExpanded ? null : item.id)}
                      className="px-3 py-2 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-500 font-mono text-xs cursor-pointer"
                    >
                      {isExpanded ? 'Hide Prompt ▲' : 'Inspect Prompt ▼'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <pre className="p-4 rounded-lg bg-black/80 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed">
                    {item.promptText}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Installation & 4-Test Verification Procedure */}
      <div
        className="p-4 rounded-lg border space-y-2.5 text-xs text-slate-200"
        style={{ background: 'rgba(123, 79, 206, 0.12)', borderColor: 'rgba(123, 79, 206, 0.45)' }}
      >
        <p className="font-mono uppercase tracking-wider text-[#c4b5fd] font-bold">
          Part B — Install Your 5 Local Files &amp; Run the 4 Verification Checks
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
          <li>
            <strong>Install in Your External AI (&quot;My Personal Assistant&quot; Project / Gem / GPT):</strong> Create
            a separate private Project (never inside your Module 00 Tutor). Paste{' '}
            <code className="text-[#39ff14]">00_MASTER_ASSISTANT_INSTRUCTIONS.md</code> into{' '}
            <strong>Project / System Instructions</strong>, and upload{' '}
            <code className="text-[#00c8ff]">00_MY_COMPASS.md</code> + Files <code>01–04</code> into{' '}
            <strong>Knowledge / Project Files</strong>.
          </li>
          <li>
            <strong>Mirror in PlayIQ&apos;s Built-In Assistant Builder Studio:</strong> Open{' '}
            <Link href={builderHref} className="text-[#00c8ff] underline">
              Assistant Builder Studio
            </Link>
            : save Tab 1 Persona -&gt; paste your customized{' '}
            <code className="text-[#39ff14]">00_MASTER_ASSISTANT_INSTRUCTIONS.md</code> in Tab 2 + upload your local{' '}
            <code>.md</code> files (or Starter Files B–D below) under <strong>Knowledge Files</strong> -&gt; click{' '}
            <strong>Publish Version Snapshot</strong>.
          </li>
          <li>
            <strong>Run All 4 Verification Checks (Tab 3 Sandbox + External Project):</strong> Test (1){' '}
            <strong>Normal Request</strong> (<code>/capture</code> or <code>/plan</code>), (2){' '}
            <strong>Missing Detail</strong> (confirm it asks 1–2 clarifying questions), (3){' '}
            <strong>Boundary Refusal</strong> (confirm it refuses homework shortcuts), (4){' '}
            <strong>Fresh-Chat Memory &amp; Reminder Reality Check</strong> (open a brand-new chat and confirm it
            remembers your priorities from <code>00_MY_COMPASS.md</code> + knows chat text ≠ a real phone alarm).
          </li>
          <li>
            <strong>Keep Your Local Memory Alive:</strong> End important chats with <code className="text-[#39ff14]">/closeout</code>,
            save the 5-bullet handoff into <code className="text-[#00c8ff]">04_SESSION_HANDOFF_LOG.md</code> on your
            local drive, and tighten one rule in Snapshot <code>v2</code> if any test scored below <code>3/3</code>.
          </li>
        </ol>
      </div>

      {/* Ready-to-Download Starter Templates & Verification Files */}
      <div className="space-y-3">
        <h3 className="text-sm font-mono uppercase tracking-widest text-[#c4b5fd] font-bold">
          Part C — Ready-to-Download Starter Templates &amp; Reference Knowledge Files (.md)
        </h3>
        <div className="space-y-3">
          {PERSONAL_ASSISTANT_KIT_DOCS.map((doc) => {
            const isExpanded = expandedDocId === doc.id;
            const isCopied = copiedId === doc.id;
            return (
              <div
                key={doc.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-3"
              >
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="space-y-1 max-w-xl">
                    <div className="text-sm font-bold text-white font-display">{doc.title}</div>
                    <div className="text-[11px] font-mono text-[#00c8ff]">
                      Install in: <span className="text-slate-300">{doc.installTarget}</span>
                    </div>
                    <p className="text-xs text-slate-400">{doc.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void handleCopy(doc.id, doc.content)}
                      className="px-3 py-1.5 rounded-lg border border-[#00c8ff] text-[#00c8ff] hover:bg-[#00c8ff]/15 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {isCopied ? '✓ Copied' : 'Copy Text'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(doc.filename, doc.content)}
                      className="px-3 py-1.5 rounded-lg border border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14]/15 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      ⬇ Download {doc.filename}
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-500 font-mono text-xs cursor-pointer"
                    >
                      {isExpanded ? 'Hide ▲' : 'Preview ▼'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <pre className="p-4 rounded-lg bg-black/70 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
                    {doc.content}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
