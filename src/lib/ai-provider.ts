import { GoogleGenAI } from '@google/genai';

export interface AiChatTurn {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

export interface GenerateAiContentOptions {
  systemInstruction: string;
  userPrompt?: string;
  messages?: AiChatTurn[];
  jsonMode?: boolean;
  maxOutputTokens?: number;
  timeoutMs?: number;
}

export function extractCleanJsonObject(rawText: string): string {
  let clean = rawText.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/```json/g, '').replace(/```/g, '').trim();
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/```/g, '').trim();
  }
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return clean.slice(firstBrace, lastBrace + 1);
  }
  return clean;
}

function isReasoningModel(modelId: string): boolean {
  return /^(gpt-5|gpt-6|o1|o3|o4)/i.test(modelId);
}

async function callOpenAiChat(
  apiKey: string,
  modelId: string,
  options: GenerateAiContentOptions,
): Promise<string> {
  const timeoutMs = options.timeoutMs ?? 20000;
  const maxTokens = options.maxOutputTokens ?? 2048;
  const reasoning = isReasoningModel(modelId);

  const openAiMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: options.systemInstruction },
  ];

  if (options.messages && options.messages.length > 0) {
    for (const msg of options.messages) {
      openAiMessages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    }
  } else if (options.userPrompt !== undefined) {
    openAiMessages.push({
      role: 'user',
      content: options.userPrompt,
    });
  }

  const body: Record<string, unknown> = {
    model: modelId,
    messages: openAiMessages,
    max_completion_tokens: maxTokens,
  };

  if (reasoning) {
    body.reasoning_effort = 'low';
  } else {
    body.temperature = options.jsonMode ? 0.2 : 0.6;
  }

  if (options.jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`OpenAI (${modelId}) HTTP ${res.status}: ${errText.slice(0, 300)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const text = json.choices?.[0]?.message?.content;
    if (!text || !text.trim()) {
      throw new Error(`OpenAI (${modelId}) returned empty content`);
    }
    return text.trim();
  } finally {
    clearTimeout(timer);
  }
}

async function callGeminiFallback(
  apiKey: string,
  options: GenerateAiContentOptions,
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const timeoutMs = options.timeoutMs ?? 15000;
  const maxTokens = options.maxOutputTokens ?? 2048;

  const contents =
    options.messages && options.messages.length > 0
      ? options.messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }))
      : options.userPrompt ?? '';

  let lastErr: unknown;
  for (const modelName of ['gemini-2.5-flash', 'gemini-2.0-flash']) {
    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model: modelName,
          contents: contents as any,
          config: {
            systemInstruction: options.systemInstruction,
            ...(options.jsonMode ? { responseMimeType: 'application/json' } : {}),
            temperature: options.jsonMode ? 0.2 : 0.6,
            maxOutputTokens: maxTokens,
            ...(modelName.startsWith('gemini-2.5')
              ? { thinkingConfig: { thinkingBudget: 0 } }
              : {}),
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`${modelName} timeout`)), timeoutMs),
        ),
      ]);

      if (response.text && response.text.trim()) {
        return response.text.trim();
      }
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error('Gemini fallback failed');
}

/**
 * Unified PlayIQ AI Provider
 * Primary: OpenAI `gpt-6-luna` (ChatGPT 6 Luna) via OPENAI_API_KEY
 * Secondary fallback: OpenAI `gpt-4o-mini`, then Gemini if configured.
 */
export async function generatePlayIqAiContent(
  options: GenerateAiContentOptions,
): Promise<string> {
  let lastError: unknown;

  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  if (openAiKey) {
    const primaryModel = process.env.OPENAI_MODEL?.trim() || 'gpt-6-luna';
    const candidateModels =
      primaryModel === 'gpt-4o-mini' ? [primaryModel] : [primaryModel, 'gpt-4o-mini'];

    for (const modelId of candidateModels) {
      try {
        return await callOpenAiChat(openAiKey, modelId, options);
      } catch (err) {
        lastError = err;
      }
    }
  }

  const geminiKey = (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY
  )?.trim();

  if (geminiKey) {
    try {
      return await callGeminiFallback(geminiKey, options);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError ?? new Error('No AI API key configured (OPENAI_API_KEY or GEMINI_API_KEY)');
}

