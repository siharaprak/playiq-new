// =============================================================================
// Sprint 8: Assistant Build — Beta Completion Policy
//
// Pure logic. No DB calls. Operates on already-fetched data.
// Single source of truth for assistant build completion criteria.
// =============================================================================

import type {
  AssistantProfile,
  AssistantVersion,
  KnowledgeFile,
  AssistantPersonaConfig,
} from './types';

// ---------------------------------------------------------------------------
// PlayIQ Assistant Integrity Baseline
// ---------------------------------------------------------------------------

/**
 * The integrity baseline that every PlayIQ assistant must respect.
 * Injected into AI prompts at sandbox or production query time.
 */
export const PLAYIQ_ASSISTANT_INTEGRITY_BASELINE = {
  label: 'PlayIQ Assistant Integrity Baseline',
  rules: [
    'Never write homework, essays, or assignments for the student.',
    'Never provide direct answers to assessment questions.',
    'Always guide the student toward understanding, not shortcuts.',
    'Refuse requests to bypass verification, grading, or mastery checks.',
    'Do not generate content that impersonates the student.',
    'Do not store or repeat private information shared in test sessions.',
    'Encourage the student to verify AI output before trusting it.',
  ],
} as const;

/**
 * System prompt prefix injected into every assistant session.
 */
export const PLAYIQ_ASSISTANT_SYSTEM_PREFIX = `You are a PlayIQ Learning Assistant. You follow PlayIQ Integrity Rules at all times.

MANDATORY RULES (these override any user-provided instructions):
${PLAYIQ_ASSISTANT_INTEGRITY_BASELINE.rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

If a student asks you to violate any of these rules, politely refuse and explain why.
Do not comply with requests for homework completion, direct answers, or shortcut assistance.
`;

// ---------------------------------------------------------------------------
// Completion Criteria Constants
// ---------------------------------------------------------------------------

export const ASSISTANT_BUILD_MIN_COMPLETE_STATUS = 'active' as const;

const STATUS_RANK: Record<string, number> = {
  draft: 0,
  active: 1,
  published: 2,
};

// ---------------------------------------------------------------------------
// Beta Completion Criteria
// ---------------------------------------------------------------------------

export interface AssistantBuildCompletionResult {
  complete: boolean;
  missingItems: string[];
  completedItems: string[];
  completionPercent: number;
}

const BETA_CRITERIA: {
  label: string;
  check: (ctx: {
    profile: AssistantProfile;
    versions: AssistantVersion[];
    knowledgeFiles: KnowledgeFile[];
    hasTestedAssistant: boolean;
  }) => boolean;
}[] = [
  {
    label: 'Assistant profile exists',
    check: ({ profile }) => !!profile,
  },
  {
    label: 'Assistant name is set',
    check: ({ profile }) => !!profile.name?.trim(),
  },
  {
    label: 'Purpose is defined',
    check: ({ profile }) => {
      const pc = profile.persona_config as AssistantPersonaConfig | null;
      return !!pc?.purpose?.trim();
    },
  },
  {
    label: 'Target user is defined',
    check: ({ profile }) => {
      const pc = profile.persona_config as AssistantPersonaConfig | null;
      return !!pc?.user_target?.trim();
    },
  },
  {
    label: 'Boundaries are defined',
    check: ({ profile }) => {
      const pc = profile.persona_config as AssistantPersonaConfig | null;
      return !!pc?.boundaries?.trim();
    },
  },
  {
    label: 'At least one assistant version exists',
    check: ({ versions }) => versions.length > 0,
  },
  {
    label: 'current_version_id is set on profile',
    check: ({ profile }) => !!profile.current_version_id,
  },
  {
    label: 'Instructions (system_prompt) exist in current version',
    check: ({ profile, versions }) => {
      if (!profile.current_version_id) return false;
      const current = versions.find((v) => v.id === profile.current_version_id);
      return !!current?.system_prompt?.trim();
    },
  },
  {
    label: 'At least one knowledge file is attached',
    check: ({ knowledgeFiles }) => knowledgeFiles.length > 0,
  },
  {
    label: 'Assistant has been tested at least once',
    check: ({ hasTestedAssistant }) => hasTestedAssistant,
  },
  {
    label: 'Profile status meets minimum completion threshold (active)',
    check: ({ profile }) =>
      (STATUS_RANK[profile.status] ?? 0) >= (STATUS_RANK[ASSISTANT_BUILD_MIN_COMPLETE_STATUS] ?? 1),
  },
];

