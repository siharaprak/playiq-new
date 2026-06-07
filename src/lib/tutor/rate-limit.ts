import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Checks the tutor testing rate limit for a student.
 * Limits:
 * - 10 tutor tests per hour
 * - 5 tutor tests per 10 minutes
 * - 5 refused/unsafe attempts per hour
 * 
 * If rate-limit query fails, it fails closed (returns allowed = false).
 * Admin and teacher roles are exempt from rate limits.
 */
export async function checkTutorTestRateLimit(
  studentId: string
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    // 1. Check if the user is an admin or teacher to exempt them
    const { data: roleRows, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', studentId);

    if (!roleError && roleRows) {
      const roles = roleRows.map((r: any) => r.role);
      if (roles.includes('admin') || roles.includes('teacher')) {
        return { allowed: true };
      }
    }

    // 2. Define timestamps
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();

    // 3. Query events_log for tutor_profile_updated events in the past hour
    const { data: events, error } = await supabaseAdmin
      .from('events_log')
      .select('event_type, created_at, metadata')
      .eq('student_id', studentId)
      .eq('event_type', 'tutor_profile_updated')
      .gte('created_at', oneHourAgo);

    if (error) {
      const { ErrorReporter } = await import('@/lib/monitoring/error-reporter');
      ErrorReporter.report({
        error,
        category: 'rate_limit_blocked',
        feature: 'tutor_test',
        action: 'check_rate_limit'
      });
      // Fail closed (safety fallback)
      return {
        allowed: false,
        reason: 'Rate limit service is currently unavailable. Please try again later.',
      };
    }

    const globalEvents = events || [];

    // Filter events based on metadata action field
    const hourAttempts = globalEvents.filter(
      (e: any) => e.metadata?.action === 'tutor_test_attempt'
    );

    const tenMinAttempts = hourAttempts.filter(
      (e: any) => e.created_at >= tenMinutesAgo
    );

    const hourRefusals = globalEvents.filter(
      (e: any) => e.metadata?.action === 'tutor_test_refused'
    );

    // Apply rate limits
    // - 5 tutor tests per 10 minutes (checked first for burst protection)
    if (tenMinAttempts.length >= 5) {
      return {
        allowed: false,
        reason: 'You are testing too frequently (limit: 5 tests per 10 minutes). Please wait a few minutes.',
      };
    }

    // - 10 tutor tests per hour
    if (hourAttempts.length >= 10) {
      return {
        allowed: false,
        reason: 'You have reached the limit of 10 tutor tests per hour. Please try again later.',
      };
    }

    // - 5 refused/unsafe attempts per hour
    if (hourRefusals.length >= 5) {
      return {
        allowed: false,
        reason: 'Tutor testing is temporarily paused due to multiple unsafe attempt warnings.',
      };
    }

    return { allowed: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[checkTutorTestRateLimit] unexpected error:', message);
    return {
      allowed: false,
      reason: 'Rate limit service encountered an error. Please try again later.',
    };
  }
}
