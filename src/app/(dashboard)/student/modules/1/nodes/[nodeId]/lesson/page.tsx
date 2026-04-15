import React from 'react';
import { enforceNodeGating } from '@/lib/gating';
import { advanceNodePhase } from '../../../actions';
import { module1Nodes } from '@/data/module1Content';

export default async function NodeLessonPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  await enforceNodeGating(nodeId, 'lesson');

  const lessonData = module1Nodes[nodeId];

  if (!lessonData) {
    return <div className="p-12 text-center text-red-500 font-mono">ERR: NODE_DATA_NOT_FOUND</div>;
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-muted-foreground uppercase tracking-wider">
        Node {nodeId} • Lesson Phase
      </div>
      
      <h1 className="text-4xl font-bold tracking-tight mb-8 text-[#00f2ff]">Concept Mastery</h1>
      
      <div className="prose dark:prose-invert max-w-none mb-12">
        <div className="space-y-8">
          <div className="bg-slate-900 border border-indigo-500/30 p-6 rounded-xl shadow-inner font-mono text-sm text-indigo-200">
             <p className="uppercase tracking-widest text-indigo-400 mb-2 font-bold">&gt; TRANSMISSION INCOMING: {lessonData.title}</p>
             {lessonData.bigIdea.map((para, i) => (
               <p key={i} className={i > 0 ? "mt-4" : ""}>{para}</p>
             ))}
          </div>
          
          {lessonData.sections.map((section, idx) => (
            <div key={idx} className="bg-slate-800/80 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm">
               {section.title && <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>}
               <ul className="list-disc pl-5 space-y-2 text-slate-300">
                 {section.content.map((item, i) => (
                   <li key={i}>{item}</li>
                 ))}
               </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-8 border-t border-slate-800 pt-8">
        <form action={async () => {
          'use server';
          await advanceNodePhase(nodeId, 'lesson');
        }}>
          <button 
            type="submit"
            className="btn-neon-filled w-full md:w-auto px-8 py-3 rounded-lg font-bold"
          >
            Begin Activity →
          </button>
        </form>
      </div>
    </div>
  );
}
