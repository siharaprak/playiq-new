import React from 'react';

export default async function ParentModule1View() {
  // Fetch real data from supabase student_node_progress, assessment_submissions, and fingerprint_signals

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-5xl mx-auto">
      <header className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard • Module 1</h1>
        <p className="text-muted-foreground mt-2">Visibility into AI Learning Code mastery.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress & Scores */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Module Progress</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3"><span className="text-green-500">✓</span> Node 1: AI Strengths</li>
              <li className="flex items-center gap-3"><span className="text-green-500">✓</span> Node 2: AI Modes</li>
              <li className="flex items-center gap-3"><span className="text-muted-foreground">○</span> Node 3: Question Laddering</li>
              <li className="flex items-center gap-3"><span className="text-muted-foreground">○</span> Node 4: Verification Habit</li>
            </ul>
          </section>

          <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Module Quiz</h3>
              <p className="text-3xl font-bold text-primary">85%</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Boss Battle</h3>
              <p className="text-3xl font-bold text-amber-500">4/5</p>
            </div>
          </section>
          
          <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Artifact Links</h2>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-blue-500 hover:underline">📄 My AI Study Rules (Submitted)</a>
              <a href="#" className="text-muted-foreground">📄 AI Error Review Sheet (Pending)</a>
            </div>
          </section>
        </div>

        {/* Fingerprint Bullet Summaries */}
        <div className="space-y-6">
          <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm h-full">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Fingerprint Insights</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold">Explanation Preference</p>
                <p className="text-sm text-muted-foreground">Visual metaphors</p>
              </div>
              <div>
                <p className="text-sm font-bold">Mode Preference</p>
                <p className="text-sm text-muted-foreground">Socratic Coach</p>
              </div>
              <div>
                <p className="text-sm font-bold">Shortcut Tendency</p>
                <p className="text-sm text-muted-foreground">Low - Prefers step-by-step learning</p>
              </div>
              <div>
                <p className="text-sm font-bold">Integrity Snapshot</p>
                <p className="text-sm text-green-500 font-medium">Strong Verification Habit</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
