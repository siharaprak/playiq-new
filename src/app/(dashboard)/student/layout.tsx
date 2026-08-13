import React from 'react';
import { GuidedAIPanel } from "@/components/guided-ai/GuidedAIPanel";
import { createClient } from '@/utils/supabase/server';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let hasProgress = true;
  let name = 'Student';
  let userId = '';
  let assessmentCompleted = true; // default true to avoid blocking if table doesn't exist yet
  let isAdmin = false;

  if (user) {
    userId = user.id;

    // Check assessment completion
    const { data: assessmentProfile } = await supabase
      .from('student_assessment_profiles')
      .select('assessment_completed')
      .eq('student_id', user.id)
      .maybeSingle();

    assessmentCompleted = assessmentProfile?.assessment_completed ?? false;

    const { data: allProgress } = await supabase
      .from('student_node_progress')
      .select('module_id')
      .eq('student_id', user.id)
      .eq('node_mastered', true);
    
    hasProgress = !!(allProgress && allProgress.length > 0);

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, username, role')
      .eq('id', user.id)
      .single();

    name = profile?.username || profile?.full_name || 'Student';
    isAdmin = profile?.role === 'admin';
  }

  const showOrion = assessmentCompleted || isAdmin;

  return (
    <>
      {children}
      {/* Hide GuidedAI panel during assessment to keep experience focused, except for admins using the simulator */}
      {showOrion && (
        <GuidedAIPanel 
          isFloating={true} 
          hasProgress={hasProgress}
          studentName={name}
          studentId={userId}
        />
      )}
    </>
  );
}

