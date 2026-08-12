import React from 'react';

type ModuleOpeningHookProps = {
  moduleNumber: number;
  title: string;
};

type HookCopy = {
  questions: string[];
  promise: string;
  unlock: string;
};

const HOOK_COPY: Record<number, HookCopy> = {
  1: {
    questions: [
      'What if the idea in your head could become real?',
      'What if you could learn to speak to a new creative world?',
      'What if your imagination became a tool you could use on purpose?',
    ],
    promise: 'You already have the wishes. This module teaches you the first rules for speaking to the Genie so your ideas can move toward reality.',
    unlock: 'Turn imagination into clearer instructions, stronger questions, and better possibilities.',
  },
  2: {
    questions: [
      'What if the tools around you could multiply your focus instead of stealing it?',
      'What if you could decide whether technology makes you stronger or weaker?',
      'What if digital power came with a way to stay in control?',
    ],
    promise: 'The Genie is powerful, but your choices decide what your wishes become.',
    unlock: 'Use digital power with judgment, responsibility, and a positive direction.',
  },
  3: {
    questions: [
      'What if you could walk into class already knowing where the hard parts are?',
      'What if one good question could make a huge topic feel possible?',
      'What if the Genie could help you build a map before you begin?',
    ],
    promise: 'You will learn how to turn a confusing subject into a map your brain can actually use.',
    unlock: 'Start learning earlier, with less overwhelm and more control.',
  },
  4: {
    questions: [
      'What if getting stuck was a clue instead of a dead end?',
      'What if you could find the exact missing piece?',
      'What if the Genie could help you rescue a lesson without doing it for you?',
    ],
    promise: 'You will learn how to diagnose confusion and choose the next move that gets you unstuck.',
    unlock: 'Turn frustration into a specific problem you can solve.',
  },
  5: {
    questions: [
      'What if a hard idea could become clear without becoming fake?',
      'What if you could ask for the explanation that fits your brain?',
      'What if one concept could unlock three different ways to understand it?',
    ],
    promise: 'You will learn how to compress hard ideas into useful explanations while protecting the truth.',
    unlock: 'Make complexity easier to carry, remember, and explain.',
  },
  6: {
    questions: [
      'What if you could prove what you really remember?',
      'What if mistakes became directions instead of evidence that you are bad at something?',
      'What if the Genie could help you train the exact weakness you found?',
    ],
    promise: 'You will learn how to turn recall, mistakes, and correction into visible progress.',
    unlock: 'Build stronger memory and a personal system for getting better.',
  },
  7: {
    questions: [
      'What if your notes could become a tool that keeps helping you later?',
      'What if you could turn a messy page into a study system?',
      'What if the Genie could use your organized knowledge more effectively?',
    ],
    promise: 'You will learn how to make study materials that help you learn faster now and build better AI support later.',
    unlock: 'Turn information into reusable learning fuel.',
  },
  8: {
    questions: [
      'What if your ideas could sound as clear as they feel in your head?',
      'What if you could make an answer stronger without letting AI write it for you?',
      'What if better communication helped your ideas travel further?',
    ],
    promise: 'You will learn how to communicate your thinking so other people—and future tools—can understand it.',
    unlock: 'Make your ideas clearer, stronger, and easier to act on.',
  },
  9: {
    questions: [
      'What if you could build an AI tutor that learns how you learn?',
      'What if the Genie could become a coach instead of an answer machine?',
      'What if one person could design a learning partner that used to require a whole team?',
    ],
    promise: 'You will learn how to turn your learning preferences into a useful AI tutor with clear rules and knowledge.',
    unlock: 'Build a learning companion designed around your growth.',
  },
  10: {
    questions: [
      'What if you could turn one real problem into a working assistant?',
      'What if your imagination could help someone else save time and think better?',
      'What if you could design the first version of a tool that once required a whole team?',
    ],
    promise: 'You will learn how to turn an idea into a focused AI assistant with a real job and safe boundaries.',
    unlock: 'Move from using tools to designing tools that help people.',
  },
  11: {
    questions: [
      'Are you ready to prove what you can make with everything you have learned?',
      'What if your final project showed how far one focused imagination can go?',
      'What if the Genie was never the finish line—but the beginning of what you can build next?',
    ],
    promise: 'The Capstone is your Master Trial: combine your learning systems, AI tutor, assistant, proof, and teach-back into one demonstrated result.',
    unlock: 'Show that you can communicate, create, verify, and improve in the new AI world.',
  },
};

export default function ModuleOpeningHook({ moduleNumber, title }: ModuleOpeningHookProps) {
  const copy = HOOK_COPY[moduleNumber] ?? HOOK_COPY[1];

  return (
    <section
      aria-labelledby={`module-${moduleNumber}-opening-hook`}
      className="relative overflow-hidden rounded-2xl border border-[#7b4fce]/60 p-6 md:p-8 mb-8"
      style={{ background: 'linear-gradient(135deg, rgba(123,79,206,0.2), rgba(0,200,255,0.08))' }}
    >
      <div className="absolute -right-12 -top-12 text-8xl opacity-15" aria-hidden="true">🪄</div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00c8ff] mb-3">The Genie Is Out</p>
      <h2 id={`module-${moduleNumber}-opening-hook`} className="text-2xl md:text-3xl font-black font-display text-white mb-5">
        Before you begin {title}, ask yourself:
      </h2>
      <div className="space-y-2 mb-6 text-base md:text-lg font-semibold text-slate-100">
        {copy.questions.map((question) => <p key={question}>“{question}”</p>)}
      </div>
      <p className="text-sm md:text-base leading-relaxed text-slate-200 mb-4">{copy.promise}</p>
      <p className="text-sm font-bold text-[#39ff14]">By the end of this module, you unlock: {copy.unlock}</p>
    </section>
  );
}
