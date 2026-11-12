import { generatePlayIqAiContent, extractCleanJsonObject } from '@/lib/ai-provider';

export type TeachBackEvaluation = {
  passed: boolean;
  feedback: string;
};

export async function evaluateTeachBack(
  prompt: string, 
  studentResponse: string
): Promise<TeachBackEvaluation> {
  try {
    const systemInstruction = `
You are the PlayIQ AI Learning Engine evaluator. Your job is to grade a student's "Teach-Back" response.
The prompt they were specifically given was: "${prompt}".

CRITICAL GRADING RULES:
1. They must directly answer the prompt.
2. If they just copy-pasted the prompt or wrote gibberish (e.g. "idk", "nothing", "asdf"), they FAIL.
3. If they wrote a coherent sentence that demonstrates actual understanding of the concept, they PASS.
4. Keep feedback extremely brief, encouraging, and in a cyberpunk/AI coaching tone.

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
    return JSON.parse(cleanJson) as TeachBackEvaluation;

  } catch (err: any) {
    console.error("AI Evaluation Error:", err);
    return {
      passed: false,
      feedback: "SYSTEM ERROR: The semantic evaluation engine is currently offline or misconfigured. Please try again later."
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
  scenarios: { label: string, nextMode: string, question: string, verification: string }[]
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
    console.error("AI Boss Battle Error:", err);
    return {
      score: 0,
      feedback: "SYSTEM ERROR: Semantic evaluation failed."
    };
  }
}
