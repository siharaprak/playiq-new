// =============================================================================
// Sprint 7: Tutor Build — Domain Types
// =============================================================================

// ---------------------------------------------------------------------------
// Doctrine Config — the "personality" knobs for a tutor
// ---------------------------------------------------------------------------
export interface TutorDoctrineConfig {
  purpose: string;
  teaching_style: string;
  explanation_preferences: string;
  subject_focus: string;
}

// ---------------------------------------------------------------------------
// Instructions — the system prompt & rules the tutor follows
// ---------------------------------------------------------------------------
export interface TutorInstructions {
  instruction_set: string;
  rules: string[];
}

// ---------------------------------------------------------------------------
// Fingerprint Snapshot — captured learner profile at time of tutor creation
// ---------------------------------------------------------------------------
export interface TutorFingerprintSnapshot {
  learning_style?: string;
  strengths?: string[];
  struggles?: string[];
  captured_at?: string;
}

// ---------------------------------------------------------------------------
// Tutor Profile — the root entity (one per student per course)
// ---------------------------------------------------------------------------
export interface TutorProfile {
  id: string;
  student_id: string;
  course_id: string | null;
  name: string;
  status: 'draft' | 'active' | 'published';
  current_version_id: string | null;
  fingerprint_snapshot: TutorFingerprintSnapshot;
  doctrine_config: TutorDoctrineConfig;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Tutor Version — immutable snapshot of instructions + knowledge
// ---------------------------------------------------------------------------
export interface TutorVersion {
  id: string;
  tutor_profile_id: string;
  version_number: number;
  instructions: TutorInstructions;
  knowledge_file_ids: string[];
  change_summary: string | null;
  created_by: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Knowledge File — uploaded reference material linked to a tutor
// ---------------------------------------------------------------------------
export interface KnowledgeFile {
  id: string;
  student_id: string;
  tutor_profile_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Input Shapes — used by forms / server actions
// ---------------------------------------------------------------------------
export interface TutorProfileInput {
  name: string;
  doctrine_config: TutorDoctrineConfig;
  fingerprint_snapshot?: TutorFingerprintSnapshot;
}

export interface TutorVersionInput {
  instructions: TutorInstructions;
  knowledge_file_ids: string[];
  change_summary: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
export const TEACHING_STYLES = [
  'Socratic',
  'Direct Instruction',
  'Encouraging Coach',
  'Explain-by-Example',
  'Challenge-Based',
] as const;

export const DEFAULT_DOCTRINE_CONFIG: TutorDoctrineConfig = {
  purpose: '',
  teaching_style: '',
  explanation_preferences: '',
  subject_focus: '',
};

export const DEFAULT_INSTRUCTIONS: TutorInstructions = {
  instruction_set: '',
  rules: [],
};
