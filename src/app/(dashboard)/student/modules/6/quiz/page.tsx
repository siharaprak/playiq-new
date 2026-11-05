import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleQuizView from '@/components/modules/CourseModuleQuizView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitQuizAction } from '../actions';

export default async function Module6QuizPage() {
  await enforceModuleGating('quiz', 6, getCourseModuleNodeCount(6));

  return (
    <CourseModuleQuizView
      moduleNum={6}
      submitQuizAction={submitQuizAction}
    />
  );
}
