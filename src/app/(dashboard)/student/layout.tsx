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

  // The 3D Orion asset is still a draft (see public/character-assets/orion/asset-manifest.json).
  // ORION_3D_MODE: 'admin' (prod default) | 'all' (dev default / everyone) | 'off' (static avatar for everyone).
  const orion3dMode = process.env.ORION_3D_MODE ?? (process.env.NODE_ENV === 'development' ? 'all' : 'admin');
  const orion3d = orion3dMode === 'all' || (orion3dMode === 'admin' && isAdmin);

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
          orion3d={orion3d}
        />
      )}
    </>
  );
}

