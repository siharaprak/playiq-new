import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleBossBattleView from '@/components/modules/CourseModuleBossBattleView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitBossBattleAction } from '../actions';

export default async function Module10BossBattlePage() {
  await enforceModuleGating('boss-battle', 10, getCourseModuleNodeCount(10));

  return (
    <CourseModuleBossBattleView
      moduleNum={10}
      submitBossBattleAction={submitBossBattleAction}
    />
  );
}
