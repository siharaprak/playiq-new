import { generatePlayIqAiContent, extractCleanJsonObject } from '@/lib/ai-provider';

export type TeachBackEvaluation = {
  passed: boolean;
  feedback: string;
};

const PLACEHOLDER_OR_GIBBERISH_SET = new Set([
  'idk',
  "i don't know",
  'i dont know',
  'dont know',
  'nothing',
  'none',
  'n/a',
  'na',
  'asdf',
  'qwerty',
  'test',
  'testing',
  'blah',
  'whatever',
  'skip',
  'pass',
  'yes',
  'no',
  'ok',
  'okay',
  'done',
  '123',
  '1234',
  '12345',
]);

function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Deterministic baseline guardrail executed before AI semantic evaluation.
 * Blocks empty inputs, low-effort placeholder/gibberish strings, repeated characters,
 * and verbatim copy-pastes of the prompt/question itself—including pre-filled values.
 */
export function validateTextResponseDeterministic(
  rawAnswer: string,
  promptOrQuestion: string,
  options: { minChars?: number; minWords?: number; fieldLabel?: string } = {},
): { ok: true } | { ok: false; feedback: string } {
  const minChars = options.minChars ?? 12;
  const minWords = options.minWords ?? 3;
  const label = options.fieldLabel ? `"${options.fieldLabel}"` : 'Your response';

  const trimmed = (rawAnswer || '').trim();
  if (!trimmed) {
    return { ok: false, feedback: `${label} cannot be blank. Write your answer in your own words.` };
  }

  if (trimmed.length < minChars) {
    return {
      ok: false,
      feedback: `${label} is too brief. Provide a complete, meaningful response (${minWords}+ words) explaining your thinking.`,
    };
  }

  const normalized = normalizeForComparison(trimmed);
  if (!normalized || PLACEHOLDER_OR_GIBBERISH_SET.has(normalized)) {
    return {
      ok: false,
      feedback: `${label} looks like a placeholder rather than a real answer. Address the prompt directly in your own words.`,
    };
  }

  // Detect single repeated character or keyboard mash without vowels/words
  if (/^(.)\1{5,}$/.test(trimmed.replace(/\s+/g, ''))) {
    return {
      ok: false,
      feedback: `${label} contains repeated placeholder characters. Explain the concept in clear words.`,
    };
  }

  const words = normalized.split(' ').filter(Boolean);
  if (words.length < minWords) {
    return {
      ok: false,
      feedback: `${label} needs at least ${minWords} words to show what you observed or understood.`,
    };
  }

  // Block long vowel-less keyboard mashes (e.g. "sdfghjkl", "zxcvbnm")
  const alphaWords = words.filter((w) => /^[a-z]{5,}$/.test(w));
  if (alphaWords.some((w) => !/[aeiouy]/i.test(w))) {
    return {
      ok: false,
      feedback: `${label} appears to contain unreadable keyboard text. Write a clear response in plain English.`,
    };
  }

  const normalizedPrompt = normalizeForComparison(promptOrQuestion);
  if (normalizedPrompt.length >= 12 && normalized === normalizedPrompt) {
    return {
      ok: false,
      feedback: `${label} repeats the prompt verbatim. Explain or record your actual response in your own words.`,
    };
  }

  return { ok: true };
}

