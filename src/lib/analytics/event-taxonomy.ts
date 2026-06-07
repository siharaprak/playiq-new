/**
 * Sprint 9A — Event Taxonomy
 *
 * Maps and documents the baseline analytics events.
 */

export const GA4_CLIENT_EVENTS = [
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
] as const;

export const SERVER_EVENTS_LOG_TYPES = [
  'lesson_started',
  'activity_completed',
  'assessment_submitted',
  'node_mastered',
  'module_completed',
  'proof_submitted',
  'proof_reviewed',
  'guided_ai_used',
  'guided_ai_refused',
  'guided_ai_effort_required',
  'guided_ai_hint_ladder_step',
  'guided_ai_quiz_practice_generated',
  'guided_ai_teachback_required',
  'lesson_rescue_used',
  'learn_your_way_updated',
  'unsafe_assistance_routed',
  'tutor_profile_created',
  'tutor_profile_updated',
  'tutor_version_created',
  'assistant_profile_created',
  'assistant_profile_updated',
  'assistant_version_created'
] as const;

export type GA4ClientEvent = typeof GA4_CLIENT_EVENTS[number];
export type ServerEventsLogType = typeof SERVER_EVENTS_LOG_TYPES[number];

export interface TaxonomyMapping {
  eventName: string;
  destination: 'GA4' | 'events_log' | 'both' | 'alert_only' | 'none';
  description: string;
  safeMetadataKeys: string[];
}

