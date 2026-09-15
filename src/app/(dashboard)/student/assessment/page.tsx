import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import OrionAssessment from '@/components/assessment/OrionAssessment';

export const dynamic = 'force-dynamic';

export default async function AssessmentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Check if student already completed assessment
  const { data: profile } = await supabase
    .from('student_assessment_profiles')
    .select('*')
    .eq('student_id', user.id)
    .maybeSingle();

  if (profile?.assessment_completed) {
    redirect('/student/home');
  }

  // Get student name from profiles table
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('full_name, username')
    .eq('id', user.id)
    .single();

  const studentName = userProfile?.username || userProfile?.full_name || 'Apprentice';
  const initialPhase = profile?.current_phase || 1;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12"
      style={{
        backgroundColor: 'var(--space-deep)',
      }}
    >
      <div className="w-full max-w-2xl pt-2 sm:pt-4">
        <OrionAssessment
          initialPhase={initialPhase}
          existingProfile={profile}
          studentName={studentName}
        />
      </div>
    </div>
  );
}

