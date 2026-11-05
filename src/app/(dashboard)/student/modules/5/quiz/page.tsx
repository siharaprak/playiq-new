import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleQuizView from '@/components/modules/CourseModuleQuizView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitQuizAction } from '../actions';

export default async function Module5QuizPage() {
  await enforceModuleGating('quiz', 5, getCourseModuleNodeCount(5));

  return (
    <CourseModuleQuizView
      moduleNum={5}
      submitQuizAction={submitQuizAction}
    />
  );
}
