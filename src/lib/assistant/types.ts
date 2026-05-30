// =============================================================================
// Sprint 8: Assistant Build — Domain Types
// =============================================================================

// ---------------------------------------------------------------------------
// Persona Config — the "personality" knobs for an assistant
// ---------------------------------------------------------------------------
export interface AssistantPersonaConfig {
  purpose: string;
  user_target: string;
  boundaries: string;
}

// ---------------------------------------------------------------------------
// Tools Config — links to files & capabilities of the assistant
// ---------------------------------------------------------------------------
export interface AssistantToolsConfig {
  knowledge_file_ids: string[];
}

// ---------------------------------------------------------------------------
// Assistant Profile — the root entity (one per student per course)
// ---------------------------------------------------------------------------
export interface AssistantProfile {
  id: string;
  student_id: string;
  course_id: string | null;
  name: string;
  status: 'draft' | 'active' | 'published';
  current_version_id: string | null;
  persona_config: AssistantPersonaConfig;
  metadata: {
    test_log?: string[];
    [key: string]: unknown;
  };
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Assistant Version — snapshot of instructions + knowledge files
// ---------------------------------------------------------------------------
export interface AssistantVersion {
  id: string;
  assistant_profile_id: string;
  version_number: number;
  system_prompt: string;
  tools_config: AssistantToolsConfig;
  change_summary: string | null;
  created_by: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Knowledge File — uploaded reference material linked to an assistant
// ---------------------------------------------------------------------------
export interface KnowledgeFile {
  id: string;
  student_id: string;
  tutor_profile_id?: string | null;
  assistant_profile_id?: string | null;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Input Shapes — used by forms / server actions
// ---------------------------------------------------------------------------
export interface AssistantProfileInput {
  name: string;
  persona_config: AssistantPersonaConfig;
  metadata?: {
    test_log?: string[];
    [key: string]: unknown;
  };
}

export interface AssistantVersionInput {
  system_prompt: string;
  tools_config: AssistantToolsConfig;
  change_summary: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
export const DEFAULT_PERSONA_CONFIG: AssistantPersonaConfig = {
  purpose: '',
  user_target: '',
  boundaries: '',
};

export const DEFAULT_TOOLS_CONFIG: AssistantToolsConfig = {
  knowledge_file_ids: [],
};
