import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleBossBattleView from '@/components/modules/CourseModuleBossBattleView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitBossBattleAction } from '../actions';

export default async function Module8BossBattlePage() {
  await enforceModuleGating('boss-battle', 8, getCourseModuleNodeCount(8));

  return (
    <CourseModuleBossBattleView
      moduleNum={8}
      submitBossBattleAction={submitBossBattleAction}
    />
  );
}
