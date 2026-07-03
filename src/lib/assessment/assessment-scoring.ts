/**
 * Module 0 — Assessment Scoring Rubrics
 *
 * Internal scoring logic for the three baseline tasks.
 * Scores are stored but NOT shown to the apprentice during onboarding.
 * They feed the PDI baseline snapshot.
 */

import { GoogleGenAI } from '@google/genai';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getGeminiClient() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is missing from environment variables.');
  return new GoogleGenAI({ apiKey });
}

// ── Task 1: AI Verification Instinct (binary) ──────────────────────────────

/**
 * The correct answer for the AI accuracy check.
 * Answer "A" is the subtly incorrect one (confident but wrong).
 * Answer "B" is the correct one.
 */
export const BASELINE_TASK1_CORRECT_ANSWER = 'B';

export function scoreBaselineTask1(selectedAnswer: string): { correct: boolean } {
  return { correct: selectedAnswer.toUpperCase() === BASELINE_TASK1_CORRECT_ANSWER };
}

// ── Task 1 Content ──────────────────────────────────────────────────────────

export const BASELINE_TASK1_CONTENT = {
  topic: 'Why do we have seasons?',
  answerA: {
    label: 'A',
    text: 'We have seasons because the Earth moves closer to and farther from the Sun during its orbit. When the Earth is closest to the Sun, we experience summer because it receives more direct heat. When it is farthest away, we experience winter because less heat reaches the surface.',
  },
  answerB: {
    label: 'B',
    text: 'We have seasons because the Earth is tilted on its axis at about 23.5 degrees. As the Earth orbits the Sun, this tilt causes different parts of the planet to receive different amounts of direct sunlight throughout the year, which creates the seasonal changes we experience.',
  },
  explanation:
    'Answer A sounds confident but contains a subtle error — seasons are NOT caused by distance from the Sun. The Earth is actually closest to the Sun during Northern Hemisphere winter. Answer B correctly identifies axial tilt as the cause.',
};

// ── Task 2: Explanation Clarity (AI-evaluated, 1-5) ─────────────────────────

export const BASELINE_TASK2_PROMPT =
  'Explain gravity in two or three sentences, in your own words. Pretend you are explaining it to a friend who has never heard the word before.';

export async function scoreBaselineTask2(response: string): Promise<{ score: number; feedback: string }> {
  if (!response || response.trim().length < 10) {
    return { score: 1, feedback: 'Response too short to evaluate.' };
  }

  try {
    const ai = getGeminiClient();

    const systemInstruction = `You are an internal scoring engine for PlayIQ — a learning platform for teenagers.
You are evaluating a student's explanation of gravity. Score from 1 to 5:

1 — No real attempt, gibberish, or copy-paste
2 — Vague or mostly incorrect understanding
3 — Shows basic understanding but lacks clarity or completeness
4 — Clear, mostly accurate explanation in their own words
5 — Excellent clarity, accurate, uses good examples or analogies

Return ONLY raw JSON: { "score": number, "feedback": "1 brief sentence" }`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Student response: "${response}"\n\nScore this explanation of gravity.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    if (!result.text) return { score: 2, feedback: 'Evaluation unavailable.' };

    let cleanJson = result.text;
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    const parsed = JSON.parse(cleanJson);
    return {
      score: Math.max(1, Math.min(5, parsed.score ?? 2)),
      feedback: parsed.feedback ?? '',
    };
  } catch (err) {
    console.error('Baseline Task 2 scoring error:', err);
    return { score: 2, feedback: 'Scoring system temporarily unavailable.' };
  }
}

// ── Task 3: Problem Approach (AI-evaluated, 1-5) ───────────────────────────

export const BASELINE_TASK3_CONTENT = {
  prompt: `A farmer has 3 fields. Field A produces twice as much wheat as Field B. Field C produces 10 bushels more than Field B. Together, all three fields produce 110 bushels. How many bushels does each field produce?

Show your thinking — not just the answer. I want to see HOW you approach this.`,
};

export async function scoreBaselineTask3(response: string): Promise<{ score: number; feedback: string }> {
  if (!response || response.trim().length < 10) {
    return { score: 1, feedback: 'Response too short to evaluate.' };
  }

  try {
    const ai = getGeminiClient();

    const systemInstruction = `You are an internal scoring engine for PlayIQ. You are evaluating a student's approach to a logic/word problem.

The correct answer is: Field B = 25, Field A = 50, Field C = 35 (total = 110).

Score their APPROACH from 1 to 5:
1 — No real attempt, random answer, or gibberish
2 — Tried but approach is fundamentally wrong or no reasoning shown
3 — Shows some logical thinking but has errors or incomplete reasoning
4 — Good approach, shows work, mostly or fully correct
5 — Clear, systematic reasoning with correct answer and well-explained process

IMPORTANT: We value seeing their THINKING PROCESS more than getting the right answer.

Return ONLY raw JSON: { "score": number, "feedback": "1 brief sentence" }`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Student response: "${response}"\n\nScore this problem approach.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    if (!result.text) return { score: 2, feedback: 'Evaluation unavailable.' };

    let cleanJson = result.text;
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    const parsed = JSON.parse(cleanJson);
    return {
      score: Math.max(1, Math.min(5, parsed.score ?? 2)),
      feedback: parsed.feedback ?? '',
    };
  } catch (err) {
    console.error('Baseline Task 3 scoring error:', err);
    return { score: 2, feedback: 'Scoring system temporarily unavailable.' };
  }
}

// ── Composite Baseline PDI Snapshot ─────────────────────────────────────────

export interface BaselinePDISnapshot {
  task1_correct: boolean;
  task2_score: number;
  task3_score: number;
  composite_score: number; // Normalized 0-100
}

export function computeBaselinePDI(
  task1Correct: boolean,
  task2Score: number,
  task3Score: number,
): BaselinePDISnapshot {
  // Weighted composite: Task 1 = 20%, Task 2 = 40%, Task 3 = 40%
  const task1Normalized = task1Correct ? 100 : 0;
  const task2Normalized = (task2Score / 5) * 100;
  const task3Normalized = (task3Score / 5) * 100;

  const composite = Math.round(task1Normalized * 0.2 + task2Normalized * 0.4 + task3Normalized * 0.4);

  return {
    task1_correct: task1Correct,
    task2_score: task2Score,
    task3_score: task3Score,
    composite_score: composite,
  };
}
