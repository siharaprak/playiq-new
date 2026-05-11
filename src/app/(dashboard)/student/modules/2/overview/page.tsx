import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';

const MODULE_NODES = [
  { id: '1', title: 'The Power Tool Principle' },
  { id: '2', title: 'Truth, Trust, and Misinformation' },
  { id: '3', title: 'Attention, Distraction, and Algorithm Traps' },
  { id: '4', title: 'Human Responsibility and the Highest Path' },
  { id: '5', title: 'Integrity and Identity' },
  { id: '6', title: 'Social Impact: Privacy, Respect, and Digital Power' },
];

export default async function Module2OverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch mastered nodes for this module
  const { data: progressData } = await supabase
    .from('student_node_progress')
    .select('node_id, node_mastered')
    .eq('student_id', user.id)
    .eq('module_id', MODULES.MODULE_2_ID);

  const masteredNodeIds = new Set(
    progressData?.filter(p => p.node_mastered).map(p => p.node_id) ?? []
  );

  // Find first unlocked node (first not mastered)
  const firstActiveNodeId = MODULE_NODES.find(n => !masteredNodeIds.has(n.id))?.id ?? '1';

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: '#00c8ff' }}>
        Module 2 • Skill Tree: Highest Path
      </div>

      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white font-display">
          Digital Smarts &amp; Human Responsibility
        </h1>
        <p className="text-lg mt-3 leading-relaxed" style={{ color: '#94a3b8' }}>
          AI and the internet are amplifiers. They can make you more focused, help you learn faster, and create better work — or, if used badly, distract you and turn you into a passive consumer. By the end of this module, you&apos;ll know how to use technology in a way that keeps you on your highest path.
        </p>
      </header>

      {/* What You'll Learn */}
      <section className="p-6 rounded-xl border mb-8" style={{ background: 'rgba(17,24,39,0.85)', borderColor: 'rgba(0,200,255,0.2)' }}>
        <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: '#00c8ff' }}>
          What You&apos;ll Learn
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm" style={{ color: '#94a3b8' }}>
          <div>
            <p className="font-bold mb-2" style={{ color: '#39ff14' }}>Used well, technology can help you:</p>
            <ul className="space-y-1 list-none">
              {['Become more focused', 'Learn faster', 'Create better work', 'Make smarter decisions'].map(item => (
                <li key={item} className="flex items-center gap-2"><span style={{ color: '#00c8ff' }}>✓</span> {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold mb-2" style={{ color: '#ff4444' }}>Used badly, it can:</p>
            <ul className="space-y-1 list-none">
              {['Distract you', 'Weaken your focus', 'Make you believe things too quickly', 'Turn you into a passive consumer'].map(item => (
                <li key={item} className="flex items-center gap-2"><span style={{ color: '#ff4444' }}>✗</span> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Skill Tree Nodes */}
      <section className="p-6 rounded-xl border mb-8" style={{ background: 'rgba(17,24,39,0.85)', borderColor: 'rgba(123,79,206,0.25)' }}>
        <h2 className="text-xl font-bold mb-6 uppercase tracking-wider" style={{ color: '#7b4fce' }}>
          Skill Tree
        </h2>
        <div className="flex flex-col gap-3">
          {MODULE_NODES.map((node, idx) => {
            const mastered = masteredNodeIds.has(node.id);
            const isNext = node.id === firstActiveNodeId && !mastered;
            const locked = !mastered && !isNext && idx > 0 && !masteredNodeIds.has(MODULE_NODES[idx - 1]?.id ?? '');

            if (mastered) {
              return (
                <div key={node.id} className="p-4 rounded-lg flex items-center gap-3" style={{ background: 'rgba(57,255,20,0.07)', border: '1px solid rgba(57,255,20,0.3)' }}>
                  <span style={{ color: '#39ff14' }}>✓</span>
                  <span className="text-sm font-mono" style={{ color: '#39ff14' }}>Node {node.id}: {node.title}</span>
                  <span className="ml-auto text-xs px-2 py-1 rounded" style={{ background: 'rgba(57,255,20,0.15)', color: '#39ff14' }}>MASTERED</span>
                </div>
              );
            }

            if (isNext || !locked) {
              return (
                <Link key={node.id} href={`/student/modules/2/nodes/${node.id}/lesson`}
                  className="p-4 rounded-lg flex items-center gap-3 transition-all group"
                  style={{ background: 'rgba(0,200,255,0.05)', border: '1px solid rgba(0,200,255,0.3)' }}>
                  <span style={{ color: '#00c8ff' }}>→</span>
                  <span className="text-sm font-mono text-white group-hover:text-[#00c8ff] transition-colors">Node {node.id}: {node.title}</span>
                  {isNext && <span className="ml-auto text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,200,255,0.15)', color: '#00c8ff' }}>START</span>}
                </Link>
              );
            }

            return (
              <div key={node.id} className="p-4 rounded-lg flex items-center gap-3 opacity-40 cursor-not-allowed" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: '#64748b' }}>🔒</span>
                <span className="text-sm font-mono" style={{ color: '#64748b' }}>Node {node.id}: {node.title} (Locked)</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Assessments */}
      <section className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.85)', borderColor: 'rgba(123,79,206,0.2)' }}>
        <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: '#7b4fce' }}>
          Module Assessments
        </h2>
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-lg opacity-50 cursor-not-allowed" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-sm font-mono" style={{ color: '#64748b' }}>Module Quiz — Requires 6 Nodes Mastered</span>
          </div>
          <div className="p-4 rounded-lg opacity-50 cursor-not-allowed" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-sm font-mono" style={{ color: '#64748b' }}>Boss Battle — Requires Quiz 80%+</span>
          </div>
          <div className="p-4 rounded-lg opacity-50 cursor-not-allowed" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-sm font-mono" style={{ color: '#64748b' }}>Proof Artifacts — Requires Boss Battle</span>
          </div>
        </div>
      </section>
    </div>
  );
}
