/**
 * Sprint 9A — Cost Control Policy
 *
 * Defines limits, rates, parameters, and derived alert thresholds for Gemini and Supabase.
 */

export const COST_CONTROL_POLICY = {
  gemini: {
    maxOutputTokens: 2048,
    fileSizeLimitBytes: 10485760, // 10MB limit
    fileCountLimit: 5,            // Max 5 knowledge files per assistant
    rateLimits: {
      guided_ai: {
        globalPerHour: 20,
        burstPer10Min: 8,
        refusedPerHour: 10
      },
      tutor: {
        globalPerHour: 10,
        burstPer10Min: 5,
        refusedPerHour: 5
      },
      assistant: {
        globalPerHour: 10,
        burstPer10Min: 5,
        refusedPerHour: 5
      }
    }
  },
  supabase: {
    signedUrlExpirySeconds: 600, // 10 minutes
    maxSelectLimit: 50,          // Enforced list limit
    cleanUpDraftsExpiryDays: 7   // Draft artifacts older than 7 days will be cleaned up
  },
  alertThresholds: {
    guided_ai_requests_high: 15,    // Trigger alert if client makes >= 15 requests in an hour
    tutor_test_requests_high: 8,     // Trigger alert if client makes >= 8 test requests in an hour
    assistant_test_requests_high: 8, // Trigger alert if client makes >= 8 test requests in an hour
    repeated_refusals_high: 3,       // Trigger alert if client gets >= 3 refusals in an hour (RULE-02)
    proof_storage_growth_high: 50 * 1024 * 1024, // 50MB growth trigger
    db_read_pattern_high: 1000       // Alert if hourly reads exceed 1000
  }
} as const;
