/**
 * Sprint 5B — In-memory Proof Artifact Rate Limiter (Temporary Beta Guard)
 *
 * NOTE: This is NOT production-grade.
 * - It is not reliable across scaled instances (e.g., multiple Node/Vercel functions).
 * - It resets completely on deployment or function cold start.
 * - It must be replaced later with Redis, Upstash, or Supabase-backed counters.
 */

interface RateLimitPolicy {
  uploadSlotMaxRequests: number;
  finalizeMaxRequests: number;
  downloadUrlMaxRequests: number;
  reviewMaxRequests: number;
  windowMinutes: number;
}

const BETA_POLICY: RateLimitPolicy = {
  uploadSlotMaxRequests: 10,  // 10 per hour
  finalizeMaxRequests: 20,    // 20 per hour
  downloadUrlMaxRequests: 30, // 30 per hour
  reviewMaxRequests: 60,      // 60 per hour
  windowMinutes: 60,
};

// In-memory store: { [userId]: { [action]: { count: number, resetAt: number } } }
const memoryStore = new Map<string, Map<string, { count: number; resetAt: number }>>();

export function checkProofArtifactRateLimit(
  userId: string,
  action: 'upload-slot' | 'finalize' | 'download-url' | 'review'
): { allowed: boolean; reason?: string } {
  const now = Date.now();
  let userMap = memoryStore.get(userId);

  if (!userMap) {
    userMap = new Map();
    memoryStore.set(userId, userMap);
  }

  let record = userMap.get(action);

  if (!record || now > record.resetAt) {
    // Reset or initialize
    record = { count: 0, resetAt: now + BETA_POLICY.windowMinutes * 60 * 1000 };
    userMap.set(action, record);
  }

  let limit = 0;
  switch (action) {
    case 'upload-slot': limit = BETA_POLICY.uploadSlotMaxRequests; break;
    case 'finalize': limit = BETA_POLICY.finalizeMaxRequests; break;
    case 'download-url': limit = BETA_POLICY.downloadUrlMaxRequests; break;
    case 'review': limit = BETA_POLICY.reviewMaxRequests; break;
  }

  if (record.count >= limit) {
    return { allowed: false, reason: `Too many ${action} requests. Please wait before trying again.` };
  }

  record.count += 1;
  return { allowed: true };
}
