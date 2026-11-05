import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleBossBattleView from '@/components/modules/CourseModuleBossBattleView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitBossBattleAction } from '../actions';

export default async function Module7BossBattlePage() {
  await enforceModuleGating('boss-battle', 7, getCourseModuleNodeCount(7));

  return (
    <CourseModuleBossBattleView
      moduleNum={7}
      submitBossBattleAction={submitBossBattleAction}
    />
  );
}
