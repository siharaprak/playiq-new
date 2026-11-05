import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleQuizView from '@/components/modules/CourseModuleQuizView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitQuizAction } from '../actions';

export default async function Module8QuizPage() {
  await enforceModuleGating('quiz', 8, getCourseModuleNodeCount(8));

  return (
    <CourseModuleQuizView
      moduleNum={8}
      submitQuizAction={submitQuizAction}
    />
  );
}
