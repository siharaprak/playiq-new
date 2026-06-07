// src/lib/rollups/rollup-policy.ts
//
// Sprint 9B Rollup and Aggregation Policy
// Single source of truth for dynamic vs precomputed rollups guidelines.
//

export const ROLLUP_POLICY = {
  freshnessToleranceSeconds: 300, // 5 minutes tolerance for precomputations
  maxLiveQueryCountThreshold: 5,   // Alert if more than 5 dependent live queries run sequentially
} as const;

/**
 * Guidelines for deciding query consolidation vs precomputation.
 */
export const ROLLUP_DECISION_RULES = {
  useLiveDerivedQuery: [
    'Low page hit volume (e.g. admin-only view panel)',
    'Scale remains within beta bounds (e.g. < 50 items)',
    'Data freshness is critical for real-time state machines',
    'Simple head count checks that execute on indexed columns',
  ],
  usePrecomputedRollup: [
    'Repeated execution of the same query block on dashboard page loads',
    'Multi-table joins with N+1 patterns that degrade DB resource usage',
    'High-frequency scanning of raw transaction tables (e.g. events_log) across multiple users',
    'Tolerance for slightly stale/cached states',
  ]
} as const;

/**
 * Privacy boundaries for aggregations.
 * Rollups must NEVER expose the following forbidden fields.
 */
export const ROLLUP_PRIVACY_BLOCKED_FIELDS = [
  'rawPrompt',
  'rawResponse',
  'systemInstructions',
  'storagePath',
  'signedUrl',
  'reviewNotes',
  'email',
  'fullName',
  'paymentData',
] as const;