export const EVENT_TAXONOMY: TaxonomyMapping[] = [
  {
    eventName: 'page_view',
    destination: 'GA4',
    description: 'User navigated to a page. Tracks pathname only.',
    safeMetadataKeys: []
  },
  {
    eventName: 'signup_started',
    destination: 'GA4',
    description: 'User started the signup flow.',
    safeMetadataKeys: []
  },
  {
    eventName: 'signup_completed',
    destination: 'GA4',
    description: 'User registration completed successfully.',
    safeMetadataKeys: []
  },
  {
    eventName: 'login_completed',
    destination: 'GA4',
    description: 'User successfully logged in.',
    safeMetadataKeys: []
  },
  {
    eventName: 'dashboard_viewed',
    destination: 'GA4',
    description: 'User opened their parent, student, or admin dashboard.',
    safeMetadataKeys: []
  },
  {
    eventName: 'module_viewed',
    destination: 'GA4',
    description: 'Student or parent opened a module page.',
    safeMetadataKeys: ['moduleNumber']
  },
  {
    eventName: 'proof_upload_started',
    destination: 'GA4',
    description: 'Student opened the file selector for a proof upload.',
    safeMetadataKeys: ['moduleId']
  },
  {
    eventName: 'tutor_builder_opened',
    destination: 'GA4',
    description: 'Student entered the Tutor Builder interface.',
    safeMetadataKeys: []
  },
  {
    eventName: 'assistant_builder_opened',
    destination: 'GA4',
    description: 'Student entered the Assistant Builder interface.',
    safeMetadataKeys: []
  },
  {
    eventName: 'support_opened',
    destination: 'GA4',
    description: 'User opened the support issue ticketing form.',
    safeMetadataKeys: []
  },
  {
    eventName: 'lesson_started',
    destination: 'events_log',
    description: 'Student clicked into a node lesson view.',
    safeMetadataKeys: ['nodeId', 'moduleId']
  },
  {
    eventName: 'activity_completed',
    destination: 'events_log',
    description: 'Student successfully completed a node activity worksheet.',
    safeMetadataKeys: ['nodeId', 'moduleId']
  },
  {
    eventName: 'assessment_submitted',
    destination: 'events_log',
    description: 'Student submitted a mini-check, quiz, or boss battle.',
    safeMetadataKeys: ['nodeId', 'moduleId', 'assessmentType', 'passStatus']
  },
  {
    eventName: 'node_mastered',
    destination: 'events_log',
    description: 'A student unlocked mastery on a node.',
    safeMetadataKeys: ['nodeId', 'moduleId']
  },
  {
    eventName: 'module_completed',
    destination: 'events_log',
    description: 'A student completed all nodes in a module.',
    safeMetadataKeys: ['moduleId']
  },
  {
    eventName: 'proof_submitted',
    destination: 'events_log',
    description: 'A student submitted a proof of learning artifact.',
    safeMetadataKeys: ['moduleId', 'artifactType', 'mediaKind', 'fileSizeBytes']
  },
  {
    eventName: 'proof_reviewed',
    destination: 'events_log',
    description: 'Admin or teacher finalized reviews for a proof.',
    safeMetadataKeys: ['moduleId', 'status', 'reviewerId']
  },
  {
    eventName: 'guided_ai_used',
    destination: 'events_log',
    description: 'Student successfully received guided AI hints/explanations.',
    safeMetadataKeys: ['mode', 'nodeId', 'moduleId', 'pageType']
  },
  {
    eventName: 'guided_ai_refused',
    destination: 'events_log',
    description: 'AI model refused to answer to prevent cheating/academic dishonesty.',
    safeMetadataKeys: ['mode', 'nodeId', 'moduleId', 'pageType', 'refusalReason']
  },
  {
    eventName: 'guided_ai_effort_required',
    destination: 'events_log',
    description: 'Model refused to release hints because student attempt was empty.',
    safeMetadataKeys: ['mode', 'nodeId', 'moduleId', 'pageType', 'effortRequired']
  },
  {
    eventName: 'guided_ai_hint_ladder_step',
    destination: 'events_log',
    description: 'Student navigated to a specific hint level step.',
    safeMetadataKeys: ['mode', 'nodeId', 'moduleId', 'hintLevel']
  },
  {
    eventName: 'guided_ai_quiz_practice_generated',
    destination: 'events_log',
    description: 'Practice questions generated for the student.',
    safeMetadataKeys: ['mode', 'nodeId', 'moduleId']
  },
  {
    eventName: 'guided_ai_teachback_required',
    destination: 'events_log',
    description: 'Active teach-back verification checkpoint triggered.',
    safeMetadataKeys: ['mode', 'nodeId', 'moduleId', 'teachBackRequired']
  },
  {
    eventName: 'lesson_rescue_used',
    destination: 'events_log',
    description: 'Student used Lesson Rescue to dissect confusion.',
    safeMetadataKeys: ['mode', 'nodeId', 'moduleId', 'confusionType']
  },
  {
    eventName: 'learn_your_way_updated',
    destination: 'events_log',
    description: 'Learning preferences updated by the student.',
    safeMetadataKeys: ['mode', 'explanation_style', 'pace_preference', 'support_preference']
  },
  {
    eventName: 'unsafe_assistance_routed',
    destination: 'events_log',
    description: 'Adversarial attempt routed to guard block.',
    safeMetadataKeys: ['mode', 'routingTarget']
  },
  {
    eventName: 'tutor_profile_created',
    destination: 'events_log',
    description: 'A student successfully instantiated a custom AI Tutor.',
    safeMetadataKeys: ['tutorId']
  },
  {
    eventName: 'tutor_profile_updated',
    destination: 'events_log',
    description: 'Student saved modifications to AI Tutor configurations.',
    safeMetadataKeys: ['tutorId', 'action']
  },
  {
    eventName: 'tutor_version_created',
    destination: 'events_log',
    description: 'A new immutable snapshot version was published for a tutor.',
    safeMetadataKeys: ['tutorId', 'versionNumber']
  },
  {
    eventName: 'assistant_profile_created',
    destination: 'events_log',
    description: 'A student instantiated a custom AI Assistant.',
    safeMetadataKeys: ['assistantId']
  },
  {
    eventName: 'assistant_profile_updated',
    destination: 'events_log',
    description: 'Student saved modifications to AI Assistant configurations.',
    safeMetadataKeys: ['assistantId', 'action']
  },
  {
    eventName: 'assistant_version_created',
    destination: 'events_log',
    description: 'A new version snapshot was published for an assistant.',
    safeMetadataKeys: ['assistantId', 'versionNumber']
  }
];
