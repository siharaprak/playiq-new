import React from 'react';
import Link from 'next/link';
import { enforceNodeGating } from '@/lib/gating';
import type { NodeContent } from '@/data/module1Content';
import LessonContentRenderer from '@/components/modules/LessonContentRenderer';
import { NodeActivityForm } from '@/components/forms/NodeActivityForm';
import { NodeMiniCheckForm } from '@/components/forms/NodeMiniCheckForm';
import { TeachBackForm } from '@/components/forms/TeachBackForm';
import ModuleLearningRecordPanel from '@/components/modules/ModuleLearningRecordPanel';

export async function CourseNodeLessonView({
  moduleNum,
  nodeId,
  nodesRecord,
  advanceNodePhase,
}: {
  moduleNum: number;
  nodeId: string;
  nodesRecord: Record<string, NodeContent>;
  advanceNodePhase: (nodeId: string, phase: 'lesson' | 'activity' | 'mini-check') => Promise<void>;
}) {
  await enforceNodeGating(nodeId, 'lesson', moduleNum);
  const lessonData = nodesRecord[nodeId];

  if (!lessonData) {
    return <div className="p-12 pt-24 text-center text-red-500 font-mono">ERR: NODE_DATA_NOT_FOUND</div>;
  }

  return (
    <div className="flex flex-col min-h-screen px-6 pt-24 pb-12 max-w-3xl mx-auto">
      <Link
        href={`/student/modules/${moduleNum}/overview`}
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-8 transition-colors group"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="group-hover:text-[var(--neon-cyan)] transition-colors">Back to Module</span>
      </Link>

      <div className="mb-4 text-sm text-muted-foreground uppercase tracking-wider">
        Module {moduleNum} · Node {nodeId} · Lesson Phase
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-8 text-[#00c8ff]">Concept Mastery</h1>

      <div className="prose dark:prose-invert max-w-none mb-12">
        <div className="space-y-8">
          {lessonData.imageUrl && (
            <div className="overflow-hidden rounded-xl border border-slate-700/50 shadow-lg">
              <img
                src={lessonData.imageUrl}
                alt={lessonData.title}
                className="w-full h-auto object-cover max-h-[380px]"
              />
            </div>
          )}
          <div className="bg-slate-900 border border-[#00c8ff]/30 p-6 rounded-xl shadow-inner font-mono text-sm text-slate-200">
            <p className="uppercase tracking-widest text-[#00c8ff] mb-2 font-bold">
              &gt; TRANSMISSION INCOMING: {lessonData.title}
            </p>
            {lessonData.bigIdea.map((para, i) => (
              <p key={i} className={i > 0 ? 'mt-4' : ''}>
                {para}
              </p>
            ))}
          </div>

          <LessonContentRenderer sections={lessonData.sections} />
        </div>
      </div>

      <div className="flex justify-end mt-8 border-t border-slate-800 pt-8">
        <form
          action={async () => {
            'use server';
            await advanceNodePhase(nodeId, 'lesson');
          }}
        >
          <button
            type="submit"
            className="btn-neon-filled w-full md:w-auto px-8 py-3 rounded-lg font-bold cursor-pointer"
          >
            Begin Activity →
          </button>
        </form>
      </div>

      <ModuleLearningRecordPanel moduleNumber={moduleNum} showBlockerOnly={true} />
    </div>
  );
}

export async function CourseNodeActivityView({
  moduleNum,
  nodeId,
  nodesRecord,
  advanceNodePhase,
}: {
  moduleNum: number;
  nodeId: string;
  nodesRecord: Record<string, NodeContent>;
  advanceNodePhase: (nodeId: string, phase: 'lesson' | 'activity' | 'mini-check') => Promise<void>;
}) {
  await enforceNodeGating(nodeId, 'activity', moduleNum);
  const lessonData = nodesRecord[nodeId];

  if (!lessonData) {
    return <div className="p-12 pt-24 text-center text-red-500 font-mono">ERR: NODE_DATA_NOT_FOUND</div>;
  }

  return (
    <div className="flex flex-col min-h-screen px-6 pt-24 pb-12 max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider">
        Module {moduleNum} · Node {nodeId} · Application Phase
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-4 text-[var(--text-primary)] uppercase font-display">
        {lessonData.activity.title}
      </h1>

      <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50 mb-8 backdrop-blur-md">
        <h3 className="text-[#7b4fce] font-bold uppercase tracking-widest text-xs mb-3">MISSION BRIEFING</h3>
        <ul className="space-y-2 text-slate-300 text-sm">
          {lessonData.activity.instructions.map((inst, i) => (
            <li key={i}>{inst}</li>
          ))}
        </ul>
      </div>

      <NodeActivityForm
        nodeId={nodeId}
        moduleId={moduleNum}
        scenarios={lessonData.activity.scenarios}
        reflection={lessonData.activity.reflection}
        backLink={`/student/modules/${moduleNum}/nodes/${nodeId}/lesson`}
        submitAction={async () => {
          'use server';
          await advanceNodePhase(nodeId, 'activity');
        }}
      />

      <ModuleLearningRecordPanel moduleNumber={moduleNum} showBlockerOnly={true} />
    </div>
  );
}

export async function CourseNodeMiniCheckView({
  moduleNum,
  nodeId,
  nodesRecord,
  advanceNodePhase,
}: {
  moduleNum: number;
  nodeId: string;
  nodesRecord: Record<string, NodeContent>;
  advanceNodePhase: (nodeId: string, phase: 'lesson' | 'activity' | 'mini-check') => Promise<void>;
}) {
  await enforceNodeGating(nodeId, 'mini-check', moduleNum);
  const lessonData = nodesRecord[nodeId];

  if (!lessonData) {
    return <div className="p-12 pt-24 text-center text-red-500 font-mono">ERR: NODE_DATA_NOT_FOUND</div>;
  }

  return (
    <div className="flex flex-col min-h-screen px-6 pt-24 pb-12 max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider">
        Module {moduleNum} · Node {nodeId} · Check Phase
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-8 text-[var(--text-primary)] uppercase font-display">
        Mini-Check Validation
      </h1>

      <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 mb-12 backdrop-blur-md">
        <h2 className="text-[#7b4fce] font-bold uppercase tracking-widest text-xs mb-3">LESSON CHECK</h2>
        <p className="mb-8 text-slate-400 font-mono text-sm">
          Answer the following questions in 1–3 full sentences each to confirm your understanding.
        </p>

        <NodeMiniCheckForm
          nodeId={nodeId}
          moduleId={moduleNum}
          questions={lessonData.miniCheck}
          submitAction={async () => {
            'use server';
            await advanceNodePhase(nodeId, 'mini-check');
          }}
        />
      </div>

      <ModuleLearningRecordPanel moduleNumber={moduleNum} showBlockerOnly={true} />
    </div>
  );
}

export async function CourseNodeTeachBackView({
  moduleNum,
  nodeId,
  nodesRecord,
  submitTeachBackAction,
}: {
  moduleNum: number;
  nodeId: string;
  nodesRecord: Record<string, NodeContent>;
  submitTeachBackAction: (
    nodeId: string,
    prompt: string,
    prevState: unknown,
    formData: FormData
  ) => Promise<any>;
}) {
  await enforceNodeGating(nodeId, 'teach-back', moduleNum);
  const lessonData = nodesRecord[nodeId];
  const totalNodes = Object.keys(nodesRecord).length;
  const isFinalNode = nodeId === String(totalNodes);

  if (!lessonData) {
    return <div className="p-12 pt-24 text-center text-red-500 font-mono">ERR: NODE_DATA_NOT_FOUND</div>;
  }

  return (
    <div className="flex flex-col min-h-screen px-6 pt-24 pb-12 max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider">
        Module {moduleNum} · Node {nodeId} · Teach-Back Phase
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-8 text-[var(--text-primary)] uppercase font-display">
        Knowledge Extraction
      </h1>

      <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 mb-12 backdrop-blur-md">
        <h2 className="text-[#7b4fce] font-bold uppercase tracking-widest text-xs mb-3">
          FINAL GATING PROTOCOL
        </h2>
        <p className="mb-6 text-slate-300 font-mono text-sm leading-relaxed">
          To complete this node, you must prove cognitive ownership of the concept. Write your answer in full sentences.
        </p>

        <div className="bg-[#7b4fce]/10 p-6 border-l-4 border-[#00c8ff] rounded-r-lg mb-8">
          <p className="text-[var(--text-primary)] font-mono text-lg">&gt; &quot;{lessonData.teachBack}&quot;</p>
        </div>

        <TeachBackForm nodeId={nodeId} prompt={lessonData.teachBack} submitAction={submitTeachBackAction} />
      </div>

      {isFinalNode ? (
        <ModuleLearningRecordPanel
          moduleNumber={moduleNum}
          showChoices={false}
          showRecordForm={true}
          showBetaFeedback={false}
          title={`Module ${moduleNum} • Save Your Learning Answers & Tutor Project Checkpoint`}
        />
      ) : (
        <ModuleLearningRecordPanel moduleNumber={moduleNum} showBlockerOnly={true} />
      )}
    </div>
  );
}

export async function CourseNodeCompletionView({
  moduleNum,
  nodeId,
  nodesRecord,
}: {
  moduleNum: number;
  nodeId: string;
  nodesRecord: Record<string, NodeContent>;
}) {
  await enforceNodeGating(nodeId, 'completion', moduleNum);
  const totalNodes = Object.keys(nodesRecord).length;
  const isLastNode = nodeId === String(totalNodes);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 pt-24 pb-12 text-center">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6 text-4xl"
        style={{ background: 'rgba(57,255,20,0.15)', color: '#39ff14', border: '2px solid rgba(57,255,20,0.4)' }}
      >
        ✓
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-[var(--text-primary)]">
        Node {nodeId} Mastered!
      </h1>
      <p className="text-xl mb-8 max-w-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        You&apos;ve successfully mastered Node {nodeId} of Module {moduleNum}. Your Teach-Back was approved — you own this concept.
      </p>

      {isLastNode ? (
        <Link
          href={`/student/modules/${moduleNum}/quiz`}
          className="px-8 py-4 rounded-lg font-bold text-lg transition-opacity hover:opacity-90 shadow-lg"
          style={{ background: '#00c8ff', color: '#0a0f1e' }}
        >
          Proceed to Module {moduleNum} Quiz →
        </Link>
      ) : (
        <Link
          href={`/student/modules/${moduleNum}/overview`}
          className="px-8 py-4 rounded-lg font-bold text-lg transition-opacity hover:opacity-90 shadow-lg"
          style={{ background: '#7b4fce', color: '#fff' }}
        >
          Unlock Next Node →
        </Link>
      )}
    </div>
  );
}