export async function evaluateTeachBack(
  prompt: string,
  studentResponse: string,
  lessonContext?: string,
): Promise<TeachBackEvaluation> {
  const precheck = validateTextResponseDeterministic(studentResponse, prompt, {
    minChars: 18,
    minWords: 4,
    fieldLabel: 'Teach-Back response',
  });
  if (!precheck.ok) {
    return { passed: false, feedback: precheck.feedback };
  }

  try {
    const contextBlock = lessonContext
      ? `\nLesson Reference Context:\n${lessonContext.slice(0, 2200)}\n`
      : '';
    const systemInstruction = `
You are the PlayIQ AI Learning Engine evaluator. Your job is to grade a student's "Teach-Back" response.
The prompt they were specifically given was: "${prompt}".${contextBlock}

CRITICAL GRADING RULES:
1. They must directly and accurately address every part of the prompt based on the lesson context.
2. If they copy-pasted the prompt, wrote gibberish, or pasted an answer about a DIFFERENT module/topic that does not address this prompt, they FAIL.
3. If they wrote a coherent explanation in their own words that demonstrates genuine understanding of the requested concept, they PASS.
4. Keep feedback brief (1-2 sentences), constructive, and in an encouraging PlayIQ coaching tone without writing a copy-pasteable answer for them.

You MUST return a raw JSON object and nothing else.
Format:
{
  "passed": boolean,
  "feedback": "Your 1-2 sentence feedback here."
}`;

    const rawText = await generatePlayIqAiContent({
      systemInstruction,
      userPrompt: `Student Response: "${studentResponse}"\n\nGrade this.`,
      jsonMode: true,
      maxOutputTokens: 1024,
    });

    const cleanJson = extractCleanJsonObject(rawText);
    const parsed = JSON.parse(cleanJson) as TeachBackEvaluation;
    return {
      passed: Boolean(parsed.passed),
      feedback:
        typeof parsed.feedback === 'string' && parsed.feedback.trim()
          ? parsed.feedback.trim()
          : 'Review the prompt and explain the concept clearly in your own words.',
    };
  } catch (err: any) {
    console.error('AI Evaluation Error:', err);
    return {
      passed: false,
      feedback:
        'SYSTEM ERROR: The semantic evaluation engine is currently offline or misconfigured. Please try again later.',
    };
  }
}

export async function evaluateNodeActivity(params: {
  moduleNum: number;
  nodeId: string;
  nodeTitle: string;
  bigIdea: string[];
  activityTitle: string;
  instructions: string[];
  items: { label: string; answer: string }[];
}): Promise<TeachBackEvaluation> {
  for (const item of params.items) {
    const check = validateTextResponseDeterministic(item.answer, item.label, {
      minChars: 8,
      minWords: 2,
      fieldLabel: item.label,
    });
    if (!check.ok) {
      return { passed: false, feedback: check.feedback };
    }
  }

  try {
    const systemInstruction = `
You are the PlayIQ AI Learning Engine evaluator grading a student's Application Phase activity in Module ${params.moduleNum}, Node ${params.nodeId} ("${params.nodeTitle}").

Lesson Big Idea:
${params.bigIdea.join('\n')}

Activity Title: "${params.activityTitle}"
Activity Instructions:
${params.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

CRITICAL GRADING RULES:
1. Every submitted field must be relevant to its specific prompt and to this lesson's topic.
2. FAIL any submission where a field contains an unrelated or pre-filled answer from a different topic/module (for example, talking about weekly lunch planning on a Tutor Project launch check, or pasting off-topic text that ignores the prompt).
3. FAIL gibberish, filler, or factually contradictory statements that violate the lesson's core rule (e.g., mixing Assistant files into the Module 00 Tutor Project, claiming chat text schedules a real notification, or entering private passwords).
4. ALLOW honest lab/test observations (including recording "not_tested" or "N/T" with a short note when a prompt asks for test ratings 1/2/3/N/T and the student honestly reports what was or was not tested).
5. If failed, name the specific prompt/field that needs correction in 1-2 encouraging coaching sentences without writing the answer for the student.

You MUST return a raw JSON object and nothing else:
{
  "passed": boolean,
  "feedback": "1-2 sentence coaching feedback."
}`;

    const formattedItems = params.items
      .map((item, idx) => `Field ${idx + 1} Prompt: "${item.label}"\nStudent Input: "${item.answer}"`)
      .join('\n\n');

    const rawText = await generatePlayIqAiContent({
      systemInstruction,
      userPrompt: `Evaluate all Application Phase fields below:\n\n${formattedItems}`,
      jsonMode: true,
      maxOutputTokens: 1024,
    });

    const cleanJson = extractCleanJsonObject(rawText);
    const parsed = JSON.parse(cleanJson) as TeachBackEvaluation;
    return {
      passed: Boolean(parsed.passed),
      feedback:
        typeof parsed.feedback === 'string' && parsed.feedback.trim()
          ? parsed.feedback.trim()
          : 'One or more Application responses did not address the mission prompts. Review your answers and try again.',
    };
  } catch (err: any) {
    console.error('AI Activity Evaluation Error:', err);
    return {
      passed: false,
      feedback:
        'SYSTEM ERROR: The semantic evaluation engine is currently offline or misconfigured. Please try again shortly.',
    };
  }
}

