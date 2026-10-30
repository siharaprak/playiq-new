/** Repo-controlled digital adaptations of the questions in the complete course.
 * This registry does not score a learner or assert that any AI behavior passed.
 * Only stable question/option IDs are persisted; labels below make them readable.
 */
export type LessonChoiceOption = { id: string; label: string };
export type LessonActivity = {
  id: string;
  moduleNumber: number;
  anchor: string;
  question: string;
  options: LessonChoiceOption[];
  nextStep: string;
};
export type LessonChoices = Record<string, string>;

const follow = 'Write your reason or evidence in your workbook, then continue with the explanation below. A saved choice is not a passed Tutor test.';
function choice(moduleNumber: number, id: string, anchor: string, question: string, options: string[], nextStep = follow): LessonActivity {
  return { moduleNumber, id: `m${moduleNumber}-${id}`, anchor, question,
    options: options.map((label, index) => ({ id: String.fromCharCode(65 + index), label })), nextStep };
}
function classify(moduleNumber: number, prefix: string, situations: string[], options: string[]): LessonActivity[] {
  return situations.map((situation, index) => choice(moduleNumber, `${prefix}-${index + 1}`, situation, situation, options));
}
function quiz(moduleNumber: number, questions: [string, string, string][]): LessonActivity[] {
  return questions.map(([question, a, b], index) => choice(moduleNumber, `quiz-${index + 1}`, question, question, [a, b],
    'Compare your reasoning with the lesson’s answer key. Review any difference, then continue to the build or reflection. This is not a live AI test result.'));
}

