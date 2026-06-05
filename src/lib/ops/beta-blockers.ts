import 'server-only';

export interface BetaBlocker {
  id: string;
  category:
    | 'critical_security'
    | 'build_release'
    | 'student_journey'
    | 'admin_ops'
    | 'data_integrity'
    | 'parent_visibility'
    | 'ai_safety'
    | 'storage_access'
    | 'payment_enrollment'
    | 'support_process';
  title: string;
  description: string;
  severity: 'blocker' | 'warning' | 'info';
  status: 'open' | 'in_progress' | 'fixed' | 'verified' | 'deferred' | 'blocked';
}

export const BETA_BLOCKERS: BetaBlocker[] = [
  {
    id: 'SEC-01',
    category: 'critical_security',
    title: 'Admin RBAC Routing Enforcement',
    description: 'Ensure student/parent roles are strictly blocked from /admin pages and server actions.',
    severity: 'blocker',
    status: 'verified',
  },
  {
    id: 'SEC-02',
    category: 'critical_security',
    title: 'Service Role Key Protection',
    description: 'Service role key must not be imported in client components.',
    severity: 'blocker',
    status: 'verified',
  },
  {
    id: 'BLD-01',
    category: 'build_release',
    title: 'Strict Type Compilation',
    description: 'Next.js build and TypeScript type-check must compile cleanly.',
    severity: 'blocker',
    status: 'verified',
  },
  {
    id: 'STU-01',
    category: 'student_journey',
    title: '14-step Student Journey Map',
    description: 'Map and verify the E2E user steps from account creation to assistant launch.',
    severity: 'blocker',
    status: 'verified',
  },
  {
    id: 'ADM-01',
    category: 'admin_ops',
    title: 'Admin Support Resolved Schema Drift',
    description: 'Avoid crashes during ticket resolution when resolved_at or metadata columns are missing.',
    severity: 'blocker',
    status: 'verified',
  },
  {
    id: 'ADM-02',
    category: 'admin_ops',
    title: 'Support Issues Migration Reproducibility',
    description: 'Ensure database migrations align with DB column schema and resolved_at/metadata exist.',
    severity: 'blocker',
    status: 'verified',
  },
  {
    id: 'DAT-01',
    category: 'data_integrity',
    title: 'Curriculum Constants and DB Module Parity',
    description: 'Verify static constants matches runtime curriculum module and DB IDs.',
    severity: 'blocker',
    status: 'verified',
  },
  {
    id: 'PAR-01',
    category: 'parent_visibility',
    title: 'Parent Content Redaction',
    description: 'Enforce parent count-only views (no raw instructions or signed URLs exposed).',
    severity: 'blocker',
    status: 'verified',
  },
  {
    id: 'SAF-01',
    category: 'ai_safety',
    title: 'Assistant Sandbox Rate Limiting',
    description: 'Enforce hourly and 10-minute rate limits before Gemini inference. Fail closed.',
    severity: 'blocker',
    status: 'verified',
  },
  {
    id: 'SAF-02',
    category: 'ai_safety',
    title: 'Discussion Moderation Filters',
    description: 'Verify automated filtering, reporting, and moderation of offensive content in discussion board.',
    severity: 'blocker',
    status: 'verified',
  },
  {
    id: 'STR-01',
    category: 'storage_access',
    title: 'Proof Upload Storage Boundaries',
    description: 'Verify private bucket permissions and storage path validation rules.',
    severity: 'blocker',
    status: 'verified',
  },
  {
    id: 'ENR-01',
    category: 'payment_enrollment',
    title: 'Duplicate Enrollment Prevention',
    description: 'Enforce database-level unique constraints and manual check flow to prevent duplicate student course enrollments.',
    severity: 'blocker',
    status: 'verified',
  },
];
