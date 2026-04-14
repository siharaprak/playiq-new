import React from 'react';
import Link from 'next/link';
import { enforceModuleGating } from '@/lib/gating';
import { submitQuiz } from '../actions';

export default async function ModuleQuizPage() {
  await enforceModuleGating('quiz');

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-4 text-sm text-red-500 font-semibold uppercase tracking-wider">
        Assessment Phase
      </div>
      
      <header className="mb-8 border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight mb-2">1Q AI Learning Code Quiz</h1>
        <p className="text-muted-foreground text-lg">
          Test your combined knowledge. You must score 80% or higher to unlock the Boss Battle.
        </p>
      </header>

      <div className="bg-card text-card-foreground p-8 rounded-xl border shadow-sm mb-12">
        <form action={submitQuiz} className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">1. Which AI mode should you use to brainstorm ideas without getting the final answer?</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <input type="radio" name="q1" value="a" required />
                <span>The Answer Engine Mode</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <input type="radio" name="q1" value="b" required />
                <span>The Socratic Coach Mode</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <input type="radio" name="q1" value="c" required />
                <span>The Editor Mode</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">2. What is the fundamental issue with relying entirely on an AI model for factual research?</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <input type="radio" name="q2" value="a" required />
                <span>It is too slow to generate responses.</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <input type="radio" name="q2" value="b" required />
                <span>It suffers from hallucination and overconfidence in incorrect data.</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <input type="radio" name="q2" value="c" required />
                <span>It requires formatting the questions perfectly to get any answer.</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">3. According to the Verification Habit, what must you do after receiving an output?</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <input type="radio" name="q3" value="a" required />
                <span>Cross-check crucial metrics and logic against your own understanding or external sources.</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <input type="radio" name="q3" value="b" required />
                <span>Copy it immediately if it sounds authoritative.</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <input type="radio" name="q3" value="c" required />
                <span>Ask the AI if it is sure about its answer.</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">4. What is 'Question Laddering'?</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <input type="radio" name="q4" value="a" required />
                <span>Using increasingly complex prompt architectures from external libraries.</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <input type="radio" name="q4" value="b" required />
                <span>Iteratively breaking down a massive problem into a sequence of smaller, specific questions.</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <input type="radio" name="q4" value="c" required />
                <span>Ranking different AI models to see which gives the best result.</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">5. If AI writes an essay for you and you submit it, you are functioning as a:</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <input type="radio" name="q5" value="a" required />
                <span>Synthesizer</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <input type="radio" name="q5" value="b" required />
                <span>Editor</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <input type="radio" name="q5" value="c" required />
                <span>Bystander (taking a shortcut)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 border-t pt-8">
            <Link 
              href="/student/modules/1/overview"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Map
            </Link>
            <button 
              type="submit"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Submit Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