export const LESSON_ACTIVITIES: LessonActivity[] = [
  choice(0, 'explanation', 'Your teacher just explained something complicated in class.', 'What is your honest first move when an explanation does not click?', [
    'Ask for a simpler version with a concrete, real-world example.',
    'Try to figure it out step-by-step on my own first.',
    'Look for a visual, diagram, video, or physical model.',
  ]),
  choice(0, 'pace', 'You are learning something brand new. Which pace feels better', 'Which pace would you like to try first?', [
    'Go slow and deep through each part.', 'See the big picture first, then fill in the details.',
  ]),
  choice(0, 'stuck', "You hit a brutal homework problem that you don't understand at all.", 'What is your real first reaction when you get stuck?', [
    'Push through and keep trying.', 'Ask for a quick hint or nudge.', 'Take a strategic break and return.',
  ]),
  choice(0, 'experience', 'Be completely real. When you use AI for school right now', 'How do you mostly use AI now?', [
    'Answer-seeking: direct answers to finish faster.', 'Explanation-seeking: break down confusing ideas.',
    'Beginner: I do not really use AI for school yet.', 'Power user: brainstorming, coding, writing, research, and other tasks.',
  ]),
  choice(0, 'motivation', 'What would actually make you want to study and build more', 'What would make you want to study and build more?', [
    'Mastery and competence.', 'A competitive edge.', 'Real-world creation.', 'Leveling up and recognition.',
  ]),
  choice(0, 'accuracy', 'Which explanation do you trust', 'Which seasons explanation do you trust more?', [
    'Explanation A: distance from the Sun creates the seasons.', 'Explanation B: Earth’s axial tilt changes sunlight angles and day length.',
  ], 'Explain your clue and verification step in the workbook. A choice here does not calculate a score or replace checking a source.'),
  choice(1, 'power', 'Circle your honest first reaction:', 'Choose your power: what is your honest first reaction?', [
    'Give me the direct answers so I can memorize them.',
    'Explain the three hardest ideas, then quiz me.',
    'Find where understanding broke, give hints, and fix that part.',
  ], 'Write why this appealed to you, then explore coaching versus outsourcing below. This is a starting reaction, not a grade.'),
  ...classify(1, 'use', [
    "Explain photosynthesis like I'm 12 using a factory analogy.",
    'Write my entire 5-paragraph history essay about the American Civil War.',
    'Give me 5 practice problems on multiplying fractions with unlike denominators, one at a time.',
    'Tell me the exact answers to questions 1 through 10 on my biology worksheet.',
    'Here is my attempted solution to this physics problem. Can you show me which step has the error without giving the final answer?',
    'Summarize this textbook page in three bullet points, then ask me two questions to test if I understood it.',
  ], ['Good Use — coaching', 'Risky Use — needs context or checking', 'Bad Use — replaces my thinking / work']),
  ...classify(1, 'mode', [
    'You have an AP Chemistry exam in 48 hours and want to know your blind spots.',
    "You have completed lines 1–4 of a geometry proof, but can't find line 5.",
    'You read a page on the French Revolution and have no clue what just happened.',
    'You have 4 hours of homework across 3 subjects and feel totally frozen.',
    'Your math teacher explained logarithms using pure theory and you need an analogy.',
  ], ['Explain Mode', 'Hint Mode', 'Quiz Mode', 'Coach Mode', 'Learn-My-Way Mode', 'Lesson Rescue Mode']),
  ...classify(1, 'verify', [
    'Photosynthesis is the process by which green plants convert light energy into chemical energy in chloroplasts.',
    'The American Civil War officially concluded in December 1992 with the Treaty of Paris.',
    'A fraction with a larger denominator is always smaller in value than a fraction with a smaller denominator.',
    'The speed of light in a vacuum is approximately 300,000 kilometers per second.',
    'Water boils at 100 degrees Celsius regardless of altitude or atmospheric pressure.',
  ], ['Looks Good', 'Needs Checking', 'Wrong']),
  ...classify(2, 'boundary', [
    "Hey Orion, I solved this math problem and got x = 7. The answer key says x = 12. Don't tell me the answer—tell me which algebraic step likely had the sign error.",
    'Write a persuasive conclusion paragraph about climate change for my biology paper.',
    'I wrote this thesis statement. Can you give me three reasons someone might disagree with it?',
    'Rewrite my history paragraph to make it sound like a college professor wrote it.',
    'Translate this Spanish paragraph into English so I can read it, then quiz me on the vocabulary words.',
  ], ['Coach', 'Crutch', 'Gray Zone — explain the permission/context needed']),
  choice(2, 'focus', 'Which sprint length felt most productive without triggering mental exhaustion?', 'Which focus sprint felt useful for this task?', [
    '5 minutes', '10 minutes', '15 minutes', 'Mixed / depends on the task', 'Not tested yet',
  ], 'Keep the actual focus observations in your record. Retest on another task; this is not a fixed attention limit.'),
  choice(3, 'arrival', 'My choice: [ Option A | Option B | Option C ]', 'Which arrival style makes you feel ready to explore?', [
    'Atlas Guide: a map and landmarks first.', 'Gameplay Trailer: a concrete example first.', 'Quest Log: an intriguing question first.',
  ], 'Write why, then compare all three approaches in the existing lab. Your first preference is a hypothesis, not a permanent learning type.'),
  ...classify(4, 'gap', [
    'I know every vocabulary word, but I cannot tell why event A caused event B.',
    'The teacher went from line 2 to line 3 and I cannot reproduce the move.',
    'I studied the topic, but I do not know what `compare and contrast` requires in the final answer.',
    'The whole page feels like ten things at once.',
  ], ['Word gap', 'Background gap', 'Step gap', 'Connection gap', 'Overload gap', 'Expectation gap']),
  choice(5, 'purpose', 'I need the compression for:', 'What is your main compression purpose today?', [
    'A first preview', 'A study review', 'Explaining it to someone else', 'Preparing for a question or assignment', 'Another purpose — describe it in the workbook',
  ], 'Name what must stay accurate for this purpose, then build the compression ladder using the same topic.'),
  ...classify(6, 'mistake', [
    'Maya knows the formula but changes the denominator when only the numerator should change.',
    "Leo says he remembers the chapter after rereading, but cannot name the chapter's central claim when the book is closed.",
    'Sam correctly solves the practice example but cannot use the same principle in a word problem.',
    'Noor understands the evidence but thinks `justify` means "give the answer" rather than "support it with reasons or evidence."',
  ], ['Knowledge gap', 'Word gap', 'Step error', 'Careless or attention error', 'Transfer error', 'Confidence error']),
  choice(6, 'quiz-format', 'Which format helped you notice and repair mistakes more clearly?', 'Which quiz format helped you notice and repair mistakes here?', [
    'One question at a time', 'Full set, then feedback', 'Mixed / not enough evidence', 'Not tested yet',
  ], 'Record the observed results and possible other causes. This setting stays testable and can change.'),
  choice(7, 'clean-file', 'Which version would be easier to study tomorrow?', 'Which saved version would be easier to study tomorrow?', [
    'The messy word dump', 'The source-aware, labeled notes',
  ], 'Write one reason, then use the eight-part Study Pack structure. Neat formatting alone does not prove a fact true.'),
  choice(8, 'support', 'Starting support', 'Which starting support would you like to test for this writing task?', [
    'Ask for my claim before discussing wording.', 'Help me make an Answer Map before drafting.', 'Let me draft first, then coach.',
    'Ask what kind of help I want before giving feedback.', 'Another — describe it in my workbook.',
  ]),
  choice(8, 'feedback', 'Feedback amount', 'Which feedback amount would you like to test?', [
    'One diagnostic question at a time.', 'Up to three suggestions at a time.', 'A CER checklist only.', 'A comparison of my own two drafts.',
  ], 'Use your writing comparison to explain this choice. Keep authorship and final wording with you.'),
  ...quiz(9, [
    ['Where do you build the Tutor?', 'In a second, brand-new Project.', 'In the same parent-approved Tutor Project from Module 00.'],
    ['What should Orion do with a missing assessment result?', 'Guess a likely answer.', 'Mark MISSING_INPUT or ask me, then wait for review.'],
    ['Are the six Tutor tests already passed when this module ends?', 'Yes, because the test log exists.', 'No. The log is prepared; the tests happen in Module 10.'],
  ]),
  choice(10, 'opening', 'What would make its first reply useful?', 'What would make the Tutor’s first reply useful?', [
    'Immediately give a long explanation.', 'Ask what I know and what I want to be able to do.',
  ]),
  ...quiz(10, [
    ['A test you did not run should be recorded as:', 'Passed, because the Tutor was designed carefully.', 'not_tested.'],
    ['If one Tutor behavior misses, what should you change first?', 'One related instruction, then repeat the same test.', 'Rewrite every file at once.'],
    ['Does liking a video prove that video always teaches every subject best?', 'Yes.', 'No. It is a preference to test against what I can explain or do.'],
  ]),
  choice(11, 'brief', 'Why does one of these give the assistant a clearer job?', 'Which request gives the assistant a clearer job?', [
    'Be my assistant and help with my life.', 'Help plan my art-project ideas, ask which to work on, and show three steps I choose from.',
  ]),
  ...quiz(11, [
    ['What tells an assistant how to behave?', 'Project Instructions.', 'A reference knowledge file alone.'],
    ['If you cannot describe the task clearly, what should you do first?', 'Ask discovery questions and map the current workflow.', 'Ask the AI to guess the whole design.'],
    ["Who reviews and decides whether the assistant's output is useful?", 'The student.', 'The assistant, without student checking.'],
  ]),
  choice(12, 'reminder', 'The correct choice is B.', 'Does a reminder written in chat prove a notification is scheduled?', [
    'Yes, writing the reminder is enough.', 'No, check a real scheduling feature, permissions, settings, and confirmation.',
  ]),
  ...quiz(12, [
    ['The assistant wrote a reminder in chat. What do you know for sure?', 'A notification is scheduled.', 'It wrote text; I must check any actual reminder feature.'],
    ['What should you do if a test misses?', 'Change one instruction and repeat the same test.', 'Assume the assistant will do better next time.'],
    ['Can the assistant organize notes without permanently remembering them?', 'Yes. Chat text and saved memory are different capabilities.', 'No. Anything in chat is remembered forever.'],
  ]),
  // Module 13 deliberately has no interactive question or required response.
  choice(14, 'dashboard-cue', 'Step 3 — Add one visual cue', 'Which visual cue will you use on your existing Learning Dashboard?', [
    'Highlight the next step in a bright color.', 'Arrows between topic, practice, and next action.', 'A bar chart, only with comparable numbers.', 'A not tried / practising / can show it status label.',
  ], 'Add the cue to the dashboard you already made. Do not invent scores or compare unrelated topics.'),
  ...quiz(14, [
    ['What is the final stage of the Exam & Performance System?', 'Review evidence and choose the next practice step.', 'Stop as soon as AI gives an answer.'],
    ['What does your Learning Dashboard show?', 'A snapshot of attempts, evidence, and possible next steps.', 'A permanent label or grade for ability.'],
    ['Which Project is your Personal Assistant in?', 'The separate Project prepared in Module 11.', 'The Tutor Project from Module 00.'],
  ]),
];

