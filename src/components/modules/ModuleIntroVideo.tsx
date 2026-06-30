import React from 'react';
import { Play } from 'lucide-react';

interface ModuleIntroVideoProps {
  src: string;
  title: string;
}

export default function ModuleIntroVideo({ src, title }: ModuleIntroVideoProps) {
  return (
    <div 
      className="mb-8 rounded-xl border p-6 relative overflow-hidden backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,200,255,0.15)] group"
      style={{ 
        background: 'var(--space-card)', 
        borderColor: 'var(--glass-border)' 
      }}
    >
      {/* Decorative accent background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[var(--neon-purple)]/5 blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-[var(--neon-cyan)]/10"></div>
      
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <Play className="w-5 h-5 text-[var(--neon-cyan)]" />
        <h2 className="text-xl font-bold uppercase tracking-wider text-[var(--text-primary)]">
          Watch Intro Video: {title}
        </h2>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-black/40 aspect-video relative z-10">
        <video 
          src={src} 
          controls 
          className="w-full h-full object-contain" 
          controlsList="nodownload"
          playsInline
        >
          Your browser does not support the video element.
        </video>
      </div>
    </div>
  );
}
