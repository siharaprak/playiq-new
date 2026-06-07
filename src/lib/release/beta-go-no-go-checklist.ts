export interface ChecklistItem {
  id: string;
  category: string;
  label: string;
  severity: 'P0' | 'P1' | 'P2';
  evidenceCommand: string;
  evidenceSource: string;
  passCondition: string;
  failCondition: string;
  ownerHint: string;
  goNoGoImpact: string;
}

export const BETA_GO_NO_GO_CHECKLIST: ChecklistItem[] = [
  {
    id: 'CHK-BLD-01',
    category: 'Build and Deployment',
    label: 'ESLint syntax verification passes',
    severity: 'P2',
    evidenceCommand: 'npm run lint',
    evidenceSource: 'eslint output',
    passCondition: 'Zero compilation errors (warnings allowed as technical debt)',
    failCondition: 'Compilation/syntax errors found',
    ownerHint: 'Product Engineering Team',
    goNoGoImpact: 'GO: warnings tracked. NO-GO only if syntax error breaks compilation.'
  },
  {
    id: 'CHK-BLD-02',
    category: 'Build and Deployment',
    label: 'TypeScript compilation typecheck passes',
    severity: 'P0',
    evidenceCommand: 'npx tsc --noEmit',
    evidenceSource: 'tsc stdout',
    passCondition: 'Clean exit code 0',
    failCondition: 'Any type compilation error',
    ownerHint: 'Product Engineering Team',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-BLD-03',
    category: 'Build and Deployment',
    label: 'Next.js build production bundle compiles cleanly',
    severity: 'P0',
    evidenceCommand: 'npm run build',
    evidenceSource: 'next build stdout',
    passCondition: 'Successful production compilation',
    failCondition: 'Compilation error or OOM crash',
    ownerHint: 'Product Engineering Team',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-ATH-01',
    category: 'Auth and RBAC',
    label: 'Admin RBAC verification passes',
    severity: 'P0',
    evidenceCommand: 'npm run verify-admin-rbac',
    evidenceSource: 'verify-admin-rbac.ts',
    passCondition: 'No client service role key leakage, resolves role mismatch correctly',
    failCondition: 'RBAC role checks fail or service role key leaked',
    ownerHint: 'Security & Auth Team',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-ATH-02',
    category: 'Auth and RBAC',
    label: 'Dashboard role access matrix verification passes',
    severity: 'P0',
    evidenceCommand: 'npm run verify:role-access-matrix',
    evidenceSource: 'verify-role-access-matrix.ts',
    passCondition: 'Dashboard cross-role validation checks intercept unauthorized loaders',
    failCondition: 'Student/parent accesses unauthorized dashboards',
    ownerHint: 'Security & Auth Team',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-PAR-01',
    category: 'Parent Privacy',
    label: 'Parent dashboard visibility limits verified',
    severity: 'P0',
    evidenceCommand: 'npm run verify:parent-dashboard-visibility',
    evidenceSource: 'verify-parent-dashboard-visibility.ts',
    passCondition: 'Statically scans and filters forbidden instructions or storage path keys',
    failCondition: 'Forbidden keys leaks to parent components',
    ownerHint: 'Security & Auth Team',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-PAR-02',
    category: 'Parent Privacy',
    label: 'Proof access matrix verified',
    severity: 'P0',
    evidenceCommand: 'npm run verify:proof-access-matrix',
    evidenceSource: 'verify-proof-access-matrix.ts',
    passCondition: 'Parent cannot request signed URLs or retrieve private proof files directly',
    failCondition: 'Parent receives signed URL path access',
    ownerHint: 'Security & Auth Team',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-STR-01',
    category: 'Upload/Storage Safety',
    label: 'Proof upload validation failures verified',
    severity: 'P0',
    evidenceCommand: 'npm run verify:proof-upload-failures',
    evidenceSource: 'verify-proof-upload-failures.ts',
    passCondition: 'Traversals, double extensions, and size limits reject properly',
    failCondition: 'Invalid files upload or mock artifacts fail slot check limits',
    ownerHint: 'Storage & Uploads Infrastructure',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-AI-01',
    category: 'Guided AI Safety',
    label: 'Guided AI safety routing and effort rules verified',
    severity: 'P0',
    evidenceCommand: 'npm run qa:guided-ai',
    evidenceSource: 'qa-guided-ai-adversarial.ts',
    passCondition: 'Adversarial inputs correctly route to safety categories, effort gating verified',
    failCondition: 'Adversarial prompts bypass safety filters or direct quiz answers released',
    ownerHint: 'AI Safety & Inference Team',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-AI-02',
    category: 'Guided AI Safety',
    label: 'Guided AI metadata safety verifier passes',
    severity: 'P0',
    evidenceCommand: 'npm run verify:ai-events',
    evidenceSource: 'verify-guided-ai-event-metadata.ts',
    passCondition: 'All Guided AI logs checked have clean, safe metadata',
    failCondition: 'PII, cookies, or prompt tokens leak to metadata columns',
    ownerHint: 'AI Safety & Inference Team',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-TUT-01',
    category: 'Tutor Builder',
    label: 'Tutor profile creation completeness and limits verified',
    severity: 'P1',
    evidenceCommand: 'npm run verify:tutor-profile-failures',
    evidenceSource: 'verify-tutor-profile-failures.ts',
    passCondition: 'Tutor versions history is insert-only, maximum linked knowledge file limit verified',
    failCondition: 'Tutor profile mutable snapshots or knowledge files link ceiling bypassed',
    ownerHint: 'AI Safety & Inference Team',
    goNoGoImpact: 'NO-GO if limit checks fail.'
  },
  {
    id: 'CHK-AST-01',
    category: 'Assistant Builder',
    label: 'Assistant profile creation and limits verified',
    severity: 'P1',
    evidenceCommand: 'npm run verify:assistant-profile-failures',
    evidenceSource: 'verify-assistant-profile-failures.ts',
    passCondition: 'Assistant setup completed constraints are checked, no progress database updates bypass',
    failCondition: 'Assistant setups mutate course gating tables',
    ownerHint: 'AI Safety & Inference Team',
    goNoGoImpact: 'NO-GO if gating boundaries leak.'
  },
  {
    id: 'CHK-STR-02',
    category: 'Upload/Storage Safety',
    label: 'Upload abuse policy verification passes',
    severity: 'P0',
    evidenceCommand: 'npm run verify:upload-abuse-protection',
    evidenceSource: 'verify-upload-abuse-protection.ts',
    passCondition: 'Server blocks control characters, invalid MIME type inputs, double extensions',
    failCondition: 'File validation bypasses server rules',
    ownerHint: 'Storage & Uploads Infrastructure',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-MON-01',
    category: 'Error Monitoring',
    label: 'Error monitoring verifier passes',
    severity: 'P0',
    evidenceCommand: 'npm run verify:error-monitoring',
    evidenceSource: 'verify-error-monitoring.ts',
    passCondition: 'Stack traces and keys sanitized before logs write to stdout',
    failCondition: 'Raw database keys or storage URLs printed in telemetry',
    ownerHint: 'Security & Auth Team',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-LOG-01',
    category: 'Analytics/Logging',
    label: 'Logging safety verification passes',
    severity: 'P0',
    evidenceCommand: 'npm run verify:logging-safety',
    evidenceSource: 'verify-logging-safety.ts',
    passCondition: 'No service role keys, prompts, or signed URLs printed in stdout streams',
    failCondition: 'Raw prompts or keys detected in logs',
    ownerHint: 'Security & Auth Team',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-CST-01',
    category: 'Cost Controls',
    label: 'Cost controls verification passes',
    severity: 'P2',
    evidenceCommand: 'npm run verify:cost-controls',
    evidenceSource: 'verify-cost-controls.ts',
    passCondition: 'Daily budget limit config exists. Cloud billing alerts documented in runbook.',
    failCondition: 'Cost controls policy missing or daily limit is zero',
    ownerHint: 'AI Safety & Inference Team',
    goNoGoImpact: 'GO: rate limits and budget configurations verified. External alerts documented in runbook.'
  },
  {
    id: 'CHK-PRE-01',
    category: 'Data/Schema/Migrations',
    label: 'Pre-sprint readiness validations pass',
    severity: 'P0',
    evidenceCommand: 'npm run verify:pre-sprint5',
    evidenceSource: 'verify-pre-sprint5-readiness.ts',
    passCondition: 'Curriculum constants align perfectly with database tables structures',
    failCondition: 'Module ID or node hierarchy mismatch between DB and static source code',
    ownerHint: 'DevOps & Database Platform',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-STG-01',
    category: 'Staging Reset Safety',
    label: 'Staging data reset safety validation passes',
    severity: 'P0',
    evidenceCommand: 'npm run verify:staging-reset-safety',
    evidenceSource: 'verify-staging-reset-safety.ts',
    passCondition: 'Dry-run enforcement active, checks reject reset calls on production project configurations',
    failCondition: 'Destructive script lacks connection allowed check or test email domain scoping checks',
    ownerHint: 'DevOps & Database Platform',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-OPS-01',
    category: 'Admin Operations',
    label: 'Beta blockers registry validation passes',
    severity: 'P0',
    evidenceCommand: 'npm run audit:beta-blockers',
    evidenceSource: 'audit-beta-blockers.ts',
    passCondition: 'Zero open beta blockers tracked in code',
    failCondition: 'Open blockers in registry',
    ownerHint: 'DevOps & Database Platform',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-OPS-02',
    category: 'Admin Operations',
    label: 'Sprint 8 blocker parity verification passes',
    severity: 'P0',
    evidenceCommand: 'npm run verify:sprint8-blockers',
    evidenceSource: 'verify-sprint8-blocker-registry.ts',
    passCondition: 'All Sprint 8 blockers are resolved and registries match',
    failCondition: 'Mismatch in tracker or open unresolved Sprint 8 blockers',
    ownerHint: 'DevOps & Database Platform',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-ENR-01',
    category: 'Enrollment/Payment',
    label: 'Enrollment integrity verifier passes',
    severity: 'P0',
    evidenceCommand: 'npm run verify:enrollment-integrity',
    evidenceSource: 'verify-enrollment-integrity.ts',
    passCondition: 'Enforces unique constraints, blocks duplicate active course subscriptions',
    failCondition: 'Allows duplicate active enrollments per student',
    ownerHint: 'DevOps & Database Platform',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-TUT-02',
    category: 'Tutor Builder',
    label: 'Knowledge files verifier passes',
    severity: 'P0',
    evidenceCommand: 'npm run verify:knowledge-files',
    evidenceSource: 'verify-knowledge-files.ts',
    passCondition: 'Knowledge files uploaded use private bucket, RLS matches current session owner',
    failCondition: 'Knowledge files query bypasses RLS or uses public downloads link',
    ownerHint: 'Storage & Uploads Infrastructure',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-DAT-01',
    category: 'Data/Schema/Migrations',
    label: 'support_issues schema reproducibility verified',
    severity: 'P0',
    evidenceCommand: 'verify-support-issues-schema check',
    evidenceSource: 'scripts/verify-support-issues-schema.ts',
    passCondition: 'Support issues table resolves resolved_at and metadata without schema drift crashes',
    failCondition: 'SQL schema lacks drift remediation columns',
    ownerHint: 'DevOps & Database Platform',
    goNoGoImpact: 'Strict NO-GO.'
  },
  {
    id: 'CHK-STR-03',
    category: 'Upload/Storage Safety',
    label: 'Private storage assumptions verified',
    severity: 'P1',
    evidenceCommand: 'check-supabase-buckets-metadata',
    evidenceSource: 'manual Supabase bucket checklist validation',
    passCondition: 'Supabase storage buckets (knowledge-files and proof-artifacts) configured as private',
    failCondition: 'Buckets configured as public (exposing public URLs)',
    ownerHint: 'Storage & Uploads Infrastructure',
    goNoGoImpact: 'NO-GO: privacy leak risk.'
  },
  {
    id: 'CHK-ANL-01',
    category: 'Analytics/Logging',
    label: 'GA4 route tracking parameter scrubbing verified',
    severity: 'P1',
    evidenceCommand: 'npm run audit:analytics-coverage',
    evidenceSource: 'audit-analytics-coverage.ts',
    passCondition: 'Route queries strip tokens, JWTs, and email strings from GA4 tracking payloads',
    failCondition: 'GA4 captures raw access tokens, invite variables, or email strings',
    ownerHint: 'Product Engineering Team',
    goNoGoImpact: 'NO-GO: metrics privacy leak.'
  },
  {
    id: 'CHK-PAY-01',
    category: 'Enrollment/Payment',
    label: 'Stripe webhook security documented and Stripe disabled for beta',
    severity: 'P1',
    evidenceCommand: 'verify-stripe-webhook-headers',
    evidenceSource: 'src/app/api/stripe/webhook/route.ts',
    passCondition: 'Validates webhook signature, STRIPE_WEBHOOK_SECRET present, signature header verified',
    failCondition: 'Signature header validation missing or bypassed',
    ownerHint: 'Billing & Integration Team',
    goNoGoImpact: 'NO-GO: checkout webhook fraud risk.'
  },
  {
    id: 'CHK-DAT-02',
    category: 'Data/Schema/Migrations',
    label: 'Database read pattern audit has low-risk deferred debt only',
    severity: 'P2',
    evidenceCommand: 'npm run audit:db-read-patterns',
    evidenceSource: 'audit-db-read-patterns.ts',
    passCondition: 'No high-risk wildcard scans; low-risk queries documented in release note',
    failCondition: 'High-risk wildcard SELECT * scans found on production routes',
    ownerHint: 'DevOps & Database Platform',
    goNoGoImpact: 'GO with deferred technical debt.'
  }
];
