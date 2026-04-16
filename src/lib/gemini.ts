import { GoogleGenAI } from '@google/genai';

// Fail-safe initialization to prevent crashing if the key is missing in dev
const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export type TeachBackEvaluation = {
  passed: boolean;
  feedback: string;
};

export async function evaluateTeachBack(
  prompt: string, 
  studentResponse: string
): Promise<TeachBackEvaluation> {
  try {
    const ai = getGeminiClient();

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Student Response: "${studentResponse}"\n\nGrade this.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.1,
      }
    });

    if (!response.text) throw new Error("Empty response from AI");
    
    // Safety parse just in case there are markdown ticks
    let cleanJson = response.text;
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    
    return JSON.parse(cleanJson) as TeachBackEvaluation;

  } catch (err: any) {
    console.error("Gemini Evaluation Error:", err);
    return {
      passed: false,
      feedback: "SYSTEM ERROR: The semantic evaluation engine is currently offline or misconfigured. Please try again later."
    };
  }
}

export type BossBattleEvaluation = {
  score: number;
  feedback: string;
};

export async function evaluateBossBattle(
  scenarios: { label: string, nextMode: string, question: string, verification: string }[]
): Promise<BossBattleEvaluation> {
  try {
    const ai = getGeminiClient();

    const systemInstruction = `
You are the PlayIQ AI Engine assessing a student's Boss Battle performance (Module 1).
The student evaluated 5 difficult AI-use scenarios. For each scenario, they provided:
1. A Label (Useful, Risky, or Wrong)
2. The Best Next AI Mode
3. A Better Next Question Prompt
4. A Verification Strategy

Analyze their inputs holistically. Award 1 point for every fundamentally correct overarching scenario understanding. Max score is 5.
We are looking for: do they know not to trust AI blindly? Do they know how to question better?

Return a raw JSON object and nothing else.
Format:
{
  "score": number, // an integer from 0 to 5
  "feedback": "Targeted feedback on their performance."
}`;

    const contents = `Student Boss Battle Data:\n${JSON.stringify(scenarios, null, 2)}\n\nEvaluate and return JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.1,
      }
    });

    if (!response.text) throw new Error("Empty response from AI");

    let cleanJson = response.text;
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    
    return JSON.parse(cleanJson) as BossBattleEvaluation;

  } catch (err: any) {
    console.error("Gemini Boss Battle Error:", err);
    return {
      score: 0,
      feedback: "SYSTEM ERROR: Semantic evaluation failed."
    };
  }
}