export async function evaluateNodeMiniCheck(params: {
  moduleNum: number;
  nodeId: string;
  nodeTitle: string;
  bigIdea: string[];
  sectionContext: string;
  qaPairs: { question: string; answer: string }[];
}): Promise<TeachBackEvaluation> {
  for (let i = 0; i < params.qaPairs.length; i++) {
    const pair = params.qaPairs[i];
    const check = validateTextResponseDeterministic(pair.answer, pair.question, {
      minChars: 12,
      minWords: 3,
      fieldLabel: `Question ${i + 1}`,
    });
    if (!check.ok) {
      return { passed: false, feedback: check.feedback };
    }
  }

  try {
    const systemInstruction = `
You are the PlayIQ AI Learning Engine evaluator grading a student's Mini-Check Validation in Module ${params.moduleNum}, Node ${params.nodeId} ("${params.nodeTitle}").

Lesson Big Idea:
${params.bigIdea.join('\n')}

Authoritative Lesson Reference:
${params.sectionContext.slice(0, 2600)}

CRITICAL GRADING RULES:
1. The student must answer EVERY Mini-Check question accurately and directly based on the Authoritative Lesson Reference above.
2. If ANY question's answer is factually wrong, answers a completely different question (such as listing 4 assistant parts when asked "Which Project do you use in Module 10?"), contradicts the lesson, or is vague filler, you MUST set "passed": false.
3. Do NOT let a strong answer on Question 1 excuse an incorrect or irrelevant answer on Question 2 or Question 3—every question must pass.
4. When "passed" is false, clearly state which question number(s) missed and guide the student on what concept from the lesson to check (1-2 sentences, encouraging coaching tone, without handing them a copy-pasteable answer).

You MUST return a raw JSON object and nothing else:
{
  "passed": boolean,
  "feedback": "1-2 sentence coaching feedback."
}`;

    const formattedQa = params.qaPairs
      .map((pair, idx) => `Question ${idx + 1}: "${pair.question}"\nStudent Answer: "${pair.answer}"`)
      .join('\n\n');

    const rawText = await generatePlayIqAiContent({
      systemInstruction,
      userPrompt: `Grade all Mini-Check answers below:\n\n${formattedQa}`,
      jsonMode: true,
      maxOutputTokens: 1024,
    });

    const cleanJson = extractCleanJsonObject(rawText);
    const parsed = JSON.parse(cleanJson) as TeachBackEvaluation;
    return {
      passed: Boolean(parsed.passed),
      feedback:
        typeof parsed.feedback === 'string' && parsed.feedback.trim()
          ? parsed.feedback.trim()
          : 'One or more Mini-Check answers were inaccurate or incomplete. Review the lesson and revise your response.',
    };
  } catch (err: any) {
    console.error('AI Mini-Check Evaluation Error:', err);
    return {
      passed: false,
      feedback:
        'SYSTEM ERROR: The semantic evaluation engine is currently offline or misconfigured. Please try again shortly.',
    };
  }
}

