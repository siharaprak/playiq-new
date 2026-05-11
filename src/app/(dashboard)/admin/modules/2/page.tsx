import React from 'react';
import Link from 'next/link';

const MODULE_NODES = [
  { id: '1', title: 'The Power Tool Principle' },
  { id: '2', title: 'Truth, Trust, and Misinformation' },
  { id: '3', title: 'Attention, Distraction, and Algorithm Traps' },
  { id: '4', title: 'Human Responsibility and the Highest Path' },
  { id: '5', title: 'Integrity and Identity' },
  { id: '6', title: 'Social Impact: Privacy, Respect, and Digital Power' },
];

export default function AdminModule2Page() {
  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-4 text-sm text-muted-foreground uppercase tracking-wider">Admin · Module 2</div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Digital Smarts &amp; Human Responsibility</h1>
      <p className="text-muted-foreground mb-8">Skill Tree: Highest Path · 6 Nodes</p>

      <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Node Overview</h2>
        <div className="flex flex-col gap-3">
          {MODULE_NODES.map(node => (
            <div key={node.id} className="p-4 border rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium">Node {node.id}: {node.title}</span>
              <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">6 lessons</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Module Assessments</h2>
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <div className="p-3 border rounded-lg">Module Quiz — 12 questions (Parts A–D)</div>
          <div className="p-3 border rounded-lg">Boss Battle — 6-scenario Superpower vs Superweapon Challenge</div>
          <div className="p-3 border rounded-lg">Proof Artifacts — Digital Warrior Code + Highest Path Boundaries Plan</div>
        </div>
      </section>

      <div className="mt-8">
        <Link href="/admin/home" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
}