export function activitiesForModule(moduleNumber: number): LessonActivity[] {
  return LESSON_ACTIVITIES.filter(activity => activity.moduleNumber === moduleNumber);
}

export function normalizeActivityText(text: string): string {
  return text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ').trim().toLowerCase();
}

/** Empty object is a valid not-yet-answered record. Unknown IDs/options are not. */
export function validateLessonChoices(text: unknown, moduleNumber?: number): boolean {
  if (typeof text !== 'string' || text.length > 6000) return false;
  try {
    const value: unknown = JSON.parse(text);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    return Object.entries(value).every(([id, answer]) => {
      const activity = LESSON_ACTIVITIES.find(item => item.id === id);
      return activity && (moduleNumber === undefined || activity.moduleNumber === moduleNumber)
        && typeof answer === 'string' && activity.options.some(option => option.id === answer);
    });
  } catch { return false; }
}

export function parseLessonChoices(text: string | undefined, moduleNumber?: number): LessonChoices {
  return text && validateLessonChoices(text, moduleNumber) ? JSON.parse(text) as LessonChoices : {};
}

export function formatLessonChoices(text: string, moduleNumber?: number): string {
  if (!validateLessonChoices(text, moduleNumber)) return 'MISSING_INPUT — saved digital choices are invalid; do not infer answers.';
  const answers = parseLessonChoices(text, moduleNumber);
  return LESSON_ACTIVITIES.filter(activity => Object.hasOwn(answers, activity.id)).map(activity =>
    `${activity.question}\nStudent choice: ${activity.options.find(option => option.id === answers[activity.id])!.label}`,
  ).join('\n\n') || 'No digital choices recorded yet.';
}