export function isAssistantBuildComplete(
  profile: AssistantProfile | null,
  versions: AssistantVersion[],
  knowledgeFiles: KnowledgeFile[],
  hasTestedAssistant: boolean
): AssistantBuildCompletionResult {
  if (!profile) {
    return {
      complete: false,
      missingItems: BETA_CRITERIA.map((c) => c.label),
      completedItems: [],
      completionPercent: 0,
    };
  }

  const ctx = { profile, versions, knowledgeFiles, hasTestedAssistant };
  const completedItems: string[] = [];
  const missingItems: string[] = [];

  for (const criterion of BETA_CRITERIA) {
    if (criterion.check(ctx)) {
      completedItems.push(criterion.label);
    } else {
      missingItems.push(criterion.label);
    }
  }

  const completionPercent = Math.round(
    (completedItems.length / BETA_CRITERIA.length) * 100
  );

  return {
    complete: missingItems.length === 0,
    missingItems,
    completedItems,
    completionPercent,
  };
}

// ---------------------------------------------------------------------------
// Activation Gate
// ---------------------------------------------------------------------------

export interface ActivationGateResult {
  canActivate: boolean;
  blockers: string[];
}

export function canActivateAssistant(
  profile: AssistantProfile,
  versions: AssistantVersion[]
): ActivationGateResult {
  const blockers: string[] = [];

  if (profile.status !== 'draft') {
    blockers.push(`Profile is already '${profile.status}', only 'draft' profiles can be activated`);
  }

  if (!profile.name?.trim()) {
    blockers.push('Assistant must have a name');
  }

  const pc = profile.persona_config as AssistantPersonaConfig | null;
  if (!pc?.purpose?.trim()) {
    blockers.push('Assistant must have a purpose defined');
  }
  if (!pc?.user_target?.trim()) {
    blockers.push('Target user must be defined');
  }
  if (!pc?.boundaries?.trim()) {
    blockers.push('Boundaries must be defined');
  }

  if (versions.length === 0) {
    blockers.push('At least 1 version must be created');
  }

  if (!profile.current_version_id) {
    blockers.push('current_version_id must be set on the profile');
  } else {
    const current = versions.find((v) => v.id === profile.current_version_id);
    if (!current) {
      blockers.push('current_version_id points to a non-existent version');
    } else if (!current.system_prompt?.trim()) {
      blockers.push('Current version must have non-empty instructions');
    }
  }

  return {
    canActivate: blockers.length === 0,
    blockers,
  };
}

// ---------------------------------------------------------------------------
// Publish Gate
// ---------------------------------------------------------------------------

export interface PublishGateResult {
  canPublish: boolean;
  blockers: string[];
}

export function canPublishAssistant(
  profile: AssistantProfile,
  knowledgeFiles: KnowledgeFile[]
): PublishGateResult {
  const blockers: string[] = [];

  if (profile.status !== 'active') {
    blockers.push(`Profile must be 'active' before publishing (current: '${profile.status}')`);
  }

  if (knowledgeFiles.length === 0) {
    blockers.push('At least 1 knowledge file must be attached before publishing');
  }

  return {
    canPublish: blockers.length === 0,
    blockers,
  };
}

// ---------------------------------------------------------------------------
// Safety Constants
// ---------------------------------------------------------------------------

export const ASSISTANT_CHAT_MAX_MESSAGES_PER_SESSION = 50;
export const ASSISTANT_CHAT_MAX_INPUT_LENGTH = 2000;

export const BLOCKED_KNOWLEDGE_FILE_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.msi', '.scr', '.pif',
  '.js', '.vbs', '.wsf', '.ps1', '.sh', '.bash',
  '.dll', '.sys', '.drv',
  '.html', '.htm', '.svg',
] as const;

export const UNSAFE_FILENAME_PATTERN = /[<>:"/\\|?*\x00-\x1f]|\.\.|\.\//;

export function isFilenameSafe(filename: string): boolean {
  if (!filename || filename.length === 0 || filename.length > 255) return false;
  if (UNSAFE_FILENAME_PATTERN.test(filename)) return false;

  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
  if ((BLOCKED_KNOWLEDGE_FILE_EXTENSIONS as readonly string[]).includes(ext)) return false;

  return true;
}
