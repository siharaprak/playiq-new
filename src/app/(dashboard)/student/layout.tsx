import React from 'react';
import { GuidedAIPanel } from "@/components/guided-ai/GuidedAIPanel";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <GuidedAIPanel isFloating={true} />
    </>
  );
}
