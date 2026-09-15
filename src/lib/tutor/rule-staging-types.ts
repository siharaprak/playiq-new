// src/lib/tutor/rule-staging-types.ts

export interface StagedRules {
  // Module 0
  rescueTarget?: string;
  advanceTarget?: string;
  personalGoal?: string;
  explanationStyle?: string; // 'verbal' | 'analytical' | 'visual'
  pacingPreference?: string; // 'sequential' | 'top_down'
  
  // Module 1 (Rule 1: Explanation Opening)
  rule1_explanationStart?: 'analogy-first' | 'step-by-step' | 'big-picture-map';
  
  // Module 2 (Rule 2: Focus Sprints & Voice Preservation)
  rule2_sessionLength?: '15_minutes' | '25_minutes';
  rule2_voicePreservation?: 'strict' | 'standard';
  
  // Module 3 (Rule 3: Pre-Learn Sequence)
  rule3_preLearnSequence?: 'map-first' | 'example-first' | 'question-first';
  
  // Module 4 (Rule 4: Lesson Rescue Diagnostic)
  rule4_rescueDiagnostic?: 'word' | 'background' | 'step' | 'connection';
  
  // Module 5 (Rule 5: Compression Format)
  rule5_compressionFormat?: '3-ways-rule' | 'understanding-card';
  
  // Module 6 (Rule 6: Mistake Bank Tracking)
  rule6_mistakeBankTracking?: 'one-at-a-time' | 'mistake-categories';
  
  // Module 7 (Rule 7: 8-Part Study Pack)
  rule7_studyPackFormat?: '8-part-pack';
  
  // Module 8 (Rule 8: Writing & Socratic Boundaries)
  rule8_writingCoachingBoundaries?: 'cer-socratic-only';
}

export const DEFAULT_STAGED_RULES: StagedRules = {
  rescueTarget: 'Mathematics',
  advanceTarget: 'Computer Science',
  personalGoal: 'Master problem-solving and learn 2x faster',
  explanationStyle: 'analytical',
  pacingPreference: 'top_down',
  rule1_explanationStart: 'analogy-first',
  rule2_sessionLength: '15_minutes',
  rule2_voicePreservation: 'strict',
  rule3_preLearnSequence: 'map-first',
  rule4_rescueDiagnostic: 'step',
  rule5_compressionFormat: '3-ways-rule',
  rule6_mistakeBankTracking: 'mistake-categories',
  rule7_studyPackFormat: '8-part-pack',
  rule8_writingCoachingBoundaries: 'cer-socratic-only',
};
