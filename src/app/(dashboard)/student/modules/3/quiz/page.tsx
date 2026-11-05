import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleQuizView from '@/components/modules/CourseModuleQuizView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitQuizAction } from '../actions';

export default async function Module3QuizPage() {
  await enforceModuleGating('quiz', 3, getCourseModuleNodeCount(3));

  return (
    <CourseModuleQuizView
      moduleNum={3}
      submitQuizAction={submitQuizAction}
    />
  );
}
