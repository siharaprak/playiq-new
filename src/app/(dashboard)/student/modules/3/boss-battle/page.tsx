import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleBossBattleView from '@/components/modules/CourseModuleBossBattleView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitBossBattleAction } from '../actions';

export default async function Module3BossBattlePage() {
  await enforceModuleGating('boss-battle', 3, getCourseModuleNodeCount(3));

  return (
    <CourseModuleBossBattleView
      moduleNum={3}
      submitBossBattleAction={submitBossBattleAction}
    />
  );
}
