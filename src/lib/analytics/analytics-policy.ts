/**
 * Sprint 9A — Analytics Baseline Policy
 *
 * Defines privacy and security rules for client and server telemetry.
 *
 * Rules:
 * 1. Google Analytics 4 (GA4) is for client-safe, non-sensitive UI events only.
 * 2. Server-side structured product telemetry must flow exclusively through events_log.
 * 3. Never log raw prompts, responses, or custom instructions to any analytics tool.
 * 4. Never log file contents, storage paths, or signed URLs to GA4.
 * 5. Never log Service Role keys, JWTs, cookies, access tokens, or personal identifiers (emails, names, phone numbers).
 * 6. Strip all search queries and parameters from GA4 route tracker configuration calls.
 */

export const ANALYTICS_POLICY = {
  clientTracker: 'Google Analytics 4',
  serverTelemetryTable: 'events_log',
  piiScrubbingEnabled: true,
  stripQueryParams: true,
  forbiddenKeys: [
    'email',
    'fullName',
    'phone',
    'token',
    'code',
    'state',
    'access_token',
    'refresh_token',
    'session',
    'invite',
    'rawPrompt',
    'rawResponse',
    'customInstructions',
    'storagePath',
    'signedUrl'
  ]
} as const;

export function isSafeForClientTelemetry(eventName: string): boolean {
  // Client-safe high level events only
  const clientSafeEvents = [
    'page_view',
    'signup_started',
    'signup_completed',
    'login_completed',
    'dashboard_viewed',
    'module_viewed',
    'proof_upload_started',
    'tutor_builder_opened',
    'assistant_builder_opened',
    'support_opened'
  ];
  return clientSafeEvents.includes(eventName);
}
