import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import CourseModuleQuizView from '@/components/modules/CourseModuleQuizView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';
import { submitQuizAction } from '../actions';

export default async function Module12QuizPage() {
  await enforceModuleGating('quiz', 12, getCourseModuleNodeCount(12));

  return (
    <CourseModuleQuizView
      moduleNum={12}
      submitQuizAction={submitQuizAction}
    />
  );
}
