export interface BlockerPolicy {
  severity: 'P0' | 'P1' | 'P2';
  description: string;
  isBlocker: boolean;
}

export const SPRINT10_BLOCKER_POLICY: Record<string, BlockerPolicy> = {
  // P0 Blockers - Critical Security & Production Stability issues
  PRODUCTION_BUILD_FAIL: {
    severity: 'P0',
    description: 'Production build or typecheck fails.',
    isBlocker: true,
  },
  AUTH_FLOW_BROKEN: {
    severity: 'P0',
    description: 'Authentication or login functionality is broken.',
    isBlocker: true,
  },
  SERVICE_ROLE_LEAK: {
    severity: 'P0',
    description: 'Exposing Supabase service role key to client-side code bundles.',
    isBlocker: true,
  },
  PARENT_PRIVACY_LEAK: {
    severity: 'P0',
    description: 'Parent dashboard or API exposes private student data (e.g., raw files, prompts, or logs).',
    isBlocker: true,
  },
  CROSS_STUDENT_ACCESS: {
    severity: 'P0',
    description: 'Unauthorized access to other students\' learning data or submissions.',
    isBlocker: true,
  },
  PUBLIC_STORAGE_ACCESS: {
    severity: 'P0',
    description: 'Proof artifacts or custom knowledge files storage buckets are publicly accessible.',
    isBlocker: true,
  },
  STAGING_RESET_PRODUCTION_RISK: {
    severity: 'P0',
    description: 'Staging destructive database resets could run against or touch the production DB.',
    isBlocker: true,
  },
  RAW_AI_LOGGING_EXPOSURE: {
    severity: 'P0',
    description: 'Logging raw prompt payloads or AI model responses containing sensitive info.',
    isBlocker: true,
  },
  GUIDED_AI_SAFETY_FAILURE: {
    severity: 'P0',
    description: 'Failure in adversarial prompt filters or safety policy boundaries.',
    isBlocker: true,
  },
  DATA_LOSS_RISK: {
    severity: 'P0',
    description: 'Database or storage mutations risking active learner record deletion.',
    isBlocker: true,
  },
  PRODUCTION_SECRETS_MISSING: {
    severity: 'P0',
    description: 'Production environment lacks required API credentials or secrets.',
    isBlocker: true,
  },

  // P1 Blockers - Staging Rehearsal & Release Operation readiness issues
  STAGING_DEPLOYMENT_MISSING: {
    severity: 'P1',
    description: 'Vercel staging rehearsal deployment is missing or not reachable.',
    isBlocker: true,
  },
  STAGING_SMOKE_FAIL: {
    severity: 'P1',
    description: 'Staging smoke checks or verification scripts fail to execute successfully.',
    isBlocker: true,
  },
  PRODUCTION_SMOKE_READINESS_FAIL: {
    severity: 'P1',
    description: 'Static checklist assertions for production smoke checks fail.',
    isBlocker: true,
  },
  ADMIN_TOOLS_UNUSABLE: {
    severity: 'P1',
    description: 'Admin support dashboards or proof review queues are broken/unusable.',
    isBlocker: true,
  },
  TUTOR_ASSISTANT_COMPLETION_BROKEN: {
    severity: 'P1',
    description: 'Tutor Builder or Assistant Builder sandbox test/history flows fail.',
    isBlocker: true,
  },
  HUMAN_OWNERS_MISSING: {
    severity: 'P1',
    description: 'Release, deployment, monitoring, or support owner assignments are missing.',
    isBlocker: true,
  },
  ROLLBACK_TARGET_VAGUE: {
    severity: 'P1',
    description: 'The rollback target does not map to a specific stable Vercel deployment ID.',
    isBlocker: true,
  },
  DATABASE_BACKUP_UNCONFIRMED: {
    severity: 'P1',
    description: 'Database backup status is unconfirmed or undocumented.',
    isBlocker: true,
  },
  DATABASE_RESTORE_PROCEDURE_MISSING: {
    severity: 'P1',
    description: 'Manual database restoration instructions/procedures are missing.',
    isBlocker: true,
  },
  STRIPE_CONFIG_AMBIGUITY: {
    severity: 'P1',
    description: 'Stripe paid flows or checkout paths are active instead of Promo bypass logic.',
    isBlocker: true,
  },
  PROOF_CLEANUP_CRON_SECRET_MISSING: {
    severity: 'P1',
    description: 'Cron secrets for automated proof artifact purging are missing.',
    isBlocker: true,
  },

  // P2 Deferred Debt - Documented but non-blocking release issues
  LINT_WARNINGS: {
    severity: 'P2',
    description: 'ESLint warnings (e.g., unused imports, image tag recommendation) in codebase.',
    isBlocker: false,
  },
  DATABASE_READ_PATTERNS: {
    severity: 'P2',
    description: 'SELECT * queries or suboptimal read patterns deferred for post-launch refactoring.',
    isBlocker: false,
  },
  EXTERNAL_BILLING_CONSOLE: {
    severity: 'P2',
    description: 'External budget alerts configured in console instead of programmatically verified.',
    isBlocker: false,
  },
  STAGING_RESET_FIXTURE_DEFERRED: {
    severity: 'P2',
    description: 'Staging environment database destructive cleanup logs deferred.',
    isBlocker: false,
  },
  RESTORE_REHEARSAL_PENDING: {
    severity: 'P2',
    description: 'Live database restore rehearsal has not been performed (procedures exist).',
    isBlocker: false,
  },
  UI_POLISH_COSMETIC: {
    severity: 'P2',
    description: 'Minor spacing, theme alignment, or cosmetic interface improvements.',
    isBlocker: false,
  },
};
