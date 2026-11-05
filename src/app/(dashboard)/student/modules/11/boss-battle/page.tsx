import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleBossBattleView from '@/components/modules/CourseModuleBossBattleView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitBossBattleAction } from '../actions';

export default async function Module11BossBattlePage() {
  await enforceModuleGating('boss-battle', 11, getCourseModuleNodeCount(11));

  return (
    <CourseModuleBossBattleView
      moduleNum={11}
      submitBossBattleAction={submitBossBattleAction}
    />
  );
}
