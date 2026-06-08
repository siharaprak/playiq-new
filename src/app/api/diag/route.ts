import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/permissions';
import { createApiSuccess, createApiError } from '@/lib/server/responses';

export async function GET(req: NextRequest) {
  try {
    // Authenticate the request so only logged in users can see this
    await requireAuth(req);

    const envKeys = Object.keys(process.env).sort();
    
    const geminiKey = process.env.GEMINI_API_KEY || '';
    const googleGenAiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';

    const maskKey = (key: string) => {
      if (!key) return 'MISSING';
      if (key.length <= 6) return 'PRESENT (TOO SHORT)';
      return `${key.slice(0, 4)}...${key.slice(-3)} (Length: ${key.length})`;
    };

    return createApiSuccess({
      geminiApiKeyStatus: maskKey(geminiKey),
      googleGenerativeAiApiKeyStatus: maskKey(googleGenAiKey),
      allEnvKeys: envKeys,
      nodeVersion: process.version,
      geminiTestCall: await testGemini(geminiKey)
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return createApiError('Unauthorized', 401);
    }
    return createApiError('Internal error', 500);
  }
}

async function testGemini(apiKey: string) {
  if (!apiKey) return 'No API key to test';
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Say "hello"',
      config: {
        maxOutputTokens: 10
      }
    });
    return {
      success: true,
      text: response.text
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || String(err),
      cause: err.cause ? String(err.cause) : undefined
    };
  }
}
