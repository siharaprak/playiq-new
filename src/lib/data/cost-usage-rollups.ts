import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';

export interface CostUsageSummary {
  guidedAiCount: number;
  tutorTestCount: number;
  assistantTestCount: number;
  refusalCount: number;
  timestamp: string;
}

/**
 * Aggregates events_log rows in the past hour to calculate cost-relevant rates.
 */
export async function getCostUsageRollup(studentId?: string): Promise<CostUsageSummary> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

  let query = supabaseAdmin
    .from('events_log')
    .select('event_type, metadata')
    .gte('created_at', oneHourAgo);

  if (studentId) {
    query = query.eq('student_id', studentId);
  }

  const { data: events, error } = await query;

  if (error || !events) {
    console.error('[getCostUsageRollup] error fetching telemetry:', error?.message);
    return {
      guidedAiCount: 0,
      tutorTestCount: 0,
      assistantTestCount: 0,
      refusalCount: 0,
      timestamp: now.toISOString()
    };
  }

  let guidedAiCount = 0;
  let tutorTestCount = 0;
  let assistantTestCount = 0;
  let refusalCount = 0;

  events.forEach(event => {
    const type = event.event_type;
    const action = event.metadata?.action;

    if (type.startsWith('guided_ai_')) {
      guidedAiCount++;
      if (type === 'guided_ai_refused' || type === 'unsafe_assistance_routed') {
        refusalCount++;
      }
    } else if (type === 'tutor_profile_updated') {
      if (action === 'tutor_test_attempt') {
        tutorTestCount++;
      } else if (action === 'tutor_test_refused') {
        refusalCount++;
      }
    } else if (type === 'assistant_profile_updated') {
      if (action === 'assistant_test_attempt') {
        assistantTestCount++;
      } else if (action === 'assistant_test_refused') {
        refusalCount++;
      }
    }
  });

  return {
    guidedAiCount,
    tutorTestCount,
    assistantTestCount,
    refusalCount,
    timestamp: now.toISOString()
  };
}
