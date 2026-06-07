// src/lib/abuse/abuse-protection-policy.ts
//
// Sprint 9B Abuse Protection Policy
// Centralized constraints for Guided AI, Sandbox limits, upload bounds, and moderation.
//

export const ABUSE_PROTECTION_POLICY = {
  authRequired: true,
  
  rateLimits: {
    guidedAi: {
      maxPerHour: 20,
      maxPer10Min: 8,
      refusalThreshold: 10,
    },
    tutorTest: {
      maxPerHour: 10,
      maxPer10Min: 5,
      refusalThreshold: 5,
    },
    assistantTest: {
      maxPerHour: 10,
      maxPer10Min: 5,
      refusalThreshold: 5,
    }
  },

  uploads: {
    maxFilesPerEntity: 5,
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    blockedExtensions: [
      '.exe', '.bat', '.cmd', '.com', '.msi', '.scr', '.pif',
      '.js', '.vbs', '.wsf', '.ps1', '.sh', '.bash',
      '.dll', '.sys', '.drv',
      '.html', '.htm', '.svg',
    ],
    unsafePattern: /[<>:"/\\|?*\x00-\x1f]|\.\.|\.\//,
  },

  discussions: {
    maxTopicsPerHour: 5,
    maxRepliesPerHour: 15,
  }
} as const;
