import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { GuidedAiModeId } from './types';
import type { GuidedAiEventType } from '@/lib/events/types';

interface RateLimitPolicy {
  windowMinutes: number;
  maxRequests: number;
}

export function getGuidedAiRateLimitPolicy(role: string, mode?: GuidedAiModeId) {
  // Higher limits for testing
  if (role === 'admin' || role === 'teacher') {
    return {
      globalWindowMinutes: 60,
      globalMaxRequests: 1000,
      burstWindowMinutes: 10,
      burstMaxRequests: 100,
      rescueMaxRequests: 100,
      quizMaxRequests: 100,
      refusedMaxRequests: 100,
    };
  }

  // Beta default limits for students
  return {
    globalWindowMinutes: 60,
    globalMaxRequests: 20, // 20 Guided AI requests per student per hour
    burstWindowMinutes: 10,
    burstMaxRequests: 8,   // 8 requests per student per 10 minutes
    rescueMaxRequests: 5,  // 5 Lesson Rescue requests per student per hour
    quizMaxRequests: 10,   // 10 Quiz Mode requests per student per hour
    refusedMaxRequests: 10, // 10 refused/unsafe routed attempts per hour
  };
}

const AI_EVENT_TYPES: GuidedAiEventType[] = [
  'guided_ai_used',
  'guided_ai_refused',
  'guided_ai_effort_required',
  'guided_ai_hint_ladder_step',
  'guided_ai_quiz_practice_generated',
  'guided_ai_teachback_required',
  'lesson_rescue_used',
  'learn_your_way_updated',
  'unsafe_assistance_routed'
];

export async function checkGuidedAiRateLimit({
  userId,
  role,
  mode,
}: {
  userId: string;
  role: string;
  mode?: GuidedAiModeId;
}): Promise<{ allowed: boolean; reason?: string }> {
  const policy = getGuidedAiRateLimitPolicy(role, mode);
  
  const now = new Date();
  const globalStart = new Date(now.getTime() - policy.globalWindowMinutes * 60000).toISOString();
  const burstStart = new Date(now.getTime() - policy.burstWindowMinutes * 60000).toISOString();

  // Query events for the user in the past hour
  const { data: events, error } = await supabaseAdmin
    .from('events_log')
    .select('event_type, created_at, metadata')
    .eq('student_id', userId)
    .in('event_type', AI_EVENT_TYPES)
    .gte('created_at', globalStart);

  if (error) {
    const { ErrorReporter } = await import('@/lib/monitoring/error-reporter');
    ErrorReporter.report({
      error,
      category: 'rate_limit_blocked',
      feature: 'guided_ai',
      action: 'check_rate_limit'
    });
    // Safe fallback: If DB query fails, we block to protect API cost or we allow?
    // User requested: "if query fails because DB is unavailable, return a safe 503 or conservative 429"
    // "do not call Gemini blindly when rate-limit state cannot be checked"
    return { allowed: false, reason: 'Service unavailable for checking rate limits. Please try again later.' };
  }

  const globalEvents = events || [];
  const burstEvents = globalEvents.filter((e: any) => e.created_at >= burstStart);
  
  const refusalEvents = globalEvents.filter((e: any) => e.event_type === 'guided_ai_refused' || e.event_type === 'unsafe_assistance_routed');
  const rescueEvents = globalEvents.filter((e: any) => e.event_type === 'lesson_rescue_used');
  const quizEvents = globalEvents.filter((e: any) => e.event_type === 'guided_ai_quiz_practice_generated');

  if (burstEvents.length >= policy.burstMaxRequests) {
    return { allowed: false, reason: 'You are sending too many requests too quickly. Please wait a few minutes.' };
  }

  if (globalEvents.length >= policy.globalMaxRequests) {
    return { allowed: false, reason: 'You have reached the maximum number of AI requests for this hour.' };
  }

  if (refusalEvents.length >= policy.refusedMaxRequests) {
    return { allowed: false, reason: 'Too many off-topic or refused requests. AI assistance is temporarily paused.' };
  }

  if (mode === 'lesson_rescue' && rescueEvents.length >= policy.rescueMaxRequests) {
    return { allowed: false, reason: 'You have reached the maximum number of Lesson Rescues for this hour.' };
  }

  if (mode === 'quiz' && quizEvents.length >= policy.quizMaxRequests) {
    return { allowed: false, reason: 'You have reached the maximum number of Quiz Practices for this hour.' };
  }

  return { allowed: true };
}
