import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleBossBattleView from '@/components/modules/CourseModuleBossBattleView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitBossBattleAction } from '../actions';

export default async function Module4BossBattlePage() {
  await enforceModuleGating('boss-battle', 4, getCourseModuleNodeCount(4));

  return (
    <CourseModuleBossBattleView
      moduleNum={4}
      submitBossBattleAction={submitBossBattleAction}
    />
  );
}
