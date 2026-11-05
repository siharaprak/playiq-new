import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleQuizView from '@/components/modules/CourseModuleQuizView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitQuizAction } from '../actions';

export default async function Module4QuizPage() {
  await enforceModuleGating('quiz', 4, getCourseModuleNodeCount(4));

  return (
    <CourseModuleQuizView
      moduleNum={4}
      submitQuizAction={submitQuizAction}
    />
  );
}
