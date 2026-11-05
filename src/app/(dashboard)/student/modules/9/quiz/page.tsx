import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleQuizView from '@/components/modules/CourseModuleQuizView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitQuizAction } from '../actions';

export default async function Module9QuizPage() {
  await enforceModuleGating('quiz', 9, getCourseModuleNodeCount(9));

  return (
    <CourseModuleQuizView
      moduleNum={9}
      submitQuizAction={submitQuizAction}
    />
  );
}
