import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleQuizView from '@/components/modules/CourseModuleQuizView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitQuizAction } from '../actions';

export default async function Module11QuizPage() {
  await enforceModuleGating('quiz', 11, getCourseModuleNodeCount(11));

  return (
    <CourseModuleQuizView
      moduleNum={11}
      submitQuizAction={submitQuizAction}
    />
  );
}
