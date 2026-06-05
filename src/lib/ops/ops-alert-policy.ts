import 'server-only';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface AlertRule {
  id: string;
  code: string;
  name: string;
  description: string;
  severity: AlertSeverity;
}

export const ALERT_RULES: AlertRule[] = [
  {
    id: 'RULE-01',
    code: 'OVERDUE_PROOF_REVIEW',
    name: 'Overdue Proof Artifact Review',
    description: 'A submitted proof artifact has been pending review for more than 48 hours.',
    severity: 'warning',
  },
  {
    id: 'RULE-02',
    code: 'AI_SAFETY_REFUSALS_BURST',
    name: 'AI Safety Refusals Burst',
    description: 'A student has triggered 3 or more safety refusals within the last hour.',
    severity: 'critical',
  },
  {
    id: 'RULE-03',
    code: 'RATE_LIMIT_EXCEEDED',
    name: 'Tutor/Assistant Rate Limit Hit',
    description: 'A user was blocked by rate-limiting constraints in the last hour.',
    severity: 'info',
  },
];
