import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleBossBattleView from '@/components/modules/CourseModuleBossBattleView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitBossBattleAction } from '../actions';

export default async function Module12BossBattlePage() {
  await enforceModuleGating('boss-battle', 12, getCourseModuleNodeCount(12));

  return (
    <CourseModuleBossBattleView
      moduleNum={12}
      submitBossBattleAction={submitBossBattleAction}
    />
  );
}
