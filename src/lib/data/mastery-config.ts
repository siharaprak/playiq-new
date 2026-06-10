/**
 * Sprint 3 — Mastery Engine Config Foundation
 *
 * Server-only data access layer for reading mastery config metadata
 * from courses and modules tables.
 *
 * Uses supabaseAdmin (service role) following the same pattern as
 * src/lib/data/discussions.ts.
 */

import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type {
  ModuleMasteryDefaults,
  CourseMasteryPlaceholders,
} from '@/lib/mastery/types';

// ---------------------------------------------------------------------------
// Module-level mastery defaults
// ---------------------------------------------------------------------------

/**
 * Reads the mastery_defaults from a module's metadata JSONB.
 * Returns null if no mastery_defaults have been set.
 */
export async function getModuleMasteryDefaults(
  moduleId: string
): Promise<ModuleMasteryDefaults | null> {
  const { data, error } = await supabaseAdmin
    .from('modules')
    .select('metadata')
    .eq('id', moduleId)
    .single();

  if (error || !data) return null;

  const metadata = data.metadata as Record<string, unknown> | null;
  if (!metadata?.mastery_defaults) return null;

  return metadata.mastery_defaults as ModuleMasteryDefaults;
}

/**
 * Lists all modules for a given course with their mastery defaults.
 * Useful for admin overview screens.
 */
export async function listModuleMasteryConfigs(courseId: string) {
  const { data, error } = await supabaseAdmin
    .from('modules')
    .select('id, title, order_num, metadata')
    .eq('course_id', courseId)
    .order('order_num', { ascending: true });

  if (error || !data) return [];

  return data.map((mod: any) => {
    const metadata = mod.metadata as Record<string, unknown> | null;
    return {
      id: mod.id as string,
      title: mod.title as string,
      order_num: mod.order_num as number,
      mastery_defaults: (metadata?.mastery_defaults as ModuleMasteryDefaults) ?? null,
    };
  });
}

// ---------------------------------------------------------------------------
// Course-level mastery placeholder summary
// ---------------------------------------------------------------------------

/**
 * Reads the mastery_placeholders from a course's metadata JSONB.
 * Returns null if no mastery_placeholders have been set.
 */
export async function getCourseMasteryPlaceholderSummary(
  courseId: string
): Promise<CourseMasteryPlaceholders | null> {
  const { data, error } = await supabaseAdmin
    .from('courses')
    .select('metadata')
    .eq('id', courseId)
    .single();

  if (error || !data) return null;

  const metadata = data.metadata as Record<string, unknown> | null;
  if (!metadata?.mastery_placeholders) return null;

  return metadata.mastery_placeholders as CourseMasteryPlaceholders;
}
