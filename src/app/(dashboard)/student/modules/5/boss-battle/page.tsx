import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleBossBattleView from '@/components/modules/CourseModuleBossBattleView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitBossBattleAction } from '../actions';

export default async function Module5BossBattlePage() {
  await enforceModuleGating('boss-battle', 5, getCourseModuleNodeCount(5));

  return (
    <CourseModuleBossBattleView
      moduleNum={5}
      submitBossBattleAction={submitBossBattleAction}
    />
  );
}
