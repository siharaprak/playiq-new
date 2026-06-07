import { EVENT_TAXONOMY, GA4_CLIENT_EVENTS, SERVER_EVENTS_LOG_TYPES } from '../src/lib/analytics/event-taxonomy';
import { ANALYTICS_POLICY, isSafeForClientTelemetry } from '../src/lib/analytics/analytics-policy';
import { LearningEventType } from '../src/lib/events/types';

function runAudit() {
  console.log('=== RUNNING ANALYTICS COVERAGE AUDIT ===');
  let failed = false;

  // 1. Check taxonomy exists and has items
  if (!EVENT_TAXONOMY || EVENT_TAXONOMY.length === 0) {
    console.error('❌ Error: Taxonomy map is empty or undefined.');
    failed = true;
  } else {
    console.log(`✅ Taxonomy exists: ${EVENT_TAXONOMY.length} events mapped.`);
  }

  // 2. Check all known baseline events exist in GA4 or Server Lists
  const allMappedNames = new Set(EVENT_TAXONOMY.map(t => t.eventName));
  
  GA4_CLIENT_EVENTS.forEach(e => {
    if (!allMappedNames.has(e)) {
      console.error(`❌ Error: GA4 baseline event "${e}" is not defined in the taxonomy mapping.`);
      failed = true;
    }
  });

  SERVER_EVENTS_LOG_TYPES.forEach(e => {
    if (!allMappedNames.has(e)) {
      console.error(`❌ Error: Server baseline event "${e}" is not defined in the taxonomy mapping.`);
      failed = true;
    }
  });

  // 3. Check for any PII or Prompt exposure in mapping metadata keys
  const forbiddenMetadataKeywords = [
    'email', 'name', 'phone', 'prompt', 'response', 'message', 'text', 'notes', 'payload', 'instruction', 'path', 'url'
  ];

  EVENT_TAXONOMY.forEach(mapping => {
    mapping.safeMetadataKeys.forEach(key => {
      const lowerKey = key.toLowerCase();
      const matchedKeyword = forbiddenMetadataKeywords.find(keyword => lowerKey.includes(keyword));
      if (matchedKeyword) {
        console.error(`❌ Error: Mapped event "${mapping.eventName}" has metadata key "${key}" containing forbidden keyword "${matchedKeyword}".`);
        failed = true;
      }
    });
  });

  // 4. Validate that all events mapped to events_log match the database LearningEventType enum
  EVENT_TAXONOMY.forEach(mapping => {
    if (mapping.destination === 'events_log' || mapping.destination === 'both') {
      const parseResult = LearningEventType.safeParse(mapping.eventName);
      if (!parseResult.success) {
        console.error(`❌ Error: Event "${mapping.eventName}" is mapped to events_log but does not exist in the DB event_type_enum.`);
        failed = true;
      }
    }
  });

  // 5. Verify GA4 client safety
  GA4_CLIENT_EVENTS.forEach(e => {
    if (!isSafeForClientTelemetry(e)) {
      console.error(`❌ Error: GA4 client event "${e}" is not marked client-safe in the analytics policy.`);
      failed = true;
    }
  });

  // 6. Verify policy rules on GA4
  if (ANALYTICS_POLICY.clientTracker !== 'Google Analytics 4') {
    console.error('❌ Error: Analytics policy tracker mismatches.');
    failed = true;
  }
  if (ANALYTICS_POLICY.serverTelemetryTable !== 'events_log') {
    console.error('❌ Error: Analytics policy telemetry table mismatches.');
    failed = true;
  }

  if (failed) {
    console.error('❌ Audit Failed: Fix the errors above.');
    process.exit(1);
  } else {
    console.log('✅ Audit Passed: Analytics taxonomy and coverage are safe and compliant.');
  }
}

runAudit();
