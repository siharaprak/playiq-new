import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleQuizView from '@/components/modules/CourseModuleQuizView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitQuizAction } from '../actions';

export default async function Module10QuizPage() {
  await enforceModuleGating('quiz', 10, getCourseModuleNodeCount(10));

  return (
    <CourseModuleQuizView
      moduleNum={10}
      submitQuizAction={submitQuizAction}
    />
  );
}
