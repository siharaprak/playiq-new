import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleBossBattleView from '@/components/modules/CourseModuleBossBattleView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitBossBattleAction } from '../actions';

export default async function Module6BossBattlePage() {
  await enforceModuleGating('boss-battle', 6, getCourseModuleNodeCount(6));

  return (
    <CourseModuleBossBattleView
      moduleNum={6}
      submitBossBattleAction={submitBossBattleAction}
    />
  );
}
