import type { NodeContent } from './module1Content';

export const module2Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    title: 'The Power Tool Principle',
    bigIdea: [
      'Technology is a multiplier.',
      'That means it makes things bigger. If you are focused, it can make you more effective. If you are distracted, it can make you more distracted. If you are curious, it can help you learn faster. If you are lazy, it can help you avoid effort and become weaker.',
      'AI is not automatically good or bad. It becomes powerful depending on how you use it.',
    ],
    sections: [
      {
        title: 'Think of AI like a power tool',
        content: [
          'A power tool can help you build something faster.',
          'But if you use it carelessly, it can damage the thing you are trying to build.',
          'In this case, the thing you are building is your mind.',
        ],
      },
      {
        title: 'The better question',
        content: [
          'The question is not just: "Can AI help me?"',
          'The better question is: "What is AI helping me become?"',
        ],
      },
      {
        title: 'Why this matters',
        content: [
          'AI and the internet give you access to more knowledge, more tools, and more leverage than almost any generation before you.',
          'But it also means you have more responsibility.',
          'If you use these tools carelessly, they can work against you. If you use them consciously, they can become a real superpower.',
        ],
      },
    ],
    activity: {
      title: 'Superpower or Superweapon?',
      instructions: [
        'For each example below, decide whether AI is being used like a Superpower or a Superweapon Against You.',
        'Write your answer and then explain your thinking in one sentence.',
        'Format: "Superpower — because..." or "Superweapon Against You — because..."',
      ],
      scenarios: [
        '"I use AI to explain difficult science ideas in simpler words."',
        '"I use AI to scroll through random image prompts for an hour instead of studying."',
        '"I use AI to quiz me before a test."',
        '"I use AI to write my full answer so I don\'t have to think."',
        '"I use AI to help me plan my homework."',
        '"I use AI to avoid effort every time school feels hard."',
      ],
      reflection: [
        'One way technology can become a superpower for me is:',
        'One way technology could become a superweapon against me is:',
      ],
    },
    miniCheck: [
      'What does it mean that technology is a multiplier?',
      'Why is AI not automatically good or bad?',
      'What is one sign that a tool is helping you become weaker instead of stronger?',
    ],
    teachBack:
      'Explain the Power Tool Principle to a younger student. Why does it matter how you use AI, not just whether you use it?',
  },

  '2': {
    id: '2',
    title: 'Truth, Trust, and Misinformation',
    bigIdea: [
      'Not everything that sounds smart is true.',
      'And not everything you see online deserves your trust.',
      'One of the most important skills in the modern world is learning how to tell the difference between what is true, what is misleading, what is incomplete, and what only sounds believable.',
      'Bad information spreads fast. And if you believe things too quickly, you stop thinking clearly.',
    ],
    sections: [
      {
        title: 'Why this matters',
        content: [
          'A lot of false information sounds polished.',
          'It may use big words, sound confident, look professional, or be repeated by a lot of people.',
          'But repetition is not proof. Confidence is not proof. A polished answer is not proof.',
          'Real thinkers do not just absorb information — they examine it.',
        ],
      },
      {
        title: 'The Truth Filter',
        content: [
          '1. Is this actually true? Or does it just sound smart?',
          '2. Where is this coming from? Is it based on something real, or just generated language?',
          '3. Can I compare it with another trusted source? Do my notes, textbook, or teacher materials agree?',
          '4. Is anything missing? Could this be partly true, but incomplete?',
        ],
      },
    ],
    activity: {
      title: 'Spot the Problem',
      instructions: [
        'For each statement below, choose: Reliable, Needs Checking, or Likely False.',
        'Write your answer and explain: "Reliable — because..." or "Needs Checking — because..."',
      ],
      scenarios: [
        '"Plants use sunlight to help make food."',
        '"The moon gives off its own light."',
        '"A paragraph is usually built around one main idea."',
        '"All metals are magnetic."',
        '"The internet always gives the fastest way to the truth."',
      ],
      reflection: [
        'Why do you think people believe false or weak information so easily sometimes? Write 2–4 sentences.',
      ],
    },
    miniCheck: [
      'Why is confidence not the same as truth?',
      'What are the 4 parts of the Truth Filter?',
      'Why is comparing information with another source important?',
    ],
    teachBack:
      'Teach someone the Truth Filter. Explain each of the 4 questions and why they matter.',
  },

  '3': {
    id: '3',
    title: 'Attention, Distraction, and Algorithm Traps',
    bigIdea: [
      'Your attention is valuable.',
      'A lot of apps, platforms, and content are designed to keep you watching, clicking, scrolling, and reacting.',
      'That means if you do not protect your attention, someone else will use it for their own goals.',
      'This is one of the biggest digital skills you can learn: knowing the difference between using technology on purpose and getting used by it.',
    ],
    sections: [
      {
        title: 'Rest vs Escape',
        content: [
          'Rest: You intentionally relax, reset, and recharge.',
          'Escape: You avoid what matters by disappearing into distraction.',
          'The internet can do both. The question is not "Am I online?" — the better question is "Am I using this on purpose?"',
        ],
      },
      {
        title: 'The Attention Check',
        content: [
          'Why did I open this?',
          'Is this helping me or pulling me away?',
          'Am I creating, learning, or just consuming?',
          'Will I feel stronger or weaker after this?',
          'If you ask these questions often, you become much harder to distract.',
        ],
      },
    ],
    activity: {
      title: 'Trap Audit',
      instructions: [
        'Write down 3 attention traps that pull you off track.',
        'Use this format for each trap:',
        'Trap [#]: [name] | Why it gets me: [reason] | One boundary I can use: [boundary]',
        'Example — Trap 1: Short videos | Why it gets me: They are easy to keep watching without thinking | One boundary I can use: Set a timer before opening the app',
      ],
      scenarios: [
        'Trap 1: [describe an attention trap that distracts you]',
        'Trap 2: [describe a second attention trap]',
        'Trap 3: [describe a third attention trap]',
      ],
    },
    miniCheck: [
      'What is the difference between rest and escape?',
      'Why is your attention valuable?',
      'What is one attention boundary you want to start using?',
    ],
    teachBack:
      'Explain the difference between rest and escape, and describe one attention trap from your own life.',
  },

  '4': {
    id: '4',
    title: 'Human Responsibility and the Highest Path',
    bigIdea: [
      'You are responsible for what you do with power.',
      'That includes your time, your attention, your words, your tools, and your choices.',
      'AI and the internet can help you become stronger, smarter, and more capable.',
      'But they can also help you become more distracted, less disciplined, and more dependent.',
      'That is why we use the Highest Path Test.',
    ],
    sections: [
      {
        title: 'The Highest Path Test',
        content: [
          '1. Does this make me stronger or weaker?',
          '2. Does this build my future or steal from it?',
          '3. Is this true, or do I just want it to be true?',
          '4. Would I be proud if someone I respect saw this choice?',
          '5. Am I using this to create… or to escape?',
        ],
      },
      {
        title: 'Why this matters',
        content: [
          'A lot of bad choices feel easy in the moment.',
          'That\'s why people copy things they didn\'t learn, believe things they didn\'t check, waste time they meant to use well, and let technology train their habits instead of choosing them.',
          'The highest path is not always the easiest choice. But it is the one that makes you stronger over time.',
        ],
      },
    ],
    activity: {
      title: 'Highest Path Scenarios',
      instructions: [
        'For each situation below, decide which choice is the highest path.',
        'Write: Which option is the highest path and why.',
        'Example — Situation: You have an essay due tomorrow. A: Ask AI to write the whole thing. B: Ask AI to help you organize your ideas and then write it yourself. → B is the highest path because it helps me learn and still do the work myself.',
      ],
      scenarios: [
        'You are confused about a history topic. A: Copy an AI answer and move on. B: Ask AI to explain it simply, then quiz you.',
        'You are tired and don\'t want to study. A: Scroll videos for an hour. B: Do one 10-minute mission first, then decide what to do next.',
        'You want to impress your teacher. A: Turn in polished AI writing you don\'t understand. B: Learn the idea well, then write it in your own words.',
        'You find a confident online claim. A: Believe it because it sounds smart. B: Check whether it is true first.',
      ],
      reflection: [
        'Which of the 5 Highest Path Test questions would help you most right now? Explain why in 2–3 sentences.',
      ],
    },
    miniCheck: [
      'What is the Highest Path Test?',
      'Why is the highest path not always the easiest path?',
      'Which Highest Path question do you think would help you most right now, and why?',
    ],
    teachBack:
      'Explain the Highest Path Test. Choose 2 of the 5 questions and explain what they mean in your own words.',
  },

  '5': {
    id: '5',
    title: 'Integrity and Identity',
    bigIdea: [
      'Every time you use AI, you are building a habit.',
      'And habits shape identity.',
      'That means every time you choose effort over shortcut, learning over copying, truth over convenience, or growth over escape — you are becoming a stronger kind of person.',
      'But every time you choose shortcuts that replace your thinking, you are training the opposite identity.',
    ],
    sections: [
      {
        title: 'Cheating is an identity problem',
        content: [
          'Cheating is not just a rule problem. It is an identity problem.',
          'If AI does the work and you pretend it is yours: your confidence becomes fake, your skill stays weak, your future depends on hiding what you can\'t actually do.',
          'That is a dangerous way to live.',
          'Real confidence comes from earned skill.',
        ],
      },
      {
        title: 'The PlayIQ principle',
        content: [
          '"AI can coach me, but I earn the skill."',
          'This is why PlayIQ is built around this idea.',
          'Using AI to understand is coaching. Using AI to replace your thinking is cheating yourself.',
        ],
      },
    ],
    activity: {
      title: 'Coach or Cheat?',
      instructions: [
        'For each example below, decide whether it is: Coach, Cheat, or Borderline / Needs Caution.',
        'Write your answer and explain: "Coach — because..." or "Cheat — because..."',
      ],
      scenarios: [
        '"I ask AI to write my paragraph and I turn it in."',
        '"I ask AI to give me a hint and then I finish the problem."',
        '"I ask AI to make me practice questions."',
        '"I copy an AI answer because I don\'t want to think."',
        '"I ask AI to help me organize my notes before I study."',
      ],
      reflection: [
        'I want to become the kind of student who...',
        'One shortcut I want to stop using is...',
        'One stronger habit I want to build is...',
      ],
    },
    miniCheck: [
      'Why is cheating an identity problem, not just a school problem?',
      'What does "AI can coach me, but I earn the skill" mean?',
      'What kind of student do you want to become?',
    ],
    teachBack:
      'Explain why cheating yourself is different from just breaking a rule. What does it do to your identity over time?',
  },

  '6': {
    id: '6',
    title: 'Social Impact: Privacy, Respect, and Digital Power',
    bigIdea: [
      'What you do online affects other people.',
      'Technology is not just about what helps you. It is also about what kind of impact you create.',
      'That means part of being smart with technology is learning to use it with respect, caution, responsibility, and self-control.',
    ],
    sections: [
      {
        title: 'Why this matters',
        content: [
          'Today, it is easy to share something too quickly, pass along misinformation, use someone else\'s image or words badly, invade privacy, or hurt people without fully thinking about the consequences.',
          'Being digitally smart means slowing down enough to ask: "Is this helpful, true, respectful, and responsible?"',
        ],
      },
      {
        title: 'The Pause Before Share Rule',
        content: [
          '1. Is it true?',
          '2. Is it respectful?',
          '3. Do I have the right to use or share it?',
          '4. Could this hurt someone if I\'m wrong?',
        ],
      },
    ],
    activity: {
      title: 'Pause Before Share',
      instructions: [
        'For each situation below, decide the smartest action.',
        'Write: Best action and Why.',
        'Example — Situation: You see a shocking fact in a comment section. Best action: Don\'t share it yet. Why: I should check if it\'s true first.',
      ],
      scenarios: [
        'A friend sends you a fake-looking image and says, "Post this, it\'s hilarious."',
        'You find an AI-generated paragraph online and want to use it in your work.',
        'You read an exciting fact that matches what you already believe.',
        'You want to repost something but you are not sure it is true.',
      ],
      reflection: [
        'Why does digital power come with responsibility? Write 2–3 sentences in your own words.',
      ],
    },
    miniCheck: [
      'Why does digital power come with responsibility?',
      'What is the Pause Before Share Rule?',
      'Why should privacy and respect matter online?',
    ],
    teachBack:
      'Explain the Pause Before Share Rule to someone who has never heard of it. Why does it matter?',
  },
};
