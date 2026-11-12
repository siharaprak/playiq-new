import 'server-only';
import { generatePlayIqAiContent, extractCleanJsonObject } from '@/lib/ai-provider';

export interface AIModerationResult {
  flagged: boolean;
  category: 'safety' | 'academic' | 'clean';
  confidence: number;
  reason: string;
  feedback: string;
}

export async function moderateContentWithGemini(
  body: string,
  title?: string
): Promise<AIModerationResult> {
  try {
    const systemInstruction = `
You are the PlayIQ AI Community Moderator. Your job is to analyze student posts or comments in the discussion forum.
Categorize the content into one of three categories:
1. "safety": Slurs, hate speech, extreme toxicity, harassment, self-harm mentions, explicit content.
2. "academic": Copying and pasting full worksheet questions asking for answers, sharing direct answers/keys to worksheets (Modules 1-10), seeking cheats/solvers.
3. "clean": Constructive posts, progress updates, standard questions, conceptual queries, helpful study advice.

GRADING & ACTION RULES:
- If "safety": flagged is true. Provide a compassionate, cyberpunk-themed message directing them to be respectful, or sharing supportive resources if self-harm is mentioned.
- If "academic": flagged is true. Block the post. PlayIQ's core rule is "AI can coach me, but I earn the skill." Provide a firm, cyber-themed coaching message urging them to ask a conceptual question instead of seeking direct answers.
- If "clean": flagged is false. feedback can be empty.

You MUST return a raw JSON object and nothing else.
Format:
{
  "flagged": boolean,
  "category": "safety" | "academic" | "clean",
  "confidence": number, // a float from 0 to 1
  "reason": "Internal reason for the decision",
  "feedback": "User-facing cyberpunk-themed explanation or coaching guidance (only if flagged)"
}`;

    const rawText = await generatePlayIqAiContent({
      systemInstruction,
      userPrompt: `Title: "${title || ''}"\nBody: "${body}"\n\nModerate this.`,
      jsonMode: true,
      maxOutputTokens: 1024,
    });

    const cleanJson = extractCleanJsonObject(rawText);
    return JSON.parse(cleanJson) as AIModerationResult;

  } catch (err: any) {
    console.error("AI Moderation Error:", err);
    // Fallback: assume clean in case of network/key failures to avoid blocking the student
    return {
      flagged: false,
      category: 'clean',
      confidence: 1,
      reason: 'AI API error, failing open to prevent user lock',
      feedback: ''
    };
  }
}