export async function evaluateCapstoneMasterTrial(params: {
  topic: string;
  stage1Prelearn: string;
  stage3Compress: string;
  stage6Answer: string;
  selectedTrack: string;
  trackPrompt: string;
  trackOutput: string;
  trackImprovement: string;
  bossExplain: string;
  bossShow: string;
  bossChoose: string;
}): Promise<TeachBackEvaluation> {
  const requiredFields: { label: string; value: string; minWords: number }[] = [
    { label: 'Master Trial Topic', value: params.topic, minWords: 1 },
    { label: 'Stage 1 (Pre-Learn)', value: params.stage1Prelearn, minWords: 3 },
    { label: 'Stage 3 (Compress)', value: params.stage3Compress, minWords: 3 },
    { label: 'Stage 6 (Final Answer Clarity)', value: params.stage6Answer, minWords: 3 },
    { label: 'Skills Track Prompt', value: params.trackPrompt, minWords: 3 },
    { label: 'Skills Track Output', value: params.trackOutput, minWords: 3 },
    { label: 'Skills Track Improvement', value: params.trackImprovement, minWords: 3 },
    { label: 'Capstone Explain', value: params.bossExplain, minWords: 4 },
    { label: 'Capstone Show', value: params.bossShow, minWords: 4 },
    { label: 'Capstone Choose', value: params.bossChoose, minWords: 4 },
  ];

  for (const field of requiredFields) {
    const check = validateTextResponseDeterministic(field.value, field.label, {
      minChars: field.minWords === 1 ? 3 : 12,
      minWords: field.minWords,
      fieldLabel: field.label,
    });
    if (!check.ok) {
      return { passed: false, feedback: check.feedback };
    }
  }

  try {
    const systemInstruction = `
You are the PlayIQ AI Learning Engine evaluator grading a student's Module 14 Capstone Master Trial.
Verify that:
1. The Master Trial topic is a real, safe learning topic (not gibberish, live closed-book cheating, or placeholder text).
2. Stages 1, 3, and 6 coherently relate to the chosen topic.
3. The Skills Demonstration Track (${params.selectedTrack}) shows a real prompt, output summary, and human improvement.
4. The 3 Capstone Boss Battle responses (Explain Coach vs. Crutch, Show a verified adjustment, Choose safe next step) demonstrate authentic understanding rather than filler or off-topic text.

Return raw JSON only:
{
  "passed": boolean,
  "feedback": "1-2 sentence coaching feedback naming which section needs revision if failed."
}`;

    const rawText = await generatePlayIqAiContent({
      systemInstruction,
      userPrompt: JSON.stringify(params, null, 2),
      jsonMode: true,
      maxOutputTokens: 1024,
    });
    const cleanJson = extractCleanJsonObject(rawText);
    const parsed = JSON.parse(cleanJson) as TeachBackEvaluation;
    return {
      passed: Boolean(parsed.passed),
      feedback:
        typeof parsed.feedback === 'string' && parsed.feedback.trim()
          ? parsed.feedback.trim()
          : 'Please revise your Master Trial responses so every section addresses your chosen topic and PlayIQ principles.',
    };
  } catch (err: any) {
    console.error('AI Capstone Evaluation Error:', err);
    return {
      passed: false,
      feedback:
        'SYSTEM ERROR: The semantic evaluation engine is currently offline or misconfigured. Please try again shortly.',
    };
  }
}

export type BossBattleEvaluation = {
  score: number;
  feedback: string;
  fingerprints?: {
    explanationPreference: string;
    modePreference: string;
    shortcutTendency: string;
    integritySnapshot: string;
  };
};

export async function evaluateBossBattle(
  scenarios: { label: string; nextMode: string; question: string; verification: string }[],
): Promise<BossBattleEvaluation> {
  try {
    const scenarioCount = scenarios.length;

    const systemInstruction = `
You are the PlayIQ AI Engine assessing a student's Boss Battle performance.
The student evaluated ${scenarioCount} scenarios about responsible technology and AI use. For each scenario, they provided:
1. A Label classifying the scenario (e.g., Superpower vs Superweapon, Useful vs Risky vs Wrong, etc.)
2. An explanation of why they chose that label
3. A suggested next action or highest-path response

Analyze their inputs holistically. Award 1 point for every fundamentally correct overarching scenario understanding. Max score is ${scenarioCount}.
We are looking for: do they understand when technology helps vs hurts growth? Do they know not to trust AI blindly? Do they choose the highest-path response?

Return a raw JSON object and nothing else.
Format:
{
  "score": number, // an integer from 0 to ${scenarioCount}
  "feedback": "Targeted feedback on their performance.",
  "fingerprints": {
    "explanationPreference": "Short description (e.g., 'Visual metaphors', 'Direct bullet points')",
    "modePreference": "Short description (e.g., 'Socratic Coach', 'Direct Answers')",
    "shortcutTendency": "Short description (e.g., 'Low - Prefers step-by-step', 'High - Seeks quick answers')",
    "integritySnapshot": "Short description (e.g., 'Strong Verification Habit', 'Trusts AI too quickly')"
  }
}`;

    const contents = `Student Boss Battle Data:\n${JSON.stringify(scenarios, null, 2)}\n\nEvaluate and return JSON.`;

    const rawText = await generatePlayIqAiContent({
      systemInstruction,
      userPrompt: contents,
      jsonMode: true,
      maxOutputTokens: 1024,
    });

    const cleanJson = extractCleanJsonObject(rawText);
    return JSON.parse(cleanJson) as BossBattleEvaluation;
  } catch (err: any) {
    console.error('AI Boss Battle Error:', err);
    return {
      score: 0,
      feedback: 'SYSTEM ERROR: Semantic evaluation failed.',
    };
  }
}
