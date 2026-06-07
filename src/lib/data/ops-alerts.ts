import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ALERT_RULES } from '../ops/ops-alert-policy';
import type { AlertSeverity } from '../ops/ops-alert-policy';

export interface DynamicAlert {
  ruleCode: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  affectedCount: number;
  details: any[];
  timestamp: string;
}

/**
 * Dynamically queries database tables to generate operational alerts.
 * Read-only. Does not mutate database.
 */
export async function getDynamicOpsAlerts(): Promise<DynamicAlert[]> {
  const alerts: DynamicAlert[] = [];
  const now = new Date();

  try {
    // 1. Check Overdue Proof Reviews (pending_review > 48 hours)
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
    const { data: overdueProofs, error: proofError } = await supabaseAdmin
      .from('proof_artifact_submissions')
      .select('id, student_id, created_at')
      .eq('status', 'pending_review')
      .lte('created_at', fortyEightHoursAgo);

    if (!proofError && overdueProofs && overdueProofs.length > 0) {
      const rule = ALERT_RULES.find((r) => r.code === 'OVERDUE_PROOF_REVIEW')!;
      alerts.push({
        ruleCode: rule.code,
        title: rule.name,
        description: rule.description,
        severity: rule.severity,
        affectedCount: overdueProofs.length,
        details: overdueProofs.map((p) => ({
          submissionId: p.id,
          studentId: p.student_id,
          ageHours: Math.round((now.getTime() - new Date(p.created_at).getTime()) / (1000 * 60 * 60)),
        })),
        timestamp: now.toISOString(),
      });
    }

    // 2. Check AI Safety Refusals Burst (refusals >= 3 in last 1 hour)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const { data: recentRefusals, error: refusalError } = await supabaseAdmin
      .from('events_log')
      .select('student_id, event_type, created_at, metadata')
      .in('event_type', ['guided_ai_refused', 'tutor_profile_updated', 'assistant_profile_updated'])
      .gte('created_at', oneHourAgo);

    if (!refusalError && recentRefusals) {
      // Group refusals by student
      const studentRefusalCounts: Record<string, number> = {};
      const studentDetails: Record<string, any[]> = {};

      for (const event of recentRefusals) {
        let isRefusal = event.event_type === 'guided_ai_refused';
        if (
          event.metadata?.action === 'tutor_test_refused' ||
          event.metadata?.action === 'assistant_test_refused'
        ) {
          isRefusal = true;
        }

        if (isRefusal) {
          studentRefusalCounts[event.student_id] = (studentRefusalCounts[event.student_id] || 0) + 1;
          if (!studentDetails[event.student_id]) studentDetails[event.student_id] = [];
          studentDetails[event.student_id].push({
            eventType: event.event_type,
            createdAt: event.created_at,
          });
        }
      }

      const highRefusalStudents = Object.entries(studentRefusalCounts).filter(([_, count]) => count >= 3);

      if (highRefusalStudents.length > 0) {
        const rule = ALERT_RULES.find((r) => r.code === 'AI_SAFETY_REFUSALS_BURST')!;
        alerts.push({
          ruleCode: rule.code,
          title: rule.name,
          description: rule.description,
          severity: rule.severity,
          affectedCount: highRefusalStudents.length,
          details: highRefusalStudents.map(([studentId, count]) => ({
            studentId,
            refusalCount: count,
            events: studentDetails[studentId],
          })),
          timestamp: now.toISOString(),
        });
      }
    }

    // 3. Check Rate Limit Exceeded
    const { data: limitEvents, error: limitError } = await supabaseAdmin
      .from('events_log')
      .select('student_id, event_type, created_at, metadata')
      .in('event_type', ['tutor_profile_updated', 'assistant_profile_updated'])
      .gte('created_at', oneHourAgo);

    if (!limitError && limitEvents) {
      const rateLimitHits = limitEvents.filter(
        (e: any) =>
          e.metadata?.action === 'tutor_test_refused' ||
          e.metadata?.action === 'assistant_test_refused'
      );

      if (rateLimitHits.length > 0) {
        const rule = ALERT_RULES.find((r) => r.code === 'RATE_LIMIT_EXCEEDED')!;
        alerts.push({
          ruleCode: rule.code,
          title: rule.name,
          description: rule.description,
          severity: rule.severity,
          affectedCount: rateLimitHits.length,
          details: rateLimitHits.map((h) => ({
            studentId: h.student_id,
            eventType: h.event_type,
            action: h.metadata?.action,
            createdAt: h.created_at,
          })),
          timestamp: now.toISOString(),
        });
      }
    }
  } catch (err) {
    const { ErrorReporter } = await import('@/lib/monitoring/error-reporter');
    ErrorReporter.report({
      error: err,
      category: 'database_error',
      feature: 'admin_ops_alerts',
      action: 'get_dynamic_alerts'
    });
  }

  return alerts;
}
