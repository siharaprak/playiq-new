import React from 'react';
import Link from 'next/link';

export default async function ModuleOverviewPage() {
  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Module 1: AI Learning Code</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Master the foundation of using AI as a coach, not a shortcut.
        </p>
      </header>

      <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm mb-8">
        <h2 className="text-2xl font-semibold mb-4">Skill Tree</h2>
        <div className="flex flex-col gap-4">
          <Link href="/student/modules/1/nodes/1/lesson" className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
            Node 1: What AI Is Good At vs Bad At
          </Link>
          <div className="p-4 border rounded-lg opacity-50 cursor-not-allowed">
            Node 2: Choosing the Right AI Mode (Locked)
          </div>
          <div className="p-4 border rounded-lg opacity-50 cursor-not-allowed">
            Node 3: Question Laddering (Locked)
          </div>
          <div className="p-4 border rounded-lg opacity-50 cursor-not-allowed">
            Node 4: Verification Habit (Locked)
          </div>
        </div>
      </section>

      <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Module Assessments</h2>
        <div className="flex flex-col gap-4">
          <div className="p-4 border rounded-lg opacity-50 cursor-not-allowed">
            Module Quiz (Requires 4 Nodes Mastered)
          </div>
          <div className="p-4 border rounded-lg opacity-50 cursor-not-allowed">
            Boss Battle (Requires Quiz 80%)
          </div>
          <div className="p-4 border rounded-lg opacity-50 cursor-not-allowed">
            Proof Artifacts (Requires Boss Battle)
          </div>
        </div>
      </section>
    </div>
  );
}
