import React from 'react';
import Link from 'next/link';

export default function ParentModule2Page() {
  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-4 text-sm text-muted-foreground uppercase tracking-wider">Parent View · Module 2</div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Digital Smarts &amp; Human Responsibility</h1>
      <p className="text-muted-foreground mb-8">
        Your apprentice is working through 6 lessons on using AI and technology wisely — focusing on truth, attention, integrity, and responsibility.
      </p>

      <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">What Your Apprentice Is Learning</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2"><span className="text-primary">→</span> The Power Tool Principle — AI is a multiplier, not an answer machine</li>
          <li className="flex gap-2"><span className="text-primary">→</span> Truth, Trust, and Misinformation — How to apply the Truth Filter</li>
          <li className="flex gap-2"><span className="text-primary">→</span> Attention &amp; Algorithm Traps — Recognising and resisting digital distraction</li>
          <li className="flex gap-2"><span className="text-primary">→</span> Human Responsibility — The Highest Path Test for all tool use</li>
          <li className="flex gap-2"><span className="text-primary">→</span> Integrity &amp; Identity — Why cheating is an identity problem, not just a rule violation</li>
          <li className="flex gap-2"><span className="text-primary">→</span> Social Impact — Privacy, respect, and the Pause Before Share Rule</li>
        </ul>
      </section>

      <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Final Deliverables</h2>
        <p className="text-sm text-muted-foreground mb-3">Your apprentice will produce two proof artifacts to complete the module:</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2"><span className="text-primary">1.</span> <strong>Digital Warrior Code</strong> — Personal commitments for how they will use technology</li>
          <li className="flex gap-2"><span className="text-primary">2.</span> <strong>Highest Path Boundaries Plan</strong> — 3 specific real-life boundaries they commit to</li>
        </ul>
      </section>

      <div className="mt-8">
        <Link href="/parent/home" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Parent Dashboard
        </Link>
      </div>
    </div>
  );
}
