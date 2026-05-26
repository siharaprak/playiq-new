/**
 * Sprint 4A — Guided AI API Route
 *
 * POST /api/guided-ai
 *
 * Authenticated, Zod-validated, mode-bounded guided AI endpoint.
 * No conversation history. No raw prompt/response storage.
 * Uses existing auth and response helpers.
 *
 * Tech debt note: /api/chat should be secured with server-side auth
 * or retired after Guided AI replaces it.
 */

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/permissions';
import { createApiSuccess, createApiError, createApiValidationError } from '@/lib/server/responses';
import { GuidedAiRequestSchema } from '@/lib/guided-ai/types';
import { runGuidedMode } from '@/lib/guided-ai/run-guided-mode';
import { isModeAvailable } from '@/lib/guided-ai/modes';

// TODO: Add rate limiting when a rate limiter is available.
// For now, rely on Gemini API's own rate limits.

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate — students, teachers, and admins can access
    const user = await requireAuth(req);

    // 2. Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return createApiError('Invalid JSON body', 400);
    }

    const parseResult = GuidedAiRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return createApiValidationError(parseResult.error, 400);
    }

    const input = parseResult.data;

    // 3. Check mode availability
    if (!isModeAvailable(input.mode)) {
      return createApiError(`Mode "${input.mode}" is not available yet. It is currently in scaffold/preview status.`, 400);
    }

    // 4. Run the guided mode engine
    const result = await runGuidedMode(input, user.id);

    // 5. Return structured response
    return createApiSuccess(result);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return createApiError(error.message || 'Authentication required', 401);
    }
    if (error instanceof Error && error.message.startsWith('Forbidden')) {
      return createApiError(error.message, 403);
    }
    console.error('[guided-ai] Unexpected error:', error);
    return createApiError('Internal server error', 500);
  }
}
