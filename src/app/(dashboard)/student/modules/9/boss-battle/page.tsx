import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleBossBattleView from '@/components/modules/CourseModuleBossBattleView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitBossBattleAction } from '../actions';

export default async function Module9BossBattlePage() {
  await enforceModuleGating('boss-battle', 9, getCourseModuleNodeCount(9));

  return (
    <CourseModuleBossBattleView
      moduleNum={9}
      submitBossBattleAction={submitBossBattleAction}
    />
  );
}
