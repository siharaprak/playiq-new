import React from 'react';
import { GuidedAIPanel } from "@/components/guided-ai/GuidedAIPanel";
import { createClient } from '@/utils/supabase/server';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let hasProgress = true;
  let name = 'Student';
  let userId = '';

  if (user) {
    userId = user.id;
    const { data: allProgress } = await supabase
      .from('student_node_progress')
      .select('module_id')
      .eq('student_id', user.id)
      .eq('node_mastered', true);
    
    hasProgress = !!(allProgress && allProgress.length > 0);

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, username')
      .eq('id', user.id)
      .single();

    name = profile?.username || profile?.full_name || 'Student';
  }

  return (
    <>
      {children}
      <GuidedAIPanel 
        isFloating={true} 
        hasProgress={hasProgress}
        studentName={name}
        studentId={userId}
      />
    </>
  );
}
