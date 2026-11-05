import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleQuizView from '@/components/modules/CourseModuleQuizView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitQuizAction } from '../actions';

export default async function Module7QuizPage() {
  await enforceModuleGating('quiz', 7, getCourseModuleNodeCount(7));

  return (
    <CourseModuleQuizView
      moduleNum={7}
      submitQuizAction={submitQuizAction}
    />
  );
}
