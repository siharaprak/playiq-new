export type SeverityLevel = 'P0' | 'P1' | 'P2';

export interface BetaIssue {
  id: string;
  category: string;
  description: string;
  severity?: SeverityLevel;
  tags?: string[];
  checklistItemId?: string;
}

/**
 * Programmatically classifies an issue into P0, P1, or P2 based on keyword heuristics.
 */
export function classifyBetaIssue(issue: BetaIssue): SeverityLevel {
  const desc = (issue.description || '').toLowerCase();
  const cat = (issue.category || '').toLowerCase();
  const tags = (issue.tags || []).map(t => t.toLowerCase());

  const hasWord = (words: string[]) => words.some(w => desc.includes(w) || cat.includes(w) || tags.includes(w));

  // P0 Beta Blocker: Security, key leakage, role access, production mutations, broken builds, Guided AI safety, raw prompts logging, signed URLs
  if (
    hasWord([
      'security',
      'vulnerability',
      'service role',
      'service_role',
      'client leak',
      'key leak',
      'parent privacy',
      'privacy leak',
      'unauthorized role',
      'role access',
      'production data deletion',
      'delete production',
      'broken auth',
      'login broken',
      'signup broken',
      'payment corruption',
      'webhook corruption',
      'broken build',
      'broken typecheck',
      'upload core',
      'review core',
      'guided ai safety',
      'safety guardrail',
      'raw prompt',
      'raw response',
      'signed url',
      'signedurl',
      'reset production',
      'staging reset safety bypass',
      'db migration reproducibility',
      'migration failure',
      'data loss',
      'cross-student',
      'cross_student'
    ])
  ) {
    return 'P0';
  }

  // P1 Must Fix Before Wider Beta: Journey breaks, admin dashboard breaks, misleading dashboard count, tutor/assistant completion failures, rate limits open
  if (
    hasWord([
      'journey break',
      'student journey',
      'manage critical',
      'misleading',
      'tutor completion',
      'assistant completion',
      'resolution broken',
      'abuse protection incomplete',
      'fail open',
      'high-cost',
      'high cost',
      'loop risk',
      'monitoring blind spot',
      'missing regression',
      'critical boundary'
    ])
  ) {
    return 'P1';
  }

  // P2 Can Defer: Cosmetic, layout, performance, cloud budgets documented, lint warnings
  return 'P2';
}

/**
 * Returns true if the issue is a P0 Beta Blocker.
 */
export function isBetaBlockingIssue(issue: BetaIssue): boolean {
  const severity = issue.severity || classifyBetaIssue(issue);
  return severity === 'P0';
}

/**
 * Returns the recommended fix urgency priority string.
 */
export function getRecommendedFixPriority(issue: BetaIssue): string {
  const severity = issue.severity || classifyBetaIssue(issue);
  if (severity === 'P0') return 'Immediate Fix Required - Blocker';
  if (severity === 'P1') return 'High Priority - Fix Before Beta Release';
  return 'Deferred - Low Priority / Cosmetic / Non-Blocking';
}

/**
 * Suggests the engineering owner for triage.
 */
export function getIssueOwnerHint(issue: BetaIssue): string {
  const cat = (issue.category || '').toLowerCase();
  const desc = (issue.description || '').toLowerCase();

  if (cat.includes('auth') || cat.includes('rbac') || cat.includes('access') || desc.includes('role')) {
    return 'Security & Auth Team';
  }
  if (cat.includes('stripe') || cat.includes('payment') || cat.includes('webhook')) {
    return 'Billing & Integration Team';
  }
  if (cat.includes('ai') || cat.includes('tutor') || cat.includes('assistant') || cat.includes('gemini')) {
    return 'AI Safety & Inference Team';
  }
  if (cat.includes('upload') || cat.includes('storage') || cat.includes('artifact')) {
    return 'Storage & Uploads Infrastructure';
  }
  if (cat.includes('staging') || cat.includes('reset') || cat.includes('database') || cat.includes('migration')) {
    return 'DevOps & Database Platform';
  }
  return 'Product Engineering Team';
}

/**
 * Returns the go/no-go impact text.
 */
export function getGoNoGoImpact(issue: BetaIssue): string {
  const severity = issue.severity || classifyBetaIssue(issue);
  if (severity === 'P0') return 'Strict NO-GO: Core Platform Release Blocked.';
  if (severity === 'P1') return 'NO-GO if aggregated (>3 open P1s) or relates to Auth/Privacy/Uploads/AI-Safety/Data-Deletion.';
  return 'GO with Caution: Ship and track as deferred technical debt.';
}
